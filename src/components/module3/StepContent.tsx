import { useModule3Store } from '../../lib/module3';
import type { Module3Step } from '../../types/module3';
import { Step1AuthorityPosition } from './Step1AuthorityPosition';
import { Step2ProofStrategy } from './Step2ProofStrategy';
import { Step3ProofAssetBuilder } from './Step3ProofAssetBuilder';
import { Step4ProfilePortfolio } from './Step4ProfilePortfolio';
import { Step5AuthorityPack } from './Step5AuthorityPack';

const STEP_COMPONENTS: Partial<Record<Module3Step, React.FC>> = {
  authority_position: Step1AuthorityPosition,
  proof_strategy: Step2ProofStrategy,
  proof_asset_builder: Step3ProofAssetBuilder,
  profile_portfolio: Step4ProfilePortfolio,
  authority_pack: Step5AuthorityPack,
};

export function StepContent() {
  const currentStep = useModule3Store((s) => s.currentStep);
  const Component = STEP_COMPONENTS[currentStep];

  if (!Component) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
        <p className="text-sm text-zinc-500">Step not found. Please return to the previous step.</p>
        <p className="text-[10px] text-zinc-600">Unknown step: {currentStep}</p>
      </div>
    );
  }

  return <Component />;
}
