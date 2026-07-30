import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const WhatYouWillBuildSection = () => {
  const deliverables = [
    "A defined, high-value niche",
    "A validated, no-brainer offer",
    "Your exact positioning statement",
    "An authority profile that builds trust",
    "A minimum viable portfolio",
    "A client tracking system (CRM)",
    "Custom outreach templates",
    "A repeatable acquisition workflow"
  ];

  return (
    <section>
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-[#0b1c30] mb-4">What You'll Build</h2>
        <p className="text-[#424754] text-lg max-w-2xl">
          You don't just learn. You walk away with 6 completed assets.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
        {deliverables.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 hover:border-[#0058be]/20 transition-colors shadow-sm">
            <CheckCircle2 size={20} className="text-[#0058be] shrink-0 mt-0.5" />
            <span className="text-[#0b1c30] font-medium">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
