export interface ShippingArea {
  id: string;
  /** Nama area lengkap, contoh "Sumur Bandung, Bandung, Jawa Barat. 40111". */
  name: string;
  postal_code: number;
}

export interface ShippingRate {
  courier_code: string;
  courier_name: string;
  courier_service_code: string;
  courier_service_name: string;
  description: string;
  price: number;
  shipment_duration_range: string;
  shipment_duration_unit: string;
}

export interface ShippingRateItem {
  product_variant_id: string;
  quantity: number;
}

export interface CalculateRatesRequest {
  destination_area_id: string;
  items: ShippingRateItem[];
}
