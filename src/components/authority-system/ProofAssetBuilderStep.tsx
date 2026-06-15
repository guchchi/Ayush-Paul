import { useCallback } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, AlertCircle, FileText, Image, BarChart3, ClipboardList, Layers, Eye, Briefcase, TrendingUp, Clock, Target, Sparkles } from 'lucide-react';
import { useAuthoritySystemStore } from '../../lib/authority-system';
import type { ProofAsset, ProofAssetType } from '../../types/authority-system';
import { cn } from '../../lib/utils';

interface ProofOption {
  type: ProofAssetType;
  label: string;
  description: string;
  beginnerFriendly: boolean;
  icon: typeof FileText;
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  suggestedTitle?: string;
  suggestedWhatToCreate?: string;
  suggestedWhyItBuildsTrust?: string;
}

const PROOF_OPTIONS: ProofOption[] = [
  { type: 'sample_project', label: 'Sample Project', description: 'A real or anonymised project', beginnerFriendly: true, icon: Briefcase, estimatedTime: '2-4 hours', difficulty: 'easy', suggestedTitle: 'Sample project showcase', suggestedWhatToCreate: 'Create a sample project from scratch that demonstrates your core skill', suggestedWhyItBuildsTrust: 'Shows potential clients what you can deliver' },
  { type: 'before_after', label: 'Before/After Breakdown', description: 'Show transformation from your work', beginnerFriendly: true, icon: TrendingUp, estimatedTime: '1-2 hours', difficulty: 'easy', suggestedTitle: 'Before/after transformation', suggestedWhatToCreate: 'Document a before-and-after comparison of your work', suggestedWhyItBuildsTrust: 'Visually proves your ability to improve results' },
  { type: 'audit_report', label: 'Audit Report', description: 'Analysis of a public project or site', beginnerFriendly: true, icon: BarChart3, estimatedTime: '3-5 hours', difficulty: 'medium', suggestedTitle: 'Audit report', suggestedWhatToCreate: 'Analyse a public project and provide actionable recommendations', suggestedWhyItBuildsTrust: 'Demonstrates your analytical thinking and expertise' },
  { type: 'process_walkthrough', label: 'Process Walkthrough', description: 'Step-by-step of how you work', beginnerFriendly: true, icon: ClipboardList, estimatedTime: '2-3 hours', difficulty: 'easy', suggestedTitle: 'My workflow walkthrough', suggestedWhatToCreate: 'Record or document your step-by-step process for delivering work', suggestedWhyItBuildsTrust: 'Shows transparency and professionalism' },
  { type: 'mini_case_study', label: 'Mini Case Study', description: 'Problem → solution → result format', beginnerFriendly: false, icon: FileText, estimatedTime: '4-6 hours', difficulty: 'medium', suggestedTitle: 'Mini case study', suggestedWhatToCreate: 'Document a problem you solved with your approach', suggestedWhyItBuildsTrust: 'Demonstrates real problem-solving ability' },
  { type: 'teardown_post', label: 'Teardown Post', description: 'Public breakdown of industry work', beginnerFriendly: true, icon: Eye, estimatedTime: '2-3 hours', difficulty: 'easy', suggestedTitle: 'Industry teardown', suggestedWhatToCreate: 'Break down a public example and explain what works and what does not', suggestedWhyItBuildsTrust: 'Positions you as a thoughtful expert in your space' },
  { type: 'portfolio_mock_project', label: 'Portfolio Mock Project', description: 'Simulated project showing capability', beginnerFriendly: false, icon: Layers, estimatedTime: '6-10 hours', difficulty: 'hard', suggestedTitle: 'Mock project showcase', suggestedWhatToCreate: 'Build a simulated project that mirrors real client work', suggestedWhyItBuildsTrust: 'Shows you can handle real-world scenarios' },
  { type: 'result_simulation', label: 'Result Simulation', description: 'Projected outcomes based on methodology', beginnerFriendly: false, icon: Image, estimatedTime: '3-5 hours', difficulty: 'medium', suggestedTitle: 'Results projection', suggestedWhatToCreate: 'Create a projection showing potential outcomes using your method', suggestedWhyItBuildsTrust: 'Helps clientsvisualise the value you bring' },
];

const RECOMMENDATIONS: Record<string, ProofAssetType[]> = {
  beginner: ['sample_project', 'before_after', 'audit_report', 'process_walkthrough', 'portfolio_mock_project'],
  intermediate: ['mini_case_study', 'process_walkthrough', 'before_after', 'teardown_post', 'result_simulation'],
  experienced: ['mini_case_study', 'before_after', 'audit_report', 'portfolio_mock_project', 'teardown_post'],
};

