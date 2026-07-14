import React from 'react';
import { BookOpen, Cpu, Globe, RefreshCw, Lock, Compass, ArrowRight, ArrowDown } from 'lucide-react';

const WHY_STEPS = [
  {
    num: '01',
    label: 'Learn',
    icon: BookOpen,
    desc: 'Acquire core concepts through structured, modular guides.',
  },
  {
    num: '02',
    label: 'Build',
    icon: Cpu,
    desc: 'Configure and execute downloadable blueprints step-by-step.',
  },
  {
    num: '03',
    label: 'Apply',
    icon: Globe,
    desc: 'Deploy systems immediately to solve real production needs.',
  },
  {
    num: '04',
    label: 'Repeat',
    icon: RefreshCw,
    desc: 'Layer new capabilities and continuously compound skills.',
  }
];

export const MasteryWhy = () => {
  return (
    <section className="py-16 md:py-20 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20">
      
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end mb-12 text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d1f34d] text-[10px] font-bold uppercase tracking-[0.2em] text-[#0b1c30] shadow-sm mb-4 w-fit select-none">
            <span className="w-1.5 h-1.5 bg-[#0b1c30] rounded-full" />
            <span>The System</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]">
            Learn. Build. Apply. Repeat.
          </h2>
        </div>

        <p className="text-[#424754] text-sm md:text-base leading-relaxed font-medium">
          Mastery is structured around a continuous loop of execution and deployment, helping you turn theory into functional production architectures.
        </p>
      </div>

      {/* Connected 4-Step Process System */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left relative z-10">
          {WHY_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="relative flex flex-col items-stretch">
                <div className="p-8 bg-white border border-[#c2c6d6]/30 rounded-[32px] shadow-sm flex flex-col justify-between h-full relative group transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:hover:-translate-y-[2px] motion-safe:hover:border-[#0b1c30]/40 motion-safe:hover:shadow-md">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[9px] font-extrabold tracking-wider text-[#424754]/50 bg-bg-secondary px-2.5 py-0.5 rounded-full">
                        STAGE {step.num}
                      </span>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#eff4ff] border border-[#dce9ff] text-[#0058be] shrink-0 shadow-sm">
                        <Icon size={16} />
                      </div>
                    </div>

                    <h3 className="text-sm font-extrabold text-[#0b1c30] tracking-tight mb-2">
                      {step.label}
                    </h3>
                    <p className="text-xs text-[#424754] leading-relaxed font-medium">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Desktop connecting arrow */}
                {idx < 3 && (
                  <div className="hidden lg:flex absolute -right-[16px] top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-[#c2c6d6]/40 items-center justify-center text-[#424754]/40 shadow-sm">
                    <ArrowRight size={12} />
                  </div>
                )}
                {/* Tablet connecting arrow */}
                {idx === 0 && (
                  <div className="hidden md:flex lg:hidden absolute -right-[16px] top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-[#c2c6d6]/40 items-center justify-center text-[#424754]/40 shadow-sm">
                    <ArrowRight size={12} />
                  </div>
                )}
                {idx === 2 && (
                  <div className="hidden md:flex lg:hidden absolute -right-[16px] top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-[#c2c6d6]/40 items-center justify-center text-[#424754]/40 shadow-sm">
                    <ArrowRight size={12} />
                  </div>
                )}
                {/* Mobile/Tablet down arrow */}
                {idx < 3 && (
                  <div className="flex md:hidden absolute left-1/2 -translate-x-1/2 -bottom-[16px] z-20 w-8 h-8 rounded-full bg-white border border-[#c2c6d6]/40 items-center justify-center text-[#424754]/40 shadow-sm">
                    <ArrowDown size={12} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CORE SYSTEM PRINCIPLES ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 text-left">
        {/* Principle 1 */}
        <div className="p-6 bg-white border border-[#c2c6d6]/30 rounded-[24px] shadow-sm flex items-start gap-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:hover:-translate-y-[2px] motion-safe:hover:border-[#0b1c30]/40 motion-safe:hover:shadow-md">
          <div className="w-10 h-10 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-center text-[#0058be] shrink-0">
            <Lock size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#0b1c30] mb-1">Your Digital Vault</h4>
            <p className="text-[11px] text-[#424754] font-medium leading-relaxed">
              Every course, workshop recording, blueprint, and template you acquire lives in your Vault permanently. Access your materials anytime, across any device.
            </p>
          </div>
        </div>

        {/* Principle 2 */}
        <div className="p-6 bg-white border border-[#c2c6d6]/30 rounded-[24px] shadow-sm flex items-start gap-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:hover:-translate-y-[2px] motion-safe:hover:border-[#0b1c30]/40 motion-safe:hover:shadow-md">
          <div className="w-10 h-10 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-center text-[#0058be] shrink-0">
            <Compass size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#0b1c30] mb-1">Blueprint Companions</h4>
            <p className="text-[11px] text-[#424754] font-medium leading-relaxed">
              Every course includes pre-built blueprints (prompt packs, code templates, and checklists) that you can download and deploy immediately to production.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
