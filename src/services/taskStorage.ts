import type { Task } from '../types'

/**
 * Storage key for tasks in localStorage.
 * Using a namespaced key to avoid conflicts with other applications.
 */
const STORAGE_KEY = 'tasks-manager-tasks'

/**
 * Retrieves all tasks from localStorage.
 *
 * @architecture
 * - Service layer abstracts storage implementation details
 * - Gracefully handles missing or corrupted data by returning empty array
 * - Enables easy mocking in tests and future storage backend changes
 *
 * @returns Array of tasks, empty if no data or parse error
 */
export function getTasks(): Task[] {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) {
    return []
  }
  try {
    return JSON.parse(data) as Task[]
  } catch {
    return []
  }
}

/**
 * Persists tasks array to localStorage.
 * Overwrites existing data with new state.
 *
 * @param tasks - Array of tasks to save
 */
export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}
