import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductCard from '../store/ProductCard.vue'

describe('ProductCard', () => {
  it('renders product name, variant price range, count, and add-to-cart event', async () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: {
          id: 1,
          name: 'Grandstand Tee',
          description: 'Heavyweight tee',
          category: 'Tops',
          variants: [
            { id: 'v1', name: 'S / Bone', price: 100000, inventory: { quantity: 2, reserved_quantity: 0 } },
            { id: 'v2', name: 'M / Bone', price: 150000, inventory: { quantity: 3, reserved_quantity: 0 } },
          ],
        },
      },
    })

    expect(wrapper.text()).toContain('Grandstand Tee')
    expect(wrapper.text()).toContain('Rp 100.000 – Rp 150.000')
    expect(wrapper.text()).toContain('2 variants')
    expect(wrapper.text()).not.toContain('2 left')
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('addToCart')).toEqual([[1]])
  })
})
