<script setup lang="ts">
import { Clock3, FileText } from '@lucide/vue'
import { orderHistory } from '@/data/account'

const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })

function printInvoice() {
  window.print()
}
</script>

<template>
  <section aria-labelledby="history-title">
    <h2 id="history-title" class="font-heading text-2xl font-bold">Order history<span class="text-[#F44336]">.</span></h2>
    <p class="mt-1 text-sm text-white/70">Past orders, all in one place.</p>
    <div v-if="orderHistory.length" class="mt-6 divide-y divide-white/15 border-y border-white/15">
      <article v-for="order in orderHistory" :key="order.id" class="flex flex-wrap items-center justify-between gap-4 py-5">
        <div class="min-w-0">
          <h3 class="font-heading text-lg font-bold">{{ order.id }}</h3>
          <p class="mt-1 text-xs text-white/65">{{ order.placedAt }} · {{ order.items.map((item) => item.name).join(', ') }}</p>
          <p class="mt-2 text-sm font-semibold tabular-nums">{{ formatter.format(order.total) }}</p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <span class="inline-flex items-center gap-2 border border-white/20 px-3 py-1.5 text-xs font-semibold"><Clock3 :size="14" aria-hidden="true" />{{ order.status }}</span>
          <button class="inline-flex min-h-11 items-center gap-2 border border-white/35 px-3 text-xs font-semibold hover:border-[#F44336] hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]" type="button" :aria-label="`Print invoice for ${order.id}`" @click="printInvoice">
            <FileText :size="15" aria-hidden="true" /> Print invoice
          </button>
        </div>
      </article>
    </div>
    <p v-else class="mt-6 border-y border-white/15 py-10 text-sm text-white/70">No past orders yet. Your completed orders will be kept here.</p>
  </section>
</template>
