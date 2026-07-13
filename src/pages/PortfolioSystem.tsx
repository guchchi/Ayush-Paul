import { useEffect } from 'react';
import { PortfolioSystemShell } from '../components/portfolio-system/PortfolioSystemShell';
import { StepContent } from '../components/portfolio-system/StepContent';
import { usePortfolioSystemStore } from '../lib/portfolio-system';
import { useAuthoritySystemStore } from '../lib/authority-system';
import { useModule3Store } from '../lib/module3';

export function PortfolioSystemPage() {
  const setPhase3Context = usePortfolioSystemStore((s) => s.setPhase3Context);
  const phase3Service = usePortfolioSystemStore((s) => s.phase3Service);
  const reset = usePortfolioSystemStore((s) => s.reset);

  /* ── New Module 3 store — takes priority when completed ── */
  const m3Completed = useModule3Store((s) => s.isCompleted);
  const m3ServiceId = useModule3Store((s) => s.mod1ServiceId);
  const m3MarketId = useModule3Store((s) => s.mod1MarketId);
  const m3NicheId = useModule3Store((s) => s.mod1NicheId);
  const m3Positioning = useModule3Store((s) => s.mod1Positioning);
  const m3OfferType = useModule3Store((s) => s.mod2OfferType);
  const m3Deliverables = useModule3Store((s) => s.mod2Deliverables);
  const m3UniqueMechanism = useModule3Store((s) => s.mod2UniqueMechanism);
  const m3CoreTrustPromise = useModule3Store((s) => s.coreTrustPromise);
  const m3ProofAssets = useModule3Store((s) => s.proofAssets);
  const m3ProfileCopy = useModule3Store((s) => s.profileCopy);

  /* ── Old store — fallback when new Module 3 is not completed ── */
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

  /* ── New Module 3 store effect — takes priority ── */
  useEffect(() => {
    if (!m3Completed || !m3ServiceId) return;

    setPhase3Context({
      service: m3ServiceId,
      serviceLabel: m3ServiceId,
      market: m3MarketId,
      niche: m3NicheId,
      positioning: m3Positioning,
      offerName: m3ProfileCopy.professionalHeadline,
      offerType: m3OfferType,
      deliverables: m3Deliverables ?? [],
      uniqueMechanism: m3UniqueMechanism || '',
      pricing: '',
      timeline: '',
      scopeDetails: '',
      authorityAngle: m3CoreTrustPromise || '',
      proofAssets: m3ProofAssets.map((a) => ({ title: a.title, type: a.assetType })),
      portfolioAssets: [],
      trustBuilderChecklist: [],
      contentAssets: [],
      authorityProfile: {
        oneLinePositioning: m3ProfileCopy.professionalHeadline,
        shortBio: m3ProfileCopy.shortBio,
        trustBullets: m3ProfileCopy.credibilityBullets,
        ctaLine: m3ProfileCopy.ctaLine,
      },
    });
  }, [m3Completed, m3ServiceId, m3MarketId, m3NicheId, m3Positioning,
      m3OfferType, m3Deliverables, m3UniqueMechanism, m3CoreTrustPromise,
      m3ProofAssets, m3ProfileCopy, setPhase3Context]);

  /* ── Old store effect — only runs when new Module 3 is NOT completed ── */
  useEffect(() => {
    if (m3Completed) return;
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
  }, [m3Completed, service, serviceLabel, market, niche, positioning, offerName, offerType,
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
