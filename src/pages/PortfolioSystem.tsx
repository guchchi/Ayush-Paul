import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { PortfolioSystemShell } from '../components/portfolio-system/PortfolioSystemShell';
import { PortfolioSystemIntroPage } from '../components/portfolio-system/PortfolioSystemIntroPage';
import { StepContent } from '../components/portfolio-system/StepContent';
import { PremiumComingSoon } from '../components/workspace/PremiumComingSoon';
import { usePortfolioSystemStore } from '../lib/portfolio-system';
import { useAuthoritySystemStore } from '../lib/authority-system';
import { useModule3Store } from '../lib/module3';
import type { UpstreamContext } from '../types/portfolio-system';

const MODULE4_STARTED_KEY = 'blueprint-module4-started';

function buildUpstreamFromModule3(): UpstreamContext | null {
  const m3 = useModule3Store.getState();
  if (!m3.isCompleted || !m3.mod1ServiceId) return null;

  return m3.getModule4Context() as UpstreamContext;
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
  const navigate = useNavigate();

  const [moduleStarted, setModuleStarted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(MODULE4_STARTED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const setPhase3Context = usePortfolioSystemStore((s) => s.setPhase3Context);
  const upstream = usePortfolioSystemStore((s) => s.upstream);
  const m3Completed = useModule3Store((s) => s.isCompleted);
  const m3ServiceId = useModule3Store((s) => s.mod1ServiceId);
  const legacyService = useAuthoritySystemStore((s) => s.phase2Service);
  const initialized = useRef(false);

  /* ── Stable fingerprint of all M3→M4 bridge fields ── */
  const m3BridgeFingerprint = useModule3Store(
    (s) => {
      const bridge = s.getModule4Context();
      const pa = s.proofAssets;
      return [
        s.mod1ServiceId,
        s.mod1MarketId,
        s.mod1NicheId,
        s.mod1Positioning,
        s.mod2OfferType,
        s.mod2Deliverables.join(','),
        s.mod2UniqueMechanism,
        s.mod2ValueAmplifier ?? '',
        bridge.mod3AuthorityPosition,
        bridge.mod3CoreTrustPromise,
        bridge.mod3ProofPriorities.map((p) => `${p.id}|${p.gapTitle}|${p.recommendedFormat}`).join(','),
        bridge.mod3ProofAssets.map((a) => `${a.id}|${a.title}|${a.assetType}|${a.credibilityGapProved}|${a.isAccepted}`).join(','),
        bridge.mod3ProfileCopy.professionalHeadline,
        bridge.mod3ProfileCopy.offerStatement,
        bridge.mod3ProfileCopy.proofReferenceLine,
        bridge.mod3ProfileCopy.ctaLine,
        bridge.mod3PortfolioCopy.portfolioCta,
        pa.map((a) => `${a.id}|${a.assetType}|${JSON.stringify(a.portfolioCopy)}|${JSON.stringify(a.presentationStructure)}|${JSON.stringify(a.deliverables)}|${JSON.stringify(a.completionChecklist)}`).join(','),
        bridge.mod3PortfolioCopy.sections.map((s) => `${s.type}|${s.heading}|${s.body}|${JSON.stringify(s.bullets)}`).join(','),
      ].join('‖');
    },
  );

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
  }, [m3BridgeFingerprint]);

  const handleStart = useCallback(() => {
    setModuleStarted(true);
    try {
      localStorage.setItem(MODULE4_STARTED_KEY, 'true');
    } catch {
      // ignore
    }
  }, []);

  const handleBackToBlueprint = useCallback(() => {
    navigate('/blueprints/get-your-first-3-clients');
  }, [navigate]);

  const handleBackToOverview = useCallback(() => {
    setModuleStarted(false);
    try {
      localStorage.setItem(MODULE4_STARTED_KEY, 'false');
    } catch {
      // ignore
    }
  }, []);

  /* ── Guard: No Module 3 context ── */
  // We bypass guards in Beta to show the Coming Soon page to everyone
  // if (!upstream) {
  //   return (
  //     <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex items-center justify-center px-5">
  //       ...
  //     </div>
  //   );
  // }

  /* ── Intro page for first-time / non-started users ── */
  // if (!moduleStarted) {
  //   return (
  //     <PortfolioSystemIntroPage
  //       onStart={handleStart}
  //       onBackToBlueprint={handleBackToBlueprint}
  //     />
  //   );
  // }

  return (
    <PremiumComingSoon 
      config={{
        moduleNumber: 4,
        moduleName: "Portfolio System",
        tagline: "Currently in Development",
        description: "We are crafting this module carefully to ensure it delivers the best learning experience.",
        whyItMatters: "This module transforms your expertise into a portfolio that builds trust and attracts high-ticket clients effortlessly.",
        previewFeatures: [
          { name: "AI Portfolio Generator", description: "Generate professional portfolios in seconds using your Module 3 assets." },
          { name: "Case Study Builder", description: "Structure client wins into compelling stories." },
          { name: "Portfolio Templates", description: "Premium layouts designed for conversion." },
          { name: "Authority Showcase", description: "Highlight your credibility gaps perfectly." }
        ],
        developmentProgress: {
          research: 'Complete',
          content: 'Near Complete',
          design: 'In Progress',
          development: 'Active',
          testing: 'Pending'
        },
        estimatedRelease: "Planned for Version 1.0",
        previousModulePath: "/workspace/authority-system"
      }}
    />
  );
}

export default PortfolioSystemPage;
