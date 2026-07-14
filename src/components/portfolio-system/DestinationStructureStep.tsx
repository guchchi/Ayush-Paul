import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Globe, Layout, Check, Sparkles, ArrowRight, AlertTriangle, ChevronUp, ChevronDown } from 'lucide-react';
import { usePortfolioSystemStore } from '../../lib/portfolio-system';
import { generatePlatformRecommendation, generateSections } from '../../lib/portfolio-system/composer';
import { composeStep2Content } from '../../lib/portfolio-system/personalized-content';
import type { PortfolioDestination, PortfolioSectionSpec, SectionSource } from '../../types/portfolio-system';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';

const DESTINATION_LABELS: Record<PortfolioDestination, string> = {
  personal_site: 'Personal Website',
  social_native_showcase: 'Social Native Showcase',
  code_and_live_demo: 'Code & Live Demo',
  visual_showcase: 'Visual Showcase',
  document_case_study: 'Document Case Study',
  video_walkthrough: 'Video Walkthrough',
};

const ALL_DESTINATIONS: PortfolioDestination[] = [
  'personal_site',
  'social_native_showcase',
  'code_and_live_demo',
  'visual_showcase',
  'document_case_study',
  'video_walkthrough',
];

const SOURCE_LABELS: Record<SectionSource, string> = {
  base: 'Base',
  service: 'Service',
  market: 'Market',
  niche: 'Niche',
  authority: 'Authority',
  user: 'User',
};

