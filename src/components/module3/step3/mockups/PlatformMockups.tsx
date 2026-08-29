/**
 * Platform Mockup Components — Extracted from PlatformStudioSection
 * 
 * Live OS-accurate profile mockups for LinkedIn, Twitter/X, GitHub,
 * YouTube, Instagram, Behance, Personal Site, and a generic fallback.
 * 
 * Shared prop interface + getMockupForPlatform() selector.
 */

import React from 'react';
import {
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Pin,
  ChevronDown,
  User,
} from 'lucide-react';

// ── Shared Prop Types ─────────────────────────────────────────────────────────

export interface MockupProps {
  userName: string;
  userHandle: string;
  initials: string;
  headline: string;
  bio: string;
}

// ── Utility ───────────────────────────────────────────────────────────────────

export function getInitials(name: string): string {
  if (!name) return 'AP';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ── LinkedIn ──────────────────────────────────────────────────────────────────

export function LinkedInMockup({ userName, initials, headline, bio }: Omit<MockupProps, 'userHandle'>) {
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

// ── GitHub ─────────────────────────────────────────────────────────────────────

export function GitHubMockup({ userName, userHandle, initials, headline }: Omit<MockupProps, 'bio'>) {
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

// ── Twitter / X ───────────────────────────────────────────────────────────────

export function TwitterMockup({ userName, userHandle, initials, headline }: Omit<MockupProps, 'bio'>) {
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

// ── YouTube ───────────────────────────────────────────────────────────────────

export function YouTubeMockup({ userName, userHandle, initials, headline, bio }: MockupProps) {
  return (
    <div className="h-full w-full bg-[#0f0f0f] flex flex-col font-sans text-white pb-10 overflow-y-auto hide-scrollbar">
      <div className="h-[90px] bg-gradient-to-r from-red-900 via-neutral-900 to-black w-full" />
      <div className="px-4 flex flex-col items-center -mt-[36px]">
        <div className="w-[72px] h-[72px] rounded-full border-2 border-[#0f0f0f] bg-neutral-800 flex items-center justify-center font-bold text-2xl text-neutral-400 shrink-0">
          {initials}
        </div>
        <h2 className="text-[18px] font-bold mt-2 text-center leading-tight">{userName}</h2>
        <div className="text-[11px] text-neutral-400 mt-1 flex items-center justify-center gap-1">
          <span>@{userHandle || 'yourhandle'}</span>
          <span>·</span>
          <span>100K subscribers</span>
          <span>·</span>
          <span>120 videos</span>
        </div>
        <p className="text-[11px] text-neutral-300 mt-2 text-center line-clamp-2 px-2 leading-[1.3]">
          {headline || bio || 'Building predictable client acquisition pipelines.'}
        </p>
        <div className="flex items-center gap-1 mt-1.5 text-[11px] font-bold text-neutral-300">
          <span>linktr.ee/{userHandle || 'yourhandle'}</span>
          <span className="text-neutral-500 font-medium">and 2 more links</span>
        </div>
        <button className="w-full mt-4 bg-white text-black font-bold text-[13px] py-2 rounded-full hover:bg-neutral-200 transition-colors">
          Subscribe
        </button>
      </div>
      <div className="flex items-center gap-6 px-4 mt-4 border-b border-neutral-800 text-[13px] font-medium text-neutral-400">
        <span className="text-white border-b-2 border-white pb-2">Home</span>
        <span className="pb-2">Videos</span>
        <span className="pb-2">Shorts</span>
        <span className="pb-2">Live</span>
      </div>
    </div>
  );
}

// ── Personal Site ─────────────────────────────────────────────────────────────

export function PersonalSiteMockup({ userHandle, headline, bio }: Pick<MockupProps, 'userHandle' | 'headline' | 'bio'>) {
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

// ── Instagram ─────────────────────────────────────────────────────────────────

export function InstagramMockup({ userName, userHandle, initials, headline, bio }: MockupProps) {
  return (
    <div className="h-full w-full bg-white flex flex-col font-sans text-black pb-10 overflow-y-auto hide-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-[15px] tracking-tight">{userHandle || 'yourhandle'}</span>
          <ChevronDown size={14} className="text-neutral-500" />
        </div>
        <div className="flex items-center gap-4 text-black">
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
            <svg aria-label="Link icon" fill="currentColor" height="10" role="img" viewBox="0 0 24 24" width="10"><path d="M10.134 14.887a.75.75 0 0 1-1.06 1.06 6.012 6.012 0 0 1 0-8.502l3.414-3.414a6.013 6.013 0 0 1 8.502 8.502l-1.637 1.637a.75.75 0 1 1-1.06-1.06l1.637-1.637a4.512 4.512 0 1 0-6.381-6.381l-3.414 3.414a4.512 4.512 0 0 0 0 6.381Zm4.793-4.713a.75.75 0 0 1 1.06-1.06 6.012 6.012 0 0 1 0 8.502l-3.414 3.414a6.013 6.013 0 0 1-8.502-8.502l1.637-1.637a.75.75 0 1 1 1.06 1.06l-1.637 1.637a4.512 4.512 0 1 0 6.381 6.381l3.414-3.414a4.512 4.512 0 0 0 0-6.381Z"></path></svg>
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

// ── Behance ───────────────────────────────────────────────────────────────────

export function BehanceMockup({ userName, initials, headline, bio }: Omit<MockupProps, 'userHandle'>) {
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

// ── Generic Fallback ──────────────────────────────────────────────────────────

export function GenericMockup({ platformName, userName, initials, headline }: { platformName: string; userName: string; initials: string; headline: string }) {
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

// ── Selector ──────────────────────────────────────────────────────────────────

export function getMockupForPlatform(
  platformKey: string,
  props: MockupProps
): React.ReactElement {
  const { userName, userHandle, initials, headline, bio } = props;
  
  switch (platformKey) {
    case 'linkedin':
      return <LinkedInMockup userName={userName} initials={initials} headline={headline} bio={bio} />;
    case 'github':
      return <GitHubMockup userName={userName} userHandle={userHandle} initials={initials} headline={headline} />;
    case 'twitter':
      return <TwitterMockup userName={userName} userHandle={userHandle} initials={initials} headline={headline} />;
    case 'youtube':
      return <YouTubeMockup userName={userName} userHandle={userHandle} initials={initials} headline={headline} bio={bio} />;
    case 'personal_site':
      return <PersonalSiteMockup userHandle={userHandle} headline={headline} bio={bio} />;
    case 'instagram':
      return <InstagramMockup userName={userName} userHandle={userHandle} initials={initials} headline={headline} bio={bio} />;
    case 'behance':
    case 'dribbble':
      return <BehanceMockup userName={userName} initials={initials} headline={headline} bio={bio} />;
    default:
      return <GenericMockup platformName={platformKey} userName={userName} initials={initials} headline={headline} />;
  }
}
