<script setup lang="ts">
import { RouterLink } from "vue-router";
import { computed, ref } from "vue";
import { ChevronDown, LogOut, Menu, ShoppingBag, UserRound, X } from "@lucide/vue";
import { useCart } from "@/stores/cart";
import { useAuthStore } from "@/stores/auth";
import { useLogoutMutation } from "@/api/features/auth/auth.queries";

const { totalItems } = useCart();
const menuOpen = ref(false);
const cartLabel = computed(() => `${totalItems.value} ${totalItems.value === 1 ? "item" : "items"} in bag`);

const authStore = useAuthStore();

const { mutate, isPending } = useLogoutMutation();
const logout = () => {
  mutate({ refresh_token: authStore.refreshToken ?? "" });
  menuOpen.value = false;
};
</script>

<template>
  <div class="bg-[#F44336] px-4 py-2 text-center text-xs font-bold tracking-[0.12em] text-white sm:text-sm">FEED YOUR STYLE. ENJOY THE SHOW.</div>
  <header class="sticky top-0 z-30 border-b border-white/15 bg-[#0F0F11] text-white">
    <div class="mx-auto flex min-h-19 max-w-360 items-center gap-4 px-4 sm:px-6 lg:px-10">
      <button class="inline-flex size-11 items-center justify-center text-white md:hidden" type="button" :aria-label="menuOpen ? 'Close navigation' : 'Open navigation'" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
        <X v-if="menuOpen" :size="22" aria-hidden="true" /><Menu v-else :size="22" aria-hidden="true" />
      </button>
      <RouterLink class="shrink-0 font-heading text-[21px] font-extrabold tracking-[-0.06em] sm:text-2xl" to="/" aria-label="Bread & Circus home">BREAD <span class="text-[#F44336]">&</span> CIRCUS</RouterLink>
      <nav class="ml-7 hidden items-center gap-7 text-sm font-semibold md:flex" aria-label="Shop navigation">
        <RouterLink class="transition-colors hover:text-[#F44336]" to="/#collection">Shop all</RouterLink>
        <details class="group relative">
          <summary class="flex min-h-11 cursor-pointer list-none items-center gap-2 transition-colors hover:text-[#F44336] focus-visible:outline-2 focus-visible:outline-[#F44336]">
            Categories <ChevronDown :size="16" class="transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div class="absolute left-0 top-full z-40 min-w-44 border border-white/20 bg-[#0F0F11] py-2 shadow-lg">
            <RouterLink
              v-for="category in ['Tops', 'Outerwear', 'Bottoms']"
              :key="category"
              class="block px-4 py-3 text-sm hover:bg-white/10 hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]"
              :to="{ path: '/', hash: '#collection', query: { category } }"
              >{{ category }}</RouterLink
            >
          </div>
        </details>
        <RouterLink class="transition-colors hover:text-[#F44336]" to="/#manifesto">Our manifesto</RouterLink>
      </nav>
      <div class="ml-auto flex items-center gap-1 sm:gap-3">
        <RouterLink v-if="!authStore.isAuthenticated" class="hidden min-h-11 items-center px-2 text-sm font-semibold hover:text-[#F44336] focus-visible:outline-2 focus-visible:outline-[#F44336] sm:inline-flex" to="/login"
          >Sign in</RouterLink
        >
        <details v-if="authStore.isAuthenticated" class="group relative">
          <summary class="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 px-2 text-sm font-semibold hover:text-[#F44336] focus-visible:outline-2 focus-visible:outline-[#F44336]">
            <UserRound :size="19" aria-hidden="true" /><span class="hidden sm:inline">{{ authStore.user?.first_name }} {{ authStore.user?.last_name ?? "" }}</span><ChevronDown :size="16" class="hidden transition-transform group-open:rotate-180 sm:inline" aria-hidden="true" />
          </summary>
          <div class="absolute right-0 top-full z-40 mt-1 min-w-56 border border-white/20 bg-[#0F0F11] py-2 shadow-lg">
            <RouterLink class="flex min-h-11 items-center px-4 text-sm text-white/80 hover:bg-white/10 hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]" to="/account">Account details</RouterLink>
            <button class="flex min-h-11 w-full items-center gap-2 border-t border-white/15 px-4 text-sm text-white/80 hover:bg-white/10 hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]" type="button" @click="logout">
              <LogOut :size="16" aria-hidden="true" /> Sign out
            </button>
          </div>
        </details>
        <RouterLink
          class="group relative inline-flex min-h-11 items-center gap-2 border border-white/40 px-3 text-sm font-bold transition-colors hover:border-[#F44336] hover:bg-[#F44336] focus-visible:outline-2 focus-visible:outline-[#F44336] sm:px-4"
          to="/cart"
          :aria-label="cartLabel"
        >
          <ShoppingBag :size="19" aria-hidden="true" />
          <span class="hidden sm:inline">Bag</span>
          <span class="grid min-w-5 place-items-center bg-[#F44336] px-1 text-xs leading-5 text-white group-hover:bg-[#0F0F11]">{{ totalItems }}</span>
        </RouterLink>
      </div>
    </div>
    <nav v-if="menuOpen" class="grid gap-1 border-t border-white/15 px-5 py-3 md:hidden" aria-label="Mobile shop navigation">
      <RouterLink class="min-h-11 py-3 text-sm font-semibold" to="/#collection" @click="menuOpen = false">Shop all</RouterLink>
      <p class="pt-3 text-xs font-bold uppercase tracking-[0.12em] text-white/65">Categories</p>
      <RouterLink v-for="category in ['Tops', 'Outerwear', 'Bottoms']" :key="category" class="min-h-11 py-3 pl-3 text-sm font-semibold" :to="{ path: '/', hash: '#collection', query: { category } }" @click="menuOpen = false">{{
        category
      }}</RouterLink>
      <RouterLink class="min-h-11 py-3 text-sm font-semibold" to="/#manifesto" @click="menuOpen = false">Our manifesto</RouterLink>
      <RouterLink v-if="!authStore.isAuthenticated" class="min-h-11 py-3 text-sm font-semibold" to="/login" @click="menuOpen = false">Sign in</RouterLink>
      <details v-else class="group">
        <summary class="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 py-3 text-sm font-semibold">
          <UserRound :size="17" aria-hidden="true" />{{ authStore.user?.first_name }} {{ authStore.user?.last_name ?? "" }}<ChevronDown :size="16" class="transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div class="grid gap-1 border-l border-white/15 pl-3">
          <RouterLink class="min-h-11 py-3 text-sm font-semibold" to="/account" @click="menuOpen = false">Account details</RouterLink>
          <button class="inline-flex min-h-11 items-center gap-2 py-3 text-left text-sm font-semibold" type="button" @click="logout">
            <LogOut :size="17" aria-hidden="true" />Sign out
          </button>
        </div>
      </details>
    </nav>
  </header>
</template>
