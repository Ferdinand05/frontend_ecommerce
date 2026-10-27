import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { getAdminShipments } from "./shipment.api";
import type { AdminShipmentsParams } from "./shipment.types";

export function useAdminShipmentsQuery(params: () => AdminShipmentsParams) {
  return useQuery(() => ({
    queryKey: ["admin", "shipments", params()] as const,
    queryFn: () => getAdminShipments(params()),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  }));
}
