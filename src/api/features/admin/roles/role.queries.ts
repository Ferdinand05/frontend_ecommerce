import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { deleteAdminRole, getAdminRole, getAdminRoles, updateAdminRole } from "./role.api";

export function useAdminRolesQuery() {
  return useQuery({
    queryKey: ["admin", "roles"],
    queryFn: getAdminRoles,
    staleTime: 60_000,
  });
}

export function useAdminRoleQuery(roleId: () => string | null) {
  return useQuery(() => ({
    queryKey: ["admin", "roles", roleId()] as const,
    queryFn: () => getAdminRole(roleId() as string),
    enabled: !!roleId(),
    staleTime: 30_000,
  }));
}

export function useUpdateAdminRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, name }: { roleId: string; name: string }) => updateAdminRole(roleId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "roles"] });
    },
  });
}

export function useDeleteAdminRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roleId: string) => deleteAdminRole(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "roles"] });
    },
  });
}
