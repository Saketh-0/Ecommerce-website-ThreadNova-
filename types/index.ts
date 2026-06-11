import { z } from 'zod';
import { insertProductSchema, cartItemSchema, shippingAddressSchema, paymentMethodSchema } from '@/lib/validators';

export type Product = z.infer<typeof insertProductSchema> & {
    id: string;
    rating: string;
    numReviews: number;
    createdAt: Date;
};

export type CartItem = z.infer<typeof cartItemSchema>;

export type Cart = {
    id: string;
    userId: string;
    items: CartItem[];
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
};

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export type OrderItem = CartItem & {
    orderId: string;
};

export type Order = {
    id: string;
    userId: string;
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    paymentResult?: { id: string; status: string; email_address: string; pricePaid: string };
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt: Date | null;
    isDelivered: boolean;
    deliveredAt: Date | null;
    createdAt: Date;
    orderItems: OrderItem[];
    user?: { name: string; email: string };
};