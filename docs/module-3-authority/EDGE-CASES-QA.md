# EDGE CASES & QA: Module 3 — Authority System

## 1. Upstream Data Edge Cases

| Scenario | Expected Behaviour | User-Facing UX | QA Test |
| :--- | :--- | :--- | :--- |
| Zero Module 1/2 Context | Route blocked. Redirect to Mod 1. | "You need an offer first." | Navigate to `/module-3` with empty DB. |
| User changes Mod 1 Market | Fingerprint mismatch triggers on next Mod 3 load. | Modal warning: "Your market changed. Regenerate proof?" | Change Mod 1, load Mod 3. Verify modal. |
| User changes Mod 2 Mechanism | Fingerprint mismatch. | Modal warning. | Change Mod 2, load Mod 3. Verify modal. |

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
| Old Persisted Schema | Migration script runs on load, adds new default fields. | Seamless. | Mock v1 state, load app, verify state upgrades to v2. |
| Mod 4 opened without Mod 3 completion | Mod 4 locks and redirects to Mod 3. | "Complete your Authority System first." | Navigate to `/module-4` directly. |
| Changing Position in Step 1 after reaching Step 4 | Destructive action. Wipes Step 2, 3, 4 state. | "This will reset your portfolio. Are you sure?" | Complete step 4, go to step 1, change option. |

## QA Sign-off Requirements
Before merging any phase, developers must manually verify:
1.  The Fingerprint system correctly identifies upstream changes.
2.  Generated copy is editable and those edits survive a hard page refresh.
3.  The final Authority Pack correctly compiles data from all 4 previous steps.
