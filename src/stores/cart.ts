import { computed, ref } from 'vue'

export interface CartItem {
  key: string
  productId: string
  variantId: string
  name: string
  variantName: string
  price: string
  imageUrl: string
  qty: number
}

export interface AddToCartPayload {
  productId: string
  variantId: string
  name: string
  variantName: string
  price: string
  imageUrl: string
}

// ponytail: in-memory demo cart shared by header badge and cart page; add persistence when a backend exists
const items = ref<CartItem[]>([])

export function useCart() {
  const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.qty, 0))
  const subtotal = computed(() => items.value.reduce((sum, item) => sum + item.qty * Number(item.price), 0))

  function add(payload: AddToCartPayload) {
    const key = `${payload.productId}:${payload.variantId}`
    const existing = items.value.find((item) => item.key === key)
    if (existing) existing.qty += 1
    else items.value.push({ key, ...payload, qty: 1 })
  }

  function remove(key: string) {
    items.value = items.value.filter((item) => item.key !== key)
  }

  function decrease(key: string) {
    const item = items.value.find((entry) => entry.key === key)
    if (!item) return
    if (item.qty <= 1) remove(key)
    else item.qty -= 1
  }

  function increase(key: string) {
    const item = items.value.find((entry) => entry.key === key)
    if (item) item.qty += 1
  }

  function clear() {
    items.value = []
  }

  return { items, totalItems, subtotal, add, remove, increase, decrease, clear }
}
