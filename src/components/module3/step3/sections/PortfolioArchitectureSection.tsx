/**
 * PortfolioArchitectureSection.tsx — Level 2 (Stage 2) AI Workspace Builder Orchestrator
 * 
 * Production-grade 4-step wizard matching Level 1's professional architecture:
 * Step 1: Conversion Goal Selection (inline, high-contrast, AI generator)
 * Step 2: Architecture Rationale View (strategic thesis, placement map, decision framework)
 * Step 3: Layout Builder Studio (3-pane workspace with live telemetry, layers & inspector)
 * Step 4: Conversion Audit & Publish Gate (5-dimension score, telemetry, readiness, exports)
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layout,
  Target,
  Sparkles,
  Check,
  Zap,
  Repeat,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { EASING, DURATION } from '../../../../lib/motion-presets';
import { useModule3Store } from '../../../../lib/module3/store';
import {
  PortfolioGoal,
  recommendArchetype,
} from '../../../../lib/module3/portfolio-architecture-engine';

// ── Sub-step Views ────────────────────────────────────────────────────────────
import { ArchitectureRationaleSection } from './stage2/ArchitectureRationaleSection';
import { LayoutBuilderSection } from './stage2/LayoutBuilderSection';
import { ConversionAuditSection } from './stage2/ConversionAuditSection';

interface Props {
  onContinue: () => void;
}

// ── 4-Step Stepper Metadata (matching Level 1's stepper pattern) ───────────────
const STEPS = [
  {
    id: 1,
    label: 'Conversion Goal',
    shortLabel: 'Goal',
    icon: Target,
    desc: 'Select your portfolio\'s primary conversion objective',
  },
  {
    id: 2,
    label: 'Architecture Rationale',
    shortLabel: 'Rationale',
    icon: Sparkles,
    desc: 'Review AI strategic thesis & section placement',
  },
  {
    id: 3,
    label: 'Layout Builder',
    shortLabel: 'Builder',
    icon: Layout,
    desc: 'Arrange, configure, and refine your portfolio sections',
  },
  {
    id: 4,
    label: 'Conversion Audit',
    shortLabel: 'Audit',
    icon: Check,
    desc: 'Review conversion score, telemetry, and publish',
  },
] as const;

// ── Primary Goal Options ──────────────────────────────────────────────────────
const GOALS = [
  {
    id: 'retainer' as const,
    label: 'Win High-Value Retainers',
    icon: Repeat,
    desc: 'Focus on long-term enterprise value, embedded operations, and deep recurring client partnerships.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
  },
  {
    id: 'sprint' as const,
    label: 'Win Fast Sprint Projects',
    icon: Zap,
    desc: 'Highlight turnaround velocity, concrete deliverables, and rapid return on investment with zero agency drag.',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-100',
  },
  {
    id: 'consulting' as const,
    label: 'Build Advisory Authority',
    icon: Compass,
    desc: 'Position as a strategic advisor, commanding executive authority with proprietary diagnostic frameworks.',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
  },
];

// ── Motion tokens ─────────────────────────────────────────────────────────────
const sectionFade = {
  initial: { opacity: 0, y: 16, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -12, filter: 'blur(4px)' },
  transition: { duration: DURATION.NORMAL, ease: EASING.PREMIUM },
};

export const PortfolioArchitectureSection: React.FC<Props> = React.memo(({ onContinue }) => {
  const {
    stage2ActiveSection,
    stage2CompletedSections,
    stage2Archetype,
    setStage2ActiveSection,
    setStage2CompletedSections,
    setStage2Archetype,
    applyArchetypePreset,
    mod1ServiceId,
    mod1CareerTrackId,
  } = useModule3Store();

  // Active step persisted in store (1 to 4)
  const activeStep = (stage2ActiveSection && stage2ActiveSection >= 1 && stage2ActiveSection <= 4)
    ? stage2ActiveSection
    : 1;

  const completedSteps = useMemo(
    () => new Set(stage2CompletedSections || []),
    [stage2CompletedSections]
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const selectedGoal = stage2Archetype?.portfolioGoal ?? null;

  // ── STEP 1: GOAL SELECTION HANDLER ──────────────────────────────────────────
  const handleGoalSelect = useCallback((goal: PortfolioGoal) => {
    setIsGenerating(true);
    setTimeout(() => {
      const rec = recommendArchetype(mod1ServiceId, mod1CareerTrackId, goal);
      setStage2Archetype({
        portfolioGoal: goal,
        selectedArchetypeId: rec.archetypeId,
      });
      applyArchetypePreset(rec.archetypeId);

      const nextCompleted = Array.from(new Set([...(stage2CompletedSections || []), 1]));
      setStage2CompletedSections(nextCompleted);
      setStage2ActiveSection(2);
      setIsGenerating(false);
    }, 1300);
  }, [
    mod1ServiceId,
    mod1CareerTrackId,
    setStage2Archetype,
    applyArchetypePreset,
    stage2CompletedSections,
    setStage2CompletedSections,
    setStage2ActiveSection,
  ]);

  // ── STEP 2: RATIONALE HANDLERS ──────────────────────────────────────────────
  const handleRationaleBack = useCallback(() => {
    setStage2ActiveSection(1);
  }, [setStage2ActiveSection]);

  const handleRationaleConfirm = useCallback(() => {
    const nextCompleted = Array.from(new Set([...(stage2CompletedSections || []), 1, 2]));
    setStage2CompletedSections(nextCompleted);
    setStage2ActiveSection(3);
  }, [stage2CompletedSections, setStage2CompletedSections, setStage2ActiveSection]);

  // ── STEP 3: BUILDER HANDLERS ────────────────────────────────────────────────
  const handleBuilderBack = useCallback(() => {
    setStage2ActiveSection(2);
  }, [setStage2ActiveSection]);

  const handleBuilderContinue = useCallback(() => {
    const nextCompleted = Array.from(new Set([...(stage2CompletedSections || []), 1, 2, 3]));
    setStage2CompletedSections(nextCompleted);
    setStage2ActiveSection(4);
  }, [stage2CompletedSections, setStage2CompletedSections, setStage2ActiveSection]);

  // ── STEP 4: AUDIT & FINAL PUBLISH HANDLERS ──────────────────────────────────
  const handleAuditBack = useCallback(() => {
    setStage2ActiveSection(3);
  }, [setStage2ActiveSection]);

  const handleAuditPublish = useCallback(() => {
    // Lock the architecture specification in the store
    setStage2Archetype({
      isLocked: true,
      lockedAt: new Date().toISOString(),
    });

    const nextCompleted = Array.from(new Set([...(stage2CompletedSections || []), 1, 2, 3, 4]));
    setStage2CompletedSections(nextCompleted);

    // Advance to Level 3 (Evidence Matrix)
    onContinue();
  }, [setStage2Archetype, stage2CompletedSections, setStage2CompletedSections, onContinue]);

  return (
    <div className="w-full space-y-6 text-left font-sans">
      
      {/* ── PERSISTENT STEP PROGRESS BAR (Matching Level 1) ───────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
        className="p-3.5 sm:p-4 rounded-3xl border border-neutral-200 bg-white shadow-xs"
      >
        <div className="flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar">
          {STEPS.map((step, idx) => {
            const isActive = activeStep === step.id;
            const isCompleted = completedSteps.has(step.id);
            const isPast = step.id < activeStep;
            const Icon = step.icon;

            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (isCompleted || isPast || step.id <= activeStep) {
                      setStage2ActiveSection(step.id);
                    }
                  }}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer flex-1 min-w-[120px] sm:min-w-0',
                    isActive
                      ? 'bg-[#0058be] text-white shadow-md'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100/70'
                      : 'bg-neutral-50 text-neutral-400 border border-neutral-200 hover:text-neutral-600'
                  )}
                >
                  <span className={cn(
                    'w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0',
                    isActive ? 'bg-white/20 text-white' : isCompleted ? 'bg-emerald-200 text-emerald-900' : 'bg-neutral-200 text-neutral-600'
                  )}>
                    {isCompleted ? <Check size={12} strokeWidth={3} /> : `0${step.id}`}
                  </span>
                  <span className="text-[11px] font-bold truncate">{step.shortLabel}</span>
                </button>
                {idx < STEPS.length - 1 && (
                  <div className={cn(
                    'w-3 sm:w-4 h-0.5 rounded-full shrink-0',
                    step.id < activeStep ? 'bg-emerald-300' : 'bg-neutral-200'
                  )} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </motion.div>

      {/* ── STEP CONTENT ROUTER ───────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        
        {/* STEP 1: CONVERSION GOAL SELECTION */}
        {activeStep === 1 && (
          <React.Fragment key="step-1-goal">
            {isGenerating ? (
              <motion.div
                key="generating"
                {...sectionFade}
                className="w-full p-16 flex flex-col items-center justify-center border border-neutral-200 rounded-3xl bg-white shadow-xs"
              >
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 border-4 border-neutral-100 rounded-full" />
                  <div className="absolute inset-0 border-4 border-[#0058be] rounded-full border-t-transparent animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto text-[#0058be] animate-pulse" size={28} />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  Engineering Architecture Blueprint...
                </h3>
                <p className="text-neutral-500 text-sm font-medium">
                  Applying conversion guardrails, proof proximity, and optimal section sequencing.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="goal-selection"
                {...sectionFade}
                className="w-full p-8 sm:p-10 rounded-3xl border border-neutral-200 bg-white shadow-xs space-y-8"
              >
                {/* Section Header */}
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#0058be]/10 text-[#0058be] text-[10px] font-bold uppercase tracking-widest border border-[#0058be]/20">
                    <Sparkles size={12} />
                    AI Blueprint Generator
                  </div>
                  <h3 className="text-2xl font-bold text-[#0b1c30]">
                    Select your primary conversion goal
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    Choose the objective below that best matches your portfolio strategy. Our engine will generate a mathematically proven layout structure tailored for your market positioning.
                  </p>
                </div>

                {/* Goal Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {GOALS.map((goal) => {
                    const Icon = goal.icon;
                    const isSelected = selectedGoal === goal.id;

                    return (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => handleGoalSelect(goal.id)}
                        className={cn(
                          'group relative p-6 sm:p-7 rounded-2xl border-2 transition-all cursor-pointer text-left space-y-4 flex flex-col justify-between',
                          isSelected
                            ? 'border-[#0058be] bg-blue-50/40 shadow-lg ring-2 ring-[#0058be]/20'
                            : 'border-neutral-200 bg-white hover:border-[#0058be]/40 hover:shadow-md hover:bg-neutral-50/50'
                        )}
                      >
                        <div className="space-y-4">
                          <div className={cn(
                            'w-12 h-12 rounded-2xl flex items-center justify-center transition-all',
                            goal.bgColor, goal.borderColor, 'border',
                            'group-hover:scale-110'
                          )}>
                            <Icon size={22} className={goal.color} />
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-base font-bold text-[#0b1c30] group-hover:text-[#0058be] transition-colors">
                              {goal.label}
                            </h4>
                            <p className="text-xs text-neutral-500 leading-relaxed">
                              {goal.desc}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 group-hover:text-[#0058be] transition-colors uppercase tracking-wider pt-4 border-t border-neutral-100">
                          Generate Blueprint <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </React.Fragment>
        )}

        {/* STEP 2: ARCHITECTURE RATIONALE VIEW */}
        {activeStep === 2 && (
          <ArchitectureRationaleSection
            key="step-2-rationale"
            onBack={handleRationaleBack}
            onConfirm={handleRationaleConfirm}
          />
        )}

        {/* STEP 3: STUDIO LAYOUT BUILDER */}
        {activeStep === 3 && (
          <LayoutBuilderSection
            key="step-3-builder"
            onBack={handleBuilderBack}
            onContinue={handleBuilderContinue}
          />
        )}

        {/* STEP 4: CONVERSION AUDIT & PUBLISH */}
        {activeStep === 4 && (
          <ConversionAuditSection
            key="step-4-audit"
            onBack={handleAuditBack}
            onPublish={handleAuditPublish}
          />
        )}

      </AnimatePresence>
    </div>
  );
});

PortfolioArchitectureSection.displayName = 'PortfolioArchitectureSection';
export default PortfolioArchitectureSection;
