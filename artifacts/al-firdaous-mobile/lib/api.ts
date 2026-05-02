import {
  AddReviewPayload,
  ApiProduct,
  ApiReview,
  Product,
  ProductStock,
  Review,
} from "@/types";
import {
  PRODUCTS,
  MOCK_REVIEWS,
  getNewArrivals,
  getOnSale,
  getRelated,
} from "@/constants/data";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");

// ── HTTP helpers ───────────────────────────────────────────

const HEADERS = {
  "Content-Type": "application/json",
  // Required to skip the ngrok browser-warning interstitial page
  "ngrok-skip-browser-warning": "true",
};

async function get<T>(path: string): Promise<T> {
  if (!BASE_URL) throw new Error("no-api");
  const res = await fetch(`${BASE_URL}${path}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  if (!BASE_URL) throw new Error("no-api");
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

// ── Normalisers ────────────────────────────────────────────

const DEFAULT_IMAGE = "https://res.cloudinary.com/de2wpriie/image/upload/y9DpT_eouhy5.jpg";

function normalizeProduct(raw: ApiProduct): Product {
  // Collect all 5 image slots, drop the default placeholder duplicates
  const allImages = [raw.image, raw.image1, raw.image2, raw.image3, raw.image4];
  const images = allImages.filter(
    (img) => img && img !== DEFAULT_IMAGE && img.trim() !== ""
  );
  const mainImage = images[0] ?? raw.image ?? DEFAULT_IMAGE;

  const stock: ProductStock[] = (raw.stock ?? []).map((s) => ({
    id: s.id,
    size: String(s.size),
    quantity: s.quantity,
    reserved: s.reserved ?? 0,
    availableQty: Math.max(0, s.quantity - (s.reserved ?? 0)),
  }));

  // Only show sizes that have available stock
  const sizes = stock.filter((s) => s.availableQty > 0).map((s) => s.size);

  return {
    id: String(raw.id),
    name: raw.name,
    category: raw.category,
    product_type: raw.product_type,
    ref: raw.ref,
    price: raw.price,
    promo: raw.promo,
    image: mainImage,
    images: images.length > 0 ? images : [mainImage],
    sizes,
    stock,
    description: "",
    brand: raw.category || raw.product_type,
    rating: 0,
    reviewCount: 0,
    isNew: raw.newest,
  };
}

function normalizeReview(raw: ApiReview): Review {
  return {
    id: String(raw.id),
    author: raw.name,
    email: raw.email ?? "",
    rating: raw.stars,
    comment: raw.review,
    date: typeof raw.date === "string" ? raw.date.slice(0, 10) : String(raw.date),
  };
}

// ── Filters ────────────────────────────────────────────────

export interface ProductFilters {
  category?: string;
  search?: string;
  sort?: "default" | "price_asc" | "price_desc" | "rating";
  promo?: boolean;
  is_new?: boolean;
}

function applyClientFilters(products: Product[], filters: ProductFilters): Product[] {
  let result = [...products];
  if (filters.promo) result = result.filter((p) => p.promo > 0);
  if (filters.is_new) result = result.filter((p) => p.isNew);
  if (filters.sort === "price_asc") result.sort((a, b) => a.price - b.price);
  if (filters.sort === "price_desc") result.sort((a, b) => b.price - a.price);
  if (filters.sort === "rating") result.sort((a, b) => b.rating - a.rating);
  return result;
}

// ── In-memory product cache to avoid redundant /all calls ──

let _allProductsCache: ApiProduct[] | null = null;
let _allProductsCachedAt = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getAllProductsRaw(): Promise<ApiProduct[]> {
  const now = Date.now();
  if (_allProductsCache && now - _allProductsCachedAt < CACHE_TTL) {
    return _allProductsCache;
  }
  const data = await get<ApiProduct[]>("/products/get/all");
  _allProductsCache = data;
  _allProductsCachedAt = now;
  return data;
}

// ── Products ───────────────────────────────────────────────

export async function fetchProducts(filters: ProductFilters = {}): Promise<Product[]> {
  if (!BASE_URL) return applyMockFilters(PRODUCTS, filters);
  try {
    let raw: ApiProduct[];

    if (filters.search && filters.search.trim().length > 0) {
      // Dedicated search endpoint
      raw = await get<ApiProduct[]>(
        `/product/search/get?search=${encodeURIComponent(filters.search.trim())}`
      );
    } else if (filters.category && filters.category !== "all") {
      // Filter by product_type on the server
      raw = await get<ApiProduct[]>(
        `/products/get?product_type=${encodeURIComponent(filters.category)}`
      );
    } else {
      // All products
      raw = await getAllProductsRaw();
    }

    return applyClientFilters(raw.map(normalizeProduct), filters);
  } catch (e) {
    console.warn("[api] fetchProducts failed, using mock data:", e);
    return applyMockFilters(PRODUCTS, filters);
  }
}

export async function fetchProduct(id: string): Promise<Product | null> {
  if (!BASE_URL) return PRODUCTS.find((p) => p.id === id) ?? null;
  try {
    // Try to find in the all-products cache first (avoids extra network call)
    const all = await getAllProductsRaw();
    const raw = all.find((p) => String(p.id) === id);
    return raw ? normalizeProduct(raw) : null;
  } catch (e) {
    console.warn("[api] fetchProduct failed, using mock data:", e);
    return PRODUCTS.find((p) => p.id === id) ?? null;
  }
}

export async function fetchNewArrivals(): Promise<Product[]> {
  if (!BASE_URL) return getNewArrivals();
  try {
    // newest=true query param — falls back to client filter if not supported
    let raw: ApiProduct[];
    try {
      raw = await get<ApiProduct[]>("/products/get?newest=true");
    } catch {
      raw = await getAllProductsRaw();
    }
    const products = raw.map(normalizeProduct).filter((p) => p.isNew);
    return products.length > 0 ? products : getNewArrivals();
  } catch (e) {
    console.warn("[api] fetchNewArrivals failed, using mock data:", e);
    return getNewArrivals();
  }
}

export async function fetchOnSale(): Promise<Product[]> {
  if (!BASE_URL) return getOnSale();
  try {
    const raw = await getAllProductsRaw();
    const products = raw.map(normalizeProduct).filter((p) => p.promo > 0);
    return products.length > 0 ? products : getOnSale();
  } catch (e) {
    console.warn("[api] fetchOnSale failed, using mock data:", e);
    return getOnSale();
  }
}

export async function fetchRelated(productId: string): Promise<Product[]> {
  if (!BASE_URL) {
    const p = PRODUCTS.find((x) => x.id === productId);
    return p ? getRelated(p) : [];
  }
  try {
    const all = await getAllProductsRaw();
    const product = all.find((p) => String(p.id) === productId);
    if (!product) return [];
    return all
      .filter((p) => p.product_type === product.product_type && String(p.id) !== productId)
      .slice(0, 6)
      .map(normalizeProduct);
  } catch (e) {
    console.warn("[api] fetchRelated failed, using mock data:", e);
    const p = PRODUCTS.find((x) => x.id === productId);
    return p ? getRelated(p) : [];
  }
}

// ── Reviews ────────────────────────────────────────────────

export async function fetchReviews(productId: string): Promise<Review[]> {
  if (!BASE_URL) return MOCK_REVIEWS;
  try {
    const raw = await get<ApiReview[]>(`/reviews/get?product_id=${productId}`);
    return raw.map(normalizeReview);
  } catch (e) {
    console.warn("[api] fetchReviews failed, using mock data:", e);
    return MOCK_REVIEWS;
  }
}

export async function submitReview(payload: AddReviewPayload): Promise<void> {
  await post<unknown>("/reviews/add/", payload);
}

// ── Orders ────────────────────────────────────────────────

export interface OrderStatus {
  order_id: string;
  status: boolean;
  is_paid: string;
  delivered: boolean;
  amount: number;
  currency: string;
  date: string;
}

export async function checkOrder(orderId: string): Promise<OrderStatus> {
  return get<OrderStatus>(`/orders/check?order_id=${encodeURIComponent(orderId)}`);
}

// ── Mock filter logic (fallback when no API) ───────────────

function applyMockFilters(products: Product[], filters: ProductFilters): Product[] {
  let result = [...products];
  if (filters.category && filters.category !== "all") {
    result = result.filter((p) => p.product_type === filters.category);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }
  if (filters.promo) result = result.filter((p) => p.promo > 0);
  if (filters.is_new) result = result.filter((p) => p.isNew);
  if (filters.sort === "price_asc") result.sort((a, b) => a.price - b.price);
  if (filters.sort === "price_desc") result.sort((a, b) => b.price - a.price);
  if (filters.sort === "rating") result.sort((a, b) => b.rating - a.rating);
  return result;
}
