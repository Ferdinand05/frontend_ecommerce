<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { Box, Clock3, UserRound } from '@lucide/vue'
import { activeOrders } from '@/data/account'
import StoreFooter from '@/components/layout/StoreFooter.vue'
import StoreHeader from '@/components/layout/StoreHeader.vue'

const route = useRoute()

const links = [
  { to: '/account', label: 'Account details', icon: UserRound, exact: true },
  { to: '/account/orders', label: 'Orders', icon: Box, count: activeOrders.length },
  { to: '/account/order-history', label: 'Order history', icon: Clock3 },
]

function isActive(link: (typeof links)[number]) {
  return link.exact ? route.path === link.to : route.path.startsWith(link.to)
}
</script>

<template>
  <div class="min-h-screen bg-[#0F0F11] font-sans text-[#F8F8F8] selection:bg-[#F44336] selection:text-white">
    <StoreHeader />
    <main class="mx-auto min-h-[70vh] max-w-300 px-4 py-12 text-white sm:px-6 lg:px-10 lg:py-16">
    <header class="border-b border-white/20 pb-7">
      <p class="text-xs font-bold uppercase tracking-[0.16em] text-[#ff958e]">Your place backstage</p>
      <h1 class="mt-2 font-heading text-4xl font-extrabold tracking-tighter sm:text-5xl">Account<span class="text-[#F44336]">.</span></h1>
      <p class="mt-3 max-w-[55ch] text-sm leading-6 text-white/75">Manage your details and keep track of every piece on its way to you.</p>
    </header>

    <div class="grid gap-10 py-8 md:grid-cols-[220px_1fr] lg:gap-16">
      <nav class="flex gap-2 overflow-x-auto border-b border-white/15 pb-3 md:block md:space-y-1 md:border-0 md:pb-0" aria-label="Account sections">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          class="inline-flex min-h-11 shrink-0 items-center gap-3 px-3 text-sm font-semibold transition-colors hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336] md:w-full"
          :class="isActive(link) ? 'bg-white/10 text-[#ff958e]' : 'text-white/75'"
          :aria-current="isActive(link) ? 'page' : undefined"
          :to="link.to"
        >
          <component :is="link.icon" :size="17" aria-hidden="true" /> {{ link.label }}
          <span v-if="'count' in link" class="ml-auto text-xs tabular-nums">{{ link.count }}</span>
        </RouterLink>
      </nav>
      <RouterView />
    </div>
    </main>
    <StoreFooter />
  </div>
</template>
