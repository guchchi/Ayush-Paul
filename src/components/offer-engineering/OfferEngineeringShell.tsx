import { useState, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu, X, Check, ChevronLeft, ChevronRight, Sparkles,
  FileText, Briefcase, Target, Shield, Zap, DollarSign, Layers,
  CheckCircle, ArrowRight, ArrowLeft, CheckCircle2, Circle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';
import { SIDEBAR } from '../../lib/design-tokens';
import { useSidebarCollapse } from '../../lib/workspace/useSidebarCollapse';
import { SidebarToggle } from '../workspace/SidebarToggle';
import {
  useOfferEngineeringStore,
  OFFER_ENGINEERING_STEPS,
  getEngineeringDataForService,
} from '../../lib/offer-engineering';
import { useOpportunityMapStore } from '../../lib/opportunity-map';
import type { OfferEngineeringStep } from '../../types/offer-engineering';

const BRIEF_WIDTH = 320;

const STEP_LABELS: Record<OfferEngineeringStep, string> = {
  offer_type: 'Offer Type',
  deliverables: 'Deliverables',
  unique_mechanism: 'Unique Mechanism',
  scope_protection: 'Scope Protection',
  value_amplifier: 'Value Amplifier',
  pricing: 'Pricing',
  proposal_summary: 'Proposal Summary',
  offer_blueprint: 'Offer Blueprint',
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

function OfferBriefPanel({ onClose }: { onClose?: () => void }) {
  const serviceId = useOpportunityMapStore((s) => s.serviceId);
  const marketLabel = useOpportunityMapStore((s) => s.marketLabel);
  const nicheLabel = useOpportunityMapStore((s) => s.nicheLabel);
  const positioning = useOpportunityMapStore((s) => s.positioning);

  // Module 2 selections
  const offerType = useOfferEngineeringStore((s) => s.offerType);
  const deliverables = useOfferEngineeringStore((s) => s.deliverables);
  const uniqueMechanism = useOfferEngineeringStore((s) => s.uniqueMechanism);
  const scopeLimits = useOfferEngineeringStore((s) => s.scopeLimits);
  const valueAmplifier = useOfferEngineeringStore((s) => s.valueAmplifier);
  const pricingModel = useOfferEngineeringStore((s) => s.pricingModel);
  const finalPrice = useOfferEngineeringStore((s) => s.finalPrice);
  const tieredPricing = useOfferEngineeringStore((s) => s.tieredPricing);
  const valueBasedPricing = useOfferEngineeringStore((s) => s.valueBasedPricing);
  const completedSteps = useOfferEngineeringStore((s) => s.completedSteps);

  const engineeringData = useMemo(
    () => (serviceId ? getEngineeringDataForService(serviceId) : undefined),
    [serviceId],
  );

  const offerTypeDisplay = useMemo(() => {
    if (!offerType) return null;
    return offerType === 'retainer' ? 'Retainer Support'
      : offerType === 'one_time_project' ? 'One-Time Project'
      : 'Milestone Based Project';
  }, [offerType]);

  const pricingDisplay = useMemo(() => {
    if (!pricingModel) return null;
    if (pricingModel === 'flat_rate') {
      return finalPrice ? `$${finalPrice} Flat Rate` : 'Flat Rate';
    }
    if (pricingModel === 'tiered') {
      const { starterPrice, proPrice, premiumPrice } = tieredPricing;
      if (starterPrice !== null || premiumPrice !== null) {
        return `$${starterPrice || 0} – $${premiumPrice || 0} (Tiered)`;
      }
      return 'Tiered Pricing';
    }
    if (pricingModel === 'value_based') {
      return valueBasedPricing.suggestedPriceRange || (finalPrice ? `$${finalPrice} Value-Based` : 'Value-Based');
    }
    return null;
  }, [pricingModel, finalPrice, tieredPricing, valueBasedPricing]);

  const scopeDisplay = useMemo(() => {
    const { revisionCount, deliveryTime, communicationMethod } = scopeLimits;
    if (!deliveryTime && !communicationMethod) return null;
    const parts = [];
    if (deliveryTime) parts.push(deliveryTime);
    if (revisionCount > 0) parts.push(`${revisionCount} revision${revisionCount > 1 ? 's' : ''}`);
    if (communicationMethod) parts.push(communicationMethod);
    return parts.join(', ');
  }, [scopeLimits]);

  return (
    <div className="flex flex-col h-full bg-white text-[#0b1c30] border-l border-neutral-200">
      <div className="flex items-center justify-between px-5 h-12 border-b border-neutral-100 shrink-0 bg-white">
        <span className="text-[10px] font-bold tracking-[0.15em] text-neutral-400 uppercase">
          Offer Specifications
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-neutral-100 text-neutral-500 transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
        {/* Phase 1 Context */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Briefcase size={12} />
            <span className="text-[9px] font-bold uppercase tracking-[0.1em]">Opportunity Source</span>
          </div>

          {!serviceId ? (
            <p className="text-[11px] text-neutral-400 italic">
              No Phase 1 context resolved.
            </p>
          ) : (
            <div className="space-y-2.5 bg-[#eff4ff]/60 border border-[#eff4ff] p-4 rounded-2xl">
              <div>
                <span className="block text-[8px] font-bold text-neutral-400 uppercase tracking-wider">Service</span>
                <span className="text-xs font-semibold text-[#0b1c30]">
                  {engineeringData?.label ?? serviceId}
                </span>
              </div>

              {(marketLabel || nicheLabel) && (
                <div>
                  <span className="block text-[8px] font-bold text-neutral-400 uppercase tracking-wider">Target Audience</span>
                  <span className="text-xs font-semibold text-[#0b1c30]">
                    {nicheLabel || marketLabel}
                  </span>
                </div>
              )}

              {positioning && (
                <div>
                  <span className="block text-[8px] font-bold text-neutral-400 uppercase tracking-wider">Positioning</span>
                  <p className="text-[11px] text-neutral-500 italic leading-relaxed mt-0.5">
                    &ldquo;{positioning}&rdquo;
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Phase 2 Offer Spec */}
        <div className="space-y-4 pt-4 border-t border-neutral-100">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Target size={12} />
            <span className="text-[9px] font-bold uppercase tracking-[0.1em]">Offer Blueprint Draft</span>
          </div>

          <div className="space-y-3">
            <BriefItem
              icon={Layers}
              label="Engagement Model"
              value={offerTypeDisplay}
              completed={completedSteps.includes('offer_type')}
            />
            <BriefItem
              icon={CheckCircle}
              label="Deliverables"
              value={deliverables.length > 0 ? `${deliverables.length} scoped deliverable${deliverables.length > 1 ? 's' : ''}` : null}
              completed={completedSteps.includes('deliverables')}
            />
            <BriefItem
              icon={Sparkles}
              label="Unique Mechanism"
              value={uniqueMechanism}
              completed={completedSteps.includes('unique_mechanism')}
            />
            <BriefItem
              icon={Shield}
              label="Scope Protection"
              value={scopeDisplay}
              completed={completedSteps.includes('scope_protection')}
            />
            <BriefItem
              icon={Zap}
              label="Value Amplifier"
              value={valueAmplifier}
              completed={completedSteps.includes('value_amplifier')}
            />
            <BriefItem
              icon={DollarSign}
              label="Pricing Structure"
              value={pricingDisplay}
              completed={completedSteps.includes('pricing')}
            />
          </div>
        </div>
      </div>

      <div className="px-5 py-4 border-t border-neutral-100 bg-[#f8f9ff] shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-400">Blueprint Completion</span>
          <span className="text-[10px] font-bold text-[#0058be]">
            {completedSteps.length} / 8 steps
          </span>
        </div>
        <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0058be] rounded-full transition-all duration-500"
            style={{ width: `${(completedSteps.length / 8) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function BriefItem({
  icon: Icon,
  label,
  value,
  completed,
}: {
  icon: typeof Target;
  label: string;
  value: string | null;
  completed: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5 text-xs py-1">
      <span className={cn(
        "mt-0.5 shrink-0 transition-colors",
        completed ? "text-[#0058be]" : "text-neutral-400"
      )}>
        <Icon size={12} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1 leading-snug">
        <span className="block text-[9px] text-neutral-400 font-bold uppercase tracking-wider">{label}</span>
        {value ? (
          <span className="text-[#0b1c30] font-semibold block mt-0.5">{value}</span>
        ) : (
          <span className="text-neutral-400 italic block mt-0.5">Not set</span>
        )}
      </div>
    </div>
  );
}

function DesktopSidebar({
  completedSteps,
  currentStep,
  onStepSelect,
  onBack,
}: {
  completedSteps: OfferEngineeringStep[];
  currentStep: OfferEngineeringStep;
  onStepSelect: (id: OfferEngineeringStep) => void;
  onBack?: () => void;
}) {
  const { mode, isCollapsed, toggle: toggleCollapse } = useSidebarCollapse();
  const progress = Math.max((completedSteps.length / 8) * 100, 2);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? SIDEBAR.WIDTH.collapsed : SIDEBAR.WIDTH.base }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="hidden lg:flex flex-col shrink-0 border-r border-neutral-200 bg-white relative"
    >
      <SidebarToggle mode={mode} onToggle={toggleCollapse} />

      <div className={cn("p-6 pb-6 border-b border-neutral-100 shrink-0 flex flex-col overflow-hidden whitespace-nowrap transition-all", isCollapsed && "items-center px-2")}>
        {onBack && (
          <button
            onClick={onBack}
            className={cn(
              "flex items-center text-neutral-400 hover:text-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0058be] rounded cursor-pointer",
              isCollapsed ? "justify-center w-8 h-8 hover:bg-neutral-50 mb-6" : "gap-2 text-[11px] font-bold uppercase tracking-wider mb-6"
            )}
            aria-label="Back to overview"
            title={isCollapsed ? "Back to Overview" : undefined}
          >
            <ArrowLeft size={isCollapsed ? 16 : 14} aria-hidden="true" /> 
            {!isCollapsed && "Back to Overview"}
          </button>
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
              <h2 className="text-lg font-bold text-[#0b1c30] mb-3">Offer Engineering</h2>
            </motion.div>
          )}
        </AnimatePresence>

        {isCollapsed ? (
          <div className="relative w-9 h-9 flex items-center justify-center shrink-0 mt-2">
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
                className="h-full bg-[#0058be] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] font-bold text-neutral-400 mt-2 text-right">{Math.round((completedSteps.length / 8) * 100)}% Complete</p>
          </motion.div>
        )}
      </div>

      <nav className={cn("flex-1 overflow-y-auto custom-scrollbar py-6", isCollapsed ? "px-2 flex flex-col items-center gap-3" : "px-4 space-y-1")}>
        {OFFER_ENGINEERING_STEPS.map((step, index) => {
          const isActive = step === currentStep;
          const isCompleted = completedSteps.includes(step);
          const status = isCompleted ? 'completed' : isActive ? 'active' : 'upcoming';

          if (isCollapsed) {
            return (
              <button
                key={step}
                onClick={() => onStepSelect(step)}
                title={`Step 0${index + 1}: ${STEP_LABELS[step]}`}
                className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058be] shrink-0 cursor-pointer',
                  isActive
                    ? 'bg-[#0058be] text-white shadow-sm'
                    : 'text-neutral-500 hover:bg-neutral-50 border border-transparent',
                )}
              >
                <div aria-hidden="true">
                  {isCompleted ? (
                    <CheckCircle2 size={16} className={isActive ? 'text-white' : 'text-[#0058be]'} />
                  ) : (
                    <span className={cn("text-[10px] font-black", isActive ? "text-white" : "text-neutral-500")}>
                      0{index + 1}
                    </span>
                  )}
                </div>
              </button>
            );
          }

          return (
            <button
              key={step}
              onClick={() => onStepSelect(step)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be] cursor-pointer",
                isActive ? "bg-[#f8f9ff] text-[#0058be]" : "hover:bg-neutral-50 text-neutral-600"
              )}
            >
              <StepDot status={status} />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">
                  Step 0{index + 1}
                </p>
                <p className={cn(
                  "text-xs font-semibold truncate",
                  isActive ? "text-[#0b1c30]" : "text-neutral-600"
                )}>
                  {STEP_LABELS[step]}
                </p>
              </div>
            </button>
          );
        })}
      </nav>
    </motion.aside>
  );
}

export function OfferEngineeringShell({
  children,
  onBack,
}: {
  children: ReactNode;
  onBack?: () => void;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const briefToggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const currentStep = useOfferEngineeringStore((s) => s.currentStep);
  const completedSteps = useOfferEngineeringStore((s) => s.completedSteps);
  const jumpToStep = useOfferEngineeringStore((s) => s.jumpToStep);

  const activeIndex = OFFER_ENGINEERING_STEPS.indexOf(currentStep);
  const prevStep = activeIndex > 0 ? OFFER_ENGINEERING_STEPS[activeIndex - 1] : null;
  const nextStep = activeIndex < OFFER_ENGINEERING_STEPS.length - 1 ? OFFER_ENGINEERING_STEPS[activeIndex + 1] : null;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (mainRef.current) {
        mainRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleCloseSummary = () => {
    setSummaryOpen(false);
    setTimeout(() => {
      briefToggleRef.current?.focus();
    }, 50);
  };

  // Drawer accessibility: focus trap, esc closure, scroll locking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!summaryOpen) return;

      if (e.key === 'Escape') {
        handleCloseSummary();
        return;
      }

      if (e.key === 'Tab') {
        if (!drawerRef.current) return;
        const focusableElements = drawerRef.current.querySelectorAll(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
        );
        if (focusableElements.length === 0) return;
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    if (summaryOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      // Set initial focus inside drawer close button or panel
      setTimeout(() => {
        const closeBtn = drawerRef.current?.querySelector('button');
        if (closeBtn) {
          closeBtn.focus();
        } else {
          drawerRef.current?.focus();
        }
      }, 50);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [summaryOpen]);

  // Breakpoint transitions: auto-close brief drawer if viewport expands to persistent-rail width (>= 1536px)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1536px)');
    const handleBreakpointChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setSummaryOpen(false);
        document.body.style.overflow = '';
      }
    };

    // Run initially
    handleBreakpointChange(mediaQuery);

    mediaQuery.addEventListener('change', handleBreakpointChange);
    return () => {
      mediaQuery.removeEventListener('change', handleBreakpointChange);
    };
  }, []);

  return (
    <div className="flex h-dvh bg-[#f8f9ff] text-[#0b1c30] overflow-hidden font-sans">
      {/* 1. Left Stepper Column */}
      <DesktopSidebar
        completedSteps={completedSteps}
        currentStep={currentStep}
        onStepSelect={jumpToStep}
        onBack={onBack}
      />

      {/* Mobile Sidebar Overlay Drawer */}
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
              initial={{ x: -SIDEBAR.WIDTH.base }}
              animate={{ x: 0 }}
              exit={{ x: -SIDEBAR.WIDTH.base }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-neutral-200 bg-white"
            >
              <div className="flex items-center justify-between p-5 border-b border-neutral-100 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Navigation</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="p-4 border-b border-neutral-100 shrink-0">
                {onBack && (
                  <button
                    onClick={() => {
                      onBack();
                      setSidebarOpen(false);
                    }}
                    className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400 hover:text-neutral-700 transition-colors mb-4 focus:outline-none cursor-pointer"
                  >
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                )}
                <div className="w-full h-1 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0058be] rounded-full transition-all duration-500"
                    style={{ width: `${(completedSteps.length / 8) * 100}%` }}
                  />
                </div>
                <p className="text-[9px] font-bold text-neutral-400 mt-1.5 text-right">{Math.round((completedSteps.length / 8) * 100)}% Complete</p>
              </div>

              <nav className="p-3 space-y-1 overflow-y-auto">
                {OFFER_ENGINEERING_STEPS.map((step, index) => {
                  const isActive = step === currentStep;
                  const isCompleted = completedSteps.includes(step);
                  const status = isCompleted ? 'completed' : isActive ? 'active' : 'upcoming';

                  return (
                    <button
                      key={step}
                      onClick={() => {
                        jumpToStep(step);
                        setSidebarOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all focus:outline-none cursor-pointer",
                        isActive ? "bg-[#f8f9ff] text-[#0058be] font-medium" : "text-neutral-500"
                      )}
                    >
                      <StepDot status={status} />
                      <div className="flex-1 min-w-0">
                        <span className="block text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Step 0{index + 1}</span>
                        <span className="text-xs truncate">{STEP_LABELS[step]}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 2. Center Active Workspace & Header */}
      <div className="flex flex-col flex-1 min-w-0 bg-[#f8f9ff] overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-12 border-b border-neutral-200 bg-white/85 backdrop-blur-md px-4 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded hover:bg-neutral-100 text-neutral-500 cursor-pointer"
            >
              <Menu size={14} />
            </button>

            <div className="flex items-center gap-1.5">
              {prevStep && (
                <button
                  onClick={() => jumpToStep(prevStep)}
                  className="p-1 rounded hover:bg-neutral-100 text-neutral-500 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>
              )}

              <span className="text-xs font-semibold text-[#0b1c30] truncate select-none">
                Step {activeIndex + 1}: {STEP_LABELS[currentStep]}
              </span>

              {nextStep && (
                <button
                  onClick={() => jumpToStep(nextStep)}
                  className="p-1 rounded hover:bg-neutral-100 text-neutral-500 transition-colors cursor-pointer"
                >
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              ref={briefToggleRef}
              onClick={() => setSummaryOpen(true)}
              aria-expanded={summaryOpen}
              aria-controls="offer-brief-drawer"
              aria-label="Open offer specifications brief"
              className="2xl:hidden flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold tracking-wider text-neutral-500 hover:text-neutral-800 border border-neutral-200 rounded-lg bg-white transition-all uppercase shadow-sm cursor-pointer"
            >
              <FileText size={11} aria-hidden="true" />
              Brief
            </button>

            <span className="hidden sm:inline text-[9px] font-bold tracking-wider text-neutral-400 uppercase">
              Step {activeIndex + 1} of 8
            </span>
          </div>
        </header>

        {/* Workspace content scroll container */}
        <main ref={mainRef} className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="mx-auto w-full max-w-[720px] lg:max-w-[1024px] xl:max-w-[1280px] px-5 sm:px-8 py-8 md:py-12">
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

      {/* 3. Right Live Offer Brief Panel (Desktop) */}
      <div
        className="hidden 2xl:block shrink-0 h-full overflow-hidden"
        style={{ width: BRIEF_WIDTH }}
      >
        <OfferBriefPanel />
      </div>

      {/* Mobile/Tablet Offer Brief Drawer Overlay */}
      <AnimatePresence>
        {summaryOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black"
              onClick={handleCloseSummary}
            />
            <motion.div
              ref={drawerRef}
              tabIndex={-1}
              id="offer-brief-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Offer specifications brief"
              initial={{ x: BRIEF_WIDTH }}
              animate={{ x: 0 }}
              exit={{ x: BRIEF_WIDTH }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-y-0 right-0 z-50 border-l border-neutral-200 bg-white outline-none flex flex-col h-full"
              style={{ width: BRIEF_WIDTH }}
            >
              <OfferBriefPanel onClose={handleCloseSummary} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
