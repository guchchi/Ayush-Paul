/**
 * Step3ProfilePortfolioAuthority.tsx
 *
 * Module 3 — Step 3: Profile & Portfolio Authority Suite
 *
 * Light Executive Theme orchestration shell.
 * 4-Stage Interactive Launchpad Hub with compact navigation bar and zero dark box clutter.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  ChevronRight,
  Sparkles,
  User,
  Layout,
  Link as LinkIcon,
  Send,
  Shield,
  ArrowLeft,
  Zap,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { EASING, DURATION } from '../../../lib/motion-presets';
import { useModule3Store } from '../../../lib/module3/store';
import { generateFullAuthoritySuite } from '../../../data/module3/authority-suite-engine';

// ── Section components ────────────────────────────────────────────────────────
import { ProfileStrategySection } from './sections/ProfileStrategySection';
import { PortfolioOrderingCanvas } from './sections/PortfolioOrderingCanvas';
import { EvidencePlacementSection } from './sections/EvidencePlacementSection';
import { ContentStrategySection } from './sections/ContentStrategySection';
import { StrategySummarySection } from './sections/StrategySummarySection';

// ── Motion tokens ─────────────────────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 12, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -8, filter: 'blur(4px)' },
  transition: { duration: DURATION.NORMAL, ease: EASING.PREMIUM },
};

// ── 4 Stage Card Metadata ─────────────────────────────────────────────────────
const STAGE_CARDS = [
  {
    id: 1,
    stageNumber: '01',
    title: 'Social Profile Identity Studio',
    shortLabel: '01 Profile',
    purpose: 'Transform positioning claims into high-converting bio & headline copy for LinkedIn, X, Instagram & Personal Site.',
    whyWeDoThis: 'Prospects check your social profiles before booking a call. Ensures instant expert authority.',
    icon: User,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200/80',
    badgeColor: 'bg-blue-100/70 text-blue-700',
  },
  {
    id: 2,
    stageNumber: '02',
    title: 'Portfolio Website Architecture Builder',
    shortLabel: '02 Portfolio',
    purpose: 'Structure your portfolio website layout wireframe & section sequence for maximum conversion.',
    whyWeDoThis: 'Ensures your proof assets hit the prospect at the exact psychological moment in their buyer journey.',
    icon: Layout,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200/80',
    badgeColor: 'bg-cyan-100/70 text-cyan-700',
  },
  {
    id: 3,
    stageNumber: '03',
    title: 'Evidence Placement Matrix',
    shortLabel: '03 Evidence',
    purpose: 'Link every profile & portfolio claim directly to verified Step 2 proof assets.',
    whyWeDoThis: 'Eliminates unproven promises so your positioning is 100% backed by demonstrable evidence.',
    icon: LinkIcon,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200/80',
    badgeColor: 'bg-emerald-100/70 text-emerald-700',
  },
  {
    id: 4,
    stageNumber: '04',
    title: 'Authority Content Roadmap Engine',
    shortLabel: '04 Content',
    purpose: 'Generate high-impact authority content hooks & 90-day publishing calendar.',
    whyWeDoThis: 'Establishes top-of-funnel organic trust and drives warm inbound traffic to your portfolio.',
    icon: Send,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200/80',
    badgeColor: 'bg-purple-100/70 text-purple-700',
  },
] as const;

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
        <Sparkles className="w-8 h-8 mb-3 opacity-40 animate-pulse text-indigo-500" />
        <p className="text-sm font-bold text-neutral-600">Generating Portfolio Architecture Wireframe…</p>
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
          className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
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

  const completionPct = Math.round((step3CompletedSections.length / 4) * 100);

  return (
    <div className="space-y-6 pb-16 text-left max-w-6xl mx-auto font-sans">
      {/* Sleek Compact Light Navigation Header */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Title & Status */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
            <Zap size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                Step 3 of 6
              </span>
              <span className="text-xs text-neutral-500 font-medium">Profile &amp; Portfolio Suite</span>
            </div>
            <h1 className="text-base font-bold text-neutral-900 leading-snug">
              Authority Packaging Launchpad
            </h1>
          </div>
        </div>

        {/* Center Stage Selector Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveStage('overview')}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border',
              activeStage === 'overview'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
            )}
          >
            Overview Map
          </button>

          {STAGE_CARDS.map((card) => {
            const isDone = step3CompletedSections.includes(card.id);
            const isCurrent = activeStage === card.id;

            return (
              <button
                key={card.id}
                onClick={() => setActiveStage(card.id as 1 | 2 | 3 | 4)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border',
                  isCurrent
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                )}
              >
                {isDone && !isCurrent ? (
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full bg-neutral-200 text-neutral-600 text-[9px] font-black flex items-center justify-center shrink-0">
                    {card.id}
                  </span>
                )}
                <span>{card.shortLabel}</span>
              </button>
            );
          })}

          <button
            onClick={() => setActiveStage('summary')}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border',
              activeStage === 'summary'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-neutral-50 text-emerald-700 border-neutral-200 hover:bg-emerald-50'
            )}
          >
            Blueprint
          </button>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2.5 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-neutral-100">
          <button
            onClick={() => setShowBaselineDrawer(!showBaselineDrawer)}
            className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Shield size={14} className="text-indigo-600" />
            <span>{showBaselineDrawer ? 'Hide Baseline' : 'Baseline'}</span>
          </button>

          <div className="flex items-center gap-1.5 bg-indigo-50/70 border border-indigo-100 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700">
            <span>{completionPct}% Done</span>
          </div>
        </div>
      </div>

      {/* Collapsible Upstream Context Drawer */}
      <AnimatePresence>
        {showBaselineDrawer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs"
          >
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Authority Stance</span>
              <span className="font-bold text-neutral-800 capitalize">{authorityPosition || 'Builder'}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Core Trust Promise</span>
              <span className="font-bold text-neutral-800 line-clamp-1">"{coreTrustPromise || 'Client risk elimination'}"</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Unique Mechanism</span>
              <span className="font-bold text-neutral-800">{mod2UniqueMechanism || 'Narrative Arc Engineering'}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main View Orchestration */}
      <AnimatePresence mode="wait">
        {activeStage === 'overview' && (
          <motion.div
            key="overview"
            {...fadeUp}
            className="space-y-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">4-Stage Authority Suite Stages</h2>
                <p className="text-xs text-neutral-500">Select any stage to enter its dedicated studio workspace.</p>
              </div>
              <button
                onClick={() => setActiveStage(1)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Start Stage 01 →</span>
              </button>
            </div>

            {/* Light Executive 4 Stage Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STAGE_CARDS.map((card) => {
                const IconComponent = card.icon;
                const isCompleted = step3CompletedSections.includes(card.id);

                return (
                  <motion.div
                    key={card.id}
                    onClick={() => setActiveStage(card.id as 1 | 2 | 3 | 4)}
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer space-y-4 group relative"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${card.bgColor} ${card.color} border ${card.borderColor}`}>
                          <IconComponent size={20} />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                            Stage {card.stageNumber}
                          </span>
                          <h3 className="text-base font-bold text-neutral-900">{card.title}</h3>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {isCompleted ? 'Completed' : 'Ready'}
                      </span>
                    </div>

                    <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/60 space-y-2">
                      <p className="text-xs text-neutral-700 font-medium leading-relaxed">
                        {card.purpose}
                      </p>
                      <div className="pt-1.5 border-t border-slate-200/60 flex items-start gap-1">
                        <span className="text-[10px] font-bold uppercase text-neutral-400 shrink-0">Why:</span>
                        <p className="text-[11px] text-neutral-500 italic leading-snug">
                          "{card.whyWeDoThis}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className={`font-bold ${card.color}`}>Stage 0{card.id} Studio</span>
                      <span className="text-indigo-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Launch Stage <ChevronRight size={14} />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Individual Stage Views with Back Toolbar */}
        {activeStage !== 'overview' && (
          <motion.div
            key={String(activeStage)}
            {...fadeUp}
            className="space-y-5"
          >
            {/* Top Back Toolbar */}
            <div className="flex items-center justify-between bg-white border border-neutral-200 rounded-xl p-3 shadow-xs">
              <button
                onClick={() => setActiveStage('overview')}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200"
              >
                <ArrowLeft size={14} />
                <span>← Back to Overview Map</span>
              </button>

              <span className="text-xs font-bold text-neutral-700">
                {activeStage === 'summary'
                  ? 'Master Blueprint Review'
                  : `Stage 0${activeStage}: ${STAGE_CARDS[(activeStage as number) - 1]?.title}`}
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
