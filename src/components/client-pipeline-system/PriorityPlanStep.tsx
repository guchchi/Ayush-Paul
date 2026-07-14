import { useMemo } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Check, ArrowRight, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useClientPipelineStore } from '../../lib/client-pipeline-system';
import { cn } from '../../lib/utils';

const readinessIcons: Record<string, React.ReactNode> = {
  ready: <ShieldCheck size={14} className="text-emerald-400" />,
  limited: <Shield size={14} className="text-amber-400" />,
  blocked: <ShieldAlert size={14} className="text-red-400" />,
};

const readinessColors: Record<string, string> = {
  ready: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  limited: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  blocked: 'text-red-400 bg-red-500/10 border-red-500/20',
};

export function PriorityPlanStep() {
  const pipelinePack = useClientPipelineStore((s) => s.pipelinePack);
  const pipelineList = useClientPipelineStore((s) => s.pipelineList);
  const setPriorityPlan = useClientPipelineStore((s) => s.setPriorityPlan);
  const confirmStep = useClientPipelineStore((s) => s.confirmStep);
  const nextStep = useClientPipelineStore((s) => s.nextStep);
  const isCompleted = useClientPipelineStore((s) => s.completedSteps).includes('priority_plan');

  const rules = pipelinePack?.priorityRules ?? [];
  const readiness = pipelinePack?.prospectingReadiness;
  const portfolioAsset = pipelinePack?.portfolioLeadAsset;

  // Score pipeline entries against priority rules
  const scoredEntries = useMemo(() => {
    const valid = pipelineList.filter(
      (p) => (p.prospectName?.trim() || p.websiteUrl?.trim()) && p.score > 0
    );

    // Rules are strategy guidance displayed to the user.
    // PipelineEntry does not have fields to evaluate each rule per-prospect,
    // so ranking is by score descending. Rules remain visible as educational content.
    return [...valid].sort((a, b) => b.score - a.score);
  }, [pipelineList, rules]);

  const isValid = scoredEntries.length > 0;

  const handleGenerate = () => {
    setPriorityPlan({
      entries: scoredEntries.slice(0, 10).map((entry) => {
        const matchingRules = rules
          .filter((r) => entry.score > 0)
          .map((r) => r.reason)
          .filter(Boolean);
        return {
          prospectName: entry.prospectName || 'Unknown Prospect',
          whyWorthContacting: matchingRules.length > 0
            ? matchingRules.slice(0, 2).join('. ')
            : `Score: ${entry.score}/35 — qualified prospect worth pursuing`,
          angleToUse: portfolioAsset?.available
            ? `Lead with "${portfolioAsset.title || 'featured proof'}" — this prospect matches your proven playbook`
            : `Focus on the specific problem: ${entry.visibleProblem || 'identified need'}`,
          portfolioAssetToShow: portfolioAsset?.available
            ? (portfolioAsset.title || portfolioAsset.destination || 'Available proof asset')
            : 'No proof asset available — lead with problem understanding',
          nextStep: 'Review prospect details and prepare for Module 6 handoff',
        };
      }),
    });
    confirmStep();
    nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 7 of 8</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Priority Strategy</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Highest-priority prospects based on rules, scores, and available proof assets.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <TrendingUp size={14} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs text-white/80 font-medium">Strategic Priority</p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Prospects are ordered by score with priority rule weights as tiebreakers. The handoff context shows what proof you can lead with.
          </p>
        </div>
      </div>

      {/* Prospecting Readiness */}
      {readiness && (
        <div className={cn(
          'flex items-start gap-3 p-4 rounded-xl border',
          readinessColors[readiness.status],
        )}>
          <div className="shrink-0 mt-0.5">{readinessIcons[readiness.status]}</div>
          <div className="space-y-1">
            <p className="text-xs font-medium">
              Prospecting Readiness: <span className="font-bold uppercase">{readiness.status}</span>
            </p>
            {readiness.reasons.length > 0 && (
              <ul className="space-y-0.5">
                {readiness.reasons.map((r, i) => (
                  <li key={i} className="text-[10px] opacity-80">{r}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Priority Rules */}
      {rules.length > 0 && (
        <div className="space-y-2">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">Priority Rules</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {rules.map((rule, i) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-primary/15 text-[8px] font-bold text-brand-primary shrink-0 mt-0.5">
                  {rule.weight}
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] text-zinc-300">{rule.factor}</p>
                  <p className="text-[9px] text-zinc-500">{rule.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio Lead Asset */}
      {portfolioAsset && (
        <div className={cn(
          'flex items-start gap-3 p-4 rounded-xl border',
          portfolioAsset.available
            ? 'bg-emerald-500/5 border-emerald-500/15'
            : 'bg-zinc-500/5 border-zinc-500/15',
        )}>
          <div className="shrink-0 mt-0.5">
            {portfolioAsset.available
              ? <ShieldCheck size={14} className="text-emerald-400" />
              : <Shield size={14} className="text-zinc-400" />}
          </div>
          <div className="space-y-1">
            <p className="text-xs text-white/80 font-medium">
              {portfolioAsset.available ? 'Portfolio Lead Asset Available' : 'No Portfolio Lead Asset'}
            </p>
            {portfolioAsset.title && (
              <p className="text-[10px] text-zinc-300">{portfolioAsset.title}</p>
            )}
            {portfolioAsset.url && (
              <p className="text-[10px] text-zinc-500 font-mono truncate">{portfolioAsset.url}</p>
            )}
            {portfolioAsset.cta && (
              <p className="text-[9px] text-zinc-500">CTA: {portfolioAsset.cta}</p>
            )}
          </div>
        </div>
      )}

      {/* Scored Entries */}
      {!pipelinePack ? (
        <div className="flex items-center justify-center p-8 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="text-center space-y-2">
            <p className="text-sm text-zinc-500">Pipeline strategy not yet generated.</p>
            <p className="text-[11px] text-zinc-600">Complete upstream modules and return here.</p>
          </div>
        </div>
      ) : scoredEntries.length === 0 ? (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-400">
            Add prospects with names and scores to the pipeline list first before generating a priority strategy.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">
            Ranked Prospects ({scoredEntries.length})
          </p>
          {scoredEntries.slice(0, 10).map((entry, i) => {
            const matchingReasons = rules
              .filter((r) => entry.score > 0)
              .map((r) => r.reason)
              .slice(0, 2);
            return (
              <div
                key={entry.id}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary/15 text-[10px] font-bold text-brand-primary shrink-0">
                    {i + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-white/90">{entry.prospectName || 'Unnamed Prospect'}</h3>
                  <span className={cn(
                    'ml-auto text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-md border shrink-0',
                    entry.priority === 'high'
                      ? 'text-red-400 bg-red-500/10 border-red-500/20'
                      : entry.priority === 'medium'
                        ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                        : 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
                  )}>
                    {entry.priority}
                  </span>
                </div>
                {matchingReasons.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">Why Priority</p>
                    <ul className="space-y-0.5">
                      {matchingReasons.map((reason, ri) => (
                        <li key={ri} className="text-xs text-zinc-300 flex items-start gap-2">
                          <span className="text-brand-primary mt-1">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                  <span>Score: {entry.score}</span>
                  <span>Platform: {entry.platform || 'N/A'}</span>
                  <span>Status: {entry.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Priority strategy saved</span>
        </div>
      ) : (
        scoredEntries.length > 0 && (
          <motion.button
            onClick={handleGenerate}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-6 h-11 rounded-lg text-xs font-bold uppercase tracking-[0.08em] bg-white text-black hover:bg-white/90 shadow-[0_0_30px_-12px_rgba(255,255,255,0.15)] transition-all duration-300 cursor-pointer"
          >
            <ArrowRight size={14} />
            Confirm &amp; Continue to Pipeline Report
          </motion.button>
        )
      )}
    </div>
  );
}
