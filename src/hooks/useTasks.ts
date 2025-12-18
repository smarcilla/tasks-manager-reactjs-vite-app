import { useState, useEffect } from 'react'
import type { Task } from '../types'
import { getTasks, saveTasks } from '../services'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => getTasks())

  // Persist tasks to localStorage whenever they change
  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = (title: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

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
