import { useState } from 'react';
import { useOutreachEngineStore } from '../../lib/outreach-engine-system';
import type { OutreachEngineStep } from '../../types/outreach-engine-system';
import OutreachGoalStep from './OutreachGoalStep';
import ProspectContextStep from './ProspectContextStep';
import PersonalizationAngleStep from './PersonalizationAngleStep';
import MessageBuilderStep from './MessageBuilderStep';
import FollowUpBuilderStep from './FollowUpBuilderStep';
import ObjectionSafeRepliesStep from './ObjectionSafeRepliesStep';
import OutreachTrackerStep from './OutreachTrackerStep';
import OutreachReportStep from './OutreachReportStep';
import { useNavigate } from 'react-router-dom';

const STEP_COMPONENTS: Partial<Record<OutreachEngineStep, React.FC>> = {
  outreach_goal: OutreachGoalStep,
  prospect_context: ProspectContextStep,
  personalization_angle: PersonalizationAngleStep,
  message_builder: MessageBuilderStep,
  follow_up_builder: FollowUpBuilderStep,
  objection_safe_replies: ObjectionSafeRepliesStep,
  outreach_tracker: OutreachTrackerStep,
  outreach_report: OutreachReportStep,
};

export function StepContent() {
  const navigate = useNavigate();
  const currentStep = useOutreachEngineStore((s) => s.currentStep);
  const phase5Service = useOutreachEngineStore((s) => s.phase5Service);
  const phase5Niche = useOutreachEngineStore((s) => s.phase5Niche);
  const seedDevSampleContext = useOutreachEngineStore((s) => s.seedDevSampleContext);

  const [d] = useState(() => {
    try { return (localStorage.getItem('m6-theme') as 'dark' | 'light') || 'dark'; }
    catch { return 'dark'; }
  });
  const isDark = d === 'dark';

  const hasContext = Boolean(phase5Service && phase5Niche);

  if (!hasContext) {
    return (
      <div className={`p-8 rounded-2xl border text-center max-w-xl mx-auto my-12 shadow-xl ${
        isDark ? 'border-zinc-800 bg-zinc-950 text-zinc-100' : 'border-zinc-200 bg-white text-zinc-900'
      }`}>
        <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-3">Context Required</h3>
        <p className={`text-sm mb-8 px-4 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          Module 6 needs context from your Client Pipeline before generating outreach. Continue from Module 5 or use a dev seed.
        </p>

        <div className="flex flex-col gap-3 justify-center items-stretch sm:max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => navigate('/workspace/client-pipeline')}
            className="w-full px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
          >
            Back to Client Pipeline
          </button>

          {import.meta.env.DEV && (
            <div className={`mt-4 pt-4 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
              <p className={`text-xs font-semibold mb-3 tracking-wide uppercase ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                Use Dev Sample Context
              </p>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => seedDevSampleContext(1)}
                  className={`px-3 py-2 text-xs text-left rounded-lg border transition-all ${
                    isDark ? 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300' : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700'
                  }`}
                >
                  1. Custom Theme Dev + AI Startups
                </button>
                <button
                  type="button"
                  onClick={() => seedDevSampleContext(2)}
                  className={`px-3 py-2 text-xs text-left rounded-lg border transition-all ${
                    isDark ? 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300' : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700'
                  }`}
                >
                  2. WordPress Plugin Integration + Agencies
                </button>
                <button
                  type="button"
                  onClick={() => seedDevSampleContext(3)}
                  className={`px-3 py-2 text-xs text-left rounded-lg border transition-all ${
                    isDark ? 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300' : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700'
                  }`}
                >
                  3. Product UI Design + SaaS
                </button>
                <button
                  type="button"
                  onClick={() => seedDevSampleContext(4)}
                  className={`px-3 py-2 text-xs text-left rounded-lg border transition-all ${
                    isDark ? 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300' : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700'
                  }`}
                >
                  4. Short-Form Clips + Gaming
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const Component = STEP_COMPONENTS[currentStep];
  if (!Component) {
    return (
      <div className="space-y-4">
        <p className="text-[11px] text-zinc-500">Step coming next</p>
      </div>
    );
  }
  return <Component />;
}
