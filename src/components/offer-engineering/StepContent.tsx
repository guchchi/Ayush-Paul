import { AnimatePresence, motion } from 'motion/react';
import { useOfferEngineeringStore } from '../../lib/offer-engineering';
import type { OfferEngineeringStep } from '../../types/offer-engineering';
import { EASING, DURATION } from '../../lib/motion-presets';
import { OfferTypeStep } from './OfferTypeStep';
import { DeliverablesStep } from './DeliverablesStep';
import { UniqueMechanismStep } from './UniqueMechanismStep';
import { ScopeProtectionStep } from './ScopeProtectionStep';
import { ValueAmplifierStep } from './ValueAmplifierStep';
import { PricingStep } from './PricingStep';
import { ProposalSummaryStep } from './ProposalSummaryStep';
import { OfferBlueprintStep } from './OfferBlueprintStep';

const STEP_COMPONENTS: Record<OfferEngineeringStep, React.FC> = {
  offer_type: OfferTypeStep,
  deliverables: DeliverablesStep,
  unique_mechanism: UniqueMechanismStep,
  scope_protection: ScopeProtectionStep,
  value_amplifier: ValueAmplifierStep,
  pricing: PricingStep,
  proposal_summary: ProposalSummaryStep,
  offer_blueprint: OfferBlueprintStep,
};

export function StepContent() {
  const currentStep = useOfferEngineeringStore((s) => s.currentStep);
  const Component = STEP_COMPONENTS[currentStep];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
      >
        <Component />
      </motion.div>
    </AnimatePresence>
  );
}
