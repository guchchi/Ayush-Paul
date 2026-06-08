import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Download, ShieldCheck, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { cn } from '../../lib/utils';
import { PricingBadge } from './PricingBadge';

interface EcosystemCardProps {
  project: Product;
  light?: boolean;
}

export const EcosystemCard = ({ project, light = true }: EcosystemCardProps) => {
  const downloadCount = project.downloadCount ?? 0;
  const basePrice = project.basePrice ?? 0;
  const salePrice = project.salePrice ?? 0;
  const isFree = project.type === 'free';
  const hasDiscount = salePrice > 0 && salePrice < basePrice;

  return (
    <Link to={`/blueprints/${project.slug}`} className="block group h-full cursor-pointer">
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="h-full rounded-[32px] overflow-hidden flex flex-col relative transition-all duration-300 shadow-sm bg-white border border-[#c2c6d6]/35 hover:border-[#d1f34d] hover:shadow-ambient"
      >
        {/* Thumbnail Frame */}
        <div className="relative aspect-[16/11] w-full overflow-hidden bg-gray-100 border-b border-[#c2c6d6]/20">
          <img 
            src={project.thumbnail} 
            alt={project.title} 
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent" />
          
          {/* Top-Right Tier Badge */}
          <div className="absolute top-4 right-4 z-10">
            <PricingBadge product={project} size="sm" showPrice />
          </div>

          {/* Bottom-Left Downloads Overlay */}
          <div className="absolute bottom-4 left-4 z-10">
            <div className="bg-white/95 backdrop-blur-sm border border-[#c2c6d6]/25 rounded-full px-3 py-1 text-[8px] font-bold uppercase tracking-wider text-[#424754] flex items-center gap-1.5 shadow-sm">
              <Download size={10} className="text-[#d1f34d]" /> {downloadCount + 120} Downloads
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 flex flex-col flex-1 relative z-10 text-left">
          
          {/* Metadata Badges */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#d1f34d]">
              {project.category}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#c2c6d6]/50" />
            <span className="text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 text-[#424754]/60">
              <ShieldCheck size={9} className="text-[#d1f34d]" /> Verified Blueprint
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-extrabold mb-2 tracking-tight line-clamp-2 leading-snug transition-colors text-[#0b1c30] group-hover:text-[#d1f34d]">
            {project.title}
          </h3>
          
          {/* Description */}
          <p className="text-xs leading-relaxed mb-6 line-clamp-2 font-semibold text-[#424754]">
            {project.description}
          </p>

          {/* Footer Action Profile */}
          <div className="mt-auto pt-4 border-t border-[#c2c6d6]/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {project.author?.avatar ? (
                <img 
                  src={project.author.avatar} 
                  alt={project.author.name} 
                  className="w-7 h-7 rounded-full border border-[#c2c6d6]/30"
                />
              ) : (
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold uppercase border bg-bg-secondary border-[#c2c6d6]/30 text-[#424754]">
                  {project.author?.name?.charAt(0) || 'A'}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold leading-none text-[#0b1c30]">{project.author?.name || 'Ayush Paul'}</span>
                <span className="text-[8px] uppercase tracking-wider font-bold mt-0.5 text-[#424754]/60">Architect</span>
              </div>
            </div>

            {/* Quick Action circular icon */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border bg-bg-secondary border-[#c2c6d6]/30 text-[#424754]/60 group-hover:bg-[#d1f34d] group-hover:border-[#d1f34d] group-hover:text-black">
              <ArrowRight size={12} className="transform group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
