import { apiClient } from "@/api/client";
import type { LoginRequest, RegisterRequest, AuthResponse, ProfileResponse, LogoutRequest } from "./auth.types";

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/register", data);
  return response.data;
};

export const logout = async (data: LogoutRequest) => {
  const response = await apiClient.post("/auth/logout", data);
  return response.data;
};

// export const getProfile = async (): Promise<ProfileResponse> => {
//   const response = await apiClient.get<ProfileResponse>("/auth/me");
//   return response.data;
// };
