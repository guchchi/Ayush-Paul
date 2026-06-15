import { useCallback } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, Shield, Plus, Trash2, Sparkles } from 'lucide-react';
import { useAuthoritySystemStore } from '../../lib/authority-system';
import type { TrustBuilderItem } from '../../types/authority-system';
import { cn } from '../../lib/utils';

const SUGGESTIONS: { label: string; reason: string; action: string }[] = [
  { label: 'Clear process documentation', reason: 'Shows clients exactly how you work, reducing uncertainty', action: 'Write a 3-step process doc for your service' },
  { label: 'Clear pricing structure', reason: 'Removes friction — clients know what to expect', action: 'Create a simple pricing page or one-liner' },
  { label: 'Clear scope of work', reason: 'Prevents scope creep and builds professional trust', action: 'Template a scope-of-work document' },
  { label: 'Fast response promise', reason: 'Shows reliability — clients value quick replies', action: 'Set a 24-hour response SLA' },
  { label: 'Revision policy', reason: 'Sets boundaries professionally', action: 'Define how many revisions are included' },
  { label: 'Delivery timeline guarantee', reason: 'Builds confidence in your reliability', action: 'State your standard delivery time' },
  { label: 'Work samples on request', reason: 'Lets clients verify quality before committing', action: 'Prepare 3 samples to share' },
  { label: 'Client onboarding checklist', reason: 'Makes first impression professional and organised', action: 'Create a welcome checklist for new clients' },
  { label: 'Regular progress updates', reason: 'Keeps clients informed and reduces anxiety', action: 'Template a weekly update message' },
  { label: 'Dedicated communication channel', reason: 'Shows you take the relationship seriously', action: 'Set up Slack/Discord or use email consistently' },
];

const DEFAULT_SELECTIONS = [
  'Clear process documentation',
  'Clear scope of work',
  'Revision policy',
  'Delivery timeline guarantee',
  'Work samples on request',
  'Fast response promise',
];

const STATUS_OPTIONS: TrustBuilderItem['status'][] = ['pending', 'in_progress', 'ready'];

