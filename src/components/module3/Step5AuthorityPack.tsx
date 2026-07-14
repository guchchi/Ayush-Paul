import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft, CheckCircle2, Circle,
  Copy, Download, FileText, Check, AlertTriangle, ExternalLink, Shield, Sparkles
} from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';
import { useModule3Store } from '../../lib/module3';
import { compileAuthorityPack, compileMarkdown } from '../../data/module3/authority-pack';
import type { CompiledAuthorityPack } from '../../data/module3/authority-pack';
import type { ChecklistItem } from '../../types/module3';
import { composeStep5Content, buildPersonalizationContext } from '../../lib/module3/personalized-content';
import { StepHeader } from '../workspace/StepHeader';
import { ModuleButton } from '../workspace/ModuleButton';

const CHECKLIST_TEMPLATES: { id: string; category: ChecklistItem['category']; task: string }[] = [
  { id: 'build_1', category: 'build', task: 'Create proof asset #1 from its brief' },
  { id: 'build_2', category: 'build', task: 'Create proof asset #2 from its brief' },
  { id: 'build_3', category: 'build', task: 'Create proof asset #3 from its brief' },
  { id: 'assemble_1', category: 'assemble', task: 'Update professional headline on platforms' },
  { id: 'assemble_2', category: 'assemble', task: 'Write short bio using generated copy' },
  { id: 'assemble_3', category: 'assemble', task: 'Add credibility bullets to profiles' },
  { id: 'assemble_4', category: 'assemble', task: 'Upload proof assets to portfolio' },
  { id: 'publish_1', category: 'publish', task: 'Publish proof asset #1' },
  { id: 'publish_2', category: 'publish', task: 'Publish proof asset #2' },
  { id: 'publish_3', category: 'publish', task: 'Publish proof asset #3' },
  { id: 'publish_4', category: 'publish', task: 'Share portfolio with proof reference line' },
];

const CATEGORY_LABELS: Record<string, string> = {
  build: 'Build',
  assemble: 'Assemble',
  publish: 'Publish',
};

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    build: 'bg-blue-50 text-blue-700 border-blue-200',
    assemble: 'bg-purple-50 text-purple-700 border-purple-200',
    publish: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
  return (
    <span className={cn('text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded border', colors[category] || 'bg-neutral-100 text-neutral-500 border-neutral-200')}>
      {CATEGORY_LABELS[category] || category}
    </span>
  );
}

function ReadinessCard({ label, ready }: { label: string; ready: boolean }) {
  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-colors',
      ready
        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
        : 'bg-neutral-50 border-neutral-200 text-neutral-500',
    )}>
      {ready ? (
        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
      ) : (
        <Circle size={14} className="text-neutral-400 shrink-0" />
      )}
      <span>{label}</span>
    </div>
  );
}

