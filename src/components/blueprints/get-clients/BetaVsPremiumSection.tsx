import React from 'react';
import { ShieldAlert, Zap } from 'lucide-react';

export const BetaVsPremiumSection = () => {
  return (
    <section>
      {/* Public Beta Note */}
      <div className="bg-[#fff8e1] border border-[#ffe082] rounded-2xl p-8 mb-12">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-full bg-[#f57f17]/10 flex items-center justify-center shrink-0">
            <ShieldAlert size={24} className="text-[#f57f17]" />
          </div>
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-block px-2 py-1 bg-[#f57f17] text-white text-xs font-bold uppercase tracking-wider rounded">Public Beta</span>
              <span className="inline-block px-2 py-1 bg-[#f57f17]/20 text-[#f57f17] text-xs font-bold uppercase tracking-wider rounded">Free During Beta</span>
              <span className="inline-block px-2 py-1 bg-[#f57f17]/20 text-[#f57f17] text-xs font-bold uppercase tracking-wider rounded">Help Shape The System</span>
            </div>
            <h3 className="text-xl font-bold text-[#0b1c30] mb-2">Built in Public</h3>
            <p className="text-[#424754]">
              Every improvement comes directly from beta feedback. Your suggestions help shape future versions. You're not just using the product. <strong>You're helping build it.</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-[#0b1c30] mb-4">Beta vs Premium</h2>
        <p className="text-[#424754] text-lg font-medium">
          Beta helps you think. Premium helps you move faster.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Beta Access */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-[#0b1c30] mb-2">Beta Access</h3>
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-semibold rounded-full">Available Today</span>
          </div>
          <p className="text-[#424754] font-medium mb-6">
            You build everything manually. You learn the process.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-[#424754]">
              <div className="w-5 h-5 rounded-full bg-[#0058be]/10 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-[#0058be]" />
              </div>
              Complete 6-step implementation workflow
            </li>
            <li className="flex items-start gap-3 text-[#424754]">
              <div className="w-5 h-5 rounded-full bg-[#0058be]/10 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-[#0058be]" />
              </div>
              Future improvements during the beta phase
            </li>
            <li className="flex items-start gap-3 text-[#424754]">
              <div className="w-5 h-5 rounded-full bg-[#0058be]/10 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-[#0058be]" />
              </div>
              Direct feedback loop with the creator
            </li>
          </ul>
        </div>

        {/* Premium Upgrade */}
        <div className="bg-gradient-to-br from-[#0b1c30] to-[#1a2f4c] rounded-2xl border border-[#2a3f5c] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Zap size={100} />
          </div>
          <div className="relative z-10">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Premium Upgrade</h3>
              <span className="inline-block px-3 py-1 bg-white/10 text-white/80 text-sm font-semibold rounded-full">Future Release</span>
            </div>
            <p className="text-white/90 font-medium mb-6">
              AI accelerates the work. Templates save time. Automation removes repetition.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/80">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#00c2ff]" />
                </div>
                AI assistance for instant asset generation
              </li>
              <li className="flex items-start gap-3 text-white/80">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#00c2ff]" />
                </div>
                Advanced notion templates and automation scripts
              </li>
              <li className="flex items-start gap-3 text-white/80">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#00c2ff]" />
                </div>
                Team collaboration features
              </li>
              <li className="flex items-start gap-3 text-white/80">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#00c2ff]" />
                </div>
                Advanced outbound scaling systems
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
