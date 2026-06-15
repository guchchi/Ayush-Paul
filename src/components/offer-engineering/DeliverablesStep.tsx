import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Package, Sparkles } from 'lucide-react';
import { useOfferEngineeringStore, getEngineeringDataForService } from '../../lib/offer-engineering';
import { useOpportunityMapStore } from '../../lib/opportunity-map';
import { cn } from '../../lib/utils';
import type { Transition } from 'motion/react';

const POP_LAYOUT_TRANSITION: Transition = { duration: 0.15 };

export function DeliverablesStep() {
  const serviceId = useOpportunityMapStore((s) => s.serviceId);
  const nicheId = useOpportunityMapStore((s) => s.nicheId);
  const deliverables = useOfferEngineeringStore((s) => s.deliverables);
  const addDeliverable = useOfferEngineeringStore((s) => s.addDeliverable);
  const removeDeliverable = useOfferEngineeringStore((s) => s.removeDeliverable);
  const nextStep = useOfferEngineeringStore((s) => s.nextStep);

  const [inputValue, setInputValue] = useState('');

  const engineeringData = useMemo(
    () => (serviceId ? getEngineeringDataForService(serviceId) : undefined),
    [serviceId],
  );

  const suggested = useMemo(() => {
    if (!engineeringData) return [];
    const nicheLabels = nicheId ? engineeringData.nicheDeliverables?.[nicheId] : undefined;
    return nicheLabels ?? engineeringData.deliverables.map((d) => d.label);
  }, [engineeringData, nicheId]);

  const selectedSet = useMemo(() => new Set(deliverables), [deliverables]);

  const handleSuggestedClick = (item: string) => {
    if (selectedSet.has(item)) {
      const idx = deliverables.indexOf(item);
      if (idx !== -1) removeDeliverable(idx);
    } else {
      addDeliverable(item);
    }
  };

  const handleAddCustom = () => {
    const val = inputValue.trim();
    if (!val) return;
    if (!selectedSet.has(val)) {
      addDeliverable(val);
    }
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustom();
    }
  };

  const isEmpty = deliverables.length === 0;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest mb-1">
          Step 2 of 8
        </span>
        <h2 className="text-3xl font-bold text-[#0b1c30] mb-2">Define Your Deliverables</h2>
        <p className="text-neutral-500 text-sm leading-relaxed">
          Choose from the suggested deliverables for your service, or add your own custom items.
        </p>
        <p className="text-xs text-neutral-400 leading-relaxed italic">
          Aim for 3&ndash;5 deliverables to build a complete, compelling package. Too few feels thin; too many dilutes focus.
        </p>
      </div>

      {/* Suggested deliverables chips */}
      {suggested.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-neutral-450">
            <Sparkles size={13} className="text-[#0058be]" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Suggested Deliverables</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggested.map((item) => {
              const isSelected = selectedSet.has(item);
              return (
                <button
                  key={item}
                  onClick={() => handleSuggestedClick(item)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer select-none border',
                    isSelected
                      ? 'bg-[#0058be] border-[#0058be] text-white hover:bg-[#0047a0] shadow-sm'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50',
                  )}
                >
                  {isSelected && <X size={12} className="text-white/80 shrink-0" />}
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Scoped Deliverables list & Empty State */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-neutral-450">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0058be]" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Your Scoped Deliverables ({deliverables.length})
          </span>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-neutral-200 bg-white text-center shadow-sm">
            <Package size={24} className="text-neutral-300 mb-2" />
            <p className="text-xs text-neutral-500 font-semibold">No deliverables added yet.</p>
            <p className="text-[11px] text-neutral-400 max-w-[280px] mt-1 leading-relaxed">
              Select suggested deliverables above or add custom ones below to define your offer scope.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5 bg-[#eff4ff]/30 border border-[#eff4ff] rounded-2xl p-3">
            <AnimatePresence mode="popLayout">
              {deliverables.map((item, idx) => (
                <motion.div
                  key={`${item}-${idx}`}
                  layout
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4, transition: POP_LAYOUT_TRANSITION }}
                  className={cn(
                    'group flex items-center justify-between gap-3 w-full px-3.5 py-2.5 rounded-xl border bg-white border-neutral-200/80 shadow-sm transition-all duration-150',
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#eff4ff] text-[#0058be] shrink-0">
                      <Package size={12} />
                    </span>
                    <span className="text-xs text-[#0b1c30] font-semibold truncate">
                      {item}
                    </span>
                  </div>

                  <button
                    onClick={() => removeDeliverable(idx)}
                    className="flex items-center justify-center w-5 h-5 rounded hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-all duration-155 cursor-pointer shrink-0"
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Input section */}
      <div className="space-y-2 pt-4 border-t border-neutral-200">
        <div className="flex items-center gap-1.5 text-neutral-450">
          <Package size={12} className="text-[#0058be]" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Add Custom Deliverable</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. 2 rounds of revisions, source files included..."
            className="flex-1 h-10 px-4 rounded-xl outline-none text-xs text-[#0b1c30] placeholder:text-neutral-400 bg-white border border-neutral-200 focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be] transition-colors"
          />
          <button
            onClick={handleAddCustom}
            disabled={!inputValue.trim()}
            className={cn(
              'inline-flex items-center gap-1 px-4 h-10 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 select-none border',
              inputValue.trim()
                ? 'bg-[#0058be] hover:bg-[#0047a0] text-white border-transparent'
                : 'bg-neutral-50 border-neutral-200 text-neutral-400 cursor-not-allowed',
            )}
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>

      {/* Confirm container */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
        <span className="text-xs text-neutral-400">
          {isEmpty ? 'Add at least one deliverable to continue' : `${deliverables.length} deliverable${deliverables.length !== 1 ? 's' : ''} defined`}
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
          Confirm Deliverables
        </button>
      </div>
    </div>
  );
}
