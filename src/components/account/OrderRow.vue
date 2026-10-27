<script setup lang="ts">
import { ref } from "vue";
import { ChevronDown, ChevronUp } from "@lucide/vue";
import { getApiErrorMessage } from "@/api/errors";
import { useCancelOrderMutation, useMyOrderQuery } from "@/api/features/account/account.queries";
import { formatDateTime, formatIDR } from "@/lib/format";
import type { MyOrder } from "@/api/features/account/account.types";

const props = defineProps<{ order: MyOrder }>();

const expanded = ref(false);
const { data: detail, isPending, isError, refetch } = useMyOrderQuery(() => (expanded.value ? props.order.id : null));
const { mutate: cancelOrder, isPending: isCancelling, error: cancelError } = useCancelOrderMutation();
</script>

<template>
  <article class="py-5">
    <div class="flex flex-wrap items-center justify-between gap-4">
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
          class="inline-flex min-h-11 items-center border border-white/35 px-3 text-xs font-semibold hover:border-[#F44336] hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336] disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          :disabled="isCancelling"
          @click="cancelOrder(order.id)"
        >
          {{ isCancelling ? "Cancelling" : "Cancel order" }}
        </button>
      </div>
    </div>

    <p v-if="cancelError" class="mt-3 text-sm text-[#ff958e]">{{ getApiErrorMessage(cancelError) }}</p>

    <div v-if="expanded" class="mt-5 border-l-2 border-white/15 pl-4">
      <p v-if="isPending" class="text-sm text-white/70">Loading the order detail&hellip;</p>
      <div v-else-if="isError" class="grid gap-3">
        <p class="text-sm text-white/75">The order detail did not load, so the items below are unavailable right now.</p>
        <button class="inline-flex min-h-11 w-fit items-center border border-white/40 px-4 text-sm font-semibold hover:border-[#F44336] hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]" type="button" @click="refetch()">
          Load the order detail again
        </button>
      </div>
      <div v-else-if="detail" class="grid gap-3">
        <ul class="grid gap-2">
          <li v-for="item in detail.items" :key="item.id" class="flex flex-wrap justify-between gap-3 text-sm">
            <span class="text-white/85">{{ item.product_name }} <span class="text-white/60">&middot; {{ item.variant_name }} &middot; {{ item.quantity }} pcs</span></span>
            <span class="font-semibold tabular-nums">{{ formatIDR(item.subtotal) }}</span>
          </li>
        </ul>
        <p class="text-sm text-white/70">Delivering to {{ detail.address.recipient_name }}, {{ detail.address.city }} {{ detail.address.postal_code }}</p>
      </div>
    </div>
  </article>
</template>
