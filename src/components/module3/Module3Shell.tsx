import { useState, useEffect, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';
import { ModuleSidebar, type StepItem } from '../workspace/ModuleSidebar';
import {
  useModule3Store,
  MODULE3_STEPS,
} from '../../lib/module3';
import type { Module3Step } from '../../types/module3';

const STEP_LABELS: Record<Module3Step, string> = {
  authority_position: 'Authority Position',
  proof_asset_builder: 'Proof Asset Builder',
  profile_portfolio: 'Profile & Portfolio',
  authority_pack: 'Authority Pack',
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

  const activeIndex = MODULE3_STEPS.indexOf(currentStep);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar_collapsed') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const handleToggle = () => {
      setSidebarCollapsed(localStorage.getItem('sidebar_collapsed') === 'true');
    };
    window.addEventListener('sidebar-toggle', handleToggle);
    return () => window.removeEventListener('sidebar-toggle', handleToggle);
  }, []);

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
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f8f9ff] text-[#0b1c30] selection:bg-[#d1f34d]/50">
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

      <main className={cn(
        'flex-1 min-w-0 transition-all duration-300',
        sidebarCollapsed ? 'lg:ml-[68px]' : 'lg:ml-[280px]',
      )}>
        <div className="max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-5 sm:px-8 py-6 sm:py-10 lg:py-16">
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
      </main>
    </div>
  );
}
