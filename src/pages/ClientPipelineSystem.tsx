import { useEffect } from 'react';
import { ClientPipelineShell } from '../components/client-pipeline-system/ClientPipelineShell';
import { StepContent } from '../components/client-pipeline-system/StepContent';
import { useClientPipelineStore } from '../lib/client-pipeline-system';
import { usePortfolioSystemStore } from '../lib/portfolio-system';

export function ClientPipelineSystemPage() {
  const setPhase4Context = useClientPipelineStore((s) => s.setPhase4Context);
  const phase4Service = useClientPipelineStore((s) => s.phase4Service);
  const reset = useClientPipelineStore((s) => s.reset);

  const service = usePortfolioSystemStore((s) => s.phase3Service);
  const serviceLabel = usePortfolioSystemStore((s) => s.phase3ServiceLabel);
  const market = usePortfolioSystemStore((s) => s.phase3Market);
  const niche = usePortfolioSystemStore((s) => s.phase3Niche);
  const positioning = usePortfolioSystemStore((s) => s.phase3Positioning);
  const offerName = usePortfolioSystemStore((s) => s.phase3OfferName);
  const offerType = usePortfolioSystemStore((s) => s.phase3OfferType);
  const deliverables = usePortfolioSystemStore((s) => s.phase3Deliverables);
  const uniqueMechanism = usePortfolioSystemStore((s) => s.phase3UniqueMechanism);
  const pricing = usePortfolioSystemStore((s) => s.phase3Pricing);
  const timeline = usePortfolioSystemStore((s) => s.phase3Timeline);
  const scopeDetails = usePortfolioSystemStore((s) => s.phase3ScopeDetails);
  const authorityAngle = usePortfolioSystemStore((s) => s.phase3AuthorityAngle);
  const proofAssets = usePortfolioSystemStore((s) => s.phase3ProofAssets);
  const portfolioAssets = usePortfolioSystemStore((s) => s.phase3PortfolioAssets);
  const trustBuilderChecklist = usePortfolioSystemStore((s) => s.phase3TrustBuilderChecklist);
  const contentAssets = usePortfolioSystemStore((s) => s.phase3ContentAssets);
  const authorityProfile = usePortfolioSystemStore((s) => s.phase3AuthorityProfile);
  const portfolioGoal = usePortfolioSystemStore((s) => s.portfolioGoal);
  const selectedAssets = usePortfolioSystemStore((s) => s.selectedAssetTypes);
  const caseStudy = usePortfolioSystemStore((s) => s.caseStudy);
  const sampleProject = usePortfolioSystemStore((s) => s.sampleProject);
  const portfolioCopy = usePortfolioSystemStore((s) => s.portfolioCopy);
  const portfolioReport = usePortfolioSystemStore((s) => s.portfolioReport);

  useEffect(() => {
    if (!service) return;
    const ctxChanged = phase4Service !== null && phase4Service !== service;
    if (ctxChanged) reset();
    setPhase4Context({
      service,
      serviceLabel,
      market,
      niche,
      positioning: positioning || '',
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
        trustBullets: authorityProfile?.trustBullets || [],
        ctaLine: authorityProfile?.ctaLine || '',
      },
      portfolioGoal: {
        goals: portfolioGoal?.goals || [],
        statement: portfolioGoal?.statement || '',
      },
      selectedAssets: selectedAssets ?? [],
      caseStudy: {
        projectTitle: caseStudy?.projectTitle || '',
        clientNicheType: caseStudy?.clientNicheType || '',
      },
      sampleProject: {
        projectName: sampleProject?.projectName || '',
        goal: sampleProject?.goal || '',
      },
      portfolioCopy: {
        headline: portfolioCopy?.headline || '',
        shortIntro: portfolioCopy?.shortIntro || '',
      },
      portfolioReport,
    });
  }, [
    service, serviceLabel, market, niche, positioning, offerName, offerType,
    deliverables, uniqueMechanism, pricing, timeline, scopeDetails,
    authorityAngle, proofAssets, portfolioAssets, trustBuilderChecklist,
    contentAssets, authorityProfile, portfolioGoal, selectedAssets,
    caseStudy, sampleProject, portfolioCopy, portfolioReport,
    setPhase4Context, phase4Service, reset,
  ]);

  return (
    <ClientPipelineShell>
      <StepContent />
    </ClientPipelineShell>
  );
}
