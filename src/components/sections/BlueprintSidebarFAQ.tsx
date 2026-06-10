import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

const DEFAULT_FAQ = [
  { q: 'How do I access this?', a: 'After purchase, you\'ll receive instant access to the blueprint in your vault. You can view and download it anytime.' },
  { q: 'Do I get updates?', a: 'Yes. You receive lifetime updates. Every time the blueprint is improved, you\'ll have access to the latest version.' },
  { q: 'Is it beginner friendly?', a: 'Absolutely. The blueprint is designed with clear, step-by-step instructions that anyone can follow.' },
  { q: 'Can I use AI tools?', a: 'Yes. The blueprint is optimized for use with AI tools like ChatGPT, Claude, and others.' },
  { q: 'Can I download it?', a: 'Yes. You can download the blueprint as a PDF and access all included resources offline.' },
];

export const BlueprintSidebarFAQ = ({ product }: Props) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqItems = product.faq && product.faq.length > 0 ? product.faq : DEFAULT_FAQ;

  return (
    <div className="rounded-2xl border border-[#c2c6d6]/15 overflow-hidden bg-white">
      <div className="px-5 py-4 border-b border-[#c2c6d6]/10">
        <h3 className="text-[13px] font-semibold text-[#0b1c30]">Common Questions</h3>
      </div>

      <div className="divide-y divide-[#c2c6d6]/10">
        {faqItems.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx}>
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left gap-3 cursor-pointer"
              >
                <span className="text-[13px] font-medium text-[#0b1c30]">{item.q}</span>
                <span className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors',
                  isOpen ? 'bg-[#0b1c30] text-white' : 'bg-[#f0f1f3] text-[#424754]/40'
                )}>
                  {isOpen ? <Minus size={10} /> : <Plus size={10} />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-[13px] text-[#424754] leading-relaxed">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
