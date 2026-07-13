# Module 3 — Authority System: UI/UX Product Quality Audit

---

## 1. Module 1 Visual System

**Page:** `AcquisitionWorkspace.tsx` → `Module1Layout.tsx`

### Shell
- `flex flex-col lg:flex-row min-h-screen bg-[#f8f9ff] text-[#0b1c30]`
- Sidebar: `shrink-0 w-[280px] xl:w-[320px] bg-white border-r border-neutral-200`
- Content: `max-w-3xl mx-auto px-5 sm:px-8 py-6 sm:py-10 lg:py-16`

### Sidebar
- `h-1.5` progress bar in `bg-neutral-100` with `bg-[#0058be]` fill
- Step indicator: `CheckCircle2` for completed, `Circle` with fill for current, plain `border-2 border-neutral-200` for upcoming
- Step label hierarchy: `text-[10px] font-bold text-neutral-400 uppercase tracking-widest` (step number) + `text-sm font-semibold` (step name)
- Active step: `bg-[#f8f9ff] text-[#0058be]`
- `Back to Overview` link at top of sidebar
- Title: `text-xl font-bold text-[#0b1c30]`

### Step header (inline, not in shell)
- `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest mb-3` — step badge
- `h2 text-3xl font-bold text-[#0b1c30] mb-2` — step title
- `p text-neutral-500 text-base leading-relaxed` — step description

### Selection cards (Track/Market/Niche)
- `rounded-2xl bg-white border shadow-sm hover:shadow-md`
- Selected: `border-[#0058be] shadow-[0_8px_32px_rgba(0,88,190,0.14)] ring-1 ring-[#0058be]`
- `whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}` + `whileTap={{ scale: 0.97 }}`
- Check indicator: `w-6 h-6 rounded-full bg-[#0058be] flex items-center justify-center shadow-md` with `Check` icon inside
- Unselected indicator: `w-6 h-6 rounded-full border-2 border-neutral-200`
- Icon container: `w-12 h-12 rounded-xl bg-[#f8f9ff]` (selected: `bg-[#0058be] text-white`)
- Info panels: `p-4 rounded-2xl bg-[#eff4ff] border border-[#eff4ff]/60`

### Form controls
- Input: `w-full h-10 px-4 rounded-xl outline-none text-xs text-[#0b1c30] placeholder:text-neutral-400 bg-white border border-neutral-200 focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]`
- Textarea: same as input but with `py-3 resize-none leading-relaxed`, `bg-[#f8f9ff]` in statement editing

### Buttons
- Primary: `bg-[#0058be] text-white border-transparent hover:bg-[#0047a0] shadow-sm`
- Secondary: `border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700`
- Save/Continue inline: `bg-[#0b1c30] text-white hover:bg-[#152a45] shadow-lg`
- Disabled: `bg-white border-neutral-200 text-neutral-400 cursor-not-allowed`
- Focus ring: `focus:ring-2 focus:ring-[#0058be] focus:ring-offset-2`

### Feedback/Status
- Step completion badge: `inline-flex px-2.5 py-1 rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase`
- Saved badge: `flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d1f34d] text-[#0b1c30]`
- Error: `p-4 rounded-xl bg-red-50 border border-red-200`
- Warning: `rounded-lg border border-amber-200 bg-amber-50 p-4`

### Responsive
- Mobile: `fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-neutral-200 px-4 py-3`
- Desktop CTA: `mt-10 flex justify-end gap-3`
- Bottom spacer: `h-24 lg:hidden`
- Sidebar: `w-[280px] xl:w-[320px] fixed inset-y-0 left-0 z-30`

---

## 2. Module 2 Visual System

**Page:** `OfferEngineering.tsx` → `OfferEngineeringShell.tsx`

### Shell
- `flex h-dvh bg-[#f8f9ff] text-[#0b1c30] overflow-hidden font-sans`
- Sidebar: `shrink-0 border-r border-neutral-200 bg-white` width `280px`
- Content: `max-w-[720px] px-5 sm:px-8 py-8 md:py-12`
- Right panel: `shrink-0 h-full overflow-hidden` width `320px`

