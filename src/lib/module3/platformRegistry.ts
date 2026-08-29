/**
 * Unified Platform Registry — Single Source of Truth
 * 
 * All 13 authority platforms with brand colors, icons, char limits,
 * deep links, and role-based recommendations in one canonical location.
 * 
 * Consumed by:
 *  - AuthorityAuditSection (channel selection)
 *  - PlatformStudioSection (editor + mockups)
 *  - ConsistencyCheckSection (headline comparison)
 *  - DeployProofSection (deployment checklist)
 *  - IdentityFoundationSection (char-limit fit indicators)
 *  - authority-score-engine.ts (platform labels)
 */

import React from 'react';
import { BrandIcons } from '@/src/components/module3/step3/brand/BrandIcons';

// ── Core Types ────────────────────────────────────────────────────────────────

export interface PlatformConfig {
  key: string;
  name: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  brandColor: string;      // Tailwind bg- class for badges/buttons
  iconColor: string;       // Tailwind text- class for icon rendering
  textColor: string;       // Tailwind text- class for labels/headings
  borderColor: string;     // Tailwind border- class for cards
  bgColor: string;         // Tailwind bg- class (subtle card background)
  deepLink: string;        // Direct edit/settings URL for platform
  charLimits: {
    headline: number;
    bio: number;
  };
}

// ── The Registry ──────────────────────────────────────────────────────────────

