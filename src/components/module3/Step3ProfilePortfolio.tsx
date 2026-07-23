import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText, Navigation, Layout, Search, AlignLeft, ShieldCheck, PlayCircle,
  Target, MessageSquare, Award, Compass, Layers, Sparkles, ArrowLeft, ArrowRight,
  Edit2, RotateCw, RotateCcw, Check, Eye, EyeOff, ExternalLink, Shield, Info, AlertCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';
import { useModule3Store } from '../../lib/module3';
import { StepHeader } from '../workspace/StepHeader';
import { StepActionArea } from '../workspace/StepActionArea';
import { ModuleButton } from '../workspace/ModuleButton';
import { classifyService } from '../../data/module3/service-taxonomy';

interface PlatformRecommendation {
  name: string;
  url: string;
  isPrimary: boolean;
  completeness: number;
  whyRecommended: string;
}

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

  // Store actions for partial customization
  const updatePresentationStrategy = useModule3Store((s) => s.updatePresentationStrategy);
  const regeneratePresentationStrategyField = useModule3Store((s) => s.regeneratePresentationStrategyField);
  const resetPresentationStrategyField = useModule3Store((s) => s.resetPresentationStrategyField);
  const updateReadingJourneyStep = useModule3Store((s) => s.updateReadingJourneyStep);
  const updatePortfolioStructureSection = useModule3Store((s) => s.updatePortfolioStructureSection);

  // Gaps / proof states from Step 2 to compute status badges
  const availableAssets = useModule3Store((s) => s.availableAssets);
  const proofAssets = useModule3Store((s) => s.proofAssets);
  const authorityPosition = useModule3Store((s) => s.authorityPosition) || 'builder';
  const mod1ServiceId = useModule3Store((s) => s.mod1ServiceId);

  // Service family classification for platform recommendations
  const serviceFamily = useMemo(() => {
    return classifyService(mod1ServiceId).family;
  }, [mod1ServiceId]);

  // Edit fields states
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValue, setFieldValue] = useState<string>('');

  // Reading Journey edits
  const [editingJourneyId, setEditingJourneyId] = useState<string | null>(null);
  const [journeyField, setJourneyField] = useState<'whatClientSees' | 'whyTheySeeIt' | 'trustEstablished' | null>(null);
  const [journeyValue, setJourneyValue] = useState<string>('');

  // Wireframe UI interaction states
  const [viewMode, setViewMode] = useState<'builder' | 'client'>('builder');
  const [activeHoverSection, setActiveHoverSection] = useState<'hero' | 'foundational' | 'supporting' | null>(null);

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

  // Determine the proof status badge based on Step 2 outputs
  const getAssetStatus = (assetId: string) => {
    if (availableAssets.includes(assetId)) {
      return 'ready';
    }
    const asset = proofAssets.find(a => a.id === assetId);
    if (asset && asset.isAccepted) {
      return 'in_progress';
    }
    return 'missing';
  };

  const getAssetStatusLabel = (status: 'ready' | 'in_progress' | 'missing') => {
    switch (status) {
      case 'ready':
        return { label: 'Ready', styles: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'in_progress':
        return { label: 'In Progress', styles: 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse' };
      case 'missing':
      default:
        return { label: 'Missing', styles: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
  };

  // Platform recommendations based on taxonomy family
  const platformRecommendations = useMemo((): PlatformRecommendation[] => {
    switch (serviceFamily) {
      case 'developer':
        return [
          {
            name: 'GitHub Profile',
            url: 'https://github.com',
            isPrimary: true,
            completeness: 85,
            whyRecommended: 'Essential for builders to showcase raw code commits, repository structures, and active builds.'
          },
          {
            name: 'LinkedIn Profile',
            url: 'https://linkedin.com',
            isPrimary: true,
            completeness: 72,
            whyRecommended: 'Primary channel for corporate and startup founders looking to hire developers directly.'
          },
          {
            name: 'Personal Custom Site',
            url: 'https://vercel.com',
            isPrimary: false,
            completeness: 40,
            whyRecommended: 'Gives complete control over the layout, interactive sandboxes, and custom proof demos.'
          }
        ];
      case 'designer':
        return [
          {
            name: 'Figma Community / Portfolio',
            url: 'https://figma.com',
            isPrimary: true,
            completeness: 80,
            whyRecommended: 'Allows clients to browse interactive design files, component structures, and auto-layouts.'
          },
          {
            name: 'Behance / Dribbble Portfolio',
            url: 'https://behance.net',
            isPrimary: true,
            completeness: 65,
            whyRecommended: 'Perfect for showcase presentations detailing the design journey and high-fidelity aesthetics.'
          },
          {
            name: 'LinkedIn Profile',
            url: 'https://linkedin.com',
            isPrimary: false,
            completeness: 55,
            whyRecommended: 'Allows you to share design case study highlights and network directly with design managers.'
          }
        ];
      case 'editor':
        return [
          {
            name: 'YouTube Channel',
            url: 'https://youtube.com',
            isPrimary: true,
            completeness: 90,
            whyRecommended: 'Allows clients to immediately experience video playback quality, audio mastering, and pacing.'
          },
          {
            name: 'LinkedIn Profile',
            url: 'https://linkedin.com',
            isPrimary: true,
            completeness: 70,
            whyRecommended: 'Allows sharing video before/after clips and connecting with agencies/influencers hiring editors.'
          },
          {
            name: 'Vimeo / Behance Showreel',
            url: 'https://vimeo.com',
            isPrimary: false,
            completeness: 45,
            whyRecommended: 'Perfect for hosting uncompressed high-fidelity video showreels without algorithm distraction.'
          }
        ];
      case 'automation':
      case 'other':
      default:
        return [
          {
            name: 'LinkedIn Profile',
            url: 'https://linkedin.com',
            isPrimary: true,
            completeness: 78,
            whyRecommended: 'Primary platform to share system diagrams, process case studies, and testimonials.'
          },
          {
            name: 'Notion CV / Public Hub',
            url: 'https://notion.so',
            isPrimary: true,
            completeness: 60,
            whyRecommended: 'Easy-to-build, clean layout to document process frameworks and automation blueprint mappings.'
          },
          {
            name: 'Substack / Medium',
            url: 'https://substack.com',
            isPrimary: false,
            completeness: 35,
            whyRecommended: 'Excellent for deep-dive technical process teardowns demonstrating analytical authority.'
          }
        ];
    }
  }, [serviceFamily]);

  if (!displayStrategy) {
    return (
      <div className="space-y-6 lg:space-y-10 text-left">
        <StepHeader 
          title="Profile & Portfolio Strategy" 
          description="How your authority and proof are presented." 
          step={{ current: 3, total: 4 }} 
        />
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-800 rounded-full animate-spin" />
          <p className="text-sm text-neutral-500 font-semibold">Generating strategy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-5xl mx-auto text-left pb-24">
      <StepHeader 
        title="Profile & Portfolio Strategy" 
        description="This is your structural blueprint. It defines how your authority and proof will be organized for client consumption. It does not dictate visual design." 
        step={{ current: 3, total: 4 }} 
      />

      {/* 1. Presentation Strategy Section */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 px-1">
          <Search size={16} className="text-[#0058be]" />
          <h3 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider">
            Presentation Strategy Dashboard
          </h3>
        </div>
        
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              key: "primaryGoal" as const,
              title: "Primary Goal",
              value: displayStrategy.presentationStrategy.primaryGoal,
              icon: Target,
              color: "bg-blue-50 text-blue-600 border-blue-100/50"
            },
            {
              key: "communicationApproach" as const,
              title: "Communication Approach",
              value: displayStrategy.presentationStrategy.communicationApproach,
              icon: MessageSquare,
              color: "bg-indigo-50 text-indigo-600 border-indigo-100/50"
            },
            {
              key: "authorityEmphasis" as const,
              title: "Authority Emphasis",
              value: displayStrategy.presentationStrategy.authorityEmphasis,
              icon: Award,
              color: "bg-purple-50 text-purple-600 border-purple-100/50"
            },
            {
              key: "navigationPrinciple" as const,
              title: "Navigation Principle",
              value: displayStrategy.presentationStrategy.navigationPrinciple,
              icon: Compass,
              color: "bg-emerald-50 text-emerald-600 border-emerald-100/50"
            }
          ].map((card) => {
            const Icon = card.icon;
            const isEditing = editingField === card.key;

            return (
              <motion.div
                key={card.key}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex flex-col justify-between space-y-4 relative group"
              >
                {/* Customization controls on hover */}
                {!isEditing && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 rounded-lg p-1 shadow-sm border border-neutral-100 z-10">
                    <button
                      onClick={() => {
                        setEditingField(card.key);
                        setFieldValue(card.value);
                      }}
                      className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 rounded-md cursor-pointer transition-colors"
                      title="Edit text"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => regeneratePresentationStrategyField(card.key)}
                      className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 rounded-md cursor-pointer transition-colors"
                      title="Regenerate variant"
                    >
                      <RotateCw size={12} />
                    </button>
                    <button
                      onClick={() => resetPresentationStrategyField(card.key)}
                      className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 rounded-md cursor-pointer transition-colors"
                      title="Reset to AI default"
                    >
                      <RotateCcw size={12} />
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border", card.color)}>
                    <Icon size={16} />
                  </div>
                  <h4 className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">{card.title}</h4>
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={fieldValue}
                      onChange={(e) => setFieldValue(e.target.value)}
                      className="w-full text-xs font-bold text-[#0b1c30] border border-blue-500 rounded-lg p-2 focus:outline-none bg-blue-50/10 min-h-[60px] resize-none"
                    />
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => setEditingField(null)}
                        className="px-2 py-1 text-[10px] font-bold text-neutral-500 hover:bg-neutral-100 rounded cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          updatePresentationStrategy(card.key, fieldValue);
                          setEditingField(null);
                        }}
                        className="px-2 py-1 text-[10px] font-bold bg-[#0058be] text-white rounded hover:bg-blue-700 cursor-pointer flex items-center gap-1"
                      >
                        <Check size={10} /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs font-bold text-[#0b1c30] leading-relaxed">{card.value}</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 2. Reading Journey Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Navigation size={16} className="text-[#0058be]" />
          <h3 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider">
            Client Reading Journey Path
          </h3>
        </div>
        <p className="text-xs text-neutral-500 font-semibold px-1 max-w-2xl leading-relaxed">
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
              className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 shadow-sm relative space-y-4 text-left group"
            >
              {/* Timeline node dot */}
              <div className="absolute -left-[31px] sm:-left-[35px] top-6 w-3.5 h-3.5 rounded-full bg-[#0058be] border-4 border-[#f8f9ff] shadow-md flex items-center justify-center" />

              <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
                {/* Left Side: Stage Info */}
                <div className="space-y-3 md:w-1/2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100/50">
                      STAGE {step.stepIndex}
                    </span>
                    <h4 className="text-sm font-black text-[#0b1c30]">{step.phase}</h4>
                  </div>
                  
                  <div className="space-y-1 relative pr-8">
                    <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">Client Observation:</span>
                    
                    {editingJourneyId === step.sectionId && journeyField === 'whatClientSees' ? (
                      <div className="space-y-2">
                        <textarea
                          value={journeyValue}
                          onChange={(e) => setJourneyValue(e.target.value)}
                          className="w-full text-xs font-bold text-[#0b1c30] border border-blue-500 rounded-xl p-2 bg-blue-50/10 min-h-[60px]"
                        />
                        <div className="flex justify-end gap-1">
                          <button onClick={() => setEditingJourneyId(null)} className="text-[10px] text-neutral-500 font-bold px-2 py-1">Cancel</button>
                          <button
                            onClick={() => {
                              updateReadingJourneyStep(step.sectionId, { whatClientSees: journeyValue });
                              setEditingJourneyId(null);
                            }}
                            className="text-[10px] bg-[#0058be] text-white font-bold px-2.5 py-1 rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start gap-2 bg-neutral-50 border border-neutral-100 p-3.5 rounded-xl">
                        <p className="text-xs font-bold text-[#0b1c30] leading-relaxed">
                          {step.whatClientSees}
                        </p>
                        <button
                          onClick={() => {
                            setEditingJourneyId(step.sectionId);
                            setJourneyField('whatClientSees');
                            setJourneyValue(step.whatClientSees);
                          }}
                          className="p-1 opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-neutral-700 rounded-md cursor-pointer transition-opacity"
                        >
                          <Edit2 size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Right Side: Strategic Purpose */}
                <div className="space-y-4 md:w-1/2 md:border-l border-neutral-100 md:pl-6">
                  <div className="space-y-1 relative pr-8">
                    <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">Strategic Purpose:</span>
                    
                    {editingJourneyId === step.sectionId && journeyField === 'whyTheySeeIt' ? (
                      <div className="space-y-2">
                        <textarea
                          value={journeyValue}
                          onChange={(e) => setJourneyValue(e.target.value)}
                          className="w-full text-xs font-semibold text-neutral-600 border border-blue-500 rounded-xl p-2 bg-blue-50/10 min-h-[60px]"
                        />
                        <div className="flex justify-end gap-1">
                          <button onClick={() => setEditingJourneyId(null)} className="text-[10px] text-neutral-500 font-bold px-2 py-1">Cancel</button>
                          <button
                            onClick={() => {
                              updateReadingJourneyStep(step.sectionId, { whyTheySeeIt: journeyValue });
                              setEditingJourneyId(null);
                            }}
                            className="text-[10px] bg-[#0058be] text-white font-bold px-2.5 py-1 rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-xs font-semibold text-neutral-600 leading-relaxed">
                          {step.whyTheySeeIt}
                        </p>
                        <button
                          onClick={() => {
                            setEditingJourneyId(step.sectionId);
                            setJourneyField('whyTheySeeIt');
                            setJourneyValue(step.whyTheySeeIt);
                          }}
                          className="p-1 opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-neutral-700 rounded-md cursor-pointer transition-opacity"
                        >
                          <Edit2 size={10} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Trust established banner */}
                  <div className="bg-emerald-500/[0.02] rounded-xl p-3.5 border border-emerald-500/20 relative pr-8">
                    <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                      <ShieldCheck size={13} className="text-emerald-600" />
                      Trust Established
                    </span>
                    
                    {editingJourneyId === step.sectionId && journeyField === 'trustEstablished' ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={journeyValue}
                          onChange={(e) => setJourneyValue(e.target.value)}
                          className="w-full text-xs font-bold text-emerald-800 border border-blue-500 rounded-lg p-2 bg-blue-50/10"
                        />
                        <div className="flex justify-end gap-1">
                          <button onClick={() => setEditingJourneyId(null)} className="text-[10px] text-neutral-500 font-bold px-2 py-1">Cancel</button>
                          <button
                            onClick={() => {
                              updateReadingJourneyStep(step.sectionId, { trustEstablished: journeyValue });
                              setEditingJourneyId(null);
                            }}
                            className="text-[10px] bg-[#0058be] text-white font-bold px-2.5 py-1 rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-xs font-bold text-emerald-800 leading-relaxed">{step.trustEstablished}</p>
                        <button
                          onClick={() => {
                            setEditingJourneyId(step.sectionId);
                            setJourneyField('trustEstablished');
                            setJourneyValue(step.trustEstablished);
                          }}
                          className="p-1 opacity-0 group-hover:opacity-100 text-emerald-600 hover:text-emerald-800 rounded-md cursor-pointer transition-opacity"
                        >
                          <Edit2 size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Live Wireframe Section */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-[#0058be]" />
              <h3 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider">
                Live Portfolio Wireframe Preview
              </h3>
            </div>
            <p className="text-xs text-neutral-500 font-semibold">
              Visualize exactly where each of your Step 2 proof assets fits in your structural page layout.
            </p>
          </div>

          {/* Builder View / Client View Toggle */}
          <div className="flex items-center bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200/60 self-start sm:self-auto shrink-0">
            <button
              onClick={() => setViewMode('builder')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5 border-none",
                viewMode === 'builder'
                  ? "bg-white text-[#0b1c30] shadow-sm border border-neutral-200/50"
                  : "text-neutral-500 hover:text-neutral-700 bg-transparent"
              )}
            >
              <Layers size={13} />
              Builder Blueprint
            </button>
            <button
              onClick={() => setViewMode('client')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5 border-none",
                viewMode === 'client'
                  ? "bg-white text-[#0b1c30] shadow-sm border border-neutral-200/50"
                  : "text-neutral-500 hover:text-neutral-700 bg-transparent"
              )}
            >
              <Eye size={13} />
              Client Experience
            </button>
          </div>
        </div>

        {/* Live CSS Wireframe */}
        <div className="border border-neutral-200 rounded-3xl bg-[#f8f9ff]/80 p-5 sm:p-8 space-y-6">
          {/* Wireframe Hero */}
          <div 
            onMouseEnter={() => setActiveHoverSection('hero')}
            onMouseLeave={() => setActiveHoverSection(null)}
            className={cn(
              "p-6 rounded-2xl transition-all border text-center relative",
              viewMode === 'builder' 
                ? "bg-white border-dashed border-neutral-300"
                : "bg-[#0b1c30] text-white border-transparent shadow-md"
            )}
          >
            {viewMode === 'builder' ? (
              <div className="space-y-3">
                <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">HERO AREA BLUEPRINT</span>
                <div className="border border-blue-100 bg-blue-50/50 rounded-xl p-4 inline-block max-w-xl mx-auto">
                  <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest block mb-1">Core Trust Promise (Editable in Step 1)</span>
                  <p className="text-sm font-black text-[#0b1c30] leading-relaxed">
                    {useModule3Store.getState().coreTrustPromise || "My Custom Trust Promise"}
                  </p>
                </div>
                {activeHoverSection === 'hero' && (
                  <div className="text-[10px] text-blue-500 font-bold mt-2 flex items-center justify-center gap-1">
                    <Info size={12} /> Highlights your primary positioning and hook to capture attention in 3 seconds.
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 max-w-xl mx-auto py-4">
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">PROVED PROMISE</span>
                <h1 className="text-lg sm:text-xl font-black leading-snug">
                  {useModule3Store.getState().coreTrustPromise || "My Custom Trust Promise"}
                </h1>
                <p className="text-xs text-white/60 font-semibold leading-relaxed">
                  Trusted diagnostic positioning validated by structural evidence.
                </p>
              </div>
            )}
          </div>

          {/* Section Grid: Foundational vs Supporting */}
          <div className="grid gap-6 sm:grid-cols-2">
            
            {/* Foundational Proof Section */}
            <div 
              onMouseEnter={() => setActiveHoverSection('foundational')}
              onMouseLeave={() => setActiveHoverSection(null)}
              className={cn(
                "p-5 rounded-2xl border transition-all space-y-4",
                viewMode === 'builder' 
                  ? "bg-white border-dashed border-neutral-300" 
                  : "bg-white border-neutral-200/80 shadow-sm"
              )}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1 text-left">
                  {viewMode === 'builder' && (
                    <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest block">FOUNDATIONAL PROOF</span>
                  )}
                  <h4 className="text-sm font-black text-[#0b1c30]">
                    {displayStrategy.portfolioStructure[0]?.sectionName || 'Foundational Proof'}
                  </h4>
                  {viewMode === 'builder' && (
                    <p className="text-[11px] text-neutral-400 font-semibold leading-relaxed">
                      {displayStrategy.portfolioStructure[0]?.purpose}
                    </p>
                  )}
                </div>
                
                {/* Interaction indicator */}
                {activeHoverSection === 'foundational' && viewMode === 'builder' && (
                  <div className="text-[9px] bg-purple-50 text-purple-600 font-bold px-2 py-0.5 rounded border border-purple-100">
                    High Priority Assets
                  </div>
                )}
              </div>

              {/* Mapped Assets */}
              <div className="space-y-3">
                {displayStrategy.portfolioStructure[0]?.proofAssetIds.length > 0 ? (
                  displayStrategy.portfolioStructure[0].proofAssetIds.map(assetId => {
                    const status = getAssetStatus(assetId);
                    const badge = getAssetStatusLabel(status);
                    const asset = proofAssets.find(a => a.id === assetId);

                    return (
                      <div key={assetId} className="bg-neutral-50 rounded-xl p-3 border border-neutral-100 text-left space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-[#0b1c30] truncate">
                            {asset?.title || assetId.replace(/_/g, ' ')}
                          </span>
                          <span className={cn("text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border", badge.styles)}>
                            {badge.label}
                          </span>
                        </div>
                        {viewMode === 'builder' && (
                          <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed">
                            {asset?.credibilityGapProved || "Gaps mapped to section."}
                          </p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-neutral-400 italic text-center py-4">No high-priority assets mapped to this section.</p>
                )}
              </div>
            </div>

            {/* Supporting Evidence Section */}
            <div 
              onMouseEnter={() => setActiveHoverSection('supporting')}
              onMouseLeave={() => setActiveHoverSection(null)}
              className={cn(
                "p-5 rounded-2xl border transition-all space-y-4",
                viewMode === 'builder' 
                  ? "bg-white border-dashed border-neutral-300" 
                  : "bg-white border-neutral-200/80 shadow-sm"
              )}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1 text-left">
                  {viewMode === 'builder' && (
                    <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest block">SUPPORTING EVIDENCE</span>
                  )}
                  <h4 className="text-sm font-black text-[#0b1c30]">
                    {displayStrategy.portfolioStructure[1]?.sectionName || 'Supporting Evidence'}
                  </h4>
                  {viewMode === 'builder' && (
                    <p className="text-[11px] text-neutral-400 font-semibold leading-relaxed">
                      {displayStrategy.portfolioStructure[1]?.purpose}
                    </p>
                  )}
                </div>
                
                {/* Interaction indicator */}
                {activeHoverSection === 'supporting' && viewMode === 'builder' && (
                  <div className="text-[9px] bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded border border-indigo-100">
                    Supporting Assets
                  </div>
                )}
              </div>

              {/* Mapped Assets */}
              <div className="space-y-3">
                {displayStrategy.portfolioStructure[1]?.proofAssetIds.length > 0 ? (
                  displayStrategy.portfolioStructure[1].proofAssetIds.map(assetId => {
                    const status = getAssetStatus(assetId);
                    const badge = getAssetStatusLabel(status);
                    const asset = proofAssets.find(a => a.id === assetId);

                    return (
                      <div key={assetId} className="bg-neutral-50 rounded-xl p-3 border border-neutral-100 text-left space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-[#0b1c30] truncate">
                            {asset?.title || assetId.replace(/_/g, ' ')}
                          </span>
                          <span className={cn("text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border", badge.styles)}>
                            {badge.label}
                          </span>
                        </div>
                        {viewMode === 'builder' && (
                          <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed">
                            {asset?.credibilityGapProved || "Supporting claims."}
                          </p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-neutral-400 italic text-center py-4">No supporting assets mapped to this section.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Platform Recommendations Section */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 px-1">
          <Award size={16} className="text-[#0058be]" />
          <h3 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider">
            Portfolio Publication Recommendations
          </h3>
        </div>

        {/* Primary Recommendations */}
        <div className="space-y-4">
          <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block px-1">
            ⭐⭐ Primary Channels (Recommended)
          </span>
          <div className="grid gap-5 sm:grid-cols-2">
            {platformRecommendations.filter(p => p.isPrimary).map((platform, i) => (
              <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-4 text-left flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-[#0b1c30]">{platform.name}</h4>
                    <span className="text-[9px] font-bold text-[#0058be] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/50">Primary</span>
                  </div>
                  <p className="text-xs text-neutral-500 font-semibold leading-relaxed">{platform.whyRecommended}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-neutral-100">
                  {/* Completeness Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-black text-neutral-400">
                      <span>PROFILE COMPLETENESS</span>
                      <span className="text-[#0b1c30]">{platform.completeness}%</span>
                    </div>
                    <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#0058be] h-full rounded-full transition-all duration-500" style={{ width: `${platform.completeness}%` }} />
                    </div>
                  </div>

                  <button
                    onClick={() => window.open(platform.url, '_blank')}
                    className="w-full text-center bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-neutral-200 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Open Platform
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alternative Platforms */}
        <div className="space-y-4 pt-3">
          <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block px-1">
            Alternative Platforms
          </span>
          <div className="grid gap-5 sm:grid-cols-2">
            {platformRecommendations.filter(p => !p.isPrimary).map((platform, i) => (
              <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-4 text-left flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-[#0b1c30]">{platform.name}</h4>
                    <span className="text-[9px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">Alternative</span>
                  </div>
                  <p className="text-xs text-neutral-500 font-semibold leading-relaxed">{platform.whyRecommended}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-neutral-100">
                  {/* Completeness Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-black text-neutral-400">
                      <span>PROFILE COMPLETENESS</span>
                      <span className="text-[#0b1c30]">{platform.completeness}%</span>
                    </div>
                    <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#0058be] h-full rounded-full transition-all duration-500" style={{ width: `${platform.completeness}%` }} />
                    </div>
                  </div>

                  <button
                    onClick={() => window.open(platform.url, '_blank')}
                    className="w-full text-center bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-neutral-200 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Open Platform
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Action Footer */}
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
