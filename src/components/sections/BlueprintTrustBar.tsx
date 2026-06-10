import React from 'react';
import { motion } from 'motion/react';
import { Download, ArrowRight, Repeat, Zap, RefreshCw, Smile } from 'lucide-react';

const TRUST_ITEMS = [
  { icon: Download, label: 'Downloadable assets' },
  { icon: ArrowRight, label: 'Step-by-step implementation' },
  { icon: Repeat, label: 'Lifetime access' },
  { icon: Zap, label: 'Instant delivery' },
  { icon: RefreshCw, label: 'Updated regularly' },
  { icon: Smile, label: 'Beginner friendly' },
];

export const BlueprintTrustBar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-white border border-[#c2c6d6]/30 rounded-[20px] shadow-sm py-4 px-6"
    >
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {TRUST_ITEMS.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-center">
                <IconComponent size={12} className="text-[#0058be]" />
              </div>
              <span className="text-[11px] font-bold text-[#424754] whitespace-nowrap">{item.label}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
