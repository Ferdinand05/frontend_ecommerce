import { apiClient } from "@/api/client";
import type { AdminImage } from "../admin.types";
import type {
  AdminProductVariant,
  AdminProductsParams,
  AdminProductsResponse,
  AdminProductVariantsResponse,
  ProductVariantRequest,
} from "./product.types";

export interface ProductRequest {
  category_id: string;
  name: string;
  description?: string | null;
}

export async function getAdminProducts(params: AdminProductsParams = {}): Promise<AdminProductsResponse> {
  const response = await apiClient.get<AdminProductsResponse>("/admin/products", { params });
  return response.data;
}

export async function getAdminProductVariants(productId: string): Promise<AdminProductVariantsResponse> {
  const response = await apiClient.get<AdminProductVariantsResponse>(`/admin/products/${productId}/variants`);
  return response.data;
}

export async function createAdminProduct(payload: ProductRequest) {
  const response = await apiClient.post<{ product: AdminProductsResponse["products"][number] }>(
    "/admin/products",
    payload,
  );
  return response.data.product;
}

export async function updateAdminProduct(productId: string, payload: ProductRequest) {
  const response = await apiClient.put<{ product: AdminProductsResponse["products"][number] }>(
    `/admin/products/${productId}`,
    payload,
  );
  return response.data.product;
}

export async function deleteAdminProduct(productId: string): Promise<void> {
  await apiClient.delete(`/admin/products/${productId}`);
}

export async function createAdminProductVariant(
  productId: string,
  payload: ProductVariantRequest,
): Promise<AdminProductVariant> {
  const response = await apiClient.post<{ variant: AdminProductVariant }>(
    `/admin/products/${productId}/variants`,
    payload,
  );
  return response.data.variant;
}

export async function updateAdminProductVariant(
  productId: string,
  variantId: string,
  payload: ProductVariantRequest,
): Promise<AdminProductVariant> {
  const response = await apiClient.put<{ variant: AdminProductVariant }>(
    `/admin/products/${productId}/variants/${variantId}`,
    payload,
  );
  return response.data.variant;
}

export async function deleteAdminProductVariant(productId: string, variantId: string): Promise<void> {
  await apiClient.delete(`/admin/products/${productId}/variants/${variantId}`);
}

// Unggahan foto memakai multipart. Header Content-Type ditulis manual supaya
// axios tidak mengubah FormData jadi JSON; batas part tetap dibuat browser.
export async function uploadAdminProductImage(
  productId: string,
  file: File,
  alt?: string,
): Promise<AdminImage> {
  const body = new FormData();
  body.append("file", file);
  if (alt) body.append("alt", alt);

  const response = await apiClient.post<{ image: AdminImage }>(
    `/admin/products/${productId}/images`,
    body,
    { headers: { "Content-Type": "multipart/form-data" }, timeout: 60_000 },
  );
  return response.data.image;
}

export async function deleteAdminProductImage(productId: string, imageId: string): Promise<void> {
  await apiClient.delete(`/admin/products/${productId}/images/${imageId}`);
}

export async function uploadAdminVariantImage(
  productId: string,
  variantId: string,
  file: File,
  alt?: string,
): Promise<AdminImage> {
  const body = new FormData();
  body.append("file", file);
  if (alt) body.append("alt", alt);

  const response = await apiClient.post<{ image: AdminImage }>(
    `/admin/products/${productId}/variants/${variantId}/images`,
    body,
    { headers: { "Content-Type": "multipart/form-data" }, timeout: 60_000 },
  );
  return response.data.image;
}

export async function deleteAdminVariantImage(
  productId: string,
  variantId: string,
  imageId: string,
): Promise<void> {
  await apiClient.delete(`/admin/products/${productId}/variants/${variantId}/images/${imageId}`);
}
