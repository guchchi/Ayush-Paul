import React from 'react';
import { motion } from 'motion/react';
import { Zap, Clock, CheckCircle, Target, TrendingUp, Shield } from 'lucide-react';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

const OUTCOME_ICON_MAP: Record<string, React.ComponentType<any>> = {
  'launch': Zap,
  'save': Clock,
  'avoid': CheckCircle,
  'improve': Target,
  'increase': TrendingUp,
  'productivity': TrendingUp,
  'confidence': Shield,
  'ship': Shield,
  'fast': Zap,
  'time': Clock,
  'mistake': CheckCircle,
};

const getOutcomeIcon = (label: string) => {
  const lower = label.toLowerCase();
  for (const [key, Icon] of Object.entries(OUTCOME_ICON_MAP)) {
    if (lower.includes(key)) return Icon;
  }
  return Zap;
};

export const BlueprintExpectedOutcomes = ({ product }: Props) => {
  const outcomes = product.outcomes && product.outcomes.length > 0
    ? product.outcomes
    : null;

  if (!outcomes) return null;

  return (
    <section>
      <div className="text-center mb-10">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-3">Outcomes</h2>
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0b1c30]">What You Can Achieve</h3>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {outcomes.map((item, idx) => {
          const label = typeof item === 'string' ? item : item;
          const IconComponent = getOutcomeIcon(label);

          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-[#c2c6d6]/30 shadow-sm text-left hover:border-[#d1f34d]/40 hover:bg-[#d1f34d]/5 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#d1f34d]/10 border border-[#d1f34d]/20 flex items-center justify-center mb-3 group-hover:bg-[#d1f34d] group-hover:border-[#d1f34d] transition-all">
                <IconComponent size={16} className="text-[#0b1c30]" />
              </div>
              <h4 className="text-sm font-extrabold text-[#0b1c30] mb-1">{label}</h4>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
};
