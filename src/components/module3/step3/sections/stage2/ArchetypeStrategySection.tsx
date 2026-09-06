/**
 * ArchetypeStrategySection.tsx — Level 2 Phase 1: Portfolio Goal & Architecture Selection
 *
 * Streamlined around a single primary decision:
 * 1. Compact inherited strategy reassurance
 * 2. Primary decision: Choose your portfolio goal (3 simplified, high-contrast cards)
 * 3. Secondary recommendation: One smart architecture recommendation matched to goal
 * 4. Collapsed alternatives explorer: Hidden by default, expandable on demand
 * 5. Single clear primary action: "Continue to Section Sequence →"
 */

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Repeat,
  Zap,
  Compass,
  Check,
  ChevronDown,
  Shield,
  Award,
  Cpu,
  LucideIcon,
} from 'lucide-react';
import { cn } from '../../../../../lib/utils';
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
  icon: LucideIcon;
}

const PORTFOLIO_GOALS: GoalCardConfig[] = [
  {
    id: 'retainer',
    label: 'Win High-Value Retainers',
    description: 'Designed for ongoing monthly engagements, embedded operations, and trusted partnerships.',
    icon: Repeat,
  },
  {
    id: 'sprint',
    label: 'Win Fast Sprint Projects',
    description: 'Designed for fixed-scope turnarounds, intensive execution, and rapid client decisions.',
    icon: Zap,
  },
  {
    id: 'consulting',
    label: 'Build Expert / Advisor Authority',
    description: 'Designed for strategic diagnosis, technical architecture, and premium advisory fees.',
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
  const effectiveGoal = selectedGoal || initialRecommendedGoal;

  // 4. Recommendation derived deterministically from engine (no AI/LLM)
  const recommendation = useMemo(
    () => recommendArchetype(mod1ServiceId, mod1CareerTrackId, effectiveGoal),
    [mod1ServiceId, mod1CareerTrackId, effectiveGoal]
  );

  // 5. Active archetype status
  const currentArchetypeId = stage2Archetype?.selectedArchetypeId || recommendation.archetypeId;
  const isRecommendationApplied = currentArchetypeId === recommendation.archetypeId;

  // Handlers
  const handleSelectGoal = (goalId: PortfolioGoal) => {
    setStage2Archetype({ portfolioGoal: goalId });
  };

  const handleApplyRecommendation = (archetypeId: string) => {
    setStage2Archetype({ selectedArchetypeId: archetypeId });
    applyArchetypePreset(archetypeId);
  };

  const handleSelectAlternativeArchetype = (archetypeId: string) => {
    setStage2Archetype({ selectedArchetypeId: archetypeId });
    applyArchetypePreset(archetypeId);
  };

  const canContinue = Boolean(selectedGoal);

  const selectedGoalMeta = useMemo(() => {
    return PORTFOLIO_GOALS.find((g) => g.id === selectedGoal);
  }, [selectedGoal]);

  const currentArchetypeMeta = useMemo(() => {
    return (
      PORTFOLIO_ARCHETYPES.find((a) => a.id === currentArchetypeId) ||
      PORTFOLIO_ARCHETYPES[0]
    );
  }, [currentArchetypeId]);

  return (
    <div className="space-y-6 text-left font-sans">
      {/* ──────────────────────────────────────────────────────────────────────────
          1. COMPACT INHERITED STRATEGY BAR
      ────────────────────────────────────────────────────────────────────────── */}
      <ContextHandoffCard />

      {/* ──────────────────────────────────────────────────────────────────────────
          2. PRIMARY DECISION: CHOOSE YOUR PORTFOLIO GOAL
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="space-y-3.5" aria-labelledby="portfolio-goal-heading">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#0058be]">
            <span>Step 1 — Commercial Goal</span>
          </div>
          <h2 id="portfolio-goal-heading" className="text-xl sm:text-2xl font-bold text-[#0b1c30] tracking-tight">
            Choose Your Portfolio Goal
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xl leading-relaxed">
            Select what this portfolio is engineered to achieve. Your choice sets the recommended sequence and proof emphasis.
          </p>
        </div>

        {/* 3 Streamlined Goal Cards */}
        <div
          role="radiogroup"
          aria-label="Portfolio Acquisition Goals"
          className="grid grid-cols-1 sm:grid-cols-3 gap-3.5"
        >
          {PORTFOLIO_GOALS.map((goal) => {
            const Icon = goal.icon;
            const isSelected = selectedGoal === goal.id;

            return (
              <div
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
                onClick={() => handleSelectGoal(goal.id)}
                className={cn(
                  'relative p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-[#0058be] focus:ring-offset-2',
                  isSelected
                    ? 'bg-white border-[#0058be] ring-1 ring-[#0058be] shadow-[0_8px_24px_rgba(0,88,190,0.08)]'
                    : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-2xs'
                )}
              >
                {/* Header Row: Icon + Radio Indicator */}
                <div className="flex items-start justify-between w-full mb-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
                      isSelected
                        ? 'bg-[#0058be]/10 text-[#0058be]'
                        : 'bg-neutral-100 text-neutral-500 group-hover:bg-[#0058be]/10 group-hover:text-[#0058be]'
                    )}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="shrink-0 pt-0.5">
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-[#0058be] flex items-center justify-center text-white shadow-xs">
                        <Check size={12} className="stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-neutral-300 bg-white group-hover:border-neutral-400" />
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-1">
                  <h3
                    className={cn(
                      'text-sm sm:text-base font-bold transition-colors',
                      isSelected ? 'text-[#0058be]' : 'text-[#0b1c30]'
                    )}
                  >
                    {goal.label}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {goal.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          3. SECONDARY: RECOMMENDED ARCHITECTURE
          Compact, intelligent single recommendation with collapsible alternatives
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="bg-neutral-50/80 rounded-2xl border border-neutral-200 p-5 sm:p-6 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-1 max-w-xl">
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-[#0058be] block">
              Recommended Architecture
            </span>

            <h3 className="text-base sm:text-lg font-bold text-[#0b1c30]">
              {recommendation.archetypeName}
            </h3>

            <p className="text-xs text-neutral-600 leading-relaxed">
              {recommendation.reason}
            </p>
            <p className="text-xs text-neutral-500 font-medium">
              Conversion advantage: {recommendation.conversionAdvantage}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2 pt-1 sm:pt-0">
            {isRecommendationApplied ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <Check size={13} className="text-emerald-600 stroke-[3]" />
                <span>Selected</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleApplyRecommendation(recommendation.archetypeId)}
                className="px-3.5 py-1.5 rounded-xl bg-[#0058be] hover:bg-[#004bb0] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Use this architecture
              </button>
            )}
          </div>
        </div>

        {/* Explore Alternatives Control */}
        <div className="pt-2 border-t border-neutral-200/80 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowExplorer((prev) => !prev)}
            className="text-xs font-bold text-neutral-600 hover:text-[#0058be] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>{showExplorer ? 'Hide alternative architectures' : 'Explore other architectures'}</span>
            <ChevronDown size={14} className={cn('transition-transform duration-200', showExplorer && 'rotate-180')} />
          </button>

          <span className="text-[11px] text-neutral-400 font-mono hidden sm:inline">
            Active: {currentArchetypeMeta.name}
          </span>
        </div>

        {/* Collapsed Alternatives Explorer */}
        <AnimatePresence>
          {showExplorer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pt-2"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {PORTFOLIO_ARCHETYPES.map((arch) => {
                  const Icon = ARCHETYPE_ICONS[arch.iconName] || Zap;
                  const isCurrent = currentArchetypeId === arch.id;
                  const isRecommended = recommendation.archetypeId === arch.id;

                  return (
                    <div
                      key={arch.id}
                      onClick={() => handleSelectAlternativeArchetype(arch.id)}
                      className={cn(
                        'p-4 rounded-xl border transition-all cursor-pointer space-y-2 text-left',
                        isCurrent
                          ? 'bg-white border-[#0058be] ring-1 ring-[#0058be] shadow-2xs'
                          : 'bg-white border-neutral-200 hover:border-neutral-300'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon size={14} className={isCurrent ? 'text-[#0058be]' : 'text-neutral-500'} />
                          <h4 className="text-xs font-bold text-[#0b1c30] truncate">{arch.name}</h4>
                        </div>
                        {isCurrent && (
                          <div className="w-4 h-4 rounded-full bg-[#0058be] text-white flex items-center justify-center">
                            <Check size={10} className="stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <p className="text-[11px] text-neutral-500 leading-snug line-clamp-2">
                        {arch.description}
                      </p>

                      {isRecommended && (
                        <span className="text-[10px] font-bold text-[#0058be] block">
                          ★ Recommended for your goal
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          4. CLEAR PRIMARY ACTION FOOTER
      ────────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-neutral-200">
        <div className="text-xs text-neutral-500">
          {selectedGoalMeta ? (
            <span>
              Goal: <strong className="text-neutral-800">{selectedGoalMeta.label}</strong>
              <span className="mx-2 text-neutral-300">•</span>
              Architecture: <strong className="text-neutral-800">{currentArchetypeMeta.name}</strong>
            </span>
          ) : (
            <span className="text-amber-700 font-medium">
              Please choose a goal above to continue
            </span>
          )}
        </div>

        <ModuleButton
          onClick={onContinue}
          disabled={!canContinue}
        >
          <span>Continue to Section Sequence →</span>
        </ModuleButton>
      </div>
    </div>
  );
});

ArchetypeStrategySection.displayName = 'ArchetypeStrategySection';
export default ArchetypeStrategySection;
