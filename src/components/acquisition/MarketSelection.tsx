import { motion } from 'motion/react';
import { Check, Users } from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING } from '../../lib/motion-presets';

interface Market {
  id: string;
  label: string;
  description: string;
  icon: string;
}

interface MarketSelectionProps {
  markets: Market[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export function MarketSelection({ markets, selected, onSelect }: MarketSelectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Users size={14} className="text-brand-primary" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">
          Select Your Market
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {markets.map((market, i) => {
          const isSelected = selected === market.id;

          return (
            <motion.button
              key={market.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, ease: EASING.PREMIUM }}
              onClick={() => onSelect(market.id)}
              className={cn(
                'relative text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer',
                isSelected
                  ? 'border-brand-primary/40 bg-brand-primary/[0.04] shadow-[0_0_30px_-8px_rgba(0,88,190,0.15)]'
                  : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12]',
              )}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center">
                  <Check size={10} className="text-white" />
                </div>
              )}

              <span className="text-2xl mb-2 block">{market.icon}</span>
              <h3 className={cn(
                'text-sm font-semibold mb-1',
                isSelected ? 'text-white' : 'text-white/70',
              )}>
                {market.label}
              </h3>
              <p className="text-[11px] text-white/40 leading-relaxed">
                {market.description}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
