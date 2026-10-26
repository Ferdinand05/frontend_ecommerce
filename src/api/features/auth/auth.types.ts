import type { AuthUser } from "@/stores/auth";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LogoutRequest {
  refresh_token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

// (Opsional) Jika ada endpoint untuk mengambil profil user saat ini
export interface ProfileResponse {
  user: AuthUser;
}
