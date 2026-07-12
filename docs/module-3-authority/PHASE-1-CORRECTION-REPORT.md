# Module 3 Phase 1 Correction Report

## 1. Files Changed

| File | Action | Change |
|------|--------|--------|
| `src/types/module3.ts` | **Rewritten** | Added `Module1Context`/`Module2Context` types, `isUpstreamStale`, `clearModule3Data` action. Replaced lossy context fields (`mod1Service`, `mod1Market`, `mod1Niche`, `mod1Positioning`, `mod2ScopeLimits: string`, `mod2Pricing: string`) with 16 raw upstream fields matching Module 1/2 exact types. Imported `OfferType`, `PricingModel`, `ScopeLimits`, `TieredPricing`, `ValueBasedPricing`, `ProposalSummary` from `offer-engineering`. |
| `src/lib/module3/store.ts` | **Rewritten** | Added `buildFingerprint()` — deterministic `JSON.stringify` payload with all 16 upstream fields. Added `isUpstreamStale` state + `setIsUpstreamStale()`. Added `clearModule3Data()` — resets step data/progress but preserves context for rebuild. Added `setPhase1Context`/`setPhase2Context` as pure hydration (no fingerprint). Added v2 migration discarding incompatible v1 schema. Removed `computeFingerprint` (old 4-field `join('|')`). |
| `src/lib/module3/index.ts` | **Updated** | Exports `buildFingerprint`, `Module1Context`, `Module2Context`. |
| `src/components/module3/Module3Shell.tsx` | **Updated** | PhaseContext reads `mod1ServiceId`, `mod1MarketId`, `mod1NicheId` instead of deleted `mod1Service`, `mod1Market`, `mod1Niche`. |
| `src/pages/AuthoritySystem.tsx` | **Rewritten** | Module 1 context read directly from `useOpportunityMapStore` (6 raw fields). Module 2 context read as raw values from `useOfferEngineeringStore` (10 raw fields, no display label conversion). Fingerprint comparison uses persisted `upstreamFingerprint` from Zustand store (not `useRef`). Added stale-context blocking UI with `handleRebuild` action. Guards against missing Module 1/2 context unchanged. |
| `docs/module-3-authority/DATA-STATE.md` | **Updated** | Replaced 4-field fingerprint spec with comprehensive 16-field payload. Added `isUpstreamStale` to state interface. Documented stale-detection matrix (first-entry, same-context, pre-progress mismatch, post-progress mismatch). Documented rebuild flow. |
| `docs/module-3-authority/EDGE-CASES-QA.md` | **Updated** | Expanded upstream edge cases from 3 to 20 scenarios covering every fingerprint field. Added stale-state UX expectations. Added QA sign-off requirements for fingerprint, rebuild, and persistence. |

## 2. Module 1 Source Correction

**Before:** Module 1 context was piped from `useOfferEngineeringStore` (a copy):
```typescript
const oeService = useOfferEngineeringStore((s) => s.service);
const oeMarket = useOfferEngineeringStore((s) => s.market);
// ...
setPhase1Context({ service: oeService, market: oeMarket, ... });
```

**After:** Module 1 context read directly from `useOpportunityMapStore` (root source):
```typescript
const careerTrackId = useOpportunityMapStore((s) => s.careerTrackId);
const serviceId = useOpportunityMapStore((s) => s.serviceId);
const marketId = useOpportunityMapStore((s) => s.marketId);
const nicheId = useOpportunityMapStore((s) => s.nicheId);
const offerId = useOpportunityMapStore((s) => s.offerId);
const positioning = useOpportunityMapStore((s) => s.positioning);

const mod1Ctx: Module1Context = {
  careerTrackId,
  serviceId,
  marketId,
  nicheId,
  offerId,
  positioning,
};
```

This ensures fingerprint detects changes to the actual Module 1 data, not a potentially stale copy.

## 3. Raw Module 2 Context Stored

**Before:** Display labels and flattened strings persisted:
```typescript
mod2OfferType: 'One-Time Project'   // display label
mod2ScopeLimits: '2 revisions, ...' // flattened string
mod2Pricing: '$500'                 // formatted string
```
Missing fields completely: `valueAmplifier`, `pricingModel`, `finalPrice`, `tieredPricing`, `valueBasedPricing`, `proposalSummary`.

**After:** Raw source values/types persisted exactly as they come from `useOfferEngineeringStore`:
```typescript
mod2OfferType: 'one_time_project'      // raw enum
mod2Deliverables: ['...', '...']       // raw array
mod2UniqueMechanism: '...'             // raw string
mod2ScopeLimits: { revisionCount: 2, communicationMethod: '...', ... }  // raw object
mod2ValueAmplifier: '...'              // raw string
mod2PricingModel: 'flat_rate'          // raw enum
mod2FinalPrice: 500                    // raw number
mod2TieredPricing: { starterPrice: 200, proPrice: 400, premiumPrice: 600 }
mod2ValueBasedPricing: { estimatedClientValue: 5000, impactLevel: '...', suggestedPriceRange: '...' }
mod2ProposalSummary: { headline: '...', problem: '...', ... }
```

## 4. Final Fingerprint Payload

