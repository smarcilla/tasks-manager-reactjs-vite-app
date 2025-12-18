# Tasks Manager

Aplicacion sencilla de gestion de tareas construida con React + TypeScript + Vite.

## Funcionalidades

- Crear, editar y eliminar tareas
- Marcar tareas como completadas
- Filtrar tareas por estado (todas, completadas, pendientes)
- Persistencia en localStorage
- UI responsiva con Tailwind CSS

## Tech Stack

| Categoria | Tecnologia |
|-----------|------------|
| Framework | React 19.2 |
| Lenguaje | TypeScript 5.9 |
| Build | Vite 7 |
| Estilos | Tailwind CSS 4 |
| Unit Testing | Vitest + Testing Library |
| E2E Testing | Playwright + POM |
| Linting | ESLint 9 (flat config) |
| Git Hooks | Husky |
| Container | Docker + Nginx |

## Quick Start

```bash
# Clonar repositorio
git clone <repo-url> tasks-manager
cd tasks-manager

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

La aplicacion estara disponible en `http://localhost:5173`

## Scripts

| Script | Descripcion |
|--------|-------------|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de produccion |
| `pnpm preview` | Preview del build |
| `pnpm lint` | Ejecutar ESLint |
| `pnpm lint:fix` | ESLint con auto-fix |
| `pnpm typecheck` | Verificacion de tipos |
| `pnpm test` | Tests unitarios (watch) |
| `pnpm test:run` | Tests unitarios (single run) |
| `pnpm test:coverage` | Tests con coverage |
| `pnpm test:e2e` | Tests E2E con Playwright |
| `pnpm quality` | lint + typecheck + unit tests |
| `pnpm verify` | Validacion completa + build |
| `pnpm docker:build` | Build imagen Docker |
| `pnpm docker:run` | Ejecutar contenedor (puerto 3000) |

## Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── ui/               # Primitivos UI (Button, Input, Checkbox)
│   └── layout/           # Layout (AppLayout)
├── features/             # Modulos por funcionalidad
│   └── tasks/            # Feature de tareas
│       └── components/   # TaskItem, TaskForm, TaskList, TaskFilter
├── hooks/                # Custom hooks
│   ├── useTasks.ts       # Gestion de estado de tareas
│   └── useTaskFilter.ts  # Logica de filtrado
├── services/             # Servicios externos
│   └── taskStorage.ts    # Persistencia en localStorage
├── types/                # Tipos TypeScript
│   └── task.ts           # Task, TaskFilter, TaskFormData
├── App.tsx               # Componente raiz
└── main.tsx              # Entry point

e2e/
├── pages/                # Page Object Models
│   ├── BasePage.ts       # Clase base con metodos comunes
│   └── TasksPage.ts      # Page Object para la pagina de tareas
├── app.spec.ts           # Tests E2E generales
└── tasks.spec.ts         # Tests E2E de tareas
```

## Desarrollo con TDD

Este proyecto sigue la metodologia TDD (Test-Driven Development):

1. **RED**: Escribir un test que falle
2. **GREEN**: Escribir el codigo minimo para que pase
3. **REFACTOR**: Mejorar el codigo manteniendo los tests verdes

```bash
# Ejecutar tests en modo watch
pnpm test

# Ejecutar un archivo de test especifico
pnpm test -- --watch src/hooks/useTasks.test.ts
```

## Tests E2E con Page Object Model (POM)

Los tests E2E utilizan el patron Page Object Model para mejorar la mantenibilidad y legibilidad:

```typescript
// e2e/pages/TasksPage.ts
export class TasksPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/')
  }

  async addTask(title: string) {
    await this.page.getByPlaceholder('Nueva tarea').fill(title)
    await this.page.getByRole('button', { name: 'Agregar' }).click()
  }

  async getTaskByTitle(title: string) {
    return this.page.getByRole('listitem').filter({ hasText: title })
  }
}

// e2e/tasks.spec.ts
test('usuario puede crear una tarea', async ({ page }) => {
  const tasksPage = new TasksPage(page)
  await tasksPage.goto()
  await tasksPage.addTask('Mi primera tarea')
  await expect(tasksPage.getTaskByTitle('Mi primera tarea')).toBeVisible()
})
```

**Beneficios del POM:**
- Separa la logica de interaccion con la UI de los tests
- Facilita el mantenimiento cuando cambia la UI
- Mejora la legibilidad de los tests
- Permite reutilizar codigo entre tests

## Flujo de Trabajo Git

Este proyecto utiliza un flujo de trabajo basado en ramas y pull requests:

### Ramas

| Tipo | Patron | Ejemplo |
|------|--------|---------|
| Feature | `feature/<descripcion>` | `feature/task-form` |
| Fix | `fix/<descripcion>` | `fix/localStorage-error` |
| Refactor | `refactor/<descripcion>` | `refactor/button-variants` |
| Test | `test/<descripcion>` | `test/e2e-tasks` |
| Docs | `docs/<descripcion>` | `docs/readme-update` |

### Workflow

```bash
# 1. Crear rama desde main
git checkout main
git pull origin main
git checkout -b feature/task-form

# 2. Desarrollar con commits descriptivos
git add .
git commit -m "feat(tasks): add TaskForm component"

# 3. Push y crear Pull Request
git push -u origin feature/task-form
# Crear PR en GitHub

# 4. Despues de aprobar y mergear, limpiar
git checkout main
git pull origin main
git branch -d feature/task-form
```

### Commits Convencionales

```
<tipo>(<scope>): <descripcion>

feat(tasks): add TaskForm component
fix(storage): handle JSON parse errors
test(hooks): add useTasks unit tests
refactor(ui): extract Button variants
docs(readme): update installation steps
chore(deps): update dependencies
```

## Roadmap

Ver [roadmap.md](./roadmap.md) para el plan detallado de implementacion.

## Quality Gates

### Pre-commit (Husky)
- ESLint
- TypeScript type checking

### Pre-push (Husky)
- Unit tests
- Production build

### CI/CD (GitHub Actions)

| Workflow | Proposito |
|----------|-----------|
| `ci.yml` | Calidad de codigo (lint, typecheck, tests, build) |
| `sast.yml` | Analisis de seguridad estatico (CodeQL, Trivy) |
| `dast.yml` | Analisis de seguridad dinamico (OWASP ZAP) |

## Docker

```bash
# Build de imagen
pnpm docker:build

# Ejecutar contenedor (http://localhost:3000)
pnpm docker:run

# Detener contenedor
pnpm docker:stop
```

## Licencia

MIT
