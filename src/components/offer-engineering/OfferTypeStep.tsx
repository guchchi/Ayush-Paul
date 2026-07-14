import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Repeat, Diamond, Layers, Sparkles, ArrowRight } from 'lucide-react';
import { useOfferEngineeringStore, getEngineeringDataForService } from '../../lib/offer-engineering';
import { useOpportunityMapStore } from '../../lib/opportunity-map';
import { cn } from '../../lib/utils';
import { DURATION } from '../../lib/motion-presets';
import type { OfferType } from '../../types/offer-engineering';

interface OfferTypeMeta {
  label: string;
  description: string;
  icon: typeof Repeat;
  whatItMeans: string;
  bestFor: string;
  example: string;
  recommended?: boolean;
}

const OFFER_TYPE_META: Record<OfferType, OfferTypeMeta> = {
  retainer: {
    label: 'Retainer',
    description: 'Monthly recurring service with fixed scope and recurring deliverables.',
    icon: Repeat,
    whatItMeans: 'You commit to a set number of deliverables each month in exchange for a recurring fee.',
    bestFor: 'Clients who need ongoing, predictable support — ideal for content teams, growing startups, and busy creators.',
    example: '',
    recommended: true,
  },
  one_time_project: {
    label: 'One-Time Project',
    description: 'Single fixed project with clear scope, timeline, and price.',
    icon: Diamond,
    whatItMeans: 'You deliver a defined scope of work once, with a fixed price and clear boundaries.',
    bestFor: 'Well-defined, standalone projects — ideal for product launches, brand refreshes, or website builds.',
    example: '',
  },
  milestone_based: {
    label: 'Milestone Based',
    description: 'Larger project split into stages with deliverables and payments tied to milestones.',
    icon: Layers,
    whatItMeans: 'You break a large project into phases. Each phase has its own deliverables and payment.',
    bestFor: 'Complex, multi-stage projects — ideal for platform builds, course production, or phased rollouts.',
    example: '',
  },
};

const SERVICE_EXAMPLES: Record<string, Record<OfferType, string>> = {
  short_form_clips: {
    retainer: '12 short-form clips per month, delivered weekly with hook optimisation and caption packages.',
    one_time_project: '30 polished short-form clips with captions, thumbnails, and trend analysis, delivered in 2 weeks.',
    milestone_based: 'Phase 1: 10 clips ($1,500). Phase 2: 20 clips ($2,500). Phase 3: 30 clips ($3,500).',
  },
  long_form_content: {
    retainer: '2 fully edited YouTube videos per month with chapter markers, custom thumbnails, and audio mastering.',
    one_time_project: 'One complete 20-minute video edit with thumbnail design, end screens, and SEO description.',
    milestone_based: 'Phase 1: Script & storyboard ($1,000). Phase 2: Rough cut ($2,000). Phase 3: Final polish ($1,500).',
  },
  podcast_post_production: {
    retainer: '4 podcast episodes per month with audio cleanup, show notes, chapter markers, and social snippet packs.',
    one_time_project: 'Full episode post-production including audio mastering, chapter markers, and 3 audiogram clips.',
    milestone_based: 'Phase 1: Audio cleanup & mix ($800). Phase 2: Show notes & chapters ($500). Phase 3: Social clips & delivery ($700).',
  },
  custom_theme_development: {
    retainer: 'Monthly maintenance, performance updates, and content changes with priority support and 2 revision rounds.',
    one_time_project: 'Complete custom WordPress theme with responsive layout, SEO structure, and full documentation, delivered in 3 weeks.',
    milestone_based: 'Phase 1: Design mockups & structure ($2,500). Phase 2: Theme development ($3,500). Phase 3: Testing & launch ($2,000).',
  },
  plugin_integration_dev: {
    retainer: 'Monthly plugin maintenance, API updates, and technical support for your WordPress ecosystem.',
    one_time_project: 'Custom WordPress plugin with API integration, configuration interface, and full documentation.',
    milestone_based: 'Phase 1: Architecture & scaffold ($2,000). Phase 2: Core integration ($3,000). Phase 3: Testing, docs & deployment ($2,000).',
  },
  site_migration_performance: {
    retainer: 'Monthly performance monitoring, security updates, and speed optimisation with quarterly audit reports.',
    one_time_project: 'Full site migration with zero-downtime DNS cut-over, performance audit, and SEO preservation.',
    milestone_based: 'Phase 1: Audit & migration plan ($1,500). Phase 2: Migration & testing ($3,000). Phase 3: Post-migration optimisation ($1,500).',
  },
  product_ui_design: {
    retainer: 'Monthly UI design sprints with component system updates, prototype iterations, and developer handoff.',
    one_time_project: 'Complete UI screen set (up to 12 screens) with interactive prototype, design system, and handoff assets.',
    milestone_based: 'Phase 1: Research & wireframes ($2,000). Phase 2: Visual design & prototype ($3,000). Phase 3: Design system & handoff ($2,500).',
  },
  brand_identity_visual_systems: {
    retainer: 'Monthly brand asset updates, social template creation, and visual identity system maintenance.',
    one_time_project: 'Full brand identity package including logo variations, colour system, typography, guidelines, and social kit.',
    milestone_based: 'Phase 1: Brand strategy & logo concepts ($2,500). Phase 2: Visual system & guidelines ($3,000). Phase 3: Social kit & assets ($1,500).',
  },
  ux_research_conversion_audits: {
    retainer: 'Monthly UX audits with heatmap analysis, user testing summaries, and prioritised fix roadmaps.',
    one_time_project: 'Complete UX audit with usability analysis, conversion funnel review, user testing, and executive presentation.',
    milestone_based: 'Phase 1: Audit & user testing ($2,500). Phase 2: Analysis & recommendations ($2,000). Phase 3: Fix roadmap & presentation ($1,500).',
  },
  landing_page_design: {
    retainer: 'Monthly landing page updates with conversion optimisation, A/B test variations, and performance reviews.',
    one_time_project: 'Complete landing page design with hero section, conversion layout, social proof, FAQ section, and Figma file.',
    milestone_based: 'Phase 1: Wireframes & copy structure ($1,500). Phase 2: Visual design & mobile layout ($2,000). Phase 3: Figma file & developer handoff ($1,500).',
  },
};

