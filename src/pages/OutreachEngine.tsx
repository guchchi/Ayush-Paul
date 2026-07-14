import { useEffect } from 'react';
import { OutreachEngineShell } from '../components/outreach-engine-system/OutreachEngineShell';
import { StepContent } from '../components/outreach-engine-system/StepContent';
import { useOutreachEngineStore } from '../lib/outreach-engine-system';
import { useClientPipelineStore } from '../lib/client-pipeline-system';
import { buildModule6UpstreamContext, computeModule6Fingerprint } from '../lib/outreach-engine-system/upstream';

export function OutreachEnginePage() {
  const setUpstreamContext = useOutreachEngineStore((s) => s.setUpstreamContext);
  const upstreamFingerprint = useOutreachEngineStore((s) => s.upstreamFingerprint);

  // Read M5 store — read-only
  const service = useClientPipelineStore((s) => s.phase4Service);
  const serviceLabel = useClientPipelineStore((s) => s.phase4ServiceLabel);
  const market = useClientPipelineStore((s) => s.phase4Market);
  const niche = useClientPipelineStore((s) => s.phase4Niche);
  const offerName = useClientPipelineStore((s) => s.phase4OfferName);
  const pipelinePack = useClientPipelineStore((s) => s.pipelinePack);
  const pipelineList = useClientPipelineStore((s) => s.pipelineList);

  useEffect(() => {
    if (!service) return;

    // Build canonical upstream context via adapter
    const context = buildModule6UpstreamContext(pipelinePack, pipelineList, {
      serviceId: service,
      serviceLabel,
      market,
      niche,
      offerName,
    });

    // Compute deterministic fingerprint
    const fingerprint = computeModule6Fingerprint(context);

    // Update only when materially changed
    if (fingerprint !== upstreamFingerprint) {
      setUpstreamContext(context, fingerprint);
    }
  }, [
    service, serviceLabel, market, niche, offerName,
    pipelinePack, pipelineList,
    upstreamFingerprint, setUpstreamContext,
  ]);

  return (
    <OutreachEngineShell>
      <StepContent />
    </OutreachEngineShell>
  );
}
