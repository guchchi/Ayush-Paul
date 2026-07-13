# MODULE 4 — BUILD PLAN

**Status:** FROZEN  
**Total estimate:** 11.5 days  

---

## PHASE 0: FOUNDATION (2 days)

**Goal:** Set up the new types, store, and file structure. Remove deprecated code.

**Deliverables:**
- `src/types/portfolio-system.ts` rewritten with new TypeScript interfaces
- `src/lib/portfolio-system/store.ts` rewritten with new state shape and methods
- `src/lib/portfolio-system/index.ts` updated exports
- `src/components/portfolio-system/StepContent.tsx` updated to 6-step router
- Deprecated step components flagged for removal:
  - `PortfolioGoalStep.tsx` → replaced by `DirectionStep.tsx`
  - `AssetSelectionStep.tsx` → removed (functionality in Step 3)
  - `CaseStudyBuilderStep.tsx` → removed (M3 duplication)
  - `SampleProjectBuilderStep.tsx` → removed (M3 duplication)
  - `ProofPageStructureStep.tsx` → replaced by Step 2
  - `PortfolioCopyGeneratorStep.tsx` → rewritten as Step 5
  - `PortfolioChecklistStep.tsx` → removed (merged into Step 6)
  - `PortfolioReportStep.tsx` → rewritten as Step 6

**Acceptance gate:**
- `npx tsc --noEmit` passes with NEW types (deprecated files may fail — acceptable during migration)
- `npx vite build` passes after removing deprecated imports

---

## PHASE 1: COMPOSER ENGINE (3 days)

**Goal:** Build the 7-layer personalisation composer. All content generation logic.

**Deliverables:**
- `src/lib/portfolio-system/composer.ts` — new file with:
  - `recommendPlatform(serviceId): PlatformRecommendation`
  - `generateSectionBlueprint(authorityPosition, serviceId, marketId, nicheId, m3Sections): PortfolioSectionSpec[]`
  - `suggestPlacements(proofAssets, proofPriorities, authorityPosition): ProjectPlacement[]`
  - `generatePresentationSpec(asset, role, serviceId, marketId, nicheId, authorityPosition): ProjectPresentationSpec`
  - `generateCopy(m3ProfileCopy, m3PortfolioCopy, direction, sections, presentations, serviceId, marketId, nicheId): PortfolioCopy`
  - `generateCTAArchitecture(serviceId, marketId): { heroCta, inlineCta, sectionCta, footerCta }`
  - `compileBuildPack(allOutputs): PortfolioBuildPack`
  - `buildBuildChecklist(m3Checklist, serviceId): [buildItems, publishItems]`
  - `computeFingerprint(state): string`
- `src/lib/portfolio-system/fingerprint.ts` — fingerprint calculation + comparison

**Content additions to `contentQuality.ts`:**
- `NICHE_PLATFORM` overrides (per-niche platform preference tweaks)
- `SERVICE_PRESENTATION` maps (per-service presentation structure)
- `MARKET_CTA` maps (per-market CTA language)
- `SERVICE_CHECKLIST_ITEMS` (per-service checklist defaults)
- `NICHE_CTA_OVERRIDES` (per-niche CTA adjustments)

**Acceptance gate:**
- All 10 test paths (see below) produce materially different outputs
- Service-level differentiation confirmed
- Niche modifiers confirmed working

---

## PHASE 2: PATH VALIDATION (1 day)

**Goal:** Validate all 15 services × 5 markets produce distinct outputs.

**Test script:** `npx tsx scripts/module4-path-validator.ts`

**Test matrix (minimum 10 paths):**

| # | Service | Market | Expected Variation |
|---|---|---|---|
| 1 | `short_form_editor` | `coaches` + `fitness_coaches` | Fitness coach language, transformation focus |
| 2 | `short_form_editor` | `coaches` + `business_coaches` | Business authority language |
| 3 | `video_editor` | `youtube_creators` + `gaming` | Gaming clip language |
| 4 | `video_editor` | `youtube_creators` + `educational` | Educational clip language |
| 5 | `ui_ux_designer` | `coaches` + `fitness_coaches` | Coach-focused UI language |
| 6 | `brand_designer` | `creators` | Creator brand language |
| 7 | `frontend_developer` | `local_businesses` + `gyms` | Gym website language |
| 8 | `frontend_developer` | `local_businesses` + `clinics` | Clinic website language |
| 9 | `no_code_developer` | `startups` | Startup MVP language |
| 10 | `automation_developer` | `agencies` | Agency automation language |

**Acceptance gate:**
- All 10 paths produce distinct outputs (section order, copy text, CTA, evidence order all vary)
- Cross-path duplication < 70% for any unrelated pair
- Cross-path duplication < 50% for any same-service pair with different niches
- Cross-path duplication < 30% for any cross-family pair

---

## PHASE 3: STEPS + UI (3 days)

**Goal:** Build all 6 step components.

**Deliverables:**

**Step 1 — `DirectionStep.tsx`:**
- Direction cards (3-5 options filtered by service)
- Text editor for statement
- Preview of service+market context

**Step 2 — `PlatformStructureStep.tsx`:**
- Platform cards (system recommendation highlighted)
- Section list with toggles, drag reorder
- Preview panel showing section order

