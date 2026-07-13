# EDGE CASES & QA: Module 3 — Authority System

## 1. Upstream Data Edge Cases

All scenarios below require the upstream fingerprint to detect the change. The fingerprint includes every authority-relevant field from Module 1 and Module 2.

| # | Scenario | Expected Behaviour | User-Facing UX |
|---|---------|-------------------|----------------|
| 1 | Zero Module 1/2 Context | Route blocked. Redirect to Mod 1. | "Complete Module 1 first" |
| 2 | First-ever Module 3 entry | Hydrate context. Save fingerprint. No warning. | Seamless entry to Step 1 |
| 3 | Refresh with same upstream data | Fingerprints match. Preserve all state. | Seamless reload |
| 4 | Navigate away and return | Fingerprints match. Preserve state. | Seamless return |
| 5 | Module 1 `careerTrackId` changes | Fingerprint mismatch + progress → stale state | "Your context changed. Rebuild?" |
| 6 | Module 1 `serviceId` changes | Fingerprint mismatch + progress → stale state | "Your context changed. Rebuild?" |
| 7 | Module 1 `marketId` changes | Fingerprint mismatch + progress → stale state | "Your context changed. Rebuild?" |
| 8 | Module 1 `nicheId` changes | Fingerprint mismatch + progress → stale state | "Your context changed. Rebuild?" |
| 9 | Module 2 `offerType` changes | Fingerprint mismatch + progress → stale state | "Your context changed. Rebuild?" |
| 10 | Module 2 `uniqueMechanism` changes | Fingerprint mismatch + progress → stale state | "Your context changed. Rebuild?" |
| 11 | Module 2 `deliverables` change | Fingerprint mismatch + progress → stale state | "Your context changed. Rebuild?" |
| 12 | Module 2 `scopeLimits` change | Fingerprint mismatch + progress → stale state | "Your context changed. Rebuild?" |
| 13 | Module 2 `valueAmplifier` changes | Fingerprint mismatch + progress → stale state | "Your context changed. Rebuild?" |
| 14 | Module 2 `pricingModel` changes | Fingerprint mismatch + progress → stale state | "Your context changed. Rebuild?" |
| 15 | Module 2 `finalPrice` / tiered / value-based price changes | Fingerprint mismatch + progress → stale state | "Your context changed. Rebuild?" |
| 16 | Module 2 `proposalSummary` changes | Fingerprint mismatch + progress → stale state | "Your context changed. Rebuild?" |
| 17 | Upstream change before any Module 3 progress | Rehydrate context silently. Save new fingerprint. | Seamless — user sees updated context |
| 18 | Upstream change after Module 3 progress | Set `isUpstreamStale`. Blocking stale-state UI. | "Reset and Rebuild Authority System" |
| 19 | Completed Module 3 + upstream change | Same as #18 — never silently reset completed work | "Reset and Rebuild Authority System" |
| 20 | Explicit "Reset and Rebuild" action | Clear step data + progress. Hydrate context. Save fingerprint. Start from Step 1. | Returned to Step 1 with updated context |

## 2. In-Module Edge Cases

| Scenario | Expected Behaviour | User-Facing UX | QA Test |
| :--- | :--- | :--- | :--- |
| User deletes a generated Proof Asset title | Step 3 allows deletion/regeneration, but exactly 3 must exist to proceed. | "You must have 3 active projects." | Try to proceed with 2 assets. |
| User writes a 2-word custom gap | Step 2 validation blocks progression. | "Gap must be > 10 characters." | Enter "SEO" as custom gap. |
| User edits copy, then hits "Regenerate" | System warns of destructive action. | "Regenerating will overwrite your manual edits." | Edit textarea, hit regenerate, verify warning. |
| Browser refresh on Step 4 | State loads from persistence; manual edits are preserved. | Seamless load. | Edit text, refresh page, verify text remains. |

## 3. UI/UX Edge Cases

| Scenario | Expected Behaviour | User-Facing UX | QA Test |
| :--- | :--- | :--- | :--- |
| Extremely long Asset Title | UI truncates with ellipsis in summary views, wraps in detail views. | Text wraps cleanly without breaking flexbox. | Inject 200-char string into title. |
| 320px Mobile Screen (iPhone SE) | Horizontal tabs convert to vertical accordions. Stepper simplifies to "Step 3 of 5". | No horizontal scrollbars. | Render in Chrome DevTools @ 320px width. |
| API Timeout during generation | Skeleton loader stops, error state shown, retry button provided. | "Generation took too long. Try again." | Mock 504 error on API call. |

## 4. State & Progression Edge Cases

| Scenario | Expected Behaviour | User-Facing UX | QA Test |
| :--- | :--- | :--- | :--- |
| Old Persisted Schema (v1) | Migration runs on load. Drops incompatible v1 fields. Fresh v3 defaults. | Seamless. | Mock v1 state, load app, verify fresh start. |
| Old Persisted Schema (v2) | Migration clears legacy v2 proofAssets and resets completedSteps to Step 3. | Preserves Step 1/2 work but forces Step 3 regeneration. | Mock v2 state, load app, verify redirected to Step 3 with empty assets. |
| Mod 4 opened without Mod 3 completion | Mod 4 locks and redirects to Mod 3. | "Complete your Authority System first." | Navigate to `/module-4` directly. |
| Changing Position in Step 1 after reaching Step 4 | Destructive action. Wipes Step 2, 3, 4 state. | "This will reset your portfolio. Are you sure?" | Complete step 4, go to step 1, change option. |

## QA Sign-off Requirements
Before merging any phase, developers must manually verify:
1.  The Fingerprint system correctly identifies upstream changes (#1–16).
2.  First entry and same-context refresh are seamless (#2–4).
3.  Pre-progress upstream change silently rehydrates (#17).
4.  Post-progress upstream change shows blocking stale-state UI (#18–19).
5.  "Reset and Rebuild" clears data, hydrates context, saves fingerprint, returns to Step 1 (#20).
6.  Generated copy is editable and those edits survive a hard page refresh.
7.  The final Authority Pack correctly compiles data from all 4 previous steps.
