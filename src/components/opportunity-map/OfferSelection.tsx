import { motion } from 'motion/react';
import { Check, ArrowLeft, DollarSign, Package } from 'lucide-react';
import { useOpportunityMapStore } from '../../lib/opportunity-map';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';

function WeightBar({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500 w-14 shrink-0">{label}</span>
      <div className="flex-1 h-1 rounded-full bg-white/[0.04] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value * 10}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[9px] font-bold text-zinc-500 w-3 text-right tabular-nums">{value}</span>
    </div>
  );
}

export function OfferSelection() {
  const tracks = useOpportunityMapStore((s) => s.tracks);
  const careerTrackId = useOpportunityMapStore((s) => s.careerTrackId);
  const serviceId = useOpportunityMapStore((s) => s.serviceId);
  const marketId = useOpportunityMapStore((s) => s.marketId);
  const nicheId = useOpportunityMapStore((s) => s.nicheId);
  const offerId = useOpportunityMapStore((s) => s.offerId);
  const setSelection = useOpportunityMapStore((s) => s.setSelection);
  const nextStep = useOpportunityMapStore((s) => s.nextStep);
  const previousStep = useOpportunityMapStore((s) => s.previousStep);

  const selectedTrack = tracks.find((t) => t.id === careerTrackId);
  const selectedService = selectedTrack?.services.find((s) => s.id === serviceId);
  const selectedMarket = selectedService?.markets.find((m) => m.id === marketId);
  const selectedNiche = selectedMarket?.niches.find((n) => n.id === nicheId);
  const offers = selectedNiche?.offers ?? [];

  const handleSelect = (id: string) => {
    setSelection('offer', id);
    nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <button
            onClick={previousStep}
            className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-white/5 transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft size={14} className="text-zinc-400" />
          </button>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 5 of 7</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Select Your Offer</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Choose the specific offer you will bring to the <span className="text-white/70">{selectedNiche?.label}</span> niche.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {offers.map((offer, i) => {
          const isSelected = offerId === offer.id;
          return (
            <motion.button
              key={offer.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: i * 0.06 }}
              onClick={() => handleSelect(offer.id)}
              className={cn(
                'relative flex flex-col gap-4 w-full p-5 rounded-xl text-left transition-all duration-300 cursor-pointer group',
                'bg-white/[0.03] border border-white/5',
                'hover:bg-white/5 hover:border-white/10 hover:scale-[1.01]',
                isSelected && 'bg-white/[0.06] border-white/20 shadow-[0_0_30px_-12px_rgba(255,255,255,0.06)]',
              )}
            >
              {isSelected && (
                <span className="absolute top-3 right-3 flex items-center justify-center w-5 h-5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
                  <Check size={10} className="text-white" strokeWidth={3} />
                </span>
              )}

              {/* Title & Description */}
              <div className="space-y-1.5 pr-6">
                <span className={cn(
                  'block text-sm font-semibold transition-colors',
                  isSelected ? 'text-white/95' : 'text-white/90 group-hover:text-white/95',
                )}>
                  {offer.label}
                </span>
                <span className="block text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {offer.description}
                </span>
              </div>

              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.03] border border-white/5">
                  <DollarSign size={10} className="text-emerald-400/70" />
                  <span className="text-[9px] font-bold text-zinc-400">{offer.priceRange}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.03] border border-white/5">
                  <Package size={10} className="text-white/40" />
                  <span className="text-[9px] font-bold text-zinc-400">{offer.deliveryFormat}</span>
                </div>
              </div>

              {/* Simulator weights */}
              <div className="space-y-1.5 pt-1">
                <WeightBar value={offer.simulatorWeights.demand} label="Demand" color="#22c55e" />
                <WeightBar value={offer.simulatorWeights.execution_speed} label="Speed" color="#3b82f6" />
                <WeightBar value={offer.simulatorWeights.competition} label="Competition" color="#f59e0b" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
