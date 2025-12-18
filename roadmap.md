# Roadmap - Tasks Manager App

Plan de implementacion siguiendo TDD (Test-Driven Development): Red -> Green -> Refactor

## Requisitos Funcionales

- [x] Crear, editar, eliminar tareas
- [x] Marcar tareas como completadas
- [x] Filtrar tareas por estado (todas, completadas, pendientes)
- [x] Persistencia en localStorage
- [x] UI sencilla y responsiva

---

## Flujo de Trabajo Git

Cada fase se desarrolla en una rama separada con su correspondiente Pull Request.

### Convencion de Ramas
```
feature/<descripcion>   # Nuevas funcionalidades
fix/<descripcion>       # Correccion de bugs
refactor/<descripcion>  # Refactorizacion de codigo
test/<descripcion>      # Adicion de tests
docs/<descripcion>      # Documentacion
```

### Proceso por Fase
```bash
# 1. Crear rama para la fase
git checkout main && git pull origin main
git checkout -b feature/fase-X-descripcion

# 2. Desarrollar siguiendo TDD (commits frecuentes)
git add . && git commit -m "feat(scope): descripcion"

# 3. Push y crear PR
git push -u origin feature/fase-X-descripcion

# 4. Despues del merge, limpiar
git checkout main && git pull origin main
git branch -d feature/fase-X-descripcion
```

---

## Fase 0: Preparacion del Proyecto

**Rama:** `feature/initial-setup`

### Entregable 0.1: Configuracion inicial
- [ ] Limpiar App.tsx del contenido template (contador de ejemplo)
- [ ] Limpiar App.css de estilos del template
- [ ] Actualizar App.test.tsx para la nueva app
- [ ] Actualizar e2e/app.spec.ts con tests basicos de la nueva app

**Criterio de aceptacion:** App muestra titulo "Tasks Manager" y pasa tests basicos.

---

## Fase 1: Modelo de Datos y Tipos

**Rama:** `feature/task-types`

### Entregable 1.1: Definir tipos TypeScript
**Archivo:** `src/types/task.ts`

- [ ] **RED:** Escribir test que verifique la estructura del tipo Task
- [ ] **GREEN:** Crear interface Task con: id, title, completed, createdAt
- [ ] **REFACTOR:** Agregar tipos auxiliares (TaskFilter, TaskFormData)

```typescript
// Estructura esperada
interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: Date
}

type TaskFilter = 'all' | 'completed' | 'pending'
```

**Criterio de aceptacion:** Tipos exportados desde `src/types/index.ts`

---

## Fase 2: Capa de Servicios (localStorage)

**Rama:** `feature/task-storage`

### Entregable 2.1: Servicio de persistencia
**Archivo:** `src/services/taskStorage.ts`

- [ ] **RED:** Test para `getTasks()` - retorna array vacio si no hay datos
- [ ] **GREEN:** Implementar `getTasks()`
- [ ] **REFACTOR:** Manejar errores de parsing JSON

- [ ] **RED:** Test para `saveTasks(tasks)` - guarda en localStorage
- [ ] **GREEN:** Implementar `saveTasks()`
- [ ] **REFACTOR:** Optimizar serializacion

- [ ] **RED:** Test para persistencia entre llamadas
- [ ] **GREEN:** Verificar integracion get/save
- [ ] **REFACTOR:** Extraer constante STORAGE_KEY

**Criterio de aceptacion:** 
- Tests unitarios pasan (`pnpm test:run`)
- Servicio exportado desde `src/services/index.ts`

---

## Fase 3: Custom Hook para Gestion de Tareas

**Rama:** `feature/use-tasks-hook`

### Entregable 3.1: Hook useTasks
**Archivo:** `src/hooks/useTasks.ts`

- [ ] **RED:** Test para estado inicial (carga desde localStorage)
- [ ] **GREEN:** Implementar carga inicial
- [ ] **REFACTOR:** Memoizar estado inicial

- [ ] **RED:** Test para `addTask(title)` - crea nueva tarea
- [ ] **GREEN:** Implementar `addTask`
- [ ] **REFACTOR:** Generar ID unico con crypto.randomUUID()

