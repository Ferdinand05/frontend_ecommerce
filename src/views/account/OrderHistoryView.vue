<script setup lang="ts">
import { computed } from 'vue'
import { useMyOrdersQuery } from '@/api/features/account/account.queries'
import OrderRow from '@/components/account/OrderRow.vue'

const { data, isPending, isError, refetch } = useMyOrdersQuery()
const pastOrders = computed(() => (data.value?.orders ?? []).filter((order) => !['PENDING', 'PAID', 'PROCESSING', 'SHIPPED'].includes(order.status)))
</script>

<template>
  <section aria-labelledby="history-title">
    <h2 id="history-title" class="font-heading text-2xl font-bold">Order history<span class="text-[#F44336]">.</span></h2>
    <p class="mt-1 text-sm text-white/70">Orders that are already closed, kept in one place.</p>

    <p v-if="isPending" class="mt-6 text-sm text-white/70">Loading your order history&hellip;</p>

    <div v-else-if="isError" class="mt-6 grid gap-3 border-y border-white/15 py-8">
      <p class="text-sm text-white/75">Your order history could not be loaded, so the list below is unavailable right now.</p>
      <button class="inline-flex min-h-11 w-fit items-center border border-white/40 px-4 text-sm font-semibold hover:border-[#F44336] hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]" type="button" @click="refetch()">
        Load my history again
      </button>
    </div>

    <div v-else-if="pastOrders.length" class="mt-6 divide-y divide-white/15 border-y border-white/15">
      <OrderRow v-for="order in pastOrders" :key="order.id" :order="order" />
    </div>

    <p v-else class="mt-6 border-y border-white/15 py-10 text-sm text-white/70">No closed orders yet. When an order is completed or cancelled, it will appear here.</p>
  </section>
</template>
