import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { diagnoseCrossPlatformConsistency } from '../../../../lib/module3/authority-score-engine';
import type { ProfileSystemAsset } from '../../../../data/module3/authority-suite-engine';

interface ConsistencyAuditBadgeProps {
  profileSystem: ProfileSystemAsset[];
  targetMechanism?: string;
  className?: string;
  onAlignAll?: () => void;
}

export function ConsistencyAuditBadge({
  profileSystem,
  targetMechanism,
  className,
  onAlignAll,
}: ConsistencyAuditBadgeProps) {
  const diagnosis = React.useMemo(() => {
    return diagnoseCrossPlatformConsistency(profileSystem, targetMechanism);
  }, [profileSystem, targetMechanism]);

  const isPerfect = diagnosis.score >= 90;
  const isGood = diagnosis.score >= 70 && !isPerfect;

  return (
    <div
      className={cn(
        'p-4 rounded-2xl border transition-all duration-200 shadow-xs',
        isPerfect
          ? 'bg-emerald-50/60 border-emerald-200'
          : isGood
          ? 'bg-blue-50/60 border-blue-200'
          : 'bg-amber-50/60 border-amber-200',
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              'w-8 h-8 rounded-xl flex items-center justify-center shrink-0',
              isPerfect
                ? 'bg-emerald-100 text-emerald-700'
                : isGood
                ? 'bg-blue-100 text-blue-700'
                : 'bg-amber-100 text-amber-700'
            )}
          >
            {isPerfect ? (
              <CheckCircle2 size={16} />
            ) : isGood ? (
              <ShieldCheck size={16} />
            ) : (
              <AlertTriangle size={16} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0b1c30]">
                Cross-Platform Positioning Alignment
              </span>
              <span
                className={cn(
                  'text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider',
                  isPerfect
                    ? 'bg-emerald-200/80 text-emerald-800'
                    : isGood
                    ? 'bg-blue-200/80 text-blue-800'
                    : 'bg-amber-200/80 text-amber-800'
                )}
              >
                {diagnosis.score}% Cohesive
              </span>
            </div>
            <p className="text-[11px] text-neutral-600 mt-0.5 leading-snug">
              {diagnosis.recommendations[0] || 'Positioning is consistent across all enabled channels.'}
            </p>
          </div>
        </div>

        {onAlignAll && !isPerfect && (
          <button
            onClick={onAlignAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-neutral-200 hover:border-neutral-300 text-[#0b1c30] shadow-2xs hover:shadow-xs transition-all cursor-pointer shrink-0"
          >
            <RefreshCw size={12} className="text-[#0058be]" />
            Auto-Harmonize
          </button>
        )}
      </div>

      {diagnosis.divergentPlatforms.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-neutral-200/60 flex items-center gap-2 text-[10px] text-neutral-500">
          <span className="font-semibold text-neutral-600">Divergent Channels:</span>
          <div className="flex flex-wrap gap-1.5">
            {diagnosis.divergentPlatforms.map((plat) => (
              <span
                key={plat}
                className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 font-mono text-[9px] text-[#0b1c30]"
              >
                {plat}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
