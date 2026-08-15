/**
 * Section 5: Deploy & Proof
 * 
 * "Ab deploy kar aur result dekh"
 * Before/After authority score, export vault, completion checklist, bridge to Level 2.
 */

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { EASING, DURATION } from '@/src/lib/motion-presets';
import {
  calculateAuthorityScore,
  type AuthorityScoreBreakdown,
} from '@/src/lib/module3/authority-score-engine';
import type { ProfileSystemAsset } from '@/src/data/module3/authority-suite-engine';
import {
  Download,
  Copy,
  Check,
  ExternalLink,
  Box,
  CheckCircle2,
  Circle,
  Trophy,
  ArrowRight,
  Sparkles,
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
  initialScore: number; // Score from Section 1 (before optimization)
  onBack?: () => void;
  onComplete: () => void;
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

const PLATFORM_DEEP_LINKS: Record<string, string> = {
  linkedin: 'https://www.linkedin.com/in/me/overlay/edit/',
  github: 'https://github.com/settings/profile',
  twitter: 'https://x.com/settings/profile',
  youtube: 'https://studio.youtube.com/channel/editing/profile',
  behance: 'https://www.figma.com/settings',
  instagram: 'https://www.instagram.com/accounts/edit/',
};

// Animated Score Ring
function ScoreRing({ score, label, size = 100 }: { score: number; label: string; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(score / 100, 1);
  const strokeDashoffset = circumference * (1 - percentage);

  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#262626" strokeWidth={6} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={color} strokeWidth={6} strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-black text-white">{score}</span>
        </div>
      </div>
      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{label}</span>
    </div>
  );
}

export const DeployProofSection: React.FC<Props> = React.memo(({
  profileSystem,
  headline,
  proofLine,
  uniqueMechanism,
  userName,
  userHandle,
  activeTone,
  initialScore,
  onBack,
  onComplete,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [deployedPlatforms, setDeployedPlatforms] = useState<Set<string>>(new Set());

  const currentScore = useMemo(() => calculateAuthorityScore({
    profileSystem, headline, proofLine, uniqueMechanism, userName, userHandle, activeTone,
  }), [profileSystem, headline, proofLine, uniqueMechanism, userName, userHandle, activeTone]);

  const improvement = currentScore.total - initialScore;
  const improvementPct = initialScore > 0 ? Math.round((improvement / initialScore) * 100) : 0;

  const toggleDeployed = (platform: string) => {
    setDeployedPlatforms(prev => {
      const next = new Set(prev);
      if (next.has(platform)) next.delete(platform);
      else next.add(platform);
      return next;
    });
  };

  const generateFullPackageMarkdown = () => {
    let md = `# EXECUTIVE SOCIAL IDENTITY PACKAGE\nUser: ${userName} (@${userHandle})\nAuthority Score: ${currentScore.total}/100\nTone: ${activeTone.toUpperCase()}\n\n`;
    for (const p of profileSystem) {
      md += `---\nPLATFORM: ${(PLATFORM_LABELS[p.platform] || p.platform).toUpperCase()}\n---\n`;
      for (const f of p.fields) {
        md += `[${f.label}]\n${f.value}\n\n`;
      }
    }
    return md;
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownload = () => {
    const md = generateFullPackageMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Social-Identity-${userName.replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const allPlatforms = profileSystem.map(p => p.platform);
  const deployedCount = deployedPlatforms.size;
  const totalPlatforms = allPlatforms.length;

  return (
    <div className="w-full space-y-6 text-left font-sans">
      {/* Before → After Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <Trophy size={16} className="text-amber-400" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
            Authority Transformation Result
          </span>
        </div>

        <div className="flex items-center justify-center gap-8 sm:gap-16">
          <ScoreRing score={initialScore} label="Before" size={110} />
          
          <div className="flex flex-col items-center gap-1">
            <ArrowRight size={24} className="text-neutral-600" />
            {improvement > 0 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.4 }}
                className="text-xs font-black text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/60"
              >
                +{improvement} pts ({improvementPct > 0 ? `+${improvementPct}%` : '—'})
              </motion.span>
            )}
          </div>

          <ScoreRing score={currentScore.total} label="After" size={110} />
        </div>
      </motion.div>

      {/* Export Vault */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.1 }}
        className="p-6 rounded-3xl border border-neutral-200 bg-white shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Box size={18} className="text-[#0058be]" />
            <h3 className="text-base font-bold text-[#0b1c30]">Export Identity Vault</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy('vault_all', generateFullPackageMarkdown())}
              className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-neutral-200"
            >
              {copiedField === 'vault_all' ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              {copiedField === 'vault_all' ? 'Copied!' : 'Copy All'}
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 bg-[#0058be] hover:bg-[#0048a0] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Download size={13} />
              Download .MD
            </button>
          </div>
        </div>
      </motion.div>

      {/* Deployment Checklist */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.2 }}
        className="p-6 rounded-3xl border border-neutral-200 bg-white shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#0058be]" />
            <h3 className="text-sm font-bold text-[#0b1c30]">Deployment Checklist</h3>
          </div>
          <span className={cn(
            'text-xs font-bold px-3 py-1 rounded-full border',
            deployedCount === totalPlatforms
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : 'text-neutral-500 bg-neutral-100 border-neutral-200'
          )}>
            {deployedCount}/{totalPlatforms} Deployed
          </span>
        </div>

        <div className="space-y-2">
          {allPlatforms.map(platform => {
            const isDeployed = deployedPlatforms.has(platform);
            const deepLink = PLATFORM_DEEP_LINKS[platform];

            return (
              <div
                key={platform}
                className={cn(
                  'p-3.5 rounded-2xl border flex items-center justify-between transition-all',
                  isDeployed ? 'bg-emerald-50/60 border-emerald-200' : 'bg-neutral-50 border-neutral-200'
                )}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleDeployed(platform)}
                    className="cursor-pointer"
                  >
                    {isDeployed ? (
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    ) : (
                      <Circle size={18} className="text-neutral-300" />
                    )}
                  </button>
                  <span className={cn(
                    'text-sm font-bold',
                    isDeployed ? 'text-emerald-700 line-through' : 'text-[#0b1c30]'
                  )}>
                    {PLATFORM_LABELS[platform] || platform}
                  </span>
                </div>

                {deepLink && (
                  <a
                    href={deepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-[#0058be] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <ExternalLink size={11} />
                    Open Settings ↗
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Bridge to Level 2 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.3 }}
        className="p-5 rounded-3xl bg-gradient-to-r from-[#0058be]/10 via-blue-50 to-indigo-50 border border-[#0058be]/20 space-y-2"
      >
        <p className="text-xs text-neutral-600 leading-relaxed">
          <strong className="text-[#0b1c30]">Your social presence is now authority-optimized.</strong> Next, we will construct a high-converting portfolio wireframe to support your positioning with structured case studies, evidence assets, and conversion funnels.
        </p>
      </motion.div>

      {/* Complete CTA */}
      <div className="flex items-center justify-between pt-2">
        {onBack ? (
          <ModuleButton variant="secondary" onClick={onBack}>
            ← Back to Consistency Check
          </ModuleButton>
        ) : <div />}
        <ModuleButton variant="primary" onClick={onComplete}>
          Stage 1 Complete — Continue to Portfolio Architecture →
        </ModuleButton>
      </div>
    </div>
  );
});

DeployProofSection.displayName = 'DeployProofSection';

