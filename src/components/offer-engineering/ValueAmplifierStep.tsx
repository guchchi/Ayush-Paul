import { useMemo } from 'react';
import { Zap, Check } from 'lucide-react';
import { useOfferEngineeringStore, getEngineeringDataForService } from '../../lib/offer-engineering';
import { useOpportunityMapStore } from '../../lib/opportunity-map';
import { cn } from '../../lib/utils';

export function ValueAmplifierStep() {
  const serviceId = useOpportunityMapStore((s) => s.serviceId);
  const valueAmplifier = useOfferEngineeringStore((s) => s.valueAmplifier);
  const setValueAmplifier = useOfferEngineeringStore((s) => s.setValueAmplifier);
  const nextStep = useOfferEngineeringStore((s) => s.nextStep);

  const engineeringData = useMemo(
    () => (serviceId ? getEngineeringDataForService(serviceId) : undefined),
    [serviceId],
  );

  const amplifiers = useMemo(
    () => engineeringData?.valueAmplifiers ?? [],
    [engineeringData],
  );

  const isEmpty = valueAmplifier.trim().length === 0;

  const handleSelect = (label: string) => {
    setValueAmplifier(label);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest mb-1">
          Step 5 of 8
        </span>
        <h2 className="text-3xl font-bold text-[#0b1c30] mb-2">Choose a Value Amplifier</h2>
        <p className="text-neutral-500 text-sm leading-relaxed">
          Add a premium bonus that makes your offer irresistible. Pick one amplifier to differentiate your service.
        </p>
      </div>

      <div className="flex items-start gap-4 p-5 rounded-2xl border border-[#eff4ff] bg-[#eff4ff]/60">
        <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-[#eff4ff] text-[#0058be] shrink-0 mt-0.5 shadow-sm">
          <Zap size={14} className="text-[#0058be]" />
        </span>
        <div className="space-y-1">
          <p className="text-xs text-neutral-600 leading-relaxed font-medium">
            A value amplifier is a bonus deliverable or asset that increases perceived value without adding high cost. Think of it as your &ldquo;cherry on top.&rdquo;
          </p>
        </div>
      </div>

      {amplifiers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {amplifiers.map((amp) => {
            const isSelected = valueAmplifier === amp.label;
            return (
              <button
                key={amp.id}
                onClick={() => handleSelect(amp.label)}
                className={cn(
                  'relative flex flex-col gap-1 w-full p-5 rounded-2xl text-left border shadow-sm transition-all duration-150 group cursor-pointer bg-white',
                  isSelected
                    ? 'border-[#0058be] ring-1 ring-[#0058be] shadow-[0_8px_32px_rgba(0,88,190,0.1)]'
                    : 'border-neutral-200 hover:border-neutral-350 hover:shadow-md',
                )}
              >
                <div className="flex items-center gap-2.5 w-full">
                  {isSelected ? (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0058be] text-[#d1f34d] shrink-0">
                      <Check size={11} className="stroke-[3]" />
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full border border-neutral-200 bg-transparent shrink-0" />
                  )}
                  <span className={cn(
                    'text-xs font-bold transition-colors truncate',
                    isSelected ? 'text-[#0058be]' : 'text-neutral-600 group-hover:text-[#0b1c30]',
                  )}>
                    {amp.label}
                  </span>
                </div>

                <span className="text-xs text-neutral-500 leading-relaxed pl-7.5 mt-0.5">
                  {amp.description}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center p-8 rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <p className="text-xs text-neutral-500">No value amplifiers configured for this service.</p>
        </div>
      )}

      {/* Confirm CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
        <span className="text-xs text-neutral-400">
          {isEmpty ? 'Select an amplifier to continue' : 'Amplifier confirmed'}
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
          Confirm Amplifier
        </button>
      </div>
    </div>
  );
}
