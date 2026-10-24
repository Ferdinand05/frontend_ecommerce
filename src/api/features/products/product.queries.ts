import { useQuery } from "@tanstack/vue-query";
import { getProducts } from "./product.api";

export function useProductsQuery() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
}
