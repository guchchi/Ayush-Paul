import React from 'react';
import { motion } from 'motion/react';
import { Layers, Lightbulb, Calendar } from 'lucide-react';

const pillars = [
  {
    icon: Layers,
    title: 'Structured',
    description: 'A clear, linear learning progression designed to prevent overwhelm. Every module builds directly upon the previous lesson.',
  },
  {
    icon: Lightbulb,
    title: 'Practical',
    description: 'Zero theoretical bloat. Focused strictly on building actual templates, writing code, and compiling working workflows.',
  },
  {
    icon: Calendar,
    title: 'Flexible',
    description: 'Learn at your own pace through high-definition pre-recorded materials, with access to live strategy audits and cohort checks.',
  },
];

export const AcademyExperience = () => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20">
      
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
            <span className="w-1.5 h-1.5 bg-[#0058be] rounded-full" />
            <span className="tracking-[0.22em]">Experience</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]"
          >
            Built For<br />
            Practical Growth
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#424754] text-base md:text-lg font-medium leading-relaxed"
        >
          We do not sell video playlists. We provide structured environments designed to help creators and builders develop genuine capabilities.
        </motion.p>
      </div>

      {/* 3 Experience Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{
                y: -6,
                scale: 1.015,
                borderColor: '#0058be',
              }}
              className="group bg-white border border-[#c2c6d6]/30 rounded-[32px] p-8 flex flex-col gap-6 transition-all duration-300 shadow-sm hover:shadow-ambient"
            >
              {/* Icon wrapper */}
              <div className="w-12 h-12 rounded-2xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shrink-0">
                <Icon size={20} className="text-[#0058be]" />
              </div>

              {/* Title & description */}
              <div className="flex flex-col gap-3 text-left">
                <h3 className="text-xl font-extrabold text-[#0b1c30] tracking-tight">
                  {p.title}
                </h3>
                <p className="text-xs text-[#424754] leading-relaxed font-semibold">
                  {p.description}
                </p>
              </div>

              {/* Bottom blue hover accent line */}
              <div className="mt-auto">
                <div className="h-0.5 w-8 rounded-full bg-[#c2c6d6]/30 group-hover:w-full group-hover:bg-[#0058be] transition-all duration-500" />
              </div>
            </motion.div>
          );
        })}
      </div>

    </section>
  );
};
