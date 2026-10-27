import { apiClient } from "@/api/client";
import type { Product, ProductsResponse } from "./product.types";

export interface ProductsParams {
  page?: number;
  page_size?: number;
  q?: string;
  category_id?: string;
  sort?: string;
}

export async function getProducts(params: ProductsParams = {}): Promise<ProductsResponse> {
  const response = await apiClient.get<ProductsResponse>("/products", { params });
  return response.data;
}

export async function getProductById(productId: string): Promise<Product> {
  const response = await apiClient.get<Product>(`/products/${productId}`);

  return response.data;
}
