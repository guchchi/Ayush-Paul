/**
 * LayoutBuilderSection.tsx — Level 2 (Step 3): Studio Workspace Canvas & Inspector
 * 
 * Interactive 3-column builder:
 * 1. Left Sidebar: Sitemap Layers with Funnel Phase badges & reordering controls
 * 2. Center Canvas: Live responsive wireframe viewer (Desktop/Mobile/Preview, true container adaptation)
 * 3. Right Sidebar: Inspector with Strategic Guidance, Validation Warnings & Copy Editor
 * 4. Header: Live Telemetry bar (sections, words, read time, proof ratio, CTAs) + Fullscreen Studio Toggle
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layout,
  Monitor,
  Smartphone,
  Play,
  MoveUp,
  MoveDown,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Settings,
  Lock,
  Unlock,
  X,
  AlertTriangle,
  FileText,
  Clock,
  Shield,
  Layers,
  EyeOff,
  Flame,
  CheckCircle2,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import { EASING, DURATION } from '../../../../../lib/motion-presets';
import { useModule3Store } from '../../../../../lib/module3/store';
import {
  calculatePortfolioTelemetry,
  getSectionPlacementMetadata,
  getSectionStrategicGuidance,
  validateArchitecture,
} from '../../../../../lib/module3/portfolio-architecture-engine';

interface Props {
  onBack: () => void;
  onContinue: () => void;
}

const sectionFade = {
  initial: { opacity: 0, y: 16, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -12, filter: 'blur(4px)' },
  transition: { duration: DURATION.NORMAL, ease: EASING.PREMIUM },
};

export const LayoutBuilderSection: React.FC<Props> = React.memo(({ onBack, onContinue }) => {
  const {
    authoritySuite,
    stage2Archetype,
    setStage2Archetype,
    reorderPortfolioSections,
    updatePortfolioSection,
  } = useModule3Store();

  const sections = authoritySuite?.portfolioBlueprint ?? [];
  const selectedArchetypeId = stage2Archetype?.selectedArchetypeId || 'proof_first';
  const selectedGoal = stage2Archetype?.portfolioGoal || 'retainer';
  const isLocked = !!stage2Archetype?.isLocked;

  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'preview'>('desktop');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(sections[0]?.id || 'section_hero');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Live telemetry calculation
  const telemetry = useMemo(() => {
    return calculatePortfolioTelemetry(sections);
  }, [sections]);

  // Live structural warnings
  const warnings = useMemo(() => {
    return validateArchitecture(sections, selectedArchetypeId, selectedGoal);
  }, [sections, selectedArchetypeId, selectedGoal]);

  const activeSection = useMemo(() => {
    return sections.find((s) => s.id === selectedSectionId) || sections[0];
  }, [sections, selectedSectionId]);

  // Guidance for the currently active section
  const strategicGuidance = useMemo(() => {
    if (!activeSection) return null;
    return getSectionStrategicGuidance(activeSection.id);
  }, [activeSection]);

  // Warnings for the currently active section
  const sectionWarnings = useMemo(() => {
    if (!activeSection) return [];
    return warnings.filter((w) => w.sectionId === activeSection.id);
  }, [warnings, activeSection]);

  const isMobileCanvas = viewMode === 'mobile';

  return (
    <motion.div {...sectionFade} className="w-full space-y-4 text-left font-sans">
      
      {/* ── TOP CONTROLS & NAVIGATIONAL ACTIONS ────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to Architecture Rationale
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-500 font-medium hidden md:inline">
            Use the arrow controls to reorder sections. Click any section to configure copy & directives in the Inspector.
          </span>
          <button
            type="button"
            onClick={onContinue}
            className="bg-[#0058be] text-white hover:bg-blue-700 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
          >
            Review Conversion Audit <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ── MAIN STUDIO WORKSPACE CONTAINER ────────────────────────────── */}
      <div 
        className={cn(
          "w-full bg-[#0b1c30] flex flex-col font-sans transition-all duration-300",
          isFullscreen
            ? "fixed inset-0 z-50 h-screen w-screen rounded-none p-0 overflow-hidden shadow-2xl"
            : "h-[800px] max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl border border-neutral-800"
        )}
      >
        
        {/* 1. STUDIO TOP NAVBAR & LIVE TELEMETRY */}
        <header className="h-16 border-b border-white/10 bg-[#0b1c30] flex items-center justify-between px-4 sm:px-6 shrink-0 gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Layers size={16} className="text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-sm tracking-wide block">
                Portfolio Studio Canvas
              </span>
              <span className="text-[10px] text-neutral-400 font-semibold hidden sm:block">
                Level 2 · Visual Funnel Engineering
              </span>
            </div>
          </div>

          {/* Center: Live Telemetry Bar */}
          <div className="hidden lg:flex items-center gap-4 bg-white/5 px-4 py-1.5 rounded-xl border border-white/10 text-xs">
            <div className="flex items-center gap-1.5 text-neutral-300">
              <FileText size={13} className="text-blue-400" />
              <span className="font-bold text-white">{telemetry.activeSectionCount}</span>
              <span className="text-neutral-400 text-[11px]">Sections</span>
            </div>

            <div className="w-px h-3.5 bg-white/10" />

            <div className="flex items-center gap-1.5 text-neutral-300">
              <span className="font-bold text-white">~{telemetry.totalWordCount}</span>
              <span className="text-neutral-400 text-[11px]">Words</span>
            </div>

            <div className="w-px h-3.5 bg-white/10" />

            <div className="flex items-center gap-1.5 text-neutral-300">
              <Clock size={13} className="text-emerald-400" />
              <span className="font-bold text-white">~{telemetry.estimatedReadTimeMinutes}m</span>
              <span className="text-neutral-400 text-[11px]">Read</span>
            </div>

            <div className="w-px h-3.5 bg-white/10" />

            <div className="flex items-center gap-1.5 text-neutral-300">
              <Shield size={13} className="text-purple-400" />
              <span className="font-bold text-white">{telemetry.proofRatioPct}%</span>
              <span className="text-neutral-400 text-[11px]">Proof</span>
            </div>

            <div className="w-px h-3.5 bg-white/10" />

            <div className="flex items-center gap-1.5 text-neutral-300">
              <Flame size={13} className="text-amber-400" />
              <span className="font-bold text-white">{telemetry.ctaTouchpoints}</span>
              <span className="text-neutral-400 text-[11px]">CTAs</span>
            </div>
          </div>

          {/* View Mode Controls & Fullscreen Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setViewMode('desktop')}
                title="Desktop View"
                className={cn(
                  'p-1.5 rounded-lg transition-colors cursor-pointer',
                  viewMode === 'desktop' ? 'bg-white/20 text-white' : 'text-neutral-400 hover:text-neutral-200'
                )}
              >
                <Monitor size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('mobile')}
                title="Mobile View (375px)"
                className={cn(
                  'p-1.5 rounded-lg transition-colors cursor-pointer',
                  viewMode === 'mobile' ? 'bg-white/20 text-white' : 'text-neutral-400 hover:text-neutral-200'
                )}
              >
                <Smartphone size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                title="Full Preview Mode"
                className={cn(
                  'p-1.5 rounded-lg transition-colors cursor-pointer ml-1',
                  viewMode === 'preview' ? 'bg-[#0058be] text-white' : 'text-neutral-400 hover:text-neutral-200'
                )}
              >
                <Play size={15} />
              </button>
            </div>

            {/* Maximize / Minimize Studio Button */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit Fullscreen' : 'Maximize Studio'}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </header>

        {/* 2. THREE-PANE STUDIO WORKSPACE */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* ── LEFT PANE: SITEMAP LAYERS ───────────────────────────────── */}
          <aside className="w-64 sm:w-72 border-r border-white/10 bg-[#0f243b] flex flex-col shrink-0">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Layout size={14} className="text-blue-400" /> Sitemap Layers
              </h3>
              <span className="text-[10px] text-neutral-400 font-mono">
                {sections.length} layers
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
              {sections.map((sec, index) => {
                const isSelected = selectedSectionId === sec.id;
                const isHero = sec.id === 'section_hero';
                const meta = getSectionPlacementMetadata(sec.id, selectedArchetypeId, selectedGoal);
                
                return (
                  <div
                    key={sec.id}
                    onClick={() => setSelectedSectionId(sec.id)}
                    className={cn(
                      'group flex flex-col p-2.5 rounded-xl cursor-pointer transition-all border text-xs gap-1.5',
                      isSelected 
                        ? 'bg-[#0058be]/25 border-[#0058be]/70 text-white shadow-xs' 
                        : 'bg-transparent border-transparent text-neutral-300 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        {isHero ? (
                          <Lock size={12} className="text-blue-400 shrink-0" />
                        ) : (
                          <span className="text-[10px] font-mono text-neutral-400 w-4">
                            0{index + 1}
                          </span>
                        )}
                        <span className="font-semibold truncate">{sec.title}</span>
                      </div>

                      {/* Move Up/Down Controls */}
                      {!isHero && (
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            type="button"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              if (index > 1) {
                                const newArr = [...sections];
                                const temp = newArr[index - 1];
                                newArr[index - 1] = newArr[index];
                                newArr[index] = temp;
                                reorderPortfolioSections(newArr);
                              }
                            }}
                            className="p-1 hover:bg-white/10 rounded cursor-pointer text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={index === 1}
                            title="Move section up"
                          >
                            <MoveUp size={12} />
                          </button>
                          <button 
                            type="button"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              if (index < sections.length - 1) {
                                const newArr = [...sections];
                                const temp = newArr[index + 1];
                                newArr[index + 1] = newArr[index];
                                newArr[index] = temp;
                                reorderPortfolioSections(newArr);
                              }
                            }}
                            className="p-1 hover:bg-white/10 rounded cursor-pointer text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={index === sections.length - 1}
                            title="Move section down"
                          >
                            <MoveDown size={12} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Funnel Stage Sub-tag */}
                    <div className="flex items-center justify-between text-[10px] pl-6">
                      <span className="text-neutral-400 truncate text-[10px]">
                        {meta.funnelRole.phase}
                      </span>
                      <span className={cn(
                        "text-[9px] px-1.5 py-0.2 rounded font-black",
                        meta.priority.level === 'CRITICAL' ? 'text-rose-400' : 'text-neutral-400'
                      )}>
                        {meta.priority.level}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* ── CENTER PANE: WIREFRAME SIMULATOR CANVAS ─────────────────── */}
          <main className="flex-1 bg-neutral-950 overflow-y-auto p-4 sm:p-8 relative flex justify-center custom-scrollbar">
            <div 
              className={cn(
                "transition-all duration-300 ease-in-out bg-white rounded-t-2xl shadow-2xl flex flex-col min-h-full",
                isMobileCanvas ? 'w-[375px]' : 'w-full max-w-4xl'
              )}
            >
              {/* Browser chrome simulation */}
              <div className="h-9 bg-neutral-100 rounded-t-2xl border-b border-neutral-200 flex items-center px-4 gap-2 sticky top-0 z-20">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <div className="mx-auto bg-white px-8 sm:px-12 py-0.5 rounded-md text-[10px] text-neutral-400 font-mono shadow-2xs border border-neutral-200 truncate">
                  {isMobileCanvas ? 'm.your-domain.com' : 'https://your-domain.com'}
                </div>
              </div>

              {/* Wireframe Blocks Scroll List */}
              <div className="flex-1 p-6 space-y-6 bg-neutral-50 pb-28">
                <AnimatePresence>
                  {sections.map((sec, idx) => {
                    const isSelected = selectedSectionId === sec.id;
                    const meta = getSectionPlacementMetadata(sec.id, selectedArchetypeId, selectedGoal);
                    // In mobile preview, force stacked single-column layout so it never wraps awkwardly on 375px
                    const renderSplit = !isMobileCanvas && sec.layoutVariant === 'split';

                    return (
                      <motion.div
                        key={sec.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => setSelectedSectionId(sec.id)}
                        className={cn(
                          'p-6 sm:p-8 rounded-2xl border-2 transition-all cursor-pointer relative group bg-white text-left',
                          isSelected 
                            ? 'border-[#0058be] shadow-xl ring-2 ring-[#0058be]/20' 
                            : 'border-dashed border-neutral-200 hover:border-neutral-300 hover:shadow-md'
                        )}
                      >
                        {/* Section Header Badges */}
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                              {sec.title}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-semibold">
                              #{idx + 1}
                            </span>
                          </div>

                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold border",
                            meta.funnelRole.color
                          )}>
                            {meta.funnelRole.phase}
                          </span>
                        </div>

                        {/* Wireframe Block Content */}
                        <div className="space-y-4">
                          <h4 className={cn(
                            "font-extrabold text-[#0b1c30] tracking-tight leading-snug",
                            isMobileCanvas
                              ? "text-xl text-center"
                              : renderSplit
                              ? "text-xl sm:text-2xl"
                              : "text-2xl sm:text-3xl text-center"
                          )}>
                            {sec.headline || 'Add a compelling value-led headline'}
                          </h4>

                          <p className={cn(
                            "text-neutral-500 font-medium text-xs sm:text-sm leading-relaxed",
                            renderSplit ? "max-w-xl" : "text-center max-w-lg mx-auto"
                          )}>
                            {sec.subheadline}
                          </p>
                          
                          {renderSplit ? (
                            <div className="flex flex-col sm:flex-row gap-6 mt-6 pt-4 border-t border-neutral-100">
                              <div className="flex-1 space-y-4">
                                <p className="text-xs text-neutral-600 whitespace-pre-wrap leading-relaxed">
                                  {sec.bodyCopy}
                                </p>
                                {sec.ctaText && (
                                  <div className="pt-2">
                                    <button className="px-5 py-2.5 bg-[#0b1c30] text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-900 transition-colors">
                                      {sec.ctaText}
                                    </button>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 h-36 bg-neutral-100 rounded-xl border border-dashed border-neutral-300 flex items-center justify-center text-neutral-500 text-xs font-mono p-4 text-center">
                                🖼️ [ {sec.recommendedVisuals || 'Interactive Visual Component'} ]
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-5 mt-6 pt-4 border-t border-neutral-100">
                              <p className="text-xs text-neutral-600 text-center max-w-2xl whitespace-pre-wrap leading-relaxed">
                                {sec.bodyCopy}
                              </p>
                              {sec.recommendedVisuals && (
                                <div className="w-full max-w-md h-28 bg-neutral-100 rounded-xl border border-dashed border-neutral-300 flex items-center justify-center text-neutral-500 text-xs font-mono p-4 text-center">
                                  🖼️ [ {sec.recommendedVisuals} ]
                                </div>
                              )}
                              {sec.ctaText && (
                                <button className="px-6 py-2.5 bg-[#0b1c30] text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-900 transition-colors">
                                  {sec.ctaText}
                                </button>
                              )}
                            </div>
                          )}

                          {/* Trust Statement Bar if present */}
                          {sec.trustStatement && (
                            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                              <Shield size={12} className="text-emerald-600" />
                              <span>{sec.trustStatement}</span>
                            </div>
                          )}
                        </div>

                        {/* Edit Overlay on Hover */}
                        <div className="absolute inset-0 bg-[#0058be]/0 group-hover:bg-[#0058be]/5 rounded-2xl transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="bg-white text-[#0b1c30] px-4 py-2 rounded-xl text-xs font-bold shadow-xl border border-neutral-100">
                            Click to Configure in Inspector
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </main>

          {/* ── RIGHT PANE: SECTION INSPECTOR & STRATEGIC GUIDANCE ───────── */}
          {selectedSectionId && activeSection && (
            <aside className="w-80 sm:w-96 border-l border-white/10 bg-[#0f243b] flex flex-col shadow-2xl shrink-0">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <Settings size={14} className="text-blue-400" /> Section Inspector
                </h3>
                <button 
                  onClick={() => setSelectedSectionId(null)}
                  className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar text-left">
                {/* Lock Status Warning inside Inspector */}
                {isLocked && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Lock size={12} className="text-amber-400" />
                      <span>Architecture is locked.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStage2Archetype({ isLocked: false, revisionStatus: 'draft' })}
                      className="text-amber-300 hover:text-white font-bold underline text-[11px] cursor-pointer"
                    >
                      Unlock to Edit
                    </button>
                  </div>
                )}

                {/* Title & Role Info */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                    Configuring Section
                  </span>
                  <h4 className="text-lg font-bold text-white">{activeSection.title}</h4>
                  <p className="text-xs text-neutral-400">{activeSection.structuralRole}</p>
                </div>

                {/* Section-Specific Validation Warnings */}
                {sectionWarnings.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                      <AlertTriangle size={14} />
                      Architecture Warning
                    </div>
                    {sectionWarnings.map((w) => (
                      <div key={w.id} className="space-y-1 text-xs text-amber-200">
                        <p className="font-semibold">{w.title}</p>
                        <p className="text-neutral-300 text-[11px] leading-relaxed">{w.message}</p>
                        {w.actionHint && (
                          <p className="text-amber-400 text-[10px] font-mono">💡 {w.actionHint}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Conversion Logic Box */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 size={12} /> Conversion Logic
                  </span>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {activeSection.conversionReasoning}
                  </p>
                </div>

                {/* ── STRATEGIC GUIDANCE CARD ───────────────────────── */}
                {strategicGuidance && (
                  <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 space-y-3">
                    <div className="flex items-center gap-1.5 text-blue-300 text-[10px] font-black uppercase tracking-wider">
                      <Sparkles size={12} className="text-blue-400" />
                      Strategic Guidance
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                        Content Direction
                      </span>
                      <p className="text-xs text-neutral-200 leading-relaxed">
                        {strategicGuidance.contentDirection}
                      </p>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-white/5">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                        Visual Directive
                      </span>
                      <p className="text-xs text-neutral-300 leading-relaxed font-mono">
                        {strategicGuidance.visualRecommendation}
                      </p>
                    </div>

                    {strategicGuidance.whatToAvoid.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-white/5">
                        <span className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1">
                          <EyeOff size={11} /> What to Avoid
                        </span>
                        <ul className="space-y-1 text-[11px] text-neutral-300">
                          {strategicGuidance.whatToAvoid.map((item, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-rose-400 font-bold shrink-0">✕</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Component Layout Selector */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Component Layout
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      type="button"
                      disabled={isLocked}
                      onClick={() => updatePortfolioSection(activeSection.id, { layoutVariant: 'center' })}
                      className={cn(
                        "p-2.5 rounded-xl border text-xs text-left transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                        (!activeSection.layoutVariant || activeSection.layoutVariant === 'center') 
                          ? 'bg-[#0058be]/25 border-[#0058be] text-white shadow-xs' 
                          : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white'
                      )}
                    >
                      <div className="w-full h-7 bg-white/10 rounded mb-2 flex flex-col items-center justify-center space-y-1">
                        <div className="w-3/4 h-1 bg-white/30 rounded" />
                        <div className="w-1/2 h-1 bg-white/30 rounded" />
                      </div>
                      Center Stack
                    </button>
                    <button 
                      type="button"
                      disabled={isLocked}
                      onClick={() => updatePortfolioSection(activeSection.id, { layoutVariant: 'split' })}
                      className={cn(
                        "p-2.5 rounded-xl border text-xs text-left transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                        activeSection.layoutVariant === 'split' 
                          ? 'bg-[#0058be]/25 border-[#0058be] text-white shadow-xs' 
                          : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white'
                      )}
                    >
                      <div className="flex gap-1.5 mb-2 h-7">
                        <div className="w-1/2 bg-white/10 rounded flex flex-col justify-center space-y-1 p-1">
                          <div className="w-full h-1 bg-white/30 rounded" />
                          <div className="w-3/4 h-1 bg-white/30 rounded" />
                        </div>
                        <div className="w-1/2 bg-white/20 rounded" />
                      </div>
                      Split Content
                    </button>
                  </div>
                </div>

                {/* Copy Editor Inputs */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Copy Editor
                  </span>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-neutral-400">Headline</label>
                    <input 
                      type="text" 
                      disabled={isLocked}
                      value={activeSection.headline || ''}
                      onChange={(e) => updatePortfolioSection(activeSection.id, { headline: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#0058be] outline-none transition-colors disabled:opacity-50" 
                      placeholder="Enter headline..."
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-neutral-400">Subheadline</label>
                    <textarea 
                      disabled={isLocked}
                      value={activeSection.subheadline || ''}
                      onChange={(e) => updatePortfolioSection(activeSection.id, { subheadline: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#0058be] outline-none h-16 resize-none transition-colors custom-scrollbar disabled:opacity-50" 
                      placeholder="Enter subheadline..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-neutral-400">Body Narrative</label>
                    <textarea 
                      disabled={isLocked}
                      value={activeSection.bodyCopy || ''}
                      onChange={(e) => updatePortfolioSection(activeSection.id, { bodyCopy: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#0058be] outline-none h-24 resize-none transition-colors custom-scrollbar disabled:opacity-50" 
                      placeholder="Enter body narrative..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-neutral-400">Call to Action Button</label>
                    <input 
                      type="text" 
                      disabled={isLocked}
                      value={activeSection.ctaText || ''}
                      onChange={(e) => updatePortfolioSection(activeSection.id, { ctaText: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#0058be] outline-none transition-colors disabled:opacity-50" 
                      placeholder="e.g. Schedule Discovery Call"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-neutral-400 flex items-center justify-between">
                      <span>Trust Statement / Risk Reversal</span>
                      <span className="text-[9px] text-emerald-400">Conversion Booster</span>
                    </label>
                    <input 
                      type="text" 
                      disabled={isLocked}
                      value={activeSection.trustStatement || ''}
                      onChange={(e) => updatePortfolioSection(activeSection.id, { trustStatement: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#0058be] outline-none transition-colors disabled:opacity-50" 
                      placeholder="e.g. 100% Confidential · No commitment required"
                    />
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </motion.div>
  );
});

LayoutBuilderSection.displayName = 'LayoutBuilderSection';
export default LayoutBuilderSection;
