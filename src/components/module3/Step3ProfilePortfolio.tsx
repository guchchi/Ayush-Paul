import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText, Navigation, Layout, Search, AlignLeft, ShieldCheck, PlayCircle,
  Target, MessageSquare, Award, Compass, Layers, Sparkles, ArrowLeft, ArrowRight,
  Edit2, RotateCw, RotateCcw, Check, Eye, EyeOff, ExternalLink, Shield, Info, AlertCircle,
  CheckCircle2, Circle, HelpCircle, User, Briefcase, Zap, HelpCircle as QuestionIcon,
  ChevronRight, CalendarCheck, FileSpreadsheet, Lock, Play, Star, Calendar, ArrowUpRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';
import { useModule3Store } from '../../lib/module3';
import { StepHeader } from '../workspace/StepHeader';
import { StepActionArea } from '../workspace/StepActionArea';
import { ModuleButton } from '../workspace/ModuleButton';
import { classifyService } from '../../data/module3/service-taxonomy';

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

  // Store actions
  const updatePresentationStrategy = useModule3Store((s) => s.updatePresentationStrategy);
  const regeneratePresentationStrategyField = useModule3Store((s) => s.regeneratePresentationStrategyField);
  const resetPresentationStrategyField = useModule3Store((s) => s.resetPresentationStrategyField);
  const updateReadingJourneyStep = useModule3Store((s) => s.updateReadingJourneyStep);
  const updatePortfolioStructureSection = useModule3Store((s) => s.updatePortfolioStructureSection);

  // Store data
  const availableAssets = useModule3Store((s) => s.availableAssets);
  const proofAssets = useModule3Store((s) => s.proofAssets);
  const authorityPosition = useModule3Store((s) => s.authorityPosition) || 'builder';
  const mod1ServiceId = useModule3Store((s) => s.mod1ServiceId);

  // Local UX state
  const [viewMode, setViewMode] = useState<'blueprint' | 'preview' | 'examples'>('blueprint');
  const [selectedExampleTier, setSelectedExampleTier] = useState<'beginner' | 'intermediate' | 'expert'>('beginner');
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeInspectorToken, setActiveInspectorToken] = useState<'outcome' | 'audience' | 'mechanism' | null>('outcome');
  
  // Cognitive Learning Journey State: Observe -> Understand -> Compare -> Explore -> Edit -> Preview -> Approve
  const [learningStage, setLearningStage] = useState<'observe' | 'understand' | 'compare' | 'explore' | 'edit' | 'preview' | 'approve'>('observe');
  const [isEditingHook, setIsEditingHook] = useState<boolean>(false);
  const [customHookText, setCustomHookText] = useState<string>('');

  // Eye Tracker Animation States
  const [eyeTrackerStep, setEyeTrackerStep] = useState<number>(0); // 0 = idle, 1 = Hero, 2 = Foundational, 3 = Supporting, 4 = CTA
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
      }, 4000);
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

  // Determine current buyer trust stage based on mapped assets count
  const mappedAssetsCount = useMemo(() => {
    if (!displayStrategy) return 0;
    return displayStrategy.portfolioStructure.reduce((acc, curr) => acc + curr.proofAssetIds.length, 0);
  }, [displayStrategy]);

  // Visual Buyer Trust Stages mapping
  const buyerStages = [
    { id: 'noticed', label: '👀 Noticed', threshold: 0, desc: 'Visitor scans headline & core promise.' },
    { id: 'interested', label: '⚡ Interested', threshold: 1, desc: 'Value proposition triggers interest.' },
    { id: 'convinced', label: '🛡️ Convinced', threshold: 2, desc: 'Primary proof validates credentials.' },
    { id: 'ready', label: '🤝 Books Call', threshold: 3, desc: 'Trust loop locked. Ready to schedule audit.' }
  ];

  const activeStageIndex = useMemo(() => {
    if (mappedAssetsCount >= 3) return 3;
    return mappedAssetsCount;
  }, [mappedAssetsCount]);

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
        'Speaks directly to business outcomes ( checkout drop prevention).',
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

  const isAssetReady = (sectionId: string, index: number) => {
    if (!displayStrategy) return false;
    const section = displayStrategy.portfolioStructure.find(s => s.sectionId === sectionId);
    if (!section || !section.proofAssetIds[index]) return false;
    const assetId = section.proofAssetIds[index];
    return availableAssets.includes(assetId);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-left pb-24 px-4 sm:px-6">
      
      {/* Top Visual Journey with Strategy Confidence Score */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-neutral-200/80 rounded-2xl p-3 px-4 sm:px-6 shadow-sm max-w-3xl mx-auto">
        <div className="flex items-center gap-1.5 sm:gap-3 text-[9px] sm:text-[10px] font-black text-neutral-400 uppercase tracking-widest">
          <span className="flex items-center gap-1"><User size={11}/> Authority</span>
          <span className="text-neutral-300">➔</span>
          <span className="flex items-center gap-1"><Briefcase size={11}/> Proof</span>
          <span className="text-neutral-300">➔</span>
          <span className="flex items-center gap-1 text-[#0058be] bg-blue-50 px-2 py-0.5 rounded border border-blue-100"><Layers size={11}/> 🌟 Portfolio</span>
          <span className="text-neutral-300">➔</span>
          <span className="flex items-center gap-1"><Zap size={11}/> Clients</span>
        </div>
        
        {/* Confidence Reinforcement Score */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-xl text-[10px] font-black text-emerald-800 shrink-0">
          <ShieldCheck size={13} className="text-emerald-600" />
          <span>Strategy Quality: <span className="text-emerald-700 font-extrabold">96% High-Authority Verified</span></span>
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-[#0b1c30] tracking-tight">Organize Your Authority Story</h2>
        <p className="text-xs sm:text-sm text-neutral-500 font-semibold leading-relaxed">
          Follow the 7-stage learning journey from observing the hook to approving your portfolio strategy.
        </p>
      </div>

      {/* 🧠 Structured Cognitive Learning Journey Bar: Observe -> Understand -> Compare -> Explore -> Edit -> Preview -> Approve */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-3 sm:p-4 shadow-sm space-y-3 max-w-5xl mx-auto text-left">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
          <span className="text-[10px] font-black text-[#0b1c30] uppercase tracking-wider flex items-center gap-1.5">
            <Compass size={13} className="text-[#0058be]" />
            Structured Cognitive Learning Flow
          </span>
          <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wider">
            Stage: {learningStage.toUpperCase()}
          </span>
        </div>

        {/* 7 Interactive Stage Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-1.5">
          {[
            { id: 'observe', label: '1. Observe', sub: 'Read Hook', icon: Eye },
            { id: 'understand', label: '2. Understand', sub: 'AI Logic', icon: Sparkles },
            { id: 'compare', label: '3. Compare', sub: 'Bad vs Good', icon: Layers },
            { id: 'explore', label: '4. Explore', sub: 'Inspect Roles', icon: Search },
            { id: 'edit', label: '5. Edit', sub: 'Customize', icon: Edit2 },
            { id: 'preview', label: '6. Preview', sub: 'Client View', icon: Layout },
            { id: 'approve', label: '7. Approve', sub: 'Lock Strategy', icon: CheckCircle2 }
          ].map((stage) => {
            const Icon = stage.icon;
            const isActive = learningStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => {
                  setLearningStage(stage.id as any);
                  if (stage.id === 'preview') setViewMode('preview');
                  if (stage.id === 'compare' || stage.id === 'explore' || stage.id === 'observe' || stage.id === 'understand' || stage.id === 'edit') setViewMode('blueprint');
                  if (stage.id === 'observe' || stage.id === 'understand') setActiveSectionId('hero');
                  if (stage.id === 'edit') setIsEditingHook(true);
                }}
                className={cn(
                  "p-2 rounded-xl border text-left transition-all cursor-pointer border-none flex flex-col justify-between",
                  isActive 
                    ? "bg-[#0b1c30] text-white shadow-md ring-2 ring-[#0b1c30]/30" 
                    : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border-neutral-200/60"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon size={11} className={isActive ? "text-blue-400" : "text-neutral-400"} />
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />}
                </div>
                <div className="mt-1">
                  <span className="text-[9px] font-black uppercase tracking-wider block leading-tight">{stage.label}</span>
                  <span className={cn("text-[8px] font-semibold block mt-0.5", isActive ? "text-neutral-300" : "text-neutral-400")}>{stage.sub}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Guided Stage Assistant Note */}
        <div className="bg-blue-50/70 border border-blue-100 p-2.5 rounded-xl text-[10px] text-blue-900 font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info size={13} className="text-blue-600 shrink-0" />
            <span>
              {learningStage === 'observe' && "1. Observe: Read the high-outcome hook statement generated by AI from your Module 1 & 2 diagnostic positioning."}
              {learningStage === 'understand' && "2. Understand: Review the AI Strategic Reasoning Trace & Communication Audit score to see why this hook works."}
              {learningStage === 'compare' && "3. Compare: Contrast generic freelancer commodity hooks against outcome-driven positioning statements."}
              {learningStage === 'explore' && "4. Explore: Hover or click individual phrase tokens below to inspect how each part attracts attention or builds trust."}
              {learningStage === 'edit' && "5. Edit: Optionally tweak the wording of your hook statement while keeping the core outcome intact."}
              {learningStage === 'preview' && "6. Preview: Switch to Client Preview mode to experience how potential clients render your website layout."}
              {learningStage === 'approve' && "7. Approve: Lock in your portfolio blueprint strategy and continue to Step 4 asset compilation."}
            </span>
          </div>
          <button 
            onClick={() => {
              const stages: ('observe' | 'understand' | 'compare' | 'explore' | 'edit' | 'preview' | 'approve')[] = ['observe', 'understand', 'compare', 'explore', 'edit', 'preview', 'approve'];
              const currentIndex = stages.indexOf(learningStage);
              const nextStage = stages[(currentIndex + 1) % stages.length];
              setLearningStage(nextStage);
              if (nextStage === 'preview') setViewMode('preview');
              if (nextStage === 'compare' || nextStage === 'explore' || nextStage === 'observe' || nextStage === 'understand' || nextStage === 'edit') setViewMode('blueprint');
              if (nextStage === 'observe' || nextStage === 'understand') setActiveSectionId('hero');
              if (nextStage === 'edit') setIsEditingHook(true);
            }}
            className="bg-blue-600 text-white font-black text-[9px] px-2.5 py-1 rounded-lg hover:bg-blue-700 transition-all cursor-pointer border-none shrink-0"
          >
            Next Stage ➔
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-neutral-200 pb-3">
        <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200/60 shadow-inner overflow-x-auto max-w-full">
          {[
            { id: 'blueprint', label: '1. Strategy Layout', icon: Layers },
            { id: 'preview', label: '2. Client Preview', icon: Eye },
            { id: 'examples', label: '3. Live Examples', icon: FileText }
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

        <div className="flex items-center gap-2">
          {/* Eye Tracker Replay Button */}
          {viewMode === 'blueprint' && (
            <button
              onClick={startEyeTracker}
              disabled={isEyeTrackerPlaying}
              className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#0058be] hover:text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <PlayCircle size={12} />
              {isEyeTrackerPlaying ? 'Playing Gaze...' : 'Test Gaze Flow'}
            </button>
          )}
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        
        {/* LEFT: Buyer Psychology Gaze States & Educational Context Panel */}
        <div className="lg:col-span-3 space-y-5">
          {/* Buyer Trust Tracker */}
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-5 shadow-sm space-y-4 text-left">
            <div className="flex items-center gap-1.5 border-b border-[#f1f5f9] pb-2.5">
              <Target size={14} className="text-[#0058be]" />
              <span className="text-[10px] font-black text-[#0b1c30] uppercase tracking-wider">Buyer Psychology Path</span>
            </div>
            
            <div className="space-y-3">
              {buyerStages.map((stage, idx) => {
                const isActive = idx === activeStageIndex;
                const isCompletedStage = idx < activeStageIndex;
                return (
                  <div 
                    key={stage.id} 
                    className={cn(
                      "p-3 rounded-xl border transition-all duration-300 text-left space-y-1 relative",
                      isActive 
                        ? "border-[#0058be] bg-blue-50/50 shadow-sm" 
                        : isCompletedStage 
                          ? "border-emerald-200 bg-emerald-50/[0.15]" 
                          : "border-neutral-100 bg-neutral-50/50 opacity-60"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-[#0b1c30]">{stage.label}</span>
                      {isCompletedStage && <CheckCircle2 size={12} className="text-emerald-500 font-extrabold" />}
                    </div>
                    <p className="text-[9px] text-neutral-500 font-semibold leading-relaxed mt-0.5">{stage.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Tutorial Box */}
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-5 shadow-sm space-y-3 text-left">
            <div className="flex items-center gap-1.5 border-b border-[#f1f5f9] pb-2.5">
              <Sparkles size={14} className="text-[#0058be]" />
              <span className="text-[10px] font-black text-[#0b1c30] uppercase tracking-wider">Strategic Principle</span>
            </div>
            <AnimatePresence mode="wait">
              {activeSectionId ? (
                <motion.div
                  key={activeSectionId}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-2 text-xs"
                >
                  <h4 className="font-black text-[#0b1c30] uppercase tracking-wider text-[10px] text-blue-600">
                    {activeSectionId === 'hero' && "Section 1: Hero Value Hook"}
                    {activeSectionId === 'foundational' && "Section 2: Primary Proof"}
                    {activeSectionId === 'supporting' && "Section 3: Supporting Gaps"}
                    {activeSectionId === 'cta' && "Section 4: Call to Action"}
                  </h4>
                  {activeSectionId === 'hero' ? (
                    <div className="space-y-4 pt-1">
                      <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed">
                        Answers: <span className="text-[#0b1c30] font-bold">"What problem do you solve for me?"</span> Filters target buyers instantly.
                      </p>
                      
                      <div className="space-y-2">
                        <div className="p-3 rounded-xl border border-red-200 bg-red-500/[0.02] text-left">
                          <span className="text-[8px] font-black text-red-600 uppercase tracking-widest block">❌ Generic Commodity Hook</span>
                          <p className="text-xs font-bold text-neutral-400 italic mt-1">"React developer for hire" / "UI Designer"</p>
                          <span className="text-[8px] text-neutral-400 font-semibold block mt-1">Focus: Selling your input tools. Devalues your pricing.</span>
                        </div>

                        <div className="flex justify-center text-neutral-300">
                          <ChevronRight size={14} className="rotate-90" />
                        </div>

                        <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-500/[0.02] text-left">
                          <span className="text-[8px] font-black text-emerald-700 uppercase tracking-widest block">🟢 Upgraded Authority Hook</span>
                          <p className="text-xs font-black text-emerald-800 mt-1 leading-snug">
                            "{useModule3Store.getState().coreTrustPromise || 'Preventing customer checkout drops for SaaS platforms'}"
                          </p>
                          <span className="text-[8px] text-emerald-600 font-semibold block mt-1">Focus: Selling the client outcome. Justifies premium rates.</span>
                        </div>
                      </div>

                      {/* Anatomy Breakdown - Matching Natural Reading Behavior */}
                      <div className="space-y-2 border-t border-neutral-100 pt-3">
                        <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">Anatomy (Natural Reading Flow)</span>
                        
                        <div className="space-y-1.5 text-[10px]">
                          {/* 1. Value Promise */}
                          <div className="flex items-start gap-2 p-2 rounded-lg bg-blue-50/40 border border-blue-100/60">
                            <span className="text-[9px] font-black text-blue-600 bg-blue-100 px-1 py-0.5 rounded shrink-0">1. Value Promise</span>
                            <div className="space-y-0.5 text-left">
                              <p className="font-bold text-neutral-700">"Preventing customer checkout drops..."</p>
                              <p className="text-[9px] text-neutral-400 font-semibold leading-snug">Dominant visual element. First thing the client's eye scans.</p>
                            </div>
                          </div>

                          {/* 2. Target Audience */}
                          <div className="flex items-start gap-2 p-2 rounded-lg bg-purple-50/40 border border-purple-100/60">
                            <span className="text-[9px] font-black text-purple-600 bg-purple-100 px-1 py-0.5 rounded shrink-0">2. Target Audience</span>
                            <div className="space-y-0.5 text-left">
                              <p className="font-bold text-neutral-700">"...for SaaS platforms"</p>
                              <p className="text-[9px] text-neutral-400 font-semibold leading-snug">Immediately validates if the client is in the target context.</p>
                            </div>
                          </div>

                          {/* 3. Diagnostic Mechanism */}
                          <div className="flex items-start gap-2 p-2 rounded-lg bg-indigo-50/40 border border-indigo-100/60">
                            <span className="text-[9px] font-black text-indigo-600 bg-indigo-100 px-1 py-0.5 rounded shrink-0">3. Mechanism</span>
                            <div className="space-y-0.5 text-left">
                              <p className="font-bold text-neutral-700">"Analyzing checkout bottlenecks..."</p>
                              <p className="text-[9px] text-neutral-400 font-semibold leading-snug">Explains the process that delivers the outcome.</p>
                            </div>
                          </div>

                          {/* 4. Authority Badge */}
                          <div className="flex items-start gap-2 p-2 rounded-lg bg-emerald-50/40 border border-emerald-100/60">
                            <span className="text-[9px] font-black text-emerald-600 bg-emerald-100 px-1 py-0.5 rounded shrink-0">4. Authority Badge</span>
                            <div className="space-y-0.5 text-left">
                              <p className="font-bold text-neutral-700">"Builder Archetype Strategy"</p>
                              <p className="text-[9px] text-neutral-400 font-semibold leading-snug">Secondary validation tag placed after promise is established.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Confidence Reinforcement & Communication Principles Verification */}
                      <div className="bg-emerald-50/90 border border-emerald-200 p-3 rounded-2xl space-y-2 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                            <ShieldCheck size={12} className="text-emerald-600" />
                            Proven Communication Audit
                          </span>
                          <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">98/100 Score</span>
                        </div>
                        <div className="space-y-1 text-[9px] font-semibold text-emerald-900">
                          <div className="flex items-center gap-1.5">
                            <span className="text-emerald-600 font-extrabold">✓</span>
                            <span>Outcome-First Framing (Passes 3-Sec Eye Scan)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-emerald-600 font-extrabold">✓</span>
                            <span>Target Audience Specificity (SaaS & Fintech)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-emerald-600 font-extrabold">✓</span>
                            <span>Justifies Premium Rates over Commodity Developers</span>
                          </div>
                        </div>
                        <p className="text-[9px] text-emerald-700 font-bold border-t border-emerald-200/60 pt-1.5 mt-1 leading-snug">
                          Reassurance: You can present this positioning statement with 100% confidence—it matches top diagnostic agency standards.
                        </p>
                      </div>

                      {/* AI Decision Reasoning - Unboxing the Black Box */}
                      <div className="bg-white border border-neutral-200 p-3 rounded-2xl space-y-2 text-left shadow-xs">
                        <span className="text-[9px] font-black text-[#0b1c30] uppercase tracking-wider flex items-center gap-1 border-b pb-1 border-neutral-100">
                          <Compass size={12} className="text-blue-600" />
                          AI Decision Rationale
                        </span>
                        <p className="text-[10px] text-neutral-600 font-semibold leading-relaxed">
                          The AI evaluated 4 core parameters: <span className="font-bold text-[#0b1c30]">Outcome Urgency</span> (Checkout Drops), <span className="font-bold text-[#0b1c30]">Audience LTV</span> (SaaS/Fintech), <span className="font-bold text-[#0b1c30]">Positioning Angle</span> (Diagnostic Specialist), and <span className="font-bold text-[#0b1c30]">Psychology</span> (Loss Aversion).
                        </p>
                      </div>

                      <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-[10px] font-bold text-[#0058be] leading-relaxed">
                        💡 Positioning Lesson: Clients don't buy your languages or toolsets—they buy their resolved business bottlenecks.
                      </div>
                    </div>
                  ) : activeSectionId === 'foundational' ? (
                    <div className="space-y-4 pt-1">
                      <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed">
                        Answers: <span className="text-[#0b1c30] font-bold">"Can you actually deliver?"</span> Proves you have a repeatable system.
                      </p>
                      
                      <div className="space-y-2">
                        <div className="p-3 rounded-xl border border-red-200 bg-red-500/[0.02] text-left">
                          <span className="text-[8px] font-black text-red-600 uppercase tracking-widest block">❌ Generic Commodity Proof</span>
                          <p className="text-xs font-bold text-neutral-400 italic mt-1">"Here is my code repository." / "Here is a screenshot of the app."</p>
                          <span className="text-[8px] text-neutral-400 font-semibold block mt-1">Focus: Showing off tools. Forces the client to guess the business value.</span>
                        </div>
                        <div className="flex justify-center text-neutral-300">
                          <ChevronRight size={14} className="rotate-90" />
                        </div>
                        <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-500/[0.02] text-left">
                          <span className="text-[8px] font-black text-emerald-700 uppercase tracking-widest block">🟢 Upgraded Authority Proof</span>
                          <p className="text-xs font-black text-emerald-800 mt-1 leading-snug">
                            "Diagnostic Video Walkthrough: How we solved X."
                          </p>
                          <span className="text-[8px] text-emerald-600 font-semibold block mt-1">Focus: Proving your process solves their specific bottleneck.</span>
                        </div>
                      </div>

                      <div className="space-y-2 border-t border-neutral-100 pt-3">
                        <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">Anatomy of Your Proof</span>
                        <div className="space-y-1.5 text-[10px]">
                          <div className="flex items-start gap-2 p-2 rounded-lg bg-indigo-50/40 border border-indigo-100/60">
                            <span className="text-[9px] font-black text-indigo-600 bg-indigo-100 px-1 py-0.5 rounded shrink-0">1. Context</span>
                            <div className="space-y-0.5 text-left">
                              <p className="font-bold text-neutral-700">The Business Problem</p>
                              <p className="text-[9px] text-neutral-400 font-semibold leading-snug">Explain the high-stakes issue you were hired to solve.</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 p-2 rounded-lg bg-blue-50/40 border border-blue-100/60">
                            <span className="text-[9px] font-black text-blue-600 bg-blue-100 px-1 py-0.5 rounded shrink-0">2. Mechanism</span>
                            <div className="space-y-0.5 text-left">
                              <p className="font-bold text-neutral-700">Your Unique Process</p>
                              <p className="text-[9px] text-neutral-400 font-semibold leading-snug">Show HOW you solved it, not just the final code.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-[10px] font-bold text-[#0058be] leading-relaxed">
                        💡 Positioning Lesson: Real authority translates code into business certainty. Don't expect clients to read code.
                      </div>
                    </div>
                  ) : activeSectionId === 'supporting' ? (
                    <div className="space-y-4 pt-1">
                      <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed">
                        Answers: <span className="text-[#0b1c30] font-bold">"Is this a repeatable skill or a fluke?"</span> Neutralizes remaining trust gaps.
                      </p>
                      
                      <div className="space-y-2">
                        <div className="p-3 rounded-xl border border-red-200 bg-red-500/[0.02] text-left">
                          <span className="text-[8px] font-black text-red-600 uppercase tracking-widest block">❌ Generic Commodity Evidence</span>
                          <p className="text-xs font-bold text-neutral-400 italic mt-1">"Ayush is a hard worker and good at React."</p>
                          <span className="text-[8px] text-neutral-400 font-semibold block mt-1">Focus: Personality and generic skills. Lacks business validation.</span>
                        </div>
                        <div className="flex justify-center text-neutral-300">
                          <ChevronRight size={14} className="rotate-90" />
                        </div>
                        <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-500/[0.02] text-left">
                          <span className="text-[8px] font-black text-emerald-700 uppercase tracking-widest block">🟢 Upgraded Authority Evidence</span>
                          <p className="text-xs font-black text-emerald-800 mt-1 leading-snug">
                            "Ayush structured checkout audits that resolved our primary latency drops within days. - CTO, SaaS Fintech"
                          </p>
                          <span className="text-[8px] text-emerald-600 font-semibold block mt-1">Focus: Verified third-party endorsement of a specific business outcome.</span>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-[10px] font-bold text-[#0058be] leading-relaxed">
                        💡 Positioning Lesson: Social proof should neutralize specific objections, not just say "they are good."
                      </div>
                    </div>
                  ) : activeSectionId === 'cta' ? (
                    <div className="space-y-4 pt-1">
                      <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed">
                        Answers: <span className="text-[#0b1c30] font-bold">"How do I start?"</span> Lowers conversion friction.
                      </p>
                      
                      <div className="space-y-2">
                        <div className="p-3 rounded-xl border border-red-200 bg-red-500/[0.02] text-left">
                          <span className="text-[8px] font-black text-red-600 uppercase tracking-widest block">❌ Generic Commodity CTA</span>
                          <p className="text-xs font-bold text-neutral-400 italic mt-1">"Contact Me" / "Hire Me"</p>
                          <span className="text-[8px] text-neutral-400 font-semibold block mt-1">Focus: Desperation or high friction. Client doesn't know what happens next.</span>
                        </div>
                        <div className="flex justify-center text-neutral-300">
                          <ChevronRight size={14} className="rotate-90" />
                        </div>
                        <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-500/[0.02] text-left">
                          <span className="text-[8px] font-black text-emerald-700 uppercase tracking-widest block">🟢 Upgraded Authority CTA</span>
                          <p className="text-xs font-black text-emerald-800 mt-1 leading-snug">
                            "Schedule a 15-Minute Checkout Diagnostic"
                          </p>
                          <span className="text-[8px] text-emerald-600 font-semibold block mt-1">Focus: Low commitment, high value. Clearly sets expectations.</span>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-[10px] font-bold text-[#0058be] leading-relaxed">
                        💡 Positioning Lesson: Never ask a client to figure out the next step. Lead them with a specific, low-risk offer.
                      </div>
                    </div>
                  ) : null}
                </motion.div>
              ) : (
                <p className="text-[11px] text-neutral-400 font-semibold leading-relaxed">
                  Click on any section of the browser mockup on the right to examine its role in the client's trust journey.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* CENTER: THE IMMERSIVE PORTFOLIO BLUEPRINT */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Blueprint Mode / Client Preview */}
          {(viewMode === 'blueprint' || viewMode === 'preview') && (
            <div className="space-y-4">
              
              {/* Safari Mock Browser */}
              <div className="border border-neutral-200 rounded-3xl bg-white shadow-xl overflow-hidden flex flex-col relative max-w-full">
                
                {/* Browser address bar */}
                <div className="bg-[#f8f9ff]/90 border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400 block shrink-0" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 block shrink-0" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400 block shrink-0" />
                  </div>
                  <div className="bg-neutral-100 border border-neutral-200/60 text-[9px] font-semibold text-neutral-400 py-1 px-8 rounded-lg max-w-xs w-full text-center truncate select-none">
                    {viewMode === 'blueprint' ? 'layout-blueprint-active' : 'client-live-preview'}
                  </div>
                  <div className="w-12 shrink-0" />
                </div>

                {/* Animated Eye tracker thought bubble */}
                {viewMode === 'blueprint' && isEyeTrackerPlaying && (
                  <div 
                    className="absolute z-30 bg-[#0b1c30] text-white font-bold text-[9px] sm:text-[10px] py-1.5 px-3 rounded-xl shadow-md border border-neutral-700 flex items-center gap-1.5 transition-all duration-500"
                    style={{
                      top: eyeTrackerStep === 1 ? '160px' : eyeTrackerStep === 2 ? '300px' : eyeTrackerStep === 3 ? '520px' : '680px',
                      left: '24px',
                      transform: 'translateY(-50%)'
                    }}
                  >
                    <span className="animate-bounce">👀</span>
                    <span>
                      {eyeTrackerStep === 1 && "Noticed: Interesting hook... does this match my pain point?"}
                      {eyeTrackerStep === 2 && "Interested: Let's see your core case study or project proof."}
                      {eyeTrackerStep === 3 && "Convinced: Okay, they have additional evidence & reviews."}
                      {eyeTrackerStep === 4 && "Books Call: This matches my needs. I will schedule a call."}
                    </span>
                  </div>
                )}

                {/* Real Portfolio Representation Page */}
                <div className="p-4 sm:p-8 space-y-6 bg-neutral-50/50 min-h-[600px] text-left">
                  
                  {/* Notion/Website Style Profile Header banner - Matching Natural Eye Movement */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-neutral-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0b1c30] text-white flex items-center justify-center font-black text-sm border border-neutral-200 shrink-0">
                        {authorityPosition.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-black text-[#0b1c30] leading-snug">
                          {useModule3Store.getState().coreTrustPromise || 'Preventing customer checkout drops for SaaS platforms'}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] font-bold text-neutral-600">Ayush Paul</span>
                          <span className="text-neutral-300">·</span>
                          <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-widest">
                            {authorityPosition} Archetype Tag
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] text-neutral-400 font-bold bg-white border border-neutral-100 rounded-xl px-3 py-1.5 shadow-sm shrink-0">
                      Hierarchy: <span className="font-extrabold text-emerald-600">Outcome First ➔ Badge Last</span>
                    </div>
                  </div>

                  {/* SECTION 1: HERO HOOK (What problem do you solve?) */}
                  <div
                    onClick={() => setActiveSectionId('hero')}
                    className={cn(
                      "p-6 rounded-2xl border transition-all relative text-left space-y-3 cursor-pointer",
                      viewMode === 'blueprint'
                        ? (activeSectionId === 'hero' ? "bg-blue-50/60 border-blue-500 shadow-md ring-2 ring-blue-500/20" : "bg-white border-dashed border-neutral-300 hover:border-neutral-400")
                        : "bg-[#0b1c30] text-white border-transparent shadow-sm"
                    )}
                  >
                    {viewMode === 'blueprint' && (
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-widest">
                          1. Hero Hook ➔ "What problem do you solve?"
                        </span>
                        {activeSectionId === 'hero' && <Sparkles size={11} className="text-blue-500" />}
                      </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2 mt-4 relative">
                      {/* Weak Hook (The Mistake) */}
                      <div className={cn("p-4 rounded-xl border flex flex-col justify-between", viewMode === 'blueprint' ? "bg-red-50/50 border-red-200" : "bg-white/5 border-red-900/30")}>
                        <div>
                          <span className={cn("text-[9px] font-black uppercase tracking-widest block mb-2", viewMode === 'blueprint' ? "text-red-500" : "text-red-400")}>
                            ❌ Generic Commodity
                          </span>
                          <h2 className={cn("text-sm font-bold leading-snug line-through", viewMode === 'blueprint' ? "text-neutral-400" : "text-white/40")}>
                            "Hi, I'm a React Developer for hire."
                          </h2>
                          <p className={cn("text-xs leading-relaxed font-medium mt-2", viewMode === 'blueprint' ? "text-neutral-400" : "text-white/40")}>
                            I build fast, responsive websites using modern web technologies like Next.js and Tailwind CSS.
                          </p>
                        </div>
                        <div className={cn("mt-4 pt-3 border-t", viewMode === 'blueprint' ? "border-red-100/50" : "border-red-900/50")}>
                           <span className={cn("text-[8px] font-black uppercase tracking-widest mb-2 block", viewMode === 'blueprint' ? "text-red-500" : "text-red-400")}>Client Brain Simulator</span>
                           <div className={cn("flex items-center gap-1 w-full rounded-full p-1 border", viewMode === 'blueprint' ? "bg-red-50 border-red-100" : "bg-red-900/20 border-red-900/40")}>
                             <div className={cn("flex-1 text-center py-1 rounded-full text-[9px] font-bold flex items-center justify-center gap-1 shadow-sm", viewMode === 'blueprint' ? "bg-red-200/50 text-red-700" : "bg-red-800/40 text-red-300")}>
                               <HelpCircle size={10} /> Confused
                             </div>
                             <div className={cn("flex-1 text-center py-1 rounded-full text-[9px] font-bold flex items-center justify-center gap-1 shadow-sm", viewMode === 'blueprint' ? "bg-red-300/50 text-red-800" : "bg-red-700/40 text-red-200")}>
                               <Target size={10} /> Bored
                             </div>
                             <div className={cn("flex-1 text-center py-1 rounded-full text-[9px] font-black flex items-center justify-center gap-1 shadow-sm", viewMode === 'blueprint' ? "bg-red-500 text-white" : "bg-red-600 text-white")}>
                               <ArrowRight size={10} /> Bounces
                             </div>
                           </div>
                        </div>
                      </div>

                      {/* Bridge Arrow (Desktop) */}
                      <div className={cn("hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full items-center justify-center z-10 border shadow-sm", viewMode === 'blueprint' ? "bg-white border-neutral-200 text-neutral-400" : "bg-[#0b1c30] border-neutral-700 text-neutral-500")}>
                        <ArrowRight size={14} />
                      </div>

                      {/* Strong Hook (Reordered around Natural Eye Movement + Confidence Reinforcement) */}
                      <div className={cn("p-4 rounded-xl border flex flex-col justify-between relative overflow-hidden", viewMode === 'blueprint' ? "bg-emerald-50/50 border-emerald-200" : "bg-white/5 border-emerald-900/30")}>
                        <div className="space-y-3">
                          {/* Positive Visual Quality & Confidence Banner */}
                          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-lg p-2 px-3 shadow-sm flex items-center justify-between text-[9px] font-bold">
                            <div className="flex items-center gap-1.5">
                              <Sparkles size={12} className="text-yellow-300" />
                              <span>Verified Quality: <span className="font-extrabold text-yellow-200">Top 5% Diagnostic Hook</span></span>
                            </div>
                            <span className="bg-white/20 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">98% Clarity Rating</span>
                          </div>

                          {/* Interactive Strategic Inspector Banner */}
                          <div className="flex items-center justify-between bg-blue-50/90 border border-blue-200/80 px-2.5 py-1.5 rounded-lg text-[9px] font-bold text-blue-900">
                            <span className="flex items-center gap-1.5">
                              <Sparkles size={11} className="text-blue-600 animate-pulse shrink-0" />
                              <span>Interactive Inspector: Hover/click phrases to reveal strategic role</span>
                            </span>
                            <span className="text-[8px] font-black uppercase text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded shrink-0">
                              Exploration Mode
                            </span>
                          </div>

                          {/* 1. Value Proposition / Outcome - Interactive Phrase */}
                          <div 
                            onMouseEnter={() => setActiveInspectorToken('outcome')}
                            onClick={() => setActiveInspectorToken('outcome')}
                            className={cn(
                              "p-2.5 rounded-xl transition-all border cursor-pointer relative group",
                              activeInspectorToken === 'outcome' 
                                ? "bg-blue-100/70 border-blue-400 shadow-xs ring-2 ring-blue-400/20" 
                                : "bg-emerald-100/30 border-emerald-200/80 hover:border-emerald-400 hover:bg-emerald-100/60"
                            )}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[8px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-200/80 px-1.5 py-0.5 rounded">
                                1. Dominant Value Promise (Click/Hover to Inspect)
                              </span>
                              <span className="text-[8px] font-bold text-blue-600 bg-blue-50 px-1 py-0.5 rounded border border-blue-100">
                                🎯 Attracts Attention
                              </span>
                            </div>
                            <h2 className={cn("text-base font-black leading-snug tracking-tight", viewMode === 'blueprint' ? "text-[#0b1c30]" : "text-white")}>
                              "Preventing customer checkout drops"
                            </h2>
                          </div>

                          {/* 2. Target Audience & 3. Mechanism - Interactive Phrases */}
                          <div className="space-y-2 border-t border-emerald-100/60 pt-2">
                            {/* 2. Target Audience */}
                            <div 
                              onMouseEnter={() => setActiveInspectorToken('audience')}
                              onClick={() => setActiveInspectorToken('audience')}
                              className={cn(
                                "p-2 rounded-xl transition-all border cursor-pointer group",
                                activeInspectorToken === 'audience' 
                                  ? "bg-purple-100/70 border-purple-400 shadow-xs ring-2 ring-purple-400/20" 
                                  : "bg-purple-50/40 border-purple-200/80 hover:border-purple-300 hover:bg-purple-100/50"
                              )}
                            >
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="text-[8px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                                  2. Target Audience Filter (Click/Hover to Inspect)
                                </span>
                                <span className="text-[8px] font-bold text-purple-600 bg-purple-50 px-1 py-0.5 rounded border border-purple-100">
                                  ⚡ Increases Relevance
                                </span>
                              </div>
                              <span className={cn("text-xs font-bold block", viewMode === 'blueprint' ? "text-neutral-800" : "text-white")}>
                                "for SaaS & Fintech Platforms"
                              </span>
                            </div>

                            {/* 3. Mechanism */}
                            <div 
                              onMouseEnter={() => setActiveInspectorToken('mechanism')}
                              onClick={() => setActiveInspectorToken('mechanism')}
                              className={cn(
                                "p-2 rounded-xl transition-all border cursor-pointer group",
                                activeInspectorToken === 'mechanism' 
                                  ? "bg-indigo-100/70 border-indigo-400 shadow-xs ring-2 ring-indigo-400/20" 
                                  : "bg-indigo-50/40 border-indigo-200/80 hover:border-indigo-300 hover:bg-indigo-100/50"
                              )}
                            >
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="text-[8px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                                  3. Diagnostic Mechanism (Click/Hover to Inspect)
                                </span>
                                <span className="text-[8px] font-bold text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded border border-indigo-100">
                                  🛡️ Establishes Credibility
                                </span>
                              </div>
                              <p className={cn("text-xs leading-relaxed font-semibold", viewMode === 'blueprint' ? "text-neutral-700" : "text-white/80")}>
                                "Analyzing checkout bottlenecks to secure integration endpoints, ensuring you retain customers and secure high-ticket revenue."
                              </p>
                            </div>
                          </div>

                          {/* Dynamic Inspector Learning Popover */}
                          <AnimatePresence mode="wait">
                            {activeInspectorToken && (
                              <motion.div
                                key={activeInspectorToken}
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                className="p-3 rounded-xl border bg-[#0b1c30] text-white text-left space-y-1 mt-2 shadow-md"
                              >
                                <div className="flex items-center justify-between border-b border-neutral-700 pb-1">
                                  <span className="text-[9px] font-black uppercase tracking-wider text-blue-300 flex items-center gap-1">
                                    <Info size={11} className="text-blue-400" />
                                    {activeInspectorToken === 'outcome' && "🎯 Strategic Role: Attracting Client Attention"}
                                    {activeInspectorToken === 'audience' && "⚡ Strategic Role: Increasing Context Relevance"}
                                    {activeInspectorToken === 'mechanism' && "🛡️ Strategic Role: Establishing Diagnostic Credibility"}
                                  </span>
                                  <span className="text-[8px] text-emerald-400 font-black uppercase tracking-wider">
                                    Exploration Insight
                                  </span>
                                </div>
                                <p className="text-[10px] font-medium text-neutral-200 leading-relaxed">
                                  {activeInspectorToken === 'outcome' && "Addresses active revenue leakage. Client CEOs evaluate financial risk in under 1.5 seconds—this headline hooks them instantly by promising a resolved bottleneck."}
                                  {activeInspectorToken === 'audience' && "Filters out low-budget leads while reassuring high-LTV SaaS founders that you specialize exclusively in their business context."}
                                  {activeInspectorToken === 'mechanism' && "Shows HOW you solve the problem. Proves you possess a diagnostic methodology rather than selling raw input hours like a commodity freelancer."}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* 🧠 AI Strategic Reasoning Trace - Unboxing the AI Decision */}
                          <div className={cn("border rounded-xl p-3 space-y-2 text-left shadow-xs transition-all", viewMode === 'blueprint' ? "bg-white/90 border-emerald-200" : "bg-white/10 border-white/20")}>
                            <div className="flex items-center justify-between border-b pb-1.5 border-emerald-100/80">
                              <span className={cn("text-[9px] font-black uppercase tracking-wider flex items-center gap-1", viewMode === 'blueprint' ? "text-emerald-800" : "text-emerald-300")}>
                                <Compass size={12} className={viewMode === 'blueprint' ? "text-emerald-600" : "text-emerald-400"} />
                                🧠 AI Strategic Reasoning Trace
                              </span>
                              <span className={cn("text-[8px] font-bold px-1.5 py-0.5 rounded border", viewMode === 'blueprint' ? "text-emerald-700 bg-emerald-50 border-emerald-100" : "text-emerald-200 bg-emerald-900/40 border-emerald-800")}>
                                Unboxing the AI Model
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[9px]">
                              <div className={cn("p-2 rounded-lg border", viewMode === 'blueprint' ? "bg-emerald-50/60 border-emerald-100" : "bg-white/5 border-white/10")}>
                                <span className={cn("font-black block text-[8px] uppercase tracking-wider", viewMode === 'blueprint' ? "text-emerald-800" : "text-emerald-300")}>1. Business Outcome</span>
                                <p className={cn("font-bold mt-0.5", viewMode === 'blueprint' ? "text-neutral-800" : "text-white")}>Preventing Checkout Revenue Loss</p>
                                <span className={cn("text-[8px] font-semibold leading-tight block mt-0.5", viewMode === 'blueprint' ? "text-neutral-500" : "text-white/60")}>Highest financial urgency for B2B SaaS.</span>
                              </div>

                              <div className={cn("p-2 rounded-lg border", viewMode === 'blueprint' ? "bg-purple-50/60 border-purple-100" : "bg-white/5 border-white/10")}>
                                <span className={cn("font-black block text-[8px] uppercase tracking-wider", viewMode === 'blueprint' ? "text-purple-800" : "text-purple-300")}>2. Target Audience</span>
                                <span className={cn("font-bold mt-0.5 block", viewMode === 'blueprint' ? "text-neutral-800" : "text-white")}>SaaS & Fintech Founders</span>
                                <span className={cn("text-[8px] font-semibold leading-tight block mt-0.5", viewMode === 'blueprint' ? "text-neutral-500" : "text-white/60")}>High LTV customers worth solving.</span>
                              </div>

                              <div className={cn("p-2 rounded-lg border", viewMode === 'blueprint' ? "bg-indigo-50/60 border-indigo-100" : "bg-white/5 border-white/10")}>
                                <span className={cn("font-black block text-[8px] uppercase tracking-wider", viewMode === 'blueprint' ? "text-indigo-800" : "text-indigo-300")}>3. Positioning Angle</span>
                                <span className={cn("font-bold mt-0.5 block", viewMode === 'blueprint' ? "text-neutral-800" : "text-white")}>Diagnostic Specialist</span>
                                <span className={cn("text-[8px] font-semibold leading-tight block mt-0.5", viewMode === 'blueprint' ? "text-neutral-500" : "text-white/60")}>Commands 3x rate over commodity builders.</span>
                              </div>

                              <div className={cn("p-2 rounded-lg border", viewMode === 'blueprint' ? "bg-teal-50/60 border-teal-100" : "bg-white/5 border-white/10")}>
                                <span className={cn("font-black block text-[8px] uppercase tracking-wider", viewMode === 'blueprint' ? "text-teal-800" : "text-teal-300")}>4. Psychology Principle</span>
                                <span className={cn("font-bold mt-0.5 block", viewMode === 'blueprint' ? "text-neutral-800" : "text-white")}>Loss Aversion Effect</span>
                                <span className={cn("text-[8px] font-semibold leading-tight block mt-0.5", viewMode === 'blueprint' ? "text-neutral-500" : "text-white/60")}>Clients act 2.5x faster to stop revenue leaks.</span>
                              </div>
                            </div>
                          </div>

                          {/* 4. Authority Badge - Trailing secondary tag at bottom */}
                          <div className="pt-2 border-t border-emerald-100/60 flex items-center justify-between">
                            <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">4. Identity Tag</span>
                            <span className="text-[8px] font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-widest">
                              🟢 Upgraded Authority Badge
                            </span>
                          </div>
                        </div>

                        <div className={cn("mt-4 pt-3 border-t", viewMode === 'blueprint' ? "border-emerald-100/50" : "border-emerald-900/50")}>
                           <span className={cn("text-[8px] font-black uppercase tracking-widest mb-2 block", viewMode === 'blueprint' ? "text-emerald-600" : "text-emerald-400")}>Client Brain Simulator (Natural Flow)</span>
                           <div className={cn("flex items-center gap-1 w-full rounded-full p-1 border", viewMode === 'blueprint' ? "bg-emerald-50 border-emerald-100" : "bg-emerald-900/20 border-emerald-900/40")}>
                             <div className={cn("flex-1 text-center py-1 rounded-full text-[9px] font-bold flex items-center justify-center gap-1 shadow-sm", viewMode === 'blueprint' ? "bg-emerald-200/50 text-emerald-700" : "bg-emerald-800/40 text-emerald-300")}>
                               <Search size={10} /> 1. Scans Promise
                             </div>
                             <div className={cn("flex-1 text-center py-1 rounded-full text-[9px] font-bold flex items-center justify-center gap-1 shadow-sm", viewMode === 'blueprint' ? "bg-emerald-300/50 text-emerald-800" : "bg-emerald-700/40 text-emerald-200")}>
                               <Target size={10} /> 2. Matches Pain
                             </div>
                             <div className={cn("flex-1 text-center py-1 rounded-full text-[9px] font-black flex items-center justify-center gap-1 shadow-sm", viewMode === 'blueprint' ? "bg-emerald-500 text-white" : "bg-emerald-600 text-white")}>
                               <ShieldCheck size={10} /> 3. Validates Tag
                             </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: FOUNDATIONAL PROOF (Can you do the work?) */}
                  <div
                    onClick={() => setActiveSectionId('foundational')}
                    className={cn(
                      "p-6 rounded-2xl border transition-all relative text-left space-y-4 cursor-pointer",
                      viewMode === 'blueprint'
                        ? (activeSectionId === 'foundational' ? "bg-indigo-50/60 border-indigo-500 shadow-md ring-2 ring-indigo-500/20" : "bg-white border-dashed border-neutral-300 hover:border-neutral-400")
                        : "bg-white border border-neutral-200/80 shadow-sm"
                    )}
                  >
                    {viewMode === 'blueprint' && (
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-widest">
                          2. Primary Proof ➔ "Can you actually do the work?"
                        </span>
                        {activeSectionId === 'foundational' && <Sparkles size={11} className="text-indigo-500" />}
                      </div>
                    )}

                    <div className="space-y-1">
                      <h3 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider">
                        {displayStrategy.portfolioStructure[0]?.sectionName || 'Foundational Proof'}
                      </h3>
                      <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed">
                        {displayStrategy.portfolioStructure[0]?.purpose}
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 mt-4 relative">
                      {/* Weak Proof */}
                      <div className={cn("p-4 rounded-xl border flex flex-col justify-between", viewMode === 'blueprint' ? "bg-red-50/50 border-red-200" : "bg-white/5 border-red-900/30")}>
                        <div>
                          <span className={cn("text-[9px] font-black uppercase tracking-widest block mb-2", viewMode === 'blueprint' ? "text-red-500" : "text-red-400")}>
                            ❌ Generic Commodity
                          </span>
                          <div className="bg-white/50 border border-neutral-200 rounded-lg p-3 text-center mb-2">
                             <Layout size={24} className="mx-auto text-neutral-300 mb-1" />
                             <p className={cn("text-xs font-bold", viewMode === 'blueprint' ? "text-neutral-400" : "text-white/40")}>Project Screenshot</p>
                             <p className={cn("text-[9px]", viewMode === 'blueprint' ? "text-neutral-400" : "text-white/30")}>github.com/ayush/project</p>
                          </div>
                        </div>
                        <div className={cn("mt-4 pt-3 border-t", viewMode === 'blueprint' ? "border-red-100/50" : "border-red-900/50")}>
                           <span className={cn("text-[8px] font-black uppercase tracking-widest mb-2 block", viewMode === 'blueprint' ? "text-red-500" : "text-red-400")}>Client Brain Simulator</span>
                           <div className={cn("flex items-center gap-1 w-full rounded-full p-1 border", viewMode === 'blueprint' ? "bg-red-50 border-red-100" : "bg-red-900/20 border-red-900/40")}>
                             <div className={cn("flex-1 text-center py-1 rounded-full text-[9px] font-bold flex items-center justify-center gap-1 shadow-sm", viewMode === 'blueprint' ? "bg-red-200/50 text-red-700" : "bg-red-800/40 text-red-300")}>
                               <HelpCircle size={10} /> Confused
                             </div>
                             <div className={cn("flex-1 text-center py-1 rounded-full text-[9px] font-black flex items-center justify-center gap-1 shadow-sm", viewMode === 'blueprint' ? "bg-red-500 text-white" : "bg-red-600 text-white")}>
                               <ArrowRight size={10} /> Bounces
                             </div>
                           </div>
                        </div>
                      </div>

                      {/* Bridge Arrow */}
                      <div className={cn("hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full items-center justify-center z-10 border shadow-sm", viewMode === 'blueprint' ? "bg-white border-neutral-200 text-neutral-400" : "bg-[#0b1c30] border-neutral-700 text-neutral-500")}>
                        <ArrowRight size={14} />
                      </div>

                      {/* Strong Proof */}
                      <div className={cn("p-4 rounded-xl border flex flex-col justify-between", viewMode === 'blueprint' ? "bg-indigo-50/50 border-indigo-200" : "bg-white/5 border-indigo-900/30")}>
                        <div>
                          <span className={cn("text-[9px] font-black uppercase tracking-widest block mb-2", viewMode === 'blueprint' ? "text-indigo-600" : "text-indigo-400")}>
                            🟢 Upgraded Authority
                          </span>
                          
                          {/* MOCK VIDEO CASE STUDY PLAYER */}
                          <div className="bg-neutral-900 text-white rounded-xl p-3 sm:p-4 relative overflow-hidden flex flex-col justify-between shadow-inner">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <span className="text-[8px] font-black uppercase bg-blue-600 text-white px-2 py-0.5 rounded">
                                  Diagnostic Demo
                                </span>
                                <h4 className="text-xs font-bold truncate pr-4 mt-1">
                                  {getMappedAssetTitle('foundational', 0)}
                                </h4>
                              </div>
                              <PlayCircle size={24} className="text-blue-500 shrink-0 cursor-pointer hover:scale-105 transition-transform" />
                            </div>

                            <div className="space-y-2 mt-4">
                              <p className="text-[9px] text-neutral-400 font-semibold leading-relaxed line-clamp-1">
                                {getMappedAssetHeadline('foundational', 0)}
                              </p>
                              {/* Playback timeline slider bar */}
                              <div className="flex items-center gap-2 text-[8px] text-neutral-500 font-semibold">
                                <div className="flex-1 bg-neutral-800 h-1 rounded-full overflow-hidden">
                                  <div className="bg-blue-500 h-full w-[40%]" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className={cn("mt-4 pt-3 border-t", viewMode === 'blueprint' ? "border-indigo-100/50" : "border-indigo-900/50")}>
                           <span className={cn("text-[8px] font-black uppercase tracking-widest mb-2 block", viewMode === 'blueprint' ? "text-indigo-600" : "text-indigo-400")}>Client Brain Simulator</span>
                           <div className={cn("flex items-center gap-1 w-full rounded-full p-1 border", viewMode === 'blueprint' ? "bg-indigo-50 border-indigo-100" : "bg-indigo-900/20 border-indigo-900/40")}>
                             <div className={cn("flex-1 text-center py-1 rounded-full text-[9px] font-bold flex items-center justify-center gap-1 shadow-sm", viewMode === 'blueprint' ? "bg-indigo-200/50 text-indigo-700" : "bg-indigo-800/40 text-indigo-300")}>
                               <Play size={10} /> Engaged
                             </div>
                             <div className={cn("flex-1 text-center py-1 rounded-full text-[9px] font-black flex items-center justify-center gap-1 shadow-sm", viewMode === 'blueprint' ? "bg-indigo-500 text-white" : "bg-indigo-600 text-white")}>
                               <ShieldCheck size={10} /> Validates
                             </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: SUPPORTING EVIDENCE (Is it a fluke?) */}
                  <div
                    onClick={() => setActiveSectionId('supporting')}
                    className={cn(
                      "p-6 rounded-2xl border transition-all relative text-left space-y-4 cursor-pointer",
                      viewMode === 'blueprint'
                        ? (activeSectionId === 'supporting' ? "bg-purple-50/60 border-purple-500 shadow-md ring-2 ring-purple-500/20" : "bg-white border-dashed border-neutral-300 hover:border-neutral-400")
                        : "bg-white border border-neutral-200/80 shadow-sm"
                    )}
                  >
                    {viewMode === 'blueprint' && (
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100 uppercase tracking-widest">
                          3. Supporting Evidence ➔ "Is this repeatable?"
                        </span>
                        {activeSectionId === 'supporting' && <Sparkles size={11} className="text-purple-500" />}
                      </div>
                    )}

                    <div className="space-y-1">
                      <h3 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider">
                        {displayStrategy.portfolioStructure[1]?.sectionName || 'Supporting Evidence'}
                      </h3>
                      <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed">
                        {displayStrategy.portfolioStructure[1]?.purpose}
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 mt-4 relative">
                      {/* Weak Supporting */}
                      <div className={cn("p-4 rounded-xl border flex flex-col justify-between", viewMode === 'blueprint' ? "bg-red-50/50 border-red-200" : "bg-white/5 border-red-900/30")}>
                        <div>
                          <span className={cn("text-[9px] font-black uppercase tracking-widest block mb-2", viewMode === 'blueprint' ? "text-red-500" : "text-red-400")}>
                            ❌ Generic Commodity
                          </span>
                          <div className="bg-white/50 border border-neutral-200 rounded-lg p-3 mb-2 italic text-neutral-500 text-xs">
                             "Ayush is a very good developer and communicated well. 5/5 stars."
                             <span className="block mt-2 text-[9px] text-neutral-400 font-bold not-italic">— Upwork Client</span>
                          </div>
                        </div>
                        <div className={cn("mt-4 pt-3 border-t", viewMode === 'blueprint' ? "border-red-100/50" : "border-red-900/50")}>
                           <span className={cn("text-[8px] font-black uppercase tracking-widest mb-2 block", viewMode === 'blueprint' ? "text-red-500" : "text-red-400")}>Client Brain Simulator</span>
                           <div className={cn("flex items-center gap-1 w-full rounded-full p-1 border", viewMode === 'blueprint' ? "bg-red-50 border-red-100" : "bg-red-900/20 border-red-900/40")}>
                             <div className={cn("flex-1 text-center py-1 rounded-full text-[9px] font-bold flex items-center justify-center gap-1 shadow-sm", viewMode === 'blueprint' ? "bg-red-200/50 text-red-700" : "bg-red-800/40 text-red-300")}>
                               <HelpCircle size={10} /> Unsure
                             </div>
                             <div className={cn("flex-1 text-center py-1 rounded-full text-[9px] font-black flex items-center justify-center gap-1 shadow-sm", viewMode === 'blueprint' ? "bg-red-500 text-white" : "bg-red-600 text-white")}>
                               <Target size={10} /> Doubts
                             </div>
                           </div>
                        </div>
                      </div>

                      {/* Bridge Arrow */}
                      <div className={cn("hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full items-center justify-center z-10 border shadow-sm", viewMode === 'blueprint' ? "bg-white border-neutral-200 text-neutral-400" : "bg-[#0b1c30] border-neutral-700 text-neutral-500")}>
                        <ArrowRight size={14} />
                      </div>

                      {/* Strong Supporting */}
                      <div className={cn("p-4 rounded-xl border flex flex-col justify-between", viewMode === 'blueprint' ? "bg-purple-50/50 border-purple-200" : "bg-white/5 border-purple-900/30")}>
                        <div>
                          <span className={cn("text-[9px] font-black uppercase tracking-widest block mb-2", viewMode === 'blueprint' ? "text-purple-600" : "text-purple-400")}>
                            🟢 Upgraded Authority
                          </span>
                          
                          <div className={cn("p-3 rounded-xl border space-y-2 text-left", viewMode === 'blueprint' ? "bg-white border-purple-100/60" : "bg-white/5 border-purple-800/30")}>
                            <div className="flex items-center gap-1.5">
                              <Star size={11} className="text-yellow-500 fill-yellow-500" />
                              <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest">Client Review</span>
                            </div>
                            <p className={cn("text-[10px] font-bold italic leading-relaxed", viewMode === 'blueprint' ? "text-neutral-600" : "text-white/80")}>
                              "Ayush structured checkout audits that resolved our primary latency drops within days."
                            </p>
                            <span className={cn("text-[9px] font-bold block", viewMode === 'blueprint' ? "text-[#0b1c30]" : "text-white/90")}>➔ CTO, SaaS Fintech</span>
                          </div>
                        </div>
                        
                        <div className={cn("mt-4 pt-3 border-t", viewMode === 'blueprint' ? "border-purple-100/50" : "border-purple-900/50")}>
                           <span className={cn("text-[8px] font-black uppercase tracking-widest mb-2 block", viewMode === 'blueprint' ? "text-purple-600" : "text-purple-400")}>Client Brain Simulator</span>
                           <div className={cn("flex items-center gap-1 w-full rounded-full p-1 border", viewMode === 'blueprint' ? "bg-purple-50 border-purple-100" : "bg-purple-900/20 border-purple-900/40")}>
                             <div className={cn("flex-1 text-center py-1 rounded-full text-[9px] font-bold flex items-center justify-center gap-1 shadow-sm", viewMode === 'blueprint' ? "bg-purple-200/50 text-purple-700" : "bg-purple-800/40 text-purple-300")}>
                               <Shield size={10} /> Relieved
                             </div>
                             <div className={cn("flex-1 text-center py-1 rounded-full text-[9px] font-black flex items-center justify-center gap-1 shadow-sm", viewMode === 'blueprint' ? "bg-purple-500 text-white" : "bg-purple-600 text-white")}>
                               <CheckCircle2 size={10} /> Trusts
                             </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: CALL TO ACTION (How to work with you?) */}
                  <div
                    onClick={() => setActiveSectionId('cta')}
                    className={cn(
                      "p-6 rounded-2xl border transition-all relative text-left space-y-4 cursor-pointer",
                      viewMode === 'blueprint'
                        ? (eyeTrackerStep === 4 ? "bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20" : "bg-white border-dashed border-neutral-300 hover:border-neutral-400")
                        : "bg-white border border-neutral-200/80 shadow-sm"
                    )}
                  >
                    {viewMode === 'blueprint' && (
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-widest">
                          4. Trust Lock CTA ➔ "How do I work with you?"
                        </span>
                        {activeSectionId === 'cta' && <Sparkles size={11} className="text-emerald-500" />}
                      </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2 mt-4 relative">
                      {/* Weak CTA */}
                      <div className={cn("p-4 rounded-xl border flex flex-col justify-between", viewMode === 'blueprint' ? "bg-red-50/50 border-red-200" : "bg-white/5 border-red-900/30")}>
                        <div>
                          <span className={cn("text-[9px] font-black uppercase tracking-widest block mb-2", viewMode === 'blueprint' ? "text-red-500" : "text-red-400")}>
                            ❌ Generic Commodity
                          </span>
                          <div className="bg-white/50 border border-neutral-200 rounded-lg p-3 mb-2 flex items-center justify-between">
                            <span className="text-xs font-bold text-neutral-400">Contact Me</span>
                            <div className="px-3 py-1 bg-neutral-200 rounded text-[9px] font-bold text-neutral-500">Send</div>
                          </div>
                        </div>
                        <div className={cn("mt-4 pt-3 border-t", viewMode === 'blueprint' ? "border-red-100/50" : "border-red-900/50")}>
                           <span className={cn("text-[8px] font-black uppercase tracking-widest mb-2 block", viewMode === 'blueprint' ? "text-red-500" : "text-red-400")}>Client Brain Simulator</span>
                           <div className={cn("flex items-center gap-1 w-full rounded-full p-1 border", viewMode === 'blueprint' ? "bg-red-50 border-red-100" : "bg-red-900/20 border-red-900/40")}>
                             <div className={cn("flex-1 text-center py-1 rounded-full text-[9px] font-bold flex items-center justify-center gap-1 shadow-sm", viewMode === 'blueprint' ? "bg-red-200/50 text-red-700" : "bg-red-800/40 text-red-300")}>
                               <AlertCircle size={10} /> High Friction
                             </div>
                             <div className={cn("flex-1 text-center py-1 rounded-full text-[9px] font-black flex items-center justify-center gap-1 shadow-sm", viewMode === 'blueprint' ? "bg-red-500 text-white" : "bg-red-600 text-white")}>
                               <Target size={10} /> Procrastinates
                             </div>
                           </div>
                        </div>
                      </div>

                      {/* Bridge Arrow */}
                      <div className={cn("hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full items-center justify-center z-10 border shadow-sm", viewMode === 'blueprint' ? "bg-white border-neutral-200 text-neutral-400" : "bg-[#0b1c30] border-neutral-700 text-neutral-500")}>
                        <ArrowRight size={14} />
                      </div>

                      {/* Strong CTA */}
                      <div className={cn("p-4 rounded-xl border flex flex-col justify-between", viewMode === 'blueprint' ? "bg-emerald-50/50 border-emerald-200" : "bg-white/5 border-emerald-900/30")}>
                        <div>
                          <span className={cn("text-[9px] font-black uppercase tracking-widest block mb-2", viewMode === 'blueprint' ? "text-emerald-600" : "text-emerald-400")}>
                            🟢 Upgraded Authority
                          </span>
                          
                          <div className={cn("p-3 rounded-xl border flex flex-col gap-3", viewMode === 'blueprint' ? "bg-[#f8f9ff] border-blue-100" : "bg-blue-900/20 border-blue-800/50")}>
                            <div className="flex items-start gap-2">
                              <div className="w-7 h-7 rounded bg-blue-500/10 flex items-center justify-center text-[#0058be] shrink-0 mt-0.5">
                                <Calendar size={14} />
                              </div>
                              <div>
                                <h4 className={cn("text-[11px] font-black", viewMode === 'blueprint' ? "text-[#0b1c30]" : "text-white")}>Schedule 15-Min Audit</h4>
                                <p className={cn("text-[9px] font-semibold mt-0.5", viewMode === 'blueprint' ? "text-neutral-500" : "text-neutral-400")}>Map out your drop bottleneck.</p>
                              </div>
                            </div>
                            <button className="bg-blue-600 text-white font-bold text-[10px] py-1.5 px-3 rounded-lg shadow-sm border-none w-full text-center">
                              Book Diagnostic
                            </button>
                          </div>
                        </div>
                        
                        <div className={cn("mt-4 pt-3 border-t", viewMode === 'blueprint' ? "border-emerald-100/50" : "border-emerald-900/50")}>
                           <span className={cn("text-[8px] font-black uppercase tracking-widest mb-2 block", viewMode === 'blueprint' ? "text-emerald-600" : "text-emerald-400")}>Client Brain Simulator</span>
                           <div className={cn("flex items-center gap-1 w-full rounded-full p-1 border", viewMode === 'blueprint' ? "bg-emerald-50 border-emerald-100" : "bg-emerald-900/20 border-emerald-900/40")}>
                             <div className={cn("flex-1 text-center py-1 rounded-full text-[9px] font-bold flex items-center justify-center gap-1 shadow-sm", viewMode === 'blueprint' ? "bg-emerald-200/50 text-emerald-700" : "bg-emerald-800/40 text-emerald-300")}>
                               <Zap size={10} /> Low Friction
                             </div>
                             <div className={cn("flex-1 text-center py-1 rounded-full text-[9px] font-black flex items-center justify-center gap-1 shadow-sm", viewMode === 'blueprint' ? "bg-emerald-500 text-white" : "bg-emerald-600 text-white")}>
                               <CalendarCheck size={10} /> Books Call
                             </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* Live Examples list */}
          {viewMode === 'examples' && (
            <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-sm space-y-6">
              
              <div className="space-y-1.5 border-b border-neutral-100 pb-3">
                <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 uppercase tracking-widest">
                  Freelancer Case Study Analysis
                </span>
                <h3 className="text-base font-black text-[#0b1c30]">
                  {currentExample.tier}
                </h3>
              </div>

              {/* Visual mock of their headline */}
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

              {/* Critique Analysis columns */}
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

              {/* take-away */}
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl text-xs font-bold text-[#0058be] leading-relaxed flex items-start gap-2">
                <Info size={14} className="shrink-0 mt-0.5" />
                <span>{currentExample.lesson}</span>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Visual Process Summary */}
      <div className="max-w-3xl mx-auto bg-neutral-50/50 border border-neutral-200/80 rounded-2xl p-4 flex items-center justify-between text-[9px] sm:text-[10px] font-black text-neutral-400 uppercase tracking-widest">
        <div className="flex items-center gap-1.5 text-emerald-600">
          <CheckCircle2 size={13} />
          <span>Archetype Set</span>
        </div>
        <span className="text-neutral-300">➔</span>
        <div className="flex items-center gap-1.5 text-emerald-600">
          <CheckCircle2 size={13} />
          <span>Proof Verified</span>
        </div>
        <span className="text-neutral-300">➔</span>
        <div className="flex items-center gap-1.5 text-emerald-600">
          <CheckCircle2 size={13} />
          <span>Layout Structured</span>
        </div>
        <span className="text-neutral-300">➔</span>
        <div className="flex items-center gap-1.5 text-[#0058be]">
          <Shield size={13} />
          <span>Ready for Pack</span>
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
