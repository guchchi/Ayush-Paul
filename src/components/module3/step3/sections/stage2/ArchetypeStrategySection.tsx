/**
 * ArchetypeStrategySection.tsx — Level 2 Phase 1: Context Handoff + Portfolio Goal
 *
 * Implements Phase 1 of Portfolio Architecture Builder:
 * Part 1: Read-only Context Handoff (inherited from Modules 1, 2, Step 1, Step 2, Level 1)
 * Part 2: Portfolio Acquisition Goal selection, strategy-backed architecture recommendation,
 *         and optional architecture exploration.
 */

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Repeat,
  Zap,
  Compass,
  Target,
  Sparkles,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  TrendingUp,
  Shield,
  Award,
  Cpu,
  AlertCircle,
  LucideIcon,
  Layers,
} from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import { EASING, DURATION } from '../../../../../lib/motion-presets';
import { useModule3Store } from '../../../../../lib/module3/store';
import {
  PORTFOLIO_ARCHETYPES,
  PortfolioGoal,
  getRecommendedGoal,
  recommendArchetype,
} from '../../../../../lib/module3/portfolio-architecture-engine';
import { ModuleButton } from '../../../../workspace/ModuleButton';
import { ContextHandoffCard } from './ContextHandoffCard';

interface Props {
  onContinue: () => void;
}

interface GoalCardConfig {
  id: PortfolioGoal;
  label: string;
  description: string;
  bestWhen: string;
  badge: string;
  icon: LucideIcon;
}

const PORTFOLIO_GOALS: GoalCardConfig[] = [
  {
    id: 'retainer',
    label: 'Win High-Value Retainers',
    description: 'Position your portfolio to justify deeper, ongoing client relationships.',
    bestWhen: 'Best when your service delivers recurring ROI, ongoing operations, or monthly retained value.',
    badge: 'Recurring Growth',
    icon: Repeat,
  },
  {
    id: 'sprint',
    label: 'Win Fast Sprint Projects',
    description: 'Make scope, speed and immediate value obvious to prospects.',
    bestWhen: 'Best when you offer fixed-scope turnarounds, intensive sprints, or direct execution without agency overhead.',
    badge: 'High Velocity',
    icon: Zap,
  },
  {
    id: 'consulting',
    label: 'Build Expert / Advisor Authority',
    description: 'Lead with expertise, strategic thinking and trust for advisory work.',
    bestWhen: 'Best when clients buy your diagnosis, architecture, roadmap, or strategic executive direction.',
    badge: 'Executive Advisory',
    icon: Compass,
  },
];

const ARCHETYPE_ICONS: Record<string, LucideIcon> = {
  Zap,
  Shield,
  Cpu,
  Award,
};

