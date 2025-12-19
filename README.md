# Tasks Manager

Aplicacion de gestion de tareas construida con React + TypeScript + Vite siguiendo metodologia TDD.

## Funcionalidades

- Crear, editar y eliminar tareas
- Marcar tareas como completadas
- Filtrar tareas por estado (todas, completadas, pendientes)
- Persistencia automatica en localStorage
- Edicion inline con doble clic
- Animaciones suaves (agregar, completar, eliminar)
- UI responsiva con Tailwind CSS
- Accesibilidad completa (WCAG 2.1 AA)

## Accesibilidad

La aplicacion cumple con los estandares WCAG 2.1 nivel AA:

| Caracteristica | Implementacion |
|----------------|----------------|
| Navegacion por teclado | Skip link, focus visible, tab order logico |
| Lectores de pantalla | ARIA labels, roles, live regions |
| Movimiento reducido | Respeta `prefers-reduced-motion` |
| Contraste | Colores con ratio minimo 4.5:1 |
| Responsive | Funciona desde 320px hasta desktop |

### Atajos de Teclado

| Accion | Tecla |
|--------|-------|
| Agregar tarea | `Enter` en el campo de texto |
| Guardar edicion | `Enter` |
| Cancelar edicion | `Escape` |
| Navegar | `Tab` / `Shift+Tab` |

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

### Requisitos Previos

- Node.js 20+
- pnpm 9+

### Instalacion

```bash
# Clonar repositorio
git clone https://github.com/smarcilla/tasks-manager-reactjs-vite-app.git
cd tasks-manager-reactjs-vite-app

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

La aplicacion estara disponible en `http://localhost:5173`

### Uso Basico

1. **Agregar tarea**: Escribe el titulo en el campo de texto y presiona Enter o clic en "Agregar"
2. **Completar tarea**: Marca el checkbox junto a la tarea
3. **Editar tarea**: Doble clic en el titulo de la tarea, modifica y presiona Enter
4. **Eliminar tarea**: Clic en el boton "Eliminar"
5. **Filtrar tareas**: Usa los botones "Todas", "Completadas" o "Pendientes"

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

## Arquitectura

### Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── ui/               # Primitivos UI (Button, Input, Checkbox)
│   └── layout/           # Layout (AppLayout)
├── features/             # Modulos por funcionalidad
│   └── tasks/            # Feature de tareas
│       └── components/   # TaskItem, TaskForm, TaskList, TaskFilter
├── hooks/                # Custom hooks
│   ├── useTasks.ts       # Gestion de estado de tareas (CRUD)
│   └── useTaskFilter.ts  # Logica de filtrado memoizada
├── services/             # Servicios externos
│   └── taskStorage.ts    # Persistencia en localStorage
├── types/                # Tipos TypeScript
│   └── task.ts           # Task, TaskFilter, NewTaskData
├── App.tsx               # Componente raiz
└── main.tsx              # Entry point

e2e/
├── pages/                # Page Object Models
│   ├── BasePage.ts       # Clase base con metodos comunes
│   └── TasksPage.ts      # Page Object para la pagina de tareas
├── app.spec.ts           # Tests E2E generales
└── tasks.spec.ts         # Tests E2E de tareas
```

### Decisiones de Arquitectura

| Decision | Justificacion |
|----------|---------------|
| Feature-based structure | Agrupa codigo relacionado, facilita escalabilidad |
| Custom hooks para estado | Separacion de logica de negocio de la UI |
| Service layer | Abstrae el acceso a localStorage, facilita testing |
| Page Object Model (E2E) | Tests mantenibles y reutilizables |
| Barrel exports | Imports limpios y organizados |

### Flujo de Datos

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   App.tsx   │────►│  useTasks()  │────►│  taskStorage    │
│  (UI State) │     │  (CRUD ops)  │     │  (localStorage) │
└─────────────┘     └──────────────┘     └─────────────────┘
       │                   │
       ▼                   ▼
┌─────────────┐     ┌──────────────┐
│ TaskFilter  │     │  TaskList    │
│  Component  │     │  Component   │
└─────────────┘     └──────────────┘
       │                   │
       └───────┬───────────┘
               ▼
        ┌──────────────┐
        │useTaskFilter │
        │ (memoized)   │
        └──────────────┘
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

# Ver coverage
pnpm test:coverage
```

### Estadisticas de Tests

| Tipo | Cantidad | Framework |
|------|----------|-----------|
| Unit Tests | 128 | Vitest + Testing Library |
| E2E Tests | 23 | Playwright |

## Tests E2E con Page Object Model (POM)

Los tests E2E utilizan el patron Page Object Model para mejorar la mantenibilidad:

```typescript
// Ejemplo de uso del Page Object
import { TasksPage } from './pages/TasksPage'

test('usuario puede crear una tarea', async ({ page }) => {
  const tasksPage = new TasksPage(page)
  await tasksPage.goto()
  await tasksPage.addTask('Mi primera tarea')
  await expect(tasksPage.getTaskItem('Mi primera tarea')).toBeVisible()
})
```

**Beneficios del POM:**
- Separa la logica de interaccion con la UI de los tests
- Facilita el mantenimiento cuando cambia la UI
- Mejora la legibilidad de los tests
- Permite reutilizar codigo entre tests

## Flujo de Trabajo Git

### Ramas

| Tipo | Patron | Ejemplo |
|------|--------|---------|
| Feature | `feature/<descripcion>` | `feature/task-form` |
| Fix | `fix/<descripcion>` | `fix/localStorage-error` |
| Refactor | `refactor/<descripcion>` | `refactor/button-variants` |
| Test | `test/<descripcion>` | `test/e2e-tasks` |
| Docs | `docs/<descripcion>` | `docs/readme-update` |

### Commits Convencionales

```
<tipo>(<scope>): <descripcion>

feat(tasks): add TaskForm component
fix(storage): handle JSON parse errors
test(hooks): add useTasks unit tests
refactor(ui): extract Button variants
docs(readme): update installation steps
```

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

### Imagen de Produccion

- Base: `nginx:alpine`
- Multi-stage build para optimizacion
- Tamano final: ~25MB

## Roadmap Completado

- [x] Phase 0: Preparacion del proyecto
- [x] Phase 1: Definicion de tipos
- [x] Phase 2: Servicio de localStorage
- [x] Phase 3: Hook useTasks
- [x] Phase 4: Componentes UI base
- [x] Phase 5: Componentes de tareas
- [x] Phase 6: Hook de filtrado
- [x] Phase 7: Integracion en App
- [x] Phase 8: Tests E2E
- [x] Phase 9: Polish y accesibilidad
- [x] Phase 10: Documentacion

Ver [roadmap.md](./roadmap.md) para detalles de cada fase.

## Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Desarrolla siguiendo TDD
4. Asegurate de que pasen todos los tests (`pnpm verify`)
5. Commit con mensaje convencional (`git commit -m "feat: add feature"`)
6. Push a tu rama (`git push origin feature/nueva-funcionalidad`)
7. Abre un Pull Request

## Licencia

MIT
