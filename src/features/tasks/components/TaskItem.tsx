import { useState, useRef, useEffect } from 'react'
import type { Task } from '../../../types'
import { Checkbox, Button } from '../../../components/ui'

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, title: string) => void
}

export function TaskItem({ task, onToggle, onDelete, onUpdate }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(task.title)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    setIsEditing(true)
    setEditValue(task.title)
  }

  const handleSave = () => {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== task.title) {
      onUpdate(task.id, trimmed)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(task.title)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const handleToggle = () => {
    setIsAnimating(true)
    onToggle(task.id)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => onDelete(task.id), 200)
  }

  return (
    <li
      className={`flex items-center gap-3 p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md hover:border-gray-300 ${
        isAnimating ? 'animate-task-complete' : ''
      } ${isDeleting ? 'animate-task-delete' : ''}`}
    >
      <Checkbox
        label=""
        checked={task.completed}
        onChange={handleToggle}
        aria-label={`Marcar "${task.title}" como ${task.completed ? 'pendiente' : 'completada'}`}
      />

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          aria-label={`Editar tarea: ${task.title}`}
          className="flex-1 px-2 py-1 text-sm sm:text-base border-2 border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-shadow"
        />
      ) : (
        <span
          tabIndex={0}
          role="button"
          aria-label={`${task.title}. Doble clic o Enter para editar`}
          onDoubleClick={handleDoubleClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'F2') {
              e.preventDefault()
              handleDoubleClick()
            }
          }}
          className={`flex-1 cursor-pointer rounded px-1 py-0.5 text-sm sm:text-base transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
            task.completed ? 'line-through text-gray-500' : 'text-gray-900'
          }`}
        >
          {task.title}
        </span>
      )}

      <Button
        variant="danger"
        onClick={handleDelete}
        aria-label={`Eliminar "${task.title}"`}
        className="px-2 py-1 text-xs sm:text-sm shrink-0"
      >
        Eliminar
      </Button>
    </li>
  )
}
