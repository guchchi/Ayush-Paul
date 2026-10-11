import React from 'react';
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
  dotColor: string;
}

const BADGE_CONFIGS: Record<TrustLevel, BadgeConfig> = {
  official_fact: {
    label: 'Official Fact',
    description: 'Confirmed by published IIT Kanpur or IIT Madras institutional notices or ordinances.',
    dotColor: 'bg-emerald-500',
  },
  observed_precedent_2026: {
    label: '2026 Precedent',
    description: 'Historical detail documented from the inaugural 2026 admission cycle. Future cycles may differ.',
    dotColor: 'bg-amber-500',
  },
  pending_official_notice: {
    label: 'Pending Notice',
    description: 'Awaiting official announcement from IIT Kanpur / IIT Madras. Not established as fact.',
    dotColor: 'bg-sky-500',
  },
  independent_foundational: {
    label: 'Independent Lab',
    description: 'Third-party educational platform or wargame. Not part of any official entrance syllabus.',
    dotColor: 'bg-slate-400',
  },
  practical_heuristic: {
    label: 'Practical Guide',
    description: 'Practical study, logic development, or portfolio structuring guideline.',
    dotColor: 'bg-indigo-500',
  },
};

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  trustLevel,
  className,
  showIcon = true,
  size = 'md',
}) => {
  const config = BADGE_CONFIGS[trustLevel] || BADGE_CONFIGS.practical_heuristic;
  const { label, description, dotColor } = config;

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[10px] gap-1.5'
      : 'px-2.5 py-1 text-xs gap-2';

  return (
    <span
      title={description}
      className={cn(
        'inline-flex items-center rounded-md font-mono uppercase tracking-wider font-medium text-slate-700 bg-white border border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors select-none',
        sizeClasses,
        className
      )}
    >
      {showIcon && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColor)} />}
      <span>{label}</span>
    </span>
  );
};
