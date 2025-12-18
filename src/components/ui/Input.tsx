import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({
  label,
  error,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
  const hasError = Boolean(error)

  const baseStyles =
    'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed'
  const normalStyles = 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
  const errorStyles = 'border-red-500 focus:ring-red-500 focus:border-red-500'

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={hasError ? `${inputId}-error` : undefined}
        className={`${baseStyles} ${hasError ? errorStyles : normalStyles} ${className}`}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
