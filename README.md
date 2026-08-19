# 🏋️ GearUp — Rent Sports & Outdoor Gear Instantly

[![Live Demo](https://img.shields.io/badge/Live%20Demo-gearuptogo.vercel.app-brightgreen?style=for-the-badge&logo=vercel)](https://gearuptogo.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

**GearUp** is a modern, responsive, full-featured sports and outdoor equipment rental web application built with **Next.js (App Router)**, **React 19**, and **Tailwind CSS**. It connects sports enthusiasts with local gear providers, offering an intuitive rental experience with live availability, date selection, automated pricing calculations, Stripe payments, and dedicated dashboards for Customers, Providers, and Platform Admins.

🔗 **Live Deployment**: [https://gearuptogo.vercel.app/](https://gearuptogo.vercel.app/)

---

## 🌟 Key Features

### 🌐 Public & Discovery Experience
- **Hero & Featured Catalog**: Browse curated gear listings with high-resolution image optimization, pricing per day, categories, and real-time availability badges.
- **Advanced Search & Multi-Criteria Filtering**:
  - Full-text search by title/keywords.
  - Category filters (Cycling, Camping, Fitness, Water Sports, Hiking, etc.).
  - Price range slider / min-max inputs.
  - Brand filter selection.
  - Real-time instant UI updates with optimistic feedback.
- **Detailed Gear Page (`/gear/[id]`)**:
  - Comprehensive item specifications, brand details, and provider profile.
  - Dynamic **"Rent Now"** widget with interactive date pickers, preventing selection of past dates.
  - Automatic duration calculation and live total price breakdown (Daily Rate × Days × Quantity).
  - Verified customer reviews and star rating breakdown.
- **Robust UI Feedback**: Skeleton loaders for asynchronous data fetching, toast notifications for all user actions, and graceful error boundary fallbacks.

---

### 👤 Customer Experience
- **Authentication & Onboarding**: Seamless registration and login powered by JWT authentication and **Zod** schema validation.
- **Intuitive Booking & Checkout**:
  - Step-by-step rental confirmation with reservation dates and quantity selection.
  - Validation ensuring requested quantity is within available stock.
- **Secure Payment Gateway**:
  - Integrated with **Stripe Checkout** for instantaneous payment processing.
  - Dedicated outcome pages: `/payment/success` (confirmation & receipt) and `/payment/cancel` (retry payment).
- **Customer Dashboard (`/dashboard/customer`)**:
  - **Rental Tracking**: Overview of active rentals, pending payments, and completed returns.
  - **Order History Table**: Shows gear details, rental period, total amount, and color-coded status badges.
  - **Order Actions**: Direct **"Pay Now"** trigger for confirmed orders and **"Leave Review"** interactive modal for returned rentals.
  - **Payment History**: Detailed breakdown of transaction IDs, amounts, payment methods, and timestamps.

---

### 🏪 Provider Experience
- **Provider Dashboard (`/dashboard/provider`)**:
  - Quick analytics cards: Total Listed Gear, Active Rentals, and Pending Confirmations.
  - Inventory list with quick edit and delete options.
- **Gear Management (CRUD)**:
  - Add new listings with title, description, category, brand, rental price, stock count, and image URLs.
  - Edit existing gear specifications and adjust available inventory.
- **Incoming Orders Management (`/dashboard/provider/orders`)**:
  - Dedicated workflow table to process customer reservations in real-time.
  - Quick-action buttons to transition order lifecycle:
    - `PLACED` ➔ **Confirm** or **Cancel**
    - `PAID` ➔ **Mark Picked Up**
    - `PICKED_UP` ➔ **Mark Returned** (restores gear stock automatically)

---

### 🛡️ Admin Experience
- **Platform Analytics Dashboard (`/dashboard/admin`)**:
  - Platform-wide statistics: Total Registered Users, Active Listings, Total Platform Rentals, and Gross Volume.
- **User Management (`/dashboard/admin/users`)**:
  - Complete user directory with search and pagination.
  - Role badges (`CUSTOMER`, `PROVIDER`, `ADMIN`).
  - Account status controls with one-click **Suspend / Activate** actions.
- **Content Moderation (`/dashboard/admin/gear` & `/dashboard/admin/rentals`)**:
  - Platform-wide inspection of all gear listings with ability to remove policy-violating items.
  - Global overview of all rental transactions across all providers and customers.

---

## 🔒 Security & Route Protection (Middleware)

GearUp enforces strict role-based access control (RBAC) at the edge using **Next.js Middleware** (`middleware.ts`):
- **Role Scoping**:
  - `/dashboard/customer/*` ➔ Restricted to `CUSTOMER` role.
  - `/dashboard/provider/*` ➔ Restricted to `PROVIDER` role.
  - `/dashboard/admin/*` ➔ Restricted to `ADMIN` role.
- **Automatic Redirects**:
  - Authenticated users attempting to visit `/login` or `/register` are automatically redirected to their respective dashboard.
  - Unauthenticated users attempting to access protected routes are redirected to `/login` with a preserved `redirect` query parameter.

---

## 🔄 Rental Order Lifecycle

```text
       [ Customer Places Order ]
                  │
                  ▼
              ( PLACED )  ──────────► [ Provider: Cancel ] ──► ( CANCELLED )
                  │
        [ Provider: Confirm ]
                  │
                  ▼
             ( CONFIRMED )
                  │
        [ Customer: Pay Now (Stripe) ]
                  │
                  ▼
               ( PAID )
                  │
       [ Provider: Mark Picked Up ]
                  │
                  ▼
            ( PICKED_UP )
                  │
        [ Provider: Mark Returned ]
                  │
                  ▼
             ( RETURNED ) ──────────► [ Customer: Leave Review ⭐ ]
```

| Status | Badge Color | Description | Available Action |
|---|---|---|---|
| `PLACED` | 🟡 Yellow / Orange | Order submitted by customer | Provider: **Confirm** or **Cancel** |
| `CONFIRMED` | 🔵 Blue | Provider accepted the rental | Customer: **Pay Now** (Stripe) |
| `PAID` | 🟣 Purple | Payment verified successfully | Provider: **Mark Picked Up** |
| `PICKED_UP` | 🟢 Green | Gear handed over to customer | Provider: **Mark Returned** |
| `RETURNED` | ⚪ Gray | Gear returned & stock restored | Customer: **Leave Review** |
| `CANCELLED` | 🔴 Red | Order cancelled | Archived |

---

## 🗺️ Route Directory

| Route | Access Level | Description |
|---|---|---|
| `/` | Public | Landing page with hero banner, category showcase & featured gear |
| `/gear` | Public | Search and multi-criteria filterable gear catalog |
| `/gear/[id]` | Public | Detailed gear view, customer reviews & booking date picker |
| `/login` | Public (Guest only) | User login with role detection |
| `/register` | Public (Guest only) | Account registration with role selection (`Customer` / `Provider`) |
| `/checkout` | Authenticated | Order summary and checkout confirmation |
| `/payment/success` | Authenticated | Stripe checkout success confirmation |
| `/payment/cancel` | Authenticated | Stripe checkout cancellation & retry page |
| `/dashboard/customer` | Customer | Order history, active rentals & review submission |
| `/dashboard/customer/payments` | Customer | Transaction records and payment history |
| `/dashboard/customer/orders/[id]/pay` | Customer | Order payment checkout portal |
| `/dashboard/provider` | Provider | Provider dashboard overview & inventory management |
| `/dashboard/provider/gear/new` | Provider | Add new gear listing form |
| `/dashboard/provider/gear/[id]/edit` | Provider | Edit existing gear listing |
| `/dashboard/provider/orders` | Provider | Manage incoming rentals & update order statuses |
| `/dashboard/admin` | Admin | Platform overview & metrics |
| `/dashboard/admin/users` | Admin | User management table (Suspend / Activate accounts) |
| `/dashboard/admin/gear` | Admin | Platform-wide gear moderation |
| `/dashboard/admin/rentals` | Admin | Platform-wide rental orders moderation |

---

## 💻 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Validation**: [Zod](https://zod.dev/)
- **Payments**: Stripe Checkout Gateway
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js** >= 18.x
- **npm**, **yarn**, or **pnpm**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/tanvirislamb/Gear-Up-Frontend.git
   cd Gear-Up-Frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=https://gearup-sooty-one.vercel.app/api
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 📄 License

This project is developed for educational and demonstration purposes as part of the Assignment 5 Frontend milestone.
