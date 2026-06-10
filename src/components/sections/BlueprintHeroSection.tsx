import React, { useState } from 'react';
import { User, Calendar, Rocket, Clock, Globe, Star, Check, Play } from 'lucide-react';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

const TRUST_PILLS = [
  'Instant Access',
  'Lifetime Updates',
  'Actionable Framework',
  'Beginner Friendly',
  'AI Optimized',
];

export const BlueprintHeroSection = ({ product }: Props) => {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const authName = product.authorName || product.author?.name;

  const outcomeLine = product.description.split(/[.!?]/).filter(Boolean)[0] + '.';

  const capsules = [
    authName && { icon: User, label: authName },
    product.lastUpdated && { icon: Calendar, label: `Updated ${product.lastUpdated}` },
    product.version && { icon: Rocket, label: `Version ${product.version}` },
    product.readingTime && { icon: Clock, label: `${product.readingTime} Min Read` },
    { icon: Globe, label: product.language || 'English' },
    product.difficultyLevel && { icon: Star, label: `${product.difficultyLevel.charAt(0).toUpperCase() + product.difficultyLevel.slice(1)} Friendly` },
  ].filter(Boolean) as { icon: React.ComponentType<any>; label: string }[];

  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left — Text Content */}
        <div className="lg:col-span-7">
          {/* Category Badge */}
          {product.category && (
            <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[#0058be] mb-5">
              {product.category}
            </span>
          )}

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-[#0b1c30] leading-[1.1] mb-5">
            {product.title}
          </h1>

          {/* Outcome Statement */}
          <p className="text-lg text-[#424754] leading-relaxed mb-8" style={{ maxWidth: '700px' }}>
            {outcomeLine}
          </p>

          {/* Premium Capsules */}
          <div className="flex flex-wrap gap-2 mb-6">
            {capsules.map((cap, idx) => {
              const IconComponent = cap.icon;
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#c2c6d6]/25 text-xs text-[#424754] font-medium"
                >
                  <IconComponent size={12} className="text-[#424754]/50" />
                  {cap.label}
                </span>
              );
            })}
          </div>

          {/* Trust Pills */}
          <div className="flex flex-wrap gap-2">
            {TRUST_PILLS.map((pill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f0faf0] border border-[#d4edda] text-[11px] text-[#2d6a30] font-medium"
              >
                <Check size={10} className="text-[#2d6a30]" />
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* Right — Video Preview or Cover */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl overflow-hidden border border-[#c2c6d6]/15">
            {product.youtubeVideoId && !videoPlaying ? (
              <button
                onClick={() => setVideoPlaying(true)}
                className="relative w-full aspect-[4/3] block cursor-pointer group border-none p-0 bg-transparent"
              >
                <img
                  src={`https://img.youtube.com/vi/${product.youtubeVideoId}/maxresdefault.jpg`}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = product.thumbnail; }}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 shadow-md flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Play size={20} className="text-[#0b1c30] ml-0.5" />
                  </div>
                </div>
              </button>
            ) : product.youtubeVideoId && videoPlaying ? (
              <div className="aspect-[4/3]">
                <iframe
                  src={`https://www.youtube.com/embed/${product.youtubeVideoId}?autoplay=1`}
                  title={product.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-[4/3]">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
