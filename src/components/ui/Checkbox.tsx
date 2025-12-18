import type { InputHTMLAttributes } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

export function Checkbox({ label, id, className = '', ...props }: CheckboxProps) {
  const checkboxId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={checkboxId}
        className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
      <label
        htmlFor={checkboxId}
        className="ml-2 text-sm text-gray-700 cursor-pointer select-none"
      >
        {label}
      </label>
    </div>
  )
}
