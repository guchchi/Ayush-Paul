import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { VARIANTS } from '../../lib/motion-presets';

export const HomeAboutSection = () => {
  return (
    <Section id="home-about" className="py-24 md:py-32 border-t border-white/5 bg-[#0A0A0A]/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Attribution & Capability Bridge */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Reframe & Attribution */}
          <div>
            <motion.div
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              System Attribution
            </motion.div>

            <motion.h2
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold tracking-tighter leading-[0.9] mb-8"
            >
              Not a portfolio.<br />
              <span className="text-brand-primary italic">A platform.</span>
            </motion.h2>

            <motion.div
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-6 text-lg sm:text-xl text-white/50 font-medium leading-relaxed max-w-xl mb-10"
            >
              <p>
                Every physical robot, digital dashboard, and embedded system showcased in this ecosystem was engineered by <strong className="text-white">Ayush Paul</strong>.
              </p>
              <p>
                The mission is straightforward: Build production-grade hardware and software, then open-source the blueprints so other student creators can skip years of trial and error and launch their own systems faster.
              </p>
            </motion.div>

            {/* Audience Pathways Bar (compressed) */}
            <motion.div
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap gap-3 items-center border-t border-b border-white/5 py-5 max-w-xl"
            >
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mr-2">Built For:</span>
              <span className="px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-wider">
                Builders
              </span>
              <span className="px-3 py-1 rounded-full bg-[#7B61FF]/10 border border-[#7B61FF]/20 text-[#7B61FF] text-[10px] font-bold uppercase tracking-wider">
                Learners
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-bold uppercase tracking-wider">
                Collaborators
              </span>
              <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider hidden sm:inline-block">
                Sponsors
              </span>
            </motion.div>
          </div>

          {/* Right Column: Operational System Registry */}
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 sm:p-10 rounded-[32px] border-white/10 relative overflow-hidden"
          >
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#7B61FF]/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between mb-8 pb-6 border-b border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">System Registry</h3>
              <span className="text-[9px] font-mono font-bold tracking-widest text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-2.5 py-1 rounded">VERIFIED CAPABILITY</span>
            </div>

            <div className="relative z-10 space-y-8">
              {/* Category 1 */}
              <div className="flex gap-5 items-start group">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0 mt-1 transition-colors group-hover:bg-brand-primary/20 group-hover:border-brand-primary/40">
                  <span className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(0,194,255,0.8)]" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base mb-1.5 tracking-tight group-hover:text-brand-primary transition-colors">Physical Systems</h4>
                  <p className="text-white/50 text-sm leading-relaxed">Designing modular chassis, actuators, and ESP32-based autonomous hardware capable of closed-loop control.</p>
                </div>
              </div>

              {/* Category 2 */}
              <div className="flex gap-5 items-start group">
                <div className="w-10 h-10 rounded-full bg-[#7B61FF]/10 border border-[#7B61FF]/20 flex items-center justify-center shrink-0 mt-1 transition-colors group-hover:bg-[#7B61FF]/20 group-hover:border-[#7B61FF]/40">
                  <span className="w-2 h-2 rounded-full bg-[#7B61FF] shadow-[0_0_10px_rgba(123,97,255,0.8)]" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base mb-1.5 tracking-tight group-hover:text-[#7B61FF] transition-colors">Software Infrastructure</h4>
                  <p className="text-white/50 text-sm leading-relaxed">Engineering high-performance web platforms, real-time telemetry dashboards, and scalable API microservices.</p>
                </div>
              </div>

              {/* Category 3 */}
              <div className="flex gap-5 items-start group">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-1 transition-colors group-hover:bg-white/10 group-hover:border-white/30">
                  <span className="w-2 h-2 rounded-full bg-white/40" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base mb-1.5 tracking-tight group-hover:text-white transition-colors">Open Knowledge</h4>
                  <p className="text-white/50 text-sm leading-relaxed">Documenting system architectures, build chronicles, and publishing open blueprints to accelerate learners.</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </Section>
  );
};

export default HomeAboutSection;
