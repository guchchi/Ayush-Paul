import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { Section } from '../ui/Section';
import { MagneticButton } from '../ui/MagneticButton';
import { VARIANTS, EASING } from '../../lib/motion-presets';
import { Link } from 'react-router-dom';

export const FinalCTASection = () => {
  return (
    <Section id="final-cta" glowVariant="bottom" className="relative py-32 border-t border-white/5 bg-[#0A0A0A]">
      <div className="flex flex-col items-center text-center max-w-5xl mx-auto px-6">
        <motion.div
          variants={VARIANTS.scaleUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="glass-card p-16 md:p-24 rounded-[48px] border border-white/5 w-full relative shadow-2xl bg-[#0D0D0E]"
        >
          <div className="relative z-10 flex flex-col items-center space-y-8">
            
            {/* Status indicators */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" /> 
              Secure Pipeline Operational
            </div>

            {/* Premium editorial headline */}
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight max-w-2xl mx-auto">
              Initiate <span className="text-brand-primary">Ecosystem Discussions.</span>
            </h2>
            
            <p className="text-white/40 text-lg md:text-xl max-w-xl mx-auto font-medium leading-relaxed">
              We collaborate with research institutions, deep-tech founders, and digital system operators to formulate next-generation infrastructure.
            </p>

            {/* Minimal button CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-6">
              <MagneticButton strength={0.15}>
                <Link 
                  to="/contact" 
                  className="px-10 py-5 bg-white text-black rounded-2xl font-bold text-base hover:bg-brand-primary hover:text-white transition-all shadow-xl flex items-center gap-2.5 group"
                >
                  Initiate Synchronisation <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </MagneticButton>

              <MagneticButton strength={0.15}>
                <a 
                  href="mailto:hello.ayushishere@gmail.com" 
                  className="px-10 py-5 glass-card border-white/10 text-white rounded-2xl font-bold text-base hover:bg-white/5 transition-all flex items-center gap-2.5"
                >
                  <Mail size={18} className="text-white/40" /> Direct Protocol
                </a>
              </MagneticButton>
            </div>

            {/* Bottom trust seal */}
            <div className="pt-8 text-[9px] font-bold uppercase tracking-[0.3em] text-white/20 flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-brand-primary/50" /> End-to-End Encryption • Zero Clutter
            </div>

          </div>
        </motion.div>
      </div>
    </Section>
  );
};
