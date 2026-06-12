# ThreadNova — Premium E-Commerce Platform

ThreadNova is a state-of-the-art, feature-rich Next.js 15 e-commerce platform built as a portfolio-ready demonstration. It incorporates fluid interactive animations, a custom REST API catalog, structured customer & admin checkout workflows, secure cookie-based session management, and Stripe checkout simulation.

🚀 **Live Demo:** [ThreadNova E-Commerce Store](https://ecommerce-website-thread-nova.vercel.app)

---

## 🌟 Key Features

### 1. Modern & High-Performance UI/UX
- **GSAP Scroll Trigger Animations**: Elements slide and fade elegantly as you scroll down the page.
- **GSAP Hero Carousel**: Stunning entrance animations and text staggers on banner changes.
- **Dynamic Theme Selector**: Premium appearance toggle card with custom icon highlights and smooth indicator borders.
- **Glassmorphism Mobile Menu**: Frosted-glass mobile sidebar menu with quick navigation links and custom user-details card.

### 2. Full-Featured E-Commerce Engine
- **Search & Advanced Filtering**: Filter items by query search, category, price ranges, customer ratings, and sort sorting criteria.
- **Cart System**: Live persistent cart tracking quantity additions, subtractions, and calculations (shipping, tax, total).
- **Multi-Step Checkout**: Integrated address management and payment method selections.
- **Order Tracking**: Order details tracking delivery status, payment success verification, and transaction identifiers.
- **Admin Dashboard**: Comprehensive manager statistics (total sales, user counts, products count, recent orders list) and action tools to toggle paid/delivered indicators.

### 3. REST API Routes
- `GET /api/products`: Queries products with support for filter strings, sorting, and pagination parameters.
- `GET /api/products/[slug]`: Retrieves details of a specific product by its slug.

### 4. Robust Security & Encryption
- **Bcrypt Hashing**: User passwords are encrypted on sign-up using `bcryptjs` (salt factor 10) before saving in database.
- **JWT Authentication**: Secure sessions via digitally signed JSON Web Tokens stored in HTTP-Only, Lax, and Secure cookies.

### 5. Stripe Integration with Mock Fallback
- **Stripe Checkout**: Redirects customers to Stripe's hosted secure payment page.
- **Signature verification**: Stripe webhook handler constructs events safely with webhook secret signature checks.
- **Simulated Payment Mode**: Redirects to a simulated successful check-out if Stripe credentials are not configured in `.env`.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3 (App Router & React 19)
- **Styling**: Tailwind CSS & Framer/Shadcn UI
- **Database**: Neon Serverless Postgres (Prisma ORM)
- **Animations**: GSAP (GreenSock Animation Platform)
- **Token / Sessions**: JsonWebToken (JWT) & HTTP Cookies
- **Payments**: Stripe Checkout

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have Node.js installed on your machine.

### 2. Configure Environment Variables
Create a `.env` file in the root of the project:
```env
DATABASE_URL="your-postgresql-database-connection-string"
JWT_SECRET="your-jwt-signing-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional Stripe Integration (fallback to simulated checkout if missing)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Push Database Schema
```bash
npx prisma db push
```

### 5. Seed Database
Populate database with 14 premium fashion products and demo login credentials:
```bash
npx tsx db/seed.ts
```

### 6. Run Local Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the live store.

---

## 🔑 Demo Access

For quick testing, use these pre-seeded accounts:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@threadnova.com` | `admin123` |
| **Demo Customer** | `demo@threadnova.com` | `demo123` |

---

## 🐳 Running with Docker

You can containerize the app using Docker Desktop.

### Build and Run with Docker Compose
Run the following command in the root directory:
```bash
docker compose up --build -d
```
This will:
1. Build the multi-stage production Docker image.
2. Read your variables from the `.env` file automatically.
3. Expose the server on [http://localhost:3000](http://localhost:3000).

To stop the container:
```bash
docker compose down
```