export function TrustBuilderStep() {
  const rawChecklist = useAuthoritySystemStore((s) => s.trustBuilderChecklist);
  const checklist = rawChecklist ?? [];
  const setChecklist = useAuthoritySystemStore((s) => s.setTrustBuilderChecklist);
  const confirmStep = useAuthoritySystemStore((s) => s.confirmStep);
  const nextStep = useAuthoritySystemStore((s) => s.nextStep);
  const isCompleted = useAuthoritySystemStore((s) => s.completedSteps).includes('trust_builder');

  const isValid = checklist.length > 0;

  const toggle = useCallback((item: { label: string; reason: string; action: string }) => {
    const exists = checklist.find((i) => i.label === item.label);
    if (exists) {
      setChecklist(checklist.filter((i) => i.label !== item.label));
    } else {
      setChecklist([...checklist, { ...item, status: 'pending' as const }]);
    }
  }, [checklist, setChecklist]);

  const generateChecklist = useCallback(() => {
    const toAdd = DEFAULT_SELECTIONS.filter((label) => !checklist.find((i) => i.label === label));
    if (toAdd.length === 0) return;
    const newItems = toAdd.map((label) => {
      const src = SUGGESTIONS.find((s) => s.label === label)!;
      return { ...src, status: 'pending' as const };
    });
    setChecklist([...checklist, ...newItems]);
  }, [checklist, setChecklist]);

  const updateStatus = useCallback((label: string, status: TrustBuilderItem['status']) => {
    setChecklist(checklist.map((i) => i.label === label ? { ...i, status } : i));
  }, [checklist, setChecklist]);

  const addCustom = useCallback(() => {
    const label = window.prompt('Add a custom trust signal:');
    if (label && label.trim()) {
      setChecklist([...checklist, { label: label.trim(), reason: '', action: '', status: 'pending' as const }]);
    }
  }, [checklist, setChecklist]);

  const remove = useCallback((label: string) => {
    setChecklist(checklist.filter((i) => i.label !== label));
  }, [checklist, setChecklist]);

  const handleContinue = () => {
    if (!isValid) return;
    confirmStep();
    nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 4 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Trust Builder</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Build trust signals that show clients you are professional, reliable, and organised.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <Shield size={14} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs text-white/80 font-medium">Trust Builder Checklist</p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Select trust signals you already have or can create. Each includes a suggested action to make it real.
          </p>
        </div>
      </div>

      {checklist.length === 0 && (
        <button
          onClick={generateChecklist}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-dashed border-brand-primary/30 bg-brand-primary/5 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10 transition-all cursor-pointer"
        >
          <Sparkles size={16} />
          Generate Trust Checklist
        </button>
      )}

      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500">Select trust signals</p>
        <div className="space-y-2">
          {SUGGESTIONS.map((item) => {
            const selected = checklist.find((i) => i.label === item.label);
            return (
              <div key={item.label} className={cn(
                'rounded-xl border transition-all duration-200',
                selected ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-white/5 bg-white/[0.02]',
              )}>
                <button
                  onClick={() => toggle(item)}
                  className="w-full flex items-center gap-3 p-3 text-left cursor-pointer"
                >
                  <span className={cn(
                    'flex items-center justify-center w-5 h-5 rounded shrink-0',
                    selected ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-white/5 border border-white/5',
                  )}>
                    {selected && <Check size={10} className="text-emerald-400" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-xs font-semibold', selected ? 'text-white' : 'text-white/70')}>{item.label}</p>
                    <p className="text-[9px] text-zinc-500 mt-0.5">{item.reason}</p>
                  </div>
                  {selected && (
                    <span className="text-[9px] text-emerald-400 font-medium shrink-0">Added</span>
                  )}
                </button>
                {selected && (
                  <div className="px-3 pb-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-zinc-500">Status</span>
                      <div className="flex gap-1">
                        {STATUS_OPTIONS.map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(item.label, s)}
                            className={cn(
                              'px-2 py-0.5 rounded text-[8px] font-medium transition-all cursor-pointer',
                              selected!.status === s
                                ? s === 'ready' ? 'bg-emerald-500/20 text-emerald-400' :
                                  s === 'in_progress' ? 'bg-amber-400/10 text-amber-400' :
                                  'bg-zinc-500/20 text-zinc-400'
                                : 'bg-white/5 text-zinc-500 hover:text-zinc-300',
                            )}
                          >
                            {s.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                      <button onClick={() => remove(item.label)} className="ml-auto text-zinc-500 hover:text-red-400 transition-colors cursor-pointer">
                        <Trash2 size={10} />
                      </button>
                    </div>
                    <p className="text-[9px] text-zinc-400 italic">Action: {item.action}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button onClick={addCustom} className="flex items-center gap-2 text-xs text-brand-primary hover:text-brand-primary/80 transition-colors cursor-pointer">
        <Plus size={12} /> Add custom trust signal
      </button>

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Trust builder checklist saved</span>
        </div>
      ) : (
        <motion.button
          onClick={handleContinue}
          disabled={!isValid}
          whileTap={{ scale: 0.97 }}
          className={cn(
            'inline-flex items-center gap-2 px-6 h-11 rounded-lg text-xs font-bold uppercase tracking-[0.08em] transition-all duration-200 cursor-pointer',
            isValid
              ? 'bg-white text-black hover:bg-white/90 shadow-[0_0_30px_-12px_rgba(255,255,255,0.15)]'
              : 'bg-white/[0.03] border border-white/5 text-zinc-500 cursor-not-allowed',
          )}
        >
          <ArrowRight size={14} />
          Continue to Social Proof
        </motion.button>
      )}
    </div>
  );
}
