import { apiClient } from "@/api/client";
import type { AdminUser } from "./user.types";

export async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await apiClient.get<AdminUser[]>("/admin/users");
  return response.data;
}
