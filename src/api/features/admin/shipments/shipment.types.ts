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

export interface AdminShipmentOrderSummary {
  id: string;
  user_id: string;
  order_number: string;
  status: string;
  total_amount: string;
  created_at: string;
}

export interface AdminShipmentCourier {
  company: string;
  type: string;
  driver_name: string;
  driver_phone: string;
}

export interface AdminShipmentLocation {
  contact_name: string;
  address: string;
}

export interface AdminShipmentTrackingEvent {
  status: string;
  description: string;
  updated_at: string;
}

export interface AdminShipmentsResponse {
  shipments: AdminShipment[];
  meta: PaginationMeta;
}

export interface AdminShipmentDetailResponse {
  shipment: AdminShipment;
  order: AdminShipmentOrderSummary;
}

export interface AdminShipmentTrackingResponse {
  id: string;
  waybill_id: string;
  status: string;
  link: string;
  courier: AdminShipmentCourier;
  origin: AdminShipmentLocation;
  destination: AdminShipmentLocation;
  history: AdminShipmentTrackingEvent[];
  estimated_delivery: string;
}

export interface AdminShipmentsParams {
  status?: string;
  page?: number;
  page_size?: number;
}
