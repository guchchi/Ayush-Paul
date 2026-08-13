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
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
            Interactive Live Preview
          </span>
          <span className="text-xs text-neutral-400">Edits update in real-time</span>
        </div>
        <h2 className="text-xl font-semibold text-neutral-900">
          Section 2 — Profile Identity & Live Visual Mockup
        </h2>
        <p className="text-sm text-neutral-600">
          Review and customize your profile copy with real-time visual mockups for LinkedIn, X (Twitter), and your Personal Portfolio Site.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {platforms.map((p) => (
          <button
            key={p.platform}
            onClick={() => {
              setActiveTab(p.platform);
              setEditingField(null);
            }}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2",
              activeTab === p.platform
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
            )}
          >
            {formatPlatformName(p.platform)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activePlatformData && (
          <motion.div
            key={activePlatformData.platform}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Col: Live Visual Profile Card Preview (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Live Platform Preview
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  ● Real-time Sync
                </span>
              </div>

              <div className="bg-neutral-900 rounded-2xl p-4 shadow-xl border border-neutral-800 text-white">
                {activePlatformData.platform === 'linkedin' && (
                  <div className="bg-white rounded-xl overflow-hidden text-neutral-900 shadow-md">
                    {/* Banner */}
                    <div className="h-24 bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 relative">
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
                    </div>
                    {/* Header Body */}
                    <div className="p-4 pt-0 relative">
                      <div className="w-16 h-16 rounded-full border-4 border-white bg-neutral-800 text-white flex items-center justify-center font-bold text-xl -mt-8 shadow-sm">
                        AP
                      </div>
                      <div className="mt-2">
                        <h3 className="font-bold text-base text-neutral-900 flex items-center gap-1.5">
                          Ayush Paul
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title="Online" />
                        </h3>
                        <p className="text-xs font-medium text-indigo-700 mt-1 leading-snug">
                          {activePlatformData.fields.find(f => f.key.includes('headline'))?.value || 'Authority Consultant & Specialist'}
                        </p>
                        <p className="text-[11px] text-neutral-500 mt-1">San Francisco Bay Area • Contact info</p>
                        <div className="flex items-center gap-2 mt-3">
                          <button className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">
                            Open to work
                          </button>
                          <button className="px-3 py-1 border border-indigo-600 text-indigo-600 text-xs font-bold rounded-full">
                            More
                          </button>
                        </div>
                      </div>

                      {/* About snippet */}
                      <div className="mt-4 pt-3 border-t border-neutral-100">
                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">About</span>
                        <p className="text-xs text-neutral-700 leading-relaxed line-clamp-4 italic">
                          "{activePlatformData.fields.find(f => f.key.includes('about') || f.key.includes('bio'))?.value || 'Specialized authority position strategy.'}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activePlatformData.platform === 'twitter' && (
                  <div className="bg-black text-white rounded-xl overflow-hidden border border-neutral-800 shadow-md">
                    <div className="h-20 bg-neutral-800 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-indigo-900 opacity-60" />
                    </div>
                    <div className="p-4 pt-0 relative">
                      <div className="flex justify-between items-start -mt-7 mb-2">
                        <div className="w-14 h-14 rounded-full border-4 border-black bg-neutral-700 text-white flex items-center justify-center font-bold text-lg">
                          AP
                        </div>
                        <button className="px-4 py-1.5 bg-white text-black font-bold text-xs rounded-full mt-8">
                          Follow
                        </button>
                      </div>
                      <h3 className="font-bold text-base text-white">Ayush Paul</h3>
                      <p className="text-xs text-neutral-400">@ayushpaul</p>
                      <p className="text-xs text-neutral-200 mt-2 leading-relaxed">
                        {activePlatformData.fields.find(f => f.key.includes('bio') || f.key.includes('headline'))?.value || 'Building high-ticket consulting authority systems.'}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-neutral-400">
                        <span><strong className="text-white">1,420</strong> Following</span>
                        <span><strong className="text-white">8,910</strong> Followers</span>
                      </div>
                    </div>
                  </div>
                )}

                {activePlatformData.platform === 'personal_site' && (
                  <div className="bg-neutral-950 text-white rounded-xl overflow-hidden border border-neutral-800 shadow-md">
                    {/* Web browser bar */}
                    <div className="bg-neutral-900 px-3 py-2 border-b border-neutral-800 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      </div>
                      <div className="bg-neutral-950 px-3 py-0.5 rounded text-[10px] text-neutral-400 font-mono mx-auto w-3/4 text-center truncate">
                        https://ayushpaul.com
                      </div>
                    </div>
                    {/* Hero preview */}
                    <div className="p-5 text-center space-y-3 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-500/30">
                        Executive Authority System
                      </span>
                      <h3 className="text-base font-black text-white leading-tight">
                        {activePlatformData.fields.find(f => f.key.includes('hero') || f.key.includes('headline'))?.value || 'High-Impact Consulting Strategy'}
                      </h3>
                      <p className="text-xs text-neutral-300 max-w-xs mx-auto leading-relaxed">
                        {activePlatformData.fields.find(f => f.key.includes('value') || f.key.includes('bio'))?.value || 'Engineering predictable client acquisition pipelines.'}
                      </p>
                      <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm">
                        View Proof Assets & Case Studies →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Editable Fields Editor (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {activePlatformData.fields.map((field) => {
                const isEditing = editingField === field.key;
                const charLimit = getCharLimit(activePlatformData.platform, field.key);
                const currentLength = isEditing ? editValue.length : field.value.length;
                const platformEnum = activePlatformData.platform as 'linkedin'|'twitter'|'personal_site';

                return (
                  <div key={field.key} className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs hover:border-indigo-200 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-500" />
                        <h4 className="text-sm font-semibold text-neutral-900">{field.label}</h4>
                        {field.isCustomized && (
                          <span className="text-[10px] font-medium uppercase tracking-wider bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                            Customized
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {charLimit && (
                          <span className={cn(
                            "text-xs font-medium",
                            currentLength > charLimit ? "text-red-500" : "text-neutral-400"
                          )}>
                            {currentLength} / {charLimit}
                          </span>
                        )}
                        {!isEditing && (
                          <button
                            onClick={() => handleEditStart(field.key, field.value)}
                            className="p-1.5 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                            title="Edit field"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        {!isEditing && field.isCustomized && (
                          <button
                            onClick={() => resetProfileField(platformEnum, field.key)}
                            className="p-1.5 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                            title="Reset to original AI generation"
                          >
                            <RotateCcw className="w-4 h-4" />
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
                            "w-full text-sm text-neutral-800 bg-neutral-50 border border-neutral-300 rounded-lg p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y font-sans leading-relaxed",
                            charLimit && editValue.length > charLimit && "border-red-300 focus:ring-red-500/50"
                          )}
                        />
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={handleEditCancel}
                            className="px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleEditSave(platformEnum, field.key)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Save & Sync Live
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed">
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

      <div className="pt-4 flex justify-end">
        <button
          onClick={onContinue}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-xs flex items-center gap-2 cursor-pointer"
        >
          Profile Reviewed & Confirmed — Continue to Section 3 →
        </button>
      </div>
    </div>
  );
});

ProfileStrategySection.displayName = 'ProfileStrategySection';
