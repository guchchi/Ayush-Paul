# GitGlow Design System Specification (DESIGN.md)
> **Single Source of Truth for GitGlow UI/UX Architecture**  
> *Target: /blueprints/gitglow and associated subcomponents*  
> *Version: 1.0 · Last Updated: November 2026*

---

## 1. Product Identity & Purpose
* **Core Value Proposition:** *"GitGlow helps developers and students grow their GitHub profile credibility and unlock official achievements — legally, step-by-step, with full automation."*
* **Core Principle:** Your product is **"grow your GitHub profile"**, not only "claim badges". Badges are the initial hook; verified git discipline and profile authority are the actual product.
* **Target Audience:** 1st/2nd-year CS students and modern working developers wanting profile credibility.
* **Tone:** Friendly, mentor-like, concise, honest. Subtle Hinglish touches allowed in celebratory microcopy.

---

## 2. Color System & Semantic Commitments

All colors carry strict functional meaning. Never use accent colors for decorative noise.

| Token | Hex Value | Purpose / Meaning | Strict Rule |
|---|---|---|---|
| **Canvas Background** | `#0D1117` | Page background | Soft charcoal. Never use harsh pure `#000`. |
| **Surface / Card** | `#161B22` | Cards, shelf, drawer, modals | Deep muted surface layer. |
| **Surface Elevate** | `#21262D` | Hover states, secondary buttons | 1-step lighter surface. |
| **Border / Boundary** | `#30363D` | 1px boundary lines | Subtle architecture separation. |
| **Text Primary** | `#E6EDF3` | Headings and body copy | High-contrast off-white. Zero eye glare. |
| **Text Muted** | `#8B949E` | Secondary metadata and labels | Used only for secondary information. |
| **🟢 Action Accent** | `#D7FF36` | Primary CTAs, active links | **Electric Lime.** Meaning: *"Do this / Click here"*. |
| **🥇 Earned Glow** | `#F1E05A` | Earned achievements only | **Gold.** Meaning: *"You earned this trophy"*. |
| **🔵 Processing Pulse** | `#388BFD` | Pending background jobs | **Cool Blue.** Meaning: *"Waiting for GitHub indexing"*. |
| **Error / Alert** | `#F85149` | Error messages, rate limit | Soft coral red. Never neon. |
| **Gotcha / Warning** | `#E3B341` | Edge-case gotchas, tips | Warm amber warning. |

---

## 3. Typography & Typesetting Hierarchy

### Font Families (Strict 3-Family Rule)
* **🦸 Headings:** `Space Grotesk`, fallback `system-ui, sans-serif` — Distinctive geometric personality without looking childish.
* **📖 Body:** `Inter`, fallback `system-ui, -apple-system, sans-serif` — Maximum clarity on budget Android and mobile viewports.
* **💻 Terminal & Code:** `JetBrains Mono`, fallback `ui-monospace, monospace` — Authentic CLI environment, zero confusion between `0` vs `O` and `1` vs `l`.

### Type Scale & Vertical Rhythm
| Style | Desktop Size | Mobile Size | Line Height | Allowed Weights |
|---|---|---|---|---|
| **Hero Headline** | `56px–64px` | `36px–40px` | `1.1` | `700` (Bold) |
| **Section Title** | `36px–40px` | `28px` | `1.15` | `700` |
| **Card / Drawer Title** | `20px–24px` | `18px–20px` | `1.25` | `700` |
| **Body Copy** | `16px–18px` | `16px` | `1.6` | `400` (Regular) / `500` (Medium) |
| **Labels & Pills** | `14px` | `14px` | `1.4` | `500` |
| **Terminal & Code** | `14px` | `13px` | `1.5` | `400` / `500` |

### Strict Typography Rules
1. **Weights:** Strictly `400`, `500`, `700` only. Never load 600, 800, 900 to keep network payload minimal.
2. **Tabular Numbers:** All scores (`/100`), timers, and counters must use `font-variant-numeric: tabular-nums` (`tabular-nums` class) to eliminate layout jitter during number count-ups.
3. **Reading Measure:** Body copy bounded to `60–70ch` line length (`max-w-prose`) for comfortable reading.
4. **Input Size:** All form input font sizes must be $\ge$ `16px` to prevent iOS mobile auto-zooming.

---

