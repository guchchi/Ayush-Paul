# Module 3: Authority System

## Overview
Module 3 implements the Profile & Portfolio Authority workspace, synthesizing upstream inputs into a cohesive authority system.

## State Management
- Store: `useModule3Store` (schema version 9)
- Route: `/workspace/authority-system`
- Persist Key: `module-3-progress`

## Critical Architectural Note
- Module 3 uses `useModule3Store` for current Phase 3 active state.
- Module 4 consumes upstream context mapped via `Module4BridgeContext`.
