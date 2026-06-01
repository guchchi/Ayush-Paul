import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { VARIANTS } from '../../lib/motion-presets';

export const SystemEmptyState = ({ title = "System Telemetry Offline" }: { title?: string }) => {
  return (
    <motion.div
      variants={VARIANTS.fadeUp}
      initial="initial"
      animate="animate"
      className="p-8 md:p-12 glass-card rounded-[32px] border border-brand-primary/10 bg-brand-primary/5 flex flex-col items-center justify-center text-center space-y-4"
    >
      <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-4 border border-brand-primary/20">
        <ShieldAlert size={24} />
      </div>
      <h3 className="text-xl font-bold tracking-tight text-white/90">{title}</h3>
      <p className="text-sm font-medium text-white/40 max-w-sm">
        No records were found in the master database. Awaiting Admin panel synchronization.
      </p>
      <div className="pt-4 text-[10px] uppercase font-bold tracking-widest text-brand-primary/60">
        Strict Architecture Enforced
      </div>
    </motion.div>
  );
};
