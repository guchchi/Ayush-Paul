/**
 * Section 2: Identity Foundation
 * 
 * "Pehle base set kar"
 * Single source of truth: Name, Handle, Positioning Headline, Proof Line.
 * Changes here auto-sync to all platform mockups.
 * 
 * Features:
 *  - Smart Platform Fit Indicators (real-time char limit per platform)
 *  - Before vs After Identity Shift Card
 *  - Platform-Accurate CSS Mockup Cards (LinkedIn, Twitter/X, GitHub, etc.)
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { EASING, DURATION } from '@/src/lib/motion-presets';
import {
  User,
  AtSign,
  Sparkles,
  Target,
  ArrowRight,
  CheckCircle2,
  Info,
  AlertTriangle,
  XCircle,
  ArrowLeftRight,
} from 'lucide-react';
import { ModuleButton } from '@/src/components/workspace/ModuleButton';
import { useModule3Store } from '@/src/lib/module3/store';
import { CopywritingEngine } from '@/src/lib/module3/copywriting-engine';

import { PLATFORM_REGISTRY } from '@/src/lib/module3/platformRegistry';

// ── Platform Fit Indicator Component ─────────────────────────────────────────

function PlatformFitStrip({ text, platforms, mode }: { text: string; platforms: string[]; mode: 'headline' | 'proof' }) {
  if (!text || text.length < 5 || !platforms.length) return null;

  const relevantPlatforms = platforms
    .map(p => PLATFORM_REGISTRY[p.toLowerCase()])
    .filter(Boolean);

  if (!relevantPlatforms.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5 pt-1">
      {relevantPlatforms.map((plat) => {
        const limit = mode === 'headline' ? plat.charLimits.headline : plat.charLimits.bio;
        if (limit >= 9999) {
          return (
            <span key={plat.name} className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 size={9} /> {plat.name}
            </span>
          );
        }
        const fits = text.length <= limit;
        const overBy = text.length - limit;
        return (
          <span
            key={plat.name}
            className={cn(
              'inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border',
              fits ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
              overBy <= 20 ? 'text-amber-700 bg-amber-50 border-amber-200' :
              'text-red-700 bg-red-50 border-red-200'
            )}
          >
            {fits ? <CheckCircle2 size={9} /> : overBy <= 20 ? <AlertTriangle size={9} /> : <XCircle size={9} />}
            {plat.name} ({limit})
            {!fits && <span className="ml-0.5">+{overBy}</span>}
          </span>
        );
      })}
    </div>
  );
}

// ── Before vs After Card ─────────────────────────────────────────────────────

function BeforeAfterCard({ diagnosticGaps, quizAnswers, newHeadline, newProofLine }: {
  diagnosticGaps?: string[];
  quizAnswers?: { headlineType: string | null; hasPinnedProof: boolean | null; hasSingleCta: boolean | null };
  newHeadline: string;
  newProofLine: string;
}) {
  if (!diagnosticGaps?.length && !quizAnswers?.headlineType) return null;
  if (newHeadline.trim().length < 10 && newProofLine.trim().length < 10) return null;

  // Construct "before" text from either diagnostic gaps or quiz answers
  let beforeContent = null;
  if (diagnosticGaps && diagnosticGaps.length > 0) {
    beforeContent = (
      <ul className="list-disc pl-4 space-y-1">
        {diagnosticGaps.map((gap, i) => (
          <li key={i}>{gap}</li>
        ))}
      </ul>
    );
  } else if (quizAnswers) {
    const parts: string[] = [];
    if (quizAnswers.headlineType === 'generic') parts.push('Generic "I do X" headline');
    else if (quizAnswers.headlineType === 'skills') parts.push('Skill-listing headline (React, Node, etc.)');
    else if (quizAnswers.headlineType === 'authority') parts.push('Authority-positioned headline');
    if (quizAnswers.hasPinnedProof === false) parts.push('No pinned proof or case studies');
    if (quizAnswers.hasSingleCta === false) parts.push('No clear booking funnel');
    const beforeText = parts.join(' • ') || 'Basic generic profile';
    beforeContent = <p className="italic">"{beforeText}"</p>;
  }

  if (!beforeContent) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.35 }}
      className="p-5 rounded-3xl border border-neutral-200 bg-white shadow-xs space-y-4"
    >
      <div className="flex items-center gap-2">
        <ArrowLeftRight size={16} className="text-[#0058be]" />
        <span className="text-xs font-bold text-[#0b1c30]">Identity Transformation</span>
        <span className="text-[9px] font-bold text-[#0058be] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
          Before → After
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Before */}
        <div className="p-4 rounded-2xl bg-red-50/50 border border-red-200/70 space-y-2">
          <div className="flex items-center gap-1.5">
            <XCircle size={12} className="text-red-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">Before</span>
          </div>
          <div className="text-[11px] text-red-800/80 leading-relaxed line-clamp-4">
            {beforeContent}
          </div>
        </div>

        {/* After */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 space-y-2">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">After</span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed font-medium line-clamp-2">
            {newHeadline || 'Your new headline...'}
          </p>
          {newProofLine && (
            <p className="text-[10px] text-emerald-700/70 leading-relaxed line-clamp-2">
              {newProofLine}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Platform Mockup Card (CSS Only — Looks Like Real Platform UI) ────────────

function PlatformMockupCard({ platformId, userName, userHandle, headline, proofLine, roleLabel }: {
  platformId: string;
  userName: string;
  userHandle: string;
  headline: string;
  proofLine: string;
  roleLabel: string;
}) {
  const p = platformId.toLowerCase();
  const displayName = userName || 'Your Name';
  const handle = userHandle || 'handle';
  const headlineText = headline || 'Your positioning headline...';

  switch (p) {
    case 'linkedin':
      return (
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
          <div className="h-8 bg-gradient-to-r from-[#0A66C2] to-[#0077B5]" />
          <div className="px-3.5 pb-3.5 -mt-3">
            <div className="w-8 h-8 rounded-full bg-[#0A66C2] border-2 border-[#0b1c30] flex items-center justify-center text-white text-[10px] font-black">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="mt-1.5 space-y-0.5">
              <p className="text-[11px] font-bold text-white truncate">{displayName}</p>
              <p className="text-[10px] text-white/60 line-clamp-2 leading-snug">{headlineText.slice(0, 120)}{headlineText.length > 120 ? '...' : ''}</p>
            </div>
          </div>
        </div>
      );

    case 'twitter':
      return (
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 p-3.5 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-neutral-700 flex items-center justify-center text-white text-[10px] font-black">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[11px] font-bold text-white">{displayName}</p>
              <p className="text-[9px] text-white/40 font-mono">@{handle}</p>
            </div>
          </div>
          <p className="text-[10px] text-white/70 leading-snug line-clamp-2">{headlineText.slice(0, 160)}{headlineText.length > 160 ? '...' : ''}</p>
        </div>
      );

    case 'github':
      return (
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0d1117] p-3.5 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-neutral-700 flex items-center justify-center text-white text-[10px] font-black ring-1 ring-white/20">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[11px] font-bold text-white">{handle}</p>
              <p className="text-[9px] text-white/40">{displayName}</p>
            </div>
          </div>
          <p className="text-[10px] text-white/60 leading-snug line-clamp-2">{headlineText.slice(0, 160)}{headlineText.length > 160 ? '...' : ''}</p>
          <div className="flex items-center gap-3 pt-1">
            <span className="text-[9px] text-white/30">📦 12 repos</span>
            <span className="text-[9px] text-white/30">⭐ 48 stars</span>
            <span className="text-[9px] text-white/30">👥 5 followers</span>
          </div>
        </div>
      );

    case 'youtube':
      return (
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0f0f0f] p-3.5 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#FF0000] flex items-center justify-center text-white text-[10px] font-black">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[11px] font-bold text-white">{displayName} {roleLabel.toLowerCase().includes('edit') ? 'Edits' : 'HQ'}</p>
              <p className="text-[9px] text-white/40">@{handle} • 1.2K subscribers</p>
            </div>
          </div>
          <p className="text-[10px] text-white/50 leading-snug line-clamp-2">{proofLine || headlineText}</p>
        </div>
      );

    case 'instagram':
      return (
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#833AB4]/20 via-[#FD1D1D]/10 to-[#F77737]/10 p-3.5 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] ring-2 ring-[#F77737]/50 flex items-center justify-center text-white text-xs font-black">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="text-center space-y-0">
              <p className="text-[11px] font-extrabold text-white">@{handle}</p>
              <div className="flex items-center gap-3 text-[9px] text-white/40">
                <span>42 posts</span>
                <span>1.5K followers</span>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-white/60 leading-snug line-clamp-2">{headlineText.slice(0, 150)}{headlineText.length > 150 ? '...' : ''}</p>
        </div>
      );

    default: {
      const platformName = p.charAt(0).toUpperCase() + p.slice(1).replace(/_/g, ' ');
      return (
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 transition-colors hover:bg-white/10">
          <span className="text-[9px] font-bold text-[#d1f34d] uppercase tracking-wider">{platformName}</span>
          <p className="text-[11px] text-white/90 font-medium line-clamp-1">{displayName} • {headlineText.slice(0, 25)}{headlineText.length > 25 ? '...' : ''}</p>
        </div>
      );
    }
  }
}

// ── Main Component ───────────────────────────────────────────────────────────

interface Props {
  userName: string;
  userHandle: string;
  positioningHeadline: string;
  proofLine: string;
  roleLabel: string;
  activePlatforms?: string[];
  diagnosticGaps?: string[];
  quizAnswers?: { headlineType: string | null; hasPinnedProof: boolean | null; hasSingleCta: boolean | null };
  onUserNameChange: (name: string) => void;
  onUserHandleChange: (handle: string) => void;
  onHeadlineChange: (headline: string) => void;
  onProofLineChange: (line: string) => void;
  onBack?: () => void;
  onContinue: () => void;
}

export const IdentityFoundationSection: React.FC<Props> = React.memo(({
  userName,
  userHandle,
  positioningHeadline,
  proofLine,
  roleLabel,
  activePlatforms,
  diagnosticGaps,
  quizAnswers,
  onUserNameChange,
  onUserHandleChange,
  onHeadlineChange,
  onProofLineChange,
  onBack,
  onContinue,
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cycleIndex, setCycleIndex] = useState(0);

  const {
    mod1ServiceId,
    mod1CareerTrackId,
    mod1Positioning,
    mod1MarketId,
    mod2UniqueMechanism,
    mod2ProposalSummary
  } = useModule3Store();

  const handleGenerateIdentity = () => {
    // Generate context-aware copy using the local engine
    const context = {
      serviceId: mod1ServiceId || '',
      careerTrackId: mod1CareerTrackId || '',
      positioning: mod1Positioning || '',
      marketId: mod1MarketId || '',
      mechanism: mod2UniqueMechanism || ''
    };
    
    const result = CopywritingEngine.generate(context, cycleIndex);
    
    // Animate UI briefly to show something happened
    setIsGenerating(true);
    setTimeout(() => {
      onHeadlineChange(result.headline);
      onProofLineChange(result.proofLine);
      setCycleIndex(prev => prev + 1);
      setIsGenerating(false);
    }, 150); // slight delay for visual "magic" effect
  };

  const isNameSet = userName.trim().length >= 2;
  const isHandleSet = userHandle.trim().length >= 2;
  const isHeadlineSet = positioningHeadline.trim().length > 10;
  const isProofLineSet = proofLine.trim().length > 10;
  const completedFields = [isNameSet, isHandleSet, isHeadlineSet, isProofLineSet].filter(Boolean).length;

  const platforms = activePlatforms && activePlatforms.length > 0 ? activePlatforms : ['linkedin', 'twitter', 'github'];

  return (
    <div className="w-full space-y-6 text-left font-sans">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
        className="p-6 rounded-3xl border border-neutral-200 bg-white shadow-xs space-y-3"
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#0058be]/10 text-[#0058be] border border-[#0058be]/20">
              <Target size={18} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0058be] block">
                Single Source of Truth
              </span>
              <h2 className="text-lg font-bold text-[#0b1c30]">Identity Foundation</h2>
            </div>
          </div>

          <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
            {completedFields}/4 Fields Set
          </span>
        </div>

        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-blue-50/80 border border-blue-100">
          <Info size={15} className="text-[#0058be] mt-0.5 shrink-0" />
          <p className="text-xs text-neutral-600 leading-relaxed">
            This identity foundation acts as your <strong>single source of truth</strong>. Any update made here instantly propagates across all your platform mockups, bio snippets, and export bundles.
          </p>
        </div>
      </motion.div>

      {/* Identity Fields Grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Display Name */}
        <div className={cn(
          'p-5 rounded-3xl border bg-white shadow-xs space-y-3 transition-all',
          focusedField === 'name' ? 'border-[#0058be] ring-2 ring-[#0058be]/20' : 'border-neutral-200'
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User size={16} className="text-[#0058be]" />
              <span className="text-xs font-bold text-[#0b1c30]">Display Name</span>
            </div>
            {isNameSet && <CheckCircle2 size={14} className="text-emerald-500" />}
          </div>
          <input
            type="text"
            value={userName}
            onChange={(e) => onUserNameChange(e.target.value)}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            placeholder="Your full professional name"
            className="w-full text-sm font-bold text-[#0b1c30] bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:bg-white focus:border-[#0058be] transition-all"
          />
          <p className="text-[10px] text-neutral-400">
            Shows as your name on LinkedIn, GitHub, YouTube, etc.
          </p>
        </div>

        {/* Professional Handle */}
        <div className={cn(
          'p-5 rounded-3xl border bg-white shadow-xs space-y-3 transition-all',
          focusedField === 'handle' ? 'border-[#0058be] ring-2 ring-[#0058be]/20' : 'border-neutral-200'
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AtSign size={16} className="text-[#0058be]" />
              <span className="text-xs font-bold text-[#0b1c30]">Professional Handle</span>
            </div>
            {isHandleSet && <CheckCircle2 size={14} className="text-emerald-500" />}
          </div>
          <div className="flex items-center gap-0 bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#0058be]/20 focus-within:border-[#0058be] transition-all">
            <span className="text-sm font-mono text-neutral-400 px-3 py-3 bg-neutral-100 border-r border-neutral-200">@</span>
            <input
              type="text"
              value={userHandle}
              onChange={(e) => onUserHandleChange(e.target.value.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9_-]/g, ''))}
              onFocus={() => setFocusedField('handle')}
              onBlur={() => setFocusedField(null)}
              placeholder="yourhandle"
              className="flex-1 text-sm font-mono text-[#0b1c30] bg-transparent px-3 py-3 focus:outline-none"
            />
          </div>
          <p className="text-[10px] text-neutral-400">
            Consistent handle across Twitter, GitHub, Instagram, personal site URL.
          </p>
        </div>
      </motion.div>

      {/* Positioning Headline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.2 }}
        className={cn(
          'p-5 rounded-3xl border bg-white shadow-xs space-y-3 transition-all',
          focusedField === 'headline' ? 'border-[#0058be] ring-2 ring-[#0058be]/20' : 'border-neutral-200'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#0058be]" />
            <span className="text-xs font-bold text-[#0b1c30]">Positioning Headline & Proof</span>
            <button
              onClick={handleGenerateIdentity}
              disabled={isGenerating}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer",
                isGenerating 
                  ? "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-wait"
                  : "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200 hover:shadow-sm hover:scale-[1.02]"
              )}
            >
              {isGenerating ? (
                <>
                  <div className="w-3 h-3 border-2 border-amber-700/30 border-t-amber-700 rounded-full animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  ✨ Auto-Generate Identity
                </>
              )}
            </button>
          </div>
          <div className="flex items-center gap-2">
            {isHeadlineSet && <CheckCircle2 size={14} className="text-emerald-500" />}
            <span className={cn(
              'text-[10px] font-bold px-2 py-0.5 rounded-full border',
              positioningHeadline.length > 200 ? 'text-red-600 bg-red-50 border-red-200' :
              positioningHeadline.length > 150 ? 'text-amber-600 bg-amber-50 border-amber-200' :
              'text-neutral-400 bg-neutral-100 border-neutral-200'
            )}>
              {positioningHeadline.length}/220 chars
            </span>
          </div>
        </div>
        <textarea
          value={positioningHeadline}
          onChange={(e) => onHeadlineChange(e.target.value)}
          onFocus={() => setFocusedField('headline')}
          onBlur={() => setFocusedField(null)}
          placeholder="e.g., Narrative Arc Engineering for YouTube Creators | Systematic Authority Builder"
          rows={2}
          maxLength={220}
          className="w-full text-sm text-[#0b1c30] bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:bg-white focus:border-[#0058be] transition-all resize-none leading-relaxed"
        />
        {/* Feature 4: Smart Platform Fit Indicators */}
        <PlatformFitStrip text={positioningHeadline} platforms={platforms} mode="headline" />
        <p className="text-[10px] text-neutral-400">
          This headline appears on your LinkedIn, GitHub README, and Twitter bio. Make it specific — avoid generic words like "freelancer" or "passionate."
        </p>
      </motion.div>

      {/* Positioning Proof Line */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.3 }}
        className={cn(
          'p-5 rounded-3xl border bg-white shadow-xs space-y-3 transition-all',
          focusedField === 'proof' ? 'border-[#0058be] ring-2 ring-[#0058be]/20' : 'border-neutral-200'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-[#0058be]" />
            <span className="text-xs font-bold text-[#0b1c30]">Positioning Proof Line</span>
          </div>
          <div className="flex items-center gap-2">
            {isProofLineSet && <CheckCircle2 size={14} className="text-emerald-500" />}
            <span className={cn(
              'text-[10px] font-bold px-2 py-0.5 rounded-full border',
              proofLine.length > 200 ? 'text-red-600 bg-red-50 border-red-200' :
              proofLine.length > 150 ? 'text-amber-600 bg-amber-50 border-amber-200' :
              'text-neutral-400 bg-neutral-100 border-neutral-200'
            )}>
              {proofLine.length}/220 chars
            </span>
          </div>
        </div>
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 space-y-2">
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Template</p>
          <p className="text-xs text-neutral-500 italic">
            "I help <span className="text-[#0058be] font-bold">[WHO]</span> achieve <span className="text-[#0058be] font-bold">[WHAT]</span> through <span className="text-[#0058be] font-bold">[HOW]</span>"
          </p>
        </div>
        <textarea
          value={proofLine}
          onChange={(e) => onProofLineChange(e.target.value)}
          onFocus={() => setFocusedField('proof')}
          onBlur={() => setFocusedField(null)}
          placeholder="e.g., I help YouTube creators achieve 10x subscriber growth through systematic narrative arc engineering"
          rows={2}
          maxLength={220}
          className="w-full text-sm text-[#0b1c30] bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:bg-white focus:border-[#0058be] transition-all resize-none leading-relaxed"
        />
        {/* Feature 4: Smart Platform Fit Indicators for Proof Line */}
        <PlatformFitStrip text={proofLine} platforms={platforms} mode="proof" />
      </motion.div>

      {/* Feature 5: Before vs After Identity Shift Card */}
      <BeforeAfterCard
        diagnosticGaps={diagnosticGaps}
        quizAnswers={quizAnswers}
        newHeadline={positioningHeadline}
        newProofLine={proofLine}
      />

      {/* Feature 6: Platform-Accurate Live Mockup Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.4 }}
        className="p-5 rounded-3xl bg-gradient-to-b from-[#0b1c30] to-[#06111f] border border-[#1a2d45] shadow-xl space-y-4"
      >
        <div className="flex items-center gap-2 border-b border-[#1a2d45] pb-3">
          <Sparkles size={14} className="text-[#d1f34d]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
            How You'll Look — Live Platform Mockups
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {platforms.map((p) => (
            <PlatformMockupCard
              key={p}
              platformId={p}
              userName={userName}
              userHandle={userHandle}
              headline={positioningHeadline}
              proofLine={proofLine}
              roleLabel={roleLabel}
            />
          ))}
        </div>
      </motion.div>

      {/* Continue CTA */}
      <div className="flex items-center justify-between pt-2">
        {onBack ? (
          <ModuleButton variant="secondary" onClick={onBack}>
            ← Back to Audit
          </ModuleButton>
        ) : <div />}
        <div className="flex items-center gap-3">
          {completedFields < 4 && (
            <span className="text-xs text-neutral-400 font-medium hidden sm:inline-block">
              Complete all 4 fields to continue
            </span>
          )}
          <ModuleButton variant="primary" onClick={onContinue} disabled={completedFields < 4}>
            Identity Set — Open Platform Studio →
          </ModuleButton>
        </div>
      </div>
    </div>
  );
});

IdentityFoundationSection.displayName = 'IdentityFoundationSection';
