export interface AccountProfile {
  id: string;
  email: string;
  first_name: string;
  last_name?: string;
  phone?: string;
  role: { id: string; name: string };
  status?: string;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MyOrder {
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

export interface MyOrderItem {
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

export interface MyOrderAddress {
  id: string;
  recipient_name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
}

export interface MyOrderStatusHistory {
  id: string;
  status: string;
  note: string | null;
  created_at: string;
}

export interface MyOrderDetail extends MyOrder {
  items: MyOrderItem[];
  address: MyOrderAddress;
  status_histories: MyOrderStatusHistory[];
}

export interface MyOrdersResponse {
  orders: MyOrder[];
  meta: { total: number; page: number; page_size: number };
}
