import React, { useState } from 'react';
import { ProfileSystemAsset } from '../../../../data/module3/authority-suite-engine';
import { EditableAssetCard } from '../components/EditableAssetCard';
import { Linkedin, Twitter, Instagram, Globe, Sparkles, CheckCircle2, ShieldCheck, Copy, Check } from 'lucide-react';

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
  const [copiedLink, setCopiedLink] = useState(false);

  const currentPackage = packages.find((p) => p.platform === activePlatform) || packages[0];

  const getFieldValue = (key: string) => {
    const field = currentPackage.fields.find((f) => f.key === key);
    return field ? field.value : '';
  };

  const handleCopyField = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-blue-400" />
            <h3 className="text-xl font-black tracking-tight">2. Visual Multi-Platform Profile System</h3>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Realistic visual device previews & copy packages for LinkedIn, X/Twitter, Instagram, and Website Hero.
          </p>
        </div>

        {/* Platform Tabs Selector */}
        <div className="flex items-center gap-1 bg-white/10 p-1.5 rounded-2xl border border-white/10 shrink-0 overflow-x-auto">
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

      {/* Visual Device Frame Preview Component */}
      <div className="bg-neutral-50 rounded-3xl p-6 border border-neutral-200/90 shadow-2xs space-y-6">
        {/* Device Canvas Frame */}
        {activePlatform === 'linkedin' && (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden text-left space-y-4">
            {/* LinkedIn Cover Banner Preview */}
            <div className="h-28 sm:h-36 bg-gradient-to-r from-blue-900 via-[#0077b5] to-indigo-900 p-4 sm:p-6 flex items-center justify-between text-white relative">
              <span className="text-xs sm:text-sm font-black tracking-wide max-w-xl line-clamp-2">
                {getFieldValue('banner_text')}
              </span>
              <span className="text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-full border border-white/30 shrink-0">
                LinkedIn Banner
              </span>
            </div>

            {/* Avatar & Main Copy Area */}
            <div className="p-5 sm:p-6 space-y-4 pt-0 -mt-10 sm:-mt-12">
              <div className="flex items-end justify-between">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border-4 border-white shadow-md flex items-center justify-center text-white text-2xl font-black shrink-0">
                  AP
                </div>
                <button
                  onClick={() => handleCopyField(getFieldValue('headline'))}
                  className="px-3.5 py-1.5 bg-[#0077b5] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  {copiedLink ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedLink ? 'Copied Headline!' : 'Copy Headline'}</span>
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-black text-[#0b1c30]">Ayush Paul</h4>
                <p className="text-xs sm:text-sm font-bold text-neutral-800 leading-relaxed bg-blue-50/50 p-3 rounded-xl border border-blue-100/80">
                  {getFieldValue('headline')}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">About Section</span>
                <p className="text-xs text-neutral-700 font-medium whitespace-pre-line bg-neutral-50 p-3 rounded-xl border border-neutral-100 leading-relaxed">
                  {getFieldValue('about')}
                </p>
              </div>
            </div>
          </div>
        )}

        {activePlatform === 'twitter' && (
          <div className="bg-neutral-950 text-white rounded-2xl border border-neutral-800 p-6 shadow-sm space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center font-black text-white text-lg">
                  AP
                </div>
                <div>
                  <h4 className="text-sm font-black">{getFieldValue('name_format')}</h4>
                  <span className="text-xs text-neutral-400">@ayushpaul</span>
                </div>
              </div>
              <Twitter size={20} className="text-blue-400" />
            </div>

            <p className="text-xs sm:text-sm font-semibold text-neutral-200 leading-relaxed">
              {getFieldValue('bio')}
            </p>

            <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 space-y-2">
              <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider block">📌 Pinned Thread Hook</span>
              <p className="text-xs text-neutral-300 font-medium">{getFieldValue('pinned_post')}</p>
            </div>
          </div>
        )}

        {activePlatform === 'instagram' && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-4 text-left">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-0.5 shrink-0">
                <div className="w-full h-full rounded-full bg-white p-0.5">
                  <div className="w-full h-full rounded-full bg-neutral-900 text-white flex items-center justify-center font-black text-sm">
                    AP
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-black text-[#0b1c30]">ayushpaul_authority</h4>
                <span className="text-xs font-bold text-neutral-500">High-Ticket Service Architect</span>
              </div>
            </div>

            <p className="text-xs text-neutral-800 font-semibold whitespace-pre-line leading-relaxed bg-pink-50/40 p-3 rounded-xl border border-pink-100">
              {getFieldValue('bio')}
            </p>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Story Highlights Concept</span>
              <p className="text-xs text-neutral-700 font-medium bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                {getFieldValue('story_highlights')}
              </p>
            </div>
          </div>
        )}

        {activePlatform === 'website' && (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden text-left">
            {/* Safari Window Header Bar */}
            <div className="bg-neutral-100 px-4 py-2 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[11px] font-bold text-neutral-500 bg-white px-4 py-0.5 rounded-md border border-neutral-200">
                ayushpaul.app/blueprint
              </span>
              <Globe size={14} className="text-neutral-400" />
            </div>

            {/* Safari Canvas Body */}
            <div className="p-6 sm:p-8 space-y-4 bg-gradient-to-b from-blue-50/50 to-white">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0058be] bg-blue-100/80 px-2.5 py-1 rounded-full border border-blue-200">
                {getFieldValue('trust_statement')}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0b1c30] tracking-tight leading-tight">
                {getFieldValue('hero_headline')}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-neutral-600 leading-relaxed max-w-xl">
                {getFieldValue('hero_subheadline')}
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button className="px-5 py-2.5 bg-[#0058be] text-white rounded-xl text-xs font-black shadow-xs">
                  {getFieldValue('primary_cta')}
                </button>
                <span className="text-[11px] font-bold text-neutral-500">{getFieldValue('social_proof_line')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Standard Copy Fields Grid */}
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
