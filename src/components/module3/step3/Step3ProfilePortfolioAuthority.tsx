/**
 * Step3ProfilePortfolioAuthority.tsx
 *
 * Module 3 — Step 3: Profile & Portfolio Authority Suite
 *
 * Clean, lightweight, executive 4-Level packaging hub.
 * Zero scrollbars, zero crammed horizontal overflows, consistent light executive theme.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Sparkles,
  User,
  Layout,
  Link as LinkIcon,
  Send,
  Shield,
  ArrowLeft,
  Zap,
  ArrowRight,
  Layers,
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

// ── 4-Level Metadata ──────────────────────────────────────────────────────────
const LEVELS = [
  {
    id: 1,
    levelNumber: 'LEVEL 01',
    title: 'Social Profile Identity Studio',
    deliverables: ['LinkedIn & X Bio Copy', 'Instagram Copy', 'Personal Site Bio'],
    outcome: 'Instant Expert Authority',
    icon: User,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200/80',
  },
  {
    id: 2,
    levelNumber: 'LEVEL 02',
    title: 'Portfolio Architecture Builder',
    deliverables: ['Section Sequence Order', 'Wireframe Layout', 'Conversion Funnel'],
    outcome: 'High-Converting Wireframe',
    icon: Layout,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200/80',
  },
  {
    id: 3,
    levelNumber: 'LEVEL 03',
    title: 'Evidence Placement Matrix',
    deliverables: ['Proof-to-Claim Linker', 'Trust Scoring', 'Claim Verification'],
    outcome: '100% Backed Proof Claims',
    icon: LinkIcon,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200/80',
  },
  {
    id: 4,
    levelNumber: 'LEVEL 04',
    title: 'Authority Content Roadmap',
    deliverables: ['90-Day Content Calendar', 'Authority Hooks', 'Publishing Angles'],
    outcome: 'Inbound Traffic Engine',
    icon: Send,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200/80',
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
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
        >
          Confirm Architecture &amp; Continue to Level 3 →
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
      {/* Clean Ultra-Simple Top Header (NO scrollbars, NO crammed pills) */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
            <Layers size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                Step 3 of 6
              </span>
              <span className="text-xs text-neutral-500 font-medium">Profile &amp; Portfolio Suite</span>
            </div>
            <h1 className="text-base font-bold text-neutral-900">
              Authority Packaging Hub
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowBaselineDrawer(!showBaselineDrawer)}
            className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Shield size={14} className="text-indigo-600" />
            <span>{showBaselineDrawer ? 'Hide Baseline' : 'Baseline'}</span>
          </button>

          <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700">
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
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Authority Stance</span>
              <span className="font-bold text-neutral-800 capitalize">{authorityPosition || 'Builder'}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Core Trust Promise</span>
              <span className="font-bold text-neutral-800 line-clamp-1">"{coreTrustPromise || 'Client risk elimination'}"</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
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
            className="space-y-6"
          >
            {/* Clean Section Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">4-Level Authority System</h2>
                <p className="text-xs text-neutral-500">Complete each level sequentially to package your authority.</p>
              </div>

              <button
                onClick={() => setActiveStage(1)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Start Level 01 →</span>
              </button>
            </div>

            {/* 4 Clean Level Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {LEVELS.map((level) => {
                const IconComponent = level.icon;
                const isCompleted = step3CompletedSections.includes(level.id);

                return (
                  <motion.div
                    key={level.id}
                    onClick={() => setActiveStage(level.id as 1 | 2 | 3 | 4)}
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer space-y-4 group"
                  >
                    {/* Top Level Bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${level.bgColor} ${level.color} border ${level.borderColor}`}>
                          <IconComponent size={20} />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                            {level.levelNumber}
                          </span>
                          <h3 className="text-base font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors">
                            {level.title}
                          </h3>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {isCompleted ? 'Completed ✓' : 'Ready'}
                      </span>
                    </div>

                    {/* Deliverable Chips */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                      <span className="text-[10px] font-bold uppercase text-neutral-400 block">
                        Deliverables:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {level.deliverables.map((item, i) => (
                          <span
                            key={i}
                            className="bg-white border border-slate-200 text-neutral-700 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-1"
                          >
                            <Zap size={11} className="text-indigo-500" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Outcome Badge & Action Link */}
                    <div className="flex items-center justify-between pt-1 border-t border-neutral-100 text-xs">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 flex items-center gap-1">
                        <Sparkles size={12} className="text-emerald-600" />
                        {level.outcome}
                      </span>

                      <span className="font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Enter Level {level.id} <ArrowRight size={14} />
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
                <span>← Back to 4-Level Overview</span>
              </button>

              <span className="text-xs font-bold text-neutral-800">
                {activeStage === 'summary'
                  ? 'Master Blueprint Review'
                  : `${LEVELS[(activeStage as number) - 1]?.levelNumber}: ${LEVELS[(activeStage as number) - 1]?.title}`}
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
