import { GearItem, Category, GearQueryFilters, PaginatedMeta } from "@/types/gear";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const MOCK_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Cycling", description: "Bikes, helmets, and cycling gear" },
  { id: "cat-2", name: "Camping & Hiking", description: "Tents, backpacks, sleeping bags, and trail equipment" },
  { id: "cat-3", name: "Water Sports", description: "Kayaks, paddleboards, wetsuits, and life jackets" },
  { id: "cat-4", name: "Winter Sports", description: "Skis, snowboards, boots, and cold weather gear" },
  { id: "cat-5", name: "Fitness & Training", description: "Dumbbells, resistance bands, kettlebells, and mobility tools" },
  { id: "cat-6", name: "Climbing", description: "Harnesses, ropes, carabiners, and climbing shoes" },
];

export const MOCK_GEARS: GearItem[] = [
  {
    id: "gear-101",
    name: "Apex Expedition Carbon Mountain Bike",
    description: "Pro-grade full suspension carbon fiber mountain bike engineered for high-altitude trail descents and rugged terrain. Equipped with hydraulic disc brakes and 12-speed Shimano drivetrain.",
    brand: "Trek",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80",
    rentalPrice: 45,
    stock: 8,
    availableQty: 5,
    providerId: "prov-1",
    categoryId: "cat-1",
    catagory: MOCK_CATEGORIES[0],
    category: MOCK_CATEGORIES[0],
    provider: { id: "prov-1", name: "Summit Trails Rental Co.", email: "contact@summittrails.com" },
    rating: 4.9,
    reviews: [
      { id: "r-1", rating: 5, comment: "Hands down the smoothest mountain bike I've ever rented! Handled rocky descents effortlessly.", customer: { id: "c-1", name: "Alex Rivers", email: "alex@example.com" }, createdAt: "2026-07-15" },
      { id: "r-2", rating: 5, comment: "Gear was in brand new condition. Suspension was tuned perfectly.", customer: { id: "c-2", name: "Sarah Chen", email: "sarah@example.com" }, createdAt: "2026-07-20" }
    ]
  },
  {
    id: "gear-102",
    name: "Wilderness 4-Person All-Season Tent",
    description: "Ultra-durable, waterproof double-wall tent designed for 4-season alpine camping. Features dual vestibules, lightweight aluminum poles, and easy color-coded assembly.",
    brand: "The North Face",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80",
    rentalPrice: 32,
    stock: 12,
    availableQty: 9,
    providerId: "prov-2",
    categoryId: "cat-2",
    catagory: MOCK_CATEGORIES[1],
    category: MOCK_CATEGORIES[1],
    provider: { id: "prov-2", name: "Alpine Gear Rentals", email: "info@alpinegear.com" },
    rating: 4.8,
    reviews: [
      { id: "r-3", rating: 5, comment: "Stayed bone dry during heavy rainfall. Plenty of headroom for four adults.", customer: { id: "c-3", name: "David Miller", email: "david@example.com" }, createdAt: "2026-07-10" }
    ]
  },
  {
    id: "gear-103",
    name: "Ocean Explorer Inflatable Touring Kayak",
    description: "High-performance tandem inflatable kayak with drop-stitch technology for rigid hull stability. Includes two dual-blade paddles, high-pressure pump, and carrying bag.",
    brand: "Intex",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    rentalPrice: 55,
    stock: 5,
    availableQty: 2,
    providerId: "prov-1",
    categoryId: "cat-3",
    catagory: MOCK_CATEGORIES[2],
    category: MOCK_CATEGORIES[2],
    provider: { id: "prov-1", name: "Summit Trails Rental Co.", email: "contact@summittrails.com" },
    rating: 4.7,
    reviews: [
      { id: "r-4", rating: 4, comment: "Extremely stable on the water and super easy to transport in the trunk.", customer: { id: "c-4", name: "Emma Watson", email: "emma@example.com" }, createdAt: "2026-06-28" }
    ]
  },
  {
    id: "gear-104",
    name: "Vanguard Backcountry Powder Skis Set",
    description: "All-mountain powder skis paired with adjustable binding system and lightweight carbon trekking poles. Tailored for deep snow conditions and speed control.",
    brand: "Salomon",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=80",
    rentalPrice: 60,
    stock: 10,
    availableQty: 7,
    providerId: "prov-3",
    categoryId: "cat-4",
    catagory: MOCK_CATEGORIES[3],
    category: MOCK_CATEGORIES[3],
    provider: { id: "prov-3", name: "Peak Performers Outdoor", email: "rentals@peakperformers.com" },
    rating: 4.9,
    reviews: [
      { id: "r-5", rating: 5, comment: "Float effortlessly on deep powder! Best ski rental experience ever.", customer: { id: "c-5", name: "Michael Vance", email: "mvance@example.com" }, createdAt: "2026-07-02" }
    ]
  },
  {
    id: "gear-105",
    name: "Summit 65L Ergonomic Hiking Backpack",
    description: "Heavy-load technical backpack featuring internal alloy frame, adjustable torso length, hydration bladder sleeve, and integrated rain cover for multi-day expeditions.",
    brand: "Osprey",
    image: "https://images.unsplash.com/photo-1622260614153-03223fb72052?auto=format&fit=crop&w=1200&q=80",
    rentalPrice: 20,
    stock: 15,
    availableQty: 11,
    providerId: "prov-2",
    categoryId: "cat-2",
    catagory: MOCK_CATEGORIES[1],
    category: MOCK_CATEGORIES[1],
    provider: { id: "prov-2", name: "Alpine Gear Rentals", email: "info@alpinegear.com" },
    rating: 4.8,
    reviews: []
  },
  {
    id: "gear-106",
    name: "HydroStrike Stand-Up Paddleboard (SUP)",
    description: "10'6\" all-around inflatable paddleboard kit with non-slip EVA deck pad, leash, aluminum paddle, and dual-action pump. Perfect for calm lake or ocean coastal cruising.",
    brand: "BOTE",
    image: "https://images.unsplash.com/photo-1517176118179-6bd2474a60f2?auto=format&fit=crop&w=1200&q=80",
    rentalPrice: 38,
    stock: 6,
    availableQty: 4,
    providerId: "prov-1",
    categoryId: "cat-3",
    catagory: MOCK_CATEGORIES[2],
    category: MOCK_CATEGORIES[2],
    provider: { id: "prov-1", name: "Summit Trails Rental Co.", email: "contact@summittrails.com" },
    rating: 4.6,
    reviews: []
  },
  {
    id: "gear-107",
    name: "RockMaster Pro Harness & Carabiner Set",
    description: "UIAA certified climbing harness with breathable lumbar padding, 4 gear loops, quick-adjust buckles, and 3 locking screwgate carabiners.",
    brand: "Black Diamond",
    image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1200&q=80",
    rentalPrice: 25,
    stock: 20,
    availableQty: 18,
    providerId: "prov-3",
    categoryId: "cat-6",
    catagory: MOCK_CATEGORIES[5],
    category: MOCK_CATEGORIES[5],
    provider: { id: "prov-3", name: "Peak Performers Outdoor", email: "rentals@peakperformers.com" },
    rating: 5.0,
    reviews: [
      { id: "r-6", rating: 5, comment: "Top quality gear safety condition. Felt very secure on outdoor crags.", customer: { id: "c-6", name: "Liam Vance", email: "liam@example.com" }, createdAt: "2026-07-18" }
    ]
  },
  {
    id: "gear-108",
    name: "IronStrength Adjustable Dumbbell Pair (5-52.5 lbs)",
    description: "Rapid dial adjustment dumbbells replacing 15 sets of weights in a compact home fitness design. Heavy-duty molding around metal plates for smooth lift.",
    brand: "Bowflex",
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=80",
    rentalPrice: 18,
    stock: 10,
    availableQty: 0,
    providerId: "prov-2",
    categoryId: "cat-5",
    catagory: MOCK_CATEGORIES[4],
    category: MOCK_CATEGORIES[4],
    provider: { id: "prov-2", name: "Alpine Gear Rentals", email: "info@alpinegear.com" },
    rating: 4.5,
    reviews: []
  }
];

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      next: { revalidate: 60 }
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (error) {
    console.warn("Backend API unavailable, using fallback categories data", error);
  }
  return MOCK_CATEGORIES;
}

