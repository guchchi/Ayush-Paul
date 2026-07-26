import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText, Navigation, Layout, Search, AlignLeft, ShieldCheck, PlayCircle,
  Target, MessageSquare, Award, Compass, Layers, Sparkles, ArrowLeft, ArrowRight,
  Edit2, RotateCw, RotateCcw, Check, Eye, EyeOff, ExternalLink, Shield, Info, AlertCircle,
  CheckCircle2, Circle, HelpCircle, User, Briefcase, Zap, HelpCircle as QuestionIcon,
  ChevronRight, CalendarCheck, FileSpreadsheet, Lock, Play, Star, Calendar, ArrowUpRight,
  ChevronDown, Copy, CheckIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';
import { useModule3Store } from '../../lib/module3';
import { StepHeader } from '../workspace/StepHeader';
import { StepActionArea } from '../workspace/StepActionArea';
import { ModuleButton } from '../workspace/ModuleButton';

interface FreelancerExample {
  tier: string;
  headline: string;
  assetsDescription: string;
  whyItWorks: string[];
  weakness: string[];
  lesson: string;
}

export function Step3ProfilePortfolio() {
  const pendingStrategy = useModule3Store((s) => s.pendingProfilePortfolioStrategy);
  const strategy = useModule3Store((s) => s.profilePortfolioStrategy);
  const isUpstreamStale = useModule3Store((s) => s.isUpstreamStale);
  const generateStrategy = useModule3Store((s) => s.generateProfilePortfolioStrategy);
  const approveStrategy = useModule3Store((s) => s.approveProfilePortfolioStrategy);
  const previousStep = useModule3Store((s) => s.previousStep);
  const nextStep = useModule3Store((s) => s.nextStep);
  const confirmStep = useModule3Store((s) => s.confirmStep);

  // Store data
  const availableAssets = useModule3Store((s) => s.availableAssets);
  const proofAssets = useModule3Store((s) => s.proofAssets);
  const authorityPosition = useModule3Store((s) => s.authorityPosition) || 'builder';
  const coreTrustPromise = useModule3Store((s) => s.coreTrustPromise) || 'Preventing customer checkout drops for SaaS platforms';

  // Local UX state
  const [viewMode, setViewMode] = useState<'blueprint' | 'preview' | 'examples'>('blueprint');
  const [selectedExampleTier, setSelectedExampleTier] = useState<'beginner' | 'intermediate' | 'expert'>('beginner');
  const [activeSectionId, setActiveSectionId] = useState<string | null>('hero');
  const [showAiReasoning, setShowAiReasoning] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [activeInspectorToken, setActiveInspectorToken] = useState<'outcome' | 'audience' | 'mechanism' | null>('outcome');
  const [compareMode, setCompareMode] = useState<boolean>(false);

  // Eye Tracker Animation States
  const [eyeTrackerStep, setEyeTrackerStep] = useState<number>(0);
  const [isEyeTrackerPlaying, setIsEyeTrackerPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (!pendingStrategy && !strategy && !isUpstreamStale) {
      generateStrategy();
    }
  }, [pendingStrategy, strategy, isUpstreamStale, generateStrategy]);

  const displayStrategy = pendingStrategy || strategy;

  // Auto-play eye tracker once on mount when strategy is loaded
  useEffect(() => {
    if (displayStrategy && !isEyeTrackerPlaying && eyeTrackerStep === 0) {
      startEyeTracker();
    }
  }, [displayStrategy]);

  const startEyeTracker = () => {
    setIsEyeTrackerPlaying(true);
    setEyeTrackerStep(1);
  };

  useEffect(() => {
    if (!isEyeTrackerPlaying) return;

    if (eyeTrackerStep > 0 && eyeTrackerStep <= 4) {
      const timer = setTimeout(() => {
        setEyeTrackerStep((prev) => prev + 1);
      }, 3500);
      return () => clearTimeout(timer);
    } else if (eyeTrackerStep > 4) {
      setIsEyeTrackerPlaying(false);
      setEyeTrackerStep(0);
    }
  }, [eyeTrackerStep, isEyeTrackerPlaying]);

  const handleApprove = () => {
    approveStrategy();
    confirmStep();
    nextStep();
  };

  // Freelancer portfolio examples
  const freelancerExamples: Record<'beginner' | 'intermediate' | 'expert', FreelancerExample> = {
    beginner: {
      tier: 'Beginner Freelancer (Standard Generalist)',
      headline: 'Full-Stack Developer for Hire | React & Node.js',
      assetsDescription: 'Simple project screenshot with a link to generic code repositories.',
      whyItWorks: [
        'Clear statement of service (headline matches search keywords).',
        'Has at least one working proof link so the client knows they can code.'
      ],
      weakness: [
        'Zero authority framing (looks like a commodity contractor).',
        'No objections handled (client wonders: "Will they communicate?", "Have they solved my business problem?")'
      ],
      lesson: 'Visual Focus: Concentrates only on generic technical skills. Good for low-ticket projects, but fails to build premium trust.'
    },
    intermediate: {
      tier: 'Intermediate Specialist (Niche Focus)',
      headline: 'React Specialist building SaaS Dashboards for Fintech Startups',
      assetsDescription: 'High-fidelity dashboard code walk-through video + case study document.',
      whyItWorks: [
        'Clear positioning hook targeting Fintech startups.',
        'High foundational proof (real dashboard walkthrough answers capability objections).'
      ],
      weakness: [
        'Testimonials are missing or simple quote text (lacks high authority verification).',
        'Fails to connect the code structure to client business outcomes.'
      ],
      lesson: 'Visual Focus: Targets a specific niche with proof of execution. Validates trust quickly, but struggles to command top-tier pricing.'
    },
    expert: {
      tier: 'Top 1% Strategic Partner (Diagnostic Authority)',
      headline: 'Diagnostic Developer: Securing fintech payment integrations to prevent customer checkout drops',
      assetsDescription: 'Interactive diagnostic process map + case study showing a 14% drop reduction.',
      whyItWorks: [
        'Speaks directly to business outcomes (checkout drop prevention).',
        'Integrates multi-layered proof (diagnostic map + video demo + ROI metric).',
        'Clear reading journey guiding client eye flow from problem to proof.'
      ],
      weakness: [
        'Requires continuous update of active metrics.'
      ],
      lesson: 'Visual Focus: The portfolio behaves as a diagnostic trust funnel. Shows absolute strategic authority, allowing premium positioning.'
    }
  };

  const currentExample = freelancerExamples[selectedExampleTier];

  // Helper to resolve asset title
  const getMappedAssetTitle = (sectionId: string, index: number) => {
    if (!displayStrategy) return 'Unmapped Proof Asset';
    const section = displayStrategy.portfolioStructure.find(s => s.sectionId === sectionId);
    if (!section || !section.proofAssetIds[index]) return 'Placeholder Proof Project';
    const assetId = section.proofAssetIds[index];
    const assetObj = proofAssets.find(a => a.id === assetId);
    return assetObj?.title || assetId.replace(/_/g, ' ');
  };

  const getMappedAssetHeadline = (sectionId: string, index: number) => {
    if (!displayStrategy) return 'Detailed process walk-through & proof statements.';
    const section = displayStrategy.portfolioStructure.find(s => s.sectionId === sectionId);
    if (!section || !section.proofAssetIds[index]) return 'Detailed process walk-through & proof statements.';
    const assetId = section.proofAssetIds[index];
    const assetObj = proofAssets.find(a => a.id === assetId);
    return assetObj?.portfolioCopy?.headline || 'Detailed process walk-through & proof statements.';
  };

  const copyRealWorldSummary = () => {
    const text = `HEADLINE: ${coreTrustPromise}\nTARGET AUDIENCE: SaaS & Fintech Platforms\nFEATURED CASE STUDY: ${getMappedAssetTitle('foundational', 0)}\nPRIMARY CTA: Schedule a 15-Minute Checkout Diagnostic`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-left pb-24 px-4 sm:px-6">
      
      {/* Sleek Minimal Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#0b1c30] tracking-tight">Your Client Authority Blueprint</h2>
            <span className="text-[9px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              96% Authority Quality Verified
            </span>
          </div>
          <p className="text-xs text-neutral-500 font-medium mt-0.5">
            Hover or click any section of your portfolio blueprint below to inspect its strategic role and buyer psychology impact.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200/60 shadow-inner shrink-0">
          {[
            { id: 'blueprint', label: 'Blueprint Hero', icon: Layers },
            { id: 'preview', label: 'Client Preview', icon: Eye },
            { id: 'examples', label: 'Live Examples', icon: FileText }
          ].map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5 border-none shrink-0",
                  viewMode === mode.id
                    ? "bg-white text-[#0b1c30] shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700 bg-transparent"
                )}
              >
                <Icon size={11} />
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Progressive AI Reasoning Collapsible Banner */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-3 shadow-xs transition-all">
        <button
          onClick={() => setShowAiReasoning(!showAiReasoning)}
          className="w-full flex items-center justify-between text-left cursor-pointer border-none bg-transparent"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-blue-600" />
            <span className="text-xs font-black text-[#0b1c30]">
              AI Strategic Reasoning Summary: <span className="text-blue-600 font-bold">Diagnostic Outcome Focus</span>
            </span>
            <span className="text-[9px] font-semibold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
              Generated from Module 1 & 2
            </span>
          </div>
          <div className="flex items-center gap-1 text-[9px] font-bold text-neutral-500 hover:text-neutral-800">
            <span>{showAiReasoning ? 'Hide Rationale' : 'Expose Rationale'}</span>
            <ChevronDown size={13} className={cn("transition-transform", showAiReasoning && "rotate-180")} />
          </div>
        </button>

        <AnimatePresence>
          {showAiReasoning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-3 mt-3 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-4 gap-2 text-left"
            >
              <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-[10px]">
                <span className="font-black text-blue-900 block text-[8px] uppercase tracking-wider">1. Business Outcome</span>
                <p className="font-bold text-[#0b1c30] mt-0.5">Checkout Loss Prevention</p>
                <span className="text-[8px] text-neutral-500 font-semibold block mt-0.5">Highest financial risk for SaaS.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 text-[10px]">
                <span className="font-black text-purple-900 block text-[8px] uppercase tracking-wider">2. Target Audience</span>
                <p className="font-bold text-[#0b1c30] mt-0.5">SaaS & Fintech Founders</p>
                <span className="text-[8px] text-neutral-500 font-semibold block mt-0.5">High LTV per customer.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-[10px]">
                <span className="font-black text-indigo-900 block text-[8px] uppercase tracking-wider">3. Positioning Angle</span>
                <p className="font-bold text-[#0b1c30] mt-0.5">Diagnostic Specialist</p>
                <span className="text-[8px] text-neutral-500 font-semibold block mt-0.5">Commands 3x higher rates.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-[10px]">
                <span className="font-black text-emerald-900 block text-[8px] uppercase tracking-wider">4. Psychology Principle</span>
                <p className="font-bold text-[#0b1c30] mt-0.5">Loss Aversion Effect</p>
                <span className="text-[8px] text-neutral-500 font-semibold block mt-0.5">Clients act 2.5x faster to stop leaks.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MAIN LAYOUT: CANVAS AS UNDISPUTED HERO */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        
        {/* CENTER / HERO CANVAS: Safari Mock Browser */}
        <div className={cn("transition-all duration-300", activeSectionId ? "lg:col-span-8" : "lg:col-span-12")}>
          
          {(viewMode === 'blueprint' || viewMode === 'preview') && (
            <div className="border border-neutral-200 rounded-3xl bg-white shadow-xl overflow-hidden flex flex-col relative max-w-full">
              
              {/* Browser Address Bar & Gaze Trigger */}
              <div className="bg-[#f8f9ff]/90 border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 block shrink-0" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 block shrink-0" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 block shrink-0" />
                </div>
                <div className="bg-neutral-100 border border-neutral-200/60 text-[9px] font-semibold text-neutral-400 py-1 px-6 rounded-lg max-w-xs w-full text-center truncate select-none">
                  {viewMode === 'blueprint' ? 'portfolio-authority-canvas' : 'client-live-preview'}
                </div>
                <button
                  onClick={startEyeTracker}
                  disabled={isEyeTrackerPlaying}
                  className="flex items-center gap-1 text-[9px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg transition-all cursor-pointer border-none disabled:opacity-50"
                >
                  <PlayCircle size={11} />
                  {isEyeTrackerPlaying ? 'Simulating Eye...' : 'Simulate Client Gaze'}
                </button>
              </div>

              {/* In-Canvas Eye Tracker Floating Gaze Bubble */}
              {isEyeTrackerPlaying && (
                <div 
                  className="absolute z-30 bg-[#0b1c30] text-white font-bold text-[9px] sm:text-[10px] py-1.5 px-3 rounded-xl shadow-lg border border-neutral-700 flex items-center gap-1.5 transition-all duration-500"
                  style={{
                    top: eyeTrackerStep === 1 ? '160px' : eyeTrackerStep === 2 ? '320px' : eyeTrackerStep === 3 ? '480px' : '620px',
                    left: '40px',
                    transform: 'translateY(-50%)'
                  }}
                >
                  <span className="animate-bounce">👀</span>
                  <span>
                    {eyeTrackerStep === 1 && "Noticed: Outcome-first headline! Addresses my revenue loss pain point."}
                    {eyeTrackerStep === 2 && "Interested: Let me watch this diagnostic video walkthrough demo."}
                    {eyeTrackerStep === 3 && "Convinced: Third-party client ROI review validates capability."}
                    {eyeTrackerStep === 4 && "Books Call: Low-friction 15-min audit. Scheduling now."}
                  </span>
                </div>
              )}

              {/* REAL PORTFOLIO CANVAS */}
              <div className="p-4 sm:p-8 space-y-6 bg-neutral-50/50 min-h-[580px] text-left relative">
                
                {/* Profile Header Banner */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-neutral-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0b1c30] text-white flex items-center justify-center font-black text-sm border border-neutral-200 shrink-0">
                      {authorityPosition.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-[#0b1c30] leading-snug">
                        {coreTrustPromise}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-bold text-neutral-600">Ayush Paul</span>
                        <span className="text-neutral-300">·</span>
                        <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-widest">
                          {authorityPosition} Archetype
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setCompareMode(!compareMode)}
                    className="text-[9px] font-bold text-[#0058be] bg-white border border-blue-100 hover:bg-blue-50 rounded-xl px-3 py-1.5 shadow-xs transition-all cursor-pointer border-none shrink-0"
                  >
                    {compareMode ? '✓ Viewing Authority Mode' : '⚖️ Toggle Commodity Compare'}
                  </button>
                </div>

                {/* SECTION 1: HERO VALUE HOOK */}
                <div
                  onClick={() => setActiveSectionId('hero')}
                  className={cn(
                    "p-6 rounded-2xl border transition-all relative text-left space-y-3 cursor-pointer",
                    activeSectionId === 'hero' 
                      ? "bg-blue-50/60 border-blue-500 shadow-md ring-2 ring-blue-500/20" 
                      : "bg-white border-neutral-200/90 hover:border-neutral-300"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-widest">
                      1. Hero Hook ➔ "What problem do you solve?"
                    </span>
                    {activeSectionId === 'hero' && <Sparkles size={11} className="text-blue-500" />}
                  </div>

                  {compareMode ? (
                    <div className="grid gap-4 sm:grid-cols-2 mt-3">
                      <div className="p-3.5 rounded-xl border bg-red-50/50 border-red-200 text-left">
                        <span className="text-[8px] font-black text-red-500 uppercase tracking-widest block mb-1">❌ Generic Commodity</span>
                        <h4 className="text-xs font-bold text-neutral-400 line-through">"React Developer for Hire"</h4>
                        <p className="text-[10px] text-neutral-400 mt-1">Focuses on input tools. Devalues pricing.</p>
                      </div>
                      <div className="p-3.5 rounded-xl border bg-emerald-50/50 border-emerald-200 text-left">
                        <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest block mb-1">🟢 Upgraded Authority</span>
                        <h4 className="text-xs font-black text-[#0b1c30]">"{coreTrustPromise}"</h4>
                        <p className="text-[10px] text-emerald-700 font-medium mt-1">Focuses on business outcome. Justifies premium rate.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 mt-2">
                      {/* Interactive Phrase Inspector */}
                      <div 
                        onMouseEnter={() => setActiveInspectorToken('outcome')}
                        onClick={(e) => { e.stopPropagation(); setActiveInspectorToken('outcome'); }}
                        className={cn(
                          "p-2.5 rounded-xl transition-all border cursor-pointer",
                          activeInspectorToken === 'outcome' ? "bg-blue-100/70 border-blue-400" : "bg-emerald-50/60 border-emerald-200/80"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[8px] font-black text-emerald-800 bg-emerald-200/80 px-1.5 py-0.5 rounded uppercase">
                            1. Dominant Value Promise
                          </span>
                          <span className="text-[8px] font-bold text-blue-600 bg-blue-50 px-1 py-0.5 rounded border border-blue-100">
                            🎯 Attracts Attention
                          </span>
                        </div>
                        <h2 className="text-sm sm:text-base font-black text-[#0b1c30] tracking-tight">
                          "Preventing customer checkout drops"
                        </h2>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-2">
                        <div 
                          onMouseEnter={() => setActiveInspectorToken('audience')}
                          onClick={(e) => { e.stopPropagation(); setActiveInspectorToken('audience'); }}
                          className={cn(
                            "p-2 rounded-xl border cursor-pointer transition-all",
                            activeInspectorToken === 'audience' ? "bg-purple-100/70 border-purple-400" : "bg-purple-50/50 border-purple-200/80"
                          )}
                        >
                          <span className="text-[8px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded uppercase block mb-1">
                            2. Target Audience Filter
                          </span>
                          <span className="text-xs font-bold text-neutral-800">"for SaaS & Fintech Platforms"</span>
                        </div>

                        <div 
                          onMouseEnter={() => setActiveInspectorToken('mechanism')}
                          onClick={(e) => { e.stopPropagation(); setActiveInspectorToken('mechanism'); }}
                          className={cn(
                            "p-2 rounded-xl border cursor-pointer transition-all",
                            activeInspectorToken === 'mechanism' ? "bg-indigo-100/70 border-indigo-400" : "bg-indigo-50/50 border-indigo-200/80"
                          )}
                        >
                          <span className="text-[8px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded uppercase block mb-1">
                            3. Diagnostic Mechanism
                          </span>
                          <p className="text-[10px] font-semibold text-neutral-700 leading-snug">"Analyzing checkout bottlenecks..."</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* SECTION 2: FOUNDATIONAL PROOF */}
                <div
                  onClick={() => setActiveSectionId('foundational')}
                  className={cn(
                    "p-6 rounded-2xl border transition-all relative text-left space-y-3 cursor-pointer",
                    activeSectionId === 'foundational' 
                      ? "bg-indigo-50/60 border-indigo-500 shadow-md ring-2 ring-indigo-500/20" 
                      : "bg-white border-neutral-200/90 hover:border-neutral-300"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-widest">
                      2. Primary Proof ➔ "Can you actually deliver?"
                    </span>
                    {activeSectionId === 'foundational' && <Sparkles size={11} className="text-indigo-500" />}
                  </div>

                  {/* MOCK VIDEO CASE STUDY PLAYER */}
                  <div className="bg-neutral-900 text-white rounded-xl p-4 relative overflow-hidden flex flex-col justify-between shadow-inner mt-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase bg-blue-600 text-white px-2 py-0.5 rounded">
                          Diagnostic Demo
                        </span>
                        <h4 className="text-xs font-bold truncate pr-4 mt-1">
                          {getMappedAssetTitle('foundational', 0)}
                        </h4>
                      </div>
                      <PlayCircle size={26} className="text-blue-500 shrink-0 cursor-pointer hover:scale-105 transition-transform" />
                    </div>

                    <div className="space-y-2 mt-3">
                      <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed line-clamp-1">
                        {getMappedAssetHeadline('foundational', 0)}
                      </p>
                      <div className="flex items-center gap-2 text-[8px] text-neutral-500 font-semibold">
                        <span>00:00</span>
                        <div className="flex-1 bg-neutral-800 h-1 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full w-[40%]" />
                        </div>
                        <span>08:42</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: SUPPORTING EVIDENCE */}
                <div
                  onClick={() => setActiveSectionId('supporting')}
                  className={cn(
                    "p-6 rounded-2xl border transition-all relative text-left space-y-3 cursor-pointer",
                    activeSectionId === 'supporting' 
                      ? "bg-purple-50/60 border-purple-500 shadow-md ring-2 ring-purple-500/20" 
                      : "bg-white border-neutral-200/90 hover:border-neutral-300"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100 uppercase tracking-widest">
                      3. Supporting Evidence ➔ "Is this repeatable?"
                    </span>
                    {activeSectionId === 'supporting' && <Sparkles size={11} className="text-purple-500" />}
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-purple-100 space-y-1.5 text-left mt-2">
                    <div className="flex items-center gap-1.5">
                      <Star size={11} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest">Verified Client Endorsement</span>
                    </div>
                    <p className="text-[10px] font-bold italic text-neutral-700 leading-relaxed">
                      "Ayush structured checkout audits that resolved our primary latency drops within days."
                    </p>
                    <span className="text-[9px] font-bold text-[#0b1c30] block">➔ CTO, SaaS Fintech</span>
                  </div>
                </div>

                {/* SECTION 4: CALL TO ACTION */}
                <div
                  onClick={() => setActiveSectionId('cta')}
                  className={cn(
                    "p-6 rounded-2xl border transition-all relative text-left space-y-3 cursor-pointer",
                    activeSectionId === 'cta' 
                      ? "bg-emerald-50/60 border-emerald-500 shadow-md ring-2 ring-emerald-500/20" 
                      : "bg-white border-neutral-200/90 hover:border-neutral-300"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-widest">
                      4. Call to Action ➔ "How do I work with you?"
                    </span>
                    {activeSectionId === 'cta' && <Sparkles size={11} className="text-emerald-500" />}
                  </div>

                  <div className="bg-[#f8f9ff] border border-blue-100 rounded-xl p-3.5 flex items-center justify-between gap-4 mt-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-[#0058be] shrink-0">
                        <Calendar size={15} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[#0b1c30]">Schedule 15-Min Audit</h4>
                        <p className="text-[9px] text-neutral-400 font-semibold mt-0.5">Low friction diagnostic call.</p>
                      </div>
                    </div>
                    <button className="bg-blue-600 text-white font-bold text-[10px] py-1.5 px-3 rounded-lg shadow-xs border-none cursor-pointer">
                      Book Diagnostic
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Live Examples List Tab */}
          {viewMode === 'examples' && (
            <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-sm space-y-6 text-left">
              <div className="space-y-1.5 border-b border-neutral-100 pb-3">
                <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 uppercase tracking-widest">
                  Freelancer Case Study Analysis
                </span>
                <h3 className="text-base font-black text-[#0b1c30]">
                  {currentExample.tier}
                </h3>
              </div>

              <div className="bg-neutral-50 border border-neutral-200/60 p-4 rounded-2xl space-y-2">
                <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest">Portfolio Headline:</span>
                <p className="text-xs font-bold text-[#0b1c30] leading-relaxed">
                  "{currentExample.headline}"
                </p>
                <div className="pt-2 border-t border-neutral-200/40">
                  <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest">Evidence Setup:</span>
                  <p className="text-[11px] text-neutral-600 font-semibold">{currentExample.assetsDescription}</p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="bg-emerald-500/[0.02] border border-emerald-500/20 p-4 rounded-2xl space-y-2">
                  <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Why It Works</span>
                  <ul className="space-y-1">
                    {currentExample.whyItWorks.map((w, idx) => (
                      <li key={idx} className="text-xs font-semibold text-emerald-800 flex items-start gap-1.5 leading-relaxed">
                        <span className="text-emerald-600 mt-0.5">✔</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-500/[0.02] border border-red-500/20 p-4 rounded-2xl space-y-2">
                  <span className="text-[9px] font-black text-red-700 uppercase tracking-widest">Weakness & Risks</span>
                  <ul className="space-y-1">
                    {currentExample.weakness.map((w, idx) => (
                      <li key={idx} className="text-xs font-semibold text-red-800 flex items-start gap-1.5 leading-relaxed">
                        <span className="text-red-600 mt-0.5">✖</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl text-xs font-bold text-[#0058be] leading-relaxed flex items-start gap-2">
                <Info size={14} className="shrink-0 mt-0.5" />
                <span>{currentExample.lesson}</span>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT / DRAWER: CONTEXTUAL ACTIVE SECTION INSPECTOR */}
        {activeSectionId && viewMode === 'blueprint' && (
          <div className="lg:col-span-4 space-y-4 text-left">
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <Target size={14} className="text-blue-600" />
                  <span className="text-[10px] font-black text-[#0b1c30] uppercase tracking-wider">
                    {activeSectionId === 'hero' && "Section 1: Hero Hook"}
                    {activeSectionId === 'foundational' && "Section 2: Primary Proof"}
                    {activeSectionId === 'supporting' && "Section 3: Evidence"}
                    {activeSectionId === 'cta' && "Section 4: Call to Action"}
                  </span>
                </div>
                <button 
                  onClick={() => setActiveSectionId(null)}
                  className="text-[9px] font-bold text-neutral-400 hover:text-neutral-700 border-none bg-transparent cursor-pointer"
                >
                  ✕ Close Panel
                </button>
              </div>

              {/* Active Section Breakdown */}
              {activeSectionId === 'hero' && (
                <div className="space-y-3 text-xs">
                  <p className="text-[11px] text-neutral-600 font-semibold leading-relaxed">
                    Answers: <span className="font-bold text-[#0b1c30]">"What problem do you solve?"</span> Addresses revenue leakage immediately.
                  </p>

                  <div className="bg-emerald-50/80 border border-emerald-200 p-3 rounded-2xl space-y-1.5 text-left">
                    <span className="text-[9px] font-black text-emerald-800 uppercase tracking-wider block">
                      ✓ Communication Audit Verified
                    </span>
                    <ul className="space-y-1 text-[9px] font-semibold text-emerald-900">
                      <li className="flex items-center gap-1">✔ Outcome-first (Passes 3-sec scan)</li>
                      <li className="flex items-center gap-1">✔ Target Audience Specificity</li>
                      <li className="flex items-center gap-1">✔ Justifies Premium Pricing</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 p-3 rounded-2xl text-[10px] font-bold text-[#0058be] leading-relaxed">
                    💡 Positioning Lesson: Clients don't buy your languages or toolsets—they buy their resolved business bottlenecks.
                  </div>
                </div>
              )}

              {activeSectionId === 'foundational' && (
                <div className="space-y-3 text-xs">
                  <p className="text-[11px] text-neutral-600 font-semibold leading-relaxed">
                    Answers: <span className="font-bold text-[#0b1c30]">"Can you actually deliver?"</span> Video walkthrough demo proves mechanism.
                  </p>
                  <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-2xl text-[10px] font-bold text-indigo-900 leading-relaxed">
                    💡 Positioning Lesson: Real authority translates code into business certainty. Don't expect clients to read code.
                  </div>
                </div>
              )}

              {activeSectionId === 'supporting' && (
                <div className="space-y-3 text-xs">
                  <p className="text-[11px] text-neutral-600 font-semibold leading-relaxed">
                    Answers: <span className="font-bold text-[#0b1c30]">"Is this repeatable or a fluke?"</span> Verified CTO review confirms metric ROI.
                  </p>
                  <div className="bg-purple-50 border border-purple-100 p-3 rounded-2xl text-[10px] font-bold text-purple-900 leading-relaxed">
                    💡 Positioning Lesson: Social proof should neutralize specific objections, not just say "they are good."
                  </div>
                </div>
              )}

              {activeSectionId === 'cta' && (
                <div className="space-y-3 text-xs">
                  <p className="text-[11px] text-neutral-600 font-semibold leading-relaxed">
                    Answers: <span className="font-bold text-[#0b1c30]">"How do I start?"</span> Lowers friction with a 15-min diagnostic call.
                  </p>
                  <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl text-[10px] font-bold text-emerald-900 leading-relaxed">
                    💡 Positioning Lesson: Never ask a client to figure out the next step. Lead them with a specific, low-risk offer.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* REAL-WORLD CONFIDENCE & ACTIONABLE TAKEAWAY CARD */}
      <div className="bg-gradient-to-r from-[#0b1c30] to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg space-y-4 text-left border border-neutral-800 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-700/80 pb-4">
          <div className="space-y-1">
            <span className="text-[8px] font-black uppercase text-blue-400 bg-blue-950 px-2.5 py-1 rounded-md border border-blue-800/60 tracking-widest">
              🚀 Real-World Actionable Summary
            </span>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white mt-1">
              You Now Own a High-Authority Position
            </h3>
            <p className="text-xs text-neutral-300 font-medium">
              Copy these exact statements to build your real-world LinkedIn headline, Contra profile, or personal website.
            </p>
          </div>
          <button
            onClick={copyRealWorldSummary}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all cursor-pointer border-none flex items-center gap-1.5 shrink-0"
          >
            {copiedSummary ? <CheckIcon size={14} /> : <Copy size={14} />}
            {copiedSummary ? 'Copied Summary!' : 'Copy Real-World Copy'}
          </button>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1">
            <span className="text-[8px] font-black text-blue-300 uppercase tracking-widest block">LinkedIn / Website Headline</span>
            <p className="font-bold text-white leading-snug">"{coreTrustPromise}"</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1">
            <span className="text-[8px] font-black text-indigo-300 uppercase tracking-widest block">Featured Proof Asset</span>
            <p className="font-bold text-white leading-snug">{getMappedAssetTitle('foundational', 0)}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1">
            <span className="text-[8px] font-black text-emerald-300 uppercase tracking-widest block">Primary Conversion Offer</span>
            <p className="font-bold text-white leading-snug">15-Minute Diagnostic Checkout Audit</p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <StepActionArea>
        <ModuleButton
          variant="secondary"
          onClick={previousStep}
        >
          <ArrowLeft size={16} />
          Back to Evidence
        </ModuleButton>
        <div className="flex flex-col items-end">
          <ModuleButton
            variant={pendingStrategy ? 'primary' : 'success'}
            onClick={handleApprove}
          >
            {pendingStrategy ? 'Approve Structural Strategy' : 'Strategy Approved — Continue'}
            <ArrowRight size={16} />
          </ModuleButton>
          <span className="text-[9px] font-bold text-neutral-400 mt-1.5 mr-1 block">
            Approve strategy to compile copy-paste templates in Step 4
          </span>
        </div>
      </StepActionArea>
    </div>
  );
}
