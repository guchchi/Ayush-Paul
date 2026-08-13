import React, { useState, useMemo } from 'react';
import { useModule3Store } from '../../../../lib/module3/store';
import { cn } from '../../../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { EASING, DURATION } from '../../../../lib/motion-presets';
import {
  Pencil,
  RotateCcw,
  CheckCircle2,
  User,
  Code,
  Layers,
  Video,
  Globe,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import { ModuleButton } from '../../../workspace/ModuleButton';

interface Props {
  onContinue: () => void;
}

// ── Role-Based Recommendation Logic ───────────────────────────────────────────
interface RoleRecommendation {
  roleLabel: string;
  recommendedPlatforms: string[];
  rationale: string;
}

const getRoleRecommendation = (serviceId: string | null, careerTrackId: string | null): RoleRecommendation => {
  const s = (serviceId || '').toLowerCase();
  const c = (careerTrackId || '').toLowerCase();

  if (s.includes('edit') || s.includes('video') || s.includes('motion') || c.includes('editor')) {
    return {
      roleLabel: 'Video Editor & Motion Specialist',
      recommendedPlatforms: ['youtube', 'instagram', 'twitter', 'personal_site', 'linkedin'],
      rationale: 'Clients hire editors based on visual showreels and pacing clips. YouTube & Reels give instant proof.',
    };
  }

  if (s.includes('design') || s.includes('ui') || s.includes('figma') || c.includes('designer')) {
    return {
      roleLabel: 'UI/UX & Product Designer',
      recommendedPlatforms: ['behance', 'linkedin', 'twitter', 'personal_site', 'instagram'],
      rationale: 'Clients look for auto-layout grids and clickable prototypes on Behance/Figma alongside LinkedIn.',
    };
  }

  if (s.includes('code') || s.includes('dev') || s.includes('tech') || s.includes('app') || c.includes('developer')) {
    return {
      roleLabel: 'Software Developer & Technical Architect',
      recommendedPlatforms: ['github', 'linkedin', 'twitter', 'personal_site'],
      rationale: 'Tech clients evaluate code quality via GitHub READMEs and public repositories before booking a call.',
    };
  }

  return {
    roleLabel: 'Authority Specialist',
    recommendedPlatforms: ['linkedin', 'twitter', 'personal_site', 'instagram'],
    rationale: 'Optimizing high-converting copy across LinkedIn, X, and your personal site.',
  };
};

// ── Tone Variations Generator ────────────────────────────────────────────────
const generateToneVariations = (text: string, tone: 'executive' | 'conversion' | 'direct') => {
  if (!text) return text;
  if (tone === 'executive') {
    return text.startsWith('Verifiable') ? text : `Strategic Authority • ${text}`;
  }
  if (tone === 'conversion') {
    return `Proven ${text} — Eliminating Client Execution Risk.`;
  }
  return `${text} | Guaranteed Delivery & Measurable ROI.`;
};

export const ProfileStrategySection: React.FC<Props> = React.memo(({ onContinue }) => {
  const { authoritySuite, updateProfileField, resetProfileField, mod1ServiceId, mod1CareerTrackId } = useModule3Store();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [activeTone, setActiveTone] = useState<'executive' | 'conversion' | 'direct'>('executive');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const recommendation = useMemo(
    () => getRoleRecommendation(mod1ServiceId, mod1CareerTrackId),
    [mod1ServiceId, mod1CareerTrackId]
  );

  const [activeTab, setActiveTab] = useState<string>(recommendation.recommendedPlatforms[0] || 'linkedin');

  if (!authoritySuite || !authoritySuite.profileSystem) {
    return (
      <div className="w-full p-12 flex flex-col items-center justify-center border border-neutral-200 rounded-3xl bg-white shadow-xs">
        <div className="w-8 h-8 border-2 border-[#0058be] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-neutral-600 font-bold">Generating your role-personalized profile copy...</p>
      </div>
    );
  }

  const existingPlatforms = authoritySuite.profileSystem;

  const allPlatforms = [
    { key: 'linkedin', name: 'LinkedIn', icon: User, brandColor: 'bg-[#0a66c2]', textBrand: 'text-[#0a66c2]' },
    { key: 'twitter', name: 'X / Twitter', icon: User, brandColor: 'bg-black', textBrand: 'text-black' },
    { key: 'github', name: 'GitHub Profile', icon: Code, brandColor: 'bg-[#24292e]', textBrand: 'text-emerald-600' },
    { key: 'behance', name: 'Behance / Figma', icon: Layers, brandColor: 'bg-[#1abcfe]', textBrand: 'text-[#1abcfe]' },
    { key: 'youtube', name: 'YouTube Showreel', icon: Video, brandColor: 'bg-[#ff0000]', textBrand: 'text-[#ff0000]' },
    { key: 'personal_site', name: 'Personal Site', icon: Globe, brandColor: 'bg-[#0058be]', textBrand: 'text-[#0058be]' },
    { key: 'instagram', name: 'Instagram', icon: User, brandColor: 'bg-[#e1306c]', textBrand: 'text-[#e1306c]' },
  ];

  const formatPlatformName = (key: string) => {
    const item = allPlatforms.find((p) => p.key === key);
    return item ? item.name : key.charAt(0).toUpperCase() + key.slice(1);
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleEditStart = (fieldKey: string, value: string) => {
    setEditingField(fieldKey);
    setEditValue(value);
  };

  const handleEditSave = (platformKey: string, fieldKey: string) => {
    updateProfileField(platformKey as any, fieldKey, editValue);
    setEditingField(null);
  };

  const handleEditCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  const activePlatformData = existingPlatforms.find((p) => p.platform === activeTab) || {
    platform: activeTab,
    fields: [
      {
        key: 'headline',
        label: `${formatPlatformName(activeTab)} Authority Tagline`,
        value: `Verified ${recommendation.roleLabel} • Strategic Client Solutions`,
        isCustomized: false,
      },
      {
        key: 'bio',
        label: `${formatPlatformName(activeTab)} Overview & Bio`,
        value: `Building high-impact verifiable solutions for client risk elimination.`,
        isCustomized: false,
      },
    ],
  };

  const currentHeadline = generateToneVariations(
    activePlatformData.fields.find((f) => f.key.includes('headline') || f.key.includes('hero'))?.value || '',
    activeTone
  );

  const currentBio = activePlatformData.fields.find((f) => f.key.includes('bio') || f.key.includes('about') || f.key.includes('value'))?.value || '';

  return (
    <div className="w-full space-y-6 text-left font-sans">
      {/* Strategic Role Banner */}
      <div className="p-5 sm:p-6 rounded-3xl border border-neutral-200 bg-white shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-[#0058be]/10 text-[#0058be] border border-[#0058be]/20 px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles size={12} className="text-[#0058be]" />
              Role-Tailored Platform Suite
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Targeted for {recommendation.roleLabel}
            </span>
          </div>

          {/* Tone Variation Switcher */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs">
            <span className="text-[10px] font-bold text-neutral-400 px-2 uppercase tracking-wider flex items-center gap-1">
              <Sliders size={12} /> Tone:
            </span>
            {(['executive', 'conversion', 'direct'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTone(t)}
                className={cn(
                  'px-2.5 py-1 rounded-lg font-bold text-[11px] capitalize transition-all cursor-pointer border-none',
                  activeTone === t
                    ? 'bg-white text-[#0058be] shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed font-medium">
          <strong className="text-[#0b1c30]">Recommendation:</strong> {recommendation.rationale}
        </p>
      </div>

      {/* High-Impact Platform OS Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {allPlatforms.map((p) => {
          const isRecommended = recommendation.recommendedPlatforms.includes(p.key);
          const isSelected = activeTab === p.key;
          const IconComp = p.icon;

          return (
            <button
              key={p.key}
              onClick={() => {
                setActiveTab(p.key);
                setEditingField(null);
              }}
              className={cn(
                'p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 shadow-2xs group relative overflow-hidden',
                isSelected
                  ? 'bg-white border-[#0058be] ring-2 ring-[#0058be]/20 shadow-md'
                  : isRecommended
                  ? 'bg-blue-50/50 border-blue-200/80 hover:bg-blue-100/50'
                  : 'bg-white border-neutral-200 hover:border-neutral-300'
              )}
            >
              <div className="flex items-center justify-between">
                <div className={cn('p-1.5 rounded-lg text-white text-xs', p.brandColor)}>
                  <IconComp size={14} />
                </div>
                {isRecommended && (
                  <span className="text-[9px] font-extrabold text-[#0058be] bg-[#0058be]/10 px-1.5 py-0.5 rounded">
                    Top
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0b1c30] group-hover:text-[#0058be] transition-colors truncate">
                  {p.name}
                </h4>
                <span className="text-[9px] text-neutral-400 font-medium block uppercase tracking-wider">
                  {isSelected ? 'Active Studio' : 'Click to View'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dual Studio Workspace */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Left Column: High-Fidelity OS Mockup Canvas (6 cols) */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
                {formatPlatformName(activeTab)} OS Workspace
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy('all', `${currentHeadline}\n\n${currentBio}`)}
                  className="text-xs font-bold text-[#0058be] hover:underline flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-neutral-200 shadow-2xs"
                >
                  {copiedField === 'all' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{copiedField === 'all' ? 'Copied All!' : '1-Click Copy All'}</span>
                </button>
              </div>
            </div>

            <div className="bg-neutral-950 rounded-3xl p-5 border border-neutral-800 shadow-2xl text-white space-y-4 relative overflow-hidden">
              {/* GitHub Developer OS */}
              {activeTab === 'github' && (
                <div className="bg-[#0d1117] rounded-2xl border border-[#30363d] text-neutral-200 p-5 space-y-4 shadow-lg font-mono">
                  <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-emerald-500 flex items-center justify-center font-bold text-white text-lg">
                        AP
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-white">Ayush Paul</h3>
                          <span className="text-[9px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                            Pro Developer
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400">ayushpaul • Verified Software Architect</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#161b22] p-4 rounded-xl border border-[#30363d] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                        README.md / Authority Headline
                      </span>
                      <button
                        onClick={() => handleCopy('readme', currentHeadline)}
                        className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === 'readme' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <p className="text-xs text-neutral-200 leading-relaxed font-mono font-medium">
                      {currentHeadline}
                    </p>
                  </div>

                  {/* Commit Activity Grid Simulation */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                      1,842 contributions in the last year
                    </span>
                    <div className="grid grid-cols-12 gap-1 bg-[#161b22] p-3 rounded-xl border border-[#30363d]">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            'h-3 rounded-xs',
                            i % 5 === 0 ? 'bg-emerald-500' : i % 3 === 0 ? 'bg-emerald-700' : i % 2 === 0 ? 'bg-emerald-900' : 'bg-[#21262d]'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Behance / Figma OS */}
              {activeTab === 'behance' && (
                <div className="bg-slate-900 rounded-2xl border border-slate-800 text-white p-5 space-y-4 shadow-lg">
                  <div className="h-28 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-xl p-4 flex items-end justify-between border border-purple-500/30">
                    <div>
                      <span className="text-[10px] font-bold bg-white/10 px-3 py-1 rounded-full border border-white/20">
                        Figma Design System &amp; UI Kit
                      </span>
                      <h3 className="font-bold text-lg text-white mt-1">Ayush Paul — UX Space</h3>
                    </div>
                    <ExternalLink size={16} className="text-slate-300" />
                  </div>

                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                        Design Tagline
                      </span>
                      <button
                        onClick={() => handleCopy('behance', currentHeadline)}
                        className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === 'behance' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {currentHeadline}
                    </p>
                  </div>
                </div>
              )}

              {/* YouTube OS */}
              {activeTab === 'youtube' && (
                <div className="bg-neutral-950 rounded-2xl border border-neutral-800 text-white p-5 space-y-4 shadow-lg">
                  <div className="h-28 bg-gradient-to-r from-red-950 via-neutral-900 to-black rounded-xl p-4 flex items-end justify-between border border-red-900/30">
                    <div>
                      <span className="text-[10px] font-black uppercase text-red-400 bg-red-950 px-2.5 py-1 rounded border border-red-800">
                        Official Showreel Channel
                      </span>
                      <h3 className="font-bold text-base text-white mt-1">Ayush Paul Edits</h3>
                    </div>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-1.5 rounded-full">
                      Subscribe
                    </button>
                  </div>

                  <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
                        Showreel Hook
                      </span>
                      <button
                        onClick={() => handleCopy('yt', currentHeadline)}
                        className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === 'yt' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <p className="text-xs text-neutral-200 leading-relaxed italic font-medium">
                      "{currentHeadline}"
                    </p>
                  </div>
                </div>
              )}

              {/* LinkedIn OS */}
              {activeTab === 'linkedin' && (
                <div className="bg-white rounded-2xl overflow-hidden text-neutral-900 shadow-md border border-neutral-200">
                  <div className="h-28 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 relative p-4 flex items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-300 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-500/30">
                      {activePlatformData.fields.find((f) => f.key.includes('banner'))?.value ||
                        'Narrative Arc Engineering • Strategic Authority'}
                    </span>
                  </div>
                  <div className="p-5 pt-0 relative space-y-3">
                    <div className="flex items-end justify-between -mt-10 mb-2">
                      <div className="w-20 h-20 rounded-full border-4 border-white bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-md">
                        AP
                      </div>
                      <button className="px-4 py-1.5 bg-[#0058be] text-white text-xs font-bold rounded-full shadow-xs">
                        Open to Work
                      </button>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-neutral-900">Ayush Paul</h3>
                      <p className="text-xs font-bold text-[#0058be] leading-snug">
                        {currentHeadline}
                      </p>
                    </div>
                    <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">About</span>
                        <button
                          onClick={() => handleCopy('about', currentBio)}
                          className="text-[10px] text-neutral-500 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedField === 'about' ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                          <span>Copy Bio</span>
                        </button>
                      </div>
                      <p className="text-xs text-neutral-700 leading-relaxed italic">
                        {currentBio || 'Engineering verifiable authority position systems.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Twitter OS */}
              {activeTab === 'twitter' && (
                <div className="bg-black text-white rounded-2xl overflow-hidden border border-neutral-800 p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold text-xl border border-neutral-700">
                      AP
                    </div>
                    <button className="px-4 py-1.5 bg-white text-black font-bold text-xs rounded-full">
                      Follow
                    </button>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Ayush Paul</h3>
                    <p className="text-xs text-neutral-400 font-mono">@ayushpaul</p>
                  </div>
                  <p className="text-xs text-neutral-200 leading-relaxed bg-neutral-900 p-3.5 rounded-xl border border-neutral-800">
                    {currentHeadline}
                  </p>
                </div>
              )}

              {/* Personal Site OS */}
              {activeTab === 'personal_site' && (
                <div className="bg-neutral-950 text-white rounded-2xl overflow-hidden border border-neutral-800 p-5 space-y-4">
                  <div className="bg-neutral-900 px-3 py-2 rounded-lg border border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
                    <span>https://ayushpaul.com</span>
                    <span className="text-emerald-400 font-bold">HTTPS</span>
                  </div>
                  <div className="text-center space-y-3 py-3">
                    <h3 className="text-lg font-bold text-white max-w-xs mx-auto">
                      {currentHeadline}
                    </h3>
                    <p className="text-xs text-neutral-300 leading-relaxed max-w-xs mx-auto bg-neutral-900/60 p-3 rounded-xl border border-neutral-800">
                      {currentBio || 'Building predictable client acquisition pipelines.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Instagram OS */}
              {activeTab === 'instagram' && (
                <div className="bg-neutral-950 text-white rounded-2xl overflow-hidden border border-neutral-800 p-5 space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5">
                      <div className="w-full h-full bg-black rounded-full flex items-center justify-center font-bold text-white">
                        AP
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm text-white">ayushpaul.official</h3>
                      <button className="px-4 py-1 bg-blue-600 text-white font-bold text-xs rounded-lg">
                        Follow
                      </button>
                    </div>
                  </div>
                  <div className="bg-neutral-900 p-3.5 rounded-xl border border-neutral-800 space-y-1">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Bio Hook</span>
                    <p className="text-xs text-neutral-200 leading-relaxed font-sans">
                      {currentHeadline}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Copy Editor (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
                {formatPlatformName(activeTab)} Copy Fields
              </span>
              <span className="text-xs text-neutral-500 font-medium">
                {activePlatformData.fields.length} Strategy Fields
              </span>
            </div>

            {activePlatformData.fields.map((field) => {
              const isEditing = editingField === field.key;

              return (
                <div
                  key={field.key}
                  className="p-6 rounded-3xl border border-neutral-200 bg-white shadow-xs space-y-3 transition-all hover:border-[#0058be]/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-[#0058be]/10 text-[#0058be]">
                        <User size={14} />
                      </span>
                      <h4 className="text-sm font-bold text-[#0b1c30]">{field.label}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(field.key, field.value)}
                        className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 border border-neutral-200"
                      >
                        {copiedField === field.key ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        <span>{copiedField === field.key ? 'Copied' : 'Copy'}</span>
                      </button>
                      {!isEditing && (
                        <button
                          onClick={() => handleEditStart(field.key, field.value)}
                          className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-neutral-200"
                        >
                          <Pencil size={12} />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full text-xs text-[#0b1c30] bg-neutral-50 border border-neutral-300 rounded-2xl p-4 min-h-[110px] focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:bg-white resize-y font-sans leading-relaxed shadow-inner"
                      />
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={handleEditCancel}
                          className="px-4 py-2 text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleEditSave(activePlatformData.platform, field.key)}
                          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#0058be] hover:bg-[#0048a0] text-white rounded-xl transition-all cursor-pointer shadow-xs"
                        >
                          <CheckCircle2 size={14} />
                          Save &amp; Sync Live
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-neutral-700 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 leading-relaxed font-sans whitespace-pre-wrap">
                      {field.value}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Action Footer */}
      <div className="pt-6 flex justify-end">
        <ModuleButton onClick={onContinue}>
          Profile Reviewed &amp; Confirmed — Continue to Level 2 →
        </ModuleButton>
      </div>
    </div>
  );
});

ProfileStrategySection.displayName = 'ProfileStrategySection';
