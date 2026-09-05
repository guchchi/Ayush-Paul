/**
 * ContextHandoffCard.tsx — Level 2 Phase 1: Upstream Context Handoff
 *
 * Displays read-only strategic context inherited from Module 1, Module 2,
 * Module 3 Steps 1 & 2, and Level 1 Social Profile Identity Studio.
 * Zero duplicate editable inputs, zero fake values.
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  CheckCircle2,
  Shield,
  Target,
  Award,
  Database,
  Quote,
  Sliders,
  AlertCircle,
} from 'lucide-react';
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
  const coreTrustPromise = useModule3Store((s) => s.coreTrustPromise);
  const proofAssets = useModule3Store((s) => s.proofAssets);
  const availableAssets = useModule3Store((s) => s.availableAssets);
  const stage1Identity = useModule3Store((s) => s.stage1Identity);

  // Upstream stores fallback
  const oppServiceId = useOpportunityMapStore((s) => s.serviceId);
  const oppMarketLabel = useOpportunityMapStore((s) => s.marketLabel);
  const oppNicheLabel = useOpportunityMapStore((s) => s.nicheLabel);
  const oppTrack = useOpportunityMapStore((s) => s.careerTrackId);
  const oppPositioning = useOpportunityMapStore((s) => s.positioning);

  const offerUniqueMechanism = useOfferEngineeringStore((s) => s.uniqueMechanism);
  const offerTitle = useOfferEngineeringStore((s) => s.proposalSummary?.headline);

  // 1. Resolve Positioning: Track/Service → Market → Niche
  const positioningDisplay = useMemo(() => {
    const rawService = mod1ServiceId || oppServiceId || oppTrack;
    if (!rawService) return null;

    const classification = classifyService(rawService);
    const serviceName = classification.label || rawService.replace(/_/g, ' ');

    let marketName = oppMarketLabel || mod1MarketId;
    if (marketName && marketName.includes('_')) {
      marketName = marketName.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    let nicheName = oppNicheLabel || mod1NicheId;
    if (nicheName && nicheName.includes('_')) {
      nicheName = nicheName.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    if (marketName && nicheName) {
      return `${serviceName} → ${marketName} → ${nicheName}`;
    }
    if (marketName) {
      return `${serviceName} → ${marketName}`;
    }
    return serviceName;
  }, [mod1ServiceId, oppServiceId, oppTrack, oppMarketLabel, mod1MarketId, oppNicheLabel, mod1NicheId]);

  // 2. Core Positioning Statement
  const statementDisplay = useMemo(() => {
    const statement = (mod1Positioning || oppPositioning || '').trim();
    return statement.length > 0 ? statement : null;
  }, [mod1Positioning, oppPositioning]);

  // 3. Resolve Offer: Unique Mechanism or Offer Headline
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
    return null;
  }, [mod2UniqueMechanism, offerUniqueMechanism, offerTitle]);

  // 4. Resolve Authority Stance & Trust Promise
  const authorityDisplay = useMemo(() => {
    if (!authorityPosition) return null;
    return authorityPosition.charAt(0).toUpperCase() + authorityPosition.slice(1);
  }, [authorityPosition]);

  // 5. Resolve Proof: Count of real assets available
  const proofCount = useMemo(() => {
    if (proofAssets && proofAssets.length > 0) return proofAssets.length;
    if (availableAssets && availableAssets.length > 0) return availableAssets.length;
    return 0;
  }, [proofAssets, availableAssets]);

  // 6. Level 1 Identity Tone
  const activeTone = stage1Identity?.activeTone || 'executive';
  const toneLabel = activeTone === 'executive' ? 'Executive Tone' : activeTone === 'conversion' ? 'Conversion Tone' : 'Direct Tone';

  const isCompleteContext = !!(positioningDisplay && offerDisplay && authorityDisplay);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
      className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs p-5 sm:p-6 space-y-4"
    >
      {/* Header text */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0058be] text-[10px] font-black tracking-wider uppercase border border-blue-100">
              <Sparkles size={11} />
              Context Handoff
            </span>
            <span className="text-[11px] font-semibold text-neutral-400">
              Inherited Strategy
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#0b1c30] tracking-tight">
            This portfolio will be built from the strategy you've already created.
          </h2>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          {isCompleteContext ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
              <span>Strategy Synced</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              <AlertCircle size={13} className="text-amber-600 shrink-0" />
              <span>Partial Context</span>
            </span>
          )}
        </div>
      </div>

      {/* 4 Core Inherited Strategy Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Positioning */}
        <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/70 space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-[10px] font-extrabold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Target size={12} className="text-[#0058be]" />
              Positioning
            </span>
            <span className="text-[9px] font-mono text-neutral-400">MOD 01</span>
          </div>
          <p className={cn("text-xs font-bold truncate", positioningDisplay ? "text-[#0b1c30]" : "text-neutral-400 italic")}>
            {positioningDisplay || 'Not defined yet'}
          </p>
        </div>

        {/* Offer / Mechanism */}
        <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/70 space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-[10px] font-extrabold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Shield size={12} className="text-indigo-600" />
              Mechanism
            </span>
            <span className="text-[9px] font-mono text-neutral-400">MOD 02</span>
          </div>
          <p className={cn("text-xs font-bold truncate", offerDisplay ? "text-[#0b1c30]" : "text-neutral-400 italic")}>
            {offerDisplay || 'Not defined yet'}
          </p>
        </div>

        {/* Authority Stance */}
        <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/70 space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-[10px] font-extrabold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Award size={12} className="text-purple-600" />
              Authority
            </span>
            <span className="text-[9px] font-mono text-neutral-400">STEP 01</span>
          </div>
          <p className={cn("text-xs font-bold truncate", authorityDisplay ? "text-[#0b1c30]" : "text-neutral-400 italic")}>
            {authorityDisplay || 'Not defined yet'}
          </p>
        </div>

        {/* Proof Assets Available */}
        <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/70 space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-[10px] font-extrabold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Database size={12} className="text-emerald-600" />
              Proof Vault
            </span>
            <span className="text-[9px] font-mono text-neutral-400">STEP 02</span>
          </div>
          <p className={cn("text-xs font-bold truncate", proofCount > 0 ? "text-[#0b1c30]" : "text-amber-700")}>
            {proofCount > 0 ? `${proofCount} verified asset${proofCount === 1 ? '' : 's'} ready` : '0 proof assets (Needs setup)'}
          </p>
        </div>
      </div>

      {/* Secondary Row: Positioning Statement & Level 1 Calibration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 pt-1 text-xs">
        {/* Core Statement */}
        <div className="lg:col-span-2 p-3 rounded-2xl bg-neutral-50/70 border border-neutral-200/60 flex items-start gap-2.5">
          <Quote size={14} className="text-[#0058be] shrink-0 mt-0.5" />
          <div className="space-y-0.5 overflow-hidden">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              Core Positioning Statement
            </span>
            <p className={cn("font-medium line-clamp-2", statementDisplay ? "text-[#0b1c30]" : "text-neutral-400 italic")}>
              {statementDisplay ? `"${statementDisplay}"` : 'No statement defined in Module 1.'}
            </p>
          </div>
        </div>

        {/* Level 1 Tone & Identity Link */}
        <div className="p-3 rounded-2xl bg-neutral-50/70 border border-neutral-200/60 flex items-center justify-between gap-2">
          <div className="space-y-0.5 truncate">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              Level 1 Calibration
            </span>
            <span className="font-bold text-[#0b1c30] truncate block">
              {stage1Identity?.userName ? `${stage1Identity.userName}` : 'Profile Verified'}
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#0058be] text-[10px] font-bold border border-blue-100 shrink-0">
            {toneLabel}
          </span>
        </div>
      </div>
    </motion.div>
  );
});

ContextHandoffCard.displayName = 'ContextHandoffCard';

