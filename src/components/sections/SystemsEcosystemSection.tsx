import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, ArrowRight, Download, Lock, CheckCircle } from 'lucide-react';
import { Section } from '../ui/Section';
import { getPublishedProducts } from '../../lib/product-utils';
import { Product } from '../../types';
import { VARIANTS, EASING } from '../../lib/motion-presets';

export const SystemsEcosystemSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getPublishedProducts();
      // Keep only first 3 systems on the homepage for showcase
      setProducts(data.slice(0, 3));
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <Section id="systems-ecosystem" glowVariant="bottom" className="py-24 border-t border-white/5 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Flagship Header */}
        <div className="section-header max-w-3xl text-center mx-auto mb-20 flex flex-col items-center">
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="badge shadow-xl shadow-brand-primary/10"
          >
            <ShieldCheck size={14} className="text-brand-primary" /> Active Systems Catalog
          </motion.div>
          <motion.h2 
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold tracking-tighter mt-6"
          >
            Flagship <span className="text-brand-primary">Systems.</span>
          </motion.h2>
          <motion.p 
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-white/40 text-lg md:text-xl font-medium mt-6"
          >
            Production-grade digital systems and modular assets. Inspect blueprints, calibrate hardware layouts, or unlock secure firmware modules.
          </motion.p>
        </div>

        {/* Flagship Systems Showcase Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse glass-card rounded-[32px] overflow-hidden aspect-[4/3] bg-white/5" />
            ))
          ) : products.map((system, i) => {
            const isFree = system.type === 'free';
            const basePrice = system.basePrice ?? 0;
            const salePrice = system.salePrice ?? 0;
            const hasDiscount = salePrice > 0 && salePrice < basePrice;
            const finalPrice = salePrice || basePrice;

            return (
              <motion.div
                key={system.id}
                variants={VARIANTS.fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.005 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col bg-[#0D0D0E] border border-white/5 hover:border-white/10 rounded-[40px] overflow-hidden shadow-2xl relative"
                style={{ willChange: 'transform' }}
              >
                {/* Visual Cover / Image Box */}
                <div className="aspect-[16/11] relative overflow-hidden bg-black/40 border-b border-white/5">
                  <img 
                    src={system.thumbnail || "/placeholder.jpg"} 
                    alt={system.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                  
                  {/* Category Tag */}
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-bold text-white tracking-widest uppercase">
                      {system.category}
                    </span>
                  </div>

                  {/* Pricing Badge */}
                  <div className="absolute top-6 right-6">
                    <span className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold tracking-widest flex items-center gap-1.5 shadow-lg">
                      {isFree ? (
                        <span className="text-brand-primary font-bold">FREE ACCESS</span>
                      ) : (
                        <span className="text-white font-bold flex items-center gap-1.5">
                          {hasDiscount && <span className="text-white/40 line-through text-[9px]">${basePrice}</span>}
                          <span>${finalPrice}</span>
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Stats Overlay */}
                  <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2">
                    <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-[9px] font-semibold text-white/80 flex items-center gap-1.5 shadow-lg">
                      <Download size={11} className="text-brand-primary" /> {(system.downloadCount ?? 0) + 120} Node Syncs
                    </div>
                  </div>
                </div>

                {/* System Specifications & Blueprint structure */}
                <div className="p-10 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold tracking-tight text-white mb-4 line-clamp-1 group-hover:text-brand-primary transition-colors">
                    {system.title}
                  </h3>
                  
                  <p className="text-white/50 text-base leading-relaxed mb-8 line-clamp-2 font-medium">
                    {system.description}
                  </p>

                  {/* Blueprint resource structures */}
                  <div className="space-y-4 mb-8 pt-6 border-t border-white/5">
                    <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.25em]">Blueprint Modules</div>
                    {system.resources?.slice(0, 3).map((res: any) => (
                      <div key={res.id} className="flex items-center justify-between text-xs font-semibold text-white/70">
                        <span className="flex items-center gap-2 truncate pr-4">
                          <CheckCircle size={12} className="text-brand-primary/60 shrink-0" />
                          <span className="truncate">{res.title}</span>
                        </span>
                        <span className="text-[9px] text-white/30 uppercase shrink-0 font-bold bg-white/5 px-2 py-0.5 rounded border border-white/5">
                          {res.isPremium ? <Lock size={8} className="inline mr-1 text-brand-secondary" /> : null}
                          {res.category}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Unlock details / Action CTA */}
                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <Link 
                      to={`/systems/${system.slug}`} 
                      className="group/btn flex items-center gap-2 text-xs font-bold text-brand-primary uppercase tracking-widest hover:text-white transition-colors"
                    >
                      Inspect System Blueprints 
                      <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Global Catalog Action */}
        <div className="flex justify-center mt-20">
          <Link 
            to="/systems" 
            className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl text-sm font-bold tracking-widest text-white transition-all uppercase flex items-center gap-2 group"
          >
            Access Complete Systems Marketplace 
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-brand-primary" />
          </Link>
        </div>

      </div>
    </Section>
  );
};
