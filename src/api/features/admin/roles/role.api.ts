import { apiClient } from "@/api/client";
import type { AdminRole } from "./role.types";

export async function getAdminRoles(): Promise<AdminRole[]> {
  const response = await apiClient.get<AdminRole[]>("/admin/roles");
  return response.data;
}
