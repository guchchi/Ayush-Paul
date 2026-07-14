import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Check, ChevronLeft, ChevronRight, Sun, Moon, Package } from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';
import {
  useDeliverySystemStore,
  DELIVERY_SYSTEM_STEPS,
} from '../../lib/delivery-system';
import type { DeliverySystemStep } from '../../types/delivery-system';

const SIDEBAR_WIDTH = 240;

const STEP_LABELS: Record<DeliverySystemStep, string> = {
  project_intake: 'Project Intake',
  scope_success: 'Scope & Success',
  delivery_plan: 'Delivery Plan',
  execution_workspace: 'Execution',
  communication_updates: 'Communication',
  feedback_revision: 'Feedback & Revisions',
  handoff_closeout: 'Handoff & Closeout',
};

function StepDot({ status }: { status: 'completed' | 'active' | 'upcoming' }) {
  if (status === 'completed') {
    return (
      <span className="relative flex items-center justify-center w-5 h-5 shrink-0">
        <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: '2s' }} />
        <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/40">
          <Check size={10} className="text-emerald-400" strokeWidth={3} />
        </span>
      </span>
    );
  }
  if (status === 'active') {
    return (
      <span className="relative flex items-center justify-center w-5 h-5 shrink-0">
        <span className="absolute inset-0 rounded-full bg-brand-primary/30 animate-ping" style={{ animationDuration: '2.5s' }} />
        <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-brand-primary/15 border border-brand-primary/60 ring-2 ring-brand-primary/20">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
        </span>
      </span>
    );
  }
  return (
    <span className="flex items-center justify-center w-5 h-5 shrink-0">
      <span className="w-5 h-5 rounded-full bg-white/[0.03] border border-white/[0.08]" />
    </span>
  );
}

function PhaseContext() {
  const upstream = useDeliverySystemStore((s) => s.upstream);

  if (!upstream) {
    return (
      <div className="px-4 py-3 mx-3 mt-2 rounded-lg bg-amber-400/5 border border-amber-400/15 space-y-1">
        <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-amber-500">Upstream Context</p>
        <p className="text-[9px] text-amber-400/60 leading-relaxed">
          Complete Modules 1–6 first to pipe your selections here.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 mx-3 mt-2 rounded-lg bg-white/[0.02] border border-white/5">
      <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-2">Service &amp; Offer</p>
      <div className="space-y-1.5">
        <ContextRow label="Service" value={upstream.serviceLabel || upstream.serviceId || '—'} />
        {upstream.marketLabel && upstream.nicheLabel && (
          <ContextRow label="Opportunity" value={`${upstream.marketLabel} / ${upstream.nicheLabel}`} />
        )}
        <ContextRow label="Offer" value={upstream.offerName || upstream.offerType || '—'} />
        <ContextRow label="Mechanism" value={upstream.uniqueMechanism || '—'} />
        {upstream.authorityPosition && (
          <ContextRow label="Authority" value={upstream.authorityPosition} />
        )}
        {upstream.positioning && (
          <ContextRow label="Positioning" value={upstream.positioning} />
        )}
      </div>
    </div>
  );
}

function ContextRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">{label}</p>
      <p className="text-[10px] text-white/70 truncate">{value}</p>
    </div>
  );
}

