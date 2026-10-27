import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductCard from '../store/ProductCard.vue'

const product = {
  id: '4044ff49-b90d-4165-bf1a-b248896f0ecb',
  category_id: '86298e07-e187-4b11-9341-a5441469f9e4',
  name: 'Cargo Pants',
  slug: 'cargo-pants',
  description: 'celana kekinian',
  is_active: true,
  category: { id: '86298e07-e187-4b11-9341-a5441469f9e4', name: 'Pants', slug: 'pants' },
  images: [{ id: 'img-1', url: 'https://example.test/cargo.jpg', alt: 'cargo black', sort_order: 1 }],
  variants: [
    { id: 'var-black', product_id: '4044ff49-b90d-4165-bf1a-b248896f0ecb', sku: 'CRG-BLK-01', name: 'Cargo Pants Black', price: '120000', is_active: true, weight_grams: 100 },
    { id: 'var-white', product_id: '4044ff49-b90d-4165-bf1a-b248896f0ecb', sku: 'CRG-WHT-01', name: 'Cargo Pants White', price: '130000', is_active: true, weight_grams: 100 },
  ],
  created_at: '2026-10-21T15:12:07.63264Z',
  updated_at: '2026-10-21T15:12:07.63264Z',
}

const addToCartButton = '[aria-label="Add Cargo Pants to cart"]'

describe('ProductCard', () => {
  it('renders product name, price range, variant count, and add-to-cart event', async () => {
    const wrapper = mount(ProductCard, { props: { product } })

    expect(wrapper.text()).toContain('Cargo Pants')
    expect(wrapper.text()).toContain('120.000')
    expect(wrapper.text()).toContain('130.000')
    expect(wrapper.text()).toContain('2 variants')
    expect(wrapper.find('img').attributes('src')).toBe('https://example.test/cargo.jpg')
    await wrapper.get(addToCartButton).trigger('click')
    expect(wrapper.emitted('addToCart')).toEqual([[{ productId: product.id, variantId: 'var-black' }]])
  })

  it('adds the variant the shopper picked', async () => {
    const wrapper = mount(ProductCard, { props: { product } })

    const variantButtons = wrapper.findAll('[aria-pressed]')
    await variantButtons[1]!.trigger('click')
    await wrapper.get(addToCartButton).trigger('click')
    expect(wrapper.emitted('addToCart')).toEqual([[{ productId: product.id, variantId: 'var-white' }]])
  })
})
