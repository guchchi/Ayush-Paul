import React from 'react';
import { Sparkles, Check, ChevronDown } from 'lucide-react';

export const JourneySection = () => {
  const steps = [
    { num: 1, title: 'Know WHO to sell to' },
    { num: 2, title: 'Create an offer people actually want' },
    { num: 3, title: 'Build trust' },
    { num: 4, title: 'Show proof' },
    { num: 5, title: 'Manage leads' },
    { num: 6, title: 'Start conversations' }
  ];

  const features = [
    'Guided exercises',
    'AI recommendations',
    'Interactive worksheets',
    'Progress tracking',
    'Action checklists',
    'Exportable assets'
  ];

  return (
    <section>
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-[#0b1c30] mb-4">The Implementation Journey</h2>
        <p className="text-[#424754] text-lg max-w-2xl">
          Exactly what happens in each of the 6 core modules.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* The Steps (Journey) */}
        <div className="md:col-span-3 space-y-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#e8f2ff] text-[#0058be] font-bold flex items-center justify-center shrink-0">
                  {step.num}
                </div>
                {idx !== steps.length - 1 && (
                  <div className="w-px h-10 bg-[#e8f2ff] my-2" />
                )}
              </div>
              <div className="pt-1 pb-4">
                <h3 className="text-lg font-bold text-[#0b1c30]">{step.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* What Happens Inside */}
        <div className="md:col-span-2">
          <div className="bg-[#0b1c30] rounded-2xl p-6 md:p-8 text-white sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles size={20} className="text-[#00c2ff]" />
              <h3 className="text-xl font-bold">Inside Every Module</h3>
            </div>
            
            <ul className="space-y-4">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Check size={12} className="text-[#00c2ff]" />
                  </div>
                  <span className="text-white/80 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
