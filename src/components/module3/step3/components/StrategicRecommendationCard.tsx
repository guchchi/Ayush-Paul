import React, { useState } from 'react';
import { CheckCircle2, SlidersHorizontal, HelpCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import type { DecisionStatus } from '../../../../types/module3-step3-authority';

interface StrategicRecommendationCardProps {
  id: string;
  title: string;
  recommendation: string;
  strategicRationale: string;
  actionRequired?: string;
  status: DecisionStatus;
  userCustomization?: string;
  onAccept: () => void;
  onAdjust?: (newValue: string) => void;
}

export const StrategicRecommendationCard: React.FC<StrategicRecommendationCardProps> = ({
  id,
  title,
  recommendation,
  strategicRationale,
  actionRequired,
  status,
  userCustomization,
  onAccept,
  onAdjust,
}) => {
  const [showWhy, setShowWhy] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [customText, setCustomText] = useState(userCustomization || recommendation);

  const handleSaveAdjustment = () => {
    if (onAdjust) {
      onAdjust(customText);
      setIsAdjusting(false);
    }
  };

  return (
    <div
      className={`relative p-5 rounded-xl border transition-all duration-200 ${
        status === 'accepted'
          ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm shadow-emerald-950/30'
          : status === 'adjusted'
          ? 'bg-amber-950/20 border-amber-500/40 shadow-sm shadow-amber-950/30'
          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-slate-200">{title}</h4>
            <span
              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold tracking-wider ${
                status === 'accepted'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : status === 'adjusted'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              }`}
            >
              {status === 'accepted' ? 'Accepted' : status === 'adjusted' ? 'User Override' : 'System Recommendation'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {status !== 'accepted' && (
            <button
              onClick={onAccept}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Accept
            </button>
          )}

          {onAdjust && !isAdjusting && (
            <button
              onClick={() => setIsAdjusting(true)}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Adjust
            </button>
          )}

          <button
            onClick={() => setShowWhy(!showWhy)}
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/40 text-indigo-300 border border-indigo-800/40 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Why?
            {showWhy ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Main Content View / Adjustment Editor */}
      {!isAdjusting ? (
        <div className="mt-2 text-sm text-slate-300 leading-relaxed font-mono bg-slate-950/40 p-3 rounded-lg border border-slate-850">
          {status === 'adjusted' && userCustomization ? (
            <span className="text-amber-200 font-sans">{userCustomization}</span>
          ) : (
            <span className="font-sans text-slate-200">{recommendation}</span>
          )}
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            rows={3}
            className="w-full bg-slate-950 border border-amber-500/40 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            placeholder="Customize this recommendation to match your specific positioning preference..."
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAdjusting(false)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAdjustment}
              className="text-xs px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold"
            >
              Save Override
            </button>
          </div>
        </div>
      )}

      {/* Strategic Rationale Drawer */}
      {showWhy && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 bg-indigo-950/20 p-3 rounded-lg border border-indigo-900/30">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Strategic Rationale:
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-2">{strategicRationale}</p>

          {actionRequired && (
            <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/30 p-2 rounded border border-emerald-900/40">
              <strong className="text-emerald-300">Action:</strong> {actionRequired}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
