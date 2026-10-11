import React from 'react';
import { ShieldCheck, History, Clock, BookOpen, Sparkles } from 'lucide-react';
import type { TrustLevel } from '../../types/b-cyber-compass';
import { cn } from '../../lib/utils';

interface TrustBadgeProps {
  trustLevel: TrustLevel;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

interface BadgeConfig {
  label: string;
  description: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  Icon: React.ElementType;
}

const BADGE_CONFIGS: Record<TrustLevel, BadgeConfig> = {
  official_fact: {
    label: 'Official Fact',
    description: 'Confirmed by published IIT Kanpur or IIT Madras institutional notices or ordinances.',
    bgClass: 'bg-emerald-50/80',
    textClass: 'text-emerald-800',
    borderClass: 'border-emerald-200',
    Icon: ShieldCheck,
  },
  observed_precedent_2026: {
    label: '2026 Precedent',
    description: 'Historical detail documented from the inaugural 2026 admission cycle. Future cycles may differ.',
    bgClass: 'bg-amber-50/80',
    textClass: 'text-amber-800',
    borderClass: 'border-amber-200',
    Icon: History,
  },
  pending_official_notice: {
    label: 'Pending Official Notice',
    description: 'Awaiting official announcement from IIT Kanpur / IIT Madras. Not established as fact.',
    bgClass: 'bg-sky-50/80',
    textClass: 'text-sky-800',
    borderClass: 'border-sky-200',
    Icon: Clock,
  },
  independent_foundational: {
    label: 'Independent Lab',
    description: 'Third-party educational platform or wargame. Not part of any official entrance syllabus.',
    bgClass: 'bg-zinc-100',
    textClass: 'text-zinc-700',
    borderClass: 'border-zinc-200',
    Icon: BookOpen,
  },
  practical_heuristic: {
    label: 'Practical Guidance',
    description: 'Practical study, logic development, or portfolio structuring guideline.',
    bgClass: 'bg-indigo-50/80',
    textClass: 'text-indigo-800',
    borderClass: 'border-indigo-200',
    Icon: Sparkles,
  },
};

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  trustLevel,
  className,
  showIcon = true,
  size = 'md',
}) => {
  const config = BADGE_CONFIGS[trustLevel] || BADGE_CONFIGS.practical_heuristic;
  const { label, description, bgClass, textClass, borderClass, Icon } = config;

  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-[11px] gap-1'
    : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      title={description}
      className={cn(
        'inline-flex items-center font-medium rounded-md border tracking-tight transition-colors',
        bgClass,
        textClass,
        borderClass,
        sizeClasses,
        className
      )}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3 shrink-0' : 'w-3.5 h-3.5 shrink-0'} />}
      <span>{label}</span>
    </span>
  );
};
