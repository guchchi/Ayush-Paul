# Revised Implementation Plan — Module 3 Step 3: Profile & Portfolio Authority

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build Module 3 Step 3 as an intelligent, interactive **Profile & Portfolio Authority Strategic Workspace** that analyzes Step 1 positioning and Step 2 proof assets to provide contextual recommendations, controlled human decision checkpoints (`[Accept]`, `[Adjust]`, `[Why?]`), deep evidence placement reasoning, alignment diagnostics, state persistence, and a 5-step tactical Action Plan.

**Architecture:** A Zustand-persisted strategic intelligence state engine (`authority-strategy-engine.ts`) with upstream stale-context detection, user decision tracking (`pending` | `accepted` | `adjusted`), proof strength evaluation (`credential` < `project` < `outcome` < `case_study`), deep placement mapping, alignment diagnostic warnings, and a 5-step Next Moves execution plan.

**Tech Stack:** React 19, TypeScript, Zustand (`persist` middleware with local overrides), Motion (`motion/react` with presets), Tailwind CSS v4, Lucide Icons.

---

## Strategic Product Requirements to Enforce

1. **Strategy Engine Over Rigid Rules**: Dynamic contextual reasoning based on `Authority Position → Audience → Offer → Proof Assets → Proof Strength → Perception Target → Placement → Visitor Journey`.
2. **Controlled Human Decision Layer**: All system recommendations offer `[Accept]`, `[Adjust]`, and `[Why?]` decision controls. The user remains the decision maker.
3. **No Portfolio Builder Drift**: Reordering and adjustments happen through strategic recommendations (`"Why this order?"`), not raw drag-and-drop website editing.
4. **Actionable Priorities**: Every `HIGH` / `MEDIUM` / `LOW` section priority includes `Priority` + `Strategic Rationale (Why)` + `Actionable Advice`.
5. **Deep Evidence Placement**: Maps `Claim → Relevant Proof Asset → Proof Strength → Placement Section → Visibility Level → Action If Proof Is Weak`.
6. **Proof Strength Evaluation**: Evaluates proof hierarchy (`Credential` < `Project` < `Demonstration` < `Outcome` < `Testimonial` < `Case Study` < `Repeated Outcomes`).
7. **Diagnostic Alignment Audit**: Surfaces real gap warnings (e.g. `⚠ POSITIONING → PORTFOLIO GAP`) and positive alignment indicators.
8. **Context-Driven Presentation Strategy**: Adapts visitor psychology flow based on user's positioning persona (Service Provider vs. Freelancer vs. Practitioner).
9. **Full State Persistence & Upstream Dependency Handling**: Persists `Draft`, `Accepted`, and `Adjusted` states; warns user if Step 1/2 changes without overwriting manual edits.
10. **Tactical "Next Moves" Action Plan**: Ends Step 3 with a 5-step actionable execution checklist before handoff to Step 4.

---

## Complete Data Models & Types (`src/types/module3-step3-authority.ts`)

