import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Section } from '../ui/Section';
import { MagneticButton } from '../ui/MagneticButton';
import { VARIANTS, EASING } from '../../lib/motion-presets';

export const CTASection = ({ id = "cta" }: { id?: string }) => {
  return (
    <Section id={id} glowVariant="bottom" className="relative">
      <div className="flex flex-col items-center text-center">
        <motion.div
          variants={VARIANTS.scaleUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="glass-card p-16 md:p-24 rounded-[60px] border border-white/10 w-full max-w-5xl relative shadow-2xl"
        >
          <div className="relative z-10">
            <h2 className="mb-8 leading-tight tracking-tighter">Building something <br /><span className="text-brand-primary italic">Legendary?</span></h2>
            <p className="text-white/40 text-xl md:text-2xl max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
              Currently accepting collaborations for Q2 2024. Let's build a high-signal product that makes an impact.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-10">
              <MagneticButton strength={0.2}>
                <a 
                  href="#contact" 
                  className="px-12 py-6 bg-white text-black rounded-[24px] font-bold text-xl hover:bg-brand-primary hover:text-white transition-all shadow-2xl shadow-white/5 flex items-center gap-3"
                >
                  Start a Conversation <ArrowRight size={24} />
                </a>
              </MagneticButton>
              <div className="flex items-center gap-4 text-white/20 font-bold uppercase tracking-[0.2em] text-[10px]">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" /> Available Now
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};
