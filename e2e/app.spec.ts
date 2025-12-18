import { test, expect } from '@playwright/test'

test.describe('App', () => {
  test('should display the home page', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Vite + React' })).toBeVisible()
  })

  test('should increment counter on button click', async ({ page }) => {
    await page.goto('/')

    const button = page.getByRole('button', { name: /count is/i })
    await expect(button).toContainText('count is 0')

    await button.click()
    await expect(button).toContainText('count is 1')

    await button.click()
    await expect(button).toContainText('count is 2')
  })
})
