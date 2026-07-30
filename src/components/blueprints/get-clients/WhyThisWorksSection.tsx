import React from 'react';
import { X, Check } from 'lucide-react';

export const WhyThisWorksSection = () => {
  return (
    <section>
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-[#0b1c30] mb-4">Why This Works</h2>
        <p className="text-[#424754] text-lg max-w-2xl">
          Education isn't enough. You need implementation.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Traditional Advice */}
        <div className="bg-[#fcfcfc] rounded-2xl border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <X size={20} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-[#424754]">Traditional Advice</h3>
          </div>
          
          <ul className="space-y-6">
            <li className="flex gap-4 text-[#424754]">
              <span className="text-gray-400 font-bold">1</span>
              <span>Watch endless videos</span>
            </li>
            <li className="flex gap-4 text-[#424754]">
              <span className="text-gray-400 font-bold">2</span>
              <span>Take disjointed notes</span>
            </li>
            <li className="flex gap-4 text-[#424754]">
              <span className="text-gray-400 font-bold">3</span>
              <span>Forget everything a week later</span>
            </li>
            <li className="flex gap-4 text-[#424754]">
              <span className="text-gray-400 font-bold">4</span>
              <span>Start over from scratch</span>
            </li>
          </ul>
        </div>

        {/* Blueprint OS */}
        <div className="bg-[#e8f2ff] rounded-2xl border border-[#0058be]/20 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#0058be]/10">
            <div className="w-10 h-10 rounded-full bg-[#0058be] flex items-center justify-center shrink-0">
              <Check size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#0058be]">Blueprint OS</h3>
          </div>
          
          <ul className="space-y-6">
            <li className="flex gap-4 text-[#0b1c30] font-medium">
              <span className="text-[#0058be]/50 font-bold">1</span>
              <span>Make concrete decisions</span>
            </li>
            <li className="flex gap-4 text-[#0b1c30] font-medium">
              <span className="text-[#0058be]/50 font-bold">2</span>
              <span>Build real assets</span>
            </li>
            <li className="flex gap-4 text-[#0b1c30] font-medium">
              <span className="text-[#0058be]/50 font-bold">3</span>
              <span>Complete structured systems</span>
            </li>
            <li className="flex gap-4 text-[#0b1c30] font-medium">
              <span className="text-[#0058be]/50 font-bold">4</span>
              <span>Use them immediately</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
