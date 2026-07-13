# MODULE 4 — DATA & STATE ARCHITECTURE

**Status:** FROZEN  
**Persist key:** `portfolio-system-progress`  
**Schema version:** 1 (NEW — V2 replaces V1 store entirely)

---

## 1. EXACT TYPESCRIPT CONTRACTS

```typescript
// ────────────────────────────────────────────
// Step 1 output — Portfolio Direction
// ────────────────────────────────────────────
interface PortfolioDirection {
  goal: 'attract_clients' | 'build_authority' | 'showcase_skills' | 'generate_leads';
  statement: string;
  targetAudience: string;
  userConfirmed: boolean;
  isCustom: boolean;          // true if user edited the generated statement
}

// ────────────────────────────────────────────
// Step 2 output — Platform Recommendation
// ────────────────────────────────────────────
interface PlatformRecommendation {
  primary: string;             // 'personal_website' | 'notion' | 'carrd' | 'framer' | 'behance' | 'github' | 'speakerdeck' | etc.
  secondary: string | null;
  reason: string;              // why this platform
  userConfirmed: boolean;      // user accepted or changed
  isCustom: boolean;           // true if user overrode recommendation
}

// ────────────────────────────────────────────
// Step 2 output — Portfolio Section Spec
// ────────────────────────────────────────────
interface PortfolioSectionSpec {
  id: string;
  label: string;
  description: string;
  included: boolean;
  order: number;
  source: 'base' | 'service' | 'market' | 'niche' | 'authority' | 'user';
  isCustom: boolean;           // true if user added/edited this section
}

// ────────────────────────────────────────────
// Step 3 output — Project Placement
// ────────────────────────────────────────────
interface ProjectPlacement {
  assetId: string;             // references phase3ProofAssets[].id
  title: string;
  role: 'featured' | 'secondary' | 'supporting';
  priorityRank: number;        // original Module 3 priority #
  isCustom: boolean;           // true if user reassigned from auto-suggestion
}

// ────────────────────────────────────────────
// Step 4 output — Project Presentation Spec
// ────────────────────────────────────────────
interface EvidencePlacement {
  type: string;                // 'video_clip' | 'screenshot' | 'code_block' | 'prototype_link' | 'chart' | 'walkthrough' | etc.
  label: string;
  order: number;
  description: string;
  isCustom: boolean;
}

interface ProjectPresentationSpec {
  assetId: string;
  projectTitle: string;
  clientContext: string;
  problemStatement: string;
  processSummary: string;
  evidenceOrder: EvidencePlacement[];
  deliverablesList: string[];
  resultStatement: string;
  cta: string;
  presentationStructure: string[];  // ordered structure keys
  isCustom: boolean;           // true if user edited any field
}

// ────────────────────────────────────────────
// Step 5 output — Portfolio Copy
// ────────────────────────────────────────────
interface PortfolioCopy {
  headline: string;
  shortIntro: string;
  perSection: Record<string, string>;    // section id → body copy
  perProject: Record<string, {           // asset id → project copy
    headline: string;
    description: string;
    cta: string;
  }>;
  ctaArchitecture: {
    heroCta: string;
    inlineCta: string;
    sectionCta: string;
    footerCta: string;
  };
  isCustom: boolean;
}

// ────────────────────────────────────────────
// Step 6 output — Portfolio Build Pack
// ────────────────────────────────────────────
interface PortfolioBuildPack {
  direction: PortfolioDirection;
  platform: PlatformRecommendation;
  sections: PortfolioSectionSpec[];
  projectPlacements: ProjectPlacement[];
  projectPresentations: ProjectPresentationSpec[];
  copy: PortfolioCopy;
  buildChecklist: ChecklistItem[];
  publishChecklist: ChecklistItem[];
  nextActions: string[];
  markdown: string;            // compiled Markdown export
  generatedAt: string;         // ISO timestamp
}

interface ChecklistItem {
  id: string;
  label: string;
  status: 'pending' | 'in_progress' | 'ready';
  source: 'module3' | 'module4_build' | 'module4_publish' | 'user';
  isCustom: boolean;
}

// ────────────────────────────────────────────
// Full Module 4 State
// ────────────────────────────────────────────
interface PortfolioSystemState {
  // Phase 3 context (from Module 3 — unchanged structure, keeping for backward compat)
  phase3Service: string | null;
  phase3ServiceLabel: string | null;
  phase3Market: string | null;
  phase3Niche: string | null;
  phase3Positioning: string;
  phase3OfferName: string;
  phase3OfferType: string | null;
  phase3Deliverables: string[];
  phase3UniqueMechanism: string;
  phase3Pricing: string;
  phase3Timeline: string;
  phase3ScopeDetails: string;
  phase3AuthorityAngle: string;
  phase3ProofAssets: { id: string; title: string; type: string }[];
  phase3PortfolioAssets: { name: string }[];
  phase3TrustBuilderChecklist: { label: string; status: string }[];
  phase3ContentAssets: { title: string }[];
  phase3AuthorityProfile: {
    oneLinePositioning: string;
    shortBio: string;
    trustBullets: string[];
    ctaLine: string;
  };

  // NEW Module 4 fields (replace current flat structure)
  portfolioDirection: PortfolioDirection | null;
  platform: PlatformRecommendation | null;
  sections: PortfolioSectionSpec[];
  projectPlacements: ProjectPlacement[];
  projectPresentations: ProjectPresentationSpec[];
  portfolioCopy: PortfolioCopy | null;
  buildChecklist: ChecklistItem[];
  publishChecklist: ChecklistItem[];
  buildPack: PortfolioBuildPack | null;

  // Navigation
  currentStep: PortfolioSystemStep;
  completedSteps: PortfolioSystemStep[];

  // Fingerprint / stale detection
  upstreamFingerprint: string;
  staleSince: number | null;       // timestamp when staleness was detected
  lastGeneratedAt: number | null;

  // Custom edit tracking
  editedFields: string[];          // field paths user has manually edited
}

type PortfolioSystemStep =
  | 'portfolio_direction'
  | 'platform_structure'
  | 'project_arrangement'
  | 'project_presentations'
  | 'portfolio_copy_cta'
  | 'portfolio_build_pack';

const PORTFOLIO_SYSTEM_STEPS: PortfolioSystemStep[] = [
  'portfolio_direction',
  'platform_structure',
  'project_arrangement',
  'project_presentations',
  'portfolio_copy_cta',
  'portfolio_build_pack',
];

// ────────────────────────────────────────────
// Module 5 Bridge Context
// ────────────────────────────────────────────
interface Module5BridgeContext {
  portfolioReady: boolean;
  portfolioUrl: string | null;
  featuredProofAsset: string;
  featuredProofAssetId: string;
  portfolioCta: string;
  portfolioHeadline: string;
}
```

