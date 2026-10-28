<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import ProductCard from "@/components/store/ProductCard.vue";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInfiniteProductsQuery } from "@/api/features/products/product.queries";
import { useCategoriesQuery } from "@/api/features/categories/category.queries";
import type { Product } from "@/api/features/products/product.types";

const PAGE_SIZE = 12;

const route = useRoute();
const router = useRouter();
const activeCategory = ref<string>("all");

const { data: categoryData } = useCategoriesQuery();
const categories = computed(() => categoryData.value ?? []);
const activeCategoryId = computed(() =>
  activeCategory.value === "all" ? undefined : categories.value.find((category) => category.slug === activeCategory.value)?.id,
);

const {
  data: productData,
  isPending: productsPending,
  isError: productsFailed,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  refetch: refetchProducts,
} = useInfiniteProductsQuery(() => ({
  page_size: PAGE_SIZE,
  ...(activeCategoryId.value ? { category_id: activeCategoryId.value } : {}),
}));

const products = computed<Product[]>(() => productData.value?.pages.flatMap((page) => page.products) ?? []);
const totalProducts = computed(() => productData.value?.pages[0]?.meta.total ?? 0);

// The category filter is driven by the URL so header and footer links land on the right shelf.
watch(
  () => route.query.category,
  (category) => {
    activeCategory.value = typeof category === "string" ? category : "all";
  },
  { immediate: true },
);

// The select writes back to the URL so a filtered shelf can be shared or reloaded.
watch(activeCategory, (category) => {
  const current = typeof route.query.category === "string" ? route.query.category : "all";
  if (current === category) return;
  const query = { ...route.query };
  if (category === "all") delete query.category;
  else query.category = category;
  router.replace({ path: "/", hash: "#collection", query });
});

const activeCategoryName = computed(() => {
  if (activeCategory.value === "all") return "all pieces";
  return categories.value.find((category) => category.slug === activeCategory.value)?.name ?? activeCategory.value;
});

// Marquee content: live category names, so the strip always matches the catalogue.
const tickerItems = computed(() => ["Feed your style, enjoy the show.", ...categories.value.map((category) => category.name)]);
</script>

