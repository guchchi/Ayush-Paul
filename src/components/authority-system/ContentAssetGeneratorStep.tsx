import { motion } from 'motion/react';
import { Check, ArrowRight, Plus, Trash2, Sparkles } from 'lucide-react';
import { useAuthoritySystemStore } from '../../lib/authority-system';
import type { ContentAsset } from '../../types/authority-system';
import { cn } from '../../lib/utils';
import { getServiceCategory, getAudienceLabel, generateContentAssetIdeas } from '../../lib/blueprint-content';

function emptyAsset(): ContentAsset {
  return { title: '', hook: '', format: '', mainPoints: '', cta: '', platformSuggestion: '' };
}

const FORMAT_OPTIONS = ['LinkedIn Post', 'Twitter/X Thread', 'LinkedIn Carousel', 'Blog Post', 'Newsletter', 'Case Study', 'Video Script', 'Infographic'];

const PLATFORM_OPTIONS = ['LinkedIn', 'X (Twitter)', 'Instagram', 'YouTube', 'Blog', 'Newsletter', 'Portfolio'];

export function ContentAssetGeneratorStep() {
  const rawAssets = useAuthoritySystemStore((s) => s.contentAssets);
  const assets = rawAssets ?? [];
  const setAssets = useAuthoritySystemStore((s) => s.setContentAssets);
  const confirmStep = useAuthoritySystemStore((s) => s.confirmStep);
  const nextStep = useAuthoritySystemStore((s) => s.nextStep);
  const isCompleted = useAuthoritySystemStore((s) => s.completedSteps).includes('content_asset_generator');
  const offerName = useAuthoritySystemStore((s) => s.phase2OfferName) ?? '';
  const authorityAngle = useAuthoritySystemStore((s) => s.authorityAngle) ?? '';
  const corePromise = useAuthoritySystemStore((s) => s.phase2CorePromise) ?? '';
  const niche = useAuthoritySystemStore((s) => s.phase2Niche) ?? '';
  const market = useAuthoritySystemStore((s) => s.phase2Market) ?? '';
  const uniqueMechanism = useAuthoritySystemStore((s) => s.phase2UniqueMechanism) ?? '';
  const service = useAuthoritySystemStore((s) => s.phase2Service);

  const isValid = assets.length >= 5 && assets.every((a) => a.title.trim().length > 0 && a.hook.trim().length > 0);

  const update = (i: number, key: keyof ContentAsset, v: string) => {
    setAssets(assets.map((a, idx) => idx === i ? { ...a, [key]: v } : a));
  };

  const remove = (i: number) => {
    setAssets(assets.filter((_, idx) => idx !== i));
  };

  const handleContinue = () => {
    if (!isValid) return;
    confirmStep();
    nextStep();
  };

  const cat = getServiceCategory(service);
  const audience = getAudienceLabel(niche, market);

  const generateIdeas = () => {
    const ideas = generateContentAssetIdeas(cat, audience, offerName || authorityAngle || corePromise || 'your service', niche);
    setAssets(ideas);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 6 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Content Asset Generator</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Generate 5 authority-building content ideas based on your offer. Each piece positions you as an expert.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <Sparkles size={14} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs text-white/80 font-medium">Generate or create 5 content assets</p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Use the generate button for AI-powered ideas based on your offer, or create each asset manually.
          </p>
        </div>
      </div>

      {assets.length === 0 && (
        <button
          onClick={generateIdeas}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-dashed border-brand-primary/30 bg-brand-primary/5 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10 transition-all cursor-pointer"
        >
          <Sparkles size={16} />
          Generate 5 Content Ideas
        </button>
      )}

      <div className="space-y-4">
        {[0, 1, 2, 3, 4].map((i) => {
          const asset = assets[i];
          return (
            <div key={i} className={cn(
              'p-5 rounded-2xl border transition-all duration-200',
              asset?.title ? 'bg-white/[0.02] border-white/5' : 'border-dashed border-white/10 bg-white/[0.01]',
            )}>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-brand-primary">
                  Content {i + 1}
                  {asset?.title && <Check size={10} className="text-emerald-400" />}
                </span>
                {asset && (
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
                  className="w-full py-4 flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  <Plus size={14} /> Add Content {i + 1}
                </button>
              ) : (
                <div className="space-y-3">
                  <ContentField label="Content Title" value={asset.title} onChange={(v) => update(i, 'title', v)} placeholder="e.g. Why most websites fail to convert visitors" />
                  <ContentField label="Hook" value={asset.hook} onChange={(v) => update(i, 'hook', v)} placeholder="First line that grabs attention" multiline />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">Post Format</span>
                      <select
                        value={asset.format}
                        onChange={(e) => update(i, 'format', e.target.value)}
                        className="w-full h-9 px-3 rounded-lg outline-none text-xs text-white/80 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300"
                      >
                        <option value="">Select format</option>
                        {FORMAT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">Platform</span>
                      <select
                        value={asset.platformSuggestion}
                        onChange={(e) => update(i, 'platformSuggestion', e.target.value)}
                        className="w-full h-9 px-3 rounded-lg outline-none text-xs text-white/80 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300"
                      >
                        <option value="">Select platform</option>
                        {PLATFORM_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <ContentField label="Main Points" value={asset.mainPoints} onChange={(v) => update(i, 'mainPoints', v)} multiline placeholder="Key talking points to cover" />
                  <ContentField label="CTA" value={asset.cta} onChange={(v) => update(i, 'cta', v)} placeholder="What should the reader do after?" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Content assets saved</span>
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
          Continue to Authority Profile
        </motion.button>
      )}
    </div>
  );
}

function ContentField({ label, value, onChange, placeholder, multiline }: {
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
