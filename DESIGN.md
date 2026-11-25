# GitGlow DESIGN.md

Single source of truth for UI/UX. Every prompt to the coding agent must say: **"Follow DESIGN.md."**
If something is not covered here, ask. Do not invent styles.

---

## 1. Product in one line

GitGlow helps students and beginners grow their GitHub profile. Users scan any public username for free, then claim GitHub achievement badges with a one-click bot that acts on their own account.

**Audience:** 1st/2nd-year students, mostly on phones, many in India.  
**Primary goal of the homepage:** get the visitor to scan a username.

---

## 2. Design principles

1. **Value before login.** Scan works with zero login. GitHub OAuth appears only at the claim click.
2. **Glow means progress.** Earned items glow. Everything else stays calm.
3. **One accent, meaningful colors.** Colors carry meaning, never decoration.
4. **Honest, never hype.** No "100% legal", no "zero ban risk". Say what is true.
5. **Friendly dark.** Dark theme, but rounded, warm copy, and readable text.
6. **Mobile first.** Design the phone layout first, then widen.

---

## 3. Theme: softened dark-first (dark only for v1)

### 3.1 Color tokens

```css
:root {
  /* Surfaces */
  --bg:            #0D1117; /* page */
  --surface:       #161B22; /* cards, drawer */
  --surface-2:     #1C2230; /* raised / hover */
  --border:        #30363D;

  /* Text */
  --text:          #E6EDF3; /* never pure white */
  --text-muted:    #8B949E; /* secondary only */

  /* Semantic (colors carry meaning) */
  --action:        #C6FF3D; /* LIME: do this (buttons, links) */
  --on-action:     #0D1117; /* text on lime */
  --earned:        #F5C451; /* GOLD: earned */
  --processing:    #4DA3FF; /* BLUE: waiting for GitHub */
  --danger:        #FF6B6B; /* errors / failed */
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

---

## 4. Typography

| Use | Font | Notes |
|---|---|---|
| Headings | Space Grotesk | 700 |
| Body / UI | Inter | 400, 500 |
| Terminal / code | JetBrains Mono | 400 |

- Max 3 families. Weights only 400, 500, 700.
- Self-host, subset to Latin, `font-display: swap`, preload heading + body only.
- Fallbacks: `system-ui`, `ui-monospace`.

| Style | Desktop | Mobile | Line Height |
|---|---|---|---|
| Hero headline | 56-64px | 36-40px | 1.1 |
| Section title | 36-40px | 28px | 1.15 |
| Card title | 20-24px | 18-20px | 1.25 |
| Body | 16-18px | 16px | 1.6 |
| Small / labels | 14px | 14px | 1.4 |
| Terminal | 14px | 13px | 1.5 |

- Line height: 1.1 headings, 1.6 body. Paragraph width about 60-70 characters.
- All inputs: **16px or larger** (prevents iOS zoom).
- Score number uses tabular numerals (`font-variant-numeric: tabular-nums`).
- No gradient text on body copy. At most one gradient word in the hero.
- No long all-caps text.

---

## 5. Spacing, shape, motion

- **Grid:** 8px base unit (8px, 16px, 24px, 32px, 48px, 64px). Max content width about 1200px. Generous section gaps.
- **Radius:** 12px (controls), 16px (cards, drawer), 9999px (pills).
- **Shadows:** minimal. Soft glow only for earned/active items (`0 0 24px rgba(245, 196, 81, 0.25)`).
- **Icons:** one set only (Lucide), consistent stroke (1.75px–2.0px).
- **Motion:** 150-300ms, one easing curve `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- **Reduced motion:** disable glow pulses, tilt, and slide animations; use simple fades.

---

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

---

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
- **Non-blocking:** closing the drawer does not stop a running bot job. The shelf slot shows a spinner/pulse while it runs.
- **Trigger action:** single primary button "Claim Badge".
- First click: triggers GitHub OAuth (one-time).
- Next clicks: run immediately.
- Terminal log: shows real-time steps with timestamps. Collapsible.

---

## 8. Development State Switcher Spec
For rapid visual testing without live GitHub API throttling:
- `pre-scan` (Sample profile cabinet)
- `post-scan-clean` (All 5 badges available)
- `post-scan-partial` (2 earned, 1 processing, 2 available)
- `post-scan-all-earned` (5 of 5 unlocked)
- `state-rate-limited` (GitHub 429 response)
- `state-user-not-found` (404 friendly recovery)
