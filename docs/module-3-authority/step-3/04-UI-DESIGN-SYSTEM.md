# UI Design System Specification

# Module 3 – Authority System

## Step 3 – Profile & Portfolio Strategy

**Version:** 1.0  
**Status:** UI Design System (Ready for Functional Spec)

---

# 1. Design Philosophy

The interface should communicate professionalism, intelligence, and clarity rather than decoration.

Every visual decision should support learning, confidence, and trust.

The UI should feel:
* Minimal
* Premium
* Modern
* Calm
* Educational
* Structured

The visual language should reinforce that the system is an intelligent mentor rather than a traditional dashboard.

---

# 2. Visual Personality

Desired attributes:
* Clean
* Spacious
* Confident
* Technical
* Premium
* Friendly
* Focused

Avoid:
* Gaming aesthetics
* Excessive gradients
* Heavy glassmorphism
* Visual clutter
* Decorative elements without purpose

---

# 3. Typography System

Typography should establish a clear reading hierarchy.

Define styles for:
* Display Heading
* Page Heading
* Section Heading
* Card Heading
* Body Large
* Body Standard
* Caption
* Label
* Button Text
* Code / Monospace (if required)

Guidelines:
* Strong contrast between heading levels.
* Comfortable reading line length.
* Consistent vertical rhythm.
* Readability prioritized over artistic styling.

---

# 4. Color System

Use semantic color roles rather than hardcoded colors.

Core palette:
* Primary
* Secondary
* Accent
* Surface
* Background
* Border
* Text Primary
* Text Secondary
* Muted Text

Semantic colors:
* Success
* Warning
* Error
* Information

Interactive colors:
* Hover
* Active
* Focus
* Disabled

Color usage should emphasize hierarchy rather than decoration.

---

# 5. Grid System

Use a consistent layout grid.

Define:
* Maximum content width
* Desktop columns
* Tablet columns
* Mobile columns
* Gutter width
* Container padding
* Safe margins

Maintain alignment consistency across all sections.

---

# 6. Spacing System

Adopt a reusable spacing scale.

Spacing should define:
* Page padding
* Section spacing
* Card spacing
* Component spacing
* Internal padding
* Button spacing
* Form spacing

Spacing should create visual grouping before borders are required.

---

# 7. Border Radius System

Use a consistent radius scale.

Recommended categories:
* Small
* Medium
* Large
* Extra Large
* Pill (for badges and chips)

Avoid mixing unrelated corner styles.

---

# 8. Elevation & Shadow System

Use shadows only to communicate hierarchy.

Define elevation levels for:
* Base Surface
* Interactive Cards
* Hover Cards
* Floating Panels
* Dialogs
* Popovers

Shadows should remain subtle and consistent.

---

# 9. Icon System

Icons should:
* Be simple.
* Maintain consistent stroke weight.
* Follow a single icon family (e.g., Lucide React).
* Pair with labels when meaning could be ambiguous.

Common icon categories: Navigation, Success, Warning, Information, Profile, Portfolio, Platform, Trust, Content, Branding, Settings, AI, Edit, Save, Expand, Collapse.

---

# 10. Illustration Style

Illustrations should:
* Support understanding.
* Be lightweight.
* Avoid dominating content.

Prefer diagrams or simple educational graphics over decorative artwork.

---

# 11. Animation System

Animations should communicate state changes, not entertainment.

Use animation for:
* Section entrance
* Expand / Collapse
* Recommendation generation
* Success feedback
* Loading transitions
* Card hover
* Progress updates

Animation principles: Fast, Smooth, Purposeful, Consistent. Avoid unnecessary motion.

---

# 12. Hover States

Every interactive element should define:
* Default
* Hover
* Focus
* Active
* Disabled

Hover should clearly indicate interactivity without causing layout shifts.

---

# 13. Component Library

The design system should include standardized components.

**Navigation:** Progress Stepper, Breadcrumb, Tabs  
**Display:** Cards, Summary Cards, AI Insight Cards, Platform Cards, Trust Cards, Portfolio Cards  
**Inputs:** Text Field, Text Area, Dropdown, Multi-select, Toggle, Checkbox, Radio Button  
**Feedback:** Alert, Toast, Progress Indicator, Loading Skeleton, Status Badge  
**Actions:** Primary Button, Secondary Button, Ghost Button, Icon Button, Floating Action Button  
**Containers:** Accordion, Modal, Drawer, Tooltip, Popover, Callout Panel  

---

# 14. Component Variants

Each reusable component should define: Size variants, Visual variants, Interactive states, Loading state, Disabled state, Error state, Success state.

Example (Button):
* **Variants:** Primary, Secondary, Ghost, Destructive
* **Sizes:** Small, Medium, Large
* **States:** Default, Hover, Active, Focus, Disabled, Loading

---

# 15. Recommendation Card Standard

Every recommendation card should follow the same structure:
1. Category
2. Recommendation Title
3. Short Explanation
4. Why It Matters
5. Priority Indicator
6. Action Area
7. Expandable Details

This consistency reduces cognitive load.

---

# 16. AI Component Guidelines

AI-generated content should always be visually distinguishable from static system content.

Include:
* AI label or badge
* Regenerate action
* Edit capability
* Explanation area

Avoid making AI recommendations appear authoritative without context.

---

# 17. Empty, Loading & Error Components

Provide standardized UI patterns for:

* **Empty State:** Explanation, Illustration (optional), Primary action
* **Loading State:** Skeleton layout, Contextual loading message, Progress indication
* **Error State:** Clear explanation, Retry action, Preserve user progress
* **Success State:** Confirmation message, Visual feedback, Next recommended action

---

# 18. Responsive Rules

* **Desktop:** Wide reading layout, Optional supporting sidebar, Comfortable whitespace
* **Tablet:** Reduced columns, Stacked supporting content, Touch-friendly spacing
* **Mobile:** Single-column layout, Sticky primary actions, Expandable content, Simplified navigation

Every component must define its responsive behavior.

---

# 19. Accessibility Standards

The design system must support:
* Keyboard navigation
* Visible focus indicators
* Adequate touch targets
* Semantic component structure
* Sufficient contrast
* Readable typography
* Responsive zoom
* Screen reader compatibility

Accessibility is a first-class design requirement.

---

# 20. UI Consistency Rules

To maintain a cohesive experience:
* Use one spacing scale, border-radius system, shadow system, and icon family.
* Reuse components instead of creating new ones.
* Keep interaction patterns consistent across all sections.
* Never solve similar problems with different UI patterns.
* Consistency should always take precedence over novelty.

---

# 21. Definition of Done

The UI Design System is complete when:
* Every visual token is defined.
* Every reusable component has a standard specification.
* Component variants and interaction states are documented.
* Responsive behavior is defined for desktop, tablet, and mobile.
* The design system can be implemented consistently across the entire product without requiring additional visual decisions.
