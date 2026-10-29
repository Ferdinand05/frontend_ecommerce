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

test('the categories mega menu fits inside the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Categories' }).click()
  const panel = page.getByRole('link', { name: 'Browse all pieces' }).locator('xpath=ancestor::div[contains(@class,"absolute")]')
  const box = await panel.boundingBox()
  expect(box).not.toBeNull()
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(1280)
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

test('a shopper can pick a courier and reach the payment handoff', async ({ page }) => {
  test.setTimeout(120_000)
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

  await page.goto('/checkout')
  await expect(page.getByRole('heading', { name: 'Checkout.' })).toBeVisible({ timeout: 20_000 })

  await page.getByLabel('Full name').fill('Ferdinand Tester')
  await page.getByLabel('Phone number').fill('081234567890')
  await page.getByLabel('Street address').fill('Jalan Braga No. 21, Lantai 2')

  const areaInput = page.getByLabel('Delivery area')
  await areaInput.click()
  await areaInput.fill('Bandung')
  const firstArea = page.getByRole('option').first()
  await expect(firstArea).toBeVisible({ timeout: 20_000 })
  await firstArea.click()

  await expect(page.getByLabel('City')).not.toHaveValue('')
  await page.getByRole('button', { name: 'Continue to shipping' }).click()

  const courier = page.getByRole('radio').first()
  await expect(courier).toBeVisible({ timeout: 20_000 })
  await courier.click()

  const total = page.locator('#checkout-summary-total')
  await expect(total).toContainText('Rp')

  // The order request is intercepted so the shared server keeps no test order.
  const orderRequests: Record<string, unknown>[] = [];
  await page.route('**/api/v1/me/orders', async (route) => {
    if (route.request().method() !== 'POST') return route.fallback();
    orderRequests.push(route.request().postDataJSON());
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ order: { id: '11111111-2222-3333-4444-555555555555' } }),
    });
  });
  await page.route('**/api/v1/me/orders/*/payment', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        payment_id: 'pay-1',
        order_id: '11111111-2222-3333-4444-555555555555',
        status: 'PENDING',
        amount: '413000',
        currency: 'IDR',
        checkout_url: 'https://checkout-staging.xendit.co/web/test',
        expires_at: null,
      }),
    });
  });
  await page.route('https://checkout-staging.xendit.co/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<title>Xendit</title><p>stub payment page</p>' }),
  );

  await page.getByRole('button', { name: /Pay now/ }).click()
  await expect(page).toHaveURL(/xendit\.co/, { timeout: 20_000 })

  expect(orderRequests).toHaveLength(1)
  expect(orderRequests[0]).toMatchObject({
    recipient_name: 'Ferdinand Tester',
    phone: '081234567890',
    address: 'Jalan Braga No. 21, Lantai 2',
  })
  expect((orderRequests[0] as { courier_code: string }).courier_code).not.toBe('')

  await page.goto('/cart')
  const clearBag = page.getByRole('button', { name: 'Clear bag' })
  if (await clearBag.isVisible()) await clearBag.click()
})
