import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, ArrowRight, Download, Lock, CheckCircle, Activity, Cpu } from 'lucide-react';
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
            <ShieldCheck size={14} className="text-brand-primary" /> Active Systems Registry
          </motion.div>
          <motion.h2 
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold tracking-tighter mt-6"
          >
            Featured Operational <span className="text-brand-primary">Systems.</span>
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

        {/* Flagship Systems Showcase Layout */}
        <div className="space-y-8">
          {loading ? (
            <div className="animate-pulse bg-white/5 rounded-[40px] aspect-[21/9] w-full" />
          ) : products.length > 0 && (
            (() => {
              const flagship = products[0];
              const isFree = flagship.type === 'free';
              const basePrice = flagship.basePrice ?? 0;
              const salePrice = flagship.salePrice ?? 0;
              const hasDiscount = salePrice > 0 && salePrice < basePrice;
              const finalPrice = salePrice || basePrice;

              return (
                <motion.div
                  variants={VARIANTS.fadeUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  whileHover={{ y: -6, scale: 1.002 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="group bg-[#0D0D0E] border border-white/5 hover:border-brand-primary/20 rounded-[40px] overflow-hidden shadow-2xl relative w-full"
                >
                  <div className="grid lg:grid-cols-12 gap-0">
                    {/* Visual Cover (7 cols) */}
                    <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto min-h-[360px] relative overflow-hidden bg-black/40 border-b lg:border-b-0 lg:border-r border-white/5">
                      <img 
                        src={flagship.thumbnail || "/placeholder.jpg"} 
                        alt={flagship.title} 
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
                      
                      {/* Active Status Tag */}
                      <div className="absolute top-8 left-8 flex gap-2">
                        <span className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-bold text-brand-primary tracking-widest uppercase flex items-center gap-1.5 shadow-lg">
                          <Activity size={10} className="animate-pulse text-brand-primary" /> ACTIVE FLAGSHIP
                        </span>
                        <span className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-bold text-white/80 tracking-widest uppercase shadow-lg">
                          {flagship.category}
                        </span>
                      </div>

                      {/* Pricing Tag */}
                      <div className="absolute top-8 right-8">
                        <span className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold tracking-widest flex items-center gap-1.5 shadow-lg">
                          {isFree ? (
                            <span className="text-brand-primary font-bold">OPEN BLUEPRINT</span>
                          ) : (
                            <span className="text-white font-bold flex items-center gap-1.5">
                              {hasDiscount && <span className="text-white/40 line-through text-[9px]">${basePrice}</span>}
                              <span>${finalPrice}</span>
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Tech Metrics Overlay */}
                      <div className="absolute bottom-8 left-8 flex flex-wrap gap-2">
                        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-[9px] font-bold uppercase tracking-wider text-white/70 flex items-center gap-1.5 shadow-lg">
                          <Download size={11} className="text-brand-primary" /> {(flagship.downloadCount ?? 0) + 120} Node Syncs
                        </div>
                        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-[9px] font-bold uppercase tracking-wider text-white/70 flex items-center gap-1.5 shadow-lg">
                          <Cpu size={11} className="text-brand-primary" /> ALPHA STAGE
                        </div>
                      </div>
                    </div>

                    {/* Metadata Content (5 cols) */}
                    <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-center">
                      <div className="space-y-6">
                        <div className="text-[10px] font-mono text-brand-primary font-bold uppercase tracking-[0.25em]">Flagship Operational Node</div>
                        <h3 className="text-3xl lg:text-4xl font-bold tracking-tight text-white group-hover:text-brand-primary transition-colors">
                          {flagship.title}
                        </h3>
                        <p className="text-white/50 text-base leading-relaxed font-medium">
                          {flagship.description}
                        </p>

                        {/* Blueprint Modules List */}
                        <div className="space-y-3 pt-6 border-t border-white/5">
                          <div className="text-[9px] font-mono text-white/20 uppercase tracking-[0.25em]">Included Infrastructure Modules</div>
                          {flagship.resources?.slice(0, 3).map((res: any) => (
                            <div key={res.id} className="flex items-center justify-between text-xs font-semibold text-white/70 bg-white/[0.01] border border-white/[0.03] p-3 rounded-xl">
                              <span className="flex items-center gap-2 truncate pr-4">
                                <CheckCircle size={12} className="text-brand-primary/70 shrink-0" />
                                <span className="truncate">{res.title}</span>
                              </span>
                              <span className="text-[8px] font-mono text-white/30 uppercase shrink-0 font-bold bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                {res.isPremium ? <Lock size={8} className="inline mr-1 text-brand-secondary" /> : null}
                                {res.category}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Action Link */}
                        <div className="pt-6 border-t border-white/5">
                          <Link 
                            to={`/systems/${flagship.slug}`} 
                            className="group/btn w-full py-4 bg-brand-primary/10 border border-brand-primary/20 text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:bg-brand-primary hover:text-white rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            Inspect System Blueprints
                            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })()
          )}

          {/* Secondary Systems Grid (grid-cols-2) */}
          <div className="grid md:grid-cols-2 gap-8 pt-4">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-[#0D0D0E] rounded-[32px] aspect-[4/3] w-full" />
              ))
            ) : products.slice(1).map((system, i) => {
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
                  className="group flex flex-col bg-[#0D0D0E] border border-white/5 hover:border-white/10 rounded-[36px] overflow-hidden shadow-2xl relative"
                  style={{ willChange: 'transform' }}
                >
                  {/* Visual Image */}
                  <div className="aspect-[16/10] relative overflow-hidden bg-black/40 border-b border-white/5">
                    <img 
                      src={system.thumbnail || "/placeholder.jpg"} 
                      alt={system.title} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                    
                    {/* Status / Category Tags */}
                    <div className="absolute top-6 left-6 flex gap-2">
                      <span className="px-3.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-bold text-white tracking-widest uppercase flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-brand-primary animate-pulse" /> DEPLOYED
                      </span>
                      <span className="px-3.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-bold text-white/50 tracking-widest uppercase">
                        {system.category}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="absolute top-6 right-6">
                      <span className="px-3.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-bold tracking-widest flex items-center gap-1 shadow-lg">
                        {isFree ? (
                          <span className="text-brand-primary font-bold">OPEN BLUEPRINT</span>
                        ) : (
                          <span className="text-white font-bold flex items-center gap-1">
                            {hasDiscount && <span className="text-white/40 line-through text-[8px]">${basePrice}</span>}
                            <span>${finalPrice}</span>
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Specifications & CTA */}
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold tracking-tight text-white mb-3 group-hover:text-brand-primary transition-colors">
                      {system.title}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-6 line-clamp-2 font-medium font-display">
                      {system.description}
                    </p>

                    <div className="space-y-2 mb-6 pt-4 border-t border-white/5">
                      <div className="text-[8px] font-mono text-white/20 uppercase tracking-[0.25em]">Infrastructure Blueprints</div>
                      {system.resources?.slice(0, 2).map((res: any) => (
                        <div key={res.id} className="flex items-center justify-between text-xs font-semibold text-white/60 bg-white/[0.01] border border-white/[0.03] p-3.5 rounded-xl">
                          <span className="flex items-center gap-2 truncate">
                            <CheckCircle size={10} className="text-brand-primary/50 shrink-0" />
                            <span className="truncate">{res.title}</span>
                          </span>
                          <span className="text-[8px] font-mono text-white/30 uppercase shrink-0 font-bold bg-white/5 px-2 py-0.5 rounded border border-white/5">
                            {res.category}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/5">
                      <Link 
                        to={`/systems/${system.slug}`} 
                        className="group/btn flex items-center gap-2 text-[10px] font-bold text-brand-primary uppercase tracking-widest hover:text-white transition-colors"
                      >
                        Inspect Blueprint 
                        <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Global Catalog Action */}
        <div className="flex justify-center mt-20">
          <Link 
            to="/systems" 
            className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl text-sm font-bold tracking-widest text-white transition-all uppercase flex items-center gap-2 group"
          >
            Access Complete Systems Registry 
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-brand-primary" />
          </Link>
        </div>

      </div>
    </Section>
  );
};

