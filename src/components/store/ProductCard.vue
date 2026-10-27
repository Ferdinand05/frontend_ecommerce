<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ShoppingCart } from "@lucide/vue";
import { formatIDR } from "@/lib/format";
import type { Product } from "@/api/features/products/product.types";

const props = defineProps<{ product: Product }>();
const emit = defineEmits<{ addToCart: [payload: { productId: string; variantId: string }] }>();

const activeVariants = computed(() => props.product.variants.filter((variant) => variant.is_active));
const selectedVariantId = ref<string>("");

watch(
  activeVariants,
  (variants) => {
    if (!variants.some((variant) => variant.id === selectedVariantId.value)) {
      selectedVariantId.value = variants[0]?.id ?? "";
    }
  },
  { immediate: true },
);

const selectedVariant = computed(() => activeVariants.value.find((variant) => variant.id === selectedVariantId.value));

const prices = computed(() => activeVariants.value.map((variant) => variant.price));
const priceLabel = computed(() => {
  if (!prices.value.length) return "Price unavailable";
  const unique = [...new Set(prices.value)];
  if (unique.length === 1) return formatIDR(unique[0]);
  const sorted = [...unique].sort((a, b) => Number(a) - Number(b));
  return `${formatIDR(sorted[0])} to ${formatIDR(sorted[sorted.length - 1])}`;
});

const coverImage = computed(() =>
  props.product.images.find((image) => image.url.includes(`/variants/${selectedVariantId.value}/`))
    ?? selectedVariant.value?.images?.[0]
    ?? props.product.images[0],
);

// Varian dari API memakai nama produk sebagai prefix, contoh "Cargo Pants Black".
const variantLabel = (name: string) => {
  const prefix = `${props.product.name} `;
  return name.startsWith(prefix) ? name.slice(prefix.length) : name;
};

function addToCart() {
  if (!selectedVariant.value) return;
  emit("addToCart", { productId: props.product.id, variantId: selectedVariant.value.id });
}
</script>

<template>
  <article class="group grid min-w-0 grid-rows-[auto_1fr]">
    <div class="relative aspect-[4/5] overflow-hidden bg-[#211f22]">
      <img
        v-if="coverImage"
        class="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
        :src="coverImage.url"
        :alt="coverImage.alt || product.name"
        loading="lazy"
      />
      <p v-else class="grid size-full place-items-center text-xs tracking-[0.08em] text-white/55">No photo yet</p>
      <span class="absolute bottom-3 right-3 bg-[#F8F8F8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#0F0F11]">{{ product.category.name }}</span>
    </div>
    <div class="grid grid-rows-[minmax(3.5rem,auto)_auto_auto_1fr_auto] border-b border-white/15 pb-4 pt-4">
      <h3 class="line-clamp-2 font-heading text-lg font-bold leading-tight tracking-[-0.025em] text-white">{{ product.name }}</h3>
      <p class="flex items-start text-sm font-semibold tabular-nums text-white">{{ priceLabel }}</p>
      <p class="mt-1 line-clamp-2 text-sm leading-5 text-white/65">{{ product.description }}</p>
      <div v-if="activeVariants.length > 1" class="mt-3 flex flex-wrap gap-2" role="group" :aria-label="`Choose a variant for ${product.name}`">
        <button
          v-for="variant in activeVariants"
          :key="variant.id"
          class="min-h-9 border px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]"
          :class="selectedVariantId === variant.id ? 'border-[#9C27B0] bg-[#9C27B0] text-white' : 'border-white/25 text-white/80 hover:border-white hover:text-white'"
          :aria-pressed="selectedVariantId === variant.id"
          type="button"
          @click="selectedVariantId = variant.id"
        >
          {{ variantLabel(variant.name) }}
        </button>
      </div>
      <div class="flex items-center justify-end text-xs text-white/80">
        <span>{{ activeVariants.length }} {{ activeVariants.length === 1 ? "variant" : "variants" }}</span>
      </div>
      <button
        class="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-ember px-4 text-sm font-bold text-white transition-colors hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]"
        type="button"
        :disabled="!selectedVariant"
        :aria-label="`Add ${product.name} to cart`"
        @click="addToCart"
      >
        <ShoppingCart :size="17" aria-hidden="true" />Add to cart
      </button>
    </div>
  </article>
</template>