function getOfferExample(serviceId: string | null, offerType: OfferType): string {
  if (serviceId && SERVICE_EXAMPLES[serviceId]) {
    return SERVICE_EXAMPLES[serviceId][offerType];
  }
  const fallbacks: Record<OfferType, string> = {
    retainer: 'Ongoing monthly deliverables with a fixed scope and recurring fee, refreshed each billing cycle.',
    one_time_project: 'A defined scope of work delivered on a fixed timeline with a single project fee.',
    milestone_based: 'A phased delivery with payments tied to each completed milestone.',
  };
  return fallbacks[offerType];
}

export function OfferTypeStep() {
  const serviceId = useOpportunityMapStore((s) => s.serviceId);
  const offerType = useOfferEngineeringStore((s) => s.offerType);
  const setOfferType = useOfferEngineeringStore((s) => s.setOfferType);
  const nextStep = useOfferEngineeringStore((s) => s.nextStep);

  const resolvedExample = useMemo(
    () => (offerType ? getOfferExample(serviceId, offerType) : ''),
    [serviceId, offerType],
  );

  const engineeringData = useMemo(
    () => (serviceId ? getEngineeringDataForService(serviceId) : undefined),
    [serviceId],
  );

  const availableTypes: OfferType[] = useMemo(
    () => (engineeringData?.offerTypes ?? Object.keys(OFFER_TYPE_META)) as OfferType[],
    [engineeringData],
  );

  const handleSelect = (id: OfferType) => {
    setOfferType(id);
  };

  const handleConfirm = () => {
    nextStep();
  };

  const selectedMeta = offerType ? OFFER_TYPE_META[offerType] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-left">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest mb-1">
          Step 1 of 8
        </span>
        <h1 className="text-3xl font-bold text-[#0b1c30] mb-2">Choose Your Offer Type</h1>
        <p className="text-neutral-500 text-sm leading-relaxed">
          Select the engagement model that best fits how you want to deliver value to your clients.
        </p>
      </div>

      {/* Grid of Compact Radio Cards */}
      <fieldset>
        <legend className="sr-only">Choose an offer type</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
          {availableTypes.map((type) => {
            const meta = OFFER_TYPE_META[type];
            const isSelected = offerType === type;
            const Icon = meta.icon;

            return (
              <label
                key={type}
                htmlFor={`radio-offer-type-${type}`}
                className="relative flex flex-col w-full rounded-2xl text-left cursor-pointer outline-none group"
              >
                <input
                  type="radio"
                  name="offerTypeSelection"
                  id={`radio-offer-type-${type}`}
                  value={type}
                  checked={isSelected}
                  onChange={() => handleSelect(type)}
                  className="peer sr-only"
                />
                <div className={cn(
                  'relative flex flex-col gap-4 w-full h-full p-5 rounded-2xl border bg-white shadow-sm transition-all duration-200 text-left',
                  'border-neutral-200 group-hover:border-neutral-300 group-hover:shadow-md active:bg-neutral-50/50',
                  isSelected
                    ? 'border-[#0058be] ring-1 ring-[#0058be] bg-[#eff4ff]/5 shadow-[0_8px_32px_rgba(0,88,190,0.06)]'
                    : '',
                  'peer-focus-visible:ring-2 peer-focus-visible:ring-[#0058be] peer-focus-visible:ring-offset-2'
                )}>
                  {meta.recommended && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0058be]/8 text-[9px] font-extrabold uppercase tracking-wider text-[#0058be]">
                      <Sparkles size={10} className="text-[#0058be]" />
                      Rec.
                    </span>
                  )}

                  <div className="flex items-start justify-between w-full">
                    <span className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 border',
                      isSelected
                        ? 'bg-[#0058be]/8 text-[#0058be] border-transparent'
                        : 'bg-neutral-50 text-neutral-400 border-neutral-100 group-hover:bg-neutral-100/50',
                    )} aria-hidden="true">
                      <Icon size={16} />
                    </span>
                    <div className="shrink-0" aria-hidden="true">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-[#0058be] flex items-center justify-center shadow-sm">
                          <Check size={12} className="text-[#d1f34d] stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-neutral-300 bg-white" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className={cn(
                      'block text-sm font-bold transition-colors',
                      isSelected ? 'text-[#0058be]' : 'text-[#0b1c30]'
                    )}>
                      {meta.label}
                    </span>
                    <span className="block text-xs text-neutral-500 leading-relaxed break-words">
                      {meta.description}
                    </span>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Stable Context Panel */}
      <div className="min-h-[140px] relative">
        <AnimatePresence mode="wait">
          {selectedMeta ? (
            <motion.div
              key={offerType}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4 text-left"
            >
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#0058be]/8 text-[#0058be]" aria-hidden="true">
                  {(() => {
                    const Icon = selectedMeta.icon;
                    return <Icon size={14} />;
                  })()}
                </span>
                <h2 className="text-sm font-bold text-[#0b1c30]">
                  {selectedMeta.label} Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6 text-xs text-neutral-600 leading-relaxed">
                {selectedMeta.whatItMeans && (
                  <div className="xl:col-span-4">
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                      What it means
                    </span>
                    <p className="text-neutral-600 font-medium">{selectedMeta.whatItMeans}</p>
                  </div>
                )}
                {selectedMeta.bestFor && (
                  <div className="xl:col-span-4">
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                      Best for
                    </span>
                    <p className="text-neutral-600 font-medium">{selectedMeta.bestFor}</p>
                  </div>
                )}
                {resolvedExample && (
                  <div className="md:col-span-2 xl:col-span-4">
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                      Example
                    </span>
                    <p className="italic font-medium text-[#0b1c30] bg-white p-3 rounded-xl border border-neutral-100 mt-1 shadow-sm break-words">
                      &ldquo;{resolvedExample}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="p-6 rounded-2xl border border-dashed border-neutral-200 text-left bg-white space-y-2"
            >
              <h2 className="text-sm font-bold text-[#0b1c30]">Choose an offer type</h2>
              <p className="text-xs text-neutral-500">
                Select how you want to package this service. Details for your choice will appear here.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Authoritative Action Area */}
      <div className="mt-8 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left" aria-live="polite">
          {offerType ? (
            <p className="text-xs font-bold text-[#0b1c30]">
              {OFFER_TYPE_META[offerType].label} selected
            </p>
          ) : (
            <p className="text-xs text-neutral-400 font-medium">
              Choose an offer type to continue.
            </p>
          )}
        </div>
        <button
          disabled={!offerType}
          onClick={handleConfirm}
          className={cn(
            'flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0058be]',
            offerType
              ? 'bg-[#0b1c30] text-white hover:bg-[#152a45] shadow-lg cursor-pointer active:scale-[0.98]'
              : 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
          )}
        >
          <span>Continue to Deliverables</span>
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