- [ ] **RED:** Test para `toggleTask(id)` - cambia estado completed
- [ ] **GREEN:** Implementar `toggleTask`
- [ ] **REFACTOR:** Usar actualizacion funcional de estado

- [ ] **RED:** Test para `deleteTask(id)` - elimina tarea
- [ ] **GREEN:** Implementar `deleteTask`
- [ ] **REFACTOR:** Verificar que ID existe antes de eliminar

- [ ] **RED:** Test para `updateTask(id, title)` - edita titulo
- [ ] **GREEN:** Implementar `updateTask`
- [ ] **REFACTOR:** Validar titulo no vacio

- [ ] **RED:** Test para persistencia automatica en localStorage
- [ ] **GREEN:** Implementar useEffect para sincronizar
- [ ] **REFACTOR:** Debounce si es necesario

**Criterio de aceptacion:**
- Hook exportado desde `src/hooks/index.ts`
- Todas las operaciones CRUD funcionan
- Cambios se persisten automaticamente

---

## Fase 4: Componentes UI Base

**Rama:** `feature/ui-components`

### Entregable 4.1: Componente Button
**Archivo:** `src/components/ui/Button.tsx`

- [ ] **RED:** Test renderiza boton con texto
- [ ] **GREEN:** Implementar componente basico
- [ ] **REFACTOR:** Agregar variantes (primary, secondary, danger)

### Entregable 4.2: Componente Input
**Archivo:** `src/components/ui/Input.tsx`

- [ ] **RED:** Test renderiza input con placeholder
- [ ] **GREEN:** Implementar componente basico
- [ ] **REFACTOR:** Agregar soporte para label y error

### Entregable 4.3: Componente Checkbox
**Archivo:** `src/components/ui/Checkbox.tsx`

- [ ] **RED:** Test renderiza checkbox con label
- [ ] **GREEN:** Implementar componente basico
- [ ] **REFACTOR:** Agregar estilos accesibles

**Criterio de aceptacion:**
- Componentes exportados desde `src/components/ui/index.ts`
- Estilos con Tailwind CSS
- Tests de accesibilidad basicos (roles ARIA)

---

## Fase 5: Componentes de Feature (Tasks)

**Rama:** `feature/task-components`

### Entregable 5.1: TaskItem
**Archivo:** `src/features/tasks/components/TaskItem.tsx`

- [ ] **RED:** Test renderiza titulo de tarea
- [ ] **GREEN:** Implementar componente
- [ ] **REFACTOR:** Agregar estilos para tarea completada (tachado)

- [ ] **RED:** Test checkbox llama onToggle
- [ ] **GREEN:** Implementar toggle
- [ ] **REFACTOR:** Agregar animacion de transicion

- [ ] **RED:** Test boton eliminar llama onDelete
- [ ] **GREEN:** Implementar delete
- [ ] **REFACTOR:** Agregar confirmacion o undo

- [ ] **RED:** Test modo edicion permite cambiar titulo
- [ ] **GREEN:** Implementar edicion inline
- [ ] **REFACTOR:** Manejar teclas Enter/Escape

### Entregable 5.2: TaskForm
**Archivo:** `src/features/tasks/components/TaskForm.tsx`

- [ ] **RED:** Test renderiza input y boton submit
- [ ] **GREEN:** Implementar formulario basico
- [ ] **REFACTOR:** Agregar validacion (titulo requerido)

- [ ] **RED:** Test submit llama onAdd con titulo
- [ ] **GREEN:** Implementar submit handler
- [ ] **REFACTOR:** Limpiar input despues de submit

- [ ] **RED:** Test no permite submit con titulo vacio
- [ ] **GREEN:** Implementar validacion
- [ ] **REFACTOR:** Mostrar mensaje de error

### Entregable 5.3: TaskList
**Archivo:** `src/features/tasks/components/TaskList.tsx`

- [ ] **RED:** Test renderiza lista de tareas
- [ ] **GREEN:** Implementar componente
- [ ] **REFACTOR:** Agregar mensaje cuando lista esta vacia

- [ ] **RED:** Test pasa props correctamente a TaskItem
- [ ] **GREEN:** Implementar conexion
- [ ] **REFACTOR:** Optimizar con React.memo si es necesario