export function ProofAssetBuilderStep() {
  const assets = useAuthoritySystemStore((s) => s.proofAssets);
  const setAssets = useAuthoritySystemStore((s) => s.setProofAssets);
  const credibilityLevel = useAuthoritySystemStore((s) => s.credibilityLevel);
  const confirmStep = useAuthoritySystemStore((s) => s.confirmStep);
  const nextStep = useAuthoritySystemStore((s) => s.nextStep);
  const isCompleted = useAuthoritySystemStore((s) => s.completedSteps).includes('proof_asset_builder');

  const isBeginner = credibilityLevel === 'beginner' || !credibilityLevel;
  const isValid = assets.length >= 2 && assets.every((a) => a.title.trim().length > 0);

  const toggleAsset = useCallback((type: ProofAssetType) => {
    const exists = assets.find((a) => a.type === type);
    if (exists) {
      setAssets(assets.filter((a) => a.type !== type));
    } else {
      const opt = PROOF_OPTIONS.find((o) => o.type === type)!;
      setAssets([...assets, {
        type,
        title: opt.suggestedTitle || '',
        whatToCreate: opt.suggestedWhatToCreate || '',
        whyItBuildsTrust: opt.suggestedWhyItBuildsTrust || '',
        estimatedTime: opt.estimatedTime,
        difficulty: opt.difficulty,
      }]);
    }
  }, [assets, setAssets]);

  const recommendForLevel = useCallback(() => {
    const level = credibilityLevel || 'beginner';
    const recommended = RECOMMENDATIONS[level] || RECOMMENDATIONS.beginner;
    const toAdd = recommended.filter((t) => !assets.find((a) => a.type === t));
    if (toAdd.length === 0) return;
    const newAssets = toAdd.map((type) => {
      const opt = PROOF_OPTIONS.find((o) => o.type === type)!;
      return {
        type,
        title: opt.suggestedTitle || '',
        whatToCreate: opt.suggestedWhatToCreate || '',
        whyItBuildsTrust: opt.suggestedWhyItBuildsTrust || '',
        estimatedTime: opt.estimatedTime,
        difficulty: opt.difficulty,
      };
    });
    setAssets([...assets, ...newAssets]);
  }, [assets, setAssets, credibilityLevel]);

  const updateField = useCallback((type: ProofAssetType, key: keyof ProofAsset, value: string) => {
    setAssets(assets.map((a) => a.type === type ? { ...a, [key]: value } : a));
  }, [assets, setAssets]);

  const handleContinue = () => {
    if (!isValid) return;
    confirmStep();
    nextStep();
  };

  const filtered = PROOF_OPTIONS;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 2 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Proof Asset Builder</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Choose proof assets you can create right now. Select from suggestions or use recommendations for your level.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-400/5 border border-amber-400/15">
        <AlertCircle size={14} className="text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.1em]">Ethics First</p>
          <p className="text-[10px] text-amber-400/70 mt-0.5">
            Do not create fake testimonials or fake client claims. Use your own work, samples, or simulated projects.
            {isBeginner && ' As a beginner, focus on sample projects, teardowns, and process walkthroughs.'}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500">
            Select proof assets <span className="text-zinc-500 font-normal lowercase">(need at least 2)</span>
          </p>
          {assets.length === 0 && (
            <button
              onClick={recommendForLevel}
              className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-[9px] font-bold uppercase tracking-[0.08em] bg-brand-primary/15 border border-brand-primary/30 text-brand-primary hover:bg-brand-primary/20 transition-all cursor-pointer"
            >
              <Sparkles size={11} />
              Recommend for my level
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filtered.map((opt) => {
            const selected = assets.find((a) => a.type === opt.type);
            return (
              <button
                key={opt.type}
                onClick={() => toggleAsset(opt.type)}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer',
                  selected
                    ? 'border-brand-primary/40 bg-brand-primary/[0.06]'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10',
                )}
              >
                <span className={cn(
                  'flex items-center justify-center w-7 h-7 rounded-lg shrink-0 mt-0.5',
                  selected ? 'bg-brand-primary/15 border border-brand-primary/30' : 'bg-white/5 border border-white/5',
                )}>
                  <opt.icon size={12} className={selected ? 'text-brand-primary' : 'text-zinc-500'} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className={cn('text-xs font-semibold', selected ? 'text-white' : 'text-white/70')}>{opt.label}</p>
                    <span className={cn(
                      'text-[8px] px-1.5 py-0.5 rounded font-medium',
                      opt.difficulty === 'easy' ? 'text-emerald-400 bg-emerald-500/10' :
                      opt.difficulty === 'medium' ? 'text-amber-400 bg-amber-400/10' :
                      'text-red-400 bg-red-400/10',
                    )}>{opt.difficulty}</span>
                  </div>
                  <p className="text-[9px] text-zinc-500 leading-relaxed mt-0.5">{opt.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-0.5 text-[8px] text-zinc-500"><Clock size={7} /> {opt.estimatedTime}</span>
                    {opt.beginnerFriendly && <span className="text-[8px] text-emerald-500">Beginner-safe</span>}
                  </div>
                  {selected && <span className="inline-flex items-center gap-1 mt-1 text-[9px] text-brand-primary font-medium"><Check size={8} /> Selected</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {assets.length > 0 && (
        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500">Define each asset</p>
          {assets.map((asset) => {
            const opt = PROOF_OPTIONS.find((o) => o.type === asset.type);
            return (
              <div key={asset.type} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {opt && <opt.icon size={12} className="text-brand-primary" />}
                    <span className="text-xs font-semibold text-white/80">{opt?.label}</span>
                  </div>
                  <span className="text-[8px] text-zinc-500">{opt?.estimatedTime}</span>
                </div>
                <input
                  type="text"
                  value={asset.title}
                  onChange={(e) => updateField(asset.type, 'title', e.target.value)}
                  className="w-full h-9 px-3 rounded-lg outline-none text-xs text-white/80 placeholder:text-zinc-500 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300"
                  placeholder="Asset title — e.g. Gaming Shorts Sample: Valorant Stream Edit"
                />
                <AssetField label="What to create" value={asset.whatToCreate} onChange={(v) => updateField(asset.type, 'whatToCreate', v)} placeholder="Describe what you'll actually make" />
                <AssetField label="Why it builds trust" value={asset.whyItBuildsTrust} onChange={(v) => updateField(asset.type, 'whyItBuildsTrust', v)} placeholder="What does this prove about your capability?" />
              </div>
            );
          })}
        </div>
      )}

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Proof assets saved</span>
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
          Continue to Portfolio Assets
        </motion.button>
      )}
    </div>
  );
}

function AssetField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1">
      <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full px-3 py-2 rounded-lg outline-none text-xs text-white/80 placeholder:text-zinc-500 resize-none bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300"
        placeholder={placeholder}
      />
    </div>
  );
}
