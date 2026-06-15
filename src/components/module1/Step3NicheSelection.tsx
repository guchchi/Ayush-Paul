import { motion } from 'motion/react';
import { Star, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING } from '../../lib/motion-presets';

export interface NicheOption {
  id: string;
  label: string;
  description: string;
}

interface Props {
  niches: NicheOption[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export function Step3NicheSelection({ niches, selected, onSelect }: Props) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#0b1c30] mb-3">
          Choose Your Niche
        </h2>
        <p className="text-neutral-500 text-base leading-relaxed max-w-xl">
          Narrow your focus to a specific audience within your chosen market. A
          clear niche means less competition and stronger positioning.
        </p>
      </div>

      <div className="space-y-3" role="radiogroup" aria-label="Choose your niche">
        {niches.map((niche, i) => {
          const isSelected = selected === niche.id;

          return (
            <motion.button
              key={niche.id}
              onClick={() => onSelect(niche.id)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASING.PREMIUM, delay: i * 0.06 }}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
              role="radio"
              aria-checked={isSelected}
              className={cn(
                'w-full p-5 rounded-2xl border text-left transition-all duration-200 flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-[#0058be] focus:ring-offset-2',
                isSelected
                  ? 'bg-white border-[#0058be] shadow-[0_8px_32px_rgba(0,88,190,0.14)] ring-1 ring-[#0058be]'
                  : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md',
              )}
              id={`niche-card-${niche.id}`}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-xl shrink-0 flex items-center justify-center transition-colors duration-200',
                  isSelected ? 'bg-[#0058be]' : 'bg-[#eff4ff]',
                )}
                aria-hidden="true"
              >
                <Star size={16} className={isSelected ? 'text-white' : 'text-[#0058be]'} />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={cn(
                    'font-bold text-base mb-0.5 transition-colors',
                    isSelected ? 'text-[#0058be]' : 'text-[#0b1c30]',
                  )}
                >
                  {niche.label}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {niche.description}
                </p>
              </div>
              <div className="shrink-0" aria-hidden="true">
                {isSelected ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-[#0058be] flex items-center justify-center"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-neutral-200" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
