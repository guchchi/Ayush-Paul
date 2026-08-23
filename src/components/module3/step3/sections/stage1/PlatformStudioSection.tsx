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

// ── Official Lightweight SVG Brand Icons ──────────────────────────────────────

const BrandIcons = {
  LinkedIn: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  ),
  YouTube: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  Instagram: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  Twitter: ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  GitHub: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  ),
  Behance: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.171 3-3.455 0-5.555-2.226-5.555-5.69 0-3.328 2.055-5.69 5.378-5.69 3.447 0 5.164 2.26 5.164 5.352 0 .61-.061 1.155-.098 1.408h-7.79c.123 1.776 1.405 2.768 3.082 2.768 1.341 0 2.247-.648 2.705-1.579l2.285.431zm-7.986-4.664h5.188c-.126-1.516-1.127-2.316-2.584-2.316-1.503 0-2.457.877-2.604 2.316zm-8.74 7.664h-7v-16h7.625c2.457 0 4.375 1.111 4.375 3.625 0 1.488-.724 2.586-1.927 3.125 1.624.512 2.427 1.879 2.427 3.525 0 3.016-2.292 5.725-5.5 5.725zm-4.375-9.375h3.875c1.47 0 2.25-.662 2.25-1.875s-.78-1.75-2.25-1.75h-3.875v3.625zm0 6.75h4.125c1.54 0 2.375-.765 2.375-2.125s-.835-2.125-2.375-2.125h-4.125v4.25z"/>
    </svg>
  ),
  Figma: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#0ACF83" d="M12 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0z"/>
      <path fill="#A259FF" d="M6 18a3 3 0 0 1 3-3h3v3a3 3 0 0 1-3 3 3 3 0 0 1-3-3z"/>
      <path fill="#F24E1E" d="M6 6a3 3 0 0 1 3-3h3v6H9a3 3 0 0 1-3-3z"/>
      <path fill="#FF7262" d="M12 3h3a3 3 0 0 1 0 6h-3V3z"/>
      <path fill="#1ABCFE" d="M6 12a3 3 0 0 1 3-3h3v6H9a3 3 0 0 1-3-3z"/>
    </svg>
  ),
  Dribbble: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm9.849 11.002c-.08-.016-2.585-.494-5.183.376 1.092 2.996 1.542 5.49 1.637 6.071 2.155-1.635 3.546-4.148 3.546-6.447zm-5.26 7.42c-.116-.763-.586-3.328-1.748-6.398-4.437 1.482-6.002 4.453-6.177 4.814 1.48 1.157 3.344 1.848 5.368 1.848.918 0 1.799-.142 2.557-.264zm-9.39-2.032c.264-.471 2.039-3.479 6.385-4.887.214-.07.433-.133.655-.192-.47-1.066-.997-2.096-1.577-3.08-4.195 1.258-8.232 1.246-8.618 1.244-.029.356-.044.717-.044 1.082 0 2.213.784 4.249 2.096 5.833zm-2.148-7.794c.433.003 3.992-.016 7.973-1.164-1.282-2.316-2.73-4.24-2.883-4.44-2.868 1.18-4.912 3.864-5.09 5.604zm6.657-6.223c.162.214 1.619 2.138 2.879 4.417 2.378-.887 4.542-.716 4.793-.693-1.67-2.339-4.394-3.864-7.464-3.864-.07 0-.138.005-.208.007v.133zm9.362 5.253c-.328-.026-2.748-.175-5.275.823.548.966 1.05 1.968 1.498 3.003 2.502-.821 4.791-.371 4.908-.346-.109-1.326-.499-2.482-1.131-3.48z"/>
    </svg>
  ),
  TikTok: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.18 1.18 2.16 2.37 2.37.95.19 1.98-.05 2.74-.64.71-.53 1.14-1.36 1.19-2.25.04-3.14.02-6.28.02-9.42V.02z"/>
    </svg>
  ),
  ProductHunt: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm-1.09 16.5H8.36V7.5h4.18c2.42 0 4.18 1.65 4.18 4.09 0 2.44-1.76 4.09-4.18 4.09h-1.63v.82zm0-4.91h1.63c.99 0 1.63-.66 1.63-1.64 0-.97-.64-1.63-1.63-1.63h-1.63v3.27z"/>
    </svg>
  ),
  Substack: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
    </svg>
  ),
  Vimeo: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.012 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128 1.604-1.398 2.809-2.138 3.611-2.215 1.9-.179 3.064 1.119 3.498 3.896.46 2.96 1.05 6.077 1.768 9.351.644-1.015 1.547-2.613 2.709-4.795 1.162-2.181 1.777-3.729 1.848-4.643.141-1.611-.531-2.417-2.016-2.417-.672 0-1.344.14-2.016.42 1.344-4.385 3.894-6.527 7.65-6.427 2.784.07 4.095 1.83 3.935 5.279z"/>
    </svg>
  ),
  PersonalSite: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  ),
};

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

const PLATFORM_CHECKLISTS: Record<string, string[]> = {
  linkedin: ['Banner matches new headline vibe', 'Featured section has case study link', 'Custom CTA button enabled', 'Set "Open to" -> Providing Services'],
  twitter: ['Pinned proof thread active', 'Single booking link in bio', 'Professional avatar updated'],
  github: ['Profile README.md fully updated', 'Pinned repositories show best work', 'Sponsor / Hire button visible'],
  instagram: ['Link-in-bio tree set up', 'Highlights organized by service', 'Contact button configured'],
  youtube: ['Channel banner updated', 'Watermark added to videos', 'About section matches bio'],
  personal_site: ['Favicon updated', 'Hero section copy is clear', 'Booking widget embedded'],
  behance: ['Portfolio items categorized', 'Available for hire turned on', 'Custom URL claimed']
};

