import React from 'react';
import { motion } from 'motion/react';
import { Award, Download, Star, ExternalLink } from 'lucide-react';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

export const BlueprintCreatorSection = ({ product }: Props) => {
  const authName = product.authorName || product.author?.name;
  const authRole = product.authorRole || product.author?.role;
  const authPhoto = product.authorPhoto || product.author?.avatar;

  if (!authName && !product.author?.name) return null;

  return (
    <section>
      <div className="text-center mb-10">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-3">Created By</h2>
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0b1c30]">Meet the Creator</h3>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border border-[#c2c6d6]/30 rounded-[32px] p-8 sm:p-10 shadow-sm text-left"
      >
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
          <img
            src={authPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(authName || 'Creator')}&background=0b1c30&color=fff&size=128`}
            alt={authName || 'Creator'}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-[#c2c6d6]/30 shrink-0 object-cover"
          />

          <div className="flex-1 min-w-0">
            <h4 className="text-xl font-extrabold text-[#0b1c30]">{authName || product.author?.name}</h4>
            {authRole && (
              <p className="text-sm font-bold text-[#424754]/70 mt-0.5">{authRole}</p>
            )}
            <p className="text-sm text-[#424754] font-semibold leading-relaxed mt-4">
              Builder, Creator and Systems Designer focused on AI, Automation, Digital Products and Execution Frameworks.
              Every blueprint is built from real-world implementation experience — not theory.
            </p>
            <div className="flex items-center gap-4 mt-5">
              <a
                href="/collaborate"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0058be] uppercase tracking-wider hover:text-[#003d82] transition-colors"
              >
                <ExternalLink size={12} />
                Work With Me
              </a>
              <a
                href="/blueprints"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#424754]/60 uppercase tracking-wider hover:text-[#0b1c30] transition-colors"
              >
                <ExternalLink size={12} />
                More Blueprints
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-row sm:flex-col gap-3 shrink-0 w-full sm:w-auto">
            {product.purchaseCount && product.purchaseCount > 0 && (
              <div className="flex-1 sm:flex-none text-center px-4 py-3 rounded-2xl bg-[#eff4ff] border border-[#dce9ff]">
                <Award size={16} className="mx-auto mb-1 text-[#0058be]" />
                <p className="text-lg font-extrabold text-[#0058be]">{product.purchaseCount}</p>
                <p className="text-[8px] font-bold uppercase tracking-wider text-[#0058be]/70">Published</p>
              </div>
            )}
            {product.downloadCount && product.downloadCount > 0 && (
              <div className="flex-1 sm:flex-none text-center px-4 py-3 rounded-2xl bg-[#f0fbe8] border border-[#bbf7d0]">
                <Download size={16} className="mx-auto mb-1 text-[#558b2f]" />
                <p className="text-lg font-extrabold text-[#558b2f]">{product.downloadCount.toLocaleString()}</p>
                <p className="text-[8px] font-bold uppercase tracking-wider text-[#558b2f]/70">Downloads</p>
              </div>
            )}
            {product.rating && product.rating > 0 && (
              <div className="flex-1 sm:flex-none text-center px-4 py-3 rounded-2xl bg-[#fff8e1] border border-[#ffe082]">
                <Star size={16} className="mx-auto mb-1 text-[#f59e0b]" />
                <p className="text-lg font-extrabold text-[#f59e0b]">{product.rating.toFixed(1)}</p>
                <p className="text-[8px] font-bold uppercase tracking-wider text-[#f59e0b]/70">Rating</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
