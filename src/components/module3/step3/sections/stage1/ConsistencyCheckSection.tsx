/**
 * Section 4: Cross-Platform Consistency Check
 * 
 * "Sab jagah same kahani bol raha hai ya nahi?"
 * 
 * Features:
 *  1. Keyword Highlighting — common keywords (green), unique keywords (amber) across headlines
 *  2. Before vs After Preview — modal showing current vs harmonized state before applying
 *  3. Per-Platform Micro-Tips — friendly, helpful tips (not alarming) per platform card
 *  4. Side-by-side headline comparison, consistency score, tone drift warnings
 */

import React, { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { EASING, DURATION } from '@/src/lib/motion-presets';
import type { ProfileSystemAsset } from '@/src/data/module3/authority-suite-engine';
import {
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Shield,
  Activity,
  Lightbulb,
  X,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { ModuleButton } from '@/src/components/workspace/ModuleButton';
import { BrandIcons } from '@/src/components/module3/step3/brand/BrandIcons';
import { useModule3Store } from '@/src/lib/module3/store';
import { harmonizeProfilePositioning } from '@/src/lib/module3/authority-score-engine';
import { PLATFORM_REGISTRY } from '@/src/lib/module3/platformRegistry';

interface Props {
  profileSystem: ProfileSystemAsset[];
  activeTone: string;
  onBack?: () => void;
  onContinue: () => void;
}

// ── Consistency Analysis ──────────────────────────────────────────────────────

interface ConsistencyResult {
  alignedCount: number;
  totalCount: number;
  score: number;
  driftWarnings: { platform: string; issue: string; type: 'drift' | 'conflict' }[];
  headlines: { platform: string; headline: string }[];
  commonKeywords: Set<string>;
  platformKeywords: Map<string, Set<string>>;
}

const STOPWORDS = new Set(['with', 'that', 'this', 'your', 'from', 'have', 'been', 'more', 'they', 'will', 'into', 'also', 'like', 'just', 'over', 'such', 'and', 'the', 'for', 'who', 'what', 'when', 'where', 'through', 'help', 'helps']);

function extractKeywords(text: string): string[] {
  return text.toLowerCase().split(/[\s,.|•\-→↗&:;/()]+/).filter(w => w.length > 3 && !STOPWORDS.has(w));
}

/**
 * Smart field picker: for each platform, find the "main positioning text".
 * Priority order:
 *  1. headline / hero / tagline / title  (LinkedIn headline, personal site hero_tagline)
 *  2. bio / banner_text                  (Twitter bio, Instagram bio, YouTube banner/about)
 *  3. name_format                        (display name as last resort)
 */
function pickMainPositioningField(fields: ProfileSystemAsset['fields']): { key: string; value: string } | null {
  // Priority 1: headline-type fields
  const p1 = fields.find(f =>
    f.key.includes('headline') || f.key.includes('hero') || f.key.includes('tagline') || f.key.includes('title')
  );
  if (p1 && p1.value.trim().length > 3) return p1;

  // Priority 2: bio or banner
  const p2 = fields.find(f =>
    f.key === 'bio' || f.key === 'banner_text'
  );
  if (p2 && p2.value.trim().length > 3) return p2;

  // Priority 3: name_format
  const p3 = fields.find(f => f.key === 'name_format');
  if (p3 && p3.value.trim().length > 3) return p3;

  return null;
}

function analyzeConsistency(profileSystem: ProfileSystemAsset[]): ConsistencyResult {
  const headlines: { platform: string; headline: string }[] = [];

  for (const p of profileSystem) {
    const mainField = pickMainPositioningField(p.fields);
    if (mainField) {
      // For bios that have line breaks, take only the first line for headline comparison
      const firstLine = mainField.value.split('\n')[0].trim();
      headlines.push({ platform: p.platform, headline: firstLine });
    }
  }

  // Build keyword maps for highlighting
  const platformKeywords = new Map<string, Set<string>>();
  const allKeywordCounts = new Map<string, number>();

  for (const h of headlines) {
    const kws = new Set(extractKeywords(h.headline));
    platformKeywords.set(h.platform, kws);
    kws.forEach(k => {
      allKeywordCounts.set(k, (allKeywordCounts.get(k) || 0) + 1);
    });
  }

  // Common keywords = appear in 2+ platforms
  const commonKeywords = new Set<string>();
  allKeywordCounts.forEach((count, keyword) => {
    if (count >= 2) commonKeywords.add(keyword);
  });

  if (headlines.length < 2) {
    return { alignedCount: headlines.length, totalCount: headlines.length, score: 100, driftWarnings: [], headlines, commonKeywords, platformKeywords };
  }

  const keywordSets = headlines.map(h => ({
    platform: h.platform,
    keywords: platformKeywords.get(h.platform) || new Set<string>(),
  }));

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

  const casualMarkers = ['lol', 'just', 'vibing', 'hey', 'haha', 'btw', 'tbh', 'crazy'];
  const formalMarkers = ['strategic', 'executive', 'enterprise', 'verifiable', 'systematic', 'authority', 'architect', 'systems', 'deterministic'];

  const driftWarnings: { platform: string; issue: string; type: 'drift' | 'conflict' }[] = [];
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
        issue: `${PLATFORM_REGISTRY[h.platform]?.name || h.platform} is projecting a casual tone while others are executive-grade.`,
        type: 'drift'
      });
    }
  }

  if (hasCasualPlatform && hasFormalPlatform && driftWarnings.length === 0) {
    driftWarnings.push({
      platform: 'mixed',
      issue: 'Tone mismatch detected: You are mixing casual language with high-ticket executive terminology across platforms.',
      type: 'conflict'
    });
  }

  const pairScore = totalPairs > 0 ? Math.round((alignedPairs / totalPairs) * 80) : 80;
  const driftPenalty = driftWarnings.length * 15;
  const score = Math.max(0, Math.min(100, pairScore + 20 - driftPenalty));

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
    commonKeywords,
    platformKeywords,
  };
}

