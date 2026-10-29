import { apiClient } from "@/api/client";
import type {
  AdminOrderDetailResponse,
  AdminOrdersParams,
  AdminOrdersResponse,
} from "./order.types";

export interface UpdateOrderStatusRequest {
  status: string;
  note?: string | null;
}

export async function getAdminOrders(params: AdminOrdersParams = {}): Promise<AdminOrdersResponse> {
  const response = await apiClient.get<AdminOrdersResponse>("/admin/orders", { params });
  return response.data;
}

export async function getAdminOrder(orderId: string): Promise<AdminOrderDetailResponse> {
  const response = await apiClient.get<AdminOrderDetailResponse>(`/admin/orders/${orderId}`);
  return response.data;
}

export async function updateAdminOrderStatus(
  orderId: string,
  payload: UpdateOrderStatusRequest,
): Promise<AdminOrderDetailResponse> {
  const response = await apiClient.patch<AdminOrderDetailResponse>(
    `/admin/orders/${orderId}/status`,
    payload,
  );
  return response.data;
}