function DesktopSidebar({
  completedSteps,
  currentStep,
  onStepSelect,
}: {
  completedSteps: DeliverySystemStep[];
  currentStep: DeliverySystemStep;
  onStepSelect: (id: DeliverySystemStep) => void;
}) {
  const completedCount = completedSteps.length;
  const totalSteps = DELIVERY_SYSTEM_STEPS.length;
  const progress = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

  return (
    <aside
      className="hidden lg:flex flex-col shrink-0 border-r border-white/5 bg-black"
      style={{ width: SIDEBAR_WIDTH }}
    >
      <div className="flex items-center gap-2.5 px-4 h-12 border-b border-white/5 shrink-0">
        <span className="flex items-center justify-center w-5 h-5 rounded-md bg-brand-primary/15 border border-brand-primary/30">
          <Package size={10} className="text-brand-primary" />
        </span>
        <div>
          <span className="text-[10px] font-bold text-white/80 tracking-tight">Delivery System</span>
          <p className="text-[7px] text-zinc-500 uppercase tracking-[0.15em]">Phase 7</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar py-2 px-2.5">
        <div className="relative">
          <div className="absolute left-[20px] top-2 bottom-2 w-px bg-white/5" />
          <div className="space-y-[2px]">
            {DELIVERY_SYSTEM_STEPS.map((step) => {
              const isActive = step === currentStep;
              const isCompleted = completedSteps.includes(step);
              const status = isCompleted ? 'completed' : isActive ? 'active' : 'upcoming';
              return (
                <button
                  key={step}
                  onClick={() => onStepSelect(step)}
                  className={cn(
                    'relative flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-left transition-all duration-200 cursor-pointer group',
                    isActive ? 'bg-white/5' : 'hover:bg-white/[0.03]',
                  )}
                >
                  <StepDot status={status} />
                  <span className={cn(
                    'text-[11px] font-medium transition-colors duration-200 truncate',
                    isActive && 'text-white/95',
                    isCompleted && 'text-zinc-400',
                    !isActive && !isCompleted && 'text-zinc-500 group-hover:text-zinc-400',
                  )}>
                    {STEP_LABELS[step]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <PhaseContext />

      <div className="px-4 py-3 border-t border-white/5 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-zinc-500">Progress</span>
          <span className="text-[9px] font-semibold tabular-nums text-zinc-400">{completedCount}/{totalSteps}</span>
        </div>
        <div className="w-full h-[2px] rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-brand-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: EASING.PREMIUM }}
          />
        </div>
      </div>
    </aside>
  );
}

function MobileSidebar({
  completedSteps,
  currentStep,
  onStepSelect,
  onClose,
}: {
  completedSteps: DeliverySystemStep[];
  currentStep: DeliverySystemStep;
  onStepSelect: (id: DeliverySystemStep) => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-black">
      <div className="flex items-center justify-between px-5 h-14 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
            <Package size={12} className="text-white/70" />
          </span>
          <span className="text-xs font-semibold text-white/70 tracking-tight">Delivery System</span>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer">
          <X size={14} className="text-zinc-400" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar py-3 px-3">
        <div className="relative">
          <div className="absolute left-[22px] top-3 bottom-3 w-px bg-white/5" />
          <div className="space-y-0.5">
            {DELIVERY_SYSTEM_STEPS.map((step) => {
              const isActive = step === currentStep;
              const isCompleted = completedSteps.includes(step);
              const status = isCompleted ? 'completed' : isActive ? 'active' : 'upcoming';
              return (
                <button
                  key={step}
                  onClick={() => { onStepSelect(step); onClose(); }}
                  className={cn(
                    'relative flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left transition-all duration-200 cursor-pointer',
                    isActive && 'bg-white/5',
                  )}
                >
                  <StepDot status={status} />
                  <span className={cn(
                    'text-xs font-medium transition-colors duration-200 truncate',
                    isActive && 'text-white/95',
                    isCompleted && 'text-zinc-400',
                    !isActive && !isCompleted && 'text-zinc-500',
                  )}>
                    {STEP_LABELS[step]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <PhaseContext />

      <div className="px-5 py-4 border-t border-white/5 shrink-0">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">Progress</span>
          <span className="text-[10px] font-semibold text-zinc-400">{completedSteps.length}/{DELIVERY_SYSTEM_STEPS.length}</span>
        </div>
        <div className="w-full h-[3px] rounded-full bg-white/5 overflow-hidden">
          <div className="h-full rounded-full bg-brand-primary transition-all duration-700 ease-out"
            style={{ width: `${(completedSteps.length / DELIVERY_SYSTEM_STEPS.length) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

export function DeliverySystemShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ds-theme');
    if (stored === 'light') {
      document.documentElement.classList.add('light');
      setIsLight(true);
    } else if (stored === 'dark') {
      document.documentElement.classList.remove('light');
      setIsLight(false);
    } else {
      const init = document.documentElement.classList.contains('light');
      setIsLight(init);
    }
  }, []);

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    if (next) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('ds-theme', next ? 'light' : 'dark');
  };

  const currentStep = useDeliverySystemStore((s) => s.currentStep);
  const completedSteps = useDeliverySystemStore((s) => s.completedSteps);
  const jumpToStep = useDeliverySystemStore((s) => s.jumpToStep);

  const activeIndex = DELIVERY_SYSTEM_STEPS.indexOf(currentStep);
  const completedCount = completedSteps.length;
  const totalSteps = DELIVERY_SYSTEM_STEPS.length;
  const progress = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

  const prevStep = activeIndex > 0 ? DELIVERY_SYSTEM_STEPS[activeIndex - 1] : null;
  const nextStep = activeIndex < DELIVERY_SYSTEM_STEPS.length - 1 ? DELIVERY_SYSTEM_STEPS[activeIndex + 1] : null;

  return (
    <div className="flex min-h-screen bg-black text-white selection:bg-white/10">
      <DesktopSidebar
        completedSteps={completedSteps}
        currentStep={currentStep}
        onStepSelect={jumpToStep}
      />

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.FAST }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="mobile-sidebar"
            initial={{ x: -SIDEBAR_WIDTH }}
            animate={{ x: 0 }}
            exit={{ x: -SIDEBAR_WIDTH }}
            transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
            className="fixed inset-y-0 left-0 z-50 shadow-2xl"
            style={{ width: SIDEBAR_WIDTH }}
          >
            <MobileSidebar
              completedSteps={completedSteps}
              currentStep={currentStep}
              onStepSelect={jumpToStep}
              onClose={() => setSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col flex-1 min-w-0">
        <header className="sticky top-0 z-30 flex items-center h-12 border-b border-white/5 bg-black/80 backdrop-blur-2xl px-4 gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-7 h-7 rounded-md bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all duration-200 cursor-pointer shrink-0"
          >
            <Menu size={13} className="text-zinc-400" />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            {prevStep && (
              <button
                onClick={() => jumpToStep(prevStep)}
                className="hidden sm:flex w-6 h-6 rounded items-center justify-center hover:bg-white/5 transition-all duration-200 cursor-pointer shrink-0"
              >
                <ChevronLeft size={12} className="text-zinc-400" />
              </button>
            )}

            <span className="flex items-center justify-center w-5 h-5 rounded bg-white/10 border border-white/10 text-[9px] font-bold text-white/70 shrink-0 tabular-nums">
              {activeIndex + 1}
            </span>

            <span className="text-sm font-semibold text-white/90 truncate tracking-tight">
              {STEP_LABELS[currentStep]}
            </span>

            {nextStep && (
              <button
                onClick={() => jumpToStep(nextStep)}
                className="hidden sm:flex w-6 h-6 rounded items-center justify-center hover:bg-white/5 transition-all duration-200 cursor-pointer shrink-0"
              >
                <ChevronRight size={12} className="text-zinc-400" />
              </button>
            )}
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.92 }}
              className="flex items-center justify-center w-7 h-7 rounded-md bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer shrink-0"
              title={isLight ? 'Switch to dark' : 'Switch to light'}
            >
              {isLight ? <Moon size={12} className="text-zinc-400" /> : <Sun size={12} className="text-zinc-400" />}
            </motion.button>

            <span className="hidden sm:inline text-[8px] font-bold uppercase tracking-[0.15em] text-zinc-500">
              Step {activeIndex + 1} / {totalSteps}
            </span>
            <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-md bg-white/5 border border-white/5">
              <div className="w-12 h-[2px] rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-white/70"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: EASING.PREMIUM }}
                />
              </div>
              <span className="text-[8px] font-bold text-zinc-400 tabular-nums">{Math.round(progress)}%</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="mx-auto w-full max-w-3xl px-5 sm:px-10 py-8 lg:py-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 12, filter: 'blur(3px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(3px)' }}
                transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
            <div className="h-16" />
          </div>
        </main>
      </div>
    </div>
  );
}
