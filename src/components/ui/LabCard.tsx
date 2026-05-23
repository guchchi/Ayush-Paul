import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Download, Zap, ShieldCheck, Cpu, Terminal } from 'lucide-react';
import { Product } from '../../types';

interface LabCardProps {
  product: Product;
}

export const LabCard = ({ product }: LabCardProps) => {
  const isFree = product.type === 'free';
  const hasDiscount = product.salePrice > 0 && product.salePrice < product.basePrice;

  // Custom R&D specific parameters parsed from tags or ID
  const nodeComplexity = product.tags.some(t => t.toLowerCase().includes('advanced') || t.toLowerCase().includes('robotics')) ? 'LEVEL_A' : 'LEVEL_B';
  const deploymentType = isFree ? 'STARTER_CORE' : 'MASTER_CAD';

  return (
    <Link to={`/labs/${product.slug}`} className="block group">
      <motion.div 
        whileHover={{ y: -5, scale: 1.002 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="h-full glass-card glass-card-hover overflow-hidden flex flex-col relative border border-white/5 rounded-[2.5rem] bg-black/20"
      >
        {/* Schematic Industrial Notches */}
        <div className="absolute top-0 left-4 w-6 h-[1px] bg-white/20 z-20" />
        <div className="absolute top-4 left-0 w-[1px] h-6 bg-white/20 z-20" />
        <div className="absolute bottom-0 right-4 w-6 h-[1px] bg-white/20 z-20" />
        <div className="absolute bottom-4 right-0 w-[1px] h-6 bg-white/20 z-20" />

        {/* Pulse Operational Status Beacons */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20 pointer-events-none">
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[8px] font-bold tracking-widest text-brand-primary uppercase font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              {product.isFeatured ? 'Venture Priority' : 'Operational R&D'}
            </span>
          </div>
          
          <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-xl font-mono text-[9px] font-bold text-white/80">
            {isFree ? (
              <span className="text-brand-primary">DEPL_FREE</span>
            ) : (
              <div className="flex items-center gap-1.5">
                {hasDiscount && (
                  <span className="text-white/40 line-through text-[8px]">${product.basePrice}</span>
                )}
                <span className="text-white">${product.salePrice || product.basePrice}</span>
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Container / Blueprint Frame */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40 border-b border-white/5">
          {/* Visual coordinate overlay */}
          <div className="absolute bottom-2 right-4 font-mono text-[7px] text-white/20 pointer-events-none z-10">
            [COORD_REF: 42.194 // -88.08]
          </div>
          <div className="absolute top-4 right-4 font-mono text-[7px] text-white/25 pointer-events-none z-10 border border-white/10 px-1.5 py-0.5 rounded bg-black/20">
            SYS_REF: {(product.slug || '').slice(0, 3).toUpperCase()}
          </div>

          <img 
            src={product.thumbnail} 
            alt={product.title} 
            loading="lazy"
            className="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-70 group-hover:opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/10 to-transparent opacity-85" />
          
          {/* Active telemetry counter */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-full px-3 py-1.5 text-[8px] font-bold uppercase tracking-widest text-white/60 flex items-center gap-1.5 font-mono">
              <Download size={10} className="text-brand-primary" /> {product.downloadCount + 120} deploys
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col flex-1 relative z-10 bg-gradient-to-b from-transparent to-black/30">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-brand-primary font-mono">
              {product.category}
            </span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/30 flex items-center gap-1 font-mono">
              <ShieldCheck size={10} /> Certified Node
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight line-clamp-2 group-hover:text-brand-primary transition-colors">
            {product.title}
          </h3>
          
          <p className="text-white/40 text-sm leading-relaxed mb-6 line-clamp-2">
            {product.description}
          </p>

          {/* Technical Parameter Telemetry Box */}
          <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5 font-mono text-[9px] text-white/30 mb-6 bg-white/[0.01] px-4 rounded-xl">
            <div className="flex flex-col">
              <span>DEPLOY PROTOCOL:</span>
              <span className="text-white/60 font-bold tracking-wider">{deploymentType}</span>
            </div>
            <div className="flex flex-col">
              <span>COMPLEXITY TIER:</span>
              <span className="text-brand-accent font-bold tracking-wider">{nodeComplexity}</span>
            </div>
          </div>

          {/* Footer Card Navigation */}
          <div className="mt-auto pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img src={product.author.avatar} alt={product.author.name} className="w-7 h-7 rounded-full border border-white/10" />
              <div className="flex flex-col font-mono text-[9px]">
                <span className="font-bold text-white/80">{product.author.name}</span>
                <span className="uppercase text-white/30 tracking-widest">{product.author.role}</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-primary group-hover:border-brand-primary group-hover:text-black transition-all">
              <Terminal size={12} />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
