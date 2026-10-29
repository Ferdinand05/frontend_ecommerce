import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import {
  getAdminShipment,
  getAdminShipmentTracking,
  getAdminShipments,
} from "./shipment.api";
import type { AdminShipmentsParams } from "./shipment.types";

export function useAdminShipmentsQuery(params: () => AdminShipmentsParams) {
  return useQuery(() => ({
    queryKey: ["admin", "shipments", params()] as const,
    queryFn: () => getAdminShipments(params()),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  }));
}

export function useAdminShipmentQuery(shipmentId: () => string | null) {
  return useQuery(() => ({
    queryKey: ["admin", "shipments", shipmentId(), "detail"] as const,
    queryFn: () => getAdminShipment(shipmentId() as string),
    enabled: !!shipmentId(),
    staleTime: 30_000,
  }));
}

export function useAdminShipmentTrackingQuery(shipmentId: () => string | null) {
  return useQuery(() => ({
    queryKey: ["admin", "shipments", shipmentId(), "tracking"] as const,
    queryFn: () => getAdminShipmentTracking(shipmentId() as string),
    enabled: !!shipmentId(),
    staleTime: 30_000,
  }));
}
