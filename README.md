# React + TypeScript + Vite Template

Production-ready template for React applications with comprehensive tooling for testing, linting, and CI/CD.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19.2 |
| Language | TypeScript 5.9 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 |
| Unit Testing | Vitest + Testing Library |
| E2E Testing | Playwright |
| Linting | ESLint 9 (flat config) |
| Git Hooks | Husky |
| Container | Docker + Nginx |

## Quick Start

```bash
# Clone the template
git clone https://github.com/smarcilla/react-ts-vite-template.git my-app
cd my-app

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Run ESLint with auto-fix |
| `pnpm typecheck` | Type check with TypeScript |
| `pnpm test` | Run unit tests (watch mode) |
| `pnpm test:run` | Run unit tests once |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm quality` | Run lint + typecheck + unit tests |
| `pnpm verify` | Run all checks + build |
| `pnpm docker:build` | Build Docker image |
| `pnpm docker:run` | Run container (port 3000) |
| `pnpm docker:stop` | Stop and remove container |

## Project Structure

```
src/
├── assets/           # Static assets (images, icons)
├── components/       # Reusable components
│   ├── ui/           # UI primitives (Button, Input, etc.)
│   └── layout/       # Layout components (Header, Footer, etc.)
├── features/         # Feature modules
├── hooks/            # Custom React hooks
├── lib/              # Utilities and helpers
├── services/         # API clients and external services
├── types/            # TypeScript types/interfaces
├── App.tsx           # Root component
└── main.tsx          # Entry point
```

## Quality Gates

### Pre-commit (Husky)
- ESLint
- TypeScript type checking

### Pre-push (Husky)
- Unit tests
- Production build

### CI/CD (GitHub Actions)

| Workflow | Purpose |
|----------|---------|
| `ci.yml` | Code quality (lint, typecheck, tests, build) |
| `sast.yml` | Static security analysis (CodeQL, Trivy) |
| `dast.yml` | Dynamic security analysis (OWASP ZAP) |

## ESLint Plugins

- `eslint-plugin-react-hooks` - React hooks rules
- `eslint-plugin-react-refresh` - Fast refresh compatibility
- `eslint-plugin-sonarjs` - Code quality and bug detection
- `eslint-plugin-jsx-a11y` - Accessibility rules

## Docker

Build and run the application in a container:

```bash
# Build image
pnpm docker:build

# Run container (accessible at http://localhost:3000)
pnpm docker:run

# Stop container
pnpm docker:stop
```

## License

MIT
