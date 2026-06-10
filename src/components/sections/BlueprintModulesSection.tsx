import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

export const BlueprintModulesSection = ({ product }: Props) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const modules = product.modules && product.modules.length > 0 ? product.modules : null;

  if (!modules) return null;

  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <section>
      <h2 className="text-sm font-semibold text-[#0b1c30] mb-5">What's Inside</h2>

      <div className="rounded-2xl border border-[#c2c6d6]/15 overflow-hidden divide-y divide-[#c2c6d6]/10">
        {modules.map((mod, idx) => {
          const isOpen = openId === mod.id;
          return (
            <div key={mod.id} className="bg-white">
              <button
                onClick={() => toggle(mod.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs text-[#424754]/30 font-medium tabular-nums shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[15px] font-medium text-[#0b1c30] group-hover:text-[#0058be] transition-colors truncate">
                    {mod.title}
                  </span>
                </div>
                <span className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors',
                  isOpen
                    ? 'bg-[#0b1c30] text-white'
                    : 'bg-[#f0f1f3] text-[#424754]/40 group-hover:bg-[#e8e9ec]'
                )}>
                  {isOpen ? <Minus size={11} /> : <Plus size={11} />}
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
                    <div className="px-5 pb-5 pl-12 space-y-3">
                      <p className="text-[13px] text-[#424754] leading-relaxed">
                        {mod.objective}
                      </p>
                      {mod.outcome && (
                        <p className="text-[13px] text-[#0b1c30] font-medium">
                          {mod.outcome}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};
