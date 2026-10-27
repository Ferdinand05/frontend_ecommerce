import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/auth";

// Variabel untuk mengelola concurrency RTR
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: string) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

export function setupInterceptors(client: AxiosInstance) {
  client.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      // Gunakan custom property _retry agar request tidak terjebak loop tak terhingga
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      const authStore = useAuthStore();

      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        // Tanpa refresh token tidak ada sesi yang bisa dipulihkan, jadi error asli
        // (mis. "invalid credentials" di form login) harus diteruskan ke pemanggil.
        if (!authStore.refreshToken) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          // Jika sedang refresh, masukkan request ini ke antrean
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((newToken) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return client(originalRequest); // Jalankan ulang request
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          if (!authStore.refreshToken) {
            throw new Error("Refresh token not found");
          }

          // Gunakan axios standar (bukan 'client' instance) agar tidak memicu interceptor ini sendiri
          const baseURL = import.meta.env.VITE_API_BASE_URL;
          const { data } = await axios.post(`${baseURL}/auth/refresh`, {
            refresh_token: authStore.refreshToken,
          });

          // Simpan token RTR terbaru
          authStore.updateTokens(data.access_token, data.refresh_token);

          // Beritahu antrean bahwa refresh berhasil, berikan token baru
          processQueue(null, data.access_token);

          // Jalankan ulang request yang pertama gagal
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return client(originalRequest);
        } catch (refreshError) {
          // Jika refresh token gagal (misal: kadaluarsa juga atau revoked)
          processQueue(refreshError as AxiosError, null);
          authStore.logout();
          window.location.href = "/login"; // Force logout
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false; // Reset status
        }
      }

      return Promise.reject(error);
    },
  );
}
