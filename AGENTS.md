# AGENTS.md

This file provides context for AI coding assistants working on this project.

## Project Overview

React + TypeScript + Vite template with production-ready tooling. This is a **template repository** - users clone it as a starting point for new projects.

## Tech Stack

- **React 19.2** with TypeScript 5.9
- **Vite 7** for build tooling
- **Tailwind CSS 4** for styling
- **Vitest** + Testing Library for unit tests
- **Playwright** for E2E tests
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

## Architecture

```
src/
├── components/       # Reusable UI components
│   ├── ui/           # Primitives (Button, Input, Modal)
│   └── layout/       # Layout (Header, Footer, Sidebar)
├── features/         # Feature-based modules (co-located components, hooks, logic)
├── hooks/            # Shared custom hooks
├── lib/utils/        # Utility functions
├── services/         # API clients, external integrations
├── types/            # Shared TypeScript types
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

### Testing
- Unit tests: `src/**/*.test.tsx` (Vitest + Testing Library)
- E2E tests: `e2e/**/*.spec.ts` (Playwright)
- E2E tests are excluded from Vitest via `vite.config.ts`

### Commits
- Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, etc.
- Pre-commit hook runs: lint + typecheck
- Pre-push hook runs: tests + build

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
