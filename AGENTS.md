# AGENTS.md

This file provides context for AI coding assistants working on this project.

## Project Overview

Tasks Manager - A simple task management application built with React + TypeScript + Vite. Users can create, edit, delete, and filter tasks with localStorage persistence.

## Tech Stack

- **React 19.2** with TypeScript 5.9
- **Vite 7** for build tooling
- **Tailwind CSS 4** for styling
- **Vitest** + Testing Library for unit tests
- **Playwright** for E2E tests (with Page Object Model pattern)
- **ESLint 9** with flat config
- **pnpm** as package manager

## Key Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite + Vitest configuration |
| `eslint.config.js` | ESLint flat config |
| `playwright.config.ts` | E2E test configuration |
| `tsconfig.app.json` | TypeScript config for app code |
| `Dockerfile` | Multi-stage build for production |
| `roadmap.md` | Implementation plan with TDD tasks |

## Architecture

```
src/
├── components/       # Reusable UI components
│   ├── ui/           # Primitives (Button, Input, Checkbox)
│   └── layout/       # Layout (AppLayout)
├── features/         # Feature-based modules
│   └── tasks/        # Task management feature
│       └── components/   # TaskItem, TaskForm, TaskList, TaskFilter
├── hooks/            # Shared custom hooks
│   ├── useTasks.ts       # Task CRUD operations + state
│   └── useTaskFilter.ts  # Filter logic
├── lib/utils/        # Utility functions
├── services/         # External integrations
│   └── taskStorage.ts    # localStorage persistence
├── types/            # Shared TypeScript types
│   └── task.ts           # Task, TaskFilter types
```

## Domain Model

```typescript
interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: Date
}

type TaskFilter = 'all' | 'completed' | 'pending'
```

## Conventions

### File Naming
- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utils: `camelCase.ts`
- Tests: `*.test.tsx` or `*.spec.tsx` (co-located with source)
- E2E tests: `e2e/*.spec.ts`

### Imports
- Use barrel exports (`index.ts`) for clean imports
- Prefer absolute imports when available

### Testing (TDD)
- Follow Red-Green-Refactor cycle
- Unit tests: `src/**/*.test.tsx` (Vitest + Testing Library)
- E2E tests: `e2e/**/*.spec.ts` (Playwright with POM)
- Use `getByRole` queries when possible
- Prefer `userEvent` over `fireEvent`
- Test behavior, not implementation

### E2E Tests with Page Object Model (POM)
- Page Objects are located in `e2e/pages/`
- Each page/feature should have its own Page Object class
- Page Objects encapsulate selectors and actions
- Tests should only interact with the UI through Page Objects

**POM Structure:**
```
e2e/
├── pages/
│   ├── BasePage.ts       # Common methods (goto, waitForLoad, etc.)
│   └── TasksPage.ts      # Task-specific actions and selectors
├── app.spec.ts
└── tasks.spec.ts
```

**POM Implementation Guidelines:**
```typescript
// e2e/pages/BasePage.ts
import { Page } from '@playwright/test'

export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string = '/') {
    await this.page.goto(path)
  }
}

// e2e/pages/TasksPage.ts
import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export class TasksPage extends BasePage {
  // Locators (lazy evaluation)
  readonly taskInput: Locator
  readonly addButton: Locator
  readonly taskList: Locator
  readonly filterAll: Locator
  readonly filterCompleted: Locator
  readonly filterPending: Locator

  constructor(page: Page) {
    super(page)
    this.taskInput = page.getByPlaceholder('Nueva tarea')
    this.addButton = page.getByRole('button', { name: /agregar/i })
    this.taskList = page.getByRole('list')
    this.filterAll = page.getByRole('button', { name: /todas/i })
    this.filterCompleted = page.getByRole('button', { name: /completadas/i })
    this.filterPending = page.getByRole('button', { name: /pendientes/i })
  }

  // Actions
  async addTask(title: string) {
    await this.taskInput.fill(title)
    await this.addButton.click()
  }

  async toggleTask(title: string) {
    await this.getTaskCheckbox(title).click()
  }

  async deleteTask(title: string) {
    await this.getTaskItem(title).getByRole('button', { name: /eliminar/i }).click()
  }

  async filterBy(filter: 'all' | 'completed' | 'pending') {
    const filterButton = {
      all: this.filterAll,
      completed: this.filterCompleted,
      pending: this.filterPending
    }
    await filterButton[filter].click()
  }

  // Getters for assertions
  getTaskItem(title: string): Locator {
    return this.page.getByRole('listitem').filter({ hasText: title })
  }

  getTaskCheckbox(title: string): Locator {
    return this.getTaskItem(title).getByRole('checkbox')
  }

  async getTaskCount(): Promise<number> {
    return this.page.getByRole('listitem').count()
  }
}
```

