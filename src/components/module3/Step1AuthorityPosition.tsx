import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowLeft, ArrowRight, Check, AlertTriangle, Layout, ChevronDown, ChevronUp, FileText, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';
import { useModule3Store } from '../../lib/module3';
import { resolveRecommendedPosition, generateAuthorityProfile, generateCoreTrustPromise, PositionContext, AUTHORITY_POSITIONS } from '../../data/module3/authority-positions';
import { StepHeader } from '../workspace/StepHeader';
import { StepActionArea } from '../workspace/StepActionArea';
import { ModuleButton } from '../workspace/ModuleButton';

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
  const promiseVariationIndex = useModule3Store(s => s.promiseVariationIndex);
  
  const confirmStep = useModule3Store(s => s.confirmStep);
  const nextStep = useModule3Store(s => s.nextStep);
  const previousStep = useModule3Store(s => s.previousStep);
  const completedSteps = useModule3Store((s) => s.completedSteps);
  const isCompleted = completedSteps.includes('authority_position');
  
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clearSaveStateRef = useRef<NodeJS.Timeout | null>(null);
  const [showGuidelines, setShowGuidelines] = useState(false);

  const hasMissingContext = !ctx.serviceId || !ctx.marketId;

  // Dynamically resolve what the AI recommends
  const aiRecommendedPosition = useMemo(() => {
    if (hasMissingContext) return 'builder';
    return resolveRecommendedPosition(ctx as PositionContext);
  }, [ctx, hasMissingContext]);

  useEffect(() => {
    if (!pendingProfile && !hasMissingContext) {
      // Default to AI recommendation on load
      const profile = generateAuthorityProfile(aiRecommendedPosition, ctx as PositionContext);
      setPendingProfile(profile);
    }
  }, [pendingProfile, hasMissingContext, ctx, aiRecommendedPosition, setPendingProfile]);

  // Clean up timeouts
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (clearSaveStateRef.current) clearTimeout(clearSaveStateRef.current);
    };
  }, []);

  const handleSelectPosition = (pos: 'builder' | 'auditor' | 'deconstructor' | 'practitioner') => {
    if (hasMissingContext) return;
    const newProfile = generateAuthorityProfile(pos, ctx as PositionContext);
    setPendingProfile(newProfile);
    triggerAutosave(newProfile.coreTrustPromise);
  };

  const handleApprove = () => {
    if (pendingProfile) {
      setAuthorityProfile(pendingProfile);
      // Synchronize fields in store
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

  const triggerAutosave = (promiseVal: string) => {
    setSaveState('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    if (clearSaveStateRef.current) clearTimeout(clearSaveStateRef.current);
    
    saveTimeoutRef.current = setTimeout(() => {
      setSaveState('saved');
      clearSaveStateRef.current = setTimeout(() => {
        setSaveState('idle');
      }, 2000);
    }, 1000);
  };

  const handlePromiseChange = (val: string) => {
    if (!pendingProfile) return;
    setPendingProfile({ ...pendingProfile, coreTrustPromise: val });
    triggerAutosave(val);
  };

  const handleCyclePromise = () => {
    if (!pendingProfile || hasMissingContext) return;
    const nextVar = (promiseVariationIndex + 1) % 3;
    useModule3Store.setState({ promiseVariationIndex: nextVar });
    
    const newPromise = generateCoreTrustPromise(pendingProfile.position, ctx as PositionContext, nextVar);
    setPendingProfile({ ...pendingProfile, coreTrustPromise: newPromise });
    triggerAutosave(newPromise);
  };

  const handleRefreshRecommendation = () => {
    if (hasMissingContext) return;
    const profile = generateAuthorityProfile(aiRecommendedPosition, ctx as PositionContext);
    setPendingProfile(profile);
    triggerAutosave(profile.coreTrustPromise);
  };

  return (
    <div className="space-y-8">
      <StepHeader
        step={{ current: 1, total: 5 }}
        title="Find Your Authority Type"
        description="Every freelancer has a natural superpower for winning client trust. Select the one that matches how you work, and edit your core client pledge."
      />

      {isUpstreamStale && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
          <AlertTriangle size={16} className="text-amber-700 shrink-0 mt-2" aria-hidden="true" />
          <div className="flex-1">
            <p className="text-xs font-bold text-amber-800">Your profile details changed</p>
            <p className="text-xs text-amber-700 mt-0.5">Your offers or positioning have been modified in Modules 1 or 2. Update your recommendation:</p>
          </div>
          <button 
            onClick={handleRefreshRecommendation}
            className="text-[11px] font-bold text-[#0b1c30] uppercase tracking-wider px-4 py-2 min-h-[44px] bg-amber-200/50 hover:bg-amber-200 rounded-md transition-colors cursor-pointer outline-none border-none"
          >
            Update Strategy
          </button>
        </div>
      )}

      {hasMissingContext ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-neutral-200 bg-neutral-50/50 border-dashed">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
            <Layout className="w-5 h-5 text-neutral-400" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-bold text-[#0b1c30]">Missing Service Details</h3>
          <p className="text-sm text-neutral-500 max-w-sm mt-1 mb-6">Please complete Module 1 so we know your skill track and target audience before matching your authority style.</p>
          <ModuleButton variant="secondary" onClick={previousStep}>
            <ArrowLeft size={16} aria-hidden="true" /> Go Back to Module 1
          </ModuleButton>
        </div>
      ) : pendingProfile ? (
        <div className="space-y-8">
          {/* Card Grid selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AUTHORITY_POSITIONS.map((pos) => {
              const isActive = pendingProfile.position === pos.id;
              const isRecommended = aiRecommendedPosition === pos.id;

              return (
                <button
                  key={pos.id}
                  onClick={() => handleSelectPosition(pos.id as any)}
                  className={cn(
                    "relative text-left p-5 rounded-2xl border transition-all duration-300 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0058be]/40",
                    isActive
                      ? "border-[#0058be] bg-[#0058be]/5 shadow-sm shadow-[#0058be]/10"
                      : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className={cn("font-extrabold text-sm mb-1 transition-colors", isActive ? "text-[#0058be]" : "text-[#0b1c30]")}>
                        {pos.label}
                      </h4>
                      <p className="text-xs text-neutral-500 leading-relaxed max-w-[280px]">
                        {pos.shortExplanation}
                      </p>
                    </div>
                    {isActive ? (
                      <div className="w-5 h-5 rounded-full bg-[#0058be] text-white flex items-center justify-center shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    ) : isRecommended ? (
                      <span className="text-[9px] font-bold text-[#0058be] bg-[#0058be]/10 px-2 py-1 rounded-md shrink-0 uppercase tracking-wider">
                        AI Recommended
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 pt-3 border-t border-dashed border-neutral-100 flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400 font-medium">Trust Blueprint:</span>
                    <span className="text-[10px] text-[#0b1c30]/70 font-semibold text-right max-w-[200px] truncate">
                      {pos.id === 'builder' ? 'Tangible Builds' : pos.id === 'auditor' ? 'Measurable Diagnostics' : pos.id === 'deconstructor' ? 'Strategic Playbooks' : 'Daily Trenches Logs'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Rationale & Action Card */}
          <div className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">Why this fits you</span>
              <div className="text-xs text-neutral-600 space-y-1.5">
                {pendingProfile.whyThisFitsYou.split('\n').filter(Boolean).map((line, i) => (
                  <p key={i} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0058be] mt-1.5 shrink-0" />
                    <span>{line.replace(/^•\s*/, '')}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* Core Trust Promise Box */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="core-trust-promise" className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#0058be]" />
                  Your Core Trust Promise
                </label>
                <button
                  onClick={handleCyclePromise}
                  className="text-xs text-[#0058be] hover:underline font-bold flex items-center gap-1 min-h-[32px] px-2 rounded hover:bg-neutral-50 cursor-pointer border-none bg-transparent"
                >
                  🔄 Try Alternative Wording
                </button>
              </div>

              <textarea
                id="core-trust-promise"
                value={pendingProfile.coreTrustPromise}
                onChange={(e) => handlePromiseChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none text-sm text-[#0b1c30] placeholder:text-neutral-400 bg-neutral-50 border border-neutral-200 focus:border-[#0058be] focus:ring-2 focus:ring-[#0058be]/10 focus:bg-white transition-all resize-none min-h-[80px] leading-relaxed"
                placeholder="Write your 2-sentence pledge of trust here..."
              />
              <p className="text-[10px] text-neutral-400 leading-relaxed flex items-center gap-1">
                <Info size={10} className="shrink-0" />
                This is a 2-sentence client pledge. Keep it between 35 and 55 words to maintain optimal reading rhythm.
              </p>
            </div>

            {/* Ideal Client Perspective */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#0058be]/5 to-transparent border-l-4 border-[#0058be]/50">
              <span className="text-[9px] font-bold text-[#0058be] uppercase tracking-wider block mb-1">What your client is thinking:</span>
              <p className="text-xs text-neutral-600 italic leading-relaxed">
                "{pendingProfile.clientPerspective}"
              </p>
            </div>

            {/* Expandable Strategy Guidelines */}
            <div className="border-t border-neutral-100 pt-4">
              <button
                onClick={() => setShowGuidelines(!showGuidelines)}
                className="flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-neutral-800 transition-colors w-full justify-between min-h-[40px] px-2 rounded hover:bg-neutral-50 cursor-pointer border-none bg-transparent"
              >
                <span>🔍 View Action Guidelines (Dos & Don'ts)</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", showGuidelines && "rotate-180")} />
              </button>

              <AnimatePresence>
                {showGuidelines && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-neutral-100 pt-4"
                  >
                    <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100/50 space-y-2">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Start Doing:</span>
                      <ul className="space-y-1.5">
                        {pendingProfile.reinforcementPlan.startDoing.map((item, i) => (
                          <li key={i} className="text-xs text-emerald-800 flex items-start gap-1.5 leading-relaxed font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100/50 space-y-2">
                      <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Continue Doing:</span>
                      <ul className="space-y-1.5">
                        {pendingProfile.reinforcementPlan.continueDoing.map((item, i) => (
                          <li key={i} className="text-xs text-blue-800 flex items-start gap-1.5 leading-relaxed font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100/50 space-y-2">
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Avoid:</span>
                      <ul className="space-y-1.5">
                        {pendingProfile.reinforcementPlan.avoidDoing.map((item, i) => (
                          <li key={i} className="text-xs text-amber-800 flex items-start gap-1.5 leading-relaxed font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl border border-neutral-100 bg-white animate-pulse flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-10 h-10 rounded-full bg-neutral-100 mb-4 animate-spin"></div>
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
              Your Authority Profile is locked in. Other modules will use this profile to custom-build your portfolio and outreach copy.
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
