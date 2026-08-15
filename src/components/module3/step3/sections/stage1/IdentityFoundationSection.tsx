/**
 * Section 2: Identity Foundation
 * 
 * "Pehle base set kar"
 * Single source of truth: Name, Handle, Positioning Headline, Proof Line.
 * Changes here auto-sync to all platform mockups.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
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
} from 'lucide-react';
import { ModuleButton } from '@/src/components/workspace/ModuleButton';

interface Props {
  userName: string;
  userHandle: string;
  positioningHeadline: string;
  proofLine: string;
  roleLabel: string;
  onUserNameChange: (name: string) => void;
  onUserHandleChange: (handle: string) => void;
  onHeadlineChange: (headline: string) => void;
  onProofLineChange: (line: string) => void;
  onContinue: () => void;
}

export const IdentityFoundationSection: React.FC<Props> = React.memo(({
  userName,
  userHandle,
  positioningHeadline,
  proofLine,
  roleLabel,
  onUserNameChange,
  onUserHandleChange,
  onHeadlineChange,
  onProofLineChange,
  onContinue,
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isNameSet = userName.trim().length >= 2;
  const isHandleSet = userHandle.trim().length >= 2;
  const isHeadlineSet = positioningHeadline.trim().length > 10;
  const isProofLineSet = proofLine.trim().length > 10;
  const completedFields = [isNameSet, isHandleSet, isHeadlineSet, isProofLineSet].filter(Boolean).length;

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
            <span className="text-xs font-bold text-[#0b1c30]">Positioning Headline</span>
            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              From Module 2
            </span>
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
          className="w-full text-sm text-[#0b1c30] bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:bg-white focus:border-[#0058be] transition-all resize-none leading-relaxed"
        />
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
          {isProofLineSet && <CheckCircle2 size={14} className="text-emerald-500" />}
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
          className="w-full text-sm text-[#0b1c30] bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:bg-white focus:border-[#0058be] transition-all resize-none leading-relaxed"
        />
      </motion.div>

      {/* Live Sync Preview Strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.4 }}
        className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2"
      >
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
          Live Sync Preview — How platforms will display your identity
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { platform: 'LinkedIn', preview: `${userName} • ${positioningHeadline.slice(0, 40)}...` },
            { platform: 'GitHub', preview: `${userHandle} — ${positioningHeadline.slice(0, 30)}...` },
            { platform: 'Twitter', preview: `@${userHandle} • ${positioningHeadline.slice(0, 25)}...` },
            { platform: 'YouTube', preview: `${userName} Edits` },
          ].map((item) => (
            <div key={item.platform} className="p-2.5 rounded-xl bg-white border border-neutral-200 space-y-0.5">
              <span className="text-[9px] font-bold text-[#0058be] uppercase tracking-wider">{item.platform}</span>
              <p className="text-[10px] text-neutral-600 font-medium truncate">{item.preview}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Continue CTA */}
      <div className="flex justify-end pt-2">
        <ModuleButton onClick={onContinue}>
          Identity Set — Open Platform Studio →
        </ModuleButton>
      </div>
    </div>
  );
});

IdentityFoundationSection.displayName = 'IdentityFoundationSection';

