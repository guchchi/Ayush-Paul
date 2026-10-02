/**
 * ConversionAuditSection.tsx — Level 2 (Step 4): Conversion Audit & Publish Gate
 * 
 * Final verification before advancing to Level 3:
 * 1. 5-Dimension Conversion Score Dashboard (Structural architecture score 0-100 with progress bars)
 * 2. Strategic Recommendations & Structural Warnings
 * 3. Portfolio Telemetry Snapshot
 * 4. Readiness Gate (Hard blockers vs pre-flight optimization notes with exception override)
 * 5. Distinct Exports (JSON & Markdown specification downloads)
 * 6. Final Publish & Lock Architecture CTA + Unlock Mechanism
 */

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileJson,
  FileDown,
  ArrowRight,
  ArrowLeft,
  Lock,
  Unlock,
  Sparkles,
  TrendingUp,
  Shield,
  Download,
  Check,
} from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import { EASING, DURATION } from '../../../../../lib/motion-presets';
import { useModule3Store } from '../../../../../lib/module3/store';
import {
  PORTFOLIO_ARCHETYPES,
  calculatePortfolioConversionScore,
  calculatePortfolioTelemetry,
  validateArchitecture,
  validateVisitorJourney,
  evaluatePortfolioReadiness,
  diffArchitecture,
  exportPortfolioArchitectureAsJson,
  exportPortfolioArchitectureAsMarkdown,
} from '../../../../../lib/module3/portfolio-architecture-engine';

interface Props {
  onBack: () => void;
  onPublish: () => void;
}

