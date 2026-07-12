import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Module3Shell } from '../components/module3/Module3Shell';
import { StepContent } from '../components/module3/StepContent';
import { useModule3Store, buildFingerprint } from '../lib/module3';
import type { Module1Context, Module2Context } from '../types/module3';
import { useOfferEngineeringStore } from '../lib/offer-engineering';
import { useOpportunityMapStore } from '../lib/opportunity-map';

export function AuthoritySystem() {
  const navigate = useNavigate();

  const setPhase1Context = useModule3Store((s) => s.setPhase1Context);
  const setPhase2Context = useModule3Store((s) => s.setPhase2Context);
  const setUpstreamFingerprint = useModule3Store((s) => s.setUpstreamFingerprint);
  const setIsUpstreamStale = useModule3Store((s) => s.setIsUpstreamStale);
  const clearModule3Data = useModule3Store((s) => s.clearModule3Data);
  const storedFP = useModule3Store((s) => s.upstreamFingerprint);
  const isStale = useModule3Store((s) => s.isUpstreamStale);
  const completedSteps = useModule3Store((s) => s.completedSteps);
  const isCompleted = useModule3Store((s) => s.isCompleted);

  /* ── Module 1 — read DIRECTLY from useOpportunityMapStore ── */
  const careerTrackId = useOpportunityMapStore((s) => s.careerTrackId);
  const serviceId = useOpportunityMapStore((s) => s.serviceId);
  const marketId = useOpportunityMapStore((s) => s.marketId);
  const nicheId = useOpportunityMapStore((s) => s.nicheId);
  const offerId = useOpportunityMapStore((s) => s.offerId);
  const positioning = useOpportunityMapStore((s) => s.positioning);

  /* ── Module 2 — raw values from useOfferEngineeringStore ── */
  const m2OfferType = useOfferEngineeringStore((s) => s.offerType);
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

  /* ── Fingerprint comparison on mount / upstream change ── */
  useEffect(() => {
    if (!serviceId) return;

    if (storedFP === '') {
      setPhase1Context(mod1Ctx);
      setPhase2Context(mod2Ctx);
      setUpstreamFingerprint(currentFP);
      return;
    }

    if (storedFP !== currentFP) {
      if (hasProgress) {
        setIsUpstreamStale(true);
      } else {
        setPhase1Context(mod1Ctx);
        setPhase2Context(mod2Ctx);
        setUpstreamFingerprint(currentFP);
      }
    }
  }, [storedFP, currentFP, serviceId, hasProgress]);

  const handleRebuild = useCallback(() => {
    clearModule3Data();
    setPhase1Context(mod1Ctx);
    setPhase2Context(mod2Ctx);
    setUpstreamFingerprint(currentFP);
  }, [mod1Ctx, mod2Ctx, currentFP]);

  /* ── Guard: no Module 1 context ── */
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

  /* ── Guard: no Module 2 context ── */
  if (!m2OfferType) {
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

  /* ── Stale-context blocking state ── */
  if (isStale) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-5">
        <div className="max-w-md text-center space-y-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mx-auto">
            <AlertCircle size={28} className="text-amber-400" />
          </div>
          <div className="space-y-3">
            <h1 className="text-xl font-bold tracking-tight">Your Context Changed</h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Your offer or target context changed. Your Authority System needs to be
              rebuilt from the updated context.
            </p>
          </div>
          <button
            onClick={handleRebuild}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-bold text-sm transition-colors hover:opacity-90 cursor-pointer"
          >
            <RefreshCw size={14} />
            Reset and Rebuild Authority System
          </button>
        </div>
      </div>
    );
  }

  return (
    <Module3Shell>
      <StepContent />
    </Module3Shell>
  );
}

export default AuthoritySystem;