```ts
export type ProofStrengthLevel = 
  | 'credential'
  | 'project'
  | 'demonstration'
  | 'outcome'
  | 'testimonial'
  | 'case_study'
  | 'repeated_outcomes';

export type DecisionStatus = 'pending' | 'accepted' | 'adjusted';

export interface StrategicRecommendation<T> {
  id: string;
  recommendedValue: T;
  originalValue: T;
  userOverride?: T;
  status: DecisionStatus;
  reason: string;
  actionableAdvice: string;
}

export interface MessageHierarchyLayer {
  layerKey: 'who_you_are' | 'what_you_do' | 'who_you_help' | 'known_for' | 'why_credible' | 'next_step';
  layerTitle: string;
  perceptionTarget: string;
  recommendedFocus: string;
  strategicRationale: string;
  userCustomization?: string;
  status: DecisionStatus;
}

export interface PortfolioStructureSectionItem {
  id: string;
  position: number;
  sectionTitle: string;
  structuralRole: string;
  visitorMindset: string;
  conversionRationale: string;
  recommendedVisual: string;
  isEnabled: boolean;
  status: DecisionStatus;
}

export interface SectionPriorityItem {
  id: string;
  sectionName: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  whyPriority: string;
  actionRequired: string;
}

export interface EvidencePlacementMapping {
  id: string;
  claim: string;
  proofAssetId: string;
  proofTitle: string;
  proofStrength: ProofStrengthLevel;
  whyItSupportsClaim: string;
  recommendedPlacement: string;
  visibilityLevel: 'High' | 'Medium' | 'Low';
  actionIfWeak?: string;
}

export interface PresentationJourneyStep {
  stepNumber: number;
  stageName: string;
  visitorPsychology: string;
  communicationPurpose: string;
  keyContentToPresent: string;
}

export interface ReinforcementDiagnosticIssue {
  id: string;
  severity: 'warning' | 'success' | 'critical';
  title: string;
  positioningClaim: string;
  actualEvidenceOrWork: string;
  recommendation: string;
  impactedSection: string;
}

export interface NextMoveActionItem {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  impact: string;
  isCompleted: boolean;
}

export interface ProfilePortfolioAuthorityBlueprint {
  foundation: {
    authorityPosition: string;
    trustPromise: string;
    equippedProofCount: number;
    skippedProofCount: number;
    strongestProofSignal: string;
  };
  profilePositioning: MessageHierarchyLayer[];
  portfolioStructure: PortfolioStructureSectionItem[];
  sectionPriorities: SectionPriorityItem[];
  evidencePlacements: EvidencePlacementMapping[];
  presentationFlow: {
    personaContext: string;
    journey: PresentationJourneyStep[];
  };
  alignmentAudit: {
    alignmentScore: number;
    overallVerdict: string;
    diagnostics: ReinforcementDiagnosticIssue[];
  };
  nextMoves: NextMoveActionItem[];
  isLocked: boolean;
  generatedAt: string;
  lastUpdated: string;
}
```

---

## Tasks Breakdown

### Task 1: Create Comprehensive Data Types (`src/types/module3-step3-authority.ts`)

**Files:**
- Create: `src/types/module3-step3-authority.ts`

**Step 1: Write type definitions**
- Define `ProofStrengthLevel`, `StrategicRecommendation<T>`, `MessageHierarchyLayer`, `PortfolioStructureSectionItem`, `SectionPriorityItem`, `EvidencePlacementMapping`, `PresentationJourneyStep`, `ReinforcementDiagnosticIssue`, `NextMoveActionItem`, and `ProfilePortfolioAuthorityBlueprint`.

**Step 2: Typecheck**
- Run `npx tsc --noEmit` to ensure zero compilation errors.

**Step 3: Commit**
- `git add src/types/module3-step3-authority.ts && git commit -m "feat(module3): add comprehensive Step 3 Profile & Portfolio Authority types"`

---

### Task 2: Implement Strategic Intelligence Engine (`src/data/module3/authority-strategy-engine.ts`)

**Files:**
- Create: `src/data/module3/authority-strategy-engine.ts`

**Step 1: Write proof strength evaluator & contextual strategy algorithms**
- Implement `evaluateProofStrength(asset)` to rank proof quality (`credential` < `project` < `outcome` < `case_study`).
- Implement `buildProfilePositioningHierarchy(mod3State)`: Contextual 6-layer message hierarchy.
- Implement `buildPortfolioStructureJourney(mod3State)`: Guided credibility journey customized for Service Provider vs. Freelancer vs. Practitioner.
- Implement `buildSectionPrioritiesStrategy(mod3State)`: Calculates `HIGH`/`MEDIUM`/`LOW` with `Why Priority` + `Action Required`.
- Implement `buildEvidencePlacementMappings(mod3State)`: Deep `Claim → Proof Asset → Proof Strength → Placement → Visibility → Action If Weak`.
- Implement `buildPresentationFlowStrategy(mod3State)`: Persona-driven visitor psychology sequence.
- Implement `buildAuthorityReinforcementAudit(mod3State)`: Detects actual positioning vs. proof gaps (e.g. `⚠ POSITIONING → PORTFOLIO GAP`).
- Implement `buildNextMovesActionPlan(mod3State, blueprint)`: 5-step tactical execution list.
- Implement master generator `generateProfilePortfolioAuthorityBlueprint(mod3State)`.

