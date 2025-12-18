import { render, screen } from '@testing-library/react'
import { AppLayout } from './AppLayout'

describe('AppLayout', () => {
  describe('rendering', () => {
    it('renders header with title', () => {
      render(
        <AppLayout>
          <p>Content</p>
        </AppLayout>
      )

      expect(screen.getByRole('banner')).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 1, name: /tasks manager/i })).toBeInTheDocument()
    })

    it('renders main content area', () => {
      render(
        <AppLayout>
          <p>Content</p>
        </AppLayout>
      )

      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('renders children in main content area', () => {
      render(
        <AppLayout>
          <p>Test content</p>
        </AppLayout>
      )

      expect(screen.getByText('Test content')).toBeInTheDocument()
    })

    it('renders footer with copyright', () => {
      render(
        <AppLayout>
          <p>Content</p>
        </AppLayout>
      )

      const footer = screen.getByRole('contentinfo')
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveTextContent(/gestiona tus tareas/i)
    })
  })

  describe('accessibility', () => {
    it('has proper landmark structure', () => {
      render(
        <AppLayout>
          <p>Content</p>
        </AppLayout>
      )

      expect(screen.getByRole('banner')).toBeInTheDocument() // header
      expect(screen.getByRole('main')).toBeInTheDocument() // main
      expect(screen.getByRole('contentinfo')).toBeInTheDocument() // footer
    })
  })
})
