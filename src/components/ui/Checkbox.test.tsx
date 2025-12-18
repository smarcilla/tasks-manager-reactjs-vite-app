import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('renders checkbox with label', () => {
    render(<Checkbox label="Accept terms" />)

    expect(screen.getByRole('checkbox', { name: /accept terms/i })).toBeInTheDocument()
  })

  it('renders as checkbox role', () => {
    render(<Checkbox label="Accept terms" />)

    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('is unchecked by default', () => {
    render(<Checkbox label="Accept terms" />)

    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('can be checked', () => {
    render(<Checkbox label="Accept terms" checked onChange={() => {}} />)

    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('calls onChange when clicked', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<Checkbox label="Accept terms" onChange={handleChange} />)

    await user.click(screen.getByRole('checkbox'))

    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Checkbox label="Accept terms" disabled />)

    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('label is clickable and toggles checkbox', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<Checkbox label="Accept terms" onChange={handleChange} />)

    await user.click(screen.getByText('Accept terms'))

    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('supports aria-label when label is empty', () => {
    render(<Checkbox label="" aria-label="Toggle task" />)

    expect(screen.getByRole('checkbox', { name: 'Toggle task' })).toBeInTheDocument()
  })

  it('does not render label element when label is empty', () => {
    const { container } = render(<Checkbox label="" aria-label="Toggle task" />)

    // Should not have a visible label element with text
    const labelElement = container.querySelector('label')
    expect(labelElement).toBeNull()
  })

  it('is accessible via keyboard when label is empty', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<Checkbox label="" aria-label="Toggle task" onChange={handleChange} />)

    const checkbox = screen.getByRole('checkbox', { name: 'Toggle task' })
    checkbox.focus()
    await user.keyboard(' ')

    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('calls onChange when Enter key is pressed', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<Checkbox label="Accept terms" onChange={handleChange} />)

    const checkbox = screen.getByRole('checkbox')
    checkbox.focus()
    await user.keyboard('{Enter}')

    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('does not call onChange on Enter when disabled', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<Checkbox label="Accept terms" onChange={handleChange} disabled />)

    const checkbox = screen.getByRole('checkbox')
    checkbox.focus()
    await user.keyboard('{Enter}')

    expect(handleChange).not.toHaveBeenCalled()
  })
})
