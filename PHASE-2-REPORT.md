# Phase 2 Report — Authority Position + Proof Strategy

## Status ✅ Complete

Both Step 1 (Authority Position) and Step 2 (Proof Strategy) are fully built and verified.

## Files Created

| File | Purpose |
|------|---------|
| `src/data/module3/authority-positions.ts` | Authority position definitions, recommendation resolver, rationale generator, core trust promise generator |
| `src/data/module3/proof-priorities.ts` | Proof priority resolver with 3 path-specific paths + fallback, format definitions, alternate gap resolver |

## Files Modified

| File | Changes |
|------|---------|
| `src/components/module3/Step1AuthorityPosition.tsx` | Built full UI: 2x2 card grid, recommendation badge, selection state, core trust promise editor with regenerate, position rationale display, Back/Lock-in buttons |
| `src/components/module3/Step2ProofStrategy.tsx` | Built full UI: 3 priority cards, format dropdown, inline description editing, swap popover with alternate gaps, regeneration, Back/Confirm & Continue buttons |

## Architecture

### Authority Position System (`authority-positions.ts`)

- **4 positions**: builder, auditor, deconstructor, practitioner — exact names, no renaming
- **`resolveRecommendedPosition(serviceId, mechanism)`**: Pure deterministic function. Maps serviceId to base position. Overrides to auditor/deconstructor if mechanism keywords match (audit→auditor, framework→deconstructor)
- **`generatePositionRationale(position, serviceId, marketId)`**: Generates contextual rationale using service label and market problem
- **`generateCoreTrustPromise(position, serviceId, marketId, mechanism)`**: Generates trust promise answering "What honest reason should a prospect have to believe I understand this problem?" — no fake client history/metrics/experience

### Proof Priority System (`proof-priorities.ts`)

- **`resolveProofPriorities(serviceId, marketId, position, offerType)`**: Returns 3 priority objects. 3 pre-mapped paths:
  1. `short_form_editor | coaches` → 3 tailored gaps about educational pacing, clip extraction, volume consistency
  2. `ui_ux_designer | saas_startups` → 3 tailored gaps about B2B SaaS patterns, product-goal translation, design system thinking
  3. `frontend_developer | local_businesses` → 3 tailored gaps about mobile-first builds, local lead gen, site improvement
- **Fallback**: Any unmapped path gets 3 context-aware generic gaps based on the selected authority position
- **`resolveAlternateGaps(serviceId, marketId)`**: Returns 2 alternate gap seeds for the swap feature, with per-path alternates + generic fallback
- **`ALL_FORMATS`**: 10 format options (case_study, demo_video, comparison, framework, before_after, etc.)

### Data Flow

```
Module 1 (opportunity-map) ──► Module 3 via useModule3Store.mod1*
Module 2 (offer-engineering) ──► Module 3 via useModule3Store.mod2*
                                │
                                ▼
                resolveRecommendedPosition() → recommendation badge
                generatePositionRationale() → rationale card
                generateCoreTrustPromise() → editable textarea
                                │
                                ▼
                resolveProofPriorities() → 3 editable priority cards
                resolveAlternateGaps() → swap options
```

### Store Integration

Both steps use existing store actions (`setAuthorityPosition`, `setCoreTrustPromise`, `setAuthorityPositionRationale`, `setProofPriorities`, `confirmStep`, `nextStep`, `previousStep`, `jumpToStep`). No new store actions were needed.

## UI Patterns

Following Module 2's visual language adapted to Module 3's dark theme:
- **Card selected**: `border-brand-primary/60 ring-1 ring-brand-primary/30 bg-brand-primary/5`
- **Card unselected**: `border-white/5 bg-white/[0.02] hover:border-white/10`
- **Primary button**: `bg-brand-primary text-white hover:opacity-90`
- **Secondary button**: `border-white/5 bg-white/[0.03] text-zinc-400`
- **Textarea**: `bg-white/[0.03] border-white/5 text-white/90 focus:border-brand-primary/60`
- **Dropdown**: Custom dropdown component with backdrop blur, checkmark on active

## Verification

- ✅ `npx tsc --noEmit` — passes with no errors
- ✅ `npx vite build` — builds successfully (33s, 3044 modules transformed)
- ✅ 3 verified test paths produce distinct content
- ✅ Fallback path produces 3 context-aware priorities
- ✅ Each priority card has format dropdown, edit, and swap
- ✅ Core trust promise is editable and regeneratable
- ✅ Step validation blocks "Confirm & Continue" until all 3 priorities are defined
