import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Play } from 'lucide-react';
import type { Product } from '../../types';

interface Props {
  product: Product;
  onGetAccess: () => void;
  onWatchVideo: () => void;
  hasVideo: boolean;
}

export const BlueprintFinalCTASection = ({ product, onGetAccess, onWatchVideo, hasVideo }: Props) => {
  return (
    <section className="relative overflow-hidden rounded-[32px] bg-[#0b1c30]">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#d1f34d] rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 py-20 sm:py-24 px-8 sm:px-16 text-center"
      >
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-white leading-[1.05] mb-4">
          Stop researching.<br />
          <span className="text-[#d1f34d]">Start building.</span>
        </h2>
        <p className="text-lg text-white/70 font-semibold mt-5 mb-12 max-w-lg mx-auto">
          Get instant access and start executing today. No fluff, no waiting — just a production-ready implementation.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onGetAccess}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#d1f34d] text-[#0b1c30] font-extrabold text-sm uppercase tracking-wider hover:bg-[#c0e045] hover:scale-105 transition-all shadow-lg cursor-pointer border-none"
          >
            Get Instant Access <ArrowRight size={14} />
          </button>

          {hasVideo && (
            <button
              onClick={onWatchVideo}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/10 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/20 transition-all cursor-pointer border border-white/20"
            >
              <Play size={14} /> Watch Video
            </button>
          )}
        </div>

        <p className="text-xs text-white/40 font-semibold mt-8">
          Lifetime access · Instant delivery · Updated regularly
        </p>
      </motion.div>
    </section>
  );
};
