import { AnimatePresence, motion } from 'motion/react';
import { useOpportunityMapStore } from '../../lib/opportunity-map';
import type { BlueprintStep } from '../../types/opportunity-map';
import { EASING, DURATION } from '../../lib/motion-presets';
import { CareerTrackSelection } from './CareerTrackSelection';
import { ServiceSelection } from './ServiceSelection';
import { MarketSelection } from './MarketSelection';
import { NicheSelection } from './NicheSelection';
import { OfferSelection } from './OfferSelection';
import { PositioningStep } from './PositioningStep';
import { OpportunityReportView } from './OpportunityReportView';

const STEP_COMPONENTS: Record<BlueprintStep, React.FC> = {
  career_track: CareerTrackSelection,
  service: ServiceSelection,
  market: MarketSelection,
  niche: NicheSelection,
  offer: OfferSelection,
  positioning: PositioningStep,
  opportunity_score: OpportunityReportView,
};

export function StepContent() {
  const currentStep = useOpportunityMapStore((s) => s.currentStep);
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
