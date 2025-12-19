import { Page } from '@playwright/test'

/**
 * Base class for all Page Objects.
 * Provides common methods for navigation and utility functions.
 */
export class BasePage {
  /**
   * Creates a new BasePage instance.
   * @param page - Playwright Page instance
   */
  constructor(protected page: Page) {}

  /**
   * Navigates to the specified path.
   * @param path - The path to navigate to (default: '/')
   */
  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path)
  }

  /**
   * Waits for the page to be fully loaded.
   */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded')
  }

  /**
   * Gets the current page title.
   * @returns The page title
   */
  async getTitle(): Promise<string> {
    return this.page.title()
  }

  /**
   * Gets the current URL.
   * @returns The current URL
   */
  async getUrl(): Promise<string> {
    return this.page.url()
  }

  /**
   * Reloads the current page.
   */
  async reload(): Promise<void> {
    await this.page.reload()
  }
}
