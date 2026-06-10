import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

const DEFAULT_FAQS = [
  { q: 'Who is this blueprint for?', a: 'This blueprint is designed for developers, founders, creators, and technical builders who want to implement a production-ready solution without spending weeks on research.' },
  { q: 'How do I access it after purchase?', a: 'After purchase, the blueprint appears in your Digital Vault at /vault. Simply log in with your account to download your files anytime, across any device. You get lifetime access.' },
  { q: 'Do I need experience to use this?', a: 'Each blueprint clearly states the required difficulty level — Beginner, Intermediate, or Advanced. Check the Blueprint Information section to confirm if this matches your skill level.' },
  { q: 'How often is it updated?', a: 'Blueprints evolve with the ecosystem. When updates are released — whether for new features, improved templates, or best practices — you get them automatically at no additional cost.' },
  { q: 'Can I duplicate the results shown?', a: 'The blueprints are built from real implementations and designed to be immediately actionable. Your results will depend on your specific context, but the frameworks and templates are proven to work.' },
  { q: 'How long does implementation take?', a: 'The estimated implementation time is shown in the Blueprint Information section. Most users complete the core implementation within the stated time by following the step-by-step modules.' },
];

export const BlueprintFAQ = ({ product }: Props) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = product.faq && product.faq.length > 0 ? product.faq : DEFAULT_FAQS;

  return (
    <section>
      <div className="max-w-3xl mb-14">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#424754]/60 mb-4">FAQ</h2>
        <h3 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-[#0b1c30] leading-[1.05]">
          Frequently Asked Questions
        </h3>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-3"
      >
        {faqs.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={cn(
                'bg-white border rounded-[20px] overflow-hidden transition-all duration-300 shadow-sm text-left',
                isOpen ? 'border-[#0b1c30] ring-1 ring-[#0b1c30]/10' : 'border-[#c2c6d6]/25 hover:border-[#c2c6d6]/50'
              )}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full px-7 py-5 flex items-center justify-between text-left gap-4 group cursor-pointer border-none bg-transparent"
              >
                <span className="text-base font-extrabold tracking-tight text-[#0b1c30] flex-1">
                  {item.q}
                </span>
                <span
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 border',
                    isOpen
                      ? 'bg-[#d1f34d] border-[#c0e045] text-[#0b1c30]'
                      : 'bg-bg-secondary border-[#c2c6d6]/20 text-[#424754]/60 group-hover:border-[#d1f34d]/30 group-hover:text-[#d1f34d]'
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
                    <div className="px-7 pb-6 text-sm text-[#424754] font-semibold leading-relaxed">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
};
