import { useCallback } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, ClipboardList, Plus, Trash2, Sparkles } from 'lucide-react';
import { usePortfolioSystemStore } from '../../lib/portfolio-system';
import type { PortfolioChecklistItem } from '../../types/portfolio-system';
import { cn } from '../../lib/utils';

const DEFAULT_ITEMS = [
  '1 strong headline',
  '1 clear service description',
  '2-3 proof assets',
  '1 case study',
  '1 process explanation',
  '1 CTA',
  'Contact method',
  'No fake claims',
];

const STATUS_OPTIONS: PortfolioChecklistItem['status'][] = ['pending', 'in_progress', 'ready'];

export function PortfolioChecklistStep() {
  const checklist = usePortfolioSystemStore((s) => s.checklist) ?? [];
  const setChecklist = usePortfolioSystemStore((s) => s.setChecklist);
  const confirmStep = usePortfolioSystemStore((s) => s.confirmStep);
  const nextStep = usePortfolioSystemStore((s) => s.nextStep);
  const isCompleted = usePortfolioSystemStore((s) => s.completedSteps).includes('portfolio_checklist');

  const isValid = checklist.length > 0;

  const generate = useCallback(() => {
    setChecklist(DEFAULT_ITEMS.map((label) => ({ label, status: 'pending' as const })));
  }, [setChecklist]);

  const updateStatus = useCallback((label: string, status: PortfolioChecklistItem['status']) => {
    setChecklist(checklist.map((i) => i.label === label ? { ...i, status } : i));
  }, [checklist, setChecklist]);

  const addCustom = useCallback(() => {
    const label = window.prompt('Add a custom checklist item:');
    if (label && label.trim()) {
      setChecklist([...checklist, { label: label.trim(), status: 'pending' as const }]);
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
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 7 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Portfolio Checklist</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Make sure your portfolio has everything it needs. Track your progress for each item.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <ClipboardList size={14} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs text-white/80 font-medium">Portfolio Readiness Checklist</p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Mark each item as pending, in progress, or ready. Generate to pre-fill the default checklist.
          </p>
        </div>
      </div>

      {checklist.length === 0 && (
        <button
          onClick={generate}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-dashed border-brand-primary/30 bg-brand-primary/5 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10 transition-all cursor-pointer"
        >
          <Sparkles size={16} />
          Generate Checklist
        </button>
      )}

      {checklist.length > 0 && (
        <div className="space-y-2">
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500">Checklist Items</p>
          <div className="space-y-1.5">
            {checklist.map((item) => (
              <div
                key={item.label}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border transition-all duration-200',
                  item.status === 'ready' ? 'border-emerald-500/20 bg-emerald-500/5'
                    : item.status === 'in_progress' ? 'border-amber-400/10 bg-amber-400/5'
                    : 'border-white/5 bg-white/[0.02]',
                )}
              >
                <span className={cn(
                  'flex items-center justify-center w-5 h-5 rounded shrink-0',
                  item.status === 'ready' ? 'bg-emerald-500/20 border border-emerald-500/40'
                    : item.status === 'in_progress' ? 'bg-amber-400/10 border border-amber-400/30'
                    : 'bg-white/5 border border-white/5',
                )}>
                  {item.status === 'ready' && <Check size={10} className="text-emerald-400" />}
                  {item.status === 'in_progress' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  {item.status === 'pending' && <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />}
                </span>

                <span className={cn(
                  'flex-1 text-xs',
                  item.status === 'ready' ? 'text-white/80 line-through' :
                  item.status === 'in_progress' ? 'text-white/90' : 'text-zinc-400',
                )}>
                  {item.label}
                </span>

                <div className="flex items-center gap-1">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(item.label, s)}
                      className={cn(
                        'px-1.5 py-0.5 rounded text-[7px] font-bold uppercase tracking-[0.08em] transition-all cursor-pointer',
                        item.status === s
                          ? s === 'ready' ? 'bg-emerald-500/20 text-emerald-400'
                            : s === 'in_progress' ? 'bg-amber-400/10 text-amber-400'
                            : 'bg-zinc-500/20 text-zinc-400'
                          : 'bg-white/5 text-zinc-500 hover:text-zinc-300',
                      )}
                    >
                      {s === 'in_progress' ? 'doing' : s}
                    </button>
                  ))}
                  <button onClick={() => remove(item.label)} className="ml-1 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer">
                    <Trash2 size={9} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={addCustom} className="flex items-center gap-2 text-xs text-brand-primary hover:text-brand-primary/80 transition-colors cursor-pointer">
        <Plus size={12} /> Add custom item
      </button>

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Checklist saved</span>
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
          Generate Portfolio Report
        </motion.button>
      )}
    </div>
  );
}
