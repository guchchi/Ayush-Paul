import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Check,
  ArrowRight,
  AlertTriangle,
  Target,
  ListChecks,
  GitBranch,
  HelpCircle,
  Plus,
  X,
} from 'lucide-react';
import { useDeliverySystemStore } from '../../../lib/delivery-system';
import { getServiceDeliveryProfile } from '../../../data/delivery-system/service-delivery-profiles';
import { composeScopeLock } from '../../../lib/delivery-system/composer';
import { getScopeHelperText } from '../../../lib/delivery-system/personalized-content';
import { cn } from '../../../lib/utils';

export function ScopeSuccessStep() {
  const upstream = useDeliverySystemStore((s) => s.upstream);
  const scopeLock = useDeliverySystemStore((s) => s.scopeLock);
  const successDefinition = useDeliverySystemStore((s) => s.successDefinition);
  const setScopeLock = useDeliverySystemStore((s) => s.setScopeLock);
  const setSuccessDefinition = useDeliverySystemStore((s) => s.setSuccessDefinition);
  const confirmStep = useDeliverySystemStore((s) => s.confirmStep);
  const nextStep = useDeliverySystemStore((s) => s.nextStep);
  const completedSteps = useDeliverySystemStore((s) => s.completedSteps);
  const isCompleted = completedSteps.includes('scope_success');

  const [generated, setGenerated] = useState(false);
  const [newIncluded, setNewIncluded] = useState('');
  const [newExcluded, setNewExcluded] = useState('');
  const [newAssumption, setNewAssumption] = useState('');

  const profile = useMemo(() => {
    if (!upstream?.serviceId) return null;
    return getServiceDeliveryProfile(upstream.serviceId);
  }, [upstream?.serviceId]);

  const helperText = useMemo(() => {
    if (!upstream) return '';
    return getScopeHelperText(upstream);
  }, [upstream]);

  const handleGenerate = () => {
    if (!upstream) return;
    const composed = composeScopeLock(upstream);
    setScopeLock({
      ...scopeLock,
      includedWork: composed.includedWork,
      excludedWork: composed.excludedWork,
      revisionAllowance: composed.revisionAllowance,
      successDefinition: composed.successDefinition,
      assumptions: composed.assumptions,
      approvalResponsibilities: 'Client point of contact',
      scopeChangeProcess: `Any changes to scope must be submitted in writing. If the change is minor and within the current project timeline, it may be accommodated. Significant changes will require a change order and may affect the timeline and pricing.`,
      unresolvedWarnings: [],
      isScopeCustom: false,
    });
    setSuccessDefinition({
      primaryGoal: composed.successDefinition,
      qualityBar: 'Work meets professional standards and client specifications',
      clientAcceptanceCriteria: 'Client formally approves the delivered work',
      completionTriggers: ['All deliverables submitted', 'Client approval received', 'Final payment processed'],
      isCustom: false,
    });
    setGenerated(true);
  };

  const handleConfirm = () => {
    confirmStep();
    nextStep();
  };

  const addIncluded = () => {
    if (!newIncluded.trim()) return;
    setScopeLock({ ...scopeLock, includedWork: [...scopeLock.includedWork, newIncluded.trim()] });
    setNewIncluded('');
  };

  const removeIncluded = (i: number) => {
    setScopeLock({ ...scopeLock, includedWork: scopeLock.includedWork.filter((_, idx) => idx !== i) });
  };

  const addExcluded = () => {
    if (!newExcluded.trim()) return;
    setScopeLock({ ...scopeLock, excludedWork: [...scopeLock.excludedWork, newExcluded.trim()] });
    setNewExcluded('');
  };

  const removeExcluded = (i: number) => {
    setScopeLock({ ...scopeLock, excludedWork: scopeLock.excludedWork.filter((_, idx) => idx !== i) });
  };

  const addAssumption = () => {
    if (!newAssumption.trim()) return;
    setScopeLock({ ...scopeLock, assumptions: [...scopeLock.assumptions, newAssumption.trim()] });
    setNewAssumption('');
  };

  const removeAssumption = (i: number) => {
    setScopeLock({ ...scopeLock, assumptions: scopeLock.assumptions.filter((_, idx) => idx !== i) });
  };

  const unresolvedWarnings = useMemo(() => {
    const w: string[] = [];
    if (scopeLock.includedWork.length === 0) w.push('No included work defined');
    if (scopeLock.excludedWork.length === 0) w.push('No excluded work defined');
    if (!scopeLock.revisionAllowance.trim()) w.push('Revision policy not set');
    if (!scopeLock.successDefinition.trim()) w.push('Success criteria not defined');
    return w;
  }, [scopeLock]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
          Step 2 of 7
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-800">
          Scope Lock & Success Definition
        </h2>
        <p className="text-sm text-zinc-500 max-w-lg">{helperText}</p>
      </div>

      {!generated ? (
        <motion.button
          onClick={handleGenerate}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 px-6 h-11 rounded-xl text-xs font-bold uppercase tracking-[0.08em] bg-[#0058be] text-white hover:bg-[#0058be]/90 shadow-sm transition-all duration-200 cursor-pointer"
        >
          <Sparkles size={14} />
          Generate Scope & Success Definition
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
                <ListChecks size={14} className="text-[#0058be]" />
                Included Work
              </h3>
              <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
                {scopeLock.includedWork.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const updated = [...scopeLock.includedWork];
                        updated[i] = e.target.value;
                        setScopeLock({ ...scopeLock, includedWork: updated });
                      }}
                      className="flex-1 h-8 px-2 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20"
                    />
                    <button
                      onClick={() => removeIncluded(i)}
                      className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newIncluded}
                    onChange={(e) => setNewIncluded(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addIncluded()}
                    placeholder="Add included work..."
                    className="flex-1 h-8 px-2 rounded-lg bg-white border border-dashed border-zinc-300 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20"
                  />
                  <button
                    onClick={addIncluded}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0058be]/10 text-[#0058be] hover:bg-[#0058be]/20 transition-all cursor-pointer"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
                <X size={14} className="text-[#0058be]" />
                Excluded Work
              </h3>
              <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
                {scopeLock.excludedWork.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const updated = [...scopeLock.excludedWork];
                        updated[i] = e.target.value;
                        setScopeLock({ ...scopeLock, excludedWork: updated });
                      }}
                      className="flex-1 h-8 px-2 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20"
                    />
                    <button
                      onClick={() => removeExcluded(i)}
                      className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newExcluded}
                    onChange={(e) => setNewExcluded(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addExcluded()}
                    placeholder="Add excluded work..."
                    className="flex-1 h-8 px-2 rounded-lg bg-white border border-dashed border-zinc-300 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20"
                  />
                  <button
                    onClick={addExcluded}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0058be]/10 text-[#0058be] hover:bg-[#0058be]/20 transition-all cursor-pointer"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
                <GitBranch size={14} className="text-[#0058be]" />
                Revision Allowance
              </h3>
              <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm">
                <textarea
                  value={scopeLock.revisionAllowance}
                  onChange={(e) => setScopeLock({ ...scopeLock, revisionAllowance: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20 resize-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
                <Target size={14} className="text-[#0058be]" />
                Success Definition
              </h3>
              <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm">
                <textarea
                  value={scopeLock.successDefinition}
                  onChange={(e) => setScopeLock({ ...scopeLock, successDefinition: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
                <HelpCircle size={14} className="text-[#0058be]" />
                Approval Responsibilities
              </h3>
              <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm">
                <textarea
                  value={scopeLock.approvalResponsibilities}
                  onChange={(e) => setScopeLock({ ...scopeLock, approvalResponsibilities: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20 resize-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
                <GitBranch size={14} className="text-[#0058be]" />
                Scope Change Process
              </h3>
              <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm">
                <textarea
                  value={scopeLock.scopeChangeProcess}
                  onChange={(e) => setScopeLock({ ...scopeLock, scopeChangeProcess: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
              <ListChecks size={14} className="text-[#0058be]" />
              Assumptions
            </h3>
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
              {scopeLock.assumptions.map((item, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const updated = [...scopeLock.assumptions];
                      updated[i] = e.target.value;
                      setScopeLock({ ...scopeLock, assumptions: updated });
                    }}
                    className="flex-1 h-8 px-2 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20"
                  />
                  <button
                    onClick={() => removeAssumption(i)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newAssumption}
                  onChange={(e) => setNewAssumption(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addAssumption()}
                  placeholder="Add assumption..."
                  className="flex-1 h-8 px-2 rounded-lg bg-white border border-dashed border-zinc-300 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/20"
                />
                <button
                  onClick={addAssumption}
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0058be]/10 text-[#0058be] hover:bg-[#0058be]/20 transition-all cursor-pointer"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          </div>

          {unresolvedWarnings.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-600" />
                <span className="text-xs font-bold text-amber-800">Unresolved Scope Warnings</span>
              </div>
              <ul className="space-y-1">
                {unresolvedWarnings.map((w, i) => (
                  <li key={i} className="text-[11px] text-amber-700 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-3">
            {isCompleted ? (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <Check size={14} className="text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">Scope & success confirmed</span>
              </div>
            ) : (
              <motion.button
                onClick={handleConfirm}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 h-11 rounded-xl text-xs font-bold uppercase tracking-[0.08em] bg-[#0058be] text-white hover:bg-[#0058be]/90 shadow-sm transition-all duration-200 cursor-pointer"
              >
                <Check size={14} />
                Confirm Scope & Proceed
                <ArrowRight size={14} />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
