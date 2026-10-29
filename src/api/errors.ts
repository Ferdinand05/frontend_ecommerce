import axios from "axios";

interface ApiErrorBody {
  error?: string;
  message?: string;
}

/** Kode status HTTP dari error axios, atau undefined kalau errornya bukan dari API. */
export function getApiErrorStatus(error: unknown): number | undefined {
  if (axios.isAxiosError(error)) return error.response?.status;
  return undefined;
}

export function getApiErrorMessage(error: unknown, fallback = "Terjadi kesalahan. Silakan coba lagi."): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) {
      return "Tidak dapat terhubung ke server. Periksa koneksi internet kamu.";
    }

    const data = error.response.data;

    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message;
    }

    if (typeof data?.error === "string" && data.error.trim()) {
      return data.error;
    }

    switch (error.response.status) {
      case 400:
        return "Permintaan tidak valid.";
      case 401:
        return "Silakan login kembali.";
      case 403:
        return "Kamu tidak memiliki akses ke fitur ini.";
      case 404:
        return "Data yang diminta tidak ditemukan.";
      case 409:
        return "Terjadi konflik dengan data saat ini.";
      case 422:
        return "Data yang dikirim tidak dapat diproses.";
      case 429:
        return "Terlalu banyak permintaan. Coba lagi nanti.";
      default:
        if (error.response.status >= 500) {
          return "Terjadi gangguan pada server.";
        }

        return fallback;
    }
  }

  return error instanceof Error && error.message ? error.message : fallback;
}
