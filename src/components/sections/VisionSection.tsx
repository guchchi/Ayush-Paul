import React from 'react';
import { motion } from 'motion/react';
import { Rocket, Cpu, Sparkles, Globe } from 'lucide-react';
import { Section } from '../ui/Section';
import { VARIANTS } from '../../lib/motion-presets';

const highlights = [
  { title: "Student Innovator", icon: <Rocket className="text-brand-primary" />, desc: "Bridging academia and real-world tech." },
  { title: "Robotics Developer", icon: <Cpu className="text-brand-secondary" />, desc: "Building hardware that thinks." },
  { title: "AI Builder", icon: <Sparkles className="text-brand-primary" />, desc: "Crafting intelligent software solutions." },
  { title: "Future Engineer", icon: <Globe className="text-brand-secondary" />, desc: "Solving global problems with code." },
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
            Our Vision
          </motion.div>
          <motion.h2 variants={VARIANTS.fadeUp} className="leading-tight tracking-tighter">
            Student Entrepreneur <br />
            with a <span className="text-brand-primary">Visionary Mindset</span>
          </motion.h2>
          <motion.div variants={VARIANTS.fadeUp} className="space-y-6 text-xl text-white/50 leading-relaxed max-w-xl font-medium">
            <p>
              I'm Ayush Paul, a 12th PCM student who doesn't just study science—I apply it. My journey started with a curiosity for how things work, leading me into the worlds of <span className="text-white">Web Development</span>, <span className="text-white">AI</span>, and <span className="text-white">Robotics</span>.
            </p>
            <p>
              As a student entrepreneur, I bridge the gap between academic learning and real-world application. Whether it's coding a complex AI application or building an Arduino-powered robot, my goal is always to innovate and solve problems.
            </p>
          </motion.div>
          
          <motion.div variants={VARIANTS.fadeUp} className="flex items-center gap-12 pt-4">
            <div>
              <div className="text-4xl font-bold text-white tracking-tighter">50+</div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Projects</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div>
              <div className="text-4xl font-bold text-white tracking-tighter">4+</div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Years Exp</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div>
              <div className="text-4xl font-bold text-white tracking-tighter">20+</div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Clients</div>
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