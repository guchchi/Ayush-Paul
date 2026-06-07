import React from 'react';
import { motion } from 'motion/react';
import { Grid, Sparkles, BookOpen } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SkillCategory {
  id: string;
  name: string;
  count: number;
}

interface MasteryExploreSkillsProps {
  categories: SkillCategory[];
  activeCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

export const MasteryExploreSkills = ({
  categories,
  activeCategory,
  onCategorySelect,
}: MasteryExploreSkillsProps) => {
  return (
    <section 
      className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20 scroll-mt-24"
      id="explore-skills-section"
    >
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end mb-12 text-left">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-6"
          >
            <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full" />
            <span className="tracking-[0.22em]">Explore</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]"
          >
            Explore Skills
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#424754] text-base leading-relaxed font-medium"
        >
          Browse skills and filter courses by category.
        </motion.p>
      </div>

      {/* Pills Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap gap-3.5 justify-start text-left"
      >
        {/* 'All' category pill */}
        <button
          onClick={() => onCategorySelect('all')}
          className={cn(
            "px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border flex items-center gap-2 cursor-pointer shadow-sm",
            activeCategory === 'all'
                ? "bg-[#0b1c30] border-[#0b1c30] text-white"
                  : "bg-white border-[#c2c6d6]/30 hover:border-[#d1f34d] text-[#424754]"
          )}
        >
          <Grid size={12} />
          <span>All categories</span>
        </button>

        {categories.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.id)}
              className={cn(
                "px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border flex items-center gap-2 cursor-pointer shadow-sm hover:scale-[1.02]",
                isSelected
                  ? "bg-[#0b1c30] border-[#0b1c30] text-white"
              : "bg-white border-[#c2c6d6]/30 hover:border-[#d1f34d] text-[#424754]"
              )}
            >
              <span>{cat.name}</span>
              <span 
                className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-extrabold leading-none transition-colors",
                  isSelected
                    ? "bg-[#d1f34d] text-[#0b1c30]"
                    : "bg-bg-secondary text-[#424754]/60"
                )}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </motion.div>
    </section>
  );
};
