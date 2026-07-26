import React from 'react';
import { TrustStrategyParams } from '../../../../types/module3';
import { StrategyAccordion } from '../components/StrategyAccordion';
import { StrategyMentorBlock } from '../components/StrategyMentorBlock';
import { ShieldCheck } from 'lucide-react';

interface Props {
  trust: TrustStrategyParams;
}

export const TrustStrategySection = React.memo(function TrustStrategySection({ trust }: Props) {
  return (
    <StrategyAccordion 
      title="Trust Elements" 
      subtitle="Required social proof and authority signals"
      icon={<ShieldCheck className="w-5 h-5" />}
    >
      <div className="space-y-6">
        <StrategyMentorBlock 
          personalizationNote={trust.personalizationNote}
          educational={trust.educational}
        />

        <div>
          <h4 className="text-sm font-medium text-neutral-900 mb-3">Recommended Elements</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(trust.recommendedElements || []).map((element, idx) => (
              <div key={idx} className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-sm text-neutral-700">{element}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-neutral-900 mb-2">Priority</h4>
          <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
            {trust.priority}
          </p>
        </div>
      </div>
    </StrategyAccordion>
  );
});
