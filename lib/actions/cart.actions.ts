'use server';

import { prisma } from '@/db/prisma';
import { getCurrentUser } from './user.actions';
import { convertToPlainObject, calcPrice } from '../utils';
import { cartItemSchema } from '../validators';
import { revalidatePath } from 'next/cache';

// Get user cart
export async function getMyCart() {
  const user = await getCurrentUser();
  if (!user) return undefined;

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart) return undefined;

  const items = cart.items.map((item) => ({
    productId: item.productId,
    name: item.product.name,
    slug: item.product.slug,
    qty: item.qty,
    image: item.product.images[0],
    price: Number(item.product.price),
  }));

  const prices = calcPrice(items);

  return convertToPlainObject({
    id: cart.id,
    userId: cart.userId,
    items,
    ...prices,
  });
}

// Add item to cart
export async function addItemToCart(data: { productId: string; name: string; slug: string; qty: number; image: string; price: number }) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: 'Please sign in to add items to cart' };

    const item = cartItemSchema.parse(data);

    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product) return { success: false, message: 'Product not found' };

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id },
        include: { items: true },
      });
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find((i) => i.productId === item.productId);

    if (existingItem) {
      // Check stock
      if (product.stock < existingItem.qty + 1) {
        return { success: false, message: 'Not enough stock' };
      }
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { qty: existingItem.qty + 1 },
      });
    } else {
      // Check stock
      if (product.stock < 1) {
        return { success: false, message: 'Not enough stock' };
      }
      // Add new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: item.productId,
          qty: 1,
        },
      });
    }

    revalidatePath(`/product/${item.slug}`);
    revalidatePath('/cart');

    return { success: true, message: `${item.name} added to cart` };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'An error occurred' };
  }
}

// Remove item from cart
export async function removeItemFromCart(productId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: 'Please sign in' };

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: true },
    });

    if (!cart) return { success: false, message: 'Cart not found' };

    const existingItem = cart.items.find((i) => i.productId === productId);
    if (!existingItem) return { success: false, message: 'Item not found' };

    if (existingItem.qty === 1) {
      await prisma.cartItem.delete({
        where: { id: existingItem.id },
      });
    } else {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { qty: existingItem.qty - 1 },
      });
    }

    revalidatePath('/cart');
    return { success: true, message: 'Item updated' };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'An error occurred' };
  }
}

// Clear cart
export async function clearCart() {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: 'Please sign in' };

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    revalidatePath('/cart');
    return { success: true, message: 'Cart cleared' };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'An error occurred' };
  }
}
