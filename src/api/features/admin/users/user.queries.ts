import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import {
  createAdminUser,
  getAdminUser,
  getAdminUsers,
  updateAdminUserProfile,
  updateAdminUserRole,
  updateAdminUserStatus,
  type CreateUserRequest,
  type UpdateUserProfileRequest,
} from "./user.api";

export function useAdminUsersQuery() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAdminUsers,
    staleTime: 60_000,
  });
}

export function useAdminUserQuery(userId: () => string | null) {
  return useQuery(() => ({
    queryKey: ["admin", "users", userId()] as const,
    queryFn: () => getAdminUser(userId() as string),
    enabled: !!userId(),
    staleTime: 30_000,
  }));
}

export function useCreateAdminUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserRequest) => createAdminUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useUpdateAdminUserProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: UpdateUserProfileRequest }) =>
      updateAdminUserProfile(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useUpdateAdminUserRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      updateAdminUserRole(userId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useUpdateAdminUserStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: "active" | "blocked" }) =>
      updateAdminUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}
