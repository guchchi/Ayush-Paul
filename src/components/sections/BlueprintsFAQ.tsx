import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FAQItem {
  q: string;
  a: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    q: 'What is a Blueprint?',
    a: 'A Blueprint is a pre-built implementation resource — such as an AI prompt pack, code starter template, automation workflow, or operational checklist — that developers and builders can use immediately without setup or configuration.',
  },
  {
    q: 'Who are Blueprints designed for?',
    a: 'Blueprints are designed for developers, solo founders, and technical creators who want to skip the research phase and begin building immediately using validated configurations.',
  },
  {
    q: 'Do I need coding experience to use a Blueprint?',
    a: 'No coding experience is required for AI prompt packs and operational checklists. Code templates and automation workflows are designed for developers with basic programming knowledge. Each Blueprint clearly states the required technical level.',
  },
  {
    q: 'What is the difference between a Blueprint and a course?',
    a: 'A Blueprint is a ready-to-use file you deploy immediately — a prompt pack, template, or workflow. A course teaches the reasoning and architecture behind how those blueprints were built. Blueprints are for doing; courses are for learning.',
  },
  {
    q: 'Can I get help implementing a Blueprint?',
    a: 'Yes. For custom modifications, API integrations, or full system deployment, you can work directly with Ayush Paul through Studio at ayushpaul.in/collaborate.',
  },
  {
    q: 'How do I get started with Blueprints?',
    a: 'Browse by format — Prompts, Templates, Workflows, Automations, or Checklists — or search by keyword in the Blueprints Library. If you\'re unsure where to begin, the Featured Blueprints section highlights the most commonly used starting points.',
  },
];

export const BlueprintsFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end mb-14 text-left">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-secondary border border-[#c2c6d6]/20 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-6"
          >
            <span className="w-1.5 h-1.5 bg-[#424754] rounded-full" />
            <span className="tracking-[0.22em]">FAQ</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]"
          >
            Questions Worth<br />
            Asking
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#424754] text-base leading-relaxed font-medium"
        >
          Everything you need to know before choosing a blueprint, starting a learning path, or working together.
        </motion.p>
      </div>

      <div className="space-y-4">
        {FAQ_DATA.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.35, delay: 0.05 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "bg-white border rounded-[24px] overflow-hidden transition-all duration-300 shadow-sm text-left",
                isOpen ? "border-[#0b1c30] ring-1 ring-[#0b1c30]/10" : "border-[#c2c6d6]/35 hover:border-[#c2c6d6]/50"
              )}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full px-8 py-6 flex items-center justify-between text-left gap-6 group cursor-pointer"
              >
                <span
                  className={cn(
                    "text-base font-extrabold tracking-tight leading-snug transition-colors duration-200 flex-1",
                    isOpen ? "text-[#0b1c30]" : "text-[#0b1c30]"
                  )}
                >
                  {item.q}
                </span>

                <span
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 border",
                    isOpen
                      ? "bg-[#f0fbe8] border-[#d1f34d] text-[#0b1c30]"
                      : "bg-bg-secondary border-[#c2c6d6]/20 text-[#424754]/60 group-hover:border-[#0b1c30]/20 group-hover:text-[#0b1c30]"
                  )}
                >
                  {isOpen ? <Minus size={13} /> : <Plus size={13} />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-8 pb-6 text-xs text-[#424754] font-semibold leading-relaxed">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
