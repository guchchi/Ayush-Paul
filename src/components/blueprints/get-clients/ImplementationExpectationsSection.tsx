import React from 'react';
import { Clock, Calendar, Zap, UserCheck } from 'lucide-react';

export const ImplementationExpectationsSection = () => {
  const expectations = [
    { label: 'Setup Time', value: '6–8 hours total', icon: Clock },
    { label: 'Daily Implementation', value: '30–60 minutes', icon: Zap },
    { label: 'Recommended Pace', value: '14 Days', icon: Calendar },
    { label: 'Best Suited For', value: 'People willing to consistently implement.', icon: UserCheck }
  ];

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-[#0b1c30] mb-2">Implementation Expectations</h2>
        <p className="text-[#424754] text-lg">No hidden effort. Here is exactly what it takes.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {expectations.map((exp, idx) => {
          const Icon = exp.icon;
          return (
            <div key={idx} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <Icon size={24} className="text-[#0058be] mb-4" />
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                {exp.label}
              </div>
              <div className="text-[#0b1c30] font-bold text-lg">
                {exp.value}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
