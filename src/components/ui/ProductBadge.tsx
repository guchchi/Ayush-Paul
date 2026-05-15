import React from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

interface ProductBadgeProps {
  className?: string;
  variant?: 'minimal' | 'full';
}

export const ProductBadge = ({ className = "", variant = 'full' }: ProductBadgeProps) => {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl ${className}`}
    >
      <div className="w-6 h-6 rounded-lg bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
        <Zap size={12} className="text-brand-primary" />
      </div>
      <div className="flex flex-col">
        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40 leading-none mb-0.5">Engineered in</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-white leading-none">
          Ayush Paul <span className="text-brand-primary">Lab</span>
        </span>
      </div>
    </motion.div>
  );
};
