import { motion } from 'motion/react';
import { Target, Lightbulb, AlertTriangle, MessageSquare, AlertCircle, Sparkles } from 'lucide-react';
import { EducationalBlock } from '../../../../types/module3';
import { EASING, DURATION } from '../../../../lib/motion-presets';
import { cn } from '../../../../lib/utils';

interface StrategyMentorBlockProps {
  personalizationNote: string;
  educational: EducationalBlock;
  className?: string;
}

export function StrategyMentorBlock({
  personalizationNote,
  educational,
  className
}: StrategyMentorBlockProps) {
  if (!personalizationNote && !educational) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
      className={cn("mb-6 space-y-6", className)}
    >
      {/* WHY THIS STRATEGY FITS YOU */}
      {personalizationNote && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Target className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Strategic Reasoning
            </h4>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed border-l-2 border-blue-500/30 pl-4 py-1">
            {personalizationNote}
          </p>
        </div>
      )}

      {/* EDUCATIONAL FRAMEWORK (PRINCIPLE -> MISTAKE) */}
      {educational && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Principle */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Lightbulb className="w-4 h-4" />
              <h5 className="text-xs font-bold uppercase tracking-wider">The Principle</h5>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              <strong className="font-semibold text-foreground">{educational.principle}</strong>{' '}
              {educational.why}
            </p>
          </div>
          
          {/* Common Mistake */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              <h5 className="text-xs font-bold uppercase tracking-wider">Common Mistake</h5>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {educational.commonMistake}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
