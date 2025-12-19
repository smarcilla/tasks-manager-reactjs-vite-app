import { useMemo } from 'react'
import type { Task, TaskFilter } from '../types/task'

/**
 * Pure function to filter tasks based on filter type.
 * Extracted for testability and potential reuse outside React.
 *
 * @param tasks - Array of tasks to filter
 * @param filter - Filter type: 'all', 'completed', or 'pending'
 * @returns Filtered array of tasks
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
 * Hook to filter tasks with memoization for performance.
 *
 * @architecture
 * - Uses useMemo to prevent unnecessary re-filtering on unrelated re-renders
 * - Delegates to pure filterTasks function for logic
 * - Only recalculates when tasks or filter changes
 *
 * @param tasks - Array of tasks to filter
 * @param filter - Current filter selection
 * @returns Memoized filtered array of tasks
 */
export function useTaskFilter(tasks: Task[], filter: TaskFilter): Task[] {
  return useMemo(() => filterTasks(tasks, filter), [tasks, filter])
}
