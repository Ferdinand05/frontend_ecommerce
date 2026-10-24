<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import ProductCard from "@/components/store/ProductCard.vue";
import { useCart } from "@/stores/cart";

interface Variant {
  id: string;
  name: string;
  price: number;
  inventory: { quantity: number; reserved_quantity: number };
}
interface Product {
  id: number;
  name: string;
  description: string;
  category: "Tops" | "Outerwear" | "Bottoms";
  tag?: string;
  variants: Variant[];
}

const categories = ["All", "Tops", "Outerwear", "Bottoms"] as const;
const route = useRoute();
const initialCategory = route.query.category;
const activeCategory = ref<string>(categories.includes(initialCategory as (typeof categories)[number]) ? (initialCategory as string) : "All");
const searchTerm = ref("");

function handleSearch(event: Event) {
  searchTerm.value = (event as CustomEvent<string>).detail;
  visibleCount.value = pageSize;
}
onMounted(() => window.addEventListener("bread-circus:search", handleSearch));
onUnmounted(() => window.removeEventListener("bread-circus:search", handleSearch));

// ponytail: local catalog placeholder shaped like the supplied API product payload
const products: Product[] = [
  {
    id: 1,
    name: "Grandstand Tee",
    description: "Heavyweight cotton tee with a dropped shoulder and center-ring print.",
    category: "Tops",
    tag: "New drop",
    variants: [
      { id: "v1", name: "S / Bone", price: 189000, inventory: { quantity: 12, reserved_quantity: 2 } },
      { id: "v2", name: "M / Bone", price: 189000, inventory: { quantity: 9, reserved_quantity: 0 } },
      { id: "v3", name: "L / Ink", price: 199000, inventory: { quantity: 4, reserved_quantity: 1 } },
    ],
  },
  {
    id: 2,
    name: "Ringmaster Hoodie",
    description: "Boxy fleece hoodie with tonal embroidery and a kangaroo pocket.",
    category: "Outerwear",
    tag: "Best seller",
    variants: [
      { id: "v4", name: "M / Charcoal", price: 429000, inventory: { quantity: 7, reserved_quantity: 1 } },
      { id: "v5", name: "L / Charcoal", price: 449000, inventory: { quantity: 3, reserved_quantity: 0 } },
    ],
  },
  {
    id: 3,
    name: "Trapeze Cargo Pants",
    description: "Wide-leg cargo pants with bellow pockets and a cinched hem.",
    category: "Bottoms",
    variants: [
      { id: "v6", name: "28 / Olive", price: 389000, inventory: { quantity: 5, reserved_quantity: 0 } },
      { id: "v7", name: "30 / Olive", price: 389000, inventory: { quantity: 6, reserved_quantity: 2 } },
      { id: "v8", name: "32 / Black", price: 409000, inventory: { quantity: 2, reserved_quantity: 0 } },
    ],
  },
  {
    id: 4,
    name: "Panem Graphic Tee",
    description: "Midweight tee with a back-print banner and ribbed collar.",
    category: "Tops",
    variants: [
      { id: "v9", name: "S / White", price: 199000, inventory: { quantity: 8, reserved_quantity: 0 } },
      { id: "v10", name: "M / White", price: 199000, inventory: { quantity: 0, reserved_quantity: 0 } },
    ],
  },
  {
    id: 5,
    name: "Spotlight Varsity Jacket",
    description: "Wool-blend varsity jacket with chenille patches and striped trim.",
    category: "Outerwear",
    tag: "Limited",
    variants: [
      { id: "v11", name: "M / Red", price: 749000, inventory: { quantity: 2, reserved_quantity: 1 } },
      { id: "v12", name: "L / Red", price: 769000, inventory: { quantity: 1, reserved_quantity: 0 } },
    ],
  },
  {
    id: 6,
    name: "Encore Wide Shorts",
    description: "Airy twill shorts cut long and wide with a drawcord waist.",
    category: "Bottoms",
    variants: [
      { id: "v13", name: "S / Sand", price: 219000, inventory: { quantity: 10, reserved_quantity: 0 } },
      { id: "v14", name: "M / Sand", price: 219000, inventory: { quantity: 4, reserved_quantity: 1 } },
    ],
  },
  {
    id: 7,
    name: "Circus Knit Polo",
    description: "Open-knit polo with a spread collar and contrast placket.",
    category: "Tops",
    variants: [
      { id: "v15", name: "M / Aubergine", price: 289000, inventory: { quantity: 6, reserved_quantity: 0 } },
      { id: "v16", name: "L / Aubergine", price: 299000, inventory: { quantity: 3, reserved_quantity: 1 } },
    ],
  },
  {
    id: 8,
    name: "Main Tent Coach Jacket",
    description: "Crisp nylon coach jacket with a snap front and lined body.",
    category: "Outerwear",
    variants: [
      { id: "v17", name: "M / Black", price: 539000, inventory: { quantity: 4, reserved_quantity: 0 } },
      { id: "v18", name: "L / Black", price: 539000, inventory: { quantity: 0, reserved_quantity: 0 } },
    ],
  },
];