export function DestinationStructureStep() {
  const upstream = usePortfolioSystemStore((s) => s.upstream);
  const platformRecommendation = usePortfolioSystemStore((s) => s.platformRecommendation);
  const sections = usePortfolioSystemStore((s) => s.sections);
  const setPlatformRecommendation = usePortfolioSystemStore((s) => s.setPlatformRecommendation);
  const setSections = usePortfolioSystemStore((s) => s.setSections);
  const updateSection = usePortfolioSystemStore((s) => s.updateSection);
  const confirmStep = usePortfolioSystemStore((s) => s.confirmStep);
  const nextStep = usePortfolioSystemStore((s) => s.nextStep);
  const staleSince = usePortfolioSystemStore((s) => s.staleSince);
  const markEdited = usePortfolioSystemStore((s) => s.markEdited);
  const completedSteps = usePortfolioSystemStore((s) => s.completedSteps);

  const [showOverride, setShowOverride] = useState(false);

  const pc = useMemo(() => {
    if (!upstream || !platformRecommendation) return null;
    return composeStep2Content(upstream, platformRecommendation, sections);
  }, [upstream, platformRecommendation, sections]);

  const isCompleted = completedSteps.includes('platform_structure');
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  if (!upstream) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/[0.03] border border-white/5 mb-4">
          <Globe size={20} className="text-zinc-500" />
        </div>
        <p className="text-sm text-zinc-500 text-center max-w-xs">
          Complete Module 3 first to pipe your selections here.
        </p>
      </div>
    );
  }

  if (!platformRecommendation) {
    const handleGenerate = () => {
      const result = generatePlatformRecommendation(upstream);
      setPlatformRecommendation(result);
      const generatedSections = generateSections(upstream, result);
      setSections(generatedSections);
    };

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 2 of 6</span>
          <h2 className="text-2xl font-bold tracking-tight text-white/95">Platform Destination & Structure</h2>
          <p className="text-sm text-zinc-400 max-w-lg">
            Choose where your portfolio lives and what sections it includes.
          </p>
        </div>
        <motion.button
          onClick={handleGenerate}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-dashed border-brand-primary/30 bg-brand-primary/10 text-sm font-semibold text-brand-primary transition-all duration-200 cursor-pointer"
        >
          <Sparkles size={16} />
          Generate Recommendations
        </motion.button>
      </div>
    );
  }

  const handleOverride = (dest: PortfolioDestination) => {
    setPlatformRecommendation({
      ...platformRecommendation,
      destination: dest,
      isUserOverride: true,
    });
    setShowOverride(false);
    markEdited('platformRecommendation.destination');
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const current = sortedSections[index];
    const above = sortedSections[index - 1];
    updateSection(current.id, { order: above.order });
    updateSection(above.id, { order: current.order });
  };

  const handleMoveDown = (index: number) => {
    if (index >= sortedSections.length - 1) return;
    const current = sortedSections[index];
    const below = sortedSections[index + 1];
    updateSection(current.id, { order: below.order });
    updateSection(below.id, { order: current.order });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 2 of 6</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Platform Destination & Structure</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Choose where your portfolio lives and what sections it includes.
        </p>
      </div>

      {staleSince && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle size={14} className="text-amber-400 shrink-0" />
          <span className="text-xs font-medium text-amber-400">
            Upstream context has changed. Regenerate?
          </span>
        </div>
      )}

      <div className="space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Platform Destination</span>
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-brand-primary/15 border border-brand-primary/25 text-xs font-semibold text-brand-primary">
              {DESTINATION_LABELS[platformRecommendation.destination]}
            </span>
            {platformRecommendation.isUserOverride && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold uppercase tracking-[0.1em] text-amber-400">
                Overridden
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 italic leading-relaxed">
            &ldquo;{platformRecommendation.primaryRecommendation}&rdquo;
          </p>
          {platformRecommendation.supportingDestinations.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {platformRecommendation.supportingDestinations.map((d, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-medium text-zinc-400">
                  {d}
                </span>
              ))}
            </div>
          )}
          <p className="text-[11px] text-zinc-500 leading-relaxed">{platformRecommendation.reason}</p>
          {pc?.destinationHelper && (
            <p className="text-[10px] text-zinc-500 italic leading-relaxed">{pc.destinationHelper}</p>
          )}
          <div className="relative">
            <button
              onClick={() => setShowOverride(!showOverride)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.02] text-[10px] font-medium text-zinc-400 hover:text-white hover:border-white/10 transition-all cursor-pointer"
            >
              Override
              <ChevronDown size={12} className={cn('transition-transform', showOverride && 'rotate-180')} />
            </button>
            {showOverride && (
              <div className="absolute top-full left-0 mt-1 z-10 w-56 p-1.5 rounded-xl bg-zinc-900 border border-white/10 shadow-xl space-y-0.5">
                {ALL_DESTINATIONS.map((dest) => (
                  <button
                    key={dest}
                    onClick={() => handleOverride(dest)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-150 cursor-pointer',
                      dest === platformRecommendation.destination
                        ? 'bg-brand-primary/15 text-brand-primary font-medium'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5',
                    )}
                  >
                    {DESTINATION_LABELS[dest]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Portfolio Sections</span>
        {sortedSections.map((section, index) => (
          <div
            key={section.id}
            className={cn(
              'flex items-start gap-3 p-4 rounded-xl border transition-all duration-200',
              section.included
                ? 'border-white/10 bg-white/[0.02]'
                : 'border-white/[0.04] bg-white/[0.01] opacity-60',
            )}
          >
            <button
              onClick={() => updateSection(section.id, { included: !section.included })}
              className={cn(
                'w-9 h-5 rounded-full relative shrink-0 mt-0.5 transition-all duration-200 cursor-pointer',
                section.included ? 'bg-emerald-500/50' : 'bg-white/10',
              )}
            >
              <span className={cn(
                'absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200',
                section.included ? 'left-[18px] bg-white' : 'left-0.5 bg-zinc-400',
              )} />
            </button>
            <div className="flex-1 min-w-0 space-y-1">
              <p className={cn('text-xs font-semibold', section.included ? 'text-white' : 'text-zinc-500')}>
                {section.heading}
              </p>
              <p className="text-[11px] text-zinc-500 leading-relaxed">{section.purpose}</p>
              <p className="text-[10px] text-zinc-600 italic">{section.buyerQuestionAnswered}</p>
              <span className={cn(
                'inline-block px-1.5 py-0.5 rounded bg-white/5 text-[8px] font-medium uppercase tracking-[0.05em]',
                section.included ? 'text-zinc-400' : 'text-zinc-600',
              )}>
                {SOURCE_LABELS[section.source]}
              </span>
              {pc?.sectionRationales[section.id] && (
                <p className="text-[9px] text-zinc-600 italic leading-tight mt-1">{pc.sectionRationales[section.id]}</p>
              )}
            </div>
            <div className="flex flex-col gap-0.5 shrink-0">
              <button
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
                className={cn(
                  'p-1 rounded transition-all duration-150',
                  index === 0
                    ? 'text-zinc-700 cursor-not-allowed'
                    : 'text-zinc-500 hover:text-white hover:bg-white/5 cursor-pointer',
                )}
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={() => handleMoveDown(index)}
                disabled={index === sortedSections.length - 1}
                className={cn(
                  'p-1 rounded transition-all duration-150',
                  index === sortedSections.length - 1
                    ? 'text-zinc-700 cursor-not-allowed'
                    : 'text-zinc-500 hover:text-white hover:bg-white/5 cursor-pointer',
                )}
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400 shrink-0" />
          <span className="text-xs font-medium text-emerald-400">Platform structure confirmed</span>
        </div>
      ) : (
        <motion.button
          onClick={() => {
            confirmStep();
            nextStep();
          }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 px-6 h-11 rounded-lg text-xs font-bold uppercase tracking-[0.08em] bg-white text-black hover:bg-white/90 shadow-[0_0_30px_-12px_rgba(255,255,255,0.15)] transition-all duration-200 cursor-pointer"
        >
          <Check size={14} />
          Confirm &amp; Continue
        </motion.button>
      )}
    </div>
  );
}
