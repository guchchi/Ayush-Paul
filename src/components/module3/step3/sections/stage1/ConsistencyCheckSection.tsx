/**
 * Section 4: Cross-Platform Consistency Check
 * 
 * "Sab jagah same kahani bol raha hai ya nahi?"
 * 
 * Clean, executive-grade single-glance dashboard:
 *  1. Clean, readable typography (no cluttered confetti on every word)
 *  2. Clear view of what deliverables the user got in each platform package
 *  3. Primary positioning headline + secondary hook/CTA in a single look
 *  4. Synced authority anchor tags showing exact cross-channel continuity
 *  5. 1-click copy per card with visual feedback
 *  6. Expandable full-asset view drawer for each channel
 *  7. Friendly, constructive micro-tips
 *  8. Before vs After preview modal for safe 1-click harmonization
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
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Layers,
  Eye,
  ArrowRight,
  ExternalLink,
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

// ── Text Sanitization Helper ──────────────────────────────────────────────────

function cleanDisplayCopy(text: string): string {
  if (!text) return '';
  return text
    .replace(/^["'\s]+|["'\s]+$/g, '')    // strip surrounding quotes
    .replace(/\s+([.,;:!?])/g, '$1')       // remove space before punctuation: "text ." -> "text."
    .replace(/([.,;:!?])\1+/g, '$1')       // collapse duplicate punctuation: ".." -> "."
    .replace(/\s*-\s*/g, '-')              // "enterprise - grade" -> "enterprise-grade"
    .replace(/\s+/g, ' ')                  // collapse extra spaces
    .trim();
}

// ── Stopwords & Keyword Extraction ────────────────────────────────────────────

const DOMAIN_STOPWORDS = new Set([
  'with', 'that', 'this', 'your', 'from', 'have', 'been', 'more', 'they', 'will', 'into',
  'also', 'like', 'just', 'over', 'such', 'and', 'the', 'for', 'who', 'what', 'when',
  'where', 'through', 'help', 'helps', 'helping', 'about', 'some', 'there', 'their', 'them',
  'these', 'those', 'then', 'than', 'only', 'each', 'very', 'much', 'both', 'make', 'makes',
  'making', 'made', 'take', 'takes', 'taking', 'give', 'gives', 'giving', 'work', 'works',
  'working', 'show', 'shows', 'showing', 'area', 'team', 'space', 'ways', 'back', 'come',
  'came', 'good', 'well', 'here', 'look', 'looks', 'need', 'needs', 'part', 'even', 'most',
  'after', 'before', 'between', 'under', 'down', 'same', 'sure', 'real', 'true', 'full',
  'high', 'last', 'next', 'many', 'tell', 'tells', 'said', 'says', 'saying', 'call', 'calls',
  'know', 'knows', 'find', 'finds', 'long', 'short', 'want', 'wants', 'done', 'does', 'doing',
  'senior', 'partner', 'lead', 'leader', 'leaders', 'leadership', 'grade', 'scale', 'scaling',
  'operations', 'produce', 'local', 'obvious', 'choice', 'drives', 'traffic', 'foot'
]);

function extractDomainKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s,.|•\-→↗&:;/()"]+/)
    .filter(w => w.length > 3 && !DOMAIN_STOPWORDS.has(w));
}

// ── Smart Field Pickers ───────────────────────────────────────────────────────

function pickPrimaryField(fields: ProfileSystemAsset['fields']): { key: string; label: string; value: string } | null {
  const headlineField = fields.find(f =>
    f.key.includes('headline') || f.key.includes('hero') || f.key.includes('tagline') || f.key.includes('title')
  );
  if (headlineField && headlineField.value.trim().length > 3) return headlineField;

  const bioField = fields.find(f => f.key === 'bio' || f.key === 'banner_text');
  if (bioField && bioField.value.trim().length > 3) return bioField;

  const anyField = fields.find(f => f.value.trim().length > 3);
  return anyField || null;
}

