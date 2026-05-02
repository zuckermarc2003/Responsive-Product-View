import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ProductFilters,
  checkOrder,
  fetchNewArrivals,
  fetchOnSale,
  fetchProduct,
  fetchProducts,
  fetchRelated,
  fetchReviews,
  submitReview,
} from "@/lib/api";
import { AddReviewPayload } from "@/types";

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
    staleTime: 1000 * 60 * 2,
  });
}

export function useAddReview(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddReviewPayload) => submitReview(payload),
    onSuccess: () => {
      // Invalidate reviews cache so the new review appears immediately
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    },
  });
}

export function useOrderStatus(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => checkOrder(orderId),
    enabled: !!orderId,
    staleTime: 1000 * 30, // refresh every 30s for order status
    retry: 1,
  });
}
