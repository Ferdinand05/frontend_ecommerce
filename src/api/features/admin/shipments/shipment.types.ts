import type { PaginationMeta } from "../admin.types";

export interface AdminShipment {
  id: string;
  order_id: string;
  provider: string;
  provider_order_id: string;
  courier_company: string;
  courier_type: string;
  tracking_number: string;
  tracking_url: string;
  status: string;
  provider_status: string;
  shipping_cost: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface AdminShipmentsResponse {
  shipments: AdminShipment[];
  meta: PaginationMeta;
}

export interface AdminShipmentsParams {
  status?: string;
  page?: number;
  page_size?: number;
}
