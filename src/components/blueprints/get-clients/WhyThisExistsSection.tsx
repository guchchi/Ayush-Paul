import React from 'react';

export const WhyThisExistsSection = () => {
  return (
    <section>
      <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#0058be]" />
        
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0b1c30] mb-6">
          Why Most People Never Get Their First Client
        </h2>
        
        <div className="space-y-6 text-lg text-[#424754] leading-relaxed">
          <p>
            Most people don't fail because they aren't talented. They fail because every video tells them a different next step. <strong>Blueprint OS removes that uncertainty.</strong>
          </p>
          <p>
            Most beginners fail because nobody teaches client acquisition as a complete system. This blueprint organizes every single decision—from what to sell to how to sell it—into one structured workflow.
          </p>
        </div>
      </div>
    </section>
  );
};
