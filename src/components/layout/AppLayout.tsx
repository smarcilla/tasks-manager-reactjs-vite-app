import type { ReactNode } from 'react'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Skip link for keyboard navigation */}
      <a
        href="#main-content"
        className="skip-link"
      >
        Saltar al contenido principal
      </a>

      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 lg:px-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Tasks Manager</h1>
        </div>
      </header>

      <main
        id="main-content"
        className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 sm:py-8 lg:px-8"
        tabIndex={-1}
      >
        {children}
      </main>

      <footer className="bg-gray-800 text-gray-300">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 lg:px-8 text-center text-xs sm:text-sm">
          <p>Tasks Manager - Gestiona tus tareas de forma sencilla</p>
        </div>
      </footer>
    </div>
  )
}
