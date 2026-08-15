/**
 * Section 1: Authority Audit (Role-Smart & Interactive Reality Check)
 * 
 * Flow:
 *  1A. "Aap kin channels par active hain?" — Role-tailored platform selector with official SVG icons (Starts unselected / clean).
 *  1B. Diagnostic Mode — Quick 3-Question Honest Diagnostic OR Paste Bio / URL Scanner (Starts unselected).
 *  1C. Live Reality Scorecard — Calculates live when user answers questions or selects platforms.
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { EASING, DURATION } from '@/src/lib/motion-presets';
import type { ProfileSystemAsset } from '@/src/data/module3/authority-suite-engine';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Sparkles,
  Zap,
  FileText,
  HelpCircle,
  Check,
} from 'lucide-react';
import { ModuleButton } from '@/src/components/workspace/ModuleButton';

// ── Official Lightweight SVG Brand Icons ──────────────────────────────────────

const BrandIcons = {
  LinkedIn: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#0A66C2]">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  ),
  YouTube: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#FF0000]">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  Instagram: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#E4405F]">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  GitHub: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#0b1c30]">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  ),
  Twitter: () => (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-black">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  Figma: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4">
      <path fill="#0ACF83" d="M12 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0z"/>
      <path fill="#A259FF" d="M6 18a3 3 0 0 1 3-3h3v3a3 3 0 0 1-3 3 3 3 0 0 1-3-3z"/>
      <path fill="#F24E1E" d="M6 6a3 3 0 0 1 3-3h3v6H9a3 3 0 0 1-3-3z"/>
      <path fill="#FF7262" d="M12 3h3a3 3 0 0 1 0 6h-3V3z"/>
      <path fill="#1ABCFE" d="M6 12a3 3 0 0 1 3-3h3v6H9a3 3 0 0 1-3-3z"/>
    </svg>
  ),
  Behance: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#1769FF]">
      <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.171 3-3.455 0-5.555-2.226-5.555-5.69 0-3.328 2.055-5.69 5.378-5.69 3.447 0 5.164 2.26 5.164 5.352 0 .61-.061 1.155-.098 1.408h-7.79c.123 1.776 1.405 2.768 3.082 2.768 1.341 0 2.247-.648 2.705-1.579l2.285.431zm-7.986-4.664h5.188c-.126-1.516-1.127-2.316-2.584-2.316-1.503 0-2.457.877-2.604 2.316zm-8.74 7.664h-7v-16h7.625c2.457 0 4.375 1.111 4.375 3.625 0 1.488-.724 2.586-1.927 3.125 1.624.512 2.427 1.879 2.427 3.525 0 3.016-2.292 5.725-5.5 5.725zm-4.375-9.375h3.875c1.47 0 2.25-.662 2.25-1.875s-.78-1.75-2.25-1.75h-3.875v3.625zm0 6.75h4.125c1.54 0 2.375-.765 2.375-2.125s-.835-2.125-2.375-2.125h-4.125v4.25z"/>
    </svg>
  ),
};

interface RolePlatformConfig {
  key: string;
  name: string;
  category: string;
  icon: React.ComponentType;
  recommended: boolean;
}

const getRoleSensiblePlatforms = (serviceId: string | null, careerTrackId: string | null): { roleTitle: string; platforms: RolePlatformConfig[] } => {
  const s = (serviceId || '').toLowerCase();
  const c = (careerTrackId || '').toLowerCase();

  if (s.includes('edit') || s.includes('video') || s.includes('motion') || c.includes('editor')) {
    return {
      roleTitle: 'Video Editor & Motion Specialist',
      platforms: [
        { key: 'youtube', name: 'YouTube Showreel', category: 'Showcase Channel', icon: BrandIcons.YouTube, recommended: true },
        { key: 'instagram', name: 'Instagram (Reels)', category: 'Short-Form Clips', icon: BrandIcons.Instagram, recommended: true },
        { key: 'twitter', name: 'X / Twitter', category: 'Creator Authority', icon: BrandIcons.Twitter, recommended: true },
        { key: 'behance', name: 'Behance / Vimeo', category: 'Portfolio Reel', icon: BrandIcons.Behance, recommended: false },
      ],
    };
  }

  if (s.includes('code') || s.includes('dev') || s.includes('tech') || s.includes('app') || c.includes('developer')) {
    return {
      roleTitle: 'Software Developer & Technical Architect',
      platforms: [
        { key: 'github', name: 'GitHub Profile', category: 'Code Proof & Repos', icon: BrandIcons.GitHub, recommended: true },
        { key: 'linkedin', name: 'LinkedIn Executive', category: 'B2B Client Stance', icon: BrandIcons.LinkedIn, recommended: true },
        { key: 'twitter', name: 'X / Twitter', category: 'Tech Build-in-Public', icon: BrandIcons.Twitter, recommended: true },
      ],
    };
  }

  if (s.includes('design') || s.includes('ui') || s.includes('figma') || c.includes('designer')) {
    return {
      roleTitle: 'UI/UX & Product Designer',
      platforms: [
        { key: 'behance', name: 'Figma / Behance Space', category: 'Design Systems', icon: BrandIcons.Figma, recommended: true },
        { key: 'linkedin', name: 'LinkedIn Professional', category: 'Enterprise Clients', icon: BrandIcons.LinkedIn, recommended: true },
        { key: 'twitter', name: 'X / Twitter', category: 'Design Community', icon: BrandIcons.Twitter, recommended: true },
        { key: 'instagram', name: 'Instagram Portfolio', category: 'Visual Carousel', icon: BrandIcons.Instagram, recommended: false },
      ],
    };
  }

  // Default / Agency / Consultant
  return {
    roleTitle: 'Authority Specialist & Consultant',
    platforms: [
      { key: 'linkedin', name: 'LinkedIn Profile', category: 'Executive Authority', icon: BrandIcons.LinkedIn, recommended: true },
      { key: 'twitter', name: 'X / Twitter', category: 'Audience & Growth', icon: BrandIcons.Twitter, recommended: true },
      { key: 'youtube', name: 'YouTube Channel', category: 'Long-form Video', icon: BrandIcons.YouTube, recommended: false },
      { key: 'instagram', name: 'Instagram', category: 'Visual Stance', icon: BrandIcons.Instagram, recommended: false },
    ],
  };
};

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

// ── Score Ring Component ──────────────────────────────────────────────────────

function ScoreRing({ score, maxScore = 100, size = 150 }: { score: number | null; maxScore?: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const hasScore = score !== null;
  const percentage = hasScore ? Math.min((score as number) / maxScore, 1) : 0;
  const strokeDashoffset = hasScore ? circumference * (1 - percentage) : circumference;

  const getColor = () => {
    if (!hasScore) return { stroke: '#404040', text: 'text-neutral-500', badge: 'bg-neutral-800 text-neutral-400 border-neutral-700' };
    if ((score as number) >= 70) return { stroke: '#10b981', text: 'text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    if ((score as number) >= 40) return { stroke: '#d1f34d', text: 'text-[#d1f34d]', badge: 'bg-[#d1f34d]/10 text-[#d1f34d] border-[#d1f34d]/25' };
    return { stroke: '#f87171', text: 'text-red-400', badge: 'bg-red-500/10 text-red-400 border-red-500/25' };
  };

  const color = getColor();

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={7}
          className="text-neutral-800"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color.stroke}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={cn('text-4xl font-extrabold tracking-tight', color.text)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {hasScore ? score : '—'}
        </motion.span>
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">
          / {maxScore} PTS
        </span>
      </div>
    </div>
  );
}

// ── Main Section 1 Component ──────────────────────────────────────────────────

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
  const roleConfig = useMemo(() => getRoleSensiblePlatforms(headline, uniqueMechanism), [headline, uniqueMechanism]);

  // Step 1A: Selected platforms state (STARTS UNSELECTED / CLEAN)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  // Step 1B: Diagnostic Audit Mode (Quiz vs. Paste Text)
  const [auditMode, setAuditMode] = useState<'quiz' | 'paste'>('quiz');

  // Quiz Responses (STARTS UNSELECTED / NULL)
  const [quizAnswers, setQuizAnswers] = useState<{
    headlineType: string | null;
    hasPinnedProof: boolean | null;
    hasSingleCta: boolean | null;
  }>({
    headlineType: null,
    hasPinnedProof: null,
    hasSingleCta: null,
  });

  // Raw Bio Paste State (STARTS CLEAN)
  const [pastedBio, setPastedBio] = useState('');
  const [isBioAnalyzed, setIsBioAnalyzed] = useState(false);

  const togglePlatform = (key: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(key)) {
        return prev.filter(k => k !== key);
      }
      return [...prev, key];
    });
  };

  const handleSelectAllRecommended = () => {
    setSelectedPlatforms(roleConfig.platforms.filter(p => p.recommended).map(p => p.key));
  };

  const handleClearPlatforms = () => {
    setSelectedPlatforms([]);
  };

  // Has user interacted with the audit inputs yet?
  const hasInteracted = useMemo(() => {
    return (
      selectedPlatforms.length > 0 ||
      quizAnswers.headlineType !== null ||
      quizAnswers.hasPinnedProof !== null ||
      quizAnswers.hasSingleCta !== null ||
      pastedBio.trim().length > 0
    );
  }, [selectedPlatforms, quizAnswers, pastedBio]);

  // Compute live diagnostic score based on user's actual selections
  const diagnosticScore = useMemo<number | null>(() => {
    if (!hasInteracted) return null;

    let baseScore = 15;

    // Platform coverage (up to 20 pts)
    baseScore += Math.min(selectedPlatforms.length * 8, 20);

    if (auditMode === 'quiz') {
      if (quizAnswers.headlineType === 'authority') baseScore += 30;
      else if (quizAnswers.headlineType === 'skills') baseScore += 15;
      else if (quizAnswers.headlineType === 'generic') baseScore += 5;

      if (quizAnswers.hasPinnedProof === true) baseScore += 15;
      if (quizAnswers.hasSingleCta === true) baseScore += 15;
    } else {
      const bioText = (pastedBio || '').toLowerCase();
      if (bioText.length > 20) baseScore += 10;
      if (bioText.includes('help') || bioText.includes('scale') || bioText.includes('system') || bioText.includes('engineer')) baseScore += 15;
      if (bioText.includes('http') || bioText.includes('link') || bioText.includes('book') || bioText.includes('dm')) baseScore += 15;
      if (isBioAnalyzed && bioText.length > 50) baseScore += 15;
    }

    return Math.min(baseScore, 95);
  }, [hasInteracted, selectedPlatforms, auditMode, quizAnswers, pastedBio, isBioAnalyzed]);

  // Dimension Bars calculation
  const dimensions = useMemo(() => {
    const isAuth = quizAnswers.headlineType === 'authority' || pastedBio.length > 50;
    return [
      {
        label: 'Positioning & Headline Clarity',
        score: quizAnswers.headlineType === null && !isBioAnalyzed ? 0 : isAuth ? 22 : quizAnswers.headlineType === 'skills' ? 14 : 7,
        max: 25,
        desc: quizAnswers.headlineType === null ? 'Select headline style above' : isAuth ? 'Clear authority stance' : 'Currently generic worker positioning',
      },
      {
        label: 'Role-Channel Relevance',
        score: Math.min(selectedPlatforms.length * 8, 25),
        max: 25,
        desc: selectedPlatforms.length === 0 ? 'No channels selected yet' : `${selectedPlatforms.length} relevant platforms active for ${roleConfig.roleTitle}`,
      },
      {
        label: 'Social Proof & Case Study Signals',
        score: quizAnswers.hasPinnedProof === null ? 0 : quizAnswers.hasPinnedProof ? 21 : 6,
        max: 25,
        desc: quizAnswers.hasPinnedProof === null ? 'Select proof state above' : quizAnswers.hasPinnedProof ? 'Evidence accessible on profile' : 'Zero pinned verifiable proof assets',
      },
      {
        label: 'Conversion CTA & Booking Link',
        score: quizAnswers.hasSingleCta === null ? 0 : quizAnswers.hasSingleCta ? 22 : 8,
        max: 25,
        desc: quizAnswers.hasSingleCta === null ? 'Select CTA state above' : quizAnswers.hasSingleCta ? 'Single clear call to action' : 'No direct booking or portfolio funnel link',
      },
    ];
  }, [quizAnswers, pastedBio, isBioAnalyzed, selectedPlatforms, roleConfig.roleTitle]);

  return (
    <div className="w-full space-y-6 text-left font-sans">
      {/* ── 1A. ROLE-SMART PLATFORM SELECTION ─────────────────────────────────── */}
      <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-[#0058be]/10 text-[#0058be] border border-[#0058be]/20 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles size={12} className="text-[#0058be]" />
              Step 1A: Role Channels
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Curated for {roleConfig.roleTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAllRecommended}
              className="text-xs font-bold text-[#0058be] hover:underline cursor-pointer bg-blue-50/60 px-2.5 py-1 rounded-lg border border-blue-200/60"
            >
              + Select All Recommended
            </button>
            {selectedPlatforms.length > 0 && (
              <button
                type="button"
                onClick={handleClearPlatforms}
                className="text-xs text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-neutral-500 font-medium">
          Aap jin channels par clients se connect hote hain, unhe select karein:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {roleConfig.platforms.map((p) => {
            const isSelected = selectedPlatforms.includes(p.key);
            const IconComp = p.icon;

            return (
              <button
                key={p.key}
                type="button"
                onClick={() => togglePlatform(p.key)}
                className={cn(
                  'p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 relative overflow-hidden group',
                  isSelected
                    ? 'bg-blue-50/50 border-[#0058be] ring-1 ring-[#0058be]/30 shadow-xs'
                    : 'bg-neutral-50/80 border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-white border border-neutral-200/80 shadow-2xs">
                    <IconComp />
                  </div>
                  {isSelected ? (
                    <CheckCircle2 size={16} className="text-[#0058be]" />
                  ) : (
                    <Circle size={16} className="text-neutral-300 group-hover:text-neutral-400" />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#0b1c30] group-hover:text-[#0058be] transition-colors">
                    {p.name}
                  </h4>
                  <span className="text-[10px] text-neutral-400 font-medium block">
                    {p.category}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 1B. DIAGNOSTIC AUDIT INPUT (QUIZ VS BIO PASTE) ────────────────────── */}
      <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-[#0058be]/10 text-[#0058be] border border-[#0058be]/20 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Zap size={12} className="text-[#0058be]" />
              Step 1B: Current Reality Check
            </span>
          </div>

          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200">
            <button
              type="button"
              onClick={() => setAuditMode('quiz')}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                auditMode === 'quiz' ? 'bg-white text-[#0058be] shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              <HelpCircle size={12} />
              <span>3-Tap Quiz</span>
            </button>
            <button
              type="button"
              onClick={() => setAuditMode('paste')}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                auditMode === 'paste' ? 'bg-white text-[#0058be] shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              <FileText size={12} />
              <span>Paste Current Bio</span>
            </button>
          </div>
        </div>

        {/* Option A: Quick 3-Question Honest Diagnostic */}
        {auditMode === 'quiz' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {/* Question 1: Headline */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 block">
                1. Current Headline Style
              </span>
              <div className="space-y-1.5">
                {[
                  { id: 'generic', label: 'Generic Worker', desc: 'e.g. Freelance Editor / Coder' },
                  { id: 'skills', label: 'Skill List', desc: 'e.g. React • Node • Tailwind' },
                  { id: 'authority', label: 'Authority Stance', desc: 'e.g. Helping X achieve Y via Z' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setQuizAnswers(prev => ({ ...prev, headlineType: item.id }))}
                    className={cn(
                      'w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer',
                      quizAnswers.headlineType === item.id
                        ? 'bg-white border-[#0058be] text-[#0058be] font-bold shadow-2xs ring-1 ring-[#0058be]/20'
                        : 'bg-white/60 border-neutral-200 text-neutral-700 hover:bg-white'
                    )}
                  >
                    <div className="font-bold">{item.label}</div>
                    <div className="text-[10px] text-neutral-400">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Pinned Case Study */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 block">
                2. Pinned Proof &amp; Case Study
              </span>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setQuizAnswers(prev => ({ ...prev, hasPinnedProof: true }))}
                  className={cn(
                    'w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer',
                    quizAnswers.hasPinnedProof === true
                      ? 'bg-white border-emerald-600 text-emerald-700 font-bold shadow-2xs ring-1 ring-emerald-600/20'
                      : 'bg-white/60 border-neutral-200 text-neutral-700 hover:bg-white'
                  )}
                >
                  <div className="font-bold">✅ Yes, Pinned Proof</div>
                  <div className="text-[10px] text-neutral-400">Featured client case study or demo live</div>
                </button>
                <button
                  type="button"
                  onClick={() => setQuizAnswers(prev => ({ ...prev, hasPinnedProof: false }))}
                  className={cn(
                    'w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer',
                    quizAnswers.hasPinnedProof === false
                      ? 'bg-white border-red-500 text-red-600 font-bold shadow-2xs ring-1 ring-red-500/20'
                      : 'bg-white/60 border-neutral-200 text-neutral-700 hover:bg-white'
                  )}
                >
                  <div className="font-bold">❌ No Pinned Proof</div>
                  <div className="text-[10px] text-neutral-400">Empty profile or generic portfolio link</div>
                </button>
              </div>
            </div>

            {/* Question 3: CTA & Funnel Link */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 block">
                3. High-Ticket Booking Link
              </span>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setQuizAnswers(prev => ({ ...prev, hasSingleCta: true }))}
                  className={cn(
                    'w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer',
                    quizAnswers.hasSingleCta === true
                      ? 'bg-white border-emerald-600 text-emerald-700 font-bold shadow-2xs ring-1 ring-emerald-600/20'
                      : 'bg-white/60 border-neutral-200 text-neutral-700 hover:bg-white'
                  )}
                >
                  <div className="font-bold">✅ Direct Call / Funnel Link</div>
                  <div className="text-[10px] text-neutral-400">Clear next step for high-ticket prospects</div>
                </button>
                <button
                  type="button"
                  onClick={() => setQuizAnswers(prev => ({ ...prev, hasSingleCta: false }))}
                  className={cn(
                    'w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer',
                    quizAnswers.hasSingleCta === false
                      ? 'bg-white border-amber-500 text-amber-700 font-bold shadow-2xs ring-1 ring-amber-500/20'
                      : 'bg-white/60 border-neutral-200 text-neutral-700 hover:bg-white'
                  )}
                >
                  <div className="font-bold">⚠️ No Direct CTA</div>
                  <div className="text-[10px] text-neutral-400">"DM for work" or missing link</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Option B: Direct Bio Text Paste Analyzer */}
        {auditMode === 'paste' && (
          <div className="space-y-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 block">
                Paste your current LinkedIn Headline, Twitter Bio, or About Section
              </label>
              <textarea
                value={pastedBio}
                onChange={(e) => {
                  setPastedBio(e.target.value);
                  setIsBioAnalyzed(true);
                }}
                placeholder="Paste here e.g. 'Freelance Video Editor with 3 years of experience in Premiere Pro and After Effects. DM for collaborations!'"
                rows={3}
                className="w-full text-xs text-[#0b1c30] bg-neutral-50 border border-neutral-200 rounded-2xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:bg-white focus:border-[#0058be] transition-all font-sans leading-relaxed"
              />
            </div>
            {pastedBio.trim().length > 0 && (
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80 text-[11px] text-[#0058be] font-medium flex items-center gap-2">
                <CheckCircle2 size={14} className="shrink-0" />
                <span>Text detected — Authority engine scored your current baseline below.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 1C. LIVE REALITY SCORECARD (HOME LUXURY DESIGN) ────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0a1e35] via-[#0f2b4a] to-[#1a3a5c] border border-white/15 shadow-xl text-white space-y-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-[#d1f34d]" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#d1f34d]">
              Live Authority Diagnostic Scorecard
            </span>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 bg-white/10 px-3 py-1 rounded-full border border-white/15">
            {!hasInteracted
              ? '⏳ Awaiting Selections'
              : (diagnosticScore as number) < 50
              ? '⚠️ High Client Drop-Off Risk'
              : '⚡ Moderate Authority'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Score Ring */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-3">
            <ScoreRing score={diagnosticScore} />
            <div className="text-center space-y-0.5">
              <h4 className="text-xs font-bold text-white">Current Social Baseline</h4>
              <p className="text-[10px] text-white/60">
                {hasInteracted
                  ? 'Calculated from your active channels & profile state'
                  : 'Select your channels & answers above to reveal score'}
              </p>
            </div>
          </div>

          {/* Right: 4 Dimension Status Bars */}
          <div className="lg:col-span-8 space-y-3.5">
            {dimensions.map((dim, idx) => {
              const pct = dim.score > 0 ? Math.round((dim.score / dim.max) * 100) : 0;
              const isHigh = pct >= 70;
              const isMid = pct >= 40;

              return (
                <div key={idx} className="space-y-1 bg-black/25 backdrop-blur-sm p-3 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white/90">{dim.label}</span>
                    <span className={cn('font-black font-mono', dim.score === 0 ? 'text-white/40' : isHigh ? 'text-[#d1f34d]' : isMid ? 'text-amber-300' : 'text-red-400')}>
                      {dim.score > 0 ? `${dim.score}/${dim.max}` : `— / ${dim.max}`}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={cn('h-full rounded-full', isHigh ? 'bg-[#d1f34d]' : isMid ? 'bg-amber-400' : 'bg-red-400')}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: EASING.PREMIUM }}
                    />
                  </div>
                  <p className="text-[10px] text-white/50">{dim.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Gap Statement Box */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3">
          <AlertTriangle size={18} className="text-[#d1f34d] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white">
              Client Perception Reality
            </h4>
            <p className="text-[11px] text-white/70 leading-relaxed">
              Jab koi high-ticket client ($3,000+) aapka profile open karta hai, wo 3 seconds me decide karta hai ki aap ek ₹5,000 ke commodity worker hain ya ek verifiable authority specialist. Next step me hum is gap ko <strong>100% eliminate</strong> karenge.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── ACTION FOOTER ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-neutral-400 font-medium hidden sm:inline">
          {hasInteracted ? 'Audit ready. Proceed to set your identity foundation.' : 'Complete audit selections above to continue.'}
        </span>
        <ModuleButton onClick={onContinue}>
          Audit Confirmed — Proceed to Step 2 (Identity Foundation) →
        </ModuleButton>
      </div>
    </div>
  );
});

AuthorityAuditSection.displayName = 'AuthorityAuditSection';
