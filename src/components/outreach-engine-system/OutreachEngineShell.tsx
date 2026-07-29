import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useOutreachEngineStore, OUTREACH_ENGINE_STEPS } from '../../lib/outreach-engine-system';
import type { OutreachEngineStep } from '../../types/outreach-engine-system';
import { cn } from '../../lib/utils';
import { useSidebarCollapse } from '../../lib/workspace/useSidebarCollapse';
import { SidebarToggle } from '../workspace/SidebarToggle';
import { SIDEBAR } from '../../lib/design-tokens';

const STEP_LABELS: Record<OutreachEngineStep, string> = {
  outreach_goal: 'Outreach Goal',
  prospect_context: 'Prospect Context',
  personalization_angle: 'Personalization Angle',
  message_builder: 'Message Builder',
  follow_up_builder: 'Follow-Up Builder',
  objection_safe_replies: 'Objection-Safe Replies',
  outreach_tracker: 'Outreach Tracker',
  outreach_report: 'Outreach Report',
};

export function OutreachEngineShell({ children }: { children: React.ReactNode }) {
  const currentStep = useOutreachEngineStore((s) => s.currentStep);
  const completedSteps = useOutreachEngineStore((s) => s.completedSteps);
  const jumpToStep = useOutreachEngineStore((s) => s.jumpToStep);
  const previousStep = useOutreachEngineStore((s) => s.previousStep);
  const nextStep = useOutreachEngineStore((s) => s.nextStep);

  const niche = useOutreachEngineStore((s) => s.phase5Niche) ?? '';
  const serviceLabel = useOutreachEngineStore((s) => s.phase5ServiceLabel) ?? '';
  const positioning = useOutreachEngineStore((s) => s.phase5Positioning) ?? '';
  const offerName = useOutreachEngineStore((s) => s.phase5OfferName) ?? '';

  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try { return (localStorage.getItem('m6-theme') as 'dark' | 'light') || 'dark'; }
    catch { return 'dark'; }
  });

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('m6-theme', next); } catch { /* ignore */ }
  };

  const currentIdx = OUTREACH_ENGINE_STEPS.indexOf(currentStep);

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-zinc-900'}`}>
      <DesktopSidebar
        currentStep={currentStep}
        completedSteps={completedSteps}
        jumpToStep={jumpToStep}
        niche={niche}
        serviceLabel={serviceLabel}
        positioning={positioning}
        offerName={offerName}
        theme={theme}
      />

      <AnimatePresence>
        {mobileSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setMobileSidebar(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className={`absolute left-0 top-0 bottom-0 w-64 border-r p-6 overflow-y-auto ${theme === 'dark' ? 'bg-black border-white/5' : 'bg-white border-zinc-200'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <p className={`text-[10px] font-bold uppercase tracking-[0.15em] ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Outreach Engine</p>
                <StepNav currentStep={currentStep} completedSteps={completedSteps} jumpToStep={jumpToStep} theme={theme} isCollapsed={false} />
                <PhaseContextMini niche={niche} serviceLabel={serviceLabel} positioning={positioning} offerName={offerName} theme={theme} isCollapsed={false} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header className={`flex items-center justify-between px-5 sm:px-10 h-14 border-b ${theme === 'dark' ? 'border-white/5' : 'border-zinc-200'}`}>
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileSidebar(true)} className={`lg:hidden p-1.5 rounded-lg ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-zinc-100'}`}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
            <span className={`text-[9px] font-bold uppercase tracking-[0.15em] ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Step {currentIdx + 1} of {OUTREACH_ENGINE_STEPS.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className={`hidden sm:flex items-center gap-1 px-2 h-6 rounded ${theme === 'dark' ? 'bg-white/[0.03]' : 'bg-zinc-100'}`}>
              <div className={`w-16 h-1 rounded-full ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                <div className="h-full rounded-full bg-brand-primary" style={{ width: `${((currentIdx + 1) / OUTREACH_ENGINE_STEPS.length) * 100}%` }} />
              </div>
              <span className={`text-[8px] font-bold ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>{Math.round(((currentIdx + 1) / OUTREACH_ENGINE_STEPS.length) * 100)}%</span>
            </div>

            <button onClick={toggleTheme} className={`p-1.5 rounded-lg ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-zinc-100'}`}>
              {theme === 'dark' ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="3" stroke="#a1a1aa" strokeWidth="1.2"/><path d="M7 0v2M7 12v2M0 7h2M12 7h2M2 2l1.5 1.5M10.5 10.5L12 12M2 12l1.5-1.5M10.5 3.5L12 2" stroke="#a1a1aa" strokeWidth="1.2"/></svg> : <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M13 8.5A6.5 6.5 0 015.5 1a6.5 6.5 0 107.5 7.5z" fill="#71717a"/></svg>}
            </button>

            <div className="flex items-center gap-1">
              <button onClick={previousStep} disabled={currentIdx === 0} className={`p-1.5 rounded-lg disabled:opacity-30 ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-zinc-100'}`}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7 2L3 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
              <button onClick={nextStep} disabled={currentIdx === OUTREACH_ENGINE_STEPS.length - 1} className={`p-1.5 rounded-lg disabled:opacity-30 ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-zinc-100'}`}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="mx-auto w-full max-w-3xl lg:max-w-5xl xl:max-w-7xl px-5 sm:px-10 py-8 lg:py-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 12, filter: 'blur(3px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(3px)' }}
                transition={{ duration: 0.25 }}
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

function DesktopSidebar({ currentStep, completedSteps, jumpToStep, niche, serviceLabel, positioning, offerName, theme }: {
  currentStep: OutreachEngineStep;
  completedSteps: OutreachEngineStep[];
  jumpToStep: (s: OutreachEngineStep) => void;
  niche: string;
  serviceLabel: string;
  positioning: string;
  offerName: string;
  theme: string;
}) {
  const { mode, isCollapsed, toggle } = useSidebarCollapse();

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? SIDEBAR.WIDTH.collapsed : SIDEBAR.WIDTH.base }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={`relative hidden lg:flex flex-col shrink-0 border-r ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-zinc-200 bg-zinc-50'}`}
    >
      <SidebarToggle 
        mode={mode} 
        onToggle={toggle} 
        className={cn(
          theme === 'dark' 
            ? "bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:border-white/20" 
            : "bg-white border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300"
        )} 
      />
      <div className={cn("p-6 border-b border-inherit overflow-hidden whitespace-nowrap", isCollapsed && "px-2 flex flex-col items-center justify-center py-4")}>
        {isCollapsed ? (
          <span className={cn("flex items-center justify-center w-6 h-6 rounded-md", theme === 'dark' ? "bg-white/5" : "bg-black/5")}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </span>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className={`text-[10px] font-bold uppercase tracking-[0.15em] ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Outreach Engine</p>
            <p className={`text-[9px] mt-1 ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>Module 6</p>
          </motion.div>
        )}
      </div>

      <div className={cn("flex-1 overflow-y-auto p-4 custom-scrollbar", isCollapsed && "px-2 py-4")}>
        <StepNav currentStep={currentStep} completedSteps={completedSteps} jumpToStep={jumpToStep} theme={theme} isCollapsed={isCollapsed} />
      </div>

      {niche && (
        <div className={cn("p-4 border-t border-inherit overflow-hidden", isCollapsed && "px-1")}>
          {!isCollapsed && <p className={`text-[8px] font-bold uppercase tracking-[0.1em] mb-2 ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>Phase Context</p>}
          <PhaseContextMini niche={niche} serviceLabel={serviceLabel} positioning={positioning} offerName={offerName} theme={theme} isCollapsed={isCollapsed} />
        </div>
      )}
    </motion.aside>
  );
}

function StepNav({ currentStep, completedSteps, jumpToStep, theme, isCollapsed }: {
  currentStep: OutreachEngineStep;
  completedSteps: OutreachEngineStep[];
  jumpToStep: (s: OutreachEngineStep) => void;
  theme: string;
  isCollapsed: boolean;
}) {
  return (
    <nav className={cn("space-y-1", isCollapsed && "space-y-2 flex flex-col items-center")}>
      {OUTREACH_ENGINE_STEPS.map((step, i) => {
        const isActive = step === currentStep;
        const isCompleted = completedSteps.includes(step);
        const isBeforeCompleted = i === 0 || completedSteps.includes(OUTREACH_ENGINE_STEPS[i - 1]);
        const unlocked = i === 0 || isBeforeCompleted;
        
        if (isCollapsed) {
          return (
            <button
              key={step}
              onClick={() => unlocked && jumpToStep(step)}
              disabled={!unlocked}
              title={STEP_LABELS[step]}
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-lg transition-colors cursor-pointer',
                isActive 
                  ? 'bg-brand-primary/20 border border-brand-primary/40 text-brand-primary' 
                  : isCompleted 
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' 
                    : unlocked 
                      ? (theme === 'dark' ? 'bg-white/[0.04] border border-white/10 text-zinc-400 hover:bg-white/[0.08]' : 'bg-black/[0.04] border border-black/10 text-zinc-500 hover:bg-black/[0.08]') 
                      : (theme === 'dark' ? 'bg-white/[0.02] border border-white/5 text-zinc-700' : 'bg-black/[0.02] border border-black/5 text-zinc-300'),
                !unlocked && 'cursor-not-allowed opacity-50'
              )}
            >
              <span className="text-[10px] font-bold">
                {isCompleted ? '\u2713' : i + 1}
              </span>
            </button>
          );
        }

        return (
          <button
            key={step}
            onClick={() => unlocked && jumpToStep(step)}
            disabled={!unlocked}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
              isActive ? 'bg-brand-primary/10 text-brand-primary' :
              isCompleted ? 'text-emerald-400' :
              unlocked ? (theme === 'dark' ? 'text-zinc-400 hover:text-zinc-300 hover:bg-white/[0.03]' : 'text-zinc-500 hover:text-zinc-700 hover:bg-black/[0.03]') :
              (theme === 'dark' ? 'text-zinc-700 cursor-not-allowed' : 'text-zinc-300 cursor-not-allowed')
            }`}
          >
            <span className={`flex items-center justify-center w-5 h-5 rounded text-[8px] font-bold shrink-0 ${
              isActive ? 'bg-brand-primary/20 border border-brand-primary/40' :
              isCompleted ? 'bg-emerald-500/20 border border-emerald-500/40' :
              unlocked ? (theme === 'dark' ? 'bg-white/[0.04] border border-white/10' : 'bg-black/[0.04] border border-black/10') :
              (theme === 'dark' ? 'bg-white/[0.02] border border-white/5' : 'bg-black/[0.02] border border-black/5')
            }`}>
              {isCompleted ? '\u2713' : i + 1}
            </span>
            <span className="text-[10px] font-medium leading-tight truncate">{STEP_LABELS[step]}</span>
          </button>
        );
      })}
    </nav>
  );
}

function PhaseContextMini({ niche, serviceLabel, positioning, offerName, theme, isCollapsed }: {
  niche: string;
  serviceLabel: string;
  positioning: string;
  offerName: string;
  theme: string;
  isCollapsed: boolean;
}) {
  if (isCollapsed) return null;
  const tc = theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600';
  const lc = theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400';
  return (
    <div className="space-y-1.5">
      {serviceLabel && <p className={`text-[9px] ${tc} truncate`}><span className={lc}>Service:</span> {serviceLabel}</p>}
      {niche && <p className={`text-[9px] ${tc} truncate`}><span className={lc}>Niche:</span> {niche}</p>}
      {offerName && <p className={`text-[9px] ${tc} truncate`}><span className={lc}>Offer:</span> {offerName}</p>}
      {positioning && <p className={`text-[8px] ${tc} leading-relaxed line-clamp-2`}>{positioning}</p>}
    </div>
  );
}
