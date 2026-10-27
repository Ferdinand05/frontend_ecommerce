<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <main class="flex min-h-screen flex-col items-center justify-center bg-[#f4f1ef] px-5 py-8 sm:py-10">
    <RouterLink class="mb-6 font-heading text-[23px] font-extrabold tracking-[-0.06em] text-[#201b1b]" to="/">Bread <span class="text-ember">&</span> Circus</RouterLink>
    <RouterView />
    <p class="mt-5 text-xs text-[#635b5a]">Feed your style, enjoy the show.</p>
  </main>
</template>
