import { useQuery } from "@tanstack/vue-query";
import { getCategories } from "./category.api";

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 300_000,
  });
}
