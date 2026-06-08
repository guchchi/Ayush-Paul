import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import type { UpgradeOffer } from '../../lib/recommendations';

interface VaultUpgradePathProps {
  offers: UpgradeOffer[];
}

export const VaultUpgradePath: React.FC<VaultUpgradePathProps> = ({ offers }) => {
  if (offers.length === 0) return null;

  return (
    <div className="mb-16">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp size={16} className="text-[#b8860b]" />
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#0b1c30]">Upgrade Path</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {offers.map((offer) => (
          <div
            key={offer.tier}
            className="p-6 rounded-[24px] bg-white border border-[#c2c6d6]/30 hover:border-[#b8860b]/40 hover:shadow-ambient transition-all duration-300 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#fffef0] border border-[#f5e6b8] flex items-center justify-center">
                  <Zap size={14} className="text-[#b8860b]" />
                </div>
                <h3 className="text-sm font-extrabold text-[#0b1c30]">{offer.label}</h3>
              </div>
              {offer.badge && (
                <span className="text-[7px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-[#b8860b]/10 text-[#b8860b] border border-[#f5e6b8]">
                  {offer.badge}
                </span>
              )}
            </div>

            <p className="text-[10px] text-[#424754]/70 font-semibold mb-5 leading-relaxed">{offer.description}</p>

            {/* Product list */}
            <div className="flex-1 space-y-2 mb-6">
              {offer.products.map((p) => (
                <Link
                  key={p.id}
                  to={`/blueprints/${p.slug}`}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-[#f8f9ff] hover:bg-[#eff4ff] transition-colors group/item"
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-bg-secondary border border-[#c2c6d6]/10">
                    {p.thumbnail && (
                      <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <span className="text-[10px] font-bold text-[#0b1c30] line-clamp-1 group-hover/item:text-[#b8860b] transition-colors">
                      {p.title}
                    </span>
                    <span className="text-[8px] font-bold text-[#424754]/50">
                      ₹{(p.salePrice || p.basePrice).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <ArrowRight size={10} className="text-[#424754]/30 group-hover/item:text-[#b8860b]" />
                </Link>
              ))}
            </div>

            {/* CTA */}
            {offer.tier === 'bundle' ? (
              <MagneticButton className="w-full">
                <Link
                  to="/blueprints"
                  className="w-full py-3 rounded-full bg-[#0b1c30] hover:bg-[#b8860b] text-white font-bold text-[9px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 h-10"
                >
                  Explore Bundle <ArrowUpRight size={12} />
                </Link>
              </MagneticButton>
            ) : (
              <MagneticButton className="w-full">
                <Link
                  to={offer.products[0] ? `/blueprints/${offer.products[0].slug}` : '/blueprints'}
                  className="w-full py-3 rounded-full bg-[#fffef0] border border-[#f5e6b8] text-[#b8860b] hover:bg-[#b8860b] hover:text-white font-bold text-[9px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 h-10"
                >
                  {offer.tier === 'starter' ? 'Start Building' : 'Upgrade Now'} <ArrowUpRight size={12} />
                </Link>
              </MagneticButton>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
