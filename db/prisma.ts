import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
export const prisma = { new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product: { price: number }) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product: { rating: number }) {
          return product.rating.toString();
        },
      },
    },
  },
})};
