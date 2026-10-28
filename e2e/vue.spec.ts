import { test, expect } from '@playwright/test'

test('store home shows the live catalogue, loads more, and opens a product page', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Feed your style. Enjoy the show.' })).toBeVisible()

  const products = page.locator('#collection article')
  await expect(products.first()).toBeVisible({ timeout: 20_000 })
  await expect(products).toHaveCount(12, { timeout: 20_000 })

  const loadMore = page.getByRole('button', { name: 'Load more pieces' })
  await expect(loadMore).toBeVisible()
  await loadMore.click()
  await expect(products).toHaveCount(24, { timeout: 20_000 })

  await products.first().getByRole('link', { name: /View / }).click()
  await expect(page).toHaveURL(/\/product\/[0-9a-f-]{36}/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Variants' })).toBeVisible()
})

test('store home explains a failed catalogue load', async ({ page }) => {
  await page.route('**/api/v1/products*', (route) => route.abort())
  await page.goto('/')
  // The query retries a few times before it reports the failure.
  await expect(page.getByText('The catalogue did not load.')).toBeVisible({ timeout: 20_000 })
  await expect(page.getByRole('button', { name: 'Try loading the catalogue again' })).toBeVisible()
})

test('login reports a rejected sign in attempt', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email address').fill('style@example.com')
  await page.getByLabel('Password').fill('wrongpassword')
  await page.getByRole('button', { name: 'Enter the Stage' }).click()
  await expect(page.getByText(/invalid credentials/i)).toBeVisible()
})

test('a signed in shopper can add a variant to the server cart', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email address').fill('admin@ecommerce.test')
  await page.getByLabel('Password').fill('admin123')
  await page.getByRole('button', { name: 'Enter the Stage' }).click()
  await expect(page).toHaveURL(/\/account/)

  await page.goto('/')
  const products = page.locator('#collection article')
  await expect(products.first()).toBeVisible({ timeout: 20_000 })
  await products.first().getByRole('link', { name: /View / }).click()

  const addToCart = page.getByRole('button', { name: /^Add .* to cart$/ }).first()
  await expect(addToCart).toBeVisible()
  await addToCart.click()
  await expect(page.getByText('In your bag').first()).toBeVisible()

  // Clean up so the shared server cart is left empty.
  await page.goto('/cart')
  const clearBag = page.getByRole('button', { name: 'Clear bag' })
  if (await clearBag.isVisible()) await clearBag.click()
})
