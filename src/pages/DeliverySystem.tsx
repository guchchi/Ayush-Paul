import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { DeliverySystemShell } from '../components/delivery-system/DeliverySystemShell';
import { DeliverySystemIntroPage } from '../components/delivery-system/DeliverySystemIntroPage';
import { StepContent } from '../components/delivery-system/StepContent';
import { PremiumComingSoon } from '../components/workspace/PremiumComingSoon';
import { useDeliverySystemStore } from '../lib/delivery-system';
import { buildDeliveryUpstreamContext, computeDeliveryFingerprint } from '../lib/delivery-system/context';

const MODULE7_STARTED_KEY = 'blueprint-module7-started';

export function DeliverySystemPage() {
  const navigate = useNavigate();

  const [moduleStarted, setModuleStarted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(MODULE7_STARTED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const setUpstreamContext = useDeliverySystemStore((s) => s.setUpstreamContext);
  const upstream = useDeliverySystemStore((s) => s.upstream);
  const staleSince = useDeliverySystemStore((s) => s.staleSince);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    const ctx = buildDeliveryUpstreamContext();
    if (ctx.serviceId) {
      const fp = computeDeliveryFingerprint(ctx);
      setUpstreamContext(ctx, fp);
      initialized.current = true;
    }
  }, [setUpstreamContext]);

  const handleStart = useCallback(() => {
    setModuleStarted(true);
    try {
      localStorage.setItem(MODULE7_STARTED_KEY, 'true');
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
      localStorage.setItem(MODULE7_STARTED_KEY, 'false');
    } catch {
      // ignore
    }
  }, []);

  /* ── Guard: No upstream context ── */
  // We bypass guards in Beta to show the Coming Soon page to everyone
  // if (!upstream) {
  //   return (
  //     ...
  //   );
  // }

  /* ── Stale warning ── */
  // if (staleSince) {
  //   return (
  //     ...
  //   );
  // }

  /* ── Intro page for first-time / non-started users ── */
  // if (!moduleStarted) {
  //   return (
  //     ...
  //   );
  // }

  return (
    <PremiumComingSoon 
      config={{
        moduleNumber: 7,
        moduleName: "Client Delivery System",
        tagline: "Currently in Development",
        description: "We are crafting this module carefully to ensure it delivers the best learning experience.",
        whyItMatters: "This module ensures you can consistently deliver on your promises, retaining clients and generating referrals.",
        previewFeatures: [
          { name: "Service Fulfillment SOPs", description: "Standard operating procedures for delivery." },
          { name: "Client Onboarding Portals", description: "White-labeled dashboards for your clients." },
          { name: "Automated Feedback Loops", description: "Collect testimonials on autopilot." },
          { name: "Scope Creep Protection", description: "Frameworks to keep projects profitable." }
        ],
        developmentProgress: {
          research: 'Active',
          content: 'Pending',
          design: 'Pending',
          development: 'Pending',
          testing: 'Pending'
        },
        estimatedRelease: "Planned for Version 1.0",
        previousModulePath: "/workspace/outreach-engine"
      }}
    />
  );
}

export default DeliverySystemPage;
