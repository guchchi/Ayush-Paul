import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Hammer, Settings, ArrowRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { EASING, DURATION } from '../../../lib/motion-presets';

interface HeroSectionProps {
  onPrimaryAction: () => void;
  isOwned: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onPrimaryAction, isOwned }) => {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Badges */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
        className="flex flex-wrap items-center justify-center gap-3 mb-8"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f2ff] text-[#0058be] text-xs font-semibold uppercase tracking-wider">
          <Hammer size={12} /> Built for Builders
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4f5f7] text-[#424754] text-xs font-semibold uppercase tracking-wider">
          <Sparkles size={12} /> Implementation First
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4f5f7] text-[#424754] text-xs font-semibold uppercase tracking-wider">
          <Settings size={12} /> Systems over Hacks
        </span>
      </motion.div>

      {/* Main Copy */}
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.1 }}
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0b1c30] mb-6 max-w-4xl"
      >
        Stop guessing how to find clients.
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.2 }}
        className="text-lg md:text-xl text-[#424754] mb-10 max-w-2xl leading-relaxed"
      >
        Build a complete client acquisition system—from choosing your niche to signing your first three paying clients.
      </motion.p>

      {/* CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <button
          onClick={onPrimaryAction}
          className={cn(
            "group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-medium text-lg overflow-hidden transition-all duration-300",
            "bg-[#0058be] hover:bg-[#004a9f] hover:shadow-[0_8px_24px_rgba(0,88,190,0.25)] hover:-translate-y-0.5",
          )}
        >
          <span className="relative z-10 flex items-center gap-2">
            {isOwned ? "Continue Building" : "Build My Client System"}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
        </button>
      </motion.div>
    </div>
  );
};
