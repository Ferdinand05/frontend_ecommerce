import { apiClient } from "@/api/client";
import type { AdminProductsParams, AdminProductsResponse, AdminProductVariantsResponse } from "./product.types";

export async function getAdminProducts(params: AdminProductsParams = {}): Promise<AdminProductsResponse> {
  const response = await apiClient.get<AdminProductsResponse>("/admin/products", { params });
  return response.data;
}

export async function getAdminProductVariants(productId: string): Promise<AdminProductVariantsResponse> {
  const response = await apiClient.get<AdminProductVariantsResponse>(`/admin/products/${productId}/variants`);
  return response.data;
}
