import { useMemo } from 'react';
import { Shield, Clock, Edit3, MessageSquare, Hash, RefreshCw } from 'lucide-react';
import { useOfferEngineeringStore, useModule2ResolvedContent, scopeDefaultsToScopeLimits } from '../../lib/offer-engineering';
import { getServiceCategory } from '../../lib/blueprint-content';
import { cn } from '../../lib/utils';
import type { ScopeLimits } from '../../types/offer-engineering';

export function ScopeProtectionStep() {
  const scopeLimits = useOfferEngineeringStore((s) => s.scopeLimits);
  const setScopeLimits = useOfferEngineeringStore((s) => s.setScopeLimits);
  const nextStep = useOfferEngineeringStore((s) => s.nextStep);

  const { pathContent, engineeringData, serviceId } = useModule2ResolvedContent();

  const pathScopeDefaults = pathContent?.content.scopeDefaults;

  const defaults = useMemo(() => {
    if (pathScopeDefaults) {
      return scopeDefaultsToScopeLimits(pathScopeDefaults);
    }
    return engineeringData?.scopeLimitsDefaults;
  }, [pathScopeDefaults, engineeringData]);

  const cat = getServiceCategory(serviceId);
  const scopeExplanation = {
    video: 'Scope creep kills profit margins in video editing. Locking batch sizes, revision limits, caption rounds, and turnaround SLAs upfront protects your schedule and ensures every clip meets quality standards without endless revisions.',
    wordpress: 'Scope creep kills profit margins in WordPress development. Locking page counts, plugin limits, integration scope, and support windows upfront protects your build timeline and prevents feature bloat during development.',
    design: 'Scope creep kills profit margins in design. Locking screen counts, feedback rounds, brand asset scope, and handoff boundaries upfront protects your design process and ensures predictable delivery without unlimited revision cycles.',
  }[cat];

  const isEmpty =
    scopeLimits.revisionCount <= 0 ||
    scopeLimits.communicationMethod.trim().length === 0 ||
    scopeLimits.responseTime.trim().length === 0 ||
    scopeLimits.deliveryTime.trim().length === 0 ||
    scopeLimits.includedRounds <= 0;

  const updateField = <K extends keyof ScopeLimits>(field: K, value: ScopeLimits[K]) => {
    setScopeLimits({ ...scopeLimits, [field]: value });
  };

  const applyDefaults = () => {
    if (defaults) setScopeLimits({ ...defaults });
  };

  const fields: {
    key: keyof ScopeLimits;
    icon: typeof Clock;
    label: string;
    placeholder: string;
    type: 'text' | 'number';
    value: string | number;
    hint: string;
  }[] = [
    {
      key: 'deliveryTime',
      icon: Clock,
      label: 'Delivery Time',
      placeholder: defaults?.deliveryTime || 'e.g. 48 hours',
      type: 'text',
      value: scopeLimits.deliveryTime,
      hint: 'Timeline per deliverable.',
    },
    {
      key: 'revisionCount',
      icon: Edit3,
      label: 'Revision Count',
      placeholder: 'e.g. 2',
      type: 'number',
      value: scopeLimits.revisionCount,
      hint: 'Revisions allowed per item.',
    },
    {
      key: 'includedRounds',
      icon: RefreshCw,
      label: 'Included Rounds',
      placeholder: 'e.g. 2',
      type: 'number',
      value: scopeLimits.includedRounds,
      hint: 'Rounds of structural feedback.',
    },
    {
      key: 'communicationMethod',
      icon: MessageSquare,
      label: 'Communication Channel',
      placeholder: defaults?.communicationMethod || 'e.g. Async via Slack',
      type: 'text',
      value: scopeLimits.communicationMethod,
      hint: 'Where collaboration happens.',
    },
    {
      key: 'responseTime',
      icon: Hash,
      label: 'Response SLA',
      placeholder: defaults?.responseTime || 'e.g. Within 24 hours',
      type: 'text',
      value: scopeLimits.responseTime,
      hint: 'How fast you reply.',
    },
  ];

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest mb-1">
          Step 4 of 8
        </span>
        <h2 className="text-3xl font-bold text-[#0b1c30] mb-2">Set Scope Boundaries</h2>
        <p className="text-neutral-500 text-sm leading-relaxed">
          Protect your time. Define strict boundaries so clients know exactly how you operate.
        </p>
      </div>

      {/* Scope guard explanation */}
      <div className="flex items-start gap-4 p-5 rounded-2xl border border-[#eff4ff] bg-[#eff4ff]/60">
        <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-[#eff4ff] text-[#0058be] shrink-0 mt-0.5 shadow-sm">
          <Shield size={14} className="text-[#0058be]" />
        </span>
        <div className="space-y-1">
          <p className="text-xs text-neutral-600 leading-relaxed font-medium">
            {scopeExplanation}
          </p>
        </div>
      </div>

      {/* Scope Configuration Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-4">
        {/* Card header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Scope Configuration</span>
            <p className="text-[10px] text-neutral-400">Set the working rules for this offer.</p>
          </div>
          {defaults && (
            <button
              onClick={applyDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-[10px] font-bold text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 transition-colors shadow-sm cursor-pointer select-none shrink-0"
            >
              <RefreshCw size={10} />
              Load Defaults
            </button>
          )}
        </div>

        {/* Grid of boundary fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {fields.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.key} className={cn('space-y-1.5', field.key === 'responseTime' && 'md:col-span-2')}>
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <Icon size={12} className="text-neutral-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{field.label}</span>
                </div>
                <input
                  type={field.type}
                  value={field.value || ''}
                  onChange={(e) => {
                    const val = field.type === 'number' ? (e.target.value === '' ? 0 : Number(e.target.value)) : e.target.value;
                    updateField(field.key, val as never);
                  }}
                  placeholder={field.placeholder}
                  className={cn('w-full h-10 px-4 rounded-xl outline-none text-xs text-[#0b1c30] placeholder:text-neutral-400 bg-white border border-neutral-200 focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be] transition-colors', field.key === 'responseTime' && 'max-w-sm')}
                />
                <p className="text-[10px] text-neutral-400 pl-1">{field.hint}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
        <span className="text-xs text-neutral-400">
          {isEmpty ? 'Define all five boundaries to continue' : 'All boundaries defined'}
        </span>

        <button
          onClick={nextStep}
          disabled={isEmpty}
          className={cn(
            'inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer select-none border shadow-sm',
            !isEmpty
              ? 'bg-[#0058be] hover:bg-[#0047a0] text-white border-transparent'
              : 'bg-neutral-50 border-neutral-200 text-neutral-400 cursor-not-allowed',
          )}
        >
          Lock Boundaries
        </button>
      </div>
    </div>
  );
}
