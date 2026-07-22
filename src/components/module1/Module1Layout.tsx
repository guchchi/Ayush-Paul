import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowLeft, CheckCircle2, Circle, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';

export interface StepItem {
  id: string;
  label: string;
  status: 'completed' | 'current' | 'upcoming' | 'locked';
}

interface Module1LayoutProps {
  title: string;
  progress: number;
  steps: StepItem[];
  activeStep: string;
  onStepChange: (id: string) => void;
  onBack?: () => void;
  children: ReactNode;
}

export function Module1Layout({
  title,
  progress,
  steps,
  activeStep,
  onStepChange,
  onBack,
  children,
}: Module1LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      if (w < 1024) setViewport('mobile');
      else setViewport('desktop');
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const showSidebar = viewport === 'desktop';

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-neutral-200 shadow-[2px_0_12px_rgba(0,0,0,0.02)]">
      <div className="p-6 pb-8 border-b border-neutral-100">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400 hover:text-neutral-700 transition-colors mb-6 focus:outline-none focus:ring-2 focus:ring-[#0058be] rounded"
          aria-label="Back to module overview"
        >
          <ArrowLeft size={14} aria-hidden="true" /> Back to Overview
        </button>
        <h2 className="text-xl font-bold text-[#0b1c30] mb-4">{title}</h2>
        <div className="w-full h-1.5 rounded-full bg-neutral-100 overflow-hidden">
          <div 
            className="h-full bg-[#0058be] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(progress, 2)}%` }}
          />
        </div>
        <p className="text-xs font-bold text-neutral-400 mt-2 text-right font-semibold">
          {Math.round(progress) === 100 ? 'Module complete' : `${Math.round(progress)}% complete`}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <div className="space-y-1">
          {steps.map((step, index) => {
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';
            const isUpcoming = step.status === 'upcoming';
            const isLocked = step.status === 'locked';

            return (
              <button
                key={step.id}
                disabled={isLocked}
                onClick={() => onStepChange(step.id)}
                aria-current={isCurrent ? 'step' : undefined}
                aria-disabled={isLocked}
                className={cn(
                  "w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058be]",
                  isCurrent 
                    ? "text-[#0b1c30] border-l-2 border-[#0058be] -ml-4 pl-[14px] rounded-l-none bg-neutral-50/40" 
                    : "text-neutral-600 hover:bg-neutral-50/70 border-l-2 border-transparent",
                  isLocked && "opacity-40 cursor-not-allowed"
                )}
              >
                <div className="shrink-0" aria-hidden="true">
                  {isCompleted ? (
                    <CheckCircle2 size={18} className="text-[#0058be]" />
                  ) : isCurrent ? (
                    <Circle size={18} className="text-[#0058be] fill-[#0058be]" />
                  ) : isUpcoming ? (
                    <div className="w-[18px] h-[18px] rounded-full border border-neutral-300 bg-white" />
                  ) : (
                    <Lock size={15} className="text-neutral-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-[10px] font-bold uppercase tracking-widest mb-0.5 leading-none",
                    isCurrent ? "text-[#0058be]" : "text-neutral-400"
                  )}>
                    Step 0{index + 1}
                  </p>
                  <p className={cn(
                    "text-xs truncate",
                    isCurrent ? "text-[#0b1c30] font-bold" : (isLocked ? "text-neutral-400 font-normal" : "text-neutral-600 font-semibold")
                  )}>
                    {step.label}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f8f9ff] text-[#0b1c30] selection:bg-[#d1f34d]/50">
      
      {/* Mobile Header / Progress */}
      {!showSidebar && (
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-neutral-500 hover:text-neutral-800">
            <Menu size={20} />
          </button>
          <div className="flex-1 mx-4">
            <div className="w-full h-1.5 rounded-full bg-neutral-100 overflow-hidden">
              <div 
                className="h-full bg-[#0058be] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.max(progress, 2)}%` }}
              />
            </div>
          </div>
          <span className="text-xs font-bold text-[#0b1c30] shrink-0">
            {Math.round(progress) === 100 ? 'Module complete' : `${Math.round(progress)}% complete`}
          </span>
        </div>
      )}

      {/* Desktop Sidebar */}
      {showSidebar && (
        <div className="shrink-0 w-[280px] xl:w-[320px] fixed inset-y-0 left-0 z-30">
          <SidebarContent />
        </div>
      )}

      {/* Mobile Drawer */}
      <AnimatePresence>
        {sidebarOpen && !showSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#0b1c30]/40 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-2xl"
            >
              <button 
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg text-neutral-400 hover:bg-neutral-100"
              >
                <X size={18} />
              </button>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 min-w-0 transition-all",
        showSidebar && "ml-[280px] xl:ml-[320px]"
      )}>
        <div className="max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-5 sm:px-8 py-6 sm:py-10 lg:py-16">
          <motion.div
            key={activeStep}
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
