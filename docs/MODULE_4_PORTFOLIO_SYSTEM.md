# Module 4: Portfolio System — Deep Dive

## Architecture Overview
Module 4 operates on `usePortfolioSystemStore`.

### Bridge Integration
Module 4 consumes Phase 3 authority outputs via `Module4BridgeContext` adapter.

### Features
- **Asset Composer**: Interactive case study builder.
- **Proof Asset Generator**: Renders visual assets for client presentation.
- **Context Synchronization**: Auto-syncs upstream changes upon workspace mount.
