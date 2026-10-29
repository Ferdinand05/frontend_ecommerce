<script setup lang="ts">
import { ref } from "vue";
import { ChevronDown, ChevronUp, CreditCard } from "@lucide/vue";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getApiErrorMessage } from "@/api/errors";
import { toast } from "vue-sonner";
import { useCancelOrderMutation, useMyOrderQuery, useRetryPaymentMutation } from "@/api/features/account/account.queries";
import { formatDateTime, formatIDR } from "@/lib/format";
import type { MyOrder } from "@/api/features/account/account.types";

const props = defineProps<{ order: MyOrder }>();

const expanded = ref(false);
const { data: detail, isPending, isError, refetch } = useMyOrderQuery(() => (expanded.value ? props.order.id : null));
const { mutate: cancelOrder, isPending: isCancelling, error: cancelError, reset: resetCancel } = useCancelOrderMutation();
const { mutate: retryPayment, isPending: isPaying, error: paymentError } = useRetryPaymentMutation();
const cancelDialogOpen = ref(false);

function payOrder() {
  retryPayment(props.order.id, {
    onSuccess: (payment) => {
      window.location.href = payment.checkout_url;
    },
  });
}

function askCancel() {
  resetCancel();
  cancelDialogOpen.value = true;
}

function confirmCancel() {
  cancelOrder(props.order.id, {
    onSuccess: () => {
      cancelDialogOpen.value = false;
      toast.success(`${props.order.order_number} is cancelled.`);
    },
  });
}
</script>

