import type { PaginationMeta } from "../admin.types";

export type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";

export interface AdminOrder {
  id: string;
  order_number: string;
  status: string;
  subtotal: string;
  shipping_cost: string;
  discount_amount: string;
  total_amount: string;
  courier_code: string;
  courier_name: string;
  courier_service_code: string;
  courier_service_name: string;
  payment_expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface AdminOrderItem {
  id: string;
  product_variant_id: string;
  product_name: string;
  variant_name: string;
  sku: string;
  price: string;
  quantity: number;
  subtotal: string;
  weight_grams: number;
}

export interface AdminOrderAddress {
  id: string;
  recipient_name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  latitude: string | null;
  longitude: string | null;
  biteship_area_id: string;
}

export interface AdminOrderStatusHistory {
  id: string;
  status: string;
  note: string | null;
  created_at: string;
}

export interface AdminOrderDetail extends AdminOrder {
  items: AdminOrderItem[];
  address: AdminOrderAddress;
  status_histories: AdminOrderStatusHistory[];
}

export interface AdminOrdersResponse {
  orders: AdminOrder[];
  meta: PaginationMeta;
}

export interface AdminOrderDetailResponse {
  order: AdminOrderDetail;
}

export interface AdminOrderHistoriesResponse {
  order_id: string;
  histories: AdminOrderStatusHistory[];
}

export interface AdminOrdersParams {
  status?: string;
  order_number?: string;
  user_id?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
}
