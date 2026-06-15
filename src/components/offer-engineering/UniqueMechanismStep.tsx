import { useMemo, useState } from 'react';
import { Lightbulb, Check, PencilLine } from 'lucide-react';
import { useOfferEngineeringStore, getEngineeringDataForService } from '../../lib/offer-engineering';
import { useOpportunityMapStore } from '../../lib/opportunity-map';
import { cn } from '../../lib/utils';

export function UniqueMechanismStep() {
  const serviceId = useOpportunityMapStore((s) => s.serviceId);
  const nicheId = useOpportunityMapStore((s) => s.nicheId);
  const uniqueMechanism = useOfferEngineeringStore((s) => s.uniqueMechanism);
  const setUniqueMechanism = useOfferEngineeringStore((s) => s.setUniqueMechanism);
  const nextStep = useOfferEngineeringStore((s) => s.nextStep);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const engineeringData = useMemo(
    () => (serviceId ? getEngineeringDataForService(serviceId) : undefined),
    [serviceId],
  );

  const defaultMechanisms = engineeringData?.uniqueMechanisms ?? [];
  const nicheSpecific = nicheId ? engineeringData?.nicheMechanisms?.[nicheId] : undefined;
  const mechanisms = nicheSpecific ?? defaultMechanisms;
  const isEmpty = uniqueMechanism.trim().length === 0;

  const isSuggestedSelection = mechanisms.includes(uniqueMechanism);

  const handleSelectSuggestion = (item: string) => {
    if (uniqueMechanism === item && !editing) {
      setEditing(true);
      setEditValue(item);
      return;
    }
    setUniqueMechanism(item);
    setEditing(false);
  };

  const handleCustomChange = (value: string) => {
    setUniqueMechanism(value);
    if (editing && value !== editValue) {
      setEditing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest mb-1">
          Step 3 of 8
        </span>
        <h2 className="text-3xl font-bold text-[#0b1c30] mb-2">Name Your Unique Mechanism</h2>
        <p className="text-neutral-500 text-sm leading-relaxed">
          Don&rsquo;t sell a generic service. Sell a proprietary system. Give your methodology a unique name.
        </p>
      </div>

      {/* Context educational callout */}
      <div className="flex items-start gap-4 p-5 rounded-2xl border border-[#eff4ff] bg-[#eff4ff]/60">
        <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-[#eff4ff] text-[#0058be] shrink-0 mt-0.5 shadow-sm">
          <Lightbulb size={14} className="text-[#0058be]" />
        </span>
        <div className="space-y-1">
          <p className="text-xs text-neutral-600 leading-relaxed font-medium">
            A named system differentiates you from typical freelancers. Instead of &ldquo;video editing,&rdquo; you offer a proprietary <span className="text-[#0058be] font-bold">&ldquo;Retention Growth System.&rdquo;</span> Same execution, premium client perception.
          </p>
        </div>
      </div>

      {/* Suggested mechanisms */}
      {mechanisms.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-neutral-450">
            <Lightbulb size={13} className="text-[#0058be]" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {nicheSpecific ? `Suggested for your niche` : `Suggested Systems`}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mechanisms.map((item) => {
              const isSelected = uniqueMechanism === item;
              return (
                <button
                  key={item}
                  onClick={() => handleSelectSuggestion(item)}
                  className={cn(
                    'relative flex items-center justify-between gap-3 w-full p-4 rounded-2xl text-left border shadow-sm transition-all duration-150 group cursor-pointer bg-white',
                    isSelected
                      ? 'border-[#0058be] ring-1 ring-[#0058be] shadow-[0_8px_32px_rgba(0,88,190,0.1)]'
                      : 'border-neutral-200 hover:border-neutral-350 hover:shadow-md',
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {isSelected ? (
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0058be] text-[#d1f34d] shrink-0">
                        <Check size={11} className="stroke-[3]" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-neutral-200 bg-transparent shrink-0" />
                    )}
                    <span className={cn(
                      'text-xs transition-colors font-bold truncate',
                      isSelected ? 'text-[#0058be]' : 'text-neutral-600 group-hover:text-[#0b1c30]',
                    )}>
                      {item}
                    </span>
                  </div>

                  {isSelected && (
                    <span className="flex items-center gap-0.5 text-[9px] font-extrabold uppercase tracking-wider text-neutral-400 shrink-0">
                      <PencilLine size={10} />
                      Edit
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Write-in area */}
      <div className="space-y-2 pt-2 border-t border-neutral-200">
        <div className="flex items-center gap-1.5 text-neutral-450">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0058be]" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {isSuggestedSelection ? 'Edit Your Selection' : 'Or Write Your Own'}
          </span>
        </div>
        <input
          type="text"
          value={uniqueMechanism}
          onChange={(e) => handleCustomChange(e.target.value)}
          placeholder="e.g. Authority Acceleration Framework..."
          className="w-full h-10 px-4 rounded-xl outline-none text-xs text-[#0b1c30] placeholder:text-neutral-400 bg-white border border-neutral-200 focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be] transition-colors"
        />
      </div>

      {/* Confirm CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-[#eff4ff]">
        <span className="text-xs text-neutral-400">
          {isEmpty ? 'Name your system to continue' : 'System named'}
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
          Confirm Mechanism
        </button>
      </div>
    </div>
  );
}
