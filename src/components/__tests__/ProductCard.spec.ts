import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ProductCard from '../store/ProductCard.vue'

const product = {
  id: '4044ff49-b90d-4165-bf1a-b248896f0ecb',
  category_id: '86298e07-e187-4b11-9341-a5441469f9e4',
  name: 'Cargo Pants',
  slug: 'cargo-pants',
  description: 'celana kekinian',
  is_active: true,
  category: { id: '86298e07-e187-4b11-9341-a5441469f9e4', name: 'Pants', slug: 'pants' },
  images: [
    { id: 'img-1', url: 'https://example.test/cargo.jpg', alt: 'cargo black', sort_order: 0 },
    { id: 'img-2', url: 'https://example.test/products/4044ff49/variants/var-black/1.jpg', alt: 'variant', sort_order: 0 },
  ],
  variants: [
    { id: 'var-black', product_id: '4044ff49-b90d-4165-bf1a-b248896f0ecb', sku: 'CRG-BLK-01', name: 'Cargo Pants Black', price: '120000', is_active: true, weight_grams: 100 },
    { id: 'var-white', product_id: '4044ff49-b90d-4165-bf1a-b248896f0ecb', sku: 'CRG-WHT-01', name: 'Cargo Pants White', price: '130000', is_active: true, weight_grams: 100 },
  ],
  created_at: '2026-10-21T15:12:07.63264Z',
  updated_at: '2026-10-21T15:12:07.63264Z',
}

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }, { path: '/product/:id', component: { template: '<div />' } }],
})

function mountCard() {
  return mount(ProductCard, { props: { product }, global: { plugins: [router] } })
}

describe('ProductCard', () => {
  it('shows the product name, price range, and variant count', () => {
    const wrapper = mountCard()

    expect(wrapper.text()).toContain('Cargo Pants')
    expect(wrapper.text()).toContain('120.000')
    expect(wrapper.text()).toContain('130.000')
    expect(wrapper.text()).toContain('2 variants')
  })

  it('uses the product photo, not a variant photo', () => {
    const wrapper = mountCard()

    expect(wrapper.find('img').attributes('src')).toBe('https://example.test/cargo.jpg')
  })

  it('links to the product page', () => {
    const wrapper = mountCard()

    const links = wrapper.findAll('a').map((link) => link.attributes('href'))
    expect(links).toContain('/product/4044ff49-b90d-4165-bf1a-b248896f0ecb')
  })

  it('has no add to cart button, the detail page owns variant choice', () => {
    const wrapper = mountCard()

    expect(wrapper.find('button').exists()).toBe(false)
  })
})
