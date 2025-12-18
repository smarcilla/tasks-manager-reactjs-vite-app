import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('rendering', () => {
    it('renders the app title in header', () => {
      render(<App />)
      expect(screen.getByRole('heading', { level: 1, name: /tasks manager/i })).toBeInTheDocument()
    })

    it('renders the task form with input and button', () => {
      render(<App />)
      expect(screen.getByPlaceholderText('Nueva tarea')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /agregar/i })).toBeInTheDocument()
    })

    it('renders the task filter buttons', () => {
      render(<App />)
      expect(screen.getByRole('button', { name: /todas/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /completadas/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /pendientes/i })).toBeInTheDocument()
    })

    it('renders empty state message when no tasks', () => {
      render(<App />)
      expect(screen.getByText(/no hay tareas/i)).toBeInTheDocument()
    })

    it('renders footer', () => {
      render(<App />)
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })
  })

  describe('complete user flow: add -> view -> complete -> filter', () => {
    it('allows adding a new task', async () => {
      const user = userEvent.setup()
      render(<App />)

      const input = screen.getByPlaceholderText('Nueva tarea')
      await user.type(input, 'Buy groceries')
      await user.click(screen.getByRole('button', { name: /agregar/i }))

      expect(screen.getByText('Buy groceries')).toBeInTheDocument()
      expect(input).toHaveValue('')
    })

    it('allows completing a task', async () => {
      const user = userEvent.setup()
      render(<App />)

      // Add a task
      const input = screen.getByPlaceholderText('Nueva tarea')
      await user.type(input, 'Buy groceries')
      await user.click(screen.getByRole('button', { name: /agregar/i }))

      // Complete the task
      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)

      expect(checkbox).toBeChecked()
    })

    it('allows filtering tasks by status', async () => {
      const user = userEvent.setup()
      render(<App />)

      // Add two tasks
      const input = screen.getByPlaceholderText('Nueva tarea')
      await user.type(input, 'Task 1')
      await user.click(screen.getByRole('button', { name: /agregar/i }))
      await user.type(input, 'Task 2')
      await user.click(screen.getByRole('button', { name: /agregar/i }))

      // Complete first task
      const checkboxes = screen.getAllByRole('checkbox')
      await user.click(checkboxes[0])

      // Filter by completed
      await user.click(screen.getByRole('button', { name: /completadas/i }))
      expect(screen.getByText('Task 1')).toBeInTheDocument()
      expect(screen.queryByText('Task 2')).not.toBeInTheDocument()

      // Filter by pending
      await user.click(screen.getByRole('button', { name: /pendientes/i }))
      expect(screen.queryByText('Task 1')).not.toBeInTheDocument()
      expect(screen.getByText('Task 2')).toBeInTheDocument()

      // Filter all
      await user.click(screen.getByRole('button', { name: /todas/i }))
      expect(screen.getByText('Task 1')).toBeInTheDocument()
      expect(screen.getByText('Task 2')).toBeInTheDocument()
    })

    it('allows deleting a task', async () => {
      const user = userEvent.setup()
      render(<App />)

      // Add a task
      const input = screen.getByPlaceholderText('Nueva tarea')
      await user.type(input, 'Buy groceries')
      await user.click(screen.getByRole('button', { name: /agregar/i }))

      expect(screen.getByText('Buy groceries')).toBeInTheDocument()

      // Delete the task
      await user.click(screen.getByRole('button', { name: /eliminar/i }))

      expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument()
      expect(screen.getByText(/no hay tareas/i)).toBeInTheDocument()
    })

    it('allows editing a task by double-clicking', async () => {
      const user = userEvent.setup()
      render(<App />)

      // Add a task
      const input = screen.getByPlaceholderText('Nueva tarea')
      await user.type(input, 'Buy groceries')
      await user.click(screen.getByRole('button', { name: /agregar/i }))

      // Double-click to edit
      const taskTitle = screen.getByText('Buy groceries')
      await user.dblClick(taskTitle)

      // Edit the task
      const editInput = screen.getByDisplayValue('Buy groceries')
      await user.clear(editInput)
      await user.type(editInput, 'Buy vegetables{Enter}')

      expect(screen.getByText('Buy vegetables')).toBeInTheDocument()
      expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument()
    })
  })

  describe('persistence', () => {
    it('persists tasks to localStorage', async () => {
      const user = userEvent.setup()
      render(<App />)

      const input = screen.getByPlaceholderText('Nueva tarea')
      await user.type(input, 'Persistent task')
      await user.click(screen.getByRole('button', { name: /agregar/i }))

      const stored = localStorage.getItem('tasks-manager-tasks')
      expect(stored).not.toBeNull()
      expect(JSON.parse(stored!)).toHaveLength(1)
    })
  })
})