function pickSecondaryField(
  fields: ProfileSystemAsset['fields'],
  primaryKey: string
): { key: string; label: string; value: string } | null {
  // Try finding high-value conversion elements like CTA or Hook
  const ctaOrHook = fields.find(f =>
    f.key !== primaryKey &&
    (f.key.includes('cta') || f.key.includes('pinned') || f.key.includes('highlights') || f.key.includes('video') || f.key.includes('about')) &&
    f.value.trim().length > 3
  );
  if (ctaOrHook) return ctaOrHook;

  // Fallback to any other non-primary field
  return fields.find(f => f.key !== primaryKey && f.value.trim().length > 3) || null;
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

function analyzeConsistency(profileSystem: ProfileSystemAsset[]): ConsistencyResult {
  const headlines: { platform: string; headline: string }[] = [];

  for (const p of profileSystem) {
    const mainField = pickPrimaryField(p.fields);
    if (mainField) {
      const firstLine = cleanDisplayCopy(mainField.value.split('\n')[0]);
      headlines.push({ platform: p.platform, headline: firstLine });
    }
  }

  const platformKeywords = new Map<string, Set<string>>();
  const allKeywordCounts = new Map<string, number>();

  for (const h of headlines) {
    const kws = new Set(extractDomainKeywords(h.headline));
    platformKeywords.set(h.platform, kws);
    kws.forEach(k => {
      allKeywordCounts.set(k, (allKeywordCounts.get(k) || 0) + 1);
    });
  }

  // Common keywords = appears in 2 or more platforms
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
      if (overlap > 0.1) alignedPairs++;
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
        issue: `${PLATFORM_REGISTRY[h.platform]?.name || h.platform} uses casual conversational tone while other channels use executive positioning.`,
        type: 'drift'
      });
    }
  }

  if (hasCasualPlatform && hasFormalPlatform && driftWarnings.length === 0) {
    driftWarnings.push({
      platform: 'mixed',
      issue: 'Cross-platform tone mismatch: You are mixing casual phrasing with executive authority terms.',
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

// ── Clean Headline Renderer (High-Legibility) ─────────────────────────────────

function CleanHighlightedHeadline({
  text,
  commonKeywords,
}: {
  text: string;
  commonKeywords: Set<string>;
}) {
  const cleaned = cleanDisplayCopy(text);
  const tokens = cleaned.split(/(\s+|[,.|•\-→↗&:;/()]+)/);

  return (
    <span className="leading-relaxed text-[13px] text-neutral-800 font-normal">
      {tokens.map((token, i) => {
        const clean = token.toLowerCase().replace(/[^a-z0-9]/g, '');
        const isCommon = clean.length > 3 && commonKeywords.has(clean);

        if (isCommon) {
          return (
            <span
              key={i}
              className="font-semibold text-emerald-900 bg-emerald-50/90 px-1 py-0.5 rounded border border-emerald-200/60 shadow-2xs"
              title="Verified authority anchor (synced across channels)"
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

// ── Per-Platform Micro-Tips ───────────────────────────────────────────────────

function generateMicroTip(headline: string, platform: string): string {
  const lower = headline.toLowerCase();
  const platName = PLATFORM_REGISTRY[platform]?.name || platform;

  const hasNumbers = /\d+[%xX+]|\$\d|\d+\s*(clients|projects|videos|brands|companies)/i.test(headline);
  const hasCta = ['book', 'dm', 'schedule', 'apply', 'link in', 'let\'s talk', 'reach out', 'work with', 'hire'].some(s => lower.includes(s));
  const hasMethodology = ['framework', 'system', 'method', 'process', 'pipeline', 'engine', 'architecture', 'engineering'].some(s => lower.includes(s));
  const hasOutcome = ['revenue', 'growth', 'scale', 'transform', 'convert', 'result', 'roi', 'profit'].some(s => lower.includes(s));

  if (platform === 'linkedin') {
    if (!hasNumbers) return `Tip: Adding a tangible metric (e.g. "50+ projects" or "$1M+ scale") to your LinkedIn headline boosts profile views by up to 2x.`;
    if (!hasMethodology) return `Tip: Highlighting a named proprietary system on LinkedIn positions you as an established partner rather than a task-based vendor.`;
    return `Strong headline: LinkedIn's recommendation algorithm rewards profiles with clearly defined target audiences.`;
  }

  if (platform === 'twitter' || platform === 'x') {
    if (headline.length > 120) return `Tip: Concise X bios perform best — keeping your positioning under 100 characters gives a punchier, high-status impression.`;
    if (!hasCta) return `Tip: A subtle bottom note like "DM to discuss" or a link to your case studies reliably drives inbound direct messages.`;
    return `Clean and punchy: Concise bios on X convert curious visitors into profile follows significantly faster.`;
  }

  if (platform === 'instagram') {
    if (!hasCta) return `Tip: Adding a clear single action ("Link in bio" or "DM for inquiries") turns passive profile visitors into warm conversations.`;
    return `Visual clarity: Short, line-separated positioning on Instagram makes your authority instantly readable on mobile.`;
  }

  if (platform === 'personal_site') {
    if (!hasOutcome) return `Tip: Visitors decide in 3 seconds — leading with the exact business outcome you deliver builds immediate confidence.`;
    return `Authoritative tagline: Sets an executive tone for inbound prospects visiting your personal domain.`;
  }

  if (platform === 'youtube') {
    if (!hasOutcome) return `Tip: Channel banners that clearly answer "What will I learn by subscribing?" increase channel conversions by 40%.`;
    return `Focused channel hook: Clearly communicates your niche and content value proposition at a single glance.`;
  }

  if (!hasNumbers && !hasMethodology) return `Tip: Naming your unique mechanism makes your positioning memorable and easy for clients to recommend.`;
  return `Consistent positioning: Uniform messaging across this channel protects client trust during cross-reference audits.`;
}

// ── Circular Score Ring ───────────────────────────────────────────────────────

const CircularProgress = ({ score }: { score: number }) => {
  const size = 56;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const color = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  const bgColor = score >= 80 ? 'rgba(16, 185, 129, 0.1)' : score >= 50 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)';

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
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

// ── Single Platform Package Card ──────────────────────────────────────────────

interface PlatformCardProps {
  platformKey: string;
  headline: string;
  asset?: ProfileSystemAsset;
  hasDrift: boolean;
  tip: string;
  commonKeywords: Set<string>;
  platformKws: Set<string>;
  idx: number;
}

const PlatformCard: React.FC<PlatformCardProps> = ({
  platformKey,
  headline,
  asset,
  hasDrift,
  tip,
  commonKeywords,
  platformKws,
  idx,
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const meta = PLATFORM_REGISTRY[platformKey] || {
    name: platformKey,
    icon: BrandIcons.PersonalSite,
    brandColor: 'bg-neutral-800',
    bgColor: 'bg-neutral-50',
    borderColor: 'border-neutral-200',
  };
  const Icon = meta.icon;

  const fields = asset?.fields || [];
  const primaryField = pickPrimaryField(fields);
  const secondaryField = primaryField ? pickSecondaryField(fields, primaryField.key) : null;

  // Find which common keywords matched on this platform
  const matchedAnchors = useMemo(() => {
    return Array.from(platformKws).filter(k => commonKeywords.has(k)).slice(0, 4);
  }, [platformKws, commonKeywords]);

  const handleCopyPrimary = () => {
    const textToCopy = cleanDisplayCopy(primaryField?.value || headline);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08 + idx * 0.06, ease: EASING.PREMIUM }}
      className={cn(
        'relative group rounded-3xl border transition-all duration-300 flex flex-col bg-white overflow-hidden shadow-xs hover:shadow-md',
        hasDrift
          ? 'border-amber-300/80 ring-1 ring-amber-200/50'
          : 'border-neutral-200/80 hover:border-neutral-300'
      )}
    >
      {/* 1. Header Bar: Platform Identity + Deliverables Count + Copy Action */}
      <div className="p-4 sm:p-5 border-b border-neutral-100 bg-neutral-50/40 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0', meta.brandColor)}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#0b1c30] tracking-tight">{meta.name}</h3>
              {hasDrift ? (
                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-200/60">
                  <AlertTriangle size={10} /> Needs Sync
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  <CheckCircle2 size={10} /> Aligned
                </span>
              )}
            </div>
            <span className="text-[11px] text-neutral-400 font-medium">
              {fields.length} Assets Generated
            </span>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopyPrimary}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-600 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          title="Copy primary positioning text"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-600 stroke-[2.5]" />
              <span className="text-emerald-700 text-[11px]">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} className="text-neutral-500" />
              <span className="text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* 2. "What You Got" Quick-Glance Deliverables Row */}
      <div className="px-4 sm:px-5 py-2.5 bg-neutral-100/40 border-b border-neutral-100 flex items-center gap-1.5 flex-wrap">
        <span className="text-[9px] font-extrabold uppercase tracking-wider text-neutral-400 mr-1">Includes:</span>
        {fields.map(f => (
          <span
            key={f.key}
            className="text-[10px] font-semibold text-neutral-700 bg-white border border-neutral-200/70 px-2 py-0.5 rounded-md shadow-2xs"
          >
            ✓ {f.label.replace(/\s*\(.*?\)/g, '')}
          </span>
        ))}
      </div>

      {/* 3. Main Content Body */}
      <div className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3.5">
          {/* Primary Positioning Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-400">
                {primaryField?.label || 'Primary Positioning'}
              </span>
              {primaryField && (
                <span className="text-[10px] font-medium text-neutral-400">
                  {cleanDisplayCopy(primaryField.value).length} chars
                </span>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-50/70 border border-neutral-100/90 hover:border-neutral-200 transition-colors">
              <CleanHighlightedHeadline
                text={primaryField?.value || headline}
                commonKeywords={commonKeywords}
              />
            </div>
          </div>

          {/* Secondary Deliverable Showcase (e.g. CTA / Hook / Banner) */}
          {secondaryField && (
            <div className="p-3 rounded-2xl bg-blue-50/30 border border-blue-100/60">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#0058be] block mb-1">
                {secondaryField.label}
              </span>
              <p className="text-xs text-neutral-700 font-medium leading-relaxed line-clamp-2">
                "{cleanDisplayCopy(secondaryField.value)}"
              </p>
            </div>
          )}

          {/* Synced Authority Anchors Bar */}
          {matchedAnchors.length > 0 && (
            <div className="pt-1 flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                Shared Anchors:
              </span>
              {matchedAnchors.map(anchor => (
                <span
                  key={anchor}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/70"
                >
                  <Check size={10} className="text-emerald-600 stroke-[3]" />
                  {anchor}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 4. Expandable Full Asset Drawer */}
        <div className="pt-2 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between text-[11px] font-bold text-neutral-500 hover:text-[#0058be] transition-colors py-1 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Layers size={13} className="text-neutral-400" />
              {expanded ? 'Hide complete package' : `View all ${fields.length} generated fields`}
            </span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: EASING.PREMIUM }}
                className="overflow-hidden pt-3 space-y-2.5"
              >
                {fields.map(f => (
                  <div key={f.key} className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/60 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">{f.label}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(f.value);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="text-[9px] font-bold text-[#0058be] hover:underline cursor-pointer"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-xs text-neutral-800 font-normal leading-relaxed whitespace-pre-line">
                      {cleanDisplayCopy(f.value)}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 5. Helpful Micro-Tip Footer */}
        {tip && (
          <div className="pt-2">
            <div className="p-2.5 rounded-xl bg-neutral-50/90 border border-neutral-100 flex items-start gap-2">
              <Lightbulb size={13} className="text-[#0058be] mt-0.5 shrink-0" />
              <p className="text-[11px] text-neutral-500 leading-relaxed font-normal">
                {tip}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
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

  const afterHeadlines = useMemo(() => {
    const map = new Map<string, string>();
    for (const asset of harmonizedAssets) {
      const primary = pickPrimaryField(asset.fields);
      if (primary) {
        map.set(asset.platform, cleanDisplayCopy(primary.value.split('\n')[0]));
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: EASING.PREMIUM }}
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#0058be]/10">
              <Eye size={18} className="text-[#0058be]" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#0b1c30] tracking-tight">Harmonization Preview</h3>
              <p className="text-[11px] text-neutral-500 font-medium">
                Review how your headlines will be synchronized before confirming
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

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
              <div key={item.platform} className="rounded-2xl border border-neutral-100 bg-white overflow-hidden shadow-2xs">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-neutral-50/80 border-b border-neutral-100">
                  <div className={cn('w-5 h-5 rounded-lg flex items-center justify-center text-white shrink-0', meta.brandColor)}>
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-bold text-[#0b1c30]">{meta.name}</span>
                  {hasChanged ? (
                    <span className="text-[9px] font-bold text-[#0058be] bg-[#0058be]/10 px-2 py-0.5 rounded-md ml-auto">
                      WILL HARMONIZE
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md ml-auto">
                      ALREADY ALIGNED
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100">
                  <div className="p-3.5">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                      Current Copy
                    </span>
                    <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                      "{cleanDisplayCopy(item.headline)}"
                    </p>
                  </div>
                  <div className={cn('p-3.5', hasChanged ? 'bg-emerald-50/40' : 'bg-neutral-50/30')}>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-700 block mb-1">
                      Synchronized Copy
                    </span>
                    <p className={cn('text-xs leading-relaxed font-medium', hasChanged ? 'text-emerald-900' : 'text-neutral-600')}>
                      "{cleanDisplayCopy(afterText)}"
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

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
                Applying Harmonization...
              </>
            ) : (
              <>
                <CheckCircle2 size={14} />
                Apply Harmonization to All Channels
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

      {/* 1. Telemetry Top Header Dashboard */}
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
            <p className="text-xs text-neutral-500 mt-1 max-w-lg leading-relaxed">
              Compare all your generated profile packages side by side. We verify that your core positioning, methodology, and target audience stay unified across all active platforms.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 bg-neutral-50/80 p-3 rounded-2xl border border-neutral-100">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Cohesion Score</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-700">
                {result.alignedCount} / {result.totalCount} Channels Synced
              </span>
            </div>
          </div>
          <CircularProgress score={result.score} />
        </div>
      </motion.div>

      {/* 2. Synced Keyword Legend Banner */}
      {result.commonKeywords.size > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 flex items-center justify-between flex-wrap gap-2.5"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-950">
              Verified Synced Authority Terms across your profiles:
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {Array.from(result.commonKeywords).slice(0, 5).map(kw => (
              <span
                key={kw}
                className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-300/60 shadow-2xs"
              >
                ✓ {kw}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* 3. Tone Drift Warnings (If Any) */}
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

              <div className="relative z-10 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2.5 text-amber-400 text-sm font-bold tracking-tight">
                  <AlertTriangle size={18} className="animate-pulse" />
                  Tone Drift Detected ({result.driftWarnings.length} Discrepanc{result.driftWarnings.length === 1 ? 'y' : 'ies'})
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
                      Preview & Auto-Harmonize
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

      {/* 4. Single-Look Platform Packages Grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block">
            Generated Channel Packages Overview ({result.headlines.length} Platforms)
          </span>
          <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2.5 py-0.5 rounded-md">
            {result.score}% Overall Cohesion
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {result.headlines.map((item, idx) => {
            const asset = profileSystem.find(p => p.platform === item.platform);
            const hasDrift = result.driftWarnings.some(w => w.platform === item.platform);
            const tip = microTips.get(item.platform) || '';
            const platformKws = result.platformKeywords.get(item.platform) || new Set<string>();

            return (
              <PlatformCard
                key={item.platform}
                platformKey={item.platform}
                headline={item.headline}
                asset={asset}
                hasDrift={hasDrift}
                tip={tip}
                commonKeywords={result.commonKeywords}
                platformKws={platformKws}
                idx={idx}
              />
            );
          })}
        </div>

        {result.headlines.length === 0 && (
          <div className="p-12 rounded-3xl bg-neutral-50 border border-neutral-200 border-dashed text-center space-y-2">
            <Shield className="w-9 h-9 text-neutral-300 mx-auto" />
            <p className="text-sm text-neutral-600 font-bold">No platform profiles generated yet.</p>
            <p className="text-xs text-neutral-400">Return to Platform Studio to configure your channel copy.</p>
          </div>
        )}
      </motion.div>

      {/* 5. Navigation CTA Bar */}
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
