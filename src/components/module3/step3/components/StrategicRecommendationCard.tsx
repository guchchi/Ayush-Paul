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
      className={`relative p-5 rounded-2xl border transition-all duration-200 ${
        status === 'accepted'
          ? 'bg-emerald-50/60 border-emerald-200 shadow-sm'
          : status === 'adjusted'
          ? 'bg-amber-50/60 border-amber-200 shadow-sm'
          : 'bg-white border-slate-200/80 hover:border-[#0058be]/30 shadow-xs'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-base font-bold text-[#0b1c30] tracking-tight">{title}</h4>
            <span
              className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold tracking-wider ${
                status === 'accepted'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : status === 'adjusted'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-[#0058be]/10 text-[#0058be] border border-[#0058be]/20'
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
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Accept
            </button>
          )}

          {onAdjust && !isAdjusting && (
            <button
              onClick={() => setIsAdjusting(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0b1c30] border border-slate-200 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
              Adjust
            </button>
          )}

          <button
            onClick={() => setShowWhy(!showWhy)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#0058be]/8 hover:bg-[#0058be]/15 text-[#0058be] border border-[#0058be]/20 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Why?
            {showWhy ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Main Content View / Adjustment Editor */}
      {!isAdjusting ? (
        <div className="mt-2 text-sm text-[#0b1c30] leading-relaxed bg-[#f8f9ff] p-3.5 rounded-xl border border-slate-200/80 font-medium">
          {status === 'adjusted' && userCustomization ? (
            <span className="text-amber-900">{userCustomization}</span>
          ) : (
            <span>{recommendation}</span>
          )}
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            rows={3}
            className="w-full bg-white border border-amber-300 rounded-xl p-3 text-sm text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            placeholder="Customize this recommendation to match your specific positioning preference..."
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAdjusting(false)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAdjustment}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white cursor-pointer shadow-xs"
            >
              Save Override
            </button>
          </div>
        </div>
      )}

      {/* Strategic Rationale Drawer */}
      {showWhy && (
        <div className="mt-3 pt-3 border-t border-slate-200/80 bg-[#eff4ff]/60 p-3.5 rounded-xl border border-[#0058be]/15 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0058be] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Strategic Rationale
          </div>
          <p className="text-xs text-[#424754] leading-relaxed">{strategicRationale}</p>

          {actionRequired && (
            <div className="text-[11px] font-mono text-[#0058be] bg-[#0058be]/10 p-2.5 rounded-lg border border-[#0058be]/20 mt-1">
              <strong className="text-[#0b1c30]">Action:</strong> {actionRequired}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
