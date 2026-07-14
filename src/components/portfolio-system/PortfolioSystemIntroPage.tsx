import { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  Star,
  ChevronRight,
  FileText,
  ArrowRight,
  ArrowLeft,
  Zap,
  Compass,
  Layout,
  Layers,
  FileOutput,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useOpportunityMapStore } from '../../lib/opportunity-map';
import {
  usePortfolioSystemStore,
  PORTFOLIO_SYSTEM_STEPS,
} from '../../lib/portfolio-system';

interface PortfolioSystemIntroPageProps {
  onStart: () => void;
  onBackToBlueprint: () => void;
}

const threeOutcomes = [
  {
    icon: <Compass className="text-[#0058be]" size={20} />,
    title: 'Portfolio Direction',
    text: 'Define what the right buyer should do after reviewing your work.',
  },
  {
    icon: <Layout className="text-[#0058be]" size={20} />,
    title: 'Destination, Structure & Proof',
    text: 'Choose where your portfolio lives, which proof leads, and how each project is presented.',
  },
  {
    icon: <FileOutput className="text-[#0058be]" size={20} />,
    title: 'Copy, CTA & Build Pack',
    text: 'Turn your authority copy into portfolio language, clear action paths, and a build-ready specification.',
  },
];

const stepDescriptions: Record<string, { title: string; desc: string }> = {
  portfolio_direction: {
    title: 'Portfolio Direction',
    desc: 'Decide what your portfolio should make the right buyer do.',
  },
  platform_structure: {
    title: 'Destination + Structure',
    desc: 'Choose where it should live and what buyers should see first.',
  },
  project_arrangement: {
    title: 'Proof Placement',
    desc: 'Arrange your existing proof as featured, secondary, and supporting work.',
  },
  project_presentations: {
    title: 'Project Presentation',
    desc: 'Plan exactly how each proof project should be shown.',
  },
  portfolio_copy_cta: {
    title: 'Copy + CTA',
    desc: 'Write the portfolio flow and place clear buyer actions.',
  },
  portfolio_build_pack: {
    title: 'Portfolio Build Pack',
    desc: 'Compile everything into one build-and-publish specification.',
  },
};

const SERVICE_LABELS: Record<string, string> = {
  video_editor: 'Video Editing',
  short_form_editor: 'Short-Form Editing',
  youtube_editor: 'YouTube Editing',
  podcast_clip_editor: 'Podcast Clip Editing',
  ad_creative_editor: 'Ad Creative Editing',
  wordpress_developer: 'WordPress Development',
  landing_page_developer: 'Landing Page Development',
  no_code_developer: 'No-Code Development',
  frontend_developer: 'Frontend Development',
  automation_developer: 'Automation Development',
  ui_ux_designer: 'UI/UX Design',
  landing_page_designer: 'Landing Page Design',
  brand_designer: 'Brand Design',
  social_media_designer: 'Social Media Design',
  presentation_designer: 'Presentation Design',
};

function personalizedIntro(serviceId: string | null, marketLabel: string | null, nicheLabel: string | null): string {
  if (!serviceId) return '';
  const svc = SERVICE_LABELS[serviceId] || serviceId.replace(/_/g, ' ');
  const audience = nicheLabel || marketLabel || 'your buyers';
  const m = /^(a|e|i|o|u)/i.test(svc) ? 'n' : '';
  return `Your portfolio should help ${audience} quickly judge your ${svc} skills, process, and quality — without scheduling a call first.`;
}