**Using POM in Tests:**
```typescript
// e2e/tasks.spec.ts
import { test, expect } from '@playwright/test'
import { TasksPage } from './pages/TasksPage'

test.describe('Tasks', () => {
  let tasksPage: TasksPage

  test.beforeEach(async ({ page }) => {
    tasksPage = new TasksPage(page)
    await tasksPage.goto()
  })

  test('user can create a task', async () => {
    await tasksPage.addTask('Buy groceries')
    await expect(tasksPage.getTaskItem('Buy groceries')).toBeVisible()
  })

  test('user can complete a task', async () => {
    await tasksPage.addTask('Buy groceries')
    await tasksPage.toggleTask('Buy groceries')
    await expect(tasksPage.getTaskCheckbox('Buy groceries')).toBeChecked()
  })

  test('user can filter tasks', async () => {
    await tasksPage.addTask('Task 1')
    await tasksPage.addTask('Task 2')
    await tasksPage.toggleTask('Task 1')
    
    await tasksPage.filterBy('completed')
    await expect(tasksPage.getTaskItem('Task 1')).toBeVisible()
    await expect(tasksPage.getTaskItem('Task 2')).not.toBeVisible()
  })
})
```

### Commits
- Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`
- Examples:
  - `feat(tasks): add TaskItem component`
  - `test(hooks): add useTasks unit tests`
  - `refactor(ui): extract Button variants`
- Pre-commit hook runs: lint + typecheck
- Pre-push hook runs: tests + build

### Git Workflow (Branches & Pull Requests)

This project uses a branch-based workflow with pull requests for all changes.

**Branch Naming Convention:**
```
feature/<description>   # New features (e.g., feature/task-form)
fix/<description>       # Bug fixes (e.g., fix/localStorage-error)
refactor/<description>  # Code refactoring (e.g., refactor/button-variants)
test/<description>      # Test additions (e.g., test/e2e-tasks)
docs/<description>      # Documentation (e.g., docs/readme-update)
```

**Workflow Steps:**
1. **Create branch from main:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/task-form
   ```

2. **Develop with descriptive commits:**
   ```bash
   # Make changes following TDD
   git add .
   git commit -m "feat(tasks): add TaskForm component"
   ```

3. **Push and create Pull Request:**
   ```bash
   git push -u origin feature/task-form
   # Create PR on GitHub with description of changes
   ```

4. **After PR is approved and merged:**
   ```bash
   git checkout main
   git pull origin main
   git branch -d feature/task-form
   ```

**Pull Request Guidelines:**
- Use descriptive title following conventional commits format
- Include summary of changes in description
- Reference related issues if applicable
- Ensure all CI checks pass before requesting review
- Keep PRs focused and small when possible

**PR Title Examples:**
```
feat(tasks): add TaskForm component with validation
fix(storage): handle JSON parse errors gracefully
test(e2e): add task filtering tests with POM
refactor(hooks): extract filter logic to useTaskFilter
```

## Commands Reference

```bash
pnpm dev              # Development server
pnpm build            # Production build
pnpm lint             # ESLint check
pnpm lint:fix         # ESLint auto-fix
pnpm typecheck        # TypeScript check
pnpm test             # Unit tests (watch)
pnpm test:run         # Unit tests (single run)
pnpm test:e2e         # E2E tests
pnpm quality          # lint + typecheck + unit tests
pnpm verify           # Full validation (quality + e2e + build)
pnpm docker:build     # Build Docker image
pnpm docker:run       # Run container (port 3000)
```

## CI/CD Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | push/PR to main | Quality checks + Docker build |
| `sast.yml` | push/PR to main + weekly | CodeQL + Trivy security scans |
| `dast.yml` | push/PR to main | OWASP ZAP dynamic scan |

## Important Notes

1. **ESLint uses flat config** (ESLint 9) - not legacy `.eslintrc`
2. **Vitest config is in `vite.config.ts`** - not a separate file
3. **Tests use `globals: true`** - no need to import `describe`, `it`, `expect`
4. **Tailwind 4** uses `@tailwindcss/vite` plugin - no `tailwind.config.js` needed
5. **Docker image uses nginx:alpine** with default config
6. **localStorage key for tasks:** `tasks-manager-tasks`
7. **Follow TDD strictly:** Write failing test first, then implement

## Implementation Roadmap

See `roadmap.md` for the detailed implementation plan organized in phases:

1. **Phase 0:** Project preparation
2. **Phase 1:** Types definition
3. **Phase 2:** localStorage service
4. **Phase 3:** useTasks hook
5. **Phase 4:** Base UI components
6. **Phase 5:** Task feature components
7. **Phase 6:** Filter hook
8. **Phase 7:** App integration
9. **Phase 8:** E2E tests
10. **Phase 9:** Polish & accessibility
11. **Phase 10:** Documentation
