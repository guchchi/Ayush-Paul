import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { DeliverySystemShell } from '../components/delivery-system/DeliverySystemShell';
import { DeliverySystemIntroPage } from '../components/delivery-system/DeliverySystemIntroPage';
import { StepContent } from '../components/delivery-system/StepContent';
import { LockedModuleWorkspace } from '../components/workspace/LockedModuleWorkspace';
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
    <DeliverySystemShell>
      <LockedModuleWorkspace 
        config={{
          moduleNumber: 7,
          moduleName: "Client Delivery System",
          status: "In Development",
          whyItMatters: "This module ensures you can deliver high-quality work without burning out.",
          progress: 10,
          unlockFeatures: [
            { title: "Service Fulfillment SOPs", description: "Standard operating procedures for delivery." },
            { title: "Client Onboarding Portals", description: "Seamless onboarding experiences." },
            { title: "Automated Feedback Loops", description: "Gather client feedback automatically." },
            { title: "Scope Creep Protection", description: "Contracts and boundaries to protect your time." }
          ],
          milestones: [
            { title: "Research", status: "in-progress" },
            { title: "Content", status: "pending" },
            { title: "Design", status: "pending" },
            { title: "Development", status: "pending" },
            { title: "Testing", status: "pending" }
          ],
          previousModuleName: "Outreach Engine",
          previousModulePath: "/workspace/outreach-engine"
        }}
      />
    </DeliverySystemShell>
  );
}

export default DeliverySystemPage;
