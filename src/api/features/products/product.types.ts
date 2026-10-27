import type { Category } from "../categories/category.types";

export interface Image {
  id: string;
  url: string;
  alt: string;
  sort_order: number;
}

export interface Inventory {
  quantity: number;
  reserved_quantity: number;
}

export interface Variant {
  id: string;
  product_id?: string;
  sku: string;
  name: string;
  /** Harga dikirim sebagai string numerik oleh API, contoh "120000". */
  price: string;
  is_active: boolean;
  weight_grams?: number;
  inventory?: Inventory;
  images?: Image[];
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  category: Pick<Category, "id" | "name" | "slug">;
  images: Image[];
  variants: Variant[];
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  page_size: number;
}

export interface ProductsResponse {
  products: Product[];
  meta: PaginationMeta;
}

export interface ProductDetailResponse {
  product: Product;
}
