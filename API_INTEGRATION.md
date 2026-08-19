# API Integration Documentation

This document maps frontend components and pages to their corresponding backend API endpoints.

## Auth (`/api/auth`)

| Frontend Function | Method | Endpoint | Auth |
|-------------------|--------|----------|------|
| `loginUser` | POST | `/api/auth/login` | No |
| `registerUser` | POST | `/api/auth/register` | No |
| `logoutUser` | POST | `/api/auth/logout` | Any role |
| `getMe` | GET | `/api/auth/me` | Any role |

## Public Gear (`/api/gear`)

| Frontend Function | Method | Endpoint | Auth |
|-------------------|--------|----------|------|
| `fetchGearList` | GET | `/api/gear` | No |
| `fetchGearById` | GET | `/api/gear/:id` | No |

## Categories (`/api/categories`)

| Frontend Function | Method | Endpoint | Auth |
|-------------------|--------|----------|------|
| `fetchCategories` | GET | `/api/categories` | No |

## Provider (`/api/provider`)

| Frontend Function | Method | Endpoint | Auth |
|-------------------|--------|----------|------|
| `createGear` | POST | `/api/provider/gear` | PROVIDER |
| `updateGear` | PUT | `/api/provider/gear/:id` | PROVIDER |
| `deleteGear` | DELETE | `/api/provider/gear/:id` | PROVIDER |
| `fetchProviderOrders` | GET | `/api/provider/orders` | PROVIDER |
| `updateOrderStatus` | PATCH | `/api/provider/orders/:id` | PROVIDER |

## Rentals (`/api/rentals`)

| Frontend Function | Method | Endpoint | Auth |
|-------------------|--------|----------|------|
| `createRental` | POST | `/api/rentals` | CUSTOMER |
| `fetchMyOrders` | GET | `/api/rentals` | CUSTOMER |
| `fetchOrderById` | GET | `/api/rentals/:id` | CUSTOMER |

## Payments (`/api/payments`)

| Frontend Function | Method | Endpoint | Auth |
|-------------------|--------|----------|------|
| `createPayment` | POST | `/api/payments` | CUSTOMER |
| `fetchMyPayments` | GET | `/api/payments` | CUSTOMER |
| `fetchPaymentById` | GET | `/api/payments/:id` | CUSTOMER |

## Reviews (`/api/reviews`)

| Frontend Function | Method | Endpoint | Auth |
|-------------------|--------|----------|------|
| `submitReview` | POST | `/api/reviews` | CUSTOMER |

## Admin (`/api/admin`)

| Frontend Function | Method | Endpoint | Auth |
|-------------------|--------|----------|------|
| `fetchAdminUsers` | GET | `/api/admin/users` | ADMIN |
| `updateUserStatus` | PATCH | `/api/admin/users/:id` | ADMIN |
| `fetchAdminGear` | GET | `/api/admin/gear` | ADMIN |
| `fetchAdminRentals` | GET | `/api/admin/rentals` | ADMIN |

---

## Component-to-Action Mapping

### Public Pages
| Page | Components | Actions Used |
|------|-----------|--------------|
| `/` (Home) | Hero, Features, Services, Testimonials, FAQ, CTA | None |
| `/gear` | GearClient, GearCard, GearFilters | `fetchGearList`, `fetchCategories` |
| `/gear/[id]` | GearDetailClient, RentForm | `fetchGearById`, `createRental` |
| `/payment/success` | PaymentSuccessPage | None (static) |
| `/payment/cancel` | PaymentCancelPage | None (static) |

### Authentication Pages
| Page | Components | Actions Used |
|------|-----------|--------------|
| `/login` | LoginForm | `loginUser` |
| `/register` | RegisterForm | `registerUser` |

### Customer Dashboard
| Page | Components | Actions Used |
|------|-----------|--------------|
| `/dashboard/customer` | StatsCards, RecentRentals, RecentPayments | `fetchMyOrders`, `fetchMyPayments` |
| `/dashboard/customer/orders` | CustomerOrdersClient, OrdersTable | `fetchMyOrders` |
| `/dashboard/customer/orders/[id]` | OrderDetailClient, OrderTimeline, PaymentCard, ReviewForm | `fetchOrderById`, `createPayment`, `submitReview` |
| `/dashboard/customer/payments` | PaymentsTable | `fetchMyPayments` |

### Provider Dashboard
| Page | Components | Actions Used |
|------|-----------|--------------|
| `/dashboard/provider` | StatsCards, GearList, OrdersList | `fetchProviderOrders` |
| `/dashboard/provider/gear` | ProviderGearClient, GearTable | `fetchProviderOrders` |
| `/dashboard/provider/gear/new` | AddGearForm | `createGear`, `fetchCategories` |
| `/dashboard/provider/gear/[id]` | EditGearForm | `updateGear`, `fetchCategories` |
| `/dashboard/provider/orders` | ProviderOrdersClient, OrdersTable | `fetchProviderOrders`, `updateOrderStatus` |

### Admin Dashboard
| Page | Components | Actions Used |
|------|-----------|--------------|
| `/dashboard/admin` | StatsCards, RecentUsers, RecentRentals | `fetchAdminUsers`, `fetchAdminRentals` |
| `/dashboard/admin/users` | AdminUsersClient, UsersTable | `fetchAdminUsers`, `updateUserStatus` |
| `/dashboard/admin/gear` | GearTable | `fetchAdminGear` |
| `/dashboard/admin/rentals` | RentalsTable | `fetchAdminRentals` |

---

## API Client Configuration

- **Base URL**: `https://gearup-sooty-one.vercel.app/api` (default) or `NEXT_PUBLIC_API_URL` env var
- **Client-side routing**: Browser requests are proxied through local Next.js route handlers (`/api/*`) to avoid CORS
- **Server-side routing**: Server Components call the backend directly
- **Auth**: JWT token stored in HTTP-only cookie (`accessToken`)
- **Response shape**: `{ success: boolean, statusCode: number, message: string, data: T }`
