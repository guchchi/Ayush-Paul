import React from 'react';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

export const BlueprintVideoSection = ({ product }: Props) => {
  if (!product.youtubeVideoId) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold text-[#0b1c30] mb-2">Watch Before You Start</h2>
      <p className="text-[13px] text-[#424754]/50 mb-5">
        In this short video you'll understand who this blueprint is for, what results to expect, and how to implement it effectively.
      </p>

      <div className="rounded-2xl overflow-hidden border border-[#c2c6d6]/15">
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${product.youtubeVideoId}`}
            title={`${product.title} introduction`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
};
