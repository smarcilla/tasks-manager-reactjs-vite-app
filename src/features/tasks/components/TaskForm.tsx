import { useState, type FormEvent, type ChangeEvent } from 'react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'

interface TaskFormProps {
  onSubmit: (title: string) => void
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      setError('El título es requerido')
      return
    }

    onSubmit(trimmedTitle)
    setTitle('')
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    if (error) {
      setError(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Nueva tarea"
          value={title}
          onChange={handleChange}
          error={error ?? undefined}
          aria-invalid={error ? 'true' : undefined}
        />
      </div>
      <Button type="submit">Agregar</Button>
    </form>
  )
}
