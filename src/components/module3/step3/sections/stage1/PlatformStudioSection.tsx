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
  Rocket,
  CheckSquare,
  BookOpen,
  Pin
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

const PLATFORM_CHECKLISTS: Record<string, string[]> = {
  linkedin: ['Banner matches new headline vibe', 'Featured section has case study link', 'Custom CTA button enabled', 'Set "Open to" -> Providing Services'],
  twitter: ['Pinned proof thread active', 'Single booking link in bio', 'Professional avatar updated'],
  github: ['Profile README.md fully updated', 'Pinned repositories show best work', 'Sponsor / Hire button visible'],
  instagram: ['Link-in-bio tree set up', 'Highlights organized by service', 'Contact button configured'],
  youtube: ['Channel banner updated', 'Watermark added to videos', 'About section matches bio'],
  personal_site: ['Favicon updated', 'Hero section copy is clear', 'Booking widget embedded'],
  behance: ['Portfolio items categorized', 'Available for hire turned on', 'Custom URL claimed']
};

const COPY_FORMULAS = [
  { id: 'proof', label: 'Proof-First', desc: 'Leads with metrics & results' },
  { id: 'problem', label: 'Problem-Solution', desc: 'Calls out client pain point' },
  { id: 'contrarian', label: 'Contrarian', desc: 'High-status, zero-fluff' }
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
          <button className="px-3.5 py-1 bg-[#0a66c2] hover:bg-[#004182] text-white text-[10px] font-bold rounded-full shadow-xs transition-colors">
            Connect
          </button>
        </div>
        <div>
          <h3 className="font-bold text-base text-neutral-900">{userName} <span className="text-neutral-500 text-xs font-normal">· 1st</span></h3>
          <p className="text-[11px] font-bold text-[#0a66c2] leading-snug line-clamp-2 mt-0.5">{headline}</p>
          <p className="text-[9px] text-neutral-500 mt-1">Talks about #design, #strategy, and #growth</p>
        </div>
        <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/80 space-y-1">
          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">About</span>
          <p className="text-[10px] text-neutral-700 leading-relaxed line-clamp-3 italic">{bio || 'Engineering verifiable authority position systems.'}</p>
        </div>
        <div className="pt-2">
          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-2 block">Featured</span>
          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden flex shadow-xs">
            <div className="w-16 h-16 bg-gradient-to-br from-[#0a66c2] to-[#004182] flex items-center justify-center text-white">
              <ExternalLink size={14} />
            </div>
            <div className="p-2 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-neutral-900 block truncate w-32">Book a Discovery Call</span>
              <span className="text-[9px] text-neutral-500">cal.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GitHubMockup({ userName, userHandle, initials, headline }: { userName: string; userHandle: string; initials: string; headline: string }) {
  // Generate random heatmap pattern
  const heatmap = Array.from({ length: 42 }).map((_, i) => {
    const active = Math.random() > 0.5;
    const intensity = Math.floor(Math.random() * 4);
    const colors = ['bg-[#161b22]', 'bg-[#0e4429]', 'bg-[#006d32]', 'bg-[#26a641]', 'bg-[#39d353]'];
    return <div key={i} className={`w-2 h-2 rounded-[1px] ${active ? colors[intensity] : colors[0]}`} />;
  });

  return (
    <div className="bg-[#0d1117] rounded-2xl border border-[#30363d] text-neutral-200 p-5 space-y-4 font-mono">
      <div className="flex items-center gap-3 border-b border-[#30363d] pb-3">
        <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#39d353] flex items-center justify-center font-bold text-white text-sm">
          {initials}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-white">{userName}</h3>
            <span className="text-[8px] bg-emerald-950 text-[#39d353] px-1.5 py-0.5 rounded border border-[#006d32]">Pro</span>
          </div>
          <p className="text-[10px] text-neutral-400">{userHandle}</p>
        </div>
      </div>
      <div className="bg-[#161b22] p-3 rounded-xl border border-[#30363d] space-y-1">
        <div className="flex items-center gap-1.5 mb-2">
          <BookOpen size={10} className="text-neutral-400" />
          <span className="text-[9px] text-[#39d353] font-bold uppercase tracking-wider">README.md</span>
        </div>
        <p className="text-[10px] text-neutral-200 leading-relaxed font-mono">{headline}</p>
      </div>
      <div>
        <span className="text-[9px] text-neutral-400 font-bold mb-1.5 block">1,240 contributions in the last year</span>
        <div className="flex flex-wrap gap-0.5 p-1.5 border border-[#30363d] rounded-lg w-fit">
          {heatmap}
        </div>
      </div>
    </div>
  );
}

function TwitterMockup({ userName, userHandle, initials, headline }: { userName: string; userHandle: string; initials: string; headline: string }) {
  return (
    <div className="bg-black text-white rounded-2xl overflow-hidden border border-neutral-800 p-5 space-y-3">
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold text-lg border border-neutral-700 relative">
          {initials}
        </div>
        <button className="px-4 py-1.5 bg-white text-black font-bold text-[10px] rounded-full hover:bg-neutral-200 transition-colors">Follow</button>
      </div>
      <div>
        <div className="flex items-center gap-1">
          <h3 className="font-bold text-sm text-white">{userName}</h3>
          <CheckCircle2 size={12} className="text-[#1d9bf0] fill-[#1d9bf0]/20" />
        </div>
        <p className="text-[10px] text-neutral-500 font-sans">@{userHandle}</p>
      </div>
      <p className="text-[11px] text-neutral-100 leading-relaxed whitespace-pre-wrap">{headline}</p>
      <div className="flex items-center gap-4 text-[10px] text-neutral-500 pt-1 border-b border-neutral-800 pb-3">
        <div><strong className="text-white">1,204</strong> Following</div>
        <div><strong className="text-white">14.2K</strong> Followers</div>
      </div>
      <div className="pt-1">
        <div className="flex items-center gap-1.5 text-neutral-500 text-[9px] font-bold uppercase tracking-wider mb-2">
          <Pin size={10} className="rotate-45" /> Pinned
        </div>
        <div className="bg-neutral-900/50 p-3 rounded-xl border border-neutral-800">
          <p className="text-[10px] text-neutral-300">Here's how I scaled my agency to $10k/mo using this one simple trick. A mega-thread 🧵👇</p>
        </div>
      </div>
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
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  const displayName = userName?.trim() || 'Your Name';
  const displayHandle = userHandle?.trim() || 'yourhandle';
  const initials = getInitials(userName?.trim() || 'YN');

  // Helper for applying formulas
  const applyFormula = (fieldKey: string, formulaId: string, originalValue: string) => {
    let result = originalValue || '';
    if (formulaId === 'proof') {
      result = fieldKey.includes('headline') 
        ? `I help clients scale → Generates $X in value | Ex-[Company] | Book a call below 👇`
        : `Over the past years, I've consistently delivered verifiable results. If you need someone who eliminates risk and guarantees delivery, let's talk.\n\nKey Result: Reduced churn by X% in 30 days.`;
    } else if (formulaId === 'problem') {
      result = fieldKey.includes('headline')
        ? `Tired of [Pain Point]? I build [Solution] for [Target Audience] so you can [Benefit].`
        : `Most businesses struggle with [Problem]. \n\nI solve this by implementing [Your Method]. The outcome? Predictable [Result] without the usual headaches.`;
    } else if (formulaId === 'contrarian') {
      result = fieldKey.includes('headline')
        ? `Unpopular opinion: [Industry Myth]. I do the exact opposite for [Target Audience].`
        : `Everyone says you need [Common Advice]. They're wrong.\n\nI build [Your Method] systems that ignore the noise and focus purely on [Metric that matters].`;
    }
    setEditValue(result);
  };

  const toggleChecklist = (stepId: string) => {
    setCheckedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const handleExportAll = () => {
    const lines: string[] = [];
    lines.push(`# Social Profile Identity Export\n\n`);
    
    profileSystem.forEach(p => {
      const platformName = ALL_PLATFORMS.find(ap => ap.key === p.platform)?.name || p.platform;
      lines.push(`## === ${platformName.toUpperCase()} ===\n`);
      p.fields.forEach(f => {
        lines.push(`**${f.label}:**\n${f.value}\n`);
      });
      lines.push('\n');
    });

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedField('export_all');
    setTimeout(() => setCopiedField(null), 2000);
  };

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
            
            {/* Copy Formulas Engine */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Rocket size={14} className="text-blue-600" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-900">
                  Instant Copy Formulas
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {COPY_FORMULAS.map(formula => (
                  <button
                    key={formula.id}
                    onClick={() => {
                      if (editingField) {
                         applyFormula(editingField, formula.id, activePlatformData.fields.find(f => f.key === editingField)?.value || '');
                      } else {
                         // Note: Instruct user to click edit first
                         alert('Please click "Edit" on a field below, then apply a formula.');
                      }
                    }}
                    className="flex-1 min-w-[120px] bg-white border border-blue-200 hover:border-blue-400 p-2 rounded-xl text-left transition-all group"
                  >
                    <span className="text-xs font-bold text-blue-900 block group-hover:text-blue-600">{formula.label}</span>
                    <span className="text-[9px] text-blue-500 block leading-tight mt-0.5">{formula.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block">
                {platformLabel} Copy Fields — {activePlatformData.fields.length} fields
              </span>
            </div>

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

            {/* Micro-Audit Checklist */}
            {PLATFORM_CHECKLISTS[activeTab] && (
              <div className="p-5 rounded-3xl border border-neutral-200 bg-white shadow-xs mt-6">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
                  <CheckSquare size={14} className="text-emerald-500" />
                  {platformLabel} Launch Checklist
                </h4>
                <div className="space-y-2">
                  {PLATFORM_CHECKLISTS[activeTab].map((step, idx) => {
                    const stepId = `${activeTab}_check_${idx}`;
                    const isChecked = !!checkedSteps[stepId];
                    return (
                      <label key={stepId} className="flex items-start gap-3 cursor-pointer group hover:bg-neutral-50 p-2 rounded-xl transition-colors">
                        <div className={cn(
                          "w-4 h-4 mt-0.5 rounded flex items-center justify-center border transition-colors shrink-0",
                          isChecked ? "bg-emerald-500 border-emerald-500" : "bg-white border-neutral-300 group-hover:border-emerald-400"
                        )}>
                          {isChecked && <Check size={10} className="text-white" />}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={isChecked}
                          onChange={() => toggleChecklist(stepId)}
                        />
                        <span className={cn(
                          "text-xs font-medium transition-colors",
                          isChecked ? "text-neutral-400 line-through" : "text-neutral-700"
                        )}>
                          {step}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Continue CTA & Global Export */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200/60">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="text-xs font-bold text-neutral-500 hover:text-neutral-900">
              ← Back
            </button>
          )}
          <button
            onClick={handleExportAll}
            className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-md"
          >
            {copiedField === 'export_all' ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
            {copiedField === 'export_all' ? 'Bundle Copied!' : 'Export All Bios Bundle'}
          </button>
        </div>
        
        <ModuleButton variant="primary" onClick={onContinue}>
          Platforms Optimized — Run Consistency Check →
        </ModuleButton>
      </div>
    </div>
  );
});

PlatformStudioSection.displayName = 'PlatformStudioSection';

