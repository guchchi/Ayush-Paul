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
    startingMaterial: string;
    executionSteps: string[];
    deliverables: string[];
    evidenceToCapture: string[];
    presentationStructure: string;
    portfolioCopy: {
      headline: string;
      description: string;
      proofStatement: string;
    };
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

  // System
  isCompleted: boolean;
  lastUpdated: number;
  upstreamFingerprint: string;
}
```

## Context Fingerprint & Upstream Changes

Module 3 is highly dependent on Modules 1 and 2. 
*   **Fingerprint Generation:** When Module 3 is initialized, it creates a hash/fingerprint of `mod1.service + mod1.market + mod2.offerType + mod2.mechanism`.
*   **Stale-State Detection:** Every time the user opens Module 3, it compares the current upstream data against `upstreamFingerprint`.
*   **Stale-State UX:** If the fingerprint mismatches (meaning the user went back and changed their offer), a blocking modal appears:
    *   *"You recently changed your Offer. Your Authority System is now out of sync. Do you want to regenerate your proof strategy to match your new offer, or keep your old assets?"*

## Persistence & Refresh Behaviour
*   **Storage:** State is synced to the database (or `localStorage` during initial MVP) on every successful step completion.
*   **Browser Refresh:** A hard refresh on Step 3 must remount Step 3 exactly as it was, pulling from persisted state, NOT regenerating the briefs.
*   **Regeneration:** Explicit regeneration ONLY happens when the user clicks a "Regenerate" button or intentionally changes a core upstream variable (like Authority Position).

## Reset & Migration Rules
*   **Direct Route Guard:** If a user navigates to `/module-3` but `module2.isCompleted === false`, redirect to `/module-2`.
*   **Editing after Completion:** A user can return to Module 3 after completing it to tweak portfolio copy. Editing copy does NOT trigger regeneration.
*   **Schema Versioning:** State must include a `version` flag to handle future schema updates without breaking in-progress users.

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
      completionStatus: a.isAccepted, // or tied to checklist completion
      link: undefined // Populated later by user
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
