import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'

type FilterOption = 'all' | 'completed' | 'pending'

/**
 * Page Object for the Tasks page.
 * Encapsulates all task-related interactions and selectors.
 */
export class TasksPage extends BasePage {
  /** Input field for new task title */
  readonly taskInput: Locator

  /** Button to add a new task */
  readonly addButton: Locator

  /** Container for the task list */
  readonly taskList: Locator

  /** Filter button: Show all tasks */
  readonly filterAll: Locator

  /** Filter button: Show completed tasks */
  readonly filterCompleted: Locator

  /** Filter button: Show pending tasks */
  readonly filterPending: Locator

  /** Empty state message */
  readonly emptyMessage: Locator

  /** App heading */
  readonly heading: Locator

  /** Main content area */
  readonly mainContent: Locator

  /**
   * Creates a new TasksPage instance.
   * @param page - Playwright Page instance
   */
  constructor(page: Page) {
    super(page)
    this.taskInput = page.getByPlaceholder('Nueva tarea')
    this.addButton = page.getByRole('button', { name: /agregar/i })
    this.taskList = page.getByRole('list')
    this.filterAll = page.getByRole('button', { name: /todas/i })
    this.filterCompleted = page.getByRole('button', { name: /completadas/i })
    this.filterPending = page.getByRole('button', { name: /pendientes/i })
    this.emptyMessage = page.getByText(/no hay tareas/i)
    this.heading = page.getByRole('heading', { name: /tasks manager/i })
    this.mainContent = page.getByRole('main')
  }

  // ==================== Actions ====================

  /**
   * Adds a new task with the specified title.
   * @param title - The title of the task to create
   */
  async addTask(title: string): Promise<void> {
    await this.taskInput.fill(title)
    await this.addButton.click()
  }

  /**
   * Toggles the completion status of a task.
   * @param title - The title of the task to toggle
   */
  async toggleTask(title: string): Promise<void> {
    await this.getTaskCheckbox(title).click()
  }

  /**
   * Deletes a task by its title.
   * Waits for the delete animation to complete before returning.
   * @param title - The title of the task to delete
   */
  async deleteTask(title: string): Promise<void> {
    const taskItem = this.getTaskItem(title)
    await taskItem.getByRole('button', { name: /eliminar/i }).click()
    // Wait for the task to be removed (animation takes 200ms)
    await taskItem.waitFor({ state: 'hidden' })
  }

  /**
   * Edits a task's title by double-clicking and entering new text.
   * @param currentTitle - The current title of the task
   * @param newTitle - The new title for the task
   */
  async editTask(currentTitle: string, newTitle: string): Promise<void> {
    const taskItem = this.getTaskItem(currentTitle)
    // Find the span element that displays the task title
    const taskText = taskItem.locator('span').filter({ hasText: currentTitle })

    // Double-click to enter edit mode
    await taskText.dblclick()

    // Wait for the input field to appear - use page-level locator since the
    // listitem filter may not match during edit mode
    const editInput = this.page.locator('li').filter({ has: this.page.locator('input[type="text"]') }).locator('input[type="text"]')
    await editInput.waitFor({ state: 'visible' })
    await editInput.fill(newTitle)

    // Press Enter to save
    await editInput.press('Enter')
  }

  /**
   * Filters tasks by the specified filter option.
   * @param filter - The filter to apply ('all', 'completed', or 'pending')
   */
  async filterBy(filter: FilterOption): Promise<void> {
    const filterButtons: Record<FilterOption, Locator> = {
      all: this.filterAll,
      completed: this.filterCompleted,
      pending: this.filterPending,
    }
    await filterButtons[filter].click()
  }

  /**
   * Clears localStorage to reset app state.
   */
  async clearStorage(): Promise<void> {
    await this.page.evaluate(() => {
      localStorage.clear()
    })
  }

  // ==================== Getters for Assertions ====================

  /**
   * Gets the list item element for a task by its title.
   * @param title - The title of the task
   * @returns Locator for the task's list item
   */
  getTaskItem(title: string): Locator {
    return this.page.getByRole('listitem').filter({ hasText: title })
  }

  /**
   * Gets the checkbox element for a task by its title.
   * @param title - The title of the task
   * @returns Locator for the task's checkbox
   */
  getTaskCheckbox(title: string): Locator {
    return this.getTaskItem(title).getByRole('checkbox')
  }

  /**
   * Gets the delete button for a task by its title.
   * @param title - The title of the task
   * @returns Locator for the task's delete button
   */
  getDeleteButton(title: string): Locator {
    return this.getTaskItem(title).getByRole('button', { name: /eliminar/i })
  }

  /**
   * Gets the count of visible task items.
   * @returns The number of visible tasks
   */
  async getTaskCount(): Promise<number> {
    return this.page.getByRole('listitem').count()
  }

  /**
   * Gets all visible task titles.
   * @returns Array of task titles
   */
  async getAllTaskTitles(): Promise<string[]> {
    const items = this.page.getByRole('listitem')
    const count = await items.count()

    const texts = await Promise.all(
      Array.from({ length: count }, (_, i) => items.nth(i).textContent())
    )

    return texts
      .filter((text): text is string => text !== null)
      .map((text) => text.replace(/Eliminar$/, '').trim())
  }

  /**
   * Checks if a task is marked as completed (has line-through style).
   * @param title - The title of the task
   * @returns True if the task is completed
   */
  async isTaskCompleted(title: string): Promise<boolean> {
    const checkbox = this.getTaskCheckbox(title)
    return checkbox.isChecked()
  }

  /**
   * Waits for a task to be visible.
   * @param title - The title of the task to wait for
   */
  async waitForTask(title: string): Promise<void> {
    await expect(this.getTaskItem(title)).toBeVisible()
  }

  /**
   * Waits for a task to be removed from the list.
   * @param title - The title of the task to wait for removal
   */
  async waitForTaskRemoval(title: string): Promise<void> {
    await expect(this.getTaskItem(title)).not.toBeVisible()
  }
}
