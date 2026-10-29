import type { AdminUser } from "./user.types";
import { apiClient } from "@/api/client";

export interface CreateUserRequest {
  email: string;
  password: string;
  first_name: string;
  last_name?: string | null;
  phone?: string | null;
  role_id: string;
}

export interface UpdateUserProfileRequest {
  first_name: string;
  last_name?: string | null;
  phone?: string | null;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await apiClient.get<AdminUser[]>("/admin/users");
  return response.data;
}

export async function getAdminUser(userId: string): Promise<AdminUser> {
  const response = await apiClient.get<AdminUser>(`/admin/users/${userId}`);
  return response.data;
}

export async function createAdminUser(payload: CreateUserRequest): Promise<AdminUser> {
  const response = await apiClient.post<AdminUser>("/admin/users", payload);
  return response.data;
}

export async function updateAdminUserProfile(
  userId: string,
  payload: UpdateUserProfileRequest,
): Promise<AdminUser> {
  const response = await apiClient.patch<AdminUser>(`/admin/users/${userId}/profile`, payload);
  return response.data;
}

export async function updateAdminUserRole(userId: string, roleId: string): Promise<AdminUser> {
  const response = await apiClient.patch<AdminUser>(`/admin/users/${userId}/role`, {
    role_id: roleId,
  });
  return response.data;
}

export async function updateAdminUserStatus(
  userId: string,
  status: "active" | "blocked",
): Promise<AdminUser> {
  const response = await apiClient.patch<AdminUser>(`/admin/users/${userId}/status`, {
    status,
  });
  return response.data;
}
