import { useEffect } from 'react';
import { OutreachEngineShell } from '../components/outreach-engine-system/OutreachEngineShell';
import { StepContent } from '../components/outreach-engine-system/StepContent';
import { PremiumComingSoon } from '../components/workspace/PremiumComingSoon';
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
    <PremiumComingSoon 
      config={{
        moduleNumber: 6,
        moduleName: "Outreach Engine",
        tagline: "Currently in Development",
        description: "We are crafting this module carefully to ensure it delivers the best learning experience.",
        whyItMatters: "This module empowers you to launch targeted, multi-channel outreach campaigns that actually get responses.",
        previewFeatures: [
          { name: "Cold Email Sequences", description: "High-converting templates based on psychology." },
          { name: "Multi-Channel Follow-up", description: "Automated LinkedIn + Email workflows." },
          { name: "List Building Strategies", description: "Find the right decision-makers effortlessly." },
          { name: "Objection Handling Scripts", description: "Pre-written responses for common pushback." }
        ],
        developmentProgress: {
          research: 'Complete',
          content: 'In Progress',
          design: 'Pending',
          development: 'Pending',
          testing: 'Pending'
        },
        estimatedRelease: "Planned for Version 1.0",
        previousModulePath: "/workspace/client-pipeline"
      }}
    />
  );
}
