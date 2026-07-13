# MODULE 4 — UI/UX ARCHITECTURE

**Status:** FROZEN  
**Visual Language:** Matches Modules 1–3 (white/#0b1c30/#0058be/neutral palette, Tailwind v4, `motion/react`)

---

## 1. SHELL

**Reuse pattern:** `PortfolioSystemShell.tsx` with sidebar updated from 8 to 6 steps.

**Layout:**
- Sidebar: `w-72` desktop, slide-out drawer on mobile
- Main content: `max-w-4xl`
- Theme toggle preserved (light/dark via `ps-theme` localStorage key)
- `AnimatePresence` for step transitions

**Sidebar steps:** `StepDot` with status:
- `completed` — green check icon + text label
- `active` — blue ring + bold text
- `upcoming` — grey dot + muted text
- `locked` — lock icon + muted text (not used in M4 since all steps are accessible once previous is complete)

---

## 2. SIX-STEP PROGRESS

Desktop sidebar shows all 6 step labels with status indicators:

```
1. Portfolio Direction     ● (completed)
2. Platform + Structure    ● (active)
3. Project Arrangement     ○ (upcoming)
4. Project Presentations   ○ (upcoming)
5. Copy + CTA Architecture ○ (upcoming)
6. Portfolio Build Pack    ○ (upcoming)
```

Mobile shows step indicator above content: "Step 2 of 6 — Platform + Structure"

---

## 3. STEP HEADERS

Every step has a consistent header:

```
[Step counter]         "Step [N] of 6"
[H1 heading]           "Portfolio Direction"
[Description]          "What should your portfolio achieve?"
```

Pattern matches Modules 1-3 (`text-3xl font-bold`, `text-neutral-500 text-base`).

---

## 4. COMPLEX WORKSPACE LAYOUT

Steps 3-5 use a split-panel layout:

```
┌─────────────────────────────────────────┐
│ Header                                  │
├──────────────┬──────────────────────────┤
│ Config Panel  │  Preview Panel          │
│ (content)     │  (live preview)         │
│               │                         │
│ [Continue]    │                         │
└──────────────┴──────────────────────────┘
```

- Config panel: `w-full lg:w-1/2` (scrolls)
- Preview panel: `w-full lg:w-1/2` (sticky on desktop, below config on mobile)
- Preview shows a simplified portfolio mockup reflecting current choices

---

## 5. PROGRESSIVE DISCLOSURE

- Step 1: Single direction cards → statement editor
- Step 2: Platform cards → section list (expandable)
- Step 3: Three placement slots → drag grid
- Step 4: Project selector → per-project detail editor
- Step 5: Copy sections (expandable) → CTA editor
- Step 6: Full pack preview → download actions

---

## 6. PRIMARY ACTIONS

Every step has:
- **Left:** "Back" (returns to previous step, not previous section within step)
- **Right:** "Continue" (primary action, blue `#0058be` button)
- Steps 1-5: "Generate" button (grey, pre-fills content from deterministic templates)
- Step 6: "Download as Markdown" and "Copy" buttons

---

## 7. AUTOSAVE FEEDBACK

Zustand persist handles autosave. Show inline indicator:
```
[✓ Saved]  [Last saved: just now]
```

- Appears after first data change
- Updates to "Saving..." during debounce (300ms)
- Shows "Saved" after persistence
- Error state if localStorage is full: "Could not save — storage full"

---

## 8. REGENERATE WARNINGS

When stale context is detected:
```
┌──────────────────────────────────────────────┐
│ ⚠ Upstream strategy has changed              │
│ Your portfolio direction, services, or        │
│ authority positioning have been updated since │
│ you started Module 4.                         │
│                                              │
│ [Regenerate (loses edits)] [Keep my work]     │
└──────────────────────────────────────────────┘
```

- Banner appears below step header
- Does NOT block interaction (user can dismiss)
- "Regenerate" clears all portfolio data and regenerates fresh
- "Keep my work" dismisses banner, sets stale flag, user acknowledges

---

## 9. COPY FEEDBACK

After copy/download:
```
"Copied to clipboard"  (toast, 3s)
"Downloaded"           (toast, 3s)
```

---

## 10. EMPTY STATES

**No Module 3 context (no upstream data):**
```
┌──────────────────────────────────────┐
│ You need to complete the Authority   │
│ System first before building your    │
│ portfolio.                           │
│                                      │
│ [Go to Authority System]             │
└──────────────────────────────────────┘
```

**No Module 3 proof assets:**
```
┌──────────────────────────────────────┐
│ No proof assets found. Complete      │
│ Step 3 of the Authority System to    │
│ create your proof assets first.      │
│                                      │
│ [Go to Authority System]             │
└──────────────────────────────────────┘
```

**Empty portfolio (first visit):**
```
┌──────────────────────────────────────┐
│ Let's build your portfolio.          │
│ Start by telling us what you want    │
│ your portfolio to achieve.           │
│                                      │
│ [Start with Portfolio Direction]      │
└──────────────────────────────────────┘
```

---

## 11. MOBILE BEHAVIOUR

- Sidebar: Bottom sheet / slide-out drawer, triggered by hamburger menu
- Split panels: Stacked vertically (config above preview)
- Buttons: `w-full` on mobile, inline on desktop
- Bottom CTA bar: Fixed at bottom on mobile (like Modules 1-3), with safe-area padding
- All layouts tested at 320px minimum
- Touch targets minimum 44px per WCAG 2.2

---

## 12. KEYBOARD / ACCESSIBILITY

- `aria-current="step"` on active sidebar step
- `aria-label` on all icon-only buttons
- `role="radiogroup"` on platform selection
- `role="listbox"` on project arrangement slots
- Focus management: auto-focus first interactive element on step entry
- Skip link: "Skip to main content"
- All states use icon + text (never color-only)
- Focus-visible rings on all interactive elements
- Error messages linked to inputs via `aria-describedby`

---

## 13. QUALITY TARGETS

- **3-5 second clarity:** Each step communicates its purpose within 3-5 seconds of viewing
- **One purpose per step:** No step asks two different questions
- **WCAG 2.2 AA:** All contrast ratios, focus indicators, labels
- **320px mobile:** No horizontal scroll on any step
- **Long real content tested:** Input fields accept long text, preview panels scroll
- **No admin-CMS feeling:** Tool is a guided builder, not a dashboard
- **Restrained premium visual:** White space, single accent colour, no decorative noise
