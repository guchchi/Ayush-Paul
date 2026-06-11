import { useState, useEffect } from 'react';
import { Menu, Search, Sun, Moon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MissionBarProps {
  phaseName: string;
  phaseNumber: number;
  totalPhases: number;
  progress: number;
  currentObjective: string;
  onMenuToggle: () => void;
}

export function MissionBar({
  phaseName,
  phaseNumber,
  totalPhases,
  progress,
  currentObjective,
  onMenuToggle,
}: MissionBarProps) {
  const [isLight, setIsLight] = useState(false);
  const [autosaveLabel, setAutosaveLabel] = useState('Saved');

  useEffect(() => {
    const init = document.documentElement.classList.contains('light');
    setIsLight(init);
  }, []);

  useEffect(() => {
    setAutosaveLabel('Saving...');
    const t = setTimeout(() => setAutosaveLabel('Saved'), 800);
    return () => clearTimeout(t);
  }, [progress]);

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    if (next) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  const timeRemaining = Math.max(1, Math.round((1 - progress / 100) * 10));

  return (
    <div className={cn(
      'sticky top-0 z-30',
      'bg-[var(--glass-bg)] border-b border-[var(--glass-border)]',
      'backdrop-blur-[var(--glass-blur-premium)]',
    )}>
      <div className="flex items-center h-20 px-5 sm:px-8 gap-6">
        {/* Mobile menu */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/[0.06] transition-colors shrink-0 cursor-pointer"
          aria-label="Open sections"
        >
          <Menu size={16} className="text-white/60" />
        </button>

        {/* Left — Mission identity */}
        <div className="min-w-0 shrink-0">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-brand-primary/10 border border-brand-primary/20">
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-brand-primary">
                MISSION {phaseNumber}/{totalPhases}
              </span>
            </div>
            <h1 className="text-sm font-bold text-white/90 uppercase tracking-[0.08em] truncate">
              {phaseName}
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-medium text-white/40 uppercase tracking-[0.08em]">
              Objective:
            </span>
            <span className="text-[10px] text-white/60 truncate max-w-[200px] sm:max-w-[320px]">
              {currentObjective}
            </span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1 min-w-4" />

        {/* Center-right — Progress + Time */}
        <div className="hidden sm:flex items-center gap-5 shrink-0">
          {/* Progress */}
          <div className="flex items-center gap-3">
            <div className="w-28 h-[3px] rounded-full bg-white/[0.08] overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-primary transition-all duration-700 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <span className="text-xs font-bold text-white/80 tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="w-px h-6 bg-white/[0.06]" />

          {/* Time remaining */}
          <div className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white/40">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="0.8" />
              <path d="M6 3.5V6L7.5 7.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
            </svg>
            <span className="text-[10px] font-medium text-white/40">
              ~{timeRemaining} min remaining
            </span>
          </div>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Autosave */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md">
            <span className="w-1 h-1 rounded-full bg-emerald-400/60" />
            <span className="text-[8px] font-medium text-white/30 uppercase tracking-[0.1em]">{autosaveLabel}</span>
          </div>

          <button className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/[0.06] transition-colors cursor-pointer" aria-label="Search">
            <Search size={14} className="text-white/50" />
          </button>

          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {isLight ? <Moon size={14} className="text-white/50" /> : <Sun size={14} className="text-white/50" />}
          </button>

          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-primary to-brand-primary/40 flex items-center justify-center shadow-lg">
            <span className="text-[10px] font-bold text-white">AP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