### Entregable 5.4: TaskFilter
**Archivo:** `src/features/tasks/components/TaskFilter.tsx`

- [ ] **RED:** Test renderiza 3 opciones de filtro
- [ ] **GREEN:** Implementar botones/tabs de filtro
- [ ] **REFACTOR:** Agregar estilo activo al filtro seleccionado

- [ ] **RED:** Test click en filtro llama onChange
- [ ] **GREEN:** Implementar handlers
- [ ] **REFACTOR:** Mostrar contador de tareas por filtro

**Criterio de aceptacion:**
- Componentes exportados desde `src/features/tasks/index.ts`
- Tests de interaccion con Testing Library
- Componentes accesibles (roles ARIA, labels)

---

## Fase 6: Hook de Filtrado

**Rama:** `feature/use-task-filter-hook`

### Entregable 6.1: useTaskFilter
**Archivo:** `src/hooks/useTaskFilter.ts`

- [ ] **RED:** Test filtro 'all' retorna todas las tareas
- [ ] **GREEN:** Implementar filtro all
- [ ] **REFACTOR:** Memoizar resultado

- [ ] **RED:** Test filtro 'completed' retorna solo completadas
- [ ] **GREEN:** Implementar filtro completed
- [ ] **REFACTOR:** Verificar edge cases

- [ ] **RED:** Test filtro 'pending' retorna solo pendientes
- [ ] **GREEN:** Implementar filtro pending
- [ ] **REFACTOR:** Extraer logica de filtrado a funcion pura

**Criterio de aceptacion:**
- Hook exportado desde `src/hooks/index.ts`
- Funciona correctamente con lista vacia

---

## Fase 7: Integracion en App

**Rama:** `feature/app-integration`

### Entregable 7.1: Layout principal
**Archivo:** `src/components/layout/AppLayout.tsx`

- [ ] **RED:** Test renderiza header con titulo
- [ ] **GREEN:** Implementar layout basico
- [ ] **REFACTOR:** Agregar estilos responsivos

### Entregable 7.2: Pagina principal
**Archivo:** `src/App.tsx`

- [ ] **RED:** Test renderiza todos los componentes
- [ ] **GREEN:** Integrar TaskForm, TaskFilter, TaskList
- [ ] **REFACTOR:** Agregar estados de carga si es necesario

- [ ] **RED:** Test flujo completo: agregar -> ver -> completar -> filtrar
- [ ] **GREEN:** Conectar hooks y componentes
- [ ] **REFACTOR:** Optimizar re-renders

**Criterio de aceptacion:**
- App funcional end-to-end
- Estilos responsivos (mobile-first)
- Sin errores en consola

---

## Fase 8: Tests E2E con Page Object Model (POM)

**Rama:** `test/e2e-pom`

### Entregable 8.1: Estructura POM
**Directorio:** `e2e/pages/`

- [ ] Crear clase base `BasePage.ts` con metodos comunes
  - Constructor que recibe `Page`
  - Metodo `goto(path)` para navegacion
  - Metodos de utilidad compartidos

- [ ] Crear `TasksPage.ts` extendiendo BasePage
  - Definir locators como propiedades readonly
  - Implementar acciones: `addTask()`, `toggleTask()`, `deleteTask()`, `editTask()`
  - Implementar filtros: `filterBy(filter)`
  - Implementar getters para assertions: `getTaskItem()`, `getTaskCheckbox()`, `getTaskCount()`

### Entregable 8.2: Tests E2E usando POM
**Archivo:** `e2e/tasks.spec.ts`

- [ ] Test: Usuario puede crear una tarea
  ```typescript
  await tasksPage.addTask('Mi tarea')
  await expect(tasksPage.getTaskItem('Mi tarea')).toBeVisible()
  ```

- [ ] Test: Usuario puede marcar tarea como completada
  ```typescript
  await tasksPage.toggleTask('Mi tarea')
  await expect(tasksPage.getTaskCheckbox('Mi tarea')).toBeChecked()
  ```

- [ ] Test: Usuario puede eliminar una tarea
  ```typescript
  await tasksPage.deleteTask('Mi tarea')
  await expect(tasksPage.getTaskItem('Mi tarea')).not.toBeVisible()
  ```

