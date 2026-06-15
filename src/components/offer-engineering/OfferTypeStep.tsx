import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Repeat, Diamond, Layers, Sparkles } from 'lucide-react';
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
  const [expandedCard, setExpandedCard] = useState<OfferType | null>(offerType);
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
    setExpandedCard(id);
  };

  const handleConfirm = () => {
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest mb-1">
          Step 1 of 8
        </span>
        <h2 className="text-3xl font-bold text-[#0b1c30] mb-2">Choose Your Offer Type</h2>
        <p className="text-neutral-500 text-sm leading-relaxed">
          Select the engagement model that best fits how you want to deliver value to your clients.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {availableTypes.map((type, i) => {
          const meta = OFFER_TYPE_META[type];
          const isSelected = offerType === type;
          const isExpanded = expandedCard === type;
          const Icon = meta.icon;

          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.FAST, ease: 'easeOut', delay: i * 0.03 }}
              className={cn(
                'relative flex flex-col w-full rounded-2xl text-left transition-all duration-200 border bg-white shadow-sm hover:shadow-md',
                isSelected
                  ? 'border-[#0058be] ring-1 ring-[#0058be] shadow-[0_8px_32px_rgba(0,88,190,0.1)]'
                  : 'border-neutral-200 hover:border-neutral-300',
                isExpanded ? 'cursor-default' : 'cursor-pointer',
              )}
            >
              {meta.recommended && (
                <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0058be]/8 text-[10px] font-extrabold uppercase tracking-wider text-[#0058be]">
                  <Sparkles size={10} className="text-[#0058be]" />
                  Recommended
                </span>
              )}

              <button
                onClick={() => handleSelect(type)}
                className="flex flex-col gap-3 w-full p-5 text-left transition-all duration-200 group cursor-pointer"
              >
                <span className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 border',
                  isSelected
                    ? 'bg-[#0058be]/8 text-[#0058be] border-transparent'
                    : 'bg-neutral-50 text-neutral-400 border-neutral-100 group-hover:bg-neutral-100/50',
                )}>
                  <Icon size={16} />
                </span>

                <div className="space-y-1">
                  <span className={cn(
                    'block text-sm font-bold transition-colors',
                    isSelected ? 'text-[#0058be]' : 'text-[#0b1c30] group-hover:text-[#0058be]',
                  )}>
                    {meta.label}
                  </span>
                  <span className="block text-xs text-neutral-500 leading-relaxed">
                    {meta.description}
                  </span>
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-3 border-t border-neutral-100 pt-4 text-xs">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">What it means</p>
                        <p className="text-neutral-600 leading-relaxed">{meta.whatItMeans}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">Best for</p>
                        <p className="text-neutral-600 leading-relaxed">{meta.bestFor}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">Example</p>
                        <p className="text-neutral-600 leading-relaxed italic">&ldquo;{offerType === type ? resolvedExample : meta.example}&rdquo;</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {offerType && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-end pt-4"
        >
          <button
            onClick={handleConfirm}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0058be] hover:bg-[#0047a0] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
          >
            Continue with {OFFER_TYPE_META[offerType].label}
          </button>
        </motion.div>
      )}
    </div>
  );
}
