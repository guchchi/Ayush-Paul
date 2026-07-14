# Module 3 — Intro/Opening Page Report

## STATUS: ACCEPTED

---

## FILES

| File | Action |
|------|--------|
| `src/components/module3/Module3IntroPage.tsx` | **Created** — intro page following M1/M2 pattern |
| `src/pages/AuthoritySystem.tsx` | **Modified** — added `moduleStarted` localStorage flag + intro routing |

No Module 3 store, persistence, fingerprint, stale detection, step logic, proof composer, profile generator, authority pack compiler, or Module 4 bridge was modified.

---

## REFERENCE PATTERN

### Module 1 intro (`Module1IntroPage.tsx`)
- `min-h-screen bg-[#f8f9ff] text-[#0b1c30]`
- `max-w-7xl mx-auto px-5 sm:px-8`
- `grid lg:grid-cols-[1fr_390px]` hero + sidebar
- Badge: `bg-[#0058be]/8 text-[#0058be]` with Zap icon
- H1: `text-4xl sm:text-5xl lg:text-6xl` with `text-[#0058be]` accent span
- Meta chips: Clock, Star, Steps, Output (accent: `bg-[#d1f34d]`)
- CTA: `bg-[#0058be] text-white` with hover lift + shadow
- Sidebar: "Module X at a glance" with progress bar + output preview
- Step roadmap: `grid md:grid-cols-5` with completed/active/locked states
- Outcomes: `bg-[#eff4ff]/60` section with 3-column icon cards
- Bottom CTA: `bg-[#0b1c30] text-white` with `bg-[#d1f34d]` button
- Back: top-left `text-xs font-bold uppercase tracking-wider`
- Animation: `opacity:0, y:15` → `opacity:1, y:0`, ease: `[0.16,1,0.3,1]`

### Module 2 intro (`OfferEngineeringIntroPage.tsx`)
- Same container, navigation, badge, H1, chips, CTA, bottom section as M1
- Sidebar: "Module 2 Overview" with progress + "Carried From Module 1" context card
- Step roadmap: `grid sm:grid-cols-2 md:grid-cols-4` (8 steps)
- M2 reads from Zustand stores internally (no props for context)
- No video section (M1 has one, but M2 does not — the video is not required)

### Module 3 intro (`Module3IntroPage.tsx`)
- **Matches M1/M2 exactly** in container, colors, typography, badge, chips, CTA, sidebar, step grid, outcomes section, bottom CTA, back action, and animation
- Uses M2's approach: reads from Zustand stores internally
- 5-step preview in `grid sm:grid-cols-2 md:grid-cols-5` grid
- "Carried From Modules 1 & 2" context card in sidebar

---

## INTRO PAGE DETAILS

### Hierarchy
1. Back navigation
2. `grid lg:grid-cols-[1fr_390px]` — hero left + overview sidebar right
3. Hero: Module 3 badge → H1 "Build Your **Authority System**" → supporting copy → meta chips → primary CTA → honest proof message
4. Sidebar: "Module 3 Overview" → progress bar → "Carried From Modules 1 & 2" context card
5. 5-step roadmap in grid
6. "What You'll Build" outcomes section
7. Bottom CTA card "Ready to build your authority?"

### Outcome Content
- **Authority Position** — Choose how you will honestly earn trust with a clear credibility stance.
- **Proof Strategy + Assets** — Identify the three credibility gaps buyers need answered and build honest demonstration projects.
- **Profile, Portfolio & Authority Pack** — Turn your proof into buyer-facing copy, portfolio structure, and one execution-ready pack.

### Five-Step Preview
1. Authority Position — Choose the credibility stance that honestly matches your experience level.
2. Proof Strategy — Identify the three credibility gaps buyers need answered before they trust you.
3. Proof Asset Builder — Build three execution-ready demonstration projects that fill each gap.
4. Profile & Portfolio Authority — Turn your proof into buyer-facing copy and a structured portfolio.
5. Authority Pack — Compile everything into one system — ready for Module 4.

### Honesty Message
Two placements:
- Below primary CTA: "Build proof without pretending you already have clients. Use demonstration projects, audits, teardowns, and process evidence — never fake testimonials or results."
- Same pattern as M1/M2 helper note chips

### Upstream Context
Sidebar "Carried From Modules 1 & 2" card shows:
- **Service**: human-readable label from `useOpportunityMapStore`
- **Target Niche**: nicheLabel or marketLabel
- **Positioning**: italic quote

---

## ENTRY FLOW

| State | Behavior |
|-------|----------|
| **First entry** (no progress, no localStorage flag) | → Intro page → "Start Authority System" → localStorage flag set → enters Module3Shell/Step 1 |
| **Existing progress** (steps completed, flag is true) | → Intro page → "Resume Authority System" → enters Module3Shell with preserved `currentStep` |
| **Completed** (`isCompleted` is true) | → Intro page → "View Authority Pack" → enters Module3Shell/Step 5 |
| **Stale upstream** (`isStale` is true) | → Stale blocking screen (unchanged, before intro check) → "Reset and Rebuild" clears data → if flag is still true, enters shell directly at Step 1 |
| **Back from shell** (`onBack` pressed) | → Sets localStorage flag to `false` → back to intro page |

---

## RESPONSIVE

Same responsive classes as M1/M2:
- `max-w-7xl mx-auto px-5 sm:px-8`
- Grid collapses at `lg:` breakpoint
- Step grid: `grid gap-4 sm:grid-cols-2 md:grid-cols-5`
- Outcomes: `grid gap-6 md:grid-cols-3`
- Bottom CTA: `flex-col md:flex-row`
- CTA buttons go full-width on mobile with `flex-col sm:flex-row`
- Touch targets: buttons are `px-6 py-4` (comfortable tap area)

---

## TSC: **0 errors**

## VITE BUILD: **PASS**
- AuthoritySystem chunk: 172.60 kB (41.10 kB gzip) — +1 module (intro component added)

## BLOCKERS: None
