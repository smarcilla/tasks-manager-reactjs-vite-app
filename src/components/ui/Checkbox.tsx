import type { InputHTMLAttributes, KeyboardEvent } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

export function Checkbox({ label, id, className = '', onKeyDown, onChange, disabled, ...props }: CheckboxProps) {
  // Only generate ID if we have a label to associate with
  const checkboxId = label ? (id || label.toLowerCase().replace(/\s+/g, '-')) : id

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Allow Enter key to toggle checkbox (native behavior only supports Space)
    if (e.key === 'Enter' && !disabled && onChange) {
      e.preventDefault()
      // Create a synthetic change event
      const syntheticEvent = {
        ...e,
        target: e.currentTarget,
        currentTarget: e.currentTarget,
      } as unknown as React.ChangeEvent<HTMLInputElement>
      onChange(syntheticEvent)
    }
    // Call original onKeyDown if provided
    onKeyDown?.(e)
  }

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={checkboxId}
        className={`h-5 w-5 rounded border-gray-300 text-blue-600 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
        onKeyDown={handleKeyDown}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      {label && (
        <label
          htmlFor={checkboxId}
          className="ml-2 text-sm text-gray-700 cursor-pointer select-none"
        >
          {label}
        </label>
      )}
    </div>
  )
}
