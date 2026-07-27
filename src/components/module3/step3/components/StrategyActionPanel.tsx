import { StrategyMetadata } from '../../../../types/module3';
import { cn } from '../../../../lib/utils';
import { motion } from 'motion/react';
import { EASING, DURATION } from '../../../../lib/motion-presets';
import { Clock, Target, Zap } from 'lucide-react';

interface StrategyActionPanelProps {
  metadata: StrategyMetadata;
  className?: string;
}

export function StrategyActionPanel({ metadata, className }: StrategyActionPanelProps) {
  const getPriorityDisplay = (impact: string, difficulty: string) => {
    if (impact === 'High' && difficulty !== 'Hard') return '⭐⭐⭐ Critical Focus';
    if (impact === 'High') return '⭐⭐ High Priority';
    if (impact === 'Medium') return '⭐ Good to Have';
    return 'Optional Enhancement';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.1 }}
      className={cn(
        "rounded-xl border border-orange-500/20 bg-orange-500/5 p-5 shadow-sm",
        "flex flex-col gap-4",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-orange-500/10 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-semibold tracking-wide text-orange-500">
            {getPriorityDisplay(metadata.impact, metadata.difficulty)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-orange-500/80">
          First Action
        </span>
        <p className="text-base text-foreground font-medium leading-snug">
          {metadata.firstAction}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between rounded-lg bg-background/50 border border-border/50 p-3 mt-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Target className="h-3.5 w-3.5" />
            <span>Expected Outcome</span>
          </div>
          <p className="text-sm text-foreground/90">{metadata.expectedOutcome}</p>
        </div>
        
        <div className="flex shrink-0 flex-col gap-1 sm:items-end mt-3 sm:mt-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Est. Time</span>
          </div>
          <p className="text-sm font-medium text-foreground">
            {metadata.estimatedMinutes} min
          </p>
        </div>
      </div>
    </motion.div>
  );
}
