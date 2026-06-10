import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Info, ArrowRight } from 'lucide-react';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

export const BlueprintProblemNarrative = ({ product }: Props) => {
  if (!product.problemSolved) return null;

  const categoryName = product.category || 'this area';

  const painPoints = [
    `You invest time and effort into ${categoryName.toLowerCase()}.`,
    `Nothing seems to move the needle.`,
    `Results stay flat.`,
  ];

  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <div className="lg:col-span-7 text-left">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#424754]/60 mb-5">The Problem</h2>
          <h3 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-[#0b1c30] leading-[1.05] mb-8">
            Why Most People<br />
            <span className="text-[#c62828]">Struggle</span>
          </h3>

          <div className="space-y-2 mb-8">
            {painPoints.map((point, idx) => (
              <p key={idx} className="text-lg sm:text-xl text-[#0b1c30] font-semibold leading-relaxed">
                {point}
              </p>
            ))}
          </div>

          <div className="border-l-4 border-[#c62828] pl-5 py-2 mb-8">
            <p className="text-base text-[#424754] leading-relaxed font-medium">
              The issue isn't your effort. Most resources explain concepts — they don't provide <span className="font-bold text-[#0b1c30]">execution systems</span> you can implement immediately.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#fff8f8] border border-red-100">
            <div className="flex items-start gap-3">
              <Info size={16} className="text-[#c62828] shrink-0 mt-0.5" />
              <p className="text-sm text-[#c62828] font-semibold leading-relaxed">
                {product.problemSolved}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white border border-[#c2c6d6]/25 rounded-[32px] p-10 shadow-sm"
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={28} className="text-red-500" />
              </div>
              <h4 className="text-2xl font-extrabold text-[#0b1c30] mb-4">The Reality</h4>
              <p className="text-base text-[#424754] font-semibold leading-relaxed max-w-sm mx-auto">
                Most spend 80% of their time researching and only 20% executing. This blueprint flips that ratio.
              </p>
              <div className="flex items-center justify-center gap-2 mt-6 text-sm font-bold text-[#0058be]">
                This blueprint fixes that <ArrowRight size={14} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