---

## 2. STORE METHODS

```typescript
// Context
setPhase3Context(ctx: Phase3Context): void

// Step setters
setPortfolioDirection(value: PortfolioDirection): void
setPlatform(value: PlatformRecommendation): void
setSections(value: PortfolioSectionSpec[]): void
updateSection(id: string, updates: Partial<PortfolioSectionSpec>): void
setProjectPlacements(value: ProjectPlacement[]): void
setProjectPresentations(value: ProjectPresentationSpec[]): void
updateProjectPresentation(assetId: string, updates: Partial<ProjectPresentationSpec>): void
setPortfolioCopy(value: PortfolioCopy): void
setBuildChecklist(value: ChecklistItem[]): void
setPublishChecklist(value: ChecklistItem[]): void
setBuildPack(value: PortfolioBuildPack | null): void

// Navigation
confirmStep(): void
nextStep(): void
previousStep(): void
jumpToStep(step: PortfolioSystemStep): void

// Fingerprint
setUpstreamFingerprint(value: string): void
markStale(): void
clearStale(): void
regenerate(): void        // clears edits, regenerates all

// Custom edit tracking
markEdited(fieldPath: string): void
clearEdits(): void

// Reset
reset(): void
```

---

## 3. FINGERPRINT ARCHITECTURE

### Fingerprint Payload

```typescript
function computeUpstreamFingerprint(state: PortfolioSystemState): string {
  const parts = [
    state.phase3Service || '',
    state.phase3Market || '',
    state.phase3Niche || '',
    state.phase3Positioning || '',
    state.phase3AuthorityAngle || '',
    state.phase3ProofAssets.map(a => `${a.id}:${a.title}`).join('|'),
    state.phase3AuthorityProfile.oneLinePositioning || '',
    state.phase3AuthorityProfile.ctaLine || '',
  ];
  return simpleHash(parts.join('::'));
}
```

### Behaviour States

| Scenario | Behaviour |
|---|---|
| **First entry** (no fingerprint) | Set fingerprint, proceed normally |
| **Revisit, fingerprint matches** | No change — show current state |
| **Revisit, fingerprint differs, NO user edits** | Auto-regenerate silently (no edits to lose) |
| **Revisit, fingerprint differs, HAS user edits** | Show stale banner with "Regenerate" / "Keep my work" |
| **User clicks "Regenerate"** | Clear all portfolio fields, reset fingerprint, full regenerate |
| **User clicks "Keep my work"** | Dismiss banner, update fingerprint to current (acknowledge stale), continue |
| **Completed M4, upstream changes** | Show stale banner on Build Pack step. Refresh recalculates. User can re-download. |
| **Targeted regenerate (1 project)** | Not supported in V1. Full regenerate only. |

### Manual Edit Preservation

Fields tracked in `editedFields[]` array. Path format:

```
portfolioDirection           // entire direction was edited
platform.platform            // platform override
projectPlacements[0].role    // user reassigned featured asset
projectPresentations[1].problemStatement  // edited problem statement
portfolioCopy.headline       // headline edited
buildChecklist[3].status     // checklist status changed
```

When `regenerate()` is called:
- If `editedFields` is empty → all fields regenerate
- If `editedFields` has entries → banner warns that edits will be lost; user must confirm

---

## 4. PERSISTENCE

**Zustand persist middleware** with `partialize`:

```typescript
partialize: (state) => ({
  // Persist ALL state fields
  phase3Service, phase3ServiceLabel, phase3Market, phase3Niche,
  phase3Positioning, phase3OfferName, phase3OfferType,
  phase3Deliverables, phase3UniqueMechanism, phase3Pricing,
  phase3Timeline, phase3ScopeDetails, phase3AuthorityAngle,
  phase3ProofAssets, phase3PortfolioAssets,
  phase3TrustBuilderChecklist, phase3ContentAssets,
  phase3AuthorityProfile,
  portfolioDirection, platform, sections,
  projectPlacements, projectPresentations,
  portfolioCopy, buildChecklist, publishChecklist, buildPack,
  currentStep, completedSteps,
  upstreamFingerprint, staleSince, lastGeneratedAt, editedFields,
}),
```

**Do NOT persist:**
- `_hasHydrated` (internal)
- Derived/computed values only used during session

---

## 5. MIGRATION

Current localStorage key `portfolio-system-progress` contains the V1 schema (8 steps, flat fields). V2 uses the same key with a new schema.

**Migration strategy:**
1. No backward migration — V1 data is stale anyway since V2 changes the API surface entirely
2. On first load, if V1 fields exist without V2 fields, `reset()` to clear
3. Schema version field added: if store loads with `version: undefined` and no V2 fields, reset
