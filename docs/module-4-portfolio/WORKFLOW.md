# MODULE 4 — WORKFLOW

**Status:** FROZEN  
**Total Steps:** 6  

---

## OVERVIEW

```
Step 1: Portfolio Direction
    ↓
Step 2: Platform + Structure
    ↓
Step 3: Project Arrangement
    ↓
Step 4: Project Presentations
    ↓
Step 5: Portfolio Copy + CTA Architecture
    ↓
Step 6: Portfolio Build Pack
    ↓
Module 5 (Client Pipeline System)
```

---

## STEP 1 — PORTFOLIO DIRECTION

**USER QUESTION:** What should my portfolio achieve?

**WHY IT EXISTS:** All downstream decisions (platform, project placement, copy tone) depend on the portfolio's primary purpose. Different services with different markets need different goals.

**INPUTS:**
- `mod1ServiceId` — determines available goal directions
- `mod1MarketId` — market context for goal relevance
- `mod1NicheId` — niche context
- `mod1Positioning` — existing positioning statement
- `phase3AuthorityProfile.professionalHeadline` — current headline for context
- `phase3PortfolioCopy.sections[]` (from Module 3) — pre-existing portfolio structure

**SYSTEM LOGIC:**
- Pre-populate direction suggestion from Module 3 portfolio copy's first section heading
- Present 3-5 goal options filtered by service family
- Goal options are NOT generic — they use the service label and market context
- User can accept, refine, or replace the direction statement

**USER ACTION:**
- Review direction
- Optionally edit the statement
- Confirm

**OUTPUT:**
```typescript
portfolioDirection: {
  goal: 'attract_clients' | 'build_authority' | 'showcase_skills' | 'generate_leads';
  statement: string;          // user-written or accepted
  targetAudience: string;     // derived from niche
  userConfirmed: boolean;
}
```

**NEXT STEP CONSUMPTION:** Step 2 uses `goal` to recommend platform; Step 5 uses `targetAudience` for copy tone.

**5-SECOND PURPOSE:** "I know what this portfolio needs to do."

---

## STEP 2 — PLATFORM + STRUCTURE

**USER QUESTION:** Where should my portfolio live and which sections should it include?

**WHY IT EXISTS:** A video editor, WordPress developer, and brand designer need different presentation platforms. Generic 7-section pages don't serve all services.

**INPUTS:**
- `serviceId` — determines platform recommendation
- `marketId` — buyer concern priority
- `nicheId` — audience-specific section needs
- `authorityPosition` — section ordering
- `portfolioDirection.goal` — goal affects section priority
- `phase3PortfolioCopy.sections[]` (from Module 3) — existing section structure

**SYSTEM LOGIC:**
- Recommendation engine (see PLATFORM STRATEGY) selects primary + secondary platform
- Section blueprint generated from:
  - Base sections (always present: Hero, CTA)
  - Service-specific sections (e.g., "Proof Gallery" for video, "Process" for dev, "Prototype" for design)
  - Authority position reordered sections
  - Market-specific trust sections (e.g., "Local SEO" for local_businesses, "Investor Trust" for startups)
- All 7 sections from Module 3's portfolioCopy are preserved and mapped to equivalent M4 sections

**USER ACTION:**
- Choose platform (accept system recommendation or override)
- Review section list
- Toggle sections on/off
- Drag-reorder sections

**OUTPUT:**
```typescript
platform: PlatformRecommendation;
sections: PortfolioSectionSpec[];  // ordered, each with included boolean
```

**NEXT STEP CONSUMPTION:** Step 3 places projects into section slots.

**5-SECOND PURPOSE:** "I know where to build and what sections it needs."

---

## STEP 3 — PROJECT ARRANGEMENT

**USER QUESTION:** Which of my proof assets goes where?

**WHY IT EXISTS:** Module 3 produces exactly 3 proof assets with priority order. Module 4 must decide how each one appears in the portfolio — which is featured, which is secondary, which is supporting evidence.

**INPUTS:**
- `phase3ProofAssets[]` (from Module 3) — 3 asset definitions
- `phase3ProofPriorities[]` (from Module 3, mapped through bridge) — gap priority order
- `authorityPosition` — affects evidence order within placements
- `marketId` — affects which asset type has strongest buyer impact
- `nicheId` — niche-specific evidence preferences

**SYSTEM LOGIC:**
- Priority #1 from Module 3 → Featured project (Hero / Selected Work)
- Priority #2 → Secondary project
- Priority #3 → Supporting proof (sidebar / inline / trust section)
- For each placement, determine the ideal evidence order based on authority position:
  - `builder`: Process → Result → Evidence
  - `auditor`: Problem → Evidence → Solution
  - `deconstructor`: Problem → Breakdown → Solution
  - `practitioner`: Case Study → Result → Process

**USER ACTION:**
- View auto-assignment with rationale (e.g., "This is your #1 gap, so it goes first")
- Reassign any asset to any position
- Confirm assignments

**OUTPUT:**
```typescript
projectPlacements: ProjectPlacement[];  // 3 items
```

**NEXT STEP CONSUMPTION:** Step 4 uses placement to generate per-project presentation specs.

**5-SECOND PURPOSE:** "I know which project leads and why."

---

## STEP 4 — PROJECT PRESENTATIONS

**USER QUESTION:** How should I present each project?

**WHY IT EXISTS:** Each service family has a different optimal way to present a proof project. A video clip needs a different presentation structure than a WordPress site or a UI prototype.

