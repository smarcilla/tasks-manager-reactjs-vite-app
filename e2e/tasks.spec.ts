import { test, expect } from '@playwright/test'
import { TasksPage } from './pages/TasksPage'

test.describe('Tasks', () => {
  let tasksPage: TasksPage

  test.beforeEach(async ({ page }) => {
    tasksPage = new TasksPage(page)
    // Clear localStorage before each test to ensure clean state
    await tasksPage.goto()
    await tasksPage.clearStorage()
    await tasksPage.reload()
  })

  test.describe('Task Creation', () => {
    test('user can create a task', async () => {
      await tasksPage.addTask('Mi tarea')

      await expect(tasksPage.getTaskItem('Mi tarea')).toBeVisible()
    })

    test('user can create multiple tasks', async () => {
      await tasksPage.addTask('Primera tarea')
      await tasksPage.addTask('Segunda tarea')
      await tasksPage.addTask('Tercera tarea')

      await expect(tasksPage.getTaskItem('Primera tarea')).toBeVisible()
      await expect(tasksPage.getTaskItem('Segunda tarea')).toBeVisible()
      await expect(tasksPage.getTaskItem('Tercera tarea')).toBeVisible()
      expect(await tasksPage.getTaskCount()).toBe(3)
    })

    test('new task starts as pending', async () => {
      await tasksPage.addTask('Nueva tarea')

      await expect(tasksPage.getTaskCheckbox('Nueva tarea')).not.toBeChecked()
    })

    test('empty state is shown when no tasks exist', async () => {
      await expect(tasksPage.emptyMessage).toBeVisible()
    })

    test('empty state disappears after adding a task', async () => {
      await expect(tasksPage.emptyMessage).toBeVisible()

      await tasksPage.addTask('Primera tarea')

      await expect(tasksPage.emptyMessage).not.toBeVisible()
    })
  })

  test.describe('Task Completion', () => {
    test('user can mark task as completed', async () => {
      await tasksPage.addTask('Mi tarea')

      await tasksPage.toggleTask('Mi tarea')

      await expect(tasksPage.getTaskCheckbox('Mi tarea')).toBeChecked()
    })

    test('user can mark completed task as pending', async () => {
      await tasksPage.addTask('Mi tarea')
      await tasksPage.toggleTask('Mi tarea')

      // Toggle again to mark as pending
      await tasksPage.toggleTask('Mi tarea')

      await expect(tasksPage.getTaskCheckbox('Mi tarea')).not.toBeChecked()
    })
  })

  test.describe('Task Deletion', () => {
    test('user can delete a task', async () => {
      await tasksPage.addTask('Mi tarea')
      await expect(tasksPage.getTaskItem('Mi tarea')).toBeVisible()

      await tasksPage.deleteTask('Mi tarea')

      await expect(tasksPage.getTaskItem('Mi tarea')).not.toBeVisible()
    })

    test('deleting a task updates the count', async () => {
      await tasksPage.addTask('Tarea 1')
      await tasksPage.addTask('Tarea 2')
      expect(await tasksPage.getTaskCount()).toBe(2)

      await tasksPage.deleteTask('Tarea 1')

      expect(await tasksPage.getTaskCount()).toBe(1)
    })

    test('deleting last task shows empty state', async () => {
      await tasksPage.addTask('Unica tarea')
      await expect(tasksPage.emptyMessage).not.toBeVisible()

      await tasksPage.deleteTask('Unica tarea')

      await expect(tasksPage.emptyMessage).toBeVisible()
    })
  })

  test.describe('Task Editing', () => {
    test('user can edit a task', async () => {
      await tasksPage.addTask('Mi tarea')

      await tasksPage.editTask('Mi tarea', 'Tarea editada')

      await expect(tasksPage.getTaskItem('Tarea editada')).toBeVisible()
      await expect(tasksPage.getTaskItem('Mi tarea')).not.toBeVisible()
    })

    test('edited task maintains completion status', async () => {
      await tasksPage.addTask('Mi tarea')
      await tasksPage.toggleTask('Mi tarea')
      await expect(tasksPage.getTaskCheckbox('Mi tarea')).toBeChecked()

      await tasksPage.editTask('Mi tarea', 'Tarea editada')

      await expect(tasksPage.getTaskCheckbox('Tarea editada')).toBeChecked()
    })
  })

  test.describe('Task Filtering', () => {
    test.beforeEach(async () => {
      // Create tasks with different states for filter tests
      await tasksPage.addTask('Tarea completada')
      await tasksPage.addTask('Tarea pendiente')
      await tasksPage.toggleTask('Tarea completada')
    })

    test('user can filter to show only completed tasks', async () => {
      await tasksPage.filterBy('completed')

      await expect(tasksPage.getTaskItem('Tarea completada')).toBeVisible()
      await expect(tasksPage.getTaskItem('Tarea pendiente')).not.toBeVisible()
    })

    test('user can filter to show only pending tasks', async () => {
      await tasksPage.filterBy('pending')

      await expect(tasksPage.getTaskItem('Tarea pendiente')).toBeVisible()
      await expect(tasksPage.getTaskItem('Tarea completada')).not.toBeVisible()
    })

    test('user can show all tasks after filtering', async () => {
      await tasksPage.filterBy('completed')
      await expect(tasksPage.getTaskItem('Tarea pendiente')).not.toBeVisible()

      await tasksPage.filterBy('all')

      await expect(tasksPage.getTaskItem('Tarea completada')).toBeVisible()
      await expect(tasksPage.getTaskItem('Tarea pendiente')).toBeVisible()
    })

    test('filter buttons indicate active state', async () => {
      // Initially 'all' should be active
      await expect(tasksPage.filterAll).toHaveAttribute('aria-pressed', 'true')
      await expect(tasksPage.filterCompleted).toHaveAttribute(
        'aria-pressed',
        'false'
      )
      await expect(tasksPage.filterPending).toHaveAttribute(
        'aria-pressed',
        'false'
      )

      // After clicking 'completed'
      await tasksPage.filterBy('completed')
      await expect(tasksPage.filterCompleted).toHaveAttribute(
        'aria-pressed',
        'true'
      )
      await expect(tasksPage.filterAll).toHaveAttribute('aria-pressed', 'false')
    })
  })

  test.describe('Persistence', () => {
    test('tasks persist after page reload', async () => {
      await tasksPage.addTask('Tarea persistente')
      await expect(tasksPage.getTaskItem('Tarea persistente')).toBeVisible()

      await tasksPage.reload()

      await expect(tasksPage.getTaskItem('Tarea persistente')).toBeVisible()
    })

    test('completed status persists after page reload', async () => {
      await tasksPage.addTask('Tarea a completar')
      await tasksPage.toggleTask('Tarea a completar')
      await expect(tasksPage.getTaskCheckbox('Tarea a completar')).toBeChecked()

      await tasksPage.reload()

      await expect(tasksPage.getTaskCheckbox('Tarea a completar')).toBeChecked()
    })

    test('multiple tasks persist after page reload', async () => {
      await tasksPage.addTask('Tarea 1')
      await tasksPage.addTask('Tarea 2')
      await tasksPage.addTask('Tarea 3')
      await tasksPage.toggleTask('Tarea 2')

      await tasksPage.reload()

      expect(await tasksPage.getTaskCount()).toBe(3)
      await expect(tasksPage.getTaskCheckbox('Tarea 1')).not.toBeChecked()
      await expect(tasksPage.getTaskCheckbox('Tarea 2')).toBeChecked()
      await expect(tasksPage.getTaskCheckbox('Tarea 3')).not.toBeChecked()
    })

    test('edited task persists after page reload', async () => {
      await tasksPage.addTask('Tarea original')
      await tasksPage.editTask('Tarea original', 'Tarea modificada')

      await tasksPage.reload()

      await expect(tasksPage.getTaskItem('Tarea modificada')).toBeVisible()
      await expect(tasksPage.getTaskItem('Tarea original')).not.toBeVisible()
    })
  })
})
