import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Clock, BarChart3, Globe, Calendar, Tag, Timer, FileType } from 'lucide-react';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

interface StatItem {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export const BlueprintSnapshot = ({ product }: Props) => {
  const stats: StatItem[] = [];

  if (product.pageCount) stats.push({ icon: <BookOpen size={15} className="text-[#0058be]" />, label: 'Pages', value: `${product.pageCount}` });
  if (product.readingTime) stats.push({ icon: <Clock size={15} className="text-[#f57f17]" />, label: 'Reading Time', value: `${product.readingTime} mins` });
  if (product.difficultyLevel) stats.push({ icon: <BarChart3 size={15} className="text-[#6b35ff]" />, label: 'Difficulty', value: product.difficultyLevel.charAt(0).toUpperCase() + product.difficultyLevel.slice(1) });
  if (product.language) stats.push({ icon: <Globe size={15} className="text-[#558b2f]" />, label: 'Language', value: product.language });
  if (product.blueprintType) stats.push({ icon: <FileType size={15} className="text-[#00838f]" />, label: 'Format', value: product.blueprintType.charAt(0).toUpperCase() + product.blueprintType.slice(1) });
  if (product.estimatedImplementationTime) stats.push({ icon: <Timer size={15} className="text-[#2e7d32]" />, label: 'Implementation', value: product.estimatedImplementationTime });
  if (product.lastUpdated) stats.push({ icon: <Calendar size={15} className="text-[#c62828]" />, label: 'Last Updated', value: product.lastUpdated });
  if (product.version) stats.push({ icon: <Tag size={15} className="text-[#6b35ff]" />, label: 'Version', value: `v${product.version}` });

  if (stats.length === 0) return null;

  return (
    <section>
      <div className="text-center mb-10">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-3">Blueprint Snapshot</h2>
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0b1c30]">Everything You Need to Know</h3>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
      >
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#c2c6d6]/30 shadow-sm text-left hover:border-[#0058be]/20 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-bg-secondary border border-[#c2c6d6]/20 flex items-center justify-center shrink-0">
              {stat.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#424754]/50">{stat.label}</p>
              <p className="text-sm font-extrabold text-[#0b1c30] truncate">{stat.value}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
};
