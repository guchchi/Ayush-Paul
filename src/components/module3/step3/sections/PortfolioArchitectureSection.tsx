/**
 * PortfolioArchitectureSection.tsx — Level 2 (Stage 2) Master Orchestrator
 *
 * Manages the 5-step wizard flow for Level 02: Portfolio Architecture Builder.
 * Step-by-step navigation:
 *  1. Archetype & Visitor Journey (ArchetypeStrategySection)
 *  2. Sequence Ordering & Priority (SectionHierarchySection)
 *  3. Copy, Visuals & Proof Injector (SectionSpecStudio)
 *  4. Interactive Wireframe Simulator (WireframeSimulatorSection)
 *  5. Conversion Audit & Blueprint Export (DeployArchitectureSection)
 */

import React, { useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../../../lib/utils';
import { EASING, DURATION } from '../../../../lib/motion-presets';
import { useModule3Store } from '../../../../lib/module3/store';

// ── Sub-Section Components ────────────────────────────────────────────────────
import { ContextHandoffCard } from './stage2/ContextHandoffCard';
import { ArchetypeStrategySection } from './stage2/ArchetypeStrategySection';
import { SectionHierarchySection } from './stage2/SectionHierarchySection';
import { SectionSpecStudio } from './stage2/SectionSpecStudio';
import { WireframeSimulatorSection } from './stage2/WireframeSimulatorSection';
import { DeployArchitectureSection } from './stage2/DeployArchitectureSection';

import {
  Target,
  ListOrdered,
  FileText,
  Monitor,
  Rocket,
  Check,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

interface Props {
  onContinue: () => void;
}

const STAGE2_SECTIONS = [
  { id: 1, label: 'Context & Goal', shortLabel: 'Goal', icon: Target, desc: 'Verify inherited strategic context and select your portfolio acquisition goal' },
  { id: 2, label: 'Section Sequence', shortLabel: 'Hierarchy', icon: ListOrdered, desc: 'Arrange 9-section order & prioritize above-the-fold proof' },
  { id: 3, label: 'Copy & Visual Specs', shortLabel: 'Spec Studio', icon: FileText, desc: 'Fine-tune headlines, narrative copy, CTAs & visual components' },
  { id: 4, label: 'Wireframe Simulator', shortLabel: 'Simulator', icon: Monitor, desc: 'Live responsive preview across Desktop, Tablet & Mobile' },
  { id: 5, label: 'Audit & Master Export', shortLabel: 'Deploy Spec', icon: Rocket, desc: '5-dimension conversion score, checklist & luxury PDF export' },
] as const;

const sectionFade = {
  initial: { opacity: 0, y: 14, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -10, filter: 'blur(4px)' },
  transition: { duration: DURATION.NORMAL, ease: EASING.PREMIUM },
};

export const PortfolioArchitectureSection: React.FC<Props> = React.memo(({ onContinue }) => {
  const {
    stage2ActiveSection,
    stage2CompletedSections,
    setStage2ActiveSection,
    setStage2CompletedSections,
  } = useModule3Store();

  const activeSection = stage2ActiveSection || 1;
  const completedSections = useMemo(
    () => new Set(stage2CompletedSections || []),
    [stage2CompletedSections]
  );

  const advanceSection = useCallback((currentId: number) => {
    const updated = Array.from(new Set([...(stage2CompletedSections || []), currentId]));
    setStage2CompletedSections(updated);
    if (currentId < 5) {
      setStage2ActiveSection(currentId + 1);
    }
  }, [stage2CompletedSections, setStage2CompletedSections, setStage2ActiveSection]);

  const retreatSection = useCallback((currentId: number) => {
    if (currentId > 1) {
      setStage2ActiveSection(currentId - 1);
    }
  }, [setStage2ActiveSection]);

  const handleFinish = useCallback(() => {
    const updated = Array.from(new Set([...(stage2CompletedSections || []), 1, 2, 3, 4, 5]));
    setStage2CompletedSections(updated);
    onContinue();
  }, [stage2CompletedSections, setStage2CompletedSections, onContinue]);

  const currentMetadata = STAGE2_SECTIONS.find((s) => s.id === activeSection) || STAGE2_SECTIONS[0];

  return (
    <div className="space-y-6 text-left w-full font-sans">
      {/* Step Tabs / Navigation Ribbon */}
      <div className="bg-white p-3 sm:p-4 rounded-3xl border border-neutral-200 shadow-xs">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          {STAGE2_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = sec.id === activeSection;
            const isDone = completedSections.has(sec.id);

            return (
              <button
                key={sec.id}
                onClick={() => setStage2ActiveSection(sec.id)}
                className={cn(
                  'flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer border',
                  isActive
                    ? 'bg-[#0058be] text-white border-[#0058be] shadow-sm'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/80'
                    : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                )}
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black',
                    isActive
                      ? 'bg-white/20 text-white'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-200 text-neutral-600'
                  )}
                >
                  {isDone ? <Check size={11} className="stroke-[3]" /> : `0${sec.id}`}
                </div>

                <span className="hidden sm:inline">{sec.label}</span>
                <span className="sm:hidden">{sec.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Step Sub-Header Description Bar */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-neutral-100 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            {activeSection > 1 && (
              <button
                onClick={() => retreatSection(activeSection)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0058be] hover:underline cursor-pointer"
              >
                <ArrowLeft size={12} />
                <span>Previous Step</span>
              </button>
            )}
            <span className="text-neutral-300">•</span>
            <span className="font-semibold text-neutral-700">{currentMetadata.desc}</span>
          </div>

          <span className="font-mono text-[11px] font-bold text-neutral-400">
            Step {activeSection} of 5
          </span>
        </div>
      </div>

      {/* Active Sub-Step Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeSection} {...sectionFade}>
          {activeSection === 1 && (
            <ArchetypeStrategySection onContinue={() => advanceSection(1)} />
          )}

          {activeSection === 2 && (
            <SectionHierarchySection onContinue={() => advanceSection(2)} />
          )}

          {activeSection === 3 && (
            <SectionSpecStudio onContinue={() => advanceSection(3)} />
          )}

          {activeSection === 4 && (
            <WireframeSimulatorSection onContinue={() => advanceSection(4)} />
          )}

          {activeSection === 5 && (
            <DeployArchitectureSection onComplete={handleFinish} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

export default PortfolioArchitectureSection;
