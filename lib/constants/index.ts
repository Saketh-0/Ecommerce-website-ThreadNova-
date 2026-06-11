export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "ThreadNova";
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || "E-commerce website built with Next.js";
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;
export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;

export const signInDefaultValues = {
    email: '',
    password: '',
};

export const signUpDefaultValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
};

export const shippingAddressDefaultValues = {
    fullName: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    country: '',
};

export const PAYMENT_METHODS = ['Cash On Delivery', 'UPI', 'Net Banking', 'Card'];
export const DEFAULT_PAYMENT_METHOD = 'Cash On Delivery';

export const USER_ROLES = ['admin', 'user'];

export const PRODUCT_CATEGORIES = [
    "Men's Dress Shirts",
    "Men's Sweatshirts",
    "Men's T-Shirts",
    "Men's Jeans",
    "Women's Dresses",
    "Women's Tops",
    "Accessories",
];