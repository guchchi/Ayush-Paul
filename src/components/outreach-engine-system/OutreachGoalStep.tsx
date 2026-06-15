import { useState, useMemo } from 'react';
import {
  GOAL_OPTIONS, BEGINNER_SAFE_GOALS,
  type GoalOption, type GoalType, type OutreachGoal,
} from '../../types/outreach-engine-system';
import { useOutreachEngineStore } from '../../lib/outreach-engine-system/store';

const TONES = ['Friendly', 'Professional', 'Direct', 'Soft'] as const;

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5 inline-block" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <title>Selected</title>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-3 h-3 inline-block" fill="currentColor" viewBox="0 0 20 20">
      <title>Recommended</title>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default function OutreachGoalStep() {
  const store = useOutreachEngineStore();
  const { outreachGoal, phase5LeadScore, phase5SampleProject, phase5PipelineProspects, setOutreachGoal, confirmStep, nextStep } = store;

  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(outreachGoal?.goalType ?? null);
  const [selectedTone, setSelectedTone] = useState<'Friendly' | 'Professional' | 'Direct' | 'Soft'>(
    outreachGoal?.selectedTone ?? 'Friendly',
  );

  const [isDark] = useState<'dark' | 'light'>(() => {
    try { return (localStorage.getItem('m6-theme') as 'dark' | 'light') || 'dark'; }
    catch { return 'dark'; }
  });

  const recommendations = useMemo(() => {
    const result: GoalType[] = [];
    const hasProspect = phase5PipelineProspects.length > 0;
    const hasSampleProject = phase5SampleProject.projectName.length > 0 || phase5SampleProject.goal.length > 0;
    const score = phase5LeadScore;

    if (hasSampleProject) result.push('share_sample_project');

    if (score >= 27 && hasProspect) {
      result.push('book_discovery_call');
      result.push('offer_free_audit');
    } else if (score >= 18 && score <= 26) {
      result.push('offer_free_audit');
      result.push('start_conversation');
    } else if (hasProspect) {
      result.push('start_conversation');
      result.push('ask_permission');
    } else {
      result.push('ask_permission');
      result.push('share_sample_project');
    }

    return result;
  }, [phase5LeadScore, phase5PipelineProspects.length, phase5SampleProject]);

  function handleSelectGoal(option: GoalOption) {
    setSelectedGoal(option.goalType);
    const goal: OutreachGoal = {
      goalType: option.goalType,
      label: option.label,
      description: option.description,
      bestFor: option.bestFor,
      ctaStyle: option.ctaStyle,
      riskLevel: option.riskLevel,
      recommendedChannels: option.recommendedChannels,
      selectedTone,
    };
    setOutreachGoal(goal);
  }

  function handleToneChange(tone: 'Friendly' | 'Professional' | 'Direct' | 'Soft') {
    setSelectedTone(tone);
    if (outreachGoal) {
      setOutreachGoal({ ...outreachGoal, selectedTone: tone });
    }
  }

  function handleContinue() {
    confirmStep();
    nextStep();
  }

  return (
    <div className={`space-y-6 p-4 ${isDark === 'dark' ? 'text-zinc-100' : 'text-gray-900'}`}>
      <div>
        <h2 className={`text-xl font-semibold ${isDark === 'dark' ? 'text-zinc-100' : 'text-gray-900'}`}>
          Choose Your Outreach Goal
        </h2>
        <p className={`mt-1 text-sm ${isDark === 'dark' ? 'text-zinc-400' : 'text-gray-500'}`}>
          Pick the goal that best matches how you want to approach your prospect.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {GOAL_OPTIONS.map((option) => {
          const isSelected = selectedGoal === option.goalType;
          const isRecommended = recommendations.includes(option.goalType);
          const isBeginnerSafe = (BEGINNER_SAFE_GOALS as readonly string[]).includes(option.goalType);
          const d = isDark === 'dark';

          let borderClass: string;
          let bgClass: string;
          let hoverClass: string;

          if (isSelected) {
            borderClass = d ? 'border-blue-400' : 'border-blue-500';
            bgClass = d ? 'bg-blue-900/30' : 'bg-blue-50';
            hoverClass = '';
          } else if (isRecommended) {
            borderClass = d ? 'border-amber-700' : 'border-amber-300';
            bgClass = d ? 'bg-amber-900/15' : 'bg-amber-50/40';
            hoverClass = d ? 'hover:border-amber-600' : 'hover:border-amber-400';
          } else {
            borderClass = d ? 'border-zinc-700' : 'border-gray-200';
            bgClass = d ? 'bg-zinc-900' : 'bg-white';
            hoverClass = d ? 'hover:border-zinc-500' : 'hover:border-gray-300';
          }

          return (
            <button
              key={option.goalType}
              type="button"
              onClick={() => handleSelectGoal(option)}
              className={`relative text-left rounded-lg border-2 p-4 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm ${borderClass} ${bgClass} ${hoverClass}`}
            >
              {isSelected && (
                <span className={`absolute top-2 right-2 text-xs font-medium text-white bg-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1`}>
                  <CheckIcon />
                  Selected
                </span>
              )}
              {isRecommended && !isSelected && (
                <span className={`absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  d ? 'text-amber-300 bg-amber-900/40' : 'text-amber-700 bg-amber-100'
                }`}>
                  <StarIcon />
                  Recommended
                </span>
              )}
              {isBeginnerSafe && !isRecommended && (
                <span className={`absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                  d ? 'text-green-300 bg-green-900/30' : 'text-green-700 bg-green-100'
                }`}>
                  Beginner Safe
                </span>
              )}

              <h3 className={`text-base font-semibold pr-20 ${isSelected ? (d ? 'text-blue-300' : 'text-blue-800') : (d ? 'text-zinc-200' : 'text-gray-800')}`}>
                {option.label}
              </h3>
              <p className={`mt-1 text-sm ${isSelected ? (d ? 'text-blue-200' : 'text-blue-600') : (d ? 'text-zinc-400' : 'text-gray-500')}`}>
                {option.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  option.riskLevel === 'Very Low'
                    ? d ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'
                    : option.riskLevel === 'Low'
                      ? d ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-600'
                      : option.riskLevel === 'Medium'
                        ? d ? 'bg-yellow-900/20 text-yellow-300' : 'bg-yellow-50 text-yellow-700'
                        : d ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700'
                }`}>
                  {option.riskLevel}
                </span>
                <span className={`text-xs self-center ${d ? 'text-zinc-500' : 'text-gray-400'}`}>
                  {option.ctaStyle}
                </span>
              </div>

              {isSelected && (
                <div className={`mt-3 text-xs ${d ? 'text-blue-300' : 'text-blue-500'}`}>
                  <span className="font-medium">Best for:</span> {option.bestFor.join(', ')}
                  <br />
                  <span className="font-medium">Channels:</span> {option.recommendedChannels.join(', ')}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark === 'dark' ? 'text-zinc-300' : 'text-gray-700'}`}>
          Tone
        </label>
        <div className="flex flex-wrap gap-2">
          {TONES.map((tone) => (
            <button
              key={tone}
              type="button"
              onClick={() => handleToneChange(tone)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedTone === tone
                  ? 'bg-blue-600 text-white shadow-sm'
                  : isDark === 'dark'
                    ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tone}
            </button>
          ))}
        </div>
      </div>

      <div className={`flex justify-end pt-4 border-t ${isDark === 'dark' ? 'border-zinc-700' : 'border-gray-200'}`}>
        <button
          type="button"
          disabled={!selectedGoal}
          onClick={handleContinue}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
            selectedGoal
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
              : isDark === 'dark'
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
