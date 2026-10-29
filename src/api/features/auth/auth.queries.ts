import { useMutation } from "@tanstack/vue-query";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { login, logout, register, resendVerificationEmail, verifyEmail } from "./auth.api";

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
  const router = useRouter();

  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      // Register tidak mengembalikan token, akun harus verifikasi email dulu.
      router.push({ name: "login", query: { verify: "sent" } });
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

/** Verifikasi email dari token yang dikirim backend lewat email. */
export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: verifyEmail,
  });
};

/** Kirim ulang email verifikasi untuk akun yang belum terverifikasi. */
export const useResendVerificationMutation = () => {
  return useMutation({
    mutationFn: resendVerificationEmail,
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
