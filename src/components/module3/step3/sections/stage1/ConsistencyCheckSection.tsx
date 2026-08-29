/**
 * Section 4: Cross-Platform Consistency Check
 * 
 * "Sab jagah same kahani bol raha hai ya nahi?"
 * Side-by-side headline comparison, consistency score, tone drift warnings, 1-click auto-harmonize.
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { EASING, DURATION } from '@/src/lib/motion-presets';
import type { ProfileSystemAsset } from '@/src/data/module3/authority-suite-engine';
import {
  CheckCircle2,
  AlertTriangle,
  Eye,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { ModuleButton } from '@/src/components/workspace/ModuleButton';
import { BrandIcons } from '@/src/components/module3/step3/brand/BrandIcons';
import { useModule3Store } from '@/src/lib/module3/store';
import { harmonizeProfilePositioning } from '@/src/lib/module3/authority-score-engine';

interface Props {
  profileSystem: ProfileSystemAsset[];
  activeTone: string;
  onBack?: () => void;
  onContinue: () => void;
}

import { PLATFORM_REGISTRY } from '@/src/lib/module3/platformRegistry';

interface ConsistencyResult {
  alignedCount: number;
  totalCount: number;
  score: number; // 0–100
  driftWarnings: { platform: string; issue: string }[];
  headlines: { platform: string; headline: string }[];
}

function analyzeConsistency(profileSystem: ProfileSystemAsset[]): ConsistencyResult {
  const headlines: { platform: string; headline: string }[] = [];

  for (const p of profileSystem) {
    const headlineField = p.fields.find(f =>
      f.key.includes('headline') || f.key.includes('hero') || f.key.includes('tagline') || f.key.includes('title')
    );
    if (headlineField && headlineField.value.trim().length > 3) {
      headlines.push({ platform: p.platform, headline: headlineField.value.trim() });
    }
  }

  if (headlines.length < 2) {
    return { alignedCount: headlines.length, totalCount: headlines.length, score: 100, driftWarnings: [], headlines };
  }

  // Extract meaningful keywords from each headline (words > 3 chars, excluding stopwords)
  const stopwords = new Set(['with', 'that', 'this', 'your', 'from', 'have', 'been', 'more', 'they', 'will', 'into', 'also', 'like', 'just', 'over', 'such']);
  const extractKeywords = (text: string) =>
    text.toLowerCase().split(/[\s,.|•\-→↗&]+/).filter(w => w.length > 3 && !stopwords.has(w));

  const keywordSets = headlines.map(h => ({
    platform: h.platform,
    keywords: new Set(extractKeywords(h.headline)),
  }));

  // Check pairwise keyword overlap
  let alignedPairs = 0;
  let totalPairs = 0;
  for (let i = 0; i < keywordSets.length; i++) {
    for (let j = i + 1; j < keywordSets.length; j++) {
      totalPairs++;
      const intersection = [...keywordSets[i].keywords].filter(w => keywordSets[j].keywords.has(w));
      const unionSize = new Set([...keywordSets[i].keywords, ...keywordSets[j].keywords]).size;
      const overlap = unionSize > 0 ? intersection.length / unionSize : 0;
      if (overlap > 0.12) alignedPairs++;
    }
  }

  // Detect tone drift
  const casualMarkers = ['lol', 'just', 'vibing', 'hey', 'haha', 'btw', 'tbh'];
  const formalMarkers = ['strategic', 'executive', 'enterprise', 'verifiable', 'systematic', 'authority', 'architect', 'systems'];

  const driftWarnings: { platform: string; issue: string }[] = [];
  let hasCasualPlatform = false;
  let hasFormalPlatform = false;

  for (const h of headlines) {
    const lower = h.headline.toLowerCase();
    const isCasual = casualMarkers.some(m => lower.includes(m));
    const isFormal = formalMarkers.some(m => lower.includes(m));

    if (isCasual) hasCasualPlatform = true;
    if (isFormal) hasFormalPlatform = true;

    if (isCasual && hasFormalPlatform) {
      driftWarnings.push({
        platform: h.platform,
        issue: `${PLATFORM_REGISTRY[h.platform]?.name || h.platform} uses a casual tone while other channels are formal`,
      });
    }
  }

  if (hasCasualPlatform && hasFormalPlatform && driftWarnings.length === 0) {
    driftWarnings.push({
      platform: 'mixed',
      issue: 'Tone mismatch detected: some platforms use casual language while others are executive-grade.',
    });
  }

  // Score: percentage of aligned pairs + penalty for drift
  const pairScore = totalPairs > 0 ? Math.round((alignedPairs / totalPairs) * 80) : 80;
  const driftPenalty = driftWarnings.length * 15;
  const score = Math.max(0, Math.min(100, pairScore + 20 - driftPenalty));

  // Count aligned platforms (those sharing keywords with majority)
  let alignedCount = 0;
  for (let i = 0; i < keywordSets.length; i++) {
    let matchesWithOthers = 0;
    for (let j = 0; j < keywordSets.length; j++) {
      if (i === j) continue;
      const intersection = [...keywordSets[i].keywords].filter(w => keywordSets[j].keywords.has(w));
      if (intersection.length > 0) matchesWithOthers++;
    }
    if (matchesWithOthers >= Math.floor((keywordSets.length - 1) / 2)) alignedCount++;
  }

  return {
    alignedCount,
    totalCount: headlines.length,
    score,
    driftWarnings,
    headlines,
  };
}

export const ConsistencyCheckSection: React.FC<Props> = React.memo(({
  profileSystem,
  onBack,
  onContinue,
}) => {
  const updateProfileField = useModule3Store(s => s.updateProfileField);
  const stage1Identity = useModule3Store(s => s.stage1Identity);
  const result = useMemo(() => analyzeConsistency(profileSystem), [profileSystem]);

  const scoreColor = result.score >= 70 ? 'text-emerald-600' : result.score >= 40 ? 'text-blue-600' : 'text-amber-600';
  const scoreBg = result.score >= 70 ? 'bg-emerald-50 border-emerald-200' : result.score >= 40 ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200';

  const handleHarmonize = () => {
    const referenceHeadline = stage1Identity?.positioningHeadline || 'Strategic Systems Architect & Product Engineer';
    const referencePromise = stage1Identity?.proofLine || 'Deterministic architectures that scale with measurable ROI.';

    const harmonized = harmonizeProfilePositioning(profileSystem, referenceHeadline, referencePromise);
    harmonized.forEach((asset) => {
      asset.fields.forEach((field) => {
        updateProfileField(asset.platform as any, field.key, field.value);
      });
    });
  };

  return (
    <div className="w-full space-y-6 text-left font-sans">
      {/* Header + Score */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
        className="p-6 rounded-3xl border border-neutral-200 bg-white shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#0058be]/10 text-[#0058be] border border-[#0058be]/20">
              <Eye size={20} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0058be] block">
                Quality Gate · Stage 1 Check
              </span>
              <h2 className="text-xl font-bold text-[#0b1c30]">Cross-Platform Consistency Diagnostic</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {result.driftWarnings.length > 0 && (
              <button
                onClick={handleHarmonize}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 text-xs font-bold text-[#0b1c30] shadow-xs cursor-pointer hover:bg-neutral-50 transition-all"
              >
                <RefreshCw size={13} className="text-[#0058be]" />
                Auto-Harmonize All
              </button>
            )}
            <div className={cn('px-4 py-2 rounded-2xl border flex items-center gap-2', scoreBg)}>
              <span className={cn('text-2xl font-black', scoreColor)}>{result.alignedCount}</span>
              <span className="text-xs text-neutral-500 font-bold">/ {result.totalCount} aligned</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-neutral-500 leading-relaxed">
          High-ticket clients routinely cross-reference multiple profiles before booking. If your LinkedIn reads enterprise while your X or personal site reads casual, client trust drops immediately. This diagnostic confirms unified authority positioning across all active channels.
        </p>
      </motion.div>

      {/* Side-by-Side Headline Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.1 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block">
            Channel Headlines Breakdown ({result.headlines.length} Platforms)
          </span>
          <span className="text-[10px] font-bold text-neutral-500">
            {result.score}% Overall Cohesion
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {result.headlines.map((item) => {
            const meta = PLATFORM_REGISTRY[item.platform] || {
              name: item.platform,
              icon: BrandIcons.PersonalSite,
              brandColor: 'bg-neutral-700',
              textColor: 'text-neutral-700',
              borderColor: 'border-neutral-200',
              bgColor: 'bg-neutral-50',
            };
            const Icon = meta.icon;
            const hasDrift = result.driftWarnings.some(w => w.platform === item.platform);

            return (
              <div
                key={item.platform}
                className={cn(
                  'p-4 rounded-2xl border space-y-2.5 transition-all shadow-2xs',
                  hasDrift ? 'bg-amber-50/60 border-amber-300' : 'bg-white border-neutral-200/80 hover:border-neutral-300'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-6 h-6 rounded-lg flex items-center justify-center text-white', meta.brandColor)}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs font-bold text-[#0b1c30]">
                      {meta.name}
                    </span>
                  </div>
                  {hasDrift ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
                      <AlertTriangle size={11} /> Drift
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                      <CheckCircle2 size={11} /> Cohesive
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed line-clamp-3 bg-neutral-50/70 p-2.5 rounded-xl border border-neutral-100">
                  "{item.headline}"
                </p>
              </div>
            );
          })}
        </div>

        {result.headlines.length === 0 && (
          <div className="p-8 rounded-2xl bg-white border border-neutral-200 text-center">
            <p className="text-xs text-neutral-400 font-medium">No platform headlines found. Return to Platform Studio to configure copy.</p>
          </div>
        )}
      </motion.div>

      {/* Tone Drift Warnings */}
      {result.driftWarnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.2 }}
          className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold">
              <AlertTriangle size={14} className="text-amber-600" />
              Tone Drift Detected in {result.driftWarnings.length} Platform{result.driftWarnings.length === 1 ? '' : 's'}
            </div>
            <button
              onClick={handleHarmonize}
              className="text-[11px] font-bold text-[#0058be] hover:underline cursor-pointer flex items-center gap-1"
            >
              <Sparkles size={12} /> Sync with Master Identity
            </button>
          </div>
          <div className="space-y-1.5 pt-1">
            {result.driftWarnings.map((warn, i) => (
              <p key={i} className="text-xs text-amber-900/80 font-medium pl-5">
                • {warn.issue}
              </p>
            ))}
          </div>
        </motion.div>
      )}

      {/* Continue CTA */}
      <div className="flex items-center justify-between pt-2">
        {onBack ? (
          <ModuleButton variant="secondary" onClick={onBack}>
            ← Back to Platform Studio
          </ModuleButton>
        ) : <div />}
        <ModuleButton variant="primary" onClick={onContinue}>
          Consistency Verified — Deploy & Proof →
        </ModuleButton>
      </div>
    </div>
  );
});

ConsistencyCheckSection.displayName = 'ConsistencyCheckSection';
