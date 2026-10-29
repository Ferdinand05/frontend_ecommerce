import type { AdminImage, AdminInventory, PaginationMeta } from "../admin.types";

export type ProductSort = "newest" | "oldest" | "name" | "name_desc" | "price_asc" | "price_desc";

export interface ProductListVariant {
  id: string;
  sku: string;
  name: string;
  price: string;
  is_active: boolean;
}

export interface ProductCategoryRef {
  id: string;
  name: string;
  slug: string;
}

export interface AdminProduct {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  category: ProductCategoryRef;
  images: AdminImage[];
  variants: ProductListVariant[];
  created_at: string;
  updated_at: string;
}

export interface AdminProductVariant {
  id: string;
  product_id: string;
  sku: string;
  name: string;
  price: string;
  is_active: boolean;
  weight_grams: number;
  inventory: AdminInventory | null;
  images: AdminImage[];
}

export interface AdminProductsResponse {
  products: AdminProduct[];
  meta: PaginationMeta;
}

export interface AdminProductVariantsResponse {
  variants: AdminProductVariant[];
}

export interface AdminProductsParams {
  q?: string;
  category_id?: string;
  is_active?: boolean;
  sort?: ProductSort;
  page?: number;
  page_size?: number;
}

export interface ProductVariantRequest {
  sku: string;
  name: string;
  price: string;
  weight_grams: number;
}
