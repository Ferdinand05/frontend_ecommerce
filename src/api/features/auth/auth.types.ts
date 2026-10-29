import type { AuthUser } from "@/stores/auth";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LogoutRequest {
  refresh_token: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  message: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface RegisterResponse {
  message?: string;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

/**
 * Register hanya mengembalikan user yang dibuat, tanpa token. Akun baru
 * harus verifikasi email dulu sebelum bisa masuk.
 */
export interface RegisterResponse {
  id: string;
  email: string;
  first_name: string;
  last_name?: string;
  phone?: string;
  status?: string;
  email_verified_at?: string | null;
}

// (Opsional) Jika ada endpoint untuk mengambil profil user saat ini
export interface ProfileResponse {
  user: AuthUser;
}