// ── Keyword Highlighted Headline Renderer ─────────────────────────────────────

function HighlightedHeadline({ headline, commonKeywords, platformKeywords }: {
  headline: string;
  commonKeywords: Set<string>;
  platformKeywords: Set<string>;
}) {
  // Tokenize headline preserving whitespace and punctuation
  const tokens = headline.split(/(\s+|[,.|•\-→↗&:;/()]+)/);

  return (
    <span>
      {tokens.map((token, i) => {
        const clean = token.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (clean.length <= 3 || STOPWORDS.has(clean)) {
          return <span key={i}>{token}</span>;
        }
        
        const isCommon = commonKeywords.has(clean);
        const isUnique = platformKeywords.has(clean) && !isCommon;

        if (isCommon) {
          return (
            <span
              key={i}
              className="bg-emerald-100/70 text-emerald-800 px-0.5 rounded-sm font-semibold"
              title="Shared across platforms"
            >
              {token}
            </span>
          );
        }
        if (isUnique) {
          return (
            <span
              key={i}
              className="bg-amber-100/60 text-amber-800 px-0.5 rounded-sm"
              title="Unique to this platform"
            >
              {token}
            </span>
          );
        }
        return <span key={i}>{token}</span>;
      })}
    </span>
  );
}

// ── Per-Platform Micro-Tips (helpful, not alarming) ───────────────────────────

function generateMicroTip(headline: string, platform: string): string {
  const lower = headline.toLowerCase();
  const platName = PLATFORM_REGISTRY[platform]?.name || platform;

  // Positive reinforcement tips first
  const hasNumbers = /\d+[%xX+]|\$\d|\d+\s*(clients|projects|videos|brands|companies)/i.test(headline);
  const hasCta = ['book', 'dm', 'schedule', 'apply', 'link in', 'let\'s talk', 'reach out', 'work with', 'hire'].some(s => lower.includes(s));
  const hasMethodology = ['framework', 'system', 'method', 'process', 'pipeline', 'engine', 'architecture'].some(s => lower.includes(s));
  const hasOutcome = ['revenue', 'growth', 'scale', 'transform', 'convert', 'result', 'roi', 'profit'].some(s => lower.includes(s));

  // Platform-specific helpful tips
  if (platform === 'linkedin') {
    if (!hasNumbers) return `Adding a specific metric (e.g. "50+ projects") to your ${platName} headline makes it 2x more clickable in search results.`;
    if (!hasMethodology) return `Naming your unique process on ${platName} (e.g. "The X Framework") positions you as a thought leader, not just a service provider.`;
    if (hasNumbers && hasMethodology) return `Strong headline — ${platName}'s algorithm favors profiles with specific expertise signals like yours.`;
    return `Consider adding a client-outcome metric to strengthen your ${platName} headline even further.`;
  }

  if (platform === 'twitter' || platform === 'x') {
    if (headline.length > 120) return `Your ${platName} bio is quite long — shorter bios (under 100 chars) tend to feel more confident and premium.`;
    if (!hasCta) return `A subtle CTA like "DM for collabs" at the end of your ${platName} bio can quietly drive 30% more inbound messages.`;
    return `Clean and concise — ${platName} bios that read like a tagline perform better than paragraph-style descriptions.`;
  }

  if (platform === 'instagram') {
    if (!hasCta) return `Instagram bios with a single clear CTA ("Link in bio" or "DM for inquiries") convert profile visitors 3x better.`;
    if (headline.length > 150) return `Shorter Instagram bios feel more premium — try keeping it under 3 lines for maximum visual impact.`;
    return `Emojis used sparingly as bullet separators can make your Instagram bio scannable without looking unprofessional.`;
  }

  if (platform === 'personal_site') {
    if (!hasOutcome) return `Your personal site tagline is the first thing visitors read — try leading with the transformation you deliver.`;
    return `Your personal site headline sets the tone for your entire brand — this one reads confidently.`;
  }

  if (platform === 'github') {
    if (!hasMethodology) return `GitHub profiles that mention specific tech stacks or architectural patterns attract higher-quality collaboration requests.`;
    return `Technical specificity in your GitHub bio signals deep expertise to potential collaborators and recruiters.`;
  }

  if (platform === 'behance' || platform === 'dribbble') {
    return `Visual portfolio platforms reward specificity — mentioning your design niche in the tagline helps the right clients find you.`;
  }

  if (platform === 'youtube') {
    if (!hasOutcome) return `YouTube channel descriptions that promise a specific viewer outcome ("Learn X", "Master Y") grow subscribers faster.`;
    return `Your YouTube positioning is clear — channels with niche authority descriptions retain viewers 40% longer.`;
  }

  // Generic fallback — still helpful, never alarming
  if (!hasNumbers && !hasMethodology) return `Try adding one specific number or naming your unique method — it makes your positioning more memorable and believable.`;
  if (hasNumbers && !hasCta) return `Strong proof signals detected. A gentle call-to-action would complete the positioning loop.`;
  return `Well-structured positioning — consistent messaging like this builds compounding trust over time.`;
}

