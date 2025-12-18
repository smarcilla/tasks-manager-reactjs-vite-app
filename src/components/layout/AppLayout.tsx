import type { ReactNode } from 'react'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Tasks Manager</h1>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="bg-gray-800 text-gray-300">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>Tasks Manager - Gestiona tus tareas de forma sencilla</p>
        </div>
      </footer>
    </div>
  )
}
