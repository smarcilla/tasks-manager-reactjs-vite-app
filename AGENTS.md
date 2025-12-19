# AGENTS.md

This file provides context for AI coding assistants working on this project.

## Project Overview

**Tasks Manager** - A production-ready task management application built with React + TypeScript + Vite following TDD methodology. Users can create, edit, delete, and filter tasks with localStorage persistence.

### Project Status: Complete

All 10 implementation phases have been completed:
- 128 unit tests passing
- 23 E2E tests passing
- WCAG 2.1 AA accessibility compliance
- Docker-ready for deployment

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | React | 19.2 |
| Language | TypeScript | 5.9 |
| Build Tool | Vite | 7 |
| Styling | Tailwind CSS | 4 |
| Unit Testing | Vitest + Testing Library | latest |
| E2E Testing | Playwright | latest |
| Linting | ESLint (flat config) | 9 |
| Package Manager | pnpm | 9+ |

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

### Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/               # Primitives (Button, Input, Checkbox)
│   │   ├── Button.tsx        # Variant-based button with loading state
│   │   ├── Input.tsx         # Form input with error handling
│   │   └── Checkbox.tsx      # Accessible checkbox with label
│   └── layout/           # Layout components
│       └── AppLayout.tsx     # Main layout with skip link
├── features/             # Feature-based modules
│   └── tasks/            # Task management feature
│       └── components/
│           ├── TaskItem.tsx      # Single task with animations
│           ├── TaskForm.tsx      # Add task form
│           ├── TaskList.tsx      # Task list with empty state
│           └── TaskFilter.tsx    # Filter buttons
├── hooks/                # Shared custom hooks
│   ├── useTasks.ts           # Task CRUD operations + state
│   └── useTaskFilter.ts      # Memoized filter logic
├── services/             # External integrations
│   └── taskStorage.ts        # localStorage persistence
├── types/                # Shared TypeScript types
│   └── task.ts               # Task, TaskFilter, NewTaskData
├── App.tsx               # Root component
├── index.css             # Global styles + animations
└── main.tsx              # Entry point

e2e/
├── pages/                # Page Object Models
│   ├── BasePage.ts           # Base class with common methods
│   └── TasksPage.ts          # Task page interactions
├── app.spec.ts           # App-level E2E tests
└── tasks.spec.ts         # Task feature E2E tests
```

### Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Feature-based structure** | Groups related code together, scales well |
| **Custom hooks for state** | Separates business logic from UI components |
| **Service layer** | Abstracts localStorage, enables easy testing/mocking |
| **Page Object Model** | E2E tests are maintainable and reusable |
| **Barrel exports** | Clean imports via index.ts files |
| **forwardRef for inputs** | Enables ref passing for focus management |
| **Lazy initialization** | `useState(() => getTasks())` avoids re-reading on every render |

### Data Flow

```
User Action
    │
    ▼
┌─────────────────┐
│   App.tsx       │  ◄── Manages filter state
│   (Container)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────┐
│   useTasks()    │────►│   taskStorage    │
│   (CRUD Hook)   │     │   (localStorage) │
└────────┬────────┘     └──────────────────┘
         │
         ▼
┌─────────────────┐
│ useTaskFilter() │  ◄── Memoized filtering
│   (Filter Hook) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   TaskList      │  ◄── Renders filtered tasks
│   (Presenter)   │
└─────────────────┘
```

## Domain Model

```typescript
interface Task {
  id: string          // crypto.randomUUID()
  title: string       // User-provided, trimmed
  completed: boolean  // Toggle state
  createdAt: Date     // Auto-generated
}

type TaskFilter = 'all' | 'completed' | 'pending'

type NewTaskData = Pick<Task, 'title'>
type UpdateTaskData = Partial<Pick<Task, 'title' | 'completed'>>
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
- Use fake timers for animation delays: `vi.useFakeTimers()`

### E2E Tests with Page Object Model (POM)

Page Objects encapsulate UI interactions:

```typescript
// e2e/pages/TasksPage.ts
export class TasksPage extends BasePage {
  readonly taskInput: Locator
  readonly addButton: Locator

  constructor(page: Page) {
    super(page)
    this.taskInput = page.getByPlaceholder('Nueva tarea')
    this.addButton = page.getByRole('button', { name: /agregar/i })
  }

  async addTask(title: string): Promise<void> {
    await this.taskInput.fill(title)
    await this.addButton.click()
  }

  async deleteTask(title: string): Promise<void> {
    const taskItem = this.getTaskItem(title)
    await taskItem.getByRole('button', { name: /eliminar/i }).click()
    // Wait for animation to complete
    await taskItem.waitFor({ state: 'hidden' })
  }

  getTaskItem(title: string): Locator {
    return this.page.getByRole('listitem').filter({ hasText: title })
  }
}
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

**Branch Naming Convention:**
```
feature/<description>   # New features
fix/<description>       # Bug fixes
refactor/<description>  # Code refactoring
test/<description>      # Test additions
docs/<description>      # Documentation
```

**Workflow:**
```bash
git checkout main && git pull origin main
git checkout -b feature/new-feature
# ... develop with TDD ...
git commit -m "feat(scope): description"
git push -u origin feature/new-feature
# Create PR on GitHub
```

## Commands Reference

```bash
pnpm dev              # Development server (port 5173)
pnpm build            # Production build
pnpm lint             # ESLint check
pnpm lint:fix         # ESLint auto-fix
pnpm typecheck        # TypeScript check
pnpm test             # Unit tests (watch mode)
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
6. **localStorage key:** `tasks-manager-tasks`
7. **Animation delay:** 200ms for delete animations (use fake timers in tests)
8. **Accessibility:** Skip link, focus-visible, aria-live regions implemented

## Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Skip link | `<a href="#main-content" class="skip-link">` in AppLayout |
| Focus indicators | `focus-visible:ring-2` styles on interactive elements |
| Screen readers | `aria-label`, `role="status"`, `aria-live="polite"` |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` in index.css |
| Keyboard nav | Full tab order, Enter/Escape handlers |

## Common Tasks for AI Assistants

### Adding a New Feature
1. Create types in `src/types/`
2. Add service methods if needed in `src/services/`
3. Create/update hooks in `src/hooks/`
4. Build components in `src/features/<feature>/components/`
5. Write tests alongside each file (TDD)
6. Update E2E Page Objects and tests

### Fixing a Bug
1. Write a failing test that reproduces the bug
2. Fix the code to make the test pass
3. Run `pnpm quality` to ensure no regressions

### Adding E2E Tests
1. Add methods to appropriate Page Object in `e2e/pages/`
2. Write test in `e2e/*.spec.ts`
3. Use `await element.waitFor({ state: 'hidden' })` for animations

## Implementation Phases (Completed)

| Phase | Description | Status |
|-------|-------------|--------|
| 0 | Project preparation | ✅ |
| 1 | Types definition | ✅ |
| 2 | localStorage service | ✅ |
| 3 | useTasks hook | ✅ |
| 4 | Base UI components | ✅ |
| 5 | Task feature components | ✅ |
| 6 | Filter hook | ✅ |
| 7 | App integration | ✅ |
| 8 | E2E tests | ✅ |
| 9 | Polish & accessibility | ✅ |
| 10 | Documentation | ✅ |

See `roadmap.md` for detailed phase information.
