import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Cpu, Globe, Code, Bot, Library, Users, Target } from 'lucide-react';

const OUTCOMES = [
  { icon: BookOpen, value: '12+', label: 'Skills Covered', desc: 'AI, robotics, design, development, automation, and more' },
  { icon: Library, value: '8+', label: 'Courses Planned', desc: 'Self-paced tracks from beginner to advanced' },
  { icon: Globe, value: '4+', label: 'Workshops Planned', desc: 'Live cohort-based build sessions' },
  { icon: Code, value: '6+', label: 'Blueprints Available', desc: 'Downloadable templates, prompts, and systems' },
  { icon: Cpu, value: '3+', label: 'Robotics Projects', desc: 'Hardware-software integrated systems' },
  { icon: Users, value: '5+', label: 'Real Projects Built', desc: 'Production systems deployed and running' },
];

export const MasteryOutcomes = () => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end mb-16 text-left">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-6"
          >
            <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full" />
            <span className="tracking-[0.22em]">Builder Outcomes</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]"
          >
            Built on Real<br />
            <span className="text-[#d1f34d]">Projects & Outcomes</span>
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#424754] text-base leading-relaxed font-medium"
        >
          Every skill taught here comes from real systems that have been built, deployed, and tested. This is not theory — it is the infrastructure behind actual products, robots, and platforms.
        </motion.p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-left">
        {OUTCOMES.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 bg-white border border-[#c2c6d6]/30 rounded-2xl shadow-sm hover:shadow-ambient hover:scale-[1.02] hover:-translate-y-1 hover:border-[#d1f34d] transition-all duration-300 flex flex-col items-start text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-[#d1f34d]/10 border border-[#d1f34d]/20 text-[#d1f34d] flex items-center justify-center mb-4">
                <Icon size={16} />
              </div>
              <span className="text-2xl font-extrabold text-[#0b1c30] tracking-tight leading-none mb-1">
                {item.value}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/70 mb-1">
                {item.label}
              </span>
              <span className="text-[10px] text-[#424754]/50 font-semibold leading-snug">
                {item.desc}
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};