import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { getAdminOrder, getAdminOrderHistories, getAdminOrders } from "./order.api";
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

export function useAdminOrderHistories(orderId: () => string | null) {
  return useQuery(() => ({
    queryKey: ["admin", "orders", orderId(), "histories"] as const,
    queryFn: () => getAdminOrderHistories(orderId() as string),
    enabled: !!orderId(),
    staleTime: 30_000,
  }));
}
