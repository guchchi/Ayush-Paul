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

        {/* Headline — "Join" not "Explore" */}
        <h2 className="text-[clamp(3rem,12vw,7.5rem)] font-extrabold tracking-tighter leading-[0.85] mb-12">
          Join What <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-white to-white/40 italic">
            We're Building.
          </span>
        </h2>

        <p className="text-xl md:text-2xl text-white/40 font-medium leading-relaxed max-w-2xl mx-auto mb-16">
          This is a living ecosystem — not a finished product. Sponsors, builders, educators, and founders are joining right now. 
          The earlier you get in, the more you shape it.
        </p>

        {/* Social proof — capacity indicator */}
        <div className="flex items-center justify-center gap-3 mb-16">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A0A0A] bg-white/10 overflow-hidden">
                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" className="w-full h-full object-cover grayscale opacity-50" />
              </div>
            ))}
          </div>
          <div className="text-left">
            <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Current Capacity: 1 Slot Open</div>
            <div className="text-xs text-white/40 font-medium">Joined by 15+ Visionary Builders</div>
          </div>
        </div>

        {/* CTAs — mirrors CollaboratePage Hero */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <MagneticButton>
            <Link
              to="/collaborate"
              className="px-12 py-6 bg-white text-black rounded-[24px] font-bold text-xl flex items-center gap-3 group shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:scale-105 transition-transform"
            >
              Join the Ecosystem <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </MagneticButton>

          <MagneticButton>
            <Link
              to="/systems"
              className="px-12 py-6 glass-card border-white/10 text-white rounded-[24px] font-bold text-xl hover:bg-white/5 transition-all"
            >
              Explore the Work
            </Link>
          </MagneticButton>
        </div>
      </motion.div>
    </Section>
  );
};

export default HomeFinalCTASection;
