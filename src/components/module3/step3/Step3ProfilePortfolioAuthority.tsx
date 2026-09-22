/**
 * Step3ProfilePortfolioAuthority.tsx
 *
 * Module 3 — Step 3: Profile & Portfolio Authority Suite
 *
 * Top SaaS design standards (Linear/Vercel style clean breadcrumb navigation).
 * Zero card stack clutter, harmonized with Module 1 & 2 design system.
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
  Check,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { EASING, DURATION } from '../../../lib/motion-presets';
import { useModule3Store } from '../../../lib/module3/store';
import { generateFullAuthoritySuite } from '../../../data/module3/authority-suite-engine';
import { StepHeader } from '../../workspace/StepHeader';
import { StepActionArea } from '../../workspace/StepActionArea';
import { ModuleButton } from '../../workspace/ModuleButton';

// ── Section components ────────────────────────────────────────────────────────
import { ProfileStrategySection } from './sections/ProfileStrategySection';
import { PortfolioArchitectureSection } from './sections/PortfolioArchitectureSection';
import { EvidencePlacementSection } from './sections/EvidencePlacementSection';
import { ContentStrategySection } from './sections/ContentStrategySection';
import { LeadMagnetEngineSection } from './sections/stage5/LeadMagnetEngineSection';
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
    subtitle: 'High-Converting Social Copy',
    deliverables: ['LinkedIn & X Bio Copy', 'Instagram Bio', 'Personal Site Tagline'],
    outcome: 'Instant Expert Authority',
    icon: User,
    color: 'text-[#0058be]',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
  },
  {
    id: 2,
    levelNumber: 'LEVEL 02',
    title: 'Portfolio Architecture Builder',
    subtitle: 'Wireframe Layout & Order',
    deliverables: ['Section Sequence Order', 'Wireframe Layout', 'Conversion Funnel'],
    outcome: 'High-Converting Wireframe',
    icon: Layout,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-100',
  },
  {
    id: 3,
    levelNumber: 'LEVEL 03',
    title: 'Evidence Placement Matrix',
    subtitle: 'Claim-to-Proof Linker',
    deliverables: ['Proof-to-Claim Mapping', 'Trust Meter', 'Claim Verification'],
    outcome: '100% Backed Proof Claims',
    icon: LinkIcon,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
  },
  {
    id: 4,
    levelNumber: 'LEVEL 04',
    title: 'Authority Content Roadmap Engine',
    subtitle: 'Hooks & Publishing Angles',
    deliverables: ['90-Day Content Calendar', 'Authority Hooks', 'Publishing Roadmap'],
    outcome: 'Inbound Traffic Engine',
    icon: Send,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-100',
  },
  {
    id: 5,
    levelNumber: 'LEVEL 05',
    title: 'Lead Magnet & Conversion Bridge',
    subtitle: 'Traffic-to-Lead Engine',
    deliverables: ['Lead Magnet Concept', 'Opt-in Flow', 'Conversion CTA'],
    outcome: 'Seamless Lead Generation',
    icon: Zap,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-100',
  },
] as const;

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

  const [activeStage, setActiveStage] = useState<'overview' | 1 | 2 | 3 | 4 | 5 | 'summary'>('overview');
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
    <div className="space-y-6 pb-16 text-left w-full max-w-7xl mx-auto font-sans">
      {/* Top Header with Integrated Clean Back Breadcrumb */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            {activeStage !== 'overview' ? (
              <button
                onClick={() => setActiveStage('overview')}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#0058be] hover:underline cursor-pointer bg-[#0058be]/10 px-2.5 py-1 rounded-full border border-[#0058be]/20 transition-all"
              >
                <ArrowLeft size={12} />
                <span>Overview</span>
              </button>
            ) : (
              <span className="inline-flex items-center rounded-full bg-[#0058be]/10 text-[#0058be] text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5">
                Step 3 of 6
              </span>
            )}

            {activeStage !== 'overview' && (
              <span className="text-xs text-neutral-400 font-bold">/</span>
            )}

            {activeStage !== 'overview' && (
              <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200">
                {activeStage === 'summary'
                  ? 'Master Blueprint'
                  : `${LEVELS[(activeStage as number) - 1]?.levelNumber}: ${LEVELS[(activeStage as number) - 1]?.title}`}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-[#0b1c30] tracking-tight">
            {activeStage === 'overview'
              ? 'Profile & Portfolio Authority System'
              : activeStage === 'summary'
              ? 'Master Authority Blueprint'
              : LEVELS[(activeStage as number) - 1]?.title}
          </h1>
          <p className="text-sm text-neutral-500 mt-1 leading-relaxed max-w-xl">
            {activeStage === 'overview'
              ? 'Package your positioning claims into high-converting social profile copy, portfolio website architecture, evidence placement, and content roadmaps.'
              : activeStage === 'summary'
              ? 'Review your assembled executive blueprint and complete Step 3.'
              : LEVELS[(activeStage as number) - 1]?.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-3 shrink-0">
          <button
            onClick={() => setShowBaselineDrawer(!showBaselineDrawer)}
            className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Shield size={14} className="text-[#0058be]" />
            <span>{showBaselineDrawer ? 'Hide Baseline' : 'Upstream Baseline'}</span>
          </button>

          <span className="inline-flex items-center rounded-full bg-[#0058be]/10 text-[#0058be] text-xs font-bold px-3 py-1 border border-[#0058be]/20">
            {completionPct}% Complete
          </span>
        </div>
      </div>

      {/* Upstream Baseline Collapsible Card */}
      <AnimatePresence>
        {showBaselineDrawer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-6 rounded-3xl border border-neutral-200 bg-white shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs"
          >
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 block">Authority Stance</span>
              <span className="font-bold text-[#0b1c30] capitalize">{authorityPosition || 'Builder'}</span>
            </div>
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 block">Core Trust Promise</span>
              <span className="font-bold text-[#0b1c30] line-clamp-2">"{coreTrustPromise || 'Client risk elimination'}"</span>
            </div>
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 block">Unique Mechanism</span>
              <span className="font-bold text-[#0b1c30]">{mod2UniqueMechanism || 'Narrative Arc Engineering'}</span>
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
            {/* Visual Level Flow Timeline Card */}
            <div className="p-6 sm:p-7 rounded-3xl border border-neutral-200 bg-white shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0058be] bg-[#0058be]/10 px-2.5 py-0.5 rounded-full border border-[#0058be]/20">
                    4-Level Execution Path
                  </span>
                  <h2 className="text-xl font-bold text-[#0b1c30] mt-1">
                    Systematic Authority Blueprint
                  </h2>
                </div>

                <ModuleButton onClick={() => setActiveStage(1)}>
                  Start Level 01 →
                </ModuleButton>
              </div>

              {/* 4 Connected Level Cards Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                {LEVELS.map((level) => {
                  const isDone = step3CompletedSections.includes(level.id);
                  return (
                    <div
                      key={level.id}
                      onClick={() => setActiveStage(level.id as 1 | 2 | 3 | 4)}
                      className="bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200/80 p-3.5 rounded-2xl cursor-pointer transition-all space-y-1 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-[#0058be] tracking-wider">
                          {level.levelNumber}
                        </span>
                        {isDone ? (
                          <Check size={14} className="text-emerald-600 stroke-[3]" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-neutral-300 group-hover:bg-[#0058be]" />
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-[#0b1c30] group-hover:text-[#0058be] transition-colors line-clamp-1">
                        {level.title}
                      </h4>
                      <span className="text-[10px] text-neutral-500 block line-clamp-1">
                        {level.outcome}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5 Premium Level Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
              {LEVELS.map((level) => {
                const IconComponent = level.icon;
                const isCompleted = step3CompletedSections.includes(level.id);

                return (
                  <motion.div
                    key={level.id}
                    onClick={() => setActiveStage(level.id as 1 | 2 | 3 | 4 | 5)}
                    whileHover={{ y: -2 }}
                    className="p-6 sm:p-7 rounded-3xl border border-neutral-200 bg-white shadow-xs hover:border-[#0058be]/40 hover:shadow-md transition-all cursor-pointer space-y-5 group relative"
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl ${level.bgColor} ${level.color} border ${level.borderColor}`}>
                          <IconComponent size={22} />
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block">
                            {level.levelNumber}
                          </span>
                          <h3 className="text-base font-bold text-[#0b1c30] group-hover:text-[#0058be] transition-colors">
                            {level.title}
                          </h3>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                      }`}>
                        {isCompleted ? 'Completed ✓' : 'Ready'}
                      </span>
                    </div>

                    {/* Deliverable Badges */}
                    <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-2.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 block">
                        Deliverables:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {level.deliverables.map((item, i) => (
                          <span
                            key={i}
                            className="bg-white border border-neutral-200 text-neutral-700 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-1"
                          >
                            <Zap size={11} className="text-[#0058be]" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Outcome Tag & Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200/60 flex items-center gap-1">
                        <Sparkles size={13} className="text-emerald-600" />
                        {level.outcome}
                      </span>

                      <span className="font-bold text-[#0058be] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Enter Level {level.id} <ArrowRight size={14} />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Individual Stage Views with Clean Integrated Header Navigation */}
        {activeStage !== 'overview' && (
          <motion.div
            key={String(activeStage)}
            {...fadeUp}
            className="space-y-5"
          >
            {activeStage === 1 && (
              <ProfileStrategySection
                onContinue={() => advanceStage(1)}
              />
            )}

            {activeStage === 2 && (
              <PortfolioArchitectureSection
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

            {activeStage === 5 && (
              <LeadMagnetEngineSection
                onContinue={() => advanceStage(5)}
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
