/**
 * ArchitectureRationaleSection.tsx — Level 2 (Step 2): Architecture Rationale View
 * 
 * Explains WHY the AI chose this specific archetype and section ordering
 * based on the user's conversion goal and positioning inputs.
 * 
 * Components:
 * 1. Archetype Identity Card (name, badge, description, best for, conversion advantage)
 * 2. Strategic Blueprint (primary strategy, proof placement, mechanism framing, psychology)
 * 3. Section Placement Map (scroll journey with funnel phase & priority badges)
 * 4. Action bar (Change Goal vs Confirm & Launch Builder)
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Shield,
  Zap,
  Cpu,
  Award,
  Layers,
  CheckCircle2,
  TrendingUp,
  Target,
  Brain,
  Workflow,
  Lock,
} from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import { EASING, DURATION } from '../../../../../lib/motion-presets';
import { useModule3Store } from '../../../../../lib/module3/store';
import {
  PORTFOLIO_ARCHETYPES,
  PortfolioGoal,
  getArchitectureRationale,
  getSectionPlacementMetadata,
} from '../../../../../lib/module3/portfolio-architecture-engine';

interface Props {
  onBack: () => void;
  onConfirm: () => void;
}

const sectionFade = {
  initial: { opacity: 0, y: 16, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -12, filter: 'blur(4px)' },
  transition: { duration: DURATION.NORMAL, ease: EASING.PREMIUM },
};

export const ArchitectureRationaleSection: React.FC<Props> = React.memo(({ onBack, onConfirm }) => {
  const {
    authoritySuite,
    stage2Archetype,
    mod1ServiceId,
    mod2UniqueMechanism,
  } = useModule3Store();

  const sections = authoritySuite?.portfolioBlueprint ?? [];
  const selectedGoal: PortfolioGoal = stage2Archetype?.portfolioGoal || 'retainer';
  const selectedArchetypeId = stage2Archetype?.selectedArchetypeId || 'proof_first';

  const archetype = useMemo(() => {
    return PORTFOLIO_ARCHETYPES.find((a) => a.id === selectedArchetypeId) || PORTFOLIO_ARCHETYPES[0];
  }, [selectedArchetypeId]);

  const rationale = useMemo(() => {
    return getArchitectureRationale(
      selectedGoal,
      selectedArchetypeId,
      mod1ServiceId,
      mod2UniqueMechanism || undefined
    );
  }, [selectedGoal, selectedArchetypeId, mod1ServiceId, mod2UniqueMechanism]);

  const ArchetypeIcon = useMemo(() => {
    switch (archetype.iconName) {
      case 'Zap': return Zap;
      case 'Cpu': return Cpu;
      case 'Shield': return Shield;
      case 'Award': default: return Award;
    }
  }, [archetype.iconName]);

  return (
    <motion.div {...sectionFade} className="w-full space-y-8 text-left font-sans">
      {/* ── 1. ARCHETYPE HERO & IDENTITY CARD ────────────────────────────── */}
      <div className="p-8 sm:p-10 rounded-3xl border border-neutral-200 bg-white shadow-xs space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0058be]/10 text-[#0058be] text-[11px] font-bold uppercase tracking-wider border border-[#0058be]/20">
              <Sparkles size={13} />
              AI Architecture Rationale
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
              {archetype.name}
            </h3>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              {archetype.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-blue-50/80 border border-blue-200/80 text-blue-900">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ArchetypeIcon size={16} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-blue-600">Archetype Mode</div>
                <div className="text-xs font-bold">{archetype.badge}</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-900">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Target size={16} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Goal Alignment</div>
                <div className="text-xs font-bold">{rationale.goalLabel}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Advantage & Target Audience Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-neutral-500 text-xs font-bold uppercase tracking-wider">
              <Target size={14} className="text-[#0058be]" />
              Engineered Best For
            </div>
            <p className="text-sm font-semibold text-[#0b1c30]">
              {archetype.bestFor}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/50 border border-blue-200/60 space-y-1.5">
            <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <TrendingUp size={14} className="text-blue-600" />
              Conversion Advantage
            </div>
            <p className="text-sm font-semibold text-blue-950">
              {archetype.conversionAdvantage}
            </p>
          </div>
        </div>

        {/* ── 2. STRATEGIC BLUEPRINT CARDS ─────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Brain size={18} className="text-[#0058be]" />
            <h4 className="text-base font-bold text-[#0b1c30]">
              Strategic Decision Framework
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary Strategy */}
            <div className="p-5 rounded-2xl border border-neutral-200 bg-white hover:border-[#0058be]/30 transition-all space-y-2">
              <div className="text-[11px] font-black uppercase tracking-wider text-[#0058be] flex items-center gap-1.5">
                <Workflow size={13} />
                Primary Funnel Strategy
              </div>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium">
                {rationale.primaryStrategy}
              </p>
            </div>

            {/* Proof Placement Rationale */}
            <div className="p-5 rounded-2xl border border-neutral-200 bg-white hover:border-[#0058be]/30 transition-all space-y-2">
              <div className="text-[11px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <Shield size={13} />
                Proof Sequencing Logic
              </div>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium">
                {rationale.proofPlacementRationale}
              </p>
            </div>

            {/* Mechanism Framing */}
            <div className="p-5 rounded-2xl border border-neutral-200 bg-white hover:border-[#0058be]/30 transition-all space-y-2">
              <div className="text-[11px] font-black uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                <Cpu size={13} />
                Mechanism Framing
              </div>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium">
                {rationale.mechanismPlacementRationale}
              </p>
            </div>

            {/* Visitor Psychology */}
            <div className="p-5 rounded-2xl border border-neutral-200 bg-white hover:border-[#0058be]/30 transition-all space-y-2">
              <div className="text-[11px] font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <Brain size={13} />
                Buyer Psychology State
              </div>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium">
                {rationale.visitorPsychologyIntent}
              </p>
            </div>
          </div>

          {/* AI Synthesis Callout */}
          <div className="p-5 rounded-2xl bg-neutral-900 text-white space-y-2">
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} className="text-yellow-400" />
              Strategic Blueprint Synthesis
            </div>
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
              {rationale.summaryParagraph}
            </p>
          </div>
        </div>

        {/* ── 3. SECTION PLACEMENT MAP ─────────────────────────────────────── */}
        <div className="space-y-4 pt-4 border-t border-neutral-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-[#0058be]" />
              <h4 className="text-base font-bold text-[#0b1c30]">
                Scroll Architecture & Section Placement Map
              </h4>
            </div>
            <span className="text-xs text-neutral-500 font-medium">
              {sections.length} Ordered Sections · Mathematical Funnel Sequence
            </span>
          </div>

          <div className="rounded-2xl border border-neutral-200 divide-y divide-neutral-100 overflow-hidden bg-white">
            {sections.map((sec, idx) => {
              const meta = getSectionPlacementMetadata(sec.id, selectedArchetypeId, selectedGoal);
              const isHero = sec.id === 'section_hero';
              const isCta = sec.id === 'section_cta';

              return (
                <div
                  key={sec.id}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-50/70 transition-colors"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5",
                      isHero ? "bg-[#0058be] text-white" : isCta ? "bg-purple-600 text-white" : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                    )}>
                      {isHero ? <Lock size={12} /> : `0${idx + 1}`}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-[#0b1c30]">
                          {sec.title}
                        </span>

                        {/* Funnel Role Badge */}
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                          meta.funnelRole.color
                        )}>
                          {meta.funnelRole.label}
                        </span>

                        {/* Priority Badge */}
                        <span className={cn(
                          "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border",
                          meta.priority.color
                        )}>
                          {meta.priority.level}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 md:line-clamp-none">
                        {meta.placementReason}
                      </p>
                    </div>
                  </div>

                  <div className="hidden lg:flex items-center gap-1.5 text-neutral-400 text-xs shrink-0 self-center">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span className="text-[11px] font-semibold text-neutral-600">Aligned</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 4. ACTION BAR ────────────────────────────────────────────────── */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-100">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={14} />
            Change Conversion Goal
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-[#0058be] text-white hover:bg-blue-700 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            Confirm & Launch Studio Builder
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
});

ArchitectureRationaleSection.displayName = 'ArchitectureRationaleSection';
export default ArchitectureRationaleSection;
