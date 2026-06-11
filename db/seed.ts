import { prisma } from "@/db/prisma";
import sampleData from "./sample-data";
import bcrypt from "bcryptjs";

async function main() {
    // Clear existing data
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.review.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    // Seed products
    await prisma.product.createMany({ data: sampleData.products });

    // Seed admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
        data: {
            name: "Admin",
            email: "admin@threadnova.com",
            password: hashedPassword,
            role: "admin",
        },
    });

    // Seed demo user
    const demoPassword = await bcrypt.hash("demo123", 10);
    await prisma.user.create({
        data: {
            name: "Demo User",
            email: "demo@threadnova.com",
            password: demoPassword,
            role: "user",
        },
    });

    console.log("Database seeded successfully");
    console.log("Admin: admin@threadnova.com / admin123");
    console.log("Demo: demo@threadnova.com / demo123");
}

main();