import { motion } from 'motion/react';
import {
  Clock,
  Star,
  ChevronRight,
  FileText,
  ArrowRight,
  ArrowLeft,
  Zap,
  Shield,
  Target,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useOpportunityMapStore } from '../../lib/opportunity-map';
import { useOfferEngineeringStore } from '../../lib/offer-engineering';
import { useModule3Store, MODULE3_STEPS } from '../../lib/module3';
import { useMemo } from 'react';

interface Module3IntroPageProps {
  onStart: () => void;
  onBackToBlueprint: () => void;
}

const threeOutcomes = [
  {
    icon: <Shield className="text-[#0058be]" size={20} />,
    title: 'Authority Position',
    text: 'Choose how you will honestly earn trust with a clear credibility stance.',
  },
  {
    icon: <Target className="text-[#0058be]" size={20} />,
    title: 'Proof Strategy + Assets',
    text: 'Identify the three credibility gaps buyers need answered and build honest demonstration projects.',
  },
  {
    icon: <Layers className="text-[#0058be]" size={20} />,
    title: 'Profile, Portfolio & Authority Pack',
    text: 'Turn your proof into buyer-facing copy, portfolio structure, and one execution-ready pack.',
  },
];

const stepDescriptions: Record<string, { title: string; desc: string }> = {
  authority_position: {
    title: 'Authority Position',
    desc: 'Choose the credibility stance that honestly matches your experience level.',
  },
  proof_strategy: {
    title: 'Proof Strategy',
    desc: 'Identify the three credibility gaps buyers need answered before they trust you.',
  },
  proof_asset_builder: {
    title: 'Proof Asset Builder',
    desc: 'Build three execution-ready demonstration projects that fill each gap.',
  },
  profile_portfolio: {
    title: 'Profile & Portfolio Authority',
    desc: 'Turn your proof into buyer-facing copy and a structured portfolio.',
  },
  authority_pack: {
    title: 'Authority Pack',
    desc: 'Compile everything into one system — ready for Module 4.',
  },
};

