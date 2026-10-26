import { useMutation, useQuery } from "@tanstack/vue-query";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { login, logout, register } from "./auth.api";

// Hook untuk Login
export const useLoginMutation = () => {
  const authStore = useAuthStore();
  const router = useRouter();
  const route = useRoute();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      authStore.setAuth(data.access_token, data.refresh_token, data.user);

      const redirectPath = route.query.redirect as string;
      if (redirectPath) {
        router.push(redirectPath);
      } else {
        router.push({ name: "account" });
      }
    },
    onError: (error: any) => {
      // Tangani error secara global di sini, atau biarkan UI menanganinya
      console.error("Login Failed:", error.response?.data?.message || error.message);
    },
  });
};

// Hook untuk Register
export const useRegisterMutation = () => {
  const authStore = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      // Langsung login-kan user setelah register sukses
      authStore.setAuth(data.access_token, data.refresh_token, data.user);
      router.push({ name: "account" });
    },
  });
};

export const useLogoutMutation = () => {
  const authStore = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      authStore.logout();
      router.push({ name: "login" });
    },
  });
};

// // Hook untuk fetch data profile terbaru (GET request menggunakan useQuery)
// export const useProfileQuery = () => {
//   return useQuery({
//     queryKey: ["profile"],
//     queryFn: getProfile,
//     staleTime: 1000 * 60 * 15, // Cache selama 15 menit
//   });
// };
