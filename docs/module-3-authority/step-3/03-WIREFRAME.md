# Wireframe Specification Document

# Module 3 – Authority System

## Step 3 – Profile & Portfolio Strategy

**Version:** 1.0  
**Status:** Wireframe Specification (Ready for UI Design System)

---

# 1. Purpose

This document defines the structural layout of **Step 3 (Profile & Portfolio Strategy)** before visual styling is applied.

It specifies:
* What appears on the page.
* Where it appears.
* How sections relate to each other.
* How layouts adapt across devices (Desktop, Tablet, Mobile).
* How users interact with components.
* Accessibility and structural interaction states.

This document intentionally excludes colors, typography, animations, and branding—those are governed by Stage 5 (UI Design System).

---

# 2. Overall Page Hierarchy

The page follows a strict 14-level vertical hierarchy:

1. **Page Header:** Global workspace branding & shell navigation.
2. **Progress Navigation:** Module 3 step progress bar (Step 1 → Step 2 → **Step 3** → Step 4).
3. **Hero / Introduction:** Step title, core objective, time-to-complete indicator.
4. **Authority Snapshot:** Upstream summary card (Authority Identity, Niche, Target Audience, Offer, Proof Level).
5. **Strategy Overview:** High-level preview ("What we are building today").
6. **Platform Strategy:** Selected vs. avoided platform recommendations.
7. **Profile Strategy:** Split form & live platform preview (Username, Bio, Banner, Headline, CTA).
8. **Portfolio Strategy:** Interactive architecture stack & section accordion.
9. **Trust Strategy:** 3-Column proof matrix (Metrics, Testimonials, Certifications, Live Repos/Demos).
10. **Content Strategy:** Publishing cadence, content types, authority post templates.
11. **Branding Strategy:** Tone of voice tiles, visual consistency rules.
12. **Optimization Opportunities:** Quick wins checklist (SEO & conversion fixes).
13. **Implementation Roadmap:** 3-Column Phase Kanban (Phase 1: Critical, Phase 2: Important, Phase 3: Nice to Have).
14. **Bottom Action Bar:** Sticky completion gauge, strategy save, & unlock Step 4 button.

The hierarchy remains consistent across all screen sizes.

---

# 3. Section Layout Standard

Each major strategy section contains:
* **Section Title:** H2/H3 semantic heading with icon.
* **Short Description:** One-sentence summary of the section's objective.
* **Educational Context Callout:** Mentorship prompt explaining *why this matters*.
* **AI Recommendations:** Primary personalized recommendation cards.
* **Editable Content Area:** Input fields, toggle controls, or textareas for user customization.
* **Expand / Collapse Trigger:** Progressive disclosure control for advanced rationale & examples.
* **Action Controls:** Regenerate, Save, and Reset buttons.

Each section is visually and functionally independent.

---

# 4. Layout & Grid System

* **Structure:** Modular card-based layout with vertical stacking and full-width container (`max-w-6xl` centered via `mx-auto`).
* **Gutters & Spacing:** Standardized spacing scale:
  * `xs`: 4px (`space-1` / `p-1`)
  * `sm`: 8px (`space-2` / `p-2`)
  * `md`: 16px (`space-4` / `p-4`)
  * `lg`: 24px (`space-6` / `p-6`)
  * `xl`: 32px (`space-8` / `p-8`)
  * `2xl`: 48px (`space-12` / `p-12`)
* **Avoid Dashboard Clutter:** Uses clean reading widths rather than dense multi-column widget dashboards.

---

# 5. Component Inventory (18 Core Primitives)

1. **Hero Banner:** Headline, Sub-headline, Time estimator, Step badge.
2. **Progress Indicator:** Step tracker with active/completed status pills.
3. **Summary Cards:** Upstream snapshot container with icon + label pairs.
4. **Recommendation Cards:** Recommendation title, priority badge, description, rationale drawer.
5. **Priority Badges:** Essential (Red/Primary), High (Yellow/Warning), Optional (Gray/Muted).
6. **Platform Cards:** Platform logo, status indicator, priority tag, purpose text.
7. **Portfolio Cards:** Page section accordion, drag-reorder handles, section goal tags.
8. **Trust Cards:** Category icon, asset description, missing proof warning callout.
9. **Educational Callouts:** Mentorship box with light surface tint and tip icon.
10. **AI Insight Panels:** Highlight box with AI sparkles icon and strategy rationale.
11. **Editable Text Areas:** Sanitized input text fields & textareas with character counters.
12. **Checklists:** Interactive checkboxes for optimization quick wins.
13. **Timeline / Roadmap:** 3-Column Kanban cards (Phase 1, Phase 2, Phase 3).
14. **Accordion Panels:** Smooth collapsible containers for deep-dive rationale.
15. **Tooltips:** Hover/focus info badges for complex terms.
16. **Status Chips:** Saved, Editing, Generating, Error badges.
17. **Action Buttons:** Primary, Secondary, Ghost, and Icon button variants.
18. **Sticky Bottom Action Bar:** Fixed bottom container for strategy confirmation & Step 4 navigation.

