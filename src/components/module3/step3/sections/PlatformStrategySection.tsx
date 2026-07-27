import React from 'react';
import { PlatformStrategyParams } from '../../../../types/module3';
import { StrategyAccordion } from '../components/StrategyAccordion';
import { RecommendationCard } from '../components/RecommendationCard';
import { StrategyMentorBlock } from '../components/StrategyMentorBlock';
import { StrategyActionPanel } from '../components/StrategyActionPanel';
import { LayoutGrid } from 'lucide-react';

interface Props {
  platformStrategy: PlatformStrategyParams;
}

export const PlatformStrategySection = React.memo(function PlatformStrategySection({ platformStrategy }: Props) {
  const safePlatforms = platformStrategy.recommendations || [];
  const primaryPlatforms = safePlatforms.filter(p => p.priority === 1);
  const secondaryPlatforms = safePlatforms.filter(p => p.priority === 2);
  const avoidPlatforms = safePlatforms.filter(p => p.action === 'ignore');

  return (
    <StrategyAccordion 
      title="Platform Strategy" 
      subtitle="Where you need to be (and where you don't)"
      icon={<LayoutGrid className="w-5 h-5" />}
      defaultExpanded
    >
      <div className="space-y-6">
        <StrategyMentorBlock 
          personalizationNote={platformStrategy.personalizationNote}
          educational={platformStrategy.educational}
        />
        {platformStrategy.metadata && (
          <StrategyActionPanel metadata={platformStrategy.metadata} />
        )}
        {primaryPlatforms.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-neutral-900 mb-3">Primary Focus (Action: {primaryPlatforms[0].action})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {primaryPlatforms.map((platform, idx) => (
                <RecommendationCard
                  key={idx}
                  category="Platform"
                  title={platform.platform}
                  explanation={platform.purpose}
                  aiReasoning={platform.aiReasoning}
                  expectedRoi={platform.expectedRoi}
                  timeToResults={platform.timeToResults}
                  difficulty={platform.difficulty}
                  priority="High"
                />
              ))}
            </div>
          </div>
        )}

        {secondaryPlatforms.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-neutral-900 mb-3">Secondary Presence (Action: {secondaryPlatforms[0].action})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {secondaryPlatforms.map((platform, idx) => (
                <RecommendationCard
                  key={idx}
                  category="Platform"
                  title={platform.platform}
                  explanation={platform.purpose}
                  aiReasoning={platform.aiReasoning}
                  expectedRoi={platform.expectedRoi}
                  timeToResults={platform.timeToResults}
                  difficulty={platform.difficulty}
                  priority="Medium"
                />
              ))}
            </div>
          </div>
        )}

        {avoidPlatforms.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-neutral-900 mb-3">Do Not Focus (Action: ignore)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {avoidPlatforms.map((platform, idx) => (
                <RecommendationCard
                  key={idx}
                  category="Platform"
                  title={platform.platform}
                  explanation={platform.purpose}
                  aiReasoning={platform.aiReasoning}
                  expectedRoi={platform.expectedRoi}
                  timeToResults={platform.timeToResults}
                  difficulty={platform.difficulty}
                  priority="Low"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </StrategyAccordion>
  );
});
