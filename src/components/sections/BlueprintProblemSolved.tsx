import React from 'react';
import { motion } from 'motion/react';
import { Frown, Sparkles } from 'lucide-react';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

export const BlueprintProblemSolved = ({ product }: Props) => {
  if (!product.problemSolved) return null;

  return (
    <section>
      <div className="text-center mb-10">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-3">The Problem</h2>
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0b1c30]">What You're Currently Facing</h3>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="p-8 rounded-[32px] bg-white border border-red-100 shadow-sm relative overflow-hidden text-left">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-red-300" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center">
              <Frown size={20} className="text-red-500" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 block">The Struggle</span>
              <span className="text-xs font-bold text-[#424754]/70">Before this blueprint</span>
            </div>
          </div>
          <p className="text-base sm:text-lg font-semibold text-[#424754] leading-relaxed">{product.problemSolved}</p>
        </div>
        <div className="p-8 rounded-[32px] bg-white border border-emerald-100 shadow-sm relative overflow-hidden text-left">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-300" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <Sparkles size={20} className="text-emerald-500" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">The Solution</span>
              <span className="text-xs font-bold text-[#424754]/70">After implementing</span>
            </div>
          </div>
          <p className="text-base sm:text-lg font-extrabold text-[#0b1c30] leading-relaxed">Full implementation deployed and running — stop struggling, start shipping.</p>
        </div>
      </motion.div>
    </section>
  );
};
