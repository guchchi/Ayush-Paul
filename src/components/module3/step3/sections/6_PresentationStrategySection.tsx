import React from 'react';
import { Compass, Sparkles, MessageSquareCode } from 'lucide-react';
import type { ProfilePortfolioAuthorityBlueprint } from '../../../../types/module3-step3-authority';

interface PresentationStrategySectionProps {
  blueprint: ProfilePortfolioAuthorityBlueprint;
}

export const PresentationStrategySection: React.FC<PresentationStrategySectionProps> = ({ blueprint }) => {
  const { presentationFlow } = blueprint;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2 text-[#0058be] font-mono text-xs uppercase tracking-wider mb-1 font-semibold">
          <Compass className="w-4 h-4 text-[#0058be]" />
          Section 6 — Progressive Narrative Flow
        </div>
        <h3 className="text-2xl font-bold text-[#0b1c30] tracking-tight">Presentation Strategy & Communication Journey</h3>
        <p className="text-sm text-[#424754] mt-1 max-w-2xl leading-relaxed">
          Combines visitor psychology with actual communication flow so prospects experience your authority progressively.
        </p>
      </div>

      {/* Persona Context Banner */}
      <div className="p-4 rounded-2xl bg-[#eff4ff]/80 border border-[#0058be]/20 flex items-center justify-between text-xs font-mono text-[#0058be] shadow-xs">
        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wide">
          <Sparkles className="w-4 h-4 text-[#0058be]" />
          COMMUNICATION PERSONA:
        </span>
        <span className="text-[#0b1c30] font-bold">{presentationFlow.personaContext}</span>
      </div>

      {/* Progressive Flow Timeline */}
      <div className="space-y-4">
        {presentationFlow.journey.map((step) => (
          <div key={step.stepNumber} className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-3 shadow-xs">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-[#0058be]/10 text-[#0058be] font-mono text-xs font-bold border border-[#0058be]/20">
                  {step.stepNumber}
                </span>
                <h4 className="text-base font-bold text-[#0b1c30]">{step.stageName}</h4>
              </div>
              <span className="text-[10px] font-mono uppercase bg-[#f8f9ff] text-[#0058be] font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                {step.conversionRole}
              </span>
            </div>

            {/* Combined Grid: Psychology + Actual Content Flow */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Visitor Psychology */}
              <div className="p-3.5 rounded-xl bg-[#f8f9ff] border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block mb-1">
                  🧠 VISITOR PSYCHOLOGY & MINDSET
                </span>
                <p className="text-[#424754] leading-relaxed">{step.visitorPsychology}</p>
                <div className="pt-1.5 text-[11px] font-mono text-[#0058be]">
                  <strong>Purpose:</strong> {step.communicationPurpose}
                </div>
              </div>

              {/* Actual Communication Flow */}
              <div className="p-3.5 rounded-xl bg-[#eff4ff]/60 border border-[#0058be]/20 space-y-1">
                <span className="text-[10px] font-mono text-[#0058be] uppercase font-bold flex items-center gap-1 mb-1">
                  <MessageSquareCode className="w-3.5 h-3.5 text-[#0058be]" />
                  ACTUAL CONTENT & COMMUNICATION FLOW
                </span>
                <p className="text-[#0b1c30] font-sans font-medium text-xs leading-relaxed">{step.contentToPresent}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
