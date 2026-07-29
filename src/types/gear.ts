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
