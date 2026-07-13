import { useEffect } from 'react';
import { ClientPipelineShell } from '../components/client-pipeline-system/ClientPipelineShell';
import { StepContent } from '../components/client-pipeline-system/StepContent';
import { useClientPipelineStore } from '../lib/client-pipeline-system';
import { usePortfolioSystemStore } from '../lib/portfolio-system';

export function ClientPipelineSystemPage() {
  const setPhase4Context = useClientPipelineStore((s) => s.setPhase4Context);
  const phase4Service = useClientPipelineStore((s) => s.phase4Service);
  const reset = useClientPipelineStore((s) => s.reset);

  const upstream = usePortfolioSystemStore((s) => s.upstream);
  const portfolioDirection = usePortfolioSystemStore((s) => s.portfolioDirection);
  const portfolioCopy = usePortfolioSystemStore((s) => s.portfolioCopy);
  const buildPack = usePortfolioSystemStore((s) => s.buildPack);

  useEffect(() => {
    if (!upstream?.mod1ServiceId) return;
    const service = upstream.mod1ServiceId;
    const ctxChanged = phase4Service !== null && phase4Service !== service;
    if (ctxChanged) reset();

    setPhase4Context({
      service,
      serviceLabel: service.replace(/_/g, ' '),
      market: upstream.mod1MarketId || '',
      niche: upstream.mod1NicheId || '',
      positioning: upstream.mod1Positioning || '',
      offerName: upstream.mod3ProfileCopy.professionalHeadline || service || '',
      offerType: upstream.mod2OfferType || '',
      deliverables: upstream.mod2Deliverables ?? [],
      uniqueMechanism: upstream.mod2UniqueMechanism || '',
      pricing: '',
      timeline: '',
      scopeDetails: '',
      authorityAngle: upstream.mod3AuthorityPosition || '',
      proofAssets: upstream.mod3ProofAssets.map((a) => ({ title: a.title, type: a.assetType })),
      portfolioAssets: [],
      trustBuilderChecklist: [],
      contentAssets: [],
      authorityProfile: {
        oneLinePositioning: upstream.mod3ProfileCopy.professionalHeadline || '',
        shortBio: upstream.mod3ProfileCopy.shortBio || '',
        trustBullets: upstream.mod3ProfileCopy.credibilityBullets || [],
        ctaLine: upstream.mod3ProfileCopy.ctaLine || '',
      },
      portfolioGoal: {
        goals: [],
        statement: portfolioDirection?.portfolioPromise || '',
      },
      selectedAssets: [],
      caseStudy: { projectTitle: '', clientNicheType: '' },
      sampleProject: { projectName: '', goal: '' },
      portfolioCopy: {
        headline: portfolioCopy?.headline || '',
        shortIntro: portfolioCopy?.shortIntro || '',
      },
      portfolioReport: null,
    });
  }, [
    upstream, portfolioDirection, portfolioCopy, buildPack,
    setPhase4Context, phase4Service, reset,
  ]);

  return (
    <ClientPipelineShell>
      <StepContent />
    </ClientPipelineShell>
  );
}
