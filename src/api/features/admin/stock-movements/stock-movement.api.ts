import { apiClient } from "@/api/client";
import type { AdminStockMovementsParams, AdminStockMovementsResponse } from "./stock-movement.types";

export interface CreateStockMovementRequest {
  type: "RESTOCK" | "SALE" | "RETURN" | "DAMAGE" | "ADJUSTMENT" | "ORDER_CANCEL";
  quantity: number;
  note?: string;
}

export async function getAdminStockMovements(
  params: AdminStockMovementsParams = {},
): Promise<AdminStockMovementsResponse> {
  const response = await apiClient.get<AdminStockMovementsResponse>("/admin/stock-movements", { params });
  return response.data;
}

/**
 * Stok hanya bisa berubah lewat endpoint pergerakan stok.
 * Endpoint ini menempel pada varian tertentu, bukan pada produk.
 */
export async function createStockMovement(
  productId: string,
  variantId: string,
  payload: CreateStockMovementRequest,
): Promise<void> {
  await apiClient.post(`/admin/products/${productId}/variants/${variantId}/inventory/movements`, payload);
}
