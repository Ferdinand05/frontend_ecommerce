<script setup lang="ts">
import { RouterLink } from "vue-router";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { ChevronDown, LogOut, Menu, ShieldCheck, ShoppingBag, UserRound, X } from "@lucide/vue";
import { useAuthStore } from "@/stores/auth";
import { useLogoutMutation } from "@/api/features/auth/auth.queries";
import { useCategoriesQuery } from "@/api/features/categories/category.queries";
import { useCartQuery } from "@/api/features/cart/cart.queries";

const authStore = useAuthStore();
const menuOpen = ref(false);
const megaOpen = ref(false);
const megaRoot = ref<HTMLElement | null>(null);

const { data: cartData } = useCartQuery();
const cartCount = computed(() => cartData.value?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0);
const cartLabel = computed(() => `${cartCount.value} ${cartCount.value === 1 ? "item" : "items"} in bag`);

const isAdmin = computed(() => authStore.isAuthenticated && authStore.user?.role?.name === "admin");

const { data: categoryData } = useCategoriesQuery();
const categories = computed(() => categoryData.value ?? []);

// Tiga kolom supaya menu tetap rapi kalau kategorinya bertambah.
const megaColumns = computed(() => {
  const items = categories.value;
  const columnSize = Math.ceil(items.length / 3);
  return [items.slice(0, columnSize), items.slice(columnSize, columnSize * 2), items.slice(columnSize * 2)];
});

const { mutate } = useLogoutMutation();
const logout = () => {
  mutate({ refresh_token: authStore.refreshToken ?? "" });
  menuOpen.value = false;
  megaOpen.value = false;
};

function closeMegaOnOutside(event: MouseEvent) {
  if (!megaOpen.value) return;
  if (megaRoot.value && !megaRoot.value.contains(event.target as Node)) megaOpen.value = false;
}

function closeMegaOnEscape(event: KeyboardEvent) {
  if (event.key === "Escape") megaOpen.value = false;
}

onMounted(() => {
  document.addEventListener("click", closeMegaOnOutside);
  document.addEventListener("keydown", closeMegaOnEscape);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeMegaOnOutside);
  document.removeEventListener("keydown", closeMegaOnEscape);
});
</script>

