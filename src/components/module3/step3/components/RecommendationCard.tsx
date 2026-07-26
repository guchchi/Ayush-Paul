import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { EASING, DURATION } from '../../../../lib/motion-presets';

export interface RecommendationCardProps {
  category: string;
  title: string;
  explanation: string;
  aiReasoning: string;
  expectedRoi?: string;
  timeToResults?: string;
  difficulty?: string;
  priority: 'High' | 'Medium' | 'Low';
  isAiGenerated?: boolean;
  onEdit?: () => void;
  onRegenerate?: () => void;
  actionText?: string;
  onAction?: () => void;
  expandableContent?: React.ReactNode;
}

export function RecommendationCard({
  category,
  title,
  explanation,
  aiReasoning,
  expectedRoi,
  timeToResults,
  difficulty,
  priority,
  isAiGenerated = true,
  onEdit,
  onRegenerate,
  actionText,
  onAction,
  expandableContent
}: RecommendationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const priorityColors = {
    High: 'bg-red-50 text-red-700 border-red-100',
    Medium: 'bg-amber-50 text-amber-700 border-amber-100',
    Low: 'bg-blue-50 text-blue-700 border-blue-100'
  };

  return (
    <div className="border border-neutral-200 rounded-xl bg-white overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              {category}
            </span>
            {isAiGenerated && (
              <span className="flex items-center space-x-1 text-[10px] font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" />
                <span>AI Strategy</span>
              </span>
            )}
          </div>
          <span className={cn(
            "text-[10px] font-medium px-2 py-1 rounded-full border",
            priorityColors[priority]
          )}>
            {priority} Priority
          </span>
        </div>

        <h3 className="text-lg font-semibold text-neutral-900 mb-2">{title}</h3>
        <p className="text-sm text-neutral-600 mb-4">{explanation}</p>

        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100 mb-4">
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium text-neutral-900 mb-1">AI Reasoning</p>
              <p className="text-xs text-neutral-600">{aiReasoning}</p>
            </div>
          </div>
          
          {(expectedRoi || timeToResults || difficulty) && (
            <div className="mt-4 pt-3 border-t border-neutral-200 grid grid-cols-3 gap-2">
              {expectedRoi && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 mb-0.5">Expected ROI</p>
                  <p className="text-xs text-neutral-800 font-medium">{expectedRoi}</p>
                </div>
              )}
              {timeToResults && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 mb-0.5">Time to Results</p>
                  <p className="text-xs text-neutral-800 font-medium">{timeToResults}</p>
                </div>
              )}
              {difficulty && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 mb-0.5">Difficulty</p>
                  <p className="text-xs text-neutral-800 font-medium">{difficulty}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <div className="flex items-center space-x-2">
            {onRegenerate && (
              <button 
                onClick={onRegenerate}
                className="text-xs text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
              >
                Regenerate
              </button>
            )}
            {onEdit && (
              <button 
                onClick={onEdit}
                className="text-xs text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {actionText && onAction && (
              <button
                onClick={onAction}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
              >
                <span>{actionText}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}

            {expandableContent && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-medium text-neutral-700 hover:text-neutral-900 flex items-center space-x-1"
              >
                <span>{isExpanded ? 'Show less' : 'Show details'}</span>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && expandableContent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
            className="overflow-hidden border-t border-neutral-100 bg-neutral-50/50"
          >
            <div className="p-5 text-sm text-neutral-700">
              {expandableContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
