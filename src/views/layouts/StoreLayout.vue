<script setup lang="ts">
import StoreFooter from '@/components/layout/StoreFooter.vue'
import StoreHeader from '@/components/layout/StoreHeader.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-[#0F0F11] font-sans text-[#F8F8F8] selection:bg-[#F44336] selection:text-white">
    <StoreHeader />
    <main id="main-content"><RouterView /></main>
    <StoreFooter />
  </div>
</template>
