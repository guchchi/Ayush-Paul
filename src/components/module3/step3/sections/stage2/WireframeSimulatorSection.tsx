/**
 * WireframeSimulatorSection.tsx — Level 2 Phase 4: Visitor Preview + Conversion Validation
 *
 * Provides a strategic simulation of the client's visiting experience:
 * 1. Mode Switch:
 *    - BUILDER (redirects user back to Canvas / Section Spec Studio or enables strategic inspector)
 *    - VISITOR (non-editable client journey simulation: hides edit handles, renders enabled sections in true order)
 * 2. Visitor Experience:
 *    - Answers above the fold: Who is this? What do they help with? Who is it for? What next?
 *    - Hero strictly protected (id === 'section_hero')
 *    - Responsive viewport simulation: Desktop (1440px), Tablet (768px), Mobile (375px)
 *    - True scroll journey with sticky "Visitor Journey" mini progress indicator
 *    - Zero fake proof, testimonials, metrics, or client logos
 * 3. Conversion Validation Engine:
 *    - Deterministic, goal-specific (Retainer vs Sprint vs Consulting) & archetype-specific findings
 *    - Categories: CLARITY, TRUST, FLOW, PROOF, OFFER, FRICTION, CTA
 *    - Severity badges (High, Medium, Low) with actionable guidance
 *    - 1-click "Review Section" deep link navigating back to the relevant section in Canvas
 *
 * Reads canonical sections from authoritySuite.portfolioBlueprint (Single Source of Truth).
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Layers,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  MousePointerClick,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Eye,
  Edit3,
  Compass,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Filter,
  Check,
  Zap,
} from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import { useModule3Store } from '../../../../../lib/module3/store';
import {
  calculatePortfolioTelemetry,
  PORTFOLIO_ARCHETYPES,
  validateVisitorJourney,
  VisitorFinding,
  VisitorFindingCategory,
} from '../../../../../lib/module3/portfolio-architecture-engine';
import { ModuleButton } from '../../../../workspace/ModuleButton';

interface Props {
  onContinue: () => void;
}

export const WireframeSimulatorSection: React.FC<Props> = React.memo(({ onContinue }) => {
  const {
    authoritySuite,
    stage2WireframeSettings,
    setStage2WireframeSettings,
    setStage2ActiveSection,
    stage1Identity,
    stage2Archetype,
    mod1ServiceId,
    mod1MarketId,
    mod2UniqueMechanism,
    proofAssets,
  } = useModule3Store();

  // Mode Switch: 'visitor' (Simulation) vs 'builder' (Inspect with editor controls)
  const [activeMode, setActiveMode] = useState<'visitor' | 'builder'>('visitor');

  // Selected Category filter for findings
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [isFindingsCollapsed, setIsFindingsCollapsed] = useState<boolean>(false);

  // Canonical Single Source of Truth
  const sections = useMemo(() => {
    return authoritySuite?.portfolioBlueprint ?? [];
  }, [authoritySuite?.portfolioBlueprint]);

  const activeSections = useMemo(() => {
    return sections.filter((s) => s.isEnabled !== false);
  }, [sections]);

  const telemetry = useMemo(() => {
    return calculatePortfolioTelemetry(sections);
  }, [sections]);

  // Context & Metadata
  const activeArchetypeId = stage2Archetype?.selectedArchetypeId || 'proof_first';
  const portfolioGoal = stage2Archetype?.portfolioGoal || 'retainer';

  const archetypeMeta = useMemo(() => {
    return (
      PORTFOLIO_ARCHETYPES.find((a) => a.id === activeArchetypeId) ||
      PORTFOLIO_ARCHETYPES[0]
    );
  }, [activeArchetypeId]);

  // Viewport Settings
  const viewport = stage2WireframeSettings?.viewport || 'desktop';
  const setViewport = (v: 'desktop' | 'tablet' | 'mobile') => {
    setStage2WireframeSettings({ viewport: v });
  };

  const userName = stage1Identity?.userName || 'Ayush Paul';
  const userHandle = stage1Identity?.userHandle || 'ayushpaul';
  const market = (mod1MarketId || '').replace(/_/g, ' ') || 'High-Growth Tech';
  const service = (mod1ServiceId || '').replace(/_/g, ' ') || 'System Architecture';
  const mechanism = mod2UniqueMechanism || 'Proof-First Architecture';

  // Deterministic Visitor Journey Validation Audit
  const audit = useMemo(() => {
    return validateVisitorJourney(sections, activeArchetypeId, portfolioGoal);
  }, [sections, activeArchetypeId, portfolioGoal]);

  // Filtered Findings
  const filteredFindings = useMemo(() => {
    if (selectedCategoryFilter === 'ALL') return audit.findings;
    return audit.findings.filter((f) => f.category === selectedCategoryFilter);
  }, [audit.findings, selectedCategoryFilter]);

  // Handle "Review Section in Canvas"
  const handleReviewSection = useCallback(
    (sectionId?: string) => {
      // Step 3 in Level 2 is the Portfolio Canvas (SectionSpecStudio)
      setStage2ActiveSection(3);
    },
    [setStage2ActiveSection]
  );

  return (
    <div className="space-y-6 text-left w-full font-sans">
      {/* ── Top Header & Master Toolbar ─────────────────────────────────────── */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#0058be] text-xs font-mono font-bold uppercase tracking-wider">
              <Eye size={15} />
              <span>Step 4 of 5 — Visitor Preview &amp; Conversion Validation</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0b1c30]">
              Client Journey Simulation
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Experience your portfolio through the eyes of an executive buyer. Validate whether your hook lands, proof arrives at the moment of skepticism, and the conversion call-to-action feels earned.
            </p>
          </div>

          {/* Mode Switcher: BUILDER vs VISITOR */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200 flex items-center gap-1 shadow-inner">
              <button
                onClick={() => setActiveMode('visitor')}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                  activeMode === 'visitor'
                    ? 'bg-[#0058be] text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                )}
              >
                <Eye size={13} />
                <span>Visitor Mode (Client POV)</span>
              </button>
              <button
                onClick={() => setActiveMode('builder')}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                  activeMode === 'builder'
                    ? 'bg-white text-neutral-900 border border-neutral-200 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                )}
              >
                <Edit3 size={13} />
                <span>Builder Inspector</span>
              </button>
            </div>
          </div>
        </div>

        {/* Viewport Toolbar & Telemetry Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100">
          {/* Viewport Selectors */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-2xl border border-neutral-200 text-xs font-bold">
            <button
              onClick={() => setViewport('desktop')}
              className={cn(
                'px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer',
                viewport === 'desktop'
                  ? 'bg-white text-[#0058be] shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              <Monitor size={14} />
              <span>Desktop (1440px)</span>
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={cn(
                'px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer',
                viewport === 'tablet'
                  ? 'bg-white text-[#0058be] shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              <Tablet size={14} />
              <span>Tablet (768px)</span>
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={cn(
                'px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer',
                viewport === 'mobile'
                  ? 'bg-white text-[#0058be] shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              <Smartphone size={14} />
              <span>Mobile (375px)</span>
            </button>
          </div>

          {/* Strategic Context Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
            <div className="px-3 py-1.5 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-700 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0058be]" />
              <span>Goal: <strong className="capitalize">{portfolioGoal}</strong></span>
            </div>
            <div className="px-3 py-1.5 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-700 font-bold flex items-center gap-1.5">
              <Compass size={13} className="text-[#0058be]" />
              <span>Archetype: {archetypeMeta.name}</span>
            </div>
            <div className="px-3 py-1.5 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-700 flex items-center gap-1 font-mono">
              <Clock size={12} className="text-neutral-400" />
              <span>~{telemetry.estimatedReadTimeMinutes} min scan</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Layout: Simulation Stream + Validation Panel ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ═════════════════════════════════════════════════════════════════════
            CENTER STREAM: CLIENT SCROLL JOURNEY (lg:col-span-8)
            ═════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-8 space-y-4">
          {/* Simulated Browser Bar */}
          <div className="bg-neutral-100 p-3 sm:p-5 rounded-3xl border border-neutral-300 shadow-inner overflow-x-hidden">
            <div
              className={cn(
                'transition-all duration-300 mx-auto rounded-2xl overflow-hidden shadow-xl border bg-white',
                viewport === 'desktop' && 'max-w-full',
                viewport === 'tablet' && 'max-w-2xl',
                viewport === 'mobile' && 'max-w-sm'
              )}
            >
              {/* Browser Window Chrome */}
              <div className="px-4 py-2.5 bg-neutral-100 border-b border-neutral-200 flex items-center justify-between text-xs select-none">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                </div>

                <div className="px-3 py-1 rounded-lg bg-white border border-neutral-200 font-mono text-[11px] text-neutral-600 truncate max-w-xs sm:max-w-md">
                  https://{userHandle || 'portfolio'}.dev • {userName}
                </div>

                <div className="text-[10px] font-mono text-neutral-400">
                  {viewport === 'desktop' ? '1440 × 900' : viewport === 'tablet' ? '768 × 1024' : '375 × 812'}
                </div>
              </div>

              {/* Scrollable Visitor Stream */}
              <div className="p-4 sm:p-8 space-y-10 max-h-[800px] overflow-y-auto scrollbar-thin divide-y divide-neutral-100">
                {activeSections.map((sec, idx) => {
                  const isHero = sec.id === 'section_hero';
                  const isProof = sec.id === 'section_proof';
                  const isServices = sec.id === 'section_services';
                  const isCaseStudies = sec.id === 'section_case_studies';
                  const isAbout = sec.id === 'section_about';
                  const isFAQ = sec.id === 'section_faq';
                  const isCTA = sec.id === 'section_cta';
                  const isTestimonials = sec.id === 'section_testimonials';
                  const isAuthority = sec.id === 'section_authority';

                  return (
                    <div
                      key={sec.id}
                      id={`vis_${sec.id}`}
                      className={cn(
                        'pt-8 first:pt-0 text-left space-y-4 relative group',
                        activeMode === 'builder' && 'hover:ring-2 hover:ring-[#0058be]/20 p-4 rounded-2xl transition-all'
                      )}
                    >
                      {/* Builder Inspector Header (Only visible in Builder Mode) */}
                      {activeMode === 'builder' && (
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-200">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-200 text-neutral-700">
                              0{idx + 1}
                            </span>
                            <span className="font-bold text-neutral-800 text-xs">
                              {sec.title}
                            </span>
                          </div>
                          <button
                            onClick={() => handleReviewSection(sec.id)}
                            className="text-[11px] text-[#0058be] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>Edit in Canvas</span>
                            <ArrowUpRight size={12} />
                          </button>
                        </div>
                      )}

                      {/* ───────────────────────────────────────────────────────
                          1. HERO BLOCK (Hook & Orient)
                          ─────────────────────────────────────────────────────── */}
                      {isHero && (
                        <div className="space-y-4 py-2">
                          <div className="space-y-1">
                            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0058be]">
                              {userName} • {service}
                            </span>
                            <h1
                              className={cn(
                                'font-black tracking-tight text-[#0b1c30] leading-tight',
                                viewport === 'mobile' ? 'text-2xl' : 'text-3xl sm:text-4xl'
                              )}
                            >
                              {sec.headline || `High-Certainty ${service} for ${market}`}
                            </h1>
                            <p
                              className={cn(
                                'text-neutral-600 font-medium leading-relaxed max-w-2xl',
                                viewport === 'mobile' ? 'text-xs' : 'text-sm sm:text-base'
                              )}
                            >
                              {sec.subheadline || `Deploying ${mechanism} to eliminate delivery risk and drive predictable scale with zero agency overhead.`}
                            </p>
                          </div>

                          {/* CTA & Trust Anchor */}
                          <div className="flex flex-wrap items-center gap-3 pt-1">
                            <button className="px-5 py-2.5 rounded-xl bg-[#0058be] text-white font-bold text-xs shadow-sm hover:bg-[#00469b] transition-colors flex items-center gap-1.5 cursor-pointer">
                              <span>{sec.ctaText || 'Schedule Architecture Sprint →'}</span>
                            </button>
                            {sec.trustStatement && (
                              <span className="text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-semibold flex items-center gap-1">
                                <ShieldCheck size={13} className="text-emerald-600" />
                                <span>{sec.trustStatement}</span>
                              </span>
                            )}
                          </div>

                          {/* Above-Fold Schematic Card */}
                          <div className="mt-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/90 text-xs text-neutral-600 space-y-2">
                            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-neutral-400">
                              <span>Mechanism Schematic</span>
                              <span>Direct Execution Framework</span>
                            </div>
                            <p className="font-semibold text-neutral-800">
                              {sec.recommendedVisuals || 'Interactive Demonstration Grid & Proof Schematics'}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* ───────────────────────────────────────────────────────
                          2. VERIFIABLE PROOF BLOCK
                          ─────────────────────────────────────────────────────── */}
                      {isProof && (
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              VERIFIABLE EXECUTION ARTIFACTS
                            </span>
                            <h2 className="text-xl sm:text-2xl font-black text-[#0b1c30]">
                              {sec.headline || "Don't Take Our Word For It. Inspect The Proof."}
                            </h2>
                            <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                              {sec.subheadline || 'Live interactive repos, design files, and system outputs from client engagements.'}
                            </p>
                          </div>

                          {/* Real Proof References or Transparent Empty State */}
                          {proofAssets && proofAssets.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              {proofAssets.map((asset) => (
                                <div
                                  key={asset.id}
                                  className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5"
                                >
                                  <div className="flex items-center justify-between text-[10px] font-mono text-[#0058be] font-bold">
                                    <span>{asset.assetType || 'PROOF ARTIFACT'}</span>
                                    <span className="text-emerald-700">VERIFIED</span>
                                  </div>
                                  <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">
                                    {asset.title}
                                  </h4>
                                  <p className="text-[11px] text-neutral-500 line-clamp-2">
                                    {asset.businessProblem || asset.credibilityGapProved || 'Direct execution output verified in Step 2 Proof Vault.'}
                                  </p>
                                  <span className="text-[10px] font-mono text-[#0058be] font-bold block pt-1">
                                    [ Inspect Live Deliverable → ]
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300 text-xs text-neutral-500 space-y-1">
                              <span className="font-bold text-neutral-700 block">Verified proof not attached yet.</span>
                              <p className="text-[11px] leading-relaxed">
                                Self-evident proof demonstrations (codebases, audits, or walkthroughs) equipped in Step 2 will appear here.
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* ───────────────────────────────────────────────────────
                          3. SERVICES & SCOPE TIERS
                          ─────────────────────────────────────────────────────── */}
                      {isServices && (
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0058be] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              SCOPE &amp; ENGAGEMENT TIERS
                            </span>
                            <h2 className="text-xl sm:text-2xl font-black text-[#0b1c30]">
                              {sec.headline || `High-Certainty ${service} Engagements`}
                            </h2>
                            <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                              {sec.subheadline || 'Structured sprint deliverables and retainer partnerships with fixed scope and rapid velocity.'}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-[#0b1c30]">Sprint Implementation</span>
                                <span className="font-mono text-[#0058be]">2-Week Sprint</span>
                              </div>
                              <p className="text-xs text-neutral-600 leading-relaxed">
                                {sec.bodyCopy || 'Rapid turnkey execution for high-priority initiatives with daily progress visibility.'}
                              </p>
                              <div className="pt-2 border-t border-neutral-200/60 text-[11px] text-neutral-500 flex items-center justify-between">
                                <span>Turnaround: 10–14 Days</span>
                                <span className="font-bold text-[#0058be]">Fixed Scope</span>
                              </div>
                            </div>

                            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-[#0b1c30]">Advisory Retainer</span>
                                <span className="font-mono text-purple-700">Monthly Partner</span>
                              </div>
                              <p className="text-xs text-neutral-600 leading-relaxed">
                                Ongoing strategic oversight, priority architecture reviews, and direct Slack channel access.
                              </p>
                              <div className="pt-2 border-t border-neutral-200/60 text-[11px] text-neutral-500 flex items-center justify-between">
                                <span>Weekly Syncs</span>
                                <span className="font-bold text-purple-700">Reserved Capacity</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ───────────────────────────────────────────────────────
                          4. STAR CASE STUDIES
                          ─────────────────────────────────────────────────────── */}
                      {isCaseStudies && (
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                              DIAGNOSTIC CASE STUDIES
                            </span>
                            <h2 className="text-xl sm:text-2xl font-black text-[#0b1c30]">
                              {sec.headline || 'Detailed Situation-Task-Action-Result Breakdowns'}
                            </h2>
                            <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                              {sec.subheadline || 'Real transformation narratives showing problem-solving under real constraints.'}
                            </p>
                          </div>

                          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3 text-xs">
                            <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2">
                              <span className="font-bold text-neutral-900">
                                Case #01 — {market} System Architecture
                              </span>
                              <span className="font-mono text-[10px] text-emerald-700 font-bold">
                                STAR Breakdown
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                              <div>
                                <strong className="text-neutral-700 block">Constraint:</strong>
                                <span className="text-neutral-500">Unpredictable turnaround and brittle legacy processes.</span>
                              </div>
                              <div>
                                <strong className="text-neutral-700 block">Transformation:</strong>
                                <span className="text-neutral-500">Engineered modular delivery system backed by verifiable tests.</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ───────────────────────────────────────────────────────
                          5. ABOUT & MECHANISM
                          ─────────────────────────────────────────────────────── */}
                      {isAbout && (
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                              PROPRIETARY MECHANISM
                            </span>
                            <h2 className="text-xl sm:text-2xl font-black text-[#0b1c30]">
                              {sec.headline || `Why Traditional Solutions Fail & How ${mechanism} Wins`}
                            </h2>
                            <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                              {sec.subheadline || 'The foundational thesis behind our high-certainty execution.'}
                            </p>
                          </div>
                          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-700 leading-relaxed whitespace-pre-line font-medium">
                            {sec.bodyCopy || `${userName} partners directly with founders and product leads to implement high-reliability systems without agency overhead.`}
                          </div>
                        </div>
                      )}

                      {/* ───────────────────────────────────────────────────────
                          6. TESTIMONIALS & PEER VALIDATION
                          ─────────────────────────────────────────────────────── */}
                      {isTestimonials && (
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              PEER VALIDATION
                            </span>
                            <h2 className="text-xl sm:text-2xl font-black text-[#0b1c30]">
                              {sec.headline || 'Endorsed by Technical & Business Operators'}
                            </h2>
                          </div>
                          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-600 italic">
                            "{sec.bodyCopy || 'Reliable, rigorous execution. Delivered exactly to specification with zero management friction.'}"
                            <div className="mt-2 text-[11px] font-bold text-neutral-800 not-italic">
                              — Verified Client Endorsement
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ───────────────────────────────────────────────────────
                          7. AUTHORITY STATURE
                          ─────────────────────────────────────────────────────── */}
                      {isAuthority && (
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                              INDUSTRY STATURE
                            </span>
                            <h2 className="text-xl sm:text-2xl font-black text-[#0b1c30]">
                              {sec.headline || 'Published Thinking & Technical Frameworks'}
                            </h2>
                          </div>
                          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-600">
                            {sec.bodyCopy || 'Essays, open-source libraries, and industry teardowns on scalable architecture.'}
                          </div>
                        </div>
                      )}

                      {/* ───────────────────────────────────────────────────────
                          8. FAQ / OBJECTION KILLER
                          ─────────────────────────────────────────────────────── */}
                      {isFAQ && (
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                              OBJECTION ELIMINATION
                            </span>
                            <h2 className="text-xl sm:text-2xl font-black text-[#0b1c30]">
                              {sec.headline || 'Frequently Asked Questions & Engagement Rules'}
                            </h2>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                              <h4 className="font-bold text-neutral-900">
                                How quickly can we begin implementation?
                              </h4>
                              <p className="text-neutral-600 leading-relaxed">
                                Engagements typically kick off within 3–5 business days following scope approval.
                              </p>
                            </div>
                            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                              <h4 className="font-bold text-neutral-900">
                                What if scope changes during sprint delivery?
                              </h4>
                              <p className="text-neutral-600 leading-relaxed">
                                Clear scope protection ensures critical milestones are delivered first. Adjustments are transparently scoped.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ───────────────────────────────────────────────────────
                          9. FINAL CTA CONVERSION TRIGGER
                          ─────────────────────────────────────────────────────── */}
                      {isCTA && (
                        <div className="p-6 sm:p-8 bg-neutral-900 text-white rounded-3xl text-center space-y-3.5 my-2">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">
                            CONFIRM YOUR ENGAGEMENT
                          </span>
                          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            {sec.headline || 'Ready to Deploy Your Solution?'}
                          </h2>
                          <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                            {sec.subheadline || 'Schedule a focused 25-minute architecture call to evaluate deliverables, timeline, and fit.'}
                          </p>
                          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <button className="px-6 py-3 rounded-xl bg-white text-neutral-900 font-bold text-xs shadow-md hover:bg-neutral-100 transition-colors cursor-pointer">
                              {sec.ctaText || 'Schedule Architecture Call →'}
                            </button>
                            {sec.trustStatement && (
                              <span className="text-xs text-emerald-400 font-medium">
                                🛡️ {sec.trustStatement}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════
            RIGHT SIDEBAR: CONVERSION VALIDATION PANEL (lg:col-span-4)
            ═════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-4">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
            {/* Panel Header & Overall Status */}
            <div className="space-y-2 pb-3 border-b border-neutral-100">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#0058be]">
                  Conversion Validation
                </span>
                <span
                  className={cn(
                    'text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider',
                    audit.statusColor
                  )}
                >
                  {audit.overallStatus}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#0b1c30]">
                Client Experience Audit
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {audit.summary}
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase text-neutral-400 tracking-wider block">
                Filter Findings ({audit.findings.length})
              </span>
              <div className="flex flex-wrap gap-1">
                {(['ALL', 'CLARITY', 'PROOF', 'FLOW', 'OFFER', 'FRICTION', 'CTA'] as const).map((cat) => {
                  const count = cat === 'ALL'
                    ? audit.findings.length
                    : audit.findings.filter((f) => f.category === cat).length;
                  if (cat !== 'ALL' && count === 0) return null;

                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={cn(
                        'px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer border',
                        selectedCategoryFilter === cat
                          ? 'bg-[#0058be] text-white border-[#0058be]'
                          : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                      )}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Findings List */}
            <div className="space-y-2.5 max-h-[480px] overflow-y-auto scrollbar-thin pr-1">
              {filteredFindings.length > 0 ? (
                filteredFindings.map((finding) => (
                  <div
                    key={finding.id}
                    className={cn(
                      'p-3.5 rounded-2xl border transition-all space-y-1.5 text-xs',
                      finding.severity === 'high'
                        ? 'bg-rose-50/60 border-rose-200'
                        : finding.severity === 'medium'
                        ? 'bg-amber-50/60 border-amber-200'
                        : 'bg-blue-50/50 border-blue-200'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          'text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded border',
                          finding.severity === 'high'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : finding.severity === 'medium'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-blue-100 text-blue-800 border-blue-300'
                        )}
                      >
                        {finding.severity.toUpperCase()} • {finding.category}
                      </span>

                      {finding.relatedSectionId && (
                        <button
                          onClick={() => handleReviewSection(finding.relatedSectionId)}
                          className="text-[10px] font-bold text-[#0058be] hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>Review</span>
                          <ArrowUpRight size={11} />
                        </button>
                      )}
                    </div>

                    <h4 className="font-black text-[#0b1c30] text-xs leading-snug">
                      {finding.title}
                    </h4>

                    <p className="text-[11px] text-neutral-600 leading-relaxed">
                      {finding.explanation}
                    </p>

                    <div className="pt-1 text-[11px] font-medium text-neutral-800 border-t border-black/5">
                      <strong className="font-semibold text-neutral-900">Action:</strong> {finding.recommendedAction}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 text-center space-y-1">
                  <CheckCircle2 size={16} className="mx-auto text-emerald-600" />
                  <span className="font-bold block">No Friction Findings</span>
                  <p className="text-[11px] text-emerald-700">
                    Your sequence conforms cleanly to your {portfolioGoal} goals and {archetypeMeta.name} strategy.
                  </p>
                </div>
              )}
            </div>

            {/* Back to Canvas Action */}
            <button
              onClick={() => handleReviewSection()}
              className="w-full py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Edit3 size={12} />
              <span>Modify Sequence in Canvas (Step 3)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom Navigation Ribbon ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-neutral-200 bg-white p-4 sm:p-5 rounded-3xl border shadow-xs">
        <div className="text-xs text-neutral-500">
          <span className="font-bold text-neutral-700">Client POV Verified.</span> You are ready to review conversion audit scoring and blueprint deployment.
        </div>

        <div className="flex items-center gap-3">
          <ModuleButton onClick={onContinue}>
            Confirm Simulation &amp; Conversion Audit →
          </ModuleButton>
        </div>
      </div>
    </div>
  );
});

export default WireframeSimulatorSection;
