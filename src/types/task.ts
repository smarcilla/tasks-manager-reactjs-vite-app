/**
 * Represents a task in the task manager
 */
export interface Task {
  /** Unique identifier for the task */
  id: string
  /** Task title/description */
  title: string
  /** Whether the task has been completed */
  completed: boolean
  /** Timestamp when the task was created */
  createdAt: Date
}

/**
 * Filter options for displaying tasks
 */
export type TaskFilter = 'all' | 'completed' | 'pending'

/**
 * Data required to create a new task (without auto-generated fields)
 */
export type NewTaskData = Pick<Task, 'title'>

/**
 * Data that can be updated on an existing task
 */
export type UpdateTaskData = Partial<Pick<Task, 'title' | 'completed'>>