const visibleProducts = computed(() => {
  const categoryProducts = activeCategory.value === "All" ? products : products.filter((product) => product.category === activeCategory.value);
  return categoryProducts.filter((product) => `${product.name} ${product.description} ${product.category}`.toLocaleLowerCase().includes(searchTerm.value));
});
const hasProducts = computed(() => visibleProducts.value.length > 0);
const pageSize = 4;
const visibleCount = ref(pageSize);
const displayedProducts = computed(() => visibleProducts.value.slice(0, visibleCount.value));
const hasMoreProducts = computed(() => visibleCount.value < visibleProducts.value.length);

const { add } = useCart();
function handleAddToCart(productId: number) {
  const product = products.find((item) => item.id === productId);
  if (product) add(product);
}
</script>

<template>
  <div>
    <section class="relative overflow-hidden border-b border-white/15">
      <div class="mx-auto grid max-w-360 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[5fr_7fr] lg:gap-14 lg:px-10 lg:py-24">
        <div>
          <h1 class="font-heading text-[clamp(42px,6.5vw,84px)] font-extrabold leading-[0.95] tracking-tighter text-balance text-white">Bread for the body.<br /><span class="text-[#F44336]">Circus</span> for the ego.</h1>
          <p class="mt-6 max-w-[46ch] text-base leading-7 text-white/80">Unisex essentials cut for the everyday, finished with the attitude of the main tent.</p>
          <div class="mt-9 flex flex-wrap gap-3.5">
            <RouterLink
              class="inline-flex min-h-12 items-center bg-[#F44336] px-6 text-sm font-bold text-white transition-colors hover:bg-[#d93429] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]"
              to="/#collection"
              >Shop all</RouterLink
            >
            <RouterLink
              class="inline-flex min-h-12 items-center border border-white/70 px-6 text-sm font-bold text-white transition-colors hover:border-[#F44336] hover:text-[#F44336] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]"
              to="/#manifesto"
              >Read the manifesto</RouterLink
            >
          </div>
        </div>
        <figure class="group relative isolate min-h-90 overflow-hidden bg-[#1b191c] sm:min-h-115 lg:min-h-155">
          <img
            class="absolute inset-0 size-full object-cover object-[center_38%] transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transform-none"
            src="/img/hero.jfif"
            alt="Bread & Circus models wearing graphic streetwear backstage beneath the neon sign"
            fetchpriority="high"
          />
          <div class="absolute inset-0 bg-linear-to-t from-[#0F0F11]/90 via-[#0F0F11]/15 to-[#0F0F11]/5" aria-hidden="true"></div>
          <figcaption class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
            <span class="font-heading text-xs font-bold uppercase tracking-[0.16em] text-white sm:text-sm">Backstage · Main tent</span>
            <span class="border border-white/50 bg-[#0F0F11]/70 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white sm:text-xs">Wear the show</span>
          </figcaption>
          <span class="pointer-events-none absolute right-4 top-4 size-3 rounded-full bg-[#F44336] shadow-[0_0_22px_6px_rgba(244,67,54,0.55)]" aria-hidden="true"></span>
        </figure>
      </div>
    </section>

    <div class="overflow-hidden border-b border-white/15 bg-[#F44336] text-white" aria-hidden="true">
      <div class="flex w-max whitespace-nowrap py-2.5 text-sm font-extrabold uppercase tracking-[0.12em] animate-[ticker-roll_24s_linear_infinite] motion-reduce:animate-none">
        <span v-for="n in 2" :key="n">Feed your style · Enjoy the show · Feed your style · Enjoy the show ·&nbsp;</span>
      </div>
    </div>

    <section id="collection" class="mx-auto max-w-360 px-4 pb-10 pt-20 sm:px-6 lg:px-10">
      <div class="mb-8 flex flex-wrap items-baseline justify-between gap-5">
        <h2 class="font-heading text-[clamp(28px,3.4vw,40px)] font-extrabold tracking-[-0.04em] text-white">The collection</h2>
        <div class="flex flex-wrap gap-2.5" role="group" aria-label="Filter products by category">
          <button
            v-for="category in categories"
            :key="category"
            class="min-h-10 border px-4 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]"
            :class="activeCategory === category ? 'border-[#F8F8F8] bg-[#F8F8F8] text-[#0F0F11]' : 'border-white/25 text-white/80 hover:border-white hover:text-white'"
            :aria-pressed="activeCategory === category"
            type="button"
            @click="activeCategory = category; visibleCount = pageSize"
          >
            {{ category }}
          </button>
        </div>
      </div>
      <div v-if="hasProducts" class="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ProductCard v-for="product in displayedProducts" :key="product.id" :product="product" @add-to-cart="handleAddToCart" />
      </div>
      <p v-else class="border-y border-white/15 py-12 text-center text-white/80">No pieces in this category yet.</p>
      <div v-if="hasMoreProducts" class="mt-12 flex justify-center">
        <button
          class="inline-flex min-h-12 items-center border border-white/40 px-8 text-sm font-bold text-white transition-colors hover:border-[#F44336] hover:text-[#F44336] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]"
          type="button"
          @click="visibleCount += pageSize"
        >
          Load more pieces
        </button>
      </div>
    </section>

    <section id="manifesto" class="mx-auto max-w-360 px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
      <div class="grid gap-8 border-t border-white/20 pt-6 md:grid-cols-[1fr_2fr] md:gap-12 lg:gap-20">
        <div>
          <p class="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[#F44336]">Our point of view · 01</p>
          <h2 class="mt-3 font-heading text-[clamp(32px,5vw,60px)] font-extrabold leading-[0.95] tracking-tighter text-white">The everyday,<br />with a little <span class="text-[#F44336]">spectacle.</span></h2>
        </div>
        <div class="self-end">
          <p class="max-w-[58ch] font-heading text-[clamp(19px,2vw,26px)] font-semibold leading-normal tracking-[-0.02em] text-balance text-white/90">
            <strong class="font-extrabold text-[#F44336]">Bread</strong> is function: cotton you live in, prices that respect the daily grind. <strong class="font-extrabold text-[#e2a5eb]">Circus</strong> is expression: graphics and
            silhouettes that treat the street as a stage.
          </p>
        </div>
      </div>
      <div class="mt-12 grid gap-3 md:grid-cols-2 lg:mt-16">
        <article class="relative flex min-h-60 flex-col justify-between overflow-hidden bg-[#1b191c] p-7 text-white sm:min-h-72 sm:p-10">
          <span class="font-heading text-xs font-bold uppercase tracking-[0.18em] text-white/65">01 — The foundation</span>
          <div class="flex items-end justify-between gap-4">
            <h3 class="font-heading text-[clamp(48px,8vw,88px)] font-extrabold leading-[0.8] tracking-[-0.06em]">Bread<span class="text-[#F44336]">.</span></h3>
            <p class="pb-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/70 sm:text-sm">Function, made daily</p>
          </div>
          <span class="pointer-events-none absolute -right-5 -top-12 font-heading text-[230px] font-extrabold leading-none text-white/[0.035]" aria-hidden="true">B</span>
        </article>
        <article class="relative flex min-h-60 flex-col justify-between overflow-hidden bg-linear-to-br from-[#673AB7] to-[#9C27B0] p-7 text-white sm:min-h-72 sm:p-10">
          <span class="font-heading text-xs font-bold uppercase tracking-[0.18em] text-white/80">02 — The flourish</span>
          <div class="flex items-end justify-between gap-4">
            <h3 class="font-heading text-[clamp(48px,8vw,88px)] font-extrabold leading-[0.8] tracking-[-0.06em]">Circus<span class="text-[#F44336]">.</span></h3>
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
