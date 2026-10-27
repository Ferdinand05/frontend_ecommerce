import { apiClient } from "@/api/client";
import type { Category } from "./category.types";

export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get<{ categories: Category[] }>("/categories");
  return response.data.categories;
}
