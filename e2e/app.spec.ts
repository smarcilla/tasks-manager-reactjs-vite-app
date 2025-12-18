import { test, expect } from '@playwright/test'

test.describe('App', () => {
  test('should display the app title', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: /tasks manager/i })).toBeVisible()
  })

  test('should have a main content area', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should display welcome message', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText(/gestiona tus tareas/i)).toBeVisible()
  })
})
