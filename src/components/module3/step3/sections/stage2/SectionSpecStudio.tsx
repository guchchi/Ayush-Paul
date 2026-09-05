/**
 * SectionSpecStudio.tsx — Level 2 Phase 3: Portfolio Architecture Canvas
 *
 * Implements the interactive 3-column Strategic Portfolio Canvas:
 * 1. Left Structure Panel: compact section list, 1-based numbering, Hero locked at #1,
 *    reorder controls, enable/disable toggles, recommendation vs custom badges,
 *    and "+ Add Section" for restoring omitted sections.
 * 2. Center Live Portfolio Wireframe: architectural wireframe blocks built directly
 *    from authoritySuite.portfolioBlueprint. Low-fidelity, luxury architectural layout,
 *    interactive selection syncing to Left and Right panels.
 * 3. Right Section Intelligence & Spec Editor: strategic rationale (Purpose, Conversion Role,
 *    Why Here, Content Direction, Visual Recommendation, Real Proof References, What to Avoid)
 *    and direct content editing (Headline, Subheadline, Body, CTA, Trust statement).
 *
 * Persists immediately via updatePortfolioSection & reorderPortfolioSections in useModule3Store.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Palette,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Lock,
  RotateCcw,
  AlertTriangle,
  AlertCircle,
  Plus,
  Compass,
  Check,
  Target,
  ExternalLink,
  Shield,
  HelpCircle,
  MousePointer,
  Maximize2,
} from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import { useModule3Store } from '../../../../../lib/module3/store';
import { ModuleButton } from '../../../../workspace/ModuleButton';
import type { PortfolioBlueprintSection } from '../../../../../data/module3/authority-suite-engine';
import {
  PORTFOLIO_ARCHETYPES,
  PortfolioGoal,
  getArchitectureRationale,
  getSectionPlacementMetadata,
  diffArchitecture,
  validateArchitecture,
  getSectionStrategicGuidance,
} from '../../../../../lib/module3/portfolio-architecture-engine';

interface Props {
  onContinue: () => void;
}

export const SectionSpecStudio: React.FC<Props> = React.memo(({ onContinue }) => {
  const {
    authoritySuite,
    updatePortfolioSection,
    reorderPortfolioSections,
    restoreRecommendedStructure,
    stage2Archetype,
    mod1ServiceId,
    mod1MarketId,
    mod2UniqueMechanism,
    proofAssets,
  } = useModule3Store();

  // Mobile / tablet segmented view mode ('structure' | 'wireframe' | 'intelligence')
  const [mobileTab, setMobileTab] = useState<'structure' | 'wireframe' | 'intelligence'>('wireframe');
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [showAddSectionMenu, setShowAddSectionMenu] = useState(false);

  // Single Source of Truth
  const sections: PortfolioBlueprintSection[] = useMemo(() => {
    return authoritySuite?.portfolioBlueprint ?? [];
  }, [authoritySuite?.portfolioBlueprint]);

  const activeSections = useMemo(() => {
    return sections.filter((s) => s.isEnabled !== false);
  }, [sections]);

  const disabledSections = useMemo(() => {
    return sections.filter((s) => s.isEnabled === false);
  }, [sections]);

  // Selected Section ID (defaults to first active section, or section_hero)
  const [selectedSectionId, setSelectedSectionId] = useState<string>(() => {
    return activeSections[0]?.id || sections[0]?.id || 'section_hero';
  });

  // Ensure selectedSection stays valid even after reorder or enable/disable
  const selectedSection = useMemo(() => {
    return (
      sections.find((s) => s.id === selectedSectionId) ||
      activeSections[0] ||
      sections[0]
    );
  }, [sections, selectedSectionId, activeSections]);
  // Inherited Context
  const market = (mod1MarketId || '').replace(/_/g, ' ') || 'High-growth companies';
  const service = (mod1ServiceId || '').replace(/_/g, ' ') || 'Specialized systems';
  const mechanism = mod2UniqueMechanism || 'Proof-First Architecture';

  // Active Archetype & Goal
  const activeArchetypeId = stage2Archetype?.selectedArchetypeId || 'proof_first';
  const portfolioGoal: PortfolioGoal = stage2Archetype?.portfolioGoal || 'retainer';
  const isLocked = Boolean(stage2Archetype?.isLocked);

  const activeArchetypeMeta = useMemo(() => {
    return (
      PORTFOLIO_ARCHETYPES.find((a) => a.id === activeArchetypeId) ||
      PORTFOLIO_ARCHETYPES[0]
    );
  }, [activeArchetypeId]);
  // Architecture Diff & Validation
  const diff = useMemo(() => {
    return diffArchitecture(sections, activeArchetypeMeta.recommendedOrder);
  }, [sections, activeArchetypeMeta.recommendedOrder]);

  const warnings = useMemo(() => {
    return validateArchitecture(sections, activeArchetypeId, portfolioGoal);
  }, [sections, activeArchetypeId, portfolioGoal]);

  // Strategic Placement & Guidance for Selected Section
  const placementMeta = useMemo(() => {
    if (!selectedSection) return null;
    return getSectionPlacementMetadata(selectedSection.id, activeArchetypeId, portfolioGoal);
  }, [selectedSection, activeArchetypeId, portfolioGoal]);

  const strategicGuidance = useMemo(() => {
    if (!selectedSection) return null;
    return getSectionStrategicGuidance(selectedSection.id);
  }, [selectedSection]);

  // Direct section field edit
  const handleFieldChange = useCallback(
    (field: keyof PortfolioBlueprintSection, value: any) => {
      if (isLocked || !selectedSection) return;
      updatePortfolioSection(selectedSection.id, { [field]: value });
    },
    [isLocked, selectedSection, updatePortfolioSection]
  );

  // Section Reordering with strict Hero (#1) protection
  const handleMoveUp = useCallback(
    (index: number) => {
      if (isLocked || index <= 1) return; // Cannot move Hero or move section above Hero
      const newSections = [...sections];
      const temp = newSections[index];
      newSections[index] = newSections[index - 1];
      newSections[index - 1] = temp;

      // Re-index sectionNumber while keeping Hero strictly at 1
      const reindexed = newSections.map((s, idx) => ({
        ...s,
        sectionNumber: idx + 1,
      }));
      reorderPortfolioSections(reindexed);
    },
    [isLocked, sections, reorderPortfolioSections]
  );

  const handleMoveDown = useCallback(
    (index: number) => {
      if (isLocked || index === 0 || index >= sections.length - 1) return; // Hero cannot move down, last cannot move down
      const newSections = [...sections];
      const temp = newSections[index];
      newSections[index] = newSections[index + 1];
      newSections[index + 1] = temp;

      const reindexed = newSections.map((s, idx) => ({
        ...s,
        sectionNumber: idx + 1,
      }));
      reorderPortfolioSections(reindexed);
    },
    [isLocked, sections, reorderPortfolioSections]
  );

  // Toggle Section Visibility
  const handleToggleVisibility = useCallback(
    (sectionId: string, currentEnabled: boolean) => {
      if (isLocked || sectionId === 'section_hero') return; // Hero is permanently protected
      updatePortfolioSection(sectionId, {
        isEnabled: !currentEnabled,
      });
    },
    [isLocked, updatePortfolioSection]
  );

  // Add (Re-enable) Section
  const handleEnableSection = useCallback(
    (sectionId: string) => {
      if (isLocked) return;
      updatePortfolioSection(sectionId, { isEnabled: true });
      setSelectedSectionId(sectionId);
      setShowAddSectionMenu(false);
    },
    [isLocked, updatePortfolioSection]
  );

  // Restore Recommended Structure
  const handleRestoreRecommended = useCallback(() => {
    if (isLocked) return;
    restoreRecommendedStructure(activeArchetypeId);
    setShowRestoreConfirm(false);
  }, [isLocked, restoreRecommendedStructure, activeArchetypeId]);

  // Quick Inject Real Step 2 Proof Asset title
  const handleInjectProof = useCallback(
    (proofTitle: string) => {
      if (isLocked || !selectedSection) return;
      const currentBody = selectedSection.bodyCopy || '';
      const updatedBody = currentBody.includes(proofTitle)
        ? currentBody
        : `${currentBody}\n\n[Proof Reference: "${proofTitle}"]`;
      handleFieldChange('bodyCopy', updatedBody);
    },
    [isLocked, selectedSection, handleFieldChange]
  );

  if (!sections || sections.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-neutral-200 shadow-xs space-y-3">
        <Sparkles className="w-8 h-8 mx-auto text-[#0058be] animate-pulse" />
        <h3 className="text-base font-black text-[#0b1c30]">Initializing Portfolio Canvas...</h3>
        <p className="text-xs text-neutral-500 max-w-md mx-auto">
          Setting up your strategic portfolio architecture. Please verify Phase 1 and Phase 2 selections.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 text-left w-full">
      {/* ── Top Strategy Bar & Architecture Status ──────────────────────────── */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#0058be] text-xs font-mono font-bold uppercase tracking-wider">
              <Compass size={14} />
              <span>Step 3 of 5 — Portfolio Architecture Canvas</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0b1c30] mt-0.5">
              Interactive Strategy &amp; Wireframe Canvas
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed mt-0.5">
              Design the conversion strategy of your portfolio. Reorder structural blocks, inspect live architectural wireframes, and calibrate section intelligence.
            </p>
          </div>

          {/* Archetype & Diff Status Badge */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 text-[11px] font-bold text-neutral-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0058be]" />
              <span>Archetype: <strong>{activeArchetypeMeta.name}</strong></span>
            </div>

            {diff.isCustomized ? (
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold flex items-center gap-1">
                  <AlertTriangle size={12} className="text-amber-600" />
                  <span>Customized Sequence</span>
                </span>
                {!showRestoreConfirm ? (
                  <button
                    onClick={() => setShowRestoreConfirm(true)}
                    disabled={isLocked}
                    className="px-2.5 py-1 text-[11px] font-bold text-neutral-600 hover:text-[#0058be] disabled:opacity-40 disabled:hover:text-neutral-600 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-1 shadow-2xs"
                  >
                    <RotateCcw size={11} />
                    <span>Reset to Archetype</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 bg-amber-50 p-1 rounded-xl border border-amber-200">
                    <span className="text-[10px] text-amber-900 font-bold px-1">Reset structure?</span>
                    <button
                      onClick={handleRestoreRecommended}
                      disabled={isLocked}
                      className="px-2 py-0.5 bg-[#0058be] text-white text-[10px] font-bold rounded-lg cursor-pointer hover:bg-[#00469b] disabled:opacity-50"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setShowRestoreConfirm(false)}
                      className="px-2 py-0.5 bg-white text-neutral-600 text-[10px] font-bold rounded-lg cursor-pointer hover:bg-neutral-100 border border-neutral-200"
                    >
                      No
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center gap-1">
                <CheckCircle2 size={12} className="text-emerald-600" />
                <span>Recommended Order Active</span>
              </span>
            )}
          </div>
        </div>

        {/* Locked Architecture Banner */}
        {isLocked && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Lock size={15} className="text-amber-700 shrink-0" />
              <div>
                <span className="font-bold text-xs block text-amber-950">Architecture Finalized &amp; Locked</span>
                <span className="text-[11px] text-amber-800">
                  Section specs, copy inputs, and sequence order are locked in read-only mode. Go to Step 5 to unlock if revisions are required.
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 font-mono text-[10px] font-bold uppercase shrink-0 border border-amber-300">
              Read-Only
            </span>
          </div>
        )}

        {/* Warning Callout if any */}
        {warnings.length > 0 && (
          <div className="pt-2 border-t border-neutral-100 flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase">
              Architecture Notice
            </span>
            <span className="text-neutral-600 truncate">{warnings[0].message}</span>
          </div>
        )}
      </div>

      {/* ── Mobile / Tablet Segmented Tabs (Screens < 1024px) ─────────────── */}
      <div className="lg:hidden flex items-center bg-neutral-100 p-1 rounded-2xl border border-neutral-200">
        <button
          onClick={() => setMobileTab('structure')}
          className={cn(
            'flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5',
            mobileTab === 'structure'
              ? 'bg-white text-[#0058be] shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          )}
        >
          <Layers size={13} />
          <span>Structure ({activeSections.length})</span>
        </button>
        <button
          onClick={() => setMobileTab('wireframe')}
          className={cn(
            'flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5',
            mobileTab === 'wireframe'
              ? 'bg-white text-[#0058be] shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          )}
        >
          <MousePointer size={13} />
          <span>Wireframe</span>
        </button>
        <button
          onClick={() => setMobileTab('intelligence')}
          className={cn(
            'flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5',
            mobileTab === 'intelligence'
              ? 'bg-white text-[#0058be] shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          )}
        >
          <Lightbulb size={13} />
          <span>Intelligence</span>
        </button>
      </div>

      {/* ── Master 3-Column Canvas Grid (Desktop) ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ═══════════════════════════════════════════════════════════════════════
            LEFT COLUMN: STRUCTURE PANEL (~260px desktop, lg:col-span-3)
            ═══════════════════════════════════════════════════════════════════════ */}
        <div
          className={cn(
            'lg:col-span-3 space-y-3 lg:sticky lg:top-4',
            mobileTab !== 'structure' && 'hidden lg:block'
          )}
        >
          <div className="bg-white p-4 rounded-3xl border border-neutral-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                  <Layers size={13} className="text-[#0058be]" />
                  <span>Structure</span>
                </h3>
                <span className="text-[10px] text-neutral-400 block font-medium">
                  {activeSections.length} active • {sections.length} total
                </span>
              </div>

              {/* Add Section Menu Toggle */}
              {disabledSections.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowAddSectionMenu(!showAddSectionMenu)}
                    disabled={isLocked}
                    className="px-2.5 py-1 bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-white text-xs font-bold text-[#0058be] border border-blue-200 rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-1 shadow-2xs"
                  >
                    <Plus size={12} />
                    <span>Add Section</span>
                  </button>

                  {showAddSectionMenu && !isLocked && (
                    <div className="absolute left-0 mt-1.5 w-56 bg-white border border-neutral-200 rounded-2xl shadow-lg p-2 z-30 space-y-1">
                      <div className="text-[10px] font-extrabold uppercase text-neutral-400 px-2 py-1">
                        Omitted Sections:
                      </div>
                      {disabledSections.map((sec) => (
                        <button
                          key={sec.id}
                          onClick={() => handleEnableSection(sec.id)}
                          className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-blue-50 text-xs text-neutral-700 font-semibold cursor-pointer transition-colors flex items-center justify-between"
                        >
                          <span className="truncate">{sec.title}</span>
                          <Plus size={12} className="text-[#0058be]" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Section Rows */}
            <div className="space-y-1.5" role="list" aria-label="Portfolio sections sequence">
              {sections.map((sec, idx) => {
                const isSelected = sec.id === selectedSection?.id;
                const isHero = sec.id === 'section_hero';
                const isEnabled = sec.isEnabled !== false;
                const isFirstMovable = idx === 1;
                const isLastMovable = idx === sections.length - 1;

                return (
                  <div
                    key={sec.id}
                    role="listitem"
                    aria-selected={isSelected}
                    className={cn(
                      'group rounded-2xl border transition-all text-left p-2.5 flex items-center justify-between gap-2',
                      isSelected
                        ? 'bg-blue-50/70 border-[#0058be] ring-2 ring-[#0058be]/15 shadow-xs'
                        : isEnabled
                        ? 'bg-neutral-50/70 hover:bg-white border-neutral-200'
                        : 'bg-neutral-100/60 border-dashed border-neutral-200 opacity-60'
                    )}
                  >
                    {/* Left: Reorder & Number */}
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Drag / Reorder Controls */}
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveUp(idx);
                          }}
                          disabled={isLocked || isHero || isFirstMovable}
                          aria-label={`Move ${sec.title} up`}
                          className={cn(
                            'p-0.5 rounded hover:bg-neutral-200 text-neutral-400 hover:text-neutral-900 transition-colors',
                            (isLocked || isHero || isFirstMovable) && 'opacity-20 cursor-not-allowed hover:bg-transparent'
                          )}
                        >
                          <ArrowUp size={11} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveDown(idx);
                          }}
                          disabled={isLocked || isHero || isLastMovable}
                          aria-label={`Move ${sec.title} down`}
                          className={cn(
                            'p-0.5 rounded hover:bg-neutral-200 text-neutral-400 hover:text-neutral-900 transition-colors',
                            (isLocked || isHero || isLastMovable) && 'opacity-20 cursor-not-allowed hover:bg-transparent'
                          )}
                        >
                          <ArrowDown size={11} />
                        </button>
                      </div>

                      {/* Number Badge */}
                      <span
                        className={cn(
                          'w-6 h-6 rounded-lg text-[11px] font-mono font-bold flex items-center justify-center shrink-0 border',
                          isSelected
                            ? 'bg-[#0058be] text-white border-[#0058be]'
                            : isHero
                            ? 'bg-blue-100/70 text-[#0058be] border-blue-200'
                            : 'bg-white text-neutral-600 border-neutral-200'
                        )}
                      >
                        {idx < 9 ? `0${idx + 1}` : idx + 1}
                      </span>

                      {/* Title & Click to Select */}
                      <button
                        onClick={() => {
                          setSelectedSectionId(sec.id);
                          setMobileTab('intelligence');
                        }}
                        className="text-left min-w-0 flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-1">
                          <h4
                            className={cn(
                              'text-xs font-bold truncate',
                              isSelected ? 'text-[#0058be]' : 'text-neutral-800'
                            )}
                          >
                            {sec.title}
                          </h4>
                          {isHero && (
                            <span title="Hero locked at Position 1" className="inline-flex items-center">
                              <Lock size={10} className="text-[#0058be] shrink-0" />
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-neutral-400 block truncate font-medium">
                          {isHero ? 'Hook & Orient' : sec.ctaText || 'Informational'}
                        </span>
                      </button>
                    </div>

                    {/* Right: Visibility Toggle */}
                    <div className="shrink-0 flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleVisibility(sec.id, isEnabled);
                        }}
                        disabled={isLocked || isHero}
                        aria-label={isEnabled ? `Disable ${sec.title}` : `Enable ${sec.title}`}
                        title={isLocked ? 'Architecture is locked' : isHero ? 'Hero cannot be disabled' : isEnabled ? 'Click to hide section' : 'Click to enable section'}
                        className={cn(
                          'p-1.5 rounded-lg transition-colors cursor-pointer',
                          isHero || isLocked
                            ? 'text-[#0058be] bg-blue-50/60 cursor-not-allowed opacity-60'
                            : isEnabled
                            ? 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200'
                            : 'text-neutral-400 bg-neutral-200 hover:bg-neutral-300'
                        )}
                      >
                        {isEnabled ? <Eye size={13} /> : <EyeOff size={13} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Structure Hint */}
            <div className="p-2.5 bg-neutral-50 rounded-2xl border border-neutral-200/70 text-[11px] text-neutral-500 space-y-1">
              <span className="font-bold text-neutral-700 block">💡 Invariant Rule:</span>
              <p className="leading-relaxed">
                Hero is permanently locked at #1 to establish category context. Use arrows to reorder subsequent sections.
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            CENTER COLUMN: LIVE PORTFOLIO WIREFRAME (lg:col-span-5)
            ═══════════════════════════════════════════════════════════════════════ */}
        <div
          className={cn(
            'lg:col-span-5 space-y-3',
            mobileTab !== 'wireframe' && 'hidden lg:block'
          )}
        >
          {/* Wireframe Header */}
          <div className="bg-white px-4 py-3 rounded-2xl border border-neutral-200 shadow-xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-neutral-800 uppercase tracking-wider text-[11px]">
                Strategic Wireframe Canvas
              </span>
            </div>
            <span className="text-[11px] text-neutral-400 font-mono">
              Click block to inspect strategy
            </span>
          </div>

          {/* Wireframe Canvas Container */}
          <div className="space-y-4">
            {sections
              .filter((sec) => sec.isEnabled !== false)
              .map((sec, blockIdx) => {
                const isSelected = sec.id === selectedSection?.id;
                const isHero = sec.id === 'section_hero';
                const isProof = sec.id === 'section_proof';
                const isServices = sec.id === 'section_services';
                const isCaseStudies = sec.id === 'section_case_studies';
                const isAbout = sec.id === 'section_about';
                const isFAQ = sec.id === 'section_faq';
                const isCTA = sec.id === 'section_cta';

                return (
                  <div
                    key={sec.id}
                    onClick={() => {
                      setSelectedSectionId(sec.id);
                      setMobileTab('intelligence');
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedSectionId(sec.id);
                      }
                    }}
                    className={cn(
                      'group relative rounded-3xl border transition-all text-left cursor-pointer overflow-hidden p-5 sm:p-6 space-y-3.5',
                      isSelected
                        ? 'bg-white border-[#0058be] ring-3 ring-[#0058be]/15 shadow-md'
                        : 'bg-neutral-50/90 hover:bg-white border-neutral-200/90 hover:border-neutral-300 shadow-xs'
                    )}
                  >
                    {/* Top Wireframe Bar: Section Stage & Label */}
                    <div className="flex items-center justify-between text-[10px] font-mono font-extrabold uppercase tracking-wider pb-2 border-b border-neutral-200/60">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            'w-5 h-5 rounded-md flex items-center justify-center font-bold',
                            isSelected
                              ? 'bg-[#0058be] text-white'
                              : 'bg-neutral-200 text-neutral-700'
                          )}
                        >
                          0{blockIdx + 1}
                        </span>
                        <span className="text-neutral-800">{sec.title}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-neutral-400">
                          {isHero
                            ? 'STAGE // ORIENT'
                            : isProof
                            ? 'STAGE // VERIFY'
                            : isServices
                            ? 'STAGE // ENGAGE'
                            : isCTA
                            ? 'STAGE // CONVERT'
                            : 'STAGE // EVALUATE'}
                        </span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#0058be]" />
                        )}
                      </div>
                    </div>

                    {/* Headline & Hierarchy */}
                    <div className="space-y-1">
                      <h3
                        className={cn(
                          'text-base sm:text-lg font-black tracking-tight leading-snug',
                          isSelected ? 'text-[#0058be]' : 'text-[#0b1c30]'
                        )}
                      >
                        {sec.headline || `${sec.title} Headline`}
                      </h3>
                      <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                        {sec.subheadline || sec.purpose}
                      </p>
                    </div>

                    {/* ── Strategic Architectural Block Content Wireframe ─── */}

                    {/* HERO BLOCK */}
                    {isHero && (
                      <div className="space-y-3 pt-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="px-3.5 py-1.5 rounded-xl bg-[#0058be] text-white text-xs font-bold shadow-2xs">
                            {sec.ctaText || 'Schedule Architecture Sprint →'}
                          </div>
                          {sec.trustStatement && (
                            <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold">
                              {sec.trustStatement}
                            </span>
                          )}
                        </div>

                        {/* Interactive Prototype Placeholder Box */}
                        <div className="p-3 bg-neutral-100/90 rounded-2xl border border-dashed border-neutral-300 text-neutral-500 text-[11px] font-mono flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Layers size={13} className="text-[#0058be]" />
                            <span>WIREFRAME // Interactive Mechanism Schematic &amp; Live Demo</span>
                          </span>
                          <span className="text-[10px] text-neutral-400">Above Fold</span>
                        </div>
                      </div>
                    )}

                    {/* PROOF BLOCK */}
                    {isProof && (
                      <div className="space-y-2 pt-1">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 bg-neutral-100 rounded-xl border border-dashed border-neutral-300 space-y-1">
                            <span className="text-[10px] font-mono text-[#0058be] font-bold block uppercase">
                              Proof Artifact #01
                            </span>
                            <p className="text-[11px] text-neutral-700 font-semibold truncate">
                              Live System Repository
                            </p>
                            <span className="text-[10px] text-neutral-400 block font-mono">
                              [ Inspect Codebase ]
                            </span>
                          </div>
                          <div className="p-2.5 bg-neutral-100 rounded-xl border border-dashed border-neutral-300 space-y-1">
                            <span className="text-[10px] font-mono text-[#0058be] font-bold block uppercase">
                              Proof Artifact #02
                            </span>
                            <p className="text-[11px] text-neutral-700 font-semibold truncate">
                              Recorded Loom Walkthrough
                            </p>
                            <span className="text-[10px] text-neutral-400 block font-mono">
                              [ Watch 3-Min Audit ]
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SERVICES BLOCK */}
                    {isServices && (
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div className="p-2.5 bg-neutral-100 rounded-xl border border-dashed border-neutral-300 space-y-1">
                          <span className="text-[10px] font-mono text-emerald-700 font-bold block uppercase">
                            Sprint Engagement
                          </span>
                          <span className="text-[11px] font-bold text-neutral-800 block">
                            2-Week Implementation
                          </span>
                          <span className="text-[10px] text-neutral-500 block">
                            Fixed Scope • Rapid Delivery
                          </span>
                        </div>
                        <div className="p-2.5 bg-neutral-100 rounded-xl border border-dashed border-neutral-300 space-y-1">
                          <span className="text-[10px] font-mono text-purple-700 font-bold block uppercase">
                            Advisory Retainer
                          </span>
                          <span className="text-[11px] font-bold text-neutral-800 block">
                            Ongoing Architecture
                          </span>
                          <span className="text-[10px] text-neutral-500 block">
                            Weekly Sync • Direct Access
                          </span>
                        </div>
                      </div>
                    )}

                    {/* CASE STUDIES BLOCK */}
                    {isCaseStudies && (
                      <div className="p-3 bg-neutral-100 rounded-2xl border border-dashed border-neutral-300 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                          <span>STAR CASE STUDY BREAKDOWN</span>
                          <span className="text-[#0058be] font-bold">Constraint → Solution → Outcome</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-700">
                          <span className="px-2 py-0.5 rounded bg-white font-mono font-bold text-[10px]">
                            CASE #01
                          </span>
                          <span className="font-semibold truncate">
                            {market} Transformation Architecture
                          </span>
                        </div>
                      </div>
                    )}

                    {/* ABOUT / MECHANISM BLOCK */}
                    {isAbout && (
                      <div className="p-3 bg-neutral-100 rounded-2xl border border-dashed border-neutral-300 space-y-1.5 text-xs">
                        <span className="text-[10px] font-mono text-indigo-700 font-bold block uppercase">
                          The Proprietary Mechanism: {mechanism}
                        </span>
                        <p className="text-[11px] text-neutral-600 line-clamp-2">
                          {sec.bodyCopy || 'Why conventional approaches fail and how our structural framework produces predictable client ROI.'}
                        </p>
                      </div>
                    )}

                    {/* FAQ BLOCK */}
                    {isFAQ && (
                      <div className="space-y-1.5 pt-1 text-xs">
                        <div className="p-2 bg-neutral-100 rounded-xl border border-dashed border-neutral-300 flex items-center justify-between">
                          <span className="text-[11px] text-neutral-700 font-medium">
                            How fast can we begin implementation?
                          </span>
                          <span className="text-neutral-400 font-mono text-xs">+</span>
                        </div>
                        <div className="p-2 bg-neutral-100 rounded-xl border border-dashed border-neutral-300 flex items-center justify-between">
                          <span className="text-[11px] text-neutral-700 font-medium">
                            What happens if revisions or scope adjustments are needed?
                          </span>
                          <span className="text-neutral-400 font-mono text-xs">+</span>
                        </div>
                      </div>
                    )}

                    {/* FINAL CTA BLOCK */}
                    {isCTA && (
                      <div className="p-4 bg-neutral-900 text-white rounded-2xl space-y-2.5 text-xs text-center">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                          CONVERSION TRIGGER // DIRECT SCHEDULER
                        </span>
                        <div className="text-sm font-black text-white">
                          {sec.headline || 'Ready to Engineer Your System?'}
                        </div>
                        <div className="inline-block px-4 py-2 rounded-xl bg-white text-neutral-900 font-bold text-xs shadow-sm">
                          {sec.ctaText || 'Confirm Architecture Call →'}
                        </div>
                        {sec.trustStatement && (
                          <div className="text-[10px] text-emerald-400 font-medium">
                            {sec.trustStatement}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Default Informational Body if not special block */}
                    {!isHero && !isProof && !isServices && !isCaseStudies && !isAbout && !isFAQ && !isCTA && (
                      <div className="p-2.5 bg-neutral-100 rounded-xl border border-dashed border-neutral-300 text-neutral-500 text-[11px] font-mono">
                        {sec.bodyCopy ? sec.bodyCopy.slice(0, 100) + '...' : 'Modular architecture block content placeholder.'}
                      </div>
                    )}

                    {/* Bottom Indicator */}
                    <div className="pt-1 flex items-center justify-between text-[10px] text-neutral-400">
                      <span>Section ID: <code className="font-mono text-neutral-600">{sec.id}</code></span>
                      <span className="font-bold text-[#0058be] group-hover:underline flex items-center gap-0.5">
                        Inspect Intelligence <ArrowRight size={10} />
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            RIGHT COLUMN: SECTION INTELLIGENCE & SPEC STUDIO (lg:col-span-4)
            ═══════════════════════════════════════════════════════════════════════ */}
        <div
          className={cn(
            'lg:col-span-4 space-y-4 lg:sticky lg:top-4',
            mobileTab !== 'intelligence' && 'hidden lg:block'
          )}
        >
          {selectedSection ? (
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin">
              {/* Header Badge & Title */}
              <div className="space-y-1 pb-3 border-b border-neutral-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#0058be] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    Section #{selectedSection.sectionNumber || 1} • Intelligence
                  </span>

                  {placementMeta && (
                    <span
                      className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                        placementMeta.priority.color
                      )}
                    >
                      {placementMeta.priority.level} PRIORITY
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-black text-[#0b1c30] mt-1">
                  {selectedSection.title}
                </h3>
              </div>

              {/* Architecture Locked Notice */}
              {isLocked && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900">
                  <div className="flex items-center gap-2 font-bold">
                    <Lock size={14} className="text-amber-700 shrink-0" />
                    <span>Architecture Locked (Read-Only)</span>
                  </div>
                  <span className="text-[10px] text-amber-700 font-mono uppercase font-bold">Step 5 to unlock</span>
                </div>
              )}

              {/* 1. PURPOSE & CONVERSION ROLE */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  <Target size={13} className="text-[#0058be]" />
                  <span>Purpose &amp; Conversion Role</span>
                </div>
                <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200/80 space-y-1.5 text-xs">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-[#0058be] block">
                      Conversion Role:
                    </span>
                    <p className="font-bold text-neutral-900">
                      {strategicGuidance?.conversionRole || selectedSection.purpose}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-neutral-500 block">
                      Core Job:
                    </span>
                    <p className="text-neutral-700 leading-relaxed font-medium">
                      {strategicGuidance?.purpose || selectedSection.purpose}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. WHY HERE (Placement Rationale) */}
              {placementMeta && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-700 flex items-center gap-1">
                    <Compass size={12} className="text-[#0058be]" />
                    Why Positioned Here
                  </span>
                  <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-200/70 text-xs text-neutral-700 leading-relaxed font-medium">
                    {placementMeta.placementReason}
                  </div>
                </div>
              )}

              {/* 3. CONTENT DIRECTION & EDITING FIELDS */}
              <div className="space-y-3 pt-2 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    Content Specification
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {isLocked ? 'Locked (Read-Only)' : 'Auto-saved'}
                  </span>
                </div>

                {/* Content Direction Guidance */}
                {strategicGuidance && (
                  <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/80 text-xs text-neutral-600 leading-relaxed">
                    <strong className="text-neutral-800 font-semibold block mb-0.5">Content Direction:</strong>
                    {strategicGuidance.contentDirection}
                  </div>
                )}

                {/* Field: Headline */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <label className="font-bold text-neutral-700 uppercase">
                      Recommended Headline
                    </label>
                    <span className="text-neutral-400">
                      {(selectedSection.headline || '').length} chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={selectedSection.headline || ''}
                    onChange={(e) => handleFieldChange('headline', e.target.value)}
                    disabled={isLocked}
                    readOnly={isLocked}
                    className="w-full px-3 py-2 bg-white disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed border border-neutral-300 rounded-xl text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#0058be] focus:ring-2 focus:ring-[#0058be]/10 transition-all"
                    placeholder="Punchy strategic headline..."
                  />
                </div>

                {/* Field: Subheadline */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <label className="font-bold text-neutral-700 uppercase">
                      Subheadline / Positioning
                    </label>
                    <span className="text-neutral-400">
                      {(selectedSection.subheadline || '').length} chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={selectedSection.subheadline || ''}
                    onChange={(e) => handleFieldChange('subheadline', e.target.value)}
                    disabled={isLocked}
                    readOnly={isLocked}
                    className="w-full px-3 py-2 bg-white disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed border border-neutral-300 rounded-xl text-xs text-neutral-800 font-medium focus:outline-none focus:border-[#0058be] focus:ring-2 focus:ring-[#0058be]/10 transition-all"
                    placeholder="Supporting value narrative..."
                  />
                </div>

                {/* Field: Body Copy */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <label className="font-bold text-neutral-700 uppercase">
                      Body Copy &amp; Narrative
                    </label>
                    <span className="text-neutral-400">
                      {(selectedSection.bodyCopy || '').split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={selectedSection.bodyCopy || ''}
                    onChange={(e) => handleFieldChange('bodyCopy', e.target.value)}
                    disabled={isLocked}
                    readOnly={isLocked}
                    className="w-full px-3 py-2 bg-white disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed border border-neutral-300 rounded-xl text-xs text-neutral-800 leading-relaxed focus:outline-none focus:border-[#0058be] focus:ring-2 focus:ring-[#0058be]/10 transition-all resize-y"
                    placeholder="Strategic copy narrative..."
                  />
                </div>

                {/* Field: CTA Button Label & Trust statement */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-700 uppercase block">
                      CTA Label
                    </label>
                    <input
                      type="text"
                      value={selectedSection.ctaText || ''}
                      onChange={(e) => handleFieldChange('ctaText', e.target.value)}
                      disabled={isLocked}
                      readOnly={isLocked}
                      className="w-full px-3 py-1.5 bg-white disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed border border-neutral-300 rounded-xl text-xs font-bold text-[#0058be] focus:outline-none focus:border-[#0058be] transition-all"
                      placeholder="e.g. Schedule Call"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-700 uppercase block">
                      Trust Guarantee
                    </label>
                    <input
                      type="text"
                      value={selectedSection.trustStatement || ''}
                      onChange={(e) => handleFieldChange('trustStatement', e.target.value)}
                      disabled={isLocked}
                      readOnly={isLocked}
                      className="w-full px-3 py-1.5 bg-white disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed border border-neutral-300 rounded-xl text-xs text-emerald-800 font-medium focus:outline-none focus:border-emerald-500 transition-all"
                      placeholder="e.g. Zero-risk guarantee"
                    />
                  </div>
                </div>
              </div>

              {/* 4. VISUAL RECOMMENDATION */}
              {strategicGuidance && (
                <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-700 flex items-center gap-1">
                    <Palette size={12} className="text-[#0058be]" />
                    Visual Component Recommendation
                  </span>
                  <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80 text-xs text-neutral-700 font-medium leading-relaxed">
                    {strategicGuidance.visualRecommendation}
                  </div>
                </div>
              )}

              {/* 5. VERIFIED PROOF ASSETS (Zero Fake Proof) */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-700 flex items-center gap-1">
                    <ShieldCheck size={12} className="text-[#0058be]" />
                    Proof Supporting This Section
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    Step 2 Proof Vault
                  </span>
                </div>

                {proofAssets && proofAssets.length > 0 ? (
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap gap-1.5">
                      {proofAssets.map((asset) => (
                        <button
                          key={asset.id}
                          onClick={() => handleInjectProof(asset.title)}
                          disabled={isLocked}
                          className="px-2.5 py-1 bg-white hover:bg-blue-50 disabled:opacity-40 disabled:hover:bg-white border border-blue-200 text-[#0058be] rounded-lg text-xs font-semibold cursor-pointer disabled:cursor-not-allowed transition-colors flex items-center gap-1 shadow-2xs"
                          title={isLocked ? 'Architecture is locked' : 'Click to reference in body copy'}
                        >
                          <Zap size={10} />
                          <span className="truncate max-w-[160px]">{asset.title}</span>
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] text-neutral-400 block italic">
                      Click any verified asset above to anchor it directly into this section's copy.
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 text-xs text-neutral-500 space-y-1">
                    <span className="font-semibold text-neutral-700 block">No verified proof attached yet.</span>
                    <p className="text-[11px] leading-relaxed">
                      Complete Step 2 (Proof Asset Builder) to equip live codebases, case studies, or recorded walkthroughs.
                    </p>
                  </div>
                )}
              </div>

              {/* 6. WHAT TO AVOID */}
              {strategicGuidance && strategicGuidance.whatToAvoid.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 flex items-center gap-1">
                    <AlertCircle size={12} className="text-rose-600" />
                    What to Avoid
                  </span>
                  <div className="bg-rose-50/50 p-3 rounded-2xl border border-rose-200/70 space-y-1 text-xs">
                    {strategicGuidance.whatToAvoid.map((avoidItem, aIdx) => (
                      <div key={aIdx} className="flex items-start gap-1.5 text-neutral-700 text-[11px]">
                        <span className="text-rose-600 font-bold shrink-0">•</span>
                        <span>{avoidItem}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-neutral-200 shadow-xs space-y-2">
              <Lightbulb className="w-6 h-6 mx-auto text-neutral-400" />
              <h4 className="text-xs font-bold text-neutral-700">No Section Selected</h4>
              <p className="text-[11px] text-neutral-400">
                Select a section from the structure panel or wireframe to inspect its strategy.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Navigation Ribbon ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-neutral-200 bg-white p-4 sm:p-5 rounded-3xl border shadow-xs">
        <div className="text-xs text-neutral-500">
          <span className="font-bold text-neutral-700">All changes synchronized.</span> Sections are saved directly to your authority blueprint.
        </div>

        <div className="flex items-center gap-3">
          <ModuleButton onClick={onContinue}>
            Confirm Canvas &amp; Open Wireframe Simulator →
          </ModuleButton>
        </div>
      </div>
    </div>
  );
});

export default SectionSpecStudio;
