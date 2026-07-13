import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Check, ChevronLeft, ChevronRight, Shield, Circle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';
import {
  useModule3Store,
  MODULE3_STEPS,
} from '../../lib/module3';
import type { Module3Step } from '../../types/module3';

const SIDEBAR_WIDTH = 280;

const STEP_LABELS: Record<Module3Step, string> = {
  authority_position: 'Authority Position',
  proof_strategy: 'Proof Strategy',
  proof_asset_builder: 'Proof Asset Builder',
  profile_portfolio: 'Profile & Portfolio',
  authority_pack: 'Authority Pack',
};

function StepDot({ status }: { status: 'completed' | 'active' | 'upcoming' }) {
  if (status === 'completed') {
    return <CheckCircle2 size={16} className="text-[#0058be] shrink-0" />;
  }
  if (status === 'active') {
    return <Circle size={16} className="text-[#0058be] fill-[#0058be]/10 shrink-0" />;
  }
  return <div className="w-4 h-4 rounded-full border-2 border-neutral-200 shrink-0" />;
}

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

function DesktopSidebar({
  completedSteps,
  currentStep,
  onStepSelect,
  onBack,
}: {
  completedSteps: Module3Step[];
  currentStep: Module3Step;
  onStepSelect: (id: Module3Step) => void;
  onBack?: () => void;
}) {
  const completedCount = completedSteps.length;
  const totalSteps = MODULE3_STEPS.length;

  return (
    <aside
      className="hidden lg:flex flex-col shrink-0 border-r border-neutral-200 bg-white"
      style={{ width: SIDEBAR_WIDTH }}
    >
      <div className="p-5 pb-4 border-b border-neutral-100 shrink-0">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#0058be]/10 border border-[#0058be]/20">
            <Shield size={12} className="text-[#0058be]" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-[#0b1c30]">Authority System</h2>
            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.12em]">Module 3</p>
          </div>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
            aria-label="Back to overview"
          >
            <ArrowLeft size={12} aria-hidden="true" />
            Back to Overview
          </button>
        )}
      </div>

      <div className="px-5 pt-4 pb-2 shrink-0">
        <div className="w-full h-1.5 rounded-full bg-neutral-100 overflow-hidden">
          <div
            className="h-full bg-[#0058be] rounded-full transition-all duration-500"
            style={{ width: `${Math.max((completedCount / totalSteps) * 100, 2)}%` }}
          />
        </div>
        <p className="text-[10px] font-bold text-neutral-400 mt-1.5 text-right">{Math.round((completedCount / totalSteps) * 100)}% Complete</p>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar py-3 px-3 space-y-0.5" aria-label="Module steps">
        {MODULE3_STEPS.map((step, index) => {
          const isActive = step === currentStep;
          const isCompleted = completedSteps.includes(step);
          const status = isCompleted ? 'completed' : isActive ? 'active' : 'upcoming';

          return (
            <button
              key={step}
              onClick={() => onStepSelect(step)}
              aria-current={isActive ? 'step' : undefined}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058be] cursor-pointer',
                isActive ? 'bg-[#f8f9ff] text-[#0058be]' : 'hover:bg-neutral-50 text-neutral-600',
              )}
            >
              <StepDot status={status} />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">
                  Step 0{index + 1}
                </p>
                <p className={cn(
                  'text-xs font-semibold truncate',
                  isActive ? 'text-[#0b1c30]' : 'text-neutral-600',
                )}>
                  {STEP_LABELS[step]}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-3 shrink-0">
        <PhaseContext />
      </div>
    </aside>
  );
}

