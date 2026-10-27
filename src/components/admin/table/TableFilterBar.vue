<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>

<template>
  <section class="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:flex-wrap sm:items-end">
    <p class="sr-only">{{ label }}</p>
    <slot />
  </section>
</template>
