import { apiClient } from "@/api/client";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  AuthResponse,
  LogoutRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "./auth.types";

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>("/auth/register", data);
  return response.data;
};

export const logout = async (data: LogoutRequest) => {
  const response = await apiClient.post("/auth/logout", data);
  return response.data;
};

export const verifyEmail = async (data: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
  const response = await apiClient.post<VerifyEmailResponse>("/auth/email-verification/verify", data);
  return response.data;
};

export const resendVerificationEmail = async (email: string): Promise<void> => {
  await apiClient.post("/auth/email-verification/resend", { email });
};

/** Minta link reset password. Backend selalu balas 204, email tidak pernah dibocorkan. */
export const forgotPassword = async (data: ForgotPasswordRequest): Promise<void> => {
  await apiClient.post("/auth/password/forgot", data);
};

/** Terapkan password baru dari token reset yang dikirim lewat email. */
export const resetPassword = async (data: ResetPasswordRequest): Promise<void> => {
  await apiClient.post("/auth/password/reset", data);
};

// export const getProfile = async (): Promise<ProfileResponse> => {
//   const response = await apiClient.get<ProfileResponse>("/auth/me");
//   return response.data;
// };
