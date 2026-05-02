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
            <h2 className="mb-8 leading-tight tracking-tighter">Let's Build <br /><span className="text-brand-primary italic">Together</span></h2>
            <p className="text-white/40 text-xl md:text-2xl max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
              Open for strategic ventures, product collaborations, and enterprise partnerships.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6">
              <MagneticButton strength={0.2}>
                <a 
                  href="#contact" 
                  className="px-10 py-5 bg-white text-black rounded-3xl font-bold text-lg hover:scale-[1.02] transition-all shadow-xl"
                >
                  Collaborate
                </a>
              </MagneticButton>
              <MagneticButton strength={0.2}>
                <a 
                  href="#contact" 
                  className="px-10 py-5 glass-card border-white/10 text-white rounded-3xl font-bold text-lg hover:bg-white/5 transition-all shadow-xl"
                >
                  Contact
                </a>
              </MagneticButton>
              <MagneticButton strength={0.2}>
                <a 
                  href="#contact" 
                  className="px-10 py-5 glass-card border-white/10 text-white rounded-3xl font-bold text-lg hover:bg-white/5 transition-all shadow-xl text-brand-primary hover:text-white"
                >
                  Partnership
                </a>
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};
