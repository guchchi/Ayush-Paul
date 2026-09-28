/**
 * PortfolioArchitectureSection.tsx — Level 2 (Stage 2) AI Workspace Builder
 * 
 * Completely recreated to mimic modern AI site builders (Relume/Webflow).
 * Replaces the old 5-step wizard with a professional 2-state flow:
 * 1. AI Prompt/Onboarding Modal (Goal Setting)
 * 2. The Studio Workspace (Split-screen Layers + Canvas + Inspector)
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layout, Monitor, Smartphone, Play, MoveUp, MoveDown, ArrowRight,
  Sparkles, Check, Zap, Layers, Settings, Compass, Repeat, Lock, X
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

export const PortfolioArchitectureSection: React.FC<Props> = React.memo(({ onContinue }) => {
  const {
    authoritySuite,
    setStage2Archetype,
    applyArchetypePreset,
    reorderPortfolioSections,
    mod1ServiceId,
    mod1CareerTrackId
  } = useModule3Store();

  // Local State
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'preview'>('desktop');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const sections = authoritySuite?.portfolioBlueprint ?? [];

  // Onboarding Logic
  const handleGoalSelect = (goal: PortfolioGoal) => {
    setIsGenerating(true);
    setTimeout(() => {
      // Simulate AI generation time for premium feel
      const rec = recommendArchetype(mod1ServiceId, mod1CareerTrackId, goal);
      setStage2Archetype({ portfolioGoal: goal, selectedArchetypeId: rec.archetypeId });
      applyArchetypePreset(rec.archetypeId);
      setIsGenerating(false);
      setIsOnboarding(false);
    }, 1500);
  };

  // ── ONBOARDING OVERLAY ────────────────────────────────────────────────────────
  if (isOnboarding) {
    return (
      <div className="min-h-[600px] w-full flex items-center justify-center p-6 font-sans relative overflow-hidden bg-neutral-900 rounded-3xl">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0058be]/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-2xl w-full z-10 space-y-8 text-center">
          <AnimatePresence mode="wait">
            {!isGenerating ? (
              <motion.div
                key="prompt"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                    <Sparkles size={14} className="text-[#0058be]" />
                    AI Blueprint Generator
                  </div>
                  <h2 className="text-4xl font-bold text-white tracking-tight">
                    What is the primary goal of your portfolio?
                  </h2>
                  <p className="text-neutral-400 text-lg">
                    Select a goal below. Our engine will instantly generate a mathematically proven layout structure tailored for you.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                  {[
                    { id: 'retainer', label: 'Win High-Value Retainers', icon: Repeat },
                    { id: 'sprint', label: 'Win Fast Sprint Projects', icon: Zap },
                    { id: 'consulting', label: 'Build Advisory Authority', icon: Compass }
                  ].map((goal) => {
                    const Icon = goal.icon;
                    return (
                      <button
                        key={goal.id}
                        onClick={() => handleGoalSelect(goal.id as PortfolioGoal)}
                        className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#0058be]/50 transition-all cursor-pointer backdrop-blur-sm flex flex-col items-center text-center gap-4"
                      >
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon size={24} className="text-white group-hover:text-[#0058be] transition-colors" />
                        </div>
                        <h3 className="text-white font-bold text-sm">{goal.label}</h3>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="generating"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center space-y-6 py-12"
              >
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-4 border-[#0058be]/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-[#0058be] rounded-full border-t-transparent animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto text-[#0058be] animate-pulse" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white">Engineering Architecture...</h3>
                <p className="text-neutral-400">Applying conversion guardrails & optimal section flow.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // ── STUDIO WORKSPACE ──────────────────────────────────────────────────────────
  return (
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
                      <div className="w-3/4 h-8 bg-neutral-200 rounded-lg animate-pulse" />
                      <div className="w-full h-4 bg-neutral-100 rounded-md" />
                      <div className="w-5/6 h-4 bg-neutral-100 rounded-md" />
                      
                      {/* Fake Content based on role */}
                      {sec.id.includes('proof') && (
                        <div className="flex gap-4 mt-6">
                          <div className="w-1/3 h-24 bg-blue-50 border border-blue-100 rounded-xl" />
                          <div className="w-1/3 h-24 bg-blue-50 border border-blue-100 rounded-xl" />
                          <div className="w-1/3 h-24 bg-blue-50 border border-blue-100 rounded-xl" />
                        </div>
                      )}
                      {sec.id.includes('services') && (
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <div className="h-32 border border-neutral-200 rounded-xl bg-neutral-50" />
                          <div className="h-32 border border-neutral-200 rounded-xl bg-neutral-50" />
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
                      Component Library (Coming Soon)
                    </span>
                    <div className="h-24 border border-dashed border-white/20 rounded-xl flex items-center justify-center text-neutral-500 text-xs hover:bg-white/5 transition-colors cursor-pointer">
                      + Swap Component Layout
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
});

export default PortfolioArchitectureSection;
