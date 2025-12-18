import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskItem } from './TaskItem'
import type { Task } from '../../../types'

const createTask = (overrides: Partial<Task> = {}): Task => ({
  id: '1',
  title: 'Test task',
  completed: false,
  createdAt: new Date('2024-01-01'),
  ...overrides,
})

describe('TaskItem', () => {
  const defaultProps = {
    task: createTask(),
    onToggle: vi.fn(),
    onDelete: vi.fn(),
    onUpdate: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders task title', () => {
      render(<TaskItem {...defaultProps} />)

      expect(screen.getByText('Test task')).toBeInTheDocument()
    })

    it('renders as list item', () => {
      render(<TaskItem {...defaultProps} />)

      expect(screen.getByRole('listitem')).toBeInTheDocument()
    })

    it('renders checkbox', () => {
      render(<TaskItem {...defaultProps} />)

      expect(screen.getByRole('checkbox')).toBeInTheDocument()
    })

    it('renders delete button', () => {
      render(<TaskItem {...defaultProps} />)

      expect(screen.getByRole('button', { name: /eliminar/i })).toBeInTheDocument()
    })

    it('shows strikethrough when task is completed', () => {
      const task = createTask({ completed: true })
      render(<TaskItem {...defaultProps} task={task} />)

      expect(screen.getByText('Test task')).toHaveClass('line-through')
    })

    it('checkbox is checked when task is completed', () => {
      const task = createTask({ completed: true })
      render(<TaskItem {...defaultProps} task={task} />)

      expect(screen.getByRole('checkbox')).toBeChecked()
    })
  })

  describe('toggle', () => {
    it('calls onToggle when checkbox is clicked', async () => {
      const onToggle = vi.fn()
      const user = userEvent.setup()

      render(<TaskItem {...defaultProps} onToggle={onToggle} />)

      await user.click(screen.getByRole('checkbox'))

      expect(onToggle).toHaveBeenCalledWith('1')
    })
  })

  describe('delete', () => {
    it('calls onDelete when delete button is clicked', async () => {
      const onDelete = vi.fn()
      const user = userEvent.setup()

      render(<TaskItem {...defaultProps} onDelete={onDelete} />)

      await user.click(screen.getByRole('button', { name: /eliminar/i }))

      expect(onDelete).toHaveBeenCalledWith('1')
    })
  })

  describe('edit', () => {
    it('enters edit mode when title is double-clicked', async () => {
      const user = userEvent.setup()

      render(<TaskItem {...defaultProps} />)

      await user.dblClick(screen.getByText('Test task'))

      expect(screen.getByRole('textbox')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toHaveValue('Test task')
    })

    it('calls onUpdate when edit is submitted with Enter', async () => {
      const onUpdate = vi.fn()
      const user = userEvent.setup()

      render(<TaskItem {...defaultProps} onUpdate={onUpdate} />)

      await user.dblClick(screen.getByText('Test task'))
      await user.clear(screen.getByRole('textbox'))
      await user.type(screen.getByRole('textbox'), 'Updated task{Enter}')

      expect(onUpdate).toHaveBeenCalledWith('1', 'Updated task')
    })

    it('cancels edit when Escape is pressed', async () => {
      const onUpdate = vi.fn()
      const user = userEvent.setup()

      render(<TaskItem {...defaultProps} onUpdate={onUpdate} />)

      await user.dblClick(screen.getByText('Test task'))
      await user.type(screen.getByRole('textbox'), 'Changed{Escape}')

      expect(onUpdate).not.toHaveBeenCalled()
      expect(screen.getByText('Test task')).toBeInTheDocument()
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })

    it('saves edit when input loses focus', async () => {
      const onUpdate = vi.fn()
      const user = userEvent.setup()

      render(<TaskItem {...defaultProps} onUpdate={onUpdate} />)

      await user.dblClick(screen.getByText('Test task'))
      await user.clear(screen.getByRole('textbox'))
      await user.type(screen.getByRole('textbox'), 'Blurred task')
      await user.tab()

      expect(onUpdate).toHaveBeenCalledWith('1', 'Blurred task')
    })

    it('enters edit mode when Enter is pressed on focused title', async () => {
      const user = userEvent.setup()

      render(<TaskItem {...defaultProps} />)

      const title = screen.getByText('Test task')
      title.focus()
      await user.keyboard('{Enter}')

      expect(screen.getByRole('textbox')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toHaveValue('Test task')
    })

    it('enters edit mode when F2 is pressed on focused title', async () => {
      const user = userEvent.setup()

      render(<TaskItem {...defaultProps} />)

      const title = screen.getByText('Test task')
      title.focus()
      await user.keyboard('{F2}')

      expect(screen.getByRole('textbox')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toHaveValue('Test task')
    })

    it('title is focusable via keyboard', () => {
      render(<TaskItem {...defaultProps} />)

      const title = screen.getByText('Test task')

      expect(title).toHaveAttribute('tabIndex', '0')
    })
  })
})
