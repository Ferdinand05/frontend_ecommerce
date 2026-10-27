import { apiClient } from "@/api/client";
import type { AdminCategory } from "./category.types";

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const response = await apiClient.get<{ categories: AdminCategory[] }>("/categories");
  return response.data.categories;
}
