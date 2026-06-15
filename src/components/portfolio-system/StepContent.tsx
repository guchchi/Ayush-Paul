import { usePortfolioSystemStore } from '../../lib/portfolio-system';
import type { PortfolioSystemStep } from '../../types/portfolio-system';
import { PortfolioGoalStep } from './PortfolioGoalStep';
import { AssetSelectionStep } from './AssetSelectionStep';
import { CaseStudyBuilderStep } from './CaseStudyBuilderStep';
import { SampleProjectBuilderStep } from './SampleProjectBuilderStep';
import { ProofPageStructureStep } from './ProofPageStructureStep';
import { PortfolioCopyGeneratorStep } from './PortfolioCopyGeneratorStep';
import { PortfolioChecklistStep } from './PortfolioChecklistStep';
import { PortfolioReportStep } from './PortfolioReportStep';

const STEP_COMPONENTS: Partial<Record<PortfolioSystemStep, React.FC>> = {
  portfolio_goal: PortfolioGoalStep,
  asset_selection: AssetSelectionStep,
  case_study_builder: CaseStudyBuilderStep,
  sample_project_builder: SampleProjectBuilderStep,
  proof_page_structure: ProofPageStructureStep,
  portfolio_copy_generator: PortfolioCopyGeneratorStep,
  portfolio_checklist: PortfolioChecklistStep,
  portfolio_report: PortfolioReportStep,
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

  return <Component />;
}
