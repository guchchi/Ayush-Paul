import React from 'react';
import { motion } from 'motion/react';
import { Check, Clock, FileText, Code, Zap, ShieldCheck } from 'lucide-react';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

const TIMELINE_STEPS = [
  { icon: FileText, label: 'Review', description: 'Read the blueprint and understand the architecture', duration: '15-20 min' },
  { icon: Code, label: 'Setup', description: 'Configure your environment and install dependencies', duration: '30-45 min' },
  { icon: Zap, label: 'Implement', description: 'Deploy the core implementation step by step', duration: '1-2 hrs' },
  { icon: ShieldCheck, label: 'Verify', description: 'Run tests and validate the production setup', duration: '20-30 min' },
  { icon: Check, label: 'Ship', description: 'Go live with a production-grade implementation', duration: '10-15 min' },
];

export const BlueprintTimeline = ({ product }: Props) => {
  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-4">Implementation Path</h2>
        <h3 className="text-3xl font-extrabold tracking-tight text-[#0b1c30]">How It Works</h3>
        {product.estimatedImplementationTime && (
          <p className="text-sm text-[#424754] font-semibold mt-3">
            Estimated total time: {product.estimatedImplementationTime}
          </p>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {/* Vertical line */}
        <div className="absolute left-[23px] top-0 bottom-0 w-px bg-[#c2c6d6]/30 hidden sm:block" />

        <div className="space-y-8">
          {TIMELINE_STEPS.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.35, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-5 text-left"
              >
                <div className="relative z-10 shrink-0">
                  <div className="w-[46px] h-[46px] rounded-2xl bg-white border border-[#c2c6d6]/30 flex items-center justify-center shadow-sm">
                    <IconComponent size={16} className="text-[#0b1c30]" />
                  </div>
                </div>

                <div className="flex-1 min-w-0 pt-2">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-base font-extrabold text-[#0b1c30]">{step.label}</h4>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#424754]/50 bg-bg-secondary px-2 py-0.5 rounded-full border border-[#c2c6d6]/20">
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#424754] font-semibold">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};
