import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const phase1OfferId = useOfferEngineeringStore((s) => s.phase1OfferId);

  const serviceId = useOpportunityMapStore((s) => s.serviceId);
  const marketLabel = useOpportunityMapStore((s) => s.marketLabel);
  const nicheLabel = useOpportunityMapStore((s) => s.nicheLabel);
  const positioning = useOpportunityMapStore((s) => s.positioning);
  const offerId = useOpportunityMapStore((s) => s.offerId);

  useEffect(() => {
    // Phase 1 context changed → reset Phase 2 for new opportunity
    if (offerId && phase1OfferId !== null && phase1OfferId !== offerId) {
      reset();
    }

    // Always hydrate Phase 1 context labels (idempotent if unchanged)
    if (serviceId) setService(serviceId);
    if (marketLabel) setMarket(marketLabel);
    if (nicheLabel) setNiche(nicheLabel);
    if (positioning) setPositioning(positioning);
    if (offerId) {
      setOfferId(offerId);
      setPhase1OfferId(offerId);
    }
  }, [serviceId, marketLabel, nicheLabel, positioning, offerId, setService, setMarket, setNiche, setPositioning, setOfferId, setPhase1OfferId, reset, phase1OfferId]);

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

