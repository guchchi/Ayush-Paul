import { useCallback } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, Plus, Trash2, GripVertical, Layers, Sparkles } from 'lucide-react';
import { useAuthoritySystemStore } from '../../lib/authority-system';
import type { PortfolioAsset } from '../../types/authority-system';
import { cn } from '../../lib/utils';
import { getServiceCategory, generatePortfolioAssetIdeas } from '../../lib/blueprint-content';

function emptyAsset(): PortfolioAsset {
  return { name: '', format: '', description: '', whatToInclude: '', whereToPublish: '', cta: '' };
}

export function PortfolioAssetPlanStep() {
  const assets = useAuthoritySystemStore((s) => s.portfolioAssets) ?? [];
  const setAssets = useAuthoritySystemStore((s) => s.setPortfolioAssets);
  const confirmStep = useAuthoritySystemStore((s) => s.confirmStep);
  const nextStep = useAuthoritySystemStore((s) => s.nextStep);
  const isCompleted = useAuthoritySystemStore((s) => s.completedSteps).includes('portfolio_asset_plan');
  const proofAssets = useAuthoritySystemStore((s) => s.proofAssets) ?? [];
  const service = useAuthoritySystemStore((s) => s.phase2ServiceLabel) ?? '';
  const market = useAuthoritySystemStore((s) => s.phase2Market) ?? '';
  const niche = useAuthoritySystemStore((s) => s.phase2Niche) ?? '';
  const uniqueMechanism = useAuthoritySystemStore((s) => s.phase2UniqueMechanism) ?? '';
  const phase2Service = useAuthoritySystemStore((s) => s.phase2Service);

  const isValid = assets.length >= 3 && assets.every((a) => a.name.trim().length > 0 && a.format.trim().length > 0 && a.whatToInclude.trim().length > 0);

  const cat = getServiceCategory(phase2Service);
  const context = niche || market || service || 'your service';

  const generatePlan = useCallback(() => {
    const assetNames = proofAssets.map((a) => a.title || a.type.replace(/_/g, ' '));
    const ideas = generatePortfolioAssetIdeas(cat, assetNames, context, service, uniqueMechanism, niche);
    setAssets(ideas);
  }, [proofAssets, cat, context, service, uniqueMechanism, setAssets]);

  const update = (i: number, key: keyof PortfolioAsset, v: string) => {
    setAssets(assets.map((a, idx) => idx === i ? { ...a, [key]: v } : a));
  };

  const add = () => {
    if (assets.length >= 3) return;
    setAssets([...assets, emptyAsset()]);
  };

  const remove = (i: number) => {
    setAssets(assets.filter((_, idx) => idx !== i));
  };

  const handleContinue = () => {
    if (!isValid) return;
    confirmStep();
    nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 3 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Portfolio Asset Plan</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Turn your proof assets into 3 portfolio-ready pieces. Each should show a specific capability.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <Layers size={14} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs text-white/80 font-medium">3 portfolio assets required</p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Each asset is a concrete piece of work a potential client can review. Use generate to auto-fill from your proof assets.
          </p>
        </div>
      </div>

      {assets.length === 0 && (
        <button
          onClick={generatePlan}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-dashed border-brand-primary/30 bg-brand-primary/5 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10 transition-all cursor-pointer"
        >
          <Sparkles size={16} />
          Generate Portfolio Plan
        </button>
      )}

      <div className="space-y-4">
        {[0, 1, 2].map((i) => {
          const asset = assets[i];
          const isFilled = asset && asset.name.trim().length > 0;
          return (
            <div key={i} className={cn(
              'p-5 rounded-2xl border transition-all duration-200',
              isFilled ? 'bg-white/[0.02] border-white/5' : 'border-dashed border-white/10 bg-white/[0.01]',
            )}>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-brand-primary">
                  <GripVertical size={12} />
                  Portfolio Asset {i + 1}
                  {isFilled && <Check size={10} className="text-emerald-400" />}
                </span>
                {asset && assets.length > 3 && (
                  <button onClick={() => remove(i)} className="flex items-center gap-1 text-[9px] text-zinc-500 hover:text-red-400 transition-colors cursor-pointer">
                    <Trash2 size={10} /> Remove
                  </button>
                )}
              </div>

              {!asset ? (
                <button
                  onClick={() => {
                    const newAssets = [...assets];
                    newAssets[i] = emptyAsset();
                    setAssets(newAssets);
                  }}
                  className="w-full py-6 flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  <Plus size={14} /> Add Portfolio Asset {i + 1}
                </button>
              ) : (
                <div className="space-y-3">
                  <GridField label="Asset Name" value={asset.name} onChange={(v) => update(i, 'name', v)} placeholder="e.g. Gaming Clip Breakdown" />
                  <div className="grid grid-cols-2 gap-3">
                    <GridField label="Format" value={asset.format} onChange={(v) => update(i, 'format', v)} placeholder="e.g. Video reel + breakdown doc" />
                    <GridField label="Where to Publish" value={asset.whereToPublish} onChange={(v) => update(i, 'whereToPublish', v)} placeholder="e.g. LinkedIn, portfolio" />
                  </div>
                  <GridField label="Description" value={asset.description} onChange={(v) => update(i, 'description', v)} placeholder="Brief description of the asset" multiline />
                  <GridField label="What to Include" value={asset.whatToInclude} onChange={(v) => update(i, 'whatToInclude', v)} placeholder="Key elements — original moment, hook, editing logic, result" multiline />
                  <GridField label="CTA" value={asset.cta} onChange={(v) => update(i, 'cta', v)} placeholder="e.g. Book a discovery call to see more samples" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Portfolio asset plan saved</span>
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
          Continue to Trust Builder
        </motion.button>
      )}
    </div>
  );
}

function GridField({ label, value, onChange, placeholder, multiline }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean;
}) {
  const inputClass = "w-full px-3 py-2 rounded-lg outline-none text-xs text-white/80 placeholder:text-zinc-500 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300";
  return (
    <div className="space-y-1">
      <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} className={`${inputClass} resize-none`} placeholder={placeholder} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} placeholder={placeholder} />
      )}
    </div>
  );
}
