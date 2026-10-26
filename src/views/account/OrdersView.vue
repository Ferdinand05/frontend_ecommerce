<script setup lang="ts">
import { ref } from 'vue'
import { ChevronRight, CircleHelp, MapPin, PackageCheck } from '@lucide/vue'
import { activeOrders, type Order } from '@/data/account'

const notice = ref('')
const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })

function handleOrderAction(action: string, order: Order) {
  notice.value = `${action} for ${order.id} is not available yet.`
}
</script>

<template>
  <section aria-labelledby="orders-title">
    <h2 id="orders-title" class="font-heading text-2xl font-bold">Orders in the wings<span class="text-[#F44336]">.</span></h2>
    <p class="mt-1 text-sm text-white/70">A quick look at pieces on their way.</p>

    <div v-if="activeOrders.length" class="mt-6 divide-y divide-white/15 border-y border-white/15">
      <article v-for="order in activeOrders" :key="order.id" class="py-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 class="font-heading text-lg font-bold">{{ order.id }}</h3>
            <p class="mt-1 text-xs text-white/65">Placed {{ order.placedAt }}</p>
          </div>
          <span class="inline-flex items-center gap-2 border border-white/20 px-3 py-1.5 text-xs font-semibold"><PackageCheck :size="15" aria-hidden="true" />{{ order.status }}</span>
        </div>
        <ul class="mt-4 space-y-2 text-sm text-white/80">
          <li v-for="item in order.items" :key="`${order.id}-${item.productId}`" class="flex flex-wrap justify-between gap-2">
            <span>{{ item.name }} <span class="text-white/60">· {{ item.variantName }} · Qty {{ item.qty }}</span></span>
            <span class="tabular-nums">{{ formatter.format(item.price * item.qty) }}</span>
          </li>
        </ul>
        <div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
          <p class="text-sm">Order total <strong class="ml-2 tabular-nums">{{ formatter.format(order.total) }}</strong></p>
          <div class="flex flex-wrap gap-2">
            <button class="inline-flex min-h-11 items-center gap-2 border border-white/35 px-3 text-xs font-semibold hover:border-[#F44336] hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]" type="button" @click="handleOrderAction('Order details', order)">
              <ChevronRight :size="15" aria-hidden="true" /> Order details
            </button>
            <button v-if="order.status === 'Shipped'" class="inline-flex min-h-11 items-center gap-2 bg-[#F44336] px-3 text-xs font-bold hover:bg-[#d93429] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" type="button" @click="handleOrderAction('Tracking', order)">
              <MapPin :size="15" aria-hidden="true" /> Track order
            </button>
            <button v-else class="inline-flex min-h-11 items-center gap-2 border border-white/35 px-3 text-xs font-semibold hover:border-[#F44336] hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]" type="button" @click="handleOrderAction('Cancel order', order)">
              <CircleHelp :size="15" aria-hidden="true" /> Cancel order
            </button>
          </div>
        </div>
      </article>
    </div>
    <p v-else class="mt-6 border-y border-white/15 py-10 text-sm text-white/70">No orders in progress. When you place an order, it will appear here.</p>
    <p v-if="notice" class="mt-4 text-sm text-[#ff958e]" role="status" aria-live="polite">{{ notice }}</p>
  </section>
</template>
