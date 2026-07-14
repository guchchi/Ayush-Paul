import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Monitor, Check, Sparkles, ArrowRight, AlertTriangle,
  Eye, FileText, CheckCircle, XCircle,
} from 'lucide-react';
import { usePortfolioSystemStore } from '../../lib/portfolio-system';
import { generateProjectPresentations } from '../../lib/portfolio-system/composer';
import { composeStep4Content } from '../../lib/portfolio-system/personalized-content';
import type { Step4PersonalizedContent } from '../../lib/portfolio-system/personalized-content';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';
import type { ProjectPresentationSpec } from '../../types/portfolio-system';

function PresentationCard({
  presentation,
  onToggleAccept,
  personalized,
}: {
  presentation: ProjectPresentationSpec;
  onToggleAccept: (assetId: string) => void;
  personalized?: Step4PersonalizedContent | null;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left cursor-pointer transition-colors hover:bg-white/[0.01]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-medium text-white/90 truncate">{presentation.projectTitle}</span>
          <span className={cn(
            'shrink-0 text-[9px] font-medium uppercase tracking-[0.08em] px-2 py-0.5 rounded-full',
            presentation.isAccepted
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
              : 'bg-white/5 text-zinc-500 border border-white/5',
          )}>
            {presentation.isAccepted ? 'Accepted' : 'Draft'}
          </span>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
        >
          <CheckCircle size={14} className="text-zinc-500 shrink-0" />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-5 border-t border-white/5 pt-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-2">Honest Context</p>
                <div className="bg-white/5 border-l-2 border-white/10 rounded-r-lg px-3 py-2">
                  <p className="text-xs text-white/80 italic">{presentation.honestContextLabel}</p>
                </div>
                {personalized?.buyerProblemHelper && (
                  <p className="text-[10px] text-zinc-500 italic mt-1.5">{personalized.buyerProblemHelper}</p>
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-2">Buyer Problem</p>
                <p className="text-xs text-white/70">{presentation.buyerProblem}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-2">Proof Objective</p>
                <p className="text-[11px] text-zinc-400">{presentation.proofObjective}</p>
                {personalized?.proofObjectiveHelper && (
                  <p className="text-[10px] text-zinc-500 italic mt-1.5">{personalized.proofObjectiveHelper}</p>
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-2">Opening Media</p>
                <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-zinc-400">{presentation.openingMedia}</span>
                {personalized?.openingMediaHelper && (
                  <p className="text-[10px] text-zinc-500 italic mt-1.5">{personalized.openingMediaHelper}</p>
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-2">Presentation Sequence</p>
                <div className="flex flex-wrap gap-1.5">
                  {presentation.presentationSequence.map((step) => (
                    <span key={step} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-zinc-400">{step}</span>
                  ))}
                </div>
                {personalized?.presentationSequenceHelper && (
                  <p className="text-[10px] text-zinc-500 italic mt-1.5">{personalized.presentationSequenceHelper}</p>
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-2">Evidence Order</p>
                <div className="space-y-1.5">
                  {presentation.evidenceOrder.map((ev, evIdx) => (
                    <div key={`${ev.type}-${ev.order}`} className="flex items-start gap-2 px-2 py-1 rounded-md bg-white/[0.01]">
                      <Eye size={10} className="text-zinc-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] text-white/70 font-medium">{ev.label}</span>
                        <span className="text-[10px] text-zinc-500 ml-2">({ev.type})</span>
                        <p className="text-[10px] text-zinc-500">{ev.description}</p>
                        {personalized?.evidenceOrderHelpers[evIdx] && (
                          <p className="text-[9px] text-zinc-600 italic mt-0.5">{personalized.evidenceOrderHelpers[evIdx]}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-2">Process</p>
                  <ul className="space-y-0.5">
                    {presentation.processEvidence.map((item, i) => (
                      <li key={i} className="text-[11px] text-zinc-400 flex items-start gap-1.5">
                        <span className="text-zinc-600 mt-0.5 shrink-0">•</span>
                        {item}
                      </li>
                    ))}
                    {presentation.processEvidence.length === 0 && (
                      <li className="text-[10px] text-zinc-600 italic">None specified</li>
                    )}
                  </ul>
                  {personalized?.processHelper && (
                    <p className="text-[9px] text-zinc-600 italic mt-1">{personalized.processHelper}</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-2">Decisions</p>
                  <ul className="space-y-0.5">
                    {presentation.decisionEvidence.map((item, i) => (
                      <li key={i} className="text-[11px] text-zinc-400 flex items-start gap-1.5">
                        <span className="text-zinc-600 mt-0.5 shrink-0">•</span>
                        {item}
                      </li>
                    ))}
                    {presentation.decisionEvidence.length === 0 && (
                      <li className="text-[10px] text-zinc-600 italic">None specified</li>
                    )}
                  </ul>
                  {personalized?.decisionHelper && (
                    <p className="text-[9px] text-zinc-600 italic mt-1">{personalized.decisionHelper}</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-2">Output</p>
                  <ul className="space-y-0.5">
                    {presentation.outputEvidence.map((item, i) => (
                      <li key={i} className="text-[11px] text-zinc-400 flex items-start gap-1.5">
                        <span className="text-zinc-600 mt-0.5 shrink-0">•</span>
                        {item}
                      </li>
                    ))}
                    {presentation.outputEvidence.length === 0 && (
                      <li className="text-[10px] text-zinc-600 italic">None specified</li>
                    )}
                  </ul>
                  {personalized?.outputHelper && (
                    <p className="text-[9px] text-zinc-600 italic mt-1">{personalized.outputHelper}</p>
                  )}
                </div>
              </div>

              <div className="bg-amber-400/5 border border-amber-400/15 rounded-lg p-3 text-[11px] text-amber-400/80 italic">
                {presentation.limitationsNote}
                {personalized?.limitationsHelper && (
                  <p className="text-[10px] text-zinc-500 mt-2 not-italic">{personalized.limitationsHelper}</p>
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-2">Proof Statement</p>
                <p className="text-sm font-medium text-white/90">{presentation.proofStatement}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-2">CTA</p>
                <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  <p className="text-xs text-white/80 font-medium">{presentation.cta}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <button
                  onClick={() => onToggleAccept(presentation.assetId)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-semibold uppercase tracking-[0.08em] transition-all duration-200 cursor-pointer',
                    presentation.isAccepted
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : 'bg-white/[0.03] border border-white/10 text-zinc-400 hover:bg-white/[0.06] hover:text-white/80',
                  )}
                >
                  {presentation.isAccepted ? (
                    <><CheckCircle size={12} /> Accepted</>
                  ) : (
                    <><CheckCircle size={12} /> Accept Presentation</>
                  )}
                </button>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-2">Build Checklist</p>
                <div className="flex flex-wrap gap-1.5">
                  {presentation.buildChecklist.map((item, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-zinc-400">{item}</span>
                  ))}
                  {presentation.buildChecklist.length === 0 && (
                    <span className="text-[10px] text-zinc-600 italic">No items</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProjectPresentationsStep() {
  const upstream = usePortfolioSystemStore((s) => s.upstream);
  const projectPlacements = usePortfolioSystemStore((s) => s.projectPlacements);
  const projectPresentations = usePortfolioSystemStore((s) => s.projectPresentations);
  const setProjectPresentations = usePortfolioSystemStore((s) => s.setProjectPresentations);
  const updateProjectPresentation = usePortfolioSystemStore((s) => s.updateProjectPresentation);
  const staleSince = usePortfolioSystemStore((s) => s.staleSince);
  const markEdited = usePortfolioSystemStore((s) => s.markEdited);
  const confirmStep = usePortfolioSystemStore((s) => s.confirmStep);
  const nextStep = usePortfolioSystemStore((s) => s.nextStep);
  const isCompleted = usePortfolioSystemStore((s) => s.completedSteps).includes('project_presentations');

  const hasPlacements = projectPlacements.length > 0;
  const hasPresentations = projectPresentations.length > 0;
  const acceptedCount = projectPresentations.filter((p) => p.isAccepted).length;
  const isValid = hasPresentations && acceptedCount > 0;

  const placementAssetMap = useMemo(() => {
    if (!upstream) return new Map<string, { asset: typeof upstream.mod3ProofAssets[0]; role: string }>();
    const map = new Map<string, { asset: typeof upstream.mod3ProofAssets[0]; role: string }>();
    for (const pl of projectPlacements) {
      const asset = upstream.mod3ProofAssets.find((a) => a.id === pl.assetId);
      if (asset) map.set(pl.assetId, { asset, role: pl.role });
    }
    return map;
  }, [upstream, projectPlacements]);

  const handleGenerate = () => {
    if (!upstream) return;
    const result = generateProjectPresentations(upstream, projectPlacements);
    setProjectPresentations(result);
  };

  const handleToggleAccept = (assetId: string) => {
    const current = projectPresentations.find((p) => p.assetId === assetId);
    if (!current) return;
    updateProjectPresentation(assetId, { isAccepted: !current.isAccepted });
    markEdited('project_presentations');
  };

  const handleContinue = () => {
    if (!isValid) return;
    confirmStep();
    nextStep();
  };

  if (!upstream) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 4 of 6</span>
          <h2 className="text-2xl font-bold tracking-tight text-white/95">Project Presentations</h2>
          <p className="text-sm text-zinc-400 max-w-lg">
            Build structured presentations for each project in your portfolio.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <Monitor size={32} className="text-zinc-600" />
          <p className="text-sm text-zinc-500">Complete the previous steps to generate project presentations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 4 of 6</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Project Presentations</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Review and refine how each project is presented to your buyer.
        </p>
      </div>

      {staleSince && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-400/5 border border-amber-400/15">
          <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-400/80">
            Upstream context has changed. Regenerate presentations to match your current strategy.
          </p>
        </div>
      )}

      {!hasPresentations && (
        <button
          onClick={handleGenerate}
          disabled={!hasPlacements}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-dashed transition-all cursor-pointer',
            hasPlacements
              ? 'border-brand-primary/30 bg-brand-primary/5 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10'
              : 'border-white/5 bg-white/[0.01] text-sm font-semibold text-zinc-500 cursor-not-allowed',
          )}
        >
          <Sparkles size={16} />
          Generate Presentations
        </button>
      )}

      {hasPresentations && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
              {projectPresentations.length} presentation{projectPresentations.length !== 1 ? 's' : ''} generated, {acceptedCount} accepted
            </p>
          </div>
          {projectPresentations.map((pres) => {
            const ctx = upstream;
            const entry = ctx ? placementAssetMap.get(pres.assetId) : undefined;
            const personalized = ctx && entry
              ? composeStep4Content(ctx, entry.asset, entry.role as any)
              : null;
            return (
              <PresentationCard
                key={pres.assetId}
                presentation={pres}
                onToggleAccept={handleToggleAccept}
                personalized={personalized}
              />
            );
          })}
        </div>
      )}

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Presentations confirmed</span>
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
          Confirm & Continue
        </motion.button>
      )}
    </div>
  );
}
