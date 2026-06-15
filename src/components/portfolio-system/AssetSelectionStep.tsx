import { motion } from 'motion/react';
import { Check, ArrowRight, Image, Sparkles } from 'lucide-react';
import { usePortfolioSystemStore } from '../../lib/portfolio-system';
import { cn } from '../../lib/utils';
import { ASSET_LABEL_MAP } from '../../lib/blueprint-content';

export function AssetSelectionStep() {
  const selected = usePortfolioSystemStore((s) => s.selectedAssetTypes);
  const setSelected = usePortfolioSystemStore((s) => s.setSelectedAssetTypes);
  const proofAssets = usePortfolioSystemStore((s) => s.phase3ProofAssets) ?? [];
  const confirmStep = usePortfolioSystemStore((s) => s.confirmStep);
  const nextStep = usePortfolioSystemStore((s) => s.nextStep);
  const isCompleted = usePortfolioSystemStore((s) => s.completedSteps).includes('asset_selection');

  const isValid = selected.length > 0;

  const toggle = (type: string) => {
    setSelected(selected.includes(type) ? selected.filter((t) => t !== type) : [...selected, type]);
  };

  const generate = () => {
    const types = proofAssets.map((a) => a.type).filter(Boolean);
    if (types.length > 0) {
      setSelected(types);
    } else {
      setSelected(['sample_project', 'before_after', 'process_walkthrough']);
    }
  };

  const handleContinue = () => {
    if (!isValid) return;
    confirmStep();
    nextStep();
  };

  const availableTypes = [...new Set([
    ...proofAssets.map((a) => a.type),
    'sample_project', 'before_after', 'audit_report', 'process_walkthrough',
    'mini_case_study', 'teardown_post', 'portfolio_mock_project', 'result_simulation',
  ].filter(Boolean))];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 2 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Asset Selection</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Choose which proof assets to include in your portfolio. These become your featured work.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <Image size={14} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs text-white/80 font-medium">Select from your proof assets</p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Pick the strongest assets from Module 3. Each becomes a section in your portfolio.
          </p>
        </div>
      </div>

      {selected.length === 0 && (
        <button
          onClick={generate}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-dashed border-brand-primary/30 bg-brand-primary/5 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10 transition-all cursor-pointer"
        >
          <Sparkles size={16} />
          Select from Proof Assets
        </button>
      )}

      <div className="space-y-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500">Available Assets</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {availableTypes.map((type) => {
            const label = ASSET_LABEL_MAP[type] || type.replace(/_/g, ' ');
            const isSelected = selected.includes(type);

            const proofMatch = proofAssets.find((a) => a.type === type);
            const title = proofMatch?.title || '';

            return (
              <button
                key={type}
                onClick={() => toggle(type)}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer',
                  isSelected
                    ? 'border-brand-primary/40 bg-brand-primary/[0.06]'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10',
                )}
              >
                <span className={cn(
                  'flex items-center justify-center w-5 h-5 rounded shrink-0 mt-0.5',
                  isSelected ? 'bg-brand-primary/20 border border-brand-primary/40' : 'bg-white/5 border border-white/5',
                )}>
                  {isSelected && <Check size={10} className="text-brand-primary" />}
                </span>
                <div>
                  <p className={cn('text-xs font-semibold', isSelected ? 'text-white' : 'text-white/70')}>{label}</p>
                  {title && <p className="text-[9px] text-zinc-500 mt-0.5 truncate">{title}</p>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Assets selected</span>
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
          Continue to Case Study Builder
        </motion.button>
      )}
    </div>
  );
}
