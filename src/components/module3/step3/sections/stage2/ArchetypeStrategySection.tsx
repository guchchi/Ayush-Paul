/**
 * ArchetypeStrategySection.tsx — Level 2 / Sub-Step 1: Portfolio Archetype & Visitor Journey
 *
 * Helps the user select the optimal portfolio conversion archetype based on their
 * career track and proof inventory, and maps out the 5-stage visitor cognitive journey.
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Zap,
  Shield,
  Cpu,
  Award,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Check,
  TrendingUp,
  Target,
} from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import { EASING, DURATION } from '../../../../../lib/motion-presets';
import { useModule3Store } from '../../../../../lib/module3/store';
import {
  PORTFOLIO_ARCHETYPES,
  PortfolioArchetype,
} from '../../../../../lib/module3/portfolio-architecture-engine';
import { ModuleButton } from '../../../../workspace/ModuleButton';

interface Props {
  onContinue: () => void;
}

const ICONS: Record<string, React.FC<{ className?: string; size?: number }>> = {
  Zap,
  Shield,
  Cpu,
  Award,
};

const VISITOR_JOURNEY_STAGES = [
  {
    step: '01',
    phase: 'Hook & Orientation',
    timeframe: '0 – 5 Seconds',
    visitorQuestion: 'Who is this and can they solve my specific problem?',
    funnelFocus: 'Clear Headline, Target Market mention, Above-the-fold Value Proposition',
    color: 'border-blue-200 bg-blue-50/50 text-blue-900',
  },
  {
    step: '02',
    phase: 'Mechanism Diagnosis',
    timeframe: '5 – 20 Seconds',
    visitorQuestion: 'Why should I trust their methodology over generic agencies?',
    funnelFocus: 'Unique Mechanism, Thesis breakdown, Why conventional methods fail',
    color: 'border-indigo-200 bg-indigo-50/50 text-indigo-900',
  },
  {
    step: '03',
    phase: 'Verifiable Proof Inspection',
    timeframe: '20 – 60 Seconds',
    visitorQuestion: 'Show me the real outputs. What does the work actually look like?',
    funnelFocus: 'Interactive Demos, Live Repositories, Video Teardowns, Step 2 Assets',
    color: 'border-emerald-200 bg-emerald-50/50 text-emerald-900',
  },
  {
    step: '04',
    phase: 'Peer Validation & Case Studies',
    timeframe: '1 – 2 Minutes',
    visitorQuestion: 'Have people like me succeeded with this provider?',
    funnelFocus: 'STAR Case Studies, Client Endorsements, Measured ROI Metrics',
    color: 'border-amber-200 bg-amber-50/50 text-amber-900',
  },
  {
    step: '05',
    phase: 'Conversion & Risk Reversal',
    timeframe: '2 – 3 Minutes',
    visitorQuestion: 'How do I get started? What is the risk or commitment?',
    funnelFocus: 'Frictionless Booking Widget, FAQ Objection Killer, 100% Guarantee',
    color: 'border-purple-200 bg-purple-50/50 text-purple-900',
  },
];

export const ArchetypeStrategySection: React.FC<Props> = React.memo(({ onContinue }) => {
  const {
    stage2Archetype,
    setStage2Archetype,
    applyArchetypePreset,
    mod1ServiceId,
    mod1CareerTrackId,
    mod2UniqueMechanism,
  } = useModule3Store();

  // Auto-recommend archetype based on service and career track
  const recommendedArchetypeId = useMemo(() => {
    const s = (mod1ServiceId || '').toLowerCase();
    const c = (mod1CareerTrackId || '').toLowerCase();
    if (s.includes('video') || s.includes('edit') || s.includes('motion') || c.includes('editor')) {
      return 'proof_first';
    }
    if (s.includes('consult') || s.includes('strategy') || s.includes('architect') || c.includes('consultant')) {
      return 'system_architect';
    }
    if (s.includes('code') || s.includes('dev') || s.includes('engineer') || c.includes('developer')) {
      return 'proof_first';
    }
    if (s.includes('design') || s.includes('product') || c.includes('designer')) {
      return 'agency_alternative';
    }
    return 'proof_first';
  }, [mod1ServiceId, mod1CareerTrackId]);

  const selectedArchetypeId = stage2Archetype?.selectedArchetypeId || recommendedArchetypeId;

  const handleSelectArchetype = (archetypeId: string) => {
    setStage2Archetype({ selectedArchetypeId: archetypeId });
    applyArchetypePreset(archetypeId);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner: The Authority Funnel Paradigm */}
      <div className="bg-gradient-to-r from-[#061b4f] via-[#0b1c30] to-[#1e1b4b] text-white p-6 sm:p-7 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Layers size={15} />
              <span>Step 1 of 5 — Strategy Foundation</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Portfolio Archetype & Conversion Funnel
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Transform your portfolio from an amateur resume into an engineered high-ticket sales funnel designed to build instant certainty and eliminate buying friction.
            </p>
          </div>

          <div className="bg-white/10 border border-white/15 px-4 py-3 rounded-2xl shrink-0 space-y-0.5 text-right">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest block">
              Unique Mechanism
            </span>
            <span className="text-xs font-black text-cyan-300 line-clamp-1">
              {mod2UniqueMechanism || 'Proof-First Architecture'}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Archetype Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0b1c30]">
              Select Your Portfolio Conversion Archetype
            </h3>
            <p className="text-xs text-neutral-500">
              Choose the architectural layout that best matches your service delivery and proof strength.
            </p>
          </div>
          <span className="text-xs font-bold text-[#0058be] bg-[#0058be]/10 px-3 py-1 rounded-full border border-[#0058be]/20">
            Recommended for you: {PORTFOLIO_ARCHETYPES.find(a => a.id === recommendedArchetypeId)?.name}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PORTFOLIO_ARCHETYPES.map((arch) => {
            const Icon = ICONS[arch.iconName] || Zap;
            const isSelected = selectedArchetypeId === arch.id;
            const isRecommended = recommendedArchetypeId === arch.id;

            return (
              <motion.div
                key={arch.id}
                whileHover={{ y: -2 }}
                onClick={() => handleSelectArchetype(arch.id)}
                className={cn(
                  'p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer space-y-4 relative text-left group',
                  isSelected
                    ? 'bg-white border-[#0058be] shadow-md ring-2 ring-[#0058be]/15'
                    : 'bg-white border-neutral-200/90 shadow-2xs hover:border-neutral-300'
                )}
              >
                {/* Header with Badges */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-2xl flex items-center justify-center border transition-colors',
                        isSelected
                          ? 'bg-[#0058be] text-white border-[#0058be]'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-200 group-hover:bg-[#0058be]/10 group-hover:text-[#0058be]'
                      )}
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm sm:text-base font-black text-[#0b1c30]">
                          {arch.name}
                        </h4>
                        {isRecommended && (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold">
                            AI Pick
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-[#0058be] block">
                        {arch.badge}
                      </span>
                    </div>
                  </div>

                  <div
                    className={cn(
                      'w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all',
                      isSelected
                        ? 'bg-[#0058be] border-[#0058be] text-white'
                        : 'border-neutral-300 text-transparent'
                    )}
                  >
                    <Check size={14} className="stroke-[3]" />
                  </div>
                </div>

                {/* Subtitle & Description */}
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-neutral-800">{arch.subtitle}</p>
                  <p className="text-neutral-500 leading-relaxed font-normal">{arch.description}</p>
                </div>

                {/* Best For & Conversion Advantage Box */}
                <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold text-neutral-400">
                    <span>Best Suited For</span>
                    <span className="text-emerald-700">Conversion Impact</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0b1c30] text-xs">{arch.bestFor}</span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 flex items-center gap-1">
                      <TrendingUp size={11} />
                      {arch.conversionAdvantage.split(' ')[0]} {arch.conversionAdvantage.split(' ')[1]}
                    </span>
                  </div>
                </div>

                {/* Funnel Focus */}
                <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
                  <Target size={13} className="text-[#0058be] shrink-0" />
                  <span className="line-clamp-1">{arch.funnelFocus}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 5-Stage Visitor Cognitive Funnel Journey */}
      <div className="p-6 sm:p-7 rounded-3xl border border-neutral-200 bg-white shadow-xs space-y-4 text-left">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#0058be] bg-[#0058be]/10 px-2.5 py-0.5 rounded-full border border-[#0058be]/20">
            Psychological Progression
          </span>
          <h3 className="text-lg font-bold text-[#0b1c30] mt-1">
            The 5-Stage High-Ticket Visitor Journey
          </h3>
          <p className="text-xs text-neutral-500">
            How prospects evaluate your page as they scroll, and what each section must accomplish to prevent drop-off.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {VISITOR_JOURNEY_STAGES.map((s, idx) => (
            <div
              key={idx}
              className={cn(
                'p-4 rounded-2xl border space-y-2 text-xs flex flex-col justify-between transition-all',
                s.color
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-black tracking-wider opacity-70">
                    STAGE {s.step}
                  </span>
                  <span className="text-[9px] font-bold opacity-80">{s.timeframe}</span>
                </div>
                <h4 className="font-black text-xs text-[#0b1c30]">{s.phase}</h4>
                <p className="text-[11px] font-medium text-neutral-700 leading-snug">
                  "{s.visitorQuestion}"
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-200/60 text-[10px] text-neutral-600 leading-tight">
                <strong>Must Deliver:</strong> {s.funnelFocus}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
        <div className="text-xs text-neutral-500">
          Selected Archetype: <strong className="text-[#0b1c30]">{PORTFOLIO_ARCHETYPES.find(a => a.id === selectedArchetypeId)?.name}</strong>
        </div>

        <ModuleButton onClick={onContinue}>
          Confirm Archetype &amp; Arrange Sections →
        </ModuleButton>
      </div>
    </div>
  );
});