---

# 6. Desktop Wireframe (1280px+)

* **Layout:** Centered single main content column (`max-w-5xl` or `max-w-6xl`).
* **Sidebar:** Sticky Table of Contents / Progress Navigation on the right (`w-64 sticky top-6`).
* **Cards:** Wide, readable recommendation cards with side-by-side split view for Profile Strategy (Form Left, Live Preview Right).
* **Reading Width:** Main copy constrained to `max-w-2xl` for comfortable reading.

---

# 7. Tablet Wireframe (768px – 1023px)

* **Layout:** Single column stacked flow (`max-w-3xl`).
* **Navigation:** Sidebar collapsed into top drawer / horizontal pill bar.
* **Cards:** Split forms stack vertically (Spec Form top, Live Preview bottom).
* **Spacing:** Maintained generous gutters (`px-6`, `space-y-6`).

---

# 8. Mobile Wireframe (<768px)

* **Layout:** Full-width single column stack (`w-full px-4`).
* **Touch Targets:** Minimum 44px × 44px clickable areas for all buttons, toggles, and inputs.
* **Profile Strategy:** Tabbed toggle switch between `Edit Form` and `Live Preview`.
* **Sticky CTA:** Fixed bottom bar with `Save Strategy` and `Proceed to Step 4`.
* **Scrolling:** 100% vertical scrolling; zero horizontal scroll.

---

# 9. Spacing & Alignment Rules

* **Text Alignment:** Left-aligned body copy, headings, and descriptions. Centered text is strictly reserved for Hero title and pill badges.
* **Action Alignment:** Primary action buttons align to the right on desktop flex rows, and full width on mobile.
* **Visual Rhythm:** Uniform card padding (`p-6` desktop, `p-4` mobile), border radii (`rounded-xl`), and borders (`border border-border`).

---

# 10. Navigation Behavior

* **Current State:** Active step highlighted in progress bar.
* **Scroll Spy:** Sticky Table of Contents highlights current visible section as user scrolls.
* **Unsaved Changes Warning:** Prompts user if attempting to navigate away with unsaved edits.

---

# 11. Component Interaction States

Every interactive primitive defines 8 strict states:
1. **Default:** Resting visual state.
2. **Hover:** Subtle background tint shift / border highlight.
3. **Focus:** Visible 2px focus ring (`ring-2 ring-primary ring-offset-2`).
4. **Active/Pressed:** Scale down (`scale-[0.98]`).
5. **Disabled:** Opacity 50%, `cursor-not-allowed`, non-clickable.
6. **Loading:** Skeleton loader or inline spinner with progress text.
7. **Success:** Green checkmark feedback badge.
8. **Error:** Red border callout with inline retry button.

---

# 12. Accessibility Specifications (a11y)

* **Keyboard Navigation:** Full keyboard access (`Tab`, `Shift+Tab`, `Space`, `Enter`, `Esc` for accordions/drawers).
* **Logical Tab Order:** Sequence matches natural visual reading order.
* **Screen Readers:** ARIA landmarks (`aria-expanded`, `aria-label`, `role="region"`, `role="status"`).
* **Color Contrast:** Minimum 4.5:1 text-to-background ratio for standard text, 3:1 for large headings.

---

# 13. Wireframe Success Criteria

✓ All 14 sections have explicit positions and responsive behaviors.  
✓ All 18 component primitives have defined structural roles.  
✓ Responsive layouts adapt seamlessly without horizontal overflow.  
✓ Navigation, progressive disclosure, and interaction states are fully defined.  
✓ Structural foundation is complete for UI Design System application.
