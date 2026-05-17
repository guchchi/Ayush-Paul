import React from 'react';
import { ArrowLeft, Layers } from 'lucide-react';

export const EcosystemGlobalBanner = () => {
  return (
    <div className="w-full bg-[#0A0A0A] border-b border-white/5 py-2.5 px-6 flex items-center justify-between text-[11px] font-bold tracking-widest uppercase text-white/50 relative z-[9999]">
      <a 
        href="https://ayushpaul.vercel.app/products" 
        className="flex items-center gap-2 hover:text-[#00C2FF] transition-colors"
      >
        <ArrowLeft size={12} /> Back to Ayush Paul Ecosystem
      </a>
      <div className="flex items-center gap-1.5 text-[#00C2FF] animate-pulse">
        <Layers size={12} /> Ecosystem Hub Node
      </div>
    </div>
  );
};

export default EcosystemGlobalBanner;