export const ArchetypeStrategySection: React.FC<Props> = React.memo(({ onContinue }) => {
  const {
    stage2Archetype,
    setStage2Archetype,
    applyArchetypePreset,
    mod1ServiceId,
    mod1CareerTrackId,
  } = useModule3Store();

  const [showExplorer, setShowExplorer] = useState(false);

  // 1. Initial recommendation for goal derived deterministically from Module 1 context
  const initialRecommendedGoal = useMemo(
    () => getRecommendedGoal(mod1ServiceId, mod1CareerTrackId),
    [mod1ServiceId, mod1CareerTrackId]
  );

  // 2. User's explicitly selected goal (null if not explicitly chosen yet)
  const selectedGoal = stage2Archetype?.portfolioGoal ?? null;

  // 3. Goal used for architecture recommendation computation
  const effectiveGoalForRec = selectedGoal || initialRecommendedGoal;

  // 4. Recommendation derived deterministically from engine (no AI/LLM)
  const recommendation = useMemo(
    () => recommendArchetype(mod1ServiceId, mod1CareerTrackId, effectiveGoalForRec),
    [mod1ServiceId, mod1CareerTrackId, effectiveGoalForRec]
  );

  // 5. Active archetype status
  const currentArchetypeId = stage2Archetype?.selectedArchetypeId || recommendation.archetypeId;
  const isRecommendationApplied = stage2Archetype?.selectedArchetypeId === recommendation.archetypeId;

  // Handlers
  const handleSelectGoal = (goalId: PortfolioGoal) => {
    // Explicitly persist user selection without overwriting current architecture
    setStage2Archetype({ portfolioGoal: goalId });
  };

  const handleApplyRecommendation = (archetypeId: string) => {
    setStage2Archetype({ selectedArchetypeId: archetypeId });
    applyArchetypePreset(archetypeId);
  };

  const handleSelectArchetype = (archetypeId: string) => {
    setStage2Archetype({ selectedArchetypeId: archetypeId });
    applyArchetypePreset(archetypeId);
  };

  const canContinue = Boolean(selectedGoal);

  return (
    <div className="space-y-7 text-left font-sans">
      {/* ──────────────────────────────────────────────────────────────────────────
          PART 1 — CONTEXT HANDOFF
          Read-only inherited context with zero fake values and clear empty states
      ────────────────────────────────────────────────────────────────────────── */}
      <section aria-labelledby="context-handoff-heading">
        <ContextHandoffCard />
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          PART 2 — PORTFOLIO GOAL
          3 selectable commercial goals with deterministic recommendation
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="space-y-4" aria-labelledby="portfolio-goal-heading">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-1">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#0058be]">
              <Target size={14} className="stroke-[2.5]" />
              <span>Phase 1 — Commercial Objective</span>
            </div>
            <h3 id="portfolio-goal-heading" className="text-lg sm:text-xl font-bold text-[#0b1c30] tracking-tight">
              Select Your Primary Portfolio Goal
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Choose the primary commercial outcome this portfolio is engineered to achieve. This determines how section hierarchy, proof positioning, and conversion friction are weighted.
            </p>
          </div>

          <div className="shrink-0 text-xs">
            {selectedGoal ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                <CheckCircle2 size={13} className="text-emerald-600" />
                Goal Confirmed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200">
                <AlertCircle size={13} className="text-amber-600" />
                Selection Required
              </span>
            )}
          </div>
        </div>

        {/* 3 Selectable Goal Cards */}
        <div
          role="radiogroup"
          aria-label="Portfolio Acquisition Goals"
          className="grid grid-cols-1 md:grid-cols-3 gap-3.5"
        >
          {PORTFOLIO_GOALS.map((goal) => {
            const Icon = goal.icon;
            const isSelected = selectedGoal === goal.id;
            const isRecommendedForTrack = !selectedGoal && goal.id === initialRecommendedGoal;

            return (
              <motion.div
                key={goal.id}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectGoal(goal.id);
                  }
                }}
                whileHover={{ y: -2 }}
                transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
                onClick={() => handleSelectGoal(goal.id)}
                className={cn(
                  'p-5 rounded-3xl border transition-all cursor-pointer space-y-3.5 relative flex flex-col justify-between text-left select-none group focus:outline-none focus:ring-2 focus:ring-[#0058be] focus:ring-offset-2',
                  isSelected
                    ? 'bg-white border-[#0058be] shadow-sm ring-2 ring-[#0058be]/15'
                    : 'bg-white border-neutral-200/90 shadow-2xs hover:border-neutral-300 hover:bg-neutral-50/40'
                )}
              >
                <div className="space-y-3">
                  {/* Top Bar: Icon + Badge + Radio Indicator */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          'w-9 h-9 rounded-2xl flex items-center justify-center border transition-colors',
                          isSelected
                            ? 'bg-[#0058be] text-white border-[#0058be]'
                            : 'bg-neutral-100 text-neutral-600 border-neutral-200 group-hover:bg-[#0058be]/10 group-hover:text-[#0058be]'
                        )}
                      >
                        <Icon size={18} className="stroke-[2.2]" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        {goal.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isRecommendedForTrack && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0058be] text-[10px] font-bold border border-blue-100">
                          Recommended
                        </span>
                      )}
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all',
                          isSelected
                            ? 'bg-[#0058be] border-[#0058be] text-white'
                            : 'border-neutral-300 text-transparent group-hover:border-neutral-400'
                        )}
                      >
                        <Check size={12} className="stroke-[3]" />
                      </div>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h4 className="text-sm sm:text-base font-bold text-[#0b1c30] tracking-tight">
                      {goal.label}
                    </h4>
                    <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                      {goal.description}
                    </p>
                  </div>
                </div>

                {/* Best When Context Box */}
                <div className="pt-2.5 border-t border-neutral-100 text-[11px] leading-snug">
                  <span className="font-semibold text-neutral-700">Best when: </span>
                  <span className="text-neutral-500">{goal.bestWhen.replace('Best when ', '')}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ────────────────────────────────────────────────────────────────────────
            STRATEGY RECOMMENDATION PANEL
            Appears immediately once a goal is selected or active
        ──────────────────────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {selectedGoal && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
              className="mt-5 p-5 sm:p-6 rounded-3xl bg-neutral-50/80 border border-neutral-200/90 shadow-xs space-y-4 text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0058be]/10 text-[#0058be] text-[10px] font-black uppercase tracking-wider border border-[#0058be]/20">
                      <Sparkles size={11} />
                      Strategy Recommendation
                    </span>
                    <span className="text-[11px] font-semibold text-neutral-400">
                      Matched to your {selectedGoal} goal
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-[#0b1c30] tracking-tight flex items-center gap-2 pt-0.5">
                    <span>{recommendation.archetypeName}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-[#0058be]">
                      {recommendation.badge}
                    </span>
                  </h4>

                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed pt-0.5">
                    {recommendation.reason}
                  </p>
                </div>

                {/* Recommendation CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 pt-1 sm:pt-0">
                  {isRecommendationApplied ? (
                    <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-2xs">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      <span>Architecture Applied</span>
                    </div>
                  ) : (
                    <ModuleButton
                      variant="primary"
                      className="text-xs px-3.5 py-2"
                      onClick={() => handleApplyRecommendation(recommendation.archetypeId)}
                    >
                      Use This Architecture
                    </ModuleButton>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowExplorer((prev) => !prev)}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-bold border border-neutral-200/90 transition-all cursor-pointer shadow-2xs"
                  >
                    <span>{showExplorer ? 'Hide Architectures' : 'Explore Other Architectures'}</span>
                    {showExplorer ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                </div>
              </div>

              {/* Conversion Strategic Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-neutral-200/60 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-neutral-200/70 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                    Funnel Priority
                  </span>
                  <span className="font-semibold text-[#0b1c30] line-clamp-1">
                    {recommendation.funnelFocus}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-neutral-200/70 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                    Conversion Advantage
                  </span>
                  <span className="font-semibold text-emerald-700 line-clamp-1">
                    {recommendation.conversionAdvantage}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ────────────────────────────────────────────────────────────────────────
            PRESERVED ARCHETYPE EXPLORER
            Allows browsing and selecting from all 4 conversion archetypes
        ──────────────────────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {showExplorer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
              className="overflow-hidden space-y-3 pt-3"
            >
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h4 className="text-sm font-bold text-[#0b1c30]">
                    All 4 Conversion Architectures
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Select an alternative layout if your client engagement model requires a different proof sequence.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-[#0058be]">
                  Active: {PORTFOLIO_ARCHETYPES.find((a) => a.id === currentArchetypeId)?.name}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PORTFOLIO_ARCHETYPES.map((arch) => {
                  const Icon = ARCHETYPE_ICONS[arch.iconName] || Zap;
                  const isSelected = currentArchetypeId === arch.id;
                  const isRec = recommendation.archetypeId === arch.id;

                  return (
                    <div
                      key={arch.id}
                      onClick={() => handleSelectArchetype(arch.id)}
                      className={cn(
                        'p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer space-y-3 text-left relative group',
                        isSelected
                          ? 'bg-white border-[#0058be] shadow-xs ring-1 ring-[#0058be]'
                          : 'bg-white border-neutral-200 hover:border-neutral-300'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={cn(
                              'w-8 h-8 rounded-xl flex items-center justify-center border text-xs',
                              isSelected
                                ? 'bg-[#0058be] text-white border-[#0058be]'
                                : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                            )}
                          >
                            <Icon size={16} />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h5 className="text-xs sm:text-sm font-bold text-[#0b1c30]">
                                {arch.name}
                              </h5>
                              {isRec && (
                                <span className="px-1.5 py-0.2 rounded bg-blue-50 text-[#0058be] text-[9px] font-bold border border-blue-100">
                                  Strategy Pick
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-semibold text-[#0058be]">
                              {arch.badge}
                            </span>
                          </div>
                        </div>

                        <div
                          className={cn(
                            'w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-xs',
                            isSelected
                              ? 'bg-[#0058be] border-[#0058be] text-white'
                              : 'border-neutral-300 text-transparent'
                          )}
                        >
                          <Check size={11} className="stroke-[3]" />
                        </div>
                      </div>

                      <p className="text-xs text-neutral-500 leading-relaxed">
                        {arch.description}
                      </p>

                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-neutral-100">
                        <span className="text-neutral-500 truncate max-w-[65%]">
                          <strong className="text-neutral-700">Best for:</strong> {arch.bestFor}
                        </span>
                        <span className="text-emerald-700 font-semibold shrink-0">
                          {arch.conversionAdvantage.split(' ')[0]} {arch.conversionAdvantage.split(' ')[1]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          NAVIGATION & COMPLETION STEP FOOTER
          Enabled only once a valid portfolio goal is selected
      ────────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-neutral-200">
        <div className="space-y-0.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-500">Selected Goal:</span>
            {selectedGoal ? (
              <span className="font-bold text-[#0058be] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                {PORTFOLIO_GOALS.find((g) => g.id === selectedGoal)?.label}
              </span>
            ) : (
              <span className="text-amber-700 italic font-medium">
                None selected yet (select one above)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-500">Active Architecture:</span>
            <span className="font-bold text-[#0b1c30]">
              {PORTFOLIO_ARCHETYPES.find((a) => a.id === currentArchetypeId)?.name || 'Proof-First Architecture'}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          {!canContinue && (
            <span className="text-[11px] text-amber-700 font-medium sm:text-right">
              Select a goal above to unlock
            </span>
          )}
          <ModuleButton
            onClick={onContinue}
            disabled={!canContinue}
            className="cursor-pointer"
          >
            <span>Continue to Architecture</span>
            <ChevronRight size={15} />
          </ModuleButton>
        </div>
      </div>
    </div>
  );
});

ArchetypeStrategySection.displayName = 'ArchetypeStrategySection';

export default ArchetypeStrategySection;
