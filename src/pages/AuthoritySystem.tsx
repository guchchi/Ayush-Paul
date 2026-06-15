import { useEffect, useMemo } from 'react';
import { AuthoritySystemShell } from '../components/authority-system/AuthoritySystemShell';
import { StepContent } from '../components/authority-system/StepContent';
import { useAuthoritySystemStore } from '../lib/authority-system';
import { useOfferEngineeringStore, getEngineeringDataForService } from '../lib/offer-engineering';

export function AuthoritySystem() {
  const setPhase2Context = useAuthoritySystemStore((s) => s.setPhase2Context);
  const phase2Service = useAuthoritySystemStore((s) => s.phase2Service);
  const reset = useAuthoritySystemStore((s) => s.reset);
  const phase2OfferName = useAuthoritySystemStore((s) => s.phase2OfferName);

  const service = useOfferEngineeringStore((s) => s.service);
  const market = useOfferEngineeringStore((s) => s.market);
  const niche = useOfferEngineeringStore((s) => s.niche);
  const positioning = useOfferEngineeringStore((s) => s.positioning);
  const offerBlueprint = useOfferEngineeringStore((s) => s.offerBlueprint);
  const offerType = useOfferEngineeringStore((s) => s.offerType);
  const uniqueMechanism = useOfferEngineeringStore((s) => s.uniqueMechanism);
  const valueAmplifier = useOfferEngineeringStore((s) => s.valueAmplifier);
  const deliverables = useOfferEngineeringStore((s) => s.deliverables);
  const pricingModel = useOfferEngineeringStore((s) => s.pricingModel);
  const finalPrice = useOfferEngineeringStore((s) => s.finalPrice);
  const tieredPricing = useOfferEngineeringStore((s) => s.tieredPricing);
  const valueBasedPricing = useOfferEngineeringStore((s) => s.valueBasedPricing);
  const scopeLimits = useOfferEngineeringStore((s) => s.scopeLimits);

  const engineeringData = useMemo(
    () => (service ? getEngineeringDataForService(service) : undefined),
    [service],
  );
  const serviceLabel = engineeringData?.label ?? service;

  const pricingText = useMemo(() => {
    if (pricingModel === 'tiered') {
      return `$${tieredPricing.starterPrice} – $${tieredPricing.premiumPrice}`;
    }
    if (pricingModel === 'value_based') {
      return valueBasedPricing.suggestedPriceRange || `$${finalPrice}`;
    }
    return finalPrice ? `$${finalPrice}` : '';
  }, [pricingModel, tieredPricing, valueBasedPricing, finalPrice]);

  const offerTypeLabel =
    offerType === 'retainer' ? 'Retainer'
      : offerType === 'one_time_project' ? 'One-Time Project'
      : offerType === 'milestone_based' ? 'Milestone Based'
      : '';

  const scopeText = `${scopeLimits.revisionCount} revisions, ${scopeLimits.includedRounds} feedback rounds, ${scopeLimits.deliveryTime}`;

  useEffect(() => {
    if (!service) return;

    const newOfferName = offerBlueprint?.offerName || service || '';
    const ctxChanged = phase2Service !== null && phase2Service !== service;
    const nameChanged = phase2OfferName !== '' && phase2OfferName !== newOfferName;

    if (ctxChanged || nameChanged) {
      reset();
    }

    setPhase2Context({
      service,
      serviceLabel,
      market,
      niche,
      positioning,
      offerName: newOfferName,
      offerType: offerTypeLabel,
      corePromise: offerBlueprint?.corePromise || '',
      uniqueMechanism,
      deliverables: offerBlueprint?.deliverables?.length ? offerBlueprint.deliverables : deliverables,
      pricing: pricingText,
      timeline: scopeLimits.deliveryTime || '',
      scopeDetails: scopeText,
      valueAmplifier: valueAmplifier || '',
    });
  }, [service, serviceLabel, market, niche, positioning, offerBlueprint, offerTypeLabel, uniqueMechanism, valueAmplifier, deliverables, pricingText, scopeLimits, scopeText, setPhase2Context, reset, phase2Service, phase2OfferName]);

  return (
    <AuthoritySystemShell>
      <StepContent />
    </AuthoritySystemShell>
  );
}

export default AuthoritySystem;
