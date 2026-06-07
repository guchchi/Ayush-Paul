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
      className="p-8 md:p-12 bg-white rounded-[32px] border border-gray-200 flex flex-col items-center justify-center text-center space-y-4 shadow-sm"
    >
      <div className="w-16 h-16 rounded-full bg-red-500/5 flex items-center justify-center text-red-500 mb-4 border border-red-100 shadow-sm">
        <ShieldAlert size={24} />
      </div>
      <h3 className="text-xl font-bold tracking-tight text-[#000000]">{title}</h3>
      <p className="text-sm font-medium text-[#424754] max-w-sm">
        No records were found in the master database. Awaiting Admin panel synchronization.
      </p>
      <div className="pt-4 text-[10px] uppercase font-bold tracking-widest text-[#0058be]">
        Strict Architecture Enforced
      </div>
    </motion.div>
  );
};