- [ ] Test: Usuario puede editar una tarea
  ```typescript
  await tasksPage.editTask('Mi tarea', 'Tarea editada')
  await expect(tasksPage.getTaskItem('Tarea editada')).toBeVisible()
  ```

- [ ] Test: Usuario puede filtrar tareas por estado
  ```typescript
  await tasksPage.filterBy('completed')
  // Verificar que solo se muestran tareas completadas
  ```

- [ ] Test: Tareas persisten despues de recargar pagina
  ```typescript
  await tasksPage.addTask('Tarea persistente')
  await tasksPage.goto() // Recargar
  await expect(tasksPage.getTaskItem('Tarea persistente')).toBeVisible()
  ```

### Entregable 8.3: Actualizar tests existentes
**Archivo:** `e2e/app.spec.ts`

- [ ] Refactorizar tests existentes para usar POM si aplica
- [ ] Verificar que todos los tests E2E pasan

**Criterio de aceptacion:**
- `pnpm test:e2e` pasa todos los tests
- Todos los tests usan Page Objects (no selectores directos en tests)
- Page Objects documentados con JSDoc si es necesario

**Estructura de archivos E2E:**
```
e2e/
├── pages/
│   ├── BasePage.ts       # Clase base con metodos comunes
│   └── TasksPage.ts      # Page Object para tareas
├── app.spec.ts           # Tests generales de la app
└── tasks.spec.ts         # Tests de funcionalidad de tareas
```

---

## Fase 9: Polish y Accesibilidad

**Rama:** `feature/polish-accessibility`

### Entregable 9.1: Mejoras de UX
- [ ] Agregar feedback visual al completar acciones
- [ ] Implementar estados empty/loading
- [ ] Agregar transiciones y animaciones sutiles

### Entregable 9.2: Accesibilidad
- [ ] Verificar navegacion por teclado
- [ ] Agregar focus visible en elementos interactivos
- [ ] Verificar contraste de colores
- [ ] Agregar aria-labels donde sea necesario

### Entregable 9.3: Responsive Design
- [ ] Verificar en mobile (320px)
- [ ] Verificar en tablet (768px)
- [ ] Verificar en desktop (1024px+)

**Criterio de aceptacion:**
- Score de accesibilidad > 90 en Lighthouse
- Sin issues de contraste

---

## Fase 10: Documentacion y Cierre

**Rama:** `docs/final-documentation`

### Entregable 10.1: Documentacion
- [ ] Actualizar README.md con instrucciones de uso
- [ ] Actualizar AGENTS.md con contexto del proyecto
- [ ] Documentar decisiones de arquitectura en codigo

### Entregable 10.2: Validacion final
- [ ] `pnpm quality` pasa sin errores
- [ ] `pnpm verify` pasa completamente
- [ ] `pnpm docker:build` genera imagen correctamente

---

## Estructura de Archivos Final

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── AppLayout.test.tsx
│   │   └── index.ts
│   └── ui/
│       ├── Button.tsx
│       ├── Button.test.tsx
│       ├── Input.tsx
│       ├── Input.test.tsx
│       ├── Checkbox.tsx
│       ├── Checkbox.test.tsx
│       └── index.ts
├── features/
│   └── tasks/
│       ├── components/
│       │   ├── TaskItem.tsx
│       │   ├── TaskItem.test.tsx
│       │   ├── TaskForm.tsx
│       │   ├── TaskForm.test.tsx
│       │   ├── TaskList.tsx
│       │   ├── TaskList.test.tsx
│       │   ├── TaskFilter.tsx
│       │   ├── TaskFilter.test.tsx
│       │   └── index.ts
│       └── index.ts
├── hooks/
│   ├── useTasks.ts
│   ├── useTasks.test.ts
│   ├── useTaskFilter.ts
│   ├── useTaskFilter.test.ts
│   └── index.ts
├── services/
│   ├── taskStorage.ts
│   ├── taskStorage.test.ts
│   └── index.ts
├── types/
│   ├── task.ts
│   └── index.ts
├── App.tsx
├── App.test.tsx
└── main.tsx

