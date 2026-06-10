import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

const MOCK_TESTIMONIALS = [
  {
    name: 'Alex Chen',
    role: 'Full-Stack Developer',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Chen&background=0058be&color=fff',
    content: 'This blueprint saved me 40+ hours of research and trial-and-error. The production-grade setup worked on the first deploy.',
    rating: 5,
  },
  {
    name: 'Sarah Kim',
    role: 'Product Engineer',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Kim&background=6b35ff&color=fff',
    content: 'I have used dozens of boilerplates and templates — none come close to the documentation quality and thoughtfulness of this blueprint.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Indie Founder',
    avatar: 'https://ui-avatars.com/api/?name=Marcus+Johnson&background=558b2f&color=fff',
    content: 'The implementation timeline was spot on. I went from zero to deployed in exactly the time they estimated. Highly recommended.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Tech Lead',
    avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=c62828&color=fff',
    content: 'What sets this apart is the attention to edge cases. Every potential issue I encountered was already documented with a fix.',
    rating: 5,
  },
];

export const BlueprintSocialProof = ({ product }: Props) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!product.purchaseCount || product.purchaseCount < 1) return null;

  const testimonials = MOCK_TESTIMONIALS;

  const next = () => setCurrentIdx(prev => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIdx(prev => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-4">Social Proof</h2>
        <h3 className="text-3xl font-extrabold tracking-tight text-[#0b1c30]">What Builders Are Saying</h3>
      </div>

      <motion.div
        key={currentIdx}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white border border-[#c2c6d6]/30 rounded-[32px] p-8 md:p-12 shadow-sm text-left"
      >
        <Quote size={32} className="text-[#c2c6d6]/30 absolute top-6 right-8" />

        <div className="flex items-center gap-1 mb-6">
          {Array.from({ length: testimonials[currentIdx].rating }).map((_, i) => (
            <Star key={i} size={16} className="fill-[#f59e0b] text-[#f59e0b]" />
          ))}
        </div>

        <p className="text-base md:text-lg text-[#424754] font-semibold leading-relaxed mb-8 max-w-2xl">
          &ldquo;{testimonials[currentIdx].content}&rdquo;
        </p>

        <div className="flex items-center gap-4">
          <img
            src={testimonials[currentIdx].avatar}
            alt={testimonials[currentIdx].name}
            className="w-10 h-10 rounded-full border border-[#c2c6d6]/20"
          />
          <div>
            <p className="text-sm font-extrabold text-[#0b1c30]">{testimonials[currentIdx].name}</p>
            <p className="text-[10px] font-bold text-[#424754]/60 uppercase tracking-wider">{testimonials[currentIdx].role}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-8">
          <button
            onClick={prev}
            className="w-9 h-9 rounded-full bg-bg-secondary border border-[#c2c6d6]/30 flex items-center justify-center hover:bg-[#eff4ff] hover:border-[#0058be]/20 transition-all cursor-pointer"
          >
            <ChevronLeft size={14} className="text-[#424754]" />
          </button>
          <button
            onClick={next}
            className="w-9 h-9 rounded-full bg-bg-secondary border border-[#c2c6d6]/30 flex items-center justify-center hover:bg-[#eff4ff] hover:border-[#0058be]/20 transition-all cursor-pointer"
          >
            <ChevronRight size={14} className="text-[#424754]" />
          </button>
          <span className="text-[10px] font-bold text-[#424754]/50 ml-2">
            {currentIdx + 1} / {testimonials.length}
          </span>
        </div>
      </motion.div>
    </section>
  );
};
