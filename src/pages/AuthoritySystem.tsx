import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import { Module3Shell } from '../components/module3/Module3Shell';
import { Module3IntroPage } from '../components/module3/Module3IntroPage';
import { StepContent } from '../components/module3/StepContent';
import { useModule3Store, buildFingerprint } from '../lib/module3';
import type { Module1Context, Module2Context } from '../types/module3';
import { useOfferEngineeringStore } from '../lib/offer-engineering';
import { useOpportunityMapStore } from '../lib/opportunity-map';

const MODULE3_STARTED_KEY = 'blueprint-module3-started';

export function AuthoritySystem() {
  const navigate = useNavigate();

  const [moduleStarted, setModuleStarted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(MODULE3_STARTED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const setPhase1Context = useModule3Store((s) => s.setPhase1Context);
  const setPhase2Context = useModule3Store((s) => s.setPhase2Context);
  const setUpstreamFingerprint = useModule3Store((s) => s.setUpstreamFingerprint);
  const setIsUpstreamStale = useModule3Store((s) => s.setIsUpstreamStale);
  const clearModule3Data = useModule3Store((s) => s.clearModule3Data);
  const storedFP = useModule3Store((s) => s.upstreamFingerprint);
  const isStale = useModule3Store((s) => s.isUpstreamStale);
  const completedSteps = useModule3Store((s) => s.completedSteps);
  const isCompleted = useModule3Store((s) => s.isCompleted);

  const careerTrackId = useOpportunityMapStore((s) => s.careerTrackId);
  const serviceId = useOpportunityMapStore((s) => s.serviceId);
  const marketId = useOpportunityMapStore((s) => s.marketId);
  const nicheId = useOpportunityMapStore((s) => s.nicheId);
  const offerId = useOpportunityMapStore((s) => s.offerId);
  const positioning = useOpportunityMapStore((s) => s.positioning);

  const m2OfferType = useOfferEngineeringStore((s) => s.offerType);
  const m2OfferBlueprint = useOfferEngineeringStore((s) => s.offerBlueprint);
  const m2Deliverables = useOfferEngineeringStore((s) => s.deliverables);
  const m2UniqueMechanism = useOfferEngineeringStore((s) => s.uniqueMechanism);
  const m2ScopeLimits = useOfferEngineeringStore((s) => s.scopeLimits);
  const m2ValueAmplifier = useOfferEngineeringStore((s) => s.valueAmplifier);
  const m2PricingModel = useOfferEngineeringStore((s) => s.pricingModel);
  const m2FinalPrice = useOfferEngineeringStore((s) => s.finalPrice);
  const m2TieredPricing = useOfferEngineeringStore((s) => s.tieredPricing);
  const m2ValueBasedPricing = useOfferEngineeringStore((s) => s.valueBasedPricing);
  const m2ProposalSummary = useOfferEngineeringStore((s) => s.proposalSummary);

  const mod1Ctx: Module1Context = {
    careerTrackId,
    serviceId,
    marketId,
    nicheId,
    offerId,
    positioning,
  };

  const mod2Ctx: Module2Context = {
    offerType: m2OfferType,
    deliverables: m2Deliverables,
    uniqueMechanism: m2UniqueMechanism,
    scopeLimits: m2ScopeLimits,
    valueAmplifier: m2ValueAmplifier,
    pricingModel: m2PricingModel,
    finalPrice: m2FinalPrice,
    tieredPricing: m2TieredPricing,
    valueBasedPricing: m2ValueBasedPricing,
    proposalSummary: m2ProposalSummary,
  };

  const currentFP = buildFingerprint(mod1Ctx, mod2Ctx);
  const hasProgress = completedSteps.length > 0 || isCompleted;

  useEffect(() => {
    if (!serviceId) return;

    if (storedFP === '') {
      setPhase1Context(mod1Ctx);
      setPhase2Context(mod2Ctx);
      setUpstreamFingerprint(currentFP);
      return;
    }

    if (storedFP !== currentFP) {
      // ALWAYS overwrite Module 3's context with live Module 1/2 values
      setPhase1Context(mod1Ctx);
      setPhase2Context(mod2Ctx);
      setUpstreamFingerprint(currentFP);
      if (hasProgress) {
        setIsUpstreamStale(true);
      }
    }
  }, [storedFP, currentFP, serviceId, hasProgress]);

  const handleRebuild = useCallback(() => {
    clearModule3Data();
    setPhase1Context(mod1Ctx);
    setPhase2Context(mod2Ctx);
    setUpstreamFingerprint(currentFP);
  }, [mod1Ctx, mod2Ctx, currentFP]);

  const handleStart = useCallback(() => {
    setModuleStarted(true);
    try {
      localStorage.setItem(MODULE3_STARTED_KEY, 'true');
    } catch {
      // ignore
    }
  }, []);

  const handleBackToBlueprint = useCallback(() => {
    navigate('/blueprints/get-your-first-3-clients');
  }, [navigate]);

  const handleBackToOverview = useCallback(() => {
    setModuleStarted(false);
    try {
      localStorage.setItem(MODULE3_STARTED_KEY, 'false');
    } catch {
      // ignore
    }
  }, []);

  if (!serviceId) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex items-center justify-center px-5">
        <div className="max-w-md text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto">
            <AlertCircle size={28} className="text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold">Opportunity Mapping Required</h1>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Complete Module 1 (Opportunity Mapping) first to unlock the Authority System.
            Select your service, market, and niche to build your proof strategy.
          </p>
          <button
            onClick={() => navigate('/blueprints/get-your-first-3-clients')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0058be] text-white font-bold text-sm transition-colors hover:bg-[#0047a0] cursor-pointer"
          >
            <ArrowLeft size={14} />
            Go to Module 1
          </button>
        </div>
      </div>
    );
  }

  if (!m2OfferType && !m2OfferBlueprint) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex items-center justify-center px-5">
        <div className="max-w-md text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto">
            <AlertCircle size={28} className="text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold">Offer Engineering Required</h1>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Complete Module 2 (Offer Engineering) first to unlock the Authority System.
            Define your offer type, deliverables, and mechanism to generate your proof strategy.
          </p>
          <button
            onClick={() => navigate('/workspace/offer-engineering')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0058be] text-white font-bold text-sm transition-colors hover:bg-[#0047a0] cursor-pointer"
          >
            <ArrowLeft size={14} />
            Go to Module 2
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-[#f8f9ff]">
      {isStale && (
        <div className="bg-amber-50 border-b border-amber-200 p-4 text-[#0b1c30] z-50">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-amber-600 flex-shrink-0 animate-pulse" size={20} />
              <div className="text-left">
                <p className="text-sm font-semibold">Upstream context has changed</p>
                <p className="text-xs text-neutral-500">Your Module 1 or 2 settings have been modified. Choose how to handle your existing work:</p>
              </div>
            </div>
            <div className="flex gap-2 text-xs font-semibold">
              <button
                onClick={() => useModule3Store.getState().dismissStaleContext()}
                className="px-3 py-1.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-700 transition cursor-pointer"
              >
                Keep Current Work
              </button>
              <button
                onClick={() => useModule3Store.getState().refreshStaleContext()}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition cursor-pointer"
              >
                Refresh Unmodified Fields
              </button>
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to reset all Module 3 data? This will delete all your edits.")) {
                    handleRebuild();
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition cursor-pointer"
              >
                Reset Module
              </button>
            </div>
          </div>
        </div>
      )}
      {!moduleStarted ? (
        <Module3IntroPage
          onStart={handleStart}
          onBackToBlueprint={handleBackToBlueprint}
        />
      ) : (
        <Module3Shell onBack={handleBackToOverview}>
          <StepContent />
        </Module3Shell>
      )}
    </div>
  );
}

export default AuthoritySystem;