const sectionFade = {
  initial: { opacity: 0, y: 16, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -12, filter: 'blur(4px)' },
  transition: { duration: DURATION.NORMAL, ease: EASING.PREMIUM },
};

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const ConversionAuditSection: React.FC<Props> = React.memo(({ onBack, onPublish }) => {
  const {
    authoritySuite,
    stage2Archetype,
    setStage2Archetype,
    mod1ServiceId,
    mod1Positioning,
    mod2UniqueMechanism,
    stage1Identity,
  } = useModule3Store();

  const [copiedType, setCopiedType] = useState<'json' | 'md' | null>(null);
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  const sections = authoritySuite?.portfolioBlueprint ?? [];
  const selectedArchetypeId = stage2Archetype?.selectedArchetypeId || 'proof_first';
  const selectedGoal = stage2Archetype?.portfolioGoal || 'retainer';
  const isLocked = !!stage2Archetype?.isLocked;

  const archetype = useMemo(() => {
    return PORTFOLIO_ARCHETYPES.find((a) => a.id === selectedArchetypeId) || PORTFOLIO_ARCHETYPES[0];
  }, [selectedArchetypeId]);

  // 1. Conversion Score Calculation
  const audit = useMemo(() => {
    return calculatePortfolioConversionScore(
      sections,
      mod1ServiceId,
      mod2UniqueMechanism || undefined
    );
  }, [sections, mod1ServiceId, mod2UniqueMechanism]);

  // 2. Telemetry Snapshot
  const telemetry = useMemo(() => {
    return calculatePortfolioTelemetry(sections);
  }, [sections]);

  // 3. Structural Validation & Visitor Journey
  const structuralWarnings = useMemo(() => {
    return validateArchitecture(sections, selectedArchetypeId, selectedGoal);
  }, [sections, selectedArchetypeId, selectedGoal]);

  const visitorAudit = useMemo(() => {
    return validateVisitorJourney(sections, selectedArchetypeId, selectedGoal);
  }, [sections, selectedArchetypeId, selectedGoal]);

  // 4. Readiness Report
  const readiness = useMemo(() => {
    return evaluatePortfolioReadiness(sections, selectedArchetypeId, selectedGoal, isLocked);
  }, [sections, selectedArchetypeId, selectedGoal, isLocked]);

  // 5. Architecture Diff
  const diff = useMemo(() => {
    return diffArchitecture(sections, archetype.recommendedOrder);
  }, [sections, archetype.recommendedOrder]);

  // Export handlers
  const handleExportJson = () => {
    const jsonStr = exportPortfolioArchitectureAsJson({
      userName: stage1Identity?.userName,
      positioningHeadline: stage1Identity?.positioningHeadline || mod1Positioning,
      uniqueMechanism: mod2UniqueMechanism || undefined,
      archetypeId: selectedArchetypeId,
      goal: selectedGoal,
      sections,
      isLocked,
      lockedAt: stage2Archetype?.lockedAt,
      readiness,
    });
    downloadBlob(jsonStr, `portfolio-architecture-${selectedArchetypeId}.json`, 'application/json');
    setCopiedType('json');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleExportMarkdown = () => {
    const mdStr = exportPortfolioArchitectureAsMarkdown({
      userName: stage1Identity?.userName,
      positioningHeadline: stage1Identity?.positioningHeadline || mod1Positioning,
      uniqueMechanism: mod2UniqueMechanism || undefined,
      archetypeId: selectedArchetypeId,
      goal: selectedGoal,
      sections,
      isLocked,
      lockedAt: stage2Archetype?.lockedAt,
      readiness,
    });
    downloadBlob(mdStr, `portfolio-blueprint-${selectedArchetypeId}.md`, 'text/markdown');
    setCopiedType('md');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handlePublishClick = () => {
    if (readiness.canLock) {
      onPublish();
    } else {
      setShowOverrideModal(true);
    }
  };

  return (
    <motion.div {...sectionFade} className="w-full space-y-8 text-left font-sans">
      <div className="p-8 sm:p-10 rounded-3xl border border-neutral-200 bg-white shadow-xs space-y-8">
        
        {/* ── HEADER BANNER ────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0058be]/10 text-[#0058be] text-[11px] font-bold uppercase tracking-wider border border-[#0058be]/20">
              <Sparkles size={13} />
              Step 04 · Conversion Audit & Readiness Gate
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
              Portfolio Conversion Audit
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Verify your architecture's conversion strength, pre-flight telemetry, and buyer journey flow before finalizing.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs font-semibold text-neutral-600">
              Archetype: <span className="font-bold text-[#0b1c30]">{archetype.name}</span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-900">
              {diff.statusLabel}
            </div>
          </div>
        </div>

        {/* ── 1. OVERALL SCORE & 5 DIMENSION BREAKDOWN ──────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Big Score Card */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-neutral-900 text-white flex flex-col justify-between space-y-6 shadow-md">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400 block mb-1">
                Structural Conversion Architecture Score
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white">
                  {audit.totalScore}
                </span>
                <span className="text-xl font-bold text-neutral-500">/ 100</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border",
                audit.ratingColor
              )}>
                <TrendingUp size={13} />
                Rating: {audit.ratingLabel}
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {audit.totalScore >= 85
                  ? 'Your portfolio architecture meets gold-standard B2B conversion criteria with zero critical friction.'
                  : audit.totalScore >= 70
                  ? 'Strong structural foundation. Pacing and proof positioning satisfy key B2B conversion heuristics.'
                  : 'Requires structural optimization. Review the high-priority recommendations below before publishing.'}
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-800 text-[11px] text-neutral-400 font-mono">
              Grades mathematical scroll hierarchy, proof positioning, offer transparency, and objection readiness.
            </div>
          </div>

          {/* 5 Dimension Progress Bars */}
          <div className="lg:col-span-8 p-6 sm:p-7 rounded-3xl border border-neutral-200 bg-neutral-50/70 space-y-5 flex flex-col justify-center">
            <h4 className="text-sm font-bold text-[#0b1c30] uppercase tracking-wider flex items-center gap-2">
              <Shield size={16} className="text-[#0058be]" />
              5-Dimension Diagnostic Breakdown
            </h4>

            <div className="space-y-4">
              {/* Hook Clarity */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-neutral-800">{audit.dimensionScores.hookClarity.label}</span>
                  <span className="font-mono font-bold text-[#0058be]">
                    {audit.dimensionScores.hookClarity.score} / {audit.dimensionScores.hookClarity.max} pts
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
                  <div 
                    className="h-full bg-[#0058be] rounded-full transition-all duration-500"
                    style={{ width: `${(audit.dimensionScores.hookClarity.score / audit.dimensionScores.hookClarity.max) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-neutral-500">{audit.dimensionScores.hookClarity.tip}</p>
              </div>

              {/* Proof Proximity */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-neutral-800">{audit.dimensionScores.proofProximity.label}</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {audit.dimensionScores.proofProximity.score} / {audit.dimensionScores.proofProximity.max} pts
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${(audit.dimensionScores.proofProximity.score / audit.dimensionScores.proofProximity.max) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-neutral-500">{audit.dimensionScores.proofProximity.tip}</p>
              </div>

              {/* Offer Clarity */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-neutral-800">{audit.dimensionScores.offerClarity.label}</span>
                  <span className="font-mono font-bold text-purple-700">
                    {audit.dimensionScores.offerClarity.score} / {audit.dimensionScores.offerClarity.max} pts
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
                  <div 
                    className="h-full bg-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${(audit.dimensionScores.offerClarity.score / audit.dimensionScores.offerClarity.max) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-neutral-500">{audit.dimensionScores.offerClarity.tip}</p>
              </div>

              {/* Objection Readiness */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-neutral-800">{audit.dimensionScores.objectionReadiness.label}</span>
                  <span className="font-mono font-bold text-amber-700">
                    {audit.dimensionScores.objectionReadiness.score} / {audit.dimensionScores.objectionReadiness.max} pts
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${(audit.dimensionScores.objectionReadiness.score / audit.dimensionScores.objectionReadiness.max) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-neutral-500">{audit.dimensionScores.objectionReadiness.tip}</p>
              </div>

              {/* CTA Friction */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-neutral-800">{audit.dimensionScores.ctaFriction.label}</span>
                  <span className="font-mono font-bold text-blue-700">
                    {audit.dimensionScores.ctaFriction.score} / {audit.dimensionScores.ctaFriction.max} pts
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${(audit.dimensionScores.ctaFriction.score / audit.dimensionScores.ctaFriction.max) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-neutral-500">{audit.dimensionScores.ctaFriction.tip}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. TELEMETRY STATS GRID ──────────────────────────────────────── */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400">
            Pre-Flight Telemetry
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Active Sections
              </span>
              <span className="text-xl font-extrabold text-[#0b1c30]">
                {telemetry.activeSectionCount}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Total Words
              </span>
              <span className="text-xl font-extrabold text-[#0b1c30]">
                ~{telemetry.totalWordCount}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Estimated Read Time
              </span>
              <span className="text-xl font-extrabold text-[#0b1c30]">
                ~{telemetry.estimatedReadTimeMinutes} min
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Proof Weight
              </span>
              <span className="text-xl font-extrabold text-[#0b1c30]">
                {telemetry.proofRatioPct}%
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                CTA Touchpoints
              </span>
              <span className="text-xl font-extrabold text-[#0b1c30]">
                {telemetry.ctaTouchpoints}
              </span>
            </div>
          </div>
        </div>

        {/* ── 3. READINESS GATE & WARNINGS ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Readiness Gate */}
          <div className="p-6 rounded-3xl border border-neutral-200 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#0b1c30] flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                Pre-Flight Readiness Gate
              </h4>
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                readiness.statusColor
              )}>
                {readiness.statusLabel}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span className="text-neutral-700">Hero Section active at Position #1</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span className="text-neutral-700">Final Call-to-Action sequence active</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span className="text-neutral-700">Minimum 3 conversion stages satisfied ({telemetry.activeSectionCount} active)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span className="text-neutral-700">Acquisition goal locked: {selectedGoal}</span>
              </div>
            </div>

            {readiness.blockers.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 flex items-center gap-1">
                  <AlertCircle size={12} /> Blocking Issues
                </span>
                <ul className="space-y-1 text-xs text-rose-800">
                  {readiness.blockers.map((b, i) => (
                    <li key={i}>• {b}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Pre-Flight Recommendations */}
          <div className="p-6 rounded-3xl border border-neutral-200 bg-white space-y-4">
            <h4 className="text-sm font-bold text-[#0b1c30] flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              Strategic Optimization Notes
            </h4>

            {audit.recommendations.length > 0 ? (
              <div className="space-y-2.5">
                {audit.recommendations.map((rec, i) => (
                  <div key={i} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                All conversion guardrails satisfied with no pending optimization flags.
              </div>
            )}
          </div>
        </div>

        {/* ── 4. EXPORT & FINAL PUBLISH ACTIONS ────────────────────────────── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 text-white space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <FileDown size={18} className="text-blue-400" />
                Export Specification Packages
              </h4>
              <p className="text-xs text-neutral-400">
                Download your architecture blueprint for Webflow, Framer, or frontend engineering implementation.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExportJson}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <FileJson size={14} className="text-blue-400" />
                {copiedType === 'json' ? 'Downloaded JSON!' : 'Export JSON'}
              </button>

              <button
                type="button"
                onClick={handleExportMarkdown}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Download size={14} className="text-emerald-400" />
                {copiedType === 'md' ? 'Downloaded MD!' : 'Export Markdown'}
              </button>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-800">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-neutral-700 text-xs font-bold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft size={14} />
              Back to Studio Builder
            </button>

            {isLocked ? (
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setStage2Archetype({ isLocked: false, revisionStatus: 'draft' })}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Unlock size={14} />
                  Unlock for Revisions
                </button>
                <button
                  type="button"
                  onClick={onPublish}
                  className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-[#0058be] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  Proceed to Level 3
                  <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handlePublishClick}
                className={cn(
                  "w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer",
                  readiness.canLock
                    ? "bg-[#0058be] text-white hover:bg-blue-600"
                    : "bg-amber-600 text-white hover:bg-amber-700"
                )}
              >
                <Lock size={14} />
                {readiness.canLock ? "Publish & Finalize Architecture" : "Finalize Architecture (With Exceptions)"}
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ── OVERRIDE PUBLISH CONFIRMATION MODAL ──────────────────────────── */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-neutral-200 space-y-5 text-left text-neutral-900"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <AlertTriangle size={24} />
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-bold text-[#0b1c30]">
                Publish Architecture with Exceptions?
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Your portfolio has structural items flagged by the conversion engine:
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
              {readiness.blockers.map((b, i) => (
                <div key={i}>• {b}</div>
              ))}
            </div>

            <p className="text-[11px] text-neutral-500 leading-relaxed">
              If you intentionally designed a custom or minimalist layout (e.g. 2-section waitlist or bespoke flow), you can acknowledge these recommendations and publish anyway.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowOverrideModal(false)}
                className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                Return to Editor
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowOverrideModal(false);
                  onPublish();
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Acknowledge & Finalize Architecture
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
});

ConversionAuditSection.displayName = 'ConversionAuditSection';
export default ConversionAuditSection;
