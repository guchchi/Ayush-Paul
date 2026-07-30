import React from 'react';
import { AlertCircle, ArrowRightCircle } from 'lucide-react';

export const CostOfInactionSection = () => {
  return (
    <section>
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-[#0b1c30] mb-4">The Cost of Inaction</h2>
        <p className="text-[#424754] text-lg max-w-2xl">
          Loss aversion is powerful. Here is what happens if you don't build a system.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-gray-200">
        {/* Without */}
        <div className="bg-[#fcfcfc] p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-200">
          <div className="flex items-center gap-3 mb-8">
            <AlertCircle className="text-red-500" size={24} />
            <h3 className="text-2xl font-bold text-[#0b1c30]">Without this system</h3>
          </div>
          
          <ul className="space-y-5">
            <li className="flex items-start gap-3 text-[#424754]">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5 shrink-0" />
              <span>Random outreach and guesswork</span>
            </li>
            <li className="flex items-start gap-3 text-[#424754]">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5 shrink-0" />
              <span>Inconsistent income and stress</span>
            </li>
            <li className="flex items-start gap-3 text-[#424754]">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5 shrink-0" />
              <span>Constant confusion on next steps</span>
            </li>
            <li className="flex items-start gap-3 text-[#424754]">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5 shrink-0" />
              <span>Restarting your strategy every month</span>
            </li>
          </ul>
        </div>

        {/* With */}
        <div className="bg-[#0058be] text-white p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <ArrowRightCircle className="text-[#00c2ff]" size={24} />
            <h3 className="text-2xl font-bold text-white">After this system</h3>
          </div>
          
          <ul className="space-y-5">
            <li className="flex items-start gap-3 text-white/90">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c2ff] mt-2.5 shrink-0" />
              <span>A repeatable, engineered workflow</span>
            </li>
            <li className="flex items-start gap-3 text-white/90">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c2ff] mt-2.5 shrink-0" />
              <span>Clear, daily next actions</span>
            </li>
            <li className="flex items-start gap-3 text-white/90">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c2ff] mt-2.5 shrink-0" />
              <span>Predictable, targeted outreach</span>
            </li>
            <li className="flex items-start gap-3 text-white/90">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c2ff] mt-2.5 shrink-0" />
              <span>Ultimate confidence in your pipeline</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
