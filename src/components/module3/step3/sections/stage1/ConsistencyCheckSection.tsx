/**
 * Section 4: Cross-Platform Consistency Check
 * 
 * "Sab jagah same kahani bol raha hai ya nahi?"
 * Side-by-side headline comparison, consistency score, tone drift warnings, 1-click auto-harmonize.
 * Premium, high-contrast luxury design.
 */

import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { EASING, DURATION } from '@/src/lib/motion-presets';
import type { ProfileSystemAsset } from '@/src/data/module3/authority-suite-engine';
import {
  CheckCircle2,
  AlertTriangle,
  Eye,
  RefreshCw,
  Sparkles,
  Shield,
  Activity,
  ArrowRight
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

interface ConsistencyResult {
  alignedCount: number;
  totalCount: number;
  score: number; // 0–100
  driftWarnings: { platform: string; issue: string; type: 'drift' | 'conflict' }[];
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

  const stopwords = new Set(['with', 'that', 'this', 'your', 'from', 'have', 'been', 'more', 'they', 'will', 'into', 'also', 'like', 'just', 'over', 'such', 'and', 'the', 'for']);
  const extractKeywords = (text: string) =>
    text.toLowerCase().split(/[\s,.|•\-→↗&]+/).filter(w => w.length > 3 && !stopwords.has(w));

  const keywordSets = headlines.map(h => ({
    platform: h.platform,
    keywords: new Set(extractKeywords(h.headline)),
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
  };
}

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
}

export const ConsistencyCheckSection: React.FC<Props> = React.memo(({
  profileSystem,
  onBack,
  onContinue,
}) => {
  const updateProfileField = useModule3Store(s => s.updateProfileField);
  const stage1Identity = useModule3Store(s => s.stage1Identity);
  const result = useMemo(() => analyzeConsistency(profileSystem), [profileSystem]);
  
  const [isHarmonizing, setIsHarmonizing] = useState(false);
  const [hasHarmonized, setHasHarmonized] = useState(false);

  const handleHarmonize = async () => {
    setIsHarmonizing(true);
    
    // Premium artificial delay to signify "processing"
    await new Promise(r => setTimeout(r, 1500));

    const referenceHeadline = stage1Identity?.positioningHeadline || 'Strategic Systems Architect & Product Engineer';
    const referencePromise = stage1Identity?.proofLine || 'Deterministic architectures that scale with measurable ROI.';

    const harmonized = harmonizeProfilePositioning(profileSystem, referenceHeadline, referencePromise);
    harmonized.forEach((asset) => {
      asset.fields.forEach((field) => {
        updateProfileField(asset.platform as any, field.key, field.value);
      });
    });
    
    setIsHarmonizing(false);
    setHasHarmonized(true);
    
    // Reset success state after a few seconds
    setTimeout(() => setHasHarmonized(false), 3000);
  };

  return (
    <div className="w-full space-y-6 text-left font-sans">
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

      {/* Tone Drift Warnings (High-Contrast Alert) */}
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
              {/* Subtle tech grid background pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-amber-400 text-sm font-bold tracking-tight">
                  <AlertTriangle size={18} className="animate-pulse" />
                  Tone Drift Detected ({result.driftWarnings.length} Issues)
                </div>
                
                <button
                  onClick={handleHarmonize}
                  disabled={isHarmonizing}
                  className="relative overflow-hidden group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#0b1c30] text-xs font-bold transition-all shadow-[0_0_15px_rgba(251,191,36,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isHarmonizing ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Harmonizing...
                    </>
                  ) : hasHarmonized ? (
                    <>
                      <CheckCircle2 size={14} className="text-emerald-700" />
                      Harmonized!
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                      Auto-Harmonize Identity
                    </>
                  )}
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_2s_infinite]" />
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

      {/* Side-by-Side Headline Cards */}
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

            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 + idx * 0.05, ease: EASING.PREMIUM }}
                key={item.platform}
                className={cn(
                  'relative group p-5 rounded-2xl border transition-all duration-300',
                  hasDrift 
                    ? 'bg-gradient-to-b from-amber-50/50 to-white border-amber-200/80 shadow-[0_4px_20px_-4px_rgba(251,191,36,0.1)]' 
                    : 'bg-white border-neutral-200/70 hover:border-neutral-300 hover:shadow-lg hover:shadow-black/[0.03]'
                )}
              >
                <div className="flex items-center justify-between mb-4">
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
                
                <div className="relative">
                  <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-neutral-100 rounded-full" />
                  <p className="text-[13px] text-neutral-600 font-medium leading-relaxed pl-2 line-clamp-4">
                    "{item.headline}"
                  </p>
                </div>
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
