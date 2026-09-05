/**
 * DeployArchitectureSection.tsx — Level 2 / Sub-Step 5: Finalization, Lock & Master Handoff
 *
 * Implements Phase 5 architecture finalization:
 * 1. Strategic readiness assessment (Positioning, Structure, Conversion, Content)
 * 2. Pre-flight findings (Blockers vs. Warnings)
 * 3. Formal Architecture Locking (freezes mutations, persists finalized status)
 * 4. Distinct 3-format Master Exports (Executive PDF Blueprint, JSON Data Spec, Markdown Copy Vault)
 * 5. Unlock with explicit state invalidation (FINALIZED -> IN REVISION)
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Unlock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Download,
  Copy,
  Check,
  FileCode,
  FileText,
  Sparkles,
  ArrowRight,
  Eye,
  RefreshCw,
  Layers,
  Compass,
  AlertCircle,
  HelpCircle,
  X,
  Target,
  FileCheck,
} from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import { useModule3Store } from '../../../../../lib/module3/store';
import {
  PORTFOLIO_ARCHETYPES,
  calculatePortfolioConversionScore,
  evaluatePortfolioReadiness,
  exportPortfolioArchitectureAsJson,
  exportPortfolioArchitectureAsMarkdown,
  PortfolioGoal,
} from '../../../../../lib/module3/portfolio-architecture-engine';
import { generatePortfolioArchitecturePdf } from '../../../../../lib/module3/portfolio-architecture-pdf';
import { ModuleButton } from '../../../../workspace/ModuleButton';

interface Props {
  onComplete: () => void;
  onNavigateToPreview?: () => void;
}

export const DeployArchitectureSection: React.FC<Props> = React.memo(({ onComplete, onNavigateToPreview }) => {
  const {
    authoritySuite,
    stage2Archetype,
    stage1Identity,
    mod1ServiceId,
    mod1MarketId,
    mod2UniqueMechanism,
    isUpstreamStale,
    lockStage2Architecture,
    unlockStage2Architecture,
  } = useModule3Store();

  const [copiedMd, setCopiedMd] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  const sections = useMemo(() => {
    return authoritySuite?.portfolioBlueprint ?? [];
  }, [authoritySuite?.portfolioBlueprint]);

  const activeSections = useMemo(() => {
    return sections.filter((s) => s.isEnabled !== false);
  }, [sections]);

  const archetypeId = stage2Archetype?.selectedArchetypeId || 'proof_first';
  const archetype = useMemo(() => {
    return (
      PORTFOLIO_ARCHETYPES.find((a) => a.id === archetypeId) ||
      PORTFOLIO_ARCHETYPES[0]
    );
  }, [archetypeId]);

  const portfolioGoal: PortfolioGoal = stage2Archetype?.portfolioGoal || 'retainer';
  const isLocked = Boolean(stage2Archetype?.isLocked);
  const lockedAt = stage2Archetype?.lockedAt;
  const revisionStatus = stage2Archetype?.revisionStatus || (isLocked ? 'finalized' : 'draft');

  // Conversion Audit (legacy 5-dimension scoring)
  const audit = useMemo(() => {
    return calculatePortfolioConversionScore(sections, mod1ServiceId, mod2UniqueMechanism);
  }, [sections, mod1ServiceId, mod2UniqueMechanism]);

  // Phase 5 Strategic Readiness Assessment
  const readiness = useMemo(() => {
    return evaluatePortfolioReadiness(sections, archetypeId, portfolioGoal, isLocked);
  }, [sections, archetypeId, portfolioGoal, isLocked]);

  // Strategic Category Breakdown
  const categories = useMemo(() => {
    const hasPositioning = Boolean(stage1Identity?.positioningHeadline?.trim());
    const hasGoal = Boolean(portfolioGoal);
    const hasArchetype = Boolean(archetypeId);
    const posScore = (hasPositioning ? 40 : 0) + (hasGoal ? 30 : 0) + (hasArchetype ? 30 : 0);

    const hasHeroFirst = activeSections[0]?.id === 'section_hero';
    const hasCta = activeSections.some((s) => s.id === 'section_cta');
    const hasEnough = activeSections.length >= 3;
    const structScore = (hasHeroFirst ? 40 : 0) + (hasCta ? 40 : 0) + (hasEnough ? 20 : 0);

    const visitorScore = readiness.visitorAudit.overallStatus === 'Strong' ? 95 : readiness.visitorAudit.overallStatus === 'Needs Attention' ? 75 : 50;
    const proofScore = readiness.hasVerifiedProof ? 90 : 60;

    return [
      {
        id: 'positioning',
        title: 'Positioning & Goal',
        score: posScore,
        status: posScore >= 80 ? 'READY' : 'NEEDS_ATTENTION',
        summary: `Archetype: ${archetype.name} • Goal: ${portfolioGoal.toUpperCase()}`,
      },
      {
        id: 'structure',
        title: 'Structural Flow',
        score: structScore,
        status: structScore === 100 ? 'READY' : 'INCOMPLETE',
        summary: `${activeSections.length} active sections • Hero #1: ${hasHeroFirst ? 'Valid' : 'Invalid'} • CTA: ${hasCta ? 'Present' : 'Missing'}`,
      },
      {
        id: 'visitor',
        title: 'Visitor Journey',
        score: visitorScore,
        status: readiness.visitorAudit.overallStatus === 'Strong' ? 'READY' : 'NEEDS_ATTENTION',
        summary: `${readiness.visitorAudit.overallStatus} flow • ${readiness.visitorAudit.findings.length} visitor journey observations`,
      },
      {
        id: 'content',
        title: 'Proof & Directives',
        score: proofScore,
        status: readiness.hasVerifiedProof ? 'READY' : 'NEEDS_ATTENTION',
        summary: `${readiness.customizedSectionCount} customized sections • ${readiness.hasVerifiedProof ? 'Proof attached' : 'Narrative claims'}`,
      },
    ];
  }, [stage1Identity, portfolioGoal, archetypeId, archetype.name, activeSections, readiness]);

  // Format Lock Date
  const formattedLockDate = useMemo(() => {
    if (!lockedAt) return null;
    try {
      const d = new Date(lockedAt);
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return lockedAt;
    }
  }, [lockedAt]);

  // 1. Copy Markdown Copy Vault
  const handleCopyMarkdown = useCallback(() => {
    const md = exportPortfolioArchitectureAsMarkdown({
      userName: stage1Identity?.userName || 'Specialist',
      positioningHeadline: stage1Identity?.positioningHeadline || 'High-Ticket Specialist',
      archetypeId,
      goal: portfolioGoal,
      uniqueMechanism: mod2UniqueMechanism,
      sections,
      isLocked,
      lockedAt,
      readiness,
    });

    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2500);
  }, [sections, stage1Identity, archetypeId, portfolioGoal, mod2UniqueMechanism, isLocked, lockedAt, readiness]);

  // 2. Download Developer JSON Spec
  const handleDownloadJson = useCallback(() => {
    const jsonStr = exportPortfolioArchitectureAsJson({
      userName: stage1Identity?.userName || 'Specialist',
      positioningHeadline: stage1Identity?.positioningHeadline || 'High-Ticket Specialist',
      archetypeId,
      goal: portfolioGoal,
      uniqueMechanism: mod2UniqueMechanism,
      sections,
      isLocked,
      lockedAt,
      readiness,
    });

    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Portfolio_Architecture_Spec_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [sections, stage1Identity, archetypeId, portfolioGoal, mod2UniqueMechanism, isLocked, lockedAt, readiness]);

  // 3. Export Executive PDF Blueprint
  const handleExportPdf = useCallback(() => {
    setDownloadingPdf(true);
    try {
      const doc = generatePortfolioArchitecturePdf({
        userName: stage1Identity?.userName || 'Specialist',
        positioningHeadline: stage1Identity?.positioningHeadline || 'Authority Specialist',
        uniqueMechanism: mod2UniqueMechanism || 'Proof-First Delivery Framework',
        serviceId: mod1ServiceId,
        marketId: mod1MarketId,
        archetype,
        portfolioGoal,
        isLocked,
        lockedAt,
        auditScore: audit,
        sections,
      });

      doc.save(`Executive_Portfolio_Architecture_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('[DeployArchitecture] Failed to generate PDF:', err);
    } finally {
      setDownloadingPdf(false);
    }
  }, [stage1Identity, mod2UniqueMechanism, mod1ServiceId, mod1MarketId, archetype, portfolioGoal, isLocked, lockedAt, audit, sections]);

  // Handle Lock Confirm
  const handleConfirmLock = () => {
    lockStage2Architecture();
    setShowLockModal(false);
  };

  // Handle Unlock Confirm
  const handleConfirmUnlock = () => {
    unlockStage2Architecture();
    setShowUnlockModal(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Upstream Stale Context Alert */}
      {isUpstreamStale && (
        <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-amber-900">Upstream Strategic Context Modified</h4>
            <p className="text-amber-800 leading-relaxed">
              Your Module 1 (Opportunity Map) or Module 2 (Offer Engineering) inputs have changed since this architecture was configured.
              Review your section sequence and positioning before finalizing your lock.
            </p>
          </div>
        </div>
      )}

      {/* Main Header Banner */}
      <div
        className={cn(
          'p-6 sm:p-7 rounded-3xl shadow-sm space-y-3 transition-all',
          isLocked
            ? 'bg-gradient-to-r from-[#021b2d] via-[#05293d] to-[#0a3a40] text-white border border-emerald-500/30'
            : 'bg-gradient-to-r from-[#061b4f] via-[#0b1c30] to-[#1e1b4b] text-white'
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider">
            {isLocked ? (
              <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/40">
                <Lock size={12} className="text-emerald-400" />
                <span>Architecture Finalized &amp; Locked</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-500/30">
                <FileCheck size={12} />
                <span>Step 5 of 5 — Review &amp; Master Finalization</span>
              </span>
            )}

            {revisionStatus === 'in_revision' && !isLocked && (
              <span className="text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30 text-[10px]">
                In Revision
              </span>
            )}
          </div>

          {isLocked && formattedLockDate && (
            <div className="text-xs text-emerald-300/80 font-mono">
              Finalized: <span className="text-white font-semibold">{formattedLockDate}</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            {isLocked ? (
              <>
                <span>Portfolio Architecture Blueprint</span>
                <span className="text-xs font-mono font-bold bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  Finalized
                </span>
              </>
            ) : (
              'Final Architecture Audit & Master Lock'
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {isLocked
              ? 'This strategic architecture is frozen and ready for production handoff. Section hierarchy and specifications are protected from accidental modifications.'
              : 'Review your 4-dimension architecture readiness, resolve any blockers, and finalize your architecture to protect it from drift before export.'}
          </p>
        </div>

        {/* Lock / Unlock Bar inside Header */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          {isLocked ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowUnlockModal(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl transition-all cursor-pointer border border-white/10"
              >
                <Unlock size={13} className="text-amber-400" />
                <span>Unlock Architecture to Revise</span>
              </button>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Unlocking re-enables hierarchy and canvas editing.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLockModal(true)}
                disabled={!readiness.canLock}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer',
                  readiness.canLock
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black'
                    : 'bg-neutral-700 text-neutral-400 cursor-not-allowed opacity-60'
                )}
              >
                <Lock size={13} />
                <span>Finalize &amp; Lock Architecture</span>
              </button>
              {!readiness.canLock && (
                <span className="text-xs text-amber-300 font-medium">
                  Resolve blockers below to finalize and lock.
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Strategic Readiness Assessment (4 Dimensions) */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div>
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-neutral-400 block">
              Strategic Evaluation
            </span>
            <h3 className="text-lg font-black text-[#0b1c30] mt-0.5">
              Portfolio Readiness Assessment
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-2xl font-black text-[#0b1c30] block leading-none">
                {audit.totalScore}
                <span className="text-sm font-normal text-neutral-400"> / 100</span>
              </span>
              <span
                className={cn(
                  'text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border inline-block mt-1',
                  readiness.status === 'READY'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : readiness.status === 'NEEDS_ATTENTION'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                )}
              >
                {readiness.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Dimension Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {categories.map((cat) => {
            const isGood = cat.status === 'READY';
            const isWarn = cat.status === 'NEEDS_ATTENTION';
            return (
              <div
                key={cat.id}
                className={cn(
                  'p-4 rounded-2xl border space-y-2.5 transition-all',
                  isGood
                    ? 'bg-emerald-50/40 border-emerald-200/80'
                    : isWarn
                    ? 'bg-amber-50/40 border-amber-200/80'
                    : 'bg-rose-50/40 border-rose-200/80'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900 text-xs">{cat.title}</span>
                  <span
                    className={cn(
                      'text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider',
                      isGood
                        ? 'bg-emerald-100 text-emerald-800'
                        : isWarn
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    )}
                  >
                    {cat.score}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-neutral-200/80 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      cat.score >= 80
                        ? 'bg-emerald-500'
                        : cat.score >= 60
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    )}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>

                <p className="text-[11px] text-neutral-600 leading-relaxed font-medium">
                  {cat.summary}
                </p>
              </div>
            );
          })}
        </div>

        {/* Pre-Flight Findings: Blockers vs Warnings */}
        {(readiness.blockers.length > 0 || readiness.warnings.length > 0) && (
          <div className="space-y-3 pt-2">
            {/* Blockers */}
            {readiness.blockers.length > 0 && (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-xs space-y-2 text-rose-950">
                <div className="flex items-center gap-1.5 font-bold text-rose-900">
                  <AlertCircle size={15} className="text-rose-600 shrink-0" />
                  <span>Architecture Lock Blockers ({readiness.blockers.length}):</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-rose-900/90 pl-1 font-medium">
                  {readiness.blockers.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings */}
            {readiness.warnings.length > 0 && (
              <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl text-xs space-y-1.5 text-amber-950">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <AlertTriangle size={15} className="text-amber-600 shrink-0" />
                  <span>Strategic Warnings &amp; Advisory Notes ({readiness.warnings.length}):</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-amber-900/90 pl-1 font-medium">
                  {readiness.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active Architecture Sequence Map */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-neutral-400 block">
              Blueprint Layout
            </span>
            <h3 className="text-base font-black text-[#0b1c30] mt-0.5">
              Active Section Hierarchy ({activeSections.length} Sections)
            </h3>
          </div>

          <div className="text-xs text-neutral-500 font-mono">
            Archetype: <span className="font-bold text-neutral-800">{archetype.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-1">
          {activeSections.map((sec, idx) => (
            <div
              key={sec.id}
              className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-neutral-400">
                  #{idx + 1}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#0058be] bg-[#0058be]/10 px-1.5 py-0.5 rounded">
                  {sec.id.replace('section_', '')}
                </span>
              </div>
              <h5 className="font-bold text-neutral-900 text-xs truncate">{sec.title}</h5>
              <p className="text-[10px] text-neutral-500 line-clamp-1">{sec.purpose}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Master Export Suite */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
        <div>
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#0058be] bg-[#0058be]/10 px-2.5 py-0.5 rounded-full border border-[#0058be]/20">
            Export Suite
          </span>
          <h3 className="text-lg font-black text-[#0b1c30] mt-1">
            Master Portfolio Blueprint Handoff
          </h3>
          <p className="text-xs text-neutral-500">
            Export your finalized portfolio architecture in three specialized formats designed for distinct workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Executive PDF Export */}
          <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/40 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[#0058be]">
                <FileText size={20} />
                <h4 className="font-bold text-sm text-[#0b1c30]">Executive PDF Blueprint</h4>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Polished strategic blueprint for executive presentation, client stakeholder alignment, and permanent agency records.
              </p>
            </div>

            <button
              onClick={handleExportPdf}
              disabled={downloadingPdf}
              className="w-full py-2.5 px-4 bg-[#0058be] hover:bg-[#004bb0] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Download size={14} />
              <span>{downloadingPdf ? 'Generating PDF...' : 'Download PDF Blueprint'}</span>
            </button>
          </div>

          {/* Copy Markdown Spec */}
          <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-neutral-800">
                <Copy size={20} />
                <h4 className="font-bold text-sm text-[#0b1c30]">Markdown Copy Vault</h4>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Human-readable strategy and approved copy handoff for Notion, Google Docs, or direct copy-paste into Figma components.
              </p>
            </div>

            <button
              onClick={handleCopyMarkdown}
              className="w-full py-2.5 px-4 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              {copiedMd ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copiedMd ? 'Copied to Clipboard!' : 'Copy Markdown Vault'}</span>
            </button>
          </div>

          {/* Download JSON Spec */}
          <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-700">
                <FileCode size={20} />
                <h4 className="font-bold text-sm text-[#0b1c30]">Developer JSON Contract</h4>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Canonical machine-readable data spec with typed sections, metadata, order, and directives for headless and automated builds.
              </p>
            </div>

            <button
              onClick={handleDownloadJson}
              className="w-full py-2.5 px-4 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Download size={14} />
              <span>Download JSON Spec</span>
            </button>
          </div>
        </div>
      </div>

      {/* Post-Lock Action Bar */}
      <div className="bg-neutral-50 p-5 sm:p-6 rounded-3xl border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onNavigateToPreview && (
            <button
              onClick={onNavigateToPreview}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Eye size={13} className="text-[#0058be]" />
              <span>Preview as Visitor</span>
            </button>
          )}

          <span className="text-xs text-neutral-500 hidden sm:inline">
            {isLocked
              ? 'Architecture is finalized. Ready to proceed to the next system.'
              : 'Lock your architecture above to protect it from drift.'}
          </span>
        </div>

        <ModuleButton onClick={onComplete}>
          <span>Complete Level 2 &amp; Continue →</span>
        </ModuleButton>
      </div>

      {/* Lock Confirmation Modal */}
      <AnimatePresence>
        {showLockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-neutral-200 text-left space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Lock size={20} />
                </div>
                <button
                  onClick={() => setShowLockModal(false)}
                  className="text-neutral-400 hover:text-neutral-600 p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <div>
                <h4 className="text-lg font-black text-[#0b1c30]">
                  Finalize &amp; Lock Architecture?
                </h4>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  Locking protects your validated portfolio architecture from accidental reordering, section deletion, or copy edits.
                </p>
              </div>

              <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200 text-xs space-y-2 text-neutral-700">
                <div className="flex items-center gap-2 font-bold text-neutral-900">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>Locking guarantees:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-neutral-600 pl-1 font-medium">
                  <li>Store-level mutation protection on all sections</li>
                  <li>Finalized timestamp for agency/client audit trail</li>
                  <li>Architecture status marked as FINALIZED</li>
                  <li>You can safely unlock at any time if revisions are needed</li>
                </ul>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowLockModal(false)}
                  className="w-1/2 py-2.5 px-4 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-bold hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLock}
                  className="w-1/2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-sm cursor-pointer"
                >
                  Confirm &amp; Lock
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Unlock Confirmation Modal */}
      <AnimatePresence>
        {showUnlockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-neutral-200 text-left space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Unlock size={20} />
                </div>
                <button
                  onClick={() => setShowUnlockModal(false)}
                  className="text-neutral-400 hover:text-neutral-600 p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <div>
                <h4 className="text-lg font-black text-[#0b1c30]">
                  Unlock Architecture for Revision?
                </h4>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  Unlocking will transition your architecture status from <strong className="text-emerald-700">FINALIZED</strong> to <strong className="text-amber-700">IN REVISION</strong> and clear the finalized timestamp.
                </p>
              </div>

              <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200 text-xs space-y-1.5 text-amber-900">
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <AlertTriangle size={14} className="text-amber-600" />
                  <span>What happens on unlock:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-amber-900/90 pl-1 font-medium">
                  <li>Hierarchy reordering &amp; section toggles become editable</li>
                  <li>Spec Studio inputs re-enable for copy and visual edits</li>
                  <li>Architecture must be re-validated before locking again</li>
                </ul>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowUnlockModal(false)}
                  className="w-1/2 py-2.5 px-4 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-bold hover:bg-neutral-50 cursor-pointer"
                >
                  Keep Locked
                </button>
                <button
                  onClick={handleConfirmUnlock}
                  className="w-1/2 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shadow-sm cursor-pointer"
                >
                  Confirm Unlock
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});
