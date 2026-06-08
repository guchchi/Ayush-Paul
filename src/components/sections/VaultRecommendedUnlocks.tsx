import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, BookOpen, Package } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import type { RecommendedUnlock } from '../../lib/recommendations';

interface VaultRecommendedUnlocksProps {
  items: RecommendedUnlock[];
}

export const VaultRecommendedUnlocks: React.FC<VaultRecommendedUnlocksProps> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <div className="mb-16">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={16} className="text-[#6b35ff]" />
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#0b1c30]">Recommended Unlocks</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <Link
            key={`rec-${item.type}-${item.id}`}
            to={item.type === 'course' ? `/mastery/courses/${item.id}` : `/blueprints/${item.slug}`}
            className="group block"
          >
            <div className="p-5 rounded-[24px] bg-white border border-[#c2c6d6]/30 hover:border-[#6b35ff] hover:shadow-ambient transition-all duration-300 h-full flex flex-col">
              {/* Thumbnail */}
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden mb-4 bg-bg-secondary border border-[#c2c6d6]/10 flex items-center justify-center">
                {item.thumbnail ? (
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-[#424754]/20">
                    {item.type === 'course' ? <BookOpen size={36} /> : <Package size={36} />}
                  </div>
                )}
              </div>

              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-[#6b35ff] px-2 py-0.5 rounded-full bg-[#f3efff] border border-[#ebe5ff]">
                    {item.type === 'course' ? 'Course' : 'Blueprint'}
                  </span>
                  {item.price && item.price > 0 && (
                    <span className="text-[9px] font-bold text-[#424754]/60">₹{item.price.toLocaleString('en-IN')}</span>
                  )}
                </div>
                <h3 className="text-sm font-extrabold text-[#0b1c30] line-clamp-1 group-hover:text-[#6b35ff] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[10px] text-[#424754]/60 font-semibold mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Reason footer */}
              <div className="mt-4 pt-3 border-t border-[#c2c6d6]/10 flex items-center justify-between">
                <span className="text-[8px] font-bold text-[#6b35ff]/70 uppercase tracking-wider">{item.reason}</span>
                <ArrowRight size={12} className="text-[#424754]/30 group-hover:text-[#6b35ff] group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
