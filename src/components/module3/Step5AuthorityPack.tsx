import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, CheckCircle2, Circle,
  Copy, Download, FileText, Check, AlertTriangle, ExternalLink, Shield, Sparkles,
  Award, ShieldAlert, Clipboard, FileCheck, Layers, Landmark
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
import { DynamicRoadmap } from '../workspace/DynamicRoadmap';

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
  build: '1. Build Proof Assets',
  assemble: '2. Assemble Profiles',
  publish: '3. Go Live & Publish',
};

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    build: 'bg-blue-50 text-blue-700 border-blue-100',
    assemble: 'bg-purple-50 text-purple-700 border-purple-100',
    publish: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };
  return (
    <span className={cn('text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border', colors[category] || 'bg-neutral-100 text-neutral-500 border-neutral-200')}>
      {CATEGORY_LABELS[category] || category}
    </span>
  );
}

export function Step5AuthorityPack() {
  const packInput = useModule3Store(
    useShallow((state) => ({
      authorityPosition: state.authorityPosition,
      coreTrustPromise: state.coreTrustPromise,
      proofPriorities: state.proofPriorities,
      proofAssets: state.proofAssets,
      profilePortfolioStrategy: state.profilePortfolioStrategy,
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
  const [activeTab, setActiveTab] = useState<'position' | 'priorities' | 'assets' | 'strategy'>('position');

  const hasStrategy = useModule3Store((s) => !!s.profilePortfolioStrategy);

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
  const progressPercent = totalChecklistCount > 0 ? Math.round((completedChecklistCount / totalChecklistCount) * 100) : 0;

  const handleCopy = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { /* clipboard unavailable */ }
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
      case 'position': 
        return `# Authority Position\n\n${compiled.authorityPosition}\n\n## Core Trust Promise\n\n${compiled.coreTrustPromise}`;
      case 'priorities': 
        return `# Proof Priorities\n\n${compiled.proofPriorities.map((p, i) => `${i+1}. ${p.gapTitle} — ${p.recommendedFormat}`).join('\n')}`;
      case 'assets': 
        return compiled.proofAssets.map((a) => `## ${a.title}\n- **Format:** ${a.assetType}\n- **Headline:** ${a.headline}\n- **Description:** ${a.description}\n- **Proof Statement:** ${a.proofStatement}\n- **CTA:** ${a.cta}`).join('\n\n');
      case 'strategy': 
        return `# Profile & Portfolio Strategy\n\n- **Primary Goal:** ${compiled.profilePortfolioStrategy?.presentationStrategy.primaryGoal}\n- **Approach:** ${compiled.profilePortfolioStrategy?.presentationStrategy.communicationApproach}`;
      default: 
        return '';
    }
  }, []);

  const copyFullPack = useCallback(() => {
    const state = useModule3Store.getState();
    const compiled = compileAuthorityPack(state);
    const md = compileMarkdown(compiled);
    handleCopy(md, 'full');
  }, [handleCopy]);

  if (!hasStrategy) {
    return (
      <div className="space-y-8 max-w-3xl mx-auto text-left">
        <StepHeader
          step={{ current: 4, total: 4 }}
          title="Authority Pack"
          description="Compile all outputs and prepare to publish for your market."
        />
        <div className="rounded-3xl border border-amber-200 bg-amber-50/50 p-8 text-center space-y-4">
          <AlertTriangle size={32} className="mx-auto text-amber-600" />
          <p className="text-sm text-neutral-600 font-semibold leading-relaxed">
            {personalized.emptyStateGuidance || "Please complete the strategy setup in Step 3 before compiling your Authority Pack."}
          </p>
          <ModuleButton variant="primary" onClick={() => jumpToStep('profile_portfolio')}>
            Go to Step 3
          </ModuleButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto text-left pb-24">
      
      {/* Visual Roadmap Progress flow */}
      <div className="flex items-center justify-between bg-white border border-neutral-200/80 rounded-2xl p-4 text-xs font-bold text-neutral-400 shadow-sm max-w-3xl mx-auto">
        <div className="flex items-center gap-1.5 text-emerald-600">
          <CheckCircle2 size={14} />
          <span>1. Archetype</span>
        </div>
        <div className="w-4 sm:w-8 h-px bg-neutral-200" />
        <div className="flex items-center gap-1.5 text-emerald-600">
          <CheckCircle2 size={14} />
          <span>2. Proof assets</span>
        </div>
        <div className="w-4 sm:w-8 h-px bg-neutral-200" />
        <div className="flex items-center gap-1.5 text-emerald-600">
          <CheckCircle2 size={14} />
          <span>3. Layout Blueprint</span>
        </div>
        <div className="w-4 sm:w-8 h-px bg-neutral-200" />
        <div className="flex items-center gap-1.5 text-[#0058be] bg-blue-50/50 px-2.5 py-1.5 rounded-xl border border-blue-100/50">
          <Shield size={12} className="animate-pulse" />
          <span>4. Authority Pack</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto pt-4">
        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100/50 uppercase tracking-widest inline-block">
          Step 4 of 4: Pack Compilation Vault
        </span>
        <h2 className="text-3xl font-black text-[#0b1c30] tracking-tight">Your Compiled Authority Strategy</h2>
        <p className="text-sm text-neutral-500 font-semibold leading-relaxed">
          Access your positioning copy, proof asset specifications, and publication checklists. Export them directly to configure your public profiles.
        </p>
      </div>

      {/* Dominant Vault Card ("The Grand Compilation Vault") */}
      <section className="bg-white border border-neutral-200/80 rounded-3xl shadow-sm overflow-hidden flex flex-col">
        {/* Vault Header & Tab Selector */}
        <div className="bg-neutral-50/80 border-b border-neutral-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Landmark size={16} className="text-[#0058be]" />
            <span className="text-xs font-black text-[#0b1c30] uppercase tracking-wider">Asset Repository Vault</span>
          </div>

          <div className="flex items-center bg-neutral-200/60 p-1 rounded-2xl border border-neutral-200/40 overflow-x-auto self-start sm:self-auto max-w-full">
            {[
              { id: 'position', label: 'Archetype', icon: Award },
              { id: 'priorities', label: 'Priorities', icon: FileCheck },
              { id: 'assets', label: 'Proof Assets', icon: Layers },
              { id: 'strategy', label: 'Layout Strategy', icon: Clipboard }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5 border-none shrink-0",
                    activeTab === tab.id
                      ? "bg-white text-[#0b1c30] shadow-sm"
                      : "text-neutral-500 hover:text-neutral-700 bg-transparent"
                  )}
                >
                  <Icon size={11} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Display Area */}
        <div className="p-6 min-h-[250px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
              className="space-y-4"
            >
              {activeTab === 'position' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">Authority Archetype:</span>
                    <p className="text-sm font-bold text-[#0b1c30]">{pack.authorityPosition}</p>
                  </div>
                  <div className="space-y-1 pt-3 border-t border-neutral-100">
                    <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">Core Trust Promise:</span>
                    <p className="text-xs font-bold text-neutral-600 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                      "{pack.coreTrustPromise}"
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'priorities' && (
                <div className="space-y-3">
                  <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">Proof Requirements Mapped:</span>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {pack.proofPriorities.map((p, i) => (
                      <div key={i} className="flex items-center gap-3 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                        <span className="w-6 h-6 rounded-full bg-[#0058be]/10 flex items-center justify-center text-[10px] font-black text-[#0058be] shrink-0">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#0b1c30] truncate">{p.gapTitle}</p>
                          <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
                            {p.recommendedFormat.replace(/_/g, ' ')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'assets' && (
                <div className="space-y-3">
                  <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">Evidence Specs:</span>
                  <div className="space-y-3">
                    {pack.proofAssets.map((a) => (
                      <details key={a.id} className="rounded-xl border border-neutral-200 bg-white overflow-hidden group">
                        <summary className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-neutral-50 transition-colors list-none">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              'w-2 h-2 rounded-full', 
                              a.isAccepted ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-neutral-300 ring-4 ring-neutral-100'
                            )} />
                            <span className="text-xs font-bold text-[#0b1c30]">{a.title}</span>
                          </div>
                          <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest bg-neutral-50 px-2 py-0.5 rounded border border-neutral-100">
                            {a.assetType.replace(/_/g, ' ')}
                          </span>
                        </summary>
                        <div className="px-4 pb-4 space-y-2.5 border-t border-neutral-100 pt-3 bg-neutral-50/40 text-xs">
                          <p className="text-neutral-600 font-medium"><span className="text-neutral-400 font-black uppercase tracking-wider text-[8px] mr-1.5">Headline:</span> {a.headline}</p>
                          <p className="text-neutral-600 font-medium"><span className="text-neutral-400 font-black uppercase tracking-wider text-[8px] mr-1.5">Description:</span> {a.description}</p>
                          <p className="text-neutral-600 font-medium"><span className="text-neutral-400 font-black uppercase tracking-wider text-[8px] mr-1.5">Proof Hook:</span> {a.proofStatement}</p>
                          <p className="text-neutral-600 font-medium"><span className="text-neutral-400 font-black uppercase tracking-wider text-[8px] mr-1.5">CTA:</span> {a.cta}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'strategy' && (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                      <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">Primary Goal:</span>
                      <p className="text-xs font-bold text-[#0b1c30] mt-1">{pack.profilePortfolioStrategy?.presentationStrategy.primaryGoal}</p>
                    </div>
                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                      <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">Communication Approach:</span>
                      <p className="text-xs font-bold text-[#0b1c30] mt-1">{pack.profilePortfolioStrategy?.presentationStrategy.communicationApproach}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-neutral-100">
                    <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">Client Reading Sequence:</span>
                    <div className="space-y-2">
                      {pack.profilePortfolioStrategy?.readingJourney.map((s, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-xs bg-neutral-50/50 p-2.5 rounded-xl border border-neutral-100">
                          <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-200/80 text-neutral-600 shrink-0">
                            {s.phase}
                          </span>
                          <span className="text-neutral-500 font-medium">Observe:</span>
                          <span className="text-[#0b1c30] font-bold truncate">{s.whatClientSees}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Copy & Export Actions Bar */}
        <div className="bg-neutral-50 border-t border-neutral-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            onClick={() => handleCopy(sectionCopy(activeTab), activeTab)}
            className="px-4 py-2 border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 self-start w-full sm:w-auto"
          >
            {copiedId === activeTab ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
            {copiedId === activeTab ? 'Copied tab content!' : 'Copy current tab'}
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <button
              onClick={copyFullPack}
              className="w-full sm:w-auto px-4 py-2 border border-neutral-200 bg-white hover:bg-neutral-50 text-[#0058be] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              {copiedId === 'full' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
              {copiedId === 'full' ? 'Copied Full Markdown!' : 'Copy Full Strategy Pack'}
            </button>

            <button
              onClick={handleExport}
              className="w-full sm:w-auto px-4 py-2 bg-[#0058be] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Download size={12} />
              Export Markdown File
            </button>
          </div>
        </div>
      </section>

      {/* 2. Interactive Publish Checklist Section */}
      <section className="bg-white border border-neutral-200/80 p-6 rounded-3xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <h3 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider">
                Publication Progress Checklist
              </h3>
            </div>
            <p className="text-xs text-neutral-400 font-semibold leading-relaxed">
              Complete these tasks as you build and upload proof to your profiles.
            </p>
          </div>

          {/* Progress Circular Meter */}
          <div className="flex items-center gap-3 bg-neutral-50 px-4 py-2 rounded-2xl border border-neutral-200/60 shadow-inner">
            <div className="w-8 h-8 rounded-full border-4 border-neutral-200 relative flex items-center justify-center font-black text-[10px] text-[#0b1c30]">
              <div 
                className="absolute inset-0 rounded-full border-4 border-emerald-500 transition-all duration-300"
                style={{ 
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                  transform: `rotate(${progressPercent * 3.6}deg)`
                }} 
              />
              <span className="relative z-10">{progressPercent}%</span>
            </div>
            <div className="text-left">
              <span className="text-[10px] font-black text-neutral-400 block uppercase tracking-wider">Tasks Done</span>
              <span className="text-xs font-bold text-[#0b1c30] tabular-nums">
                {completedChecklistCount} of {totalChecklistCount} completed
              </span>
            </div>
          </div>
        </div>

        {/* Checklist Groups */}
        <div className="grid gap-6 md:grid-cols-3">
          {(['build', 'assemble', 'publish'] as const).map((category) => {
            const items = initialized.filter((c) => c.category === category);
            if (items.length === 0) return null;

            return (
              <div key={category} className="space-y-3 flex flex-col">
                <div className="pb-1">
                  <CategoryBadge category={category} />
                </div>

                <div className="bg-neutral-50/50 rounded-2xl border border-neutral-200/60 overflow-hidden divide-y divide-neutral-200/50 flex-1 flex flex-col">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleToggleChecklist(item.id)}
                      className="flex items-start gap-3 w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors cursor-pointer group bg-white"
                      role="checkbox"
                      aria-checked={item.isCompleted}
                    >
                      <div className={cn(
                        'flex items-center justify-center w-4 h-4 rounded border transition-all shrink-0 mt-0.5',
                        item.isCompleted
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-neutral-300 group-hover:border-neutral-400 bg-white',
                      )}>
                        {item.isCompleted && <Check size={9} className="text-white stroke-[3]" />}
                      </div>
                      <span className={cn(
                        'text-xs font-semibold leading-relaxed transition-all',
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
      </section>

      {/* Action Navigation Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-neutral-200">
        <ModuleButton variant="secondary" onClick={() => jumpToStep('profile_portfolio')}>
          <ArrowLeft size={14} />
          Back to Layout Strategy
        </ModuleButton>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {!isCompleted && (
            <button
              onClick={handleComplete}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check size={14} />
              Lock Authority System
            </button>
          )}

          <a
            href="/workspace/portfolio-system"
            className={cn(
              'inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl border text-xs font-black transition-all cursor-pointer no-underline w-full sm:w-auto',
              'border-[#0058be] bg-[#0058be] text-white hover:bg-blue-700 shadow-sm',
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
