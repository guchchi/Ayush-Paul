import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { OfferEngineeringShell } from '../components/offer-engineering/OfferEngineeringShell';
import { StepContent } from '../components/offer-engineering/StepContent';
import { OfferEngineeringIntroPage } from '../components/offer-engineering/OfferEngineeringIntroPage';
import { useOfferEngineeringStore } from '../lib/offer-engineering';
import { useOpportunityMapStore } from '../lib/opportunity-map';

export function OfferEngineering() {
  const navigate = useNavigate();
  
  // Safe, non-destructive check to see if module has started
  const [moduleStarted, setModuleStarted] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('blueprint-module2-started');
      return stored === 'true';
    } catch {
      return false;
    }
  });

  const setService = useOfferEngineeringStore((s) => s.setService);
  const setMarket = useOfferEngineeringStore((s) => s.setMarket);
  const setNiche = useOfferEngineeringStore((s) => s.setNiche);
  const setPositioning = useOfferEngineeringStore((s) => s.setPositioning);
  const setOfferId = useOfferEngineeringStore((s) => s.setOfferId);
  const setPhase1OfferId = useOfferEngineeringStore((s) => s.setPhase1OfferId);
  const reset = useOfferEngineeringStore((s) => s.reset);
  const completedSteps = useOfferEngineeringStore((s) => s.completedSteps);

  const serviceId = useOpportunityMapStore((s) => s.serviceId);
  const marketId = useOpportunityMapStore((s) => s.marketId);
  const marketLabel = useOpportunityMapStore((s) => s.marketLabel);
  const nicheId = useOpportunityMapStore((s) => s.nicheId);
  const nicheLabel = useOpportunityMapStore((s) => s.nicheLabel);
  const positioning = useOpportunityMapStore((s) => s.positioning);
  const offerId = useOpportunityMapStore((s) => s.offerId);

  const prevFingerprint = useRef<string | null>(null);

  useEffect(() => {
    const fingerprint = [serviceId ?? '', marketId ?? '', nicheId ?? '', offerId ?? ''].join('|');

    if (prevFingerprint.current !== null && prevFingerprint.current !== fingerprint && completedSteps.length > 0) {
      reset();
    }

    prevFingerprint.current = fingerprint;

    // Always hydrate Phase 1 context labels (idempotent if unchanged)
    if (serviceId) setService(serviceId);
    if (marketLabel) setMarket(marketLabel);
    if (nicheLabel) setNiche(nicheLabel);
    if (positioning) setPositioning(positioning);
    if (offerId) {
      setOfferId(offerId);
      setPhase1OfferId(offerId);
    }
  }, [serviceId, marketId, nicheId, offerId, marketLabel, nicheLabel, positioning, setService, setMarket, setNiche, setPositioning, setOfferId, setPhase1OfferId, reset, completedSteps]);

  const handleStart = () => {
    setModuleStarted(true);
    try {
      localStorage.setItem('blueprint-module2-started', 'true');
    } catch {
      // ignore
    }
  };

  const handleBackToBlueprint = () => {
    navigate('/blueprints/get-your-first-3-clients');
  };

  const handleBackToOverview = () => {
    setModuleStarted(false);
    try {
      localStorage.setItem('blueprint-module2-started', 'false');
    } catch {
      // ignore
    }
  };

  // Guard: Module 1 context is required
  if (!serviceId) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex items-center justify-center px-5">
        <div className="max-w-md text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto">
            <AlertCircle size={28} className="text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold">Opportunity Mapping Required</h1>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Complete Module 1 (Opportunity Mapping) first to unlock Offer Engineering.
            Select your service, market, and niche to generate a tailored offer blueprint.
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

  if (!moduleStarted) {
    return (
      <OfferEngineeringIntroPage
        onStart={handleStart}
        onBackToBlueprint={handleBackToBlueprint}
      />
    );
  }

  return (
    <OfferEngineeringShell onBack={handleBackToOverview}>
      <StepContent />
    </OfferEngineeringShell>
  );
}

export default OfferEngineering;

