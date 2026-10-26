import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name?: string;
  phone?: string;
  role: {
    id: string;
    name: string;
  };
  status?: string;
}

export const useAuthStore = defineStore(
  "auth",
  () => {
    const token = ref<string | null>(null);
    const refreshToken = ref<string | null>(null);
    const user = ref<AuthUser | null>(null);

    const isAuthenticated = computed(() => !!token.value);

    // Update fungsi setAuth
    const setAuth = (newAccessToken: string, newRefreshToken: string, userData: AuthUser) => {
      token.value = newAccessToken;
      refreshToken.value = newRefreshToken;
      user.value = userData;
    };

    // Fungsi khusus untuk dipanggil oleh interceptor
    const updateTokens = (newAccessToken: string, newRefreshToken: string) => {
      token.value = newAccessToken;
      refreshToken.value = newRefreshToken;
    };

    const logout = () => {
      token.value = null;
      refreshToken.value = null; // Bersihkan refresh token
      user.value = null;
    };

    return { token, refreshToken, user, isAuthenticated, setAuth, updateTokens, logout };
  },
  { persist: true },
);
