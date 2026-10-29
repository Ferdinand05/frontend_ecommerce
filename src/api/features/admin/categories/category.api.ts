import { apiClient } from "@/api/client";
import type { AdminCategory } from "./category.types";

export interface CategoryRequest {
  name: string;
  description?: string | null;
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const response = await apiClient.get<{ categories: AdminCategory[] }>("/categories");
  return response.data.categories;
}

export async function createAdminCategory(payload: CategoryRequest): Promise<AdminCategory> {
  const response = await apiClient.post<{ category: AdminCategory }>("/admin/categories", payload);
  return response.data.category;
}

export async function updateAdminCategory(
  categoryId: string,
  payload: CategoryRequest,
): Promise<AdminCategory> {
  const response = await apiClient.put<{ category: AdminCategory }>(
    `/admin/categories/${categoryId}`,
    payload,
  );
  return response.data.category;
}

export async function deleteAdminCategory(categoryId: string): Promise<void> {
  await apiClient.delete(`/admin/categories/${categoryId}`);
}
