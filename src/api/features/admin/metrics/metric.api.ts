import { apiClient } from "@/api/client";
import type { AdminMetricsSummary } from "./metric.types";

export async function getAdminMetricsSummary(): Promise<AdminMetricsSummary> {
  const response = await apiClient.get<AdminMetricsSummary>("/admin/metrics/summary");
  return response.data;
}
