import { apiClient } from "@/api/client";
import type { CheckoutPreview, CreateOrderRequest, CreatePaymentResult, OrderEnvelope } from "./checkout.types";

export async function previewCheckout(): Promise<CheckoutPreview> {
  const response = await apiClient.post<CheckoutPreview>("/checkout/preview");
  return response.data;
}

export async function createOrder(payload: CreateOrderRequest): Promise<OrderEnvelope> {
  const response = await apiClient.post<OrderEnvelope>("/me/orders", payload);
  return response.data;
}

export async function createOrderPayment(orderId: string): Promise<CreatePaymentResult> {
  const response = await apiClient.post<CreatePaymentResult>(`/me/orders/${orderId}/payment`);
  return response.data;
}
