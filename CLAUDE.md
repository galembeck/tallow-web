# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # Type-check (tsc -b) then build
npm run lint       # Run ESLint
npm run check      # Ultracite code quality check
npm run fix        # Ultracite auto-fix
```

## Architecture

**E-commerce platform** (React 19 + TypeScript + Vite) targeting Brazilian customers with Mercado Pago integration.

### Key Libraries
- **Routing**: TanStack React Router (file-based, auto-generated route tree at `src/route-tree-gen.ts`)
- **Server state**: TanStack React Query (queryClient in `app.tsx`, staleTime 5min, retry 1)
- **Forms**: React Hook Form + Zod
- **UI**: Shadcn/Radix UI + Tailwind CSS v4 (config lives in `index.css` and Vite plugin — no `tailwind.config.ts`)
- **Payments**: `@mercadopago/sdk-react`

### Folder Conventions
- `src/api/http/routes/` — API modules (pure async functions, no React)
- `src/hooks/services/` — React Query wrappers over API modules (`use-auth`, `use-cart`, `use-order`, `use-payment`, `use-product`, `use-shipping`)
- `src/pages/` — File-based routes; each directory can have a `~components/` subfolder for page-scoped components (underscore-prefixed files = private)
- `src/components/ui/` — Shadcn UI components (treat as third-party; avoid editing)

### Route Layout Tree
```
/ (root)
├── /_public (Header + Footer) → /cart, /checkout, product pages
├── /admin   (Sidebar, protected) → /dashboard, /products, /clients, /payments
├── /_auth   → /sign-in, /sign-up
└── /_error  → /not-found
```

Admin layout uses `beforeLoad` to redirect unauthenticated users (reads `AccessToken` cookie, checks `profileType === 1`).

### Data Flow Pattern
```
src/api/http/routes/*.ts   →   src/hooks/services/use-*.ts   →   Components
   (API module)                   (React Query hook)
```

All HTTP requests go through `src/api/connections/tallow.ts` (`API.fetch()`).

### Path Alias
`@/*` resolves to `./src/*` (configured in both `tsconfig.app.json` and `vite.config.ts`).

### Linting & Formatting
Biome handles formatting; ESLint handles React-specific rules. Run `npm run fix` to auto-fix both.
