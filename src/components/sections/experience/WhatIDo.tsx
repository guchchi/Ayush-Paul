import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../../ui/Section';
import { ServiceCards } from './ServiceCards';
import { Sparkles } from 'lucide-react';
import { VARIANTS } from '../../../lib/motion-presets';

export const WhatIDo = () => {
  return (
    <Section id="experience" glowVariant="side" className="relative">

      <div className="max-w-4xl mb-24 text-center mx-auto">
        <motion.div
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-8"
        >
          <Sparkles size={14} className="animate-pulse" />
          My Core Expertise
        </motion.div>
        <motion.h2 
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="tracking-tighter mb-10 leading-[1.1]"
        >
          Turning Vision Into <br />
          <span className="text-brand-primary italic">Digital Excellence</span>
        </motion.h2>
        <motion.p 
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-white/40 text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto font-medium"
        >
          I build high-performance products at the intersection of AI, hardware, and engineering. 
          Focused on delivering high-signal, production-grade results.
        </motion.p>
      </div>

      <ServiceCards />
    </Section>
  );
};
