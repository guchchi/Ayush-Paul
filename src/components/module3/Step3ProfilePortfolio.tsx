import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText, Navigation, Layout, Search, AlignLeft, ShieldCheck, PlayCircle,
  Target, MessageSquare, Award, Compass, Layers, Sparkles, ArrowLeft, ArrowRight,
  Edit2, RotateCw, RotateCcw, Check, Eye, EyeOff, ExternalLink, Shield, Info, AlertCircle,
  CheckCircle2, Circle, HelpCircle, User, Briefcase, Zap, HelpCircle as QuestionIcon,
  ChevronRight, CalendarCheck, FileSpreadsheet, Lock
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
  const [draggedAssetId, setDraggedAssetId] = useState<string | null>(null);
  const [selectedAssetForClickSwap, setSelectedAssetForClickSwap] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ sectionId: string; text: string } | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(true); // Collapsed by default for clean canvas view

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

  // Drag and Drop implementation
  const handleDragStart = (e: React.DragEvent, assetId: string) => {
    e.dataTransfer.setData('text/plain', assetId);
    setDraggedAssetId(assetId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    const assetId = e.dataTransfer.getData('text/plain') || draggedAssetId;
    if (assetId) {
      placeAsset(assetId, sectionId);
    }
    setDraggedAssetId(null);
  };

  const placeAsset = (assetId: string, sectionId: string) => {
    if (!displayStrategy) return;
    
    // Find section
    const sectionIndex = displayStrategy.portfolioStructure.findIndex(s => s.sectionId === sectionId);
    if (sectionIndex === -1) return;

    const currentSection = displayStrategy.portfolioStructure[sectionIndex];
    // Avoid duplicates
    if (currentSection.proofAssetIds.includes(assetId)) return;

    // Remove from other sections
    const updatedSections = displayStrategy.portfolioStructure.map(sec => {
      if (sec.sectionId === sectionId) {
        return {
          ...sec,
          proofAssetIds: [...sec.proofAssetIds, assetId]
        };
      } else {
        return {
          ...sec,
          proofAssetIds: sec.proofAssetIds.filter(id => id !== assetId)
        };
      }
    });

    // Update in store
    updatePortfolioStructureSection(sectionId, { proofAssetIds: updatedSections.find(s => s.sectionId === sectionId)?.proofAssetIds || [] });
    
    // Update the other sections to clear the asset
    const otherSection = updatedSections.find(s => s.sectionId !== sectionId);
    if (otherSection) {
      updatePortfolioStructureSection(otherSection.sectionId, { proofAssetIds: otherSection.proofAssetIds });
    }

    // Trigger educational feedback based on the dropped asset type
    const assetObj = proofAssets.find(a => a.id === assetId);
    let explanation = "Asset placed successfully.";
    if (sectionId === 'foundational') {
      explanation = `🎯 Primary Proof: Validates your core positioning mechanism to answer: "Can you actually solve my main bottleneck?"`;
    } else if (sectionId === 'supporting') {
      explanation = `🛡️ Supporting Proof: Confirms scope depth and repeatability so the client knows this is not a one-time fluke.`;
    }

    setFeedbackMessage({ sectionId, text: explanation });
    setTimeout(() => setFeedbackMessage(null), 5000);
    setSelectedAssetForClickSwap(null);
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

  if (!displayStrategy) {
    return (
      <div className="space-y-6 text-left">
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-800 rounded-full animate-spin" />
          <p className="text-sm text-neutral-500 font-semibold">Generating strategy...</p>
        </div>
      </div>
    );
  }

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
          {/* Sidebar Toggle for Draggable Assets */}
          {viewMode === 'blueprint' && (
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={cn(
                "flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider border px-3 py-1.5 rounded-xl transition-all cursor-pointer",
                isSidebarCollapsed 
                  ? "bg-white hover:bg-neutral-50 text-neutral-600 border-neutral-200" 
                  : "bg-blue-50 text-[#0058be] border-blue-200"
              )}
            >
              <Briefcase size={12} />
              {isSidebarCollapsed ? 'Show Assets Shelf' : 'Hide Assets Shelf'}
            </button>
          )}

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
      <div className="space-y-6">
        
        {/* HORIZONTAL ASSET DRAWER / SHELF (If not collapsed) */}
        <AnimatePresence>
          {viewMode === 'blueprint' && !isSidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-sm space-y-3 overflow-hidden text-left"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <span className="text-[10px] font-black text-[#0b1c30] uppercase tracking-wider">Available Proof Assets</span>
                <span className="text-[9px] text-neutral-400 font-bold uppercase">Drag into target zones or click to place</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {proofAssets.map((asset) => {
                  const isSelected = selectedAssetForClickSwap === asset.id;
                  const isReady = availableAssets.includes(asset.id);
                  return (
                    <div
                      key={asset.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, asset.id)}
                      onClick={() => setSelectedAssetForClickSwap(isSelected ? null : asset.id)}
                      className={cn(
                        "p-3 rounded-xl border transition-all cursor-grab active:cursor-grabbing text-left space-y-1.5 select-none relative group",
                        isSelected
                          ? "border-blue-500 bg-blue-50/50 shadow-sm"
                          : "border-neutral-200 hover:border-neutral-300 bg-white"
                      )}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-xs font-bold text-[#0b1c30] truncate">{asset.title}</span>
                        <span className={cn(
                          "text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border",
                          isReady ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-neutral-50 text-neutral-500 border-neutral-200"
                        )}>
                          {isReady ? 'Ready' : 'In Progress'}
                        </span>
                      </div>
                      <p className="text-[9px] text-neutral-400 font-semibold truncate">
                        {asset.assetType.replace(/_/g, ' ')}
                      </p>
                    </div>
                  );
                })}
              </div>
              {selectedAssetForClickSwap && (
                <div className="bg-blue-50 border border-blue-200/60 rounded-xl p-3 text-[10px] font-bold text-[#0058be] animate-pulse">
                  Now click on a target section in the blueprint mockup to place this asset.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* MOCKUP CONTAINER */}
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          
          {/* LEFT: Buyer Psychology Gaze States */}
          {viewMode === 'blueprint' && (
            <div className="lg:col-span-3 bg-white border border-neutral-200/80 rounded-3xl p-5 shadow-sm space-y-4 text-left">
              <div className="flex items-center gap-1.5 border-b border-[#f1f5f9] pb-2.5">
                <Target size={14} className="text-[#0058be]" />
                <span className="text-[10px] font-black text-[#0b1c30] uppercase tracking-wider">Buyer Psychology Path</span>
              </div>
              
              {/* Vertical timeline of stages */}
              <div className="space-y-4">
                {buyerStages.map((stage, idx) => {
                  const isActive = idx === activeStageIndex;
                  const isCompletedStage = idx < activeStageIndex;
                  return (
                    <div 
                      key={stage.id} 
                      className={cn(
                        "p-3.5 rounded-2xl border transition-all duration-300 text-left space-y-1 relative",
                        isActive 
                          ? "border-[#0058be] bg-blue-50/50 shadow-sm" 
                          : isCompletedStage 
                            ? "border-emerald-200 bg-emerald-50/[0.15]" 
                            : "border-neutral-100 bg-neutral-50/50 opacity-60"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-[#0b1c30]">{stage.label}</span>
                        {isCompletedStage && <CheckCircle2 size={12} className="text-emerald-500" />}
                      </div>
                      <p className="text-[9px] text-neutral-500 font-semibold leading-relaxed mt-0.5">{stage.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MAIN PREVIEW CANVAS */}
          <div className={cn("w-full transition-all duration-300", viewMode === 'blueprint' ? "lg:col-span-9" : "lg:col-span-12")}>
            
            {/* Blueprint Mode / Client Preview */}
            {(viewMode === 'blueprint' || viewMode === 'preview') && (
              <div className="space-y-4">
                
                {/* Safari Browser Canvas Wrapper */}
                <div className="border border-neutral-200 rounded-3xl bg-white shadow-lg overflow-hidden flex flex-col relative max-w-full">
                  
                  {/* Safari header */}
                  <div className="bg-[#f8f9ff]/80 border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400 block shrink-0" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 block shrink-0" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-400 block shrink-0" />
                    </div>
                    
                    {/* Visual Eye tracker path details */}
                    <div className="bg-neutral-100 border border-neutral-200/60 text-[9px] font-semibold text-neutral-400 py-1 px-8 rounded-lg max-w-xs w-full text-center truncate select-none">
                      {viewMode === 'blueprint' ? 'authority-story-blueprint' : 'client-gaze-preview'}
                    </div>
                    <div className="w-12 shrink-0" />
                  </div>

                  {/* Looping Eye tracker visual overlay */}
                  {viewMode === 'blueprint' && isEyeTrackerPlaying && (
                    <div 
                      className="absolute z-30 bg-[#0b1c30] text-white font-bold text-[9px] sm:text-[10px] py-1.5 px-3 rounded-xl shadow-md border border-neutral-700 flex items-center gap-1.5 transition-all duration-500"
                      style={{
                        top: eyeTrackerStep === 1 ? '160px' : eyeTrackerStep === 2 ? '300px' : eyeTrackerStep === 3 ? '440px' : '580px',
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

                  {/* Browser Content - RENDER AS A REAL PORTFOLIO PAGE */}
                  <div className="p-4 sm:p-8 space-y-6 bg-neutral-50/50 min-h-[500px] text-left">
                    
                    {/* Realistic Profile Header (LinkedIn/Notion Layout style) */}
                    <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center text-[#0058be] font-black text-sm sm:text-base border border-blue-200">
                          {authorityPosition.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-black text-[#0b1c30]">Ayush Paul</span>
                            <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-widest">
                              {authorityPosition} Archetype
                            </span>
                          </div>
                          <p className="text-[10px] sm:text-xs text-neutral-400 font-semibold">Specialist Consultant & Developer</p>
                        </div>
                      </div>

                      <div className="text-[10px] text-neutral-400 font-semibold bg-neutral-50 border border-neutral-100 rounded-xl px-3 py-1.5 max-w-xs">
                        Platform: <span className="font-bold text-[#0b1c30]">LinkedIn & Custom Portfolio</span>
                      </div>
                    </div>

                    {/* SECTION 1: HERO PROPOSITION DROPZONE */}
                    <div
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, 'hero')}
                      onClick={() => selectedAssetForClickSwap && placeAsset(selectedAssetForClickSwap, 'hero')}
                      className={cn(
                        "p-5 sm:p-6 rounded-2xl border transition-all relative space-y-3",
                        viewMode === 'blueprint'
                          ? (eyeTrackerStep === 1 ? "bg-blue-50/60 border-blue-500 shadow-md ring-2 ring-blue-500/20" : "bg-white border-dashed border-neutral-300 hover:border-neutral-400")
                          : "bg-[#0b1c30] text-white border-transparent shadow-sm"
                      )}
                    >
                      {viewMode === 'blueprint' && (
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-widest">
                            1. Authority hook (Client Lands)
                          </span>
                          {eyeTrackerStep === 1 && <span className="animate-ping w-2 h-2 rounded-full bg-blue-500" />}
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <span className={cn("text-[9px] font-black uppercase tracking-widest block", viewMode === 'blueprint' ? "text-neutral-400" : "text-blue-400")}>
                          Value Proposition
                        </span>
                        <h2 className="text-sm sm:text-base font-black leading-snug">
                          {useModule3Store.getState().coreTrustPromise || 'Preventing customer checkout drops for SaaS platforms'}
                        </h2>
                        <p className={cn("text-xs leading-relaxed", viewMode === 'blueprint' ? "text-neutral-500" : "text-white/70")}>
                          We analyze checkout bottlenecks to secure integration endpoints, ensuring you retain customers and secure high-ticket revenue.
                        </p>
                      </div>
                    </div>

                    {/* SECTION 2: FOUNDATIONAL PROOF DROPZONE */}
                    <div
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, 'foundational')}
                      onClick={() => selectedAssetForClickSwap && placeAsset(selectedAssetForClickSwap, 'foundational')}
                      className={cn(
                        "p-5 sm:p-6 rounded-2xl border transition-all relative space-y-4",
                        viewMode === 'blueprint'
                          ? (eyeTrackerStep === 2 ? "bg-indigo-50/60 border-indigo-500 shadow-md ring-2 ring-indigo-500/20" : "bg-white border-dashed border-neutral-300 hover:border-neutral-400")
                          : "bg-white border border-neutral-200/80 shadow-sm"
                      )}
                    >
                      {viewMode === 'blueprint' && (
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-widest">
                            2. Foundational Proof (Primary Objections)
                          </span>
                          {eyeTrackerStep === 2 && <span className="animate-ping w-2 h-2 rounded-full bg-indigo-500" />}
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

                      {/* Mapped Assets */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        {displayStrategy.portfolioStructure[0]?.proofAssetIds.map(assetId => {
                          const asset = proofAssets.find(a => a.id === assetId);
                          return (
                            <div key={assetId} className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/60 space-y-2">
                              <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest block">Primary Case Study</span>
                              <span className="text-xs font-bold text-[#0b1c30] block">{asset?.title || assetId}</span>
                              <p className="text-[10px] text-neutral-500 font-semibold leading-relaxed truncate">
                                {asset?.portfolioCopy?.headline || 'Detailed walkthrough and process validation.'}
                              </p>
                            </div>
                          );
                        })}
                        {displayStrategy.portfolioStructure[0]?.proofAssetIds.length === 0 && (
                          <div className="sm:col-span-2 border border-dashed border-neutral-200 bg-neutral-50/50 py-8 text-center text-xs font-bold text-neutral-400 rounded-xl">
                            Drop Primary Case Study here or click to swap
                          </div>
                        )}
                      </div>

                      {/* Feedback popover inside section */}
                      {feedbackMessage && feedbackMessage.sectionId === 'foundational' && (
                        <div className="bg-indigo-500 text-white font-bold text-[9px] p-2.5 rounded-xl shadow-md absolute bottom-3 right-3 animate-fade-in z-20">
                          {feedbackMessage.text}
                        </div>
                      )}
                    </div>

                    {/* SECTION 3: SUPPORTING EVIDENCE DROPZONE */}
                    <div
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, 'supporting')}
                      onClick={() => selectedAssetForClickSwap && placeAsset(selectedAssetForClickSwap, 'supporting')}
                      className={cn(
                        "p-5 sm:p-6 rounded-2xl border transition-all relative space-y-4",
                        viewMode === 'blueprint'
                          ? (eyeTrackerStep === 3 ? "bg-purple-50/60 border-purple-500 shadow-md ring-2 ring-purple-500/20" : "bg-white border-dashed border-neutral-300 hover:border-neutral-400")
                          : "bg-white border border-neutral-200/80 shadow-sm"
                      )}
                    >
                      {viewMode === 'blueprint' && (
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100 uppercase tracking-widest">
                            3. Supporting Validation (Repeatability)
                          </span>
                          {eyeTrackerStep === 3 && <span className="animate-ping w-2 h-2 rounded-full bg-purple-500" />}
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

                      {/* Mapped Assets */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        {displayStrategy.portfolioStructure[1]?.proofAssetIds.map(assetId => {
                          const asset = proofAssets.find(a => a.id === assetId);
                          return (
                            <div key={assetId} className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/60 space-y-2">
                              <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest block">Secondary Evidence</span>
                              <span className="text-xs font-bold text-[#0b1c30] block">{asset?.title || assetId}</span>
                              <p className="text-[10px] text-neutral-500 font-semibold leading-relaxed truncate">
                                {asset?.portfolioCopy?.headline || 'Supporting statistics or testimonials.'}
                              </p>
                            </div>
                          );
                        })}
                        {displayStrategy.portfolioStructure[1]?.proofAssetIds.length === 0 && (
                          <div className="sm:col-span-2 border border-dashed border-neutral-200 bg-neutral-50/50 py-8 text-center text-xs font-bold text-neutral-400 rounded-xl">
                            Drop Supporting Evidence here or click to swap
                          </div>
                        )}
                      </div>

                      {/* Feedback popover inside section */}
                      {feedbackMessage && feedbackMessage.sectionId === 'supporting' && (
                        <div className="bg-purple-500 text-white font-bold text-[9px] p-2.5 rounded-xl shadow-md absolute bottom-3 right-3 animate-fade-in z-20">
                          {feedbackMessage.text}
                        </div>
                      )}
                    </div>

                    {/* SECTION 4: CALL TO ACTION BUTTON WIREFRAME */}
                    <div
                      className={cn(
                        "p-4 rounded-xl border text-center transition-all relative",
                        viewMode === 'blueprint'
                          ? (eyeTrackerStep === 4 ? "bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20" : "bg-white border-dashed border-neutral-300")
                          : "bg-blue-600 text-white border-transparent font-bold cursor-pointer hover:bg-blue-700 shadow-sm"
                      )}
                    >
                      {viewMode === 'blueprint' && (
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-widest">
                            4. Trust Lock & Conversion
                          </span>
                          {eyeTrackerStep === 4 && <span className="animate-ping w-2 h-2 rounded-full bg-emerald-500" />}
                        </div>
                      )}
                      <span className="text-xs font-black uppercase tracking-wider">Book Strategy Audit</span>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* 2. LIVE EXAMPLES MODE (Freelancer Tiers Critique) */}
            {viewMode === 'examples' && (
              <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-sm space-y-6">
                
                <div className="space-y-1.5 border-b border-neutral-100 pb-3">
                  <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 uppercase tracking-widest">
                    Freelancer Case Study
                  </span>
                  <h3 className="text-base font-black text-[#0b1c30]">
                    {currentExample.tier}
                  </h3>
                </div>

                {/* Headline preview */}
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

                {/* Critique columns */}
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

                {/* Lesson */}
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl text-xs font-bold text-[#0058be] leading-relaxed flex items-start gap-2">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  <span>{currentExample.lesson}</span>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Visual Summary Completion Banner */}
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