export async function fetchGearList(filters?: GearQueryFilters): Promise<{ data: GearItem[]; meta: PaginatedMeta }> {
  try {
    const query = new URLSearchParams();
    if (filters?.search) query.set("search", filters.search);
    if (filters?.catagory) query.set("catagory", filters.catagory);
    if (filters?.price) query.set("price", filters.price);
    if (filters?.brand) query.set("brand", filters.brand);
    if (filters?.page) query.set("page", filters.page);
    if (filters?.limit) query.set("limit", filters.limit || "12");

    const queryString = query.toString();
    const url = `${API_BASE_URL}/gear${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      cache: "no-store"
    });

    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        if (Array.isArray(json.data)) {
          if (json.data.length > 0) {
            return {
              data: json.data,
              meta: json.meta || { page: 1, limit: 12, total: json.data.length, totalPages: 1 }
            };
          }
        } else if (json.data.data && Array.isArray(json.data.data)) {
          return {
            data: json.data.data,
            meta: json.data.meta || { page: 1, limit: 12, total: json.data.data.length, totalPages: 1 }
          };
        }
      }
    }
  } catch (error) {
    console.warn("Backend API unavailable, filtering fallback gear data locally", error);
  }

  // Fallback client-side filtering logic
  let filtered = [...MOCK_GEARS];

  if (filters?.search) {
    const term = filters.search.toLowerCase();
    filtered = filtered.filter(
      (g) =>
        g.name.toLowerCase().includes(term) ||
        g.description.toLowerCase().includes(term) ||
        g.brand.toLowerCase().includes(term)
    );
  }

  if (filters?.catagory) {
    const catTerm = filters.catagory.toLowerCase();
    filtered = filtered.filter(
      (g) =>
        g.catagory?.name.toLowerCase() === catTerm ||
        g.category?.name.toLowerCase() === catTerm ||
        g.categoryId.toLowerCase() === catTerm
    );
  }

  if (filters?.brand) {
    filtered = filtered.filter((g) => g.brand.toLowerCase().includes(filters.brand!.toLowerCase()));
  }

  if (filters?.price) {
    const maxPrice = parseFloat(filters.price);
    if (!isNaN(maxPrice)) {
      filtered = filtered.filter((g) => g.rentalPrice <= maxPrice);
    }
  }

  const page = parseInt(filters?.page || "1", 10);
  const limit = parseInt(filters?.limit || "12", 10);
  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginatedData = filtered.slice(startIndex, startIndex + limit);

  return {
    data: paginatedData,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1
    }
  };
}

export async function fetchGearById(id: string): Promise<GearItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/gear/${id}`, {
      cache: "no-store"
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        return json.data;
      }
    }
  } catch (error) {
    console.warn(`Backend API failed for gear id ${id}, attempting fallback lookup`, error);
  }

  const found = MOCK_GEARS.find((g) => g.id === id);
  return found || null;
}
