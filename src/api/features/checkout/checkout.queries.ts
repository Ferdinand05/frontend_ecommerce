import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { ref } from "vue";
import { createOrder, createOrderPayment, previewCheckout } from "./checkout.api";
import type { CreateOrderRequest } from "./checkout.types";

/**
 * Step 0 checkout. `POST /checkout/preview` mengembalikan isi keranjang
 * beserta subtotal dan berat. Mutasi dipakai karena endpoint ini POST
 * dan hanya relevan untuk satu alur: membuka halaman checkout.
 */
export function useCheckoutPreviewMutation() {
  return useMutation({
    mutationFn: previewCheckout,
  });
}

/**
 * Tahap akhir: buat order lalu buat pembayaran Xendit dalam satu aksi.
 * `stage` dipakai UI untuk membedakan "membuat pesanan" dari
 * "membuka halaman pembayaran".
 */
export function usePlaceOrderMutation() {
  const queryClient = useQueryClient();
  const stage = ref<"idle" | "creating" | "paying">("idle");

  const mutation = useMutation({
    mutationFn: async (payload: CreateOrderRequest) => {
      stage.value = "creating";
      const order = await createOrder(payload);
      const orderId = order.order.id;

      stage.value = "paying";
      const payment = await createOrderPayment(orderId);
      return payment;
    },
    onSettled: () => {
      stage.value = "idle";
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return { ...mutation, stage };
}
