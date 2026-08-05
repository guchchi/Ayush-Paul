import React, { useState } from 'react';
import { ProfileSystemAsset } from '../../../../data/module3/authority-suite-engine';
import { EditableAssetCard } from '../components/EditableAssetCard';
import { Linkedin, Twitter, Instagram, Globe, Sparkles, ShieldCheck, Copy, Check, ArrowRight, Layers } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  packages: ProfileSystemAsset[];
  onFieldChange?: (platform: string, fieldKey: string, newValue: string) => void;
  onFieldReset?: (platform: string, fieldKey: string) => void;
}

export const ProfileStructureCanvas = React.memo(function ProfileStructureCanvas({
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

  // Structural ordering layers for each platform
  const structureLayers = {
    linkedin: [
      { step: '01', title: 'Cover Banner Concept', role: 'Primary Hook & Category Claim', target: 'banner_text' },
      { step: '02', title: 'Professional Headline', role: 'Service Offer & Proof Anchor', target: 'headline' },
      { step: '03', title: 'About Section (Story & Proof)', role: 'Problem-Mechanism-Proof Narrative', target: 'about' },
      { step: '04', title: 'Featured Link CTA', role: 'Direct Conversion Pathway', target: 'featured_cta' },
      { step: '05', title: 'Services Description', role: 'Scope & Deliverable Clarification', target: 'services_desc' },
    ],
    twitter: [
      { step: '01', title: 'Display Name & Handle', role: 'Category & Niche Identity', target: 'name_format' },
      { step: '02', title: 'Bio Copy', role: 'Core Value Proposition & Proof Promise', target: 'bio' },
      { step: '03', title: '📌 Pinned Thread Hook', role: 'High-Ticket Teardown & Case Study', target: 'pinned_post' },
      { step: '04', title: 'Link CTA', role: 'Portfolio & Asset Vault Gateway', target: 'cta_link' },
    ],
    instagram: [
      { step: '01', title: 'Handle & Display Name', role: 'Positioning & Service Title', target: 'bio' },
      { step: '02', title: 'Bio Copy Layout', role: 'Bulletized Offer & Promise', target: 'bio' },
      { step: '03', title: 'Bio Link CTA', role: 'Direct Blueprint Access', target: 'cta' },
      { step: '04', title: 'Story Highlights Architecture', role: 'Categorized Proof & Wins', target: 'story_highlights' },
    ],
  };

  const activeStructure = structureLayers[activePlatform];

  return (
    <section className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-blue-400" />
            <h3 className="text-xl font-black tracking-tight">Public Profile Structural Architecture</h3>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Configure the strategic element sequence for your LinkedIn, X/Twitter, and Instagram profiles.
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
            <Linkedin size={14} /> LinkedIn Structure
          </button>
          <button
            onClick={() => setActivePlatform('twitter')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activePlatform === 'twitter' ? 'bg-black text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Twitter size={14} /> X / Twitter Structure
          </button>
          <button
            onClick={() => setActivePlatform('instagram')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activePlatform === 'instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Instagram size={14} /> Instagram Structure
          </button>
        </div>
      </div>

      {/* Structural Order Map Cards */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-blue-600" />
            <h4 className="text-sm font-black text-[#0b1c30] uppercase tracking-wider">
              {activePlatform.toUpperCase()} Profile Component Hierarchy
            </h4>
          </div>
          <span className="text-xs font-bold text-neutral-500">Ordered for Prospect Conversion</span>
        </div>

        {/* Structural Sequence Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeStructure.map((item) => (
            <div
              key={item.step}
              className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0058be] text-[11px] font-black flex items-center justify-center">
                    {item.step}
                  </span>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                    {item.role}
                  </span>
                </div>
                <h5 className="text-xs font-black text-[#0b1c30] pt-1">{item.title}</h5>
              </div>

              <div className="text-[11px] font-medium text-neutral-700 bg-white p-2.5 rounded-xl border border-neutral-200/60 line-clamp-3">
                {getFieldValue(item.target) || 'Configured in authority engine'}
              </div>
            </div>
          ))}
        </div>

        {/* Standard Asset Fields Grid */}
        <div className="space-y-3 pt-4 border-t border-neutral-100">
          <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400">
            Edit Component Copy Specs
          </h4>
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
      </div>
    </section>
  );
});