export function Step5AuthorityPack() {
  const packInput = useModule3Store(
    useShallow((state) => ({
      authorityPosition: state.authorityPosition,
      coreTrustPromise: state.coreTrustPromise,
      proofPriorities: state.proofPriorities,
      proofAssets: state.proofAssets,
      profileCopy: state.profileCopy,
      portfolioCopy: state.portfolioCopy,
      checklist: state.checklist,
    }))
  );

  const pack = useMemo(() => compileAuthorityPack(packInput as any), [packInput]);

  const checklist = useModule3Store((s) => s.checklist);
  const setChecklist = useModule3Store((s) => s.setChecklist);
  const updateChecklistItem = useModule3Store((s) => s.updateChecklistItem);
  const confirmStep = useModule3Store((s) => s.confirmStep);
  const setIsCompleted = useModule3Store((s) => s.setIsCompleted);
  const isCompleted = useModule3Store((s) => s.isCompleted);
  const completedSteps = useModule3Store((s) => s.completedSteps);
  const jumpToStep = useModule3Store((s) => s.jumpToStep);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const hasProfile = useModule3Store((s) => !!s.profileCopy.professionalHeadline);

  const mod1ServiceId = useModule3Store((s) => s.mod1ServiceId);
  const mod1MarketId = useModule3Store((s) => s.mod1MarketId);
  const mod1NicheId = useModule3Store((s) => s.mod1NicheId);
  const mod1Positioning = useModule3Store((s) => s.mod1Positioning);
  const mod2OfferType = useModule3Store((s) => s.mod2OfferType);
  const mod2Deliverables = useModule3Store((s) => s.mod2Deliverables);
  const mod2UniqueMechanism = useModule3Store((s) => s.mod2UniqueMechanism);
  const mod2ValueAmplifier = useModule3Store((s) => s.mod2ValueAmplifier);

  const personalized = useMemo(() => {
    const pctx = buildPersonalizationContext({
      serviceId: mod1ServiceId,
      marketId: mod1MarketId,
      nicheId: mod1NicheId,
      positioning: mod1Positioning,
      offerType: mod2OfferType,
      deliverables: mod2Deliverables,
      uniqueMechanism: mod2UniqueMechanism,
      valueAmplifier: mod2ValueAmplifier,
      authorityPosition: null,
      coreTrustPromise: '',
      proofPriorities: undefined,
      proofAssets: undefined,
    });
    return composeStep5Content(pctx);
  }, [mod1ServiceId, mod1MarketId, mod1NicheId, mod1Positioning, mod2OfferType, mod2Deliverables, mod2UniqueMechanism, mod2ValueAmplifier]);

  useEffect(() => {
    if (checklist.length > 0 || CHECKLIST_TEMPLATES.length === 0) return;

    setChecklist(
      CHECKLIST_TEMPLATES.map((template) => ({
        ...template,
        isCompleted: false,
      }))
    );
  }, [checklist.length, setChecklist]);

  const initialized = checklist.length === 0 ? CHECKLIST_TEMPLATES.map(t => ({ ...t, isCompleted: false })) : checklist;

  const completedChecklistCount = initialized.filter((c) => c.isCompleted).length;
  const totalChecklistCount = initialized.length;

  const handleCopy = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  }, []);

  const handleExport = useCallback(() => {
    const state = useModule3Store.getState();
    const compiled = compileAuthorityPack(state);
    const md = compileMarkdown(compiled);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'authority-pack.md';
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleComplete = () => {
    if (isCompleted) return;
    confirmStep();
    setIsCompleted(true);
  };

  const handleToggleChecklist = (id: string) => {
    const item = initialized.find((c) => c.id === id);
    if (item) {
      updateChecklistItem(id, { isCompleted: !item.isCompleted });
    }
  };

  const sectionCopy = useCallback((type: string): string => {
    const state = useModule3Store.getState();
    const compiled = compileAuthorityPack(state);
    switch (type) {
      case 'position': return `# Authority Position\n\n${compiled.authorityPosition}\n\n## Core Trust Promise\n\n${compiled.coreTrustPromise}`;
      case 'priorities': return `# Proof Priorities\n\n${compiled.proofPriorities.map((p, i) => `${i+1}. ${p.gapTitle} — ${p.recommendedFormat}`).join('\n')}`;
      case 'assets': return compiled.proofAssets.map((a) => `## ${a.title}\n- **Format:** ${a.assetType}\n- **Headline:** ${a.headline}\n- **Description:** ${a.description}\n- **Proof Statement:** ${a.proofStatement}\n- **CTA:** ${a.cta}`).join('\n\n');
      case 'profile': return `# Profile Copy\n\n- **Headline:** ${compiled.profileCopy.professionalHeadline}\n- **Short Bio:** ${compiled.profileCopy.shortBio}\n- **Long Bio:** ${compiled.profileCopy.longBio}\n- **Offer:** ${compiled.profileCopy.offerStatement}\n- **Bullets:** ${compiled.profileCopy.credibilityBullets.join(', ')}\n- **Proof Ref:** ${compiled.profileCopy.proofReferenceLine}\n- **CTA:** ${compiled.profileCopy.ctaLine}`;
      case 'portfolio': return `# Portfolio\n\n**CTA:** ${compiled.portfolioCopy.portfolioCta}\n\n${compiled.portfolioCopy.sections.map((s) => `## ${s.heading}\n${s.body}`).join('\n\n')}`;
      default: return '';
    }
  }, []);

  const copyFullPack = useCallback(() => {
    const state = useModule3Store.getState();
    const compiled = compileAuthorityPack(state);
    const md = compileMarkdown(compiled);
    handleCopy(md, 'full');
  }, [handleCopy]);

  if (!hasProfile) {
    return (
      <div className="space-y-6">
        <StepHeader
          step={{ current: 5, total: 5 }}
          title="Authority Pack"
          description="Compile all outputs and prepare to publish for your market."
        />
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center space-y-4">
          <AlertTriangle size={24} className="mx-auto text-amber-700" />
          <p className="text-sm text-neutral-600">{personalized.emptyStateGuidance}</p>
          <ModuleButton variant="primary" onClick={() => jumpToStep('profile_portfolio')}>
            Go to Step 4
          </ModuleButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 mb-3 border border-emerald-200">
          <Sparkles size={10} />
          Complete
        </span>
        <h2 className="text-3xl font-bold text-[#0b1c30] tracking-tight">Your Authority System Is Ready</h2>
        <p className="text-sm text-neutral-500 mt-1.5 leading-relaxed max-w-xl">
          {personalized.completedDescription}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <ReadinessCard label="Authority Position" ready={!!pack.authorityPosition} />
        <ReadinessCard label="3 Proof Assets" ready={pack.proofAssets.length === 3} />
        <ReadinessCard label="Profile Copy" ready={!!pack.profileCopy.professionalHeadline} />
        <ReadinessCard label="Portfolio Structure" ready={pack.portfolioCopy.sections.length > 0} />
      </div>

      <div className="space-y-4">
        <SectionCard
          title="Authority Position"
          onCopy={() => handleCopy(sectionCopy('position'), 'position')}
          copied={copiedId === 'position'}
        >
          <p className="text-sm font-semibold text-[#0b1c30]">{pack.authorityPosition}</p>
          {pack.coreTrustPromise && <p className="text-xs text-neutral-500 mt-2 leading-relaxed">{pack.coreTrustPromise}</p>}
        </SectionCard>

        <SectionCard
          title="Proof Priorities"
          onCopy={() => handleCopy(sectionCopy('priorities'), 'priorities')}
          copied={copiedId === 'priorities'}
        >
          <div className="space-y-2">
            {pack.proofPriorities.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-[#0058be]/10 flex items-center justify-center text-[9px] font-bold text-[#0058be] shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#0b1c30]">{p.gapTitle}</p>
                  <p className="text-[10px] text-neutral-500">{p.recommendedFormat.replace(/_/g, ' ')}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title={`Proof Assets (${pack.proofAssets.length})`}
          onCopy={() => handleCopy(sectionCopy('assets'), 'assets')}
          copied={copiedId === 'assets'}
        >
          <div className="space-y-2">
            {pack.proofAssets.map((a, i) => (
              <details key={a.id} className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
                <summary className="flex items-center gap-2 p-3 cursor-pointer hover:bg-neutral-50 transition-colors">
                  <span className={cn('w-3 h-3 rounded-full border', a.isAccepted ? 'bg-emerald-100 border-emerald-400' : 'bg-neutral-100 border-neutral-300')} />
                  <span className="text-xs font-medium text-[#0b1c30] flex-1">{a.title}</span>
                  <span className="text-[9px] text-neutral-500">{a.assetType.replace(/_/g, ' ')}</span>
                </summary>
                <div className="px-4 pb-4 space-y-2 border-t border-neutral-100 pt-3">
                  <p className="text-[10px] text-neutral-500"><span className="text-neutral-400 font-medium">Headline:</span> {a.headline}</p>
                  <p className="text-[10px] text-neutral-500"><span className="text-neutral-400 font-medium">Description:</span> {a.description}</p>
                  <p className="text-[10px] text-neutral-500"><span className="text-neutral-400 font-medium">Proof:</span> {a.proofStatement}</p>
                  <p className="text-[10px] text-neutral-500"><span className="text-neutral-400 font-medium">CTA:</span> {a.cta}</p>
                </div>
              </details>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Profile Copy"
          onCopy={() => handleCopy(sectionCopy('profile'), 'profile')}
          copied={copiedId === 'profile'}
        >
          <div className="space-y-2">
            <p className="text-[11px] text-neutral-500"><span className="text-neutral-400 font-medium">Headline:</span> {pack.profileCopy.professionalHeadline}</p>
            <p className="text-[11px] text-neutral-500"><span className="text-neutral-400 font-medium">Bio:</span> {pack.profileCopy.shortBio}</p>
            <p className="text-[11px] text-neutral-500"><span className="text-neutral-400 font-medium">Offer:</span> {pack.profileCopy.offerStatement}</p>
            <p className="text-[11px] text-neutral-500"><span className="text-neutral-400 font-medium">CTA:</span> {pack.profileCopy.ctaLine}</p>
          </div>
        </SectionCard>

        <SectionCard
          title="Portfolio Structure"
          onCopy={() => handleCopy(sectionCopy('portfolio'), 'portfolio')}
          copied={copiedId === 'portfolio'}
        >
          <div className="space-y-2">
            <p className="text-[11px] text-neutral-500"><span className="text-neutral-400 font-medium">CTA:</span> {pack.portfolioCopy.portfolioCta}</p>
            <div className="space-y-1 mt-2">
              {pack.portfolioCopy.sections.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px]">
                  <span className="text-[8px] font-bold uppercase tracking-wider px-1 py-0.5 rounded bg-neutral-100 text-neutral-500">{s.type.replace(/_/g, ' ')}</span>
                  <span className="text-neutral-600">{s.heading}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="flex items-center gap-2">
        <ModuleButton variant="secondary" onClick={copyFullPack}>
          {copiedId === 'full' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
          {copiedId === 'full' ? 'Copied' : 'Copy Full Pack'}
        </ModuleButton>
        <ModuleButton variant="secondary" onClick={handleExport}>
          <Download size={12} />
          Export Markdown
        </ModuleButton>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Publish Checklist</span>
          </div>
          <span className="text-[10px] font-bold text-neutral-500 tabular-nums">{completedChecklistCount} of {totalChecklistCount}</span>
        </div>
        <p className="text-[9px] text-neutral-400 leading-relaxed">{personalized.checklistGuidance}</p>

        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
          {(['build', 'assemble', 'publish'] as const).map((category) => {
            const items = initialized.filter((c) => c.category === category);
            if (items.length === 0) return null;
            return (
              <div key={category}>
                <div className="px-5 py-2 bg-[#f8f9ff] border-b border-neutral-100">
                  <CategoryBadge category={category} />
                </div>
                <div className="divide-y divide-neutral-100">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleToggleChecklist(item.id)}
                      className="flex items-center gap-3 w-full px-5 py-3 text-left hover:bg-neutral-50 transition-colors cursor-pointer group"
                      role="checkbox"
                      aria-checked={item.isCompleted}
                    >
                      <div className={cn(
                        'flex items-center justify-center w-5 h-5 rounded border-2 transition-all shrink-0',
                        item.isCompleted
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-neutral-300 group-hover:border-neutral-400',
                      )}>
                        {item.isCompleted && <Check size={10} className="text-white stroke-[3]" />}
                      </div>
                      <span className={cn(
                        'text-xs leading-relaxed',
                        item.isCompleted ? 'text-neutral-400 line-through' : 'text-[#0b1c30]'
                      )}>
                        {item.task}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
        <ModuleButton variant="secondary" onClick={() => jumpToStep('profile_portfolio')}>
          <ArrowLeft size={12} />
          Back
        </ModuleButton>
        <div className="flex items-center gap-2">
          {!isCompleted && (
            <ModuleButton variant="primary" onClick={handleComplete}>
              <Check size={13} />
              Complete Authority System
            </ModuleButton>
          )}
          <a
            href="/workspace/portfolio-system"
            className={cn(
              'inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer no-underline',
              'border-neutral-200 bg-white text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50',
            )}
          >
            Continue to Portfolio System
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  children,
  onCopy,
  copied,
}: {
  title: string;
  children: React.ReactNode;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-neutral-200 bg-white overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{title}</span>
        <button
          onClick={onCopy}
          className="flex items-center gap-1 text-[9px] text-neutral-500 hover:text-neutral-700 transition-colors cursor-pointer"
        >
          {copied ? <Check size={10} className="text-emerald-600" /> : <Copy size={10} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="p-5">
        {children}
      </div>
    </motion.div>
  );
}
