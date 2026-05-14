import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Download, Zap, Heart, ShieldCheck, Clock } from 'lucide-react';
import { Product } from '../../types';
import { cn } from '../../lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const isFree = product.type === 'free';
  const hasDiscount = product.salePrice > 0 && product.salePrice < product.basePrice;

  return (
    <Link to={`/products/${product.slug}`} className="block group">
      <motion.div 
        whileHover={{ y: -5 }}
        className="h-full rounded-[2.5rem] glass border border-white/5 overflow-hidden flex flex-col relative transition-all duration-500 hover:shadow-2xl hover:shadow-brand-primary/10 hover:border-brand-primary/20"
      >
        {/* Scarcity / Highlight Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20 pointer-events-none">
          <div className="flex flex-col gap-2">
            {product.isFeatured && (
              <span className="bg-brand-primary text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-brand-primary/20 backdrop-blur-md flex items-center gap-1.5">
                <Zap size={12} fill="currentColor" /> Featured
              </span>
            )}
            {product.inventoryCount !== null && product.inventoryCount < 10 && (
              <span className="bg-yellow-500/90 text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1.5">
                <Clock size={12} /> Only {product.inventoryCount} Left
              </span>
            )}
          </div>
          
          <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 shadow-xl">
            {isFree ? (
              <span className="text-brand-primary font-bold text-sm tracking-wide">FREE</span>
            ) : (
              <div className="flex items-center gap-2">
                {hasDiscount && (
                  <span className="text-white/40 line-through text-xs">${product.basePrice}</span>
                )}
                <span className="text-white font-bold text-sm tracking-wide">${product.salePrice || product.basePrice}</span>
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
          <img 
            src={product.thumbnail} 
            alt={product.title} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
          
          {/* Activity Indicator Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/70 flex items-center gap-1.5">
              <Download size={12} className="text-brand-primary" /> {product.downloadCount + 120} Downloads
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col flex-1 relative z-10 bg-gradient-to-b from-transparent to-black/40">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-primary">
              {product.category}
            </span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-1">
              <ShieldCheck size={10} /> Verified
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight line-clamp-2 group-hover:text-brand-primary transition-colors">
            {product.title}
          </h3>
          
          <p className="text-white/40 text-sm leading-relaxed mb-6 line-clamp-2">
            {product.description}
          </p>

          <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={product.author.avatar} alt={product.author.name} className="w-8 h-8 rounded-full border border-white/10" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white/90">{product.author.name}</span>
                <span className="text-[9px] uppercase tracking-widest text-white/40">{product.author.role}</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-primary group-hover:border-brand-primary group-hover:text-black transition-all">
              <Download size={16} />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
