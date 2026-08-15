/**
 * Section 1: Authority Audit
 * 
 * "Pehle dekh tu kahan khada hai"
 * Shows Profile Authority Score (0-100), Platform Readiness Grid, and Gap Statement.
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { EASING, DURATION } from '@/src/lib/motion-presets';
import {
  calculateAuthorityScore,
  calculatePlatformReadiness,
  generateGapStatement,
  type AuthorityScoreBreakdown,
  type PlatformReadiness,
} from '@/src/lib/module3/authority-score-engine';
import type { ProfileSystemAsset } from '@/src/data/module3/authority-suite-engine';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Circle,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { ModuleButton } from '@/src/components/workspace/ModuleButton';

interface Props {
  profileSystem: ProfileSystemAsset[];
  headline: string;
  proofLine: string;
  uniqueMechanism: string;
  userName: string;
  userHandle: string;
  activeTone: string;
  recommendedPlatforms: string[];
  onContinue: () => void;
}

// Animated Score Ring Component
function ScoreRing({ score, maxScore = 100, size = 160 }: { score: number; maxScore?: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(score / maxScore, 1);
  const strokeDashoffset = circumference * (1 - percentage);

  const getColor = () => {
    if (score >= 70) return { stroke: '#10b981', bg: 'text-emerald-400', label: 'text-emerald-500' };
    if (score >= 40) return { stroke: '#f59e0b', bg: 'text-amber-400', label: 'text-amber-500' };
    return { stroke: '#ef4444', bg: 'text-red-400', label: 'text-red-500' };
  };

  const color = getColor();

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={8}
          className="text-neutral-800"
        />
        {/* Animated score arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color.stroke}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        />
      </svg>
      {/* Center number */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={cn('text-4xl font-black', color.bg)}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
          / {maxScore}
        </span>
      </div>
    </div>
  );
}

// Dimension Score Bar
function DimensionBar({ dimension }: { dimension: { score: number; maxScore: number; label: string; reasoning: string; status: string } }) {
  const pct = Math.round((dimension.score / dimension.maxScore) * 100);
  const color = dimension.status === 'strong' ? 'bg-emerald-500' : dimension.status === 'moderate' ? 'bg-amber-500' : 'bg-red-500';
  const textColor = dimension.status === 'strong' ? 'text-emerald-400' : dimension.status === 'moderate' ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-neutral-300">{dimension.label}</span>
        <span className={cn('text-xs font-black', textColor)}>
          {dimension.score}/{dimension.maxScore}
        </span>
      </div>
      <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', color)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        />
      </div>
      <p className="text-[10px] text-neutral-500 leading-relaxed">{dimension.reasoning}</p>
    </div>
  );
}

// Platform Readiness Card
function PlatformCard({ platform }: { platform: PlatformReadiness }) {
  const statusConfig = {
    optimized: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-950/50', border: 'border-emerald-800/50', label: 'Optimized' },
    needs_work: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-950/50', border: 'border-amber-800/50', label: 'Needs Work' },
    not_started: { icon: Circle, color: 'text-neutral-500', bg: 'bg-neutral-900', border: 'border-neutral-800', label: 'Not Started' },
  };

  const config = statusConfig[platform.status];
  const Icon = config.icon;

  return (
    <div className={cn('p-3 rounded-2xl border space-y-1.5', config.bg, config.border)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-neutral-200">{platform.platformLabel}</span>
        <Icon size={14} className={config.color} />
      </div>
      <div className="flex items-center justify-between">
        <span className={cn('text-[10px] font-bold', config.color)}>{config.label}</span>
        <span className="text-[10px] text-neutral-500 font-mono">{platform.filledFields}/{platform.totalFields} fields</span>
      </div>
      {/* Mini progress bar */}
      <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700',
            platform.status === 'optimized' ? 'bg-emerald-500' : platform.status === 'needs_work' ? 'bg-amber-500' : 'bg-neutral-700'
          )}
          style={{ width: `${platform.percentComplete}%` }}
        />
      </div>
    </div>
  );
}

