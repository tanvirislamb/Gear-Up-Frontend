export interface Category {
  id: string;
  name: string;
  description?: string | null;
}

export interface Provider {
  id: string;
  name: string;
  email: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
}

export interface Review {
  id?: string;
  rating: number;
  comment?: string | null;
  customerId?: string;
  customer?: Customer;
  createdAt?: string;
}

export interface GearItem {
  id: string;
  name: string;
  description: string;
  brand: string;
  image?: string | null;
  rentalPrice: number;
  stock: number;
  availableQty: number;
  providerId: string;
  categoryId: string;
  createdAt?: string;
  updatedAt?: string;
  catagory?: Category;
  category?: Category;
  provider?: Provider;
  reviews?: Review[];
  rating?: number;
}

export interface GearQueryFilters {
  search?: string;
  catagory?: string;
  price?: string;
  brand?: string;
  page?: string;
  limit?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GearApiResponse {
  success?: boolean;
  message?: string;
  data: GearItem[] | { meta: PaginatedMeta; data: GearItem[] };
  meta?: PaginatedMeta;
}

export type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type RentalStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PAID"
  | "PICKED_UP"
  | "RETURNED"
  | "CANCELLED";

export interface RentalOrder {
  id: string;
  customerId: string;
  gearItemId: string;
  quantity: number;
  status: RentalStatus;
  startDate: string;
  endDate: string;
  totalAmount: number;
  customer?: { name: string; email: string } | null;
  gearItem?: GearItem | null;
}

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface Payment {
  id: string;
  customerId: string;
  rentalOrderId: string;
  transactionId?: string | null;
  amount: number;
  method: "STRIPE" | "SSLCOMMERZ";
  status: PaymentStatus;
  paidAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  rentalOrder?: RentalOrder | null;
}

export interface ApiEnvelope<T> {
  success?: boolean;
  message?: string;
  data: T;
}
