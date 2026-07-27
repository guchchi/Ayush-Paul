import { useEffect, useRef, useState } from 'react';
import { useModule3Store } from '../../../lib/module3';
import { StepHeader } from '../../workspace/StepHeader';
import { StepActionArea } from '../../workspace/StepActionArea';
import { ModuleButton } from '../../workspace/ModuleButton';
import { Loader2 } from 'lucide-react';
import { PlatformStrategySection } from './sections/PlatformStrategySection';
import { ProfileStrategySection } from './sections/ProfileStrategySection';
import { PortfolioStrategySection } from './sections/PortfolioStrategySection';
import { TrustStrategySection } from './sections/TrustStrategySection';
import { ContentStrategySection } from './sections/ContentStrategySection';
import { BrandingStrategySection } from './sections/BrandingStrategySection';
import { OptimizationSection } from './sections/OptimizationSection';
import { PublishingRoadmapSection } from './sections/PublishingRoadmapSection';
import { StrategySummarySection } from './sections/StrategySummarySection';
import { BeforeYouContinueChecklist } from './components/BeforeYouContinueChecklist';

export function Step3ProfilePortfolio() {
  const pendingStrategy = useModule3Store((s) => s.pendingProfilePortfolioStrategy);
  const strategy = useModule3Store((s) => s.profilePortfolioStrategy);
  const isUpstreamStale = useModule3Store((s) => s.isUpstreamStale);
  const isGeneratingStrategy = useModule3Store((s) => s.isGeneratingStrategy);
  const generateStrategy = useModule3Store((s) => s.generateProfilePortfolioStrategy);
  const regenerateStrategy = useModule3Store((s) => s.regenerateProfilePortfolioStrategy);
  const approveStrategy = useModule3Store((s) => s.approveProfilePortfolioStrategy);
  const confirmStep = useModule3Store((s) => s.confirmStep);
  const nextStep = useModule3Store((s) => s.nextStep);
  const previousStep = useModule3Store((s) => s.previousStep);

  const abortControllerRef = useRef<AbortController | null>(null);
  const [isChecklistComplete, setIsChecklistComplete] = useState(false);

  useEffect(() => {
    if (!pendingStrategy && !strategy && !isUpstreamStale && !isGeneratingStrategy) {
      abortControllerRef.current = new AbortController();
      generateStrategy(abortControllerRef.current.signal);
    }
  }, [pendingStrategy, strategy, isUpstreamStale, isGeneratingStrategy, generateStrategy]);

  // Handle cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleRegenerate = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    regenerateStrategy(abortControllerRef.current.signal);
  };

  const displayStrategy = pendingStrategy || strategy;

  const handleApprove = () => {
    approveStrategy();
    confirmStep();
    nextStep();
  };

  return (
    <div className="flex flex-col h-full space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-24 sm:pb-0 relative">
      <StepHeader
        title="Profile & Portfolio Strategy"
        description="Your AI strategist has analyzed your authority position and proof assets to design a complete roadmap for your online presence. Review and refine your strategy."
        step={{ current: 3, total: 3 }}
      />

      {!displayStrategy || isGeneratingStrategy ? (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-400 space-y-4" aria-live="polite" aria-atomic="true">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm">
            {isGeneratingStrategy ? 'Generating your personalized strategy with AI...' : 'Analyzing your proof assets and positioning...'}
          </p>
        </div>
      ) : (
        <div className="flex-1 space-y-12">
          {displayStrategy.strategySummary && <StrategySummarySection summary={displayStrategy.strategySummary} />}
          {displayStrategy.platformStrategy && <PlatformStrategySection platformStrategy={displayStrategy.platformStrategy} />}
          {displayStrategy.profileStrategy && <ProfileStrategySection profile={displayStrategy.profileStrategy} />}
          {displayStrategy.portfolioStrategy && <PortfolioStrategySection portfolio={displayStrategy.portfolioStrategy} />}
          {displayStrategy.trustStrategy && <TrustStrategySection trust={displayStrategy.trustStrategy} />}
          {displayStrategy.contentStrategy && <ContentStrategySection content={displayStrategy.contentStrategy} />}
          {displayStrategy.brandingStrategy && <BrandingStrategySection branding={displayStrategy.brandingStrategy} />}
          {displayStrategy.optimizationRecommendations && <OptimizationSection optimizations={displayStrategy.optimizationRecommendations} />}
          {displayStrategy.publishingRoadmap && <PublishingRoadmapSection roadmap={displayStrategy.publishingRoadmap} />}
          
          <BeforeYouContinueChecklist onAllChecked={setIsChecklistComplete} />
        </div>
      )}

      <div className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-4 -mx-4 sm:mx-0 sm:p-0 sm:bg-transparent sm:border-0 sm:relative z-20">
        <StepActionArea className="flex-col sm:flex-row gap-4 sm:gap-0 pt-0 sm:pt-4 border-0 sm:border-t sm:border-neutral-200">
          <div className="flex items-center justify-between w-full sm:w-auto space-x-3">
            <ModuleButton
              variant="secondary"
              onClick={previousStep}
              disabled={isGeneratingStrategy}
              className="flex-1 sm:flex-none justify-center"
            >
              Back
            </ModuleButton>
            <ModuleButton
              variant="secondary"
              onClick={handleRegenerate}
              disabled={isGeneratingStrategy || !displayStrategy}
              className="flex-1 sm:flex-none justify-center"
            >
              Regenerate Strategy
            </ModuleButton>
          </div>
          <ModuleButton
            onClick={handleApprove}
            disabled={!displayStrategy || isGeneratingStrategy || !isChecklistComplete}
            className="w-full sm:w-auto justify-center mt-3 sm:mt-0"
          >
            Generate My Authority Pack →
          </ModuleButton>
        </StepActionArea>
      </div>
    </div>
  );
}
