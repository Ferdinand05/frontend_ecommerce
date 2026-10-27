import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { getAdminStockMovements } from "./stock-movement.api";
import type { AdminStockMovementsParams } from "./stock-movement.types";

export function useAdminStockMovementsQuery(params: () => AdminStockMovementsParams) {
  return useQuery(() => ({
    queryKey: ["admin", "stock-movements", params()] as const,
    queryFn: () => getAdminStockMovements(params()),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  }));
}