const COPY_FORMULAS = [
  { id: 'proof', label: 'Proof-First', desc: 'Leads with metrics & results' },
  { id: 'problem', label: 'Problem-Solution', desc: 'Calls out client pain point' },
  { id: 'contrarian', label: 'Contrarian', desc: 'High-status, zero-fluff' }
];

// â”€â”€ Helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const getInitials = (name: string) => {
  if (!name) return 'AP';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const generateToneVariation = (text: string, tone: 'executive' | 'conversion' | 'direct') => {
  if (!text) return text;
  if (tone === 'executive') return text.startsWith('Verifiable') ? text : `Strategic Authority â€¢ ${text}`;
  if (tone === 'conversion') return `Proven ${text} â€” Eliminating Client Execution Risk.`;
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
          <h3 className="font-bold text-base text-neutral-900">{userName} <span className="text-neutral-500 text-xs font-normal">Â· 1st</span></h3>
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
          <p className="text-[10px] text-neutral-300">Here's how I scaled my agency to $10k/mo using this one simple trick. A mega-thread ðŸ§µðŸ‘‡</p>
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
          <span>â€§</span>
          <span>100K subscribers</span>
          <span>â€§</span>
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
        <div className="font-bold text-xl tracking-tighter">BÄ“hance</div>
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
  const applyFormula = (fieldKey: string, formulaId: string, _originalValue: string) => {
    let result = '';
    const market = (mod1MarketId || '').replace(/_/g, ' ') || 'clients';
    const service = (mod1ServiceId || '').replace(/_/g, ' ') || 'systems';
    const mechanism = mod2UniqueMechanism?.trim() || 'our proven methodology';
    const position = mod1Positioning?.trim() || 'Specialist';

    if (formulaId === 'proof') {
      result = fieldKey.includes('headline')
        ? `I help ${market} scale â†’ Measurable value | Creator of ${mechanism} | Book a call ðŸ‘‡`
        : `Over the past years, I've consistently delivered verifiable results for ${market}. If you need a ${position} who eliminates risk and guarantees delivery for ${service}, let's talk.\n\nKey Result: Proven impact using ${mechanism}.`;
    } else if (formulaId === 'problem') {
      result = fieldKey.includes('headline')
        ? `Tired of generic ${service}? I build custom solutions for ${market} so you can scale safely.`
        : `Most ${market} struggle with unpredictable execution.\n\nI solve this by implementing ${mechanism}. The outcome? Predictable growth without the usual headaches.`;
    } else if (formulaId === 'contrarian') {
      result = fieldKey.includes('headline')
        ? `Unpopular opinion: Traditional ${service} is dead. I do the exact opposite for ${market}.`
        : `Everyone says you need more pitch decks. They're wrong.\n\nI build ${mechanism} systems that ignore the noise and focus purely on verifiable proof and execution.`;
    }
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

      {/* â”€â”€ Current Platform Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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

          {/* â”€â”€ Split: Mockup (Left Sticky) + Editor (Right Scroll) â”€â”€â”€â”€ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Sticky Phone Mockup */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-4">
                {renderMockup()}
              </div>
            </div>

            {/* Right: Copy Editor */}
            <div className="lg:col-span-7 space-y-3">

              {/* Field cards */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
                  Copy Fields â€” {activePlatformData.fields.length} fields
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
                              onClick={() => applyFormula(field.key, formula.id, field.value)}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold rounded-lg border border-blue-200 transition-all cursor-pointer"
                              title={formula.desc}
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
              {PLATFORM_CHECKLISTS[activeTab] && (
                <div className="p-4 rounded-2xl border border-neutral-200 bg-white shadow-xs">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-2">
                    <CheckSquare size={13} className="text-emerald-500" />
                    {platformLabel} Launch Checklist
                  </h4>
                  <div className="space-y-1.5">
                    {PLATFORM_CHECKLISTS[activeTab].map((step, idx) => {
                      const stepId = `${activeTab}_check_${idx}`;
                      const isChecked = !!checkedSteps[stepId];
                      return (
                        <label key={stepId} className="flex items-start gap-2.5 cursor-pointer group hover:bg-neutral-50 p-1.5 rounded-lg transition-colors">
                          <div className={cn(
                            "w-4 h-4 mt-0.5 rounded flex items-center justify-center border transition-colors shrink-0",
                            isChecked ? "bg-emerald-500 border-emerald-500" : "bg-white border-neutral-300 group-hover:border-emerald-400"
                          )}>
                            {isChecked && <Check size={10} className="text-white" />}
                          </div>
                          <input type="checkbox" className="hidden" checked={isChecked} onChange={() => toggleChecklist(stepId)} />
                          <span className={cn("text-xs font-medium transition-colors", isChecked ? "text-neutral-400 line-through" : "text-neutral-700")}>
                            {step}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

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
                      â† Previous
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
                    Next Platform â†’
                  </button>
                ) : isViewingOptional ? (
                  <button
                    onClick={() => { setViewingOptionalPlatform(null); setEditingField(null); }}
                    className="px-4 py-2 text-xs font-bold text-[#0058be] hover:underline cursor-pointer"
                  >
                    â† Back to Primary
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>


      {/* â”€â”€ Bottom: Continue CTA (Gated) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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
                    â† Back
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
                Run Consistency Check â†’
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
                Run Consistency Check â†’
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

PlatformStudioSection.displayName = 'PlatformStudioSection';

