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
import { useModule3Store } from '@/src/lib/module3/store';
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
import { ConsistencyAuditBadge } from '@/src/components/module3/step3/components/ConsistencyAuditBadge';

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

import { BrandIcons } from '@/src/components/module3/step3/brand/BrandIcons';

const PLATFORM_DEEP_LINKS: Record<string, { label: string; url: string }> = {
  linkedin: { label: 'Open LinkedIn Edit ↗', url: 'https://www.linkedin.com/in/me/overlay/edit/' },
  github: { label: 'Open GitHub Settings ↗', url: 'https://github.com/settings/profile' },
  twitter: { label: 'Open X Settings ↗', url: 'https://x.com/settings/profile' },
  youtube: { label: 'Open YouTube Studio ↗', url: 'https://studio.youtube.com/channel/editing/profile' },
  behance: { label: 'Open Behance Profile ↗', url: 'https://www.behance.net/' },
  figma: { label: 'Open Figma Settings ↗', url: 'https://www.figma.com/settings' },
  dribbble: { label: 'Open Dribbble Edit ↗', url: 'https://dribbble.com/account/general' },
  instagram: { label: 'Open Instagram Edit ↗', url: 'https://www.instagram.com/accounts/edit/' },
  technical_blog: { label: 'Open Substack ↗', url: 'https://substack.com/' },
  producthunt: { label: 'Open Product Hunt ↗', url: 'https://www.producthunt.com/my/profile' },
  tiktok: { label: 'Open TikTok Profile ↗', url: 'https://www.tiktok.com/' },
  vimeo_behance: { label: 'Open Vimeo / Behance ↗', url: 'https://vimeo.com/manage' },
  personal_site: { label: 'Copy Site HTML', url: '#' },
};

