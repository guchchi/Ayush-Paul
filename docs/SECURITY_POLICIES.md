# Security Policies & Architecture Guards

## Prebuild Security Checks
The build pipeline enforces `scripts/security/architecture-guard.mjs` before executing `vite build`.

### Blocked Patterns
- `import.meta.glob` usage.
- `import` of `gray-matter`.
- Hardcoded `const FALLBACK_*` fallback arrays.

## Scans & Tools
- `npm run security:scan`: Runs API key and secret scanning across source files.
- ESLint rules enforce zero unused vars and clean module imports.
