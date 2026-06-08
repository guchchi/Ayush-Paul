import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Package, ArrowRight, Clock } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import type { ContinueLearningItem } from '../../lib/recommendations';

interface VaultContinueLearningProps {
  items: ContinueLearningItem[];
}

export const VaultContinueLearning: React.FC<VaultContinueLearningProps> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <div className="mb-16">
      <div className="flex items-center gap-2 mb-6">
        <Clock size={16} className="text-[#0058be]" />
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#0b1c30]">Continue Learning</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <Link
            key={`${item.type}-${item.id}`}
            to={item.type === 'course' ? `/mastery/courses/${item.id}` : `/blueprints/${item.slug}`}
            className="group block"
          >
            <div className="p-5 rounded-[24px] bg-white border border-[#c2c6d6]/30 hover:border-[#d1f34d] hover:shadow-ambient transition-all duration-300 flex items-start gap-4">
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-bg-secondary border border-[#c2c6d6]/10 flex items-center justify-center">
                {item.thumbnail ? (
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-[#424754]/30">
                    {item.type === 'course' ? <BookOpen size={24} /> : <Package size={24} />}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-[#424754]/50">
                    {item.type === 'course' ? 'Course' : 'Blueprint'}
                  </span>
                  {item.category && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-[#c2c6d6]/50" />
                      <span className="text-[8px] font-bold uppercase tracking-wider text-[#424754]/40">{item.category}</span>
                    </>
                  )}
                </div>
                <h3 className="text-sm font-extrabold text-[#0b1c30] line-clamp-1 group-hover:text-[#d1f34d] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[10px] text-[#424754]/70 font-semibold mt-0.5 line-clamp-1">{item.description}</p>

                {/* Progress bar for courses */}
                {item.type === 'course' && item.progress !== undefined && (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#d1f34d] rounded-full transition-all duration-500"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <span className="text-[8px] font-bold text-[#424754]/50 whitespace-nowrap">
                      {item.progress}%
                    </span>
                  </div>
                )}

                <div className="mt-2 flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider text-[#0058be] opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.type === 'course' ? 'Resume' : 'Open'} <ArrowRight size={10} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
