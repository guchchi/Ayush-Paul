import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, CheckCircle2, Sparkles, ExternalLink, Copy, Check } from 'lucide-react';
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
  confidence?: string;
  isAiGenerated?: boolean;
  onEdit?: () => void;
  onRegenerate?: () => void;
  actionText?: string;
  onAction?: () => void;
  expandableContent?: React.ReactNode;
  copyableText?: string;
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
  confidence,
  isAiGenerated = true,
  onEdit,
  onRegenerate,
  actionText,
  onAction,
  expandableContent,
  copyableText
}: RecommendationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const priorityColors = {
    High: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30',
    Medium: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30',
    Low: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30'
  };

  const handleCopy = () => {
    if (!copyableText) return;
    navigator.clipboard.writeText(copyableText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-border/50 rounded-xl bg-card overflow-hidden shadow-sm transition-shadow hover:shadow-md flex flex-col">
      <div className="p-6 flex-1 flex flex-col gap-6">
        {/* Header: Category & Priority */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {category}
            </span>
            {isAiGenerated && (
              <span className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" />
                <span>AI</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {confidence && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {confidence}
              </span>
            )}
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border",
              priorityColors[priority]
            )}>
              {priority}
            </span>
          </div>
        </div>

        {/* Title & Explanation */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground tracking-tight">{title}</h3>
          <p className="text-sm text-foreground/80 leading-relaxed">{explanation}</p>
        </div>

        {/* Reasoning */}
        <div className="bg-muted/50 rounded-lg p-5 border border-border/30">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Strategic Reasoning</p>
              <p className="text-sm text-foreground/90 leading-relaxed">{aiReasoning}</p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        {(expectedRoi || timeToResults || difficulty) && (
          <div className="grid grid-cols-3 gap-4 pt-2">
            {expectedRoi && (
              <div className="flex flex-col gap-1">
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Expected ROI</p>
                <p className="text-sm text-foreground font-medium">{expectedRoi}</p>
              </div>
            )}
            {timeToResults && (
              <div className="flex flex-col gap-1">
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Time to Results</p>
                <p className="text-sm text-foreground font-medium">{timeToResults}</p>
              </div>
            )}
            {difficulty && (
              <div className="flex flex-col gap-1">
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Difficulty</p>
                <p className="text-sm text-foreground font-medium">{difficulty}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between p-4 bg-muted/20 border-t border-border/40">
        <div className="flex items-center gap-3">
          {onRegenerate && (
            <button 
              onClick={onRegenerate}
              className="text-xs text-muted-foreground hover:text-foreground font-semibold uppercase tracking-wider transition-colors"
            >
              Regenerate
            </button>
          )}
          {onEdit && (
            <button 
              onClick={onEdit}
              className="text-xs text-muted-foreground hover:text-foreground font-semibold uppercase tracking-wider transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {copyableText && (
            <button
              onClick={handleCopy}
              className="text-xs font-semibold text-foreground/70 hover:text-foreground flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}

          {actionText && onAction && (
            <button
              onClick={onAction}
              className="text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/80 flex items-center space-x-1"
            >
              <span>{actionText}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}

          {expandableContent && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-semibold text-foreground/70 hover:text-foreground flex items-center gap-1"
            >
              <span>{isExpanded ? 'Show less' : 'Show details'}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && expandableContent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
            className="overflow-hidden border-t border-border/40 bg-muted/10"
          >
            <div className="p-6 text-sm text-foreground/80 leading-relaxed">
              {expandableContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
