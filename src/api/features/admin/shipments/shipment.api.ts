import { apiClient } from "@/api/client";
import type {
  AdminShipmentDetailResponse,
  AdminShipmentsParams,
  AdminShipmentsResponse,
  AdminShipmentTrackingResponse,
} from "./shipment.types";

export async function getAdminShipments(
  params: AdminShipmentsParams = {},
): Promise<AdminShipmentsResponse> {
  const response = await apiClient.get<AdminShipmentsResponse>("/admin/shipments", { params });
  return response.data;
}

export async function getAdminShipment(shipmentId: string): Promise<AdminShipmentDetailResponse> {
  const response = await apiClient.get<AdminShipmentDetailResponse>(
    `/admin/shipments/${shipmentId}`,
  );
  return response.data;
}

export async function getAdminShipmentTracking(
  shipmentId: string,
): Promise<AdminShipmentTrackingResponse> {
  const response = await apiClient.get<AdminShipmentTrackingResponse>(
    `/admin/shipments/${shipmentId}/tracking`,
  );
  return response.data;
}
