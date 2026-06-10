import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Target, Layers, Zap, CheckCircle, FileText, MessageSquare, ListChecks, BookOpen } from 'lucide-react';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

const STEPS = [
  { icon: Target, label: 'Problem', desc: 'Identify the exact challenge this blueprint is built to solve.' },
  { icon: Layers, label: 'Framework', desc: 'Follow a structured, repeatable framework designed for implementation.' },
  { icon: Zap, label: 'Execution', desc: 'Deploy ready-to-use assets, templates, and configurations immediately.' },
  { icon: CheckCircle, label: 'Result', desc: 'Achieve a production-grade outcome with measurable results.' },
];

export const BlueprintSolutionFlow = (_props: Props) => {
  return (
    <section>
      <div className="max-w-3xl mb-14">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#424754]/60 mb-4">The Solution</h2>
        <h3 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-[#0b1c30] leading-[1.05]">
          How This Blueprint Solves It
        </h3>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {/* Flow connector */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#c62828] via-[#0058be] to-[#d1f34d] -translate-x-1/2 opacity-30" />

        <div className="space-y-8">
          {STEPS.map((step, idx) => {
            const IconComponent = step.icon;
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.4, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center"
              >
                <div className="w-full max-w-2xl bg-white border border-[#c2c6d6]/25 rounded-[24px] p-7 shadow-sm text-left hover:shadow-md hover:border-[#0058be]/20 transition-all">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-center shrink-0">
                      <IconComponent size={24} className="text-[#0b1c30]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-bold text-[#0058be] uppercase tracking-wider">
                          0{idx + 1}
                        </span>
                        <h4 className="text-xl font-extrabold text-[#0b1c30]">{step.label}</h4>
                      </div>
                      <p className="text-sm text-[#424754] font-semibold leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* What's included badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: FileText, label: 'Framework' },
            { icon: Layers, label: 'Workflow' },
            { icon: Zap, label: 'Implementation System' },
            { icon: CheckCircle, label: 'Ready-to-use Assets' },
            { icon: ListChecks, label: 'Templates' },
            { icon: BookOpen, label: 'AI Prompts' },
            { icon: ArrowDown, label: 'Execution Roadmap' },
          ].map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <span key={idx} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-[#c2c6d6]/20 text-[10px] font-bold text-[#424754]/70 shadow-sm">
                <IconComponent size={11} className="text-[#0058be]" />
                {item.label}
              </span>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};
