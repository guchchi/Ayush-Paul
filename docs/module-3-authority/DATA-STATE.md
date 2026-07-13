# DATA AND STATE: Module 3 — Authority System

## Module 3 State Interface

```typescript
interface Module3State {
  // Step 1
  authorityPosition: 'builder' | 'auditor' | 'deconstructor' | 'practitioner' | null;
  coreTrustPromise: string;
  
  // Step 2
  proofPriorities: {
    id: string;
    gapTitle: string;
    gapDescription: string;
    recommendedFormat: string;
    isCustom: boolean;
  }[];

  // Step 3
  proofAssets: {
    id: string;
    priorityId: string;
    title: string;
    assetType: string;
    credibilityGapProved: string;
    targetAudience: string;
    businessProblem: string;
    scenario: string;
    startingMaterial: string[];
    executionSteps: string[];
    deliverables: string[];
    evidenceToCapture: string[];
    processToDocument: string[];
    whatNotToClaim: string[];
    presentationStructure: string[];
    portfolioCopy: {
      headline: string;
      description: string;
      proofStatement: string;
      cta: string;
    };
    completionChecklist: string[];
    sourcePriorityFingerprint: string;
    isCustom: boolean;
    isAccepted: boolean;
  }[];

  // Step 4
  profileCopy: {
    professionalHeadline: string;
    shortBio: string;
    longBio: string;
    offerStatement: string;
    credibilityBullets: string[];
    proofReferenceLine: string;
    ctaLine: string;
  };
  
  portfolioCopy: {
    portfolioCta: string;
    sections: {
      type: string; // e.g., 'hero', 'problem', 'mechanism', 'proof'
      heading: string;
      body: string;
      bullets?: string[];
    }[];
  };

  // Step 5
  checklist: {
    id: string;
    category: 'build' | 'assemble' | 'publish';
    task: string;
    isCompleted: boolean;
  }[];

  // Module 1 & 2 Context
  mod1CareerTrackId: string | null;
  mod1ServiceId: string | null;
  mod1MarketId: string | null;
  mod1NicheId: string | null;
  mod1OfferId: string | null;
  mod1Positioning: string;

  mod2OfferType: OfferType | null;
  mod2Deliverables: string[];
  mod2UniqueMechanism: string;
  mod2ScopeLimits: ScopeLimits;
  mod2ValueAmplifier: string;
  mod2PricingModel: PricingModel | null;
  mod2FinalPrice: number | null;
  mod2TieredPricing: TieredPricing;
  mod2ValueBasedPricing: ValueBasedPricing;
  mod2ProposalSummary: ProposalSummary;

  // System
  isCompleted: boolean;
  isUpstreamStale: boolean;
  lastUpdated: number;
  upstreamFingerprint: string;
  version: number;
  currentStep: Module3Step;
  completedSteps: Module3Step[];
}
```

## Context Fingerprint & Upstream Changes

Module 3 is highly dependent on Modules 1 and 2. 

### Fingerprint Generation

When Module 3 is initialized, the current upstream context is read and serialised into a deterministic fingerprint payload:

```
payload = {
  m1ct: module1.careerTrackId,
  m1s:  module1.serviceId,
  m1m:  module1.marketId,
  m1n:  module1.nicheId,
  m1o:  module1.offerId,
  m1p:  module1.positioning,
  m2ot: module2.offerType,
  m2d:  module2.deliverables,
  m2um: module2.uniqueMechanism,
  m2sl: module2.scopeLimits,
  m2va: module2.valueAmplifier,
  m2pm: module2.pricingModel,
  m2fp: module2.finalPrice,
  m2tp: module2.tieredPricing,
  m2vp: module2.valueBasedPricing,
  m2ps: module2.proposalSummary,
}
fingerprint = JSON.stringify(payload)
```

A change to any of these upstream values produces a new fingerprint. The fingerprint is deterministic — identical upstream state always produces the identical string.

### Stale-State Detection

Every time the user opens Module 3 (on mount, refresh, or navigation), the current upstream data is fingerprinted and compared against the persisted `upstreamFingerprint`.

