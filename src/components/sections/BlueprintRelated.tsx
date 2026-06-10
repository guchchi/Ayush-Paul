import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Product } from '../../types';
import { getPublishedProducts } from '../../lib/product-utils';

interface Props {
  currentProduct: Product;
}

export const BlueprintRelated = ({ currentProduct }: Props) => {
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const all = await getPublishedProducts();
        const filtered = all.filter(p => p.id !== currentProduct.id && p.isPublished && p.status !== 'COMING_SOON');
        const scored = filtered.map(p => {
          let score = 0;
          if (p.category === currentProduct.category) score += 3;
          if (p.tags?.some(t => currentProduct.tags?.includes(t))) score += 2;
          if (p.difficultyLevel === currentProduct.difficultyLevel) score += 1;
          return { product: p, score };
        });
        scored.sort((a, b) => b.score - a.score);
        setRelated(scored.slice(0, 3).map(s => s.product));
      } catch {
        setRelated([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRelated();
  }, [currentProduct.id, currentProduct.category, currentProduct.tags, currentProduct.difficultyLevel]);

  if (loading || related.length === 0) return null;

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-4">Explore More</h2>
        <h3 className="text-3xl font-extrabold tracking-tight text-[#0b1c30]">Related Blueprints</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((prod, idx) => {
          const catColor = (() => {
            const c = (prod.category ?? '').toLowerCase();
            if (c.includes('ai') || c.includes('prompt')) return { bg: '#f3efff', color: '#6b35ff', border: '#ebe5ff' };
            if (c.includes('seo') || c.includes('workflow')) return { bg: '#fff4eb', color: '#ff8000', border: '#ffe9d6' };
            if (c.includes('auto')) return { bg: '#f0fbe8', color: '#558b2f', border: '#e1f7d2' };
            return { bg: '#eff4ff', color: '#0b1c30', border: '#dce9ff' };
          })();

          return (
            <motion.div
              key={prod.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.35, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={`/blueprints/${prod.slug}`}
                className="group flex flex-col bg-white border border-[#c2c6d6]/30 rounded-[32px] overflow-hidden shadow-sm hover:shadow-ambient hover:scale-[1.01] hover:border-[#1a1a1a]/20 transition-all duration-300 h-full text-left"
              >
                <div className="h-1 w-full" style={{ backgroundColor: catColor.color }} />
                <div className="flex flex-col flex-1 p-6">
                  <div className="mb-4">
                    <span
                      className="inline-flex px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-[0.18em] shadow-sm border"
                      style={{ backgroundColor: catColor.bg, color: catColor.color, borderColor: catColor.border }}
                    >
                      {prod.category}
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-[#0b1c30] tracking-tight leading-snug mb-2 line-clamp-2">
                    {prod.title}
                  </h4>
                  <p className="text-[11px] text-[#424754] font-semibold leading-relaxed flex-1 mb-4 line-clamp-2">
                    {prod.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-[#c2c6d6]/20 mt-auto">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#424754]/60 group-hover:text-[#0b1c30] transition-colors">
                      View Blueprint
                    </span>
                    <div className="w-7 h-7 rounded-full bg-bg-secondary border border-[#c2c6d6]/20 flex items-center justify-center group-hover:bg-[#0b1c30] group-hover:border-[#0b1c30] transition-all duration-300">
                      <ArrowUpRight size={12} className="text-[#0b1c30] group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
