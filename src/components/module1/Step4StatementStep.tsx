import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RefreshCw, Copy, Edit3, Check, Sparkles, Zap,
  Save,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';

interface StatementBreakdown {
  who: string;
  result: string;
  method: string;
}

interface Props {
  statement: string;
  breakdown: StatementBreakdown | null;
  variantIndex: number;
  variantTotal: number;
  saved: boolean;
  onStatementChange: (val: string) => void;
  onRegenerate: () => void;
  onCopy: () => void;
  onSave: () => void;
}

export function Step4StatementStep({
  statement,
  breakdown,
  variantIndex,
  variantTotal,
  saved,
  onStatementChange,
  onRegenerate,
  onCopy,
  onSave,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#0b1c30] mb-3">
          Your Direction Statement
        </h2>
        <p className="text-neutral-500 text-base leading-relaxed max-w-xl">
          This one-sentence positioning statement is the foundation of your offer,
          outreach, and brand. Make it clear and specific.
        </p>
      </div>

      {!statement ? (
        <div className="p-12 rounded-2xl bg-white border border-neutral-200 text-center">
          <p className="text-neutral-400 text-sm">
            Select a track, market, and niche first to generate your statement.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Main statement card */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xl">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                <Sparkles size={12} className="text-[#0058be]" aria-hidden="true" />
                Direction Statement
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onRegenerate}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-500 hover:bg-[#f8f9ff] hover:text-[#0058be] transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be]"
                  title={`Variant ${(variantIndex % variantTotal) + 1} of ${variantTotal}`}
                  aria-label={`Regenerate statement (variant ${(variantIndex % variantTotal) + 1} of ${variantTotal})`}
                >
                  <RefreshCw size={13} aria-hidden="true" />
                  <span className="hidden sm:inline">Regenerate</span>
                  {variantTotal > 0 && (
                    <span className="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded-full ml-1">
                      {(variantIndex % variantTotal) + 1}/{variantTotal}
                    </span>
                  )}
                </button>

                <button
                  onClick={handleCopy}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be]',
                    copied
                      ? 'bg-[#d1f34d] text-[#0b1c30]'
                      : 'text-neutral-500 hover:bg-[#f8f9ff] hover:text-[#0058be]',
                  )}
                  aria-label={copied ? 'Copied to clipboard' : 'Copy statement to clipboard'}
                >
                  {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
                  <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => setIsEditing(e => !e)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be]',
                    isEditing
                      ? 'bg-[#0058be] text-white'
                      : 'text-neutral-500 hover:bg-[#f8f9ff] hover:text-[#0058be]',
                  )}
                  aria-pressed={isEditing}
                  aria-label={isEditing ? 'Done editing' : 'Edit statement manually'}
                >
                  <Edit3 size={13} aria-hidden="true" />
                  <span className="hidden sm:inline">{isEditing ? 'Done' : 'Edit'}</span>
                </button>
              </div>
            </div>

            {/* Statement text */}
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="editing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <textarea
                    value={statement}
                    onChange={e => onStatementChange(e.target.value)}
                    className="w-full text-2xl sm:text-3xl font-bold text-[#0b1c30] bg-[#f8f9ff] border border-[#0058be]/20 rounded-xl resize-none focus:ring-2 focus:ring-[#0058be]/30 focus:border-[#0058be]/40 p-3 leading-tight outline-none transition-all"
                    rows={4}
                    autoFocus
                    aria-label="Edit your direction statement"
                    onKeyDown={e => {
                      if (e.key === 'Escape') setIsEditing(false);
                    }}
                  />
                  <p className="text-xs text-neutral-400 mt-1.5">Press Esc to finish editing.</p>
                </motion.div>
              ) : (
                <motion.p
                  key="reading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-2xl sm:text-3xl font-bold text-[#0b1c30] leading-tight"
                  aria-live="polite"
                >
                  {statement}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Confidence note */}
            <div className="mt-6 pt-4 border-t border-neutral-100">
              <div className="flex items-start gap-2.5">
                <div
                  className="w-5 h-5 rounded-full bg-[#d1f34d] shrink-0 mt-0.5 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <Zap size={9} className="text-[#0b1c30]" />
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  <strong className="text-neutral-700">
                    This is your working direction, not your final brand tagline.
                  </strong>{' '}
                  Clear enough to test is better than perfect but unused. You can
                  refine it after your first real client conversation.
                </p>
              </div>
            </div>
          </div>

          {/* Statement breakdown */}
          {breakdown && (
            <div
              className="grid grid-cols-3 gap-3"
              aria-label="Direction statement breakdown"
            >
              {[
                { label: 'WHO', value: breakdown.who },
                { label: 'RESULT', value: breakdown.result },
                { label: 'METHOD', value: breakdown.method },
              ].map(item => (
                <div
                  key={item.label}
                  className="p-4 rounded-xl bg-white border border-neutral-200"
                >
                  <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold text-[#0b1c30] leading-snug">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Save statement */}
          <div className="flex justify-end">
            <button
              onClick={onSave}
              disabled={saved}
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be] focus:ring-offset-2',
                saved
                  ? 'bg-[#d1f34d] text-[#0b1c30] cursor-default'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:border-[#0058be]/30 hover:text-[#0058be]',
              )}
              id="save-statement-btn"
            >
              {saved ? (
                <>
                  <Check size={15} aria-hidden="true" /> Statement Saved
                </>
              ) : (
                <>
                  <Save size={15} aria-hidden="true" /> Save Statement
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
