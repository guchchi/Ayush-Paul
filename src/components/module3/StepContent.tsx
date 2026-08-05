import { useModule3Store } from '../../lib/module3';
import type { Module3Step } from '../../types/module3';
import { Step1AuthorityPosition } from './Step1AuthorityPosition';
import { Step2ProofAssetBuilder } from './Step2ProofAssetBuilder';
import { Step3ProfilePortfolioAuthority } from './step3/Step3ProfilePortfolioAuthority';
import { Step4AuthorityPack } from '../../features/authority-pack/components/Step4AuthorityPack';

const STEP_COMPONENTS: Partial<Record<Module3Step, React.FC>> = {
  authority_position: Step1AuthorityPosition,
  proof_asset_builder: Step2ProofAssetBuilder,
  profile_portfolio: Step3ProfilePortfolioAuthority,
  authority_pack: Step4AuthorityPack,
};

export function StepContent() {
  const currentStep = useModule3Store((s) => s.currentStep);
  const Component = STEP_COMPONENTS[currentStep];

  if (!Component) {
    return (
      <div role="region" className="flex flex-col items-center justify-center py-20 text-center space-y-3">
        <p className="text-sm text-neutral-500">Step not found. Please return to the previous step.</p>
        <p className="text-[10px] text-neutral-400">Unknown step: {currentStep}</p>
      </div>
    );
  }

  return (
    <div role="region" aria-label={`Step ${currentStep.replace(/_/g, ' ')}`}>
      <Component />
    </div>
  );
}
