import React from 'react';
import { PortfolioStrategyParams } from '../../../../types/module3';
import { StrategyAccordion } from '../components/StrategyAccordion';
import { StrategyMentorBlock } from '../components/StrategyMentorBlock';
import { Briefcase } from 'lucide-react';

interface Props {
  portfolio: PortfolioStrategyParams;
}

export const PortfolioStrategySection = React.memo(function PortfolioStrategySection({ portfolio }: Props) {
  return (
    <StrategyAccordion 
      title="Portfolio Structure" 
      subtitle="How to organize and display your proof assets"
      icon={<Briefcase className="w-5 h-5" />}
    >
      <div className="space-y-6">
        <StrategyMentorBlock 
          personalizationNote={portfolio.personalizationNote}
          educational={portfolio.educational}
        />

        <div>
          <h4 className="text-sm font-medium text-neutral-900 mb-3">Recommended Structure</h4>
          <ul className="space-y-2">
            {(portfolio.recommendedStructure || []).map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-100 text-neutral-500 text-xs font-medium shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-sm text-neutral-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-neutral-900 mb-3">Project Ordering Strategy</h4>
          <div className="flex flex-wrap gap-2">
            {(portfolio.projectOrdering || []).map((order, idx) => (
              <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100">
                {order}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-neutral-900 mb-2">Navigation</h4>
            <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
              {(portfolio.navigation || []).map((nav, idx) => (
                <li key={idx}>{nav}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-neutral-900 mb-2">Content Hierarchy</h4>
            <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
              {portfolio.contentHierarchy}
            </p>
          </div>
        </div>
      </div>
    </StrategyAccordion>
  );
});
