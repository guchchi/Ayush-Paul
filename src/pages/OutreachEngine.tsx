import { useEffect } from 'react';
import { OutreachEngineShell } from '../components/outreach-engine-system/OutreachEngineShell';
import { StepContent } from '../components/outreach-engine-system/StepContent';
import { useOutreachEngineStore } from '../lib/outreach-engine-system';
import { useClientPipelineStore } from '../lib/client-pipeline-system';

export function OutreachEnginePage() {
  const setPhase5Context = useOutreachEngineStore((s) => s.setPhase5Context);
  const phase5Service = useOutreachEngineStore((s) => s.phase5Service);
  const reset = useOutreachEngineStore((s) => s.reset);

  const service = useClientPipelineStore((s) => s.phase4Service);
  const serviceLabel = useClientPipelineStore((s) => s.phase4ServiceLabel);
  const market = useClientPipelineStore((s) => s.phase4Market);
  const niche = useClientPipelineStore((s) => s.phase4Niche);
  const positioning = useClientPipelineStore((s) => s.phase4Positioning);
  const offerName = useClientPipelineStore((s) => s.phase4OfferName);
  const offerType = useClientPipelineStore((s) => s.phase4OfferType);
  const deliverables = useClientPipelineStore((s) => s.phase4Deliverables);
  const corePromise = useClientPipelineStore((s) => s.phase4UniqueMechanism);
  const authorityAngle = useClientPipelineStore((s) => s.phase4AuthorityAngle);
  const authorityProfile = useClientPipelineStore((s) => s.phase4AuthorityProfile);
  const sampleProject = useClientPipelineStore((s) => s.phase4SampleProject);
  const pipelineList = useClientPipelineStore((s) => s.pipelineList);

  useEffect(() => {
    if (!service) return;
    const ctxChanged = phase5Service !== null && phase5Service !== service;
    if (ctxChanged) reset();
    setPhase5Context({
      service,
      serviceLabel,
      market,
      niche,
      positioning: positioning || '',
      offerName: offerName || service || '',
      offerType,
      deliverables: deliverables ?? [],
      corePromise: corePromise || '',
      authorityAngle: authorityAngle || '',
      authorityProfile: {
        oneLinePositioning: authorityProfile?.oneLinePositioning || '',
        shortBio: authorityProfile?.shortBio || '',
        trustBullets: authorityProfile?.trustBullets || [],
        ctaLine: authorityProfile?.ctaLine || '',
      },
      portfolioAsset: sampleProject?.projectName || '',
      sampleProject: {
        projectName: sampleProject?.projectName || '',
        goal: sampleProject?.goal || '',
      },
      pipelineProspects: (pipelineList ?? []).map((p) => ({
        prospectName: p.prospectName,
        visibleProblem: p.visibleProblem,
        score: p.score,
        priority: p.priority,
        platform: p.platform,
      })),
    });
  }, [
    service, serviceLabel, market, niche, positioning, offerName, offerType,
    deliverables, corePromise, authorityAngle, authorityProfile,
    sampleProject, pipelineList,
    setPhase5Context, phase5Service, reset,
  ]);

  return (
    <OutreachEngineShell>
      <StepContent />
    </OutreachEngineShell>
  );
}
