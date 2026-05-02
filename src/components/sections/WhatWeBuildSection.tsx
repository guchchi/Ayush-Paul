import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { Bot, BookOpen, Video, Code } from 'lucide-react';
import { VARIANTS } from '../../lib/motion-presets';

export const WhatWeBuildSection = () => {
  const offerings = [
    {
      icon: <Bot size={24} />,
      title: "AI Automation",
      description: "Intelligent workflows that scale operations and eliminate manual bottlenecks."
    },
    {
      icon: <BookOpen size={24} />,
      title: "Education Tools",
      description: "Platforms designed to help educators monetize and scale their knowledge."
    },
    {
      icon: <Video size={24} />,
      title: "Creator Systems",
      description: "Digital infrastructure tailored for high-growth content creators."
    },
    {
      icon: <Code size={24} />,
      title: "Digital Products",
      description: "High-signal web and mobile applications built for modern businesses."
    }
  ];

  return (
    <Section id="what-we-build" glowVariant="side">
      <div className="section-header">
        <motion.div 
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="badge"
        >
          Our Offerings
        </motion.div>
        <motion.h2 
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          What We <span className="text-brand-primary">Build</span>
        </motion.h2>
        <motion.p
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center max-w-2xl"
        >
          Engineering solutions that empower creators and scale modern businesses.
        </motion.p>
      </div>

      <motion.div 
        variants={VARIANTS.staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-8 lg:gap-12"
      >
        {offerings.map((item, i) => (
          <motion.div
            key={i}
            variants={VARIANTS.fadeUp}
            whileHover={VARIANTS.lift.whileHover}
            className="glass-card p-10 lg:p-12 border border-white/5 flex flex-col md:flex-row items-start gap-8 group"
          >
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-white/5 flex items-center justify-center text-white group-hover:bg-brand-primary group-hover:text-black transition-all duration-300">
              {item.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-white group-hover:text-brand-primary transition-colors">{item.title}</h3>
              <p className="text-white/50 leading-relaxed font-medium">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};
