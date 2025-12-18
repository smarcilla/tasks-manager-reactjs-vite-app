import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'

describe('Input', () => {
  it('renders input with placeholder', () => {
    render(<Input placeholder="Enter text" />)

    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('renders as textbox role', () => {
    render(<Input placeholder="Enter text" />)

    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('accepts user input', async () => {
    const user = userEvent.setup()
    render(<Input placeholder="Enter text" />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'Hello')

    expect(input).toHaveValue('Hello')
  })

  it('calls onChange when value changes', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<Input placeholder="Enter text" onChange={handleChange} />)

    await user.type(screen.getByRole('textbox'), 'H')

    expect(handleChange).toHaveBeenCalled()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input placeholder="Enter text" disabled />)

    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  describe('with label', () => {
    it('renders label when provided', () => {
      render(<Input label="Email" placeholder="Enter email" />)

      expect(screen.getByLabelText('Email')).toBeInTheDocument()
    })

    it('associates label with input via id', () => {
      render(<Input id="email" label="Email" placeholder="Enter email" />)

      const input = screen.getByLabelText('Email')
      expect(input).toHaveAttribute('id', 'email')
    })
  })

  describe('with error', () => {
    it('renders error message when provided', () => {
      render(<Input placeholder="Enter text" error="This field is required" />)

      expect(screen.getByText('This field is required')).toBeInTheDocument()
    })

    it('has error styling when error is present', () => {
      render(<Input placeholder="Enter text" error="Error" />)

      expect(screen.getByRole('textbox')).toHaveClass('border-red-500')
    })

    it('has aria-invalid when error is present', () => {
      render(<Input placeholder="Enter text" error="Error" />)

      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
    })
  })
})
