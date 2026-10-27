<script setup lang="ts">
import { RouterLink } from "vue-router";
import { computed } from "vue";
import { useCategoriesQuery } from "@/api/features/categories/category.queries";

const { data: categoryData } = useCategoriesQuery();
const categories = computed(() => categoryData.value ?? []);
</script>

<template>
  <footer class="border-t border-white/15 bg-[#0F0F11] text-white">
    <div class="mx-auto max-w-[1440px] px-5 pb-7 pt-14 sm:px-8 lg:px-12">
      <div class="grid gap-12 border-b border-white/15 pb-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div class="max-w-sm">
          <div class="flex items-center gap-4">
            <RouterLink class="inline-flex shrink-0" to="/" aria-label="Bread & Circus home"><img class="h-24 w-auto object-contain object-left" src="/img/logo.jfif" alt="Bread & Circus" loading="lazy" /></RouterLink>
            <p class="max-w-[26ch] text-sm leading-6 text-white/80">Unisex streetwear with editorial staging. Product photos and prices come from the live catalogue.</p>
          </div>
          <p class="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-[#ff7770]">Feed your style. Enjoy the show.</p>
        </div>
        <div>
          <h2 class="font-heading text-sm font-bold uppercase tracking-[0.12em]">The shop</h2>
          <nav class="mt-4 grid gap-3 text-sm text-white/80" aria-label="Shop links">
            <RouterLink class="w-fit hover:text-white" to="/#collection">The collection</RouterLink>
            <RouterLink class="w-fit hover:text-white" to="/#point-of-view">Point of view</RouterLink>
            <RouterLink class="w-fit hover:text-white" to="/cart">Your bag</RouterLink>
          </nav>
        </div>
        <div>
          <h2 class="font-heading text-sm font-bold uppercase tracking-[0.12em]">Categories</h2>
          <nav class="mt-4 grid gap-3 text-sm text-white/80" aria-label="Category links">
            <RouterLink v-for="category in categories" :key="category.id" class="w-fit hover:text-white" :to="{ path: '/', hash: '#collection', query: { category: category.slug } }">{{ category.name }}</RouterLink>
            <RouterLink class="w-fit hover:text-white" to="/#collection">Browse all</RouterLink>
          </nav>
        </div>
      </div>
      <div class="flex flex-col gap-2 pt-5 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Bread & Circus.</span>
        <span>Prices in Indonesian rupiah, straight from the catalogue.</span>
      </div>
    </div>
  </footer>
</template>
