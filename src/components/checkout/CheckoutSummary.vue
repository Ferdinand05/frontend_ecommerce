<script setup lang="ts">
import { computed } from "vue";
import { Lock } from "@lucide/vue";
import type { CheckoutPreviewItem } from "@/api/features/checkout/checkout.types";
import { formatIDR } from "@/lib/format";

const props = defineProps<{
  items: CheckoutPreviewItem[];
  subtotal: string;
  shippingCost: number | null;
  placing: boolean;
  placeStage: "idle" | "creating" | "paying";
  error: string;
  canPlaceOrder: boolean;
}>();
const emit = defineEmits<{ placeOrder: [] }>();

const total = computed(() => Number(props.subtotal) + (props.shippingCost ?? 0));
const buttonLabel = computed(() => {
  if (props.placeStage === "creating") return "Saving your order…";
  if (props.placeStage === "paying") return "Opening payment…";
  return "Pay now";
});
</script>

<template>
  <aside class="grid gap-5 border border-white/20 p-5 sm:p-6" aria-labelledby="checkout-summary-title">
    <h2 id="checkout-summary-title" class="font-heading text-xl font-bold">Order summary</h2>

    <ul class="grid gap-3 border-b border-white/15 pb-4">
      <li v-for="item in items" :key="item.product_variant_id" class="flex items-baseline justify-between gap-3 text-sm">
        <span class="min-w-0">
          <span class="block truncate">{{ item.product_name }}</span>
          <span class="text-xs text-white/70">{{ item.variant_name }} · {{ item.quantity }}×</span>
        </span>
        <span class="shrink-0 tabular-nums">{{ formatIDR(item.subtotal) }}</span>
      </li>
    </ul>

    <dl class="grid gap-2 text-sm">
      <div class="flex justify-between gap-3">
        <dt>Subtotal</dt>
        <dd class="tabular-nums">{{ formatIDR(subtotal) }}</dd>
      </div>
      <div class="flex justify-between gap-3">
        <dt>Shipping</dt>
        <dd class="tabular-nums">{{ shippingCost === null ? "Not calculated yet" : formatIDR(shippingCost) }}</dd>
      </div>
      <div class="flex justify-between gap-3 border-t border-white/15 pt-3 text-base font-bold">
        <dt>Total</dt>
        <dd id="checkout-summary-total" class="tabular-nums">{{ formatIDR(total) }}</dd>
      </div>
    </dl>

    <p v-if="error" class="border-l-2 border-[#F44336] pl-4 text-sm text-[#ff958e]" role="alert">{{ error }}</p>

    <button
      class="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-ember px-5 text-sm font-bold text-white transition-colors hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336] disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/60"
      type="button"
      :disabled="!canPlaceOrder || placing"
      @click="emit('placeOrder')"
    >
      <Lock :size="15" aria-hidden="true" />
      {{ buttonLabel }}
    </button>

    <p class="text-xs leading-5 text-white/70">
      Xendit payment opens once the order is saved. Unpaid orders are cancelled automatically.
    </p>
  </aside>
</template>