**INPUTS:**
- `projectPlacements[]` — which asset goes where
- `serviceId` — presentation format (clip comparison, live URL, Figma prototype)
- `phase3ProofAssets[]` — each asset's full data including per-asset portfolioCopy
- `phase3ProofAssetPortfolioCopy` — per-asset headline, description, proofStatement, CTA
- `nicheId` — niche-specific evidence examples
- `marketId` — buyer concern emphasis

**SYSTEM LOGIC:**
- For each of the 3 placements, generate a presentation specification:
  - Project title (from proof asset title + role suffix like " (Featured)")
  - Client context (from Module 3's credibility gap + niche)
  - Problem statement (from Module 3 asset's `credibilityGapProved`)
  - Evidence order (service-appropriate media sequence)
  - Description (from per-asset portfolioCopy)
  - CTA (from per-asset portfolioCopy)

**Service Family Presentation Structures:**

**Video Family:** Raw clip → Hook breakdown → Retention context → Edited clip → Result
**Development Family:** Live URL → Problem → Build process → Performance evidence → Result
**Design Family:** Problem → User flow → Screens → Prototype link → Design rationale

**USER ACTION:**
- View generated spec for each project
- Edit any field
- Confirm all 3 specs

**OUTPUT:**
```typescript
projectPresentations: ProjectPresentationSpec[];  // 3 items
```

**NEXT STEP CONSUMPTION:** Step 5 uses presentation specs for project-specific copy.

**5-SECOND PURPOSE:** "Each project has a clear structure a buyer can follow."

---

## STEP 5 — PORTFOLIO COPY + CTA ARCHITECTURE

**USER QUESTION:** What should the portfolio say and where should the CTAs go?

**WHY IT EXISTS:** Copy must be service-aware, market-correct, and niche-specific. CTAs vary dramatically between service families — a video editor's CTA differs from a developer's CTA.

**INPUTS:**
- `phase3ProfileCopy` — professionalHeadline, shortBio, credibilityBullets, ctaLine, proofReferenceLine
- `phase3PortfolioCopy` (from Module 3) — structured sections with headings, body, bullets
- `portfolioDirection.statement` — goal statement
- `sections[]` — approved sections
- `projectPresentations[]` — per-project descriptions and CTAs
- `serviceId` — CTA style (audit vs. call vs. sample)
- `marketId` — buyer language register
- `nicheId` — audience-specific terminology

**SYSTEM LOGIC:**
- Transform Module 3's portfolio copy sections into flat portfolio copy:
  - Hero headline + subheadline
  - Per-section copy (intro, body, proof placement text)
  - Per-project copy (from per-asset portfolioCopy, adapted to placement)
  - CTA architecture:
    - Hero CTA (primary action)
    - Inline CTA (after featured project)
    - Section CTA (at end of proof sections)
    - Footer CTA (final action)
- No invented statements — all copy derived from existing Module 3 content
- CTA authenticity enforced: CTAs match the service family's buyer conversation

**C-Family CTA Patterns:**

| Service Family | Hero CTA Pattern | Inline CTA Pattern |
|---|---|---|
| Video editors | View my work → | Book a free clip review |
| WordPress/frontend devs | See live projects → | Request a free site audit |
| Designers | Browse case studies → | Book a free UI review |
| Automation/no-code devs | Explore my builds → | Request a free workflow audit |

**USER ACTION:**
- Review generated copy
- Edit any line
- Confirm all copy

**OUTPUT:**
```typescript
portfolioCopy: PortfolioCopy;  // structured copy with per-section, per-project, CTA architecture
```

**NEXT STEP CONSUMPTION:** Step 6 assembles everything into the Build Pack.

**5-SECOND PURPOSE:** "The portfolio has clear, honest copy that speaks to my buyers."

---

## STEP 6 — PORTFOLIO BUILD PACK

**USER QUESTION:** What exactly do I build and in what order?

**WHY IT EXISTS:** The user needs an actionable deliverable, not theory. The Build Pack is the artifact they walk away with.

**INPUTS:** All prior step outputs + `phase3Checklist` from Module 3.

**SYSTEM LOGIC:**
1. Compile all prior outputs into a structured `PortfolioBuildPack`
2. Generate merged checklist:
   - Module 3 checklist items (inherited)
   - Module 4 build-specific items (platform setup, section builds, project pages)
   - Module 4 publish-specific items (domain, hosting, URL setup)
3. Generate next-action list from service-market-niche template
4. Generate Markdown export of the complete pack

**USER ACTION:**
- Review full pack
- Download Markdown
- Copy to clipboard
- Mark Step 6 complete

**OUTPUT:**
```typescript
buildPack: PortfolioBuildPack | null;
```

**MODULE 5 BRIDGE OUTPUT:**
- `portfolioReady: boolean`
- `portfolioUrl: string | null` (from platform recommendation)
- `featuredProofAsset: string` (title of featured project)
- `portfolioCta: string` (hero CTA)
- `portfolioHeadline: string` (copy headline)

**5-SECOND PURPOSE:** "I have everything I need to build and publish my portfolio."

---

## NAVIGATION

- **Module 3 → Module 4:** Navigate from Authority System's final step via "Continue to Portfolio System" button. `PortfolioSystem.tsx` adapter reads `getModule4Context()` and maps to internal state.
- **Module 4 → Module 5:** Navigate from Portfolio Build Pack step via "Continue to Client Pipeline" button. `ClientPipelineSystem.tsx` reads portfolio store directly.
- **Back navigation:** Allowed to any completed or current step. Progress preserved.
- **Step access:** Linear. Step N requires Step N-1 to be completed. Exception: revisiting is always allowed.
