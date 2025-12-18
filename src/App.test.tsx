import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the app title', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /tasks manager/i })).toBeInTheDocument()
  })

  it('renders the main content area', () => {
    render(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('displays welcome message', () => {
    render(<App />)
    expect(screen.getByText(/gestiona tus tareas/i)).toBeInTheDocument()
  })
})
