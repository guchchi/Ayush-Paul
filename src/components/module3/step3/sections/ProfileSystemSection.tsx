import React, { useState } from 'react';
import { ProfileSystemAsset } from '../../../../data/module3/authority-suite-engine';
import { EditableAssetCard } from '../components/EditableAssetCard';
import { Linkedin, Twitter, Instagram, Globe, Sparkles } from 'lucide-react';

interface Props {
  packages: ProfileSystemAsset[];
  onFieldChange?: (platform: string, fieldKey: string, newValue: string) => void;
  onFieldReset?: (platform: string, fieldKey: string) => void;
}

export const ProfileSystemSection = React.memo(function ProfileSystemSection({
  packages,
  onFieldChange,
  onFieldReset,
}: Props) {
  const [activePlatform, setActivePlatform] = useState<'linkedin' | 'twitter' | 'instagram' | 'website'>('linkedin');

  const currentPackage = packages.find((p) => p.platform === activePlatform) || packages[0];

  return (
    <section className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-blue-400" />
            <h3 className="text-xl font-black tracking-tight">2. Complete Multi-Platform Profile System</h3>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Live interactive mockups & copy packages for LinkedIn, X/Twitter, Instagram, and Website Hero.
          </p>
        </div>

        {/* Platform Tabs Selector */}
        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-2xl border border-white/10 shrink-0">
          <button
            onClick={() => setActivePlatform('linkedin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activePlatform === 'linkedin' ? 'bg-[#0077b5] text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Linkedin size={14} /> LinkedIn
          </button>
          <button
            onClick={() => setActivePlatform('twitter')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activePlatform === 'twitter' ? 'bg-black text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Twitter size={14} /> X / Twitter
          </button>
          <button
            onClick={() => setActivePlatform('instagram')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activePlatform === 'instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Instagram size={14} /> Instagram
          </button>
          <button
            onClick={() => setActivePlatform('website')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activePlatform === 'website' ? 'bg-[#0058be] text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Globe size={14} /> Web Hero
          </button>
        </div>
      </div>

      {/* Active Platform Mockup Card View */}
      <div className="bg-neutral-50 rounded-3xl p-6 border border-neutral-200/90 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-2">
            {activePlatform === 'linkedin' && <Linkedin className="text-[#0077b5]" size={20} />}
            {activePlatform === 'twitter' && <Twitter className="text-black" size={20} />}
            {activePlatform === 'instagram' && <Instagram className="text-pink-600" size={20} />}
            {activePlatform === 'website' && <Globe className="text-[#0058be]" size={20} />}
            <h4 className="text-lg font-black text-[#0b1c30]">{currentPackage.title}</h4>
          </div>
          <span className="text-xs font-bold text-neutral-500 bg-white px-3 py-1 rounded-full border border-neutral-200">
            {currentPackage.fields.length} Configured Fields
          </span>
        </div>

        {/* Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentPackage.fields.map((field) => (
            <EditableAssetCard
              key={field.key}
              id={`${activePlatform}_${field.key}`}
              title={field.label}
              category={activePlatform.toUpperCase()}
              value={field.value}
              originalValue={field.originalValue}
              multiline={field.value.length > 80}
              onSave={(val) => onFieldChange && onFieldChange(activePlatform, field.key, val)}
              onReset={() => onFieldReset && onFieldReset(activePlatform, field.key)}
            />
          ))}
        </div>
      </div>
    </section>
  );
});
