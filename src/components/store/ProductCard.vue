<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { formatIDR } from "@/lib/format";
import type { Product } from "@/api/features/products/product.types";

const props = defineProps<{ product: Product }>();

const activeVariants = computed(() => props.product.variants.filter((variant) => variant.is_active));

const priceLabel = computed(() => {
  const prices = activeVariants.value.map((variant) => variant.price);
  if (!prices.length) return "Price unavailable";
  const unique = [...new Set(prices)];
  if (unique.length === 1) return formatIDR(unique[0]);
  const sorted = [...unique].sort((a, b) => Number(a) - Number(b));
  return `${formatIDR(sorted[0])} to ${formatIDR(sorted[sorted.length - 1])}`;
});

// Gambar produk adalah entri yang bukan milik varian, jadi path URL-nya tidak punya segmen /variants/.
const coverImage = computed(() => {
  const own = props.product.images.find((image) => !image.url.includes("/variants/"));
  return own ?? props.product.images[0];
});
</script>

<template>
  <article class="group grid min-w-0 grid-rows-[auto_1fr]">
    <RouterLink
      class="relative block aspect-[4/5] overflow-hidden bg-[#211f22] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]"
      :to="{ path: `/product/${product.id}` }"
      :aria-label="`View ${product.name}`"
    >
      <img
        v-if="coverImage"
        class="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
        :src="coverImage.url"
        :alt="coverImage.alt || product.name"
        loading="lazy"
      />
      <p v-else class="grid size-full place-items-center text-xs tracking-[0.08em] text-white/55">No photo yet</p>
      <span class="absolute bottom-3 right-3 bg-[#F8F8F8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#0F0F11]">{{ product.category.name }}</span>
    </RouterLink>
    <div class="grid grid-rows-[minmax(3.5rem,auto)_auto_1fr_auto] border-b border-white/15 pb-4 pt-4">
      <h3 class="line-clamp-2 font-heading text-lg font-bold leading-tight tracking-[-0.025em] text-white">
        <RouterLink class="transition-colors hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" :to="{ path: `/product/${product.id}` }">{{ product.name }}</RouterLink>
      </h3>
      <p class="text-sm font-semibold tabular-nums text-white">{{ priceLabel }}</p>
      <p class="mt-1 line-clamp-2 text-sm leading-5 text-white/65">{{ product.description }}</p>
      <p class="mt-3 text-xs text-white/80">
        {{ activeVariants.length }} {{ activeVariants.length === 1 ? "variant" : "variants" }}
      </p>
    </div>
  </article>
</template>
