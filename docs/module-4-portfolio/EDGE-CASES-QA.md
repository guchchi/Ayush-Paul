# MODULE 4 — EDGE CASES & QA

**Status:** FROZEN

---

## 1. NO MODULE 3 CONTEXT

**Condition:** `phase3Service === null` and `phase3ProofAssets.length === 0`

**Behaviour:**
- Full-page empty state: "Complete the Authority System first to build your portfolio."
- All steps are locked except the empty state.
- "Go to Authority System" button navigates to `/workspace/authority-system`.
- No partial progress allowed — portfolio cannot function without Module 3 data.

---

## 2. INCOMPLETE MODULE 3

**Condition:** Module 3 is started but not completed (some proof assets exist, profile copy is partial)

**Behaviour:**
- Portfolio proceeds if at least 1 proof asset exists and profile copy exists
- If 0 proof assets: empty state as above
- If profile copy is empty: system generates minimal placeholder copy ("Add your bio here")

---

## 3. SINGLE PROOF ASSET

**Condition:** `phase3ProofAssets.length === 1`

**Behaviour:**
- Featured project: the single asset
- Secondary: omitted (displayed with note "Add more proof assets in Module 3 to expand your portfolio")
- Supporting: omitted
- All sections that require 2+ projects (e.g., "Selected Work" grid) gracefully handle missing items

---

## 4. TWO PROOF ASSETS

**Condition:** `phase3ProofAssets.length === 2`

**Behaviour:**
- Featured: priority #1
- Secondary: priority #2
- Supporting: omitted
- Same handling as single asset for missing slots

---

## 5. ZERO PROOF ASSETS (AT LEAST ONE REQUIRED)

**Condition:** Module 3 completed with `proofAssets.length === 0`

**Behaviour:**
- Block on Step 3: "No proof assets found. You need at least one proof asset from Module 3."
- "Go to Authority System" button
- Other steps (1, 2) still accessible

---

## 6. USER NAVIGATES BACK AFTER PROGRESS

**Condition:** User completes Step 3, then navigates back to Step 2

**Behaviour:**
- Step 3 data preserved
- Warning message: "Changing your platform or sections may affect your project arrangement."
- If user changes platform, Step 3 projects remain but a note says "Review your project presentations — your platform changed."
- If user removes a section that contains a placed project, project moves to "unplaced" with inline warning

---

## 7. PLATFORM OVERRIDE

**Condition:** User rejects system recommendation and chooses a different platform

**Behaviour:**
- `platform.userConfirmed = true` (user made a choice)
- `platform.isCustom = true` (user overrode recommendation)
- Section blueprint adjusted if platform has different capabilities (e.g., Behance vs Framer)
- If section count changes, existing project placements are preserved if sections still exist; if mapped section is removed, project appears with "Section removed" warning

---

## 8. VERY LONG CONTENT

**Condition:** User writes very long copy (>500 chars in single field)

**Behaviour:**
- Text areas use `max-h-96 overflow-y-auto`
- Preview panel scrolls independently
- Markdown export handles any length
- No input length restriction (user may write as much as they want)
- Mobile layout tested with long content

---

## 9. EMPTY MARKET OR NICHE

**Condition:** `phase3Market === null || phase3Niche === null` (Module 1 data missing)

**Behaviour:**
- Fall back to service-level defaults for market and niche modifiers
- Show note: "Your market/niche was not saved. Using service-level defaults."
- All content generators use category-level defaults

---

## 10. BRIDGE ADAPTER FAILS

**Condition:** `getModule4Context()` returns incomplete data from Module 3

**Behaviour:**
- `PortfolioSystem.tsx` adapter validates: if critical fields (service, proof assets, profile copy) are missing, block and show "Module 3 data is incomplete"
- Non-critical missing fields (URLs, extras) default to empty/null

---

## 11. LOCAL STORAGE FULL

**Condition:** `localStorage` is full and `persist` fails

