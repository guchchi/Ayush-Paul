import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CompletionCardProps {
  moduleTitle: string;
  completedChecklist: number;
  totalChecklist: number;
  isModuleComplete: boolean;
  onMarkComplete: () => void;
  onReset: () => void;
  nextModuleTitle?: string;
  onNextModule?: () => void;
}

export function CompletionCard({
  moduleTitle,
  completedChecklist,
  totalChecklist,
  isModuleComplete,
  onMarkComplete,
  onReset,
  nextModuleTitle,
  onNextModule,
}: CompletionCardProps) {
  const progress = totalChecklist > 0 ? Math.round((completedChecklist / totalChecklist) * 100) : 0;
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (isModuleComplete) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isModuleComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="ds-card p-6 lg:p-8 mt-8 relative overflow-hidden"
    >
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{
                  top: '50%',
                  left: '50%',
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${10 + Math.random() * 80}%`,
                  scale: [1, 1.5, 0],
                  opacity: [1, 0.8, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Sparkles size={14 + i * 4} className="text-brand-accent" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center text-center relative z-10">
        <div className="relative mb-4">
          {isModuleComplete ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="w-14 h-14 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center"
            >
              <CheckCircle size={28} className="text-brand-primary" />
            </motion.span>
          ) : (
            <div className="relative w-14 h-14">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                <circle
                  cx="28" cy="28" r="24"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="3"
                />
                <motion.circle
                  cx="28" cy="28" r="24"
                  fill="none"
                  stroke="var(--brand-primary)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 24}
                  initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 24 * (1 - progress / 100) }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-text-primary">
                {progress}%
              </span>
            </div>
          )}
        </div>

        <p className="text-body-md font-semibold text-text-primary mb-1">
          {isModuleComplete ? 'Module Complete' : 'Module Progress'}
        </p>
        <p className="text-body-sm text-text-secondary mb-6">
          {isModuleComplete
            ? `You've completed all tasks in ${moduleTitle}`
            : `${completedChecklist} of ${totalChecklist} tasks completed`}
        </p>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          {isModuleComplete ? (
            <>
              {nextModuleTitle && onNextModule && (
                <button
                  onClick={onNextModule}
                  className={cn(
                    'btn-base text-[11px] gap-2',
                    'bg-brand-primary text-white hover:bg-brand-secondary',
                  )}
                >
                  Continue to {nextModuleTitle}
                  <ArrowRight size={12} />
                </button>
              )}
              <button
                onClick={onReset}
                className={cn(
                  'btn-base text-[11px] gap-2',
                  'bg-white/5 text-text-secondary border border-white/10',
                  'hover:bg-white/10 hover:text-text-primary',
                )}
              >
                <RotateCcw size={12} />
                Reset Module
              </button>
            </>
          ) : (
            <button
              onClick={onMarkComplete}
              disabled={completedChecklist < totalChecklist}
              className={cn(
                'btn-base text-[11px] gap-2',
                completedChecklist >= totalChecklist
                  ? 'bg-brand-primary text-white hover:bg-brand-secondary'
                  : 'bg-white/5 text-text-muted border border-white/10 cursor-not-allowed',
              )}
            >
              <CheckCircle size={12} />
              {completedChecklist >= totalChecklist ? 'Mark Module Complete' : 'Complete all tasks first'}
            </button>
          )}
        </div>

        {isModuleComplete && !nextModuleTitle && (
          <p className="text-caption text-brand-primary/60 mt-4">
            All modules complete — you've finished this blueprint
          </p>
        )}
      </div>
    </motion.div>
  );
}
