<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { Minus, Plus, Trash2 } from "@lucide/vue";
import { getApiErrorMessage } from "@/api/errors";
import { useCartQuery, useClearCartMutation, useDecreaseCartItemMutation, useIncreaseCartItemMutation, useRemoveCartItemMutation } from "@/api/features/cart/cart.queries";
import { useAuthStore } from "@/stores/auth";
import { formatIDR } from "@/lib/format";

const authStore = useAuthStore();
const { data: cart, isPending, isError, error, refetch } = useCartQuery();
const { mutate: increase, error: increaseError } = useIncreaseCartItemMutation();
const { mutate: decrease, error: decreaseError } = useDecreaseCartItemMutation();
const { mutate: remove, error: removeError } = useRemoveCartItemMutation();
const { mutate: clear, error: clearError } = useClearCartMutation();

const items = computed(() => cart.value?.items ?? []);
const subtotal = computed(() => items.value.reduce((sum, item) => sum + item.quantity * Number(item.price), 0));
const mutationError = computed(() => increaseError.value ?? decreaseError.value ?? removeError.value ?? clearError.value);
</script>

<template>
  <section class="mx-auto min-h-[65vh] max-w-300 px-4 py-14 text-white sm:px-6 lg:px-10 lg:py-20" aria-labelledby="cart-title">
    <div class="flex flex-wrap items-end justify-between gap-4 border-b border-white/20 pb-6">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.16em] text-[#ff958e]">Your picks</p>
        <h1 id="cart-title" class="mt-2 font-heading text-4xl font-extrabold tracking-tighter sm:text-5xl">Your bag<span class="text-[#F44336]">.</span></h1>
      </div>
      <p v-if="authStore.isAuthenticated && !isPending && !isError" class="text-sm text-white/80">{{ items.length }} {{ items.length === 1 ? "piece" : "pieces" }} selected</p>
    </div>

    <div v-if="!authStore.isAuthenticated" class="grid justify-items-start gap-4 py-16">
      <p class="font-heading text-2xl font-bold">Your bag lives on the account.</p>
      <p class="max-w-md text-sm leading-6 text-white/75">Sign in and the pieces you pick are kept on the store server, so the bag follows you to any device.</p>
      <RouterLink
        class="mt-2 inline-flex min-h-12 items-center bg-ember px-5 text-sm font-bold text-white hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]"
        :to="{ path: '/login', query: { redirect: '/cart' } }"
        >Sign in to open your bag</RouterLink
      >
    </div>

    <div v-else-if="isPending" class="grid gap-4 py-12" aria-live="polite">
      <div class="h-24 w-full animate-pulse bg-white/10 motion-reduce:animate-none" />
      <div class="h-24 w-full animate-pulse bg-white/10 motion-reduce:animate-none" />
    </div>

    <div v-else-if="isError" class="grid gap-4 border-y border-white/15 py-12">
      <p class="font-heading text-xl font-bold">Your bag did not load.</p>
      <p class="max-w-[52ch] text-sm leading-6 text-white/75">
        The store server did not answer the request for your bag, so its contents are missing for now.
        {{ error ? getApiErrorMessage(error) : "" }}
      </p>
      <button
        class="inline-flex min-h-12 w-fit items-center border border-white/40 px-6 text-sm font-bold text-white transition-colors hover:border-[#F44336] hover:text-[#F44336] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]"
        type="button"
        @click="refetch()"
      >
        Try loading your bag again
      </button>
    </div>

    <div v-else-if="items.length" class="grid gap-10 py-8 lg:grid-cols-[1fr_320px]">
      <div>
        <p v-if="mutationError" class="mb-4 text-sm text-[#ff958e]" role="alert">
          {{ getApiErrorMessage(mutationError) }}
        </p>
        <ul class="divide-y divide-white/15">
          <li v-for="item in items" :key="item.id" class="grid grid-cols-[76px_1fr_auto] gap-4 py-5 sm:grid-cols-[100px_1fr_auto]">
            <RouterLink :to="{ path: `/product/${item.product_id}` }" class="block">
              <img v-if="item.images[0]" class="aspect-4/5 w-full object-cover" :src="item.images[0].url" :alt="item.images[0].alt || item.product_name" loading="lazy" />
              <span v-else class="grid aspect-4/5 place-items-center bg-[#211f22] text-center text-[10px] text-white/70">No photo yet</span>
            </RouterLink>
            <div class="min-w-0 py-1">
              <h2 class="font-heading text-lg font-bold">
                <RouterLink class="hover:text-[#ff958e]" :to="{ path: `/product/${item.product_id}` }">{{ item.product_name }}</RouterLink>
              </h2>
              <p class="mt-1 text-sm text-white/75">
                {{ item.name }}
              </p>
              <div class="mt-3 flex items-center gap-2" :aria-label="`Quantity controls for ${item.product_name}`">
                <button
                  class="grid size-11 place-items-center border border-white/35 text-white hover:border-[#F44336] hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]"
                  type="button"
                  :aria-label="`Decrease quantity of ${item.product_name}`"
                  @click="decrease(item.id)"
                >
                  <Minus :size="16" aria-hidden="true" />
                </button>
                <span class="min-w-8 text-center text-sm tabular-nums" :aria-label="`Quantity ${item.quantity}`">{{ item.quantity }}</span>
                <button
                  class="grid size-11 place-items-center border border-white/35 text-white hover:border-[#F44336] hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]"
                  type="button"
                  :aria-label="`Increase quantity of ${item.product_name}`"
                  @click="increase(item.id)"
                >
                  <Plus :size="16" aria-hidden="true" />
                </button>
              </div>
              <button
                class="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#ff958e] underline underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-[#F44336]"
                type="button"
                :aria-label="`Remove ${item.product_name} from bag`"
                @click="remove(item.id)"
              >
                <Trash2 :size="16" aria-hidden="true" /> Remove
              </button>
            </div>
            <p class="pt-1 text-right text-sm font-semibold tabular-nums">
              {{ formatIDR(Number(item.price) * item.quantity) }}
            </p>
          </li>
        </ul>
      </div>

      <aside class="h-fit border border-white/20 p-5 sm:p-6" aria-label="Order summary">
        <h2 class="font-heading text-xl font-bold">Summary</h2>
        <div class="mt-5 flex justify-between gap-4 border-t border-white/15 pt-4 text-sm">
          <span>Subtotal</span>
          <span class="font-semibold tabular-nums">{{ formatIDR(subtotal) }}</span>
        </div>
        <p class="mt-3 text-xs leading-5 text-white/70">Shipping and payment details are settled on the checkout page.</p>
        <RouterLink
          class="mt-6 inline-flex min-h-12 w-full items-center justify-center bg-ember px-4 text-sm font-bold text-white hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]"
          to="/checkout"
        >
          Checkout
        </RouterLink>
        <button class="mt-3 min-h-11 w-full border border-white/40 px-4 text-sm font-bold hover:border-[#F44336] hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]" type="button" @click="clear()">Clear bag</button>
      </aside>
    </div>

    <div v-else class="grid justify-items-start gap-4 py-16">
      <p class="font-heading text-2xl font-bold">Your bag is taking a breather.</p>
      <p class="max-w-md text-sm leading-6 text-white/75">Add a piece from the collection and it will appear here.</p>
      <RouterLink class="mt-2 inline-flex min-h-12 items-center bg-ember px-5 text-sm font-bold text-white hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" to="/#collection"
        >Browse the collection</RouterLink
      >
    </div>
  </section>
</template>