**Behaviour:**
- Catch error in Zustand persist
- Show: "Could not save automatically — storage is full. Free up space or export your work."
- Export button remains functional (uses in-memory state)
- Reload warning: "Your progress is not saved."

---

## 12. CONCURRENT TABS

**Condition:** Same user opens Module 4 in two browser tabs

**Behaviour:**
- Zustand persist writes to `localStorage` — last tab to save wins
- No conflict detection (overwrite behaviour)
- Acceptable for V1 — multi-tab conflict is a known limitation

---

## 13. REGENERATE MID-PROGRESS

**Condition:** User is on Step 4, upstream changes, user clicks "Regenerate"

**Behaviour:**
- `regenerate()` called
- All [`portfolioDirection`, `platform`, `sections`, `projectPlacements`, `projectPresentations`, `portfolioCopy`, `buildChecklist`, `publishChecklist`, `buildPack`] cleared
- `currentStep` reset to `portfolio_direction`
- `completedSteps` cleared
- `editedFields` cleared
- Fresh fingerprint set
- Toast: "Portfolio regenerated with updated strategy."

---

## 14. STALE CONTEXT WHILE REVIEWING BUILD PACK

**Condition:** User on Step 6 (Build Pack), upstream changes detected

**Behaviour:**
- Warning banner: "Your strategy has changed since this pack was generated. Review to see what's different."
- "Review Changes" button: recalculates, shows diff summary (e.g., "Featured project changed from [old] to [new]")
- "Regenerate" button: clears and regenerates
- "Keep as-is" button: user acknowledges stale context, continues with current pack

---

## 15. TARGETED PROJECT REFRESH (NOT IN V1)

**Condition:** User wants to refresh one project without losing others

**V1 decision:** Not supported. Full regenerate only.

**V1 alternative:** User can manually edit individual presentation specs. `isCustom` flag preserves their edits through the generate-edit cycle for individual fields. Full regenerate only happens on upstream context change.

---

## 16. BUILD PACK EXPORT FAILURES

**Clipboard failure:**
- Fallback: `<textarea>` select + copy manual instruction
- Toast: "Copied to clipboard" / "Could not copy — select and copy manually"

**Download failure:**
- Blob URL revocation handled in `finally`
- Fallback: display full Markdown in a `<pre>` block with select-all support

---

## 17. MOBILE / TOUCH

- Drag-and-drop on Step 3 (project arrangement): touch-enabled via pointer events
- If drag fails: "Tap to assign" mode (click asset slot, click target position)
- Bottom CTA bar on mobile with safe-area padding
- All touch targets >= 44px

---

## 18. QA CHECKLIST

### Functional
- [ ] All 6 steps render correctly
- [ ] Step 1 direction options filtered by service
- [ ] Step 2 platform recommendation matches service
- [ ] Step 3 auto-assignment respects priority order
- [ ] Step 4 presentation spec matches service family
- [ ] Step 5 copy uses Module 3 content (not regenerated)
- [ ] Step 6 export builds correctly
- [ ] Back navigation preserves state
- [ ] Continue/Next properly advances steps

### Data
- [ ] Bridge from Module 3 works (both stores)
- [ ] All 15 service IDs produce different outputs
- [ ] All 5 markets per service produce different outputs
- [ ] Niche modifiers affect audience terminology
- [ ] Fingerprint detects upstream changes
- [ ] Regenerate clears all state
- [ ] `isCustom` flags persist correctly
- [ ] localStorage persist/restore works

### UI/UX
- [ ] 320px mobile — no horizontal scroll
- [ ] Sidebar shows correct step status
- [ ] Stale banner appears correctly
- [ ] Empty states render appropriately
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus management on step transitions
- [ ] Dark mode toggle persists
- [ ] AnimatePresence transitions smooth

### Build
- [ ] `npx tsc --noEmit` passes
- [ ] `npx vite build` passes
- [ ] No `import.meta.glob` (architecture guard)
- [ ] No `gray-matter` imports (architecture guard)
- [ ] No `const FALLBACK_*` arrays (architecture guard)
