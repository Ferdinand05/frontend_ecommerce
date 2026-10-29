<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import axios from "axios";
import { Check, ShoppingBag } from "@lucide/vue";
import { getApiErrorMessage } from "@/api/errors";
import { useProductQuery } from "@/api/features/products/product.queries";
import { useAddCartItemMutation } from "@/api/features/cart/cart.queries";
import { useAuthStore } from "@/stores/auth";
import { formatIDR } from "@/lib/format";
import type { Variant } from "@/api/features/products/product.types";

const route = useRoute();
const authStore = useAuthStore();

const productId = computed(() => (typeof route.params.id === "string" ? route.params.id : null));
const { data: product, isPending, isError, error, refetch } = useProductQuery(() => productId.value);
const { mutate: addToCart, isPending: isAdding, error: addError } = useAddCartItemMutation();

const isNotFound = computed(() => axios.isAxiosError(error.value) && error.value.response?.status === 404);

const addedVariantId = ref<string | null>(null);

const activeVariants = computed<Variant[]>(() => product.value?.variants.filter((variant) => variant.is_active) ?? []);

const priceRange = computed(() => {
  const prices = [...new Set(activeVariants.value.map((variant) => variant.price))].sort((a, b) => Number(a) - Number(b));
  if (!prices.length) return "Price unavailable";
  const lowest = formatIDR(prices[0]);
  if (prices.length === 1) return lowest;
  return `${lowest} to ${formatIDR(prices[prices.length - 1])}`;
});

const productImages = computed(() => product.value?.images.filter((image) => !image.url.includes("/variants/")) ?? []);

// Varian memakai nama produk sebagai prefix, contoh "Cargo Pants Black".
function variantLabel(name: string) {
  const prefix = `${product.value?.name ?? ""} `;
  return name.startsWith(prefix) ? name.slice(prefix.length) : name;
}

function stockLeft(variant: Variant) {
  if (!variant.inventory) return null;
  return variant.inventory.quantity - variant.inventory.reserved_quantity;
}

function handleAdd(variant: Variant) {
  addedVariantId.value = null;
  addToCart(variant.id, {
    onSuccess: () => {
      addedVariantId.value = variant.id;
    },
  });
}
</script>

