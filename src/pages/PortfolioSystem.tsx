import { useEffect, useRef } from 'react';
import { PortfolioSystemShell } from '../components/portfolio-system/PortfolioSystemShell';
import { StepContent } from '../components/portfolio-system/StepContent';
import { usePortfolioSystemStore } from '../lib/portfolio-system';
import { useAuthoritySystemStore } from '../lib/authority-system';
import { useModule3Store } from '../lib/module3';
import type { UpstreamContext } from '../types/portfolio-system';

function buildUpstreamFromModule3(): UpstreamContext | null {
  const m3 = useModule3Store.getState();
  if (!m3.isCompleted || !m3.mod1ServiceId) return null;

  const bridge = m3.getModule4Context();

  return {
    mod1CareerTrackId: m3.mod1CareerTrackId,
    mod1ServiceId: m3.mod1ServiceId,
    mod1MarketId: m3.mod1MarketId,
    mod1NicheId: m3.mod1NicheId,
    mod1OfferId: m3.mod1OfferId,
    mod1Positioning: m3.mod1Positioning,
    mod2OfferType: m3.mod2OfferType,
    mod2Deliverables: m3.mod2Deliverables,
    mod2UniqueMechanism: m3.mod2UniqueMechanism,
    mod2ScopeLimits: m3.mod2ScopeLimits as unknown as Record<string, unknown>,
    mod2ValueAmplifier: m3.mod2ValueAmplifier,
    mod2PricingModel: m3.mod2PricingModel,
    mod2ProposalSummary: m3.mod2ProposalSummary as unknown as Record<string, unknown>,
    mod3AuthorityPosition: bridge.authorityPosition,
    mod3CoreTrustPromise: bridge.coreTrustPromise,
    mod3ProofPriorities: bridge.proofPriorities.map((p) => ({
      id: p.id, gapTitle: p.gapTitle,
      gapDescription: '',
      recommendedFormat: p.recommendedFormat,
    })),
    mod3ProofAssets: bridge.proofAssets.map((a) => {
      const full = m3.proofAssets.find((fa) => fa.id === a.id);
      return {
        id: a.id, priorityId: '',
        title: a.title, assetType: a.assetType,
        credibilityGapProved: a.credibilityGap,
        portfolioCopy: full?.portfolioCopy ?? { headline: '', description: '', proofStatement: '', cta: '' },
        presentationStructure: full?.presentationStructure ?? [],
        isAccepted: a.completionStatus,
        deliverables: full?.deliverables,
        completionChecklist: full?.completionChecklist,
      };
    }),
    mod3ProfileCopy: {
      professionalHeadline: bridge.professionalHeadline,
      shortBio: '',
      longBio: '',
      offerStatement: bridge.offerStatement,
      credibilityBullets: [],
      proofReferenceLine: bridge.proofReferenceLine,
      ctaLine: bridge.ctaLine,
    },
    mod3PortfolioCopy: {
      portfolioCta: bridge.portfolioCta,
      sections: m3.portfolioCopy.sections.map((s) => ({
        type: s.type, heading: s.heading, body: s.body, bullets: s.bullets,
      })),
    },
  };
}

function buildUpstreamFromLegacy(): UpstreamContext | null {
  const legacy = useAuthoritySystemStore.getState();
  const service = legacy.phase2Service;
  if (!service) return null;

  return {
    mod1CareerTrackId: null,
    mod1ServiceId: service,
    mod1MarketId: legacy.phase2Market,
    mod1NicheId: legacy.phase2Niche,
    mod1OfferId: null,
    mod1Positioning: legacy.phase2Positioning || '',
    mod2OfferType: legacy.phase2OfferType,
    mod2Deliverables: legacy.phase2Deliverables ?? [],
    mod2UniqueMechanism: legacy.phase2UniqueMechanism || '',
    mod2ScopeLimits: {},
    mod2ValueAmplifier: '',
    mod2PricingModel: null,
    mod2ProposalSummary: {},
    mod3AuthorityPosition: legacy.authorityAngle || '',
    mod3CoreTrustPromise: '',
    mod3ProofPriorities: [],
    mod3ProofAssets: (legacy.proofAssets ?? []).map((a) => ({
      id: '', priorityId: '', title: a.title || '', assetType: a.type || '',
      credibilityGapProved: '',
      portfolioCopy: { headline: '', description: '', proofStatement: '', cta: '' },
      presentationStructure: [], isAccepted: true,
    })),
    mod3ProfileCopy: {
      professionalHeadline: legacy.authorityProfile?.oneLinePositioning || '',
      shortBio: legacy.authorityProfile?.shortBio || '',
      longBio: '',
      offerStatement: '',
      credibilityBullets: legacy.authorityProfile?.trustBullets ?? [],
      proofReferenceLine: '',
      ctaLine: legacy.authorityProfile?.ctaLine || '',
    },
    mod3PortfolioCopy: { portfolioCta: '', sections: [] },
  };
}

export function PortfolioSystemPage() {
  const setPhase3Context = usePortfolioSystemStore((s) => s.setPhase3Context);
  const upstream = usePortfolioSystemStore((s) => s.upstream);
  const m3Completed = useModule3Store((s) => s.isCompleted);
  const m3ServiceId = useModule3Store((s) => s.mod1ServiceId);
  const legacyService = useAuthoritySystemStore((s) => s.phase2Service);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const m3Ctx = m3Completed ? buildUpstreamFromModule3() : null;
    if (m3Ctx) {
      setPhase3Context(m3Ctx);
      initialized.current = true;
      return;
    }

    const legacyCtx = buildUpstreamFromLegacy();
    if (legacyCtx) {
      setPhase3Context(legacyCtx);
      initialized.current = true;
    }
  }, [m3Completed, m3ServiceId, legacyService, setPhase3Context]);

  useEffect(() => {
    if (!upstream || !m3Completed) return;
    const fresh = buildUpstreamFromModule3();
    if (!fresh) return;
    setPhase3Context(fresh);
  }, [m3ServiceId]);

  if (!upstream) {
    return (
      <PortfolioSystemShell>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Complete Module 3 (Authority System) first to unlock Portfolio System.
        </div>
      </PortfolioSystemShell>
    );
  }

  return (
    <PortfolioSystemShell>
      <StepContent />
    </PortfolioSystemShell>
  );
}

export default PortfolioSystemPage;
