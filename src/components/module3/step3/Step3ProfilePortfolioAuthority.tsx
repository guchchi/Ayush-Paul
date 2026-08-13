/**
 * Step3ProfilePortfolioAuthority.tsx
 *
 * Module 3 — Step 3: Profile & Portfolio Authority
 *
 * 7-section sequential wizard. Each section produces store-persisted output.
 * Section completion is derived from `step3CompletedSections` in the store —
 * no local useState for progress, no progress loss on refresh.
 *
 * Section flow:
 *   1  AuthoritySnapshotSection     — read-only confirmation of upstream context
 *   2  ProfileStrategySection       — review/edit AI profile copy per platform
 *   3  BrandIdentitySection         — confirm brand tone & visual direction
 *   4  PortfolioOrderingCanvas      — reorder portfolio website sections
 *   5  EvidencePlacementSection     — map profile claims to proof assets
 *   6  ContentStrategySection       — approve deterministic content roadmap
 *   7  StrategySummarySection       — review assembled blueprint, complete step
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronRight, Lock, AlertTriangle, Sparkles } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { EASING, DURATION } from '../../../lib/motion-presets';
import { useModule3Store } from '../../../lib/module3/store';
import { generateFullAuthoritySuite } from '../../../data/module3/authority-suite-engine';

// ── Section components ────────────────────────────────────────────────────────
import { AuthoritySnapshotSection } from './sections/AuthoritySnapshotSection';
import { ProfileStrategySection } from './sections/ProfileStrategySection';
import { BrandIdentitySection } from './sections/BrandIdentitySection';
import { PortfolioOrderingCanvas } from './sections/PortfolioOrderingCanvas';
import { EvidencePlacementSection } from './sections/EvidencePlacementSection';
import { ContentStrategySection } from './sections/ContentStrategySection';
import { StrategySummarySection } from './sections/StrategySummarySection';

// ── Motion tokens ─────────────────────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 16, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -8, filter: 'blur(4px)' },
  transition: { duration: DURATION.NORMAL, ease: EASING.PREMIUM },
};

// ── Section metadata for Stepper ──────────────────────────────────────────────
const STAGE_CARDS = [
  {
    id: 1,
    stageNumber: '01',
    title: 'Social Profile Identity Studio',
    shortLabel: 'Profile Studio',
    purpose: 'Transform positioning claims into high-converting bio & headline copy for LinkedIn, X, Instagram & Personal Site.',
    whyWeDoThis: 'Prospects check your social profiles before booking a call. This stage ensures instant expert authority.',
    icon: User,
    color: 'from-blue-600 to-indigo-600',
    accentText: 'text-blue-400',
    borderHover: 'hover:border-blue-500/50',
    bgGlow: 'bg-blue-500/10',
  },
  {
    id: 2,
    stageNumber: '02',
    title: 'Portfolio Website Architecture Builder',
    shortLabel: 'Portfolio Builder',
    purpose: 'Structure your portfolio website layout wireframe & section sequence for maximum conversion.',
    whyWeDoThis: 'Ensures your proof assets hit the prospect at the exact psychological moment in their buyer journey.',
    icon: Layout,
    color: 'from-[#0058be] to-cyan-600',
    accentText: 'text-cyan-400',
    borderHover: 'hover:border-cyan-500/50',
    bgGlow: 'bg-cyan-500/10',
  },
  {
    id: 3,
    stageNumber: '03',
    title: 'Evidence Placement Matrix',
    shortLabel: 'Evidence Matrix',
    purpose: 'Link every profile & portfolio claim directly to verified Step 2 proof assets.',
    whyWeDoThis: 'Eliminates unproven promises so your positioning is 100% backed by demonstrable evidence.',
    icon: LinkIcon,
    color: 'from-emerald-600 to-teal-600',
    accentText: 'text-emerald-400',
    borderHover: 'hover:border-emerald-500/50',
    bgGlow: 'bg-emerald-500/10',
  },
  {
    id: 4,
    stageNumber: '04',
    title: 'Authority Content Roadmap Engine',
    shortLabel: 'Content Engine',
    purpose: 'Generate high-impact authority content hooks & 90-day publishing calendar.',
    whyWeDoThis: 'Establishes top-of-funnel organic trust and drives warm inbound traffic to your portfolio.',
    icon: Send,
    color: 'from-purple-600 to-pink-600',
    accentText: 'text-purple-400',
    borderHover: 'hover:border-purple-500/50',
    bgGlow: 'bg-purple-500/10',
  },
] as const;

// ── Step progress stepper ─────────────────────────────────────────────────────
function SectionStepper({
  currentStage,
  completed,
  onJump,
}: {
  currentStage: 'overview' | 1 | 2 | 3 | 4 | 'summary';
  completed: number[];
  onJump: (stage: 'overview' | 1 | 2 | 3 | 4 | 'summary') => void;
}) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 px-1 scrollbar-none">
      <button
        onClick={() => onJump('overview')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer shrink-0',
          currentStage === 'overview'
            ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-indigo-500 shadow-md'
            : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white'
        )}
      >
        <Sparkles size={14} className="text-amber-400" />
        <span>Launchpad Overview</span>
      </button>

      {STAGE_CARDS.map((card) => {
        const isDone = completed.includes(card.id);
        const isCurrent = currentStage === card.id;

        return (
          <button
            key={card.id}
            onClick={() => onJump(card.id as 1 | 2 | 3 | 4)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer shrink-0',
              isCurrent
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                : isDone
                ? 'bg-indigo-950/80 text-indigo-300 border-indigo-800 hover:bg-indigo-900'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
            )}
          >
            {isDone ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <span className="w-4 h-4 rounded-full bg-neutral-800 text-neutral-400 text-[10px] font-black flex items-center justify-center shrink-0">
                {card.id}
              </span>
            )}
            <span>{card.shortLabel}</span>
          </button>
        );
      })}

      <button
        onClick={() => onJump('summary')}
        className={cn(
          'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer shrink-0 ml-auto',
          currentStage === 'summary'
            ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
            : 'bg-neutral-900 text-emerald-400 border-neutral-800 hover:bg-emerald-950'
        )}
      >
        <Award size={14} />
        <span>Master Blueprint</span>
      </button>
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ completed }: { completed: number[] }) {
  const pct = Math.round((completed.length / 4) * 100);
  return (
    <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: EASING.PREMIUM }}
      />
    </div>
  );
}

// ── Portfolio section wrapper for Section 4 ───────────────────────────────────
function Section4Wrapper({ onContinue }: { onContinue: () => void }) {
  const authoritySuite = useModule3Store((s) => s.authoritySuite);
  const updatePortfolioSection = useModule3Store((s) => s.updatePortfolioSection);
  const setStep3AssetOrder = useModule3Store((s) => s.setStep3AssetOrder);
  const [sections, setSections] = useState(authoritySuite?.portfolioBlueprint ?? []);

  useEffect(() => {
    if (authoritySuite?.portfolioBlueprint) {
      setSections(authoritySuite.portfolioBlueprint);
    }
  }, [authoritySuite]);

  const handleSectionChange = useCallback(
    (sectionId: string, updatedFields: Record<string, unknown>) => {
      updatePortfolioSection(sectionId, updatedFields as any);
      setSections((prev) =>
        prev.map((s) => (s.id === sectionId ? { ...s, ...updatedFields } : s))
      );
    },
    [updatePortfolioSection]
  );

  const handleReorder = useCallback((reordered: typeof sections) => {
    setSections(reordered);
  }, []);

  const handleConfirm = () => {
    setStep3AssetOrder(sections.map((s) => s.id));
    onContinue();
  };

  if (!authoritySuite?.portfolioBlueprint?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
        <Sparkles className="w-8 h-8 mb-3 opacity-40 animate-pulse text-indigo-400" />
        <p className="text-sm font-bold">Generating Portfolio Architecture Wireframe…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PortfolioOrderingCanvas
        sections={sections}
        onSectionChange={handleSectionChange}
        onReorderSections={handleReorder}
      />

      <div className="flex justify-end pt-2">
        <button
          onClick={handleConfirm}
          className="px-7 py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-black text-sm transition-all shadow-lg hover:shadow-indigo-500/20 flex items-center gap-2 cursor-pointer"
        >
          Confirm Architecture &amp; Continue to Stage 3 →
        </button>
      </div>
    </div>
  );
}

// ── Main orchestration shell ──────────────────────────────────────────────────
export function Step3ProfilePortfolioAuthority() {
  const authoritySuite = useModule3Store((s) => s.authoritySuite);
  const setAuthoritySuite = useModule3Store((s) => s.setAuthoritySuite);
  const authorityPosition = useModule3Store((s) => s.authorityPosition);
  const coreTrustPromise = useModule3Store((s) => s.coreTrustPromise);
  const proofAssets = useModule3Store((s) => s.proofAssets);
  const mod1ServiceId = useModule3Store((s) => s.mod1ServiceId);
  const mod1MarketId = useModule3Store((s) => s.mod1MarketId);
  const mod2UniqueMechanism = useModule3Store((s) => s.mod2UniqueMechanism);
  const mod2OfferType = useModule3Store((s) => s.mod2OfferType);
  const availableAssets = useModule3Store((s) => s.availableAssets);
  const skippedAssets = useModule3Store((s) => s.skippedAssets);
  const isUpstreamStale = useModule3Store((s) => s.isUpstreamStale);

  const step3CompletedSections = useModule3Store((s) => s.step3CompletedSections);
  const completeStep3Section = useModule3Store((s) => s.completeStep3Section);
  const confirmStep = useModule3Store((s) => s.confirmStep);
  const nextStep = useModule3Store((s) => s.nextStep);

  const [activeStage, setActiveStage] = useState<'overview' | 1 | 2 | 3 | 4 | 'summary'>('overview');
  const [suiteGenerating, setSuiteGenerating] = useState(false);
  const [showBaselineDrawer, setShowBaselineDrawer] = useState(false);

  // ── Auto-generate authority suite if missing ──────────────────────────────
  useEffect(() => {
    if (!authoritySuite && !suiteGenerating) {
      setSuiteGenerating(true);
      try {
        const proofContext = {
          availableAssets,
          skippedAssets,
          proofAssets,
          existingProofInventory: '',
        };
        const suite = generateFullAuthoritySuite({
          position: authorityPosition,
          trustPromise: coreTrustPromise,
          serviceId: mod1ServiceId,
          marketId: mod1MarketId,
          offerType: mod2OfferType,
          targetClient: mod1MarketId,
          uniqueMechanism: mod2UniqueMechanism,
          proofContext,
        });
        setAuthoritySuite(suite);
      } catch (err) {
        console.error('[Step3] Failed to generate authority suite:', err);
      } finally {
        setSuiteGenerating(false);
      }
    }
  }, []);

  const advanceStage = useCallback(
    (stageId: number) => {
      completeStep3Section(stageId);
      if (stageId < 4) {
        setActiveStage((stageId + 1) as 1 | 2 | 3 | 4);
      } else {
        setActiveStage('summary');
      }
    },
    [completeStep3Section]
  );

  const handleComplete = useCallback(() => {
    completeStep3Section(4);
    confirmStep();
    nextStep();
  }, [completeStep3Section, confirmStep, nextStep]);

  return (
    <div className="space-y-6 pb-16 text-left max-w-6xl mx-auto">
      {/* Executive Hero Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-7 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-900/80 px-3 py-1 rounded-full border border-indigo-500/30">
                Module 3 • Step 3
              </span>
              <span className="text-xs text-slate-300 font-bold bg-white/10 px-2.5 py-0.5 rounded-full">
                Executive Packaging Studio
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Profile &amp; Portfolio Authority Launchpad
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-medium">
              Transform your authority stance into high-converting social profile copy, portfolio website architecture, evidence mapping, and content roadmaps.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowBaselineDrawer(!showBaselineDrawer)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Shield size={16} className="text-cyan-400" />
              <span>{showBaselineDrawer ? 'Hide Baseline' : 'View Baseline Context'}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Upstream Context Drawer */}
        <AnimatePresence>
          {showBaselineDrawer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs"
            >
              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Authority Stance</span>
                <span className="font-bold text-cyan-300 capitalize">{authorityPosition || 'Builder'}</span>
              </div>
              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Core Trust Promise</span>
                <span className="font-bold text-emerald-300 line-clamp-1">"{coreTrustPromise || 'Client risk elimination'}"</span>
              </div>
              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Unique Mechanism</span>
                <span className="font-bold text-purple-300">{mod2UniqueMechanism || 'Narrative Arc Engineering'}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stepper Navigation Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl text-white space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-2">
            <Sparkles size={14} className="text-amber-400" />
            Step 3 — 4-Stage Executive Roadmap
          </span>
          <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
            {activeStage === 'overview'
              ? 'Overview Map'
              : activeStage === 'summary'
              ? 'Master Blueprint'
              : `Stage 0${activeStage}: ${STAGE_CARDS[activeStage - 1].shortLabel}`}
          </span>
        </div>

        <ProgressBar completed={step3CompletedSections} />

        <SectionStepper
          currentStage={activeStage}
          completed={step3CompletedSections}
          onJump={(stage) => setActiveStage(stage)}
        />
      </div>

      {/* Main View Orchestration */}
      <AnimatePresence mode="wait">
        {activeStage === 'overview' && (
          <motion.div
            key="overview"
            {...fadeUp}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white">4-Stage Packaging System Overview</h3>
                <p className="text-xs text-neutral-400 mt-1">Select any stage below to enter its interactive workspace.</p>
              </div>
              <button
                onClick={() => setActiveStage(1)}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-2xl font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Start Stage 01: Profile Studio →</span>
              </button>
            </div>

            {/* 4 Stage Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {STAGE_CARDS.map((card) => {
                const IconComponent = card.icon;
                const isCompleted = step3CompletedSections.includes(card.id);

                return (
                  <motion.div
                    key={card.id}
                    onClick={() => setActiveStage(card.id as 1 | 2 | 3 | 4)}
                    whileHover={{ scale: 1.01 }}
                    className={`bg-neutral-900 rounded-3xl p-6 border border-neutral-800 shadow-xl text-white space-y-4 cursor-pointer transition-all ${card.borderHover} relative overflow-hidden group`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl ${card.bgGlow} ${card.accentText} border border-white/10`}>
                          <IconComponent size={20} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block">
                            Stage {card.stageNumber}
                          </span>
                          <h4 className="text-base font-black text-white">{card.title}</h4>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        isCompleted
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                      }`}>
                        {isCompleted ? 'Completed' : 'Ready'}
                      </span>
                    </div>

                    <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800/80 space-y-2">
                      <p className="text-xs text-neutral-300 font-medium leading-relaxed">
                        {card.purpose}
                      </p>
                      <div className="pt-1 border-t border-neutral-800/80">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-0.5">Why we do this:</span>
                        <p className="text-[11px] text-neutral-400 italic leading-snug">
                          "{card.whyWeDoThis}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className={`font-bold ${card.accentText}`}>Stage 0{card.id} Studio Workspace</span>
                      <span className="text-white font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Launch Stage <ChevronRight size={14} />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Individual Stage Views with Back Button */}
        {activeStage !== 'overview' && (
          <motion.div
            key={String(activeStage)}
            {...fadeUp}
            className="space-y-6"
          >
            {/* Top Back-to-Overview Action Bar */}
            <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 shadow-md">
              <button
                onClick={() => setActiveStage('overview')}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-neutral-700"
              >
                <ArrowLeft size={14} />
                <span>← Back to 4-Stage Launchpad Overview</span>
              </button>

              <span className="text-xs font-bold text-slate-300">
                {activeStage === 'summary'
                  ? 'Master Blueprint Review'
                  : `Currently in Stage 0${activeStage}: ${STAGE_CARDS[(activeStage as number) - 1]?.title}`}
              </span>
            </div>

            {activeStage === 1 && (
              <ProfileStrategySection
                onContinue={() => advanceStage(1)}
              />
            )}

            {activeStage === 2 && (
              <Section4Wrapper
                onContinue={() => advanceStage(2)}
              />
            )}

            {activeStage === 3 && (
              <EvidencePlacementSection
                onContinue={() => advanceStage(3)}
              />
            )}

            {activeStage === 4 && (
              <ContentStrategySection
                onContinue={() => advanceStage(4)}
              />
            )}

            {activeStage === 'summary' && (
              <StrategySummarySection
                onComplete={handleComplete}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Step3ProfilePortfolioAuthority;
