import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { TaskFilter as TaskFilterType } from '../../../types/task'
import { TaskFilter } from './TaskFilter'

describe('TaskFilter', () => {
  const mockOnChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders three filter buttons', () => {
      render(<TaskFilter currentFilter="all" onChange={mockOnChange} />)

      expect(screen.getByRole('button', { name: /todas/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /completadas/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /pendientes/i })).toBeInTheDocument()
    })

    it('renders filter buttons in a group', () => {
      render(<TaskFilter currentFilter="all" onChange={mockOnChange} />)

      const group = screen.getByRole('group', { name: /filtrar tareas/i })
      expect(group).toBeInTheDocument()
    })
  })

  describe('active state', () => {
    it.each<{ filter: TaskFilterType; activeButton: RegExp }>([
      { filter: 'all', activeButton: /todas/i },
      { filter: 'completed', activeButton: /completadas/i },
      { filter: 'pending', activeButton: /pendientes/i },
    ])('highlights "$filter" button when currentFilter is "$filter"', ({ filter, activeButton }) => {
      render(<TaskFilter currentFilter={filter} onChange={mockOnChange} />)

      const button = screen.getByRole('button', { name: activeButton })
      expect(button).toHaveAttribute('aria-pressed', 'true')
    })

    it('does not highlight inactive buttons', () => {
      render(<TaskFilter currentFilter="all" onChange={mockOnChange} />)

      const completedButton = screen.getByRole('button', { name: /completadas/i })
      const pendingButton = screen.getByRole('button', { name: /pendientes/i })

      expect(completedButton).toHaveAttribute('aria-pressed', 'false')
      expect(pendingButton).toHaveAttribute('aria-pressed', 'false')
    })
  })

  describe('interactions', () => {
    it('calls onChange with "all" when "Todas" button is clicked', async () => {
      const user = userEvent.setup()
      render(<TaskFilter currentFilter="completed" onChange={mockOnChange} />)

      await user.click(screen.getByRole('button', { name: /todas/i }))

      expect(mockOnChange).toHaveBeenCalledWith('all')
    })

    it('calls onChange with "completed" when "Completadas" button is clicked', async () => {
      const user = userEvent.setup()
      render(<TaskFilter currentFilter="all" onChange={mockOnChange} />)

      await user.click(screen.getByRole('button', { name: /completadas/i }))

      expect(mockOnChange).toHaveBeenCalledWith('completed')
    })

    it('calls onChange with "pending" when "Pendientes" button is clicked', async () => {
      const user = userEvent.setup()
      render(<TaskFilter currentFilter="all" onChange={mockOnChange} />)

      await user.click(screen.getByRole('button', { name: /pendientes/i }))

      expect(mockOnChange).toHaveBeenCalledWith('pending')
    })

    it('calls onChange even when clicking the already active filter', async () => {
      const user = userEvent.setup()
      render(<TaskFilter currentFilter="all" onChange={mockOnChange} />)

      await user.click(screen.getByRole('button', { name: /todas/i }))

      expect(mockOnChange).toHaveBeenCalledWith('all')
    })
  })

  describe('accessibility', () => {
    it('has accessible group structure with fieldset role', () => {
      render(<TaskFilter currentFilter="all" onChange={mockOnChange} />)

      const group = screen.getByRole('group', { name: /filtrar tareas/i })
      expect(group).toBeInTheDocument()
    })

    it('buttons have aria-pressed attribute for toggle state', () => {
      render(<TaskFilter currentFilter="completed" onChange={mockOnChange} />)

      expect(screen.getByRole('button', { name: /todas/i })).toHaveAttribute('aria-pressed', 'false')
      expect(screen.getByRole('button', { name: /completadas/i })).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByRole('button', { name: /pendientes/i })).toHaveAttribute('aria-pressed', 'false')
    })
  })
})
