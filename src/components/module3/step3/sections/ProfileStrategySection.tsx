import React, { useState } from 'react';
import { useModule3Store } from '../../../../lib/module3/store';
import { cn } from '../../../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { EASING, DURATION } from '../../../../lib/motion-presets';
import { Pencil, RotateCcw, CheckCircle2, User } from 'lucide-react';

interface Props {
  onContinue: () => void;
}

export const ProfileStrategySection: React.FC<Props> = React.memo(({ onContinue }) => {
  const { authoritySuite, updateProfileField, resetProfileField } = useModule3Store();
  const [activeTab, setActiveTab] = useState<string>('');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  if (!authoritySuite || !authoritySuite.profileSystem) {
    return (
      <div className="w-full p-12 flex flex-col items-center justify-center border border-neutral-200 rounded-xl bg-neutral-50/50">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-neutral-500 font-medium">Generating your profile copy...</p>
      </div>
    );
  }

  const platforms = authoritySuite.profileSystem;
  
  React.useEffect(() => {
    if (platforms.length > 0 && !activeTab) {
      setActiveTab(platforms[0].platform);
    }
  }, [platforms, activeTab]);

  const activePlatformData = platforms.find((p) => p.platform === activeTab);

  const formatPlatformName = (name: string) => {
    switch (name.toLowerCase()) {
      case 'linkedin': return 'LinkedIn';
      case 'twitter': return 'X / Twitter';
      case 'personal_site': return 'Personal Portfolio Site';
      default: return name.charAt(0).toUpperCase() + name.slice(1);
    }
  };

  const getCharLimit = (platform: string, fieldKey: string): number | null => {
    const p = platform.toLowerCase();
    const k = fieldKey.toLowerCase();
    if (p === 'linkedin' && k === 'headline') return 220;
    if (p === 'linkedin' && k === 'about') return 2600;
    if (p === 'twitter' && k === 'bio') return 160;
    if (p === 'personal_site' && k === 'hero_tagline') return 120;
    if (p === 'personal_site' && k === 'value_prop_subhead') return 250;
    return null;
  };

  const handleEditStart = (fieldKey: string, value: string) => {
    setEditingField(fieldKey);
    setEditValue(value);
  };

  const handleEditSave = (platform: 'linkedin'|'twitter'|'personal_site', fieldKey: string) => {
    updateProfileField(platform, fieldKey, editValue);
    setEditingField(null);
  };

  const handleEditCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  return (
    <div className="w-full space-y-6 text-left">
      {/* Section Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl text-white space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full">
            Live Platform Studio
          </span>
          <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
            ● Real-Time Bi-Directional Sync
          </span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Section 2 — Profile Identity &amp; Live Studio Preview
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
          Refine your positioning claims in real-time. Watch your headline, bio, and value proposition render across live high-fidelity mockups for LinkedIn, X (Twitter), and your Personal Portfolio Site.
        </p>
      </div>

      {/* Platform Switcher Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
        {platforms.map((p) => {
          const isSelected = activeTab === p.platform;
          return (
            <button
              key={p.platform}
              onClick={() => {
                setActiveTab(p.platform);
                setEditingField(null);
              }}
              className={cn(
                "px-5 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2.5 shrink-0 shadow-sm border",
                isSelected
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-indigo-500 shadow-indigo-500/20"
                  : "bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white"
              )}
            >
              <User className={cn("w-4 h-4", isSelected ? "text-white" : "text-indigo-400")} />
              <span>{formatPlatformName(p.platform)}</span>
            </button>
          );
        })}
      </div>

      {/* Dual Studio Grid (6 cols / 6 cols) */}
      <AnimatePresence mode="wait">
        {activePlatformData && (
          <motion.div
            key={activePlatformData.platform}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Column: High-Res Desktop Live Mockup Studio (6 cols) */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-neutral-400">
                  Live High-Res Platform Canvas
                </span>
                <span className="text-[10px] text-indigo-400 font-bold bg-indigo-950/80 px-2.5 py-0.5 rounded-full border border-indigo-800">
                  100% Fidelity Simulation
                </span>
              </div>

              <div className="bg-neutral-950 rounded-3xl p-5 border border-neutral-800 shadow-2xl text-white space-y-4">
                {activePlatformData.platform === 'linkedin' && (
                  <div className="bg-white rounded-2xl overflow-hidden text-neutral-900 shadow-xl border border-neutral-200">
                    {/* LinkedIn Banner */}
                    <div className="h-32 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 relative p-4 flex items-end">
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-300 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-500/30 relative z-10">
                        {activePlatformData.fields.find(f => f.key.includes('banner'))?.value || 'Narrative Arc Engineering • Strategic Authority'}
                      </span>
                    </div>

                    {/* LinkedIn Profile Body */}
                    <div className="p-6 pt-0 relative">
                      <div className="flex items-end justify-between -mt-12 mb-3">
                        <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-900 text-white flex items-center justify-center font-black text-3xl shadow-lg">
                          AP
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-1.5 bg-blue-700 text-white text-xs font-bold rounded-full shadow-sm hover:bg-blue-800">
                            Open to
                          </button>
                          <button className="px-4 py-1.5 border border-blue-700 text-blue-700 text-xs font-bold rounded-full hover:bg-blue-50">
                            More
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-xl text-neutral-900">Ayush Paul</h3>
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            Verified Authority
                          </span>
                        </div>
                        <p className="text-xs font-bold text-blue-800 leading-snug">
                          {activePlatformData.fields.find(f => f.key.includes('headline'))?.value || 'High-Ticket Authority System Architect'}
                        </p>
                        <p className="text-[11px] text-neutral-500 font-medium">San Francisco Bay Area • Contact info</p>
                      </div>

                      {/* About Story Box */}
                      <div className="mt-5 pt-4 border-t border-neutral-100 space-y-1.5">
                        <span className="text-[11px] font-black text-neutral-400 uppercase tracking-wider block">About Section</span>
                        <div className="text-xs text-neutral-700 leading-relaxed space-y-2 italic font-sans bg-neutral-50 p-4 rounded-xl border border-neutral-200/80">
                          {activePlatformData.fields.find(f => f.key.includes('about') || f.key.includes('bio'))?.value || 'Engineering verifiable authority position systems.'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activePlatformData.platform === 'twitter' && (
                  <div className="bg-black text-white rounded-2xl overflow-hidden border border-neutral-800 shadow-xl">
                    <div className="h-28 bg-gradient-to-r from-purple-900 via-indigo-950 to-black relative p-3 flex items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-full border border-purple-800">
                        Official Profile
                      </span>
                    </div>
                    <div className="p-6 pt-0 relative space-y-3">
                      <div className="flex justify-between items-start -mt-10 mb-2">
                        <div className="w-20 h-20 rounded-full border-4 border-black bg-neutral-800 text-white flex items-center justify-center font-black text-2xl shadow-lg">
                          AP
                        </div>
                        <button className="px-5 py-2 bg-white text-black font-black text-xs rounded-full mt-12 hover:bg-neutral-200">
                          Follow
                        </button>
                      </div>
                      <div>
                        <h3 className="font-black text-lg text-white">Ayush Paul</h3>
                        <p className="text-xs text-neutral-400 font-mono">@ayushpaul</p>
                      </div>
                      <p className="text-xs text-neutral-200 leading-relaxed bg-neutral-900 p-4 rounded-xl border border-neutral-800">
                        {activePlatformData.fields.find(f => f.key.includes('bio') || f.key.includes('headline'))?.value || 'Engineering high-ticket consulting authority systems.'}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-neutral-400 pt-1">
                        <span><strong className="text-white">1,420</strong> Following</span>
                        <span><strong className="text-white">8,910</strong> Followers</span>
                      </div>
                    </div>
                  </div>
                )}

                {activePlatformData.platform === 'personal_site' && (
                  <div className="bg-neutral-950 text-white rounded-2xl overflow-hidden border border-neutral-800 shadow-xl">
                    <div className="bg-neutral-900 px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      </div>
                      <div className="bg-neutral-950 px-4 py-1 rounded-md text-[11px] text-neutral-400 font-mono w-2/3 text-center truncate border border-neutral-800">
                        https://ayushpaul.com
                      </div>
                      <div className="text-[10px] text-emerald-400 font-bold">HTTPS</div>
                    </div>
                    <div className="p-6 text-center space-y-4 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-500/30 inline-block">
                        Executive Authority System
                      </span>
                      <h3 className="text-xl font-black text-white leading-tight max-w-md mx-auto">
                        {activePlatformData.fields.find(f => f.key.includes('hero') || f.key.includes('headline'))?.value || 'High-Impact Consulting Strategy'}
                      </h3>
                      <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed bg-neutral-900/60 p-4 rounded-xl border border-neutral-800">
                        {activePlatformData.fields.find(f => f.key.includes('value') || f.key.includes('bio'))?.value || 'Engineering predictable client acquisition pipelines.'}
                      </p>
                      <div className="pt-2">
                        <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl shadow-lg shadow-indigo-600/20 cursor-pointer">
                          View Proof Assets &amp; Case Studies →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Sleek Interactive Copy Editor (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-neutral-400">
                  Positioning Claims Editor
                </span>
                <span className="text-xs text-neutral-500 font-medium">
                  {activePlatformData.fields.length} Strategy Fields
                </span>
              </div>

              {activePlatformData.fields.map((field) => {
                const isEditing = editingField === field.key;
                const charLimit = getCharLimit(activePlatformData.platform, field.key);
                const currentLength = isEditing ? editValue.length : field.value.length;
                const platformEnum = activePlatformData.platform as 'linkedin'|'twitter'|'personal_site';

                return (
                  <div
                    key={field.key}
                    className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl text-white space-y-3 transition-all hover:border-indigo-500/40"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                          <User size={14} />
                        </span>
                        <h4 className="text-sm font-black text-white">{field.label}</h4>
                        {field.isCustomized && (
                          <span className="text-[9px] font-black uppercase tracking-wider bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
                            Customized
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {charLimit && (
                          <span className={cn(
                            "text-[11px] font-mono font-bold",
                            currentLength > charLimit ? "text-red-400" : "text-neutral-500"
                          )}>
                            {currentLength} / {charLimit}
                          </span>
                        )}
                        {!isEditing && (
                          <button
                            onClick={() => handleEditStart(field.key, field.value)}
                            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-neutral-700"
                          >
                            <Pencil size={12} />
                            <span>Edit Field</span>
                          </button>
                        )}
                        {!isEditing && field.isCustomized && (
                          <button
                            onClick={() => resetProfileField(platformEnum, field.key)}
                            className="p-1.5 text-neutral-400 hover:text-amber-400 hover:bg-amber-950 rounded-xl transition-colors cursor-pointer"
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
                            "w-full text-xs text-white bg-neutral-950 border border-neutral-700 rounded-2xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y font-sans leading-relaxed shadow-inner",
                            charLimit && editValue.length > charLimit && "border-red-500/60 focus:ring-red-500/50"
                          )}
                        />
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={handleEditCancel}
                            className="px-4 py-2 text-xs font-bold text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleEditSave(platformEnum, field.key)}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-black bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-500 hover:to-blue-500 transition-all cursor-pointer shadow-md"
                          >
                            <CheckCircle2 size={14} />
                            Save &amp; Sync Live
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-neutral-300 bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800/80 leading-relaxed font-sans whitespace-pre-wrap">
                        {field.value}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-6 flex justify-end">
        <button
          onClick={onContinue}
          className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-7 py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg hover:shadow-indigo-500/20 flex items-center gap-2.5 cursor-pointer"
        >
          Profile Reviewed &amp; Confirmed — Continue to Section 3 →
        </button>
      </div>
    </div>
  );
});

ProfileStrategySection.displayName = 'ProfileStrategySection';
