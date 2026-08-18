/**
 * Section 1: Authority Audit (Role-Smart & Interactive Reality Check)
 * 
 * Flow:
 *  1A. Channel Selection — "Select your active or target platforms" (Role-tailored with official SVGs).
 *  1B. Diagnostic Baseline — 3-Question Honest Diagnostic OR Direct Bio Paste.
 *  1C. Live Scorecard — Apple Watch style SVG Score Ring (0-100), 4 Dimension Bars & Gap Analysis.
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { EASING, DURATION } from '@/src/lib/motion-presets';
import type { ProfileSystemAsset } from '@/src/data/module3/authority-suite-engine';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Zap,
  HelpCircle,
  Check,
  ArrowLeft,
  XCircle,
  TrendingUp,
} from 'lucide-react';
import { ModuleButton } from '@/src/components/workspace/ModuleButton';
import { useModule3Store } from '@/src/lib/module3/store';

// ── Intelligent Bio Analyzer (Heuristic AI) ───────────────────────────────────

interface BioFeedback {
  type: 'positive' | 'warning' | 'critical';
  message: string;
  detail: string;
}

function analyzeBioHeuristic(bio: string): BioFeedback[] {
  const feedback: BioFeedback[] = [];
  const lower = bio.toLowerCase().trim();
  if (!lower || lower.length < 10) return feedback;

  // Authority killers
  const weakWords = ['passionate', 'aspiring', 'freelancer', 'looking for', 'available for', 'open to work', 'enthusiast', 'love to', 'jack of all'];
  const foundWeak = weakWords.filter(w => lower.includes(w));
  if (foundWeak.length > 0) {
    feedback.push({
      type: 'critical',
      message: `Authority-killer detected: "${foundWeak[0]}"`,
      detail: 'High-ticket clients skip profiles with generic or needy language. Replace with a specific outcome you deliver.',
    });
  }

  // Check for positioning pattern "I help X achieve Y"
  if (lower.includes('i help') || lower.includes('i build') || lower.includes('i design') || lower.includes('i create') || lower.includes('i engineer')) {
    feedback.push({
      type: 'positive',
      message: 'Strong positioning pattern detected',
      detail: 'Your bio leads with a clear value statement. This converts 3x better than skill-listing bios.',
    });
  } else {
    feedback.push({
      type: 'warning',
      message: 'No clear positioning statement found',
      detail: 'Try starting with "I help [WHO] achieve [RESULT] through [METHOD]" — this is the #1 authority bio pattern.',
    });
  }

  // Check for metrics/numbers
  const hasNumbers = /\d+[%xX+]|\$\d|\d+\s*(clients|projects|videos|brands|companies|subscribers|views)/i.test(bio);
  if (hasNumbers) {
    feedback.push({
      type: 'positive',
      message: 'Contains quantifiable proof signals',
      detail: 'Numbers and metrics (like "50+ clients" or "10x growth") dramatically increase trust and conversion.',
    });
  } else {
    feedback.push({
      type: 'warning',
      message: 'No metrics or numbers found',
      detail: 'Adding even one number ("helped 30+ creators" or "$500K+ revenue generated") makes your bio 2x more credible.',
    });
  }

  // Check for CTA
  const ctaSignals = ['book', 'dm ', 'dm me', 'calendar', 'apply', 'link in', 'let\'s talk', 'schedule', 'reach out', 'hire me', 'work with'];
  const hasCta = ctaSignals.some(s => lower.includes(s));
  if (hasCta) {
    feedback.push({
      type: 'positive',
      message: 'Call-to-action detected',
      detail: 'You\'re directing visitors towards the next step. Ensure it leads to a single, clear booking page.',
    });
  } else {
    feedback.push({
      type: 'critical',
      message: 'No call-to-action found',
      detail: 'Without a CTA, visitors read your bio and leave. Add "Book a strategy call" or "DM me [keyword]" at the end.',
    });
  }

  // Check length
  if (bio.length < 60) {
    feedback.push({
      type: 'warning',
      message: 'Bio is very short',
      detail: 'Most converting bios are 100-200 characters. You have room to add a proof point or a CTA.',
    });
  }

  // Check for niche specificity
  const genericRoles = ['developer', 'designer', 'editor', 'marketer', 'writer', 'consultant'];
  const hasGenericRole = genericRoles.some(r => {
    const idx = lower.indexOf(r);
    if (idx === -1) return false;
    // Check if it's preceded by a modifier (good) or standalone (bad)
    const before = lower.slice(Math.max(0, idx - 15), idx).trim();
    return !before.includes(' ') || before.endsWith('a ') || before.endsWith('an ');
  });
  if (hasGenericRole && !lower.includes('for ') && !lower.includes('helping') && !lower.includes('specializ')) {
    feedback.push({
      type: 'warning',
      message: 'Generic role title without niche',
      detail: 'Instead of just "Designer", try "UI/UX Designer for SaaS Startups" — specificity attracts premium clients.',
    });
  }

  return feedback;
}

// ── Role Benchmark Data ───────────────────────────────────────────────────────

function getRoleBenchmarks(serviceId: string | null, careerTrackId: string | null): { average: number; topPerformer: number; roleLabel: string } {
  const s = (serviceId || '').toLowerCase();
  const c = (careerTrackId || '').toLowerCase();

  if (s.includes('edit') || s.includes('video') || s.includes('motion') || c.includes('editor') || c.includes('video')) {
    return { average: 38, topPerformer: 87, roleLabel: 'Video Editors' };
  }
  if (s.includes('code') || s.includes('dev') || s.includes('tech') || s.includes('software') || c.includes('developer') || c.includes('engineer')) {
    return { average: 45, topPerformer: 89, roleLabel: 'Developers' };
  }
  if (s.includes('design') || s.includes('ui') || s.includes('ux') || c.includes('designer')) {
    return { average: 42, topPerformer: 86, roleLabel: 'Designers' };
  }
  if (s.includes('market') || s.includes('growth') || s.includes('seo') || c.includes('marketer')) {
    return { average: 40, topPerformer: 84, roleLabel: 'Marketers' };
  }
  if (s.includes('write') || s.includes('copy') || s.includes('content') || c.includes('writer')) {
    return { average: 36, topPerformer: 82, roleLabel: 'Writers' };
  }
  return { average: 41, topPerformer: 85, roleLabel: 'Professionals' };
}

// ── Official Lightweight SVG Brand Icons ──────────────────────────────────────

const BrandIcons = {
  LinkedIn: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#0A66C2]" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  ),
  YouTube: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#FF0000]" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  Instagram: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#E4405F]" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  GitHub: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#0b1c30]" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  ),
  Twitter: () => (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-black" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  Figma: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <path fill="#0ACF83" d="M12 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0z"/>
      <path fill="#A259FF" d="M6 18a3 3 0 0 1 3-3h3v3a3 3 0 0 1-3 3 3 3 0 0 1-3-3z"/>
      <path fill="#F24E1E" d="M6 6a3 3 0 0 1 3-3h3v6H9a3 3 0 0 1-3-3z"/>
      <path fill="#FF7262" d="M12 3h3a3 3 0 0 1 0 6h-3V3z"/>
      <path fill="#1ABCFE" d="M6 12a3 3 0 0 1 3-3h3v6H9a3 3 0 0 1-3-3z"/>
    </svg>
  ),
  Behance: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#1769FF]" aria-hidden="true">
      <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.171 3-3.455 0-5.555-2.226-5.555-5.69 0-3.328 2.055-5.69 5.378-5.69 3.447 0 5.164 2.26 5.164 5.352 0 .61-.061 1.155-.098 1.408h-7.79c.123 1.776 1.405 2.768 3.082 2.768 1.341 0 2.247-.648 2.705-1.579l2.285.431zm-7.986-4.664h5.188c-.126-1.516-1.127-2.316-2.584-2.316-1.503 0-2.457.877-2.604 2.316zm-8.74 7.664h-7v-16h7.625c2.457 0 4.375 1.111 4.375 3.625 0 1.488-.724 2.586-1.927 3.125 1.624.512 2.427 1.879 2.427 3.525 0 3.016-2.292 5.725-5.5 5.725zm-4.375-9.375h3.875c1.47 0 2.25-.662 2.25-1.875s-.78-1.75-2.25-1.75h-3.875v3.625zm0 6.75h4.125c1.54 0 2.375-.765 2.375-2.125s-.835-2.125-2.375-2.125h-4.125v4.25z"/>
    </svg>
  ),
  Dribbble: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#EA4C89]" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm9.849 11.002c-.08-.016-2.585-.494-5.183.376 1.092 2.996 1.542 5.49 1.637 6.071 2.155-1.635 3.546-4.148 3.546-6.447zm-5.26 7.42c-.116-.763-.586-3.328-1.748-6.398-4.437 1.482-6.002 4.453-6.177 4.814 1.48 1.157 3.344 1.848 5.368 1.848.918 0 1.799-.142 2.557-.264zm-9.39-2.032c.264-.471 2.039-3.479 6.385-4.887.214-.07.433-.133.655-.192-.47-1.066-.997-2.096-1.577-3.08-4.195 1.258-8.232 1.246-8.618 1.244-.029.356-.044.717-.044 1.082 0 2.213.784 4.249 2.096 5.833zm-2.148-7.794c.433.003 3.992-.016 7.973-1.164-1.282-2.316-2.73-4.24-2.883-4.44-2.868 1.18-4.912 3.864-5.09 5.604zm6.657-6.223c.162.214 1.619 2.138 2.879 4.417 2.378-.887 4.542-.716 4.793-.693-1.67-2.339-4.394-3.864-7.464-3.864-.07 0-.138.005-.208.007v.133zm9.362 5.253c-.328-.026-2.748-.175-5.275.823.548.966 1.05 1.968 1.498 3.003 2.502-.821 4.791-.371 4.908-.346-.109-1.326-.499-2.482-1.131-3.48z"/>
    </svg>
  ),
  TikTok: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#000000]" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.18 1.18 2.16 2.37 2.37.95.19 1.98-.05 2.74-.64.71-.53 1.14-1.36 1.19-2.25.04-3.14.02-6.28.02-9.42V.02z"/>
    </svg>
  ),
  ProductHunt: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#DA552F]" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm-1.09 16.5H8.36V7.5h4.18c2.42 0 4.18 1.65 4.18 4.09 0 2.44-1.76 4.09-4.18 4.09h-1.63v.82zm0-4.91h1.63c.99 0 1.63-.66 1.63-1.64 0-.97-.64-1.63-1.63-1.63h-1.63v3.27z"/>
    </svg>
  ),
  Substack: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#FF6719]" aria-hidden="true">
      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
    </svg>
  ),
  Vimeo: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#1AB7EA]" aria-hidden="true">
      <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.012 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128 1.604-1.398 2.809-2.138 3.611-2.215 1.9-.179 3.064 1.119 3.498 3.896.46 2.96 1.05 6.077 1.768 9.351.644-1.015 1.547-2.613 2.709-4.795 1.162-2.181 1.777-3.729 1.848-4.643.141-1.611-.531-2.417-2.016-2.417-.672 0-1.344.14-2.016.42 1.344-4.385 3.894-6.527 7.65-6.427 2.784.07 4.095 1.83 3.935 5.279z"/>
    </svg>
  ),
};

interface RolePlatformConfig {
  key: string;
  name: string;
  category: string;
  benefit: string;
  clientSignal: string;
  icon: React.ComponentType;
  recommended: boolean;
}

const getRoleSensiblePlatforms = (serviceId: string | null, careerTrackId: string | null): { roleTitle: string; roleNiche: string; platforms: RolePlatformConfig[] } => {
  const s = (serviceId || '').toLowerCase();
  const c = (careerTrackId || '').toLowerCase();

  if (s.includes('edit') || s.includes('video') || s.includes('motion') || s.includes('cut') || s.includes('reel') || c.includes('editor') || c.includes('video')) {
    return {
      roleTitle: 'Video Editor & Motion Designer',
      roleNiche: 'High-Retention Video Editing & Motion Production',
      platforms: [
        {
          key: 'youtube',
          name: 'YouTube',
          category: 'Showcase & Retention Hub',
          benefit: 'Pacing breakdowns, narrative editing, sound design, and retention graph case studies.',
          clientSignal: 'Essential conversion hub for 6-figure and 7-figure YouTube creators.',
          icon: BrandIcons.YouTube,
          recommended: true,
        },
        {
          key: 'twitter',
          name: 'X / Twitter',
          category: 'Creator & Founder Outreach',
          benefit: 'Direct access to top YouTubers, SaaS CEOs, viral editing teardowns, and before/after clips.',
          clientSignal: 'Highest conversion rate for cold creator DM client closing.',
          icon: BrandIcons.Twitter,
          recommended: true,
        },
        {
          key: 'instagram',
          name: 'Instagram (Reels)',
          category: 'Short-Form Showreels',
          benefit: 'High-velocity motion graphics, dynamic sound design reels, and viral pacing samples.',
          clientSignal: 'Instant visual proof of viral short-form editing and brand aesthetic mastery.',
          icon: BrandIcons.Instagram,
          recommended: true,
        },
        {
          key: 'tiktok',
          name: 'TikTok',
          category: 'Viral Hook & Pacing Testing',
          benefit: 'Fast-hook retention tests, viral meme formats, dynamic subtitles, and algorithm pacing proof.',
          clientSignal: 'Demonstrates high viral literacy for TikTok-first brand accounts.',
          icon: BrandIcons.TikTok,
          recommended: false,
        },
        {
          key: 'vimeo_behance',
          name: 'Behance / Vimeo',
          category: 'Cinematic Reel & Grading',
          benefit: 'Uncompressed 4K showreels, high-budget commercial commercials, and color grading portfolios.',
          clientSignal: 'Required by agency creative directors and high-budget brand commercials.',
          icon: BrandIcons.Vimeo,
          recommended: false,
        },
        {
          key: 'linkedin',
          name: 'LinkedIn',
          category: 'B2B Brand Video & Retainers',
          benefit: 'Corporate video marketing, B2B podcast repurposing, and executive personal brand clips.',
          clientSignal: 'Unlocks corporate monthly retainers ($3,000–$10,000/mo).',
          icon: BrandIcons.LinkedIn,
          recommended: false,
        },
      ],
    };
  }

  if (s.includes('code') || s.includes('dev') || s.includes('tech') || s.includes('app') || s.includes('software') || s.includes('fullstack') || s.includes('frontend') || s.includes('backend') || c.includes('developer') || c.includes('engineer')) {
    return {
      roleTitle: 'Software Developer & Technical Architect',
      roleNiche: 'Full-Stack Engineering & Scalable Systems',
      platforms: [
        {
          key: 'github',
          name: 'GitHub',
          category: 'Code Proof & Repos',
          benefit: 'Pinned repositories, live architectures, commit frequency, and open-source PRs.',
          clientSignal: 'Primary technical evaluation channel for CTOs and tech founders.',
          icon: BrandIcons.GitHub,
          recommended: true,
        },
        {
          key: 'linkedin',
          name: 'LinkedIn',
          category: 'B2B Client Pipeline',
          benefit: 'Direct executive outreach to SaaS founders, enterprise tech leads, and venture-backed startups.',
          clientSignal: 'Generates highest contract-value retainers ($5,000–$20,000/mo).',
          icon: BrandIcons.LinkedIn,
          recommended: true,
        },
        {
          key: 'twitter',
          name: 'X / Twitter',
          category: 'Tech Founder Network',
          benefit: 'Build in public, viral code demos, software architecture breakdowns, and tech networking.',
          clientSignal: 'Fastest channel for viral inbound project requests from startup founders.',
          icon: BrandIcons.Twitter,
          recommended: true,
        },
        {
          key: 'technical_blog',
          name: 'Substack / Dev.to',
          category: 'Deep-Dive Engineering',
          benefit: 'In-depth technical whitepapers, database optimization breakdowns, and system design case studies.',
          clientSignal: 'Demonstrates elite problem-solving depth over junior code tutorials.',
          icon: BrandIcons.Substack,
          recommended: false,
        },
        {
          key: 'producthunt',
          name: 'Product Hunt',
          category: 'Shipped SaaS Proof',
          benefit: 'Live product launches, user upvotes, micro-SaaS tools, and revenue traction milestones.',
          clientSignal: 'Proves full product execution capability from zero to one.',
          icon: BrandIcons.ProductHunt,
          recommended: false,
        },
        {
          key: 'youtube',
          name: 'YouTube (Tech Walkthroughs)',
          category: 'Live Code & System Design',
          benefit: 'Full-stack architectural teardowns, codebase walkthroughs, and live code reviews.',
          clientSignal: 'High-trust proof asset for non-technical founders seeking confidence.',
          icon: BrandIcons.YouTube,
          recommended: false,
        },
      ],
    };
  }

  if (s.includes('design') || s.includes('ui') || s.includes('ux') || s.includes('product') || s.includes('brand') || s.includes('figma') || c.includes('designer')) {
    return {
      roleTitle: 'UI/UX & Product Designer',
      roleNiche: 'High-Converting Product Design & Design Systems',
      platforms: [
        {
          key: 'dribbble',
          name: 'Dribbble',
          category: 'Visual Craft & Interactions',
          benefit: 'Polished UI shots, micro-interaction animations, and clean visual design aesthetics.',
          clientSignal: 'Top design discovery engine for startup founders seeking aesthetic polish.',
          icon: BrandIcons.Dribbble,
          recommended: true,
        },
        {
          key: 'behance',
          name: 'Behance',
          category: 'End-to-End Case Studies',
          benefit: 'Deep-dive UX research, user personas, design system architectures, and end-to-end design journeys.',
          clientSignal: 'Proves strategic design thinking for high-ticket product redesigns.',
          icon: BrandIcons.Behance,
          recommended: true,
        },
        {
          key: 'figma',
          name: 'Figma Community',
          category: 'Design Systems & UI Kits',
          benefit: 'Published design system tokens, auto-layout UI kits, and downloadable component libraries.',
          clientSignal: 'Industry benchmark for technical UI/UX craft and design system mastery.',
          icon: BrandIcons.Figma,
          recommended: true,
        },
        {
          key: 'linkedin',
          name: 'LinkedIn',
          category: 'Product Leaders & Retainers',
          benefit: 'Product design teardowns, conversion rate optimization (CRO) case studies, and design ROI insights.',
          clientSignal: 'Primary channel for landing recurring B2B product design retainers.',
          icon: BrandIcons.LinkedIn,
          recommended: true,
        },
        {
          key: 'twitter',
          name: 'X / Twitter',
          category: 'Design Engineering Community',
          benefit: 'Figma tips, design system breakdowns, live redesign threads, and UI craft critiques.',
          clientSignal: 'Connects directly with Y-Combinator founders and design executives.',
          icon: BrandIcons.Twitter,
          recommended: false,
        },
        {
          key: 'instagram',
          name: 'Instagram',
          category: 'UI Carousels & Brand Guides',
          benefit: 'Typography pairings, UI breakdown carousels, aesthetic design tips, and visual inspiration.',
          clientSignal: 'Builds personal brand recognition and design agency authority.',
          icon: BrandIcons.Instagram,
          recommended: false,
        },
      ],
    };
  }

  // Default / Consultant / Agency
  return {
    roleTitle: 'Authority Specialist & Consultant',
    roleNiche: 'High-Ticket B2B Client Acquisition & Consulting',
    platforms: [
      {
        key: 'linkedin',
        name: 'LinkedIn',
        category: 'B2B Executive Authority',
        benefit: 'Thought leadership articles, executive positioning, and inbound corporate pipeline.',
        clientSignal: 'Essential channel for $5,000+ consulting engagements.',
        icon: BrandIcons.LinkedIn,
        recommended: true,
      },
      {
        key: 'twitter',
        name: 'X / Twitter',
        category: 'Industry Thought Leadership',
        benefit: 'Framework teardowns, contrarian industry perspectives, and high-engagement threads.',
        clientSignal: 'Generates organic inbound leads from founders and operators.',
        icon: BrandIcons.Twitter,
        recommended: true,
      },
      {
        key: 'technical_blog',
        name: 'Substack / Newsletter',
        category: 'Strategic Whitepapers',
        benefit: 'Deep-dive industry analysis, client case studies, and proprietary playbooks.',
        clientSignal: 'Builds deep trust and pre-sells high-ticket advisory packages.',
        icon: BrandIcons.Substack,
        recommended: true,
      },
      {
        key: 'youtube',
        name: 'YouTube',
        category: 'Long-Form Advisory',
        benefit: 'Recorded client workshops, framework walkthroughs, and executive keynotes.',
        clientSignal: 'Highest authority conversion medium for premium buyers.',
        icon: BrandIcons.YouTube,
        recommended: false,
      },
      {
        key: 'instagram',
        name: 'Instagram',
        category: 'Brand Stance & Social Proof',
        benefit: 'Client testimonials, behind-the-scenes consulting, and milestone updates.',
        clientSignal: 'Provides social validation and human connection.',
        icon: BrandIcons.Instagram,
        recommended: false,
      },
    ],
  };
};

interface RoleQuizConfig {
  headlineOptions: Array<{
    id: string;
    title: string;
    description: string;
    example: string;
    scoreWeight: string;
  }>;
  proofOptions: Array<{
    id: boolean;
    title: string;
    description: string;
    example: string;
    scoreWeight: string;
  }>;
  ctaOptions: Array<{
    id: boolean;
    title: string;
    description: string;
    example: string;
    scoreWeight: string;
  }>;
}

const getRoleQuizContent = (serviceId: string | null, careerTrackId: string | null): RoleQuizConfig => {
  const s = (serviceId || '').toLowerCase();
  const c = (careerTrackId || '').toLowerCase();

  if (s.includes('edit') || s.includes('video') || s.includes('motion') || c.includes('editor')) {
    return {
      headlineOptions: [
        {
          id: 'generic',
          title: 'Job Title Only',
          description: 'Basic job title without clear niche differentiation or business value.',
          example: 'e.g. "Freelance Video Editor | Premiere Pro & After Effects"',
          scoreWeight: '0 PTS',
        },
        {
          id: 'skills',
          title: 'Software & Tool Stack',
          description: 'Lists editing tools rather than creator retention and business ROI.',
          example: 'e.g. "4K Editing • Premiere Pro • After Effects • DaVinci • Sound Design"',
          scoreWeight: '+10 PTS',
        },
        {
          id: 'authority',
          title: 'Client Outcome & Retention',
          description: 'Clear value proposition focused on audience growth, retention, and ROI.',
          example: 'e.g. "Helping YouTube creators scale past 1M+ views with retention-first editing"',
          scoreWeight: '+25 PTS',
        },
      ],
      proofOptions: [
        {
          id: false,
          title: 'No Proof or Vague Claims',
          description: 'No verified retention stats, view milestones, or creator testimonials pinned.',
          example: 'e.g. "Passionate video editor with 3+ years experience"',
          scoreWeight: '0 PTS',
        },
        {
          id: true,
          title: 'Verified Results & Case Studies',
          description: 'Specific view counts, average retention rates, or creator revenue milestones.',
          example: 'e.g. "50M+ views generated • 72% avg retention • 15+ creator channels scaled"',
          scoreWeight: '+25 PTS',
        },
      ],
      ctaOptions: [
        {
          id: false,
          title: 'Passive Contact ("DM for work")',
          description: 'No direct booking funnel, inquiry form, or structured portfolio link.',
          example: 'e.g. "DM for rates" or "Email in bio for inquiries"',
          scoreWeight: '0 PTS',
        },
        {
          id: true,
          title: 'Direct Booking / Showreel Funnel',
          description: 'Direct link to book a 15-min discovery call or review high-converting showreel.',
          example: 'e.g. "Book a 15-min discovery call" or "View my showreel portfolio"',
          scoreWeight: '+25 PTS',
        },
      ],
    };
  }

  if (s.includes('code') || s.includes('dev') || s.includes('tech') || s.includes('app') || c.includes('developer')) {
    return {
      headlineOptions: [
        {
          id: 'generic',
          title: 'Job Title Only',
          description: 'Basic developer title without business positioning or engineering impact.',
          example: 'e.g. "Freelance Full Stack Web Developer / React Dev"',
          scoreWeight: '0 PTS',
        },
        {
          id: 'skills',
          title: 'Tech Stack & Framework List',
          description: 'Lists programming languages and libraries rather than business solutions.',
          example: 'e.g. "React • TypeScript • Next.js • Tailwind • Node.js • PostgreSQL • AWS"',
          scoreWeight: '+10 PTS',
        },
        {
          id: 'authority',
          title: 'Architectural Outcome & Scale',
          description: 'Positions you as a high-value technical partner solving business bottlenecks.',
          example: 'e.g. "Architecting scalable web applications & MVPs for high-growth SaaS founders"',
          scoreWeight: '+25 PTS',
        },
      ],
      proofOptions: [
        {
          id: false,
          title: 'No Metrics or Generic Repos',
          description: 'No business impact metrics or production case studies highlighted.',
          example: 'e.g. "Clean coder who loves building cool software"',
          scoreWeight: '0 PTS',
        },
        {
          id: true,
          title: 'Verified Production Metrics',
          description: 'Documented user scale, latency reductions, or revenue-driving features.',
          example: 'e.g. "Shipped systems handling 100k+ MAU • 40% latency reduction • 99.9% uptime"',
          scoreWeight: '+25 PTS',
        },
      ],
      ctaOptions: [
        {
          id: false,
          title: 'Unstructured Contact',
          description: 'Lacks a direct route for prospective founders to book a scoping call.',
          example: 'e.g. "Reach out via email" or "Drop a message on Twitter"',
          scoreWeight: '0 PTS',
        },
        {
          id: true,
          title: 'Direct Scoping & Booking Funnel',
          description: 'Direct link to book an architecture consultation or inspect live client repos.',
          example: 'e.g. "Book a 15-min architecture audit" or "View production case studies"',
          scoreWeight: '+25 PTS',
        },
      ],
    };
  }

  if (s.includes('design') || s.includes('ui') || s.includes('figma') || c.includes('designer')) {
    return {
      headlineOptions: [
        {
          id: 'generic',
          title: 'Job Title Only',
          description: 'Generic design title that blends in with thousands of junior freelancers.',
          example: 'e.g. "Freelance UI/UX Designer | Product Designer"',
          scoreWeight: '0 PTS',
        },
        {
          id: 'skills',
          title: 'Software & Deliverable List',
          description: 'Lists design software rather than user conversion or product metrics.',
          example: 'e.g. "Figma • Design Systems • Wireframing • Prototyping • Mobile Apps"',
          scoreWeight: '+10 PTS',
        },
        {
          id: 'authority',
          title: 'Strategic Conversion Stance',
          description: 'Positions you as a design partner optimizing user conversion and retention.',
          example: 'e.g. "Designing high-converting SaaS interfaces & web apps that reduce churn"',
          scoreWeight: '+25 PTS',
        },
      ],
      proofOptions: [
        {
          id: false,
          title: 'Dribbble Mockups / No Metrics',
          description: 'Visual shots without business metrics, conversion data, or case studies.',
          example: 'e.g. "Passionate designer crafting beautiful user interfaces"',
          scoreWeight: '0 PTS',
        },
        {
          id: true,
          title: 'Conversion Proof & Case Studies',
          description: 'Measurable conversion uplifts, UX audits, or enterprise design systems.',
          example: 'e.g. "Redesigned checkout yielding +34% trial conversion for B2B SaaS clients"',
          scoreWeight: '+25 PTS',
        },
      ],
      ctaOptions: [
        {
          id: false,
          title: 'Passive Social Inquiry',
          description: 'No dedicated portfolio intake form or scheduling link.',
          example: 'e.g. "DM for project inquiries" or "Available for freelance work"',
          scoreWeight: '0 PTS',
        },
        {
          id: true,
          title: 'Direct Client Booking Funnel',
          description: 'Streamlined UX teardown call booking or case study walkthrough link.',
          example: 'e.g. "Book a 15-min UX teardown call" or "Explore interactive prototypes"',
          scoreWeight: '+25 PTS',
        },
      ],
    };
  }

  // Default / Agency / Consultant
  return {
    headlineOptions: [
      {
        id: 'generic',
        title: 'Job Title Only',
        description: 'Generic service provider title with low pricing power.',
        example: 'e.g. "Freelance Consultant | Digital Marketer | Specialist"',
        scoreWeight: '0 PTS',
      },
      {
        id: 'skills',
        title: 'Service & Skill List',
        description: 'Lists disconnected services rather than unified business solutions.',
        example: 'e.g. "Strategy • Social Media • Paid Ads • Brand Consulting • Funnels"',
        scoreWeight: '+10 PTS',
      },
      {
        id: 'authority',
        title: 'Strategic Client Outcome',
        description: 'Clear value proposition targeting specific client revenue or operational outcomes.',
        example: 'e.g. "Helping 7-figure businesses engineer predictable client acquisition pipelines"',
        scoreWeight: '+25 PTS',
      },
    ],
    proofOptions: [
      {
        id: false,
        title: 'Vague Claims / No Proof',
        description: 'General statements without specific ROI, revenue figures, or client logos.',
        example: 'e.g. "Proven track record of high-quality execution"',
        scoreWeight: '0 PTS',
      },
      {
        id: true,
        title: 'Verified Revenue & ROI Proof',
        description: 'Documented client case studies with concrete business impact.',
        example: 'e.g. "Generated $450k+ pipeline revenue across 14 client engagements"',
        scoreWeight: '+25 PTS',
      },
    ],
    ctaOptions: [
      {
        id: false,
        title: 'Unfocused Contact Info',
        description: 'Multiple confusing links or passive email mentions.',
        example: 'e.g. "Get in touch" or "Email me for project quotes"',
        scoreWeight: '0 PTS',
      },
      {
        id: true,
        title: 'Direct Strategy Call Funnel',
        description: 'Single high-converting call to action leading directly to calendar booking.',
        example: 'e.g. "Book a 15-min strategy session" or "Apply to work with me"',
        scoreWeight: '+25 PTS',
      },
    ],
  };
};

interface Props {
  profileSystem: ProfileSystemAsset[];
  headline: string;
  proofLine: string;
  uniqueMechanism: string;
  userName: string;
  userHandle: string;
  activeTone: string;
  recommendedPlatforms: string[];
  roleLabel?: string;
  serviceId?: string | null;
  careerTrackId?: string | null;
  onContinue: () => void;
}

// ── Score Ring Component ──────────────────────────────────────────────────────

function ScoreRing({ score, maxScore = 100, size = 150 }: { score: number | null; maxScore?: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const hasScore = score !== null;
  const percentage = hasScore ? Math.min((score as number) / maxScore, 1) : 0;
  const strokeDashoffset = hasScore ? circumference * (1 - percentage) : circumference;

  const getColor = () => {
    if (!hasScore) return { stroke: '#334155', text: 'text-neutral-500' };
    if ((score as number) >= 70) return { stroke: '#10b981', text: 'text-emerald-400' };
    if ((score as number) >= 40) return { stroke: '#d1f34d', text: 'text-[#d1f34d]' };
    return { stroke: '#f87171', text: 'text-red-400' };
  };

  const color = getColor();

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={7}
          className="text-neutral-800"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color.stroke}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={cn('text-4xl font-extrabold tracking-tight', color.text)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {hasScore ? score : '—'}
        </motion.span>
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">
          / {maxScore} PTS
        </span>
      </div>
    </div>
  );
}

// ── Main Section 1 Component ──────────────────────────────────────────────────

export const AuthorityAuditSection: React.FC<Props> = React.memo(({
  profileSystem,
  headline,
  proofLine,
  uniqueMechanism,
  userName,
  userHandle,
  activeTone,
  recommendedPlatforms,
  roleLabel,
  serviceId,
  careerTrackId,
  onContinue,
}) => {
  const roleConfig = useMemo(
    () => getRoleSensiblePlatforms(serviceId || headline, careerTrackId || uniqueMechanism),
    [serviceId, headline, careerTrackId, uniqueMechanism]
  );

  const roleQuiz = useMemo(
    () => getRoleQuizContent(serviceId || headline, careerTrackId || uniqueMechanism),
    [serviceId, headline, careerTrackId, uniqueMechanism]
  );

  const { stage1Audit, setStage1Audit } = useModule3Store();

  // Fallback defaults from role
  const defaultRecommended = useMemo(
    () => roleConfig.platforms.filter(p => p.recommended).map(p => p.key),
    [roleConfig]
  );

  // Read persisted state with fallback
  const selectedPlatforms = stage1Audit?.selectedPlatforms ?? defaultRecommended;
  const auditStep = (stage1Audit?.auditStep ?? 1) as 1 | 2 | 3;
  const auditMode = stage1Audit?.auditMode ?? 'quiz';
  const quizAnswers = stage1Audit?.quizAnswers ?? {
    headlineType: null,
    hasPinnedProof: null,
    hasSingleCta: null,
  };
  const pastedBio = stage1Audit?.pastedBio ?? '';
  const isBioAnalyzed = stage1Audit?.isBioAnalyzed ?? false;

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);

  const setSelectedPlatforms = useCallback((updateFn: string[] | ((prev: string[]) => string[])) => {
    const nextVal = typeof updateFn === 'function' ? updateFn(selectedPlatforms) : updateFn;
    setStage1Audit({ selectedPlatforms: nextVal });
  }, [selectedPlatforms, setStage1Audit]);

  const setAuditStep = useCallback((step: 1 | 2 | 3) => {
    setStage1Audit({ auditStep: step });
  }, [setStage1Audit]);

  const setAuditMode = useCallback((mode: 'quiz' | 'paste') => {
    setStage1Audit({ auditMode: mode });
  }, [setStage1Audit]);

  const setQuizAnswers = useCallback((updateFn: any) => {
    const nextVal = typeof updateFn === 'function' ? updateFn(quizAnswers) : updateFn;
    setStage1Audit({ quizAnswers: nextVal });
  }, [quizAnswers, setStage1Audit]);

  const setPastedBio = useCallback((val: string) => {
    setStage1Audit({ pastedBio: val });
  }, [setStage1Audit]);

  const setIsBioAnalyzed = useCallback((val: boolean) => {
    setStage1Audit({ isBioAnalyzed: val });
  }, [setStage1Audit]);

  const togglePlatform = (key: string) => {
    if (selectedPlatforms.includes(key)) {
      setSelectedPlatforms(selectedPlatforms.filter(k => k !== key));
    } else {
      setSelectedPlatforms([...selectedPlatforms, key]);
    }
  };

  const handleSelectAllRecommended = () => {
    setSelectedPlatforms(roleConfig.platforms.filter(p => p.recommended).map(p => p.key));
  };

  const handleClearPlatforms = () => {
    setSelectedPlatforms([]);
  };

  // Has user answered the questions in Step 2?
  const hasAnsweredQuestions = useMemo(() => {
    if (auditMode === 'paste') return false;
    return (
      quizAnswers.headlineType !== null &&
      quizAnswers.hasPinnedProof !== null &&
      quizAnswers.hasSingleCta !== null
    );
  }, [quizAnswers, auditMode]);

  // Has user interacted with the audit inputs yet?
  const hasInteracted = useMemo(() => {
    return selectedPlatforms.length > 0 || hasAnsweredQuestions;
  }, [selectedPlatforms, hasAnsweredQuestions]);

  // Compute live diagnostic score based on user's actual selections
  const diagnosticScore = useMemo<number | null>(() => {
    if (!hasInteracted) return null;

    let baseScore = 15;

    // Platform coverage (up to 20 pts)
    baseScore += Math.min(selectedPlatforms.length * 8, 20);

    if (auditMode === 'quiz') {
      if (quizAnswers.headlineType === 'authority') baseScore += 30;
      else if (quizAnswers.headlineType === 'skills') baseScore += 15;
      else if (quizAnswers.headlineType === 'generic') baseScore += 5;

      if (quizAnswers.hasPinnedProof === true) baseScore += 15;
      if (quizAnswers.hasSingleCta === true) baseScore += 15;
    } else {
      const bioText = (pastedBio || '').toLowerCase();
      if (bioText.length > 20) baseScore += 10;
      if (bioText.includes('help') || bioText.includes('scale') || bioText.includes('system') || bioText.includes('engineer')) baseScore += 15;
      if (bioText.includes('http') || bioText.includes('link') || bioText.includes('book') || bioText.includes('dm')) baseScore += 15;
      if (isBioAnalyzed && bioText.length > 50) baseScore += 15;
    }

    return Math.min(baseScore, 95);
  }, [hasInteracted, selectedPlatforms, auditMode, quizAnswers, pastedBio, isBioAnalyzed]);

  const timersRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const handleStartAnalysis = useCallback(() => {
    setAuditStep(3);
    setIsAnalyzing(true);
    setAnalysisStep(1);

    const t1 = setTimeout(() => setAnalysisStep(2), 600);
    const t2 = setTimeout(() => setAnalysisStep(3), 1200);
    const t3 = setTimeout(() => {
      setIsAnalyzing(false);
      if (diagnosticScore !== null) {
        setStage1Audit({ diagnosticScore, completedAt: new Date().toISOString() });
      }
    }, 1800);

    timersRef.current = [t1, t2, t3];
  }, [setAuditStep, diagnosticScore, setStage1Audit]);

  // Dimension Bars calculation
  const dimensions = useMemo(() => {
    const isAuth = quizAnswers.headlineType === 'authority' || pastedBio.length > 50;
    return [
      {
        label: 'Positioning & Headline Clarity',
        score: quizAnswers.headlineType === null && !isBioAnalyzed ? 0 : isAuth ? 22 : quizAnswers.headlineType === 'skills' ? 14 : 7,
        max: 25,
        desc: quizAnswers.headlineType === null ? 'Select your current headline style' : isAuth ? 'Clear strategic authority stance' : 'Currently generic worker positioning',
      },
      {
        label: 'Channel Architecture & Relevance',
        score: Math.min(selectedPlatforms.length * 8, 25),
        max: 25,
        desc: selectedPlatforms.length === 0 ? 'No channels selected yet' : `${selectedPlatforms.length} active platforms aligned for ${roleConfig.roleTitle}`,
      },
      {
        label: 'Social Proof & Evidence Placement',
        score: quizAnswers.hasPinnedProof === null ? 0 : quizAnswers.hasPinnedProof ? 21 : 6,
        max: 25,
        desc: quizAnswers.hasPinnedProof === null ? 'Select proof state above' : quizAnswers.hasPinnedProof ? 'Evidence accessible on profile' : 'Zero pinned verifiable proof assets',
      },
      {
        label: 'Conversion CTA & Funnel Link',
        score: quizAnswers.hasSingleCta === null ? 0 : quizAnswers.hasSingleCta ? 22 : 8,
        max: 25,
        desc: quizAnswers.hasSingleCta === null ? 'Select CTA state above' : quizAnswers.hasSingleCta ? 'Single clear call to action' : 'No direct booking or portfolio funnel link',
      },
    ];
  }, [quizAnswers, pastedBio, isBioAnalyzed, selectedPlatforms, roleConfig.roleTitle]);

  return (
    <div className="w-full space-y-6 text-left font-sans">
      <AnimatePresence mode="wait">
        {/* ── SUB-STEP 1: PLATFORM CHANNEL SELECTION ────────────────────────── */}
        {auditStep === 1 && (
          <motion.div
            key="tab-channels"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
            className="space-y-6"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Curated for {roleConfig.roleTitle}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0b1c30]">
                Which platforms do you currently use or plan to build your presence on?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-xl">
                Select the primary channels where prospective clients find and evaluate your services.
              </p>
            </div>

            {/* Action Controls */}
            <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllRecommended}
                  className="text-xs font-bold text-[#0058be] hover:text-[#0047a0] transition-colors cursor-pointer bg-blue-50/60 hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200"
                >
                  + Select All Recommended
                </button>
                {selectedPlatforms.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearPlatforms}
                    className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors cursor-pointer px-2.5 py-1.5"
                  >
                    Clear
                  </button>
                )}
              </div>
              <span className="text-xs text-neutral-500 font-semibold">
                {selectedPlatforms.length} / {roleConfig.platforms.length} channels selected
              </span>
            </div>

            {/* Platform Grid (Clean SVG Icons + Selected State) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {roleConfig.platforms.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform.key);
                const Icon = platform.icon;

                return (
                  <button
                    key={platform.key}
                    type="button"
                    onClick={() => togglePlatform(platform.key)}
                    className={cn(
                      'p-4.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group',
                      isSelected
                        ? 'bg-blue-50/70 border-2 border-[#0058be] shadow-sm ring-2 ring-[#0058be]/10'
                        : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/60'
                    )}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            'p-2 rounded-xl border transition-colors',
                            isSelected ? 'bg-white border-blue-200 shadow-2xs' : 'bg-neutral-50 border-neutral-200'
                          )}>
                            <Icon />
                          </div>
                          <div>
                            <span className="font-bold text-xs sm:text-sm text-[#0b1c30] block">{platform.name}</span>
                            <span className="text-[10px] text-neutral-400 font-medium">{platform.category}</span>
                          </div>
                        </div>

                        {/* Selection Check Circle */}
                        <div className={cn(
                          'w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0',
                          isSelected
                            ? 'bg-[#0058be] border-[#0058be] text-white shadow-2xs'
                            : 'border-neutral-300 bg-white group-hover:border-neutral-400'
                        )}>
                          {isSelected ? (
                            <Check size={12} strokeWidth={3} />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-200 group-hover:bg-neutral-300" />
                          )}
                        </div>
                      </div>

                      {/* Role Benefit */}
                      <p className="text-[11px] text-neutral-600 leading-relaxed">
                        {platform.benefit}
                      </p>
                    </div>

                    <div className="space-y-2 pt-1 border-t border-neutral-100">
                      {/* High-Ticket Client Signal */}
                      <div className="text-[10px] text-neutral-500 font-medium flex items-start gap-1.5">
                        <Zap size={11} className={cn("shrink-0 mt-0.5", isSelected ? "text-[#0058be]" : "text-amber-500")} />
                        <span className="line-clamp-2">{platform.clientSignal}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-full',
                          isSelected
                            ? 'bg-blue-100/80 text-[#0058be]'
                            : platform.recommended
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-neutral-100 text-neutral-500'
                        )}>
                          {isSelected ? '✓ Active Target Channel' : platform.recommended ? '★ Core Recommended' : 'Optional Channel'}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Action Footer for Step 1 */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
              <span className="text-xs text-neutral-400 font-medium">
                {selectedPlatforms.length > 0
                  ? `${selectedPlatforms.length} platform(s) selected. Ready to configure diagnostic.`
                  : 'Select at least 1 platform above to continue.'}
              </span>
              <ModuleButton
                variant="primary"
                disabled={selectedPlatforms.length === 0}
                onClick={() => setAuditStep(2)}
              >
                Continue to Diagnostic Quiz →
              </ModuleButton>
            </div>
          </motion.div>
        )}

        {/* ── SUB-STEP 2: DIAGNOSTIC QUIZ (HONEST BASELINE) ─────────────────── */}
        {auditStep === 2 && (
          <motion.div
            key="tab-diagnostic"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
            className="space-y-6"
          >
            <div className="space-y-3">
              {/* Top Navigation Row: Back Link on Left + Mode Selector on Right */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setAuditStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-[#0058be] transition-colors cursor-pointer group py-1"
                >
                  <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-neutral-400 group-hover:text-[#0058be]" />
                  <span>Back to Channels</span>
                  {selectedPlatforms.length > 0 && (
                    <span className="text-[10px] font-bold text-[#0058be] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 ml-0.5">
                      {selectedPlatforms.length} selected
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setAuditMode('quiz')}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                      auditMode === 'quiz' ? 'bg-white text-[#0058be] shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
                    )}
                  >
                    <HelpCircle size={12} />
                    <span>3-Question Diagnostic (Active)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuditMode('paste')}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                      auditMode === 'paste' ? 'bg-white text-[#0058be] shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
                    )}
                  >
                    <Sparkles size={12} className="text-[#0058be]" />
                    <span>Direct Bio Scan</span>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-blue-100/70 text-[#0058be] rounded-md">
                      Sync
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0b1c30]">
                  How is your current social presence structured?
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-xl mt-1">
                  Answer 3 quick questions about your current profiles or paste your bio to benchmark your authority score.
                </p>
              </div>
            </div>

            {/* Option A: Quick 3-Question Honest Diagnostic */}
            {auditMode === 'quiz' && (
              <div className="space-y-4 pt-1">
                {/* Question 1: Headline */}
                <div className="p-5 sm:p-6 rounded-3xl bg-white border border-neutral-200 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-[#0058be]/10 text-[#0058be] text-xs font-black flex items-center justify-center">
                      01
                    </span>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#0b1c30]">
                        What does your main profile headline look like?
                      </h3>
                      <p className="text-xs text-neutral-500">
                        Select the format closest to how you currently introduce yourself on social channels.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    {roleQuiz.headlineOptions.map((item) => {
                      const isSelected = quizAnswers.headlineType === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setQuizAnswers(prev => ({ ...prev, headlineType: item.id }))}
                          aria-selected={isSelected}
                          className={cn(
                            'p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group',
                            isSelected
                              ? 'bg-blue-50/70 border-2 border-[#0058be] ring-2 ring-[#0058be]/15 shadow-sm'
                              : 'bg-white border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/60'
                          )}
                        >
                          <div className="flex items-center gap-2.5 w-full">
                            <div className={cn(
                              'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                              isSelected ? 'border-[#0058be] bg-[#0058be]' : 'border-neutral-300 bg-white group-hover:border-neutral-400'
                            )}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <span className="font-bold text-xs text-[#0b1c30]">{item.title}</span>
                          </div>

                          <p className="text-[11px] text-neutral-500 leading-relaxed">
                            {item.description}
                          </p>

                          <div className="p-3 rounded-xl bg-neutral-50/90 border border-neutral-200/70 text-xs text-neutral-700 font-medium leading-relaxed">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                              Example Format
                            </span>
                            <span>{item.example.replace(/^e\.g\.\s*/, '')}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question 2: Featured Social Proof */}
                <div className="p-5 sm:p-6 rounded-3xl bg-white border border-neutral-200 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-[#0058be]/10 text-[#0058be] text-xs font-black flex items-center justify-center">
                      02
                    </span>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#0b1c30]">
                        Do you have verified proof, numbers, or pinned case studies?
                      </h3>
                      <p className="text-xs text-neutral-500">
                        High-ticket clients look for tangible proof metrics before reaching out.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {roleQuiz.proofOptions.map((item) => {
                      const isSelected = quizAnswers.hasPinnedProof === item.id;
                      return (
                        <button
                          key={String(item.id)}
                          type="button"
                          onClick={() => setQuizAnswers(prev => ({ ...prev, hasPinnedProof: item.id }))}
                          aria-selected={isSelected}
                          className={cn(
                            'p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group',
                            isSelected
                              ? 'bg-blue-50/70 border-2 border-[#0058be] ring-2 ring-[#0058be]/15 shadow-sm'
                              : 'bg-white border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/60'
                          )}
                        >
                          <div className="flex items-center gap-2.5 w-full">
                            <div className={cn(
                              'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                              isSelected
                                ? 'border-[#0058be] bg-[#0058be]'
                                : 'border-neutral-300 bg-white group-hover:border-neutral-400'
                            )}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <span className="font-bold text-xs text-[#0b1c30]">{item.title}</span>
                          </div>

                          <p className="text-[11px] text-neutral-500 leading-relaxed">
                            {item.description}
                          </p>

                          <div className="p-3 rounded-xl bg-neutral-50/90 border border-neutral-200/70 text-xs text-neutral-700 font-medium leading-relaxed">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                              Example Format
                            </span>
                            <span>{item.example.replace(/^e\.g\.\s*/, '')}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question 3: CTA & Funnel Link */}
                <div className="p-5 sm:p-6 rounded-3xl bg-white border border-neutral-200 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-[#0058be]/10 text-[#0058be] text-xs font-black flex items-center justify-center">
                      03
                    </span>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#0b1c30]">
                        Where does your profile link direct prospective clients?
                      </h3>
                      <p className="text-xs text-neutral-500">
                        A frictionless conversion funnel turns profile visitors into scheduled client discovery calls.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {roleQuiz.ctaOptions.map((item) => {
                      const isSelected = quizAnswers.hasSingleCta === item.id;
                      return (
                        <button
                          key={String(item.id)}
                          type="button"
                          onClick={() => setQuizAnswers(prev => ({ ...prev, hasSingleCta: item.id }))}
                          aria-selected={isSelected}
                          className={cn(
                            'p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group',
                            isSelected
                              ? 'bg-blue-50/70 border-2 border-[#0058be] ring-2 ring-[#0058be]/15 shadow-sm'
                              : 'bg-white border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/60'
                          )}
                        >
                          <div className="flex items-center gap-2.5 w-full">
                            <div className={cn(
                              'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                              isSelected
                                ? 'border-[#0058be] bg-[#0058be]'
                                : 'border-neutral-300 bg-white group-hover:border-neutral-400'
                            )}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <span className="font-bold text-xs text-[#0b1c30]">{item.title}</span>
                          </div>

                          <p className="text-[11px] text-neutral-500 leading-relaxed">
                            {item.description}
                          </p>

                          <div className="p-3 rounded-xl bg-neutral-50/90 border border-neutral-200/70 text-xs text-neutral-700 font-medium leading-relaxed">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                              Example Format
                            </span>
                            <span>{item.example.replace(/^e\.g\.\s*/, '')}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Option B: Feature 1 — Intelligent Bio Analyzer (Heuristic AI) */}
            {auditMode === 'paste' && (
              <div className="space-y-4">
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-neutral-900 via-[#0b1c30] to-[#0a2540] border border-white/10 shadow-xl text-white space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-[#d1f34d]" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#d1f34d]">
                        Bio Intelligence Scanner
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                      Heuristic Engine v3.0
                    </span>
                  </div>

                  <div className="space-y-2 max-w-2xl">
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                      Paste Your Current Bio for Instant Analysis
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      Copy your current LinkedIn headline, Twitter bio, or any platform bio below. We'll scan it for authority signals, proof patterns, and conversion gaps.
                    </p>
                  </div>

                  {/* Bio Textarea */}
                  <textarea
                    value={pastedBio}
                    onChange={(e) => setPastedBio(e.target.value)}
                    placeholder={'Paste your current bio here...\n\nExample: "Full-stack developer | React, Node, AWS | Open to freelance projects | Coffee lover ☕"'}
                    rows={4}
                    className="w-full text-sm text-white bg-white/5 border border-white/15 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#d1f34d]/30 focus:border-[#d1f34d]/50 transition-all resize-none leading-relaxed placeholder:text-white/25"
                  />

                  {pastedBio.trim().length > 0 && !isBioAnalyzed && (
                    <ModuleButton
                      variant="primary"
                      onClick={() => setIsBioAnalyzed(true)}
                    >
                      <Sparkles size={14} className="mr-1.5" />
                      Scan Bio for Authority Signals →
                    </ModuleButton>
                  )}
                </div>

                {/* Feature 1: Bio Feedback Cards */}
                {isBioAnalyzed && pastedBio.trim().length > 10 && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2 px-1">
                      <Shield size={14} className="text-[#0058be]" />
                      <span className="text-xs font-bold text-[#0b1c30]">Bio Intelligence Report</span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {analyzeBioHeuristic(pastedBio).filter(f => f.type === 'positive').length} strengths found
                      </span>
                    </div>
                    {analyzeBioHeuristic(pastedBio).map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className={cn(
                          'p-4 rounded-2xl border flex items-start gap-3',
                          item.type === 'positive' ? 'bg-emerald-50/70 border-emerald-200' :
                          item.type === 'warning' ? 'bg-amber-50/70 border-amber-200' :
                          'bg-red-50/70 border-red-200'
                        )}
                      >
                        {item.type === 'positive' ? <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" /> :
                         item.type === 'warning' ? <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" /> :
                         <XCircle size={16} className="text-red-600 shrink-0 mt-0.5" />}
                        <div className="space-y-0.5">
                          <span className={cn(
                            'text-xs font-bold',
                            item.type === 'positive' ? 'text-emerald-800' :
                            item.type === 'warning' ? 'text-amber-800' :
                            'text-red-800'
                          )}>{item.message}</span>
                          <p className="text-[11px] text-neutral-600 leading-relaxed">{item.detail}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            )}

            {/* Action Footer for Step 2 */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setAuditStep(1)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer px-2.5 py-1.5 rounded-xl hover:bg-neutral-100"
              >
                <ArrowLeft size={13} />
                <span>Back to Channels</span>
              </button>
              {auditMode === 'paste' ? (
                <div className="flex items-center gap-3">
                  {isBioAnalyzed && pastedBio.trim().length > 10 && (
                    <ModuleButton
                      variant="primary"
                      onClick={handleStartAnalysis}
                    >
                      View Authority Scorecard →
                    </ModuleButton>
                  )}
                  {!isBioAnalyzed && (
                    <ModuleButton
                      variant="secondary"
                      onClick={() => setAuditMode('quiz')}
                    >
                      Switch to Diagnostic Quiz →
                    </ModuleButton>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {!hasAnsweredQuestions && (
                    <span className="text-xs text-neutral-400 font-medium hidden sm:inline-block">
                      Answer all 3 questions to calculate score
                    </span>
                  )}
                  <ModuleButton
                    variant="primary"
                    disabled={!hasAnsweredQuestions}
                    onClick={handleStartAnalysis}
                  >
                    Analyze Presence & Calculate Score →
                  </ModuleButton>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── SUB-STEP 3: SCANNING & REALITY SCORECARD ──────────────────────── */}
        {auditStep === 3 && (
          <motion.div
            key="tab-scorecard"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
            className="space-y-6"
          >
            {/* Top Navigation Row for Step 3 */}
            {!isAnalyzing && (
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setAuditStep(2)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-[#0058be] transition-colors cursor-pointer group py-1"
                >
                  <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-neutral-400 group-hover:text-[#0058be]" />
                  <span>Back to Diagnostic Answers</span>
                </button>
              </div>
            )}

            {isAnalyzing ? (
              /* Scanning Animation State — Feature 2: Deep-Scan Analysis Phases */
              <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0a1e35] via-[#0f2b4a] to-[#1a3a5c] border border-white/15 shadow-2xl text-white flex flex-col items-center justify-center space-y-6 text-center">
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-3 border-white/10 border-t-[#d1f34d] animate-spin" />
                  <Shield size={24} className="text-[#d1f34d] absolute" />
                </div>

                <div className="space-y-1 max-w-md">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    Running Authority Diagnostic Audit...
                  </h3>
                  <p className="text-xs text-white/60">
                    Evaluating your profile posture against high-ticket client conversion benchmarks.
                  </p>
                </div>

                {/* Feature 2: Contextual Phase Messages */}
                <div className="w-full max-w-md space-y-2.5 bg-black/30 p-4 rounded-2xl border border-white/10 text-left">
                  <div className={cn("flex items-center gap-2.5 text-xs transition-all", analysisStep >= 1 ? "text-white" : "text-white/30")}>
                    {analysisStep >= 2 ? <Check size={14} className="text-emerald-400 shrink-0 stroke-[3]" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current shrink-0 animate-pulse" />}
                    <span className="font-medium">Scanning headline positioning keywords for {roleConfig.roleTitle}...</span>
                  </div>
                  <div className={cn("flex items-center gap-2.5 text-xs transition-all", analysisStep >= 2 ? "text-white" : "text-white/30")}>
                    {analysisStep >= 3 ? <Check size={14} className="text-emerald-400 shrink-0 stroke-[3]" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current shrink-0 animate-pulse" />}
                    <span className="font-medium">Analyzing social proof signals across {selectedPlatforms.length} active platform{selectedPlatforms.length !== 1 ? 's' : ''}...</span>
                  </div>
                  <div className={cn("flex items-center gap-2.5 text-xs transition-all", analysisStep >= 3 ? "text-white" : "text-white/30")}>
                    {analysisStep >= 3 ? <Check size={14} className="text-[#d1f34d] shrink-0 stroke-[3]" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current shrink-0" />}
                    <span className="font-medium">Calibrating authority score against {roleConfig.roleTitle} benchmarks...</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Revealed Reality Scorecard */
              <>
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0a1e35] via-[#0f2b4a] to-[#1a3a5c] border border-white/15 shadow-xl text-white space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-[#d1f34d]" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#d1f34d]">
                        Authority Reality Scorecard
                      </span>
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/80 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                      {(diagnosticScore ?? 0) < 50 ? 'High Drop-Off Risk' : 'Moderate Authority'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Left: Score Ring */}
                    <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-3">
                      <ScoreRing score={diagnosticScore} />
                      <div className="text-center space-y-0.5">
                        <h4 className="text-xs font-bold text-white">Current Social Baseline</h4>
                        <p className="text-[10px] text-white/60">
                          Calculated from your active channels & profile posture
                        </p>
                      </div>
                      {/* Feature 3: Role Benchmark Comparison */}
                      {(() => {
                        const bench = getRoleBenchmarks(serviceId || null, careerTrackId || null);
                        const sc = diagnosticScore ?? 0;
                        return (
                          <div className="w-full mt-3 p-3 rounded-xl bg-black/30 border border-white/10 space-y-2">
                            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-white/50">
                              <TrendingUp size={11} className="text-[#d1f34d]" />
                              <span>{bench.roleLabel} Benchmark</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                                <span className="text-lg font-black text-white/60 block">{bench.average}</span>
                                <span className="text-[9px] text-white/40 font-bold">Average</span>
                              </div>
                              <div className={cn('p-2 rounded-lg border', sc >= bench.average ? 'bg-[#d1f34d]/10 border-[#d1f34d]/30' : 'bg-red-500/10 border-red-500/20')}>
                                <span className={cn('text-lg font-black block', sc >= bench.average ? 'text-[#d1f34d]' : 'text-red-400')}>{sc}</span>
                                <span className="text-[9px] text-white/60 font-bold">You</span>
                              </div>
                              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <span className="text-lg font-black text-emerald-400 block">{bench.topPerformer}</span>
                                <span className="text-[9px] text-white/40 font-bold">Top Performer</span>
                              </div>
                            </div>
                            <p className="text-[10px] text-white/40 text-center">
                              {sc < bench.average ? `You're ${bench.average - sc} pts below the average ${bench.roleLabel.toLowerCase()}. Let's fix that →` : sc < bench.topPerformer ? `${bench.topPerformer - sc} pts away from top performer status` : 'You\'re outperforming top benchmarks!'}
                            </p>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Right: 4 Dimension Status Bars */}
                    <div className="lg:col-span-8 space-y-3.5">
                      {dimensions.map((dim, idx) => {
                        const pct = dim.score > 0 ? Math.round((dim.score / dim.max) * 100) : 0;
                        const isHigh = pct >= 70;
                        const isMid = pct >= 40;

                        return (
                          <div key={idx} className="space-y-1 bg-black/25 backdrop-blur-sm p-3.5 rounded-2xl border border-white/5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-white/90">{dim.label}</span>
                              <span className={cn('font-black font-mono', dim.score === 0 ? 'text-white/40' : isHigh ? 'text-[#d1f34d]' : isMid ? 'text-amber-300' : 'text-red-400')}>
                                {dim.score > 0 ? `${dim.score}/${dim.max}` : `— / ${dim.max}`}
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                className={cn('h-full rounded-full', isHigh ? 'bg-[#d1f34d]' : isMid ? 'bg-amber-400' : 'bg-red-400')}
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, ease: EASING.PREMIUM }}
                              />
                            </div>
                            <p className="text-[10px] text-white/50">{dim.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic Gap Statement Box */}
                  <div className="p-4.5 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3">
                    <AlertTriangle size={18} className="text-[#d1f34d] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white">
                        Client Perception Diagnosis
                      </h4>
                      <p className="text-[11px] text-white/70 leading-relaxed">
                        When high-ticket clients ($3,000+) evaluate your profile, they make a hiring decision in under 5 seconds. Generic titles and missing proof assets lead to immediate drop-off. In the next steps, we will engineer a unified, authority-positioned presence across all your channels.
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── ACTION FOOTER ────────────────────────────────────────────────── */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setAuditStep(2)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer px-3 py-2 rounded-xl hover:bg-neutral-100"
                  >
                    <ArrowLeft size={13} />
                    <span>Adjust Answers & Re-audit</span>
                  </button>
                  <ModuleButton
                    variant="primary"
                    onClick={onContinue}
                  >
                    Continue to Identity Foundation →
                  </ModuleButton>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

AuthorityAuditSection.displayName = 'AuthorityAuditSection';
