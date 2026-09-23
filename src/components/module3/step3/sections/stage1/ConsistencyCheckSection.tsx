/**
 * Section 4: Cross-Platform Consistency Check
 * 
 * "Sab jagah same kahani bol raha hai ya nahi?"
 * 
 * Master Cohesion Dashboard:
 *  1. "North Star" Master Identity Banner
 *  2. "Sea of Green" highlighting for shared anchor keywords
 *  3. "Snap to Core Identity" inline fixing using PlatformCopyEngine
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
  Copy,
  Check,
  Target
} from 'lucide-react';
import { ModuleButton } from '@/src/components/workspace/ModuleButton';
import { BrandIcons } from '@/src/components/module3/step3/brand/BrandIcons';
import { useModule3Store } from '@/src/lib/module3/store';
import { PLATFORM_REGISTRY } from '@/src/lib/module3/platformRegistry';
import { PlatformCopyEngine, ToneType } from '@/src/lib/module3/platform-copy-engine';

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
    .replace(/\s+([.,;:!?])/g, '$1')       // remove space before punctuation
    .replace(/([.,;:!?])\1+/g, '$1')       // collapse duplicate punctuation
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

function analyzeConsistency(profileSystem: ProfileSystemAsset[], referenceHeadline: string): ConsistencyResult {
  const headlines: { platform: string; headline: string }[] = [];

  for (const p of profileSystem) {
    const mainField = pickPrimaryField(p.fields);
    if (mainField) {
      const firstLine = cleanDisplayCopy(mainField.value.split('\n')[0]);
      headlines.push({ platform: p.platform, headline: firstLine });
    }
  }

  const platformKeywords = new Map<string, Set<string>>();
  
  // Base keywords come from the Master Identity
  const masterKws = new Set(extractDomainKeywords(referenceHeadline));

  for (const h of headlines) {
    const kws = new Set(extractDomainKeywords(h.headline));
    platformKeywords.set(h.platform, kws);
  }

  const casualMarkers = ['lol', 'just', 'vibing', 'hey', 'haha', 'btw', 'tbh', 'crazy'];
  const formalMarkers = ['strategic', 'executive', 'enterprise', 'verifiable', 'systematic', 'authority', 'architect', 'systems', 'deterministic'];

  const driftWarnings: { platform: string; issue: string; type: 'drift' | 'conflict' }[] = [];
  
  let alignedCount = 0;

  for (const h of headlines) {
    const lower = h.headline.toLowerCase();
    const isCasual = casualMarkers.some(m => lower.includes(m));
    
    // Check overlap with Master Identity
    const pKws = platformKeywords.get(h.platform) || new Set();
    const overlap = Array.from(pKws).filter(k => masterKws.has(k)).length;
    
    let drifted = false;

    if (isCasual) {
      driftWarnings.push({
        platform: h.platform,
        issue: 'Uses casual conversational tone (drift from executive core).',
        type: 'drift'
      });
      drifted = true;
    } else if (overlap === 0 && masterKws.size > 0 && pKws.size > 0) {
      driftWarnings.push({
        platform: h.platform,
        issue: 'Lacks shared authority anchors with Master Identity.',
        type: 'drift'
      });
      drifted = true;
    }

    if (!drifted) {
      alignedCount++;
    }
  }

  const score = headlines.length > 0 ? Math.round((alignedCount / headlines.length) * 100) : 100;

  return {
    alignedCount,
    totalCount: headlines.length,
    score,
    driftWarnings,
    headlines,
    commonKeywords: masterKws,
    platformKeywords,
  };
}

// ── Clean Headline Renderer (High-Legibility Sea of Green) ────────────────────

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
              className="font-bold text-emerald-700 bg-emerald-100/50 px-1 py-0.5 rounded shadow-2xs transition-all duration-300"
              title="Aligned with Master Identity"
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

// ── Circular Score Ring ───────────────────────────────────────────────────────

const CircularProgress = ({ score }: { score: number }) => {
  const size = 56;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const color = score >= 100 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444';
  const bgColor = score >= 100 ? 'rgba(16, 185, 129, 0.1)' : score >= 70 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)';

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
        {score === 100 ? (
           <Check size={20} className="text-emerald-500 stroke-[3]" />
        ) : (
          <span className="text-sm font-black text-[#0b1c30] tracking-tight leading-none">{score}</span>
        )}
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
  commonKeywords: Set<string>;
  platformKws: Set<string>;
  idx: number;
  onSnapToCore: (platform: string) => void;
  isSnapping: boolean;
}

const PlatformCard: React.FC<PlatformCardProps> = ({
  platformKey,
  headline,
  asset,
  hasDrift,
  commonKeywords,
  platformKws,
  idx,
  onSnapToCore,
  isSnapping
}) => {
  const [copied, setCopied] = useState(false);

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
      transition={{ duration: 0.4, delay: 0.05 + idx * 0.05, ease: EASING.PREMIUM }}
      className={cn(
        'relative group rounded-[24px] border transition-all duration-500 flex flex-col bg-white overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 cursor-default',
        hasDrift
          ? 'border-amber-200 ring-2 ring-amber-100/50 hover:border-amber-300'
          : 'border-neutral-200/50 hover:border-[#0058be]/30'
      )}
    >
      {/* 1. Header Bar: Platform Identity */}
      <div className="p-4 sm:p-5 border-b border-neutral-100 bg-neutral-50/40 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0', meta.brandColor)}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#0b1c30] tracking-tight">{meta.name}</h3>
            </div>
            <span className="text-[11px] text-neutral-400 font-medium">
              {fields.length} Assets Generated
            </span>
          </div>
        </div>

        {/* Action Button: Snap or Copy */}
        {hasDrift ? (
          <button
            onClick={() => onSnapToCore(platformKey)}
            disabled={isSnapping}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-b from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 text-amber-900 text-xs font-extrabold transition-all shadow-[0_4px_14px_rgba(251,191,36,0.25)] hover:shadow-[0_6px_20px_rgba(251,191,36,0.4)] disabled:opacity-50 cursor-pointer"
          >
            {isSnapping ? (
              <RefreshCw size={12} className="animate-spin" />
            ) : (
              <Sparkles size={12} />
            )}
            Snap to Core
          </button>
        ) : (
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
        )}
      </div>

      {/* 2. Main Content Body - Just the Sea of Green Headline */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-center bg-white">
        <CleanHighlightedHeadline
          text={primaryField?.value || headline}
          commonKeywords={commonKeywords}
        />
      </div>

      {/* 3. Footer: Visual Anchors indicator */}
      <div className="px-4 py-3 bg-neutral-50/50 border-t border-neutral-100 flex items-center justify-between">
        {hasDrift ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-700">
            <AlertTriangle size={12} /> Tone Drift Detected
          </span>
        ) : (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-emerald-700">
              <CheckCircle2 size={12} /> Synced
            </span>
            <div className="flex items-center gap-1">
              {matchedAnchors.map(anchor => (
                <span key={anchor} className="text-[9px] font-bold text-emerald-800 bg-emerald-100/50 px-1.5 py-0.5 rounded border border-emerald-200/50">
                  {anchor}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

export const ConsistencyCheckSection: React.FC<Props> = React.memo(({
  profileSystem,
  activeTone,
  onBack,
  onContinue,
}) => {
  const updateProfileField = useModule3Store(s => s.updateProfileField);
  const stage1Identity = useModule3Store(s => s.stage1Identity);
  const mod1MarketId = useModule3Store(s => s.mod1MarketId);
  const mod1ServiceId = useModule3Store(s => s.mod1ServiceId);
  const mod1Positioning = useModule3Store(s => s.mod1Positioning);
  const mod2UniqueMechanism = useModule3Store(s => s.mod2UniqueMechanism);

  const referenceHeadline = stage1Identity?.positioningHeadline || 'Strategic Systems Architect & Product Engineer';
  
  const result = useMemo(() => analyzeConsistency(profileSystem, referenceHeadline), [profileSystem, referenceHeadline]);

  const [snappingPlatform, setSnappingPlatform] = useState<string | null>(null);

  const handleSnapToCore = useCallback((platformKey: string) => {
    setSnappingPlatform(platformKey);
    
    // Build context for PlatformCopyEngine
    const context = {
      marketId: mod1MarketId || '',
      serviceId: mod1ServiceId || '',
      positioning: mod1Positioning || '',
      mechanism: mod2UniqueMechanism || '',
      promise: stage1Identity?.proofLine || '',
      primaryProofTitle: null,
      proofTitles: [],
    };

    // Generate new assets using the exact tone to snap it back
    // We use a fixed cycleIndex (0) to ensure deterministic snapping
    const newAssets = PlatformCopyEngine.generateProfiles(context, 0, activeTone as ToneType);
    
    const snappedAsset = newAssets.find(a => a.platform === platformKey);
    
    if (snappedAsset) {
      setTimeout(() => {
        snappedAsset.fields.forEach((field) => {
          updateProfileField(platformKey as any, field.key, field.value);
        });
        setSnappingPlatform(null);
      }, 600); // Artificial delay for UX
    } else {
      setSnappingPlatform(null);
    }
  }, [mod1MarketId, mod1ServiceId, mod1Positioning, mod2UniqueMechanism, stage1Identity, activeTone, updateProfileField]);

  return (
    <div className="w-full space-y-8 text-left font-sans">
      
      {/* 1. The "North Star" Master Identity Banner */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
        className="relative overflow-hidden p-8 md:p-10 rounded-[2.5rem] border border-[#0058be]/30 bg-[#061224] shadow-[0_30px_60px_rgba(0,88,190,0.15)] flex flex-col md:flex-row items-center justify-between gap-8"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-500/15 via-blue-900/5 to-transparent rounded-bl-full pointer-events-none blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-2 text-[#0058be] font-black uppercase tracking-widest text-[10px] mb-3">
            <Target size={14} className="text-blue-400" />
            <span className="text-blue-400">Your Master Identity (North Star)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
            "{referenceHeadline}"
          </h2>
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            {Array.from(result.commonKeywords).map(kw => (
               <span key={kw} className="text-xs font-bold text-blue-900 bg-blue-400 px-2.5 py-1 rounded-md shadow-[0_0_10px_rgba(96,165,250,0.3)]">
                 {kw}
               </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center bg-white/5 p-4 rounded-3xl border border-white/10 min-w-[160px]">
          <CircularProgress score={result.score} />
          <div className="mt-3 text-center">
            <span className="text-sm font-bold text-white block">
              {result.alignedCount} / {result.totalCount}
            </span>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Platforms Synced
            </span>
          </div>
        </div>
      </motion.div>

      {/* 2. Single-Look Platform Packages Grid (Sea of Green) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black uppercase tracking-widest text-neutral-800 block">
            Channel Matrix
          </span>
          <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2.5 py-0.5 rounded-md">
            Verify the Sea of Green
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {result.headlines.map((item, idx) => {
            const asset = profileSystem.find(p => p.platform === item.platform);
            const hasDrift = result.driftWarnings.some(w => w.platform === item.platform);
            const platformKws = result.platformKeywords.get(item.platform) || new Set<string>();

            return (
              <PlatformCard
                key={item.platform}
                platformKey={item.platform}
                headline={item.headline}
                asset={asset}
                hasDrift={hasDrift}
                commonKeywords={result.commonKeywords}
                platformKws={platformKws}
                idx={idx}
                onSnapToCore={handleSnapToCore}
                isSnapping={snappingPlatform === item.platform}
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

      {/* 3. Navigation CTA Bar */}
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
