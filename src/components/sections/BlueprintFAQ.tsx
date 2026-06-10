import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

const DEFAULT_FAQS = [
  { q: 'What is included in this blueprint?', a: 'This blueprint includes step-by-step documentation, production-ready configuration files, and implementation guides. Premium tier adds full source code, CAD schematics, and deployment scripts.' },
  { q: 'Do I need prior experience?', a: 'The blueprint is designed for developers and builders with basic knowledge of the relevant technology. Each blueprint clearly states the required difficulty level upfront.' },
  { q: 'Can I get support if I get stuck?', a: 'Yes. You can work directly with Ayush Paul through Studio for custom modifications, API integrations, or full system deployment.' },
  { q: 'How do I access my purchase?', a: 'After purchase, the blueprint appears in your Digital Vault at /vault. Simply log in to download your files anytime.' },
  { q: 'What is the refund policy?', a: 'All blueprint sales are final due to the digital nature of the products. If you encounter technical issues, reach out through the contact form for assistance.' },
];

export const BlueprintFAQ = ({ product }: Props) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = product.faq && product.faq.length > 0 ? product.faq : DEFAULT_FAQS;

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-4">FAQ</h2>
        <h3 className="text-3xl font-extrabold tracking-tight text-[#0b1c30]">Frequently Asked Questions</h3>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-4"
      >
        {faqs.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.35, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'bg-white border rounded-[24px] overflow-hidden transition-all duration-300 shadow-sm text-left',
                isOpen ? 'border-[#0b1c30] ring-1 ring-[#0b1c30]/10' : 'border-[#c2c6d6]/35 hover:border-[#c2c6d6]/55'
              )}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full px-8 py-6 flex items-center justify-between text-left gap-6 group cursor-pointer border-none bg-transparent"
              >
                <span className="text-base font-extrabold tracking-tight leading-snug flex-1 text-[#0b1c30]">
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
                    <div className="px-8 pb-6 text-xs text-[#424754] font-semibold leading-relaxed">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};
