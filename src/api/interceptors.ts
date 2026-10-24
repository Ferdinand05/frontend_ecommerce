import type { AxiosInstance } from "axios";

export function setupInterceptors(client: AxiosInstance): void {
  client.interceptors.request.use(
    (config) => {
      // TODO: Tambahkan access token setelah mekanisme
      // autentikasi frontend ditentukan.
      return config;
    },
    (error: unknown) => Promise.reject(error),
  );

  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => Promise.reject(error),
  );
}