<template>
  <div class="bg-ember px-4 py-2 text-center text-xs font-bold tracking-[0.12em] text-white sm:text-sm">FEED YOUR STYLE. ENJOY THE SHOW.</div>
  <header class="sticky top-0 z-30 border-b border-white/15 bg-[#0F0F11] text-white">
    <div class="mx-auto flex min-h-19 max-w-360 items-center gap-4 px-4 sm:px-6 lg:px-10">
      <button class="inline-flex size-11 items-center justify-center text-white md:hidden" type="button" :aria-label="menuOpen ? 'Close navigation' : 'Open navigation'" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
        <X v-if="menuOpen" :size="22" aria-hidden="true" /><Menu v-else :size="22" aria-hidden="true" />
      </button>
      <RouterLink class="shrink-0 font-heading text-[21px] font-extrabold tracking-[-0.06em] sm:text-2xl" to="/" aria-label="Bread & Circus home">BREAD <span class="text-[#F44336]">&</span> CIRCUS</RouterLink>
      <nav class="ml-7 hidden items-center gap-7 text-sm font-semibold md:flex" aria-label="Shop navigation">
        <RouterLink class="transition-colors hover:text-[#F44336]" to="/#collection">The collection</RouterLink>
        <div v-if="categories.length" ref="megaRoot" class="relative">
          <button
            class="flex min-h-11 cursor-pointer items-center gap-2 transition-colors hover:text-[#F44336] focus-visible:outline-2 focus-visible:outline-[#F44336]"
            type="button"
            :aria-expanded="megaOpen"
            aria-haspopup="true"
            @click="megaOpen = !megaOpen"
          >
            Categories <ChevronDown :size="16" class="transition-transform" :class="megaOpen ? 'rotate-180' : ''" aria-hidden="true" />
          </button>
          <div
            v-if="megaOpen"
            class="absolute left-0 top-full z-40 max-h-[70vh] w-[min(92vw,1180px)] overflow-y-auto border border-white/20 bg-[#0F0F11] p-6 shadow-xl"
          >
            <div class="grid gap-x-8 gap-y-6 sm:grid-cols-3">
              <div v-for="(column, columnIndex) in megaColumns" :key="columnIndex" class="grid content-start gap-4">
                <RouterLink
                  v-for="category in column"
                  :key="category.id"
                  class="group block border-l-2 border-transparent pl-3 transition-colors hover:border-[#F44336] focus-visible:outline-2 focus-visible:outline-[#F44336]"
                  :to="{ path: '/', hash: '#collection', query: { category: category.slug } }"
                  @click="megaOpen = false"
                >
                  <span class="block font-heading text-sm font-bold text-white group-hover:text-[#ff958e]">{{ category.name }}</span>
                  <span v-if="category.description" class="mt-1 line-clamp-2 block text-xs leading-5 text-white/60">{{ category.description }}</span>
                </RouterLink>
              </div>
            </div>
            <RouterLink
              class="mt-6 inline-flex min-h-11 items-center border border-white/30 px-5 text-sm font-bold text-white transition-colors hover:border-[#F44336] hover:text-[#F44336]"
              to="/#collection"
              @click="megaOpen = false"
              >Browse all pieces</RouterLink
            >
          </div>
        </div>
        <RouterLink class="transition-colors hover:text-[#F44336]" to="/#point-of-view">Point of view</RouterLink>
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
            <RouterLink v-if="isAdmin" class="flex min-h-11 items-center gap-2 px-4 text-sm text-white/80 hover:bg-white/10 hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]" to="/admin/dashboard">
              <ShieldCheck :size="16" aria-hidden="true" />Admin dashboard
            </RouterLink>
            <button class="flex min-h-11 w-full items-center gap-2 border-t border-white/15 px-4 text-sm text-white/80 hover:bg-white/10 hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]" type="button" @click="logout">
              <LogOut :size="16" aria-hidden="true" /> Sign out
            </button>
          </div>
        </details>
        <RouterLink
          class="group relative inline-flex min-h-11 items-center gap-2 border border-white/40 px-3 text-sm font-bold transition-colors hover:border-[#F44336] hover:bg-ember focus-visible:outline-2 focus-visible:outline-[#F44336] sm:px-4"
          to="/cart"
          :aria-label="cartLabel"
        >
          <ShoppingBag :size="19" aria-hidden="true" />
          <span class="hidden sm:inline">Bag</span>
          <span v-if="authStore.isAuthenticated && cartCount" class="grid min-w-5 place-items-center bg-ember px-1 text-xs leading-5 text-white group-hover:bg-[#0F0F11]">{{ cartCount }}</span>
        </RouterLink>
      </div>
    </div>
    <nav v-if="menuOpen" class="grid gap-1 border-t border-white/15 px-5 py-3 md:hidden" aria-label="Mobile shop navigation">
      <RouterLink class="min-h-11 py-3 text-sm font-semibold" to="/#collection" @click="menuOpen = false">The collection</RouterLink>
      <template v-if="categories.length">
        <p class="pt-3 text-xs font-bold uppercase tracking-[0.12em] text-white/65">Categories</p>
        <RouterLink v-for="category in categories" :key="category.id" class="min-h-11 py-3 pl-3 text-sm font-semibold" :to="{ path: '/', hash: '#collection', query: { category: category.slug } }" @click="menuOpen = false">{{
          category.name
        }}</RouterLink>
      </template>
      <RouterLink class="min-h-11 py-3 text-sm font-semibold" to="/#point-of-view" @click="menuOpen = false">Point of view</RouterLink>
      <RouterLink v-if="!authStore.isAuthenticated" class="min-h-11 py-3 text-sm font-semibold" to="/login" @click="menuOpen = false">Sign in</RouterLink>
      <details v-else class="group">
        <summary class="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 py-3 text-sm font-semibold">
          <UserRound :size="17" aria-hidden="true" />{{ authStore.user?.first_name }} {{ authStore.user?.last_name ?? "" }}<ChevronDown :size="16" class="transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div class="grid gap-1 border-l border-white/15 pl-3">
          <RouterLink class="min-h-11 py-3 text-sm font-semibold" to="/account" @click="menuOpen = false">Account details</RouterLink>
          <RouterLink v-if="isAdmin" class="min-h-11 py-3 text-sm font-semibold" to="/admin/dashboard" @click="menuOpen = false">
            <ShieldCheck :size="17" aria-hidden="true" />Admin dashboard
          </RouterLink>
          <button class="inline-flex min-h-11 items-center gap-2 py-3 text-left text-sm font-semibold" type="button" @click="logout">
            <LogOut :size="17" aria-hidden="true" />Sign out
          </button>
        </div>
      </details>
    </nav>
  </header>
</template>
