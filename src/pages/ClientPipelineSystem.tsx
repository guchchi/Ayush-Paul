import { useEffect, useMemo } from 'react';
import { ClientPipelineShell } from '../components/client-pipeline-system/ClientPipelineShell';
import { StepContent } from '../components/client-pipeline-system/StepContent';
import { PremiumComingSoon } from '../components/workspace/PremiumComingSoon';
import { useClientPipelineStore } from '../lib/client-pipeline-system';
import { usePortfolioSystemStore } from '../lib/portfolio-system';
import { buildModule5Bridge } from '../lib/portfolio-system/composer';
import { computeUpstreamFingerprint, normalizeModule5Context, composeClientPipelinePack } from '../lib/client-pipeline-system';

export function ClientPipelineSystemPage() {
  const setPhase4Context = useClientPipelineStore((s) => s.setPhase4Context);
  const setBridgeState = useClientPipelineStore((s) => s.setBridgeState);
  const setPipelinePack = useClientPipelineStore((s) => s.setPipelinePack);
  const phase4Service = useClientPipelineStore((s) => s.phase4Service);
  const upstreamFingerprint = useClientPipelineStore((s) => s.upstreamFingerprint);
  const bridgeState = useClientPipelineStore((s) => s.bridgeState);
  const setUpstreamFingerprint = useClientPipelineStore((s) => s.setUpstreamFingerprint);
  const reset = useClientPipelineStore((s) => s.reset);

  const upstream = usePortfolioSystemStore((s) => s.upstream);
  const portfolioDirection = usePortfolioSystemStore((s) => s.portfolioDirection);
  const portfolioCopy = usePortfolioSystemStore((s) => s.portfolioCopy);
  const buildPack = usePortfolioSystemStore((s) => s.buildPack);

  // Build bridge context from Module 4 build pack
  const bridge = useMemo(() => buildModule5Bridge(buildPack), [buildPack]);

  useEffect(() => {
    if (!upstream?.mod1ServiceId) return;
    const service = upstream.mod1ServiceId;

    const newFingerprint = computeUpstreamFingerprint(
      service,
      upstream.mod1MarketId || '',
      upstream.mod1NicheId || '',
      upstream.mod1Positioning || '',
      upstream.mod3ProfileCopy.professionalHeadline || '',
      upstream.mod2OfferType || '',
      upstream.mod2Deliverables ?? [],
      upstream.mod2UniqueMechanism || '',
      upstream.mod3AuthorityPosition || '',
      upstream.mod3ProofAssets.map((a) => ({ title: a.title, type: a.assetType })),
      {
        portfolioReady: bridge.portfolioReady,
        portfolioDestination: bridge.portfolioDestination,
        portfolioUrl: bridge.portfolioUrl || '',
        featuredProofAssetId: bridge.featuredProofAssetId,
        featuredProofTitle: bridge.featuredProofTitle,
        featuredProofUrl: bridge.featuredProofUrl || '',
        portfolioCta: bridge.portfolioCta,
        portfolioHeadline: bridge.portfolioHeadline,
      },
    );

    // Only update and recompose if fingerprint changed
    if (newFingerprint !== upstreamFingerprint) {
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

      // Set bridge state from Module 4
      setBridgeState({
        portfolioReady: bridge.portfolioReady,
        portfolioDestination: bridge.portfolioDestination,
        portfolioUrl: bridge.portfolioUrl || '',
        featuredProofAssetId: bridge.featuredProofAssetId,
        featuredProofTitle: bridge.featuredProofTitle,
        featuredProofUrl: bridge.featuredProofUrl || '',
        portfolioCta: bridge.portfolioCta,
        portfolioHeadline: bridge.portfolioHeadline,
      });

      // Build normalized context
      const m5ctx = normalizeModule5Context(
        service,
        service.replace(/_/g, ' '),
        upstream.mod1MarketId || '',
        upstream.mod1NicheId || '',
        upstream.mod1Positioning || '',
        upstream.mod3ProfileCopy.professionalHeadline || '',
        upstream.mod2OfferType || '',
        upstream.mod2Deliverables ?? [],
        upstream.mod2UniqueMechanism || '',
        upstream.mod3AuthorityPosition || '',
        upstream.mod3ProofAssets.map((a) => ({ title: a.title, type: a.assetType })),
        {
          oneLinePositioning: upstream.mod3ProfileCopy.professionalHeadline || '',
          shortBio: upstream.mod3ProfileCopy.shortBio || '',
          trustBullets: upstream.mod3ProfileCopy.credibilityBullets || [],
          ctaLine: upstream.mod3ProfileCopy.ctaLine || '',
        },
        {
          portfolioReady: bridge.portfolioReady,
          portfolioDestination: bridge.portfolioDestination,
          portfolioUrl: bridge.portfolioUrl || '',
          featuredProofAssetId: bridge.featuredProofAssetId,
          featuredProofTitle: bridge.featuredProofTitle,
          featuredProofUrl: bridge.featuredProofUrl || '',
          portfolioCta: bridge.portfolioCta,
          portfolioHeadline: bridge.portfolioHeadline,
        },
      );

      // Compose pipeline pack
      const pack = composeClientPipelinePack(m5ctx);
      setPipelinePack(pack);

      // Update fingerprint atomically after successful composition
      setUpstreamFingerprint(newFingerprint);
    }
  }, [
    upstream, portfolioDirection, portfolioCopy, buildPack, bridge,
    setPhase4Context, setBridgeState, setPipelinePack, setUpstreamFingerprint,
    phase4Service, reset, upstreamFingerprint,
  ]);

  return (
    <PremiumComingSoon 
      config={{
        moduleNumber: 5,
        moduleName: "Client Pipeline System",
        tagline: "Currently in Development",
        description: "We are crafting this module carefully to ensure it delivers the best learning experience.",
        whyItMatters: "This module turns your portfolio into an active pipeline that captures, scores, and nurtures high-value leads.",
        previewFeatures: [
          { name: "Lead Scoring Algorithm", description: "Automatically qualify prospects based on intent." },
          { name: "Pipeline Automations", description: "Set up frictionless intake sequences." },
          { name: "CRM Templates", description: "Pre-built Notion/Airtable tracking systems." },
          { name: "Qualification Workflows", description: "Scripts to weed out bad fit clients early." }
        ],
        developmentProgress: {
          research: 'Near Complete',
          content: 'In Progress',
          design: 'Active',
          development: 'Pending',
          testing: 'Pending'
        },
        estimatedRelease: "Planned for Version 1.0",
        previousModulePath: "/workspace/portfolio-system"
      }}
    />
  );
}
