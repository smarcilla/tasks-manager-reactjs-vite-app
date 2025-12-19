import { test, expect } from '@playwright/test'
import { TasksPage } from './pages/TasksPage'

test.describe('App', () => {
  let tasksPage: TasksPage

  test.beforeEach(async ({ page }) => {
    tasksPage = new TasksPage(page)
    await tasksPage.goto()
  })

  test('should display the app title', async () => {
    await expect(tasksPage.heading).toBeVisible()
  })

  test('should have a main content area', async () => {
    await expect(tasksPage.mainContent).toBeVisible()
  })

  test('should display welcome message', async ({ page }) => {
    await expect(page.getByText(/gestiona tus tareas/i)).toBeVisible()
  })
})