**Step 2: Typecheck engine**
- Run `npx tsc --noEmit`.

**Step 3: Commit**
- `git add src/data/module3/authority-strategy-engine.ts && git commit -m "feat(module3): implement strategic intelligence engine for Step 3"`

---

### Task 3: Update Zustand Store Persistence & Stale Detection (`src/lib/module3/store.ts` & `src/types/module3.ts`)

**Files:**
- Modify: `src/types/module3.ts`
- Modify: `src/lib/module3/store.ts`

**Step 1: Add store actions for Step 3 decision layer**
- Add `authorityBlueprint: ProfilePortfolioAuthorityBlueprint | null` to state interface.
- Add store actions:
  - `setAuthorityBlueprint(blueprint: ProfilePortfolioAuthorityBlueprint): void`
  - `updateMessageLayer(layerKey: string, customization: string): void`
  - `reorderBlueprintPortfolioSection(fromIdx: number, toIdx: number): void`
  - `toggleBlueprintPortfolioSection(sectionId: string): void`
  - `acceptBlueprintRecommendation(sectionKey: string, itemId: string): void`
  - `toggleNextMoveItem(itemId: string): void`

**Step 2: Typecheck & verify state persistence**
- Run `npx tsc --noEmit`.

**Step 3: Commit**
- `git add src/types/module3.ts src/lib/module3/store.ts && git commit -m "feat(module3): add blueprint state persistence and decision handlers to store"`

---

### Task 4: Build Reusable Strategic Recommendation Card with Human Checkpoints (`StrategicRecommendationCard.tsx`)

**Files:**
- Create: `src/components/module3/step3/components/StrategicRecommendationCard.tsx`

**Step 1: Implement UI**
- Render card showing system recommendation, `Strategic Rationale (Why)`, `Action Required`, and human decision buttons:
  - `[Accept Recommendation]`
  - `[Adjust]` (opens inline adjustment control)
  - `[Why?]` (toggles deep strategic reasoning drawer)
- Display decision badge (`PENDING`, `ACCEPTED`, `USER OVERRIDE`).

**Step 2: Typecheck**
- Run `npx tsc --noEmit`.

**Step 3: Commit**
- `git add src/components/module3/step3/components/StrategicRecommendationCard.tsx && git commit -m "feat(module3): build reusable StrategicRecommendationCard component"`

---

### Task 5: Build Section 1 — Authority Foundation (`1_AuthorityFoundationSection.tsx`)

**Files:**
- Create: `src/components/module3/step3/sections/1_AuthorityFoundationSection.tsx`

**Step 1: Implement UI**
- Render Step 1 Authority Position summary card (Known for, positioning rationale, trust promise).
- Render Step 2 Proof Strategy summary card (Equipped proof assets, strongest proof signal).
- Render visual foundation connector (`Authority Position → Proof Strategy → Profile + Portfolio Blueprint`).
- No repeated user data entry required.

**Step 2: Typecheck**
- Run `npx tsc --noEmit`.

**Step 3: Commit**
- `git add src/components/module3/step3/sections/1_AuthorityFoundationSection.tsx && git commit -m "feat(module3): build Section 1 Authority Foundation UI"`

---

### Task 6: Build Section 2 — Profile Positioning (`2_ProfilePositioningSection.tsx`)

**Files:**
- Create: `src/components/module3/step3/sections/2_ProfilePositioningSection.tsx`

**Step 1: Implement UI**
- Render 6-stage Message Hierarchy map (`WHO YOU ARE` → `WHAT YOU DO` → `WHO YOU HELP` → `KNOWN FOR` → `CREDIBILITY` → `NEXT STEP`).
- Show 5-second stranger perception target.
- Include `StrategicRecommendationCard` controls (`[Accept]`, `[Adjust]`, `[Why?]`) for each messaging layer.

