import React from 'react';
import { motion } from 'motion/react';
import { Star, Download, Eye, Calendar, TrendingUp, Users, Award } from 'lucide-react';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

export const BlueprintTrustBar = ({ product }: Props) => {
  const stats: { icon: React.ReactNode; label: string; value: string | number }[] = [];

  if (product.rating && product.rating > 0) {
    stats.push({
      icon: <Star size={14} className="text-[#f59e0b]" />,
      label: 'Rating',
      value: `${product.rating.toFixed(1)} / 5.0`,
    });
  }

  if (product.purchaseCount && product.purchaseCount > 0) {
    stats.push({
      icon: <Award size={14} className="text-[#6b35ff]" />,
      label: 'Purchased',
      value: `${product.purchaseCount} ${product.purchaseCount === 1 ? 'time' : 'times'}`,
    });
  }

  if (product.downloadCount && product.downloadCount > 0) {
    stats.push({
      icon: <Download size={14} className="text-[#0058be]" />,
      label: 'Downloads',
      value: product.downloadCount.toLocaleString(),
    });
  }

  if (product.viewCount && product.viewCount > 0) {
    stats.push({
      icon: <Eye size={14} className="text-[#558b2f]" />,
      label: 'Views',
      value: product.viewCount.toLocaleString(),
    });
  }

  if (product.lastUpdated) {
    stats.push({
      icon: <Calendar size={14} className="text-[#c62828]" />,
      label: 'Last Updated',
      value: product.lastUpdated,
    });
  }

  if (stats.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-white border border-[#c2c6d6]/30 rounded-[24px] shadow-sm overflow-hidden"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-x divide-[#c2c6d6]/20">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex items-center gap-3 px-5 py-4 text-left">
            <div className="w-9 h-9 rounded-xl bg-bg-secondary border border-[#c2c6d6]/20 flex items-center justify-center shrink-0">
              {stat.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#424754]/50">{stat.label}</p>
              <p className="text-sm font-extrabold text-[#0b1c30] truncate">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
