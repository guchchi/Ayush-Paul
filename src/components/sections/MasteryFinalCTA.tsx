import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Users, ArrowRight, ArrowUpRight } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';

interface MasteryFinalCTAProps {
  onExploreCoursesClick: () => void;
  onBookSessionClick: () => void;
  trackEvent?: (eventName: string, payload?: Record<string, any>) => void;
}

export const MasteryFinalCTA = ({ 
  onExploreCoursesClick, 
  onBookSessionClick,
  trackEvent 
}: MasteryFinalCTAProps) => {
  return (
    <section className="py-16 md:py-20 px-6 max-w-5xl mx-auto relative z-10 border-t border-[#c2c6d6]/20">
      
      {/* Background Soft Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="w-[300px] h-[300px] bg-[#0058be]/5 rounded-full filter blur-[100px]" />
      </div>

      <div className="bg-[#0b1c30] text-white border border-[#0b1c30] rounded-[32px] p-10 md:p-16 text-center shadow-md relative overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:hover:-translate-y-[2px] motion-safe:hover:shadow-lg">
        {/* Soft glowing orb on top right */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#0058be]/10 rounded-full filter blur-[80px] pointer-events-none" />
        
        <div className="max-w-2xl mx-auto space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-[#d1f34d] shadow-sm"
          >
            <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full animate-pulse" />
            <span className="tracking-[0.22em]">Start Today</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.06 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-none"
          >
            Ready To<br />
            <span className="text-[#d1f34d]">Build Real Skills?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="text-white/85 text-xs md:text-sm leading-relaxed font-semibold max-w-xl mx-auto"
          >
            Start with a course, join a workshop, or book private 1-on-1 sessions. Every purchase lives in your Vault permanently.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <MagneticButton>
              <button
                onClick={() => {
                  trackEvent?.('CTA Clicked', { location: 'Mastery Final CTA', label: 'Explore Courses' });
                  onExploreCoursesClick();
                }}
                className="px-8 py-4 bg-[#d1f34d] hover:bg-[#c0e045] text-black rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 group cursor-pointer border-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:hover:-translate-y-[2px] motion-safe:hover:shadow-[0_10px_20px_-5px_rgba(209,243,77,0.4)]"
              >
                <BookOpen size={14} />
                Explore Courses
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </MagneticButton>

            <MagneticButton>
              <button
                onClick={() => {
                  trackEvent?.('CTA Clicked', { location: 'Mastery Final CTA', label: 'Book 1-on-1 Learning' });
                  onBookSessionClick();
                }}
                className="px-8 py-4 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:hover:-translate-y-[2px]"
              >
                <Users size={14} />
                Book 1-on-1 Learning
                <ArrowUpRight size={14} className="text-[#d1f34d]" />
              </button>
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      {/* Bottom Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center text-[10px] font-bold uppercase tracking-[0.28em] text-[#424754]/30 select-none pt-12"
      >
        Learn. Build. Apply. Repeat.
      </motion.p>

    </section>
  );
};
