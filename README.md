# 🛍️ ThreadNova — Full-Stack E-Commerce Platform

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

> A production-grade, server-side rendered e-commerce platform built from scratch with a focus on performance, scalability, and a modern developer experience.

---

## ✨ Features

- 🛒 Full shopping experience: product listing, cart, checkout
- 🔍 Advanced search and filtering with real-time results
- 📊 Admin dashboard: manage products, users, orders
- ⭐ Customer reviews and ratings system
- 🔐 Authentication and session management
- 📱 Fully responsive, mobile-first UI

---

## 🏗️ Architecture

```
Next.js (SSR)
├── Frontend (React + TypeScript + Tailwind CSS)
│   ├── Product pages (SSR for SEO)
│   ├── Admin dashboard
│   └── Customer-facing storefront
└── Backend (Next.js API routes)
    ├── Prisma ORM → PostgreSQL
    ├── Auth middleware
    └── REST API endpoints
```

---

## 🗂️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router, SSR) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL |
| ORM | Prisma |
| State | React Context / Hooks |

---

## ⚡ Quick Start

### 1. Clone & install
```bash
git clone https://github.com/Saketh-0/Ecommerce-website-ThreadNova-.git
cd Ecommerce-website-ThreadNova-
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Add your DATABASE_URL and other config
```

### 3. Set up database
```bash
npx prisma migrate dev
npx prisma db seed
```

### 4. Run the dev server
```bash
npm run dev
# Open http://localhost:3000
```

---

## 📚 Key Learnings

- Server-side rendering strategies in Next.js for performance and SEO
- Type-safe database access with Prisma and PostgreSQL
- Building scalable admin systems with role-based access
- Full-stack TypeScript development patterns

---

*Part of my full-stack portfolio — [View more projects](https://github.com/Saketh-0)*
