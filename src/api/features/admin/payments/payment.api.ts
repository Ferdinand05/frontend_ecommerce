import { apiClient } from "@/api/client";
import type { AdminPaymentsParams, AdminPaymentsResponse } from "./payment.types";

export async function getAdminPayments(params: AdminPaymentsParams = {}): Promise<AdminPaymentsResponse> {
  const response = await apiClient.get<AdminPaymentsResponse>("/admin/payments", { params });
  return response.data;
}
