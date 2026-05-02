import { useQuery } from "@tanstack/react-query";
import {
  ProductFilters,
  fetchNewArrivals,
  fetchOnSale,
  fetchProduct,
  fetchProducts,
  fetchRelated,
  fetchReviews,
} from "@/lib/api";

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useNewArrivals() {
  return useQuery({
    queryKey: ["products", "new-arrivals"],
    queryFn: fetchNewArrivals,
    staleTime: 1000 * 60 * 5,
  });
}

export function useOnSale() {
  return useQuery({
    queryKey: ["products", "on-sale"],
    queryFn: fetchOnSale,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useRelated(productId: string) {
  return useQuery({
    queryKey: ["products", "related", productId],
    queryFn: () => fetchRelated(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useReviews(productId: string) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => fetchReviews(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
  });
}
