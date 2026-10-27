import { useQuery } from "@tanstack/vue-query";
import { getAdminCategories } from "./category.api";

export function useAdminCategoriesQuery() {
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: getAdminCategories,
    staleTime: 5 * 60_000,
  });
}
