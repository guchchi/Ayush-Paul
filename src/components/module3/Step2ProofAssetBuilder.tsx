import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, ShieldCheck, AlertTriangle, FileText, CheckCircle2,
  ChevronDown, ChevronUp, Activity, Sparkles, Target, Zap, Layout, Layers,
  ArrowLeft, Check
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';
import { useModule3Store } from '../../lib/module3';
import { StepHeader } from '../workspace/StepHeader';
import { StepActionArea } from '../workspace/StepActionArea';
import { ModuleButton } from '../workspace/ModuleButton';

function EducationalDrawer({ title, content, id }: { title: string; content: React.ReactNode; id?: string }) {
  const [open, setOpen] = useState(false);
  const contentId = id || Math.random().toString(36).substring(7);
  return (
    <div className="mt-4 pt-4 border-t border-neutral-100">
      <button 
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-neutral-700 transition-colors cursor-pointer min-h-[44px] rounded-md px-2 -ml-2 focus-visible:ring-2 focus-visible:ring-[#0058be] focus-visible:ring-offset-2 outline-none"
      >
        <span className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
          {open ? <ChevronUp size={12} aria-hidden="true" /> : <ChevronDown size={12} aria-hidden="true" />}
        </span>
        {title}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {typeof content === 'string' ? (
              <p className="text-xs text-neutral-500 mt-2 leading-relaxed pl-7">{content}</p>
            ) : (
              <div className="mt-2 pl-7">{content}</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Step2ProofAssetBuilder() {
  const authorityProfile = useModule3Store((s) => s.authorityProfile);
  const mod2OfferType = useModule3Store((s) => s.mod2OfferType);
  const mod1MarketId = useModule3Store((s) => s.mod1MarketId);
  
  const existingProofInventory = useModule3Store((s) => s.existingProofInventory);
  const setExistingProofInventory = useModule3Store((s) => s.setExistingProofInventory);
  
  const pendingStrategy = useModule3Store((s) => s.pendingProofAssetStrategy);
  const approvedStrategy = useModule3Store((s) => s.proofAssetStrategy);
  
  const generateProofAssetStrategy = useModule3Store((s) => s.generateProofAssetStrategy);
  const selectExecutionPriority = useModule3Store((s) => s.selectExecutionPriority);
  const approveProofAssetStrategy = useModule3Store((s) => s.approveProofAssetStrategy);
  
  const confirmStep = useModule3Store((s) => s.confirmStep);
  const nextStep = useModule3Store((s) => s.nextStep);
  const previousStep = useModule3Store((s) => s.previousStep);
  const completedSteps = useModule3Store((s) => s.completedSteps);
  const isUpstreamStale = useModule3Store((s) => s.isUpstreamStale);

  const isCompleted = completedSteps.includes('proof_asset_builder');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePriority, setActivePriority] = useState<string | null>(null);
  
  // Tabs: 'assessment' | 'assets' | 'execution'
  const [activeTab, setActiveTab] = useState<'assessment' | 'assets' | 'execution'>('assessment');
  
  const isStale = approvedStrategy && authorityProfile && approvedStrategy.authorityProfileVersion !== authorityProfile.version;
  const currentStrategy = pendingStrategy || approvedStrategy;

  useEffect(() => {
    if (pendingStrategy?.selectedExecutionPriority) {
      setActivePriority(pendingStrategy.selectedExecutionPriority);
    }
  }, [pendingStrategy]);
  
  // Reset tab when context changes or generating new
  useEffect(() => {
    if (!currentStrategy || isStale) {
      setActiveTab('assessment');
    }
  }, [currentStrategy, isStale]);

  const handleGenerate = () => {
    if (!authorityProfile || !mod2OfferType || !mod1MarketId || isGenerating) return;
    setIsGenerating(true);
    
    // Simulate thinking states
    setTimeout(() => {
      generateProofAssetStrategy();
      setIsGenerating(false);
      setActiveTab('assessment');
    }, 1500);
  };

  const handlePrioritySelect = (priority: 'immediate' | 'short_term' | 'long_term') => {
    setActivePriority(priority);
    selectExecutionPriority(priority);
  };

  const handleApprove = () => {
    if (pendingStrategy && activePriority) {
      approveProofAssetStrategy();
      confirmStep();
      nextStep();
    }
  };

  const handleNext = () => {
    if (isCompleted && !pendingStrategy) {
      nextStep();
    } else {
      handleApprove();
    }
  };

  if (!authorityProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-neutral-200 bg-neutral-50/50 border-dashed">
        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
          <Layout className="w-5 h-5 text-neutral-400" aria-hidden="true" />
        </div>
        <h3 className="text-sm font-bold text-[#0b1c30]">Missing Authority Profile</h3>
        <p className="text-sm text-neutral-500 max-w-sm mt-1 mb-6">An approved Authority Profile is required before generating a Proof Asset Strategy.</p>
        <ModuleButton variant="secondary" onClick={previousStep}>
          <ArrowLeft size={16} aria-hidden="true" /> Go Back to Step 1
        </ModuleButton>
      </div>
    );
  }
  
  if (!mod2OfferType || !mod1MarketId) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-neutral-200 bg-neutral-50/50 border-dashed">
        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />
        </div>
        <h3 className="text-sm font-bold text-[#0b1c30]">Missing Required Context</h3>
        <p className="text-sm text-neutral-500 max-w-sm mt-1 mb-6">Offer and Market context are required to recommend relevant evidence. Please ensure previous modules are complete.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
      className="space-y-8 pb-24 max-w-4xl mx-auto"
    >
      <StepHeader 
        step={{ current: 2, total: 4 }}
        title="Proof Asset Builder" 
        description="Bridge the gap between your claimed capability and client trust by defining exactly what evidence makes your positioning believable."
      />
      
      {isStale && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
          <AlertTriangle size={16} className="text-amber-700 shrink-0 mt-2" aria-hidden="true" />
          <div className="flex-1">
            <p className="text-xs font-bold text-amber-800">Context changed</p>
            <p className="text-xs text-amber-700 mt-0.5">Your Authority Profile has changed. This strategy must be regenerated. Downstream modules are blocked until approved.</p>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="text-[11px] font-bold text-amber-800 uppercase tracking-wider px-4 py-2 min-h-[44px] bg-amber-200/50 hover:bg-amber-200 rounded-md transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 outline-none disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Regenerate'}
          </button>
        </div>
      )}

      {/* Approved Authority Direction Context Card */}
      <section className="p-6 rounded-2xl bg-gradient-to-br from-[#0058be]/10 to-[#0058be]/5 border border-[#0058be]/20">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-[#0058be]/10 flex items-center justify-center">
            <Target className="w-3.5 h-3.5 text-[#0058be]" aria-hidden="true" />
          </div>
          <h2 className="text-sm font-bold text-[#0058be]">Approved Authority Direction</h2>
        </div>
        <p className="text-sm text-[#0b1c30] mb-2 max-w-3xl leading-relaxed">
          You are positioned as a <span className="font-bold">{authorityProfile.position.charAt(0).toUpperCase() + authorityProfile.position.slice(1)}</span>.
        </p>
        <p className="text-sm font-medium text-[#0b1c30]/80 italic border-l-2 border-[#0058be]/30 pl-4 max-w-3xl leading-relaxed">
          "{authorityProfile.coreTrustPromise}"
        </p>
      </section>

      {/* Optional Proof Inventory Input */}
      {!currentStrategy && !isGenerating && (
        <section className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-sm space-y-4 max-w-3xl">
          <div>
            <h2 className="text-sm font-bold text-[#0b1c30]">Existing Proof Inventory (Optional)</h2>
            <p className="text-xs text-neutral-500 mt-1 max-w-2xl leading-relaxed">
              What evidence do you already have? (e.g. case studies, framework diagrams, client results). We'll build the strategy assuming you're starting from scratch if you leave this empty.
            </p>
          </div>
          
          <textarea
            value={existingProofInventory}
            onChange={(e) => setExistingProofInventory(e.target.value)}
            placeholder="List your existing case studies, client results, frameworks, etc..."
            className="w-full h-32 p-4 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] resize-none transition-all"
          />
          
          <div className="pt-2">
            <ModuleButton 
              onClick={handleGenerate} 
              disabled={isGenerating}
              variant="primary"
            >
              Generate Proof Strategy
            </ModuleButton>
          </div>
        </section>
      )}

      {isGenerating && (
        <div className="p-8 rounded-2xl border border-neutral-100 bg-white animate-pulse flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-10 h-10 rounded-full bg-[#0058be]/10 flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5 text-[#0058be] animate-pulse" />
          </div>
          <div className="h-4 w-48 bg-neutral-100 rounded mb-2"></div>
          <div className="h-3 w-64 bg-neutral-50 rounded"></div>
        </div>
      )}

      {currentStrategy && !isGenerating && (
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Strategy Overview - Always Visible */}
          <div className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-black text-[#0b1c30] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0058be]" />
                {pendingStrategy ? 'Draft Proof Asset Strategy' : 'Approved Proof Asset Strategy'}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  currentStrategy.confidence === 'Strong' ? "bg-green-100 text-green-700" :
                  currentStrategy.confidence === 'Moderate' ? "bg-blue-100 text-blue-700" :
                  "bg-amber-100 text-amber-700"
                )}>
                  {currentStrategy.confidence} Confidence
                </span>
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  pendingStrategy ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                )}>
                  {pendingStrategy ? 'Review Required' : 'Active'}
                </span>
              </div>
            </div>
            
            {/* Trust Requirement Callout */}
            <div className="bg-[#f8f9ff] border border-[#0058be]/20 rounded-xl p-5 mb-4">
              <h3 className="text-xs font-bold text-[#0058be] uppercase tracking-wider mb-2">Core Trust Requirement</h3>
              <p className="text-sm font-medium text-[#0b1c30] leading-relaxed max-w-3xl">
                {currentStrategy.trustRequirement}
              </p>
            </div>
            
            <p className="text-xs text-neutral-500 max-w-3xl leading-relaxed">
              {currentStrategy.confidence === 'Strong' 
                ? "This strategy maps out the exact evidence required to fulfill the trust requirement above, given your specific market positioning."
                : "This strategy maps out the initial evidence required to fulfill the trust requirement above. You can improve personalization by adding your existing proof inventory."}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="space-y-6">
            <div 
              className="flex items-center gap-2 p-1.5 bg-neutral-100 rounded-xl w-full overflow-x-auto snap-x hide-scrollbar"
              role="tablist"
              aria-label="Proof Asset Strategy Sections"
            >
              {[
                { id: 'assessment', label: '1. Assessment' },
                { id: 'assets', label: '2. Required Assets' },
                { id: 'execution', label: '3. Execution Plan' }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`panel-${tab.id}`}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "px-4 py-2 min-h-[44px] rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#0058be] focus-visible:ring-offset-2 outline-none snap-start",
                      isActive 
                        ? "bg-white shadow-sm text-[#0058be] text-sm px-6" 
                        : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/50"
                    )}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>

            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {/* TAB: Assessment */}
                {activeTab === 'assessment' && (
                  <motion.div
                    key="assessment"
                    id="panel-assessment"
                    role="tabpanel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
                    className="space-y-6"
                  >
                    <div className="flex flex-col gap-1 mb-6">
                      <h3 className="text-base font-bold text-[#0b1c30]">Evidence Assessment</h3>
                      <p className="text-xs text-neutral-500">Here's where your current proof is strongest—and where trust gaps remain.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Strengths */}
                      <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Existing Strengths</h4>
                        </div>
                        {currentStrategy.proofGapAnalysis.existingStrengths.length > 0 ? (
                          <ul className="space-y-3">
                            {currentStrategy.proofGapAnalysis.existingStrengths.map((s, i) => (
                              <li key={i} className="text-xs text-emerald-800 flex items-start gap-2 leading-relaxed">
                                <span className="text-emerald-400 mt-0.5 shrink-0" aria-hidden="true">•</span>
                                {s}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-emerald-800/70 italic">You haven't added any existing proof assets yet. That's completely fine—this strategy is designed to help you build from scratch.</p>
                        )}
                      </div>

                      {/* Gaps */}
                      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="w-4 h-4 text-amber-600" aria-hidden="true" />
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Trust Signal Gaps</h4>
                        </div>
                        {currentStrategy.proofGapAnalysis.missingTrustSignals.length > 0 ? (
                          <ul className="space-y-3">
                            {currentStrategy.proofGapAnalysis.missingTrustSignals.map((s, i) => (
                              <li key={i} className="text-xs text-amber-800 flex items-start gap-2 leading-relaxed">
                                <span className="text-amber-400 mt-0.5 shrink-0" aria-hidden="true">•</span>
                                {s}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-amber-800/70 italic">No major gaps identified.</p>
                        )}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-blue-500" aria-hidden="true" />
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#0b1c30]">Strategic Recommendations</h4>
                      </div>
                      <ul className="space-y-3">
                        {currentStrategy.proofGapAnalysis.recommendedImprovements.map((s, i) => (
                          <li key={i} className="text-xs text-neutral-600 flex items-start gap-2 leading-relaxed">
                            <span className="text-blue-500 mt-0.5 shrink-0" aria-hidden="true">•</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}

                {/* TAB: Assets */}
                {activeTab === 'assets' && (
                  <motion.div
                    key="assets"
                    id="panel-assets"
                    role="tabpanel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
                    className="space-y-6"
                  >
                    <div className="flex flex-col gap-1 mb-6">
                      <h3 className="text-base font-bold text-[#0b1c30]">Required Assets</h3>
                      <p className="text-xs text-neutral-500">The specific evidence formats your clients need to see, and the highest-impact assets to build first.</p>
                    </div>

                    {/* Evidence Categories */}
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Content Categories</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentStrategy.requiredProofCategories.map((cat, i) => (
                          <div key={i} className="p-4 border border-neutral-200 rounded-xl bg-neutral-50">
                            <h4 className="text-sm font-bold text-[#0b1c30]">{cat.name}</h4>
                            <p className="text-xs text-neutral-500 mt-1 mb-3 leading-relaxed">{cat.purpose}</p>
                            <div className="p-2 bg-white rounded-lg border border-neutral-100 text-[11px] text-neutral-600 leading-relaxed">
                              <span className="font-bold text-[#0b1c30]">Trust Objective:</span> {cat.trustObjective}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Priority Assets */}
                    <div className="space-y-4 pt-4">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Highest-Impact Assets (Module 4 Input)</h4>
                      <div className="space-y-4">
                        {currentStrategy.priorityProofAssets.map((asset, i) => {
                          const conn = currentStrategy.trustConnection.find(c => c.proofAssetId === asset.id);
                          return (
                            <div key={i} className="p-5 bg-white border border-neutral-200 rounded-xl relative overflow-hidden shadow-sm">
                              <div className="absolute top-0 left-0 w-1 h-full bg-[#0058be]"></div>
                              <h4 className="text-sm font-bold text-[#0b1c30] mb-1">{asset.name}</h4>
                              <p className="text-xs text-neutral-500 mb-3 leading-relaxed max-w-3xl">{asset.recommendationReason}</p>
                              
                              {conn && (
                                <EducationalDrawer 
                                  id={`trust-conn-${i}`}
                                  title="How this builds trust"
                                  content={
                                    <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#0058be]/10 text-xs text-neutral-600 leading-relaxed">
                                      {conn.explanation}
                                    </div>
                                  }
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB: Execution */}
                {activeTab === 'execution' && (
                  <motion.div
                    key="execution"
                    id="panel-execution"
                    role="tabpanel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
                    className="space-y-8"
                  >
                    <div className="flex flex-col gap-1 mb-6">
                      <h3 className="text-base font-bold text-[#0b1c30]">Execution Plan</h3>
                      <p className="text-xs text-neutral-500">Your step-by-step workflow to produce this evidence.</p>
                    </div>

                    {/* Timeline Workflow */}
                    <div className="relative border-l-2 border-neutral-100 ml-4 space-y-8 pb-4">
                      {currentStrategy.proofCreationPlan.slice(0, 5).map((action, i) => {
                        let Icon = ArrowRight;
                        let colorClass = "text-[#0058be] bg-[#0058be]/10 border-[#0058be]/20";
                        
                        if (action.category === 'start_doing') {
                          Icon = CheckCircle2;
                          colorClass = "text-emerald-600 bg-emerald-50 border-emerald-200";
                        } else if (action.category === 'continue_doing') {
                          Icon = Activity;
                          colorClass = "text-blue-600 bg-blue-50 border-blue-200";
                        } else if (action.category === 'avoid') {
                          Icon = AlertTriangle;
                          colorClass = "text-amber-600 bg-amber-50 border-amber-200";
                        } else if (action.category === 'next_steps') {
                          Icon = Target;
                          colorClass = "text-purple-600 bg-purple-50 border-purple-200";
                        }

                        return (
                          <div key={i} className="relative pl-8">
                            <div className={cn("absolute -left-[17px] top-0.5 w-8 h-8 rounded-full border-2 bg-white flex items-center justify-center z-10", colorClass)}>
                              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
                              <div className="flex items-start justify-between gap-4 mb-1">
                                <h4 className="text-sm font-bold text-[#0b1c30]">{action.action}</h4>
                                <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] font-bold uppercase tracking-wider rounded shrink-0">Impact: {action.expectedTrustImpact}</span>
                              </div>
                              <p className="text-xs text-neutral-500 leading-relaxed max-w-2xl">{action.rationale}</p>
                            </div>
                          </div>
                        );
                      })}
                      {currentStrategy.proofCreationPlan.length > 5 && (
                        <div className="relative pl-8 pt-2">
                          <p className="text-xs text-neutral-400 italic">+ {currentStrategy.proofCreationPlan.length - 5} additional steps available in full export.</p>
                        </div>
                      )}
                    </div>

                    {/* Choose Your Proof Execution Priority */}
                    {pendingStrategy && (
                      <div className="bg-[#0b1c30] rounded-2xl p-6 shadow-md border border-[#0b1c30] mt-8">
                        <h3 className="text-base font-bold text-white mb-2">Final Step: Choose Execution Priority</h3>
                        <p className="text-sm text-white/70 mb-6 max-w-2xl leading-relaxed">Select when you plan to execute this proof strategy. This defines the urgency for Module 4's asset builder.</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {[
                            { id: 'immediate', title: 'Immediate', desc: 'I need to build these assets right now to close deals.' },
                            { id: 'short_term', title: 'Short-Term', desc: 'I will build these over the next 30-90 days.' },
                            { id: 'long_term', title: 'Long-Term', desc: 'I will collect this evidence organically over time.' }
                          ].map(opt => (
                            <button
                              key={opt.id}
                              onClick={() => handlePrioritySelect(opt.id as any)}
                              className={cn(
                                "p-4 rounded-xl border text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 outline-none bg-white/5",
                                activePriority === opt.id 
                                  ? "border-blue-400 bg-blue-500/20" 
                                  : "border-white/10 hover:border-white/20 hover:bg-white/10"
                              )}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className={cn("text-sm font-bold", activePriority === opt.id ? "text-blue-100" : "text-white")}>{opt.title}</span>
                                {activePriority === opt.id && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                              </div>
                              <p className="text-xs text-white/60 leading-relaxed">{opt.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>
      )}

      {isCompleted && !isUpstreamStale && !pendingStrategy && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-[#0b1c30] text-white flex items-start gap-4 shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30 mt-1">
            <Check className="w-5 h-5 text-emerald-400" aria-hidden="true" />
          </div>
          <div>
            <h4 className="text-sm font-bold mb-1">Proof Asset Strategy Approved</h4>
            <p className="text-sm text-white/70 leading-relaxed max-w-3xl">
              This strategy is now the official evidence architecture for your business. Module 4 will use this shared context to structure your final portfolio assets.
            </p>
          </div>
        </motion.div>
      )}

      <StepActionArea>
        <div className="flex items-center gap-3">
          <ModuleButton variant="secondary" onClick={previousStep}>
            <ArrowLeft size={16} aria-hidden="true" />
            Back
          </ModuleButton>
          
          {pendingStrategy && (
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="text-xs font-bold text-neutral-500 hover:text-neutral-700 transition-colors cursor-pointer px-4 py-2 disabled:opacity-50"
            >
              Regenerate
            </button>
          )}
        </div>

        <ModuleButton
          variant="primary"
          onClick={handleNext}
          disabled={isGenerating || (pendingStrategy && !activePriority)}
        >
          {isCompleted && !pendingStrategy ? 'Continue to Portfolio' : 'Approve Strategy'}
          <ArrowRight size={16} aria-hidden="true" />
        </ModuleButton>
      </StepActionArea>

    </motion.div>
  );
}
