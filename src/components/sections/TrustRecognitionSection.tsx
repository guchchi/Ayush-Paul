import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { VARIANTS } from '../../lib/motion-presets';

export const TrustRecognitionSection = () => {
  const badges = [
    { name: "Inspire MANAK Award", description: "National Level Innovation" },
    { name: "WRO Participant", description: "World Robot Olympiad" },
    { name: "Newspaper Featured", description: "Tech Innovator" },
    { name: "State Exhibitions", description: "Science & Tech" }
  ];

  return (
    <Section id="trust" glowVariant="center">
      <div className="section-header">
        <motion.div 
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="badge"
        >
          Trust & Recognition
        </motion.div>
        <motion.h2 
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          Institutional <span className="text-brand-primary">Credibility</span>
        </motion.h2>
      </div>

      <motion.div 
        variants={VARIANTS.staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {badges.map((badge, i) => (
          <motion.div
            key={i}
            variants={VARIANTS.fadeUp}
            whileHover={VARIANTS.lift.whileHover}
            className="glass-card p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center group min-h-[160px]"
          >
            <div className="font-bold text-lg md:text-xl text-white group-hover:text-brand-primary transition-colors mb-2">
              {badge.name}
            </div>
            <div className="text-xs uppercase tracking-widest text-white/40 font-bold">
              {badge.description}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};
