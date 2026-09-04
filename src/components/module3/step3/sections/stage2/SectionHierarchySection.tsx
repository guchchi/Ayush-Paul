/**
 * SectionHierarchySection.tsx — Level 2 / Sub-Step 2: Section Flow & Hierarchy Canvas
 *
 * Provides sequence reordering, enable/disable toggling, quick sequence presets,
 * funnel role tagging, and priority allocation.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ListOrdered,
  Zap,
  Shield,
  Layers,
} from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import { EASING, DURATION } from '../../../../../lib/motion-presets';
import { useModule3Store } from '../../../../../lib/module3/store';
import {
  PORTFOLIO_ARCHETYPES,
  calculatePortfolioConversionScore,
} from '../../../../../lib/module3/portfolio-architecture-engine';
import { ModuleButton } from '../../../../workspace/ModuleButton';
import type { PortfolioBlueprintSection } from '../../../../../data/module3/authority-suite-engine';

interface Props {
  onContinue: () => void;
}

export const SectionHierarchySection: React.FC<Props> = React.memo(({ onContinue }) => {
  const {
    authoritySuite,
    reorderPortfolioSections,
    resetPortfolioSectionsToDefault,
    applyArchetypePreset,
    updatePortfolioSection,
    stage2Archetype,
    mod1ServiceId,
    mod2UniqueMechanism,
  } = useModule3Store();

  const [activePresetNotification, setActivePresetNotification] = useState<string | null>(null);

  const sections = useMemo(() => {
    return authoritySuite?.portfolioBlueprint ?? [];
  }, [authoritySuite?.portfolioBlueprint]);

  const audit = useMemo(() => {
    return calculatePortfolioConversionScore(sections, mod1ServiceId, mod2UniqueMechanism);
  }, [sections, mod1ServiceId, mod2UniqueMechanism]);

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    reorderPortfolioSections(reordered);
  };

  const handleToggle = (sectionId: string, currentEnabled: boolean) => {
    updatePortfolioSection(sectionId, { isEnabled: !currentEnabled });
  };

  const handleApplyPreset = (archetypeId: string, label: string) => {
    applyArchetypePreset(archetypeId);
    setActivePresetNotification(`Applied "${label}" Sequence`);
    setTimeout(() => setActivePresetNotification(null), 3000);
  };

  const handleReset = () => {
    resetPortfolioSectionsToDefault();
    setActivePresetNotification('Reset to Default 9-Section Sequence');
    setTimeout(() => setActivePresetNotification(null), 3000);
  };

  // Funnel role derivation
  const getFunnelRole = (sectionId: string) => {
    switch (sectionId) {
      case 'section_hero':
      case 'section_about':
        return { label: 'Top of Funnel : Hook & Orient', color: 'bg-blue-50 text-[#0058be] border-blue-200' };
      case 'section_proof':
      case 'section_case_studies':
      case 'section_services':
        return { label: 'Mid Funnel : Prove & Differentiate', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'section_testimonials':
      case 'section_authority':
      case 'section_faq':
      case 'section_cta':
      default:
        return { label: 'Bottom Funnel : Validate & Convert', color: 'bg-purple-50 text-purple-700 border-purple-200' };
    }
  };

  // Priority derivation
  const getPriority = (sectionId: string) => {
    if (['section_hero', 'section_proof', 'section_services', 'section_cta'].includes(sectionId)) {
      return { label: 'HIGH PRIORITY', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    }
    if (['section_case_studies', 'section_testimonials', 'section_faq'].includes(sectionId)) {
      return { label: 'MEDIUM', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
    return { label: 'OPTIONAL', color: 'bg-neutral-100 text-neutral-600 border-neutral-200' };
  };

  const proofIdx = sections.findIndex((s) => s.id === 'section_proof' && s.isEnabled !== false);
  const isProofEarly = proofIdx === 1 || proofIdx === 2;

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#0058be] text-xs font-mono font-bold uppercase tracking-wider">
              <ListOrdered size={15} />
              <span>Step 2 of 5 — Sequence Studio</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0b1c30]">
              Section Sequence & Funnel Order
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Drag, order, and toggle your website sections. High-ticket buyers evaluate credibility sequentially—place proof early to minimize drop-off.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-xl border border-neutral-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset Default</span>
            </button>
          </div>
        </div>

        {/* Quick Archetype Preset Switcher */}
        <div className="pt-2 border-t border-neutral-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-neutral-500 uppercase text-[10px] tracking-wider">
              One-Click Sequence Presets:
            </span>
            {activePresetNotification && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 animate-pulse">
                ✓ {activePresetNotification}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {PORTFOLIO_ARCHETYPES.map((arch) => (
              <button
                key={arch.id}
                onClick={() => handleApplyPreset(arch.id, arch.name)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer',
                  stage2Archetype?.selectedArchetypeId === arch.id
                    ? 'bg-[#0058be]/10 text-[#0058be] border-[#0058be]/30 shadow-2xs'
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                )}
              >
                <Sparkles size={12} className={stage2Archetype?.selectedArchetypeId === arch.id ? 'text-[#0058be]' : 'text-neutral-400'} />
                <span>{arch.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Proof Health Callout */}
      <div className={cn(
        'p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs',
        isProofEarly
          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
          : 'bg-amber-50/70 border-amber-200 text-amber-900'
      )}>
        <div className="flex items-center gap-2.5">
          {isProofEarly ? (
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle size={18} className="text-amber-600 shrink-0" />
          )}
          <div>
            <strong>Proof Proximity Status:</strong>{' '}
            {isProofEarly ? (
              <span>Verifiable Proof is in Position #{proofIdx + 1}. Visitors see real outputs before reading pitch claims. (Optimal)</span>
            ) : (
              <span>Verifiable Proof is buried at Position #{proofIdx + 1}. Consider moving it to Position #2 or #3 for higher trust.</span>
            )}
          </div>
        </div>

        <span className="font-bold text-[11px] px-2.5 py-1 rounded-lg border shrink-0 bg-white shadow-2xs">
          Conversion Score: {audit.totalScore}/100
        </span>
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        {sections.map((sec, idx) => {
          const isEnabled = sec.isEnabled !== false;
          const funnel = getFunnelRole(sec.id);
          const priority = getPriority(sec.id);

          return (
            <motion.div
              key={sec.id}
              layout
              transition={{ duration: 0.2 }}
              className={cn(
                'p-4 sm:p-5 rounded-2xl border transition-all text-left space-y-3',
                !isEnabled
                  ? 'bg-neutral-50/60 border-dashed border-neutral-300 opacity-60'
                  : 'bg-white border-neutral-200/90 shadow-2xs hover:border-neutral-300'
              )}
            >
              {/* Row Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  {/* Position Badge */}
                  <span
                    className={cn(
                      'w-8 h-8 rounded-xl font-mono text-xs font-black flex items-center justify-center border shrink-0 mt-0.5',
                      isEnabled
                        ? 'bg-blue-50 text-[#0058be] border-blue-200'
                        : 'bg-neutral-200 text-neutral-500 border-neutral-300'
                    )}
                  >
                    0{idx + 1}
                  </span>

                  {/* Title & Metadata */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm sm:text-base font-black text-[#0b1c30]">
                        {sec.title}
                      </h4>

                      <span className={cn('text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border', funnel.color)}>
                        {funnel.label}
                      </span>

                      <span className={cn('text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border', priority.color)}>
                        {priority.label}
                      </span>

                      {!isEnabled && (
                        <span className="text-[10px] font-bold text-neutral-500 bg-neutral-200 px-2 py-0.5 rounded-md">
                          Disabled
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-500 font-medium line-clamp-1">
                      {sec.purpose}
                    </p>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Up / Down Controls */}
                  <div className="flex items-center bg-neutral-100 rounded-xl p-0.5 border border-neutral-200">
                    <button
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      title="Move up in sequence"
                      className="p-1.5 text-neutral-600 hover:text-[#0058be] disabled:opacity-25 disabled:hover:text-neutral-600 cursor-pointer transition-colors"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === sections.length - 1}
                      title="Move down in sequence"
                      className="p-1.5 text-neutral-600 hover:text-[#0058be] disabled:opacity-25 disabled:hover:text-neutral-600 cursor-pointer transition-colors"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  {/* Toggle Active/Disabled */}
                  <button
                    onClick={() => handleToggle(sec.id, isEnabled)}
                    title={isEnabled ? 'Hide section from portfolio' : 'Activate section in portfolio'}
                    className={cn(
                      'p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border',
                      isEnabled
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200'
                    )}
                  >
                    {isEnabled ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
              </div>

              {/* Rationale & Headline Snippet */}
              {isEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/80">
                    <span className="font-bold text-[10px] text-neutral-400 uppercase block mb-0.5">
                      Conversion Rationale
                    </span>
                    <p className="text-neutral-700 leading-snug line-clamp-2">{sec.conversionReasoning}</p>
                  </div>

                  <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/80">
                    <span className="font-bold text-[10px] text-neutral-400 uppercase block mb-0.5">
                      Current Headline
                    </span>
                    <p className="text-neutral-900 font-bold leading-snug line-clamp-2">"{sec.headline}"</p>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Action Area */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
        <div className="text-xs text-neutral-500">
          Active Funnel: <strong className="text-[#0b1c30]">{sections.filter(s => s.isEnabled !== false).length} Sections</strong>
        </div>

        <ModuleButton onClick={onContinue}>
          Confirm Sequence &amp; Edit Specs →
        </ModuleButton>
      </div>
    </div>
  );
});
