# Testing & Verification Strategy

## Strategy Overview
Testing in this repository is built around automated audit scripts and prebuild architecture guards.

## Verification Workflow
- **TypeScript Check**: `npx tsc --noEmit` (aliased as `npm run lint`).
- **Architecture Guard**: Prebuild script `scripts/security/architecture-guard.mjs`.
- **Module Verification**: Individual module state validators under `scripts/audit/verify-module*.ts`.
- **Security Audit**: `npm run security:scan`.
