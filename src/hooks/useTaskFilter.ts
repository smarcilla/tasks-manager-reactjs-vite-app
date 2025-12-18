import { useMemo } from 'react'
import type { Task, TaskFilter } from '../types/task'

/**
 * Pure function to filter tasks based on filter type
 */
export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  switch (filter) {
    case 'completed':
      return tasks.filter((task) => task.completed)
    case 'pending':
      return tasks.filter((task) => !task.completed)
    case 'all':
    default:
      return tasks
  }
}

/**
 * Hook to filter tasks based on filter type with memoization
 */
export function useTaskFilter(tasks: Task[], filter: TaskFilter): Task[] {
  return useMemo(() => filterTasks(tasks, filter), [tasks, filter])
}
