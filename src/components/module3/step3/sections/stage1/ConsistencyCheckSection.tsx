/**
 * Section 4: Cross-Platform Consistency Check
 * 
 * "Sab jagah same kahani bol raha hai ya nahi?"
 * Side-by-side headline comparison, consistency score, tone drift warnings.
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
  ArrowRight,
} from 'lucide-react';
import { ModuleButton } from '@/src/components/workspace/ModuleButton';

interface Props {
  profileSystem: ProfileSystemAsset[];
  activeTone: string;
  onContinue: () => void;
}

const PLATFORM_LABELS: Record<string, string> = {
  linkedin: 'LinkedIn',
  twitter: 'X / Twitter',
  github: 'GitHub',
  youtube: 'YouTube',
  behance: 'Figma / Behance',
  instagram: 'Instagram',
  personal_site: 'Personal Site',
};

const PLATFORM_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  linkedin: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-[#0a66c2]' },
  twitter: { bg: 'bg-neutral-50', border: 'border-neutral-300', text: 'text-black' },
  github: { bg: 'bg-neutral-50', border: 'border-neutral-300', text: 'text-[#24292e]' },
  youtube: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-[#ff0000]' },
  behance: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-[#1abcfe]' },
  instagram: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-[#e1306c]' },
  personal_site: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-[#0058be]' },
};

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
      f.key.includes('headline') || f.key.includes('hero') || f.key.includes('tagline')
    );
    if (headlineField && headlineField.value.trim().length > 3) {
      headlines.push({ platform: p.platform, headline: headlineField.value.trim() });
    }
  }

  if (headlines.length < 2) {
    return { alignedCount: headlines.length, totalCount: headlines.length, score: 0, driftWarnings: [], headlines };
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
      if (overlap > 0.15) alignedPairs++;
    }
  }

  // Detect tone drift
  const casualMarkers = ['lol', 'just', 'vibing', 'hey', 'haha', 'btw', '😂', '🔥', 'tbh'];
  const formalMarkers = ['strategic', 'executive', 'enterprise', 'verifiable', 'systematic', 'authority'];

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
        issue: `${PLATFORM_LABELS[h.platform] || h.platform} uses casual tone while other platforms are formal`,
      });
    }
  }

  if (hasCasualPlatform && hasFormalPlatform && driftWarnings.length === 0) {
    driftWarnings.push({
      platform: 'mixed',
      issue: 'Tone mismatch detected: some platforms use casual language while others are formal',
    });
  }

  // Score: percentage of aligned pairs + penalty for drift
  const pairScore = totalPairs > 0 ? Math.round((alignedPairs / totalPairs) * 80) : 0;
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
  activeTone,
  onContinue,
}) => {
  const result = useMemo(() => analyzeConsistency(profileSystem), [profileSystem]);

  const scoreColor = result.score >= 70 ? 'text-emerald-500' : result.score >= 40 ? 'text-amber-500' : 'text-red-500';
  const scoreBg = result.score >= 70 ? 'bg-emerald-50 border-emerald-200' : result.score >= 40 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';

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
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#0058be]/10 text-[#0058be] border border-[#0058be]/20">
              <Eye size={18} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0058be] block">
                Quality Gate
              </span>
              <h2 className="text-lg font-bold text-[#0b1c30]">Cross-Platform Consistency Check</h2>
            </div>
          </div>

          <div className={cn('px-4 py-2 rounded-2xl border flex items-center gap-2', scoreBg)}>
            <span className={cn('text-2xl font-black', scoreColor)}>{result.alignedCount}</span>
            <span className="text-xs text-neutral-500 font-bold">/ {result.totalCount} aligned</span>
          </div>
        </div>

        <p className="text-xs text-neutral-500 leading-relaxed">
          Jab koi high-ticket client tera LinkedIn check karta hai toh wo <strong>Twitter, GitHub, aur Website bhi check karta hai.</strong> Agar ek jagah professional hai aur doosri jagah casual — credibility instantly destroy ho jaati hai.
        </p>
      </motion.div>

      {/* Side-by-Side Headline Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.1 }}
        className="space-y-3"
      >
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block px-1">
          Headlines Across Platforms
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {result.headlines.map((item) => {
            const colors = PLATFORM_COLORS[item.platform] || { bg: 'bg-neutral-50', border: 'border-neutral-200', text: 'text-neutral-700' };
            const hasDrift = result.driftWarnings.some(w => w.platform === item.platform);

            return (
              <div
                key={item.platform}
                className={cn(
                  'p-4 rounded-2xl border space-y-2 transition-all',
                  hasDrift ? 'bg-red-50/50 border-red-200' : colors.bg,
                  hasDrift ? 'border-red-300' : colors.border
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn('text-xs font-bold', colors.text)}>
                    {PLATFORM_LABELS[item.platform] || item.platform}
                  </span>
                  {hasDrift ? (
                    <AlertTriangle size={14} className="text-red-500" />
                  ) : (
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  )}
                </div>
                <p className="text-[11px] text-neutral-700 leading-relaxed line-clamp-3">
                  "{item.headline}"
                </p>
              </div>
            );
          })}
        </div>

        {result.headlines.length === 0 && (
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 text-center">
            <p className="text-xs text-neutral-400 font-medium">No platform headlines found. Go back to Platform Studio and add content.</p>
          </div>
        )}
      </motion.div>

      {/* Tone Drift Warnings */}
      {result.driftWarnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.2 }}
          className="space-y-2"
        >
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-500 block px-1">
            ⚠️ Tone Drift Detected
          </span>
          {result.driftWarnings.map((warn, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2">
              <AlertTriangle size={14} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs text-red-700 font-medium">{warn.issue}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Continue CTA */}
      <div className="flex justify-end pt-2">
        <ModuleButton onClick={onContinue}>
          Consistency Verified — Deploy & Prove →
        </ModuleButton>
      </div>
    </div>
  );
});

ConsistencyCheckSection.displayName = 'ConsistencyCheckSection';

