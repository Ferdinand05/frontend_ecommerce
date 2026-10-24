import { test, expect } from '@playwright/test'

test('store home shows products and filters categories', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Bread for the body. Circus for the ego.' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Grandstand Tee' })).toBeVisible()
  await page.getByRole('button', { name: 'Tops' }).click()
  await expect(page.getByRole('heading', { name: 'Grandstand Tee' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Ringmaster Hoodie' })).toHaveCount(0)
})

test('auth routes render and demo forms report their status', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email address').fill('style@example.com')
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByRole('status')).toContainText('Authentication is not connected')

  await page.goto('/register')
  await page.getByLabel('Name').fill('Style Fan')
  await page.getByLabel('Email address').fill('style@example.com')
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Create account' }).click()
  await expect(page.getByRole('status')).toContainText('Your account was not created')
})
