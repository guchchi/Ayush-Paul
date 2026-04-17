import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../../ui/Section';
import { BookOpen, GraduationCap } from 'lucide-react';
import { VARIANTS } from '../../../lib/motion-presets';

export const Courses = () => {
  return (
    <Section id="courses" className="bg-white/[0.02]">
      <div className="layout-grid lg:items-center">
        <motion.div
           variants={VARIANTS.staggerContainer}
           initial="initial"
           whileInView="animate"
           viewport={{ once: true }}
           className="col-span-full lg:col-span-6"
        >
          <motion.div variants={VARIANTS.fadeUp} className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-8">
            <GraduationCap size={14} />
            Academic Foundation
          </motion.div>
          <motion.h2 variants={VARIANTS.fadeUp} className="mb-12 tracking-tighter leading-none">Learning <br /><span className="text-brand-primary">Journey</span></motion.h2>
          <div className="space-y-10">
            {[
              {
                title: "JEE Preparation",
                desc: "Mastering Physics, Chemistry, and Mathematics for higher engineering research.",
                status: "Ongoing",
              },
              {
                title: "Advanced Programming",
                desc: "Deep diving into system architecture, AI algorithms, and full-stack dev.",
                status: "Continuous",
              },
              {
                title: "Robotics Research",
                desc: "Exploring the intersection of AI and hardware for autonomous systems.",
                status: "Passionate",
              },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                variants={VARIANTS.fadeUp}
                className="flex gap-8 group"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-brand-primary group-hover:bg-brand-primary group-hover:text-black transition-all duration-500">
                  0{i + 1}
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-xl font-bold tracking-tight">{item.title}</h3>
                    <div className="px-2.5 py-1 rounded-md bg-brand-primary/10 text-[9px] font-bold uppercase tracking-widest text-brand-primary border border-brand-primary/20">
                      {item.status}
                    </div>
                  </div>
                  <p className="text-white/40 text-lg leading-relaxed font-medium">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={VARIANTS.scaleUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="col-span-full lg:col-span-6 p-12 md:p-16 rounded-[60px] glass-card border border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-brand-primary/5 blur-[80px] -z-10" />
          
          <div className="flex items-center gap-6 mb-12">
            <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
              <BookOpen size={32} />
            </div>
            <h3 className="text-3xl font-bold tracking-tight">Research <br />Interests</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {["Quantum Computing", "Neural Networks", "Space Tech", "Renewable Energy", "Bio-Robotics", "Cybersecurity"].map((interest, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
                className="px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-xs font-bold uppercase tracking-widest text-white/50 cursor-default transition-all"
              >
                {interest}
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 p-8 rounded-3xl bg-brand-primary/5 border border-brand-primary/10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary/60">Vision: Engineering a better tomorrow.</p>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};
