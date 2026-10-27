import { useQuery } from "@tanstack/vue-query";
import { getAdminRoles } from "./role.api";

export function useAdminRolesQuery() {
  return useQuery({
    queryKey: ["admin", "roles"],
    queryFn: getAdminRoles,
    staleTime: 60_000,
  });
}
