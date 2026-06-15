import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Save, Check, Copy, Edit3, ArrowRight,
  Target, Star, FileText,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING } from '../../lib/motion-presets';

export interface ResultSummary {
  track: { id: string; label: string };
  market: { id: string; label: string };
  niche: { id: string; label: string };
  statement: string;
}

interface Props {
  result: ResultSummary;
  onEditDirection: () => void;
  onComplete: () => void;
}

export function Step5SaveResult({ result, onEditDirection, onComplete }: Props) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopySummary = async () => {
    const summary = [
      `Track: ${result.track.label}`,
      `Market: ${result.market.label}`,
      `Niche: ${result.niche.label}`,
      `Direction: ${result.statement}`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  const handleSave = () => {
    setSaved(true);
    onComplete();
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#0b1c30] mb-3">
          Save Your Result
        </h2>
        <p className="text-neutral-500 text-base leading-relaxed max-w-xl">
          Review your choices and lock in your direction. You can always come back
          and refine this later.
        </p>
      </div>

      <div className="space-y-4">
        {/* Result card */}
        <div
          className="p-7 sm:p-8 rounded-3xl bg-[#0b1c30] text-white shadow-2xl relative overflow-hidden"
          role="region"
          aria-label="Your Module 1 output"
        >
          {/* Decorative blurs */}
          <div
            className="absolute top-0 right-0 w-72 h-72 bg-[#0058be] rounded-full blur-[120px] opacity-20 -mr-24 -mt-24 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-0 w-40 h-40 bg-[#d1f34d] rounded-full blur-[90px] opacity-6 -ml-12 -mb-12 pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl bg-[#d1f34d] flex items-center justify-center"
                  aria-hidden="true"
                >
                  <Save size={18} className="text-[#0b1c30]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    Module 1 Output
                  </p>
                  <h3 className="text-xl font-bold text-white">Your Direction</h3>
                </div>
              </div>
              {saved && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d1f34d] text-[#0b1c30] text-xs font-bold"
                  aria-live="polite"
                >
                  <Check size={12} aria-hidden="true" /> Saved
                </motion.div>
              )}
            </div>

            {/* Selections row */}
            <div className="grid grid-cols-3 gap-4 pb-6 border-b border-white/10 mb-6">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
                  Track
                </p>
                <p className="font-bold text-white text-sm leading-snug">
                  {result.track.label}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
                  Market
                </p>
                <p className="font-bold text-white text-sm leading-snug">
                  {result.market.label}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
                  Niche
                </p>
                <p className="font-bold text-white text-sm leading-snug">
                  {result.niche.label}
                </p>
              </div>
            </div>

            {/* Statement */}
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">
                Direction Statement
              </p>
              <p className="text-xl font-bold text-[#d1f34d] leading-relaxed">
                {result.statement}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-end">
          <button
            onClick={onEditDirection}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-neutral-200 text-neutral-600 font-semibold text-sm hover:border-neutral-300 hover:text-neutral-800 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0058be]"
            id="edit-direction-btn"
          >
            <Edit3 size={15} aria-hidden="true" /> Edit Direction
          </button>

          <button
            onClick={handleCopySummary}
            className={cn(
              'inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be]',
              copied
                ? 'bg-[#d1f34d] text-[#0b1c30]'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:text-neutral-800 shadow-sm',
            )}
            id="copy-summary-btn"
          >
            {copied ? (
              <><Check size={15} aria-hidden="true" /> Copied!</>
            ) : (
              <><Copy size={15} aria-hidden="true" /> Copy Summary</>
            )}
          </button>

          <button
            onClick={handleSave}
            disabled={saved}
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be] focus:ring-offset-2',
              saved
                ? 'bg-[#d1f34d] text-[#0b1c30] cursor-default'
                : 'bg-[#0058be] text-white shadow-[0_4px_20px_rgba(0,88,190,0.3)] hover:bg-[#0047a0] hover:shadow-[0_8px_32px_rgba(0,88,190,0.35)]',
            )}
            id="save-result-btn"
          >
            {saved ? (
              <><Check size={15} aria-hidden="true" /> Saved</>
            ) : (
              <><Save size={15} aria-hidden="true" /> Save Result</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
