import type { Image } from "../products/product.types";

export interface CartItem {
  id: string;
  product_variant_id: string;
  product_id: string;
  product_name: string;
  /** Nama varian, contoh "Single Pack". */
  name: string;
  sku: string;
  /** Harga dikirim sebagai string numerik oleh API, contoh "99000". */
  price: string;
  quantity: number;
  images: Image[];
}

export interface Cart {
  items: CartItem[];
}
