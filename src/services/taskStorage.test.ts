import { getTasks, saveTasks } from './taskStorage'
import type { Task } from '../types'

const createTask = (overrides: Partial<Task> = {}): Task => ({
  id: '1',
  title: 'Test task',
  completed: false,
  createdAt: new Date('2024-01-01'),
  ...overrides,
})

describe('taskStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('getTasks', () => {
    it('returns empty array when localStorage is empty', () => {
      const tasks = getTasks()
      expect(tasks).toEqual([])
    })

    it('returns empty array when localStorage has invalid JSON', () => {
      localStorage.setItem('tasks-manager-tasks', 'invalid json')
      const tasks = getTasks()
      expect(tasks).toEqual([])
    })
  })

  describe('saveTasks', () => {
    it('saves tasks to localStorage', () => {
      const tasks = [createTask()]
      saveTasks(tasks)
      
      const stored = localStorage.getItem('tasks-manager-tasks')
      expect(stored).not.toBeNull()
      
      const parsed = JSON.parse(stored!)
      expect(parsed).toHaveLength(1)
      expect(parsed[0].id).toBe('1')
      expect(parsed[0].title).toBe('Test task')
      expect(parsed[0].completed).toBe(false)
    })
  })

  describe('integration', () => {
    it('getTasks retrieves tasks saved with saveTasks', () => {
      const tasks = [
        createTask({ id: '1', title: 'Task 1' }),
        createTask({ id: '2', title: 'Task 2', completed: true }),
      ]
      
      saveTasks(tasks)
      const retrieved = getTasks()
      
      expect(retrieved).toHaveLength(2)
      expect(retrieved[0].id).toBe('1')
      expect(retrieved[0].title).toBe('Task 1')
      expect(retrieved[1].id).toBe('2')
      expect(retrieved[1].completed).toBe(true)
    })

    it('overwrites existing tasks when saving', () => {
      saveTasks([createTask({ id: '1', title: 'Original' })])
      saveTasks([createTask({ id: '2', title: 'New' })])
      
      const retrieved = getTasks()
      
      expect(retrieved).toHaveLength(1)
      expect(retrieved[0].id).toBe('2')
      expect(retrieved[0].title).toBe('New')
    })
  })
})
