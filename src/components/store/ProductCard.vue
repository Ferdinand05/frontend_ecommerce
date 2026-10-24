<script setup lang="ts">
import { computed } from 'vue'
import { ShoppingCart } from '@lucide/vue'

const props = defineProps<{
  product: {
    id: number
    name: string
    description: string
    category: string
    tag?: string
    variants: { id: string; name: string; price: number; inventory: { quantity: number; reserved_quantity: number } }[]
  }
}>()
const emit = defineEmits<{ addToCart: [productId: number] }>()
const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
const priceRange = computed(() => {
  const prices = props.product.variants.map((variant) => variant.price)
  if (!prices.length) return 'Price unavailable'
  const low = Math.min(...prices)
  const high = Math.max(...prices)
  return low === high ? formatter.format(low) : `${formatter.format(low)} – ${formatter.format(high)}`
})
</script>

<template>
  <article class="group grid min-w-0 grid-rows-[auto_1fr]">
    <div class="relative grid aspect-[4/5] place-items-center overflow-hidden bg-[#211f22] text-white/55">
      <span v-if="product.tag" class="absolute left-3 top-3 bg-[#F44336] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">{{ product.tag }}</span>
      <span class="text-xs tracking-[0.08em]">[ Product image ]</span>
      <span class="absolute bottom-3 right-3 bg-[#F8F8F8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#0F0F11]">{{ product.category }}</span>
    </div>
    <div class="grid grid-rows-[minmax(3.5rem,auto)_3rem_minmax(2.5rem,auto)_1.25rem_auto] border-b border-white/15 pb-4 pt-4">
      <h3 class="line-clamp-2 font-heading text-lg font-bold leading-tight tracking-[-0.025em] text-white">{{ product.name }}</h3>
      <p class="flex items-start text-sm font-semibold tabular-nums text-white">{{ priceRange }}</p>
      <p class="line-clamp-2 text-sm leading-5 text-white/65">{{ product.description }}</p>
      <div class="flex items-center justify-end text-xs text-white/80">
        <span>{{ product.variants.length }} {{ product.variants.length === 1 ? 'variant' : 'variants' }}</span>
      </div>
      <button class="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-[#F44336] px-4 text-sm font-bold text-white transition-colors hover:bg-[#d93429] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" type="button" :aria-label="`Add ${product.name} to cart`" @click="emit('addToCart', product.id)">
        <ShoppingCart :size="17" aria-hidden="true" />Add to cart
      </button>
    </div>
  </article>
</template>