### Sidebar
- Module title: `h2 text-lg font-bold text-[#0b1c30]` with subtitle `p text-[9px] font-bold text-neutral-400 uppercase tracking-[0.12em]`
- Back button in sidebar: `flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400 hover:text-neutral-700`
- Progress: `h-1.5 bg-neutral-100` bar, `text-right` percentage
- Step dot: `CheckCircle2 size={16}` (completed), `Circle size={16} fill-[#0058be]/10` (active), `w-4 h-4 border-2 border-neutral-200` (upcoming)
- Step entry: `text-[9px] font-bold text-neutral-400 uppercase tracking-widest` (step number) + `text-xs font-semibold` (step name)
- Active card: `bg-[#f8f9ff] text-[#0058be]`
- Hover card: `hover:bg-neutral-50 text-neutral-600`

### Header (sticky, in shell)
- `h-12 border-b border-neutral-200 bg-white/85 backdrop-blur-md px-4`
- Step title: `text-xs font-semibold text-[#0b1c30] truncate select-none`
- Step counter: `text-[9px] font-bold tracking-wider text-neutral-400 uppercase`
- Chevron buttons: `p-1 rounded hover:bg-neutral-100 text-neutral-500`

### Step header (inline in each step component)
- Step badge: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest`
- Title: `h2 text-3xl font-bold text-[#0b1c30] mb-2`
- Description: `p text-neutral-500 text-sm leading-relaxed` (some use `text-sm` instead of `text-base`)

### Cards/Content
- Config card: `rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm`
- Info panel: `flex items-start gap-4 p-5 rounded-2xl border border-[#eff4ff] bg-[#eff4ff]/60`
- Form input: `w-full h-10 px-4 rounded-xl outline-none text-xs text-[#0b1c30] placeholder:text-neutral-400 bg-white border border-neutral-200 focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]`
- Textarea: same but with `py-3 resize-none leading-relaxed`

### Offer Blueprint outputs
- DashboardSection: `rounded-2xl border p-4 bg-white border-neutral-200 shadow-sm`
- Accent section: `rounded-2xl border p-4 bg-[#eff4ff]/60 border-[#eff4ff]`
- StatCard: `px-6 py-4` with divider
- Badge: `inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#eff4ff] border border-[#eff4ff] text-[10px] font-bold text-[#0058be]`

### Navigation
- Back button: `inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 shadow-sm text-xs font-bold uppercase tracking-wider`
- Primary action: same as M1 primary
- Success feedback: `flex items-center gap-2 px-4 py-3 rounded-xl bg-[#0b1c30] border border-white/10 text-xs text-white shadow-2xl` (toast)

---

## 3. Shared M1/M2 Visual Language (The System)

| Token | M1 | M2 |
|-------|----|----|
| Page bg | `bg-[#f8f9ff]` | `bg-[#f8f9ff]` |
| Text primary | `text-[#0b1c30]` | `text-[#0b1c30]` |
| Primary blue | `#0058be` | `#0058be` |
| Accent green | `#d1f34d` | `#d1f34d` (toast check only) |
| Card bg | `bg-white` | `bg-white` |
| Card border | `border-neutral-200` | `border-neutral-200` |
| Info bg | `bg-[#eff4ff]/60` | `bg-[#eff4ff]/60` |
| Input bg | `bg-white` | `bg-white` |
| Input focus | `focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]` | same |
| Sidebar width | `280px` (320px xl) | `280px` |
| Progress bar | `h-1.5 bg-neutral-100` | `h-1.5 bg-neutral-100` |
| Primary btn | `bg-[#0058be] text-white` | same |
| Secondary btn | `border border-neutral-200 bg-white text-neutral-500` | same |
| Hover | `hover:bg-neutral-50` | same |
| Step badge | `rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest` | same |
| Heading size | `h2 text-3xl font-bold` for step titles | `h2 text-3xl font-bold` |
| Body text | `text-neutral-500 text-base` | `text-neutral-500 text-sm` |
| Radius | `rounded-2xl` cards, `rounded-xl` inputs, `rounded-full` badges | same |
| Focus ring | `focus:ring-2 focus:ring-[#0058be]` | same |

**Shared design patterns:**
1. Step badges (rounded pill, `#0058be`/8 bg, 10px bold uppercase)
2. 3xl bold step title + descriptive text below
3. White cards with `border-neutral-200`, hover → `border-neutral-300`
4. Selected cards: `border-[#0058be] ring-1 ring-[#0058be]`
5. Shadow progression: `shadow-sm` (default) → `shadow-md` (hover) → `shadow-lg` (selected)
6. Motion: `initial={{ opacity: 0, y: 12 }}` on page transitions, `whileHover` on cards
7. h-12 fixed header with backdrop blur
8. h-1.5 progress bar with blue fill
9. Input: h-10, rounded-xl, bg-white, placeholder neutral-400
10. Form labels: `text-[10px] font-bold uppercase tracking-wider text-neutral-400`
11. Focus always visible with `focus:ring-2 focus:ring-[#0058be]`
12. Disabled state: `bg-neutral-50 border-neutral-200 text-neutral-400 cursor-not-allowed`

---

## 4. Exact Module 3 Deviations

### 4A — Critical structural deviations

| # | Element | M3 Current | M1/M2 Reference | Deviation |
|---|---------|-----------|-----------------|-----------|
| D01 | Step title heading | `h1 text-lg font-bold` | `h2 text-3xl font-bold` | **Massively undersized** — 3xl vs lg is ~3× the visual weight. Destroyed heading hierarchy. |
| D02 | Step description text | `p text-sm text-neutral-500 mt-1` | `p text-neutral-500 text-sm` (or `text-base`) | Minor (same `text-sm`) but `mt-1` vs `mb-2` affects spacing |
| D03 | Step badge | **Missing** | `inline-flex px-2.5 py-1 rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest` | **Absent** — no step badge at top of M3 step content |
| D04 | Card hover animation | None (static buttons) | `whileHover={{ y: -3 }}` + `whileTap={{ scale: 0.97 }}` | No motion feedback on selection cards |
| D05 | Card selected state | `bg-[#0058be]/5` | `bg-white border-[#0058be] shadow-[0_8px_32px_rgba(0,88,190,0.14)] ring-1 ring-[#0058be]` | M3 uses a tinted background (`/5`); M1/M2 keep **white** bg with stronger border/shadow. The pale tint makes selection feel muddy. |
| D06 | Input background | `bg-[#f8f9ff]` | `bg-white` | **Wrong** — M1/M2 inputs are `bg-white`. M3 uses a tinted bg that makes inputs look disabled. |
| D07 | Sidebar back button | **Missing** | `Back to Overview` link in sidebar | No way to exit the module without browser navigation |
| D08 | Sidebar title verb | `h2 text-lg font-bold mb-3` for "Authority System" | `h2 text-lg font-bold text-[#0b1c30]` for "Offer Engineering" | M3 now matches in size but missing `mb-3` — needs audit |
| D09 | Sidebar progress | `h-1.5 bg-neutral-100` (now matches) | same | Matches after refactor ✓ |
| D10 | Sidebar step cards | `bg-[#f8f9ff]` active (now matches) | same | Matches after refactor ✓ |
| D11 | Step 1 card icon/radio | `w-5 h-5 rounded-full` radio selector | `w-12 h-12 rounded-xl` icon container + right-side `w-6 h-6` check | **Different selection pattern** — M1/M2 use large icon boxes with standalone check indicators; M3 uses a small radio-like dot |
| D12 | Form field labels | `text-[8px]` / `text-[10px]` | `text-[10px] font-bold uppercase tracking-wider text-neutral-400` | M3 Step4 uses `text-[8px]` for labels — too small |
| D13 | PhaseContext placement | Inside sidebar (bottom) | M2 has `OfferBriefPanel` (right column, 320px) | Different but acceptable if sidebar is M3's chosen architecture |

### 4B — AuthoritySystem.tsx stale-context screen (line 150–174)

**CRITICAL LEFTOVER:**
```tsx
className="min-h-screen bg-black text-white flex items-center justify-center px-5"
```
and:
```tsx
bg-brand-primary text-white
```
This screen still uses the **old dark theme** with `brand-primary` instead of `#0058be`. Both M1 and M2 guard screens use `bg-[#f8f9ff] text-[#0b1c30]` and `bg-[#0058be]`.

### 4C — Selection card architecture (Step1)

M1/M2 selection cards follow this structure:
```
card (rounded-2xl bg-white border shadow-sm hover:shadow-md)
├── [optional] recommended badge (absolute top-right)
├── flex items-start gap-4
│   ├── icon box (w-12 h-12 rounded-xl bg-[#f8f9ff])
│   └── content (flex-1)
│       ├── title (font-bold text-xl)
│       └── description (text-sm text-neutral-500)
├── [selected] expanded info panel
└── check indicator (w-6 h-6 rounded-full bg-[#0058be])
```

M3 Step1 cards:
```
card (rounded-2xl border)
├── [optional] recommended badge (absolute top-right)
├── flex items-center gap-3
│   ├── radio circle (w-5 h-5 rounded-full)
│   └── title (text-sm font-bold)
├── description (text-[11px] text-neutral-500)
└── trust info block
```

**Problems:**
- No icon box (12×12 for branding)
- Radio circle is too small vs large check indicator
- Title is `text-sm` instead of `text-xl` or min `text-base` — underwhelming
- Card interior spacing is `gap-3` vs M1's `gap-4` and more generous padding
- No hover elevation effect
- Selected state uses tinted bg (weak) instead of white bg with strong shadow+ring (strong)

### 4D — Form input mismatch

M3 consistently uses `bg-[#f8f9ff]` for input/textarea backgrounds. M1/M2 use `bg-white`. This makes M3 inputs look like they are in a disabled or non-interactive state. The M3 `placeholder:text-neutral-400` matches M2, but the tinted background undermines the perceived editability.

### 4E — Dialog/overlay styling

M3 dialogs use `bg-white` with `border-neutral-200` (now match after refactor ✓), but M1/M2 don't have modals — the closest reference is the `rounded-2xl border border-[#eff4ff] bg-[#eff4ff]/60` info panel pattern or the toast `bg-[#0b1c30]`. However, since dialogs are unique to M3, deviation is acceptable as long as they maintain the same token set.

### 4F — Typography scale

M3 step titles use `h1 text-lg font-bold` where M1/M2 use `h2 text-3xl font-bold`. This is the single most impactful visual discrepancy. `text-lg` (18px) vs `text-3xl` (30px) creates a radically different perceived page hierarchy. The step title is supposed to anchor the page, not blend in.

---

## 5. Screenshot Issue Verification (from report)

| Issue | Status | Detail |
|-------|--------|--------|
| Oversized empty sidebar area | PARTIAL | `PhaseContext` widget is now in sidebar but it's at the bottom, creating dead space above it when steps are short |
| Sidebar context card stranded | LIKELY RESOLVED | Moved into sidebar but needs visual verification |
| Duplicate progress info | RESOLVED | Only in sidebar now, header has mini progress bar (matches M2) |
| Weak page hierarchy | UNRESOLVED | `text-lg` step titles vs M1/M2's `text-3xl` — critical |
| Excessive tiny uppercase labels | UNRESOLVED | M3 has more `text-[8px]` labels than M1/M2 (labels at 8px vs 9-10px in M1/M2) |
| Low-contrast secondary text | LIKELY RESOLVED | After refactor to `text-neutral-500`, matches M1/M2 |
| Unusual blue focus artifact | CHECK | The `focus:ring` on sidebar items matches M2 — but need to verify no stray ring is appearing on step 1 card |
| Recommended badge collision | PARTIAL | M3 badge uses `-top-2.5 right-3` — M2's OfferTypeStep uses `top-3 right-3`. Still risk of collision |
| Selected card state too pale | UNRESOLVED | `bg-[#0058be]/5` tint vs M1/M2's `bg-white` with strong border+shadow |
| Cards have equal visual weight | UNRESOLVED | No icon box, small radio, flat layout — all cards feel the same |
| Core trust promise textarea clipped | CHECK | `rows={3}` with auto-sizing not present — may clip long content |
| Long copy hard to scan | UNRESOLVED | No `line-clamp` or expansion toggle pattern (M2's `ClampedText`) |
| Rationale occupies excessive space | DESIGN CHOICE | Accepted as product requirement |
| Back/Next feel disconnected | UNRESOLVED | No visual container grouping the nav with the content area |
| Narrow content canvas | RESOLVED | Now `max-w-[720px]` matching M2 |
| Generic admin dashboard feel | PARTIALLY RESOLVED | Colors match now, but missing card animations, proper heading scale, and icon boxes |
| Colors-only pass | CONFIRMED | The refactor was largely token replacements without extracting the deeper interaction patterns |

---

## 6. Per-Step UI/UX Failures

### Step1 — AuthorityPosition
1. **Heading at `text-lg` instead of `text-3xl`** — destroys visual hierarchy. The page reads like a subsection, not a primary step.
2. **No step badge** — M1/M2 always show `Step X of Y` as a rounded pill.
3. **Card selection uses radio pattern** — M1/M2 use large icon boxes + right-side check. M3's 5x5 radio circle feels like a settings form, not a premium selection.
4. **No hover elevation** — voiding `whileHover`/`whileTap` removes tactile feedback.
5. **Selected state tinted** — `bg-[#0058be]/5` makes the card look faded. M1/M2 keep `bg-white` and distinguish via bold border + shadow.
6. **Secondary text at 11px** — M1/M2 use `text-sm` for card descriptions. M3's `text-[11px]` is smaller and denser.
7. **Promise textarea uses `bg-[#f8f9ff]`** — should be `bg-white` to match M1/M2 input pattern.

### Step2 — ProofStrategy
1. **Same heading `text-lg` problem**.
2. **No step badge**.
3. **Priority cards lack icon/visual differentiation** — M1/M2 selection cards use icons for each option. M3 priorities only have a number circle.
4. **Inline editing textarea same `bg-[#f8f9ff]` problem**.
5. **Swap dropdown uses `bg-white`** — matches M2 dropdown pattern. OK.
6. **Priority description textarea uses transparent bg** — should be white when focused (M1/M2 pattern).

### Step3 — ProofAssetBuilder
1. **Same heading `text-lg` problem.**
2. **Tab buttons use `bg-[#0058be]/5` for active** — M1/M2 tabs use stronger border+shadow. Tint makes it feel weak.
3. **Left-side editing area has excessive fields** — 12+ field groups with minimal spacing. High cognitive load.
4. **Field inputs use `bg-[#f8f9ff]`** — should be `bg-white`.
5. **Array field inputs use transparent bg with bottom border** — M1/M2 don't have this pattern. The transparent hover/focus model is less discoverable.
6. **Right-side portfolio preview card is well done** — matches M2 OfferBlueprint dashboard card. Good.
7. **"Accept Brief" button uses `bg-white`** — matches M2 secondary. OK.

### Step4 — ProfilePortfolio
1. **Same heading `text-lg` problem.**
2. **Form labels at `text-[8px]`** — M1/M2 use `text-[10px]` for form labels. 8px is too small for readability.
3. **Textarea backgrounds at `bg-[#f8f9ff]`**.
4. **Two-column layout on mobile** — uses `lg:grid-cols-2` which stacks at mobile, but the columns are wide (profile + portfolio) and may overflow at 320px.
5. **SectionEditor card pattern matches M1/M2** — OK.

### Step5 — AuthorityPack
1. **Same heading `text-lg` problem.**
2. **Details toggle for assets** — M2 uses similar `details`/`summary` pattern. OK.
3. **Checklist items are small targets** — `px-3 py-2` at 11px text — below M1/M2 minimum touch target.
4. **Copy/Export buttons match M2 pattern** — OK.
5. **"Complete Module 3" button uses `bg-[#0058be]`** — matches M2 primary. OK.

---

## 7. Accessibility Failures

| ID | Issue | WCAG | Location |
|----|-------|------|----------|
| A01 | `h1` instead of `h2` for step titles, but more critically, no `aria-labelledby` on step sections | 1.3.1 | All Step components |
| A02 | `text-[8px]` labels fail contrast at small sizes (<12px) regardless of color — they render as ~6.5px after Tailwind conversion | 1.4.3 | Step4 labels, PhaseContext labels |
| A03 | No `aria-current="step"` on sidebar step buttons | 2.4.8 | Module3Shell sidebar |
| A04 | Color-only selection indicators — the radio circle uses bg color to indicate selected, but the check icon inside helps. However, the upcoming step dot uses border-only (no shape difference) | 1.4.1 | StepDot, Step1 cards |
| A05 | Custom dialog (`bg-black/40` overlay) has no `role="dialog"`, `aria-modal`, or `aria-labelledby` | 4.1.2 | All Dialog components |
| A06 | Keyboard focus may be lost when dialogs close (focus not returned to trigger) | 2.4.3 | All dialog usages |
| A07 | Checklist items in Step5 are `<button>` elements but act as checkboxes — should use `role="checkbox"` and `aria-checked` | 4.1.2 | Step5 |
| A08 | No `aria-label` on sidebar hamburger menu button | 4.1.2 | Module3Shell mobile |
| A09 | Tab panel in Step3 lacks `role="tablist"`, `role="tab"`, `role="tabpanel"` | 4.1.2 | Step3 tabs |
| A10 | Regen/format dropdowns lack `aria-expanded` | 4.1.2 | Step2 FormatDropdown |

---

## 8. Responsive Risks

| Risk | Component | Detail |
|------|-----------|--------|
| R01 | Step3 tabs at 320px | `flex-col sm:flex-row` with `overflow-x-auto` — tabs should stack properly on mobile, but the `min-w-max` may cause horizontal scroll |
| R02 | Step4 two-column grid | `grid-cols-1 lg:grid-cols-2` — at tablet widths (768-1023px), single column with wide textareas works but the field count (7 profile + 4 portfolio) creates a very long scroll |
| R03 | Step5 details toggle | `<details><summary>` elements have inconsistent mobile rendering across browsers |
| R04 | Step2 Swap dropdown positioning | `absolute right-0 bottom-full` — at 320px, the 72-width dropdown may overflow viewport left |
| R05 | Dialog max-width | `max-w-sm` (384px) at 320px viewport with `px-4` leaves only 288px — fits but tight |
| R06 | Header text truncation | `text-xs font-semibold truncate` for step name — at 320px with step number prefix, long names like "Proof Asset Builder" may clip badly |

---

## 9. Component/State Gaps

| Gap | M1/M2 Has | M3 Missing |
|-----|-----------|-----------|
| G01 | Intro/Welcome page (Module1IntroPage, OfferEngineeringIntroPage) | No intro screen — jumps directly into shell |
| G02 | Toast/snackbar system | Step5 has manual toast div, but no reusable pattern |
| G03 | `ClampedText` expansion toggle for long content | No read-more pattern — long rationales display in full |
| G04 | Live summary panel (OfferBriefPanel, 320px right column) | PhaseContext in sidebar is not a replacement — it doesn't show live M3 progress |
| G05 | `onBack` handler for shell exit | Module3Shell has no `onBack` prop |
| G06 | Stale-context guard uses `bg-[#f8f9ff]` | AuthoritySystem stale screen still uses `bg-black` |
| G07 | Sheet/export toolbar (Copy, Download PDF, Download MD) | Step5 has Copy + Export but in a floating toolbar vs M2's structured action bar |
| G08 | Auto-saving indicator | No visual feedback when state persists |

---

## 10. Files Needing Presentation-Layer Changes

### P0 — High impact, low effort
1. **`src/pages/AuthoritySystem.tsx`** — Lines 150-174: stale-context guard still uses dark theme and `brand-primary`. Change to `bg-[#f8f9ff] text-[#0b1c30]` and `bg-[#0058be]`.

### P1 — High impact, medium effort
2. **`src/components/module3/Step1AuthorityPosition.tsx`** — Fix heading to `h2 text-3xl font-bold`, add step badge pattern, change card selection from radio to M1-like card pattern with icon boxes and check indicators, add hover animations, fix selected state to `bg-white border-[#0058be] shadow-[0_8px_32px_rgba(0,88,190,0.14)] ring-1 ring-[#0058be]`, change textarea bg to `bg-white`.
3. **`src/components/module3/Step2ProofStrategy.tsx`** — Fix heading to `h2 text-3xl font-bold`, add step badge, change textarea bg to `bg-white`.
4. **`src/components/module3/Step3ProofAssetBuilder.tsx`** — Fix heading to `h2 text-3xl font-bold`, add step badge, change all input/textarea bgs to `bg-white`, change tab active state from tint to border+shadow.
5. **`src/components/module3/Step4ProfilePortfolio.tsx`** — Fix heading to `h2 text-3xl font-bold`, add step badge, change label sizes from `text-[8px]` to `text-[10px]`, change all textarea bgs to `bg-white`.
6. **`src/components/module3/Step5AuthorityPack.tsx`** — Fix heading to `h2 text-3xl font-bold`, add step badge.

### P2 — Medium impact, lower effort or structural
7. **`src/components/module3/Module3Shell.tsx`** — Add `onBack` prop, add "Back to Overview" link in sidebar header, add step badge passthrough or let Step components handle their own badges. Add `aria-current="step"` to sidebar buttons.
8. **`src/components/module3/StepContent.tsx`** — Wrap each step in a container with `role="region"` and `aria-labelledby`.

---

## 11. Proposed Module 3 UI Architecture

```
Module3Shell (onBack prop)
├── Sidebar (280px, lg:flex, bg-white border-r)
│   ├── Header: Back button + "Authority System" title + progress bar (h-1.5)
│   ├── Step nav (5 items, active bg-[#f8f9ff])
│   ├── PhaseContext widget (bg-[#eff4ff]/60 card)
│   └── [no bottom progress — only in header area]
├── Mobile nav (hamburger drawer)
├── Main area (flex-1 bg-[#f8f9ff])
│   ├── Sticky header (h-12, bg-white/85 backdrop-blur-md)
│   │   ├── Left: hamburger (mobile) + prev/next chevrons + step name
│   │   └── Right: step counter + mini progress bar
│   └── Content (max-w-[720px] px-5 sm:px-8 py-8 md:py-12)
│       └── <StepContent /> — renders current step
│           ├── Step badge (rounded-full pill, bg-[#0058be]/8, "Step X of 5")
│           ├── Step title (h2 text-3xl font-bold text-[#0b1c30])
│           ├── Step description (p text-neutral-500 text-sm)
│           ├── Step body (cards, forms, etc.)
│           └── Nav actions (back/next or action buttons)
```

**Key architectural rules:**
1. Every step component **must** render its own step badge + title + description — this is the M1/M2 convention
2. The shell provides layout and sidebar — it does not render step labels in the header (M2 shows step name in header for reference but the full badge+title lives in the step component)
3. Card selection components should be extracted as reusable patterns (e.g., `SelectionCard`, `FormField`, `InfoPanel`)
4. All inputs use `bg-white` — never `bg-[#f8f9ff]` except for info panels
5. All card selected states use `bg-white border-[#0058be] shadow-[0_8px_32px_rgba(0,88,190,0.14)] ring-1 ring-[#0058be]` — never tinted backgrounds

---

## 12. Priority Order

### P0 — Fix now (visual blockers)
1. Step title headings: `h1 text-lg` → `h2 text-3xl font-bold` in all 5 Step components
2. AuthoritySystem.tsx stale screen: dark theme → light theme, `bg-brand-primary` → `bg-[#0058be]`
3. Input backgrounds: `bg-[#f8f9ff]` → `bg-white` across all Step components

### P1 — Fix before launch
4. Step badge: add `inline-flex px-2.5 py-1 rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest` to all 5 Step components
5. Step1 card selection: adopt M1 card pattern (icon box + check indicator + hover animation)
6. Form labels: `text-[8px]` → `text-[10px]` in Step4
7. Dialog `role="dialog"` and `aria-modal` attributes
8. Sidebar `aria-current="step"`

### P2 — Polish when possible
9. `onBack` prop support in Module3Shell
10. Selection card hover animations (`whileHover` + `whileTap`)
11. Step5 checklist item `role="checkbox"` + `aria-checked`
12. `ClampedText` expansion for long content
13. Toast/snackbar system extract
14. Step3 tab `role="tablist"`/`role="tab"`/`role="tabpanel"`
15. Step5 checkbox accessibility fix

---

## 13. Approval Recommendation

## FAIL

**Rationale:** Module 3 has 3 critical P0 issues that prevent it from being visually equivalent to M1/M2:

1. **Step title heading scale is wrong** — `text-lg` vs `text-3xl`. This single issue makes every step page look like a subsection rather than a primary module step. It is the most visible discrepancy.

2. **Input backgrounds use `bg-[#f8f9ff]` instead of `bg-white`** — this makes every textarea and input in M3 look like it's in a disabled or non-interactive state. M1/M2 consistently use `bg-white` for editable fields.

3. **AuthoritySystem.tsx still has a dark-theme stale-context guard page** — a direct leftover from the pre-refactor state that uses `bg-black text-white` and `brand-primary`.

Additionally, the step badge pattern (a universal visual anchor in M1 and M2) is completely absent from all M3 steps, and the card selection pattern in Step1 uses a fundamentally different interaction model (radio dots instead of icon boxes + check indicators + hover elevation).

The previous refactor applied color tokens correctly but did not extract the deeper interaction patterns and typography scale that make M1/M2 feel like a cohesive premium product. Module 3 still reads as a separate tool with matching paint, not as a seamless part of the same system.
