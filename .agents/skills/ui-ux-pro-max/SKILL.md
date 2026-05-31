---
name: ui-ux-pro-max
description: "UI/UX design intelligence for web and mobile. Includes 50+ styles, 161 color palettes, 57 font pairings, 161 product types, 99 UX guidelines, and 25 chart types across 10 stacks (React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui, and HTML/CSS). Actions: plan, build, create, design, implement, review, fix, improve, optimize, enhance, refactor, and check UI/UX code. Projects: website, landing page, dashboard, admin panel, e-commerce, SaaS, portfolio, blog, and mobile app. Elements: button, modal, navbar, sidebar, card, table, form, and chart. Styles: glassmorphism, claymorphism, minimalism, brutalism, neumorphism, bento grid, dark mode, responsive, skeuomorphism, and flat design. Topics: color systems, accessibility, animation, layout, typography, font pairing, spacing, interaction states, shadow, and gradient. Integrations: shadcn/ui MCP for component search and examples."
---

# UI/UX Pro Max - Design Intelligence

Comprehensive design guide for web and mobile applications. Contains 50+ styles, 161 color palettes, 57 font pairings, 161 product types with reasoning rules, 99 UX guidelines, and 25 chart types across 10 technology stacks.

## Key Design Principles

### 1. Accessibility (CRITICAL)
- **color-contrast:** Minimum 4.5:1 ratio for normal text.
- **focus-states:** Visible focus rings on interactive elements (2-4px).
- **alt-text:** Descriptive alt text for meaningful images.
- **aria-labels:** Use aria-label for icon-only buttons.
- **keyboard-nav:** Tab order matches visual order with full keyboard support.

### 2. Touch & Interaction (CRITICAL)
- **touch-target-size:** Min 44x44px for touch interactions.
- **touch-spacing:** Min 8px gap between touch targets.
- **cursor-pointer:** Add cursor-pointer to clickable elements (Web).
- **standard-gestures:** Maintain platform-consistent gestures.

### 3. Performance (HIGH)
- **image-optimization:** Use WebP/AVIF and lazy loading.
- **image-dimension:** Declare width/height or use aspect-ratio to prevent layout shift (CLS).
- **lazy-loading:** Split code by route/feature (Suspense).

### 4. Style Selection (HIGH)
- **style-match:** Match style to product type.
- **no-emoji-icons:** Use SVGs (Heroicons, Lucide), never raw emojis.
- **elevation-consistent:** Unify the elevation/shadow scale.

### 5. Layout & Responsive (HIGH)
- **mobile-first:** Design mobile-first, scale up to desktop.
- **breakpoint-consistency:** Systematic breakpoints (375 / 768 / 1024 / 1440).
- **spacing-scale:** Use 4pt/8dp incremental spacing system.

### 6. Typography & Color (MEDIUM)
- **line-height:** 1.5 - 1.75 for body text.
- **line-length:** Limit to 65-75 characters per line.
- **font-pairing:** Heading/body font personalities match.
- **color-semantic:** Define semantic color tokens, not raw hex.

### 7. Animation (MEDIUM)
- **duration-timing:** 150-300ms for micro-interactions.
- **transform-performance:** Animate transform/opacity only.
- **motion-meaning:** Animations express cause-effect relationships.
- **stagger-sequence:** Stagger grid item entrance by 30-50ms.
- **reduced-motion:** Respect prefers-reduced-motion queries.
