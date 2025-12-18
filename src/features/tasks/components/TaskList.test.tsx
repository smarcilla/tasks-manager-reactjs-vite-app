import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Task } from '../../../types/task'
import { TaskList } from './TaskList'

describe('TaskList', () => {
  const mockOnToggle = vi.fn()
  const mockOnDelete = vi.fn()
  const mockOnUpdate = vi.fn()

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
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders a list element', () => {
      render(
        <TaskList
          tasks={sampleTasks}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      )

      expect(screen.getByRole('list')).toBeInTheDocument()
    })

    it('renders all tasks as list items', () => {
      render(
        <TaskList
          tasks={sampleTasks}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      )

      const listItems = screen.getAllByRole('listitem')
      expect(listItems).toHaveLength(3)
    })

    it('renders task titles', () => {
      render(
        <TaskList
          tasks={sampleTasks}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      )

      expect(screen.getByText('Buy groceries')).toBeInTheDocument()
      expect(screen.getByText('Walk the dog')).toBeInTheDocument()
      expect(screen.getByText('Read a book')).toBeInTheDocument()
    })
  })

  describe('empty state', () => {
    it('shows empty message when no tasks', () => {
      render(
        <TaskList
          tasks={[]}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      )

      expect(screen.getByText(/no hay tareas/i)).toBeInTheDocument()
    })

    it('does not render list when no tasks', () => {
      render(
        <TaskList
          tasks={[]}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      )

      expect(screen.queryByRole('list')).not.toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('calls onToggle with task id when checkbox is clicked', async () => {
      const user = userEvent.setup()
      render(
        <TaskList
          tasks={sampleTasks}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      )

      const checkboxes = screen.getAllByRole('checkbox')
      await user.click(checkboxes[0])

      expect(mockOnToggle).toHaveBeenCalledWith('1')
    })

    it('calls onDelete with task id when delete button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <TaskList
          tasks={sampleTasks}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      )

      const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i })
      await user.click(deleteButtons[1])

      expect(mockOnDelete).toHaveBeenCalledWith('2')
    })

    it('calls onUpdate with task id and new title when task is edited', async () => {
      const user = userEvent.setup()
      render(
        <TaskList
          tasks={sampleTasks}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      )

      // Double-click to enter edit mode
      const taskTitle = screen.getByText('Buy groceries')
      await user.dblClick(taskTitle)

      const input = screen.getByDisplayValue('Buy groceries')
      await user.clear(input)
      await user.type(input, 'Buy vegetables{Enter}')

      expect(mockOnUpdate).toHaveBeenCalledWith('1', 'Buy vegetables')
    })
  })

  describe('accessibility', () => {
    it('has accessible list structure', () => {
      render(
        <TaskList
          tasks={sampleTasks}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
        />
      )

      const list = screen.getByRole('list')
      const listItems = screen.getAllByRole('listitem')

      expect(list).toBeInTheDocument()
      expect(listItems).toHaveLength(3)
    })
  })
})