export function PortfolioSystemIntroPage({ onStart, onBackToBlueprint }: PortfolioSystemIntroPageProps) {
  const serviceId = useOpportunityMapStore((s) => s.serviceId);
  const marketLabel = useOpportunityMapStore((s) => s.marketLabel);
  const nicheLabel = useOpportunityMapStore((s) => s.nicheLabel);
  const positioning = useOpportunityMapStore((s) => s.positioning);

  const completedSteps = usePortfolioSystemStore((s) => s.completedSteps);
  const isCompleted = usePortfolioSystemStore((s) => s.isCompleted);
  const upstream = usePortfolioSystemStore((s) => s.upstream);
  const staleSince = usePortfolioSystemStore((s) => s.staleSince);

  const hasM3Context = Boolean(upstream && upstream.mod1ServiceId);
  const acceptedCount = upstream?.mod3ProofAssets?.filter((a) => a.isAccepted).length ?? 0;
  const authorityPosition = upstream?.mod3AuthorityPosition ?? null;

  const completedStepsCount = completedSteps.length;
  const totalSteps = PORTFOLIO_SYSTEM_STEPS.length;
  const currentProgress = Math.round((completedStepsCount / totalSteps) * 100);
  const alreadyStarted = completedStepsCount > 0 || isCompleted;

  const stepsData = useMemo(
    () =>
      PORTFOLIO_SYSTEM_STEPS.map((step) => {
        const info = stepDescriptions[step];
        const isStepCompleted = completedSteps.includes(step);
        const isActive = step === completedSteps[completedSteps.length - 1] || (!isStepCompleted && !isCompleted);
        return {
          num: PORTFOLIO_SYSTEM_STEPS.indexOf(step) + 1,
          title: info.title,
          desc: info.desc,
          isCompleted: isStepCompleted,
          isActive: isActive && !isStepCompleted,
        };
      }),
    [completedSteps, isCompleted],
  );

  const serviceLabel = serviceId ? SERVICE_LABELS[serviceId] || serviceId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : null;

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
                <Zap size={12} className="text-[#0058be]" aria-hidden="true" /> Module 4
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0b1c30] leading-[1.1]">
                Build Your <br />
                <span className="text-[#0058be]">Portfolio System</span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-500 leading-relaxed max-w-2xl">
                Turn your proof into a portfolio buyers can actually review. Your authority strategy and
                proof assets are ready. Now decide where your portfolio should live, what buyers see first,
                how each project is presented, and exactly what to build.
              </p>

              {serviceId && (
                <p className="text-sm text-[#0058be] font-semibold leading-relaxed">
                  {personalizedIntro(serviceId, marketLabel, nicheLabel)}
                </p>
              )}

              <div className="flex flex-wrap gap-2.5 pt-2" role="list" aria-label="Module details">
                {[
                  { icon: <Clock size={14} className="text-neutral-500" aria-hidden="true" />, label: '20–30 min' },
                  { icon: <Star size={14} className="text-neutral-500" aria-hidden="true" />, label: 'Portfolio Design' },
                  { icon: <ChevronRight size={14} className="text-neutral-500" aria-hidden="true" />, label: '6 Steps' },
                  { icon: <FileText size={14} className="text-[#0b1c30]" aria-hidden="true" />, label: 'Output: Portfolio Build Pack', accent: true },
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
                    ? 'View Portfolio Build Pack'
                    : alreadyStarted
                    ? 'Resume Portfolio System'
                    : 'Start Portfolio System'}
                  <ArrowRight size={18} aria-hidden="true" />
                </motion.button>
              </div>

              <p className="text-xs text-neutral-400 font-medium">
                Your proof is already defined. Portfolio System uses the proof assets and authority
                strategy from Module 3. It does not ask you to invent new client results or rebuild
                your proof from scratch.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xl space-y-6">
              <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-3">
                Module 4 Overview
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

              {staleSince && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                  <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Context Changed</p>
                  <p className="text-[11px] text-amber-600 leading-relaxed">
                    Your Module 3 context has changed. Resume to review and update your portfolio.
                  </p>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-[#eff4ff]/60 border border-[#eff4ff] space-y-3">
                <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Carried From Module 3
                </h3>

                <div className="space-y-2 text-xs">
                  {serviceLabel && (
                    <div>
                      <span className="block text-[8px] font-bold text-neutral-400 uppercase">Service</span>
                      <span className="font-semibold text-[#0b1c30]">{serviceLabel}</span>
                    </div>
                  )}
                  {(marketLabel || nicheLabel) && (
                    <div>
                      <span className="block text-[8px] font-bold text-neutral-400 uppercase">Target Niche</span>
                      <span className="font-semibold text-[#0b1c30]">{nicheLabel || marketLabel}</span>
                    </div>
                  )}
                  {authorityPosition && (
                    <div>
                      <span className="block text-[8px] font-bold text-neutral-400 uppercase">Authority Position</span>
                      <span className="font-semibold text-[#0b1c30] capitalize">{authorityPosition}</span>
                    </div>
                  )}
                  {hasM3Context && (
                    <div>
                      <span className="block text-[8px] font-bold text-neutral-400 uppercase">Proof Ready</span>
                      <span className="font-semibold text-[#0b1c30]">{acceptedCount} accepted proof assets</span>
                    </div>
                  )}
                  {positioning && (
                    <div>
                      <span className="block text-[8px] font-bold text-neutral-400 uppercase">Positioning</span>
                      <p className="italic text-neutral-600 mt-0.5 leading-relaxed">&ldquo;{positioning}&rdquo;</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 mb-12 md:mb-20">
            <div>
              <h2 className="text-2xl font-bold text-[#0b1c30] mb-2">The 6 Steps of the Portfolio System</h2>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Work through these phases to turn your proof into a complete, buyer-facing portfolio plan.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
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
                By the end of this module, you will have a complete portfolio plan — from direction through build specification.
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
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Ready to build your portfolio?
              </h2>
              <p className="text-neutral-300 text-sm sm:text-base max-w-xl leading-relaxed">
                Step into Module 4 to define your portfolio direction, structure, proof placement,
                presentation plans, copy, and build specification.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0 z-10">
              <button
                onClick={onStart}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#d1f34d] hover:bg-[#c2e240] text-[#0b1c30] font-bold text-sm sm:text-base transition-colors focus:outline-none cursor-pointer"
              >
                {isCompleted
                  ? 'View Portfolio Build Pack'
                  : alreadyStarted
                  ? 'Resume Portfolio System'
                  : 'Start Portfolio System'}
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
