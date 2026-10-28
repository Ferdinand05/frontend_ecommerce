<script setup lang="ts">
import { RouterLink } from "vue-router";

// Tautan resmi belum tersedia, jadi channel ditampilkan sebagai label saja, bukan link.
const socials = ["Instagram", "TikTok", "Facebook"];
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
          <h2 class="font-heading text-sm font-bold uppercase tracking-[0.12em]">Social</h2>
          <ul class="mt-4 grid gap-3 text-sm text-white/80" aria-label="Social channels">
            <li v-for="social in socials" :key="social">{{ social }}</li>
          </ul>
          <p class="mt-4 text-xs leading-5 text-white/55">Official account links are not published yet.</p>
        </div>
      </div>
      <div class="flex flex-col gap-2 pt-5 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Bread & Circus.</span>
        <span>Prices in Indonesian rupiah, straight from the catalogue.</span>
      </div>
    </div>
  </footer>
</template>
