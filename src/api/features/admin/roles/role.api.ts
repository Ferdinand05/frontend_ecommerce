import { apiClient } from "@/api/client";
import type { AdminRole } from "./role.types";

export async function getAdminRoles(): Promise<AdminRole[]> {
  const response = await apiClient.get<AdminRole[]>("/admin/roles");
  return response.data;
}

export async function getAdminRole(roleId: string): Promise<AdminRole> {
  const response = await apiClient.get<AdminRole>(`/admin/roles/${roleId}`);
  return response.data;
}

export async function updateAdminRole(roleId: string, name: string): Promise<AdminRole> {
  const response = await apiClient.put<AdminRole>(`/admin/roles/${roleId}`, { name });
  return response.data;
}

export async function deleteAdminRole(roleId: string): Promise<void> {
  await apiClient.delete(`/admin/roles/${roleId}`);
}
