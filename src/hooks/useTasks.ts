import { useState, useEffect } from 'react'
import type { Task } from '../types'
import { getTasks, saveTasks } from '../services'

/**
 * Custom hook for managing task state with localStorage persistence.
 *
 * @architecture
 * - Separates business logic from UI components
 * - Uses lazy initialization to avoid re-reading localStorage on every render
 * - Automatically persists changes to localStorage via useEffect
 * - Provides CRUD operations as stable callbacks
 *
 * @returns Object containing tasks array and CRUD operations
 *
 * @example
 * const { tasks, addTask, toggleTask, deleteTask, updateTask } = useTasks()
 */
export function useTasks() {
  // Lazy initialization: getTasks() only runs once on mount
  const [tasks, setTasks] = useState<Task[]>(() => getTasks())

  // Persist tasks to localStorage whenever they change
  // This ensures data survives page refreshes
  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  /**
   * Creates a new task with auto-generated id and timestamp.
   * Uses crypto.randomUUID() for unique, collision-free identifiers.
   */
  const addTask = (title: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  /** Toggles the completed status of a task by id */
  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  /** Removes a task from the list by id */
  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  /**
   * Updates a task's title.
   * Trims whitespace and ignores empty titles to maintain data integrity.
   */
  const updateTask = (id: string, title: string) => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, title: trimmedTitle } : task
      )
    )
  }

  return { tasks, addTask, toggleTask, deleteTask, updateTask }
}
