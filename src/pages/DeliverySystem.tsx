import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { DeliverySystemShell } from '../components/delivery-system/DeliverySystemShell';
import { DeliverySystemIntroPage } from '../components/delivery-system/DeliverySystemIntroPage';
import { StepContent } from '../components/delivery-system/StepContent';
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
  if (!upstream) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex items-center justify-center px-5">
        <div className="max-w-md text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto">
            <AlertCircle size={28} className="text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold">Outreach Engine Required</h1>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Complete the Outreach Engine (Module 6) first to unlock the Client Delivery System.
            Your delivery plan uses your service, offer, and client context from previous modules.
          </p>
          <button
            onClick={() => navigate('/workspace/outreach-engine')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0058be] text-white font-bold text-sm transition-colors hover:bg-[#0047a0] cursor-pointer"
          >
            <ArrowLeft size={14} />
            Go to Outreach Engine
          </button>
        </div>
      </div>
    );
  }

  /* ── Stale warning ── */
  if (staleSince) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex items-center justify-center px-5">
        <div className="max-w-md text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto">
            <AlertCircle size={28} className="text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold">Upstream Context Changed</h1>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Your Module 6 context has changed. Review the updated context and rebuild your delivery plan
            to reflect the latest strategy.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                useDeliverySystemStore.getState().clearStale();
                useDeliverySystemStore.getState().regenerate();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0058be] text-white font-bold text-sm transition-colors hover:bg-[#0047a0] cursor-pointer"
            >
              Rebuild Delivery Plan
            </button>
            <button
              onClick={() => navigate('/workspace/outreach-engine')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-neutral-200 text-neutral-600 font-bold text-sm transition-colors hover:bg-neutral-50 cursor-pointer"
            >
              Go to Outreach Engine
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Intro page for first-time / non-started users ── */
  if (!moduleStarted) {
    return (
      <DeliverySystemIntroPage
        onStart={handleStart}
        onBackToBlueprint={handleBackToBlueprint}
      />
    );
  }

  return (
    <DeliverySystemShell>
      <StepContent />
    </DeliverySystemShell>
  );
}

export default DeliverySystemPage;