e2e/
├── pages/
│   ├── BasePage.ts
│   └── TasksPage.ts
├── app.spec.ts
└── tasks.spec.ts
```

---

## Comandos TDD

Para cada ciclo Red-Green-Refactor:

```bash
# 1. RED: Escribir test que falla
pnpm test -- --watch src/path/to/file.test.ts

# 2. GREEN: Implementar codigo minimo
# (el test debe pasar)

# 3. REFACTOR: Mejorar codigo
# (los tests deben seguir pasando)

# Verificacion completa
pnpm quality
```

---

## Orden de Implementacion Recomendado

1. **Fase 0** - Preparacion (15 min)
2. **Fase 1** - Tipos (15 min)
3. **Fase 2** - Servicio localStorage (30 min)
4. **Fase 3** - Hook useTasks (45 min)
5. **Fase 4** - Componentes UI base (30 min)
6. **Fase 5** - Componentes de Tasks (1.5 h)
7. **Fase 6** - Hook de filtrado (20 min)
8. **Fase 7** - Integracion (30 min)
9. **Fase 8** - Tests E2E con POM (45 min)
10. **Fase 9** - Polish (45 min)
11. **Fase 10** - Documentacion (15 min)

**Tiempo total estimado:** ~6.5 horas

---

## Notas para el Desarrollo

### Principios TDD
1. **No escribir codigo de produccion sin un test que falle primero**
2. **Escribir solo el codigo necesario para pasar el test**
3. **Refactorizar solo cuando los tests pasan**

### Testing Library Best Practices
- Usar queries por rol (`getByRole`) cuando sea posible
- Preferir `userEvent` sobre `fireEvent`
- Testear comportamiento, no implementacion

### Convencion de Commits
```
feat(tasks): add TaskItem component
test(tasks): add unit tests for useTasks hook
refactor(ui): extract Button variants
fix(storage): handle JSON parse errors
```

### Page Object Model (POM) Best Practices
1. **Un Page Object por pagina/feature** - Mantener separacion de responsabilidades
2. **Locators como propiedades readonly** - Definir en el constructor para lazy evaluation
3. **Metodos para acciones** - Encapsular interacciones complejas (ej: `addTask()`, `filterBy()`)
4. **Getters para assertions** - Retornar Locators para usar con `expect()` en tests
5. **No incluir assertions en Page Objects** - Las assertions pertenecen a los tests
6. **Heredar de BasePage** - Reutilizar metodos comunes como `goto()`
7. **Usar selectores accesibles** - Preferir `getByRole`, `getByLabel`, `getByPlaceholder`

---

## Resumen de Ramas y Pull Requests

| Fase | Rama | PR Title |
|------|------|----------|
| 0 | `feature/initial-setup` | `feat: initial project setup for Tasks Manager` |
| 1 | `feature/task-types` | `feat(types): add Task and TaskFilter types` |
| 2 | `feature/task-storage` | `feat(services): add localStorage persistence service` |
| 3 | `feature/use-tasks-hook` | `feat(hooks): add useTasks hook with CRUD operations` |
| 4 | `feature/ui-components` | `feat(ui): add Button, Input, and Checkbox components` |
| 5 | `feature/task-components` | `feat(tasks): add TaskItem, TaskForm, TaskList, TaskFilter` |
| 6 | `feature/use-task-filter-hook` | `feat(hooks): add useTaskFilter hook` |
| 7 | `feature/app-integration` | `feat(app): integrate all components in App` |
| 8 | `test/e2e-pom` | `test(e2e): add E2E tests with Page Object Model` |
| 9 | `feature/polish-accessibility` | `feat(a11y): improve UX and accessibility` |
| 10 | `docs/final-documentation` | `docs: update documentation and final validation` |

### Checklist por PR

Antes de crear un PR, verificar:
- [ ] Tests pasan localmente (`pnpm test:run`)
- [ ] Lint pasa (`pnpm lint`)
- [ ] TypeScript compila (`pnpm typecheck`)
- [ ] Commits siguen convencion (`feat:`, `fix:`, `test:`, etc.)
- [ ] Descripcion del PR incluye resumen de cambios
- [ ] CI pasa en GitHub
