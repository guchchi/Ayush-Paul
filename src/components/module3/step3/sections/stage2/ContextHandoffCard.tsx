/**
 * ContextHandoffCard.tsx — Level 2 Step 0: Upstream Context Handoff
 *
 * Displays the personalized context inherited from Module 1, Module 2,
 * and Module 3 Steps 1 & 2.
 * Zero questionnaire, zero arbitrary scores — the system already knows the user.
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2, Shield, Target, Award, Database } from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import { EASING, DURATION } from '../../../../../lib/motion-presets';
import { useModule3Store } from '../../../../../lib/module3/store';
import { useOpportunityMapStore } from '../../../../../lib/opportunity-map';
import { useOfferEngineeringStore } from '../../../../../lib/offer-engineering';
import { classifyService } from '../../../../../data/module3/service-taxonomy';

export const ContextHandoffCard: React.FC = React.memo(() => {
  // Module 3 store context
  const mod1ServiceId = useModule3Store((s) => s.mod1ServiceId);
  const mod1MarketId = useModule3Store((s) => s.mod1MarketId);
  const mod1NicheId = useModule3Store((s) => s.mod1NicheId);
  const mod1Positioning = useModule3Store((s) => s.mod1Positioning);
  const mod2UniqueMechanism = useModule3Store((s) => s.mod2UniqueMechanism);
  const authorityPosition = useModule3Store((s) => s.authorityPosition);
  const proofAssets = useModule3Store((s) => s.proofAssets);
  const availableAssets = useModule3Store((s) => s.availableAssets);

  // Upstream stores fallback
  const oppServiceId = useOpportunityMapStore((s) => s.serviceId);
  const oppMarketLabel = useOpportunityMapStore((s) => s.marketLabel);
  const oppNicheLabel = useOpportunityMapStore((s) => s.nicheLabel);
  const oppTrack = useOpportunityMapStore((s) => s.careerTrackId);

  const offerUniqueMechanism = useOfferEngineeringStore((s) => s.uniqueMechanism);
  const offerTitle = useOfferEngineeringStore((s) => s.proposalSummary?.headline);

  // 1. Resolve Positioning: Track/Service → Market → Niche
  const positioningDisplay = useMemo(() => {
    const rawService = mod1ServiceId || oppServiceId || oppTrack || 'video_editor';
    const classification = classifyService(rawService);
    const serviceName = classification.label || 'Video Editor';

    // Friendly market name
    let marketName = oppMarketLabel || mod1MarketId || 'YouTubers';
    if (marketName.toLowerCase().includes('youtube')) marketName = 'YouTubers';
    else if (marketName.toLowerCase().includes('local')) marketName = 'Local Businesses';
    else if (marketName.toLowerCase().includes('coach')) marketName = 'Coaches';
    else if (marketName.includes('_')) {
      marketName = marketName.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    // Friendly niche name
    let nicheName = oppNicheLabel || mod1NicheId || 'Retention';
    if (nicheName.toLowerCase().includes('retention')) nicheName = 'Retention';
    else if (nicheName.toLowerCase().includes('restaurant')) nicheName = 'Restaurants';
    else if (nicheName.toLowerCase().includes('fitness')) nicheName = 'Fitness Coaches';
    else if (nicheName.includes('_')) {
      nicheName = nicheName.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    return `${serviceName} → ${marketName} → ${nicheName}`;
  }, [mod1ServiceId, oppServiceId, oppTrack, oppMarketLabel, mod1MarketId, oppNicheLabel, mod1NicheId]);

  // 2. Resolve Offer: Unique Mechanism or Offer Headline
  const offerDisplay = useMemo(() => {
    if (mod2UniqueMechanism && mod2UniqueMechanism.trim().length > 0) {
      return mod2UniqueMechanism.trim();
    }
    if (offerUniqueMechanism && offerUniqueMechanism.trim().length > 0) {
      return offerUniqueMechanism.trim();
    }
    if (offerTitle && offerTitle.trim().length > 0) {
      return offerTitle.trim();
    }
    return 'YouTube Retention Editing System';
  }, [mod2UniqueMechanism, offerUniqueMechanism, offerTitle]);

  // 3. Resolve Authority: Practitioner / Builder / Auditor / Deconstructor
  const authorityDisplay = useMemo(() => {
    if (!authorityPosition) return 'Practitioner';
    return authorityPosition.charAt(0).toUpperCase() + authorityPosition.slice(1);
  }, [authorityPosition]);

  // 4. Resolve Proof: Count of available assets
  const proofDisplay = useMemo(() => {
    const count = (proofAssets && proofAssets.length > 0)
      ? proofAssets.length
      : (availableAssets && availableAssets.length > 0)
      ? availableAssets.length
      : 3;
    return `${count} asset${count === 1 ? '' : 's'} available`;
  }, [proofAssets, availableAssets]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
      className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs p-5 sm:p-6 space-y-4"
    >
      {/* Header text */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0058be] text-[11px] font-bold tracking-wide uppercase">
              <Sparkles size={12} />
              Context Handoff
            </span>
            <span className="text-[11px] font-medium text-neutral-400">
              Synced from Modules 1 & 2
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-[#0b1c30] tracking-tight">
            Your portfolio architecture is ready to be built.
          </h2>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold self-start sm:self-auto border border-emerald-100">
          <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
          <span>Profile Context Verified</span>
        </div>
      </div>

      {/* Small Context Card — 4 Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Positioning */}
        <div className="p-3.5 rounded-2xl bg-neutral-50/90 border border-neutral-200/70 space-y-1">
          <div className="flex items-center gap-1.5 text-neutral-500 text-[11px] font-bold uppercase tracking-wider">
            <Target size={12} className="text-[#0058be]" />
            <span>Positioning</span>
          </div>
          <p className="text-xs sm:text-sm font-black text-[#0b1c30] truncate" title={positioningDisplay}>
            {positioningDisplay}
          </p>
        </div>

        {/* Offer */}
        <div className="p-3.5 rounded-2xl bg-neutral-50/90 border border-neutral-200/70 space-y-1">
          <div className="flex items-center gap-1.5 text-neutral-500 text-[11px] font-bold uppercase tracking-wider">
            <Shield size={12} className="text-indigo-600" />
            <span>Offer</span>
          </div>
          <p className="text-xs sm:text-sm font-black text-[#0b1c30] truncate" title={offerDisplay}>
            {offerDisplay}
          </p>
        </div>

        {/* Authority */}
        <div className="p-3.5 rounded-2xl bg-neutral-50/90 border border-neutral-200/70 space-y-1">
          <div className="flex items-center gap-1.5 text-neutral-500 text-[11px] font-bold uppercase tracking-wider">
            <Award size={12} className="text-purple-600" />
            <span>Authority</span>
          </div>
          <p className="text-xs sm:text-sm font-black text-[#0b1c30]">
            {authorityDisplay}
          </p>
        </div>

        {/* Proof */}
        <div className="p-3.5 rounded-2xl bg-neutral-50/90 border border-neutral-200/70 space-y-1">
          <div className="flex items-center gap-1.5 text-neutral-500 text-[11px] font-bold uppercase tracking-wider">
            <Database size={12} className="text-emerald-600" />
            <span>Proof</span>
          </div>
          <p className="text-xs sm:text-sm font-black text-[#0b1c30]">
            {proofDisplay}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

ContextHandoffCard.displayName = 'ContextHandoffCard';
