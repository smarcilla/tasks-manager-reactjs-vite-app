import { renderHook, act } from '@testing-library/react'
import { useTasks } from './useTasks'
import type { Task } from '../types'

const createTask = (overrides: Partial<Task> = {}): Task => ({
  id: '1',
  title: 'Test task',
  completed: false,
  createdAt: new Date('2024-01-01'),
  ...overrides,
})

describe('useTasks', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('initial state', () => {
    it('loads tasks from localStorage on mount', () => {
      const existingTasks = [
        createTask({ id: '1', title: 'Task 1' }),
        createTask({ id: '2', title: 'Task 2' }),
      ]
      localStorage.setItem('tasks-manager-tasks', JSON.stringify(existingTasks))

      const { result } = renderHook(() => useTasks())

      expect(result.current.tasks).toHaveLength(2)
      expect(result.current.tasks[0].title).toBe('Task 1')
      expect(result.current.tasks[1].title).toBe('Task 2')
    })

    it('returns empty array when localStorage is empty', () => {
      const { result } = renderHook(() => useTasks())

      expect(result.current.tasks).toEqual([])
    })
  })

  describe('addTask', () => {
    it('adds a new task with the given title', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('New task')
      })

      expect(result.current.tasks).toHaveLength(1)
      expect(result.current.tasks[0].title).toBe('New task')
      expect(result.current.tasks[0].completed).toBe(false)
      expect(result.current.tasks[0].id).toBeDefined()
      expect(result.current.tasks[0].createdAt).toBeInstanceOf(Date)
    })

    it('generates unique IDs for each task', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('Task 1')
        result.current.addTask('Task 2')
      })

      expect(result.current.tasks[0].id).not.toBe(result.current.tasks[1].id)
    })
  })

  describe('toggleTask', () => {
    it('toggles task completed status from false to true', () => {
      const existingTask = createTask({ id: '1', completed: false })
      localStorage.setItem('tasks-manager-tasks', JSON.stringify([existingTask]))

      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.toggleTask('1')
      })

      expect(result.current.tasks[0].completed).toBe(true)
    })

    it('toggles task completed status from true to false', () => {
      const existingTask = createTask({ id: '1', completed: true })
      localStorage.setItem('tasks-manager-tasks', JSON.stringify([existingTask]))

      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.toggleTask('1')
      })

      expect(result.current.tasks[0].completed).toBe(false)
    })

    it('does not affect other tasks when toggling', () => {
      const tasks = [
        createTask({ id: '1', completed: false }),
        createTask({ id: '2', completed: false }),
      ]
      localStorage.setItem('tasks-manager-tasks', JSON.stringify(tasks))

      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.toggleTask('1')
      })

      expect(result.current.tasks[0].completed).toBe(true)
      expect(result.current.tasks[1].completed).toBe(false)
    })
  })

  describe('deleteTask', () => {
    it('removes the task with the given id', () => {
      const tasks = [
        createTask({ id: '1', title: 'Task 1' }),
        createTask({ id: '2', title: 'Task 2' }),
      ]
      localStorage.setItem('tasks-manager-tasks', JSON.stringify(tasks))

      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.deleteTask('1')
      })

      expect(result.current.tasks).toHaveLength(1)
      expect(result.current.tasks[0].id).toBe('2')
    })

    it('does nothing if task id does not exist', () => {
      const tasks = [createTask({ id: '1', title: 'Task 1' })]
      localStorage.setItem('tasks-manager-tasks', JSON.stringify(tasks))

      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.deleteTask('non-existent')
      })

      expect(result.current.tasks).toHaveLength(1)
    })
  })

  describe('updateTask', () => {
    it('updates task title with the given id', () => {
      const tasks = [createTask({ id: '1', title: 'Original title' })]
      localStorage.setItem('tasks-manager-tasks', JSON.stringify(tasks))

      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.updateTask('1', 'Updated title')
      })

      expect(result.current.tasks[0].title).toBe('Updated title')
    })

    it('does not update if title is empty', () => {
      const tasks = [createTask({ id: '1', title: 'Original title' })]
      localStorage.setItem('tasks-manager-tasks', JSON.stringify(tasks))

      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.updateTask('1', '')
      })

      expect(result.current.tasks[0].title).toBe('Original title')
    })

    it('does not update if title is whitespace only', () => {
      const tasks = [createTask({ id: '1', title: 'Original title' })]
      localStorage.setItem('tasks-manager-tasks', JSON.stringify(tasks))

      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.updateTask('1', '   ')
      })

      expect(result.current.tasks[0].title).toBe('Original title')
    })

    it('does nothing if task id does not exist', () => {
      const tasks = [createTask({ id: '1', title: 'Original title' })]
      localStorage.setItem('tasks-manager-tasks', JSON.stringify(tasks))

      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.updateTask('non-existent', 'Updated title')
      })

      expect(result.current.tasks[0].title).toBe('Original title')
    })
  })

  describe('persistence', () => {
    it('persists tasks to localStorage when adding a task', () => {
      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.addTask('New task')
      })

      const stored = localStorage.getItem('tasks-manager-tasks')
      expect(stored).not.toBeNull()
      const parsed = JSON.parse(stored!)
      expect(parsed).toHaveLength(1)
      expect(parsed[0].title).toBe('New task')
    })

    it('persists tasks to localStorage when toggling a task', () => {
      const tasks = [createTask({ id: '1', completed: false })]
      localStorage.setItem('tasks-manager-tasks', JSON.stringify(tasks))

      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.toggleTask('1')
      })

      const stored = localStorage.getItem('tasks-manager-tasks')
      const parsed = JSON.parse(stored!)
      expect(parsed[0].completed).toBe(true)
    })

    it('persists tasks to localStorage when deleting a task', () => {
      const tasks = [
        createTask({ id: '1', title: 'Task 1' }),
        createTask({ id: '2', title: 'Task 2' }),
      ]
      localStorage.setItem('tasks-manager-tasks', JSON.stringify(tasks))

      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.deleteTask('1')
      })

      const stored = localStorage.getItem('tasks-manager-tasks')
      const parsed = JSON.parse(stored!)
      expect(parsed).toHaveLength(1)
      expect(parsed[0].id).toBe('2')
    })

    it('persists tasks to localStorage when updating a task', () => {
      const tasks = [createTask({ id: '1', title: 'Original' })]
      localStorage.setItem('tasks-manager-tasks', JSON.stringify(tasks))

      const { result } = renderHook(() => useTasks())

      act(() => {
        result.current.updateTask('1', 'Updated')
      })

      const stored = localStorage.getItem('tasks-manager-tasks')
      const parsed = JSON.parse(stored!)
      expect(parsed[0].title).toBe('Updated')
    })
  })
})