**Step 2: Typecheck**
- Run `npx tsc --noEmit`.

**Step 3: Commit**
- `git add src/components/module3/step3/sections/2_ProfilePositioningSection.tsx && git commit -m "feat(module3): build Section 2 Profile Positioning UI"`

---

### Task 7: Build Section 3 — Portfolio Structure (`3_PortfolioStructureSection.tsx`)

**Files:**
- Create: `src/components/module3/step3/sections/3_PortfolioStructureSection.tsx`

**Step 1: Implement UI**
- Render Guided Credibility Journey timeline (`01 Positioning` → `02 Capability/Offer` → `03 Selected Work` → `04 Evidence/Proof` → `05 Trust` → `06 Next Step`).
- Display strategic reasoning for sequence ("Why this order?").
- Allow controlled position move up/down and enable/disable section toggle.

**Step 2: Typecheck**
- Run `npx tsc --noEmit`.

**Step 3: Commit**
- `git add src/components/module3/step3/sections/3_PortfolioStructureSection.tsx && git commit -m "feat(module3): build Section 3 Portfolio Structure UI"`

---

### Task 8: Build Section 4 — Section Priorities (`4_SectionPrioritiesSection.tsx`)

**Files:**
- Create: `src/components/module3/step3/sections/4_SectionPrioritiesSection.tsx`

**Step 1: Implement UI**
- Render priority cards categorized by emphasis:
  - `HIGH EMPHASIS` (Impossible to miss)
  - `MEDIUM EMPHASIS` (Supporting context)
  - `LOW EMPHASIS` (Secondary details)
- Each card shows: `Priority Badge` + `Why Priority (Strategic Rationale)` + `Action Required`.

**Step 2: Typecheck**
- Run `npx tsc --noEmit`.

**Step 3: Commit**
- `git add src/components/module3/step3/sections/4_SectionPrioritiesSection.tsx && git commit -m "feat(module3): build Section 4 Section Priorities UI"`

---

### Task 9: Build Section 5 — Deep Evidence Placement (`5_EvidencePlacementSection.tsx`)

**Files:**
- Create: `src/components/module3/step3/sections/5_EvidencePlacementSection.tsx`

**Step 1: Implement UI**
- Render deep Claim -> Proof Asset -> Proof Strength -> Placement cards:
  ```text
  AUTHORITY CLAIM
        ↓
  RELEVANT PROOF ASSET (from Step 2) [Strength: Case Study / Outcome / Demo]
        ↓
  WHY IT SUPPORTS THIS CLAIM
        ↓
  RECOMMENDED SECTION PLACEMENT & VISIBILITY LEVEL
        ↓
  ACTION IF PROOF IS WEAK / GAPPING
  ```

**Step 2: Typecheck**
- Run `npx tsc --noEmit`.

**Step 3: Commit**
- `git add src/components/module3/step3/sections/5_EvidencePlacementSection.tsx && git commit -m "feat(module3): build Section 5 Deep Evidence Placement UI"`

---

### Task 10: Build Section 6 — Presentation Strategy (`6_PresentationStrategySection.tsx`)

**Files:**
- Create: `src/components/module3/step3/sections/6_PresentationStrategySection.tsx`

**Step 1: Implement UI**
- Render persona-driven progressive visitor psychology sequence.
- Display visitor psychology at each stage (`Curiosity` → `Clarity` → `Evaluation` → `Validation` → `Conviction`).
- Show persona adaptation callout (Service Provider vs. Freelancer vs. Practitioner).

**Step 2: Typecheck**
- Run `npx tsc --noEmit`.

**Step 3: Commit**
- `git add src/components/module3/step3/sections/6_PresentationStrategySection.tsx && git commit -m "feat(module3): build Section 6 Presentation Strategy UI"`

---

