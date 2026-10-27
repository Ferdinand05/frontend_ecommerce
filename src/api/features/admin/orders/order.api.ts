import { apiClient } from "@/api/client";
import type {
  AdminOrderDetailResponse,
  AdminOrderHistoriesResponse,
  AdminOrdersParams,
  AdminOrdersResponse,
} from "./order.types";

export async function getAdminOrders(params: AdminOrdersParams = {}): Promise<AdminOrdersResponse> {
  const response = await apiClient.get<AdminOrdersResponse>("/admin/orders", { params });
  return response.data;
}

export async function getAdminOrder(orderId: string): Promise<AdminOrderDetailResponse> {
  const response = await apiClient.get<AdminOrderDetailResponse>(`/admin/orders/${orderId}`);
  return response.data;
}

export async function getAdminOrderHistories(orderId: string): Promise<AdminOrderHistoriesResponse> {
  const response = await apiClient.get<AdminOrderHistoriesResponse>(`/admin/orders/${orderId}/histories`);
  return response.data;
}
