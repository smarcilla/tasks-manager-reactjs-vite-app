import { useState, useRef, type FormEvent, type ChangeEvent } from 'react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'

interface TaskFormProps {
  onSubmit: (title: string) => void
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      setError('El título es requerido')
      inputRef.current?.focus()
      return
    }

    onSubmit(trimmedTitle)
    setTitle('')
    inputRef.current?.focus()
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    if (error) {
      setError(null)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-2 sm:gap-3"
      aria-label="Formulario para agregar tarea"
    >
      <div className="flex-1">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Nueva tarea"
          value={title}
          onChange={handleChange}
          error={error ?? undefined}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? 'task-form-error' : undefined}
        />
      </div>
      <Button
        type="submit"
        className="w-full sm:w-auto shrink-0"
      >
        Agregar
      </Button>
    </form>
  )
}
