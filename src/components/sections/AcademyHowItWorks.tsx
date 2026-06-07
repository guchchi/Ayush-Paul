import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Code2, Play, ArrowRight } from 'lucide-react';

const steps = [
  {
    n: '01',
    title: 'Learn',
    description: 'Understand the foundational principles, architectural frameworks, and structures behind robust systems.',
    icon: BookOpen,
    color: '#0058be',
    bg: '#eff4ff',
    border: '#dce9ff',
  },
  {
    n: '02',
    title: 'Build',
    description: 'Apply concepts step-by-step through guided coding configurations, playbooks, and sandbox setups.',
    icon: Code2,
    color: '#558b2f',
    bg: '#f0fbe8',
    border: '#e1f7d2',
  },
  {
    n: '03',
    title: 'Execute',
    description: 'Deploy custom rules, automation triggers, and blueprints directly into your own live workflows.',
    icon: Play,
    color: '#ff8000',
    bg: '#fff4eb',
    border: '#ffe9d6',
  },
];

export const AcademyHowItWorks = () => {
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
            <span className="tracking-[0.22em]">Process</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]"
          >
            Learn Through<br />
            Application
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#424754] text-base md:text-lg font-medium leading-relaxed"
        >
          Systems education is only valuable when applied. Our framework forces real building, helping you move from understanding to operational execution.
        </motion.p>
      </div>

      {/* 3 Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="relative flex items-center w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -5 }}
                className="group bg-white border border-[#c2c6d6]/30 rounded-[32px] p-8 flex flex-col gap-6 shadow-sm hover:shadow-ambient hover:border-[#0058be]/20 transition-all duration-300 w-full h-full relative"
              >
                {/* Visual Step Number Backdrop */}
                <span className="absolute top-6 right-8 text-[3rem] font-black text-gray-100 select-none opacity-80 group-hover:scale-105 transition-transform duration-300 group-hover:text-gray-200/40 leading-none">
                  {step.n}
                </span>

                {/* Icon wrapper */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shrink-0 border"
                  style={{
                    backgroundColor: step.bg,
                    borderColor: step.border,
                  }}
                >
                  <Icon size={20} style={{ color: step.color }} />
                </div>

                {/* Title and description */}
                <div className="flex flex-col gap-3 text-left">
                  <h3 className="text-xl font-extrabold text-[#0b1c30] tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#424754] leading-relaxed font-semibold">
                    {step.description}
                  </p>
                </div>
              </motion.div>

              {/* Connecting arrow for desktop (except last card) */}
              {i < 2 && (
                <div className="absolute top-1/2 -translate-y-1/2 -right-6 z-20 text-[#c2c6d6]/65 hidden md:block select-none pointer-events-none">
                  <ArrowRight size={20} className="text-gray-300" />
                </div>
              )}
            </div>
          );
        })}
      </div>

    </section>
  );
};
