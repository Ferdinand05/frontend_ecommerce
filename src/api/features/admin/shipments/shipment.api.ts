import { apiClient } from "@/api/client";
import type { AdminShipmentsParams, AdminShipmentsResponse } from "./shipment.types";

export async function getAdminShipments(params: AdminShipmentsParams = {}): Promise<AdminShipmentsResponse> {
  const response = await apiClient.get<AdminShipmentsResponse>("/admin/shipments", { params });
  return response.data;
}
