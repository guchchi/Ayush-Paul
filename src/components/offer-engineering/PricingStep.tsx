import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DollarSign, Check, TrendingUp, Layers, Target } from 'lucide-react';
import { useOfferEngineeringStore, useModule2ResolvedContent } from '../../lib/offer-engineering';
import { useOpportunityMapStore } from '../../lib/opportunity-map';
import { cn } from '../../lib/utils';
import { composeStep6Content } from '../../lib/offer-engineering/personalized-content';
import type { PricingModel } from '../../types/offer-engineering';

const PRICING_META: Record<PricingModel, { label: string; description: string; icon: typeof DollarSign }> = {
  flat_rate: {
    label: 'Flat Rate',
    description: 'Single fixed price for the entire scope of work.',
    icon: DollarSign,
  },
  tiered: {
    label: 'Tiered Package',
    description: 'Multiple packages at different price points with escalating value.',
    icon: Layers,
  },
  value_based: {
    label: 'Value Based',
    description: 'Price tied to the value and ROI the client receives.',
    icon: TrendingUp,
  },
};

const PRICING_CONTEXT: Record<string, string> = {
  short_form_clips: 'Pricing may depend on clips per month, editing complexity, caption requirements, and turnaround speed.',
  long_form_content: 'Pricing may depend on video length, revision rounds, audio mastering needs, and thumbnail design scope.',
  podcast_post_production: 'Pricing may depend on episode length, number of hosts, audiogram clips, and show notes depth.',
  custom_theme_development: 'Pricing may depend on page count, integrations, CMS setup complexity, and revision rounds.',
  plugin_integration_dev: 'Pricing may depend on API complexity, integration depth, configuration interface scope, and documentation needs.',
  site_migration_performance: 'Pricing may depend on site size, database complexity, DNS migration scope, and post-migration monitoring period.',
  product_ui_design: 'Pricing may depend on screen count, design system scope, prototype interactivity, and developer handoff depth.',
  brand_identity_visual_systems: 'Pricing may depend on logo variations, brand touchpoint count, social kit scope, and guideline detail.',
  ux_research_conversion_audits: 'Pricing may depend on product complexity, user testing participant count, research depth, and presentation format.',
  landing_page_design: 'Pricing may depend on page section count, copy support, mobile design complexity, and conversion strategy depth.',
};

