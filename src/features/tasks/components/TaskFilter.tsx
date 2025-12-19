import type { TaskFilter as TaskFilterType } from '../../../types/task'
import { Button } from '../../../components/ui/Button'

interface TaskFilterProps {
  currentFilter: TaskFilterType
  onChange: (filter: TaskFilterType) => void
}

const filterOptions: { value: TaskFilterType; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'completed', label: 'Completadas' },
  { value: 'pending', label: 'Pendientes' },
]

export function TaskFilter({ currentFilter, onChange }: TaskFilterProps) {
  return (
    <fieldset
      role="group"
      aria-label="Filtrar tareas por estado"
      className="flex flex-wrap gap-2"
    >
      {filterOptions.map(({ value, label }) => {
        const isActive = currentFilter === value
        return (
          <Button
            key={value}
            variant={isActive ? 'primary' : 'secondary'}
            onClick={() => onChange(value)}
            aria-pressed={isActive}
            className="text-xs sm:text-sm flex-1 sm:flex-none min-w-[80px]"
          >
            {label}
          </Button>
        )
      })}
    </fieldset>
  )
}
