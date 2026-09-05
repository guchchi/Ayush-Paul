/**
 * SectionHierarchySection.tsx — Level 2 Phase 2: Architecture Decision Layer
 *
 * Implements Phase 2 of Portfolio Architecture Builder:
 * - Deterministic architecture recommendation & placement rationale
 * - Section sequence reordering with strict Hero protection (#1 locked)
 * - Section enable/disable toggle preserving all copy & metadata
 * - Explicit distinction between Recommended vs User Customized states
 * - "Restore Recommended Structure" action with non-destructive inline confirmation
 * - Smart architecture validation warnings (critical/warning/info)
 * - Preserved one-click sequence presets
 * - Navigation advancement to Step 3 (Portfolio Canvas)
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  ListOrdered,
  Lock,
  Target,
  Shield,
  Layers,
  ChevronRight,
  Compass,
  Repeat,
  Zap,
} from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import { EASING, DURATION } from '../../../../../lib/motion-presets';
import { useModule3Store } from '../../../../../lib/module3/store';
import {
  PORTFOLIO_ARCHETYPES,
  PortfolioGoal,
  getArchitectureRationale,
  getSectionPlacementMetadata,
  diffArchitecture,
  validateArchitecture,
} from '../../../../../lib/module3/portfolio-architecture-engine';
import { ModuleButton } from '../../../../workspace/ModuleButton';
import type { PortfolioBlueprintSection } from '../../../../../data/module3/authority-suite-engine';

interface Props {
  onContinue: () => void;
}

export const SectionHierarchySection: React.FC<Props> = React.memo(({ onContinue }) => {
  const {
    authoritySuite,
    reorderPortfolioSections,
    updatePortfolioSection,
    restoreRecommendedStructure,
    applyArchetypePreset,
    stage2Archetype,
    mod1ServiceId,
    mod2UniqueMechanism,
  } = useModule3Store();

  const [activePresetNotification, setActivePresetNotification] = useState<string | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  // Active portfolio sections
  const sections: PortfolioBlueprintSection[] = useMemo(() => {
    return authoritySuite?.portfolioBlueprint ?? [];
  }, [authoritySuite?.portfolioBlueprint]);

  // Active archetype & goal
  const activeArchetypeId = stage2Archetype?.selectedArchetypeId || 'proof_first';
  const portfolioGoal: PortfolioGoal = stage2Archetype?.portfolioGoal || 'retainer';
  const isLocked = Boolean(stage2Archetype?.isLocked);

  const activeArchetypeMeta = useMemo(() => {
    return (
      PORTFOLIO_ARCHETYPES.find((a) => a.id === activeArchetypeId) ||
      PORTFOLIO_ARCHETYPES[0]
    );
  }, [activeArchetypeId]);

  // Deterministic architecture rationale
  const rationale = useMemo(() => {
    return getArchitectureRationale(
      portfolioGoal,
      activeArchetypeId,
      mod1ServiceId,
      mod2UniqueMechanism
    );
  }, [portfolioGoal, activeArchetypeId, mod1ServiceId, mod2UniqueMechanism]);

  // Deterministic architecture diff (customized vs recommended)
  const diff = useMemo(() => {
    return diffArchitecture(sections, activeArchetypeMeta.recommendedOrder);
  }, [sections, activeArchetypeMeta.recommendedOrder]);

  // Smart validation warnings
  const warnings = useMemo(() => {
    return validateArchitecture(sections, activeArchetypeId, portfolioGoal);
  }, [sections, activeArchetypeId, portfolioGoal]);

  // Reordering with strict Hero protection
  const handleMove = useCallback(
    (index: number, direction: 'up' | 'down') => {
      if (isLocked) return;
      // Hero cannot be moved from index 0
      if (index === 0) return;

      // Cannot move another section above Hero (index 0 is reserved for Hero)
      if (index === 1 && direction === 'up') return;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 1 || targetIndex >= sections.length) return;

      const reordered = [...sections];
      const [moved] = reordered.splice(index, 1);
      reordered.splice(targetIndex, 0, moved);

      // Hero must always remain at index 0
      const heroIdx = reordered.findIndex((s) => s.id === 'section_hero');
      if (heroIdx !== 0 && heroIdx !== -1) {
        const [hero] = reordered.splice(heroIdx, 1);
        reordered.unshift(hero);
      }

      reorderPortfolioSections(reordered);
    },
    [isLocked, sections, reorderPortfolioSections]
  );

  // Enable/Disable toggle (Hero cannot be disabled)
  const handleToggle = useCallback(
    (sectionId: string, currentEnabled: boolean) => {
      if (isLocked) return;
      if (sectionId === 'section_hero') return; // Protected
      updatePortfolioSection(sectionId, { isEnabled: !currentEnabled });
    },
    [isLocked, updatePortfolioSection]
  );

  // Apply quick sequence preset
  const handleApplyPreset = useCallback(
    (archetypeId: string, label: string) => {
      if (isLocked) return;
      applyArchetypePreset(archetypeId);
      setActivePresetNotification(`Applied "${label}" Sequence`);
      setTimeout(() => setActivePresetNotification(null), 3500);
    },
    [isLocked, applyArchetypePreset]
  );

  // Restore recommended structure (non-destructive to copy)
  const handleConfirmRestore = useCallback(() => {
    if (isLocked) return;
    restoreRecommendedStructure(activeArchetypeId);
    setShowRestoreConfirm(false);
    setActivePresetNotification(`Restored "${activeArchetypeMeta.name}" sequence`);
    setTimeout(() => setActivePresetNotification(null), 3500);
  }, [isLocked, restoreRecommendedStructure, activeArchetypeId, activeArchetypeMeta.name]);

  const activeSectionsCount = useMemo(() => {
    return sections.filter((s) => s.isEnabled !== false).length;
  }, [sections]);

  return (
    <div className="space-y-6 text-left font-sans">
      {/* ──────────────────────────────────────────────────────────────────────────
          1. HEADER & CUSTOMIZATION STATUS BAR
      ────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 text-[#0058be] text-xs font-mono font-bold uppercase tracking-wider">
              <ListOrdered size={15} />
              <span>Step 2 of 5 — Architecture Decision Layer</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0b1c30]">
              Section Sequence &amp; Conversion Hierarchy
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
              Verify the psychological order of your portfolio before fine-tuning copy in the Canvas. High-ticket buyers evaluate competence in sequence—front-loading proof reduces skepticism before presenting engagement scope.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
            {/* Customization Status Pill */}
            {diff.isCustomized ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                <AlertTriangle size={13} className="text-amber-600 shrink-0" />
                <span>Customized Structure ({diff.totalStructuralChanges} change{diff.totalStructuralChanges === 1 ? '' : 's'})</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                <span>Recommended Structure Active</span>
              </span>
            )}

            {/* Restore Action */}
            {diff.isCustomized && (
              <button
                type="button"
                onClick={() => setShowRestoreConfirm(true)}
                disabled={isLocked}
                className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 disabled:hover:bg-neutral-100 text-neutral-700 text-xs font-bold rounded-xl border border-neutral-200 transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                title={isLocked ? 'Architecture is locked' : 'Restore recommended section ordering and visibility'}
              >
                <RotateCcw size={13} />
                <span>Restore Recommended</span>
              </button>
            )}
          </div>
        </div>

        {/* Architecture Locked Notification Banner */}
        {isLocked && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Lock size={16} className="text-amber-700 shrink-0" />
              <div>
                <span className="font-bold text-xs block text-amber-950">Architecture Finalized &amp; Locked</span>
                <span className="text-[11px] text-amber-800">
                  Section sequence and visibility toggles are locked in read-only mode. Go to Step 5 to unlock if revisions are required.
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-amber-100/80 text-amber-900 font-mono text-[10px] font-bold uppercase shrink-0 border border-amber-300/60">
              Read-Only
            </span>
          </div>
        )}

        {/* Inline Restore Confirmation Banner */}
        <AnimatePresence>
          {showRestoreConfirm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
              className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-hidden"
            >
              <div className="flex items-start gap-2.5">
                <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Restore recommended sequence for {activeArchetypeMeta.name}?</strong>
                  <span className="text-neutral-600">
                    This will reset section positions and visibility to the strategy preset. All your custom headlines, body copy, and proof attachments remain 100% intact.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleConfirmRestore}
                  className="px-3 py-1.5 bg-[#0058be] hover:bg-[#0047a0] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-2xs"
                >
                  Confirm Restore
                </button>
                <button
                  type="button"
                  onClick={() => setShowRestoreConfirm(false)}
                  className="px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-700 font-semibold rounded-xl text-xs border border-neutral-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Presets Row */}
        <div className="pt-2 border-t border-neutral-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-neutral-400 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
              <Sparkles size={11} className="text-[#0058be]" />
              <span>Archetype Sequence Presets</span>
            </span>
            {activePresetNotification && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ✓ {activePresetNotification}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {PORTFOLIO_ARCHETYPES.map((arch) => {
              const isSelected = activeArchetypeId === arch.id;
              return (
                <button
                  key={arch.id}
                  type="button"
                  onClick={() => handleApplyPreset(arch.id, arch.name)}
                  disabled={isLocked}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
                    isSelected
                      ? 'bg-[#0058be]/10 text-[#0058be] border-[#0058be]/30 shadow-2xs'
                      : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                  )}
                >
                  <Sparkles
                    size={12}
                    className={isSelected ? 'text-[#0058be]' : 'text-neutral-400'}
                  />
                  <span>{arch.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          2. ARCHITECTURE STRATEGY RATIONALE PANEL
          Explains why the portfolio is structured this way
      ────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-neutral-50/80 rounded-3xl border border-neutral-200/90 p-5 sm:p-6 space-y-3.5 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0058be] bg-[#0058be]/10 px-2.5 py-0.5 rounded-full border border-[#0058be]/20">
              Architecture Strategy Rationale
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#0b1c30]">
              Why Your Portfolio is Structured This Way
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500 font-medium">Goal:</span>
            <span className="font-bold text-[#0b1c30] bg-white px-2.5 py-1 rounded-lg border border-neutral-200">
              {rationale.goalLabel}
            </span>
          </div>
        </div>

        {/* Primary Summary Statement */}
        <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium bg-white p-3.5 rounded-2xl border border-neutral-200/70">
          "{rationale.summaryParagraph}"
        </p>

        {/* 3 Strategic Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-3 rounded-2xl bg-white border border-neutral-200/70 space-y-1">
            <span className="font-bold text-[10px] text-[#0058be] uppercase tracking-wider block">
              1. Primary Conversion Strategy
            </span>
            <p className="text-neutral-600 leading-snug">{rationale.primaryStrategy}</p>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-neutral-200/70 space-y-1">
            <span className="font-bold text-[10px] text-emerald-700 uppercase tracking-wider block">
              2. Proof Proximity
            </span>
            <p className="text-neutral-600 leading-snug">{rationale.proofPlacementRationale}</p>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-neutral-200/70 space-y-1">
            <span className="font-bold text-[10px] text-indigo-700 uppercase tracking-wider block">
              3. Mechanism &amp; Scope
            </span>
            <p className="text-neutral-600 leading-snug">{rationale.mechanismPlacementRationale}</p>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          3. SMART ARCHITECTURE VALIDATION WARNINGS
      ────────────────────────────────────────────────────────────────────────── */}
      {warnings.length > 0 ? (
        <div className="space-y-2">
          {warnings.map((warn) => {
            const isCritical = warn.severity === 'critical';
            const isWarning = warn.severity === 'warning';

            return (
              <div
                key={warn.id}
                className={cn(
                  'p-3.5 sm:p-4 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all',
                  isCritical
                    ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                    : isWarning
                    ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                    : 'bg-blue-50/80 border-blue-200 text-blue-950'
                )}
              >
                <div className="flex items-start gap-2.5">
                  {isCritical ? (
                    <AlertCircle size={17} className="text-rose-600 shrink-0 mt-0.5" />
                  ) : isWarning ? (
                    <AlertTriangle size={17} className="text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <Info size={17} className="text-blue-600 shrink-0 mt-0.5" />
                  )}

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <strong className="font-bold text-xs">{warn.title}</strong>
                      <span
                        className={cn(
                          'text-[9px] font-black uppercase px-1.5 py-0.2 rounded',
                          isCritical
                            ? 'bg-rose-200/70 text-rose-900'
                            : isWarning
                            ? 'bg-amber-200/70 text-amber-900'
                            : 'bg-blue-200/70 text-blue-900'
                        )}
                      >
                        {warn.severity}
                      </span>
                    </div>
                    <p className="text-neutral-700 leading-relaxed">{warn.message}</p>
                  </div>
                </div>

                {warn.actionHint && (
                  <span className="text-[11px] font-bold shrink-0 text-neutral-500 bg-white/80 px-2.5 py-1 rounded-lg border border-neutral-200/60">
                    💡 {warn.actionHint}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span className="font-medium">
            <strong>Architecture Validated:</strong> Section sequence follows optimal buyer psychology progression with proof positioned for maximum trust.
          </span>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          4. SECTION HIERARCHY & FLOW LIST
          Draggable / Reorderable with accessible controls and Hero protection
      ────────────────────────────────────────────────────────────────────────── */}
      <div className="space-y-3" role="list" aria-label="Portfolio Section Sequence">
        {sections.map((sec, idx) => {
          const isEnabled = sec.isEnabled !== false;
          const isHero = sec.id === 'section_hero';
          const placementMeta = getSectionPlacementMetadata(sec.id, activeArchetypeId, portfolioGoal);

          const isRecommendedPos =
            activeArchetypeMeta.recommendedOrder.indexOf(sec.id) === idx;
          const isContentCustomized = Boolean(
            sec.isHeadlineCustomized ||
            sec.isBodyCustomized ||
            sec.isCtaCustomized ||
            sec.isCustomized
          );

          return (
            <motion.div
              key={sec.id}
              layout
              transition={{ duration: 0.15 }}
              role="listitem"
              className={cn(
                'p-4 sm:p-5 rounded-2xl border transition-all text-left space-y-3',
                !isEnabled
                  ? 'bg-neutral-50/50 border-dashed border-neutral-300 opacity-65'
                  : 'bg-white border-neutral-200/90 shadow-2xs hover:border-neutral-300'
              )}
            >
              {/* Row Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  {/* Position Badge */}
                  <span
                    className={cn(
                      'w-8 h-8 rounded-xl font-mono text-xs font-black flex items-center justify-center border shrink-0 mt-0.5',
                      isHero
                        ? 'bg-blue-600 text-white border-blue-700 shadow-2xs'
                        : isEnabled
                        ? 'bg-blue-50 text-[#0058be] border-blue-200'
                        : 'bg-neutral-200 text-neutral-500 border-neutral-300'
                    )}
                  >
                    0{idx + 1}
                  </span>

                  {/* Title & Metadata Pills */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h4 className="text-sm sm:text-base font-bold text-[#0b1c30]">
                        {sec.title}
                      </h4>

                      {/* Funnel Role Pill */}
                      <span
                        className={cn(
                          'text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border',
                          placementMeta.funnelRole.color
                        )}
                      >
                        {placementMeta.funnelRole.label}
                      </span>

                      {/* Priority Pill */}
                      <span
                        className={cn(
                          'text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border',
                          placementMeta.priority.color
                        )}
                      >
                        {placementMeta.priority.level}
                      </span>

                      {/* Hero Protection Badge */}
                      {isHero && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                          <Lock size={10} />
                          <span>Protected #1</span>
                        </span>
                      )}

                      {/* Recommended vs Custom Order Status */}
                      {!isHero && (
                        isRecommendedPos ? (
                          <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200/60">
                            Recommended Position
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            Custom Position
                          </span>
                        )
                      )}

                      {/* Custom Copy Badge */}
                      {isContentCustomized && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Custom Copy
                        </span>
                      )}

                      {!isEnabled && (
                        <span className="text-[10px] font-bold text-neutral-500 bg-neutral-200 px-2 py-0.5 rounded-md">
                          Disabled
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-500 font-medium line-clamp-1">
                      {sec.purpose}
                    </p>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Up / Down Controls with Hero Protection */}
                  <div className="flex items-center bg-neutral-100 rounded-xl p-0.5 border border-neutral-200">
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'up')}
                      disabled={isLocked || idx <= 1} // Cannot move hero (idx 0), and cannot swap with hero (idx 1 moving up)
                      title={
                        isLocked
                          ? 'Architecture is locked'
                          : idx === 0
                          ? 'Hero is locked at Position 1'
                          : idx === 1
                          ? 'Hero must remain at Position 1'
                          : 'Move up in sequence'
                      }
                      aria-label={`Move ${sec.title} up`}
                      className="p-1.5 text-neutral-600 hover:text-[#0058be] disabled:opacity-20 disabled:hover:text-neutral-600 cursor-pointer disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'down')}
                      disabled={isLocked || isHero || idx === sections.length - 1} // Hero cannot be moved down
                      title={
                        isLocked
                          ? 'Architecture is locked'
                          : isHero
                          ? 'Hero is locked at Position 1'
                          : idx === sections.length - 1
                          ? 'Already at the bottom'
                          : 'Move down in sequence'
                      }
                      aria-label={`Move ${sec.title} down`}
                      className="p-1.5 text-neutral-600 hover:text-[#0058be] disabled:opacity-20 disabled:hover:text-neutral-600 cursor-pointer disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  {/* Toggle Active/Disabled */}
                  <button
                    type="button"
                    onClick={() => handleToggle(sec.id, isEnabled)}
                    disabled={isLocked || isHero} // Hero cannot be hidden
                    title={
                      isLocked
                        ? 'Architecture is locked'
                        : isHero
                        ? 'Hero section cannot be hidden'
                        : isEnabled
                        ? 'Hide section from portfolio'
                        : 'Activate section in portfolio'
                    }
                    aria-label={isEnabled ? `Hide ${sec.title}` : `Show ${sec.title}`}
                    className={cn(
                      'p-2 rounded-xl text-xs font-bold transition-colors border',
                      isHero || isLocked
                        ? 'bg-neutral-100 text-neutral-400 border-neutral-200 opacity-60 cursor-not-allowed'
                        : isEnabled
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 cursor-pointer'
                        : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200 cursor-pointer'
                    )}
                  >
                    {isEnabled ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
              </div>

              {/* Placement Rationale & Copy Snippet */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/80 space-y-0.5">
                  <span className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Placement Rationale
                  </span>
                  <p className="text-neutral-700 leading-snug line-clamp-2">
                    {placementMeta.placementReason}
                  </p>
                </div>

                <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/80 space-y-0.5">
                  <span className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Current Headline Preview
                  </span>
                  <p className="text-neutral-900 font-bold leading-snug line-clamp-2">
                    "{sec.headline}"
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          5. BOTTOM STEP NAVIGATION FOOTER
      ────────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-neutral-200">
        <div className="space-y-0.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-500">Active Funnel:</span>
            <strong className="text-[#0b1c30]">
              {activeSectionsCount} of {sections.length} Sections Active
            </strong>
            <span className="text-neutral-300">•</span>
            <span className="text-neutral-500">
              {diff.isCustomized ? 'Custom Sequence' : 'Recommended Sequence'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-500">Archetype Preset:</span>
            <span className="font-bold text-[#0058be]">{activeArchetypeMeta.name}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <ModuleButton onClick={onContinue} className="cursor-pointer">
            <span>Continue to Portfolio Canvas</span>
            <ChevronRight size={15} />
          </ModuleButton>
        </div>
      </div>
    </div>
  );
});

SectionHierarchySection.displayName = 'SectionHierarchySection';

export default SectionHierarchySection;
