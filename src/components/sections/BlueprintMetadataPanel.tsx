import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Clock, BarChart3, Globe, Calendar, Tag, Timer, FileType, User, Award, Download, Star } from 'lucide-react';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

type InfoItem = { icon: React.ComponentType<any>; label: string; value: string };

export const BlueprintMetadataPanel = ({ product }: Props) => {
  const authName = product.authorName || product.author?.name;
  const authRole = product.authorRole || product.author?.role;
  const authPhoto = product.authorPhoto || product.author?.avatar;

  const leftCol: InfoItem[] = [
    { icon: User, label: 'Author', value: authName || 'Ayush Paul' },
    { icon: Tag, label: 'Version', value: product.version ? `v${product.version}` : '1.0' },
    { icon: BookOpen, label: 'Pages', value: product.pageCount ? `${product.pageCount}` : 'N/A' },
    { icon: Clock, label: 'Reading Time', value: product.readingTime ? `${product.readingTime} mins` : 'N/A' },
    { icon: Timer, label: 'Implementation', value: product.estimatedImplementationTime || 'N/A' },
  ];

  const rightCol: InfoItem[] = [
    { icon: Calendar, label: 'Last Updated', value: product.lastUpdated || 'N/A' },
    { icon: BarChart3, label: 'Difficulty', value: product.difficultyLevel ? product.difficultyLevel.charAt(0).toUpperCase() + product.difficultyLevel.slice(1) : 'N/A' },
    { icon: Globe, label: 'Language', value: product.language || 'English' },
    { icon: FileType, label: 'Format', value: product.blueprintType ? product.blueprintType.charAt(0).toUpperCase() + product.blueprintType.slice(1) : 'Digital' },
    { icon: Award, label: 'Access', value: 'Lifetime' },
  ];

  const stats: { icon: React.ComponentType<any>; label: string; value: string }[] = [];
  if (product.downloadCount && product.downloadCount > 0) stats.push({ icon: Download, label: 'Downloads', value: product.downloadCount.toLocaleString() });
  if (product.purchaseCount && product.purchaseCount > 0) stats.push({ icon: Star, label: 'Purchases', value: product.purchaseCount.toLocaleString() });
  if (product.rating && product.rating > 0) stats.push({ icon: Star, label: 'Rating', value: `${product.rating.toFixed(1)} / 5.0` });

  return (
    <section>
      <div className="max-w-3xl mb-14">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#424754]/60 mb-4">Blueprint Information</h2>
        <h3 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-[#0b1c30] leading-[1.05]">
          Everything You Need to Know
        </h3>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border border-[#c2c6d6]/25 rounded-[32px] shadow-sm overflow-hidden"
      >
        {/* Author header */}
        {authName && (
          <div className="p-7 sm:p-8 border-b border-[#c2c6d6]/15 flex items-center gap-4">
            <img
              src={authPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(authName)}&background=0b1c30&color=fff`}
              alt={authName}
              className="w-12 h-12 rounded-xl border border-[#c2c6d6]/20 object-cover"
            />
            <div>
              <p className="text-base font-extrabold text-[#0b1c30]">{authName}</p>
              {authRole && <p className="text-xs text-[#424754]/70 font-semibold">{authRole}</p>}
            </div>
            {stats.length > 0 && (
              <div className="ml-auto flex items-center gap-4">
                {stats.map((s, idx) => {
                  const IconComponent = s.icon;
                  return (
                    <div key={idx} className="text-center">
                      <p className="text-sm font-extrabold text-[#0b1c30]">{s.value}</p>
                      <p className="text-[8px] font-bold uppercase tracking-wider text-[#424754]/50">{s.label}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Two-column metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#c2c6d6]/15">
          <div className="p-7 sm:p-8 space-y-5">
            {leftCol.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-bg-secondary border border-[#c2c6d6]/15 flex items-center justify-center shrink-0">
                    <IconComponent size={14} className="text-[#424754]/60" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#424754]/50">{item.label}</p>
                    <p className="text-sm font-extrabold text-[#0b1c30]">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="p-7 sm:p-8 space-y-5">
            {rightCol.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-bg-secondary border border-[#c2c6d6]/15 flex items-center justify-center shrink-0">
                    <IconComponent size={14} className="text-[#424754]/60" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#424754]/50">{item.label}</p>
                    <p className="text-sm font-extrabold text-[#0b1c30]">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Update policy footer */}
        <div className="px-7 sm:px-8 py-4 bg-[#f8f9ff] border-t border-[#c2c6d6]/15">
          <p className="text-[11px] text-[#424754]/70 font-semibold text-center">
            <Award size={13} className="inline mr-1.5 text-[#0058be]" />
            Updates included — you'll always have access to the latest version.
          </p>
        </div>
      </motion.div>
    </section>
  );
};
