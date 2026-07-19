import { useEffect } from 'react';
import { motion } from 'motion/react';
import {
  FileText, Navigation, Layout, Search, AlignLeft, ShieldCheck, PlayCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';
import { useModule3Store } from '../../lib/module3';
import { StepHeader } from '../workspace/StepHeader';
import { StepActionArea } from '../workspace/StepActionArea';
import { ModuleButton } from '../workspace/ModuleButton';

export function Step3ProfilePortfolio() {
  const pendingStrategy = useModule3Store((s) => s.pendingProfilePortfolioStrategy);
  const strategy = useModule3Store((s) => s.profilePortfolioStrategy);
  const isUpstreamStale = useModule3Store((s) => s.isUpstreamStale);
  const generateStrategy = useModule3Store((s) => s.generateProfilePortfolioStrategy);
  const approveStrategy = useModule3Store((s) => s.approveProfilePortfolioStrategy);
  const previousStep = useModule3Store((s) => s.previousStep);
  const nextStep = useModule3Store((s) => s.nextStep);
  const confirmStep = useModule3Store((s) => s.confirmStep);
  const completedSteps = useModule3Store((s) => s.completedSteps);

  useEffect(() => {
    if (!pendingStrategy && !strategy && !isUpstreamStale) {
      generateStrategy();
    }
  }, [pendingStrategy, strategy, isUpstreamStale, generateStrategy]);

  const displayStrategy = pendingStrategy || strategy;

  const handleApprove = () => {
    approveStrategy();
    confirmStep();
    nextStep();
  };

  const isCompleted = completedSteps.includes('profile_portfolio');

  if (!displayStrategy) {
    return (
      <div className="space-y-6 lg:space-y-10">
        <StepHeader 
          title="Profile & Portfolio Strategy" 
          description="How your authority and proof are presented." 
          step={{ current: 3, total: 3 }} 
        />
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-800 rounded-full animate-spin" />
          <p className="text-sm text-neutral-500">Generating strategy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-10">
      <StepHeader 
        title="Profile & Portfolio Strategy" 
        description="This is your structural blueprint. It defines how your authority and proof will be organized for client consumption. It does not dictate visual design." 
        step={{ current: 3, total: 3 }} 
      />

      <div className="space-y-6 lg:space-y-8">
        
        {/* Presentation Strategy Summary */}
        <section className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-neutral-100 bg-[#f8f9ff]/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
              <Search size={14} />
              Presentation Strategy
            </h3>
          </div>
          <div className="p-5 sm:p-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Primary Goal</p>
              <p className="text-sm text-[#0b1c30]">{displayStrategy.presentationStrategy.primaryGoal}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Communication Approach</p>
              <p className="text-sm text-[#0b1c30]">{displayStrategy.presentationStrategy.communicationApproach}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Authority Emphasis</p>
              <p className="text-sm text-[#0b1c30]">{displayStrategy.presentationStrategy.authorityEmphasis}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Navigation Principle</p>
              <p className="text-sm text-[#0b1c30]">{displayStrategy.presentationStrategy.navigationPrinciple}</p>
            </div>
          </div>
        </section>

        {/* Reading Journey */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-[#0b1c30] flex items-center gap-2 px-1">
            <Navigation size={16} className="text-blue-500" />
            Reading Journey
          </h3>
          <p className="text-sm text-neutral-500 px-1">The sequence in which a potential client consumes your authority.</p>
          
          <div className="relative">
            {/* Timeline track */}
            <div className="absolute left-4 top-4 bottom-4 w-px bg-neutral-200 hidden sm:block" />
            
            <div className="space-y-3 relative">
              {displayStrategy.readingJourney.map((step, idx) => (
                <motion.div 
                  key={step.sectionId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
                  className="bg-white rounded-xl border border-neutral-200 p-5 sm:pl-12 relative"
                >
                  <div className="absolute left-[-5px] sm:left-[11px] top-5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white hidden sm:block" />
                  
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-start justify-between">
                    <div className="space-y-1 sm:w-1/3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Step {step.stepIndex}</span>
                        <h4 className="text-sm font-semibold text-[#0b1c30]">{step.phase}</h4>
                      </div>
                      <p className="text-[11px] text-neutral-400 uppercase tracking-wider font-bold">What Client Sees</p>
                      <p className="text-sm text-[#0b1c30] font-medium">{step.whatClientSees}</p>
                    </div>
                    
                    <div className="space-y-3 sm:w-2/3 sm:border-l border-neutral-100 sm:pl-5">
                      <div>
                        <p className="text-[11px] text-neutral-400 uppercase tracking-wider font-bold mb-0.5">Why They See It</p>
                        <p className="text-sm text-neutral-600">{step.whyTheySeeIt}</p>
                      </div>
                      <div className="bg-green-50/50 rounded-lg p-3 border border-green-100">
                        <p className="text-[10px] text-green-700 uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
                          <ShieldCheck size={12} />
                          Trust Established
                        </p>
                        <p className="text-sm text-green-800">{step.trustEstablished}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Evidence Placement Map */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-[#0b1c30] flex items-center gap-2 px-1">
            <Layout size={16} className="text-purple-500" />
            Evidence Placement Map
          </h3>
          <p className="text-sm text-neutral-500 px-1">How your proof assets from Step 2 are organized into sections.</p>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {displayStrategy.portfolioStructure.map((section, idx) => (
              <motion.div
                key={section.sectionId}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.15, duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
                className="bg-white rounded-xl border border-neutral-200 p-5 flex flex-col h-full"
              >
                <div className="mb-4 space-y-1">
                  <h4 className="text-sm font-bold text-[#0b1c30]">{section.sectionName}</h4>
                  <p className="text-xs text-neutral-500">{section.purpose}</p>
                </div>
                
                <div className="space-y-2 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Included Proof Assets</p>
                  {section.proofAssetIds.length > 0 ? (
                    <div className="space-y-2">
                      {section.proofAssetIds.map(assetId => {
                        const placement = displayStrategy.evidencePlacement.find(e => e.proofAssetId === assetId);
                        const asset = useModule3Store.getState().proofAssets.find(a => a.id === assetId);
                        return (
                          <div key={assetId} className="bg-neutral-50 rounded p-3 border border-neutral-100">
                            <p className="text-xs font-medium text-[#0b1c30] mb-1">{asset?.title || assetId.replace(/_/g, ' ')}</p>
                            <p className="text-[11px] text-neutral-500 leading-snug">{placement?.placementReason}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400 italic">No assets assigned</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <StepActionArea>
        <ModuleButton
          variant="secondary"
          onClick={previousStep}
        >
          Back to Evidence
        </ModuleButton>
        <ModuleButton
          variant={pendingStrategy ? 'primary' : 'success'}
          onClick={handleApprove}
        >
          {pendingStrategy ? 'Approve Structural Strategy' : 'Strategy Approved — Continue'}
        </ModuleButton>
      </StepActionArea>
    </div>
  );
}
