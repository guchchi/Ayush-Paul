/**
 * ContextHandoffCard.tsx — Compact Inherited Strategy Bar
 *
 * Lightweight reassurance bar displaying core strategic context inherited
 * from Module 1, Module 2, and Step 1 Authority Position.
 * Ultra-compact, single-card footprint with optional statement expansion.
 */

import React, { useState, useMemo } from 'react';
import {
  Target,
  Shield,
  Award,
  Database,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import { useModule3Store } from '../../../../../lib/module3/store';
import { useOpportunityMapStore } from '../../../../../lib/opportunity-map';
import { useOfferEngineeringStore } from '../../../../../lib/offer-engineering';
import { classifyService } from '../../../../../data/module3/service-taxonomy';

export const ContextHandoffCard: React.FC = React.memo(() => {
  const [expanded, setExpanded] = useState(false);

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
  const oppPositioning = useOpportunityMapStore((s) => s.positioning);

  const offerUniqueMechanism = useOfferEngineeringStore((s) => s.uniqueMechanism);
  const offerTitle = useOfferEngineeringStore((s) => s.proposalSummary?.headline);

  // 1. Positioning Label
  const positioningDisplay = useMemo(() => {
    const rawService = mod1ServiceId || oppServiceId || oppTrack;
    if (!rawService) return 'Strategy Defined';

    const classification = classifyService(rawService);
    const serviceName = classification.label || rawService.replace(/_/g, ' ');

    let marketName = oppMarketLabel || mod1MarketId;
    if (marketName && marketName.includes('_')) {
      marketName = marketName.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    if (marketName) {
      return `${serviceName} for ${marketName}`;
    }
    return serviceName;
  }, [mod1ServiceId, oppServiceId, oppTrack, oppMarketLabel, mod1MarketId]);

  // 2. Core Positioning Statement
  const statementDisplay = useMemo(() => {
    const statement = (mod1Positioning || oppPositioning || '').trim();
    return statement.length > 0 ? statement : null;
  }, [mod1Positioning, oppPositioning]);

  // 3. Mechanism
  const mechanismDisplay = useMemo(() => {
    return mod2UniqueMechanism?.trim() || offerUniqueMechanism?.trim() || offerTitle?.trim() || 'Proof-First Framework';
  }, [mod2UniqueMechanism, offerUniqueMechanism, offerTitle]);

  // 4. Authority
  const authorityDisplay = useMemo(() => {
    if (!authorityPosition) return 'Specialist';
    return authorityPosition.charAt(0).toUpperCase() + authorityPosition.slice(1);
  }, [authorityPosition]);

  // 5. Proof Assets Count
  const proofCount = useMemo(() => {
    if (proofAssets && proofAssets.length > 0) return proofAssets.length;
    if (availableAssets && availableAssets.length > 0) return availableAssets.length;
    return 0;
  }, [proofAssets, availableAssets]);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 space-y-3 text-left">
      {/* Top row: Reassurance badge + statement toggle */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 size={12} className="text-emerald-600" />
            <span>Inherited Strategy</span>
          </span>
          <span className="text-neutral-500 hidden sm:inline text-xs">
            Your portfolio structure is grounded in the work completed in Modules 1 &amp; 2.
          </span>
        </div>

        {statementDisplay && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="text-[11px] font-bold text-[#0058be] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <span>{expanded ? 'Hide Statement' : 'View Positioning'}</span>
            <ChevronDown size={12} className={cn('transition-transform duration-200', expanded && 'rotate-180')} />
          </button>
        )}
      </div>

      {/* 4 Compact Strategy Pillars */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
        {/* Positioning */}
        <div className="bg-neutral-50 rounded-xl px-3 py-2 border border-neutral-100 space-y-0.5">
          <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] font-bold uppercase tracking-wider">
            <Target size={11} className="text-[#0058be]" />
            <span>Positioning</span>
          </div>
          <p className="font-bold text-[#0b1c30] truncate text-xs">
            {positioningDisplay}
          </p>
        </div>

        {/* Mechanism */}
        <div className="bg-neutral-50 rounded-xl px-3 py-2 border border-neutral-100 space-y-0.5">
          <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] font-bold uppercase tracking-wider">
            <Shield size={11} className="text-indigo-600" />
            <span>Mechanism</span>
          </div>
          <p className="font-bold text-[#0b1c30] truncate text-xs">
            {mechanismDisplay}
          </p>
        </div>

        {/* Authority */}
        <div className="bg-neutral-50 rounded-xl px-3 py-2 border border-neutral-100 space-y-0.5">
          <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] font-bold uppercase tracking-wider">
            <Award size={11} className="text-purple-600" />
            <span>Authority</span>
          </div>
          <p className="font-bold text-[#0b1c30] truncate text-xs">
            {authorityDisplay} Stance
          </p>
        </div>

        {/* Proof */}
        <div className="bg-neutral-50 rounded-xl px-3 py-2 border border-neutral-100 space-y-0.5">
          <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] font-bold uppercase tracking-wider">
            <Database size={11} className="text-emerald-600" />
            <span>Proof Assets</span>
          </div>
          <p className="font-bold text-[#0b1c30] truncate text-xs">
            {proofCount > 0 ? `${proofCount} Verified Assets` : 'Narrative Claims'}
          </p>
        </div>
      </div>

      {/* Optional Expandable Statement */}
      {expanded && statementDisplay && (
        <div className="pt-2 border-t border-neutral-100 text-xs text-neutral-600 italic bg-neutral-50/60 p-2.5 rounded-xl">
          &ldquo;{statementDisplay}&rdquo;
        </div>
      )}
    </div>
  );
});

ContextHandoffCard.displayName = 'ContextHandoffCard';
export default ContextHandoffCard;
