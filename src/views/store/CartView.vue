<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Minus, Plus, Trash2 } from '@lucide/vue'
import { useCart } from '@/stores/cart'
import { formatIDR } from '@/lib/format'

const { items, subtotal, remove, increase, decrease, clear } = useCart()
</script>

<template>
  <section class="mx-auto min-h-[65vh] max-w-[1200px] px-4 py-14 text-white sm:px-6 lg:px-10 lg:py-20" aria-labelledby="cart-title">
    <div class="flex flex-wrap items-end justify-between gap-4 border-b border-white/20 pb-6">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.16em] text-[#ff958e]">Your picks</p>
        <h1 id="cart-title" class="mt-2 font-heading text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">Your bag<span class="text-[#F44336]">.</span></h1>
      </div>
      <p class="text-sm text-white/80">{{ items.length }} {{ items.length === 1 ? 'piece' : 'pieces' }} selected</p>
    </div>

    <div v-if="items.length" class="grid gap-10 py-8 lg:grid-cols-[1fr_320px]">
      <ul class="divide-y divide-white/15">
        <li v-for="item in items" :key="item.key" class="grid grid-cols-[76px_1fr_auto] gap-4 py-5 sm:grid-cols-[100px_1fr_auto]">
          <img
            v-if="item.imageUrl"
            class="aspect-[4/5] w-full object-cover"
            :src="item.imageUrl"
            :alt="item.name"
            loading="lazy"
          />
          <div v-else class="grid aspect-[4/5] place-items-center bg-[#211f22] text-center text-[10px] text-white/70">No photo yet</div>
          <div class="min-w-0 py-1">
            <h2 class="font-heading text-lg font-bold">{{ item.name }}</h2>
            <p class="mt-1 text-sm text-white/75">{{ item.variantName }}</p>
            <div class="mt-3 flex items-center gap-2" :aria-label="`Quantity controls for ${item.name}`">
              <button class="grid size-11 place-items-center border border-white/35 text-white hover:border-[#F44336] hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]" type="button" :aria-label="`Decrease quantity of ${item.name}`" @click="decrease(item.key)">
                <Minus :size="16" aria-hidden="true" />
              </button>
              <span class="min-w-8 text-center text-sm tabular-nums" :aria-label="`Quantity ${item.qty}`">{{ item.qty }}</span>
              <button class="grid size-11 place-items-center border border-white/35 text-white hover:border-[#F44336] hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]" type="button" :aria-label="`Increase quantity of ${item.name}`" @click="increase(item.key)">
                <Plus :size="16" aria-hidden="true" />
              </button>
            </div>
            <button class="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#ff958e] underline underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-[#F44336]" type="button" :aria-label="`Remove ${item.name} from bag`" @click="remove(item.key)">
              <Trash2 :size="16" aria-hidden="true" /> Remove
            </button>
          </div>
          <p class="pt-1 text-right text-sm font-semibold tabular-nums">{{ formatIDR(Number(item.price) * item.qty) }}</p>
        </li>
      </ul>

      <aside class="h-fit border border-white/20 p-5 sm:p-6" aria-label="Order summary">
        <h2 class="font-heading text-xl font-bold">Summary</h2>
        <div class="mt-5 flex justify-between gap-4 border-t border-white/15 pt-4 text-sm"><span>Subtotal</span><span class="font-semibold tabular-nums">{{ formatIDR(subtotal) }}</span></div>
        <p class="mt-3 text-xs leading-5 text-white/70">Shipping and payment details appear at checkout.</p>
        <button class="mt-6 min-h-12 w-full cursor-not-allowed bg-white/15 px-4 text-sm font-bold text-white/60" type="button" disabled aria-describedby="checkout-status">Checkout</button>
        <p id="checkout-status" class="mt-2 text-xs leading-5 text-white/70">Checkout is being prepared. Your bag is saved while you shop.</p>
        <button class="mt-3 min-h-11 w-full border border-white/40 px-4 text-sm font-bold hover:border-[#F44336] hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]" type="button" @click="clear">Clear bag</button>
      </aside>
    </div>

    <div v-else class="grid justify-items-start gap-4 py-16">
      <p class="font-heading text-2xl font-bold">Your bag is taking a breather.</p>
      <p class="max-w-md text-sm leading-6 text-white/75">Add a piece from the collection and it will appear here.</p>
      <RouterLink class="mt-2 inline-flex min-h-12 items-center bg-ember px-5 text-sm font-bold text-white hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" to="/#collection">Browse the collection</RouterLink>
    </div>
  </section>
</template>
