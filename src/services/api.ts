import {
  GearItem,
  Category,
  GearQueryFilters,
  PaginatedMeta,
  RentalOrder,
  Payment,
  User,
  UserStatus,
  ApiEnvelope,
} from "@/types/gear";

// Client components call local Next.js proxy routes (/api/...) to avoid CORS.
// Server components call the real backend directly (no CORS issue).
const EXTERNAL_API = process.env.NEXT_PUBLIC_API_URL || "https://gearup-sooty-one.vercel.app/api";

function getBase() {
  if (typeof window !== "undefined") {
    return "/api";
  }
  return EXTERNAL_API;
}

async function request<T>(
  path: string,
  init?: RequestInit,
  options?: { revalidate?: number }
): Promise<ApiEnvelope<T> | null> {
  try {
    const res = await fetch(`${getBase()}${path}`, {
      ...init,
      ...(options?.revalidate
        ? { next: { revalidate: options.revalidate } }
        : { cache: "no-store" }),
    });
    const json = await res.json();
    return json;
  } catch (error) {
    console.error(`API error ${path}:`, error);
    return null;
  }
}

function post<T>(path: string, body: unknown): Promise<ApiEnvelope<T> | null> {
  return request<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function fetchCategories(): Promise<Category[]> {
  const json = await request<Category[]>("/categories");
  return json?.data || [];
}

const CACHE_TTL = 5 * 60 * 1000;
const listCache = new Map<
  string,
  { value: { data: GearItem[]; meta: PaginatedMeta }; expiresAt: number }
>();

export async function fetchGearList(
  filters?: GearQueryFilters
): Promise<{ data: GearItem[]; meta: PaginatedMeta }> {
  const empty = { data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 1 } };
  try {
    const query = new URLSearchParams();
    if (filters?.search) query.set("search", filters.search);
    if (filters?.catagory) query.set("catagory", filters.catagory);
    if (filters?.price) query.set("price", filters.price);
    if (filters?.brand) query.set("brand", filters.brand);
    if (filters?.page) query.set("page", filters.page);
    if (filters?.limit) query.set("limit", filters.limit || "10");

    const qs = query.toString();
    const cacheKey = qs;

    const cached = listCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }

    const url = `${getBase()}/gear${qs ? `?${qs}` : ""}`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

    const json = await res.json();

    let result = empty;
    if (json.data) {
      if (Array.isArray(json.data)) {
        result = {
          data: json.data,
          meta: json.meta || { page: 1, limit: 10, total: json.data.length, totalPages: 1 },
        };
      } else if (json.data.data && Array.isArray(json.data.data)) {
        result = {
          data: json.data.data,
          meta: json.data.meta || { page: 1, limit: 10, total: json.data.data.length, totalPages: 1 },
        };
      }
    }

    for (const [key, entry] of listCache) {
      if (entry.expiresAt <= Date.now()) listCache.delete(key);
    }
    listCache.set(cacheKey, { value: result, expiresAt: Date.now() + CACHE_TTL });

    return result;
  } catch (error) {
    console.error("Error fetching gear list:", error);
    return empty;
  }
}

export async function fetchGearById(id: string): Promise<GearItem | null> {
  const json = await request<GearItem>(`/gear/${id}`, undefined, { revalidate: 300 });
  return json?.data || null;
}

// ---- Auth ----
export async function loginUser(body: { email: string; password: string }) {
  return post<User>("/auth/login", body);
}

export async function registerUser(body: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) {
  return post<User>("/auth/register", body);
}

export async function logoutUser() {
  return request<null>("/auth/logout", { method: "POST" });
}

// ---- Rentals ----
function toIsoDateTime(value: string): string {
  if (!value) return value;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00`).toISOString();
  }
  return value;
}

export async function createRental(body: {
  gearItemId: string;
  quantity: number;
  startDate: string;
  endDate: string;
}) {
  return post<RentalOrder>("/rentals", {
    ...body,
    startDate: toIsoDateTime(body.startDate),
    endDate: toIsoDateTime(body.endDate),
  });
}

export async function fetchMyOrders(): Promise<RentalOrder[]> {
  const json = await request<RentalOrder[]>("/rentals");
  return json?.data || [];
}

export async function fetchOrderById(id: string): Promise<RentalOrder | null> {
  const json = await request<RentalOrder>(`/rentals/${id}`);
  return json?.data || null;
}

// ---- Payments ----
export async function createPayment(rentalOrderId: string) {
  return post<{ sessionUrl?: string; sessionId?: string }>("/payments", {
    rentalOrderId,
    method: "STRIPE",
  });
}

export async function fetchMyPayments(): Promise<Payment[]> {
  const json = await request<Payment[]>("/payments");
  return json?.data || [];
}

export async function fetchPaymentById(id: string): Promise<Payment | null> {
  const json = await request<Payment>(`/payments/${id}`);
  return json?.data || null;
}

// ---- Reviews ----
export async function submitReview(body: {
  gearItemId: string;
  rating: number;
  comment?: string;
}) {
  return post<{ id: string }>("/reviews", body);
}

// ---- Provider ----
export async function fetchProviderOrders(): Promise<RentalOrder[]> {
  const json = await request<RentalOrder[]>("/provider/orders");
  return json?.data || [];
}

export async function updateOrderStatus(id: string, status: string) {
  return request<RentalOrder>(`/provider/orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

export async function createGear(body: {
  name: string;
  description: string;
  brand: string;
  image?: string | null;
  rentalPrice: number;
  stock: number;
  availableQty: number;
  categoryId: string;
}) {
  return post<GearItem>("/provider/gear", body);
}

export async function updateGear(
  id: string,
  body: {
    name: string;
    description: string;
    brand: string;
    image?: string | null;
    rentalPrice: number;
    stock: number;
    availableQty: number;
    categoryId: string;
  }
) {
  return request<GearItem>(`/provider/gear/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function deleteGear(id: string) {
  return request<null>(`/provider/gear/${id}`, { method: "DELETE" });
}

// ---- Admin ----
export async function fetchAdminUsers(): Promise<User[]> {
  const json = await request<User[]>("/admin/users");
  return json?.data || [];
}

export async function updateUserStatus(id: string, status: UserStatus) {
  return request<User>(`/admin/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

export async function fetchAdminGear(): Promise<GearItem[]> {
  const json = await request<GearItem[]>("/admin/gear");
  return json?.data || [];
}

export async function fetchAdminRentals(): Promise<RentalOrder[]> {
  const json = await request<RentalOrder[]>("/admin/rentals");
  return json?.data || [];
}
