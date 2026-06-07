import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Cpu, Globe, RefreshCw, Lock, Compass } from 'lucide-react';

const WHY_STEPS = [
  {
    num: '01',
    label: 'Learn',
    icon: BookOpen,
    desc: 'Acquire practical skills through self-paced courses, live workshops, and private sessions that stay relevant and compound over time.',
    color: '#0b1c30',
    bg: '#f5f5f5',
    border: '#e5e5e5'
  },
  {
    num: '02',
    label: 'Build',
    icon: Cpu,
    desc: 'Apply what you learn immediately. Configure systems, deploy integrations, and create real projects using downloadable templates and blueprints.',
    color: '#0b1c30',
    bg: '#f5f5f5',
    border: '#e5e5e5'
  },
  {
    num: '03',
    label: 'Apply',
    icon: Globe,
    desc: 'Deploy your work into production. Use the systems, templates, and codebases you built to power real products, sites, and automations.',
    color: '#0b1c30',
    bg: '#f5f5f5',
    border: '#e5e5e5'
  },
  {
    num: '04',
    label: 'Repeat',
    icon: RefreshCw,
    desc: 'Iterate and improve. Layer on new capabilities, revisit past courses, and compound your skills across AI, robotics, design, and engineering.',
    color: '#0b1c30',
    bg: '#f5f5f5',
    border: '#e5e5e5'
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
            <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full" />
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
          Mastery is structured around a continuous loop of execution and deployment. Every course includes companion blueprints. Every workshop recording lives in your Vault. Everything you purchase stays yours permanently.
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
              className="p-8 bg-white border border-[#c2c6d6]/30 rounded-[32px] shadow-sm hover:shadow-ambient hover:scale-[1.01] hover:-translate-y-1 hover:border-[#d1f34d] transition-all duration-300 flex flex-col justify-between relative"
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

      {/* Ecosystem callout — Vault + Blueprints */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="mt-16 p-8 bg-[#0b1c30] text-white rounded-[32px] shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#d1f34d]/10 border border-[#d1f34d]/20 flex items-center justify-center text-[#d1f34d] shrink-0">
            <Lock size={20} />
          </div>
          <div className="text-left">
            <h4 className="text-base font-extrabold tracking-tight mb-1">Your Digital Vault</h4>
            <p className="text-sm text-white/75 font-medium leading-relaxed">
              Every course, workshop recording, blueprint, and template you purchase lives in your Vault permanently. Download anytime. Progress persists across devices.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#d1f34d]/10 border border-[#d1f34d]/20 flex items-center justify-center text-[#d1f34d] shrink-0">
            <Compass size={20} />
          </div>
          <div className="text-left">
            <h4 className="text-base font-extrabold tracking-tight mb-1">Blueprint Companions</h4>
            <p className="text-sm text-white/75 font-medium leading-relaxed">
              Every course includes downloadable blueprints — prompt packs, code templates, automation workflows, and checklists you can deploy immediately.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
