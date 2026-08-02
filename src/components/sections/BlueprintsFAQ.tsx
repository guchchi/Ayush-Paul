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
    <section className="bg-white py-16 px-6 text-left relative z-10 border-t border-gray-150">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Intro/Title */}
          <div className="lg:col-span-5 text-left lg:sticky lg:top-36">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0b1c30] bg-[#d1f34d] px-4 py-1.5 rounded-full shadow-sm w-fit inline-block mb-4">
              FAQ
            </div>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter leading-[1.1] text-[#0b1c30] mb-4">
              Questions worth asking
            </h2>

            <p className="text-[#424754] text-sm leading-relaxed font-medium max-w-sm">
              Everything you need to know before choosing a blueprint, starting a learning path, or working together.
            </p>
          </div>

          {/* RIGHT: Accordions */}
          <div className="lg:col-span-7 space-y-3.5 w-full">
            {FAQ_DATA.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className={cn(
                    "bg-white border rounded-2xl overflow-hidden transition-all duration-200 shadow-sm text-left",
                    isOpen ? "border-[#0b1c30]" : "border-[#c2c6d6]/35 hover:border-[#c2c6d6]/50"
                  )}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    id={`faq-btn-${i}`}
                    className="w-full px-6 py-5 flex items-center justify-between text-left gap-6 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1c30] rounded-2xl"
                  >
                    <span className="text-sm font-extrabold tracking-tight leading-snug text-[#0b1c30] flex-1">
                      {item.q}
                    </span>

                    <span
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 border",
                        isOpen
                          ? "bg-[#f0fbe8] border-[#d1f34d] text-[#0b1c30]"
                          : "bg-bg-secondary border-[#c2c6d6]/20 text-[#424754]/60 group-hover:border-[#0b1c30]/20 group-hover:text-[#0b1c30]"
                      )}
                    >
                      {isOpen ? <Minus size={12} /> : <Plus size={12} />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${i}`}
                        role="region"
                        aria-labelledby={`faq-btn-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-5 text-xs text-[#424754] font-semibold leading-relaxed border-t border-gray-50 pt-3">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
