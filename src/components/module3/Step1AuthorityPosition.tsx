import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowLeft, ArrowRight, Check, AlertTriangle, Layout, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';
import { useModule3Store } from '../../lib/module3';
import { analyzeAuthorityStrategy, PositionContext } from '../../data/module3/authority-positions';
import { StepHeader } from '../workspace/StepHeader';
import { StepActionArea } from '../workspace/StepActionArea';
import { ModuleButton } from '../workspace/ModuleButton';
import { composeStep1Content, buildPersonalizationContext } from '../../lib/module3/personalized-content';

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

function usePositionContext() {
  const careerTrackId = useModule3Store((s) => s.mod1CareerTrackId);
  const serviceId = useModule3Store((s) => s.mod1ServiceId);
  const marketId = useModule3Store((s) => s.mod1MarketId);
  const nicheId = useModule3Store((s) => s.mod1NicheId);
  const positioning = useModule3Store((s) => s.mod1Positioning);
  const offerType = useModule3Store((s) => s.mod2OfferType);
  const deliverables = useModule3Store((s) => s.mod2Deliverables);
  const uniqueMechanism = useModule3Store((s) => s.mod2UniqueMechanism);
  const valueAmplifier = useModule3Store((s) => s.mod2ValueAmplifier);

  return useMemo(() => ({
    careerTrackId,
    serviceId,
    marketId,
    nicheId,
    positioning,
    offerType,
    deliverables,
    uniqueMechanism,
    valueAmplifier,
  }), [careerTrackId, serviceId, marketId, nicheId, positioning, offerType, deliverables, uniqueMechanism, valueAmplifier]);
}

