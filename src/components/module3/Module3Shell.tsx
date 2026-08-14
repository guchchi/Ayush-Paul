import { useState, useEffect, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';
import { ModuleSidebar, type StepItem } from '../workspace/ModuleSidebar';
import { useSidebarCollapse } from '../../lib/workspace/useSidebarCollapse';
import {
  useModule3Store,
  MODULE3_STEPS,
} from '../../lib/module3';
import type { Module3Step } from '../../types/module3';

const STEP_LABELS: Record<Module3Step, string> = {
  authority_position: 'Authority Position',
  proof_asset_builder: 'Proof Asset Builder',
  profile_portfolio: 'Brand & Portfolio Generator',
  authority_pack: 'Authority Operating System',
};

function PhaseContext() {
  const mod1ServiceId = useModule3Store((s) => s.mod1ServiceId);
  const mod1MarketId = useModule3Store((s) => s.mod1MarketId);
  const mod1NicheId = useModule3Store((s) => s.mod1NicheId);
  const mod1Positioning = useModule3Store((s) => s.mod1Positioning);
  const mod2UniqueMechanism = useModule3Store((s) => s.mod2UniqueMechanism);

  if (!mod1ServiceId) {
    return (
      <div className="px-3 py-2 rounded-lg bg-amber-50/80 border border-amber-200 space-y-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-amber-700">Module 1 &amp; 2 Context</p>
        <p className="text-[10px] text-amber-600/70 leading-relaxed">
          Complete Modules 1 and 2 first to pipe your selections here.
        </p>
      </div>
    );
  }

  return (
    <div className="px-3 py-2 rounded-lg bg-[#eff4ff]/60 border border-[#eff4ff]">
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-neutral-400 mb-1.5">Context</p>
      <div className="space-y-1">
        <ContextRow label="Service" value={mod1ServiceId} />
        {mod1MarketId && mod1NicheId && <ContextRow label="Opportunity" value={`${mod1MarketId} / ${mod1NicheId}`} />}
        {mod1Positioning && <ContextRow label="Positioning" value={mod1Positioning} />}
        {mod2UniqueMechanism && <ContextRow label="Mechanism" value={mod2UniqueMechanism} />}
      </div>
    </div>
  );
}

function ContextRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-1.5">
      <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-neutral-400 shrink-0">{label}:</span>
      <span className="text-[10px] text-[#0b1c30]/70 truncate">{value}</span>
    </div>
  );
}

export function Module3Shell({ children, onBack }: { children: ReactNode; onBack?: () => void }) {
  const currentStep = useModule3Store((s) => s.currentStep);
  const completedSteps = useModule3Store((s) => s.completedSteps);
  const jumpToStep = useModule3Store((s) => s.jumpToStep);

  const { isCollapsed } = useSidebarCollapse();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }, 50);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const steps: StepItem[] = MODULE3_STEPS.map((step) => ({
    id: step,
    label: STEP_LABELS[step],
    status: completedSteps.includes(step)
      ? 'completed'
      : step === currentStep
        ? 'current'
        : 'upcoming',
  }));

  const progress = (completedSteps.length / MODULE3_STEPS.length) * 100;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f8f9ff] text-[#0b1c30] selection:bg-[#d1f34d]/50 overflow-x-hidden">
      <ModuleSidebar
        title="Authority System"
        subtitle="Module 3"
        icon={<Shield size={14} className="text-[#0058be]" />}
        progress={progress}
        steps={steps}
        activeStep={currentStep}
        onStepChange={jumpToStep as (id: string) => void}
        onBack={onBack}
      >
        <PhaseContext />
      </ModuleSidebar>

      <motion.main
        initial={false}
        animate={{ marginLeft: isDesktop ? (isCollapsed ? 68 : 280) : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 min-w-0"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
          >
            {children}
          </motion.div>
          <div className="h-32" />
        </div>
      </motion.main>
    </div>
  );
}
