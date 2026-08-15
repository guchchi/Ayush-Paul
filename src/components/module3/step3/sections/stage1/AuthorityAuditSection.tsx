/**
 * Section 1: Authority Audit (Role-Smart & Interactive Reality Check)
 * 
 * Flow:
 *  1A. Channel Selection — "Select your active or target platforms" (Role-tailored with official SVGs).
 *  1B. Diagnostic Baseline — 3-Question Honest Diagnostic OR Direct Bio Paste.
 *  1C. Live Scorecard — Apple Watch style SVG Score Ring (0-100), 4 Dimension Bars & Gap Analysis.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { EASING, DURATION } from '@/src/lib/motion-presets';
import type { ProfileSystemAsset } from '@/src/data/module3/authority-suite-engine';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Sparkles,
  Zap,
  FileText,
  HelpCircle,
  Plus,
  Check,
} from 'lucide-react';
import { ModuleButton } from '@/src/components/workspace/ModuleButton';

// ── Official Lightweight SVG Brand Icons ──────────────────────────────────────

const BrandIcons = {
  LinkedIn: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#0A66C2]">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  ),
  YouTube: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#FF0000]">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  Instagram: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#E4405F]">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  GitHub: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#0b1c30]">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  ),
  Twitter: () => (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-black">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  Figma: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4">
      <path fill="#0ACF83" d="M12 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0z"/>
      <path fill="#A259FF" d="M6 18a3 3 0 0 1 3-3h3v3a3 3 0 0 1-3 3 3 3 0 0 1-3-3z"/>
      <path fill="#F24E1E" d="M6 6a3 3 0 0 1 3-3h3v6H9a3 3 0 0 1-3-3z"/>
      <path fill="#FF7262" d="M12 3h3a3 3 0 0 1 0 6h-3V3z"/>
      <path fill="#1ABCFE" d="M6 12a3 3 0 0 1 3-3h3v6H9a3 3 0 0 1-3-3z"/>
    </svg>
  ),
  Behance: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#1769FF]">
      <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.171 3-3.455 0-5.555-2.226-5.555-5.69 0-3.328 2.055-5.69 5.378-5.69 3.447 0 5.164 2.26 5.164 5.352 0 .61-.061 1.155-.098 1.408h-7.79c.123 1.776 1.405 2.768 3.082 2.768 1.341 0 2.247-.648 2.705-1.579l2.285.431zm-7.986-4.664h5.188c-.126-1.516-1.127-2.316-2.584-2.316-1.503 0-2.457.877-2.604 2.316zm-8.74 7.664h-7v-16h7.625c2.457 0 4.375 1.111 4.375 3.625 0 1.488-.724 2.586-1.927 3.125 1.624.512 2.427 1.879 2.427 3.525 0 3.016-2.292 5.725-5.5 5.725zm-4.375-9.375h3.875c1.47 0 2.25-.662 2.25-1.875s-.78-1.75-2.25-1.75h-3.875v3.625zm0 6.75h4.125c1.54 0 2.375-.765 2.375-2.125s-.835-2.125-2.375-2.125h-4.125v4.25z"/>
    </svg>
  ),
};

interface RolePlatformConfig {
  key: string;
  name: string;
  category: string;
  icon: React.ComponentType;
  recommended: boolean;
}

const getRoleSensiblePlatforms = (serviceId: string | null, careerTrackId: string | null): { roleTitle: string; platforms: RolePlatformConfig[] } => {
  const s = (serviceId || '').toLowerCase();
  const c = (careerTrackId || '').toLowerCase();

  if (s.includes('edit') || s.includes('video') || s.includes('motion') || c.includes('editor')) {
    return {
      roleTitle: 'Video Editor & Motion Specialist',
      platforms: [
        { key: 'youtube', name: 'YouTube Showreel', category: 'Showcase Channel', icon: BrandIcons.YouTube, recommended: true },
        { key: 'instagram', name: 'Instagram (Reels)', category: 'Short-Form Clips', icon: BrandIcons.Instagram, recommended: true },
        { key: 'twitter', name: 'X / Twitter', category: 'Creator Authority', icon: BrandIcons.Twitter, recommended: true },
        { key: 'behance', name: 'Behance / Vimeo', category: 'Portfolio Reel', icon: BrandIcons.Behance, recommended: false },
      ],
    };
  }

  if (s.includes('code') || s.includes('dev') || s.includes('tech') || s.includes('app') || c.includes('developer')) {
    return {
      roleTitle: 'Software Developer & Technical Architect',
      platforms: [
        { key: 'github', name: 'GitHub Profile', category: 'Code Proof & Repos', icon: BrandIcons.GitHub, recommended: true },
        { key: 'linkedin', name: 'LinkedIn Executive', category: 'B2B Client Stance', icon: BrandIcons.LinkedIn, recommended: true },
        { key: 'twitter', name: 'X / Twitter', category: 'Tech Build-in-Public', icon: BrandIcons.Twitter, recommended: true },
      ],
    };
  }

  if (s.includes('design') || s.includes('ui') || s.includes('figma') || c.includes('designer')) {
    return {
      roleTitle: 'UI/UX & Product Designer',
      platforms: [
        { key: 'behance', name: 'Figma / Behance Space', category: 'Design Systems', icon: BrandIcons.Figma, recommended: true },
        { key: 'linkedin', name: 'LinkedIn Professional', category: 'Enterprise Clients', icon: BrandIcons.LinkedIn, recommended: true },
        { key: 'twitter', name: 'X / Twitter', category: 'Design Community', icon: BrandIcons.Twitter, recommended: true },
        { key: 'instagram', name: 'Instagram Portfolio', category: 'Visual Carousel', icon: BrandIcons.Instagram, recommended: false },
      ],
    };
  }

  // Default / Agency / Consultant
  return {
    roleTitle: 'Authority Specialist & Consultant',
    platforms: [
      { key: 'linkedin', name: 'LinkedIn Profile', category: 'Executive Authority', icon: BrandIcons.LinkedIn, recommended: true },
      { key: 'twitter', name: 'X / Twitter', category: 'Audience & Growth', icon: BrandIcons.Twitter, recommended: true },
      { key: 'youtube', name: 'YouTube Channel', category: 'Long-form Video', icon: BrandIcons.YouTube, recommended: false },
      { key: 'instagram', name: 'Instagram', category: 'Visual Stance', icon: BrandIcons.Instagram, recommended: false },
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

  // Step 1A: Selected platforms state (STARTS UNSELECTED / CLEAN)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  // Sub-step phase: 'inputs' -> 'analyzing' -> 'scorecard'
  const [auditPhase, setAuditPhase] = useState<'inputs' | 'analyzing' | 'scorecard'>('inputs');
  const [analysisStep, setAnalysisStep] = useState<number>(0);

  // Step 1B: Diagnostic Audit Mode (Quiz vs. Paste Text)
  const [auditMode, setAuditMode] = useState<'quiz' | 'paste'>('quiz');

  // Quiz Responses (STARTS UNSELECTED / NULL)
  const [quizAnswers, setQuizAnswers] = useState<{
    headlineType: string | null;
    hasPinnedProof: boolean | null;
    hasSingleCta: boolean | null;
  }>({
    headlineType: null,
    hasPinnedProof: null,
    hasSingleCta: null,
  });

  // Raw Bio Paste State (STARTS CLEAN)
  const [pastedBio, setPastedBio] = useState('');
  const [isBioAnalyzed, setIsBioAnalyzed] = useState(false);

  const togglePlatform = (key: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(key)) {
        return prev.filter(k => k !== key);
      }
      return [...prev, key];
    });
  };

  const handleSelectAllRecommended = () => {
    setSelectedPlatforms(roleConfig.platforms.filter(p => p.recommended).map(p => p.key));
  };

  const handleClearPlatforms = () => {
    setSelectedPlatforms([]);
  };

  // Has user interacted with the audit inputs yet?
  const hasInteracted = useMemo(() => {
    return (
      selectedPlatforms.length > 0 ||
      quizAnswers.headlineType !== null ||
      quizAnswers.hasPinnedProof !== null ||
      quizAnswers.hasSingleCta !== null ||
      pastedBio.trim().length > 0
    );
  }, [selectedPlatforms, quizAnswers, pastedBio]);

  const handleStartAnalysis = useCallback(() => {
    setAuditPhase('analyzing');
    setAnalysisStep(1);

    const t1 = setTimeout(() => setAnalysisStep(2), 600);
    const t2 = setTimeout(() => setAnalysisStep(3), 1200);
    const t3 = setTimeout(() => setAuditPhase('scorecard'), 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

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
    <div className="w-full space-y-8 text-left font-sans">
      <AnimatePresence mode="wait">
        {/* ── PHASE 1: INPUTS (STEP 1A + STEP 1B) ────────────────────────────── */}
        {auditPhase === 'inputs' && (
          <motion.div
            key="inputs-phase"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
            className="space-y-8"
          >
            {/* ── 1A. ROLE-SMART PLATFORM SELECTION ───────────────────────────── */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#0058be]">
                    Step 1A: Target Channels
                  </span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {roleConfig.platforms.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform.key);
                  const Icon = platform.icon;

                  return (
                    <button
                      key={platform.key}
                      type="button"
                      onClick={() => togglePlatform(platform.key)}
                      className={cn(
                        'p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[115px] relative group',
                        isSelected
                          ? 'bg-blue-50/70 border-2 border-[#0058be] shadow-sm ring-2 ring-[#0058be]/10'
                          : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/60'
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            'p-2 rounded-xl border transition-colors',
                            isSelected ? 'bg-white border-blue-200 shadow-2xs' : 'bg-neutral-50 border-neutral-200'
                          )}>
                            <Icon />
                          </div>
                          <span className="font-bold text-xs text-[#0b1c30]">{platform.name}</span>
                        </div>

                        {/* Selection Check Circle */}
                        <div className={cn(
                          'w-5 h-5 rounded-full border flex items-center justify-center transition-all',
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

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[10px] text-neutral-400 font-medium">
                          {platform.category}
                        </span>
                        <span className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-full',
                          isSelected
                            ? 'bg-blue-100/80 text-[#0058be]'
                            : platform.recommended
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-neutral-100 text-neutral-500'
                        )}>
                          {isSelected ? 'Active Channel' : platform.recommended ? 'Recommended' : 'Optional'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── 1B. CURRENT STATE HONEST DIAGNOSTIC ──────────────────────────── */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#0058be]">
                    Step 1B: Current Profile Structure
                  </span>

                  <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200">
                    <button
                      type="button"
                      onClick={() => setAuditMode('quiz')}
                      className={cn(
                        'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                        auditMode === 'quiz' ? 'bg-white text-[#0058be] shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
                      )}
                    >
                      <HelpCircle size={12} />
                      <span>3-Question Diagnostic</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuditMode('paste')}
                      className={cn(
                        'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                        auditMode === 'paste' ? 'bg-white text-[#0058be] shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
                      )}
                    >
                      <FileText size={12} />
                      <span>Paste Current Bio</span>
                    </button>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0b1c30]">
                  How is your current social presence structured?
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-xl">
                  Answer 3 quick questions about your current profiles or paste your bio to reveal your baseline authority score.
                </p>
              </div>

              {/* Option A: Quick 3-Question Honest Diagnostic */}
              {auditMode === 'quiz' && (
                <div className="space-y-4 pt-1">
                  {/* Question 1: Headline */}
                  <div className="p-5 sm:p-6 rounded-3xl bg-white border border-neutral-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
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
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 hidden sm:block">
                        Question 1 of 3
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                      {roleQuiz.headlineOptions.map((item) => {
                        const isSelected = quizAnswers.headlineType === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setQuizAnswers(prev => ({ ...prev, headlineType: item.id }))}
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
                    <div className="flex items-center justify-between">
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
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 hidden sm:block">
                        Question 2 of 3
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {roleQuiz.proofOptions.map((item) => {
                        const isSelected = quizAnswers.hasPinnedProof === item.id;
                        return (
                          <button
                            key={String(item.id)}
                            type="button"
                            onClick={() => setQuizAnswers(prev => ({ ...prev, hasPinnedProof: item.id }))}
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
                    <div className="flex items-center justify-between">
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
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 hidden sm:block">
                        Question 3 of 3
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {roleQuiz.ctaOptions.map((item) => {
                        const isSelected = quizAnswers.hasSingleCta === item.id;
                        return (
                          <button
                            key={String(item.id)}
                            type="button"
                            onClick={() => setQuizAnswers(prev => ({ ...prev, hasSingleCta: item.id }))}
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

              {/* Option B: Direct Bio Text Paste Analyzer */}
              {auditMode === 'paste' && (
                <div className="p-5 sm:p-6 rounded-3xl bg-white border border-neutral-200 shadow-2xs space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-400 block">
                    Paste your current LinkedIn Headline, Twitter Bio, or About Section
                  </label>
                  <textarea
                    value={pastedBio}
                    onChange={(e) => {
                      setPastedBio(e.target.value);
                      setIsBioAnalyzed(true);
                    }}
                    placeholder={`e.g. ${roleQuiz.headlineOptions[0]?.example.replace('e.g. ', '').replace(/"/g, '')}. Available for freelance client projects. DM for rates.`}
                    rows={3}
                    className="w-full text-xs text-[#0b1c30] bg-neutral-50 border border-neutral-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:bg-white focus:border-[#0058be] transition-all font-sans leading-relaxed"
                  />
                  {pastedBio.trim().length > 0 && (
                    <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-[#0058be] font-semibold flex items-center gap-2">
                      <CheckCircle2 size={14} className="shrink-0" />
                      <span>Text detected — Authority engine scored your current baseline below.</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Calculate Score CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
              <span className="text-xs text-neutral-400 font-medium">
                {hasInteracted ? 'Selections complete. Ready to benchmark your authority score.' : 'Select your channels and current profile structure above.'}
              </span>
              <ModuleButton
                variant="primary"
                disabled={!hasInteracted}
                onClick={handleStartAnalysis}
              >
                Analyze Presence & Calculate Score →
              </ModuleButton>
            </div>
          </motion.div>
        )}

        {/* ── PHASE 2: PROCESSING / SCANNING ANIMATION ──────────────────────── */}
        {auditPhase === 'analyzing' && (
          <motion.div
            key="analyzing-phase"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
            className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0a1e35] via-[#0f2b4a] to-[#1a3a5c] border border-white/15 shadow-2xl text-white flex flex-col items-center justify-center space-y-6 text-center"
          >
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

            {/* Checkpoints */}
            <div className="w-full max-w-md space-y-2.5 bg-black/30 p-4 rounded-2xl border border-white/10 text-left">
              <div className={cn("flex items-center gap-2.5 text-xs transition-all", analysisStep >= 1 ? "text-white" : "text-white/30")}>
                {analysisStep >= 2 ? <Check size={14} className="text-emerald-400 shrink-0 stroke-[3]" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current shrink-0 animate-pulse" />}
                <span className="font-medium">Auditing active channel architecture for {roleConfig.roleTitle}...</span>
              </div>
              <div className={cn("flex items-center gap-2.5 text-xs transition-all", analysisStep >= 2 ? "text-white" : "text-white/30")}>
                {analysisStep >= 3 ? <Check size={14} className="text-emerald-400 shrink-0 stroke-[3]" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current shrink-0 animate-pulse" />}
                <span className="font-medium">Evaluating headline positioning & proof visibility...</span>
              </div>
              <div className={cn("flex items-center gap-2.5 text-xs transition-all", analysisStep >= 3 ? "text-white" : "text-white/30")}>
                {analysisStep >= 3 ? <Check size={14} className="text-[#d1f34d] shrink-0 stroke-[3]" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current shrink-0" />}
                <span className="font-medium">Synthesizing 4-dimension baseline authority scorecard...</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── PHASE 3: REALITY SCORECARD REVEAL ────────────────────────────── */}
        {auditPhase === 'scorecard' && (
          <motion.div
            key="scorecard-phase"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
            className="space-y-6"
          >
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0a1e35] via-[#0f2b4a] to-[#1a3a5c] border border-white/15 shadow-xl text-white space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-[#d1f34d]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#d1f34d]">
                    Baseline Authority Reality Scorecard
                  </span>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/80 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                  {(diagnosticScore as number) < 50 ? 'High Drop-Off Risk' : 'Moderate Authority'}
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
              <ModuleButton
                variant="secondary"
                onClick={() => setAuditPhase('inputs')}
              >
                ← Change Selections & Re-audit
              </ModuleButton>
              <ModuleButton
                variant="primary"
                onClick={onContinue}
              >
                Audit Confirmed — Proceed to Step 2 (Identity Foundation) →
              </ModuleButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

AuthorityAuditSection.displayName = 'AuthorityAuditSection';