// ── Circular Progress ─────────────────────────────────────────────────────────

const CircularProgress = ({ score }: { score: number }) => {
  const size = 56;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  
  const color = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  const bgColor = score >= 80 ? 'rgba(16, 185, 129, 0.1)' : score >= 50 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)';
  
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 drop-shadow-sm" width={size} height={size}>
        <circle
          className="transition-colors duration-500"
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: EASING.PREMIUM }}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-sm font-black text-[#0b1c30] tracking-tight leading-none">{score}</span>
      </div>
    </div>
  );
};

// ── Before/After Preview Modal ────────────────────────────────────────────────

function HarmonizePreviewModal({
  profileSystem,
  currentHeadlines,
  referenceHeadline,
  referencePromise,
  onApply,
  onCancel,
}: {
  profileSystem: ProfileSystemAsset[];
  currentHeadlines: { platform: string; headline: string }[];
  referenceHeadline: string;
  referencePromise: string;
  onApply: () => void;
  onCancel: () => void;
}) {
  const harmonizedAssets = useMemo(
    () => harmonizeProfilePositioning(profileSystem, referenceHeadline, referencePromise),
    [profileSystem, referenceHeadline, referencePromise]
  );

  // Build the "after" headlines map
  const afterHeadlines = useMemo(() => {
    const map = new Map<string, string>();
    for (const asset of harmonizedAssets) {
      const headlineField = asset.fields.find(f =>
        f.key.includes('headline') || f.key.includes('hero') || f.key.includes('tagline') || f.key.includes('title')
      );
      if (headlineField) {
        map.set(asset.platform, headlineField.value.trim());
      }
    }
    return map;
  }, [harmonizedAssets]);

  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    await new Promise(r => setTimeout(r, 800));
    onApply();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: EASING.PREMIUM }}
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#0058be]/10">
              <Eye size={18} className="text-[#0058be]" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#0b1c30] tracking-tight">Harmonization Preview</h3>
              <p className="text-[11px] text-neutral-500 font-medium">Review changes before applying them to your profiles</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
          {currentHeadlines.map((item) => {
            const meta = PLATFORM_REGISTRY[item.platform] || {
              name: item.platform,
              icon: BrandIcons.PersonalSite,
              brandColor: 'bg-neutral-800',
            };
            const Icon = meta.icon;
            const afterText = afterHeadlines.get(item.platform) || item.headline;
            const hasChanged = afterText !== item.headline;

            return (
              <div key={item.platform} className="rounded-2xl border border-neutral-100 bg-white overflow-hidden">
                {/* Platform label */}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-neutral-50/80 border-b border-neutral-100">
                  <div className={cn('w-5 h-5 rounded-lg flex items-center justify-center text-white', meta.brandColor)}>
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-bold text-[#0b1c30]">{meta.name}</span>
                  {hasChanged ? (
                    <span className="text-[9px] font-bold text-[#0058be] bg-[#0058be]/10 px-1.5 py-0.5 rounded-md ml-auto">WILL UPDATE</span>
                  ) : (
                    <span className="text-[9px] font-bold text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-md ml-auto">NO CHANGE</span>
                  )}
                </div>

                {/* Before / After */}
                <div className="grid grid-cols-2 divide-x divide-neutral-100">
                  <div className="p-3.5">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 block mb-1.5">Current</span>
                    <p className="text-xs text-neutral-600 leading-relaxed font-medium">{item.headline}</p>
                  </div>
                  <div className={cn('p-3.5', hasChanged && 'bg-emerald-50/30')}>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 block mb-1.5">After</span>
                    <p className={cn('text-xs leading-relaxed font-medium', hasChanged ? 'text-emerald-800' : 'text-neutral-600')}>{afterText}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-neutral-100 bg-neutral-50/30">
          <button
            onClick={onCancel}
            className="text-xs font-bold text-neutral-500 hover:text-[#0b1c30] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={isApplying}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0058be] hover:bg-[#004294] text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isApplying ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Applying...
              </>
            ) : (
              <>
                <CheckCircle2 size={14} />
                Apply Harmonization
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export const ConsistencyCheckSection: React.FC<Props> = React.memo(({
  profileSystem,
  onBack,
  onContinue,
}) => {
  const updateProfileField = useModule3Store(s => s.updateProfileField);
  const stage1Identity = useModule3Store(s => s.stage1Identity);
  const result = useMemo(() => analyzeConsistency(profileSystem), [profileSystem]);
  
  const [showPreview, setShowPreview] = useState(false);
  const [hasHarmonized, setHasHarmonized] = useState(false);

  const referenceHeadline = stage1Identity?.positioningHeadline || 'Strategic Systems Architect & Product Engineer';
  const referencePromise = stage1Identity?.proofLine || 'Deterministic architectures that scale with measurable ROI.';

  const handleOpenPreview = useCallback(() => {
    setShowPreview(true);
  }, []);

  const handleApplyHarmonize = useCallback(() => {
    const harmonized = harmonizeProfilePositioning(profileSystem, referenceHeadline, referencePromise);
    harmonized.forEach((asset) => {
      asset.fields.forEach((field) => {
        updateProfileField(asset.platform as any, field.key, field.value);
      });
    });
    setShowPreview(false);
    setHasHarmonized(true);
    setTimeout(() => setHasHarmonized(false), 4000);
  }, [profileSystem, referenceHeadline, referencePromise, updateProfileField]);

  // Generate micro-tips per platform
  const microTips = useMemo(() => {
    const tips = new Map<string, string>();
    for (const h of result.headlines) {
      tips.set(h.platform, generateMicroTip(h.headline, h.platform));
    }
    return tips;
  }, [result.headlines]);

  return (
    <div className="w-full space-y-6 text-left font-sans">
      {/* Before/After Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <HarmonizePreviewModal
            profileSystem={profileSystem}
            currentHeadlines={result.headlines}
            referenceHeadline={referenceHeadline}
            referencePromise={referencePromise}
            onApply={handleApplyHarmonize}
            onCancel={() => setShowPreview(false)}
          />
        )}
      </AnimatePresence>

      {/* Premium Header Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
        className="relative overflow-hidden p-6 rounded-3xl border border-neutral-200/60 bg-white shadow-xl shadow-black/[0.02] flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50/50 to-transparent rounded-bl-full pointer-events-none opacity-60" />
        
        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#0058be] to-[#004294] text-white shadow-md shadow-blue-500/20">
            <Activity size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0058be]/70 block mb-1">
              Cross-Platform Telemetry
            </span>
            <h2 className="text-xl font-black text-[#0b1c30] tracking-tight">Identity Cohesion Check</h2>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm leading-relaxed">
              High-ticket clients routinely cross-reference multiple profiles. We verify that your core positioning is identical across all active channels to prevent trust decay.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 bg-neutral-50/80 p-3 rounded-2xl border border-neutral-100">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Cohesion Score</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-700">
                {result.alignedCount} / {result.totalCount} Aligned
              </span>
            </div>
          </div>
          <CircularProgress score={result.score} />
        </div>
      </motion.div>

      {/* Keyword Legend */}
      {result.headlines.length >= 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-4 px-1"
        >
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Keyword Map:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-200 border border-emerald-300" />
            <span className="text-[10px] font-medium text-neutral-500">Shared across platforms</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-200 border border-amber-300" />
            <span className="text-[10px] font-medium text-neutral-500">Unique to one platform</span>
          </div>
        </motion.div>
      )}

      {/* Tone Drift Warnings */}
      <AnimatePresence mode="popLayout">
        {result.driftWarnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.98 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.98 }}
            transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
            className="overflow-hidden"
          >
            <div className="p-5 rounded-2xl bg-[#0b1c30] border border-neutral-800 shadow-2xl space-y-3 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-amber-400 text-sm font-bold tracking-tight">
                  <AlertTriangle size={18} className="animate-pulse" />
                  Tone Drift Detected ({result.driftWarnings.length} Issues)
                </div>
                
                <button
                  onClick={handleOpenPreview}
                  className="relative overflow-hidden group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#0b1c30] text-xs font-bold transition-all shadow-[0_0_15px_rgba(251,191,36,0.15)] cursor-pointer"
                >
                  {hasHarmonized ? (
                    <>
                      <CheckCircle2 size={14} className="text-emerald-700" />
                      Harmonized!
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                      Preview & Harmonize
                    </>
                  )}
                </button>
              </div>
              
              <div className="relative z-10 space-y-2 pt-1 border-t border-white/10">
                {result.driftWarnings.map((warn, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-neutral-300 font-medium">
                    <span className="text-amber-500/50 mt-0.5">•</span>
                    <span className="leading-relaxed">{warn.issue}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Headline Grid with Keyword Highlighting + Micro-Tips */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block">
            Headline Grid Comparison
          </span>
          <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
            {result.headlines.length} Channels Scanned
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.headlines.map((item, idx) => {
            const meta = PLATFORM_REGISTRY[item.platform] || {
              name: item.platform,
              icon: BrandIcons.PersonalSite,
              brandColor: 'bg-neutral-800',
            };
            const Icon = meta.icon;
            const hasDrift = result.driftWarnings.some(w => w.platform === item.platform);
            const tip = microTips.get(item.platform) || '';
            const platformKws = result.platformKeywords.get(item.platform) || new Set<string>();

            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 + idx * 0.05, ease: EASING.PREMIUM }}
                key={item.platform}
                className={cn(
                  'relative group p-5 rounded-2xl border transition-all duration-300 flex flex-col',
                  hasDrift 
                    ? 'bg-gradient-to-b from-amber-50/50 to-white border-amber-200/80 shadow-[0_4px_20px_-4px_rgba(251,191,36,0.1)]' 
                    : 'bg-white border-neutral-200/70 hover:border-neutral-300 hover:shadow-lg hover:shadow-black/[0.03]'
                )}
              >
                {/* Platform header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={cn('w-7 h-7 rounded-xl flex items-center justify-center text-white shadow-sm', meta.brandColor)}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-bold text-[#0b1c30]">
                      {meta.name}
                    </span>
                  </div>
                  {hasDrift ? (
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Tone Drift" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-emerald-500" title="Aligned" />
                  )}
                </div>

                {/* Highlighted headline */}
                <div className="relative flex-1">
                  <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-neutral-100 rounded-full" />
                  <p className="text-[13px] text-neutral-600 font-medium leading-relaxed pl-2">
                    "
                    <HighlightedHeadline
                      headline={item.headline}
                      commonKeywords={result.commonKeywords}
                      platformKeywords={platformKws}
                    />
                    "
                  </p>
                </div>

                {/* Micro-tip */}
                {tip && (
                  <div className="mt-3 pt-3 border-t border-neutral-100/80">
                    <div className="flex items-start gap-1.5">
                      <Lightbulb size={12} className="text-[#0058be]/50 mt-0.5 shrink-0" />
                      <p className="text-[11px] text-neutral-500 leading-relaxed font-medium">
                        {tip}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {result.headlines.length === 0 && (
          <div className="p-10 rounded-3xl bg-neutral-50 border border-neutral-200 border-dashed text-center">
            <Shield className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
            <p className="text-sm text-neutral-500 font-bold">No platform headlines found.</p>
            <p className="text-xs text-neutral-400 mt-1">Return to Platform Studio to configure your copy.</p>
          </div>
        )}
      </motion.div>

      {/* Continue CTA */}
      <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
        {onBack ? (
          <button 
            onClick={onBack}
            className="text-xs font-bold text-neutral-500 hover:text-[#0b1c30] transition-colors cursor-pointer"
          >
            ← Back to Platform Studio
          </button>
        ) : <div />}
        <ModuleButton variant="primary" onClick={onContinue}>
          Consistency Verified — Deploy & Proof →
        </ModuleButton>
      </div>
    </div>
  );
});

ConsistencyCheckSection.displayName = 'ConsistencyCheckSection';
