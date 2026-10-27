import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { apiClient } from "@/api/client";
import { getAccountProfile, getMyOrder, getMyOrders } from "./account.api";

export function useAccountProfileQuery() {
  return useQuery({
    queryKey: ["account", "profile"],
    queryFn: getAccountProfile,
    staleTime: 60_000,
  });
}

export function useMyOrdersQuery() {
  return useQuery({
    queryKey: ["account", "orders"],
    queryFn: () => getMyOrders(),
    staleTime: 30_000,
  });
}

export function useMyOrderQuery(orderId: () => string | null) {
  return useQuery(() => ({
    queryKey: ["account", "orders", orderId(), "detail"] as const,
    queryFn: () => getMyOrder(orderId() as string),
    enabled: !!orderId(),
    staleTime: 30_000,
  }));
}

export function useCancelOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => apiClient.post(`/me/orders/${orderId}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "orders"] });
    },
  });
}
