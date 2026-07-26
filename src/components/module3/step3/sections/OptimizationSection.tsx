import React from 'react';
import { OptimizationRecommendation } from '../../../../types/module3';
import { StrategyAccordion } from '../components/StrategyAccordion';
import { Zap } from 'lucide-react';

interface Props {
  optimizations: OptimizationRecommendation[];
}

export const OptimizationSection = React.memo(function OptimizationSection({ optimizations }: Props) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-50 text-red-700 border-red-100';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Low': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-neutral-50 text-neutral-700 border-neutral-100';
    }
  };

  return (
    <StrategyAccordion 
      title="Optimization Recommendations" 
      subtitle="High-impact tweaks to improve conversion"
      icon={<Zap className="w-5 h-5" />}
    >
      <div className="space-y-4">
        {(optimizations || []).map((opt, idx) => (
          <div key={idx} className="flex items-start justify-between p-4 bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex-1 pr-4">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {opt.area}
                </span>
              </div>
              <p className="text-sm text-neutral-900">{opt.suggestion}</p>
            </div>
            <span className={`text-[10px] font-medium px-2 py-1 rounded-full border shrink-0 ${getImpactColor(opt.impact)}`}>
              {opt.impact} Impact
            </span>
          </div>
        ))}
      </div>
    </StrategyAccordion>
  );
});
