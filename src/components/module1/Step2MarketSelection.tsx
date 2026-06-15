import { motion } from 'motion/react';
import { Target, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING } from '../../lib/motion-presets';

export interface MarketOption {
  id: string;
  label: string;
  description: string;
}

interface Props {
  markets: MarketOption[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export function Step2MarketSelection({ markets, selected, onSelect }: Props) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#0b1c30] mb-3">
          Choose Your Market
        </h2>
        <p className="text-neutral-500 text-base leading-relaxed max-w-xl">
          Define who you want to serve. Pick the industry or group that needs your
          skills.
        </p>
      </div>

      <div className="space-y-3" role="radiogroup" aria-label="Choose your target market">
        {markets.map((market, i) => {
          const isSelected = selected === market.id;

          return (
            <motion.button
              key={market.id}
              onClick={() => onSelect(market.id)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASING.PREMIUM, delay: i * 0.06 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.99 }}
              role="radio"
              aria-checked={isSelected}
              className={cn(
                'w-full p-5 sm:p-6 rounded-2xl border text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0058be] focus:ring-offset-2',
                isSelected
                  ? 'bg-white border-[#0058be] shadow-[0_8px_32px_rgba(0,88,190,0.14)] ring-1 ring-[#0058be]'
                  : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md',
              )}
              id={`market-card-${market.id}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl shrink-0 flex items-center justify-center transition-colors duration-200',
                    isSelected ? 'bg-[#0058be]' : 'bg-[#eff4ff]',
                  )}
                  aria-hidden="true"
                >
                  <Target size={20} className={isSelected ? 'text-white' : 'text-[#0058be]'} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={cn(
                      'font-bold text-xl mb-1 transition-colors',
                      isSelected ? 'text-[#0058be]' : 'text-[#0b1c30]',
                    )}
                  >
                    {market.label}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {market.description}
                  </p>
                </div>
                <div className="shrink-0" aria-hidden="true">
                  {isSelected ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <CheckCircle2 size={22} className="text-[#0058be]" />
                    </motion.div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-neutral-200" />
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
