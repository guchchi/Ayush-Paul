import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Download, ShieldCheck, ArrowRight } from 'lucide-react';
import { Product } from '../../types';

interface EcosystemCardProps {
  project: Product;
}

export const EcosystemCard = ({ project }: EcosystemCardProps) => {
  const downloadCount = project.downloadCount ?? 0;
  const basePrice = project.basePrice ?? 0;
  const salePrice = project.salePrice ?? 0;
  const isFree = project.type === 'free';
  const hasDiscount = salePrice > 0 && salePrice < basePrice;

  return (
    <Link to={`/systems/${project.slug}`} className="block group h-full">
      <motion.div
        whileHover={{ y: -6, scale: 1.005 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="h-full bg-[#0E0E10] border border-white/5 hover:border-white/10 rounded-[2.2rem] overflow-hidden flex flex-col relative transition-colors shadow-xl hover:shadow-2xl"
      >
        {/* Thumbnail Frame */}
        <div className="relative aspect-[16/11] w-full overflow-hidden bg-black/40 border-b border-white/5">
          <img 
            src={project.thumbnail} 
            alt={project.title} 
            loading="lazy"
            className="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-85 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
          
          {/* Top-Right Price/Type Pill */}
          <div className="absolute top-4 right-4 z-10">
            <span className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white tracking-wide shadow-lg">
              {isFree ? (
                <span className="text-brand-primary font-bold">FREE</span>
              ) : (
                <span className="flex items-center gap-1.5">
                  {hasDiscount && (
                    <span className="text-white/40 line-through text-[9px]">${basePrice}</span>
                  )}
                  <span>${salePrice || basePrice}</span>
                </span>
              )}
            </span>
          </div>

          {/* Bottom-Left Downloads Overlay */}
          <div className="absolute bottom-4 left-4 z-10">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3.5 py-1.5 text-[9px] font-semibold text-white/80 flex items-center gap-1.5">
              <Download size={11} className="text-brand-primary" /> {downloadCount + 120} Downloads
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-7 flex flex-col flex-1 relative z-10">
          
          {/* Metadata Badges */}
          <div className="flex items-center gap-2.5 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">
              {project.category}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span className="text-[9px] uppercase tracking-widest text-white/30 flex items-center gap-1">
              <ShieldCheck size={10} className="text-brand-primary/60" /> Verified Blueprint
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-3 tracking-tight line-clamp-2 leading-snug group-hover:text-brand-primary transition-colors">
            {project.title}
          </h3>
          
          {/* Description */}
          <p className="text-white/40 text-sm leading-relaxed mb-6 line-clamp-2 font-medium">
            {project.description}
          </p>

          {/* Footer Action Profile */}
          <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {project.author?.avatar ? (
                <img 
                  src={project.author.avatar} 
                  alt={project.author.name} 
                  className="w-8 h-8 rounded-full border border-white/10" 
                />
              ) : (
                <div className="w-8 h-8 rounded-full border border-white/10 bg-brand-primary/10 flex items-center justify-center text-[10px] font-bold text-brand-primary uppercase">
                  {project.author?.name?.charAt(0) || 'A'}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white/80">{project.author?.name || 'Ayush Paul'}</span>
                <span className="text-[9px] text-white/30 uppercase tracking-wider font-semibold">Architect</span>
              </div>
            </div>

            {/* Quick Action Circular Icon */}
            <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 group-hover:bg-brand-primary group-hover:border-brand-primary group-hover:text-black transition-all duration-300">
              <ArrowRight size={14} className="transform group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
