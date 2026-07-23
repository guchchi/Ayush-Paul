import { useEffect } from 'react';
import { motion } from 'motion/react';
import {
  FileText, Navigation, Layout, Search, AlignLeft, ShieldCheck, PlayCircle,
  Target, MessageSquare, Award, Compass, Layers, Sparkles, ArrowLeft, ArrowRight
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
          <p className="text-sm text-neutral-500 font-semibold">Generating strategy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <StepHeader 
        title="Profile & Portfolio Strategy" 
        description="This is your structural blueprint. It defines how your authority and proof will be organized for client consumption. It does not dictate visual design." 
        step={{ current: 3, total: 3 }} 
      />

      <div className="space-y-12">
        
        {/* Strategy Dashboard */}
        <section className="space-y-5">
          <div className="flex items-center gap-2 px-1">
            <Search size={16} className="text-[#0058be]" />
            <h3 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider text-left">
              Presentation Strategy Dashboard
            </h3>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Primary Goal",
                desc: displayStrategy.presentationStrategy.primaryGoal,
                icon: Target,
                color: "bg-blue-50 text-blue-600 border-blue-100/50"
              },
              {
                title: "Communication Approach",
                desc: displayStrategy.presentationStrategy.communicationApproach,
                icon: MessageSquare,
                color: "bg-indigo-50 text-indigo-600 border-indigo-100/50"
              },
              {
                title: "Authority Emphasis",
                desc: displayStrategy.presentationStrategy.authorityEmphasis,
                icon: Award,
                color: "bg-purple-50 text-purple-600 border-purple-100/50"
              },
              {
                title: "Navigation Principle",
                desc: displayStrategy.presentationStrategy.navigationPrinciple,
                icon: Compass,
                color: "bg-emerald-50 text-emerald-600 border-emerald-100/50"
              }
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex flex-col justify-between space-y-4 text-left"
                >
                  <div className="space-y-3">
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border", card.color)}>
                      <Icon size={16} />
                    </div>
                    <h4 className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">{card.title}</h4>
                  </div>
                  <p className="text-xs font-bold text-[#0b1c30] leading-relaxed">{card.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Reading Journey */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Navigation size={16} className="text-[#0058be]" />
            <h3 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider text-left">
              Client Reading Journey Path
            </h3>
          </div>
          <p className="text-xs text-neutral-500 font-semibold px-1 max-w-2xl leading-relaxed text-left">
            This timeline maps the strategic path your potential clients travel as they consume your proof materials, moving from initial validation to final confidence.
          </p>
          
          <div className="relative pl-6 sm:pl-8 border-l border-dashed border-neutral-200/80 space-y-6 ml-4 mt-6">
            {displayStrategy.readingJourney.map((step, idx) => (
              <motion.div 
                key={step.sectionId}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
                whileHover={{ x: 2 }}
                className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 shadow-sm relative space-y-4"
              >
                {/* Timeline node dot */}
                <div className="absolute -left-[31px] sm:-left-[35px] top-6 w-3.5 h-3.5 rounded-full bg-[#0058be] border-4 border-[#f8f9ff] shadow-md flex items-center justify-center" />

                <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
                  <div className="space-y-3 md:w-1/2 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100/50">
                        STAGE {step.stepIndex}
                      </span>
                      <h4 className="text-sm font-black text-[#0b1c30]">{step.phase}</h4>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">Client Observation:</span>
                      <p className="text-xs font-bold text-[#0b1c30] leading-relaxed bg-neutral-50 border border-neutral-100 p-3.5 rounded-xl">
                        {step.whatClientSees}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 md:w-1/2 md:border-l border-neutral-100 md:pl-6 text-left">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">Strategic Purpose:</span>
                      <p className="text-xs font-semibold text-neutral-600 leading-relaxed">{step.whyTheySeeIt}</p>
                    </div>

                    <div className="bg-emerald-500/[0.02] rounded-xl p-3.5 border border-emerald-500/20">
                      <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                        <ShieldCheck size={13} className="text-emerald-600" />
                        Trust Established
                      </span>
                      <p className="text-xs font-bold text-emerald-800 leading-relaxed">{step.trustEstablished}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Evidence Placement Map */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Layout size={16} className="text-[#0058be]" />
            <h3 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider text-left">
              Evidence Placement Architecture
            </h3>
          </div>
          <p className="text-xs text-neutral-500 font-semibold px-1 max-w-2xl leading-relaxed text-left">
            This map highlights exactly how the proof assets you've inventoried are placed structurally into the sections of your portfolio.
          </p>
          
          <div className="grid gap-6 sm:grid-cols-2">
            {displayStrategy.portfolioStructure.map((section, idx) => (
              <motion.div
                key={section.sectionId}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.15, duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
                className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between shadow-sm space-y-4"
              >
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100/50">
                      <Layers size={14} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#0b1c30]">{section.sectionName}</h4>
                      <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">{section.sectionId}</p>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 font-semibold leading-relaxed pt-1">{section.purpose}</p>
                </div>
                
                <div className="space-y-3 pt-3 border-t border-neutral-100 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block text-left">Structural Layout:</span>
                    {section.proofAssetIds.length > 0 ? (
                      <div className="space-y-2.5">
                        {section.proofAssetIds.map(assetId => {
                          const placement = displayStrategy.evidencePlacement.find(e => e.proofAssetId === assetId);
                          const asset = useModule3Store.getState().proofAssets.find(a => a.id === assetId);
                          return (
                            <div key={assetId} className="bg-neutral-50 rounded-xl p-3 border border-neutral-100 text-left space-y-1 hover:bg-neutral-100/50 transition-colors">
                              <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                                <p className="text-xs font-black text-[#0b1c30]">
                                  {asset?.title || assetId.replace(/_/g, ' ')}
                                </p>
                              </div>
                              <p className="text-[11px] text-neutral-500 leading-normal pl-3 font-semibold">
                                {placement?.placementReason}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-400 italic text-left">No proof assets mapped to this section.</p>
                    )}
                  </div>
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
          <ArrowLeft size={16} />
          Back to Evidence
        </ModuleButton>
        <ModuleButton
          variant={pendingStrategy ? 'primary' : 'success'}
          onClick={handleApprove}
        >
          {pendingStrategy ? 'Approve Structural Strategy' : 'Strategy Approved — Continue'}
          <ArrowRight size={16} />
        </ModuleButton>
      </StepActionArea>
    </div>
  );
}
