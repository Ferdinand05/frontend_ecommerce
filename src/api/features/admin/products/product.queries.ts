import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { getAdminProductVariants, getAdminProducts } from "./product.api";
import type { AdminProductsParams } from "./product.types";

export function useAdminProductsQuery(params: () => AdminProductsParams) {
  return useQuery(() => ({
    queryKey: ["admin", "products", params()] as const,
    queryFn: () => getAdminProducts(params()),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  }));
}

export function useAdminProductVariantsQuery(productId: () => string | null) {
  return useQuery(() => ({
    queryKey: ["admin", "products", productId(), "variants"] as const,
    queryFn: () => getAdminProductVariants(productId() as string),
    enabled: !!productId(),
    staleTime: 30_000,
  }));
}