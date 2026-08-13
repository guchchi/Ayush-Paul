import React, { useState, useMemo } from 'react';
import { useModule3Store } from '../../../../lib/module3/store';
import { cn } from '../../../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { EASING, DURATION } from '../../../../lib/motion-presets';
import { Pencil, RotateCcw, CheckCircle2, User, Code, Layers, Video, FileText, Globe, Sparkles, Star, ExternalLink } from 'lucide-react';
import { ModuleButton } from '../../../workspace/ModuleButton';

interface Props {
  onContinue: () => void;
}

// ── Role-Based Platform Recommendation Logic ──────────────────────────────────
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

  if (s.includes('auto') || s.includes('n8n') || s.includes('make') || c.includes('automation')) {
    return {
      roleLabel: 'Operations & Automation Engineer',
      recommendedPlatforms: ['github', 'linkedin', 'twitter', 'personal_site'],
      rationale: 'Clients need visual workflow scenario blueprints and system integration diagrams.',
    };
  }

  return {
    roleLabel: 'Authority Specialist',
    recommendedPlatforms: ['linkedin', 'twitter', 'personal_site', 'instagram'],
    rationale: 'Optimizing high-converting copy across LinkedIn, X, and your personal site.',
  };
};

export const ProfileStrategySection: React.FC<Props> = React.memo(({ onContinue }) => {
  const { authoritySuite, updateProfileField, resetProfileField, mod1ServiceId, mod1CareerTrackId } = useModule3Store();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

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

  // Extended platform definitions including specialized platforms
  const allPlatforms = [
    { key: 'linkedin', name: 'LinkedIn', icon: User, badge: 'Professional' },
    { key: 'twitter', name: 'X / Twitter', icon: User, badge: 'Social Authority' },
    { key: 'github', name: 'GitHub Profile', icon: Code, badge: 'Tech & Code' },
    { key: 'behance', name: 'Behance / Figma', icon: Layers, badge: 'Design System' },
    { key: 'youtube', name: 'YouTube / Showreel', icon: Video, badge: 'Visual Showreel' },
    { key: 'personal_site', name: 'Personal Site', icon: Globe, badge: 'Core Hub' },
    { key: 'instagram', name: 'Instagram', icon: User, badge: 'Visual Feed' },
  ];

  const formatPlatformName = (key: string) => {
    const item = allPlatforms.find((p) => p.key === key);
    return item ? item.name : key.charAt(0).toUpperCase() + key.slice(1);
  };

  const getCharLimit = (platform: string, fieldKey: string): number | null => {
    const p = platform.toLowerCase();
    const k = fieldKey.toLowerCase();
    if (p === 'linkedin' && k === 'headline') return 220;
    if (p === 'linkedin' && k === 'about') return 2600;
    if (p === 'twitter' && k === 'bio') return 160;
    if (p === 'github' && k === 'bio') return 180;
    if (p === 'personal_site' && k === 'hero_tagline') return 120;
    return null;
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

  // Get active platform data or construct dynamic fallback for specialized platforms
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

  return (
    <div className="w-full space-y-6 text-left font-sans">
      {/* Personalized Role Recommendation Banner */}
      <div className="p-6 rounded-3xl border border-neutral-200 bg-white shadow-xs space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-[#0058be]/10 text-[#0058be] border border-[#0058be]/20 px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles size={12} className="text-[#0058be]" />
              Role-Tailored Platform Engine
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Targeted for {recommendation.roleLabel}
            </span>
          </div>
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed font-medium">
          <strong className="text-[#0b1c30]">Strategic Recommendation:</strong> {recommendation.rationale}
        </p>
      </div>

      {/* Role-Adapted Platform Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
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
                'px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 border shadow-2xs',
                isSelected
                  ? 'bg-[#0058be] text-white border-[#0058be] shadow-sm'
                  : isRecommended
                  ? 'bg-blue-50/70 text-[#0058be] border-blue-200/80 hover:bg-blue-100/70'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
              )}
            >
              <IconComp size={15} />
              <span>{p.name}</span>
              {isRecommended && !isSelected && (
                <span className="text-[9px] font-extrabold bg-[#0058be]/15 text-[#0058be] px-1.5 py-0.5 rounded">
                  Top
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Dual Studio Grid (6 cols / 6 cols) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Left Column: High-Res Desktop Live Mockup Canvas (6 cols) */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
                {formatPlatformName(activeTab)} Live Preview
              </span>
              <span className="text-[10px] text-[#0058be] font-bold bg-[#0058be]/8 px-2.5 py-0.5 rounded-full border border-[#0058be]/15">
                Real-Time Render
              </span>
            </div>

            <div className="bg-neutral-900 rounded-3xl p-5 border border-neutral-800 shadow-xl text-white space-y-4">
              {/* GitHub Mockup */}
              {activeTab === 'github' && (
                <div className="bg-[#0d1117] rounded-2xl overflow-hidden border border-[#30363d] text-neutral-200 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-800 border border-[#30363d] flex items-center justify-center font-bold text-white text-lg">
                        AP
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-white">Ayush Paul</h3>
                        <p className="text-xs text-neutral-400 font-mono">ayushpaul • He/Him</p>
                      </div>
                    </div>
                    <span className="text-xs bg-[#21262d] text-neutral-300 border border-[#30363d] px-3 py-1 rounded-md font-bold">
                      Follow
                    </span>
                  </div>

                  <div className="bg-[#161b22] p-4 rounded-xl border border-[#30363d] space-y-2">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                      README.md / Profile Tagline
                    </span>
                    <p className="text-xs text-neutral-200 font-mono leading-relaxed">
                      {activePlatformData.fields.find((f) => f.key.includes('headline') || f.key.includes('bio'))?.value ||
                        'Building clean, scalable software architecture and verifiable client systems.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                      Pinned Repositories
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-[#161b22] p-3 rounded-lg border border-[#30363d] space-y-1">
                        <span className="text-xs font-bold text-blue-400 font-mono">clean-architecture-kit</span>
                        <p className="text-[10px] text-neutral-400">Production-ready system blueprints.</p>
                      </div>
                      <div className="bg-[#161b22] p-3 rounded-lg border border-[#30363d] space-y-1">
                        <span className="text-xs font-bold text-blue-400 font-mono">authority-engine</span>
                        <p className="text-[10px] text-neutral-400">Verifiable client proof system.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Behance / Figma Mockup */}
              {activeTab === 'behance' && (
                <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 text-white p-5 space-y-4">
                  <div className="h-24 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-xl p-4 flex items-end justify-between">
                    <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full border border-white/20">
                      Figma UI/UX Design System
                    </span>
                    <ExternalLink size={14} className="text-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-white">Ayush Paul — Product Design Space</h3>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                      {activePlatformData.fields.find((f) => f.key.includes('headline') || f.key.includes('bio'))?.value ||
                        'Crafting high-converting UI design systems, auto-layout grids, and clickable prototypes.'}
                    </p>
                  </div>
                </div>
              )}

              {/* YouTube / Showreel Mockup */}
              {activeTab === 'youtube' && (
                <div className="bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 text-white p-5 space-y-4">
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
                  <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Channel Hook</span>
                    <p className="text-xs text-neutral-200 leading-relaxed italic">
                      "{activePlatformData.fields.find((f) => f.key.includes('headline') || f.key.includes('bio'))?.value ||
                        'Visual walkthroughs & raw-to-cut video showreels for high-ticket creators.'}"
                    </p>
                  </div>
                </div>
              )}

              {/* LinkedIn Mockup */}
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
                        {activePlatformData.fields.find((f) => f.key.includes('headline'))?.value ||
                          'High-Ticket Authority System Architect'}
                      </p>
                    </div>
                    <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/80 space-y-1">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">About</span>
                      <p className="text-xs text-neutral-700 leading-relaxed italic">
                        {activePlatformData.fields.find((f) => f.key.includes('about') || f.key.includes('bio'))?.value ||
                          'Engineering verifiable authority position systems.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Twitter Mockup */}
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
                    {activePlatformData.fields.find((f) => f.key.includes('bio') || f.key.includes('headline'))?.value ||
                      'Engineering high-ticket authority systems.'}
                  </p>
                </div>
              )}

              {/* Personal Site Mockup */}
              {activeTab === 'personal_site' && (
                <div className="bg-neutral-950 text-white rounded-2xl overflow-hidden border border-neutral-800 p-5 space-y-4">
                  <div className="bg-neutral-900 px-3 py-2 rounded-lg border border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
                    <span>https://ayushpaul.com</span>
                    <span className="text-emerald-400 font-bold">HTTPS</span>
                  </div>
                  <div className="text-center space-y-3 py-3">
                    <h3 className="text-lg font-bold text-white max-w-xs mx-auto">
                      {activePlatformData.fields.find((f) => f.key.includes('hero') || f.key.includes('headline'))?.value ||
                        'High-Impact Strategic Authority'}
                    </h3>
                    <p className="text-xs text-neutral-300 leading-relaxed max-w-xs mx-auto bg-neutral-900/60 p-3 rounded-xl border border-neutral-800">
                      {activePlatformData.fields.find((f) => f.key.includes('value') || f.key.includes('bio'))?.value ||
                        'Building predictable client acquisition pipelines.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Instagram Mockup */}
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
                      {activePlatformData.fields.find((f) => f.key.includes('bio') || f.key.includes('headline'))?.value ||
                        'Verifiable authority systems for high-impact growth.'}
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
                {activePlatformData.fields.length} Configured Fields
              </span>
            </div>

            {activePlatformData.fields.map((field) => {
              const isEditing = editingField === field.key;
              const charLimit = getCharLimit(activePlatformData.platform, field.key);
              const currentLength = isEditing ? editValue.length : field.value.length;

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
                      {field.isCustomized && (
                        <span className="text-[9px] font-extrabold uppercase tracking-wider bg-indigo-50 text-[#0058be] px-2 py-0.5 rounded border border-indigo-200">
                          Customized
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {charLimit && (
                        <span
                          className={cn(
                            'text-[11px] font-mono font-bold',
                            currentLength > charLimit ? 'text-red-500' : 'text-neutral-400'
                          )}
                        >
                          {currentLength} / {charLimit}
                        </span>
                      )}
                      {!isEditing && (
                        <button
                          onClick={() => handleEditStart(field.key, field.value)}
                          className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-neutral-200"
                        >
                          <Pencil size={12} />
                          <span>Edit</span>
                        </button>
                      )}
                      {!isEditing && field.isCustomized && (
                        <button
                          onClick={() => resetProfileField(activePlatformData.platform as any, field.key)}
                          className="p-1.5 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                          title="Reset to AI generation"
                        >
                          <RotateCcw size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className={cn(
                          'w-full text-xs text-[#0b1c30] bg-neutral-50 border border-neutral-300 rounded-2xl p-4 min-h-[110px] focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:bg-white resize-y font-sans leading-relaxed shadow-inner',
                          charLimit && editValue.length > charLimit && 'border-red-500 focus:ring-red-500/20'
                        )}
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
