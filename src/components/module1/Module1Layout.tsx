import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowLeft, CheckCircle2, Circle, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';
import { SIDEBAR } from '../../lib/design-tokens';
import { useSidebarCollapse } from '../../lib/workspace/useSidebarCollapse';
import { SidebarToggle } from '../workspace/SidebarToggle';

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

  const { mode, isCollapsed, toggle: toggleCollapse } = useSidebarCollapse();

  useEffect(() => {
    // Delay slightly to ensure React has flushed the new step's DOM to the page
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }, 50);
    return () => clearTimeout(timer);
  }, [activeStep]);

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

  const sidebarContent = (
    <div className="flex flex-col h-full relative bg-white border-r border-neutral-200 shadow-[2px_0_12px_rgba(0,0,0,0.02)]">
      {showSidebar && (
        <SidebarToggle mode={mode} onToggle={toggleCollapse} />
      )}

      <div className="pt-6 pb-8 border-b border-neutral-100 flex flex-col whitespace-nowrap overflow-hidden">
        <button
          onClick={onBack}
          className="flex items-center text-neutral-400 hover:text-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0058be] rounded w-full h-8 mb-6"
          aria-label="Back to module overview"
          title={isCollapsed ? "Back to Overview" : undefined}
        >
          <div className="w-[72px] shrink-0 flex items-center justify-center">
            <ArrowLeft size={isCollapsed ? 16 : 14} aria-hidden="true" /> 
          </div>
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[11px] font-bold uppercase tracking-wider overflow-hidden"
              >
                Back to Overview
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden px-6 mb-4"
            >
              <h2 className="text-xl font-bold text-[#0b1c30]">{title}</h2>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative flex items-center w-full min-h-[36px]">
          <AnimatePresence mode="wait" initial={false}>
            {isCollapsed ? (
              <motion.div
                key="ring"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 w-[72px] flex items-center justify-center shrink-0"
              >
                <div className="relative w-9 h-9 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15" stroke="#f1f5f9" strokeWidth="3" fill="transparent" />
                    <circle 
                      cx="18" cy="18" r="15" stroke="#0058be" strokeWidth="3" fill="transparent" 
                      strokeDasharray="94.2"
                      strokeDashoffset={94.2 - (94.2 * progress) / 100}
                    />
                  </svg>
                  <span className="absolute text-[8px] font-black text-[#0b1c30]">{Math.round(progress)}%</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="bar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="w-full pl-[72px] pr-6"
              >
                <div className="w-full h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                  <div 
                    className="h-full bg-[#0058be] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.max(progress, 2)}%` }}
                  />
                </div>
                <p className="text-xs font-bold text-neutral-400 mt-2 text-right">
                  {Math.round(progress) === 100 ? 'Module complete' : `${Math.round(progress)}% complete`}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 flex flex-col w-full">
        <div className="space-y-1 w-full px-3">
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
                title={`Step 0${index + 1}: ${step.label}`}
                className={cn(
                  'group relative flex items-center w-full min-h-[44px] text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058be] overflow-hidden rounded-xl',
                  isCurrent && !isCollapsed ? 'bg-neutral-50/40' : 'hover:bg-neutral-50/70',
                  isLocked && 'opacity-40 cursor-not-allowed',
                )}
              >
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-0.5 bg-[#0058be] transition-opacity",
                  isCurrent && !isCollapsed ? "opacity-100" : "opacity-0"
                )} />

                <div className="w-[48px] shrink-0 flex items-center justify-center relative z-10">
                   <div className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
                      isCollapsed && isCurrent ? "bg-[#0058be] text-white shadow-sm" : 
                      isCollapsed ? "text-neutral-500 group-hover:bg-neutral-50 border border-transparent" : "bg-transparent"
                   )}>
                      {isCollapsed ? (
                         isCompleted ? (
                           <CheckCircle2 size={16} className={isCurrent ? 'text-white' : 'text-[#0058be]'} />
                         ) : (
                           <span className={cn("text-[10px] font-black", isCurrent ? "text-white" : "text-neutral-500")}>
                             0{index + 1}
                           </span>
                         )
                      ) : (
                         isCompleted ? (
                           <CheckCircle2 size={18} className="text-[#0058be]" />
                         ) : isCurrent ? (
                           <Circle size={18} className="text-[#0058be] fill-[#0058be]" />
                         ) : isUpcoming ? (
                           <div className="w-[18px] h-[18px] rounded-full border border-neutral-300 bg-white" />
                         ) : (
                           <Lock size={15} className="text-neutral-300" />
                         )
                      )}
                   </div>
                </div>

                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 min-w-0 pr-4 relative z-10 overflow-hidden whitespace-nowrap"
                    >
                      <p className={cn(
                        'text-[10px] font-bold uppercase tracking-widest mb-0.5 leading-none',
                        isCurrent ? 'text-[#0058be]' : 'text-neutral-400',
                      )}>
                        Step 0{index + 1}
                      </p>
                      <p className={cn(
                        'text-xs truncate',
                        isCurrent
                          ? 'text-[#0b1c30] font-bold'
                          : isLocked
                            ? 'text-neutral-400 font-normal'
                            : 'text-neutral-600 font-semibold',
                      )}>
                        {step.label}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
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
        <motion.div
          initial={false}
          animate={{ width: isCollapsed ? SIDEBAR.WIDTH.collapsed : SIDEBAR.WIDTH.base }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0 fixed inset-y-0 left-0 z-30"
        >
          {sidebarContent}
        </motion.div>
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
                className="absolute top-4 right-4 p-2 rounded-lg text-neutral-400 hover:bg-neutral-100 z-50"
              >
                <X size={18} />
              </button>
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <motion.main 
        initial={false}
        animate={{ 
          marginLeft: showSidebar ? (isCollapsed ? SIDEBAR.WIDTH.collapsed : SIDEBAR.WIDTH.base) : 0 
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 min-w-0"
      >
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
      </motion.main>

    </div>
  );
}