export function PricingStep() {
  const careerTrackId = useOpportunityMapStore((s) => s.careerTrackId);
  const serviceId = useOpportunityMapStore((s) => s.serviceId);
  const marketId = useOpportunityMapStore((s) => s.marketId);
  const nicheId_ = useOpportunityMapStore((s) => s.nicheId);
  const pricingModel = useOfferEngineeringStore((s) => s.pricingModel);
  const finalPrice = useOfferEngineeringStore((s) => s.finalPrice);
  const tieredPricing = useOfferEngineeringStore((s) => s.tieredPricing);
  const valueBasedPricing = useOfferEngineeringStore((s) => s.valueBasedPricing);
  const setPricingModel = useOfferEngineeringStore((s) => s.setPricingModel);
  const setFinalPrice = useOfferEngineeringStore((s) => s.setFinalPrice);
  const setTieredPricing = useOfferEngineeringStore((s) => s.setTieredPricing);
  const setValueBasedPricing = useOfferEngineeringStore((s) => s.setValueBasedPricing);
  const nextStep = useOfferEngineeringStore((s) => s.nextStep);

  const { pathContent, engineeringData } = useModule2ResolvedContent();

  const personalized = useMemo(
    () => composeStep6Content({
      careerTrackId,
      serviceId,
      marketId,
      nicheId: nicheId_,
      pricingModel,
      finalPrice,
    }),
    [careerTrackId, serviceId, marketId, nicheId_, pricingModel, finalPrice],
  );

  const pricingGuidance = pathContent?.content.pricingGuidance;

  const availableModels: PricingModel[] = useMemo(() => {
    if (pricingGuidance) {
      const suggested = pricingGuidance.suggestedModel as PricingModel;
      const base = (engineeringData?.pricingModels ?? Object.keys(PRICING_META)) as PricingModel[];
      if (!base.includes(suggested)) {
        return [suggested, ...base];
      }
      return base;
    }
    return (engineeringData?.pricingModels ?? Object.keys(PRICING_META)) as PricingModel[];
  }, [engineeringData, pricingGuidance]);

  const flatValid = pricingModel === 'flat_rate' && finalPrice !== null && finalPrice > 0;
  const tieredValid = pricingModel === 'tiered' && tieredPricing.starterPrice !== null && tieredPricing.proPrice !== null && tieredPricing.premiumPrice !== null;
  const valueValid = pricingModel === 'value_based' && valueBasedPricing.estimatedClientValue !== null && valueBasedPricing.impactLevel.trim().length > 0 && finalPrice !== null && finalPrice > 0;
  const isValid = (flatValid || tieredValid || valueValid);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest mb-1">
          Step 6 of 8
        </span>
        <h2 className="text-3xl font-bold text-[#0b1c30] mb-2">Set Your Pricing</h2>
        <p className="text-neutral-500 text-sm leading-relaxed">
          Choose a pricing model and set your rates for this productized service.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {availableModels.map((model) => {
          const meta = PRICING_META[model];
          const isSelected = pricingModel === model;
          const Icon = meta.icon;

          return (
            <button
              key={model}
              onClick={() => setPricingModel(model)}
              className={cn(
                'relative flex flex-col gap-3 w-full p-4 rounded-2xl text-left border shadow-sm transition-all duration-150 cursor-pointer group bg-white',
                isSelected
                  ? 'border-[#0058be] ring-1 ring-[#0058be] shadow-[0_8px_32px_rgba(0,88,190,0.1)]'
                  : 'border-neutral-200 hover:border-neutral-300 hover:shadow-md',
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-xl border transition-all duration-200',
                  isSelected
                    ? 'bg-[#0058be]/8 text-[#0058be] border-transparent'
                    : 'bg-neutral-50 text-neutral-400 border-neutral-100 group-hover:bg-neutral-100/50',
                )}>
                  <Icon size={14} />
                </span>
                {isSelected && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0058be] text-[#d1f34d] shrink-0 shadow-sm">
                    <Check size={11} className="stroke-[3]" />
                  </span>
                )}
              </div>

              <div className="space-y-0.5">
                <span className={cn(
                  'block text-xs font-bold transition-colors',
                  isSelected ? 'text-[#0058be]' : 'text-neutral-600 group-hover:text-[#0b1c30]',
                )}>
                  {meta.label}
                </span>
                <span className="block text-xs text-neutral-400 leading-relaxed">
                  {meta.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Service-aware pricing context */}
      {(pricingGuidance?.pricingLogic || (serviceId && PRICING_CONTEXT[serviceId])) && (
        <div className="flex items-start gap-4 p-5 rounded-2xl border border-[#eff4ff] bg-[#eff4ff]/60">
          <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-[#eff4ff] text-[#0058be] shrink-0 mt-0.5 shadow-sm">
            <DollarSign size={14} className="text-[#0058be]" />
          </span>
          <p className="text-xs text-neutral-600 leading-relaxed font-medium">
            {pricingGuidance?.pricingLogic || PRICING_CONTEXT[serviceId ?? '']}
          </p>
        </div>
      )}

      {/* Pricing detail forms */}
      <AnimatePresence mode="wait">
        {pricingModel === 'flat_rate' && (
          <motion.div
            key="flat"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="space-y-2.5 pt-4 border-t border-neutral-200"
          >
            <div className="flex items-center gap-1.5 text-neutral-400">
              <DollarSign size={13} className="text-[#0058be]" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Final Price (USD)</span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-neutral-400">$</span>
              <input
                type="number"
                min={0}
                step={50}
                value={finalPrice !== null ? finalPrice.toString() : ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setFinalPrice(val === '' ? null : parseFloat(val));
                }}
                placeholder="2500"
                className="w-full h-10 pl-8 pr-4 rounded-xl outline-none text-xs text-[#0b1c30] placeholder:text-neutral-400 bg-white border border-neutral-200 focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be] transition-colors"
              />
            </div>
            <p className="text-xs text-neutral-400">{personalized.flatRateHelper}</p>
          </motion.div>
        )}

        {pricingModel === 'tiered' && (
          <motion.div
            key="tiered"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="space-y-3 pt-4 border-t border-neutral-200"
          >
            <div className="flex items-center gap-1.5 text-neutral-400">
              <Layers size={13} className="text-[#0058be]" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Tiered pricing packages</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {([
                { key: 'starterPrice' as const, label: 'Starter Package', desc: 'Core essentials' },
                { key: 'proPrice' as const, label: 'Pro (Most Popular)', desc: 'Complete service scope' },
                { key: 'premiumPrice' as const, label: 'Premium Package', desc: 'Full custom options' },
              ]).map((tier) => (
                <div key={tier.key} className="space-y-2 p-4 rounded-2xl border border-neutral-200 bg-white shadow-sm">
                  <div>
                    <span className="block text-xs font-bold text-[#0b1c30]">{tier.label}</span>
                    <span className="block text-[10px] text-neutral-400 mt-0.5">{tier.desc}</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400">$</span>
                    <input
                      type="number"
                      min={0}
                      step={50}
                      value={tieredPricing[tier.key] !== null ? tieredPricing[tier.key]!.toString() : ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTieredPricing({ ...tieredPricing, [tier.key]: val === '' ? null : parseFloat(val) });
                      }}
                      placeholder="0"
                      className="w-full h-9 pl-7 pr-3 rounded-xl outline-none text-xs text-[#0b1c30] placeholder:text-neutral-400 bg-white border border-neutral-200 focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be] transition-colors"
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-neutral-400">{personalized.tieredHelper}</p>
          </motion.div>
        )}

        {pricingModel === 'value_based' && (
          <motion.div
            key="value"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="space-y-4 pt-4 border-t border-neutral-200"
          >
            <div className="flex items-center gap-1.5 text-neutral-400">
              <Target size={13} className="text-[#0058be]" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Value-based parameters</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Estimated Annual Client Value</span>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400">$</span>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={valueBasedPricing.estimatedClientValue !== null ? valueBasedPricing.estimatedClientValue.toString() : ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setValueBasedPricing({ ...valueBasedPricing, estimatedClientValue: val === '' ? null : parseFloat(val) });
                    }}
                    placeholder="e.g. 50000"
                    className="w-full h-10 pl-7 pr-4 rounded-xl outline-none text-xs text-[#0b1c30] placeholder:text-neutral-400 bg-white border border-neutral-200 focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Business Impact Level</span>
                <input
                  type="text"
                  value={valueBasedPricing.impactLevel}
                  onChange={(e) => setValueBasedPricing({ ...valueBasedPricing, impactLevel: e.target.value })}
                  placeholder="e.g. High — directly increases sales conversions"
                  className="w-full h-10 px-4 rounded-xl outline-none text-xs text-[#0b1c30] placeholder:text-neutral-400 bg-white border border-neutral-200 focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Suggested Price Range</span>
                <input
                  type="text"
                  value={valueBasedPricing.suggestedPriceRange}
                  onChange={(e) => setValueBasedPricing({ ...valueBasedPricing, suggestedPriceRange: e.target.value })}
                  placeholder="e.g. $3,000 — $5,000"
                  className="w-full h-10 px-4 rounded-xl outline-none text-xs text-[#0b1c30] placeholder:text-neutral-400 bg-white border border-neutral-200 focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Your Target Final Price</span>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400">$</span>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    value={finalPrice !== null ? finalPrice.toString() : ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFinalPrice(val === '' ? null : parseFloat(val));
                    }}
                    placeholder="3500"
                    className="w-full h-10 pl-7 pr-4 rounded-xl outline-none text-xs text-[#0b1c30] placeholder:text-neutral-400 bg-white border border-neutral-200 focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be] transition-colors"
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-neutral-400">{personalized.valueBasedHelper}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions footer */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
        <span className="text-xs text-neutral-400">
          {!isValid
            ? !pricingModel ? 'Select a pricing model' : 'Complete pricing fields to continue'
            : pricingModel === 'flat_rate'
              ? `$${finalPrice} — Flat Rate`
              : pricingModel === 'tiered'
                ? `$${tieredPricing.starterPrice}–$${tieredPricing.premiumPrice} — Tiered`
                : `$${finalPrice} — Value Based`}
        </span>

        <button
          onClick={nextStep}
          disabled={!isValid}
          className={cn(
            'inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer select-none border shadow-sm',
            isValid
              ? 'bg-[#0058be] hover:bg-[#0047a0] text-white border-transparent'
              : 'bg-neutral-50 border-neutral-200 text-neutral-400 cursor-not-allowed',
          )}
        >
          Confirm Pricing
        </button>
      </div>
    </div>
  );
}
