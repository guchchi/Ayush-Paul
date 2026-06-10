import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, ExternalLink } from 'lucide-react';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

export const BlueprintAuthorSection = ({ product }: Props) => {
  const authName = product.authorName || product.author?.name;
  const authRole = product.authorRole || product.author?.role;
  const authPhoto = product.authorPhoto || product.author?.avatar;

  if (!authName) return null;

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-4">About the Author</h2>
        <h3 className="text-3xl font-extrabold tracking-tight text-[#0b1c30]">Who Built This Blueprint</h3>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border border-[#c2c6d6]/30 rounded-[32px] p-8 md:p-10 shadow-sm text-left flex flex-col sm:flex-row gap-6 sm:gap-10 items-start"
      >
        <img
          src={authPhoto || `https://ui-avatars.com/api/?name=${authName}&background=0b1c30&color=fff`}
          alt={authName}
          className="w-20 h-20 rounded-2xl border border-[#c2c6d6]/30 shrink-0 object-cover"
        />

        <div className="flex-1 min-w-0">
          <h4 className="text-xl font-extrabold text-[#0b1c30] mb-1">{authName}</h4>
          {authRole && (
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#424754]/60 uppercase tracking-wider mb-4">
              <Briefcase size={12} />
              {authRole}
            </div>
          )}

          <p className="text-sm text-[#424754] font-semibold leading-relaxed">
            {authName} has deep experience building and shipping production-grade systems. 
            Every blueprint is battle-tested, opinionated, and designed to help you skip the 
            learning curve and ship faster.
          </p>

          <div className="flex items-center gap-4 mt-6">
            <a
              href="/collaborate"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0058be] uppercase tracking-wider hover:text-[#003d82] transition-colors"
            >
              <ExternalLink size={12} />
              Work With Me
            </a>
            <a
              href="/blueprints"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#424754]/60 uppercase tracking-wider hover:text-[#0b1c30] transition-colors"
            >
              <ExternalLink size={12} />
              More Blueprints
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-row sm:flex-col gap-4 sm:gap-3 shrink-0">
          {product.purchaseCount && product.purchaseCount > 0 && (
            <div className="text-center px-4 py-3 rounded-2xl bg-[#eff4ff] border border-[#dce9ff] min-w-[80px]">
              <p className="text-lg font-extrabold text-[#0058be]">{product.purchaseCount}</p>
              <p className="text-[8px] font-bold uppercase tracking-wider text-[#0058be]/70">Sales</p>
            </div>
          )}
          {product.downloadCount && product.downloadCount > 0 && (
            <div className="text-center px-4 py-3 rounded-2xl bg-[#f0fbe8] border border-[#bbf7d0] min-w-[80px]">
              <p className="text-lg font-extrabold text-[#558b2f]">{product.downloadCount}</p>
              <p className="text-[8px] font-bold uppercase tracking-wider text-[#558b2f]/70">Downloads</p>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
};
