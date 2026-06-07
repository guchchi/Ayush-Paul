import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Cpu, Globe, RefreshCw } from 'lucide-react';

const WHY_STEPS = [
  {
    num: '01',
    label: 'Learn',
    icon: BookOpen,
    desc: 'Acquire high-leverage design and engineering frameworks that stay relevant and compound for years.',
    color: '#0058be',
    bg: '#eff4ff',
    border: '#dce9ff'
  },
  {
    num: '02',
    label: 'Build',
    icon: Cpu,
    desc: 'Immediately configure sitemaps, prompt packages, checkout pipelines, and custom webhooks.',
    color: '#6b35ff',
    bg: '#f3efff',
    border: '#ebe5ff'
  },
  {
    num: '03',
    label: 'Apply',
    icon: Globe,
    desc: 'Deploy the pre-built boilerplate assets directly into production to power real products and SaaS sites.',
    color: '#558b2f',
    bg: '#f0fbe8',
    border: '#e1f7d2'
  },
  {
    num: '04',
    label: 'Repeat',
    icon: RefreshCw,
    desc: 'Layer on additional organic SEO traffic structures and API automation pipelines to scale authority.',
    color: '#ff8000',
    bg: '#fff4eb',
    border: '#ffe9d6'
  }
];

export const MasteryWhy = () => {
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
            <span className="tracking-[0.22em]">Why Mastery</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]"
          >
            Learn. Build.<br />
            Apply. Repeat.
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#424754] text-base leading-relaxed font-medium"
        >
          We bypass generic educational philosophy. Mastery is structured around a continuous loop of execution and actual deployment.
        </motion.p>
      </div>

      {/* Benefit Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {WHY_STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="p-8 bg-white border border-[#c2c6d6]/30 rounded-[28px] shadow-sm hover:shadow-ambient hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between relative"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-extrabold tracking-widest text-[#424754]/50 bg-bg-secondary px-2.5 py-0.5 rounded-full">
                    STEP {step.num}
                  </span>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105"
                    style={{ 
                      backgroundColor: step.bg, 
                      borderColor: step.border,
                      color: step.color 
                    }}
                  >
                    <Icon size={16} />
                  </div>
                </div>

                <h3 className="text-lg font-extrabold text-[#0b1c30] tracking-tight mb-2">
                  {step.label}
                </h3>
                <p className="text-xs text-[#424754] leading-relaxed font-semibold">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
