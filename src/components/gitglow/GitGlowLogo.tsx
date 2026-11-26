import React from 'react';
import { cn } from '../../lib/utils';

export interface GitGlowLogoProps {
  /** Size in pixels (applies to width & height of the icon mark). Default is 32. */
  size?: number;
  /** Custom CSS classes for the container */
  className?: string;
  /** Whether to show the "GitGlow" typography alongside the mark */
  showWordmark?: boolean;
  /** Color theme for the wordmark text */
  theme?: 'dark' | 'light' | 'auto';
  /** Optional secondary subtitle or tag (e.g. 'Engine' or 'Missions') */
  subtitle?: string;
  /** Optional subtle pulsating animation on the glow core */
  animated?: boolean;
}

/**
 * GitGlow Official Brand Logo
 * 
 * Represents the fusion of Git commit architecture with luminous developer achievements.
 * Features:
 * - Machined Obsidian Onyx squircle base (#101114) with electric-lime specular rim (#D7FF36)
 * - Precision Git branch vector tracks with gradient acceleration
 * - Radiant achievement glow node with 4-point diamond starburst
 * - High-contrast typography with neon lime brand accent
 */
export const GitGlowLogo: React.FC<GitGlowLogoProps> = ({
  size = 32,
  className,
  showWordmark = false,
  theme = 'auto',
  subtitle,
  animated = false,
}) => {
  const isDark = theme === 'dark' || (theme === 'auto' && true);

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2.5 group select-none transition-transform duration-200',
        className
      )}
    >
      {/* ─── SVG Mark ─── */}
      <div
        style={{ width: size, height: size }}
        className="relative shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-200"
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible drop-shadow-[0_2px_8px_rgba(215,255,54,0.18)]"
          aria-label="GitGlow Emblem"
        >
          <defs>
            {/* Obsidian Onyx Gradient */}
            <linearGradient id="gg-bg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E2026" />
              <stop offset="50%" stopColor="#101114" />
              <stop offset="100%" stopColor="#08090B" />
            </linearGradient>

            {/* Specular Neon Lime Rim */}
            <linearGradient id="gg-rim" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D7FF36" stopOpacity="0.55" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.2" />
              <stop offset="70%" stopColor="#84CC16" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#101114" stopOpacity="0.8" />
            </linearGradient>

            {/* Git Track Vector Gradient */}
            <linearGradient id="gg-track" x1="12" y1="26" x2="25" y2="10" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="45%" stopColor="#84CC16" />
              <stop offset="100%" stopColor="#D7FF36" />
            </linearGradient>

            {/* Core Achievement Glow */}
            <radialGradient id="gg-core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#D7FF36" />
              <stop offset="75%" stopColor="#84CC16" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#84CC16" stopOpacity="0" />
            </radialGradient>

            {/* Luminous Glow Filter */}
            <filter id="gg-blur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Squircle Tile Foundation */}
          <rect
            x="1.2"
            y="1.2"
            width="33.6"
            height="33.6"
            rx="9.5"
            fill="url(#gg-bg)"
            stroke="url(#gg-rim)"
            strokeWidth="1.2"
          />

          {/* Ambient Radiant Backdrop Aura */}
          <circle
            cx="24"
            cy="12"
            r="8"
            fill="#D7FF36"
            fillOpacity="0.16"
            filter="url(#gg-blur)"
          />

          {/* Main Git Trunk Line */}
          <line
            x1="12"
            y1="11"
            x2="12"
            y2="25"
            stroke="url(#gg-track)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          {/* Branch Fork Curve */}
          <path
            d="M 12 19.5 C 12 14.5, 17 12, 23.5 12"
            stroke="url(#gg-track)"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Subtle 'G' Returning Loop Arc */}
          <path
            d="M 23.5 12 C 27 12, 28.5 14.5, 27.5 18 C 26.5 22, 22.5 25, 16.5 25"
            stroke="#D7FF36"
            strokeWidth="1.4"
            strokeDasharray="2.5 2"
            strokeOpacity="0.75"
            strokeLinecap="round"
            fill="none"
          />

          {/* Bottom Root Commit Node */}
          <circle
            cx="12"
            cy="25"
            r="3.2"
            fill="#101114"
            stroke="#22C55E"
            strokeWidth="2.2"
          />
          <circle cx="12" cy="25" r="1.2" fill="#4ADE80" />

          {/* Top Trunk Commit Node */}
          <circle
            cx="12"
            cy="11"
            r="2.8"
            fill="#101114"
            stroke="#84CC16"
            strokeWidth="2"
          />

          {/* Active Radiant Achievement Node */}
          <circle
            cx="24"
            cy="12"
            r="4.2"
            fill="url(#gg-core-glow)"
            filter="url(#gg-blur)"
            className={animated ? 'animate-pulse' : undefined}
          />
          <circle cx="24" cy="12" r="2" fill="#FFFFFF" />

          {/* 4-Point Luminous Starburst */}
          <path
            d="M 24 6.5 Q 24 12 29.5 12 Q 24 12 24 17.5 Q 24 12 18.5 12 Q 24 12 24 6.5 Z"
            fill="#D7FF36"
            className="filter drop-shadow-[0_0_4px_rgba(215,255,54,0.8)]"
          />
        </svg>
      </div>

      {/* ─── Wordmark Typography (Optional) ─── */}
      {showWordmark && (
        <div className="flex items-center gap-1.5 leading-none">
          <div className="flex items-baseline">
            <span
              className={cn(
                'text-sm sm:text-lg font-black tracking-tight transition-colors',
                theme === 'dark'
                  ? 'text-white'
                  : theme === 'light'
                  ? 'text-[#101114]'
                  : 'text-current'
              )}
            >
              Git
            </span>
            <span className="text-sm sm:text-lg font-black tracking-tight text-[#84CC16] group-hover:text-[#D7FF36] transition-colors">
              Glow
            </span>
          </div>

          {subtitle && (
            <div className="flex items-center gap-1 pl-1">
              <span className="text-[#84CC16] text-xs font-mono font-bold">/</span>
              <span
                className={cn(
                  'text-xs font-mono font-bold tracking-tight uppercase',
                  theme === 'dark' ? 'text-white/70' : 'text-[#4D7C0F]'
                )}
              >
                {subtitle}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GitGlowLogo;
