import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskForm } from './TaskForm'

describe('TaskForm', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders an input field with placeholder', () => {
      render(<TaskForm onSubmit={mockOnSubmit} />)

      expect(screen.getByPlaceholderText('Nueva tarea')).toBeInTheDocument()
    })

    it('renders a submit button', () => {
      render(<TaskForm onSubmit={mockOnSubmit} />)

      expect(screen.getByRole('button', { name: /agregar/i })).toBeInTheDocument()
    })

    it('renders input with empty value initially', () => {
      render(<TaskForm onSubmit={mockOnSubmit} />)

      expect(screen.getByPlaceholderText('Nueva tarea')).toHaveValue('')
    })
  })

  describe('form submission', () => {
    it('calls onSubmit with trimmed title when form is submitted', async () => {
      const user = userEvent.setup()
      render(<TaskForm onSubmit={mockOnSubmit} />)

      const input = screen.getByPlaceholderText('Nueva tarea')
      await user.type(input, '  Buy groceries  ')
      await user.click(screen.getByRole('button', { name: /agregar/i }))

      expect(mockOnSubmit).toHaveBeenCalledWith('Buy groceries')
      expect(mockOnSubmit).toHaveBeenCalledTimes(1)
    })

    it('clears input after successful submission', async () => {
      const user = userEvent.setup()
      render(<TaskForm onSubmit={mockOnSubmit} />)

      const input = screen.getByPlaceholderText('Nueva tarea')
      await user.type(input, 'Buy groceries')
      await user.click(screen.getByRole('button', { name: /agregar/i }))

      expect(input).toHaveValue('')
    })

    it('submits form when pressing Enter in input', async () => {
      const user = userEvent.setup()
      render(<TaskForm onSubmit={mockOnSubmit} />)

      const input = screen.getByPlaceholderText('Nueva tarea')
      await user.type(input, 'Buy groceries{Enter}')

      expect(mockOnSubmit).toHaveBeenCalledWith('Buy groceries')
    })
  })

  describe('validation', () => {
    it('does not submit when input is empty', async () => {
      const user = userEvent.setup()
      render(<TaskForm onSubmit={mockOnSubmit} />)

      await user.click(screen.getByRole('button', { name: /agregar/i }))

      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('does not submit when input contains only whitespace', async () => {
      const user = userEvent.setup()
      render(<TaskForm onSubmit={mockOnSubmit} />)

      const input = screen.getByPlaceholderText('Nueva tarea')
      await user.type(input, '   ')
      await user.click(screen.getByRole('button', { name: /agregar/i }))

      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('shows error message when submitting empty input', async () => {
      const user = userEvent.setup()
      render(<TaskForm onSubmit={mockOnSubmit} />)

      await user.click(screen.getByRole('button', { name: /agregar/i }))

      expect(screen.getByText(/título.*requerido/i)).toBeInTheDocument()
    })

    it('clears error message when user starts typing', async () => {
      const user = userEvent.setup()
      render(<TaskForm onSubmit={mockOnSubmit} />)

      await user.click(screen.getByRole('button', { name: /agregar/i }))
      expect(screen.getByText(/título.*requerido/i)).toBeInTheDocument()

      const input = screen.getByPlaceholderText('Nueva tarea')
      await user.type(input, 'a')

      expect(screen.queryByText(/título.*requerido/i)).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('has accessible form structure', () => {
      render(<TaskForm onSubmit={mockOnSubmit} />)

      expect(screen.getByRole('textbox')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /agregar/i })).toBeInTheDocument()
    })

    it('input has aria-invalid when there is an error', async () => {
      const user = userEvent.setup()
      render(<TaskForm onSubmit={mockOnSubmit} />)

      await user.click(screen.getByRole('button', { name: /agregar/i }))

      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
    })
  })
})