function offerTypeLabel(type: string | null): string {
  if (!type) return '';
  const map: Record<string, string> = {
    retainer: 'Retainer',
    one_time_project: 'One-Time Project',
    milestone_based: 'Milestone-Based',
  };
  return map[type] || type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Module3IntroPage({ onStart, onBackToBlueprint }: Module3IntroPageProps) {
  const serviceId = useOpportunityMapStore((s) => s.serviceId);
  const marketLabel = useOpportunityMapStore((s) => s.marketLabel);
  const nicheLabel = useOpportunityMapStore((s) => s.nicheLabel);
  const positioning = useOpportunityMapStore((s) => s.positioning);

  const m2OfferType = useOfferEngineeringStore((s) => s.offerType);
  const m2Deliverables = useOfferEngineeringStore((s) => s.deliverables);
  const m2UniqueMechanism = useOfferEngineeringStore((s) => s.uniqueMechanism);
  const m2ValueAmplifier = useOfferEngineeringStore((s) => s.valueAmplifier);
  const m2OfferBlueprint = useOfferEngineeringStore((s) => s.offerBlueprint);
  const m2CompletedSteps = useOfferEngineeringStore((s) => s.completedSteps);
  const m2IsComplete = m2CompletedSteps.includes('offer_blueprint');

  const currentStep = useModule3Store((s) => s.currentStep);
  const completedSteps = useModule3Store((s) => s.completedSteps);
  const isCompleted = useModule3Store((s) => s.isCompleted);

  const completedStepsCount = completedSteps.length;
  const totalSteps = MODULE3_STEPS.length;
  const currentProgress = Math.round((completedStepsCount / totalSteps) * 100);
  const alreadyStarted = completedStepsCount > 0 || isCompleted;

  const stepsData = useMemo(
    () =>
      MODULE3_STEPS.map((step, index) => {
        const info = stepDescriptions[step];
        const isStepCompleted = completedSteps.includes(step);
        const isActive = (step === currentStep || index === completedStepsCount) && !isStepCompleted && !isCompleted;
        return {
          num: index + 1,
          title: info.title,
          desc: info.desc,
          isCompleted: isStepCompleted,
          isActive: isActive,
        };
      }),
    [completedSteps, currentStep, isCompleted, completedStepsCount],
  );

  const serviceLabel = serviceId
    ? serviceId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Not selected';

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] overflow-x-hidden">
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
          <div className="grid lg:grid-cols-[1fr_390px] gap-10 xl:gap-16 items-start mb-12 md:mb-20">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0058be]/8 text-[#0058be] text-[11px] font-bold uppercase tracking-widest">
                <Zap size={12} className="text-[#0058be]" aria-hidden="true" /> Module 3
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0b1c30] leading-[1.1]">
                Build Your <br />
                <span className="text-[#0058be]">Authority System</span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-500 leading-relaxed max-w-2xl">
                Turn your offer into proof buyers can trust. You already know who you serve and
                what you offer. Now build an honest credibility system using demonstration projects,
                profile copy, and portfolio authority.
              </p>

              <div className="flex flex-wrap gap-2.5 pt-2" role="list" aria-label="Module details">
                {[
                  { icon: <Clock size={14} className="text-neutral-500" aria-hidden="true" />, label: '30–40 min' },
                  { icon: <Star size={14} className="text-neutral-500" aria-hidden="true" />, label: 'Proof Focused' },
                  { icon: <ChevronRight size={14} className="text-neutral-500" aria-hidden="true" />, label: '5 Steps' },
                  { icon: <FileText size={14} className="text-[#0b1c30]" aria-hidden="true" />, label: 'Output: Authority Pack', accent: true },
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

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <motion.button
                  onClick={onStart}
                  whileHover={{ y: -2, boxShadow: '0 16px 40px rgba(0,88,190,0.25)' }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#0058be] text-white font-bold text-base transition-colors shadow-[0_8px_24px_rgba(0,88,190,0.2)] focus:outline-none focus:ring-2 focus:ring-[#0058be] focus:ring-offset-2 cursor-pointer"
                >
                  {isCompleted
                    ? 'View Authority Pack'
                    : alreadyStarted
                    ? 'Resume Authority System'
                    : 'Start Authority System'}
                  <ArrowRight size={18} aria-hidden="true" />
                </motion.button>
              </div>

              <p className="text-xs text-neutral-400 font-medium">
                Build proof without pretending you already have clients. Use demonstration projects,
                audits, teardowns, and process evidence — never fake testimonials or results.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xl space-y-6">
              <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-3">
                Module 3 Overview
              </h2>

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
                  {completedStepsCount} of {totalSteps} steps completed
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#eff4ff]/60 border border-[#eff4ff] space-y-3">
                <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Carried From Modules 1 & 2
                </h3>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="block text-[8px] font-bold text-neutral-400 uppercase">Service</span>
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
                      <span className="block text-[8px] font-bold text-neutral-400 uppercase">Positioning</span>
                      <p className="italic text-neutral-600 mt-0.5 leading-relaxed">&ldquo;{positioning}&rdquo;</p>
                    </div>
                  )}

                  <hr className="border-t border-[#dce6f5] my-2" />

                  {m2OfferType && (
                    <div>
                      <span className="block text-[8px] font-bold text-neutral-400 uppercase">Offer Type</span>
                      <span className="font-semibold text-[#0b1c30]">{offerTypeLabel(m2OfferType)}</span>
                    </div>
                  )}

                  {m2UniqueMechanism && (
                    <div>
                      <span className="block text-[8px] font-bold text-neutral-400 uppercase">Unique Mechanism</span>
                      <p className="text-[11px] text-neutral-600 leading-relaxed mt-0.5">{m2UniqueMechanism}</p>
                    </div>
                  )}

                  {m2ValueAmplifier && (
                    <div>
                      <span className="block text-[8px] font-bold text-neutral-400 uppercase">Value Amplifier</span>
                      <span className="font-semibold text-[#0b1c30]">{m2ValueAmplifier}</span>
                    </div>
                  )}

                  {m2Deliverables.length > 0 && (
                    <div>
                      <span className="block text-[8px] font-bold text-neutral-400 uppercase">Deliverables</span>
                      <ul className="mt-1 space-y-0.5">
                        {m2Deliverables.slice(0, 4).map((d, i) => (
                          <li key={i} className="text-[11px] text-neutral-600 flex items-start gap-1.5">
                            <span className="text-[#0058be] mt-0.5 shrink-0">&#8226;</span>
                            {d}
                          </li>
                        ))}
                        {m2Deliverables.length > 4 && (
                          <li className="text-[10px] text-neutral-400 italic">+{m2Deliverables.length - 4} more</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {m2IsComplete && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Module 2 completed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 mb-12 md:mb-20">
            <div>
              <h2 className="text-2xl font-bold text-[#0b1c30] mb-2">The 5 Steps of the Authority System</h2>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Work through these phases to build demonstrable proof, profile authority, and a portfolio-ready system.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
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
                            : 'bg-neutral-100 text-neutral-400',
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
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#eff4ff]/60 border border-[#eff4ff] rounded-3xl p-6 sm:p-8 mb-12 md:mb-20 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0b1c30] mb-2">What You’ll Build</h2>
              <p className="text-sm text-neutral-500 leading-relaxed">
                By the end of this module, you will have a complete credibility system ready for your portfolio.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {threeOutcomes.map((item, index) => (
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

          <div className="relative rounded-3xl bg-[#0b1c30] text-white p-8 sm:p-12 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0058be]/25 via-transparent to-[#d1f34d]/5 pointer-events-none" />

            <div className="space-y-2 text-center md:text-left z-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Ready to build your authority?
              </h2>
              <p className="text-neutral-300 text-sm sm:text-base max-w-xl leading-relaxed">
                Step into Module 3 to define your position, build proof assets, create profile copy,
                and compile your Authority Pack.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0 z-10">
              <button
                onClick={onStart}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#d1f34d] hover:bg-[#c2e240] text-[#0b1c30] font-bold text-sm sm:text-base transition-colors focus:outline-none cursor-pointer"
              >
                {isCompleted
                  ? 'View Authority Pack'
                  : alreadyStarted
                  ? 'Resume Authority System'
                  : 'Start Authority System'}
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
