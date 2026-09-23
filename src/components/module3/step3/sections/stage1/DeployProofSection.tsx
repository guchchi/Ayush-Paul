/**
 * Section 5: Deploy & Proof
 * 
 * "Ab deploy kar aur result dekh"
 * Before/After authority score transformation, multi-format export vault,
 * interactive 13-platform deployment checklist, and seamless bridge to Level 2.
 */

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { EASING, DURATION } from '@/src/lib/motion-presets';
import {
  calculateAuthorityScore,
  calculateAuditBaselineScore,
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
  Layers,
  FileDown,
} from 'lucide-react';
import { ModuleButton } from '@/src/components/workspace/ModuleButton';
import { BrandIcons } from '@/src/components/module3/step3/brand/BrandIcons';
import { CopyExportModal } from '@/src/components/module3/step3/export/CopyExportModal';
import { downloadSocialIdentityPdf } from '@/src/lib/module3/social-identity-pdf';

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

import { PLATFORM_REGISTRY } from '@/src/lib/module3/platformRegistry';

// Animated Score Ring (Luxury Light Theme)
function ScoreRing({ score, label, size = 110 }: { score: number; label: string; size?: number }) {
  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(score / 100, 1);
  const strokeDashoffset = circumference * (1 - percentage);

  const color = score >= 70 ? '#0058be' : score >= 40 ? '#2563eb' : '#f59e0b';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={7} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={color} strokeWidth={7} strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl sm:text-3xl font-black text-[#0b1c30] tracking-tight">{score}</span>
          <span className="text-[9px] font-bold text-neutral-400 uppercase">/ 100</span>
        </div>
      </div>
      <span className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest">{label}</span>
    </div>
  );
}