const ALL_PLATFORMS = [
  { key: 'linkedin', name: 'LinkedIn', icon: BrandIcons.LinkedIn, brandColor: 'bg-[#0a66c2]', iconColor: 'text-[#0A66C2]' },
  { key: 'twitter', name: 'X / Twitter', icon: BrandIcons.Twitter, brandColor: 'bg-black', iconColor: 'text-neutral-900' },
  { key: 'youtube', name: 'YouTube', icon: BrandIcons.YouTube, brandColor: 'bg-[#ff0000]', iconColor: 'text-[#FF0000]' },
  { key: 'instagram', name: 'Instagram', icon: BrandIcons.Instagram, brandColor: 'bg-[#e1306c]', iconColor: 'text-[#E4405F]' },
  { key: 'github', name: 'GitHub', icon: BrandIcons.GitHub, brandColor: 'bg-[#24292e]', iconColor: 'text-[#24292e]' },
  { key: 'behance', name: 'Behance', icon: BrandIcons.Behance, brandColor: 'bg-[#1769FF]', iconColor: 'text-[#1769FF]' },
  { key: 'figma', name: 'Figma', icon: BrandIcons.Figma, brandColor: 'bg-[#0ACF83]', iconColor: 'text-[#0ACF83]' },
  { key: 'dribbble', name: 'Dribbble', icon: BrandIcons.Dribbble, brandColor: 'bg-[#EA4C89]', iconColor: 'text-[#EA4C89]' },
  { key: 'personal_site', name: 'Personal Site', icon: BrandIcons.PersonalSite, brandColor: 'bg-[#0058be]', iconColor: 'text-[#0058be]' },
  { key: 'technical_blog', name: 'Substack / Dev.to', icon: BrandIcons.Substack, brandColor: 'bg-[#FF6719]', iconColor: 'text-[#FF6719]' },
  { key: 'producthunt', name: 'Product Hunt', icon: BrandIcons.ProductHunt, brandColor: 'bg-[#DA552F]', iconColor: 'text-[#DA552F]' },
  { key: 'tiktok', name: 'TikTok', icon: BrandIcons.TikTok, brandColor: 'bg-black', iconColor: 'text-neutral-900' },
  { key: 'vimeo_behance', name: 'Vimeo / Behance', icon: BrandIcons.Vimeo, brandColor: 'bg-[#1AB7EA]', iconColor: 'text-[#1AB7EA]' },
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

import { getChecklistForPlatform } from '@/src/lib/module3/platformChecklists';
import { COPY_FORMULAS, applyCopyFormula } from '@/src/lib/module3/copyFormulas';
import { CopyExportModal } from '@/src/components/module3/step3/export/CopyExportModal';

// â”€â”€ Helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€ Live OS Mockup Components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function LinkedInMockup({ userName, initials, headline, bio }: { userName: string; initials: string; headline: string; bio: string }) {
  return (
    <div className="h-full bg-[#f3f2ef] text-neutral-900 overflow-y-auto hide-scrollbar pb-10">
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
    <div className="h-full bg-black text-white p-5 space-y-3 overflow-y-auto hide-scrollbar pb-10">
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

function YouTubeMockup({ userName, userHandle, initials, headline, bio }: { userName: string; userHandle: string; initials: string; headline: string; bio: string }) {
  return (
    <div className="h-full w-full bg-[#0f0f0f] flex flex-col font-sans text-white pb-10 overflow-y-auto hide-scrollbar">
      {/* Banner */}
      <div className="h-[90px] bg-gradient-to-r from-red-900 via-neutral-900 to-black w-full" />
      
      {/* Profile Info */}
      <div className="px-4 flex flex-col items-center -mt-[36px]">
        {/* DP */}
        <div className="w-[72px] h-[72px] rounded-full border-2 border-[#0f0f0f] bg-neutral-800 flex items-center justify-center font-bold text-2xl text-neutral-400 shrink-0">
          {initials}
        </div>
        
        {/* Title & Stats */}
        <h2 className="text-[18px] font-bold mt-2 text-center leading-tight">{userName}</h2>
        <div className="text-[11px] text-neutral-400 mt-1 flex items-center justify-center gap-1">
          <span>@{userHandle || 'yourhandle'}</span>
          <span>·</span>
          <span>100K subscribers</span>
          <span>·</span>
          <span>120 videos</span>
        </div>
        
        {/* Bio preview */}
        <p className="text-[11px] text-neutral-300 mt-2 text-center line-clamp-2 px-2 leading-[1.3]">
          {headline || bio || 'Building predictable client acquisition pipelines.'}
        </p>
        
        <div className="flex items-center gap-1 mt-1.5 text-[11px] font-bold text-neutral-300">
          <span>linktr.ee/{userHandle || 'yourhandle'}</span>
          <span className="text-neutral-500 font-medium">and 2 more links</span>
        </div>

        {/* Subscribe Button */}
        <button className="w-full mt-4 bg-white text-black font-bold text-[13px] py-2 rounded-full hover:bg-neutral-200 transition-colors">
          Subscribe
        </button>
      </div>
      
      {/* Tabs */}
      <div className="flex items-center gap-6 px-4 mt-4 border-b border-neutral-800 text-[13px] font-medium text-neutral-400">
        <span className="text-white border-b-2 border-white pb-2">Home</span>
        <span className="pb-2">Videos</span>
        <span className="pb-2">Shorts</span>
        <span className="pb-2">Live</span>
      </div>
    </div>
  );
}

function PersonalSiteMockup({ userHandle, headline, bio }: { userHandle: string; headline: string; bio: string }) {
  return (
    <div className="h-full bg-neutral-950 text-white p-5 space-y-3 overflow-y-auto hide-scrollbar pb-10">
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

function InstagramMockup({ userName, userHandle, initials, headline, bio }: { userName: string; userHandle: string; initials: string; headline: string; bio: string }) {
  return (
    <div className="h-full w-full bg-white flex flex-col font-sans text-black pb-10 overflow-y-auto hide-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-[15px] tracking-tight">{userHandle || 'yourhandle'}</span>
          <ChevronDown size={14} className="text-neutral-500" />
        </div>
        <div className="flex items-center gap-4 text-black">
          {/* Menu icon placeholders */}
          <div className="w-[18px] h-[18px] flex flex-col justify-between items-end py-[2px]">
            <div className="w-[18px] h-[2px] bg-black rounded-full"></div>
            <div className="w-[18px] h-[2px] bg-black rounded-full"></div>
            <div className="w-[18px] h-[2px] bg-black rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center mb-2">
          <div className="relative shrink-0 mr-4">
            <div className="w-[64px] h-[64px] rounded-full p-[2.5px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]">
              <div className="w-full h-full rounded-full border-[2px] border-white bg-neutral-100 flex items-center justify-center text-[20px] font-medium text-neutral-400">
                {initials}
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-[18px] h-[18px] bg-[#0095f6] rounded-full border-[2px] border-white flex items-center justify-center text-white font-bold text-[12px] leading-none pb-[2px] pl-[1px]">
              +
            </div>
          </div>
          
          <div className="flex gap-1 text-center flex-1 justify-around">
            <div className="flex flex-col items-center">
              <span className="font-bold text-[13px] leading-none">124</span>
              <span className="text-[10px] text-neutral-800 leading-tight mt-[2px]">posts</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-[13px] leading-none">14.2K</span>
              <span className="text-[10px] text-neutral-800 leading-tight mt-[2px]">followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-[13px] leading-none">1,204</span>
              <span className="text-[10px] text-neutral-800 leading-tight mt-[2px]">following</span>
            </div>
          </div>
        </div>

        <div className="space-y-[1px] mt-1 pr-1">
          <h2 className="font-semibold text-[11px] text-black">{userName}</h2>
          <div className="text-neutral-500 text-[10px]">Entrepreneur</div>
          <p className="whitespace-pre-wrap text-[10px] leading-[1.25] text-black">{headline || bio || 'Building predictable client acquisition pipelines.'}</p>
          <div className="flex items-center gap-1 mt-1 text-[#00376b] font-semibold text-[10px]">
            <svg aria-label="Link icon" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="10" role="img" viewBox="0 0 24 24" width="10"><path d="M10.134 14.887a.75.75 0 0 1-1.06 1.06 6.012 6.012 0 0 1 0-8.502l3.414-3.414a6.013 6.013 0 0 1 8.502 8.502l-1.637 1.637a.75.75 0 1 1-1.06-1.06l1.637-1.637a4.512 4.512 0 1 0-6.381-6.381l-3.414 3.414a4.512 4.512 0 0 0 0 6.381Zm4.793-4.713a.75.75 0 0 1 1.06-1.06 6.012 6.012 0 0 1 0 8.502l-3.414 3.414a6.013 6.013 0 0 1-8.502-8.502l1.637-1.637a.75.75 0 1 1 1.06 1.06l-1.637 1.637a4.512 4.512 0 1 0 6.381 6.381l3.414-3.414a4.512 4.512 0 0 0 0-6.381Z"></path></svg>
            <span>linktr.ee/{userHandle || 'yourhandle'}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4 pt-2 flex gap-[6px]">
        <button className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-black font-semibold text-[13px] py-[6px] rounded-lg transition-colors tracking-wide">
          Edit profile
        </button>
        <button className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-black font-semibold text-[13px] py-[6px] rounded-lg transition-colors tracking-wide">
          Share profile
        </button>
        <button className="bg-neutral-100 hover:bg-neutral-200 text-black font-semibold py-[6px] px-[12px] rounded-lg transition-colors flex items-center justify-center">
          <User size={15} className="text-black" />
        </button>
      </div>
      
      {/* Highlights placeholder */}
      <div className="px-4 pb-4 flex gap-[14px] overflow-hidden">
        {[1,2,3,4,5].map(i => (
          <div className="flex flex-col items-center gap-1.5 shrink-0" key={`highlight-${i}`}>
            <div className="w-[62px] h-[62px] rounded-full border border-neutral-300 p-[2px]">
              <div className="w-full h-full bg-neutral-100 rounded-full"></div>
            </div>
            <span className="text-[11px] text-black tracking-tight">Highlight</span>
          </div>
        ))}
      </div>
      
      {/* Grid tabs */}
      <div className="flex border-t border-neutral-200">
        <div className="flex-1 flex justify-center py-[10px] border-t-[1.5px] border-black -mt-[1px] text-black">
          <svg aria-label="Posts" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><rect fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="3"></rect><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="9.015" x2="9.015" y1="3" y2="21"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="14.985" x2="14.985" y1="3" y2="21"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="9.015" y2="9.015"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="14.985" y2="14.985"></line></svg>
        </div>
        <div className="flex-1 flex justify-center py-[10px] text-neutral-400">
          <svg aria-label="Reels" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="2.049" x2="21.95" y1="7.002" y2="7.002"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="13.504" x2="16.362" y1="2.001" y2="7.002"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="7.207" x2="10.002" y1="2.11" y2="7.002"></line><path d="M2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.607 4.946 1.607h6.896c2.848 0 4.006-.699 4.946-1.607.908-.939 1.606-2.096 1.606-4.945V8.552c0-2.848-.698-4.006-1.606-4.945C19.454 2.699 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.546 2 5.704 2 8.552Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M9.763 17.664a.908.908 0 0 1-.454-.787V11.63a.909.909 0 0 1 1.364-.788l4.545 2.624a.909.909 0 0 1 0 1.575l-4.545 2.624a.91.91 0 0 1-.91 0Z" fillRule="evenodd"></path></svg>
        </div>
        <div className="flex-1 flex justify-center py-[10px] text-neutral-400">
           <svg aria-label="Tagged" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M10.201 3.797 12 1.997l1.799 1.8a1.59 1.59 0 0 0 1.124.465h5.259A1.818 1.818 0 0 1 22 6.08v14.104a1.818 1.818 0 0 1-1.818 1.818H3.818A1.818 1.818 0 0 1 2 20.184V6.08a1.818 1.818 0 0 1 1.818-1.818h5.26a1.59 1.59 0 0 0 1.123-.465Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M18.598 22.002V21.4a3.949 3.949 0 0 0-3.948-3.949H9.495A3.949 3.949 0 0 0 5.546 21.4v.603" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><circle cx="12.072" cy="11.075" fill="none" r="3.556" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle></svg>
        </div>
      </div>
      
      {/* Grid content placeholder */}
      <div className="grid grid-cols-3 gap-[2px] pb-[2px]">
        <div className="aspect-square bg-neutral-200"></div>
        <div className="aspect-square bg-neutral-200"></div>
        <div className="aspect-square bg-neutral-200"></div>
      </div>
    </div>
  );
}

function GenericMockup({ platformName, userName, initials, headline }: { platformName: string; userName: string; initials: string; headline: string }) {
  return (
    <div className="h-full bg-neutral-950 text-white p-5 space-y-3 overflow-y-auto hide-scrollbar pb-10">
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

function BehanceMockup({ userName, initials, headline, bio }: { userName: string; initials: string; headline: string; bio: string }) {
  return (
    <div className="h-full bg-white text-black p-5 space-y-4 overflow-y-auto hide-scrollbar pb-10">
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold text-xl tracking-tighter">Bēhance</div>
        <div className="w-6 h-6 rounded-full bg-neutral-200"></div>
      </div>
      <div className="flex flex-col items-center text-center space-y-3 pt-4">
        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-2xl shadow-sm">
          {initials}
        </div>
        <div>
          <h3 className="font-bold text-lg">{userName}</h3>
          <p className="text-[11px] text-neutral-500 mt-1">{headline}</p>
        </div>
        <button className="px-6 py-2 bg-blue-600 text-white font-bold text-[11px] rounded-full hover:bg-blue-700 transition-colors w-full max-w-[200px]">
          Follow
        </button>
      </div>
      <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 text-[11px] leading-relaxed text-neutral-700">
        {bio || 'Showcasing digital product design and scalable architectures.'}
      </div>
      <div className="pt-2">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-3">Projects</span>
        <div className="grid grid-cols-2 gap-2">
          <div className="aspect-[4/3] bg-neutral-200 rounded-lg"></div>
          <div className="aspect-[4/3] bg-neutral-200 rounded-lg"></div>
          <div className="aspect-[4/3] bg-neutral-200 rounded-lg"></div>
          <div className="aspect-[4/3] bg-neutral-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

// â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

  // Sequential flow: track current platform index within primary list
  const [currentPlatformIndex, setCurrentPlatformIndex] = useState(0);
  const [reviewedPlatforms, setReviewedPlatforms] = useState<Set<string>>(new Set());
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [showToneSelector, setShowToneSelector] = useState(false);
  const [viewingOptionalPlatform, setViewingOptionalPlatform] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const displayName = userName?.trim() || 'Your Name';
  const displayHandle = userHandle?.trim() || 'yourhandle';
  const initials = getInitials(userName?.trim() || 'YN');

  const mod1MarketId = useModule3Store(s => s.mod1MarketId);
  const mod1ServiceId = useModule3Store(s => s.mod1ServiceId);
  const mod2UniqueMechanism = useModule3Store(s => s.mod2UniqueMechanism);
  const mod1Positioning = useModule3Store(s => s.mod1Positioning);

  // Determine current active platform key
  const activeTab = viewingOptionalPlatform || (primaryPlatforms[currentPlatformIndex]?.key || 'linkedin');
  const isViewingOptional = !!viewingOptionalPlatform;

  const allPrimaryReviewed = primaryPlatforms.length > 0 && primaryPlatforms.every(p => reviewedPlatforms.has(p.key));

  // Helper for applying formulas
  const handleApplyFormula = (fieldKey: string, formulaId: string) => {
    const result = applyCopyFormula(formulaId, fieldKey, {
      market: (mod1MarketId || '').replace(/_/g, ' ') || 'clients',
      service: (mod1ServiceId || '').replace(/_/g, ' ') || 'systems',
      mechanism: mod2UniqueMechanism?.trim() || 'our proven methodology',
      positioning: mod1Positioning?.trim() || 'Specialist',
    });
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
  const currentPlatformMeta = ALL_PLATFORMS.find(p => p.key === activeTab);

  const handleMarkReviewed = () => {
    setReviewedPlatforms(prev => new Set([...prev, activeTab]));
    setEditingField(null);
    if (!isViewingOptional && currentPlatformIndex < primaryPlatforms.length - 1) {
      setCurrentPlatformIndex(currentPlatformIndex + 1);
    }
  };

  const handleGoToPlatform = (index: number) => {
    setViewingOptionalPlatform(null);
    setCurrentPlatformIndex(index);
    setEditingField(null);
  };

  const handleSelectPlatform = (key: string) => {
    const primaryIdx = primaryPlatforms.findIndex(p => p.key === key);
    if (primaryIdx !== -1) {
      setViewingOptionalPlatform(null);
      setCurrentPlatformIndex(primaryIdx);
    } else {
      setViewingOptionalPlatform(key);
    }
    setEditingField(null);
  };

  // â”€â”€ Render: Phone Mockup â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const renderMockup = () => (
    <div className="relative mx-auto w-[280px] bg-black rounded-[44px] p-2 shadow-2xl border-4 border-neutral-800">
      {/* Hardware buttons */}
      <div className="absolute top-20 -left-1.5 w-1 h-7 bg-neutral-800 rounded-l-md" />
      <div className="absolute top-32 -left-1.5 w-1 h-10 bg-neutral-800 rounded-l-md" />
      <div className="absolute top-44 -left-1.5 w-1 h-10 bg-neutral-800 rounded-l-md" />
      <div className="absolute top-32 -right-1.5 w-1 h-14 bg-neutral-800 rounded-r-md" />

      <div className="w-full h-full bg-neutral-100 rounded-[36px] overflow-hidden relative shadow-inner min-h-[480px] flex flex-col">
        {/* Dynamic Island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[90px] h-6 bg-black rounded-full z-20 flex items-center justify-between px-2">
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-800/80" />
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-900/50" />
        </div>

        {/* Status Bar */}
        <div className="flex justify-between items-center px-5 py-1.5 text-[10px] font-bold z-10 absolute top-0 w-full mix-blend-difference text-white/90">
          <span className="pl-1.5">9:41</span>
          <div className="flex gap-1 items-center pr-0.5">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21L23.6 7C22.2 5.5 17.6 2 12 2C6.4 2 1.8 5.5 0.4 7L12 21Z"/></svg>
            <div className="w-4 h-2 border border-current rounded-sm p-[1px] flex items-center">
              <div className="bg-current h-full w-[80%] rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* Screen Content */}
        <div className="h-full w-full pt-8 flex-1 overflow-y-auto hide-scrollbar bg-neutral-950 flex flex-col">
          {activeTab === 'linkedin' && <div className="h-full bg-neutral-100"><LinkedInMockup userName={displayName} initials={initials} headline={currentHeadline} bio={currentBio} /></div>}
          {activeTab === 'github' && <div className="h-full bg-neutral-950"><GitHubMockup userName={displayName} userHandle={displayHandle} initials={initials} headline={currentHeadline} /></div>}
          {activeTab === 'twitter' && <div className="h-full bg-white"><TwitterMockup userName={displayName} userHandle={displayHandle} initials={initials} headline={currentHeadline} /></div>}
          {activeTab === 'youtube' && <div className="h-full bg-[#0f0f0f]"><YouTubeMockup userName={displayName} userHandle={displayHandle} initials={initials} headline={currentHeadline} bio={currentBio} /></div>}
          {activeTab === 'instagram' && <div className="h-full bg-white"><InstagramMockup userName={displayName} userHandle={displayHandle} initials={initials} headline={currentHeadline} bio={currentBio} /></div>}
          {activeTab === 'personal_site' && <div className="h-full bg-neutral-950"><PersonalSiteMockup userHandle={displayHandle} headline={currentHeadline} bio={currentBio} /></div>}
          {activeTab === 'behance' && <div className="h-full bg-white"><BehanceMockup userName={displayName} initials={initials} headline={currentHeadline} bio={currentBio} /></div>}
          {!['linkedin', 'github', 'twitter', 'youtube', 'instagram', 'personal_site', 'behance'].includes(activeTab) && (
            <div className="h-full bg-neutral-100"><GenericMockup platformName={platformLabel} userName={displayName} initials={initials} headline={currentHeadline} /></div>
          )}
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/50 mix-blend-difference rounded-full z-20 mb-0.5" />
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-5 text-left font-sans">

      {/* ── Top: Unified Platform Channels Bar ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
        className="p-4 rounded-3xl border border-neutral-200 bg-white shadow-xs space-y-3.5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">Platform Channels</span>
            <span className="text-[10px] font-bold text-[#0058be] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              {reviewedPlatforms.size} of {primaryPlatforms.length} required reviewed
            </span>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {roleLabel}
          </span>
        </div>

        {/* Combined Platforms: Recommended First, then Other Channels */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Primary / Recommended Platforms */}
          {primaryPlatforms.map((p) => {
            const isReviewed = reviewedPlatforms.has(p.key);
            const isCurrent = activeTab === p.key;
            const Icon = p.icon;
            return (
              <button
                key={p.key}
                onClick={() => handleSelectPlatform(p.key)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-xs',
                  isCurrent
                    ? 'bg-[#0058be] text-white border-[#0058be] shadow-md scale-[1.02]'
                    : isReviewed
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300'
                )}
              >
                {isReviewed ? (
                  <Check size={13} strokeWidth={3} className="text-emerald-600 shrink-0" />
                ) : (
                  <span className={cn('shrink-0 flex items-center justify-center', isCurrent ? 'text-white' : p.iconColor)}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                )}
                <span>{p.name}</span>
                <span className={cn(
                  "text-[8px] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider",
                  isCurrent ? "bg-white/20 text-white" : "bg-blue-50 text-[#0058be] border border-blue-100"
                )}>
                  Recommended
                </span>
              </button>
            );
          })}

          {/* Divider between Recommended and Other platforms */}
          {secondaryPlatforms.length > 0 && (
            <div className="h-6 w-[1px] bg-neutral-200 mx-1 hidden sm:block" />
          )}

          {/* Secondary / Other Platforms */}
          {secondaryPlatforms.map(p => {
            const isReviewed = reviewedPlatforms.has(p.key);
            const isCurrent = activeTab === p.key;
            const Icon = p.icon;
            return (
              <button
                key={p.key}
                onClick={() => handleSelectPlatform(p.key)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs',
                  isCurrent
                    ? 'bg-[#0058be] text-white border-[#0058be] shadow-md scale-[1.02]'
                    : isReviewed
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-neutral-50/80 text-neutral-600 border-neutral-200 hover:bg-white hover:text-neutral-900 hover:border-neutral-300'
                )}
              >
                {isReviewed ? (
                  <Check size={12} strokeWidth={3} className="text-emerald-600 shrink-0" />
                ) : (
                  <span className={cn('shrink-0 flex items-center justify-center', isCurrent ? 'text-white' : p.iconColor)}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                )}
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="pt-1">
          <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#0058be] to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(reviewedPlatforms.size / Math.max(primaryPlatforms.length, 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: EASING.PREMIUM }}
            />
          </div>
        </div>
      </motion.div>

      {/* â”€â”€ Tone Selector (Collapsible) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.03 }}
      >
        <button
          onClick={() => setShowToneSelector(!showToneSelector)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-neutral-200 bg-white shadow-xs cursor-pointer hover:bg-neutral-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">Authority Tone:</span>
            <span className="text-xs font-bold text-[#0058be]">
              {TONES.find(t => t.key === activeTone)?.label || 'Executive'}
            </span>
          </div>
          <ChevronDown size={14} className={cn('text-neutral-400 transition-transform', showToneSelector && 'rotate-180')} />
        </button>

        <AnimatePresence>
          {showToneSelector && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-3 gap-2 pt-3 px-1">
                {TONES.map(tone => (
                  <button
                    key={tone.key}
                    onClick={() => { onToneChange(tone.key); setShowToneSelector(false); }}
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
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Current Platform Header ────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
          className="space-y-4"
        >
          {/* Platform title bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentPlatformMeta && (
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs', currentPlatformMeta.brandColor)}>
                  <currentPlatformMeta.icon className="w-5 h-5 text-white" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#0b1c30]">{platformLabel}</h3>
                  {!isViewingOptional && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#0058be] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-neutral-400">
                  {isViewingOptional ? 'Optional Channel' : `Platform ${currentPlatformIndex + 1} of ${primaryPlatforms.length}`}
                  {reviewedPlatforms.has(activeTab) && <span className="text-emerald-600 font-bold ml-1.5">✓ Reviewed</span>}
                </p>
              </div>
            </div>
            {deepLink && deepLink.url !== '#' && (
              <a
                href={deepLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold text-[#0058be] hover:underline flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-xl border border-neutral-200 shadow-xs"
              >
                <ExternalLink size={10} />
                {deepLink.label}
              </a>
            )}
          </div>

          {/* Cross-Platform Consistency Diagnostic */}
          <ConsistencyAuditBadge profileSystem={profileSystem} />

          {/* ── Split: Mockup (Left Sticky) + Editor (Right Scroll) ──── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left: Sticky Phone Mockup */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-4">
                {renderMockup()}
              </div>
            </div>

            {/* Right: Copy Editor & Verification Checklist */}
            <div className="lg:col-span-7 space-y-3.5 max-h-[520px] overflow-y-auto pr-1">
              {/* Field cards header */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
                  Copy Fields — {activePlatformData.fields.length} fields
                </span>
                <span className="text-[10px] font-bold text-neutral-500">
                  Click edit or use one-click formulas below
                </span>
              </div>

              {activePlatformData.fields.map(field => {
                const isEditing = editingField === field.key;
                const charLimitKey = `${activeTab}_${field.key}`;
                const charLimit = CHAR_LIMITS[charLimitKey];

                return (
                  <div
                    key={field.key}
                    className={cn(
                      'p-4 rounded-2xl border bg-white shadow-xs space-y-2.5 transition-all',
                      isEditing ? 'border-[#0058be]/40 ring-1 ring-[#0058be]/10' : 'border-neutral-200 hover:border-neutral-300'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#0b1c30]">{field.label}</h4>
                      <div className="flex items-center gap-1.5">
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
                          className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-lg transition-all cursor-pointer border border-neutral-200"
                          title="Copy"
                        >
                          {copiedField === field.key ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        </button>
                        {!isEditing && (
                          <button
                            onClick={() => handleEditStart(field.key, field.value)}
                            className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-lg transition-all cursor-pointer border border-neutral-200"
                            title="Edit"
                          >
                            <Pencil size={12} />
                          </button>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        {/* Inline formula toolbar */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mr-1">Formula:</span>
                          {COPY_FORMULAS.map(formula => (
                            <button
                              key={formula.id}
                              onClick={() => handleApplyFormula(field.key, formula.id)}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold rounded-lg border border-blue-200 transition-all cursor-pointer"
                              title={formula.description}
                            >
                              <Rocket size={9} className="inline mr-1" />
                              {formula.label}
                            </button>
                          ))}
                        </div>
                        <textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full text-xs text-[#0b1c30] bg-neutral-50 border border-neutral-300 rounded-xl p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:bg-white resize-y font-sans leading-relaxed"
                        />
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => setEditingField(null)}
                            className="px-3 py-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleEditSave(field.key)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-[#0058be] hover:bg-[#0048a0] text-white rounded-xl transition-all cursor-pointer shadow-xs"
                          >
                            <CheckCircle2 size={12} />
                            Save & Sync
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-neutral-700 bg-neutral-50 p-3 rounded-xl border border-neutral-200/80 leading-relaxed whitespace-pre-wrap">
                        {field.value}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Micro-Audit Checklist */}
              {(() => {
                const checklist = getChecklistForPlatform(activeTab);
                const completedCount = checklist.filter(item => checkedSteps[item.id]).length;
                return (
                  <div className="p-4 rounded-2xl border border-neutral-200 bg-white shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-extrabold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                        <CheckSquare size={13} className="text-emerald-500" />
                        {platformLabel} Launch Checklist
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                        {completedCount}/{checklist.length} Done
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {checklist.map((item) => {
                        const isChecked = !!checkedSteps[item.id];
                        return (
                          <label key={item.id} className="flex items-start gap-2.5 cursor-pointer group hover:bg-neutral-50 p-1.5 rounded-lg transition-colors">
                            <div className={cn(
                              "w-4 h-4 mt-0.5 rounded flex items-center justify-center border transition-colors shrink-0",
                              isChecked ? "bg-emerald-500 border-emerald-500" : "bg-white border-neutral-300 group-hover:border-emerald-400"
                            )}>
                              {isChecked && <Check size={10} className="text-white" />}
                            </div>
                            <input type="checkbox" className="hidden" checked={isChecked} onChange={() => toggleChecklist(item.id)} />
                            <div className="flex-1 flex items-center justify-between gap-2">
                              <span className={cn("text-xs font-medium transition-colors", isChecked ? "text-neutral-400 line-through" : "text-neutral-700")}>
                                {item.label}
                              </span>
                              <span className="text-[9px] uppercase font-bold text-neutral-400 shrink-0">
                                {item.category}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Mark as Reviewed + Nav */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  {(currentPlatformIndex > 0 || isViewingOptional) && (
                    <button
                      onClick={() => {
                        if (isViewingOptional) {
                          setViewingOptionalPlatform(null);
                        } else {
                          setCurrentPlatformIndex(Math.max(0, currentPlatformIndex - 1));
                        }
                        setEditingField(null);
                      }}
                      className="px-3 py-2 text-xs font-bold text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors"
                    >
                      ← Previous
                    </button>
                  )}
                </div>
                {!reviewedPlatforms.has(activeTab) ? (
                  <button
                    onClick={handleMarkReviewed}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    <CheckCircle2 size={14} />
                    Mark {platformLabel} as Reviewed
                  </button>
                ) : !isViewingOptional && currentPlatformIndex < primaryPlatforms.length - 1 ? (
                  <button
                    onClick={() => { setCurrentPlatformIndex(currentPlatformIndex + 1); setEditingField(null); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#0058be] hover:bg-[#0048a0] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    Next Platform →
                  </button>
                ) : isViewingOptional ? (
                  <button
                    onClick={() => { setViewingOptionalPlatform(null); setEditingField(null); }}
                    className="px-4 py-2 text-xs font-bold text-[#0058be] hover:underline cursor-pointer"
                  >
                    ← Back to Primary
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Bottom: Continue CTA (Gated) ─────────────────────────────── */}
      <div className="pt-4 border-t border-neutral-200/60">
        {allPrimaryReviewed ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Success banner */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle2 size={16} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900">All {primaryPlatforms.length} Primary Platforms Reviewed</p>
                <p className="text-[11px] text-emerald-700">Your profile copy is ready for the consistency check.</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {onBack && (
                  <button onClick={onBack} className="text-xs font-bold text-neutral-500 hover:text-neutral-900 cursor-pointer">
                    ← Back
                  </button>
                )}
                <button
                  onClick={handleExportAll}
                  className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-md cursor-pointer"
                >
                  {copiedField === 'export_all' ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  {copiedField === 'export_all' ? 'Bundle Copied!' : 'Export All Bios'}
                </button>
              </div>
              <ModuleButton variant="primary" onClick={onContinue}>
                Run Consistency Check →
              </ModuleButton>
            </div>
          </motion.div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <button onClick={onBack} className="text-xs font-bold text-neutral-500 hover:text-neutral-900 cursor-pointer">
                  â† Back
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-neutral-400 font-medium">
                Review all {primaryPlatforms.length} platforms to continue
              </span>
              <button
                disabled
                className="px-5 py-2.5 bg-neutral-200 text-neutral-400 text-xs font-bold rounded-xl cursor-not-allowed"
              >
                Run Consistency Check →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

PlatformStudioSection.displayName = 'PlatformStudioSection';

