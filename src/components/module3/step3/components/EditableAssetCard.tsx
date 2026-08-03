import React, { useState } from 'react';
import { Copy, Check, Edit2, RotateCcw, Zap, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { EASING, DURATION } from '../../../../lib/motion-presets';

interface Props {
  id: string;
  title: string;
  category?: string;
  value: string;
  originalValue: string;
  isOutdated?: boolean;
  onSave?: (newValue: string) => void;
  onReset?: () => void;
  className?: string;
  multiline?: boolean;
}

export const EditableAssetCard = React.memo(function EditableAssetCard({
  id,
  title,
  category,
  value,
  originalValue,
  isOutdated,
  onSave,
  onReset,
  className = '',
  multiline = false,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [copied, setCopied] = useState(false);

  const isCustomized = value !== originalValue;

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onSave && currentValue !== value) {
      onSave(currentValue);
    }
  };

  const handleReset = () => {
    setCurrentValue(originalValue);
    setIsEditing(false);
    if (onReset) {
      onReset();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
      className={`bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-xs hover:shadow-md transition-all text-left space-y-3 relative group ${className}`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-2.5">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-xs font-bold text-[#0b1c30] truncate">{title}</span>
          {category && (
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0058be] text-[10px] font-black uppercase tracking-wider shrink-0">
              {category}
            </span>
          )}
          {isCustomized && (
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold shrink-0">
              Customized
            </span>
          )}
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-1 shrink-0">
          {isOutdated && (
            <button
              onClick={handleReset}
              title="Upstream data updated. Click to sync."
              className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Zap size={11} className="animate-pulse" /> Sync
            </button>
          )}

          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                title="Edit asset"
              >
                <Edit2 size={13} />
              </button>

              {isCustomized && (
                <button
                  onClick={handleReset}
                  className="p-1.5 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                  title="Reset to original"
                >
                  <RotateCcw size={13} />
                </button>
              )}

              <button
                onClick={handleCopy}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  copied
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-[#0058be] hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Check size={12} /> Save
            </button>
          )}
        </div>
      </div>

      {/* Asset Content Area */}
      {!isEditing ? (
        <div
          onDoubleClick={() => setIsEditing(true)}
          className="text-xs sm:text-sm font-semibold text-neutral-800 leading-relaxed whitespace-pre-line bg-neutral-50/70 p-3 rounded-xl border border-neutral-100 hover:border-blue-200 cursor-text transition-colors"
          title="Double click to edit"
        >
          {value}
        </div>
      ) : (
        <div className="space-y-2">
          {multiline || value.length > 80 ? (
            <textarea
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              rows={4}
              className="w-full text-xs sm:text-sm font-medium text-neutral-900 bg-white p-3 rounded-xl border-2 border-blue-500 focus:outline-hidden leading-relaxed shadow-2xs resize-y"
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              className="w-full text-xs sm:text-sm font-medium text-neutral-900 bg-white p-3 rounded-xl border-2 border-blue-500 focus:outline-hidden shadow-2xs"
              autoFocus
            />
          )}
          <div className="flex items-center justify-between text-[11px] text-neutral-500 px-1">
            <span>Press Save or click outside to finish.</span>
            <button
              onClick={() => setIsEditing(false)}
              className="hover:underline cursor-pointer text-neutral-600 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
});