import { useModule3Store } from '@/src/lib/module3/store';

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
  const [showExportModal, setShowExportModal] = useState(false);
  const stage1Audit = useModule3Store(s => s.stage1Audit);

  const currentScore = useMemo(() => calculateAuthorityScore({
    profileSystem, headline, proofLine, uniqueMechanism, userName, userHandle, activeTone,
  }), [profileSystem, headline, proofLine, uniqueMechanism, userName, userHandle, activeTone]);

  // Deterministic baseline if audit was not completed yet
  const fallbackAuditBaseline = useMemo(() => {
    return calculateAuditBaselineScore({
      selectedPlatforms: stage1Audit?.selectedPlatforms?.length ? stage1Audit.selectedPlatforms : ['linkedin', 'twitter'],
      quizAnswers: stage1Audit?.quizAnswers ?? { headlineType: 'skills', hasPinnedProof: false, hasSingleCta: false },
    });
  }, [stage1Audit]);

  // Baseline score: Restore true baseline without artificial capping
  const { effectiveInitial, cappedDimensions } = useMemo(() => {
    let rawBase = fallbackAuditBaseline.total;
    if (stage1Audit?.diagnosticScore && stage1Audit.diagnosticScore > 0) {
      rawBase = stage1Audit.diagnosticScore;
    } else if (initialScore > 0) {
      rawBase = initialScore;
    }

    let basePos = stage1Audit?.dimensionScores?.positioning ?? fallbackAuditBaseline.dimensions.positioning.score;
    let basePlat = stage1Audit?.dimensionScores?.platformCoverage ?? fallbackAuditBaseline.dimensions.platformCoverage.score;
    let baseProof = stage1Audit?.dimensionScores?.proofEvidence ?? fallbackAuditBaseline.dimensions.proofEvidence.score;
    let baseCta = stage1Audit?.dimensionScores?.conversionCta ?? fallbackAuditBaseline.dimensions.conversionCta.score;

    return {
      effectiveInitial: rawBase,
      cappedDimensions: { basePos, basePlat, baseProof, baseCta }
    };
  }, [stage1Audit, initialScore, fallbackAuditBaseline]);

  const improvement = Math.max(0, currentScore.total - effectiveInitial);
  const improvementPct = effectiveInitial > 0 ? Math.round((improvement / effectiveInitial) * 100) : 0;

  // 4 Dimensions of Authority Transformation
  const dimensions = useMemo(() => {
    return [
      {
        label: 'Positioning Clarity',
        baseline: cappedDimensions.basePos,
        optimized: currentScore.positioningClarity.score,
        max: 25,
        gain: currentScore.positioningClarity.score - cappedDimensions.basePos,
      },
      {
        label: 'Platform Completeness',
        baseline: cappedDimensions.basePlat,
        optimized: currentScore.platformCompleteness.score,
        max: 25,
        gain: currentScore.platformCompleteness.score - cappedDimensions.basePlat,
      },
      {
        label: 'Tone & Proof Consistency',
        baseline: cappedDimensions.baseProof,
        optimized: currentScore.toneConsistency.score,
        max: 25,
        gain: currentScore.toneConsistency.score - cappedDimensions.baseProof,
      },
      {
        label: 'Action & CTA Signals',
        baseline: cappedDimensions.baseCta,
        optimized: currentScore.ctaPresence.score,
        max: 25,
        gain: currentScore.ctaPresence.score - cappedDimensions.baseCta,
      },
    ];
  }, [cappedDimensions, currentScore]);

  const toggleDeployed = (platform: string) => {
    setDeployedPlatforms(prev => {
      const next = new Set(prev);
      if (next.has(platform)) next.delete(platform);
      else next.add(platform);
      return next;
    });
  };

  const generateFullPackageMarkdown = () => {
    let md = `# EXECUTIVE SOCIAL IDENTITY PACKAGE\nUser: ${userName || 'Authority Consultant'} (@${userHandle || 'expert'})\nAuthority Score: ${currentScore.total}/100\nTone: ${activeTone.toUpperCase()}\n\n`;
    for (const p of profileSystem) {
      const meta = PLATFORM_REGISTRY[p.platform];
      md += `---\nPLATFORM: ${(meta?.name || p.platform).toUpperCase()}\n---\n`;
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
    a.download = `Social-Identity-${(userName || 'Profile').replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    downloadSocialIdentityPdf({
      userName,
      userHandle,
      positioningHeadline: headline,
      proofLine,
      uniqueMechanism,
      activeTone,
      authorityScore: {
        total: currentScore.total,
        baseline: effectiveInitial,
        improvement,
        improvementPct,
        positioningClarity: { ...currentScore.positioningClarity, baseline: dimensions[0].baseline },
        platformCompleteness: { ...currentScore.platformCompleteness, baseline: dimensions[1].baseline },
        toneConsistency: { ...currentScore.toneConsistency, baseline: dimensions[2].baseline },
        ctaPresence: { ...currentScore.ctaPresence, baseline: dimensions[3].baseline },
      },
      profileSystem,
    });
  };

  const allPlatforms = profileSystem.map(p => p.platform);
  const deployedCount = deployedPlatforms.size;
  const totalPlatforms = allPlatforms.length;

  return (
    <div className="w-full space-y-6 text-left font-sans">
      {/* Before → After Score Card (Luxury Light Theme) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 border border-neutral-200/90 shadow-sm"
      >
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Trophy size={16} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0058be] block">
                Measurable Benchmark
              </span>
              <h3 className="text-base font-bold text-[#0b1c30]">Authority Transformation Score</h3>
            </div>
          </div>
          {improvement > 0 && (
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
              +{improvement} Pts Gain ({improvementPct > 0 ? `+${improvementPct}%` : '—'})
            </span>
          )}
        </div>

        <div className="flex items-center justify-center gap-8 sm:gap-16 py-2">
          <ScoreRing score={effectiveInitial} label="Baseline Score" size={110} />
          
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-[#0058be] shadow-xs">
              <ArrowRight size={18} />
            </div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Optimized</span>
          </div>

          <ScoreRing score={currentScore.total} label="Optimized Score" size={110} />
        </div>

        {/* 4-Dimension Authority Transformation Grid */}
        <div className="mt-6 pt-6 border-t border-neutral-200/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {dimensions.map(d => (
            <div key={d.label} className="p-3.5 rounded-2xl bg-white/90 border border-neutral-200/70 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#0b1c30] mb-1">
                <span className="truncate">{d.label}</span>
                <span className="text-emerald-700 text-[10px] font-extrabold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/50">
                  +{Math.max(d.gain, 1)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-2">
                <span>Baseline: {d.baseline}</span>
                <span className="font-bold text-neutral-700">Optimized: {d.optimized}/{d.max}</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(Math.round((d.optimized / d.max) * 100), 100)}%` }}
                  transition={{ duration: 1, ease: EASING.PREMIUM, delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-[#0058be] to-emerald-500 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Export Vault & Bundle Hub */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.1 }}
        className="p-6 rounded-3xl border border-neutral-200 bg-white shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#0058be]/10 text-[#0058be]">
              <Box size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0b1c30]">Export Master Social Copy Vault</h3>
              <p className="text-xs text-neutral-500">Download or copy formatted Markdown & JSON bundles for all {totalPlatforms} platforms.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExportModal(true)}
              className="px-3.5 py-2 bg-white hover:bg-neutral-50 text-[#0b1c30] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-neutral-200 shadow-2xs"
            >
              <Layers size={13} className="text-[#0058be]" />
              Export Bundle Modal
            </button>
            <button
              onClick={() => handleCopy('vault_all', generateFullPackageMarkdown())}
              className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-neutral-200"
            >
              {copiedField === 'vault_all' ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              {copiedField === 'vault_all' ? 'Copied!' : 'Copy Markdown'}
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Download size={13} />
              Download .MD
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-2 bg-gradient-to-r from-[#0058be] to-indigo-600 hover:from-[#0048a0] hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <FileDown size={13} />
              Export PDF Dossier
            </button>
          </div>
        </div>
      </motion.div>

      {/* Deployment Checklist (13 Platforms Supported) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.2 }}
        className="p-6 rounded-3xl border border-neutral-200 bg-white shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#0058be]" />
            <h3 className="text-sm font-bold text-[#0b1c30]">Platform Deployment Checklist</h3>
          </div>
          <span className={cn(
            'text-xs font-bold px-3 py-1 rounded-full border',
            deployedCount === totalPlatforms
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : 'text-neutral-600 bg-neutral-100 border-neutral-200'
          )}>
            {deployedCount}/{totalPlatforms} Live Deployed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {allPlatforms.map(platform => {
            const isDeployed = deployedPlatforms.has(platform);
            const meta = PLATFORM_REGISTRY[platform] || {
              name: platform,
              icon: BrandIcons.PersonalSite,
              brandColor: 'bg-neutral-700',
              deepLink: '#',
            };
            const Icon = meta.icon;

            return (
              <div
                key={platform}
                className={cn(
                  'p-3.5 rounded-2xl border flex items-center justify-between transition-all shadow-2xs',
                  isDeployed ? 'bg-emerald-50/60 border-emerald-200' : 'bg-white border-neutral-200/80 hover:border-neutral-300'
                )}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleDeployed(platform)}
                    className="cursor-pointer"
                  >
                    {isDeployed ? (
                      <CheckCircle2 size={18} className="text-emerald-600" />
                    ) : (
                      <Circle size={18} className="text-neutral-300 hover:text-neutral-400" />
                    )}
                  </button>
                  <div className="flex items-center gap-2">
                    <div className={cn('w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0', meta.brandColor)}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className={cn(
                      'text-xs font-bold',
                      isDeployed ? 'text-emerald-800 line-through' : 'text-[#0b1c30]'
                    )}>
                      {meta.name}
                    </span>
                  </div>
                </div>

                {meta.deepLink && meta.deepLink !== '#' && (
                  <a
                    href={meta.deepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-[#0058be] hover:underline flex items-center gap-1 cursor-pointer bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-100"
                  >
                    <ExternalLink size={10} />
                    Open Edit ↗
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
        className="p-5 rounded-3xl bg-gradient-to-r from-[#0058be]/8 via-blue-50/60 to-indigo-50/60 border border-[#0058be]/20 space-y-2"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span className="text-xs font-extrabold text-[#0b1c30]">Stage 1 (Social Profile Identity Studio) Completed</span>
        </div>
        <p className="text-xs text-neutral-600 leading-relaxed pl-6">
          Your social profiles are now calibrated with authority messaging. Next, we will construct your <strong>Portfolio Architecture (Level 2)</strong> to systematically prove your claims with wireframed section hierarchies and case study frameworks.
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
          Complete Stage 1 → Proceed to Level 02 (Portfolio Architecture)
        </ModuleButton>
      </div>

      {/* Full Copy Export Modal */}
      <CopyExportModal
        isOpen={showExportModal}
        profileSystem={profileSystem}
        userName={userName}
        userHandle={userHandle}
        positioningHeadline={headline}
        proofLine={proofLine}
        uniqueMechanism={uniqueMechanism}
        activeTone={activeTone}
        authorityScore={{
          total: currentScore.total,
          baseline: effectiveInitial,
          improvement,
          improvementPct,
          positioningClarity: { ...currentScore.positioningClarity, baseline: dimensions[0].baseline },
          platformCompleteness: { ...currentScore.platformCompleteness, baseline: dimensions[1].baseline },
          toneConsistency: { ...currentScore.toneConsistency, baseline: dimensions[2].baseline },
          ctaPresence: { ...currentScore.ctaPresence, baseline: dimensions[3].baseline },
        }}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
});

DeployProofSection.displayName = 'DeployProofSection';
