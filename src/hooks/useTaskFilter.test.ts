import { renderHook } from '@testing-library/react'
import type { Task } from '../types/task'
import { useTaskFilter, filterTasks } from './useTaskFilter'

describe('useTaskFilter', () => {
  const sampleTasks: Task[] = [
    {
      id: '1',
      title: 'Buy groceries',
      completed: false,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      title: 'Walk the dog',
      completed: true,
      createdAt: new Date('2024-01-02'),
    },
    {
      id: '3',
      title: 'Read a book',
      completed: false,
      createdAt: new Date('2024-01-03'),
    },
    {
      id: '4',
      title: 'Clean the house',
      completed: true,
      createdAt: new Date('2024-01-04'),
    },
  ]

  describe('filter "all"', () => {
    it('returns all tasks when filter is "all"', () => {
      const { result } = renderHook(() => useTaskFilter(sampleTasks, 'all'))

      expect(result.current).toHaveLength(4)
      expect(result.current).toEqual(sampleTasks)
    })

    it('returns empty array when tasks is empty and filter is "all"', () => {
      const { result } = renderHook(() => useTaskFilter([], 'all'))

      expect(result.current).toHaveLength(0)
      expect(result.current).toEqual([])
    })
  })

  describe('filter "completed"', () => {
    it('returns only completed tasks when filter is "completed"', () => {
      const { result } = renderHook(() => useTaskFilter(sampleTasks, 'completed'))

      expect(result.current).toHaveLength(2)
      expect(result.current.every((task) => task.completed)).toBe(true)
      expect(result.current.map((t) => t.id)).toEqual(['2', '4'])
    })

    it('returns empty array when no tasks are completed', () => {
      const pendingOnly: Task[] = [
        { id: '1', title: 'Task 1', completed: false, createdAt: new Date() },
        { id: '2', title: 'Task 2', completed: false, createdAt: new Date() },
      ]
      const { result } = renderHook(() => useTaskFilter(pendingOnly, 'completed'))

      expect(result.current).toHaveLength(0)
    })

    it('returns empty array when tasks is empty and filter is "completed"', () => {
      const { result } = renderHook(() => useTaskFilter([], 'completed'))

      expect(result.current).toHaveLength(0)
    })
  })

  describe('filter "pending"', () => {
    it('returns only pending tasks when filter is "pending"', () => {
      const { result } = renderHook(() => useTaskFilter(sampleTasks, 'pending'))

      expect(result.current).toHaveLength(2)
      expect(result.current.every((task) => !task.completed)).toBe(true)
      expect(result.current.map((t) => t.id)).toEqual(['1', '3'])
    })

    it('returns empty array when no tasks are pending', () => {
      const completedOnly: Task[] = [
        { id: '1', title: 'Task 1', completed: true, createdAt: new Date() },
        { id: '2', title: 'Task 2', completed: true, createdAt: new Date() },
      ]
      const { result } = renderHook(() => useTaskFilter(completedOnly, 'pending'))

      expect(result.current).toHaveLength(0)
    })

    it('returns empty array when tasks is empty and filter is "pending"', () => {
      const { result } = renderHook(() => useTaskFilter([], 'pending'))

      expect(result.current).toHaveLength(0)
    })
  })

  describe('memoization', () => {
    it('returns same reference when inputs do not change', () => {
      const { result, rerender } = renderHook(() => useTaskFilter(sampleTasks, 'all'))

      const firstResult = result.current
      rerender()
      const secondResult = result.current

      expect(firstResult).toBe(secondResult)
    })
  })

  describe('filterTasks pure function', () => {
    it('filters completed tasks correctly', () => {
      const result = filterTasks(sampleTasks, 'completed')

      expect(result).toHaveLength(2)
      expect(result.every((t) => t.completed)).toBe(true)
    })

    it('filters pending tasks correctly', () => {
      const result = filterTasks(sampleTasks, 'pending')

      expect(result).toHaveLength(2)
      expect(result.every((t) => !t.completed)).toBe(true)
    })

    it('returns all tasks for "all" filter', () => {
      const result = filterTasks(sampleTasks, 'all')

      expect(result).toEqual(sampleTasks)
    })
  })
})
