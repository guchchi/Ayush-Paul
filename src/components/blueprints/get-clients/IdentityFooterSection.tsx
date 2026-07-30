import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface IdentityFooterProps {
  onPrimaryAction: () => void;
  isOwned: boolean;
}

export const IdentityFooterSection: React.FC<IdentityFooterProps> = ({ onPrimaryAction, isOwned }) => {
  return (
    <section className="text-center bg-[#0b1c30] rounded-3xl p-10 md:p-16 lg:p-24">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-8">
          Every successful freelancer eventually builds a client acquisition system.
        </h2>
        
        <div className="text-lg md:text-xl text-white/70 space-y-4 mb-12">
          <p>The difference is that some build it intentionally.</p>
          <p>Others spend years rebuilding it through trial and error.</p>
          <p className="font-semibold text-white">Build yours once.</p>
        </div>

        <button
          onClick={onPrimaryAction}
          className={cn(
            "group relative inline-flex items-center justify-center gap-2 px-10 py-5 rounded-xl text-white font-medium text-xl overflow-hidden transition-all duration-300",
            "bg-[#0058be] hover:bg-[#004a9f] hover:shadow-[0_8px_24px_rgba(0,88,190,0.25)] hover:-translate-y-0.5",
          )}
        >
          <span className="relative z-10 flex items-center gap-2">
            {isOwned ? "Continue Building" : "Build My Client System"}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
        </button>
      </div>
    </section>
  );
};
