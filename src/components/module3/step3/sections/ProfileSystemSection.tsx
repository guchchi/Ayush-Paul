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
  const [activePlatform, setActivePlatform] = useState<'linkedin' | 'twitter' | 'instagram'>('linkedin');
  const [copiedLink, setCopiedLink] = useState(false);

  const currentPackage = packages.find((p) => p.platform === activePlatform) || packages[0];

  const getFieldValue = (key: string) => {
    const field = currentPackage?.fields.find((f) => f.key === key);
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
            Realistic visual device previews & copy packages for LinkedIn, X/Twitter, and Instagram.
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
        </div>
      </div>

      {/* Visual Device Frame Preview Component */}
      <div className="bg-neutral-50 rounded-3xl p-6 border border-neutral-200/90 shadow-2xs space-y-6">
        {/* Device Canvas Frame */}
        {activePlatform === 'linkedin' && (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden text-left space-y-4">
            {/* LinkedIn Cover Banner Preview */}
            <div className="h-32 sm:h-40 bg-gradient-to-r from-blue-950 via-[#0077b5] to-indigo-950 p-4 sm:p-6 flex items-center justify-between text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="relative z-10 space-y-1 max-w-xl">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20 inline-block mb-1">
                  OFFICIAL LINKEDIN BANNER
                </span>
                <p className="text-sm sm:text-base font-black tracking-tight leading-snug line-clamp-2">
                  {getFieldValue('banner_text')}
                </p>
              </div>
              <span className="relative z-10 text-[10px] font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 shrink-0 hidden sm:inline-block">
                1584 x 396 px
              </span>
            </div>

            {/* Avatar & Main Copy Area */}
            <div className="p-5 sm:p-6 space-y-5 pt-0 -mt-12 sm:-mt-14 relative z-10">
              <div className="flex items-end justify-between">
                <div className="relative">
                  <div className="w-22 h-22 sm:w-26 sm:h-26 rounded-full bg-gradient-to-tr from-blue-600 via-[#0077b5] to-indigo-600 border-4 border-white shadow-lg flex items-center justify-center text-white text-2xl sm:text-3xl font-black shrink-0">
                    AP
                  </div>
                  <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full" title="Active Now" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-200 hidden sm:inline-block">
                    500+ Connections
                  </span>
                  <button
                    onClick={() => handleCopyField(getFieldValue('headline'))}
                    className="px-4 py-2 bg-[#0077b5] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    {copiedLink ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedLink ? 'Copied!' : 'Copy Headline'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-xl font-black text-[#0b1c30]">Ayush Paul</h4>
                  <span className="px-2 py-0.5 bg-blue-50 text-[#0077b5] text-[10px] font-black rounded-full border border-blue-100 uppercase tracking-wider">
                    VERIFIED AUTHORITY
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-neutral-800 leading-relaxed bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-neutral-50 p-4 rounded-2xl border border-blue-100/90 shadow-2xs">
                  {getFieldValue('headline')}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  <span>About Section</span>
                  <span className="text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => handleCopyField(getFieldValue('about'))}>Copy About Copy</span>
                </div>
                <p className="text-xs text-neutral-700 font-medium whitespace-pre-line bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 leading-relaxed">
                  {getFieldValue('about')}
                </p>
              </div>

              {getFieldValue('featured_cta') && (
                <div className="p-3.5 bg-blue-900/5 rounded-2xl border border-blue-200/60 flex items-center justify-between text-xs font-bold text-[#0077b5]">
                  <span className="truncate pr-2">{getFieldValue('featured_cta')}</span>
                  <Globe size={14} className="shrink-0 text-[#0077b5]" />
                </div>
              )}
            </div>
          </div>
        )}

        {activePlatform === 'twitter' && (
          <div className="bg-neutral-950 text-white rounded-2xl border border-neutral-800 p-6 shadow-md space-y-5 text-left relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-black text-white text-lg ring-2 ring-neutral-800">
                  AP
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-black text-white">{getFieldValue('name_format')}</h4>
                    <ShieldCheck size={15} className="text-blue-400 fill-blue-400/20" />
                  </div>
                  <span className="text-xs text-neutral-400">@ayushpaul • 12.4K Followers</span>
                </div>
              </div>
              <Twitter size={20} className="text-blue-400" />
            </div>

            <div className="space-y-3">
              <p className="text-xs sm:text-sm font-semibold text-neutral-200 leading-relaxed bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800/80">
                {getFieldValue('bio')}
              </p>

              {getFieldValue('cta_link') && (
                <div className="flex items-center gap-1.5 text-xs text-blue-400 font-bold">
                  <Globe size={13} />
                  <span>{getFieldValue('cta_link')}</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-neutral-900/90 rounded-2xl border border-neutral-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider flex items-center gap-1">
                  📌 PINNED THREAD HOOK
                </span>
                <span className="text-[10px] text-neutral-500 font-medium">Auto-synced</span>
              </div>
              <p className="text-xs text-neutral-200 font-medium leading-relaxed bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                {getFieldValue('pinned_post')}
              </p>
            </div>
          </div>
        )}

        {activePlatform === 'instagram' && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-5 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-0.5 shrink-0 shadow-xs">
                  <div className="w-full h-full rounded-full bg-white p-0.5">
                    <div className="w-full h-full rounded-full bg-neutral-950 text-white flex items-center justify-center font-black text-lg">
                      AP
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-[#0b1c30]">ayushpaul_authority</h4>
                    <span className="w-2 h-2 rounded-full bg-pink-500" />
                  </div>
                  <span className="text-xs font-bold text-neutral-500">High-Ticket Service Architect</span>
                  <div className="flex items-center gap-3 text-xs font-semibold text-neutral-600 mt-1">
                    <span><b>142</b> posts</span>
                    <span><b>18.5K</b> followers</span>
                    <span><b>420</b> following</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-neutral-800 font-semibold whitespace-pre-line leading-relaxed bg-gradient-to-br from-pink-50/50 via-purple-50/30 to-white p-4 rounded-2xl border border-pink-100">
                {getFieldValue('bio')}
              </p>

              {getFieldValue('cta') && (
                <div className="p-3 bg-pink-500/10 rounded-xl border border-pink-200/60 text-xs font-bold text-pink-700 flex items-center gap-2">
                  <Globe size={14} className="text-pink-600" />
                  <span>{getFieldValue('cta')}</span>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Story Highlights Concept</span>
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80 text-xs text-neutral-700 font-medium">
                {getFieldValue('story_highlights')}
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
