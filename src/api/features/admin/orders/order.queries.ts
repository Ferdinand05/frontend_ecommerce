import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import {
  getAdminOrder,
  getAdminOrders,
  updateAdminOrderStatus,
  type UpdateOrderStatusRequest,
} from "./order.api";
import type { AdminOrdersParams } from "./order.types";

export function useAdminOrdersQuery(params: () => AdminOrdersParams) {
  return useQuery(() => ({
    queryKey: ["admin", "orders", params()] as const,
    queryFn: () => getAdminOrders(params()),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  }));
}

export function useAdminOrderQuery(orderId: () => string | null) {
  return useQuery(() => ({
    queryKey: ["admin", "orders", orderId(), "detail"] as const,
    queryFn: () => getAdminOrder(orderId() as string),
    enabled: !!orderId(),
    staleTime: 30_000,
  }));
}

export function useUpdateAdminOrderStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, payload }: { orderId: string; payload: UpdateOrderStatusRequest }) =>
      updateAdminOrderStatus(orderId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders", variables.orderId] });
    },
  });
}
