import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { MagneticButton } from '../ui/MagneticButton';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VARIANTS } from '../../lib/motion-presets';

export const HomeFinalCTASection = () => {
  return (
    <Section id="final-cta" className="py-40 text-center relative overflow-hidden border-t border-white/5" glowVariant="bottom">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_center,rgba(0,194,255,0.06),transparent_70%)] pointer-events-none -z-10" />

      <motion.div
        variants={VARIANTS.fadeUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-6"
      >
        {/* Badge */}
        <motion.div
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-12"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
          Open for Collaboration
        </motion.div>

        {/* Headline */}
        <h2 className="text-[clamp(2.5rem,10vw,6.5rem)] font-extrabold tracking-tighter leading-[0.9] mb-12">
          Choose your path.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-white to-white/40 italic">
            Where do you belong?
          </span>
        </h2>

        <p className="text-xl md:text-2xl text-white/40 font-medium leading-relaxed max-w-3xl mx-auto mb-16">
          This is bigger than one project. This is an evolving ecosystem. 
          Select your entryway and join the journey.
        </p>

        {/* CTAs — Segmented Choices for the 4 Ecosystem Pathways */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <Link
            to="/systems"
            className="px-8 py-5 bg-[#0D0D0D] hover:bg-brand-primary/10 border border-white/10 hover:border-brand-primary/40 text-white rounded-[20px] font-bold text-lg transition-all flex flex-col items-center justify-center gap-1 group shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-primary">I Want To:</span>
            <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">Build <ArrowRight size={16} /></span>
          </Link>

          <Link
            to="/blog"
            className="px-8 py-5 bg-[#0D0D0D] hover:bg-brand-secondary/10 border border-white/10 hover:border-brand-secondary/40 text-white rounded-[20px] font-bold text-lg transition-all flex flex-col items-center justify-center gap-1 group shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-secondary">I Want To:</span>
            <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">Learn <ArrowRight size={16} /></span>
          </Link>

          <Link
            to="/collaborate"
            className="px-8 py-5 bg-[#0D0D0D] hover:bg-white/10 border border-white/10 hover:border-white/30 text-white rounded-[20px] font-bold text-lg transition-all flex flex-col items-center justify-center gap-1 group shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">I Want To:</span>
            <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">Collaborate <ArrowRight size={16} /></span>
          </Link>

          <Link
            to="/collaborate"
            onClick={() => { window.location.href = 'mailto:hello.ayushpaul.in?subject=Partnership%20Inquiry'; }}
            className="px-8 py-5 bg-white text-black hover:bg-white/90 border border-transparent rounded-[20px] font-bold text-lg transition-all flex flex-col items-center justify-center gap-1 group shadow-[0_15px_40px_rgba(255,255,255,0.1)]"
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/50">I Want To:</span>
            <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">Partner <ArrowRight size={16} /></span>
          </Link>
        </div>
      </motion.div>
    </Section>
  );
};

export default HomeFinalCTASection;