export function Step1AuthorityPosition() {
  const ctx = usePositionContext();
  
  const pendingProfile = useModule3Store(s => s.pendingProfile);
  const authorityProfile = useModule3Store(s => s.authorityProfile);
  const setPendingProfile = useModule3Store(s => s.setPendingProfile);
  const setAuthorityProfile = useModule3Store(s => s.setAuthorityProfile);
  const isUpstreamStale = useModule3Store(s => s.isUpstreamStale);
  
  const confirmStep = useModule3Store(s => s.confirmStep);
  const nextStep = useModule3Store(s => s.nextStep);
  const previousStep = useModule3Store(s => s.previousStep);
  const completedSteps = useModule3Store((s) => s.completedSteps);
  const isCompleted = completedSteps.includes('authority_position');
  
  const [activeTab, setActiveTab] = useState<'recommendation' | 'profile' | 'reinforcement'>('recommendation');
  
  // Autosave state
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clearSaveStateRef = useRef<NodeJS.Timeout | null>(null);

  const hasMissingContext = !ctx.serviceId || !ctx.marketId;

  const personalized = useMemo(() => {
    const pctx = buildPersonalizationContext({
      ...ctx,
      authorityPosition: pendingProfile?.position || null,
      coreTrustPromise: pendingProfile?.coreTrustPromise || '',
      proofPriorities: undefined,
      proofAssets: undefined,
    });
    return composeStep1Content(pctx);
  }, [ctx, pendingProfile]);

  useEffect(() => {
    if (!pendingProfile && !hasMissingContext) {
      // Generate initial recommendation
      const profile = analyzeAuthorityStrategy(ctx as PositionContext);
      setPendingProfile(profile);
    }
  }, [pendingProfile, hasMissingContext, ctx, setPendingProfile]);

  // Clean up timeouts
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (clearSaveStateRef.current) clearTimeout(clearSaveStateRef.current);
    };
  }, []);

  const handleApprove = () => {
    if (pendingProfile) {
      setAuthorityProfile(pendingProfile);
      // Synchronize legacy fields for backward compatibility
      useModule3Store.setState({ 
        authorityPosition: pendingProfile.position, 
        coreTrustPromise: pendingProfile.coreTrustPromise,
        authorityPositionRationale: pendingProfile.whyThisFitsYou,
      });
      confirmStep();
      nextStep();
    }
  };

  const handleNext = () => {
    if (isCompleted) {
      nextStep();
    } else {
      handleApprove();
    }
  };

  const handlePromiseChange = (val: string) => {
    if (!pendingProfile) return;
    
    // Update local store state immediately
    setPendingProfile({ ...pendingProfile, coreTrustPromise: val });
    
    // Trigger autosave sequence for UI feedback
    setSaveState('saving');
    
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    if (clearSaveStateRef.current) clearTimeout(clearSaveStateRef.current);
    
    saveTimeoutRef.current = setTimeout(() => {
      setSaveState('saved');
      
      clearSaveStateRef.current = setTimeout(() => {
        setSaveState('idle');
      }, 2000); // Disappear naturally after 2 seconds
    }, 1000); // 1 second debounce
  };

  const handleRefreshRecommendation = () => {
    if (hasMissingContext) return;
    const profile = analyzeAuthorityStrategy(ctx as PositionContext);
    setPendingProfile(profile);
  };

  return (
    <div className="space-y-8">
      <StepHeader
        step={{ current: 1, total: 5 }}
        title="Authority Profile"
        description={personalized.description}
      />

      {isUpstreamStale && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
          <AlertTriangle size={16} className="text-amber-700 shrink-0 mt-2" aria-hidden="true" />
          <div className="flex-1">
            <p className="text-xs font-bold text-amber-800">Context changed</p>
            <p className="text-xs text-amber-700 mt-0.5">Your offers or positioning have changed since you generated this profile.</p>
          </div>
          <button 
            onClick={handleRefreshRecommendation}
            className="text-[11px] font-bold text-amber-800 uppercase tracking-wider px-4 py-2 min-h-[44px] bg-amber-200/50 hover:bg-amber-200 rounded-md transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 outline-none"
          >
            Refresh
          </button>
        </div>
      )}

      {hasMissingContext ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-neutral-200 bg-neutral-50/50 border-dashed">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
            <Layout className="w-5 h-5 text-neutral-400" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-bold text-[#0b1c30]">Missing Context</h3>
          <p className="text-sm text-neutral-500 max-w-sm mt-1 mb-6">We need your service and market from Module 1 to generate your authority strategy.</p>
          <ModuleButton variant="secondary" onClick={previousStep}>
            <ArrowLeft size={16} aria-hidden="true" /> Go Back to Module 1
          </ModuleButton>
        </div>
      ) : pendingProfile ? (
        <div className="space-y-6">
          <div 
            className="flex flex-wrap items-center gap-2 p-1.5 bg-neutral-100 rounded-xl w-full sm:w-max overflow-x-auto"
            role="tablist"
            aria-label="Authority Profile Sections"
          >
            <button 
              role="tab"
              aria-selected={activeTab === 'recommendation'}
              onClick={() => setActiveTab('recommendation')}
              className={cn(
                "px-4 py-2 min-h-[44px] sm:min-h-0 sm:py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#0058be] focus-visible:ring-offset-2 outline-none",
                activeTab === 'recommendation' 
                  ? "bg-white shadow-sm text-[#0b1c30]" 
                  : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/50"
              )}
            >
              AI Recommendation
            </button>
            <button 
              role="tab"
              aria-selected={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
              className={cn(
                "px-4 py-2 min-h-[44px] sm:min-h-0 sm:py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#0058be] focus-visible:ring-offset-2 outline-none",
                activeTab === 'profile' 
                  ? "bg-white shadow-sm text-[#0b1c30]" 
                  : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/50"
              )}
            >
              Authority Profile
            </button>
            <button 
              role="tab"
              aria-selected={activeTab === 'reinforcement'}
              onClick={() => setActiveTab('reinforcement')}
              className={cn(
                "px-4 py-2 min-h-[44px] sm:min-h-0 sm:py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#0058be] focus-visible:ring-offset-2 outline-none",
                activeTab === 'reinforcement' 
                  ? "bg-white shadow-sm text-[#0b1c30]" 
                  : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/50"
              )}
            >
              Reinforcement
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
            >
              {activeTab === 'recommendation' && (
                <div className="space-y-6">
                  <div className="p-8 rounded-2xl bg-gradient-to-br from-[#0058be]/10 to-[#0058be]/5 border border-[#0058be]/20 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4">
                      <Sparkles className="w-6 h-6 text-[#0058be]" aria-hidden="true" />
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#0058be] mb-2">Recommended Strategy</p>
                    <h3 className="text-xl font-black text-[#0b1c30] mb-3">{pendingProfile.summary}</h3>
                    <p className="text-sm text-[#0b1c30]/80 max-w-lg mx-auto leading-relaxed">{pendingProfile.strategicExplanation}</p>
                  </div>
                  
                  <div className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <h4 className="text-sm font-bold text-[#0b1c30] mb-4">Why This Fits You</h4>
                    <div className="text-sm text-neutral-600 leading-relaxed space-y-3">
                      {pendingProfile.whyThisFitsYou.split('\n').filter(Boolean).map((line, i) => (
                        <p key={i} className="flex items-start gap-2">
                          <span className="text-[#0058be] mt-0.5 shrink-0" aria-hidden="true">•</span>
                          {line.replace(/^•\s*/, '')}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 id="core-trust-promise-heading" className="text-sm font-bold text-[#0b1c30]">Core Trust Promise</h4>
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Editable</span>
                    </div>
                    <textarea
                      aria-labelledby="core-trust-promise-heading"
                      value={pendingProfile.coreTrustPromise}
                      onChange={(e) => handlePromiseChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl outline-none text-sm text-[#0b1c30] placeholder:text-neutral-400 bg-neutral-50 border border-neutral-200 focus:border-[#0058be] focus:ring-2 focus:ring-[#0058be]/20 focus:bg-white transition-all resize-y min-h-[100px] leading-relaxed"
                      placeholder="Your core trust promise..."
                    />
                    <EducationalDrawer 
                      id="core-trust-promise-educational"
                      title="Why this matters" 
                      content="This is the specific claim your audience needs to believe. It focuses on the reality of your work, rather than just listing services. A strong trust promise is the foundation for all your proof assets."
                    />
                  </div>
                  
                  <div className="p-6 rounded-2xl border border-[#0058be]/20 bg-[#f8f9ff]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-[#0058be]/10 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-[#0058be]" aria-hidden="true" />
                      </div>
                      <h4 className="text-sm font-bold text-[#0058be]">Client Perspective</h4>
                    </div>
                    <p className="text-sm font-medium text-[#0b1c30] leading-relaxed italic pl-8 border-l-2 border-[#0058be]/30">
                      "{pendingProfile.clientPerspective}"
                    </p>
                    <div className="pl-8">
                      <EducationalDrawer 
                        id="client-perspective-educational"
                        title="How to reinforce it" 
                        content="Your content should consistently validate this perspective. Whenever you publish, ask yourself: 'Does this make them believe this statement even more?'"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reinforcement' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-4">Start Doing</h4>
                      <ul className="space-y-3">
                        {pendingProfile.reinforcementPlan.startDoing.map((item, i) => (
                          <li key={i} className="text-xs text-emerald-800 flex items-start gap-2 leading-relaxed font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-800 mb-4">Continue Doing</h4>
                      <ul className="space-y-3">
                        {pendingProfile.reinforcementPlan.continueDoing.map((item, i) => (
                          <li key={i} className="text-xs text-blue-800 flex items-start gap-2 leading-relaxed font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-4">Avoid</h4>
                      <ul className="space-y-3">
                        {pendingProfile.reinforcementPlan.avoidDoing.map((item, i) => (
                          <li key={i} className="text-xs text-amber-800 flex items-start gap-2 leading-relaxed font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-sm flex flex-col items-center text-center justify-center min-h-[140px]">
                    <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                      <FileText className="w-5 h-5 text-neutral-500" aria-hidden="true" />
                    </div>
                    <h4 className="text-sm font-bold text-[#0b1c30]">View Full Analysis</h4>
                    <p className="text-xs text-neutral-500 mt-1 max-w-sm mb-2">Review the complete reasoning behind this strategy recommendation.</p>
                    
                    <EducationalDrawer 
                      id="view-full-analysis-educational"
                      title="View Authority Summary Report"
                      content={
                        <div className="text-xs text-left text-neutral-600 font-mono whitespace-pre-wrap leading-relaxed p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                          {pendingProfile.report}
                        </div>
                      }
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div className="p-8 rounded-2xl border border-neutral-100 bg-white animate-pulse flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-10 h-10 rounded-full bg-neutral-100 mb-4"></div>
          <div className="h-4 w-48 bg-neutral-100 rounded mb-2"></div>
          <div className="h-3 w-64 bg-neutral-50 rounded"></div>
        </div>
      )}

      {isCompleted && !isUpstreamStale && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-[#0b1c30] text-white flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Check className="w-5 h-5 text-emerald-400" aria-hidden="true" />
          </div>
          <div>
            <h4 className="text-sm font-bold mb-1">Strategic Foundation Approved</h4>
            <p className="text-sm text-white/70 leading-relaxed">
              Your Authority Profile is now the strategic foundation for the rest of your modules. Downstream systems will use this profile to ensure your assets and narrative remain perfectly aligned with your strategy.
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
          
          {/* Subtle Autosave Indicator */}
          <AnimatePresence mode="wait">
            {saveState === 'saving' && (
              <motion.div
                key="saving"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-neutral-400 font-medium"
              >
                Saving draft...
              </motion.div>
            )}
            {saveState === 'saved' && (
              <motion.div
                key="saved"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-emerald-600 font-medium flex items-center gap-1"
              >
                <Check size={14} aria-hidden="true" /> Saved
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ModuleButton
          variant="primary"
          onClick={handleNext}
          disabled={hasMissingContext || !pendingProfile}
        >
          {isCompleted ? 'Continue' : 'Confirm Strategy'}
          <ArrowRight size={16} aria-hidden="true" />
        </ModuleButton>
      </StepActionArea>
    </div>
  );
}
