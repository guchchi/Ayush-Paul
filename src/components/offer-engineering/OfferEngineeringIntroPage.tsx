import { motion } from 'motion/react';
import {
  Clock,
  Star,
  ChevronRight,
  FileText,
  ArrowRight,
  ArrowLeft,
  Zap,
  Layers,
  Sparkles,
  Shield,
  DollarSign,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useOpportunityMapStore } from '../../lib/opportunity-map';
import { useOfferEngineeringStore, getEngineeringDataForService } from '../../lib/offer-engineering';
import { useMemo } from 'react';

interface OfferEngineeringIntroPageProps {
  onStart: () => void;
  onBackToBlueprint: () => void;
}

export function OfferEngineeringIntroPage({
  onStart,
  onBackToBlueprint,
}: OfferEngineeringIntroPageProps) {
  // Carried context from Module 1 (read from OpportunityMap store)
  const serviceId = useOpportunityMapStore((s) => s.serviceId);
  const marketLabel = useOpportunityMapStore((s) => s.marketLabel);
  const nicheLabel = useOpportunityMapStore((s) => s.nicheLabel);
  const positioning = useOpportunityMapStore((s) => s.positioning);

  const engineeringData = useMemo(
    () => (serviceId ? getEngineeringDataForService(serviceId) : undefined),
    [serviceId],
  );

  const serviceLabel = engineeringData?.label ?? serviceId ?? 'Not selected';

  // Module 2 progress
  const completedSteps = useOfferEngineeringStore((s) => s.completedSteps);
  const currentStep = useOfferEngineeringStore((s) => s.currentStep);
  const offerType = useOfferEngineeringStore((s) => s.offerType);
  const deliverables = useOfferEngineeringStore((s) => s.deliverables);
  const uniqueMechanism = useOfferEngineeringStore((s) => s.uniqueMechanism);

  const completedStepsCount = completedSteps.length;
  const currentProgress = Math.round((completedStepsCount / 8) * 100);
  const alreadyStarted = completedStepsCount > 0 || offerType !== null || deliverables.length > 0 || uniqueMechanism.trim().length > 0;

  const stepsData = [
    {
      num: 1,
      title: 'Offer Type',
      desc: 'Select the model (retainer, one-time, milestone).',
      isCompleted: completedSteps.includes('offer_type'),
      isActive: currentStep === 'offer_type',
    },
    {
      num: 2,
      title: 'Deliverables',
      desc: 'Define concrete, niche-specific deliverables.',
      isCompleted: completedSteps.includes('deliverables'),
      isActive: currentStep === 'deliverables' && !completedSteps.includes('deliverables'),
    },
    {
      num: 3,
      title: 'Unique Mechanism',
      desc: 'Name your proprietary, high-value delivery system.',
      isCompleted: completedSteps.includes('unique_mechanism'),
      isActive: currentStep === 'unique_mechanism' && !completedSteps.includes('unique_mechanism'),
    },
    {
      num: 4,
      title: 'Scope Protection',
      desc: 'Set boundaries on revisions and communication.',
      isCompleted: completedSteps.includes('scope_protection'),
      isActive: currentStep === 'scope_protection' && !completedSteps.includes('scope_protection'),
    },
    {
      num: 5,
      title: 'Value Amplifier',
      desc: 'Select a risk reversal, bonus, or accelerator.',
      isCompleted: completedSteps.includes('value_amplifier'),
      isActive: currentStep === 'value_amplifier' && !completedSteps.includes('value_amplifier'),
    },
    {
      num: 6,
      title: 'Pricing',
      desc: 'Structure your flat-rate, tiered, or value pricing.',
      isCompleted: completedSteps.includes('pricing'),
      isActive: currentStep === 'pricing' && !completedSteps.includes('pricing'),
    },
    {
      num: 7,
      title: 'Proposal Summary',
      desc: 'Outline your pitch deck copy & next steps.',
      isCompleted: completedSteps.includes('proposal_summary'),
      isActive: currentStep === 'proposal_summary' && !completedSteps.includes('proposal_summary'),
    },
    {
      num: 8,
      title: 'Offer Blueprint',
      desc: 'Generate, edit, and download your final blueprint.',
      isCompleted: completedSteps.includes('offer_blueprint'),
      isActive: currentStep === 'offer_blueprint' && !completedSteps.includes('offer_blueprint'),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] overflow-x-hidden">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-8">
        <button
          onClick={onBackToBlueprint}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-[#0058be] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0058be] rounded-lg p-1.5"
          aria-label="Back to Blueprint page"
        >
          <ArrowLeft size={14} aria-hidden="true" /> Back to Workspace Overview
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Hero & Sidebar Summary Grid */}
          <div className="grid lg:grid-cols-[1fr_390px] gap-10 xl:gap-16 items-start mb-12 md:mb-20">
            
            {/* Hero details */}
            <div className="space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0058be]/8 text-[#0058be] text-[11px] font-bold uppercase tracking-widest">
                <Zap size={12} className="text-[#0058be]" aria-hidden="true" /> Module 2
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0b1c30] leading-[1.1]">
                Engineer Your <br />
                <span className="text-[#0058be]">Sellable Offer</span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-500 leading-relaxed max-w-2xl">
                Turn your selected direction into a clear, premium, client-ready offer with deliverables, pricing, scope, and proposal copy.
              </p>

              {/* Meta chips */}
              <div className="flex flex-wrap gap-2.5 pt-2" role="list" aria-label="Module details">
                {[
                  { icon: <Clock size={14} className="text-neutral-500" aria-hidden="true" />, label: '30–40 min' },
                  { icon: <Star size={14} className="text-neutral-500" aria-hidden="true" />, label: 'Execution Focus' },
                  { icon: <ChevronRight size={14} className="text-neutral-500" aria-hidden="true" />, label: '8 Steps' },
                  { icon: <FileText size={14} className="text-[#0b1c30]" aria-hidden="true" />, label: 'Output: Final Offer Blueprint', accent: true },
                ].map((chip, i) => (
                  <div
                    key={i}
                    role="listitem"
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold border select-none transition-all',
                      chip.accent
                        ? 'bg-[#d1f34d] border-[#d1f34d]/40 text-[#0b1c30] shadow-sm shadow-[#d1f34d]/20'
                        : 'bg-white border-neutral-200 text-neutral-600',
                    )}
                  >
                    {chip.icon}
                    <span>{chip.label}</span>
                  </div>
                ))}
              </div>

              {/* Action row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <motion.button
                  onClick={onStart}
                  whileHover={{ y: -2, boxShadow: '0 16px 40px rgba(0,88,190,0.25)' }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#0058be] text-white font-bold text-base transition-colors shadow-[0_8px_24px_rgba(0,88,190,0.2)] focus:outline-none focus:ring-2 focus:ring-[#0058be] focus:ring-offset-2 cursor-pointer"
                >
                  {alreadyStarted ? 'Continue Module 2' : 'Start Offer Engineering'}
                  <ArrowRight size={18} aria-hidden="true" />
                </motion.button>
              </div>

              <p className="text-xs text-neutral-400 font-medium">
                Helper note: You are converting abstract concepts into tangible packages that protect your time and command professional fees.
              </p>
            </div>

            {/* Right Side: Carried context + Progress overview */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xl space-y-6">
              <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-3">
                Module 2 Overview
              </h2>

              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#0b1c30]">Progress</span>
                  <span className="text-sm font-extrabold text-[#0058be]">{currentProgress}% Complete</span>
                </div>
                <div className="w-full h-3 rounded-full bg-neutral-100 overflow-hidden relative">
                  <div
                    className="h-full bg-[#0058be] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.max(currentProgress, 3)}%` }}
                  />
                </div>
                <p className="text-xs text-neutral-400 font-semibold">
                  {completedStepsCount} of 8 steps completed
                </p>
              </div>

              {/* Carried Module 1 Context */}
              <div className="p-4 rounded-2xl bg-[#eff4ff]/60 border border-[#eff4ff] space-y-3">
                <h3 className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider">
                  Carried From Module 1
                </h3>
                
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="block text-[8px] font-bold text-neutral-400 uppercase">Service & Track</span>
                    <span className="font-semibold text-[#0b1c30]">{serviceLabel}</span>
                  </div>
                  {(marketLabel || nicheLabel) && (
                    <div>
                      <span className="block text-[8px] font-bold text-neutral-400 uppercase">Target Niche</span>
                      <span className="font-semibold text-[#0b1c30]">{nicheLabel || marketLabel}</span>
                    </div>
                  )}
                  {positioning && (
                    <div>
                      <span className="block text-[8px] font-bold text-neutral-400 uppercase">Positioning Statement</span>
                      <p className="italic text-neutral-600 mt-0.5 leading-relaxed">&ldquo;{positioning}&rdquo;</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Roadmap Steps */}
          <div className="space-y-6 mb-12 md:mb-20">
            <div>
              <h2 className="text-2xl font-bold text-[#0b1c30] mb-2">The 8 Steps of Offer Engineering</h2>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Work through these sequential phases to design, amplify, and price your client blueprint.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {stepsData.map((step) => {
                const statusText = step.isCompleted
                  ? 'Completed'
                  : step.isActive
                  ? 'Active'
                  : 'Locked';

                return (
                  <div
                    key={step.num}
                    className={cn(
                      'p-5 rounded-2xl border transition-all text-left',
                      step.isCompleted
                        ? 'bg-white border-[#0058be]/20 shadow-sm'
                        : step.isActive
                        ? 'bg-white border-[#0058be] shadow-md ring-1 ring-[#0058be]'
                        : 'bg-neutral-50/50 border-neutral-100 opacity-65',
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-[11px]',
                          step.isCompleted
                            ? 'bg-[#0058be]/8 text-[#0058be]'
                            : step.isActive
                            ? 'bg-[#0058be] text-white'
                            : 'bg-neutral-200 text-neutral-500',
                        )}
                      >
                        {step.num}
                      </div>

                      <span
                        className={cn(
                          'text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md',
                          step.isCompleted
                            ? 'bg-emerald-50 text-emerald-600'
                            : step.isActive
                            ? 'bg-[#d1f34d] text-[#0b1c30]'
                            : 'bg-neutral-100 text-neutral-450',
                        )}
                      >
                        {statusText}
                      </span>
                    </div>

                    <h3
                      className={cn(
                        'text-xs font-bold mb-1 leading-snug',
                        step.isActive ? 'text-[#0058be]' : 'text-[#0b1c30]',
                      )}
                    >
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-neutral-450 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Outcomes list */}
          <div className="bg-[#eff4ff]/60 border border-[#eff4ff] rounded-3xl p-6 sm:p-8 mb-12 md:mb-20 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0b1c30] mb-2">What You’ll Build</h2>
              <p className="text-sm text-neutral-500 leading-relaxed">
                By the end of this module, you will have structured a highly sellable and premium client package:
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: <Layers className="text-[#0058be]" size={20} />,
                  title: 'Engagement Structure & Deliverables',
                  text: 'Clear deliverables list scoping out exactly what is included in your retainer or project scope.',
                },
                {
                  icon: <Sparkles className="text-[#0058be]" size={20} />,
                  title: 'Unique Mechanism & Amplifiers',
                  text: 'A proprietary named methodology, plus risk-reversals or bonuses to make buying a no-brainer.',
                },
                {
                  icon: <DollarSign className="text-[#0058be]" size={20} />,
                  title: 'Pricing & Scope Guardrails',
                  text: 'Optimised rate structures along with revision limits and communication rules to prevent scope creep.',
                },
              ].map((item, index) => (
                <div key={index} className="p-6 rounded-2xl bg-white border border-neutral-100 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#0b1c30] mb-1">{item.title}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Callout */}
          <div className="relative rounded-3xl bg-[#0b1c30] text-white p-8 sm:p-12 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0058be]/25 via-transparent to-[#d1f34d]/5 pointer-events-none" />
            
            <div className="space-y-2 text-center md:text-left z-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Ready to engineer your offer?
              </h2>
              <p className="text-neutral-300 text-sm sm:text-base max-w-xl leading-relaxed">
                Step into Module 2 to define deliverables, set scope guards, build proposal summaries, and export your final blueprint.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0 z-10">
              <button
                onClick={onStart}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#d1f34d] hover:bg-[#c2e240] text-[#0b1c30] font-bold text-sm sm:text-base transition-colors focus:outline-none cursor-pointer"
              >
                {alreadyStarted ? 'Continue Module 2' : 'Start Offer Engineering'}
                <ArrowRight size={16} />
              </button>
              <button
                onClick={onBackToBlueprint}
                className="flex items-center justify-center px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm sm:text-base transition-colors border border-white/10 focus:outline-none cursor-pointer"
              >
                Back
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
