import React from 'react';
import { motion } from 'motion/react';
import { Layers } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BlueprintsCategoriesProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  dynamicCategories?: string[]; // Kept for interface parity
}

const CATEGORIES = [
  { id: 'all', title: 'All' },
  { id: 'prompts', title: 'Prompts' },
  { id: 'templates', title: 'Templates' },
  { id: 'workflows', title: 'Workflows' },
  { id: 'automations', title: 'Automations' },
  { id: 'blueprints', title: 'Blueprints' },
  { id: 'checklists', title: 'Checklists' }
];

export const BlueprintsCategories = ({
  activeCategory,
  onSelectCategory
}: BlueprintsCategoriesProps) => {
  return (
    <section
      className="py-12 px-6 max-w-7xl mx-auto relative z-10 scroll-mt-24 border-t border-[#c2c6d6]/20"
      id="categories-section"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Label */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full animate-pulse" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#424754]/85">
            Filter by Category
          </span>
        </div>

        {/* Scrollable Pill Container */}
        <div className="w-full md:w-auto overflow-x-auto pb-2 -mb-2 scrollbar-none flex items-center gap-3 mask-image">
          {CATEGORIES.map((cat, i) => {
            const isActive = activeCategory.toLowerCase() === cat.id.toLowerCase();
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                onClick={() => onSelectCategory(cat.id)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all shrink-0 cursor-pointer shadow-sm",
                  isActive
                    ? "bg-[#d1f34d] border-[#d1f34d] text-[#0b1c30]"
                    : "bg-white border-[#c2c6d6]/35 text-[#424754] hover:border-[#0b1c30] hover:text-[#0b1c30]"
                )}
              >
                {cat.title}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
