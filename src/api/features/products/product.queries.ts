import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { getProducts, type ProductsParams } from "./product.api";

export function useProductsQuery(params: () => ProductsParams = () => ({})) {
  return useQuery(() => ({
    queryKey: ["products", params()] as const,
    queryFn: () => getProducts(params()),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  }));
}