<template>
  <div>
    <section class="relative overflow-hidden border-b border-white/15">
      <div class="mx-auto grid max-w-360 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[5fr_7fr] lg:gap-14 lg:px-10 lg:py-24">
        <div>
          <p class="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[#F44336]">Editorial &amp; theatrical streetwear</p>
          <h1 class="mt-5 font-heading text-[clamp(42px,6.5vw,84px)] font-extrabold leading-[0.95] tracking-tighter text-balance text-white">
            Feed your style.<br /><span class="text-[#F44336]">Enjoy the show.</span>
          </h1>
          <p class="mt-6 max-w-[58ch] text-base leading-7 text-white/80">
            Unisex essentials meet streetwear with an editorial edge. Browse the current catalogue, with product photos and prices supplied by the store.
          </p>
          <div class="mt-9 flex flex-wrap gap-3.5">
            <RouterLink
              class="inline-flex min-h-12 items-center bg-ember px-6 text-sm font-bold text-white transition-colors hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]"
              to="/#collection"
              >Browse the collection</RouterLink
            >
            <RouterLink
              class="inline-flex min-h-12 items-center border border-white/70 px-6 text-sm font-bold text-white transition-colors hover:border-[#F44336] hover:text-[#F44336] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]"
              to="/#point-of-view"
              >Read our point of view</RouterLink
            >
          </div>
        </div>
        <figure class="group relative isolate min-h-90 overflow-hidden bg-[#1b191c] sm:min-h-115 lg:min-h-155">
          <img
            class="absolute inset-0 size-full object-cover object-[center_38%] transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transform-none"
            src="/img/hero.jfif"
            alt="Two Bread & Circus models in graphic streetwear standing backstage beneath the neon Bread & Circus sign"
            fetchpriority="high"
          />
          <div class="absolute inset-0 bg-linear-to-t from-[#0F0F11]/90 via-[#0F0F11]/15 to-[#0F0F11]/5" aria-hidden="true"></div>
          <figcaption class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
            <span class="font-heading text-xs font-bold uppercase tracking-[0.16em] text-white sm:text-sm">Backstage &middot; Main tent</span>
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- Marquee: the theatre front of the store, so it moves only as a deliberate identity cue. -->
    <div class="overflow-hidden border-b border-white/15 bg-ember text-white" aria-hidden="true">
      <div class="flex w-max whitespace-nowrap py-2.5 text-sm font-extrabold uppercase tracking-[0.12em] animate-[ticker-roll_28s_linear_infinite] motion-reduce:animate-none">
        <span v-for="n in 2" :key="n">{{ tickerItems.join(" · ") }}&nbsp;·&nbsp;</span>
      </div>
    </div>

    <section id="collection" class="mx-auto max-w-360 px-4 pb-10 pt-20 sm:px-6 lg:px-10">
      <div class="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <h2 class="font-heading text-[clamp(28px,3.4vw,40px)] font-extrabold tracking-[-0.04em] text-white">The collection</h2>
          <p class="mt-2 text-sm text-white/70">
            <template v-if="productsPending">Loading the catalogue&hellip;</template>
            <template v-else-if="productsFailed">The catalogue could not be loaded.</template>
            <template v-else>Showing {{ products.length }} of {{ totalProducts }} {{ totalProducts === 1 ? "piece" : "pieces" }}</template>
          </p>
        </div>
        <div class="grid w-full gap-2 sm:w-64">
          <label class="text-xs font-semibold text-white/70" for="collection-category">Category</label>
          <Select v-model="activeCategory">
            <SelectTrigger
              id="collection-category"
              class="min-h-11 w-full border-white/25 bg-[#0F0F11] px-3 text-white focus-visible:border-white focus-visible:ring-0"
            >
              <SelectValue placeholder="All pieces" />
            </SelectTrigger>
            <SelectContent class="border-white/20 bg-[#17171A] text-white">
              <SelectItem value="all" class="focus:bg-white/10 focus:text-white">All pieces</SelectItem>
              <SelectItem v-for="category in categories" :key="category.id" :value="category.slug" class="focus:bg-white/10 focus:text-white">
                {{ category.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div v-if="productsPending" class="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-live="polite">
        <div v-for="n in 4" :key="n" class="grid gap-3">
          <div class="aspect-[4/5] animate-pulse bg-white/10 motion-reduce:animate-none"></div>
          <div class="h-5 w-2/3 animate-pulse bg-white/10 motion-reduce:animate-none"></div>
          <div class="h-4 w-1/3 animate-pulse bg-white/10 motion-reduce:animate-none"></div>
        </div>
      </div>

      <div v-else-if="productsFailed" class="grid gap-4 border-y border-white/15 py-12">
        <p class="font-heading text-xl font-bold text-white">The catalogue did not load.</p>
        <p class="max-w-[52ch] text-sm leading-6 text-white/75">The store server did not answer the request for products, so there is nothing to show on this shelf yet.</p>
        <button
          class="inline-flex min-h-12 w-fit items-center border border-white/40 px-6 text-sm font-bold text-white transition-colors hover:border-[#F44336] hover:text-[#F44336] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]"
          type="button"
          @click="refetchProducts()"
        >
          Try loading the catalogue again
        </button>
      </div>

      <div v-else-if="products.length" class="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>

      <div v-else class="grid gap-4 border-y border-white/15 py-12">
        <p class="font-heading text-xl font-bold text-white">Nothing on this shelf yet.</p>
        <p class="max-w-[52ch] text-sm leading-6 text-white/75">
          The catalogue currently holds no piece in <strong class="font-semibold text-white">{{ activeCategoryName }}</strong>. Choose another category or browse all pieces.
        </p>
        <button
          class="inline-flex min-h-12 w-fit items-center border border-white/40 px-6 text-sm font-bold text-white transition-colors hover:border-[#F44336] hover:text-[#F44336] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]"
          type="button"
          @click="activeCategory = 'all'"
        >
          See all pieces
        </button>
      </div>

      <div v-if="!productsPending && !productsFailed && products.length" class="mt-12 flex justify-center">
        <button
          v-if="hasNextPage"
          class="inline-flex min-h-12 items-center border border-white/40 px-8 text-sm font-bold text-white transition-colors hover:border-[#F44336] hover:text-[#F44336] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336] disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          :disabled="isFetchingNextPage"
          @click="fetchNextPage()"
        >
          {{ isFetchingNextPage ? "Loading more pieces" : "Load more pieces" }}
        </button>
        <p v-else class="text-sm text-white/60">That is the whole catalogue for this shelf.</p>
      </div>
    </section>

    <section id="point-of-view" class="mx-auto max-w-360 px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
      <div class="grid gap-8 border-t border-white/20 pt-6 md:grid-cols-[1fr_2fr] md:gap-12 lg:gap-20">
        <div>
          <p class="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[#F44336]">Our point of view</p>
          <h2 class="mt-3 font-heading text-[clamp(32px,5vw,60px)] font-extrabold leading-[0.95] tracking-tighter text-white">The everyday,<br />with a little <span class="text-[#F44336]">spectacle.</span></h2>
        </div>
        <div class="self-end">
          <p class="max-w-[58ch] font-heading text-[clamp(19px,2vw,26px)] font-semibold leading-normal tracking-[-0.02em] text-balance text-white/90">
            <strong class="font-extrabold text-[#F44336]">Bread</strong> is the everyday half: the pieces you wear on repeat, without thinking about them.
            <strong class="font-extrabold text-[#e2a5eb]">Circus</strong> is the show half: prints, silhouettes, and colourways that bring the streetwear into the spotlight.
          </p>
        </div>
      </div>
      <div class="mt-12 grid gap-3 md:grid-cols-2 lg:mt-16">
        <article class="relative flex min-h-60 flex-col justify-between overflow-hidden bg-[#1b191c] p-7 text-white sm:min-h-72 sm:p-10">
          <span class="font-heading text-xs font-bold uppercase tracking-[0.18em] text-white/65">01 &middot; The foundation</span>
          <div class="flex items-end justify-between gap-4">
            <h3 class="font-heading text-[clamp(48px,8vw,88px)] font-extrabold leading-[0.8] tracking-[-0.06em]">Bread<span class="text-[#F44336]">.</span></h3>
            <p class="pb-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/70 sm:text-sm">Function, made daily</p>
          </div>
          <span class="pointer-events-none absolute -right-5 -top-12 font-heading text-[230px] font-extrabold leading-none text-white/[0.035]" aria-hidden="true">B</span>
        </article>
        <article class="relative flex min-h-60 flex-col justify-between overflow-hidden bg-linear-to-br from-[#673AB7] to-[#9C27B0] p-7 text-white sm:min-h-72 sm:p-10">
          <span class="font-heading text-xs font-bold uppercase tracking-[0.18em] text-white/80">02 &middot; The flourish</span>
          <div class="flex items-end justify-between gap-4">
            <h3 class="font-heading text-[clamp(48px,8vw,88px)] font-extrabold leading-[0.8] tracking-[-0.06em]">Circus<span class="text-white/70">.</span></h3>
            <p class="pb-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/90 sm:text-sm">Expression, without apology</p>
          </div>
          <span class="pointer-events-none absolute -right-5 -top-12 font-heading text-[230px] font-extrabold leading-none text-white/12" aria-hidden="true">C</span>
        </article>
      </div>
    </section>
  </div>
</template>

<style>
/* plain (unscoped): Vue scoped CSS renames keyframes, which breaks the Tailwind animate-[ticker-roll] reference */
@keyframes ticker-roll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