<template>
  <section class="mx-auto min-h-[65vh] max-w-[1200px] px-4 py-14 text-white sm:px-6 lg:px-10 lg:py-20" aria-labelledby="product-title">
    <nav class="text-xs text-white/60" aria-label="Breadcrumb">
      <RouterLink class="hover:text-white" to="/#collection">The collection</RouterLink>
      <span class="mx-2">/</span>
      <span class="text-white/85">{{ product?.category.name ?? "Product" }}</span>
    </nav>

    <div v-if="isPending" class="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr]" aria-live="polite">
      <div class="aspect-[4/5] animate-pulse bg-white/10 motion-reduce:animate-none"></div>
      <div class="grid content-start gap-4">
        <div class="h-10 w-2/3 animate-pulse bg-white/10 motion-reduce:animate-none"></div>
        <div class="h-6 w-1/3 animate-pulse bg-white/10 motion-reduce:animate-none"></div>
        <div class="h-24 w-full animate-pulse bg-white/10 motion-reduce:animate-none"></div>
      </div>
    </div>

    <div v-else-if="isError" class="mt-8 grid gap-4 border-y border-white/15 py-12">
      <h1 id="product-title" class="font-heading text-2xl font-bold">
        {{ isNotFound ? "This piece is not on the shelf." : "This piece could not be loaded." }}
      </h1>
      <p class="max-w-[52ch] text-sm leading-6 text-white/75">
        {{
          isNotFound
            ? "The catalogue no longer lists this product, so there is nothing to show. Pick another piece from the collection."
            : "The store server did not answer the request for this product, so its details are missing for now."
        }}
      </p>
      <div class="flex flex-wrap gap-3">
        <button
          v-if="!isNotFound"
          class="inline-flex min-h-12 items-center border border-white/40 px-6 text-sm font-bold text-white transition-colors hover:border-[#F44336] hover:text-[#F44336] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]"
          type="button"
          @click="refetch()"
        >
          Try loading this piece again
        </button>
        <RouterLink class="inline-flex min-h-12 items-center bg-ember px-6 text-sm font-bold text-white transition-colors hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" to="/#collection">Back to the collection</RouterLink>
      </div>
    </div>

    <div v-else-if="!product" class="mt-8 grid gap-4 border-y border-white/15 py-12">
      <h1 id="product-title" class="font-heading text-2xl font-bold">This piece is not on the shelf.</h1>
      <p class="max-w-[52ch] text-sm leading-6 text-white/75">
        The catalogue no longer lists this product, so there is nothing to show. Pick another piece from the collection.
      </p>
      <RouterLink class="inline-flex min-h-12 w-fit items-center bg-ember px-6 text-sm font-bold text-white transition-colors hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" to="/#collection">Browse the collection</RouterLink>
    </div>

    <div v-else class="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
      <div class="grid gap-4">
        <figure class="aspect-[4/5] overflow-hidden bg-[#211f22]">
          <img
            v-if="productImages[0]"
            class="size-full object-cover"
            :src="productImages[0].url"
            :alt="productImages[0].alt || product.name"
            fetchpriority="high"
          />
          <p v-else class="grid size-full place-items-center text-xs tracking-[0.08em] text-white/55">No photo yet</p>
        </figure>
        <ul v-if="productImages.length > 1" class="grid grid-cols-4 gap-3" aria-label="More photos of this product">
          <li v-for="image in productImages.slice(1)" :key="image.id">
            <img class="aspect-[4/5] w-full object-cover" :src="image.url" :alt="image.alt || product.name" loading="lazy" />
          </li>
        </ul>
      </div>

      <div class="grid content-start gap-6">
        <div>
          <RouterLink
            class="text-xs font-bold uppercase tracking-[0.16em] text-[#ff958e] hover:text-white"
            :to="{ path: '/', hash: '#collection', query: { category: product.category.slug } }"
            >{{ product.category.name }}</RouterLink
          >
          <h1 id="product-title" class="mt-3 font-heading text-[clamp(30px,4vw,48px)] font-extrabold leading-[0.98] tracking-[-0.04em]">{{ product.name }}</h1>
          <p class="mt-3 text-lg font-semibold tabular-nums text-white">
            {{ priceRange }}
            <span v-if="activeVariants.length > 1" class="text-sm font-normal text-white/70">across {{ activeVariants.length }} variants</span>
          </p>
        </div>

        <p v-if="product.description" class="max-w-[58ch] text-sm leading-6 text-white/80">{{ product.description }}</p>

        <div>
          <h2 class="font-heading text-sm font-bold uppercase tracking-[0.12em] text-white/70">Variants</h2>
          <ul class="mt-4 grid gap-3">
            <li v-for="variant in activeVariants" :key="variant.id" class="grid gap-3 border border-white/15 p-3 sm:grid-cols-[72px_1fr_auto] sm:items-center">
              <img
                v-if="variant.images?.[0]"
                class="aspect-[4/5] w-full object-cover sm:w-18"
                :src="variant.images[0].url"
                :alt="variant.images[0].alt || variantLabel(variant.name)"
                loading="lazy"
              />
              <div class="min-w-0">
                <p class="font-heading text-base font-bold">{{ variantLabel(variant.name) }}</p>
                <p class="mt-0.5 text-xs text-white/60">{{ variant.sku }}</p>
                <p class="mt-1 text-sm font-semibold tabular-nums">{{ formatIDR(variant.price) }}</p>
                <p v-if="stockLeft(variant) !== null" class="mt-1 text-xs text-white/60">{{ stockLeft(variant) }} in stock</p>
              </div>
              <div class="grid gap-2 sm:justify-items-end">
                <button
                  v-if="authStore.isAuthenticated"
                  class="inline-flex min-h-11 items-center justify-center gap-2 bg-ember px-4 text-sm font-bold text-white transition-colors hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336] disabled:cursor-not-allowed disabled:opacity-60"
                  type="button"
                  :disabled="isAdding"
                  :aria-label="`Add ${variantLabel(variant.name)} to cart`"
                  @click="handleAdd(variant)"
                >
                  <ShoppingBag :size="17" aria-hidden="true" />
                  {{ isAdding ? "Adding" : "Add to cart" }}
                </button>
                <RouterLink
                  v-else
                  class="inline-flex min-h-11 items-center justify-center gap-2 border border-white/40 px-4 text-sm font-bold text-white transition-colors hover:border-[#F44336] hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]"
                  :to="{ path: '/login', query: { redirect: `/product/${product.id}` } }"
                  >Sign in to add to cart</RouterLink
                >
                <p v-if="addedVariantId === variant.id" class="flex items-center gap-1.5 text-xs font-semibold text-[#9be3a1]">
                  <Check :size="14" aria-hidden="true" />In your bag
                </p>
              </div>
            </li>
          </ul>
        </div>

        <p v-if="addError" class="text-sm text-[#ff958e]" role="alert">{{ getApiErrorMessage(addError) }}</p>
        <p v-if="addedVariantId" class="text-sm text-white/80">
          <RouterLink class="font-semibold text-white underline underline-offset-4" to="/cart">Go to your bag</RouterLink> to review the piece.
        </p>
      </div>
    </div>
  </section>
</template>
