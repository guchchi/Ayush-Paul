# GitGlow DESIGN.md

Single source of truth for UI/UX. Every prompt to the coding agent must say: **"Follow DESIGN.md."**
If something is not covered here, ask. Do not invent styles.

---

## 1. Product in one line

GitGlow helps students and beginners grow their GitHub profile. Users scan any public username for free, then claim GitHub achievement badges with a one-click bot that acts on their own account.

**Audience:** 1st/2nd-year students, mostly on phones, many in India.
**Primary goal of the homepage:** get the visitor to scan a username.

## 2. Design principles

1. **Value before login.** Scan works with zero login. GitHub OAuth appears only at the claim click.
2. **Glow means progress.** Earned items glow. Everything else stays calm.
3. **One accent, meaningful colors.** Colors carry meaning, never decoration.
4. **Honest, never hype.** No "100% legal", no "zero ban risk". Say what is true.
5. **Friendly dark.** Dark theme, but rounded, warm copy, and readable text.
6. **Mobile first.** Design the phone layout first, then widen.

## 3. Theme: softened dark-first (dark only for v1)

### 3.1 Color tokens

```css
:root {
  /* Surfaces */
  --bg:            #0D1117; /* page */
  --surface:       #161B22; /* cards, drawer */
  --surface-2:     #1C2230; /* raised / hover (proposed) */
  --border:        #30363D;

  /* Text */
  --text:          #E6EDF3; /* never pure white */
  --text-muted:    #8B949E; /* secondary only */

  /* Semantic (colors carry meaning) */
  --action:        #C6FF3D; /* LIME: do this (buttons, links) (proposed hex) */
  --on-action:     #0D1117; /* text on lime */
  --earned:        #F5C451; /* GOLD: earned (proposed hex) */
  --processing:    #4DA3FF; /* BLUE: waiting for GitHub (proposed hex) */
  --danger:        #FF6B6B; /* errors / failed (proposed hex) */
}
```

### 3.2 Color rules

- **Lime = action only** (primary buttons, key links, focus ring).
- **Gold = earned only** (earned badges, earned state label). Never decorative.
- **Blue = processing only.** Amber is NOT used (it looks like gold).
- **Red = failure only.**
- Never use pure `#000` or pure `#FFF`.
- Meaning must never rely on color alone. Always add a text label and an icon.
- Do not copy GitHub's look wholesale. GitGlow needs its own accent, logo, badge art and motion style.

## 4. Typography

| Use | Font | Notes |
|---|---|---|
| Headings | Space Grotesk | 700 |
| Body / UI | Inter | 400, 500 |
| Terminal / code | JetBrains Mono | 400 |

- Max 3 families. Weights only 400, 500, 700.
- Self-host, subset to Latin, `font-display: swap`, preload heading + body only.
- Fallbacks: `system-ui`, `ui-monospace`.

| Style | Desktop | Mobile |
|---|---|---|
| Hero headline | 56-64px | 36-40px |
| Section title | 36-40px | 28px |
| Card title | 20-24px | 18-20px |
| Body | 16-18px | 16px |
| Small / labels | 14px | 14px |
| Terminal | 14px | 13px |

- Line height: 1.1 headings, 1.6 body. Paragraph width about 60-70 characters.
- All inputs: **16px or larger** (prevents iOS zoom).
- Score number uses tabular numerals.
- No gradient text on body copy. At most one gradient word in the hero.
- No long all-caps text.

## 5. Spacing, shape, motion

