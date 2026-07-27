import React from 'react';
import { ContentStrategyParams } from '../../../../types/module3';
import { StrategyAccordion } from '../components/StrategyAccordion';
import { StrategyMentorBlock } from '../components/StrategyMentorBlock';
import { RecommendationCard } from '../components/RecommendationCard';
import { StrategyActionPanel } from '../components/StrategyActionPanel';
import { FileText } from 'lucide-react';

interface Props {
  content: ContentStrategyParams;
}

export const ContentStrategySection = React.memo(function ContentStrategySection({ content }: Props) {
  return (
    <StrategyAccordion 
      title="Content Strategy" 
      subtitle="What to publish to build authority"
      icon={<FileText className="w-5 h-5" />}
    >
      <div className="space-y-6">
        <StrategyMentorBlock 
          personalizationNote={content.personalizationNote}
          educational={content.educational}
        />
        {content.metadata && (
          <StrategyActionPanel metadata={content.metadata} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-neutral-900 mb-3">Core Content Types</h4>
            <div className="flex flex-wrap gap-2">
              {(content.contentTypes || []).map((type, idx) => (
                <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium">
                  {type}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-neutral-900 mb-3">Publishing Cadence</h4>
            <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
              {content.publishingFrequency}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-neutral-900 mb-3">Authority Building Ideas</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(content.authorityBuildingIdeas || []).map((idea, idx) => (
              <li key={idx} className="flex items-start space-x-2 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                <span className="text-indigo-600 mt-0.5">•</span>
                <span className="text-sm text-neutral-700">{idea}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StrategyAccordion>
  );
});
