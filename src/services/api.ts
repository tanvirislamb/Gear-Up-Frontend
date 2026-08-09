import { GearItem, Category, GearQueryFilters, PaginatedMeta } from "@/types/gear";

// Server components call the real backend directly (no CORS issue).
// Client components call local Next.js proxy routes (/api/...) to avoid CORS.
const EXTERNAL_API = process.env.NEXT_PUBLIC_API_URL || "https://gearup-sooty-one.vercel.app/api";

function getBase() {
  // In the browser (client component), call our own Next.js proxy routes.
  // On the server, call the external Vercel API directly.
  if (typeof window !== "undefined") {
    return "/api";
  }
  return EXTERNAL_API;
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${getBase()}/categories`, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

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
    const url = `${getBase()}/gear${qs ? `?${qs}` : ""}`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

    const json = await res.json();

    // Shape: { success, message, data: { meta: {...}, data: [...] } }
    if (json.data) {
      if (Array.isArray(json.data)) {
        return {
          data: json.data,
          meta: json.meta || { page: 1, limit: 10, total: json.data.length, totalPages: 1 },
        };
      } else if (json.data.data && Array.isArray(json.data.data)) {
        return {
          data: json.data.data,
          meta: json.data.meta || { page: 1, limit: 10, total: json.data.data.length, totalPages: 1 },
        };
      }
    }

    return empty;
  } catch (error) {
    console.error("Error fetching gear list:", error);
    return empty;
  }
}

export async function fetchGearById(id: string): Promise<GearItem | null> {
  try {
    const res = await fetch(`${getBase()}/gear/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error(`Error fetching gear ${id}:`, error);
    return null;
  }
}
