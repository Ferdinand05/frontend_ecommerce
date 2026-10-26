import { apiClient } from "@/api/client";
import type { Product, ProductsResponse } from "./product.types";

export async function getProducts(): Promise<ProductsResponse> {
  const response = await apiClient.get<ProductsResponse>("/products");
  return response.data;
}

export async function getProductById(productId: string): Promise<Product> {
  const response = await apiClient.get<Product>(`/products/${productId}`);

  return response.data;
}