**Step 3 — `ProjectArrangementStep.tsx`:**
- 3 asset cards from Module 3
- 3 placement slots (Featured / Secondary / Supporting)
- Auto-assignment with rationale tooltip
- Manual reassignment via drag or click
- Preview showing ordered project grid

**Step 4 — `ProjectPresentationStep.tsx`:**
- Project selector (3 tabs or accordions)
- Per-project editor:
  - Title, client context, problem statement
  - Evidence order editor (drag evidence types)
  - CTA field
- Preview panel showing rendered project card

**Step 5 — `CopyCTAArchitectureStep.tsx`:**
- Headline + short intro (editable)
- Per-section copy (accordion per section)
- Per-project copy (accordion per project)
- CTA architecture block (4 CTA slots, editable)
- Preview panel showing portfolio mockup

**Step 6 — `BuildPackStep.tsx`:**
- Full pack preview (collapsed by default, expandable sections)
- Build checklist (interactive: toggle status)
- Publish checklist (interactive)
- Next actions list
- "Download as Markdown" button
- "Copy to clipboard" button
- "Continue to Client Pipeline" button

**Shell updates:**
- `PortfolioSystemShell.tsx`: 6-step sidebar, stale banner, regenerate flow

**Acceptance gate:**
- All 6 steps render with real data
- Navigation works in both directions
- Generate buttons produce correct templates
- Preview panels update on changes
- Mobile layout at 320px

---

## PHASE 4: FINAL PACK (1 day)

**Goal:** Build Pack generation, Markdown export, download, copy.

**Deliverables:**
- `compileBuildPack()` assembles all outputs
- Markdown template rendering
- File download (Blob → `.md`)
- Clipboard copy with fallback
- "Continue to Client Pipeline" button bridge

**Acceptance gate:**
- Download produces valid `.md` file
- Clipboard copy works in Chrome/Firefox/Safari/Edge
- Copy fallback works in restricted contexts
- Build Pack JSON round-trips through persist/restore

---

## PHASE 5: MODULE 5 BRIDGE (0.5 days)

**Goal:** Simplify the Module 4 → 5 bridge to only pass what Module 5 actually consumes.

**Current bridge:** 34 fields passed, only 5 consumed.

**New bridge:**
- `portfolioReady: boolean`
- `portfolioUrl: string | null`
- `featuredProofAsset: string`
- `portfolioCta: string`
- `portfolioHeadline: string`
- Plus: `service`, `niche`, `serviceLabel`, `positioning`, `offerName` (unchanged, actively used)

**Deliverables:**
- Update `ClientPipelineSystem.tsx` bridge logic
- Remove unused `phase4*` fields that are never read by M5 components
- Update `setPhase4Context` type if needed

**Acceptance gate:**
- Module 5 still works with all 8 steps
- No unused fields in bridge
- Module 5 sidebar still shows correct context

---

## PHASE 6: EDGE CASES (0.5 days)

**Goal:** Empty states, single proof asset, stale context detection.

**Deliverables:**
- Empty state: no Module 3 → "Complete Authority System first"
- Empty state: 0 proof assets → "You need at least one proof asset"
- Single/dual proof asset handling in Step 3
- Stale context detection on mount and on return
- Stale banner with Regenerate / Keep my work
- Regenerate clears state, preserves nothing
- Platform override handling
- Back-navigation warnings

**Acceptance gate:**
- All empty states render
- Single proof asset doesn't crash
- Stale banner appears correctly when fingerprint changes
- Regenerate clears and resets

---

## PHASE 7: BROWSER SMOKE TEST (0.5 days)

**Goal:** Verify build, mobile, a11y.

**Commands:**
```
npx tsc --noEmit
npx vite build
```

**Manual checks:**
- All 6 steps on Chrome, Firefox, Safari, Edge
- 320px mobile — no horizontal scroll
- Keyboard navigation — all interactive elements reachable
- Focus-visible rings on all elements
- Screen reader labels on icon-only elements

**Acceptance gate:**
- Both build commands pass
- No console errors in any browser
- All a11y checks pass

---

## PHASE 8: AUDITOR (1 day)

**Goal:** Run the same audit as Module 3, fix issues, final approval.

**Audit checklist:**
1. Step purpose clarity — does each step communicate its purpose within 5 seconds?
2. One question per step — no step asks two questions
3. Empty states — all have a clear call to action
4. Error states — all have recovery paths
5. Mobile — all steps work at 320px
6. Keyboard — all steps navigable by keyboard
7. Color-only states — none exist (all use icon + text)
8. Long real content — no layout breaks
9. Regenerate behaviour — banner shows, works correctly
10. Build Pack — Markdown output is complete

**Acceptance gate:**
- All audit items pass
- Auditor score >= 85/100

---

## TOTAL ESTIMATE

| Phase | Days |
|---|---|
| 0. Foundation | 2 |
| 1. Composer Engine | 3 |
| 2. Path Validation | 1 |
| 3. Steps + UI | 3 |
| 4. Final Pack | 1 |
| 5. M5 Bridge | 0.5 |
| 6. Edge Cases | 0.5 |
| 7. Smoke Test | 0.5 |
| 8. Auditor | 1 |
| **Total** | **11.5** |

No repeated PLAN audit between phases. Each phase gates to the next with explicit acceptance criteria.