- **Grid:** 8px base unit. Max content width about 1200px. Generous section gaps.
- **Radius:** 12px (controls), 16px (cards, drawer).
- **Shadows:** minimal. Soft glow only for earned/active items.
- **Icons:** one set only (Lucide), consistent stroke.
- **Motion:** 150-300ms, one easing curve `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- **Reduced motion:** disable glow pulses, tilt, and slide animations; use simple fades.

## 6. Page structure (homepage)

0. Navbar: Badges, How it works, Connect GitHub (max 4 items; not sticky on mobile)
1. Hero: headline, subtitle, scan box, example usernames, trust pills, 3D medallion (static image on mobile)
2. Score + Trophy cabinet (Glass Shelf). Shows a sample profile labelled "Example" before any scan
3. How it works + trust: Scan, Claim, GitHub awards it; "what the bot does / never does"; exact permissions; revoke link
4. Coming soon: only badges that can truly be earned; "Notify me"
5. FAQ (honest answers, including "Is this allowed by GitHub?")
6. Final CTA (scan box again) + footer

**Hero copy:**
- Headline: "Make Your GitHub Profile Stand Out in Minutes."
- Subtitle: "See missing achievements. Claim in 1 click."
- Trust pills: "Real GitHub activity", "No password", "1-click"
- Example usernames: `@octocat` and the founder's own.

## 7. Components

### 7.1 Scan box
- Input: `github.com/username` or `@username`. Accept pasted URLs and clean them up.
- Button: "Audit Free".
- Zero login required. Scanning any public username is allowed.

### 7.2 Trophy cabinet: Glass Shelf (5 slots)
Badges in scope: **Pull Shark, Quickdraw, YOLO, Pair Extraordinaire, Galaxy Brain.**

Each slot shows: badge art, name, time tag (e.g. "~2 min"), difficulty pill (Easy / Medium), text status.

| State | Look | Label |
|---|---|---|
| Earned | Full color, gold glow | "On your profile" + check icon |
| Processing | Soft blue pulse | "Waiting for GitHub" |
| Available | Dark silhouette + lock | "Claim in ~2 min" |

- Hover (desktop): slight lift and subtle glow; light tilt only.
- Click or tap: opens the drawer.
- Unlock moment: lock cracks, glow fades in, score counts up. Sound muted by default.
- Badge art: **own illustrations**, not GitHub's official images.
- The other 5 badges appear in a separate "Coming soon" area, never in the "X of 5" count.

### 7.3 Score
- Label: "GitGlow Score" (unofficial). Include a "How is it calculated?" dropdown.
- Breakdown must add up to exactly 100.

### 7.4 Slide-over drawer
- Desktop: right panel about 450px, light blur and dim behind.
- Mobile: bottom sheet about 85% height, drag handle, swipe down to close.
- Slide-in 250-300ms. `Esc` and outside click close it. Focus is trapped inside and returns to the badge on close.
- URL updates (e.g. `/?badge=pull-shark`) so it is shareable; Back closes it.
- **Non-blocking:** closing the drawer does not stop a running bot job. The shelf slot shows status.

**Content (top to bottom):** badge art + name + state; quick facts (time, difficulty, what it proves); requirements (2-3 lines); gotchas; "What the bot will do" (3 plain steps); primary button (sticky at bottom); "Do it manually" link; "Read full guide" link.

**Six button states:**

| State | Button / content |
|---|---|
| Available | `Claim with 1-Click Bot` |
| Not logged in | `Connect GitHub to claim` (shows permission summary first) |
| Running | Live step log |
| Processing | "Done on your side. Waiting for GitHub (hours to days)." |
| Earned | "On your profile" + share button |
| Failed | Plain reason + `Try again` |

### 7.4.1 Claim rule
The claim button works **only** when the logged-in GitHub user equals the scanned username. For anyone else, show: "Scan only. Log in as this user to claim."

### 7.5 Practice mode
If a practice/simulation exists, label it **"Practice (no badge)"**. It never earns a badge.

## 8. States to design (not just the happy path)

| Situation | Show |
|---|---|
| Scanning | Skeleton shimmer, not a spinner |
| Username not found | Friendly message, "check spelling" |
| Private or empty profile | Encouraging copy, never shaming |
| GitHub rate-limited | "Busy, retrying in 30s" |
| Bot failed | Plain reason and Try again |
| Zero activity | "Great, you're starting fresh. Easiest badge first." |
| Pending too long (days) | "Not showing yet. Here's why." |

## 9. Mobile rules

- Scan input sits in the **upper-middle** (keyboard must not cover it).
- Sticky bottom pill `Audit My Profile`. It becomes the submit button once text is typed.
- Cabinet is a **vertical stacked list**, not a carousel. Rows at least 48px tall.
- Progress bar ("2 of 5 earned") pinned at top while scrolling.
- **Max 2 sticky elements** at once.
- No hover-only interactions. Tap targets 44px or larger.
- Log text wraps; no sideways scrolling.
- 3D medallion is a static image on mobile.
- One-tap WhatsApp share of the score card.
- Handle in-app browsers (Instagram, WhatsApp, LinkedIn): detect and show "Open in browser" if GitHub login fails.
- Test on a cheap Android phone, on mobile data, opened from a WhatsApp link.

## 10. Accessibility

- Drawer: focus trap, `Esc`, focus returns to trigger.
- Announce status changes with `aria-live`.
- Visible focus ring (lime) on all interactive elements.
- Text labels for every state (not color only).
- Check contrast: dark text on lime, gold and blue on charcoal, muted text on bg.
- Keyboard navigation through the shelf.
- Respect `prefers-reduced-motion`.

## 11. Performance budget

- Usable in about 2.5s on a mid-range Android over mobile data.
- Lazy-load everything below the fold. Load the 3D hero only on capable desktop.
- Self-hosted, subset fonts.
- Measure on real devices.

## 12. Copy and tone

- Friendly, short, honest. Light Hinglish touches only in small places (hints, errors). Main SEO pages in English.
- **Banned phrases:** "100% legal", "zero ban risk", "hack", "cheat", "fake".
- Pills: "Real GitHub activity", "No password", "1-click".
- After claim: "Action completed. GitHub usually shows the badge within a few hours to days." (no "SLA" jargon)
- Always explain permissions in plain words and show the revoke link.

## 13. Trust UI

- Before GitHub login: mini summary, e.g. "Creates a repo in your account. Collaboration is done by the GitGlow agent account."
- After a claim: "What the bot did" with links to the real PR or repo.
- Permission text must match the **exact** OAuth scopes requested.

## 14. SEO notes that affect UI

- Badge pages `/badges/<slug>` are server-rendered. Drawer content and badge page content come from the same template.
- Scan-result URLs and `/engine` are `noindex`.
- Each badge page: question H1, 40-60 word direct answer, numbered steps, small table, FAQ, "Last updated" date.

## 15. Build rules for the coding agent

- Use design tokens only (CSS variables or Tailwind theme). **No new colors, fonts, or libraries** without approval.
- One component or section per task.
- Use mock data from `/mocks` first. A hidden dev state switcher flips between earned, processing, failed, and empty states.
- Every component must handle all states in this file.
- Verify at 375px, 768px, and 1280px, with a screenshot, before saying "done".
- Commit after each section.

## 16. Still open (decide later)

- Final accent hex values (lime, gold, blue, red are proposed above).
- Logo and wordmark.
- Badge artwork style.
- Pricing and paid tiers.
- Light theme (phase 2).