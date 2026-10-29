import { useMutation, useQuery } from "@tanstack/vue-query";
import { computed, type Ref } from "vue";
import { refDebounced } from "@vueuse/core";
import axios from "axios";
import { calculateShippingRates, searchShippingAreas } from "./shipping.api";
import type { CalculateRatesRequest } from "./shipping.types";

/**
 * Pencarian area pengiriman. Kata kunci didebounce supaya setiap
 * ketikan tidak menembak API, dan query baru jalan setelah 3 huruf.
 */
export function useShippingAreasQuery(keyword: Ref<string>) {
  const debouncedKeyword = refDebounced(keyword, 300);

  return useQuery(() => ({
    queryKey: ["shipping", "areas", debouncedKeyword.value],
    queryFn: () => searchShippingAreas(debouncedKeyword.value),
    enabled: computed(() => debouncedKeyword.value.trim().length >= 3),
    staleTime: 5 * 60_000,
  }));
}

/**
 * Tarif pengiriman untuk satu area tujuan. Dipanggil ulang setiap kali
 * area tujuan berubah, jadi bentuknya mutasi: satu proses hitung, satu
 * hasil, tidak ada cache antar area.
 */
export function useShippingRatesMutation() {
  return useMutation({
    mutationFn: (payload: CalculateRatesRequest) => calculateShippingRates(payload),
    // 4xx di sini berarti area atau isi keranjang tidak valid. Mengulang
    // permintaan tidak akan memperbaiki datanya.
    retry: (failureCount, error) =>
      !(axios.isAxiosError(error) && (error.response?.status ?? 0) < 500) && failureCount < 2,
  });
}
