import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowLeft, CheckCircle2, Circle, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SIDEBAR } from '../../lib/design-tokens';
import { useSidebarCollapse } from '../../lib/workspace/useSidebarCollapse';
import { SidebarToggle } from './SidebarToggle';

export interface StepItem {
  id: string;
  label: string;
  status: 'completed' | 'current' | 'upcoming' | 'locked';
}

interface ModuleSidebarProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  progress: number;
  steps: StepItem[];
  activeStep: string;
  onStepChange: (id: string) => void;
  onBack?: () => void;
  children?: React.ReactNode;
}

export function ModuleSidebar({
  title,
  subtitle,
  icon,
  progress,
  steps,
  activeStep,
  onStepChange,
  onBack,
  children,
}: ModuleSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewport, setViewport] = useState<'mobile' | 'desktop'>('desktop');
  
  const { mode, isCollapsed, toggle: toggleCollapse } = useSidebarCollapse();

  useEffect(() => {
    const check = () => {
      setViewport(window.innerWidth < 1024 ? 'mobile' : 'desktop');
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const showSidebar = viewport === 'desktop';

  const SidebarContent = () => {
    return (
      <div className={cn('flex flex-col h-full relative', SIDEBAR.BG, SIDEBAR.BORDER, SIDEBAR.SHADOW)}>
        {showSidebar && (
          <SidebarToggle mode={mode} onToggle={toggleCollapse} />
        )}

        {/* Header Section */}
        <div className={cn("px-6 pt-6 pb-8 border-b border-neutral-100 flex flex-col transition-all overflow-hidden whitespace-nowrap", isCollapsed ? "items-center px-2" : "")}>
          {onBack && (
            <button
              onClick={onBack}
              className={cn(
                "flex items-center text-neutral-400 hover:text-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0058be] rounded",
                isCollapsed ? "justify-center w-8 h-8 hover:bg-neutral-50 mb-6" : "gap-2 text-[11px] font-bold uppercase tracking-wider mb-6"
              )}
              aria-label="Back to module overview"
              title={isCollapsed ? "Back to Overview" : undefined}
            >
              <ArrowLeft size={isCollapsed ? 16 : 14} aria-hidden="true" /> 
              {!isCollapsed && "Back to Overview"}
            </button>
          )}

          <div className={cn("flex items-center gap-2.5 mb-4", isCollapsed && "justify-center")}>
            {icon && (
              <span className={cn("flex items-center justify-center rounded-lg bg-[#0058be]/10 border border-[#0058be]/20 shrink-0", isCollapsed ? "w-9 h-9 rounded-xl" : "w-8 h-8")}>
                {icon}
              </span>
            )}
            
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <h2 className="text-xl font-bold text-[#0b1c30]">{title}</h2>
                  {subtitle && (
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em]">{subtitle}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Progress Indicator */}
          {isCollapsed ? (
            <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
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
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
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
        </div>

        {/* Steps Section */}
        <div className={cn("flex-1 overflow-y-auto py-6", isCollapsed ? "px-2 flex flex-col items-center gap-3" : "px-4")}>
          <div className={cn("space-y-1 w-full", isCollapsed && "flex flex-col items-center gap-3 space-y-0")}>
            {steps.map((step, index) => {
              const isCompleted = step.status === 'completed';
              const isCurrent = step.status === 'current';
              const isUpcoming = step.status === 'upcoming';
              const isLocked = step.status === 'locked';

              if (isCollapsed) {
                return (
                  <button
                    key={step.id}
                    disabled={isLocked}
                    onClick={() => onStepChange(step.id)}
                    title={`Step 0${index + 1}: ${step.label}`}
                    className={cn(
                      'w-9 h-9 rounded-xl flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058be] shrink-0',
                      isCurrent
                        ? 'bg-[#0058be] text-white shadow-sm'
                        : 'text-neutral-500 hover:bg-neutral-50 border border-transparent',
                      isLocked && 'opacity-40 cursor-not-allowed'
                    )}
                  >
                    <div aria-hidden="true">
                      {isCompleted ? (
                        <CheckCircle2 size={16} className={isCurrent ? 'text-white' : 'text-[#0058be]'} />
                      ) : (
                        <span className={cn("text-[10px] font-black", isCurrent ? "text-white" : "text-neutral-500")}>
                          0{index + 1}
                        </span>
                      )}
                    </div>
                  </button>
                );
              }

              return (
                <button
                  key={step.id}
                  disabled={isLocked}
                  onClick={() => onStepChange(step.id)}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-disabled={isLocked}
                  className={cn(
                    'w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058be]',
                    isCurrent
                      ? 'text-[#0b1c30] border-l-2 border-[#0058be] -ml-4 pl-[14px] rounded-l-none bg-neutral-50/40'
                      : 'text-neutral-600 hover:bg-neutral-50/70 border-l-2 border-transparent',
                    isLocked && 'opacity-40 cursor-not-allowed',
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
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Children (usually contextual content like summary). Only render if expanded, or handle it via CSS */}
        {!isCollapsed && children && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 pb-4 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      {!showSidebar && (
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-neutral-500 hover:text-neutral-800"
            aria-label="Open navigation menu"
          >
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
          <SidebarContent />
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
              className="fixed inset-y-0 left-0 z-50 bg-white shadow-2xl"
              style={{ width: SIDEBAR.WIDTH.base }}
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg text-neutral-400 hover:bg-neutral-100 z-50"
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
