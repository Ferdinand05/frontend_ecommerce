import { useQuery } from "@tanstack/vue-query";
import { getAdminUsers } from "./user.api";

export function useAdminUsersQuery() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAdminUsers,
    staleTime: 60_000,
  });
}