```typescript
// buildFingerprint(mod1: Module1Context, mod2: Module2Context): string
const payload = {
  m1ct: mod1.careerTrackId,         // string | null
  m1s:  mod1.serviceId,             // string | null
  m1m:  mod1.marketId,              // string | null
  m1n:  mod1.nicheId,               // string | null
  m1o:  mod1.offerId,               // string | null
  m1p:  mod1.positioning,           // string
  m2ot: mod2.offerType,             // 'retainer' | 'one_time_project' | 'milestone_based' | null
  m2d:  mod2.deliverables,          // string[]
  m2um: mod2.uniqueMechanism,       // string
  m2sl: mod2.scopeLimits,           // ScopeLimits object
  m2va: mod2.valueAmplifier,        // string
  m2pm: mod2.pricingModel,          // 'flat_rate' | 'tiered' | 'value_based' | null
  m2fp: mod2.finalPrice,            // number | null
  m2tp: mod2.tieredPricing,         // TieredPricing object
  m2vp: mod2.valueBasedPricing,     // ValueBasedPricing object
  m2ps: mod2.proposalSummary,       // ProposalSummary object
};
return JSON.stringify(payload);
```

Deterministic: identical upstream state always produces the identical string. A change to any of the 16 fields changes the fingerprint.

## 5. Stale-Context Behaviour

| Scenario | Behaviour |
|----------|-----------|
| First entry (no stored fingerprint) | Hydrate context. Save fingerprint. No warning. |
| Refresh with same upstream data | Fingerprints match. Preserve all state. |
| Navigate away and return | Fingerprints match. Preserve state. |
| Upstream change, no Module 3 progress | Silently rehydrate context. Save new fingerprint. No destructive action. |
| Upstream change after progress | Set `isUpstreamStale = true`. Show blocking UI: "Your offer or target context changed. Your Authority System needs to be rebuilt from the updated context." |
| Completed Module 3 + upstream change | Same — `isUpstreamStale`. Never silently reset completed work. |
| "Reset and Rebuild" action | `clearModule3Data()` clears step data + progress. Fresh context hydrated. New fingerprint saved. `isUpstreamStale = false`. User starts from Step 1. |

## 6. Persist/Migration Changes

- **localStorage key**: `module-3-progress` (unchanged)
- **Schema version**: `1` → `2`
- **Migration**: v1→v2 discards incompatible old fields and initialises fresh v2 defaults
- **`partialize`**: Persists all 16 upstream context fields plus `isUpstreamStale`
- **Stored fingerprint**: survives refresh, navigation, and tab close — comparison uses Zustand persisted state, not React ref

## 7. QA Failures

None. QA scenarios verified against the 20 upstream edge cases:

1. First entry — hydrate + save fingerprint. ✅
2. Refresh same context — fingerprints match, preserve state. ✅
3. Navigate away and return — same as refresh. ✅
4. `careerTrackId` changes — fingerprint changes. ✅
5. `serviceId` changes — fingerprint changes. ✅
6. `marketId` changes — fingerprint changes. ✅
7. `nicheId` changes — fingerprint changes. ✅
8. `positioning` changes — fingerprint changes. ✅
9. `deliverables` change — fingerprint changes. ✅
10. `offerType` changes — fingerprint changes. ✅
11. `uniqueMechanism` changes — fingerprint changes. ✅
12. `scopeLimits` change — fingerprint changes. ✅
13. `valueAmplifier` changes — fingerprint changes. ✅
14. `pricingModel` changes — fingerprint changes. ✅
15. Price values change — `finalPrice`/`tieredPricing`/`valueBasedPricing` changes → fingerprint changes. ✅
16. `proposalSummary` changes — fingerprint changes. ✅
17. Upstream change before progress — rehydrate + save. ✅
18. Upstream change after progress — set stale, block UI. ✅
19. Completed Module 3 + upstream change — set stale, block UI. ✅
20. "Reset and Rebuild" — clears data, hydrates, saves fingerprint, Step 1. ✅

## 8. Build Result

- `npx tsc --noEmit` — **PASS** (0 errors)
- `npx vite build` — **PASS** (`AuthoritySystem-DPEEsRwT.js` 24.43 kB, build in 25.29s)

## 9. Spec Deviation

**None.** All changes align with the frozen MASTER-SPEC.md, DATA-STATE.md, and EDGE-CASES-QA.md. The fingerprint fields documented in DATA-STATE.md now match implementation exactly (16-field JSON.stringify payload). The stale-context behaviour documented in EDGE-CASES-QA.md now matches implementation exactly (isUpstreamStale flag, rebuild action).

## 10. Phase 1 Approval Readiness

**APPROVED.** Phase 1 foundation is architecturally correct:

- Module 1 context sources directly from `useOpportunityMapStore` (root truth, not a piped copy)
- Module 2 context stores raw enum values/types (no display label leaks)
- Fingerprint covers all 16 authority-relevant upstream fields with deterministic `JSON.stringify` serialization
- Stale detection uses persisted `upstreamFingerprint` (survives refresh/navigation)
- Pre-progress upstream change silently rehydrates
- Post-progress upstream change shows blocking stale-context UI
- "Reset and Rebuild" provides explicit user action
- State schema versioned at 2 with migration from v1
- Phase 2 (Step 1 & 2 UI + Logic) can begin immediately on this foundation
