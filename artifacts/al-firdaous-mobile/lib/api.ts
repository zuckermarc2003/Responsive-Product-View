import { Product, Review } from "@/types";
import {
  PRODUCTS,
  MOCK_REVIEWS,
  getNewArrivals,
  getOnSale,
  getRelated,
} from "@/constants/data";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");

async function get<T>(path: string): Promise<T> {
  if (!BASE_URL) throw new Error("no-api");
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  sort?: "default" | "price_asc" | "price_desc" | "rating";
  promo?: boolean;
  is_new?: boolean;
}

function buildQuery(filters: ProductFilters): string {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== "all") params.set("category", filters.category);
  if (filters.search) params.set("search", filters.search);
  if (filters.sort && filters.sort !== "default") params.set("sort", filters.sort);
  if (filters.promo) params.set("promo", "true");
  if (filters.is_new) params.set("is_new", "true");
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

// ── Products ──────────────────────────────────────────────

export async function fetchProducts(filters: ProductFilters = {}): Promise<Product[]> {
  if (!BASE_URL) return applyMockFilters(PRODUCTS, filters);
  try {
    return await get<Product[]>(`/api/products/${buildQuery(filters)}`);
  } catch {
    return applyMockFilters(PRODUCTS, filters);
  }
}

export async function fetchProduct(id: string): Promise<Product | null> {
  if (!BASE_URL) return PRODUCTS.find((p) => p.id === id) ?? null;
  try {
    return await get<Product>(`/api/products/${id}/`);
  } catch {
    return PRODUCTS.find((p) => p.id === id) ?? null;
  }
}

export async function fetchNewArrivals(): Promise<Product[]> {
  if (!BASE_URL) return getNewArrivals();
  try {
    return await get<Product[]>("/api/products/new-arrivals/");
  } catch {
    return getNewArrivals();
  }
}

export async function fetchOnSale(): Promise<Product[]> {
  if (!BASE_URL) return getOnSale();
  try {
    return await get<Product[]>("/api/products/on-sale/");
  } catch {
    return getOnSale();
  }
}

export async function fetchRelated(productId: string): Promise<Product[]> {
  if (!BASE_URL) {
    const p = PRODUCTS.find((x) => x.id === productId);
    return p ? getRelated(p) : [];
  }
  try {
    return await get<Product[]>(`/api/products/${productId}/related/`);
  } catch {
    const p = PRODUCTS.find((x) => x.id === productId);
    return p ? getRelated(p) : [];
  }
}

export async function fetchReviews(productId: string): Promise<Review[]> {
  if (!BASE_URL) return MOCK_REVIEWS;
  try {
    return await get<Review[]>(`/api/reviews/?product_id=${productId}`);
  } catch {
    return MOCK_REVIEWS;
  }
}

// ── Mock filter logic (when no API configured) ────────────

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
