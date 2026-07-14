import React from 'react';
import { ArrowRight, ArrowUpRight, Layers } from 'lucide-react';

interface MasteryHeroProps {
  onExploreClick: () => void;
  onCoursesClick: () => void;
}

export const MasteryHero = ({ onExploreClick, onCoursesClick }: MasteryHeroProps) => {
  return (
    <section className="relative pt-6 pb-12 md:pt-12 md:pb-16 px-6 overflow-hidden bg-bg-primary text-text-primary">
      {/* Background Soft Grid - subtle and matches homepage */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(11,28,48,0.03)_1px,transparent_0)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* ── LEFT: Typography + CTAs ── */}
          <div className="flex flex-col lg:col-span-6 text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d1f34d] text-[10px] font-bold uppercase tracking-[0.2em] text-[#0b1c30] shadow-sm mb-6 w-fit select-none">
              <span className="w-1.5 h-1.5 bg-[#0b1c30] rounded-full" />
              <span>Mastery Ecosystem</span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30] mb-6">
              Learn Skills.<br />
              Build Systems.<br />
              Ship <span className="border-b-4 border-[#d1f34d] pb-1">Faster.</span>
            </h1>

            {/* Description */}
            <p className="text-sm md:text-base text-[#424754] font-medium max-w-xl mb-8 leading-relaxed">
              Acquire production-grade engineering and design capabilities. Build structured projects with companion blueprints, launch live workshops, or learn 1-on-1. Everything you build is yours forever in the Vault.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <button
                onClick={onCoursesClick}
                className="px-8 py-3.5 bg-[#0b1c30] text-white hover:bg-[#1a3050] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-full cursor-pointer border-none shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:hover:-translate-y-[2px] motion-safe:hover:shadow-[0_10px_20px_-5px_rgba(11,28,48,0.3)]"
              >
                Explore Courses
                <ArrowRight size={14} className="text-[#d1f34d]" />
              </button>

              <button
                onClick={onExploreClick}
                className="px-8 py-3.5 bg-white border border-[#c2c6d6]/40 text-[#0b1c30] hover:bg-gray-50 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-full cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:hover:-translate-y-[2px] motion-safe:hover:shadow-[0_10px_20px_-5px_rgba(11,28,48,0.05)]"
              >
                View Learning Paths
                <ArrowUpRight size={14} className="text-[#0b1c30]/60" />
              </button>
            </div>

            {/* Stats / Trust Banner */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-6 border-t border-[#c2c6d6]/20">
              <div className="flex flex-col text-left">
                <span className="text-xl font-extrabold text-[#0b1c30] tracking-tight leading-none mb-1">
                  12+
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60">
                  Practical Skills
                </span>
              </div>

              <div className="flex flex-col text-left">
                <span className="text-xl font-extrabold text-[#0b1c30] tracking-tight leading-none mb-1">
                  3
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60">
                  Learning Formats
                </span>
              </div>

              <div className="flex flex-col text-left">
                <span className="text-xl font-extrabold text-[#0b1c30] tracking-tight leading-none mb-1">
                  1
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60">
                  Persistent Vault
                </span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Cohesive Product System Visual ── */}
          <div className="lg:col-span-6 w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white border border-[#c2c6d6]/35 rounded-[32px] p-8 shadow-sm relative overflow-hidden text-left transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:hover:-translate-y-[3px] motion-safe:hover:shadow-md">
              
              <div className="flex items-center gap-2 mb-6">
                <Layers size={16} className="text-[#0058be]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/75">Learning Architecture</span>
              </div>

              {/* Step Flow List */}
              <div className="space-y-4 relative">
                {/* Connecting Line */}
                <div className="absolute left-[22px] top-6 bottom-6 w-0.5 bg-[#c2c6d6]/20" />

                {/* Step 1 */}
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-[#0b1c30]/5 border border-[#c2c6d6]/20 flex items-center justify-center text-[#0b1c30] font-bold text-sm shrink-0 shadow-sm">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0b1c30] mb-0.5">Explore Skill</h4>
                    <p className="text-[10.5px] text-[#424754] font-medium">Select a category matching your engineering goals.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-[#d1f34d]/10 border border-[#d1f34d]/20 flex items-center justify-center text-[#0b1c30] font-bold text-sm shrink-0 shadow-sm">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0b1c30] mb-0.5">Watch Lessons</h4>
                    <p className="text-[10.5px] text-[#424754] font-medium">Complete tactical lessons with bite-sized code reviews.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-[#0b1c30]/5 border border-[#c2c6d6]/20 flex items-center justify-center text-[#0b1c30] font-bold text-sm shrink-0 shadow-sm">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0b1c30] mb-0.5">Build System</h4>
                    <p className="text-[10.5px] text-[#424754] font-medium">Configure and run companion blueprints step-by-step.</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-[#0b1c30] border border-[#0b1c30] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                    4
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0b1c30] mb-0.5">Store & Deploy</h4>
                    <p className="text-[10.5px] text-[#424754] font-medium">Add built assets to your Digital Vault for production use.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};
