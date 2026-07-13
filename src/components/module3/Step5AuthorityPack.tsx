import { useState, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft, CheckCircle2, Circle,
  Copy, Download, FileText, Check, AlertTriangle, ExternalLink, Shield, Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';
import { useModule3Store } from '../../lib/module3';
import { compileAuthorityPack, compileMarkdown } from '../../data/module3/authority-pack';
import type { CompiledAuthorityPack } from '../../data/module3/authority-pack';
import type { ChecklistItem } from '../../types/module3';

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
  const pack = useModule3Store((s) => {
    const state = useModule3Store.getState();
    return compileAuthorityPack(state);
  });
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

  const initialized = useMemo(() => {
    if (checklist.length === 0) {
      const items: ChecklistItem[] = CHECKLIST_TEMPLATES.map((t) => ({
        ...t,
        isCompleted: false,
      }));
      setChecklist(items);
      return items;
    }
    return checklist;
  }, []);

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
        <div>
          <span className="inline-flex items-center rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 mb-3">
            Step 5 of 5
          </span>
          <h2 className="text-3xl font-bold text-[#0b1c30] tracking-tight">Authority Pack</h2>
          <p className="text-sm text-neutral-500 mt-1.5 leading-relaxed max-w-xl">Compile all outputs and prepare to publish.</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center space-y-4">
          <AlertTriangle size={24} className="mx-auto text-amber-700" />
          <p className="text-sm text-neutral-600">Complete your profile and portfolio copy in Step 4 first.</p>
          <button onClick={() => jumpToStep('profile_portfolio')} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0058be] text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer">
            Go to Step 4
          </button>
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
          Your trust position, proof plan, profile copy, and portfolio structure are compiled into one execution pack.
        </p>
      </div>

      {/* Readiness Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <ReadinessCard label="Authority Position" ready={!!pack.authorityPosition} />
        <ReadinessCard label="3 Proof Assets" ready={pack.proofAssets.length === 3} />
        <ReadinessCard label="Profile Copy" ready={!!pack.profileCopy.professionalHeadline} />
        <ReadinessCard label="Portfolio Structure" ready={pack.portfolioCopy.sections.length > 0} />
      </div>

      {/* Authority Pack Sections */}
      <div className="space-y-4">
        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Authority Position</span>
            <button onClick={() => handleCopy(sectionCopy('position'), 'position')} className="flex items-center gap-1 text-[9px] text-neutral-500 hover:text-neutral-700 transition-colors cursor-pointer">
              {copiedId === 'position' ? <Check size={10} className="text-emerald-600" /> : <Copy size={10} />}
              {copiedId === 'position' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="p-5">
            <p className="text-sm font-semibold text-[#0b1c30]">{pack.authorityPosition}</p>
            {pack.coreTrustPromise && <p className="text-xs text-neutral-500 mt-2 leading-relaxed">{pack.coreTrustPromise}</p>}
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Proof Priorities</span>
            <button onClick={() => handleCopy(sectionCopy('priorities'), 'priorities')} className="flex items-center gap-1 text-[9px] text-neutral-500 hover:text-neutral-700 transition-colors cursor-pointer">
              {copiedId === 'priorities' ? <Check size={10} className="text-emerald-600" /> : <Copy size={10} />}
              {copiedId === 'priorities' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="p-5 space-y-2">
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
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Proof Assets ({pack.proofAssets.length})</span>
            <button onClick={() => handleCopy(sectionCopy('assets'), 'assets')} className="flex items-center gap-1 text-[9px] text-neutral-500 hover:text-neutral-700 transition-colors cursor-pointer">
              {copiedId === 'assets' ? <Check size={10} className="text-emerald-600" /> : <Copy size={10} />}
              {copiedId === 'assets' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="p-5 space-y-2">
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
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Profile Copy</span>
            <button onClick={() => handleCopy(sectionCopy('profile'), 'profile')} className="flex items-center gap-1 text-[9px] text-neutral-500 hover:text-neutral-700 transition-colors cursor-pointer">
              {copiedId === 'profile' ? <Check size={10} className="text-emerald-600" /> : <Copy size={10} />}
              {copiedId === 'profile' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="p-5 space-y-2">
            <p className="text-[11px] text-neutral-500"><span className="text-neutral-400 font-medium">Headline:</span> {pack.profileCopy.professionalHeadline}</p>
            <p className="text-[11px] text-neutral-500"><span className="text-neutral-400 font-medium">Bio:</span> {pack.profileCopy.shortBio}</p>
            <p className="text-[11px] text-neutral-500"><span className="text-neutral-400 font-medium">Offer:</span> {pack.profileCopy.offerStatement}</p>
            <p className="text-[11px] text-neutral-500"><span className="text-neutral-400 font-medium">CTA:</span> {pack.profileCopy.ctaLine}</p>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Portfolio Structure</span>
            <button onClick={() => handleCopy(sectionCopy('portfolio'), 'portfolio')} className="flex items-center gap-1 text-[9px] text-neutral-500 hover:text-neutral-700 transition-colors cursor-pointer">
              {copiedId === 'portfolio' ? <Check size={10} className="text-emerald-600" /> : <Copy size={10} />}
              {copiedId === 'portfolio' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="p-5 space-y-2">
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
        </div>
      </div>

      {/* Export Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={copyFullPack}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-neutral-200 bg-white text-[10px] font-bold text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 transition-all cursor-pointer"
        >
          {copiedId === 'full' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
          {copiedId === 'full' ? 'Copied' : 'Copy Full Pack'}
        </button>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-neutral-200 bg-white text-[10px] font-bold text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 transition-all cursor-pointer"
        >
          <Download size={12} />
          Export Markdown
        </button>
      </div>

      {/* Publish Checklist */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Publish Checklist</span>
          </div>
          <span className="text-[10px] font-bold text-neutral-500 tabular-nums">{completedChecklistCount} of {totalChecklistCount}</span>
        </div>

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

      {/* Final Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
        <button
          onClick={() => jumpToStep('profile_portfolio')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-neutral-200 text-[10px] font-bold text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 transition-all cursor-pointer"
        >
          <ArrowLeft size={12} />
          Back
        </button>
        <div className="flex items-center gap-2">
          {!isCompleted && (
            <button
              onClick={handleComplete}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0058be] text-white text-xs font-bold hover:opacity-90 transition-all shadow-sm cursor-pointer"
            >
              <Check size={13} />
              Complete Authority System
            </button>
          )}
          <a
            href="/workspace/portfolio-system"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-neutral-200 bg-white text-[10px] font-bold text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 transition-all cursor-pointer no-underline"
          >
            Continue to Portfolio System
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
