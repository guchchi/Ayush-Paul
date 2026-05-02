import React from 'react';
import { motion } from 'motion/react';
import { Rocket, Cpu, Sparkles, Globe } from 'lucide-react';
import { Section } from '../ui/Section';
import { VARIANTS } from '../../lib/motion-presets';

const highlights = [
  { title: "Product Architect", icon: <Rocket className="text-brand-primary" />, desc: "Bridging complex systems with high-end digital design." },
  { title: "Autonomous Systems", icon: <Cpu className="text-brand-secondary" />, desc: "Building hardware-software bridges for the real world." },
  { title: "AI Infrastructure", icon: <Sparkles className="text-brand-primary" />, desc: "Crafting intelligent, scalable enterprise solutions." },
  { title: "Global Scale", icon: <Globe className="text-brand-secondary" />, desc: "Engineering platforms built for the future." },
];

export const VisionSection = () => {
  return (
    <Section id="about" glowVariant="orbs">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <motion.div
          variants={VARIANTS.staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="space-y-8"
        >
          <motion.div variants={VARIANTS.fadeUp} className="inline-block px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest">
            The Manifesto
          </motion.div>
          <motion.h2 variants={VARIANTS.fadeUp} className="leading-tight tracking-tighter">
            Founder-Led <br />
            <span className="text-brand-primary">Engineering Paradigm</span>
          </motion.h2>
          <motion.div variants={VARIANTS.fadeUp} className="space-y-6 text-xl text-white/50 leading-relaxed max-w-xl font-medium">
            <p>
              We are moving into an era where hardware, software, and AI are converging. The systems of tomorrow require a new breed of engineering—one that doesn't just write code, but architectures complete <span className="text-white">ecosystems</span>.
            </p>
            <p>
              By bridging the gap between deep technical implementation and high-level product strategy, we build autonomous systems and digital infrastructure designed to scale from inception to enterprise execution.
            </p>
          </motion.div>
          
          <motion.div variants={VARIANTS.fadeUp} className="flex items-center gap-12 pt-4">
            <div>
              <div className="text-4xl font-bold text-white tracking-tighter">50+</div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Deployed Systems</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div>
              <div className="text-4xl font-bold text-white tracking-tighter">4+</div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Years R&D</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div>
              <div className="text-4xl font-bold text-white tracking-tighter">20+</div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Enterprise Partners</div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={VARIANTS.staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {highlights.map((item, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              whileHover={VARIANTS.lift.whileHover}
              transition={{ 
                ...VARIANTS.fadeUp.transition,
                delay: i * 0.1 
              }}
              className="glass-card p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-white/5 hover:border-brand-primary/30 transition-all group items-center text-center sm:text-left w-full h-full min-w-0 break-words overflow-hidden"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:bg-brand-primary/10 transition-all duration-500 mx-auto sm:mx-0 shrink-0">
                {item.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-tight break-words">{item.title}</h3>
              <p className="text-white/40 leading-relaxed font-medium text-sm md:text-base break-words">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
};