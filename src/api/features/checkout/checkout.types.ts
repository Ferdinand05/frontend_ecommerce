export interface CheckoutPreviewItem {
  product_variant_id: string;
  product_name: string;
  variant_name: string;
  sku: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
  weight_grams: number;
  available_stock: number;
}

export interface CheckoutPreview {
  items: CheckoutPreviewItem[];
  subtotal: string;
}

export interface CreateOrderRequest {
  recipient_name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  destination_area_id: string;
  destination_area_name: string;
  courier_code: string;
  courier_service_code: string;
}

export interface OrderEnvelope {
  order: { id: string; order_number: string };
}

export interface CreatePaymentResult {
  payment_id: string;
  order_id: string;
  status: string;
  amount: string;
  currency: string;
  checkout_url: string;
  expires_at: string | null;
}
