import { useAuthoritySystemStore } from '../../lib/authority-system';
import type { AuthoritySystemStep } from '../../types/authority-system';
import { AuthorityPositionStep } from './AuthorityPositionStep';
import { ProofAssetBuilderStep } from './ProofAssetBuilderStep';
import { PortfolioAssetPlanStep } from './PortfolioAssetPlanStep';
import { TrustBuilderStep } from './TrustBuilderStep';
import { SocialProofStrategyStep } from './SocialProofStrategyStep';
import { ContentAssetGeneratorStep } from './ContentAssetGeneratorStep';
import { AuthorityProfileStep } from './AuthorityProfileStep';
import { AuthorityReportStep } from './AuthorityReportStep';

const STEP_COMPONENTS: Partial<Record<AuthoritySystemStep, React.FC>> = {
  authority_position: AuthorityPositionStep,
  proof_asset_builder: ProofAssetBuilderStep,
  portfolio_asset_plan: PortfolioAssetPlanStep,
  trust_builder: TrustBuilderStep,
  social_proof_strategy: SocialProofStrategyStep,
  content_asset_generator: ContentAssetGeneratorStep,
  authority_profile: AuthorityProfileStep,
  authority_report: AuthorityReportStep,
};

export function StepContent() {
  const currentStep = useAuthoritySystemStore((s) => s.currentStep);
  const Component = STEP_COMPONENTS[currentStep];

  if (!Component) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[AuthoritySystem] No component found for step: "${currentStep}"`);
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