export const PLATFORM_REGISTRY: Record<string, PlatformConfig> = {
  linkedin: {
    key: 'linkedin',
    name: 'LinkedIn',
    icon: BrandIcons.LinkedIn,
    brandColor: 'bg-[#0a66c2]',
    iconColor: 'text-[#0A66C2]',
    textColor: 'text-[#0a66c2]',
    borderColor: 'border-blue-200',
    bgColor: 'bg-blue-50/60',
    deepLink: 'https://www.linkedin.com/in/me/overlay/edit/',
    charLimits: { headline: 220, bio: 2600 },
  },
  twitter: {
    key: 'twitter',
    name: 'X / Twitter',
    icon: BrandIcons.Twitter,
    brandColor: 'bg-black',
    iconColor: 'text-neutral-900',
    textColor: 'text-neutral-900',
    borderColor: 'border-neutral-200',
    bgColor: 'bg-neutral-50/60',
    deepLink: 'https://x.com/settings/profile',
    charLimits: { headline: 160, bio: 160 },
  },
  youtube: {
    key: 'youtube',
    name: 'YouTube',
    icon: BrandIcons.YouTube,
    brandColor: 'bg-[#ff0000]',
    iconColor: 'text-[#FF0000]',
    textColor: 'text-[#ff0000]',
    borderColor: 'border-red-200',
    bgColor: 'bg-red-50/60',
    deepLink: 'https://studio.youtube.com/channel/editing/profile',
    charLimits: { headline: 1000, bio: 1000 },
  },
  instagram: {
    key: 'instagram',
    name: 'Instagram',
    icon: BrandIcons.Instagram,
    brandColor: 'bg-[#e1306c]',
    iconColor: 'text-[#E4405F]',
    textColor: 'text-[#e1306c]',
    borderColor: 'border-pink-200',
    bgColor: 'bg-pink-50/60',
    deepLink: 'https://www.instagram.com/accounts/edit/',
    charLimits: { headline: 150, bio: 150 },
  },
  github: {
    key: 'github',
    name: 'GitHub',
    icon: BrandIcons.GitHub,
    brandColor: 'bg-[#24292e]',
    iconColor: 'text-[#24292e]',
    textColor: 'text-[#24292e]',
    borderColor: 'border-neutral-200',
    bgColor: 'bg-neutral-50/60',
    deepLink: 'https://github.com/settings/profile',
    charLimits: { headline: 9999, bio: 9999 },
  },
  behance: {
    key: 'behance',
    name: 'Behance',
    icon: BrandIcons.Behance,
    brandColor: 'bg-[#1769FF]',
    iconColor: 'text-[#1769FF]',
    textColor: 'text-[#1769FF]',
    borderColor: 'border-blue-200',
    bgColor: 'bg-blue-50/60',
    deepLink: 'https://www.behance.net/',
    charLimits: { headline: 200, bio: 500 },
  },
  figma: {
    key: 'figma',
    name: 'Figma',
    icon: BrandIcons.Figma,
    brandColor: 'bg-[#0ACF83]',
    iconColor: 'text-[#0ACF83]',
    textColor: 'text-[#0ACF83]',
    borderColor: 'border-emerald-200',
    bgColor: 'bg-emerald-50/60',
    deepLink: 'https://www.figma.com/settings',
    charLimits: { headline: 200, bio: 500 },
  },
  dribbble: {
    key: 'dribbble',
    name: 'Dribbble',
    icon: BrandIcons.Dribbble,
    brandColor: 'bg-[#EA4C89]',
    iconColor: 'text-[#EA4C89]',
    textColor: 'text-[#EA4C89]',
    borderColor: 'border-pink-200',
    bgColor: 'bg-pink-50/60',
    deepLink: 'https://dribbble.com/account/general',
    charLimits: { headline: 160, bio: 500 },
  },
  personal_site: {
    key: 'personal_site',
    name: 'Personal Site',
    icon: BrandIcons.PersonalSite,
    brandColor: 'bg-[#0058be]',
    iconColor: 'text-[#0058be]',
    textColor: 'text-[#0058be]',
    borderColor: 'border-blue-200',
    bgColor: 'bg-blue-50/60',
    deepLink: '#',
    charLimits: { headline: 9999, bio: 9999 },
  },
  technical_blog: {
    key: 'technical_blog',
    name: 'Substack / Dev.to',
    icon: BrandIcons.Substack,
    brandColor: 'bg-[#FF6719]',
    iconColor: 'text-[#FF6719]',
    textColor: 'text-[#FF6719]',
    borderColor: 'border-orange-200',
    bgColor: 'bg-orange-50/60',
    deepLink: 'https://substack.com/',
    charLimits: { headline: 9999, bio: 9999 },
  },
  producthunt: {
    key: 'producthunt',
    name: 'Product Hunt',
    icon: BrandIcons.ProductHunt,
    brandColor: 'bg-[#DA552F]',
    iconColor: 'text-[#DA552F]',
    textColor: 'text-[#DA552F]',
    borderColor: 'border-orange-200',
    bgColor: 'bg-orange-50/60',
    deepLink: 'https://www.producthunt.com/my/profile',
    charLimits: { headline: 160, bio: 500 },
  },
  tiktok: {
    key: 'tiktok',
    name: 'TikTok',
    icon: BrandIcons.TikTok,
    brandColor: 'bg-black',
    iconColor: 'text-neutral-900',
    textColor: 'text-neutral-900',
    borderColor: 'border-neutral-200',
    bgColor: 'bg-neutral-50/60',
    deepLink: 'https://www.tiktok.com/',
    charLimits: { headline: 80, bio: 80 },
  },
  vimeo_behance: {
    key: 'vimeo_behance',
    name: 'Vimeo',
    icon: BrandIcons.Vimeo,
    brandColor: 'bg-[#1AB7EA]',
    iconColor: 'text-[#1AB7EA]',
    textColor: 'text-[#1ab7ea]',
    borderColor: 'border-cyan-200',
    bgColor: 'bg-cyan-50/60',
    deepLink: 'https://vimeo.com/manage',
    charLimits: { headline: 200, bio: 500 },
  },
};

// ── Convenience Helpers ───────────────────────────────────────────────────────

/** All platform configs as an ordered array */
export const ALL_PLATFORMS_LIST: PlatformConfig[] = Object.values(PLATFORM_REGISTRY);

/** All valid platform keys */
export const ALL_PLATFORM_KEYS: string[] = Object.keys(PLATFORM_REGISTRY);

/** Safe lookup with fallback */
export function getPlatformConfig(key: string): PlatformConfig | undefined {
  return PLATFORM_REGISTRY[key];
}

/** Platform label map (used by authority-score-engine) */
export function getPlatformLabel(key: string): string {
  return PLATFORM_REGISTRY[key]?.name ?? key;
}

/** Platform char limits map (used by IdentityFoundationSection) */
export function getPlatformCharLimits(key: string): { headline: number; bio: number } | undefined {
  return PLATFORM_REGISTRY[key]?.charLimits;
}

// ── Role-Based Platform Recommendations ───────────────────────────────────────

export interface RolePlatformConfig {
  key: string;
  name: string;
  category: string;
  benefit: string;
  clientSignal: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  recommended: boolean;
}

export interface RolePlatformResult {
  roleTitle: string;
  roleNiche: string;
  platforms: RolePlatformConfig[];
}