## 4. Spacing, Elevation & Foundations
* **Spatial Grid:** Strict `8px` grid system (`8px`, `16px`, `24px`, `32px`, `48px`, `64px`).
* **Container Max-Width:** `1200px` for standard content, `1000px` for documentation pages.
* **Border Radii:** `12px` (standard cards/inputs) to `16px` (drawers/featured cards), `full` for pills and buttons.
* **Iconography:** Lucide Icons only with uniform `1.75px` or `2.0px` stroke width.
* **Motion Curves:** Fast, responsive `150ms–300ms` with `cubic-bezier(0.16, 1, 0.3, 1)`. Full support for `prefers-reduced-motion: reduce`.
* **Brand Wordmark:** Obsidian onyx squircle (`#101114`) + Electric lime specular dot + Space Grotesk wordmark.

---

## 5. Component Primitives Specification

### 5.1 Buttons
* **Primary CTA:** Background `#D7FF36`, text `#0D1117`, font-bold, rounded-xl, 150ms scale-98 active state. Reserved for the primary conversion path.
* **Secondary Action:** Background `#21262D`, text `#E6EDF3`, border `#30363D`, hover `#30363D`.
* **Ghost Link:** Text `#8B949E`, hover text `#E6EDF3`, underline on hover with Lucide arrow.

### 5.2 Inputs
* **Scan Box:** Background `#161B22`, border `#30363D`, focus border `#D7FF36` with 1px ring.
* **Ergonomic Rule:** Placed in the upper-middle of the viewport so the mobile virtual keyboard cannot obscure it upon tap.

### 5.3 Status Pills (Dual State: Color + Explicit Text)
* 🥇 **Earned:** Background `#F1E05A`/10, border `#F1E05A`/30, text `#F1E05A`, label: `"On your profile ✓"`.
* 🔵 **Processing:** Background `#388BFD`/10, border `#388BFD`/30, text `#388BFD`, rhythmic pulse dot, label: `"Waiting for GitHub (hours)"`.
* 🔒 **Available:** Background `#0D1117`, border `#30363D`, text `#8B949E`, label: `"Claim in ~2m"`.

### 5.4 Glass Shelf (Trophy Cabinet)
* 5 active slots: Pull Shark 🦈, Quickdraw ⚡, YOLO 🚀, Pair Extraordinaire 👥, Galaxy Brain 🧠.
* Each slot contains: Badge Art, Title, Time estimate tag (`~2 min`), Difficulty pill, Dual State indicator.
* **Desktop:** 5-column horizontal grid shelf.
* **Mobile:** Clean vertical stacked list with minimum `48px` tap targets (carousels are strictly rejected).

### 5.5 Slide-Over Mission Drawer
* Desktop: `460px` right slide-over with backdrop blur (`#000000`/60).
* Mobile: Bottom-sheet sliding up to `85%` screen height with drag handle and swipe-to-close.
* Non-blocking background execution; URL synchronizes to `?badge=<id>`.

---

## 6. Strict "DON'T" Rules (Anti-Patterns)
* ❌ **No Pure Black (`#000000`) or Pure White (`#FFFFFF`).** Always use `#0D1117` and `#E6EDF3`.
* ❌ **No Side-Stripe Borders.** Never use `border-l-4` or thick colored borders on cards.
* ❌ **No Gradient Body Text.** Gradients are restricted to at most one single accent word in the hero headline.
* ❌ **No Decorative Glass Overload.** Glass is reserved for subtle backdrop blur; cards must remain legible `#161B22`.
* ❌ **No Fake Social Proof.** Never display synthetic counters (e.g. *"1,247 claimed today"*).
* ❌ **No False Guarantees.** Never claim *"100% Legal"* or *"Zero Ban Risk"*. Use *"Real GitHub activity"*, *"No password needed"*, *"1-click sandbox"*.
* ❌ **No Extra Fonts or Libraries.** Strictly stick to the 3 approved Google Fonts and native Tailwind CSS.

---

## 7. Multi-Width Responsive Audit Checkpoints
Every layout must be audited at three explicit widths before declaring complete:
1. **Phone (375px–414px):** Single column stack, vertical trophy list, input remains visible above keyboard, max 2 sticky elements.
2. **Tablet (768px–1024px):** 2–3 column balanced grid, accessible drawer with thumb navigation.
3. **Desktop (1200px–1440px):** Split hero (left text/input, right 3D card), 5-column glass shelf, 460px right drawer.

---

## 8. Development State Switcher Spec
For rapid visual testing without live GitHub API throttling, GitGlow includes a hidden dev state switcher to toggle:
- `pre-scan` (Sample profile cabinet)
- `post-scan-clean` (All 5 badges available)
- `post-scan-partial` (2 earned, 1 processing, 2 available)
- `post-scan-all-earned` (5 of 5 unlocked)
- `state-rate-limited` (GitHub 429 response)
- `state-user-not-found` (404 friendly recovery)
