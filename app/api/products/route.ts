import { NextResponse } from 'next/server';
import { prisma } from '@/db/prisma';
import { convertToPlainObject } from '@/lib/utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || '';
  const price = searchParams.get('price') || '';
  const rating = searchParams.get('rating') || '';
  const sort = searchParams.get('sort') || '';
  const limit = Number(searchParams.get('limit')) || 12;
  const page = Number(searchParams.get('page')) || 1;

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

  try {
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

    return NextResponse.json({
        success: true,
        data: convertToPlainObject(data),
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(dataCount / limit),
          totalItems: dataCount,
        }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