export function getRoleSensiblePlatforms(
  serviceId: string | null,
  careerTrackId: string | null
): RolePlatformResult {
  const s = (serviceId || '').toLowerCase();
  const c = (careerTrackId || '').toLowerCase();

  if (s.includes('edit') || s.includes('video') || s.includes('motion') || s.includes('cut') || s.includes('reel') || c.includes('editor') || c.includes('video')) {
    return {
      roleTitle: 'Video Editor & Motion Designer',
      roleNiche: 'High-Retention Video Editing & Motion Production',
      platforms: [
        { key: 'youtube', name: 'YouTube', category: 'Showcase & Retention Hub', benefit: 'Pacing breakdowns, narrative editing, sound design, and retention graph case studies.', clientSignal: 'Essential conversion hub for 6-figure and 7-figure YouTube creators.', icon: BrandIcons.YouTube, recommended: true },
        { key: 'twitter', name: 'X / Twitter', category: 'Creator & Founder Outreach', benefit: 'Direct access to top YouTubers, SaaS CEOs, viral editing teardowns, and before/after clips.', clientSignal: 'Highest conversion rate for cold creator DM client closing.', icon: BrandIcons.Twitter, recommended: true },
        { key: 'instagram', name: 'Instagram (Reels)', category: 'Short-Form Showreels', benefit: 'High-velocity motion graphics, dynamic sound design reels, and viral pacing samples.', clientSignal: 'Instant visual proof of viral short-form editing and brand aesthetic mastery.', icon: BrandIcons.Instagram, recommended: true },
        { key: 'tiktok', name: 'TikTok', category: 'Viral Hook & Pacing Testing', benefit: 'Fast-hook retention tests, viral meme formats, dynamic subtitles, and algorithm pacing proof.', clientSignal: 'Demonstrates high viral literacy for TikTok-first brand accounts.', icon: BrandIcons.TikTok, recommended: false },
        { key: 'vimeo_behance', name: 'Behance / Vimeo', category: 'Cinematic Reel & Grading', benefit: 'Uncompressed 4K showreels, high-budget commercial commercials, and color grading portfolios.', clientSignal: 'Required by agency creative directors and high-budget brand commercials.', icon: BrandIcons.Vimeo, recommended: false },
        { key: 'linkedin', name: 'LinkedIn', category: 'B2B Brand Video & Retainers', benefit: 'Corporate video marketing, B2B podcast repurposing, and executive personal brand clips.', clientSignal: 'Unlocks corporate monthly retainers ($3,000–$10,000/mo).', icon: BrandIcons.LinkedIn, recommended: false },
      ],
    };
  }

  if (s.includes('code') || s.includes('dev') || s.includes('tech') || s.includes('app') || s.includes('software') || s.includes('fullstack') || s.includes('frontend') || s.includes('backend') || c.includes('developer') || c.includes('engineer')) {
    return {
      roleTitle: 'Software Developer & Technical Architect',
      roleNiche: 'Full-Stack Engineering & Scalable Systems',
      platforms: [
        { key: 'github', name: 'GitHub', category: 'Code Proof & Repos', benefit: 'Pinned repositories, live architectures, commit frequency, and open-source PRs.', clientSignal: 'Primary technical evaluation channel for CTOs and tech founders.', icon: BrandIcons.GitHub, recommended: true },
        { key: 'linkedin', name: 'LinkedIn', category: 'B2B Client Pipeline', benefit: 'Direct executive outreach to SaaS founders, enterprise tech leads, and venture-backed startups.', clientSignal: 'Generates highest contract-value retainers ($5,000–$20,000/mo).', icon: BrandIcons.LinkedIn, recommended: true },
        { key: 'twitter', name: 'X / Twitter', category: 'Tech Founder Network', benefit: 'Build in public, viral code demos, software architecture breakdowns, and tech networking.', clientSignal: 'Fastest channel for viral inbound project requests from startup founders.', icon: BrandIcons.Twitter, recommended: true },
        { key: 'technical_blog', name: 'Substack / Dev.to', category: 'Deep-Dive Engineering', benefit: 'In-depth technical whitepapers, database optimization breakdowns, and system design case studies.', clientSignal: 'Demonstrates elite problem-solving depth over junior code tutorials.', icon: BrandIcons.Substack, recommended: false },
        { key: 'producthunt', name: 'Product Hunt', category: 'Shipped SaaS Proof', benefit: 'Live product launches, user upvotes, micro-SaaS tools, and revenue traction milestones.', clientSignal: 'Proves full product execution capability from zero to one.', icon: BrandIcons.ProductHunt, recommended: false },
        { key: 'youtube', name: 'YouTube (Tech Walkthroughs)', category: 'Live Code & System Design', benefit: 'Full-stack architectural teardowns, codebase walkthroughs, and live code reviews.', clientSignal: 'High-trust proof asset for non-technical founders seeking confidence.', icon: BrandIcons.YouTube, recommended: false },
      ],
    };
  }

  if (s.includes('design') || s.includes('ui') || s.includes('ux') || s.includes('product') || s.includes('brand') || s.includes('figma') || c.includes('designer')) {
    return {
      roleTitle: 'UI/UX & Product Designer',
      roleNiche: 'High-Converting Product Design & Design Systems',
      platforms: [
        { key: 'dribbble', name: 'Dribbble', category: 'Visual Craft & Interactions', benefit: 'Polished UI shots, micro-interaction animations, and clean visual design aesthetics.', clientSignal: 'Top design discovery engine for startup founders seeking aesthetic polish.', icon: BrandIcons.Dribbble, recommended: true },
        { key: 'behance', name: 'Behance', category: 'End-to-End Case Studies', benefit: 'Deep-dive UX research, user personas, design system architectures, and end-to-end design journeys.', clientSignal: 'Proves strategic design thinking for high-ticket product redesigns.', icon: BrandIcons.Behance, recommended: true },
        { key: 'figma', name: 'Figma Community', category: 'Design Systems & UI Kits', benefit: 'Published design system tokens, auto-layout UI kits, and downloadable component libraries.', clientSignal: 'Industry benchmark for technical UI/UX craft and design system mastery.', icon: BrandIcons.Figma, recommended: true },
        { key: 'linkedin', name: 'LinkedIn', category: 'Product Leaders & Retainers', benefit: 'Product design teardowns, conversion rate optimization (CRO) case studies, and design ROI insights.', clientSignal: 'Primary channel for landing recurring B2B product design retainers.', icon: BrandIcons.LinkedIn, recommended: true },
        { key: 'twitter', name: 'X / Twitter', category: 'Design Engineering Community', benefit: 'Figma tips, design system breakdowns, live redesign threads, and UI craft critiques.', clientSignal: 'Connects directly with Y-Combinator founders and design executives.', icon: BrandIcons.Twitter, recommended: false },
        { key: 'instagram', name: 'Instagram', category: 'UI Carousels & Brand Guides', benefit: 'Typography pairings, UI breakdown carousels, aesthetic design tips, and visual inspiration.', clientSignal: 'Builds personal brand recognition and design agency authority.', icon: BrandIcons.Instagram, recommended: false },
      ],
    };
  }

  // Default / Consultant / Agency
  return {
    roleTitle: 'Authority Specialist & Consultant',
    roleNiche: 'High-Ticket B2B Client Acquisition & Consulting',
    platforms: [
      { key: 'linkedin', name: 'LinkedIn', category: 'B2B Executive Authority', benefit: 'Thought leadership articles, executive positioning, and inbound corporate pipeline.', clientSignal: 'Essential channel for $5,000+ consulting engagements.', icon: BrandIcons.LinkedIn, recommended: true },
      { key: 'twitter', name: 'X / Twitter', category: 'Industry Thought Leadership', benefit: 'Framework teardowns, contrarian industry perspectives, and high-engagement threads.', clientSignal: 'Generates organic inbound leads from founders and operators.', icon: BrandIcons.Twitter, recommended: true },
      { key: 'technical_blog', name: 'Substack / Newsletter', category: 'Strategic Whitepapers', benefit: 'Deep-dive industry analysis, client case studies, and proprietary playbooks.', clientSignal: 'Builds deep trust and pre-sells high-ticket advisory packages.', icon: BrandIcons.Substack, recommended: true },
      { key: 'youtube', name: 'YouTube', category: 'Long-Form Advisory', benefit: 'Recorded client workshops, framework walkthroughs, and executive keynotes.', clientSignal: 'Highest authority conversion medium for premium buyers.', icon: BrandIcons.YouTube, recommended: false },
      { key: 'instagram', name: 'Instagram', category: 'Brand Stance & Social Proof', benefit: 'Client testimonials, behind-the-scenes consulting, and milestone updates.', clientSignal: 'Provides social validation and human connection.', icon: BrandIcons.Instagram, recommended: false },
    ],
  };
}
