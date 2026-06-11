'use server';

import { prisma } from '@/db/prisma';
import { getCurrentUser } from './user.actions';
import { convertToPlainObject } from '../utils';

// Create order from cart
export async function createOrder() {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: 'Please sign in', redirectTo: '/sign-in' };

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return { success: false, message: 'Cart is empty' };
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser?.address) {
      return { success: false, message: 'Please add shipping address', redirectTo: '/checkout' };
    }

    const address = dbUser.address as { fullName: string; streetAddress: string; city: string; postalCode: string; country: string };

    // Calculate prices
    const items = cart.items.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      slug: item.product.slug,
      qty: item.qty,
      image: item.product.images[0],
      price: Number(item.product.price),
    }));

    const itemsPrice = items.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const taxPrice = Math.round(0.18 * itemsPrice * 100) / 100;
    const totalPrice = Math.round((itemsPrice + shippingPrice + taxPrice) * 100) / 100;

    // Create order in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          shippingAddress: address,
          paymentMethod: 'Cash On Delivery',
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
          orderItems: {
            create: items.map((item) => ({
              productId: item.productId,
              qty: item.qty,
              price: item.price,
              name: item.name,
              slug: item.slug,
              image: item.image,
            })),
          },
        },
      });

      // Clear cart after order
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      // Update product stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.qty } },
        });
      }

      return newOrder;
    });

    return { success: true, message: 'Order placed successfully', orderId: order.id };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'An error occurred' };
  }
}

// Get order by ID
export async function getOrderById(orderId: string) {
  const data = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  });
  return convertToPlainObject(data);
}

// Get user orders
export async function getMyOrders({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
  const user = await getCurrentUser();
  if (!user) return { data: [], totalPages: 0 };

  const data = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
    include: { orderItems: true },
  });

  const dataCount = await prisma.order.count({
    where: { userId: user.id },
  });

  return {
    data: convertToPlainObject(data),
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Update shipping address
export async function updateShippingAddress(address: { fullName: string; streetAddress: string; city: string; postalCode: string; country: string }) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: 'Please sign in' };

    await prisma.user.update({
      where: { id: user.id },
      data: { address },
    });

    return { success: true, message: 'Address updated' };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'An error occurred' };
  }
}

// Get all orders (admin)
export async function getAllOrders({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
  const data = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  const dataCount = await prisma.order.count();

  return {
    data: convertToPlainObject(data),
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Mark order as paid
export async function markOrderAsPaid(orderId: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { isPaid: true, paidAt: new Date() },
    });
    return { success: true, message: 'Order marked as paid' };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'An error occurred' };
  }
}

// Mark order as delivered
export async function markOrderAsDelivered(orderId: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { isDelivered: true, deliveredAt: new Date() },
    });
    return { success: true, message: 'Order marked as delivered' };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'An error occurred' };
  }
}

// Get order summary (admin dashboard)
export async function getOrderSummary() {
  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count();

  const totalSalesResult = await prisma.order.aggregate({
    _sum: { totalPrice: true },
  });

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 6,
    include: {
      user: { select: { name: true } },
    },
  });

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales: totalSalesResult._sum.totalPrice || 0,
    recentOrders: convertToPlainObject(recentOrders),
  };
}
