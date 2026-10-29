import { apiClient } from "@/api/client";
import type { CalculateRatesRequest, ShippingArea, ShippingRate } from "./shipping.types";

export async function searchShippingAreas(keyword: string): Promise<ShippingArea[]> {
  const response = await apiClient.get<{ areas: ShippingArea[] }>("/shipping/areas", {
    params: { q: keyword },
  });
  return response.data.areas;
}

export async function calculateShippingRates(payload: CalculateRatesRequest): Promise<ShippingRate[]> {
  const response = await apiClient.post<{ rates: ShippingRate[] }>("/shipping/rates", payload);
  return response.data.rates;
}
