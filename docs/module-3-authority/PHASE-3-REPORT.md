# PHASE 3 REPORT: Module 3 — Authority System (Proof Asset Builder)

## Spec Conflict Resolution

**Contradiction Found**: The initial specifications contained a contradiction. `WORKFLOW.md` and the core product definition for Module 3 required several fields that were entirely missing from the `DATA-STATE.md` specification and the actual `ProofAsset` TypeScript interface.

**Fields Added**:
- `processToDocument`: string[]
- `whatNotToClaim`: string[]
- `completionChecklist`: string[]
- `portfolioCopy.cta`: string
- `sourcePriorityFingerprint`: string
- `isCustom`: boolean

**Why Each Was Necessary**:
- `processToDocument`: Captures the specific reasoning/decisions the user must explain, preventing generic "show your process" output.
- `whatNotToClaim`: Provides asset-specific honesty warnings to prevent fabricated claims and maintain integrity.
- `completionChecklist`: Provides the actionable checklist for executing the specific proof asset.
- `portfolioCopy.cta`: Suggests the call-to-action for presenting the proof asset.
- `sourcePriorityFingerprint`: Persists a deterministic fingerprint of the linked Priority. Without this, we couldn't detect if the upstream priority was changed after the asset was generated.
- `isCustom`: A persisted flag used to detect if the user manually edited the asset, enabling safe, non-destructive regeneration warnings.

**Docs Updated**:
- `docs/module-3-authority/DATA-STATE.md`
- `docs/module-3-authority/WORKFLOW.md`
- `src/types/module3.ts`

**Confirmation**: I confirm that `DATA-STATE.md`, `WORKFLOW.md`, `EDGE-CASES-QA.md`, `MASTER-SPEC.md`, and the `ProofAsset` TypeScript interface now completely agree on the exact data shape and behaviour.

## 1. Feature Summary
Phase 3 implements Step 3: the **Proof Asset Builder**. This feature transitions the user from strategy (deciding *what* gaps to prove) into execution (generating the *exact briefs* to prove them). 

It dynamically generates 3 execution-ready proof asset briefs using a layered, deterministic composition architecture, ensuring a 1:1 linkage between a Proof Priority and a Proof Asset.

## 2. Technical Implementation Details
*   **Deterministic Generation Layer**: 
    *   Created `generateProofAsset` in `src/data/module3/proof-assets.ts`.
    *   Applied layered composition logic: Baseline format -> Service-family execution logic -> Buyer/Market modifiers -> Authority Position modifiers.
    *   This ensures briefs are highly specific without relying on LLMs.
*   **Stale-Link Detection**:
    *   The store calculates a `sourcePriorityFingerprint` for each generated asset based on its linked priority (`gapTitle`, `recommendedFormat`, etc.).
    *   When Step 3 mounts, it computes the current fingerprint of the linked priority and compares it against the asset's stored fingerprint. If they mismatch, a warning prompts the user to refresh the asset, preserving their manual edits until they confirm the refresh.
*   **Edit Preservation**:
    *   `updateProofAsset` automatically flags an asset with `isCustom: true` when the user edits any field.
    *   Attempting to regenerate an asset with `isCustom: true` triggers a destructive-action warning.
*   **Split-Screen UI**:
    *   Implemented `Step3ProofAssetBuilder.tsx` with a desktop split-screen layout (left side: edit fields, right side: portfolio preview).
    *   Mobile layout naturally stacks using Flexbox.
*   **State Management**:
    *   Added `updateProofAsset` and `replaceProofAsset` to the Zustand `module-3-progress` store. 
    *   `setProofAssets` is only used for the initial hydration of all 3 assets.

## 3. Data Architecture (Step 3)

The `ProofAsset` type has been locked as follows:

```typescript
export interface ProofAsset {
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
}
```

## 4. Known Edge Cases Addressed
*   **Regenerating an Edited Asset**: If `isCustom` is true, the user gets an explicit warning that regeneration will overwrite their edits.
*   **Upstream Priority Changes**: If the user modifies a priority in Step 2, returning to Step 3 will surface a "Proof Strategy Changed" dialog for the affected asset, allowing targeted regeneration without wiping the other two assets.
*   **Missing Initial Context**: If the user arrives at Step 3 without priorities, the UI cleanly handles the empty state while generation is simulated.

## 5. Next Steps
Phase 3 is complete and fully frozen. The system is ready to proceed to Phase 4 (Step 4 & 5).
