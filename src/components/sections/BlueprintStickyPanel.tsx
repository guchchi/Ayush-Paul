import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, computeSavings } from '../../lib/format';
import { ShieldCheck, ArrowRight, Download, Check, X, Zap } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { CouponInput, type CouponResult } from '../ui/CouponInput';
import type { Product } from '../../types';

interface Props {
  product: Product;
  selectedLicense: 'free' | 'premium';
  onLicenseChange: (license: 'free' | 'premium') => void;
  appliedCoupon: CouponResult | null;
  onCouponValidated: (coupon: CouponResult | null) => void;
  isCheckingOut: boolean;
  isDownloading: boolean;
  isOwned: boolean;
  hasDiscount: boolean;
  profile: any;
  onFreeDownload: () => void;
  onPremiumUpgrade: () => void;
}

export const BlueprintStickyPanel = ({
  product,
  selectedLicense,
  onLicenseChange,
  appliedCoupon,
  onCouponValidated,
  isCheckingOut,
  isDownloading,
  isOwned,
  hasDiscount,
  profile,
  onFreeDownload,
  onPremiumUpgrade,
}: Props) => {
  const uniqueFree = Array.from(new Set(product.comparisonFree || []));
  const uniquePrem = Array.from(new Set(product.comparisonPremium || []))
    .filter(f => !uniqueFree.includes(f));

  return (
    <div className="sticky top-24">
      <div className="bg-white border border-[#c2c6d6]/30 rounded-[32px] shadow-sm overflow-hidden">
        {/* Toggle */}
        <div className="p-1.5 bg-bg-secondary border-b border-[#c2c6d6]/20">
          <div className="flex p-1 bg-bg-secondary rounded-full">
            <button
              onClick={() => onLicenseChange('free')}
              className={`flex-1 px-4 py-2 rounded-full font-mono text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedLicense === 'free' ? 'text-[#0b1c30] bg-white shadow-sm' : 'text-[#424754]/60 hover:text-[#0b1c30]'
              }`}
            >
              Free
            </button>
            <button
              onClick={() => onLicenseChange('premium')}
              className={`flex-1 px-4 py-2 rounded-full font-mono text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedLicense === 'premium' ? 'text-[#0b1c30] bg-white shadow-sm' : 'text-[#424754]/60 hover:text-[#0b1c30]'
              }`}
            >
              Premium
            </button>
          </div>
        </div>

        <div className="p-6">
          {selectedLicense === 'free' ? (
            /* Free */
            <div className="text-left">
              <div className="text-[9px] font-bold text-[#424754]/60 mb-2 uppercase font-mono tracking-wider">Free Starter Sample</div>
              <div className="text-2xl font-extrabold text-[#0b1c30] mb-4">Free</div>

              <div className="text-[9px] font-mono text-[#424754]/60 mb-4">{uniqueFree.length} features included</div>
              <ul className="space-y-3 mb-6">
                {uniqueFree.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#424754]">
                    <Check size={14} className="text-[#0058be] shrink-0 mt-0.5" />
                    <span className="font-semibold">{feature}</span>
                  </li>
                ))}
                {uniquePrem.slice(0, 2).map((feature, idx) => (
                  <li key={`missing-${idx}`} className="flex items-start gap-2.5 text-xs text-[#424754]/30">
                    <X size={14} className="shrink-0 mt-0.5 text-[#424754]/30" />
                    <span className="line-through font-semibold text-[#424754]/40">{feature}</span>
                  </li>
                ))}
              </ul>

              {product.freeFileUrl && (
                <MagneticButton className="w-full mb-3">
                  <a
                    href={product.freeFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-full bg-[#f0fbe8] hover:bg-[#e1f7d2] border border-[#bbf7d0] text-[#558b2f] transition-all font-mono font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Download size={14} /> Download Free Resource
                  </a>
                </MagneticButton>
              )}
              {profile?.ownedProducts?.[product.id] ? (
                <MagneticButton className="w-full">
                  <Link
                    to="/vault"
                    className="w-full py-3 rounded-full bg-[#d1f34d] hover:bg-[#c0e045] text-black transition-all font-mono font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <ShieldCheck size={14} /> In Vault <ArrowRight size={14} />
                  </Link>
                </MagneticButton>
              ) : (
                <MagneticButton className="w-full">
                  <button
                    onClick={onFreeDownload}
                    disabled={isDownloading}
                    className="w-full py-3 rounded-full bg-[#f8f9ff] hover:bg-[#eff4ff] border border-[#dce9ff] text-[#0058be] transition-all font-mono font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    {isDownloading ? (
                      <div className="w-4 h-4 border-2 border-[#0058be]/25 border-t-[#0058be] rounded-full animate-spin" />
                    ) : (
                      <><Download size={14} /> Download Free Sample</>
                    )}
                  </button>
                </MagneticButton>
              )}
            </div>
          ) : (
            /* Premium */
            <div className="text-left">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-[9px] font-bold text-[#0b1c30] uppercase font-mono tracking-wider">Full Blueprint & Assets Bundle</h3>
                {(() => {
                  const s = computeSavings(product.basePrice, product.salePrice);
                  if (!s) return null;
                  return (
                    <span className="px-2 py-0.5 bg-red-50 border border-red-200 text-red-650 text-[8px] font-bold uppercase tracking-wider rounded font-mono shadow-sm">
                      Save {formatCurrency(s.amount)} ({s.percent}%)
                    </span>
                  );
                })()}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="text-2xl font-extrabold text-[#0b1c30]">{formatCurrency(product.salePrice || product.basePrice)}</div>
                {hasDiscount && (
                  <div className="text-[11px] text-[#424754]/60 line-through font-mono">(WAS {formatCurrency(product.basePrice)})</div>
                )}
              </div>

              <div className="text-[9px] font-mono text-[#424754]/60 mb-4">{uniqueFree.length + uniquePrem.length} features included</div>
              <ul className="space-y-3 mb-6">
                {uniqueFree.map((feature, idx) => (
                  <li key={`inc-${idx}`} className="flex items-start gap-2.5 text-xs text-[#424754]">
                    <Check size={14} className="text-[#0058be] shrink-0 mt-0.5" />
                    <span className="font-semibold">{feature}</span>
                  </li>
                ))}
                {uniquePrem.map((feature, idx) => (
                  <li key={`prem-${idx}`} className="flex items-start gap-2.5 text-xs text-[#0b1c30] font-extrabold">
                    <Zap size={14} className="text-black fill-[#d1f34d] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <CouponInput
                onValidated={onCouponValidated}
                disabled={isCheckingOut}
                initialCoupon={appliedCoupon}
                productPrice={product.salePrice || product.basePrice}
              />

              {appliedCoupon && (() => {
                const basePrice = product.salePrice || product.basePrice;
                const discountAmount = appliedCoupon.discountType === 'percentage'
                  ? Math.round(basePrice * (appliedCoupon.value || 0) / 100)
                  : (appliedCoupon.value || 0);
                const finalPrice = Math.max(0, basePrice - discountAmount);

                return (
                  <div className="mt-3 p-3 bg-[#f0faf0] border border-[#bbf7d0] rounded-xl space-y-1.5">
                    <div className="flex justify-between text-[10px] text-[#424754]">
                      <span>Original price</span>
                      <span className="line-through">{formatCurrency(basePrice)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-emerald-700 font-semibold">
                      <span>Discount ({appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.value}%` : formatCurrency(discountAmount)})</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                    <div className="border-t border-[#bbf7d0] pt-1.5 flex justify-between text-xs font-bold text-[#0b1c30]">
                      <span>Final price</span>
                      <span>{formatCurrency(finalPrice)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <span className="inline-block px-2 py-0.5 bg-emerald-600 text-white text-[8px] font-bold uppercase tracking-wider rounded-full">
                        You save {formatCurrency(discountAmount)}
                      </span>
                    )}
                  </div>
                );
              })()}

              <div className="mt-6">
                {profile?.ownedProducts?.[product.id] === 'premium' ? (
                  <MagneticButton className="w-full">
                    <Link
                      to="/vault"
                      className="w-full py-3.5 rounded-full bg-[#d1f34d] hover:bg-[#c0e045] text-black transition-all font-mono font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 group shadow-sm cursor-pointer h-12"
                    >
                      <ShieldCheck size={14} /> Purchased — Open in Vault <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </MagneticButton>
                ) : (
                  <MagneticButton className="w-full">
                    <button
                      onClick={onPremiumUpgrade}
                      disabled={isCheckingOut}
                      className="w-full py-3.5 rounded-full bg-[#0b1c30] hover:bg-[#0058be] text-white transition-all font-mono font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 group shadow-sm cursor-pointer h-12"
                    >
                      {isCheckingOut ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Get Full Blueprint Bundle <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" /></>
                      )}
                    </button>
                  </MagneticButton>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Choosing guide */}
        <div className="px-6 pb-6 flex flex-col gap-2 text-[9px] font-bold uppercase tracking-wider text-[#424754]/60 text-center">
          <div className="px-3 py-2 rounded-2xl bg-white border border-[#c2c6d6]/20 text-[#424754]/50 font-semibold">
            Free — great for learning, prototyping, or exploring.
          </div>
          <div className="px-3 py-2 rounded-2xl bg-[#eff4ff] border border-[#dce9ff] text-[#0058be] font-semibold">
            Premium — full CAD schematics, firmware, and production-ready source.
          </div>
        </div>
      </div>
    </div>
  );
};