| Condition | Behaviour |
|---|---|
| `upstreamFingerprint` is empty (first-ever entry) | Hydrate Module 1 & 2 context into store. Save current fingerprint. No warning. |
| `upstreamFingerprint` matches current fingerprint | Preserve all Module 3 state. No action. |
| Fingerprint mismatch, no Module 3 progress | Hydrate context with new upstream values. Save new fingerprint. No destructive warning. |
| Fingerprint mismatch, Module 3 progress exists | Set `isUpstreamStale = true`. Show blocking stale-context UI. Do NOT silently reset or regenerate. |
| Fingerprint mismatch, Module 3 completed | Same as progress — set `isUpstreamStale = true`. Never silently reset completed work. |

### Stale-State UX

When `isUpstreamStale` is `true`, a blocking screen is displayed:

> "Your offer or target context changed. Your Authority System needs to be rebuilt from the updated context."

The user is given a single explicit action:

> "Reset and Rebuild Authority System"

On confirm:
1. All step data (`authorityPosition` through `checklist`) is cleared.
2. Module 3 progress (`currentStep`, `completedSteps`, `isCompleted`) is reset.
3. Fresh Module 1 & 2 context is hydrated.
4. New fingerprint is computed and saved.
5. `isUpstreamStale` is set to `false`.
6. User starts from Step 1 with the updated context.

Context is preserved on rebuild so that the freshly hydrated values are immediately available for the new session.

## Persistence & Refresh Behaviour
*   **Storage:** State is synced to the database (or `localStorage` during initial MVP) on every successful step completion.
*   **Browser Refresh:** State loads from persistence. Fingerprint comparison runs on mount — if unchanged, all progress and edits survive.
*   **Regeneration:** Explicit regeneration ONLY happens when the user clicks "Regenerate" or triggers the stale-context rebuild action.

## Reset & Migration Rules
*   **Direct Route Guard:** If a user navigates to `/module-3` but Module 2 lacks an offer type, redirect to Module 2.
*   **Editing after Completion:** A user can return to Module 3 after completing it to tweak portfolio copy. Editing copy does NOT trigger regeneration.
*   **Schema Versioning:** State includes a `version` flag (currently `3`). Migration from v2 to v3 clears legacy v2 proofAssets and resets the step index to Step 3 (proof_asset_builder) while preserving the validated Module 1 & 2 context, Step 1 choice, and Step 2 proof priorities. Legacy v1 state is dropped entirely with fresh defaults initialized.

## Module 4 Bridge (The Export)
When transitioning to Module 4, Module 3 exposes a lightweight getter matching this exact interface:
```typescript
interface Module4BridgeContext {
  authorityPosition: string;
  coreTrustPromise: string;
  proofPriorities: { id: string; gapTitle: string; recommendedFormat: string }[];
  proofAssets: {
    id: string;
    title: string;
    assetType: string;
    credibilityGap: string;
    completionStatus: boolean;
    link?: string;
  }[];
  authorityReadiness: boolean;
  professionalHeadline: string;
  offerStatement: string;
  proofReferenceLine: string;
  ctaLine: string;
  portfolioCta: string;
  profileUrl?: string;
  portfolioUrl?: string;
}

getModule4Context(): Module4BridgeContext {
  return {
    authorityPosition: state.authorityPosition!,
    coreTrustPromise: state.coreTrustPromise,
    proofPriorities: state.proofPriorities.map(p => ({
      id: p.id,
      gapTitle: p.gapTitle,
      recommendedFormat: p.recommendedFormat
    })),
    proofAssets: state.proofAssets.map(a => ({ 
      id: a.id,
      title: a.title, 
      assetType: a.assetType,
      credibilityGap: a.credibilityGapProved,
      completionStatus: a.isAccepted,
      link: undefined
    })),
    authorityReadiness: state.isCompleted,
    professionalHeadline: state.profileCopy.professionalHeadline,
    offerStatement: state.profileCopy.offerStatement,
    proofReferenceLine: state.profileCopy.proofReferenceLine,
    ctaLine: state.profileCopy.ctaLine,
    portfolioCta: state.portfolioCopy.portfolioCta,
    profileUrl: undefined,
    portfolioUrl: undefined
  }
}
```
