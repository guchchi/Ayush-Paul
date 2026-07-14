import { useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { Package, Check, Sparkles, AlertTriangle, ClipboardList, CheckCircle, Circle } from 'lucide-react';
import { usePortfolioSystemStore } from '../../lib/portfolio-system/store';
import type { ChecklistItem, ChecklistStatus } from '../../types/portfolio-system';
import { compileBuildPack, buildModule5Bridge, generateChecklists } from '../../lib/portfolio-system/composer';
import { composeStep6Content } from '../../lib/portfolio-system/personalized-content';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';

const nextStatus: Record<ChecklistStatus, ChecklistStatus> = {
  pending: 'in_progress',
  in_progress: 'ready',
  ready: 'pending',
};

export function PortfolioBuildPackStep() {
  const upstream = usePortfolioSystemStore((s) => s.upstream);
  const direction = usePortfolioSystemStore((s) => s.portfolioDirection);
  const platform = usePortfolioSystemStore((s) => s.platformRecommendation);
  const sections = usePortfolioSystemStore((s) => s.sections);
  const placements = usePortfolioSystemStore((s) => s.projectPlacements);
  const presentations = usePortfolioSystemStore((s) => s.projectPresentations);
  const copy = usePortfolioSystemStore((s) => s.portfolioCopy);
  const buildChecklist = usePortfolioSystemStore((s) => s.buildChecklist);
  const publishChecklist = usePortfolioSystemStore((s) => s.publishChecklist);
  const pack = usePortfolioSystemStore((s) => s.buildPack);
  const staleSince = usePortfolioSystemStore((s) => s.staleSince);
  const isCompleted = usePortfolioSystemStore((s) => s.isCompleted);
  const setBuildChecklist = usePortfolioSystemStore((s) => s.setBuildChecklist);
  const setPublishChecklist = usePortfolioSystemStore((s) => s.setPublishChecklist);
  const setBuildPack = usePortfolioSystemStore((s) => s.setBuildPack);
  const confirmStep = usePortfolioSystemStore((s) => s.confirmStep);
  const nextStep = usePortfolioSystemStore((s) => s.nextStep);
  const markEdited = usePortfolioSystemStore((s) => s.markEdited);

  const bridge = useMemo(() => (pack ? buildModule5Bridge(pack) : null), [pack]);

  const pc = useMemo(() => {
    if (!upstream) return null;
    return composeStep6Content(upstream);
  }, [upstream]);

  const buildReadyCount = buildChecklist.filter((i) => i.status === 'ready').length;
  const publishReadyCount = publishChecklist.filter((i) => i.status === 'ready').length;

  const cycleStatus = useCallback(
    (item: ChecklistItem, list: ChecklistItem[], setter: (items: ChecklistItem[]) => void) => {
      const updated = list.map((i) =>
        i.id === item.id ? { ...i, status: nextStatus[i.status] } : i,
      );
      setter(updated);
      markEdited(`checklist.${item.id}`);
    },
    [markEdited],
  );

  const handleGenerate = useCallback(() => {
    if (!upstream || !direction || !platform || !copy) return;

    const cl =
      buildChecklist.length > 0 && publishChecklist.length > 0
        ? { buildChecklist, publishChecklist }
        : generateChecklists(upstream, platform, sections, presentations);

    const result = compileBuildPack(
      upstream,
      direction,
      platform,
      sections,
      placements,
      presentations,
      copy,
      cl.buildChecklist,
      cl.publishChecklist,
    );

    setBuildPack(result);
    setBuildChecklist(result.buildChecklist);
    setPublishChecklist(result.publishChecklist);
  }, [
    upstream, direction, platform, sections, placements, presentations, copy,
    buildChecklist, publishChecklist,
    setBuildPack, setBuildChecklist, setPublishChecklist,
  ]);

  const handleComplete = useCallback(() => {
    confirmStep();
    nextStep();
  }, [confirmStep, nextStep]);

  if (!upstream) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
        className="flex flex-col items-center justify-center py-20 text-center space-y-4"
      >
        <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
          <Package size={20} className="text-zinc-500" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-white/60">No upstream context available</p>
          <p className="text-[11px] text-zinc-500 max-w-xs">
            Complete the previous steps to generate your Portfolio Build Pack.
          </p>
        </div>
      </motion.div>
    );
  }

  if (!pack) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 6 of 6</span>
          <h2 className="text-2xl font-bold tracking-tight text-white/95">Portfolio Build Pack</h2>
          <p className="text-sm text-zinc-400 max-w-lg">
            Generate your complete portfolio build pack — checklists, bridge data, and everything needed to build your portfolio.
          </p>
        </div>
        <button
          onClick={handleGenerate}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-dashed border-brand-primary/30 bg-brand-primary/5 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10 transition-all cursor-pointer"
        >
          <Sparkles size={16} />
          Generate Build Pack
        </button>
      </div>
    );
  }

  const includedSections = pack.sections.filter((s) => s.included);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 6 of 6</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Portfolio Build Pack</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Review your build pack, track progress, and hand off to the Client Pipeline.
        </p>
      </div>

      {staleSince && (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-400/5 border border-amber-400/15">
          <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-400/80">
            Upstream context has changed. Regenerate the build pack to reflect the latest data.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard label="Goal" value={pack.direction.portfolioPromise} />
        <SummaryCard label="Destination" value={pack.platform.destination.replace(/_/g, ' ')} />
        <SummaryCard label="Sections" value={`${includedSections.length} sections`} />
        <SummaryCard label="Placements" value={`${pack.projectPlacements.length} projects placed`} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ClipboardList size={14} className="text-brand-primary" />
          <span className="text-xs font-semibold text-white/80">Build Checklist</span>
          <span className="text-[10px] tabular-nums text-zinc-400 ml-auto">
            {buildReadyCount}/{buildChecklist.length} ready
          </span>
        </div>
        <div className="space-y-1">
          {buildChecklist.map((item) => (
            <ChecklistRow
              key={item.id}
              item={item}
              onClick={() => cycleStatus(item, buildChecklist, setBuildChecklist)}
              contextHint={pc?.buildChecklistContexts[item.id] ?? pc?.buildChecklistContexts[item.label] ?? ''}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ClipboardList size={14} className="text-brand-primary" />
          <span className="text-xs font-semibold text-white/80">Publish Checklist</span>
          <span className="text-[10px] tabular-nums text-zinc-400 ml-auto">
            {publishReadyCount}/{publishChecklist.length} ready
          </span>
        </div>
        <div className="space-y-1">
          {publishChecklist.map((item) => (
            <ChecklistRow
              key={item.id}
              item={item}
              onClick={() => cycleStatus(item, publishChecklist, setPublishChecklist)}
              contextHint={pc?.publishChecklistHelpers[item.id] ?? pc?.publishChecklistHelpers[item.label] ?? ''}
            />
          ))}
        </div>
      </div>

      {bridge && (
        <div className="space-y-3">
          <span className="text-xs font-semibold text-white/80">Module 5 — Client Pipeline Bridge</span>
          <div className="space-y-2 rounded-xl bg-brand-primary/5 border border-brand-primary/20 p-4">
            <BridgeRow label="Portfolio Ready" value={bridge.portfolioReady ? 'Yes' : 'No'} />
            <BridgeRow label="Destination" value={bridge.portfolioDestination.replace(/_/g, ' ')} />
            <BridgeRow label="Featured Asset" value={bridge.featuredProofTitle} />
            <BridgeRow label="CTA" value={bridge.portfolioCta} />
            <BridgeRow label="Headline" value={bridge.portfolioHeadline} />
          </div>
        </div>
      )}

      {pc && pc.nextActionHelpers.length > 0 && (
        <div className="space-y-3">
          <span className="text-xs font-semibold text-white/80">Suggested Next Actions</span>
          <div className="space-y-1.5">
            {pc.nextActionHelpers.map((action, i) => (
              <p key={i} className="flex items-start gap-2 text-[10px] text-zinc-400">
                <span className="text-brand-primary shrink-0 mt-0.5">▸</span>
                {action}
              </p>
            ))}
          </div>
        </div>
      )}

      {isCompleted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
          className="flex items-center gap-3 px-4 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
        >
          <Check size={16} className="text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-400">Portfolio System Complete! Ready for Client Pipeline.</p>
            <p className="text-[10px] text-emerald-400/60 mt-0.5 tabular-nums">
              {buildReadyCount}/{buildChecklist.length} build items ready, {publishReadyCount}/{publishChecklist.length} publish items ready
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <motion.button
            onClick={handleComplete}
            whileTap={{ scale: 0.97 }}
            className="w-full inline-flex items-center justify-center gap-2 px-6 h-12 rounded-lg bg-white text-sm font-bold text-black hover:bg-white/90 transition-all duration-200 cursor-pointer shadow-[0_0_30px_-12px_rgba(255,255,255,0.15)]"
          >
            <Check size={16} />
            Complete Portfolio System
          </motion.button>
          <p className="text-[10px] text-center text-zinc-500 tabular-nums">
            {buildReadyCount}/{buildChecklist.length} build items ready, {publishReadyCount}/{publishChecklist.length} publish items ready
          </p>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3 space-y-1">
      <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">{label}</span>
      <p className="text-[11px] text-white/80 leading-relaxed">{value}</p>
    </div>
  );
}

function ChecklistRow({ item, onClick, contextHint }: { item: ChecklistItem; onClick: () => void; contextHint?: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-200 cursor-pointer text-left"
    >
      {item.status === 'ready' ? (
        <CheckCircle size={14} className="text-emerald-400 shrink-0" />
      ) : item.status === 'in_progress' ? (
        <Circle size={14} className="text-amber-400 fill-amber-400/30 shrink-0" />
      ) : (
        <Circle size={14} className="text-zinc-500 shrink-0" />
      )}
      <div className="min-w-0">
        <span
          className={cn(
            'text-[11px] leading-relaxed',
            item.status === 'ready' ? 'text-emerald-400/80 line-through' : 'text-white/60',
          )}
        >
          {item.label}
        </span>
        {contextHint && (
          <p className="text-[8px] text-zinc-600 leading-tight mt-0.5">{contextHint}</p>
        )}
      </div>
    </button>
  );
}

function BridgeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-medium text-zinc-400">{label}</span>
      <span className="text-[10px] text-white/70 text-right max-w-[60%] truncate">{value}</span>
    </div>
  );
}
