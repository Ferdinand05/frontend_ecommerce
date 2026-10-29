import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import {
  createStockMovement,
  getAdminStockMovements,
  type CreateStockMovementRequest,
} from "./stock-movement.api";
import type { AdminStockMovementsParams } from "./stock-movement.types";

export function useAdminStockMovementsQuery(params: () => AdminStockMovementsParams) {
  return useQuery(() => ({
    queryKey: ["admin", "stock-movements", params()] as const,
    queryFn: () => getAdminStockMovements(params()),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  }));
}

export function useCreateStockMovementMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      variantId,
      payload,
    }: {
      productId: string;
      variantId: string;
      payload: CreateStockMovementRequest;
    }) => createStockMovement(productId, variantId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "stock-movements"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "low-stock-variants"] });
    },
  });
}
