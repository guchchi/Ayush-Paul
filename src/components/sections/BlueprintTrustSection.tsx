import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, Target, RefreshCw, Hammer, TrendingUp } from 'lucide-react';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

const TRUST_REASONS = [
  { icon: Hammer, label: 'Built from real implementation', description: 'Not theory — every blueprint comes from actual production deployments and real-world problem solving.' },
  { icon: Zap, label: 'No fluff', description: 'Every page, template, and prompt serves a purpose. No filler content, no theoretical padding.' },
  { icon: Target, label: 'Action-focused', description: 'Designed to be implemented immediately. Download, customize, deploy — in that order.' },
  { icon: RefreshCw, label: 'Regularly updated', description: 'Blueprints evolve with the ecosystem. Updates reflect the latest best practices and tooling.' },
  { icon: ShieldCheck, label: 'Production verified', description: 'Each blueprint has been tested in production environments before being published.' },
  { icon: TrendingUp, label: 'Outcome-driven design', description: 'Every section exists to move you toward a specific, measurable implementation outcome.' },
];

export const BlueprintTrustSection = (_props: Props) => {
  return (
    <section>
      <div className="text-center mb-10">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-3">Why Trust This</h2>
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0b1c30]">Why Trust This Blueprint?</h3>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {TRUST_REASONS.map((reason, idx) => {
          const IconComponent = reason.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-[#c2c6d6]/30 shadow-sm text-left hover:border-[#0058be]/20 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-center mb-4 group-hover:bg-[#0058be] group-hover:border-[#0058be] transition-all">
                <IconComponent size={16} className="text-[#0058be] group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-sm font-extrabold text-[#0b1c30] mb-1.5">{reason.label}</h4>
              <p className="text-[12px] text-[#424754] font-semibold leading-relaxed">{reason.description}</p>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
};
