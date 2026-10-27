import { apiClient } from "@/api/client";
import type { AccountProfile, MyOrderDetail, MyOrdersResponse } from "./account.types";

export async function getAccountProfile(): Promise<AccountProfile> {
  const response = await apiClient.get<AccountProfile>("/auth/me");
  return response.data;
}

export async function getMyOrders(page = 1, pageSize = 50): Promise<MyOrdersResponse> {
  const response = await apiClient.get<MyOrdersResponse>("/me/orders", { params: { page, page_size: pageSize } });
  return response.data;
}

export async function getMyOrder(orderId: string): Promise<MyOrderDetail> {
  const response = await apiClient.get<{ order: MyOrderDetail }>(`/me/orders/${orderId}`);
  return response.data.order;
}
