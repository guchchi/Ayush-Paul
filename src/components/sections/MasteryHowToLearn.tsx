import React from 'react';
import { ArrowRight, BookOpen, Users, HelpCircle } from 'lucide-react';

interface MasteryHowToLearnProps {
  onExploreCoursesClick: () => void;
  onMentorshipClick: () => void;
}

export const MasteryHowToLearn = ({
  onExploreCoursesClick,
  onMentorshipClick,
}: MasteryHowToLearnProps) => {
  return (
    <section className="py-16 md:py-20 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end mb-12 text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-4">
            <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full" />
            <span className="tracking-[0.2em]">Learning Paths</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]">
            Choose How You Want To Learn
          </h2>
        </div>

        <p className="text-[#424754] text-sm md:text-base leading-relaxed font-medium">
          Whether you prefer self-paced implementation, structured live cohorts, or private 1-on-1 consultations, select the format that matches your pace and goals.
        </p>
      </div>

      {/* Grid of Options - White cards with uniform borders & transitions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Mode 1: Self-Paced Courses */}
        <div className="bg-white border border-[#c2c6d6]/30 rounded-[32px] p-8 flex flex-col justify-between shadow-sm relative overflow-hidden text-left transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:hover:-translate-y-[3px] motion-safe:hover:shadow-md motion-safe:hover:border-[#0b1c30]/40">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-center text-[#0058be]">
                <BookOpen size={18} />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase tracking-wider bg-[#d1f34d]/25 border border-[#d1f34d]/40 text-[#0b1c30]">
                Primary Format
              </span>
            </div>

            <h3 className="text-base font-extrabold text-[#0b1c30] tracking-tight mb-2">
              Self-Paced Courses
            </h3>
            
            <p className="text-xs text-[#424754] leading-relaxed font-medium mb-6">
              Acquire tactical capabilities on your own timeline. Follow structured, text-and-code curricula containing downloadable blueprint companions.
            </p>
          </div>

          <button
            onClick={onExploreCoursesClick}
            className="w-full py-3 bg-[#0b1c30] text-white hover:bg-[#1a3050] rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer border-none shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            Browse Courses
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Mode 2: Live Workshops */}
        <div className="bg-white border border-[#c2c6d6]/30 rounded-[32px] p-8 flex flex-col justify-between shadow-sm relative overflow-hidden text-left transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:hover:-translate-y-[3px] motion-safe:hover:shadow-md motion-safe:hover:border-[#0b1c30]/40">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-center text-[#0058be]">
                <Users size={18} />
              </div>
            </div>

            <h3 className="text-base font-extrabold text-[#0b1c30] tracking-tight mb-2">
              Cohort Workshops
            </h3>
            
            <p className="text-xs text-[#424754] leading-relaxed font-medium mb-6">
              Join active builders in scheduled live sessions. Build system architectures end-to-end and troubleshoot implementation challenges in real-time.
            </p>
          </div>

          <a
            href="#live-workshops"
            className="w-full py-3 bg-white border border-[#c2c6d6]/40 text-[#0b1c30] hover:bg-gray-50 rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-center no-underline"
          >
            View Workshops
            <ArrowRight size={12} />
          </a>
        </div>

        {/* Mode 3: 1-on-1 Mentorship */}
        <div className="bg-white border border-[#c2c6d6]/30 rounded-[32px] p-8 flex flex-col justify-between shadow-sm relative overflow-hidden text-left transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:hover:-translate-y-[3px] motion-safe:hover:shadow-md motion-safe:hover:border-[#0b1c30]/40">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-center text-[#0058be]">
                <HelpCircle size={18} />
              </div>
            </div>

            <h3 className="text-base font-extrabold text-[#0b1c30] tracking-tight mb-2">
              1-on-1 Private Sessions
            </h3>
            
            <p className="text-xs text-[#424754] leading-relaxed font-medium mb-6">
              Solve engineering blockers or review architecture choices directly with Ayush. Structured to unblock private codebase or product design issues.
            </p>
          </div>

          <button
            onClick={onMentorshipClick}
            className="w-full py-3 bg-white border border-[#c2c6d6]/40 text-[#0b1c30] hover:bg-gray-50 rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            Request Session
            <ArrowRight size={12} />
          </button>
        </div>

      </div>
    </section>
  );
};