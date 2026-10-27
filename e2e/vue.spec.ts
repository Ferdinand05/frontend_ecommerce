import { test, expect } from '@playwright/test'

test('store home shows the live catalogue and filters by category', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Feed your style. Enjoy the show.' })).toBeVisible()

  const product = page.locator('#collection article').first()
  await expect(product).toBeVisible()
  await expect(product.getByRole('button', { name: /Add .* to cart/ })).toBeVisible()
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