### Task 11: Build Section 7 — Authority Reinforcement Diagnostic (`7_AuthorityReinforcementSection.tsx`)

**Files:**
- Create: `src/components/module3/step3/sections/7_AuthorityReinforcementSection.tsx`

**Step 1: Implement UI**
- Render System Alignment Diagnostic:
  - Visual Chain: `AUTHORITY POSITION → PROFILE → PORTFOLIO → WORK → PROOF → SAME CORE PERCEPTION`.
  - Alignment score & overall verdict badge.
  - Surface real disconnect warnings (e.g. `⚠ POSITIONING → PORTFOLIO GAP: Positioning says AI Automation, but portfolio showcases graphic design`) with strategic advisor fix recommendations.
  - Highlight verified positive alignment links.

**Step 2: Typecheck**
- Run `npx tsc --noEmit`.

**Step 3: Commit**
- `git add src/components/module3/step3/sections/7_AuthorityReinforcementSection.tsx && git commit -m "feat(module3): build Section 7 Authority Reinforcement Diagnostic UI"`

---

### Task 12: Build Tactical "Next Moves" Action Plan (`8_NextMovesActionPlanSection.tsx`)

**Files:**
- Create: `src/components/module3/step3/sections/8_NextMovesActionPlanSection.tsx`

**Step 1: Implement UI**
- Render 5-step actionable execution checklist (`YOUR NEXT MOVES`):
  1. Refine profile positioning
  2. Reorganize portfolio around recommended structure
  3. Move strongest proof closer to claims
  4. Strengthen evidence for weakest authority claim
  5. Remove or de-emphasize content creating confusion
- Interactive check/uncheck tasks with progress tracker.

**Step 2: Typecheck**
- Run `npx tsc --noEmit`.

**Step 3: Commit**
- `git add src/components/module3/step3/sections/8_NextMovesActionPlanSection.tsx && git commit -m "feat(module3): build Section 8 Next Moves Action Plan UI"`

---

### Task 13: Build Master Profile + Portfolio Authority Blueprint Viewer (`MasterBlueprintViewer.tsx`)

**Files:**
- Create: `src/components/module3/step3/components/MasterBlueprintViewer.tsx`

**Step 1: Implement UI**
- Synthesize all 7 sections + Action Plan into a single, cohesive, interactive **Profile + Portfolio Authority Blueprint** document.
- Show clear strategic answers to the 8 core user questions.
- Secondary 1-click Markdown export trigger.

**Step 2: Typecheck**
- Run `npx tsc --noEmit`.

**Step 3: Commit**
- `git add src/components/module3/step3/components/MasterBlueprintViewer.tsx && git commit -m "feat(module3): build MasterBlueprintViewer component"`

---

### Task 14: Main Container Assembly & Upstream Stale Handling (`Step3ProfilePortfolioAuthority.tsx`)

**Files:**
- Modify/Create: `src/components/module3/step3/Step3ProfilePortfolioAuthority.tsx`
- Modify: `src/components/module3/StepContent.tsx`

**Step 1: Assemble main Step 3 container**
- Add upstream stale context banner: if Step 1 or Step 2 changes after Step 3 completion, warn user (`"Your authority position or proof strategy was updated. Review updated recommendations."`) while preserving user overrides.
- Tabbed & accordion progressive workspace for all 7 sections + Next Moves Action Plan + Master Blueprint Viewer.
- Integrate launch readiness checklist & Step 4 handoff button ("Proceed to Authority Operating System →").
- Update `StepContent.tsx` to render `Step3ProfilePortfolioAuthority`.

**Step 2: Verify full integration & SSG build**
- Run `npx tsc --noEmit`.
- Run `npm run build`.

**Step 3: Commit**
- `git add src/components/module3/ && git commit -m "feat(module3): finalize Step 3 Profile & Portfolio Authority strategic workspace"`

---

## Verification & Execution Handoff

- **Typecheck:** `npx tsc --noEmit`
- **Build Guard:** `npm run build`
- **Git Push:** Automatically commit and push all changes to GitHub main branch upon completion.
