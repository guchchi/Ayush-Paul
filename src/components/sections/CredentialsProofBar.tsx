import React from 'react';
import { Award, Cpu, FileCode, Hammer, Landmark } from 'lucide-react';

export const CredentialsProofBar = () => {
  const items = [
    { text: 'WRO Participant', icon: Award },
    { text: 'DST Innovation Recognition', icon: Landmark },
    { text: 'ESP32 Robotics Developer', icon: Cpu },
    { text: 'CAD STEP Blueprint Designer', icon: FileCode },
    { text: 'Open Source Builder', icon: Hammer },
  ];

  return (
    <div className="w-full bg-[#0A0A0A] border-y border-white/5 py-5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center lg:justify-between gap-y-4 gap-x-8 text-xs font-mono tracking-widest text-white/50 uppercase select-none">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-2.5">
                <Icon size={14} className="text-brand-primary" />
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CredentialsProofBar;
