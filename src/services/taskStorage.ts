import type { Task } from '../types'

const STORAGE_KEY = 'tasks-manager-tasks'

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

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}
