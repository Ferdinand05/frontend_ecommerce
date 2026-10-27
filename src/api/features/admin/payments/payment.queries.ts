import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { getAdminPayments } from "./payment.api";
import type { AdminPaymentsParams } from "./payment.types";

export function useAdminPaymentsQuery(params: () => AdminPaymentsParams) {
  return useQuery(() => ({
    queryKey: ["admin", "payments", params()] as const,
    queryFn: () => getAdminPayments(params()),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  }));
}
