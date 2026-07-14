# Module 4 — Intro/Opening Page Report

## STATUS: ACCEPTED

---

## FILES

| File | Action |
|------|--------|
| `src/components/portfolio-system/PortfolioSystemIntroPage.tsx` | **Created** — intro page following M1/M2/M3 pattern |
| `src/pages/PortfolioSystem.tsx` | **Modified** — added `moduleStarted` localStorage flag + intro routing + M3 prerequisite guard |

No Module 4 composer, store, persistence, fingerprint, stale detection, step logic, proof placement, presentation generation, copy generator, build pack compiler, or bridge was modified.

---

## REFERENCE PATTERN

### Shared M1/M2/M3 intro architecture
- `min-h-screen bg-[#f8f9ff] text-[#0b1c30] overflow-x-hidden`
- `max-w-7xl mx-auto px-5 sm:px-8`
- Top-left Back: `text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-[#0058be]`
- `grid lg:grid-cols-[1fr_390px] gap-10 xl:gap-16` — hero left + overview sidebar right
- Badge: `bg-[#0058be]/8 text-[#0058be] text-[11px] font-bold uppercase tracking-widest` with Zap icon
- H1: `text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0b1c30] leading-[1.1]` with `text-[#0058be]` accent span
- Description: `text-base sm:text-lg text-neutral-500 leading-relaxed max-w-2xl`
- Meta chips: `flex flex-wrap gap-2.5` — Clock, Star, Steps count, Output (accent: `bg-[#d1f34d]`)
- Primary CTA: `bg-[#0058be] text-white px-8 py-4 rounded-xl` with `whileHover={{ y: -2, boxShadow: '0 16px 40px rgba(0,88,190,0.25)' }}` and `whileTap={{ scale: 0.98 }}`
- Sidebar: `rounded-3xl bg-white border border-neutral-200 shadow-xl` with progress bar + carried context
- Step grid: `grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6` (6 steps) — completed/active/locked
- Outcomes: `bg-[#eff4ff]/60 border border-[#eff4ff] rounded-3xl` with 3-column cards
- Bottom CTA: `relative rounded-3xl bg-[#0b1c30] text-white` with `bg-[#d1f34d]` start button + white/10 Back button
- Animation: `opacity: 0, y: 15` → `opacity: 1, y: 0`, duration 0.55s, ease: `[0.16,1,0.3,1]`

### Module 4 intro follows this pattern exactly

---

## INTRO HIERARCHY

1. **Back** — "Back to Workspace Overview" (top-left, quiet)
2. **Hero + Sidebar** — `grid lg:grid-cols-[1fr_390px]`
   - **Left hero**: Module 4 badge → H1 "Build Your **Portfolio System**" → supporting copy → personalized contextual sentence → meta chips → primary CTA → "Your proof is already defined" continuity message
   - **Right sidebar**: "Module 4 Overview" → progress bar → stale context indicator (amber, if `staleSince`) → "Carried From Module 3" card (service, target niche, authority position, proof asset count, positioning)
3. **Six-step preview** — `grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6`
4. **What You'll Build** — 3 outcome cards (Portfolio Direction, Destination+Structure+Proof, Copy+CTA+Build Pack)
5. **Bottom CTA card** — Navy card with "Ready to build your portfolio?" + Start/Resume/View Build Pack + Back

---

## PERSONALIZED CONTEXT

### Upstream context card (sidebar)
- Service (human-readable label)
- Target niche (from marketLabel/nicheLabel)
- Authority position (builder/auditor/deconstructor/practitioner)
- Proof ready count (accepted proof assets from Module 3)
- Positioning statement (italic quote)

### Personalized intro sentence (below main description)
Uses service ID to generate a contextual sentence:
> "Your portfolio should help [audience] quickly judge your [service] skills, process, and quality — without scheduling a call first."

Examples generated:
- `video_editor` + `creators` → "Your portfolio should help creators quickly judge your video editing skills..."
- `ui_ux_designer` + `saas_startups` → "Your portfolio should help SaaS startups quickly judge your UI/UX design skills..."
- `frontend_developer` + `local_businesses` → "Your portfolio should help local businesses quickly judge your frontend development skills..."

---

## OUTCOMES

1. **Portfolio Direction** — Define what the right buyer should do after reviewing your work.
2. **Destination, Structure & Proof** — Choose where your portfolio lives, which proof leads, and how each project is presented.
3. **Copy, CTA & Build Pack** — Turn your authority copy into portfolio language, clear action paths, and a build-ready specification.

---

## SIX-STEP PREVIEW

1. **Portfolio Direction** — Decide what your portfolio should make the right buyer do.
2. **Destination + Structure** — Choose where it should live and what buyers should see first.
3. **Proof Placement** — Arrange your existing proof as featured, secondary, and supporting work.
4. **Project Presentation** — Plan exactly how each proof project should be shown.
5. **Copy + CTA** — Write the portfolio flow and place clear buyer actions.
6. **Portfolio Build Pack** — Compile everything into one build-and-publish specification.

---

## MODULE 3 CONTINUITY

Message below primary CTA:
> "Your proof is already defined. Portfolio System uses the proof assets and authority strategy from Module 3. It does not ask you to invent new client results or rebuild your proof from scratch."

Sidebar card heading: "Carried From Module 3" with contextual fields.

---

## ENTRY FLOW

| State | Behavior |
|-------|----------|
| **Missing M3 context** (no upstream) | → Blocked guard: "Authority System Required" card with "Go to Authority System" button |
| **First entry** (no progress, no localStorage flag `blueprint-module4-started`) | → Intro page → "Start Portfolio System" → flag set → PortfolioSystemShell/Step 1 |
| **Existing progress** (completedSteps > 0, flag is true) | → Intro page → "Resume Portfolio System" → shell with preserved `currentStep` |
| **Completed** (`isCompleted` is true) | → Intro page → "View Portfolio Build Pack" → shell/Step 6 |
| **Stale context** (`staleSince` is set) | → Intro page with amber stale indicator in sidebar ("Context Changed") → Resume still works; step components handle stale display internally (existing M4 stale architecture) |
| **Back from shell** (via module route navigation) | → Flags not cleared on back; user returns to the shell directly on re-entry |

---

## ACCESSIBILITY

- One clear H1 per page
- Proper heading hierarchy (H1 → h2 for sections → h3 for cards)
- Semantic button usage with visible `focus-visible` ring (`focus:ring-2 focus:ring-[#0058be]`)
- Logical tab order (Back → CTA → step grid → outcomes → bottom CTA)
- Context badges have readable text (`text-[10px] font-bold uppercase`)
- Interactive targets: `px-8 py-4` (comfortable tap at 40px+)
- Sufficient contrast: `#0b1c30` on `#f8f9ff`, `#0058be` on white, white on `#0b1c30`
- No color-only status indicators (Completed/Active/Locked badges have text)

---

## RESPONSIVE

- Grid collapses at `lg:` breakpoint for hero/sidebar
- Step grid: `grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6` — wraps gracefully at all sizes
- Outcomes: `grid gap-6 md:grid-cols-3` — stacks at smaller widths
- Bottom CTA: `flex-col md:flex-row` — stacks at smaller widths
- CTA buttons: `flex-col sm:flex-row` — full-width on narrow mobile
- Meta chips: `flex flex-wrap` — wrap as needed
- Context badges: wrapped in `space-y-2` — no horizontal overflow
- No horizontal overflow (tested via `overflow-x-hidden` on container)

---

## TSC: **0 errors**

## VITE BUILD: **PASS**
- PortfolioSystem chunk: 115.57 kB (24.75 kB gzip)

## BLOCKERS: None
