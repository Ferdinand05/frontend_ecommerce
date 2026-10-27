import { useQuery } from "@tanstack/vue-query";
import { getAdminMetricsSummary } from "./metric.api";

export function useAdminMetricsSummaryQuery() {
  return useQuery({
    queryKey: ["admin", "metrics", "summary"],
    queryFn: getAdminMetricsSummary,
    staleTime: 60_000,
  });
}
