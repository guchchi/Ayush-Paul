import { useEffect } from 'react';
import { PortfolioSystemShell } from '../components/portfolio-system/PortfolioSystemShell';
import { StepContent } from '../components/portfolio-system/StepContent';
import { usePortfolioSystemStore } from '../lib/portfolio-system';
import { useAuthoritySystemStore } from '../lib/authority-system';

export function PortfolioSystemPage() {
  const setPhase3Context = usePortfolioSystemStore((s) => s.setPhase3Context);
  const phase3Service = usePortfolioSystemStore((s) => s.phase3Service);
  const reset = usePortfolioSystemStore((s) => s.reset);

  const service = useAuthoritySystemStore((s) => s.phase2Service);
  const serviceLabel = useAuthoritySystemStore((s) => s.phase2ServiceLabel);
  const market = useAuthoritySystemStore((s) => s.phase2Market);
  const niche = useAuthoritySystemStore((s) => s.phase2Niche);
  const positioning = useAuthoritySystemStore((s) => s.phase2Positioning);
  const offerName = useAuthoritySystemStore((s) => s.phase2OfferName);
  const offerType = useAuthoritySystemStore((s) => s.phase2OfferType);
  const deliverables = useAuthoritySystemStore((s) => s.phase2Deliverables);
  const uniqueMechanism = useAuthoritySystemStore((s) => s.phase2UniqueMechanism);
  const pricing = useAuthoritySystemStore((s) => s.phase2Pricing);
  const timeline = useAuthoritySystemStore((s) => s.phase2Timeline);
  const scopeDetails = useAuthoritySystemStore((s) => s.phase2ScopeDetails);
  const authorityAngle = useAuthoritySystemStore((s) => s.authorityAngle);
  const proofAssets = useAuthoritySystemStore((s) => s.proofAssets);
  const portfolioAssets = useAuthoritySystemStore((s) => s.portfolioAssets);
  const trustBuilderChecklist = useAuthoritySystemStore((s) => s.trustBuilderChecklist);
  const contentAssets = useAuthoritySystemStore((s) => s.contentAssets);
  const authorityProfile = useAuthoritySystemStore((s) => s.authorityProfile);

  useEffect(() => {
    if (!service) return;

    const ctxChanged = phase3Service !== null && phase3Service !== service;

    if (ctxChanged) {
      reset();
    }

    setPhase3Context({
      service,
      serviceLabel,
      market,
      niche,
      positioning,
      offerName: offerName || service || '',
      offerType,
      deliverables: deliverables ?? [],
      uniqueMechanism: uniqueMechanism || '',
      pricing: pricing || '',
      timeline: timeline || '',
      scopeDetails: scopeDetails || '',
      authorityAngle: authorityAngle || '',
      proofAssets: (proofAssets ?? []).map((a) => ({ title: a.title, type: a.type })),
      portfolioAssets: (portfolioAssets ?? []).map((a) => ({ name: a.name })),
      trustBuilderChecklist: (trustBuilderChecklist ?? []).map((i) => ({ label: i.label, status: i.status })),
      contentAssets: (contentAssets ?? []).map((a) => ({ title: a.title })),
      authorityProfile: {
        oneLinePositioning: authorityProfile?.oneLinePositioning || '',
        shortBio: authorityProfile?.shortBio || '',
        trustBullets: authorityProfile?.trustBullets ?? [],
        ctaLine: authorityProfile?.ctaLine || '',
      },
    });
  }, [service, serviceLabel, market, niche, positioning, offerName, offerType,
      deliverables, uniqueMechanism, pricing, timeline, scopeDetails,
      authorityAngle, proofAssets, portfolioAssets, trustBuilderChecklist,
      contentAssets, authorityProfile, setPhase3Context, reset, phase3Service]);

  return (
    <PortfolioSystemShell>
      <StepContent />
    </PortfolioSystemShell>
  );
}

export default PortfolioSystemPage;
