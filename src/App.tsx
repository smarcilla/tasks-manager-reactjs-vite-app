import { useState } from 'react'
import { AppLayout } from './components/layout'
import { TaskForm, TaskFilter, TaskList } from './features/tasks'
import { useTasks, useTaskFilter } from './hooks'
import type { TaskFilter as TaskFilterType } from './types'

function App() {
  const { tasks, addTask, toggleTask, deleteTask, updateTask } = useTasks()
  const [filter, setFilter] = useState<TaskFilterType>('all')
  const filteredTasks = useTaskFilter(tasks, filter)

  return (
    <AppLayout>
      <div className="space-y-6">
        <section aria-label="Agregar tarea">
          <TaskForm onSubmit={addTask} />
        </section>

        <section aria-label="Filtrar tareas">
          <TaskFilter currentFilter={filter} onChange={setFilter} />
        </section>

        <section aria-label="Lista de tareas">
          <TaskList
            tasks={filteredTasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        </section>
      </div>
    </AppLayout>
  )
}

export default App
