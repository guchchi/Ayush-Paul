import { motion } from 'motion/react';
import { Sparkles, List, Plus, Trash2, Check, ArrowRight } from 'lucide-react';
import { useClientPipelineStore } from '../../lib/client-pipeline-system';
import { cn } from '../../lib/utils';
import { getServiceCategory, generatePipelineSampleProspects } from '../../lib/blueprint-content';
import type { PipelineEntry } from '../../types/client-pipeline-system';

const STATUS_OPTIONS: PipelineEntry['status'][] = [
  'Found', 'Qualified', 'Ready for Outreach', 'Contacted', 'Replied', 'Not Fit',
];

function blankEntry(): PipelineEntry {
  return {
    id: crypto.randomUUID(),
    prospectName: '',
    platform: '',
    websiteUrl: '',
    nicheFit: '',
    visibleProblem: '',
    score: 0,
    priority: 'low' as const,
    contactAvailable: false,
    notes: '',
    status: 'Found' as const,
  };
}

function computePriority(score: number): 'high' | 'medium' | 'low' {
  if (score >= 22) return 'high';
  if (score >= 13) return 'medium';
  return 'low';
}

const priorityColors: Record<string, string> = {
  high: 'text-red-400 bg-red-500/10 border-red-500/20',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  low: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
};

export function PipelineListBuilderStep() {
  const pipelineList = useClientPipelineStore((s) => s.pipelineList);
  const setPipelineList = useClientPipelineStore((s) => s.setPipelineList);
  const confirmStep = useClientPipelineStore((s) => s.confirmStep);
  const nextStep = useClientPipelineStore((s) => s.nextStep);
  const isCompleted = useClientPipelineStore((s) => s.completedSteps).includes('pipeline_list_builder');
  const service = useClientPipelineStore((s) => s.phase4Service);
  const niche = useClientPipelineStore((s) => s.phase4Niche) ?? '';

  const cat = getServiceCategory(service);

  const validCount = pipelineList.filter(
    (p) => p.prospectName?.trim() || p.websiteUrl?.trim()
  ).length;

  const addProspect = () => {
    setPipelineList([...pipelineList, blankEntry()]);
  };

  const removeProspect = (id: string) => {
    setPipelineList(pipelineList.filter((e) => e.id !== id));
  };

  const updateEntry = (id: string, partial: Partial<PipelineEntry>) => {
    setPipelineList(
      pipelineList.map((e) => {
        if (e.id !== id) return e;
        const updated = { ...e, ...partial };
        if (partial.score !== undefined) {
          updated.priority = computePriority(partial.score);
        }
        return updated;
      }),
    );
  };

  const addSampleProspects = () => {
    const samples = generatePipelineSampleProspects(cat, niche, service ?? undefined);
    const hasOnlyBlanks = pipelineList.length > 0 && pipelineList.every(
      (p) => !p.prospectName?.trim() && !p.websiteUrl?.trim()
    );
    if (hasOnlyBlanks || pipelineList.length === 0) {
      setPipelineList(samples);
    } else {
      setPipelineList([...pipelineList, ...samples]);
    }
  };

  const handleContinue = () => {
    confirmStep();
    nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 6 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Pipeline List Builder</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Build your prospect pipeline by adding leads with their details and qualification scores.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <List size={14} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs text-white/80 font-medium">Your Prospect Pipeline</p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Add individual prospects to your pipeline. Score and prioritize each one before moving to outreach planning.
          </p>
        </div>
      </div>

      {pipelineList.length === 0 && (
        <button
          onClick={addSampleProspects}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-dashed border-brand-primary/30 bg-brand-primary/5 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10 transition-all cursor-pointer"
        >
          <Sparkles size={16} />
          Add Sample Prospects
        </button>
      )}

      {pipelineList.length > 0 && (
        <div className="flex items-center gap-2">
          <p className="text-[9px] font-medium text-zinc-500">
            {validCount} prospect{validCount !== 1 ? 's' : ''} added
          </p>
          {pipelineList.length > validCount && (
            <p className="text-[8px] text-zinc-600">
              ({pipelineList.length - validCount} blank row{pipelineList.length - validCount !== 1 ? 's' : ''})
            </p>
          )}
        </div>
      )}

      <div className="space-y-3">
        {pipelineList.map((entry) => (
          <div
            key={entry.id}
            className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">Name</p>
                  <input
                    type="text"
                    value={entry.prospectName}
                    onChange={(e) => updateEntry(entry.id, { prospectName: e.target.value })}
                    className="w-full h-8 px-2 rounded-md outline-none text-xs text-white/80 placeholder:text-zinc-500 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all"
                    placeholder="Prospect name"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">Platform</p>
                  <input
                    type="text"
                    value={entry.platform}
                    onChange={(e) => updateEntry(entry.id, { platform: e.target.value })}
                    className="w-full h-8 px-2 rounded-md outline-none text-xs text-white/80 placeholder:text-zinc-500 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all"
                    placeholder="e.g. YouTube"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">Website</p>
                  <input
                    type="text"
                    value={entry.websiteUrl}
                    onChange={(e) => updateEntry(entry.id, { websiteUrl: e.target.value })}
                    className="w-full h-8 px-2 rounded-md outline-none text-xs text-white/80 placeholder:text-zinc-500 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all"
                    placeholder="URL"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">Score</p>
                  <input
                    type="number"
                    min={0}
                    max={35}
                    value={entry.score}
                    onChange={(e) => updateEntry(entry.id, { score: parseInt(e.target.value) || 0 })}
                    className="w-full h-8 px-2 rounded-md outline-none text-xs text-white/80 placeholder:text-zinc-500 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all"
                  />
                </div>
              </div>
              <button
                onClick={() => removeProspect(entry.id)}
                className="shrink-0 p-1.5 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
              >
                <Trash2 size={12} />
              </button>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">Priority</span>
                <span className={cn(
                  'text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-md border',
                  priorityColors[entry.priority],
                )}>
                  {entry.priority}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">Status</span>
                <select
                  value={entry.status}
                  onChange={(e) => updateEntry(entry.id, { status: e.target.value as PipelineEntry['status'] })}
                  className="h-7 px-2 rounded-md outline-none text-[10px] text-white/80 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all cursor-pointer"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pipelineList.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <motion.button
            onClick={addProspect}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-4 h-9 rounded-lg text-[10px] font-bold uppercase tracking-[0.08em] bg-white/[0.03] border border-white/5 text-zinc-400 hover:bg-white/5 hover:text-zinc-300 transition-all duration-200 cursor-pointer"
          >
            <Plus size={12} />
            Add Prospect
          </motion.button>

          <motion.button
            onClick={addSampleProspects}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-4 h-9 rounded-lg text-[10px] font-bold uppercase tracking-[0.08em] bg-white/[0.03] border border-white/5 text-zinc-400 hover:bg-white/5 hover:text-zinc-300 transition-all duration-200 cursor-pointer"
          >
            <Sparkles size={12} />
            Add Sample Prospects
          </motion.button>
        </div>
      )}

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Pipeline list saved</span>
        </div>
      ) : (
        <motion.button
          onClick={handleContinue}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 px-6 h-11 rounded-lg text-xs font-bold uppercase tracking-[0.08em] bg-white text-black hover:bg-white/90 shadow-[0_0_30px_-12px_rgba(255,255,255,0.15)] transition-all duration-300 cursor-pointer"
        >
          <ArrowRight size={14} />
          Continue to Priority Plan
        </motion.button>
      )}
    </div>
  );
}
