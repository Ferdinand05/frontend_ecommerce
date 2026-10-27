import { apiClient } from "@/api/client";
import type { AdminStockMovementsParams, AdminStockMovementsResponse } from "./stock-movement.types";

export async function getAdminStockMovements(params: AdminStockMovementsParams = {}): Promise<AdminStockMovementsResponse> {
  const response = await apiClient.get<AdminStockMovementsResponse>("/admin/stock-movements", { params });
  return response.data;
}
