import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Image } from 'lucide-react';

interface Props {
  images: string[];
  title: string;
}

export const BlueprintPreviewCarousel = ({ images, title }: Props) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  const goTo = useCallback((idx: number) => {
    setCurrentIdx(Math.max(0, Math.min(idx, images.length - 1)));
  }, [images.length]);

  if (!images || images.length === 0) return null;

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-4">Preview</h2>
        <h3 className="text-3xl font-extrabold tracking-tight text-[#0b1c30]">Blueprint Preview</h3>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border border-[#c2c6d6]/30 rounded-[32px] overflow-hidden shadow-sm"
      >
        {/* Main preview */}
        <div className="relative aspect-[16/10] bg-bg-secondary overflow-hidden">
          {!loaded[currentIdx] && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-[#0058be]/25 border-t-[#0058be] rounded-full animate-spin" />
            </div>
          )}
          <img
            src={images[currentIdx]}
            alt={`${title} preview ${currentIdx + 1}`}
            className={`w-full h-full object-cover transition-opacity duration-300 ${loaded[currentIdx] ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded(prev => ({ ...prev, [currentIdx]: true }))}
          />

          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => goTo(currentIdx - 1)}
                disabled={currentIdx === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 border border-[#c2c6d6]/30 flex items-center justify-center hover:bg-white transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer backdrop-blur-sm"
              >
                <ChevronLeft size={16} className="text-[#0b1c30]" />
              </button>
              <button
                onClick={() => goTo(currentIdx + 1)}
                disabled={currentIdx === images.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 border border-[#c2c6d6]/30 flex items-center justify-center hover:bg-white transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer backdrop-blur-sm"
              >
                <ChevronRight size={16} className="text-[#0b1c30]" />
              </button>
            </>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/60 text-white text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm">
            {currentIdx + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 p-4 overflow-x-auto">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`shrink-0 w-16 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  idx === currentIdx
                    ? 'border-[#0058be] ring-1 ring-[#0058be]/30'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
};