function MobileSidebar({
  completedSteps,
  currentStep,
  onStepSelect,
  onClose,
  onBack,
}: {
  completedSteps: Module3Step[];
  currentStep: Module3Step;
  onStepSelect: (id: Module3Step) => void;
  onClose: () => void;
  onBack?: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-5 h-14 border-b border-neutral-100 shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-lg bg-[#0058be]/10 border border-[#0058be]/20 flex items-center justify-center">
            <Shield size={12} className="text-[#0058be]" />
          </span>
          <span className="text-xs font-semibold text-[#0b1c30] tracking-tight">Authority System</span>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-neutral-100 transition-colors cursor-pointer">
          <X size={14} className="text-neutral-400" />
        </button>
      </div>

      {onBack && (
        <div className="px-3 pt-3">
          <button
            onClick={() => { onBack(); onClose(); }}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
            aria-label="Back to overview"
          >
            <ArrowLeft size={12} aria-hidden="true" />
            Back to Overview
          </button>
        </div>
      )}

      <div className="px-5 pt-3 pb-1">
        <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0058be] rounded-full transition-all duration-500"
            style={{ width: `${Math.max((completedSteps.length / MODULE3_STEPS.length) * 100, 2)}%` }}
          />
        </div>
        <p className="text-[9px] font-bold text-neutral-400 mt-1 text-right">{completedSteps.length} / {MODULE3_STEPS.length} steps</p>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar py-2 px-3 space-y-0.5" aria-label="Module steps">
        {MODULE3_STEPS.map((step, index) => {
          const isActive = step === currentStep;
          const isCompleted = completedSteps.includes(step);
          const status = isCompleted ? 'completed' : isActive ? 'active' : 'upcoming';

          return (
            <button
              key={step}
              onClick={() => { onStepSelect(step); onClose(); }}
              aria-current={isActive ? 'step' : undefined}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058be] cursor-pointer',
                isActive ? 'bg-[#f8f9ff]' : 'hover:bg-neutral-50',
              )}
            >
              <StepDot status={status} />
              <div className="flex-1 min-w-0">
                <span className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Step 0{index + 1}</span>
                <span className={cn(
                  'text-xs font-medium truncate',
                  isActive ? 'text-[#0b1c30]' : 'text-neutral-500',
                )}>
                  {STEP_LABELS[step]}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-3">
        <PhaseContext />
      </div>
    </div>
  );
}

export function Module3Shell({ children, onBack }: { children: ReactNode; onBack?: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentStep = useModule3Store((s) => s.currentStep);
  const completedSteps = useModule3Store((s) => s.completedSteps);
  const jumpToStep = useModule3Store((s) => s.jumpToStep);

  const activeIndex = MODULE3_STEPS.indexOf(currentStep);

  const prevStep = activeIndex > 0 ? MODULE3_STEPS[activeIndex - 1] : null;
  const nextStep = activeIndex < MODULE3_STEPS.length - 1 ? MODULE3_STEPS[activeIndex + 1] : null;

  return (
    <div className="flex h-dvh bg-[#f8f9ff] text-[#0b1c30] overflow-hidden font-sans">
      <DesktopSidebar
        completedSteps={completedSteps}
        currentStep={currentStep}
        onStepSelect={jumpToStep}
        onBack={onBack}
      />

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -SIDEBAR_WIDTH }}
              animate={{ x: 0 }}
              exit={{ x: -SIDEBAR_WIDTH }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-y-0 left-0 z-50 border-r border-neutral-200 bg-white"
              style={{ width: SIDEBAR_WIDTH }}
            >
              <MobileSidebar
                completedSteps={completedSteps}
                currentStep={currentStep}
                onStepSelect={jumpToStep}
                onClose={() => setSidebarOpen(false)}
                onBack={onBack}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-col flex-1 min-w-0 bg-[#f8f9ff] overflow-hidden">
        <header className="sticky top-0 z-30 flex items-center justify-between h-12 border-b border-neutral-200 bg-white/85 backdrop-blur-md px-4 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded hover:bg-neutral-100 text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058be] cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu size={14} />
            </button>
            <span className="text-xs font-semibold text-[#0b1c30] truncate select-none">
              Step {activeIndex + 1} of {MODULE3_STEPS.length}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {prevStep && (
              <button
                onClick={() => jumpToStep(prevStep)}
                className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058be] cursor-pointer"
                aria-label={`Go to previous step: ${STEP_LABELS[prevStep]}`}
              >
                <ChevronLeft size={14} />
              </button>
            )}
            <span className="hidden sm:inline text-[11px] font-medium text-neutral-600 truncate max-w-[200px]">
              {STEP_LABELS[currentStep]}
            </span>
            {nextStep && (
              <button
                onClick={() => jumpToStep(nextStep)}
                className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058be] cursor-pointer"
                aria-label={`Go to next step: ${STEP_LABELS[nextStep]}`}
              >
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="mx-auto w-full px-5 sm:px-8 py-8 md:py-12 max-w-[720px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
