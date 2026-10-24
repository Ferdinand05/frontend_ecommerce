import { apiClient } from "@/api/client";
import type { Product, ProductListResponse } from "./product.types";

export async function getProducts(): Promise<ProductListResponse> {
  const response = await apiClient.get<ProductListResponse>("/products");
  return response.data;
}

export async function getProductById(productId: string): Promise<Product> {
  const response = await apiClient.get<Product>(`/products/${productId}`);

  return response.data;
}
