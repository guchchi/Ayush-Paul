import React, { useState } from 'react';
import { Sparkles, Terminal, CheckCircle2, AlertCircle, Clock, ShieldCheck, Box, MoveRight, ArrowRight, RefreshCw, Lock } from 'lucide-react';

export function StyleguidePage() {
  const [activeTab, setActiveTab] = useState<'all' | 'colors' | 'typography' | 'spacing' | 'buttons' | 'motion'>('all');

  const surfaceTokens = [
    { name: '--bg', hex: '#0D1117', desc: 'Canvas background (soft charcoal, never pure black)', border: '#30363D' },
    { name: '--surface', hex: '#161B22', desc: 'Cards, drawers, modals', border: '#30363D' },
    { name: '--surface-2', hex: '#1C2230', desc: 'Raised surface, hover states', border: '#30363D' },
    { name: '--border', hex: '#30363D', desc: '1px structural boundaries', border: '#484F58' },
  ];

  const textTokens = [
    { name: '--text', hex: '#E6EDF3', desc: 'High-contrast text (never pure white)', bg: '#0D1117' },
    { name: '--text-muted', hex: '#8B949E', desc: 'Secondary labels, subtitles, time estimates', bg: '#0D1117' },
  ];

  const semanticTokens = [
    {
      name: '--action',
      hex: '#C6FF3D',
      label: 'Lime (Action)',
      meaning: 'Do this / Click here',
      rules: 'Primary buttons, key links, focus ring only. Never decorative.',
      textColor: '#0D1117',
    },
    {
      name: '--on-action',
      hex: '#0D1117',
      label: 'On-Action',
      meaning: 'High-contrast text on lime',
      rules: 'Always paired with --action buttons for WCAG AAA legibility.',
      textColor: '#E6EDF3',
    },
    {
      name: '--earned',
      hex: '#F5C451',
      label: 'Gold (Earned)',
      meaning: 'Trophy unlocked',
      rules: 'Earned badge glow and earned status pill only.',
      textColor: '#0D1117',
    },
    {
      name: '--processing',
      hex: '#4DA3FF',
      label: 'Blue (Processing)',
      meaning: 'Waiting for GitHub',
      rules: 'Pending background indexing pulses only.',
      textColor: '#0D1117',
    },
    {
      name: '--danger',
      hex: '#FF6B6B',
      label: 'Red (Failed / Error)',
      meaning: 'Action failed / Rate limit',
      rules: 'Failure states and critical alerts only.',
      textColor: '#0D1117',
    },
  ];

  const spacingTokens = [
    { name: '--space-1', value: '8px', label: '1 unit (8px)' },
    { name: '--space-2', value: '16px', label: '2 units (16px)' },
    { name: '--space-3', value: '24px', label: '3 units (24px)' },
    { name: '--space-4', value: '32px', label: '4 units (32px)' },
    { name: '--space-6', value: '48px', label: '6 units (48px)' },
    { name: '--space-8', value: '64px', label: '8 units (64px)' },
  ];

  const radiusTokens = [
    { name: '--radius-control', value: '12px', desc: 'Controls, inputs, standard buttons' },
    { name: '--radius-card', value: '16px', desc: 'Cards, drawers, modals' },
    { name: '--radius-full', value: '9999px', desc: 'Pills, badges, avatars' },
  ];

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--text)] font-sans p-4 sm:p-6 md:p-10 lg:p-12 selection:bg-[var(--action)] selection:text-[var(--on-action)]">
      {/* Header */}
      <header className="max-w-[1200px] mx-auto pb-8 border-b border-[var(--border)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[var(--surface-2)] border border-[var(--border)] text-[var(--action)] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GitGlow DESIGN.md · Foundation Spec (Phase 1)</span>
            </div>
            <h1 className="type-hero-headline text-[var(--text)] tracking-tight">
              Design Foundation Styleguide
            </h1>
            <p className="type-body text-[var(--text-muted)] mt-2 max-w-[70ch]">
              Single source of truth for color tokens, typography scales, 8px grid spacing, border radii, and button samples.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1.5 rounded-[var(--radius-control)] bg-[var(--surface)] border border-[var(--border)] text-xs font-mono text-[var(--text-muted)]">
              Viewport: Responsive (375px · 768px · 1280px)
            </span>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap gap-2 mt-6">
          {(['all', 'colors', 'typography', 'spacing', 'buttons', 'motion'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-[var(--radius-control)] text-xs font-medium capitalize transition-all duration-[var(--duration-fast)] ${
                activeTab === tab
                  ? 'bg-[var(--action)] text-[var(--on-action)] font-bold shadow-[var(--glow-action)]'
                  : 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1200px] mx-auto py-8 space-y-12">
        {/* SECTION 1: COLOR SYSTEM */}
        {(activeTab === 'all' || activeTab === 'colors') && (
          <section id="colors" className="space-y-6">
            <div className="border-b border-[var(--border)] pb-3">
              <h2 className="type-section-title text-[var(--text)]">1. Color System (DESIGN.md §3)</h2>
              <p className="type-body text-[var(--text-muted)] mt-1">
                Colors carry functional meaning, never decoration. No pure <code className="text-xs bg-[var(--surface)] px-1.5 py-0.5 rounded border border-[var(--border)]">#000</code> or <code className="text-xs bg-[var(--surface)] px-1.5 py-0.5 rounded border border-[var(--border)]">#FFF</code>.
              </p>
            </div>

            {/* Surfaces */}
            <div>
              <h3 className="type-card-title text-[var(--text)] mb-3 flex items-center gap-2">
                <Box className="w-5 h-5 text-[var(--text-muted)]" />
                <span>Surface Layers</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {surfaceTokens.map(token => (
                  <div
                    key={token.name}
                    className="p-4 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] space-y-3"
                  >
                    <div
                      className="h-20 w-full rounded-[var(--radius-control)] border shadow-inner flex items-center justify-center font-mono text-xs font-bold"
                      style={{ backgroundColor: token.hex, borderColor: token.border, color: '#E6EDF3' }}
                    >
                      {token.hex}
                    </div>
                    <div>
                      <div className="font-mono text-sm font-bold text-[var(--text)]">{token.name}</div>
                      <div className="text-xs text-[var(--text-muted)] mt-0.5 leading-snug">{token.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Semantic Tokens */}
            <div>
              <h3 className="type-card-title text-[var(--text)] mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--action)]" />
                <span>Semantic & Purpose-Driven Colors</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 gap-4">
                {semanticTokens.map((token, idx) => (
                  <div
                    key={token.name}
                    className={`p-5 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] space-y-3 relative overflow-hidden ${
                      idx < 2 ? 'md:col-span-3 lg:col-span-1' : 'md:col-span-2 lg:col-span-1'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="h-14 w-24 rounded-[var(--radius-control)] border flex items-center justify-center font-mono text-xs font-bold shadow-sm"
                        style={{ backgroundColor: token.hex, color: token.textColor, borderColor: 'rgba(255,255,255,0.1)' }}
                      >
                        {token.hex}
                      </div>
                      <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)]">
                        {token.name}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[var(--text)] flex items-center gap-1.5">
                        {token.label}
                      </h4>
                      <p className="text-xs text-[var(--text)] font-medium mt-1">Meaning: &ldquo;{token.meaning}&rdquo;</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">{token.rules}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Text Tokens */}
            <div>
              <h3 className="type-card-title text-[var(--text)] mb-3">Text Tokens</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {textTokens.map(token => (
                  <div
                    key={token.name}
                    className="p-4 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] flex items-center gap-4"
                  >
                    <div
                      className="h-16 w-16 shrink-0 rounded-[var(--radius-control)] border border-[var(--border)] flex items-center justify-center font-bold text-lg"
                      style={{ backgroundColor: token.hex, color: '#0D1117' }}
                    >
                      Aa
                    </div>
                    <div>
                      <div className="font-mono text-sm font-bold text-[var(--text)]">{token.name} ({token.hex})</div>
                      <div className="text-xs text-[var(--text-muted)] mt-0.5">{token.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2: TYPOGRAPHY HIERARCHY */}
        {(activeTab === 'all' || activeTab === 'typography') && (
          <section id="typography" className="space-y-6">
            <div className="border-b border-[var(--border)] pb-3">
              <h2 className="type-section-title text-[var(--text)]">2. Typography Hierarchy (DESIGN.md §4)</h2>
              <p className="type-body text-[var(--text-muted)] mt-1">
                Strict 3 families (Space Grotesk, Inter, JetBrains Mono). Weights strictly 400, 500, 700. Self-hosted Latin subsets with font-display: swap.
              </p>
            </div>

            {/* Font Family Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)]">
                <span className="text-xs font-mono text-[var(--action)] font-bold">HEADINGS (700)</span>
                <h3 className="text-xl font-bold font-heading text-[var(--text)] mt-1">Space Grotesk</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">self-hosted · Latin subset · swap</p>
                <div className="mt-3 p-3 rounded-[var(--radius-control)] bg-[var(--bg)] border border-[var(--border)] font-heading text-lg font-bold">
                  Make Your GitHub Profile Stand Out in Minutes.
                </div>
              </div>

              <div className="p-4 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)]">
                <span className="text-xs font-mono text-[var(--action)] font-bold">BODY & UI (400, 500)</span>
                <h3 className="text-xl font-bold font-sans text-[var(--text)] mt-1">Inter</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">self-hosted · Latin subset · swap</p>
                <div className="mt-3 p-3 rounded-[var(--radius-control)] bg-[var(--bg)] border border-[var(--border)] font-sans text-sm">
                  Scan any public username for free, then claim badges with one click.
                </div>
              </div>

              <div className="p-4 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)]">
                <span className="text-xs font-mono text-[var(--action)] font-bold">TERMINAL & CODE (400)</span>
                <h3 className="text-xl font-bold font-code text-[var(--text)] mt-1">JetBrains Mono</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">self-hosted · Latin subset · swap</p>
                <div className="mt-3 p-3 rounded-[var(--radius-control)] bg-[var(--bg)] border border-[var(--border)] font-code text-xs text-[var(--action)]">
                  $ git commit -m &quot;feat: galaxy brain&quot;
                </div>
              </div>
            </div>

            {/* Type Scale Demonstration */}
            <div className="p-6 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] space-y-6">
              <div className="border-b border-[var(--border)] pb-2 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">Scale Item</span>
                <span className="text-xs font-mono text-[var(--text-muted)]">Desktop / Mobile Spec</span>
              </div>

              {/* Hero Headline */}
              <div className="space-y-1">
                <div className="flex items-baseline justify-between text-xs font-mono text-[var(--text-muted)]">
                  <span>Hero Headline (.type-hero-headline)</span>
                  <span>56-64px (desktop) / 36-40px (mobile) · 700</span>
                </div>
                <div className="type-hero-headline text-[var(--text)]">
                  Make Your GitHub Profile Stand Out in Minutes.
                </div>
              </div>

              {/* Section Title */}
              <div className="space-y-1 pt-4 border-t border-[var(--border)]">
                <div className="flex items-baseline justify-between text-xs font-mono text-[var(--text-muted)]">
                  <span>Section Title (.type-section-title)</span>
                  <span>36-40px (desktop) / 28px (mobile) · 700</span>
                </div>
                <div className="type-section-title text-[var(--text)]">
                  Five Unlocked Badges in Scope
                </div>
              </div>

              {/* Card Title */}
              <div className="space-y-1 pt-4 border-t border-[var(--border)]">
                <div className="flex items-baseline justify-between text-xs font-mono text-[var(--text-muted)]">
                  <span>Card Title (.type-card-title)</span>
                  <span>20-24px (desktop) / 18-20px (mobile) · 700</span>
                </div>
                <div className="type-card-title text-[var(--text)]">
                  Pull Shark · Submit 2 pull requests that are merged
                </div>
              </div>

              {/* Body */}
              <div className="space-y-1 pt-4 border-t border-[var(--border)]">
                <div className="flex items-baseline justify-between text-xs font-mono text-[var(--text-muted)]">
                  <span>Body Copy (.type-body)</span>
                  <span>16-18px (desktop) / 16px (mobile) · 400 · Line-height 1.6</span>
                </div>
                <p className="type-body text-[var(--text-muted)] max-w-[70ch]">
                  GitGlow checks public GitHub activity. It never asks for your password. Every action happens on your own account.
                </p>
              </div>

              {/* Small / Labels */}
              <div className="space-y-1 pt-4 border-t border-[var(--border)]">
                <div className="flex items-baseline justify-between text-xs font-mono text-[var(--text-muted)]">
                  <span>Small / Labels (.type-label)</span>
                  <span>14px · 500 (medium) · Line-height 1.4</span>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                  <span className="type-label px-3 py-1 rounded-full bg-[rgba(245,196,81,0.1)] text-[var(--earned)] border border-[rgba(245,196,81,0.3)] inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> On your profile ✓
                  </span>
                  <span className="type-label px-3 py-1 rounded-full bg-[rgba(77,163,255,0.1)] text-[var(--processing)] border border-[rgba(77,163,255,0.3)] inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 animate-spin" /> Waiting for GitHub
                  </span>
                  <span className="type-label px-3 py-1 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)] inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Claim in ~2 min
                  </span>
                </div>
              </div>

              {/* Terminal */}
              <div className="space-y-1 pt-4 border-t border-[var(--border)]">
                <div className="flex items-baseline justify-between text-xs font-mono text-[var(--text-muted)]">
                  <span>Terminal / Code (.type-terminal)</span>
                  <span>14px (desktop) / 13px (mobile) · 400</span>
                </div>
                <div className="type-terminal p-4 rounded-[var(--radius-control)] bg-[var(--bg)] border border-[var(--border)] text-[var(--action)] font-mono space-y-1">
                  <div>[14:22:01] ⚡ Initializing GitHub GraphQL scanner...</div>
                  <div>[14:22:02] ✓ Found user profile: @ayushpaul</div>
                  <div>[14:22:03] 🥇 Badges detected: Pull Shark (Earned), Quickdraw (Earned)</div>
                </div>
              </div>

              {/* Tabular Numerals */}
              <div className="space-y-1 pt-4 border-t border-[var(--border)]">
                <div className="flex items-baseline justify-between text-xs font-mono text-[var(--text-muted)]">
                  <span>Tabular Numerals (.tabular-nums)</span>
                  <span>Prevents layout jitter during score count-up</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 text-2xl sm:text-3xl font-heading font-bold text-[var(--action)] tabular-nums">
                  <span className="whitespace-nowrap">Score: 84 / 100</span>
                  <span className="text-xs font-mono text-[var(--text-muted)] font-normal whitespace-nowrap">
                    (Numbers remain fixed in width)
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 3: SPACING (8px BASE UNIT) & RADII */}
        {(activeTab === 'all' || activeTab === 'spacing') && (
          <section id="spacing" className="space-y-6">
            <div className="border-b border-[var(--border)] pb-3">
              <h2 className="type-section-title text-[var(--text)]">3. Spacing & Shapes (DESIGN.md §5)</h2>
              <p className="type-body text-[var(--text-muted)] mt-1">
                Strict 8px grid (8, 16, 24, 32, 48, 64px) and rounded radii (12px controls, 16px cards, 9999px pills).
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Spacing Bars */}
              <div className="p-6 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] space-y-4">
                <h3 className="type-card-title text-[var(--text)]">8px Base Grid Scale</h3>
                <div className="space-y-3">
                  {spacingTokens.map(s => (
                    <div key={s.name} className="flex items-center gap-4">
                      <div className="w-24 text-xs font-mono text-[var(--text-muted)] shrink-0">{s.name} ({s.value})</div>
                      <div className="flex-1 bg-[var(--surface-2)] rounded-[var(--radius-control)] h-8 flex items-center px-2 border border-[var(--border)]">
                        <div
                          className="h-4 bg-[var(--action)] rounded-[4px]"
                          style={{ width: s.value }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radii Cards */}
              <div className="p-6 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] space-y-4">
                <h3 className="type-card-title text-[var(--text)]">Border Radii Tokens</h3>
                <div className="space-y-3">
                  {radiusTokens.map(r => (
                    <div
                      key={r.name}
                      className="p-4 border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between"
                      style={{ borderRadius: r.value }}
                    >
                      <div>
                        <div className="font-mono text-sm font-bold text-[var(--text)]">{r.name} ({r.value})</div>
                        <div className="text-xs text-[var(--text-muted)] mt-0.5">{r.desc}</div>
                      </div>
                      <div
                        className="w-12 h-12 bg-[var(--action)] flex items-center justify-center text-[var(--on-action)] font-bold text-xs"
                        style={{ borderRadius: r.value }}
                      >
                        {r.value === '9999px' ? 'Pill' : r.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 4: BUTTON SAMPLES */}
        {(activeTab === 'all' || activeTab === 'buttons') && (
          <section id="buttons" className="space-y-6">
            <div className="border-b border-[var(--border)] pb-3">
              <h2 className="type-section-title text-[var(--text)]">4. Button Samples (DESIGN.md §3, §5, §7.4)</h2>
              <p className="type-body text-[var(--text-muted)] mt-1">
                Lime is action only. Buttons follow 12px radius, active scale-down, explicit state copy, and WCAG AAA contrast.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Primary Action Button */}
              <div className="p-6 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--action)] font-bold">PRIMARY CTA</span>
                  <span className="text-xs font-mono text-[var(--text-muted)]">--action (Lime)</span>
                </div>
                <h3 className="text-base font-bold text-[var(--text)]">Primary Claim & Scan Action</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Electric lime background (`#C6FF3D`) with charcoal text (`#0D1117`). Reserved for primary conversion steps.
                </p>
                <div className="space-y-2 pt-2">
                  <button className="w-full py-3 px-4 rounded-[var(--radius-control)] bg-[var(--action)] text-[var(--on-action)] font-bold text-sm shadow-[var(--glow-action)] hover:brightness-105 active:scale-[0.98] transition-all duration-[var(--duration-fast)] flex items-center justify-center gap-2">
                    <span>Claim with 1-Click Bot</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="w-full py-2.5 px-4 rounded-[var(--radius-control)] bg-[var(--action)] text-[var(--on-action)] font-bold text-sm shadow-[var(--glow-action)] hover:brightness-105 active:scale-[0.98] transition-all duration-[var(--duration-fast)]">
                    Audit Free
                  </button>
                </div>
              </div>

              {/* Secondary Action */}
              <div className="p-6 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--text-muted)] font-bold">SECONDARY ACTION</span>
                  <span className="text-xs font-mono text-[var(--text-muted)]">--surface-2</span>
                </div>
                <h3 className="text-base font-bold text-[var(--text)]">Secondary Navigation & Manual</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Deep charcoal background (`#1C2230`) with border (`#30363D`) and light text (`#E6EDF3`).
                </p>
                <div className="space-y-2 pt-2">
                  <button className="w-full py-3 px-4 rounded-[var(--radius-control)] bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--border)] active:scale-[0.98] transition-all duration-[var(--duration-fast)] text-sm font-medium">
                    Do it manually
                  </button>
                  <button className="w-full py-2.5 px-4 rounded-[var(--radius-control)] bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--border)] active:scale-[0.98] transition-all duration-[var(--duration-fast)] text-sm font-medium">
                    Read full badge guide
                  </button>
                </div>
              </div>

              {/* Ghost Link Button */}
              <div className="p-6 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--text-muted)] font-bold">GHOST / LINK</span>
                  <span className="text-xs font-mono text-[var(--text-muted)]">--text-muted</span>
                </div>
                <h3 className="text-base font-bold text-[var(--text)]">Subtle In-Context Links</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Muted text (`#8B949E`) with hover reveal to primary text (`#E6EDF3`) and smooth underline.
                </p>
                <div className="space-y-3 pt-2">
                  <a href="#rules" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors duration-[var(--duration-fast)] group">
                    <span>How is score calculated?</span>
                    <MoveRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </a>
                  <div>
                    <button className="px-3 py-1.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-transparent text-xs text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--text-muted)] transition-all">
                      Revoke OAuth access
                    </button>
                  </div>
                </div>
              </div>

              {/* Drawer Six Button States Showcase */}
              <div className="p-6 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] space-y-4 md:col-span-2 lg:col-span-3">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                  <div>
                    <span className="text-xs font-mono text-[var(--action)] font-bold">DRAWER BUTTON STATES (DESIGN.md §7.4)</span>
                    <h3 className="text-lg font-bold text-[var(--text)] mt-0.5">The 6 Drawer Execution States</h3>
                  </div>
                  <span className="text-xs font-mono text-[var(--text-muted)]">Section 7.4 Spec</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* 1. Available */}
                  <div className="p-4 rounded-[var(--radius-control)] bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                      <span>1. Available</span>
                      <span className="text-[var(--action)]">Ready</span>
                    </div>
                    <button className="w-full py-2 px-3 rounded-[var(--radius-control)] bg-[var(--action)] text-[var(--on-action)] font-bold text-xs shadow-[var(--glow-action)] flex items-center justify-center gap-1.5">
                      <span>Claim with 1-Click Bot</span>
                    </button>
                  </div>

                  {/* 2. Not Logged In */}
                  <div className="p-4 rounded-[var(--radius-control)] bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                      <span>2. Not Logged In</span>
                      <span>Auth required</span>
                    </div>
                    <button className="w-full py-2 px-3 rounded-[var(--radius-control)] bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--action)] font-medium text-xs flex items-center justify-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[var(--action)]" />
                      <span>Connect GitHub to claim</span>
                    </button>
                  </div>

                  {/* 3. Running */}
                  <div className="p-4 rounded-[var(--radius-control)] bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                      <span>3. Running</span>
                      <span className="text-[var(--processing)]">Active</span>
                    </div>
                    <button className="w-full py-2 px-3 rounded-[var(--radius-control)] bg-[rgba(77,163,255,0.15)] text-[var(--processing)] border border-[rgba(77,163,255,0.4)] font-medium text-xs flex items-center justify-center gap-1.5 cursor-wait">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Executing step 2/3...</span>
                    </button>
                  </div>

                  {/* 4. Processing */}
                  <div className="p-4 rounded-[var(--radius-control)] bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                      <span>4. Processing</span>
                      <span className="text-[var(--processing)]">Waiting</span>
                    </div>
                    <div className="py-2 px-3 rounded-[var(--radius-control)] bg-[var(--surface)] text-[var(--processing)] border border-[rgba(77,163,255,0.3)] text-xs text-center leading-tight">
                      Done on your side. Waiting for GitHub (hours to days).
                    </div>
                  </div>

                  {/* 5. Earned */}
                  <div className="p-4 rounded-[var(--radius-control)] bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                      <span>5. Earned</span>
                      <span className="text-[var(--earned)]">Unlocked</span>
                    </div>
                    <button className="w-full py-2 px-3 rounded-[var(--radius-control)] bg-[rgba(245,196,81,0.15)] text-[var(--earned)] border border-[rgba(245,196,81,0.4)] font-medium text-xs flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>On your profile (Share)</span>
                    </button>
                  </div>

                  {/* 6. Failed */}
                  <div className="p-4 rounded-[var(--radius-control)] bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                      <span>6. Failed</span>
                      <span className="text-[var(--danger)]">Error</span>
                    </div>
                    <button className="w-full py-2 px-3 rounded-[var(--radius-control)] bg-[rgba(255,107,107,0.15)] text-[var(--danger)] border border-[rgba(255,107,107,0.4)] font-bold text-xs flex items-center justify-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Rate limit reached · Try again</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 5: FOCUS RING, SHADOWS & MOTION */}
        {(activeTab === 'all' || activeTab === 'motion') && (
          <section id="motion" className="space-y-6">
            <div className="border-b border-[var(--border)] pb-3">
              <h2 className="type-section-title text-[var(--text)]">5. Focus Ring, Shadows & Motion (DESIGN.md §3, §5)</h2>
              <p className="type-body text-[var(--text-muted)] mt-1">
                Lime focus ring, soft glow for earned and action items, 150-300ms transitions with cubic-bezier(0.2, 0.8, 0.2, 1).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Focus Ring Demo */}
              <div className="p-6 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] space-y-4">
                <span className="text-xs font-mono text-[var(--action)] font-bold">FOCUS RING (LIME)</span>
                <h3 className="text-lg font-bold text-[var(--text)]">Keyboard Focus Test</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] font-mono text-xs">Tab</kbd> to inspect the 2px electric lime focus outline with 2px offset.
                </p>
                <div className="space-y-3 pt-2">
                  <button className="w-full py-2.5 px-4 rounded-[var(--radius-control)] bg-[var(--action)] text-[var(--on-action)] font-bold text-sm shadow-[var(--glow-action)]">
                    Primary CTA Button
                  </button>
                  <input
                    type="text"
                    placeholder="Input (min 16px font-size)"
                    className="w-full py-2.5 px-4 rounded-[var(--radius-control)] bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-base"
                    defaultValue="@octocat"
                  />
                </div>
              </div>

              {/* Glow Shadows */}
              <div className="p-6 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] space-y-4">
                <span className="text-xs font-mono text-[var(--earned)] font-bold">GLOW SHADOWS</span>
                <h3 className="text-lg font-bold text-[var(--text)]">Semantic Glow Effects</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Minimal shadows. Soft glow is strictly reserved for earned trophies and primary actions.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="p-3.5 rounded-[var(--radius-control)] bg-[var(--surface-2)] border border-[rgba(245,196,81,0.4)] shadow-[var(--glow-earned)] flex items-center justify-between text-xs font-bold text-[var(--earned)]">
                    <span>--glow-earned (Gold)</span>
                    <span>Unlocked 🥇</span>
                  </div>
                  <div className="p-3.5 rounded-[var(--radius-control)] bg-[var(--surface-2)] border border-[rgba(198,255,61,0.4)] shadow-[var(--glow-action)] flex items-center justify-between text-xs font-bold text-[var(--action)]">
                    <span>--glow-action (Lime)</span>
                    <span>Active Action 🟢</span>
                  </div>
                </div>
              </div>

              {/* Motion Easing */}
              <div className="p-6 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] space-y-4">
                <span className="text-xs font-mono text-[var(--processing)] font-bold">MOTION CURVE</span>
                <h3 className="text-lg font-bold text-[var(--text)]">cubic-bezier(0.2, 0.8, 0.2, 1)</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Snappy 150ms hover / 250ms slide / 300ms unlock. Reduces to simple fade when prefers-reduced-motion is active.
                </p>
                <div className="pt-2">
                  <button className="w-full py-2.5 px-4 rounded-[var(--radius-control)] bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--action)] hover:text-[var(--action)] transition-all duration-[var(--duration-fast)] ease-[var(--ease-gitglow)] flex items-center justify-center gap-2 text-sm font-medium group">
                    <span>Hover to Test Curve</span>
                    <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-[1200px] mx-auto pt-8 mt-12 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-muted)]">
        <div>GitGlow Design System · Phase 1 Foundation Approved</div>
        <div>Complies with DESIGN.md Sections 3, 4, 5</div>
      </footer>
    </div>
  );
}
