/**
 * PortfolioArchitectureSection.tsx — Level 2 (Stage 2) AI Workspace Builder
 * 
 * Inline stepper flow matching Level 1's professional pattern:
 * Step 1: Goal Selection (inline, no floating card)
 * Step 2: Studio Workspace (Split-screen Layers + Canvas + Inspector)
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layout, Monitor, Smartphone, Play, MoveUp, MoveDown, ArrowRight,
  Sparkles, Check, Zap, Layers, Settings, Compass, Repeat, Lock, X,
  Target
} from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { EASING, DURATION } from '../../../../lib/motion-presets';
import { useModule3Store } from '../../../../lib/module3/store';
import {
  PORTFOLIO_ARCHETYPES,
  PortfolioGoal,
  getRecommendedGoal,
  recommendArchetype
} from '../../../../lib/module3/portfolio-architecture-engine';

interface Props {
  onContinue: () => void;
}

// ── Step metadata (matching Level 1's stepper pattern) ────────────────────────
const STEPS = [
  { id: 1, label: 'Conversion Goal', shortLabel: 'Goal', icon: Target, desc: 'Select your portfolio\'s primary conversion objective' },
  { id: 2, label: 'Layout Builder', shortLabel: 'Builder', icon: Layout, desc: 'Arrange, reorder, and configure your portfolio sections' },
] as const;

const GOALS = [
  { id: 'retainer' as const, label: 'Win High-Value Retainers', icon: Repeat, desc: 'Focus on long-term value, stability, and deep partnerships.', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-100' },
  { id: 'sprint' as const, label: 'Win Fast Sprint Projects', icon: Zap, desc: 'Highlight speed, specific deliverables, and quick ROI.', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-100' },
  { id: 'consulting' as const, label: 'Build Advisory Authority', icon: Compass, desc: 'Position as a strategic advisor, focusing on insights and guidance.', color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-100' },
];

// ── Motion tokens ─────────────────────────────────────────────────────────────
const sectionFade = {
  initial: { opacity: 0, y: 16, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -12, filter: 'blur(4px)' },
  transition: { duration: DURATION.NORMAL, ease: EASING.PREMIUM },
};

export const PortfolioArchitectureSection: React.FC<Props> = React.memo(({ onContinue }) => {
  const {
    authoritySuite,
    setStage2Archetype,
    applyArchetypePreset,
    reorderPortfolioSections,
    updatePortfolioSection,
    mod1ServiceId,
    mod1CareerTrackId
  } = useModule3Store();

  // Local State — 2-step flow: goal → workspace
  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<PortfolioGoal | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'preview'>('desktop');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const sections = authoritySuite?.portfolioBlueprint ?? [];

  // Goal selection handler
  const handleGoalSelect = (goal: PortfolioGoal) => {
    setSelectedGoal(goal);
    setIsGenerating(true);
    setTimeout(() => {
      const rec = recommendArchetype(mod1ServiceId, mod1CareerTrackId, goal);
      setStage2Archetype({ portfolioGoal: goal, selectedArchetypeId: rec.archetypeId });
      applyArchetypePreset(rec.archetypeId);
      setIsGenerating(false);
      setCompletedSteps(prev => [...new Set([...prev, 1])]);
      setActiveStep(2);
    }, 1500);
  };

  // ── STEP BAR + CONTENT ──────────────────────────────────────────────────────
  if (activeStep === 1) {
    return (
      <div className="w-full space-y-6 text-left font-sans">
        {/* Step Progress Bar (matching Level 1's stepper) */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
          className="p-3.5 sm:p-4 rounded-3xl border border-neutral-200 bg-white shadow-xs"
        >
          <div className="flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar">
            {STEPS.map((step, idx) => {
              const isActive = activeStep === step.id;
              const isCompleted = completedSteps.includes(step.id);
              const Icon = step.icon;

              return (
                <React.Fragment key={step.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (isCompleted || step.id <= activeStep) {
                        setActiveStep(step.id as 1 | 2);
                      }
                    }}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer flex-1 min-w-[120px] sm:min-w-0',
                      isActive
                        ? 'bg-[#0058be] text-white shadow-md'
                        : isCompleted
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100/70'
                        : 'bg-neutral-50 text-neutral-400 border border-neutral-200 hover:text-neutral-600'
                    )}
                  >
                    <span className={cn(
                      'w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0',
                      isActive ? 'bg-white/20 text-white' : isCompleted ? 'bg-emerald-200 text-emerald-900' : 'bg-neutral-200 text-neutral-600'
                    )}>
                      {isCompleted ? <Check size={12} strokeWidth={3} /> : `0${step.id}`}
                    </span>
                    <span className="text-[11px] font-bold truncate">{step.shortLabel}</span>
                  </button>
                  {idx < STEPS.length - 1 && (
                    <div className={cn(
                      'w-3 sm:w-4 h-0.5 rounded-full shrink-0',
                      step.id < activeStep ? 'bg-emerald-300' : 'bg-neutral-200'
                    )} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </motion.div>

        {/* Goal Selection — Direct inline content */}
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="generating"
              {...sectionFade}
              className="w-full p-16 flex flex-col items-center justify-center border border-neutral-200 rounded-3xl bg-white shadow-xs"
            >
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-neutral-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-[#0058be] rounded-full border-t-transparent animate-spin" />
                <Sparkles className="absolute inset-0 m-auto text-[#0058be] animate-pulse" size={28} />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Engineering Architecture...</h3>
              <p className="text-neutral-500 text-sm font-medium">Applying conversion guardrails & optimal section flow.</p>
            </motion.div>
          ) : (
            <motion.div
              key="goal-selection"
              {...sectionFade}
              className="w-full p-8 sm:p-10 rounded-3xl border border-neutral-200 bg-white shadow-xs space-y-8"
            >
              {/* Section Header */}
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#0058be]/10 text-[#0058be] text-[10px] font-bold uppercase tracking-widest border border-[#0058be]/20">
                  <Sparkles size={12} />
                  AI Blueprint Generator
                </div>
                <h3 className="text-xl font-bold text-[#0b1c30]">
                  Select your primary conversion goal
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Choose the objective below that best matches your portfolio strategy. Our engine will generate a mathematically proven layout structure tailored for you.
                </p>
              </div>

              {/* Goal Cards — Horizontal Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {GOALS.map((goal) => {
                  const Icon = goal.icon;
                  const isSelected = selectedGoal === goal.id;

                  return (
                    <button
                      key={goal.id}
                      onClick={() => handleGoalSelect(goal.id)}
                      className={cn(
                        'group relative p-6 rounded-2xl border-2 transition-all cursor-pointer text-left space-y-4',
                        isSelected
                          ? 'border-[#0058be] bg-blue-50/40 shadow-lg'
                          : 'border-neutral-200 bg-white hover:border-[#0058be]/40 hover:shadow-md hover:bg-neutral-50/50'
                      )}
                    >
                      {/* Icon */}
                      <div className={cn(
                        'w-12 h-12 rounded-2xl flex items-center justify-center transition-all',
                        goal.bgColor, goal.borderColor, 'border',
                        'group-hover:scale-110'
                      )}>
                        <Icon size={22} className={goal.color} />
                      </div>

                      {/* Text */}
                      <div className="space-y-1.5">
                        <h4 className="text-sm font-bold text-[#0b1c30] group-hover:text-[#0058be] transition-colors">
                          {goal.label}
                        </h4>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                          {goal.desc}
                        </p>
                      </div>

                      {/* Arrow indicator */}
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 group-hover:text-[#0058be] transition-colors uppercase tracking-wider">
                        Generate Blueprint <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── STUDIO WORKSPACE (Step 2) ─────────────────────────────────────────────────
  return (
    <div className="w-full space-y-6 text-left font-sans">
      {/* Step Progress Bar (same as Step 1 for visual continuity) */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
        className="p-3.5 sm:p-4 rounded-3xl border border-neutral-200 bg-white shadow-xs"
      >
        <div className="flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar">
          {STEPS.map((step, idx) => {
            const isActive = activeStep === step.id;
            const isCompleted = completedSteps.includes(step.id);
            const Icon = step.icon;

            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (isCompleted || step.id <= activeStep) {
                      setActiveStep(step.id as 1 | 2);
                    }
                  }}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer flex-1 min-w-[120px] sm:min-w-0',
                    isActive
                      ? 'bg-[#0058be] text-white shadow-md'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100/70'
                      : 'bg-neutral-50 text-neutral-400 border border-neutral-200 hover:text-neutral-600'
                  )}
                >
                  <span className={cn(
                    'w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0',
                    isActive ? 'bg-white/20 text-white' : isCompleted ? 'bg-emerald-200 text-emerald-900' : 'bg-neutral-200 text-neutral-600'
                  )}>
                    {isCompleted ? <Check size={12} strokeWidth={3} /> : `0${step.id}`}
                  </span>
                  <span className="text-[11px] font-bold truncate">{step.shortLabel}</span>
                </button>
                {idx < STEPS.length - 1 && (
                  <div className={cn(
                    'w-3 sm:w-4 h-0.5 rounded-full shrink-0',
                    step.id < activeStep ? 'bg-emerald-300' : 'bg-neutral-200'
                  )} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </motion.div>

      {/* Workspace Canvas */}
    <div className="h-[800px] max-h-[85vh] w-full bg-[#0b1c30] rounded-3xl overflow-hidden flex flex-col font-sans shadow-2xl border border-neutral-800">
      
      {/* 1. TOP NAVBAR */}
      <header className="h-14 border-b border-white/10 bg-[#0b1c30] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Layers size={16} className="text-white" />
          </div>
          <span className="text-white font-bold text-sm tracking-wide">Workspace / Portfolio Canvas</span>
        </div>

        {/* View Toggles */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
          <button
            onClick={() => setViewMode('desktop')}
            className={cn('p-1.5 rounded-md transition-colors', viewMode === 'desktop' ? 'bg-white/20 text-white' : 'text-neutral-500 hover:text-neutral-300')}
          >
            <Monitor size={16} />
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={cn('p-1.5 rounded-md transition-colors', viewMode === 'mobile' ? 'bg-white/20 text-white' : 'text-neutral-500 hover:text-neutral-300')}
          >
            <Smartphone size={16} />
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={cn('p-1.5 rounded-md transition-colors ml-2', viewMode === 'preview' ? 'bg-[#0058be] text-white' : 'text-neutral-500 hover:text-neutral-300')}
          >
            <Play size={16} />
          </button>
        </div>

        <button
          onClick={onContinue}
          className="bg-white text-black hover:bg-neutral-200 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
        >
          Publish Architecture <ArrowRight size={14} />
        </button>
      </header>

      {/* 2. MAIN WORKSPACE AREA */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR (LAYERS) */}
        <aside className="w-64 border-r border-white/10 bg-[#0f243b] flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Layout size={14} /> Sitemap Layers
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-none">
            {sections.map((sec, index) => {
              const isSelected = selectedSectionId === sec.id;
              const isHero = sec.id === 'section_hero';
              
              return (
                <div
                  key={sec.id}
                  onClick={() => setSelectedSectionId(sec.id)}
                  className={cn(
                    'group flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all border text-xs',
                    isSelected 
                      ? 'bg-[#0058be]/20 border-[#0058be]/50 text-white' 
                      : 'bg-transparent border-transparent text-neutral-400 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isHero ? <Lock size={12} className="text-[#0058be]" /> : <Layout size={12} />}
                    <span className="font-medium truncate">{sec.title}</span>
                  </div>
                  {!isHero && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
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
                        className="p-1 hover:bg-white/10 rounded"
                        disabled={index === 1} // Can't move above hero
                      >
                        <MoveUp size={12} />
                      </button>
                      <button 
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
                        className="p-1 hover:bg-white/10 rounded"
                        disabled={index === sections.length - 1}
                      >
                        <MoveDown size={12} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* CENTER CANVAS (WIREFRAME VIEWER) */}
        <main className="flex-1 bg-neutral-950 overflow-y-auto p-8 relative flex justify-center custom-scrollbar">
          <div 
            className={cn(
              "transition-all duration-500 ease-in-out bg-white rounded-t-lg shadow-2xl flex flex-col min-h-full",
              viewMode === 'mobile' ? 'w-[375px]' : 'w-full max-w-4xl'
            )}
          >
            {/* Browser chrome simulation */}
            <div className="h-8 bg-neutral-100 rounded-t-lg border-b border-neutral-200 flex items-center px-4 gap-2 sticky top-0 z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <div className="mx-auto bg-white px-12 py-0.5 rounded-md text-[10px] text-neutral-400 font-mono shadow-xs border border-neutral-200">
                your-portfolio.com
              </div>
            </div>

            {/* Wireframe Blocks */}
            <div className="flex-1 p-6 space-y-6 bg-neutral-50 pb-24">
              <AnimatePresence>
                {sections.map((sec) => (
                  <motion.div
                    key={sec.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSelectedSectionId(sec.id)}
                    className={cn(
                      'p-8 rounded-2xl border-2 transition-all cursor-pointer relative group bg-white',
                      selectedSectionId === sec.id 
                        ? 'border-[#0058be] shadow-lg scale-[1.01]' 
                        : 'border-dashed border-neutral-300 hover:border-neutral-400 hover:shadow-md'
                    )}
                  >
                    {/* Badge */}
                    <div className="absolute -top-3 left-6 px-3 py-1 bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                      {sec.title}
                    </div>

                    <div className="space-y-4 pt-2">
                      <h4 className={cn("font-bold text-gray-900 leading-tight", sec.layoutVariant === 'split' ? 'text-2xl' : 'text-3xl text-center')}>
                        {sec.headline || 'Add a headline'}
                      </h4>
                      <p className={cn("text-gray-500", sec.layoutVariant === 'split' ? 'text-sm' : 'text-center text-sm max-w-lg mx-auto')}>
                        {sec.subheadline}
                      </p>
                      
                      {sec.layoutVariant === 'split' ? (
                        <div className="flex flex-col sm:flex-row gap-6 mt-6">
                           <div className="flex-1 space-y-4">
                              <p className="text-xs text-gray-400 whitespace-pre-wrap">{sec.bodyCopy}</p>
                              {sec.ctaText && <button className="px-5 py-2.5 bg-[#0b1c30] text-white rounded-lg text-xs font-bold shadow-md hover:bg-blue-900 transition-colors">{sec.ctaText}</button>}
                           </div>
                           <div className="flex-1 h-40 bg-neutral-100 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-400 text-xs shadow-inner">
                             [ {sec.recommendedVisuals || 'Visual Asset'} ]
                           </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-6 mt-6">
                           <p className="text-xs text-gray-400 text-center max-w-2xl whitespace-pre-wrap">{sec.bodyCopy}</p>
                           {sec.recommendedVisuals && (
                             <div className="w-full max-w-md h-32 bg-neutral-100 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-400 text-xs shadow-inner">
                               [ {sec.recommendedVisuals} ]
                             </div>
                           )}
                           {sec.ctaText && <button className="px-6 py-3 bg-[#0b1c30] text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-900 transition-colors mt-2">{sec.ctaText}</button>}
                        </div>
                      )}
                    </div>

                    {/* Edit Overlay on Hover */}
                    <div className="absolute inset-0 bg-[#0058be]/0 group-hover:bg-[#0058be]/5 rounded-2xl transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="bg-white text-[#0b1c30] px-4 py-2 rounded-xl text-xs font-bold shadow-xl border border-neutral-100">
                        Click to configure
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR (INSPECTOR) */}
        {selectedSectionId && (
          <aside className="w-80 border-l border-white/10 bg-[#0f243b] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Settings size={14} /> Section Inspector
              </h3>
              <button 
                onClick={() => setSelectedSectionId(null)}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {sections.map(sec => sec.id === selectedSectionId && (
                <div key={sec.id} className="space-y-6">
                  {/* Info Panel */}
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-white">{sec.title}</h4>
                    <p className="text-sm text-neutral-400">{sec.structuralRole}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                      Conversion Logic
                    </span>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {sec.conversionReasoning}
                    </p>
                  </div>

                  {/* Component Swap Simulator */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                      Component Layout
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => updatePortfolioSection(sec.id, { layoutVariant: 'center' })}
                        className={cn("p-3 rounded-xl border text-xs text-left transition-colors", (!sec.layoutVariant || sec.layoutVariant === 'center') ? 'bg-[#0058be]/20 border-[#0058be] text-white' : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10')}
                      >
                         <div className="w-full h-8 bg-white/10 rounded mb-2 flex flex-col items-center justify-center space-y-1">
                           <div className="w-3/4 h-1 bg-white/20 rounded" />
                           <div className="w-1/2 h-1 bg-white/20 rounded" />
                         </div>
                         Center Stack
                      </button>
                      <button 
                        onClick={() => updatePortfolioSection(sec.id, { layoutVariant: 'split' })}
                        className={cn("p-3 rounded-xl border text-xs text-left transition-colors", sec.layoutVariant === 'split' ? 'bg-[#0058be]/20 border-[#0058be] text-white' : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10')}
                      >
                         <div className="flex gap-2 mb-2 h-8">
                           <div className="w-1/2 bg-white/10 rounded flex flex-col justify-center space-y-1 p-1">
                             <div className="w-full h-1 bg-white/20 rounded" />
                             <div className="w-3/4 h-1 bg-white/20 rounded" />
                           </div>
                           <div className="w-1/2 bg-white/20 rounded" />
                         </div>
                         Split Content
                      </button>
                    </div>
                  </div>

                  {/* Copy Editor */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                      Copy Editor
                    </span>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase text-neutral-400">Headline</label>
                      <input 
                        type="text" 
                        value={sec.headline || ''}
                        onChange={(e) => updatePortfolioSection(sec.id, { headline: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-[#0058be] outline-none transition-colors" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase text-neutral-400">Subheadline</label>
                      <textarea 
                        value={sec.subheadline || ''}
                        onChange={(e) => updatePortfolioSection(sec.id, { subheadline: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-[#0058be] outline-none h-16 resize-none transition-colors custom-scrollbar" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase text-neutral-400">Body Copy</label>
                      <textarea 
                        value={sec.bodyCopy || ''}
                        onChange={(e) => updatePortfolioSection(sec.id, { bodyCopy: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-[#0058be] outline-none h-24 resize-none transition-colors custom-scrollbar" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase text-neutral-400">CTA Text</label>
                      <input 
                        type="text" 
                        value={sec.ctaText || ''}
                        onChange={(e) => updatePortfolioSection(sec.id, { ctaText: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-[#0058be] outline-none transition-colors" 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
    </div>
  );
});

export default PortfolioArchitectureSection;
