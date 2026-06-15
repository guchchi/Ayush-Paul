import { motion } from 'motion/react';
import { Check, ArrowLeft } from 'lucide-react';
import { useOpportunityMapStore } from '../../lib/opportunity-map';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';

export function MarketSelection() {
  const tracks = useOpportunityMapStore((s) => s.tracks);
  const careerTrackId = useOpportunityMapStore((s) => s.careerTrackId);
  const serviceId = useOpportunityMapStore((s) => s.serviceId);
  const marketId = useOpportunityMapStore((s) => s.marketId);
  const setSelection = useOpportunityMapStore((s) => s.setSelection);
  const nextStep = useOpportunityMapStore((s) => s.nextStep);
  const previousStep = useOpportunityMapStore((s) => s.previousStep);

  const selectedTrack = tracks.find((t) => t.id === careerTrackId);
  const selectedService = selectedTrack?.services.find((s) => s.id === serviceId);
  const markets = selectedService?.markets ?? [];

  const handleSelect = (id: string) => {
    setSelection('market', id);
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
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 3 of 7</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Choose a Market</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Select the market you want to serve within <span className="text-white/70">{selectedService?.label}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {markets.map((mkt, i) => {
          const isSelected = marketId === mkt.id;
          return (
            <motion.button
              key={mkt.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: i * 0.05 }}
              onClick={() => handleSelect(mkt.id)}
              className={cn(
                'relative flex flex-col gap-3 w-full p-5 rounded-xl text-left transition-all duration-300 cursor-pointer group',
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

              <div className="space-y-1.5">
                <span className={cn(
                  'block text-sm font-semibold transition-colors',
                  isSelected ? 'text-white/95' : 'text-white/90 group-hover:text-white/95',
                )}>
                  {mkt.label}
                </span>
                <span className="block text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {mkt.description}
                </span>
              </div>

              <span className={cn(
                'text-[10px] font-bold uppercase tracking-[0.1em] transition-colors',
                isSelected ? 'text-white/60' : 'text-zinc-500 group-hover:text-zinc-400',
              )}>
                {mkt.niches.length} niches
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
