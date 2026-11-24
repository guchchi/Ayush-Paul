import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Terminal, 
  ExternalLink,
  Lock,
  GitBranch,
  Sparkles,
  Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { GITHUB_BADGES, GitHubBadge } from '../../data/gitglow/github-badges';

interface GitGlowMissionDrawerProps {
  badgeId: string | null;
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onRunBot: (badgeId: string) => void;
  isRunningBot: boolean;
  botStep: string;
  isEarned: boolean;
  isProcessing: boolean;
}

export const GitGlowMissionDrawer: React.FC<GitGlowMissionDrawerProps> = ({
  badgeId,
  isOpen,
  onClose,
  isLoggedIn,
  onLogin,
  onRunBot,
  isRunningBot,
  botStep,
  isEarned,
  isProcessing,
}) => {
  // Sync URL query string when open
  useEffect(() => {
    if (isOpen && badgeId) {
      const url = new URL(window.location.href);
      url.searchParams.set('badge', badgeId);
      window.history.replaceState({}, '', url.toString());
    } else {
      const url = new URL(window.location.href);
      if (url.searchParams.has('badge')) {
        url.searchParams.delete('badge');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [isOpen, badgeId]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !badgeId) return null;

  const badge = GITHUB_BADGES.find((b) => b.id === badgeId) || {
    id: badgeId,
    name: badgeId.replace('-', ' ').toUpperCase(),
    image: '',
    tagline: 'Official GitHub Achievement',
    difficulty: 'Easy' as const,
    category: 'beginner' as const,
    status: 'obtainable' as const,
    statusLabel: 'Obtainable',
    isObtainable: true,
    isRecommendedStarter: true,
    howToGet: 'Perform qualified git activity on a public repository.',
    blueprintStrategy: 'Run automated 1-click sandbox repository events.',
    requirements: ['Perform verified git activity on a public repository.'],
    gotchas: ['Do not delete repository immediately after running.'],
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Container (Desktop: Right 460px Slide-in, Mobile: Bottom-Sheet 85%) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 md:pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-screen max-w-md md:max-w-[460px] bg-[#161B22] border-l border-[#30363D] shadow-2xl flex flex-col justify-between overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#30363D] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0D1117] border border-[#30363D] flex items-center justify-center text-xl">
                {badge.id === 'pull-shark' && '🦈'}
                {badge.id === 'quickdraw' && '⚡'}
                {badge.id === 'yolo' && '🚀'}
                {badge.id === 'pair-extraordinaire' && '👥'}
                {badge.id === 'galaxy-brain' && '🧠'}
                {!['pull-shark', 'quickdraw', 'yolo', 'pair-extraordinaire', 'galaxy-brain'].includes(badge.id) && '🏆'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#E6EDF3] font-heading">{badge.name}</h3>
                <span className="text-xs text-[#8B949E]">{badge.difficulty} • ~2–5 Mins</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-[#E6EDF3] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-[#8B949E]">
            
            {/* Tagline / Overview */}
            <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D]">
              <div className="text-xs font-bold text-[#D7FF36] uppercase tracking-wider mb-1">Objective</div>
              <p className="text-xs text-[#E6EDF3] leading-relaxed">{badge.tagline}</p>
            </div>

            {/* Qualification Rules */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#E6EDF3] font-heading uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D7FF36]" />
                <span>Qualification Requirements</span>
              </h4>
              <ul className="space-y-1.5 text-xs">
                {badge.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#D7FF36] font-bold">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gotchas & Failure Modes */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-400 font-heading uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Common Gotchas</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-[#8B949E]">
                {badge.gotchas.map((gotcha, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">!</span>
                    <span>{gotcha}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What the Bot Does (Full Transparency) */}
            <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
              <h4 className="text-xs font-bold text-[#E6EDF3] font-heading uppercase tracking-wider flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-[#388BFD]" />
                <span>What The 1-Click Bot Does</span>
              </h4>
              <div className="space-y-1.5 text-xs">
                <p>1. Creates a temporary public sandbox repo in your account.</p>
                <p>2. Stages standard RFC git commits / pull requests.</p>
                <p>3. Merges the branch cleanly and triggers GitHub's official event.</p>
                <p className="text-[11px] text-emerald-400 pt-1">✓ Your existing repos, stars, and tokens are never touched.</p>
              </div>
            </div>

            {/* Live Bot Execution Log (If Running) */}
            {isRunningBot && (
              <div className="p-4 rounded-xl bg-[#0D1117] border border-[#D7FF36]/40 font-code text-xs space-y-2">
                <div className="flex items-center justify-between text-[#D7FF36] font-bold">
                  <span>Running Sandbox Automation...</span>
                  <div className="w-3.5 h-3.5 border-2 border-[#D7FF36] border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="text-[#8B949E] text-[11px]">{botStep || 'Initializing GitHub API credentials...'}</div>
              </div>
            )}

            {/* Link to Dedicated SEO Guide Page */}
            <div className="pt-2">
              <Link
                to={`/blueprints/gitglow/badges/${badge.id}`}
                className="inline-flex items-center gap-1.5 text-xs text-[#D7FF36] hover:underline font-medium"
              >
                <span>Read complete 800-word guide & RFC specifications</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Drawer Footer (Sticky Primary Action) */}
          <div className="p-6 border-t border-[#30363D] bg-[#161B22] space-y-3">
            {isEarned ? (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-[#F1E05A]/10 border border-[#F1E05A]/30 text-center text-xs font-bold text-[#F1E05A]">
                  Achievement Already On Your Profile ✓
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `I unlocked the ${badge.name} badge on GitHub!`,
                        text: `Check out my GitHub achievements on GitGlow:`,
                        url: window.location.href,
                      }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Share link copied to clipboard!');
                    }
                  }}
                  className="w-full py-3 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Achievement Card</span>
                </button>
              </div>
            ) : isProcessing ? (
              <div className="p-3 rounded-xl bg-[#388BFD]/10 border border-[#388BFD]/30 text-center text-xs font-bold text-[#388BFD] animate-pulse">
                Action Completed! Waiting for GitHub indexing (hours to days).
              </div>
            ) : !isLoggedIn ? (
              <button
                type="button"
                onClick={onLogin}
                className="w-full py-3.5 rounded-xl bg-[#D7FF36] hover:bg-[#cbf42e] text-[#0D1117] font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Connect GitHub to Claim</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isRunningBot}
                onClick={() => onRunBot(badge.id)}
                className="w-full py-3.5 rounded-xl bg-[#D7FF36] hover:bg-[#cbf42e] text-[#0D1117] font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                <span>Claim {badge.name} in 1-Click</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {/* CLI Manual Fallback Link */}
            <div className="text-center">
              <Link
                to="/blueprints/gitglow/engine"
                className="text-[11px] text-[#8B949E] hover:text-[#E6EDF3] transition-colors"
              >
                Prefer using the terminal? Open Interactive CLI Engine →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
