import React from 'react';
import { ArrowRight } from 'lucide-react';

export const SuccessLooksLikeSection = () => {
  const outcomes = [
    "Explain exactly who you help.",
    "Present a clear offer.",
    "Show proof.",
    "Track every lead.",
    "Start conversations confidently."
  ];

  return (
    <section>
      <div className="bg-[#0b1c30] text-white rounded-3xl p-10 md:p-14 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#0058be] rounded-full blur-[100px] opacity-30" />
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Success Looks Like
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl">
            After completing this blueprint, you will be able to do these things immediately:
          </p>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {outcomes.map((outcome, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <ArrowRight size={16} className="text-[#00c2ff]" />
                </div>
                <span className="text-lg font-medium">{outcome}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
