import { usePortfolioSystemStore } from '../../lib/portfolio-system';
import type { PortfolioSystemStep } from '../../types/portfolio-system';
import { PortfolioDirectionStep } from './PortfolioDirectionStep';
import { DestinationStructureStep } from './DestinationStructureStep';
import { ProjectArrangementStep } from './ProjectArrangementStep';
import { ProjectPresentationsStep } from './ProjectPresentationsStep';
import { PortfolioCopyCTAStep } from './PortfolioCopyCTAStep';
import { PortfolioBuildPackStep } from './PortfolioBuildPackStep';
import { DynamicRoadmap } from '../workspace/DynamicRoadmap';

const STEP_COMPONENTS: Partial<Record<PortfolioSystemStep, React.FC>> = {
  portfolio_direction: PortfolioDirectionStep,
  platform_structure: DestinationStructureStep,
  project_arrangement: ProjectArrangementStep,
  project_presentations: ProjectPresentationsStep,
  portfolio_copy_cta: PortfolioCopyCTAStep,
  portfolio_build_pack: PortfolioBuildPackStep,
};

export function StepContent() {
  const currentStep = usePortfolioSystemStore((s) => s.currentStep);
  const Component = STEP_COMPONENTS[currentStep];

  if (!Component) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[PortfolioSystem] No component found for step: "${currentStep}"`);
    }
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
        <p className="text-sm text-zinc-500">Step not found. Please return to the previous step.</p>
        <p className="text-[10px] text-zinc-600">Unknown step: {currentStep}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DynamicRoadmap activeMilestone="portfolio" />
      <Component />
    </div>
  );
}
