import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  ExternalLink,
  CheckCircle2,
  Share2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  X,
  Clock,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '../../lib/utils';

interface BadgeRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  badgeName: string;
  badgeIcon: string;
  username: string;
  durationSeconds: number;
  issueNumber: number;
  repoFullName: string;
  issueUrl?: string;
  onContinueToNext?: () => void;
}

export const BadgeRewardModal: React.FC<BadgeRewardModalProps> = ({
  isOpen,
  onClose,
  badgeName,
  badgeIcon,
  username,
  durationSeconds,
  issueNumber,
  repoFullName,
  issueUrl,
  onContinueToNext,
}) => {
  React.useEffect(() => {
    if (isOpen) {
      // Fire confetti celebration sequence
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D7FF36', '#84CC16', '#101114', '#F7F8EF', '#38BDF8'],
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#D7FF36', '#84CC16'],
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#D7FF36', '#84CC16'],
          });
        }, 300);
      } catch (err) {
        console.warn('Confetti error:', err);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleShareOnX = () => {
    const tweet = `Just unlocked the official GitHub "${badgeName}" achievement using @GitGlow! ⚡\n\nIssue #${issueNumber} closed in ${durationSeconds}s. Real webhook verified!\n\nCheck it out on my profile: https://github.com/${username}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg rounded-[32px] bg-white border border-[#E5E3DA] p-6 sm:p-8 shadow-2xl text-center space-y-6 overflow-hidden"
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#D7FF36]/30 blur-3xl"
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF9F5] border border-[#E5E3DA] flex items-center justify-center text-[#65666A] hover:text-[#101114] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>

          {/* Badge Showcase Card with 3D Float */}
          <div className="relative pt-3 flex flex-col items-center">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#FAF9F5] border-2 border-[#DCE89E] p-4 flex items-center justify-center shadow-[0_16px_36px_rgba(215,255,54,0.35)]"
            >
              <img
                src={badgeIcon}
                alt={badgeName}
                className="w-full h-full object-contain filter drop-shadow-md"
              />
              <div className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-[#101114] text-[#D7FF36] border border-[#D7FF36]/40 text-[10px] font-mono font-bold tracking-wider uppercase shadow-xs">
                Verified Qualify
              </div>
            </motion.div>
          </div>

          {/* Headline & Congratulations */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F8EF] border border-[#DCE89E] text-[11px] font-bold text-[#4D7C0F]">
              <Sparkles size={13} className="text-[#84CC16]" />
              <span>Achievement Unlocked</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#101114] tracking-tight">
              You Earned {badgeName}!
            </h3>
            <p className="text-xs sm:text-sm text-[#65666A] max-w-sm mx-auto leading-relaxed">
              Real GitHub webhook triggered on <strong className="text-[#101114]">{repoFullName}</strong>. GitHub servers have officially queued this achievement for your profile!
            </p>
          </div>

          {/* Proof Breakdown Stat Grid */}
          <div className="grid grid-cols-3 gap-2.5 p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E3DA] text-left">
            <div>
              <span className="text-[10px] font-mono text-[#65666A] uppercase block">Triage Speed</span>
              <span className="text-base font-extrabold text-[#101114] flex items-center gap-1 mt-0.5">
                <Clock size={13} className="text-[#84CC16]" />
                {durationSeconds}s
              </span>
              <span className="text-[9.5px] text-[#65A30D] font-bold">&lt; 300s window</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#65666A] uppercase block">Real Issue</span>
              <span className="text-base font-extrabold text-[#101114] mt-0.5 block">
                #{issueNumber}
              </span>
              <span className="text-[9.5px] text-[#65A30D] font-bold">Closed state</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#65666A] uppercase block">Attribution</span>
              <span className="text-base font-extrabold text-[#101114] truncate mt-0.5 block">
                @{username}
              </span>
              <span className="text-[9.5px] text-[#65A30D] font-bold">100% Verified</span>
            </div>
          </div>

          {/* ETA Ingestion Notice */}
          <div className="p-3.5 rounded-2xl bg-[#F7F8EF] border border-[#DCE89E] flex items-start gap-2.5 text-left text-xs text-[#101114]">
            <ShieldCheck size={16} className="text-[#65A30D] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>GitHub Ingestion ETA:</strong> GitHub cron runs in periodic batches. Your new shiny badge will appear in the Achievements section on{' '}
              <a
                href={`https://github.com/${username}?tab=achievements`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold hover:text-[#84CC16]"
              >
                github.com/{username}
              </a>{' '}
              within 10 to 30 minutes!
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <button
              onClick={handleShareOnX}
              className="w-full sm:flex-1 h-11 rounded-2xl bg-[#101114] hover:bg-[#1C1E24] text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md border border-[#D7FF36]/40"
            >
              <Share2 size={13} />
              <span>Share on X / Twitter</span>
            </button>

            {issueUrl && (
              <a
                href={issueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto h-11 px-5 rounded-2xl bg-white border border-[#E5E3DA] hover:border-[#84CC16] text-[#101114] text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <span>View Issue #{issueNumber}</span>
                <ExternalLink size={12} />
              </a>
            )}

            {onContinueToNext && (
              <button
                onClick={onContinueToNext}
                className="w-full sm:w-auto h-11 px-5 rounded-2xl bg-[#84CC16] hover:bg-[#65A30D] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <span>Next Badge</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

