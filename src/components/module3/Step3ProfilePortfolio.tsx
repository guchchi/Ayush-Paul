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
      
      {/* Top Visual Journey */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-3 text-[9px] sm:text-[10px] font-black text-neutral-400 uppercase tracking-widest bg-white border border-neutral-200/80 rounded-2xl py-3 px-4 sm:px-6 shadow-sm max-w-lg mx-auto">
        <span className="flex items-center gap-1"><User size={11}/> Authority</span>
        <span className="text-neutral-300">➔</span>
        <span className="flex items-center gap-1"><Briefcase size={11}/> Proof</span>
        <span className="text-neutral-300">➔</span>
        <span className="flex items-center gap-1 text-[#0058be] bg-blue-50 px-2 py-0.5 rounded border border-blue-100"><Layers size={11}/> 🌟 Portfolio</span>
        <span className="text-neutral-300">➔</span>
        <span className="flex items-center gap-1"><Zap size={11}/> Clients</span>
      </div>

      {/* Hero Header Section */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-[#0b1c30] tracking-tight">Organize Your Authority Story</h2>
        <p className="text-xs sm:text-sm text-neutral-500 font-semibold leading-relaxed">
          Arrange your authority hook and proof assets into a client-ready sequence.
        </p>
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
                  <p className="text-neutral-600 font-medium leading-relaxed">
                    {activeSectionId === 'hero' && "Answers: 'What problem do you solve for me?' Immediately filters target buyers and establishes positioning hook."}
                    {activeSectionId === 'foundational' && "Answers: 'Can you actually deliver?' Demonstrates your unique mechanism in action using a video or text case study."}
                    {activeSectionId === 'supporting' && "Answers: 'Is this a repeatable skill or a fluke?' Neutralizes remaining trust gaps through third-party metrics."}
                    {activeSectionId === 'cta' && "Answers: 'How do I start?' Lowers conversion friction by offering a low-commitment diagnostic audit call."}
                  </p>
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
                  
                  {/* Notion/Website Style Profile Header banner */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-neutral-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0b1c30] text-white flex items-center justify-center font-black text-sm border border-neutral-200">
                        {authorityPosition.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-black text-[#0b1c30]">Ayush Paul</span>
                          <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-widest">
                            {authorityPosition} Strategy
                          </span>
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mt-0.5">Specialist Consultant</p>
                      </div>
                    </div>
                    <div className="text-[10px] text-neutral-400 font-bold bg-white border border-neutral-100 rounded-xl px-3 py-1.5 shadow-sm">
                      Target Objections: <span className="font-extrabold text-blue-600">Neutralized</span>
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

                    <div className="space-y-1.5">
                      <span className={cn("text-[9px] font-black uppercase tracking-widest block", viewMode === 'blueprint' ? "text-neutral-400" : "text-blue-400")}>
                        Positioning Promise
                      </span>
                      <h2 className="text-sm sm:text-base font-black leading-snug">
                        {useModule3Store.getState().coreTrustPromise || 'Preventing customer checkout drops for SaaS platforms'}
                      </h2>
                      <p className={cn("text-xs leading-relaxed font-semibold", viewMode === 'blueprint' ? "text-neutral-500" : "text-white/70")}>
                        Analyzing checkout bottlenecks to secure integration endpoints, ensuring you retain customers and secure high-ticket revenue.
                      </p>
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

                    {/* MOCK VIDEO CASE STUDY PLAYER */}
                    <div className="bg-neutral-900 text-white rounded-xl p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between min-h-[140px] shadow-inner">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <span className="text-[8px] font-black uppercase bg-blue-600 text-white px-2 py-0.5 rounded">
                            Video Walkthrough Demo
                          </span>
                          <h4 className="text-xs font-bold truncate pr-6 mt-1">
                            {getMappedAssetTitle('foundational', 0)}
                          </h4>
                        </div>
                        <PlayCircle size={28} className="text-blue-500 shrink-0 cursor-pointer hover:scale-105 transition-transform" />
                      </div>

                      <div className="space-y-2 mt-4">
                        <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed">
                          {getMappedAssetHeadline('foundational', 0)}
                        </p>
                        {/* Playback timeline slider bar */}
                        <div className="flex items-center gap-2 text-[8px] text-neutral-500 font-semibold">
                          <span>00:00</span>
                          <div className="flex-1 bg-neutral-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full w-[40%]" />
                          </div>
                          <span>08:42</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center justify-between text-[9px] font-black text-neutral-400 border-t border-neutral-100 pt-3">
                      <span>STATUS</span>
                      <span className={cn(
                        "uppercase tracking-widest px-2 py-0.5 rounded-md border",
                        isAssetReady('foundational', 0) ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-neutral-50 text-neutral-500 border-neutral-200"
                      )}>
                        {isAssetReady('foundational', 0) ? 'Ready to Publish' : 'Drafting In Progress'}
                      </span>
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

                    {/* TWO REALISTIC CARDS: Metric Box & Mock Testimonial */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Card A: Case study detail */}
                      <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/60 space-y-2 text-left">
                        <div className="flex items-center gap-1.5">
                          <Star size={11} className="text-yellow-500 fill-yellow-500" />
                          <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest">Methodology verified</span>
                        </div>
                        <h4 className="text-xs font-bold text-[#0b1c30] truncate">
                          {getMappedAssetTitle('supporting', 0)}
                        </h4>
                        <p className="text-[9px] text-neutral-500 font-semibold leading-relaxed line-clamp-2">
                          {getMappedAssetHeadline('supporting', 0)}
                        </p>
                      </div>

                      {/* Card B: Client review quote */}
                      <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/60 space-y-2 text-left">
                        <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">Client Feedback Review</span>
                        <p className="text-[10px] text-neutral-600 font-bold italic leading-relaxed">
                          "Ayush structured checkout audits that resolved our primary latency drops within days."
                        </p>
                        <span className="text-[9px] font-bold text-[#0b1c30] block">➔ CTO, SaaS Fintech</span>
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

                    {/* Calendar Booking Mockup */}
                    <div className="bg-[#f8f9ff] border border-blue-100 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-[#0058be] shrink-0">
                          <Calendar size={18} />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-[#0b1c30]">Schedule a 15-Minute Checkout Audit</h4>
                          <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">Let's map out your primary drop bottleneck.</p>
                        </div>
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-sm transition-all cursor-pointer border-none flex items-center gap-1">
                        Book Diagnostic
                        <ArrowUpRight size={12} />
                      </button>
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
