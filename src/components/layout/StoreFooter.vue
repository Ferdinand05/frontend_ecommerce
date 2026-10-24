<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="border-t border-white/15 bg-[#0F0F11] text-white">
    <div class="mx-auto max-w-[1440px] px-5 pb-7 pt-14 sm:px-8 lg:px-12">
      <div class="grid gap-12 border-b border-white/15 pb-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div class="max-w-sm">
          <RouterLink class="font-heading text-2xl font-extrabold tracking-[-0.06em]" to="/">BREAD <span class="text-[#F44336]">&</span> CIRCUS</RouterLink>
          <p class="mt-4 max-w-xs text-sm leading-6 text-white/80">Everyday essentials with main-tent energy. Made for your life off-script.</p>
          <p class="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-[#ff7770]">Feed your style. Enjoy the show.</p>
        </div>
        <div>
          <h2 class="font-heading text-sm font-bold uppercase tracking-[0.12em]">The shop</h2>
          <nav class="mt-4 grid gap-3 text-sm text-white/80" aria-label="Shop links">
            <RouterLink class="w-fit hover:text-white" to="/#collection">Shop all</RouterLink>
            <RouterLink class="w-fit hover:text-white" to="/#collection">New pieces</RouterLink>
            <RouterLink class="w-fit hover:text-white" to="/#collection">Browse categories</RouterLink>
          </nav>
        </div>
        <div>
          <h2 class="font-heading text-sm font-bold uppercase tracking-[0.12em]">Your account</h2>
          <nav class="mt-4 grid gap-3 text-sm text-white/80" aria-label="Account links">
            <RouterLink class="w-fit hover:text-white" to="/login">Sign in</RouterLink>
            <RouterLink class="w-fit hover:text-white" to="/register">Create account</RouterLink>
          </nav>
        </div>
        <div>
          <h2 class="font-heading text-sm font-bold uppercase tracking-[0.12em]">The fine print</h2>
          <p class="mt-4 max-w-xs text-sm leading-6 text-white/80">Demo storefront. Orders, payments, and customer support are not connected.</p>
          <a class="mt-5 inline-flex min-h-11 items-center border border-white/40 px-3 text-xs font-semibold hover:border-[#9C27B0] hover:text-[#e2a5eb] focus-visible:outline-2 focus-visible:outline-[#F44336]" href="https://www.instagram.com/" aria-label="Visit Instagram" target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </div>
      <div class="flex flex-col gap-2 pt-5 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Bread & Circus. Demo storefront.</span>
        <span>Built for the everyday and the entrance.</span>
      </div>
    </div>
  </footer>
</template>
