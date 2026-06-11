'use server';
import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";

// Get latest products
export async function getLatestProducts() {
    const data = await prisma.product.findMany({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy: { createdAt: 'desc' },
    });
    return convertToPlainObject(data);
}

// Get product by slug
export async function getProductBySlug(slug: string) {
    return await prisma.product.findFirst({
        where: { slug: slug },
    });
}

// Get all products with search, filter, and pagination
export async function getAllProducts({
    query,
    limit = PAGE_SIZE,
    page,
    category,
    price,
    rating,
    sort,
}: {
    query: string;
    limit?: number;
    page: number;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
}) {
    const queryFilter = query && query !== 'all'
        ? { name: { contains: query, mode: 'insensitive' as const } }
        : {};
    const categoryFilter = category && category !== 'all'
        ? { category }
        : {};
    const ratingFilter = rating && rating !== 'all'
        ? { rating: { gte: Number(rating) } }
        : {};
    
    const priceFilter = price && price !== 'all'
        ? {
            price: {
                gte: Number(price.split('-')[0]),
                lte: Number(price.split('-')[1]),
            },
        }
        : {};

    const orderBy = sort === 'lowest'
        ? { price: 'asc' as const }
        : sort === 'highest'
        ? { price: 'desc' as const }
        : sort === 'rating'
        ? { rating: 'desc' as const }
        : { createdAt: 'desc' as const };

    const data = await prisma.product.findMany({
        where: {
            ...queryFilter,
            ...categoryFilter,
            ...ratingFilter,
            ...priceFilter,
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
    });

    const dataCount = await prisma.product.count({
        where: {
            ...queryFilter,
            ...categoryFilter,
            ...ratingFilter,
            ...priceFilter,
        },
    });

    return {
        data: convertToPlainObject(data),
        totalPages: Math.ceil(dataCount / limit),
    };
}

// Get all categories
export async function getAllCategories() {
    const data = await prisma.product.findMany({
        select: { category: true },
        distinct: ['category'],
    });
    return data.map((item) => item.category);
}

// Get featured products
export async function getFeaturedProducts() {
    const data = await prisma.product.findMany({
        where: { isFeatured: true },
        orderBy: { createdAt: 'desc' },
        take: 4,
    });
    return convertToPlainObject(data);
}