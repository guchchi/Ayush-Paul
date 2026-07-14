import { motion } from 'motion/react';
import { Compass, MapPin, Check, ArrowRight } from 'lucide-react';
import { useClientPipelineStore } from '../../lib/client-pipeline-system';
import { cn } from '../../lib/utils';

const priorityColors: Record<string, string> = {
  high: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  low: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
};

export function ProspectTypeSelectorStep() {
  const pipelinePack = useClientPipelineStore((s) => s.pipelinePack);
  const confirmStep = useClientPipelineStore((s) => s.confirmStep);
  const nextStep = useClientPipelineStore((s) => s.nextStep);
  const isCompleted = useClientPipelineStore((s) => s.completedSteps).includes('prospect_type_selector');

  const channels = pipelinePack?.targetChannels ?? [];
  const isValid = channels.length > 0;

  const handleContinue = () => {
    if (!isValid) return;
    confirmStep();
    nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 3 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Discovery Channels</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Where to find prospects and how to prioritise your prospecting time across platforms.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <Compass size={14} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs text-white/80 font-medium">Where to Spend Your Time</p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Channels are prioritised based on your market, niche, offer, and authority position. Start with the highest-priority channels.
          </p>
        </div>
      </div>

      {!pipelinePack ? (
        <div className="flex items-center justify-center p-8 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="text-center space-y-2">
            <p className="text-sm text-zinc-500">Pipeline strategy not yet generated.</p>
            <p className="text-[11px] text-zinc-600">Complete upstream modules and return here.</p>
          </div>
        </div>
      ) : channels.length === 0 ? (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-400">No discovery channels generated for this configuration.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {channels
            .sort((a, b) => {
              const rank = { high: 0, medium: 1, low: 2 };
              return (rank[a.priority] ?? 1) - (rank[b.priority] ?? 1);
            })
            .map((channel, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={cn(
                      'text-[9px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-md border shrink-0',
                      priorityColors[channel.priority],
                    )}>
                      {channel.priority}
                    </span>
                    <h3 className="text-sm font-semibold text-white/90 truncate">{channel.platform}</h3>
                  </div>
                </div>
                <p className="text-xs text-zinc-300">{channel.channelType}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">Search Instructions</p>
                    <p className="text-xs text-zinc-300">{channel.searchInstructions}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">Expected Signal</p>
                    <p className="text-xs text-zinc-300">{channel.expectedSignal}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Discovery channels reviewed</span>
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
          Continue to Search Queries
        </motion.button>
      )}
    </div>
  );
}
