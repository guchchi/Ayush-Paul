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
        <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4 text-indigo-400" />
          Section 6 — Progressive Narrative Flow
        </div>
        <h3 className="text-xl font-bold text-slate-100">Presentation Strategy & Communication Journey</h3>
        <p className="text-sm text-slate-400 mt-1">
          Combines visitor psychology with actual communication flow so prospects experience your authority progressively.
        </p>
      </div>

      {/* Persona Context Banner */}
      <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-800/40 flex items-center justify-between text-xs font-mono text-indigo-300">
        <span className="flex items-center gap-1.5 font-semibold">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          COMMUNICATION PERSONA:
        </span>
        <span className="text-slate-200">{presentationFlow.personaContext}</span>
      </div>

      {/* Progressive Flow Timeline */}
      <div className="space-y-4">
        {presentationFlow.journey.map((step) => (
          <div key={step.stepNumber} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-950 text-indigo-300 font-mono text-xs font-bold border border-indigo-800/40">
                  {step.stepNumber}
                </span>
                <h4 className="text-sm font-semibold text-slate-200">{step.stageName}</h4>
              </div>
              <span className="text-[10px] font-mono uppercase bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700">
                {step.conversionRole}
              </span>
            </div>

            {/* Combined Grid: Psychology + Actual Content Flow */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Visitor Psychology */}
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-850 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">
                  🧠 VISITOR PSYCHOLOGY & MINDSET
                </span>
                <p className="text-slate-300">{step.visitorPsychology}</p>
                <div className="pt-1 text-[11px] font-mono text-indigo-400">
                  <strong>Purpose:</strong> {step.communicationPurpose}
                </div>
              </div>

              {/* Actual Communication Flow */}
              <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-900/30 space-y-1">
                <span className="text-[10px] font-mono text-indigo-300 uppercase font-semibold flex items-center gap-1">
                  <MessageSquareCode className="w-3 h-3" />
                  ACTUAL CONTENT & COMMUNICATION FLOW
                </span>
                <p className="text-slate-200 font-mono text-xs">{step.contentToPresent}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
