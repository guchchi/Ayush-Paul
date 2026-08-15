/**
 * Section 3: Platform Studio
 * 
 * "Ab har platform ko ek-ek karke optimize kar"
 * Tab-based platform editor with Live OS Mockup (Left) + Copy Editor (Right).
 * Migrated & cleaned from the original ProfileStrategySection monolith.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { EASING, DURATION } from '@/src/lib/motion-presets';
import type { ProfileSystemAsset } from '@/src/data/module3/authority-suite-engine';
import {
  User,
  Code,
  Layers,
  Video,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Pencil,
  CheckCircle2,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';
import { ModuleButton } from '@/src/components/workspace/ModuleButton';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  profileSystem: ProfileSystemAsset[];
  userName: string;
  userHandle: string;
  activeTone: 'executive' | 'conversion' | 'direct';
  roleLabel: string;
  recommendedPlatforms: string[];
  onToneChange: (tone: 'executive' | 'conversion' | 'direct') => void;
  onUpdateField: (platform: string, fieldKey: string, value: string) => void;
  onResetField: (platform: string, fieldKey: string) => void;
  onBack?: () => void;
  onContinue: () => void;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PLATFORM_DEEP_LINKS: Record<string, { label: string; url: string }> = {
  linkedin: { label: 'Open LinkedIn Edit ↗', url: 'https://www.linkedin.com/in/me/overlay/edit/' },
  github: { label: 'Open GitHub Settings ↗', url: 'https://github.com/settings/profile' },
  twitter: { label: 'Open X Settings ↗', url: 'https://x.com/settings/profile' },
  youtube: { label: 'Open YouTube Studio ↗', url: 'https://studio.youtube.com/channel/editing/profile' },
  behance: { label: 'Open Figma Settings ↗', url: 'https://www.figma.com/settings' },
  instagram: { label: 'Open Instagram Edit ↗', url: 'https://www.instagram.com/accounts/edit/' },
  personal_site: { label: 'Copy Site HTML', url: '#' },
};

const ALL_PLATFORMS = [
  { key: 'linkedin', name: 'LinkedIn', icon: User, brandColor: 'bg-[#0a66c2]' },
  { key: 'twitter', name: 'X / Twitter', icon: User, brandColor: 'bg-black' },
  { key: 'github', name: 'GitHub', icon: Code, brandColor: 'bg-[#24292e]' },
  { key: 'behance', name: 'Figma / Behance', icon: Layers, brandColor: 'bg-[#1abcfe]' },
  { key: 'youtube', name: 'YouTube', icon: Video, brandColor: 'bg-[#ff0000]' },
  { key: 'personal_site', name: 'Personal Site', icon: Globe, brandColor: 'bg-[#0058be]' },
  { key: 'instagram', name: 'Instagram', icon: User, brandColor: 'bg-[#e1306c]' },
];

const CHAR_LIMITS: Record<string, number> = {
  linkedin_headline: 220,
  twitter_bio: 160,
  instagram_bio: 150,
  youtube_description: 5000,
};

const TONES = [
  { key: 'executive' as const, label: 'Executive', desc: 'Corporate & Enterprise B2B' },
  { key: 'conversion' as const, label: 'Conversion', desc: 'Startup Founders & Risk Elimination' },
  { key: 'direct' as const, label: 'Direct Response', desc: 'Growth Teams & ROI Focus' },
];

// ── Helper ────────────────────────────────────────────────────────────────────

const getInitials = (name: string) => {
  if (!name) return 'AP';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const generateToneVariation = (text: string, tone: 'executive' | 'conversion' | 'direct') => {
  if (!text) return text;
  if (tone === 'executive') return text.startsWith('Verifiable') ? text : `Strategic Authority • ${text}`;
  if (tone === 'conversion') return `Proven ${text} — Eliminating Client Execution Risk.`;
  return `${text} | Guaranteed Delivery & Measurable ROI.`;
};

// ── Live OS Mockup Components ─────────────────────────────────────────────────

function LinkedInMockup({ userName, initials, headline, bio }: { userName: string; initials: string; headline: string; bio: string }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden text-neutral-900 shadow-md border border-neutral-200">
      <div className="h-24 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 relative p-4 flex items-end">
        <span className="text-[9px] font-black uppercase tracking-widest text-blue-300 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-500/30">
          Strategic Authority
        </span>
      </div>
      <div className="p-5 pt-0 relative space-y-3">
        <div className="flex items-end justify-between -mt-10 mb-2">
          <div className="w-16 h-16 rounded-full border-4 border-white bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-md">
            {initials}
          </div>
          <button className="px-3.5 py-1 bg-[#0058be] text-white text-[10px] font-bold rounded-full shadow-xs">
            Open to Work
          </button>
        </div>
        <div>
          <h3 className="font-bold text-base text-neutral-900">{userName}</h3>
          <p className="text-[11px] font-bold text-[#0058be] leading-snug line-clamp-2">{headline}</p>
        </div>
        <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/80 space-y-1">
          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">About</span>
          <p className="text-[10px] text-neutral-700 leading-relaxed line-clamp-3 italic">{bio || 'Engineering verifiable authority position systems.'}</p>
        </div>
      </div>
    </div>
  );
}

function GitHubMockup({ userName, userHandle, initials, headline }: { userName: string; userHandle: string; initials: string; headline: string }) {
  return (
    <div className="bg-[#0d1117] rounded-2xl border border-[#30363d] text-neutral-200 p-5 space-y-4 font-mono">
      <div className="flex items-center gap-3 border-b border-[#30363d] pb-3">
        <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-emerald-500 flex items-center justify-center font-bold text-white text-sm">
          {initials}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-white">{userName}</h3>
            <span className="text-[8px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800">Pro</span>
          </div>
          <p className="text-[10px] text-neutral-400">{userHandle}</p>
        </div>
      </div>
      <div className="bg-[#161b22] p-3 rounded-xl border border-[#30363d] space-y-1">
        <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">README.md</span>
        <p className="text-[10px] text-neutral-200 leading-relaxed font-mono">{headline}</p>
      </div>
    </div>
  );
}

function TwitterMockup({ userName, userHandle, initials, headline }: { userName: string; userHandle: string; initials: string; headline: string }) {
  return (
    <div className="bg-black text-white rounded-2xl overflow-hidden border border-neutral-800 p-5 space-y-3">
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold text-lg border border-neutral-700">
          {initials}
        </div>
        <button className="px-3.5 py-1 bg-white text-black font-bold text-[10px] rounded-full">Follow</button>
      </div>
      <div>
        <h3 className="font-bold text-sm text-white">{userName}</h3>
        <p className="text-[10px] text-neutral-400 font-mono">@{userHandle}</p>
      </div>
      <p className="text-[10px] text-neutral-200 leading-relaxed bg-neutral-900 p-3 rounded-xl border border-neutral-800">{headline}</p>
    </div>
  );
}

function YouTubeMockup({ userName, headline }: { userName: string; headline: string }) {
  return (
    <div className="bg-neutral-950 rounded-2xl border border-neutral-800 text-white p-5 space-y-3">
      <div className="h-20 bg-gradient-to-r from-red-950 via-neutral-900 to-black rounded-xl p-3 flex items-end justify-between border border-red-900/30">
        <div>
          <span className="text-[9px] font-black uppercase text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800">Showreel</span>
          <h3 className="font-bold text-sm text-white mt-1">{userName} Edits</h3>
        </div>
        <button className="bg-red-600 text-white font-bold text-[9px] px-3 py-1 rounded-full">Subscribe</button>
      </div>
      <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800 space-y-1">
        <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider">Hook</span>
        <p className="text-[10px] text-neutral-200 leading-relaxed italic">"{headline}"</p>
      </div>
    </div>
  );
}

function PersonalSiteMockup({ userHandle, headline, bio }: { userHandle: string; headline: string; bio: string }) {
  return (
    <div className="bg-neutral-950 text-white rounded-2xl border border-neutral-800 p-5 space-y-3">
      <div className="bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
        <span>https://{userHandle}.com</span>
        <span className="text-emerald-400 font-bold">HTTPS</span>
      </div>
      <div className="text-center space-y-2 py-2">
        <h3 className="text-sm font-bold text-white max-w-xs mx-auto">{headline}</h3>
        <p className="text-[10px] text-neutral-300 leading-relaxed max-w-xs mx-auto bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-800">
          {bio || 'Building predictable client acquisition pipelines.'}
        </p>
      </div>
    </div>
  );
}

function GenericMockup({ platformName, userName, initials, headline }: { platformName: string; userName: string; initials: string; headline: string }) {
  return (
    <div className="bg-neutral-950 text-white rounded-2xl border border-neutral-800 p-5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-white text-sm">{initials}</div>
        <div>
          <h3 className="font-bold text-sm text-white">{userName}</h3>
          <span className="text-[9px] text-neutral-400">{platformName}</span>
        </div>
      </div>
      <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
        <p className="text-[10px] text-neutral-200 leading-relaxed">{headline}</p>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export const PlatformStudioSection: React.FC<Props> = React.memo(({
  profileSystem,
  userName,
  userHandle,
  activeTone,
  roleLabel,
  recommendedPlatforms,
  onToneChange,
  onUpdateField,
  onResetField,
  onBack,
  onContinue,
}) => {
  const primaryPlatforms = ALL_PLATFORMS.filter(p => recommendedPlatforms.includes(p.key));
  const secondaryPlatforms = ALL_PLATFORMS.filter(p => !recommendedPlatforms.includes(p.key));

  const [activeTab, setActiveTab] = useState<string>(recommendedPlatforms[0] || 'linkedin');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showSecondary, setShowSecondary] = useState(false);

  const displayName = userName?.trim() || 'Your Name';
  const displayHandle = userHandle?.trim() || 'yourhandle';
  const initials = getInitials(userName?.trim() || 'YN');

  const activePlatformData = useMemo(() => {
    return profileSystem.find(p => p.platform === activeTab) || {
      platform: activeTab,
      fields: [
        { key: 'headline', label: 'Authority Tagline', value: 'Strategic Authority Specialist', originalValue: '', isCustomized: false },
        { key: 'bio', label: 'Bio / About', value: 'Building high-impact solutions.', originalValue: '', isCustomized: false },
      ],
    };
  }, [profileSystem, activeTab]);

  const currentHeadline = generateToneVariation(
    activePlatformData.fields.find(f => f.key.includes('headline') || f.key.includes('hero'))?.value || '',
    activeTone
  );
  const currentBio = activePlatformData.fields.find(f => f.key.includes('bio') || f.key.includes('about') || f.key.includes('value'))?.value || '';
  const deepLink = PLATFORM_DEEP_LINKS[activeTab];

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleEditStart = (fieldKey: string, value: string) => {
    setEditingField(fieldKey);
    setEditValue(value);
  };

  const handleEditSave = (fieldKey: string) => {
    onUpdateField(activeTab, fieldKey, editValue);
    setEditingField(null);
  };

  const platformLabel = ALL_PLATFORMS.find(p => p.key === activeTab)?.name || activeTab;

  return (
    <div className="w-full space-y-5 text-left font-sans">
      {/* Tone Selector */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
        className="p-4 rounded-3xl border border-neutral-200 bg-white shadow-xs"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">Authority Tone</span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {roleLabel}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {TONES.map(tone => (
            <button
              key={tone.key}
              onClick={() => onToneChange(tone.key)}
              className={cn(
                'p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-0.5',
                activeTone === tone.key
                  ? 'bg-[#0058be] text-white border-[#0058be] shadow-md'
                  : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
              )}
            >
              <span className="text-xs font-bold block">{tone.label}</span>
              <span className={cn('text-[9px] block', activeTone === tone.key ? 'text-blue-100' : 'text-neutral-400')}>
                {tone.desc}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Platform Tab Selector */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.05 }}
        className="p-4 rounded-3xl border border-neutral-200 bg-white shadow-xs space-y-3"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
            Primary Channels
          </span>
          <button
            onClick={() => setShowSecondary(!showSecondary)}
            className="text-xs font-bold text-[#0058be] hover:underline flex items-center gap-1 cursor-pointer"
          >
            {showSecondary ? 'Hide' : `+ ${secondaryPlatforms.length} More`}
            <ChevronDown size={13} className={cn('transition-transform', showSecondary && 'rotate-180')} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {primaryPlatforms.map(p => {
            const isActive = activeTab === p.key;
            const Icon = p.icon;
            return (
              <button
                key={p.key}
                onClick={() => { setActiveTab(p.key); setEditingField(null); }}
                className={cn(
                  'px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2',
                  isActive
                    ? 'bg-[#0058be] text-white border-[#0058be] shadow-md'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                )}
              >
                <Icon size={14} />
                {p.name}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {showSecondary && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 pt-2 border-t border-neutral-100"
            >
              {secondaryPlatforms.map(p => {
                const isActive = activeTab === p.key;
                const Icon = p.icon;
                return (
                  <button
                    key={p.key}
                    onClick={() => { setActiveTab(p.key); setEditingField(null); }}
                    className={cn(
                      'px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                      isActive
                        ? 'bg-[#0058be] text-white border-[#0058be]'
                        : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                    )}
                  >
                    <Icon size={12} />
                    {p.name}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Dual Studio: Left Mockup + Right Editor */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-5"
        >
          {/* Left: Live OS Mockup (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
                {platformLabel} Preview
              </span>
              {deepLink && deepLink.url !== '#' && (
                <a
                  href={deepLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold text-[#0058be] hover:underline flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-neutral-200"
                >
                  <ExternalLink size={10} />
                  {deepLink.label}
                </a>
              )}
            </div>

            <div className="bg-neutral-950 rounded-3xl p-4 border border-neutral-800 shadow-2xl">
              {activeTab === 'linkedin' && <LinkedInMockup userName={displayName} initials={initials} headline={currentHeadline} bio={currentBio} />}
              {activeTab === 'github' && <GitHubMockup userName={displayName} userHandle={displayHandle} initials={initials} headline={currentHeadline} />}
              {activeTab === 'twitter' && <TwitterMockup userName={displayName} userHandle={displayHandle} initials={initials} headline={currentHeadline} />}
              {activeTab === 'youtube' && <YouTubeMockup userName={displayName} headline={currentHeadline} />}
              {activeTab === 'personal_site' && <PersonalSiteMockup userHandle={displayHandle} headline={currentHeadline} bio={currentBio} />}
              {!['linkedin', 'github', 'twitter', 'youtube', 'personal_site'].includes(activeTab) && (
                <GenericMockup platformName={platformLabel} userName={displayName} initials={initials} headline={currentHeadline} />
              )}
            </div>
          </div>

          {/* Right: Copy Editor (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block">
              {platformLabel} Copy Fields — {activePlatformData.fields.length} fields
            </span>

            {activePlatformData.fields.map(field => {
              const isEditing = editingField === field.key;
              const charLimitKey = `${activeTab}_${field.key}`;
              const charLimit = CHAR_LIMITS[charLimitKey];

              return (
                <div
                  key={field.key}
                  className="p-5 rounded-3xl border border-neutral-200 bg-white shadow-xs space-y-3 transition-all hover:border-[#0058be]/30"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#0b1c30]">{field.label}</h4>
                    <div className="flex items-center gap-2">
                      {charLimit && (
                        <span className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                          field.value.length > charLimit ? 'text-red-600 bg-red-50 border-red-200' :
                          field.value.length > charLimit * 0.8 ? 'text-amber-600 bg-amber-50 border-amber-200' :
                          'text-neutral-400 bg-neutral-100 border-neutral-200'
                        )}>
                          {field.value.length}/{charLimit}
                        </span>
                      )}
                      <button
                        onClick={() => handleCopy(field.key, field.value)}
                        className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 border border-neutral-200"
                      >
                        {copiedField === field.key ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                        {copiedField === field.key ? 'Copied' : 'Copy'}
                      </button>
                      {!isEditing && (
                        <button
                          onClick={() => handleEditStart(field.key, field.value)}
                          className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 border border-neutral-200"
                        >
                          <Pencil size={11} />
                          Edit
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full text-xs text-[#0b1c30] bg-neutral-50 border border-neutral-300 rounded-2xl p-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:bg-white resize-y font-sans leading-relaxed"
                      />
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setEditingField(null)}
                          className="px-3.5 py-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleEditSave(field.key)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-[#0058be] hover:bg-[#0048a0] text-white rounded-xl transition-all cursor-pointer shadow-xs"
                        >
                          <CheckCircle2 size={13} />
                          Save & Sync
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-neutral-700 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 leading-relaxed whitespace-pre-wrap">
                      {field.value}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Continue CTA */}
      <div className="flex items-center justify-between pt-4">
        {onBack ? (
          <ModuleButton variant="secondary" onClick={onBack}>
            ← Back to Identity Foundation
          </ModuleButton>
        ) : <div />}
        <ModuleButton variant="primary" onClick={onContinue}>
          Platforms Optimized — Run Consistency Check →
        </ModuleButton>
      </div>
    </div>
  );
});

PlatformStudioSection.displayName = 'PlatformStudioSection';

