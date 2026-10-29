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

/**
 * Pembayaran ulang untuk order yang belum dibayar. Endpoint yang sama
 * dengan checkout mengembalikan `checkout_url` Xendit, jadi tombol ini
 * tinggal mengarahkan shopper ke halaman pembayaran.
 */
export function useRetryPaymentMutation() {
  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await apiClient.post<{ checkout_url: string }>(`/me/orders/${orderId}/payment`);
      return response.data;
    },
  });
}
