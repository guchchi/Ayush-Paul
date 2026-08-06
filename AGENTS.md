# AGENTS.md — Ayush-Paul

## Commands

| Action | Command |
|--------|---------|
| Dev server | `npm run dev` (port 3000, Express + Vite middleware) |
| Typecheck | `npm run lint` (this is `tsc --noEmit`, NOT ESLint) |
| Build | `npm run build` (runs architecture guard → sitemap gen → vite build) |
| Security scan | `npm run security:scan` |
| Single script | `npx tsx <script.ts>` |

Always run `npx tsc --noEmit` then `npx vite build` before declaring work complete.

## Module Architecture (6 modules)

All under `/workspace/` routes in `src/App.tsx`:

| # | Route | Store | Status |
|---|-------|-------|--------|
| 1 | `/workspace/client-acquisition` | `useOpportunityMapStore` | Built |
| 2 | `/workspace/offer-engineering` | `useOfferEngineeringStore` | Built |
| 3 | `/workspace/authority-system` | `useModule3Store` (new) | Built |
| 4 | `/workspace/portfolio-system` | `usePortfolioSystemStore` | Built |
| 5 | `/workspace/client-pipeline` | `useClientPipelineSystemStore` | Built |
| 6 | `/workspace/outreach-engine` | `useOutreachEngineSystemStore` | Built |

## Two Module 3 Stores — Critical

- **OLD** `useAuthoritySystemStore` (`src/lib/authority-system/`) — read by Portfolio System (Module 4). Persist key: `authority-system-progress`.
- **NEW** `useModule3Store` (`src/lib/module3/`) — current Phase 3 work. Persist key: `module-3-progress`. Schema version 9.
- When bridging to Module 4, map `Module4BridgeContext` → old `setPhase3Context` shape via adapter in `PortfolioSystem.tsx`. Do not write to old store directly.

## State Management

- All modules use **Zustand** with `persist` middleware (localStorage).
- Each store has `reset()`, `partialize` for selective persistence, schema version with migration.
- Context flows sequentially: Module 1 → 2 → 3 → 4 → 5 → 6.

## Build Security

- Prebuild step (`scripts/security/architecture-guard.mjs`) **blocks build** if source contains:
  - `import.meta.glob`
  - `import` of `gray-matter`
  - `const FALLBACK_*` arrays
- `npm run security:scan` checks for hardcoded API keys (not run in build pipeline automatically).

## Styling

- **Tailwind CSS v4** — no config file; `@tailwindcss/vite` plugin handles it.
- Class merge: `cn()` from `src/lib/utils.ts` (`clsx` + `tailwind-merge`).
- Motion: `motion/react` (not `framer-motion`). Use `EASING`/`DURATION` from `src/lib/motion-presets.ts`.
- Workspace modules have their own shell components (e.g. `Module3Shell`, `PortfolioSystemShell`).

## Code Conventions

- `@/*` path alias maps to project root.
- ESLint is deliberately lenient: `no-unused-vars: off`, `no-explicit-any: off`, `prefer-const: off`.
- No Prettier config. No test framework.
- When generating deterministic copy (no LLM calls), use context-driven string templates. LLM calls use `@google/generative-ai`.
- Stale-context detection: upstream fingerprint comparison on mount in each module's page component.

## Git Workflow
- Always automatically commit and push all changes to GitHub after completing a task or making significant modifications.