<template>
  <article class="py-5">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="min-w-0">
        <h3 class="font-heading text-lg font-bold">{{ order.order_number }}</h3>
        <p class="mt-1 text-xs text-white/65">{{ formatDateTime(order.created_at) }} &middot; {{ order.courier_name }} {{ order.courier_service_name }}</p>
        <p class="mt-2 text-sm font-semibold tabular-nums">{{ formatIDR(order.total_amount) }}</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <span class="inline-flex items-center gap-2 border border-white/20 px-3 py-1.5 text-xs font-semibold">{{ order.status }}</span>
        <button
          class="inline-flex min-h-11 items-center gap-2 border border-white/35 px-3 text-xs font-semibold hover:border-[#F44336] hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]"
          type="button"
          :aria-expanded="expanded"
          @click="expanded = !expanded"
        >
          <ChevronUp v-if="expanded" :size="15" aria-hidden="true" />
          <ChevronDown v-else :size="15" aria-hidden="true" />
          {{ expanded ? "Hide detail" : "Order detail" }}
        </button>
        <button
          v-if="order.status === 'PENDING'"
          class="inline-flex min-h-11 items-center gap-2 bg-ember px-3 text-xs font-semibold text-white hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336] disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          :disabled="isPaying"
          @click="payOrder"
        >
          <CreditCard :size="15" aria-hidden="true" />
          {{ isPaying ? "Opening payment" : "Pay now" }}
        </button>
        <button
          v-if="order.status === 'PENDING'"
          class="inline-flex min-h-11 items-center border border-white/35 px-3 text-xs font-semibold hover:border-[#F44336] hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336] disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          :disabled="isCancelling"
          @click="askCancel"
        >
          {{ isCancelling ? "Cancelling" : "Cancel order" }}
        </button>
      </div>
    </div>

    <p v-if="paymentError" class="mt-3 text-sm text-[#ff958e]">{{ getApiErrorMessage(paymentError) }}</p>

    <AlertDialog v-model:open="cancelDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
          <AlertDialogDescription>
            {{ order.order_number }} will be cancelled. You cannot undo this action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <p v-if="cancelError" class="text-sm text-[#ff958e]">{{ getApiErrorMessage(cancelError) }}</p>
        <AlertDialogFooter>
          <AlertDialogCancel :disabled="isCancelling">Keep order</AlertDialogCancel>
          <button
            class="inline-flex min-h-11 items-center justify-center bg-destructive px-3 text-xs font-semibold text-white hover:bg-destructive/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336] disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            :disabled="isCancelling"
            @click="confirmCancel"
          >
            {{ isCancelling ? "Cancelling..." : "Cancel order" }}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <div v-if="expanded" class="mt-5 grid gap-6">
      <p v-if="isPending" class="text-sm text-white/70">Loading the order detail&hellip;</p>
      <div v-else-if="isError" class="grid gap-3">
        <p class="text-sm text-white/75">The order detail did not load, so the items below are unavailable right now.</p>
        <button class="inline-flex min-h-11 w-fit items-center border border-white/40 px-4 text-sm font-semibold hover:border-[#F44336] hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]" type="button" @click="refetch()">
          Load the order detail again
        </button>
      </div>
      <div v-else-if="detail" class="grid gap-6">
        <table class="w-full border-collapse text-sm">
          <caption class="sr-only">Items in order {{ detail.order_number }}</caption>
          <thead>
            <tr class="border-b border-white/20 text-left text-xs uppercase tracking-[0.12em] text-white/60">
              <th scope="col" class="py-2 pr-3 font-semibold">Piece</th>
              <th scope="col" class="py-2 pr-3 font-semibold">Variant</th>
              <th scope="col" class="py-2 pr-3 text-right font-semibold">Qty</th>
              <th scope="col" class="py-2 pr-3 text-right font-semibold">Price</th>
              <th scope="col" class="py-2 text-right font-semibold">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in detail.items" :key="item.id" class="border-b border-white/10">
              <td class="py-2.5 pr-3 text-white/90">{{ item.product_name }}</td>
              <td class="py-2.5 pr-3 text-white/70">{{ item.variant_name }}</td>
              <td class="py-2.5 pr-3 text-right tabular-nums">{{ item.quantity }}</td>
              <td class="py-2.5 pr-3 text-right tabular-nums">{{ formatIDR(item.price) }}</td>
              <td class="py-2.5 text-right font-semibold tabular-nums">{{ formatIDR(item.subtotal) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" class="py-2.5 pr-3 text-right text-white/70">Subtotal</td>
              <td class="py-2.5 text-right tabular-nums">{{ formatIDR(detail.subtotal) }}</td>
            </tr>
            <tr>
              <td colspan="4" class="py-2.5 pr-3 text-right text-white/70">Shipping ({{ detail.courier_name }} {{ detail.courier_service_name }})</td>
              <td class="py-2.5 text-right tabular-nums">{{ formatIDR(detail.shipping_cost) }}</td>
            </tr>
            <tr v-if="Number(detail.discount_amount) > 0">
              <td colspan="4" class="py-2.5 pr-3 text-right text-white/70">Discount</td>
              <td class="py-2.5 text-right tabular-nums text-[#ff958e]">-{{ formatIDR(detail.discount_amount) }}</td>
            </tr>
            <tr class="border-t border-white/20">
              <td colspan="4" class="py-2.5 pr-3 text-right font-bold">Total</td>
              <td class="py-2.5 text-right font-bold tabular-nums">{{ formatIDR(detail.total_amount) }}</td>
            </tr>
          </tfoot>
        </table>

        <table class="w-full border-collapse text-sm">
          <caption class="sr-only">Delivery details for order {{ detail.order_number }}</caption>
          <tbody>
            <tr class="border-b border-white/10">
              <th scope="row" class="w-40 py-2.5 pr-3 text-left font-semibold text-white/70">Recipient</th>
              <td class="py-2.5">{{ detail.address.recipient_name }}</td>
            </tr>
            <tr class="border-b border-white/10">
              <th scope="row" class="py-2.5 pr-3 text-left font-semibold text-white/70">Phone</th>
              <td class="py-2.5 tabular-nums">{{ detail.address.phone }}</td>
            </tr>
            <tr class="border-b border-white/10">
              <th scope="row" class="py-2.5 pr-3 text-left font-semibold text-white/70">Address</th>
              <td class="py-2.5">{{ detail.address.address }}</td>
            </tr>
            <tr class="border-b border-white/10">
              <th scope="row" class="py-2.5 pr-3 text-left font-semibold text-white/70">City</th>
              <td class="py-2.5">{{ detail.address.city }}, {{ detail.address.province }} {{ detail.address.postal_code }}</td>
            </tr>
            <tr>
              <th scope="row" class="py-2.5 pr-3 text-left font-semibold text-white/70">Payment due</th>
              <td class="py-2.5">{{ formatDateTime(detail.payment_expires_at) }}</td>
            </tr>
          </tbody>
        </table>

        <table v-if="detail.status_histories.length" class="w-full border-collapse text-sm">
          <caption class="sr-only">Status history for order {{ detail.order_number }}</caption>
          <thead>
            <tr class="border-b border-white/20 text-left text-xs uppercase tracking-[0.12em] text-white/60">
              <th scope="col" class="py-2 pr-3 font-semibold">Status</th>
              <th scope="col" class="py-2 pr-3 font-semibold">Note</th>
              <th scope="col" class="py-2 text-right font-semibold">When</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="history in detail.status_histories" :key="history.id" class="border-b border-white/10">
              <td class="py-2.5 pr-3 font-semibold">{{ history.status }}</td>
              <td class="py-2.5 pr-3 text-white/75">{{ history.note ?? "-" }}</td>
              <td class="py-2.5 text-right text-white/70">{{ formatDateTime(history.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </article>
</template>
