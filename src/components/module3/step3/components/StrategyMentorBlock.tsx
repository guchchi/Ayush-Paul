import { motion } from 'motion/react';
import { Lightbulb, Target, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
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
      className={cn("mb-8 space-y-4", className)}
    >
      {/* Personalization Note */}
      {personalizationNote && (
        <div className="rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-xl" />
          <div className="flex gap-4">
            <div className="mt-1 bg-blue-100 dark:bg-blue-800/50 p-2 rounded-lg h-fit">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
                Why this strategy fits you
              </h4>
              <p className="text-sm text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
                {personalizationNote}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Educational Framework */}
      {educational && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Why & Mistake */}
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-700/50 p-5 space-y-4">
          <div className="flex gap-3">
            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">The Principle</h5>
              <p className="text-sm text-slate-700 dark:text-slate-300">{educational.why}</p>
            </div>
          </div>
          
          <div className="flex gap-3 pt-3 border-t border-slate-200 dark:border-slate-700/50">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
            <div>
              <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Avoid This</h5>
              <p className="text-sm text-slate-700 dark:text-slate-300">{educational.commonMistake}</p>
            </div>
          </div>
        </div>

        {/* Action & Result */}
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-700/50 p-5 space-y-4">
          <div className="flex gap-3">
            <ArrowRight className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">First Action</h5>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{educational.firstAction}</p>
            </div>
          </div>
          
          <div className="flex gap-3 pt-3 border-t border-slate-200 dark:border-slate-700/50">
            <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
            <div>
              <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Expected Result</h5>
              <p className="text-sm text-slate-700 dark:text-slate-300">{educational.expectedResult}</p>
            </div>
          </div>
        </div>
      </div>
      )}
    </motion.div>
  );
}