export const AuthorityAuditSection: React.FC<Props> = React.memo(({
  profileSystem,
  headline,
  proofLine,
  uniqueMechanism,
  userName,
  userHandle,
  activeTone,
  recommendedPlatforms,
  onContinue,
}) => {
  const scoreBreakdown = useMemo(() => calculateAuthorityScore({
    profileSystem,
    headline,
    proofLine,
    uniqueMechanism,
    userName,
    userHandle,
    activeTone,
  }), [profileSystem, headline, proofLine, uniqueMechanism, userName, userHandle, activeTone]);

  const platformReadiness = useMemo(
    () => calculatePlatformReadiness(profileSystem, recommendedPlatforms),
    [profileSystem, recommendedPlatforms]
  );

  const gapStatement = useMemo(
    () => generateGapStatement(scoreBreakdown, userName),
    [scoreBreakdown, userName]
  );

  const severityConfig = {
    critical: { bg: 'bg-red-950/60', border: 'border-red-800/60', icon: AlertTriangle, iconColor: 'text-red-400', textColor: 'text-red-300' },
    moderate: { bg: 'bg-amber-950/60', border: 'border-amber-800/60', icon: AlertTriangle, iconColor: 'text-amber-400', textColor: 'text-amber-300' },
    minor: { bg: 'bg-blue-950/60', border: 'border-blue-800/60', icon: TrendingUp, iconColor: 'text-blue-400', textColor: 'text-blue-300' },
    none: { bg: 'bg-emerald-950/60', border: 'border-emerald-800/60', icon: CheckCircle2, iconColor: 'text-emerald-400', textColor: 'text-emerald-300' },
  };
  const gapConfig = severityConfig[gapStatement.severity];
  const GapIcon = gapConfig.icon;

  return (
    <div className="w-full space-y-6 text-left font-sans">
      {/* Hero Score Card — Dark gradient with score ring */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <Shield size={16} className="text-[#0058be]" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0058be]">
            Profile Authority Audit
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
          {/* Left: Score Ring */}
          <div className="flex flex-col items-center gap-3">
            <ScoreRing score={scoreBreakdown.total} />
            <span className="text-xs font-bold text-neutral-400">
              {scoreBreakdown.total >= 70 ? 'Authority Level' : scoreBreakdown.total >= 40 ? 'Growth Stage' : 'Foundation Stage'}
            </span>
          </div>

          {/* Right: 4 Dimension Bars */}
          <div className="flex-1 w-full space-y-4">
            <DimensionBar dimension={scoreBreakdown.positioningClarity} />
            <DimensionBar dimension={scoreBreakdown.platformCompleteness} />
            <DimensionBar dimension={scoreBreakdown.toneConsistency} />
            <DimensionBar dimension={scoreBreakdown.ctaPresence} />
          </div>
        </div>
      </motion.div>

      {/* Gap Statement Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.15 }}
        className={cn('p-5 rounded-3xl border', gapConfig.bg, gapConfig.border)}
      >
        <div className="flex items-start gap-3">
          <GapIcon size={20} className={cn('mt-0.5 shrink-0', gapConfig.iconColor)} />
          <div className="space-y-1">
            <h3 className={cn('text-sm font-bold', gapConfig.textColor)}>{gapStatement.headline}</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">{gapStatement.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Platform Readiness Grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.25 }}
        className="p-6 rounded-3xl border border-neutral-200 bg-white shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
              Platform Readiness
            </span>
            <span className="text-[10px] font-bold text-[#0058be] bg-[#0058be]/10 px-2 py-0.5 rounded-full border border-[#0058be]/20">
              {platformReadiness.filter(p => p.status === 'optimized').length}/{platformReadiness.length} Optimized
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {platformReadiness.map((p) => (
            <PlatformCard key={p.platform} platform={p} />
          ))}
        </div>
      </motion.div>

      {/* Continue CTA */}
      <div className="flex justify-end pt-2">
        <ModuleButton onClick={onContinue}>
          Audit Complete — Set Identity Foundation →
        </ModuleButton>
      </div>
    </div>
  );
});

AuthorityAuditSection.displayName = 'AuthorityAuditSection';

