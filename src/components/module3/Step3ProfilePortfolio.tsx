import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText, Navigation, Layout, Search, AlignLeft, ShieldCheck, PlayCircle,
  Target, MessageSquare, Award, Compass, Layers, Sparkles, ArrowLeft, ArrowRight,
  Edit2, RotateCw, RotateCcw, Check, Eye, EyeOff, ExternalLink, Shield, Info, AlertCircle,
  CheckCircle2, Circle
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
            whyRecommended: 'Showcase repositories, commit histories, and running code sandboxes.'
          },
          {
            name: 'LinkedIn Profile',
            url: 'https://linkedin.com',
            isPrimary: true,
            completeness: 72,
            whyRecommended: 'Target and connect with tech recruiters or startup founders directly.'
          },
          {
            name: 'Personal Custom Site',
            url: 'https://vercel.com',
            isPrimary: false,
            completeness: 40,
            whyRecommended: 'Complete layout autonomy for custom proof blueprints.'
          }
        ];
      case 'designer':
        return [
          {
            name: 'Figma Community',
            url: 'https://figma.com',
            isPrimary: true,
            completeness: 80,
            whyRecommended: 'Allows clients to browse interactive canvas layouts and vector files.'
          },
          {
            name: 'Behance Portfolio',
            url: 'https://behance.net',
            isPrimary: true,
            completeness: 65,
            whyRecommended: 'Detail design case studies with high-fidelity visual context.'
          },
          {
            name: 'LinkedIn Profile',
            url: 'https://linkedin.com',
            isPrimary: false,
            completeness: 55,
            whyRecommended: 'Network with product management and creative agency directors.'
          }
        ];
      case 'editor':
        return [
          {
            name: 'YouTube Channel',
            url: 'https://youtube.com',
            isPrimary: true,
            completeness: 90,
            whyRecommended: 'Host video showreels to instantly demo pacing and narrative editing.'
          },
          {
            name: 'LinkedIn Profile',
            url: 'https://linkedin.com',
            isPrimary: true,
            completeness: 70,
            whyRecommended: 'Share before/after clips to target media agencies and brands.'
          },
          {
            name: 'Vimeo Showreel',
            url: 'https://vimeo.com',
            isPrimary: false,
            completeness: 45,
            whyRecommended: 'Upload uncompressed videos without distracting algorithmic recommendations.'
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
            whyRecommended: 'Post analytical articles and case studies addressing workflow bottlenecks.'
          },
          {
            name: 'Notion Public Hub',
            url: 'https://notion.so',
            isPrimary: true,
            completeness: 60,
            whyRecommended: 'Document audit processes and automation maps cleanly.'
          },
          {
            name: 'Substack Publication',
            url: 'https://substack.com',
            isPrimary: false,
            completeness: 35,
            whyRecommended: 'Establish diagnostic authority through deep operational reports.'
          }
        ];
    }
  }, [serviceFamily]);

  if (!displayStrategy) {
    return (
      <div className="space-y-6 lg:space-y-10 text-left">
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-800 rounded-full animate-spin" />
          <p className="text-sm text-neutral-500 font-semibold">Generating strategy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto text-left pb-24">
      
      {/* Visual Roadmap Progress flow */}
      <div className="flex items-center justify-between bg-white border border-neutral-200/80 rounded-2xl p-4 text-xs font-bold text-neutral-400 shadow-sm max-w-3xl mx-auto">
        <div className="flex items-center gap-1.5 text-emerald-600">
          <CheckCircle2 size={14} />
          <span>1. Archetype</span>
        </div>
        <div className="w-4 sm:w-8 h-px bg-neutral-200" />
        <div className="flex items-center gap-1.5 text-emerald-600">
          <CheckCircle2 size={14} />
          <span>2. Proof assets</span>
        </div>
        <div className="w-4 sm:w-8 h-px bg-neutral-200" />
        <div className="flex items-center gap-1.5 text-[#0058be] bg-blue-50/50 px-2.5 py-1.5 rounded-xl border border-blue-100/50">
          <Sparkles size={12} className="animate-pulse" />
          <span>3. Layout Blueprint</span>
        </div>
        <div className="w-4 sm:w-8 h-px bg-neutral-200" />
        <div className="flex items-center gap-1.5">
          <Circle size={12} />
          <span>4. Authority Pack</span>
        </div>
      </div>

      {/* Main Header with immediate output and visual focus */}
      <div className="text-center space-y-3 max-w-2xl mx-auto pt-4">
        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100/50 uppercase tracking-widest inline-block">
          Step 3 of 4: Presenting Your Authority
        </span>
        <h2 className="text-3xl font-black text-[#0b1c30] tracking-tight">Map Evidence to Public Profiles</h2>
        <p className="text-sm text-neutral-500 font-semibold leading-relaxed">
          Structure your archetype trust hook and your verified proof assets into a high-converting client reading journey.
        </p>
      </div>

      {/* 1. Presentation Strategy Tuning Dashboard */}
      <section className="space-y-5 bg-white border border-neutral-200/80 p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
          <Search size={16} className="text-[#0058be]" />
          <div>
            <h3 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider">
              Strategy Tuning Center
            </h3>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Customize copy before compiling</p>
          </div>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              <div
                key={card.key}
                className="bg-neutral-50/50 rounded-2xl p-4 border border-neutral-200/60 flex flex-col justify-between space-y-4 relative group hover:border-neutral-300 transition-colors"
              >
                {/* Customization controls on hover */}
                {!isEditing && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 rounded-lg p-1 shadow-sm border border-neutral-200 z-10">
                    <button
                      onClick={() => {
                        setEditingField(card.key);
                        setFieldValue(card.value);
                      }}
                      className="p-1 text-neutral-400 hover:text-[#0b1c30] rounded-md cursor-pointer transition-colors"
                      title="Edit text"
                    >
                      <Edit2 size={11} />
                    </button>
                    <button
                      onClick={() => regeneratePresentationStrategyField(card.key)}
                      className="p-1 text-neutral-400 hover:text-[#0b1c30] rounded-md cursor-pointer transition-colors"
                      title="Regenerate variant"
                    >
                      <RotateCw size={11} />
                    </button>
                    <button
                      onClick={() => resetPresentationStrategyField(card.key)}
                      className="p-1 text-neutral-400 hover:text-[#0b1c30] rounded-md cursor-pointer transition-colors"
                      title="Reset to AI default"
                    >
                      <RotateCcw size={11} />
                    </button>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center border", card.color)}>
                      <Icon size={13} />
                    </div>
                    <h4 className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">{card.title}</h4>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={fieldValue}
                      onChange={(e) => setFieldValue(e.target.value)}
                      className="w-full text-xs font-bold text-[#0b1c30] border border-blue-500 rounded-lg p-2 focus:outline-none bg-white min-h-[50px] resize-none"
                    />
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setEditingField(null)}
                        className="px-2 py-0.5 text-[9px] font-bold text-neutral-500 rounded cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          updatePresentationStrategy(card.key, fieldValue);
                          setEditingField(null);
                        }}
                        className="px-2 py-0.5 text-[9px] font-bold bg-[#0058be] text-white rounded hover:bg-blue-700 cursor-pointer flex items-center gap-1"
                      >
                        <Check size={9} /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs font-bold text-[#0b1c30] leading-relaxed">{card.value}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Reading Journey Timeline Section */}
      <section className="space-y-4 bg-white border border-neutral-200/80 p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
          <Navigation size={16} className="text-[#0058be]" />
          <div>
            <h3 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider">
              Client Reading Journey Path
            </h3>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">The sequential stages of building trust</p>
          </div>
        </div>
        
        <div className="relative pl-6 sm:pl-8 border-l border-dashed border-neutral-200/80 space-y-6 ml-4 mt-6">
          {displayStrategy.readingJourney.map((step, idx) => (
            <div 
              key={step.sectionId}
              className="bg-neutral-50/50 rounded-2xl border border-neutral-200/60 p-4 shadow-sm relative space-y-4 group hover:border-neutral-300 transition-colors"
            >
              {/* Timeline node dot */}
              <div className="absolute -left-[31px] sm:-left-[35px] top-5 w-3.5 h-3.5 rounded-full bg-[#0058be] border-4 border-white shadow-sm flex items-center justify-center" />

              <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
                {/* Stage Info */}
                <div className="space-y-2 md:w-1/2">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/50">
                      STAGE {step.stepIndex}
                    </span>
                    <h4 className="text-xs font-black text-[#0b1c30]">{step.phase}</h4>
                  </div>
                  
                  <div className="space-y-1 relative pr-8">
                    <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">Client Observation:</span>
                    
                    {editingJourneyId === step.sectionId && journeyField === 'whatClientSees' ? (
                      <div className="space-y-2">
                        <textarea
                          value={journeyValue}
                          onChange={(e) => setJourneyValue(e.target.value)}
                          className="w-full text-xs font-bold text-[#0b1c30] border border-blue-500 rounded-lg p-2 bg-white min-h-[50px] resize-none"
                        />
                        <div className="flex justify-end gap-1">
                          <button onClick={() => setEditingJourneyId(null)} className="text-[9px] text-neutral-500 font-bold px-2 py-1">Cancel</button>
                          <button
                            onClick={() => {
                              updateReadingJourneyStep(step.sectionId, { whatClientSees: journeyValue });
                              setEditingJourneyId(null);
                            }}
                            className="text-[9px] bg-[#0058be] text-white font-bold px-2.5 py-1 rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start gap-2 bg-white border border-neutral-100 p-2.5 rounded-xl">
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
                
                {/* Strategic Purpose */}
                <div className="space-y-3 md:w-1/2 md:border-l border-neutral-100 md:pl-5">
                  <div className="space-y-1 relative pr-8">
                    <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">Strategic Purpose:</span>
                    
                    {editingJourneyId === step.sectionId && journeyField === 'whyTheySeeIt' ? (
                      <div className="space-y-2">
                        <textarea
                          value={journeyValue}
                          onChange={(e) => setJourneyValue(e.target.value)}
                          className="w-full text-xs font-semibold text-neutral-600 border border-blue-500 rounded-lg p-2 bg-white min-h-[50px] resize-none"
                        />
                        <div className="flex justify-end gap-1">
                          <button onClick={() => setEditingJourneyId(null)} className="text-[9px] text-neutral-500 font-bold px-2 py-1">Cancel</button>
                          <button
                            onClick={() => {
                              updateReadingJourneyStep(step.sectionId, { whyTheySeeIt: journeyValue });
                              setEditingJourneyId(null);
                            }}
                            className="text-[9px] bg-[#0058be] text-white font-bold px-2.5 py-1 rounded hover:bg-blue-700"
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

                  {/* Trust established badge */}
                  <div className="bg-emerald-500/[0.02] rounded-xl p-2.5 border border-emerald-500/20 relative pr-8">
                    <span className="text-[8px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                      <ShieldCheck size={11} className="text-emerald-600" />
                      Trust Established
                    </span>
                    
                    {editingJourneyId === step.sectionId && journeyField === 'trustEstablished' ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={journeyValue}
                          onChange={(e) => setJourneyValue(e.target.value)}
                          className="w-full text-xs font-bold text-emerald-800 border border-blue-500 rounded-lg p-2 bg-white"
                        />
                        <div className="flex justify-end gap-1">
                          <button onClick={() => setEditingJourneyId(null)} className="text-[9px] text-neutral-500 font-bold px-2 py-1">Cancel</button>
                          <button
                            onClick={() => {
                              updateReadingJourneyStep(step.sectionId, { trustEstablished: journeyValue });
                              setEditingJourneyId(null);
                            }}
                            className="text-[9px] bg-[#0058be] text-white font-bold px-2.5 py-1 rounded hover:bg-blue-700"
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
            </div>
          ))}
        </div>
      </section>

      {/* 3. The Dominant Visual: Interactive Portfolio Safari Mockup */}
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
              Hover over layout blocks to examine strategic structure and evidence mappings.
            </p>
          </div>

          {/* Builder View / Client View Toggle */}
          <div className="flex items-center bg-neutral-100 p-1 rounded-2xl border border-neutral-200/60 self-start sm:self-auto shrink-0 shadow-inner">
            <button
              onClick={() => setViewMode('builder')}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5 border-none",
                viewMode === 'builder'
                  ? "bg-white text-[#0b1c30] shadow-sm border border-neutral-200/50"
                  : "text-neutral-500 hover:text-neutral-700 bg-transparent"
              )}
            >
              <Layers size={11} />
              Builder Mode
            </button>
            <button
              onClick={() => setViewMode('client')}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5 border-none",
                viewMode === 'client'
                  ? "bg-white text-[#0b1c30] shadow-sm border border-neutral-200/50"
                  : "text-neutral-500 hover:text-neutral-700 bg-transparent"
              )}
            >
              <Eye size={11} />
              Client View
            </button>
          </div>
        </div>

        {/* Safari Style Mock Browser Window */}
        <div className="border border-neutral-200 rounded-3xl bg-white shadow-lg overflow-hidden flex flex-col">
          {/* Safari Header */}
          <div className="bg-[#f8f9ff]/80 border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400 block shrink-0" />
              <span className="w-3 h-3 rounded-full bg-yellow-400 block shrink-0" />
              <span className="w-3 h-3 rounded-full bg-green-400 block shrink-0" />
            </div>
            
            {/* Search / Address bar */}
            <div className="bg-neutral-100 border border-neutral-200/60 text-[10px] font-semibold text-neutral-400 py-1.5 px-8 rounded-lg max-w-md w-full text-center truncate select-none">
              yourdomain.com/portfolio-blueprint
            </div>
            <div className="w-12 shrink-0" />
          </div>

          {/* Browser Content */}
          <div className="p-6 sm:p-8 space-y-6 bg-neutral-50/40">
            
            {/* Hero Wireframe Section */}
            <div
              onMouseEnter={() => setActiveHoverSection('hero')}
              onMouseLeave={() => setActiveHoverSection(null)}
              className={cn(
                "p-6 rounded-2xl transition-all border text-center relative cursor-pointer",
                viewMode === 'builder'
                  ? (activeHoverSection === 'hero' ? "bg-blue-50/40 border-[#0058be] shadow-sm" : "bg-white border-dashed border-neutral-300")
                  : "bg-[#0b1c30] text-white border-transparent shadow-md"
              )}
            >
              {viewMode === 'builder' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-[8px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">HERO POSITION HOOK</span>
                    {activeHoverSection === 'hero' && (
                      <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-1"><Info size={10}/> Section 1</span>
                    )}
                  </div>
                  <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">Core Trust Promise & Strongest Proof Point</h3>
                  <div className="border border-neutral-100 bg-neutral-50 p-3 rounded-xl max-w-xl mx-auto mt-2">
                    <p className="text-xs font-bold text-[#0b1c30] leading-relaxed">
                      "{useModule3Store.getState().coreTrustPromise || 'My Core Trust Hook'}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 max-w-xl mx-auto py-3">
                  <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">PORTFOLIO BLUEPRINT</span>
                  <h1 className="text-base sm:text-lg font-black leading-snug">
                    {useModule3Store.getState().coreTrustPromise || 'My Core Trust Hook'}
                  </h1>
                  <p className="text-xs text-white/50 font-semibold leading-relaxed">
                    Proven authority and structural evidence mapped to client validation.
                  </p>
                </div>
              )}
            </div>

            {/* Grid structure: Foundational vs Supporting */}
            <div className="grid gap-6 sm:grid-cols-2">
              
              {/* Foundational Validation Section */}
              <div 
                onMouseEnter={() => setActiveHoverSection('foundational')}
                onMouseLeave={() => setActiveHoverSection(null)}
                className={cn(
                  "p-5 rounded-2xl border transition-all space-y-4 cursor-pointer text-left",
                  viewMode === 'builder' 
                    ? (activeHoverSection === 'foundational' ? "bg-purple-50/20 border-purple-500 shadow-sm" : "bg-white border-dashed border-neutral-300")
                    : "bg-white border-neutral-200/80 shadow-sm"
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    {viewMode === 'builder' && (
                      <span className="text-[8px] font-black text-purple-500 bg-purple-50 px-2 py-0.5 rounded uppercase tracking-wider block w-max">FOUNDATIONAL PROOF</span>
                    )}
                    <h4 className="text-xs font-black text-[#0b1c30]">
                      {displayStrategy.portfolioStructure[0]?.sectionName || 'Foundational Proof'}
                    </h4>
                    {viewMode === 'builder' && (
                      <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed">
                        {displayStrategy.portfolioStructure[0]?.purpose}
                      </p>
                    )}
                  </div>
                  
                  {activeHoverSection === 'foundational' && viewMode === 'builder' && (
                    <span className="text-[8px] font-black bg-purple-50 text-purple-600 px-2 py-0.5 rounded border border-purple-100">
                      High Impact
                    </span>
                  )}
                </div>

                {/* Assets Inside */}
                <div className="space-y-3">
                  {displayStrategy.portfolioStructure[0]?.proofAssetIds.length > 0 ? (
                    displayStrategy.portfolioStructure[0].proofAssetIds.map(assetId => {
                      const status = getAssetStatus(assetId);
                      const badge = getAssetStatusLabel(status);
                      const asset = proofAssets.find(a => a.id === assetId);

                      return (
                        <div key={assetId} className="bg-neutral-50 rounded-xl p-3 border border-neutral-100 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-[#0b1c30] truncate">
                              {asset?.title || assetId.replace(/_/g, ' ')}
                            </span>
                            <span className={cn("text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border", badge.styles)}>
                              {badge.label}
                            </span>
                          </div>
                          {viewMode === 'builder' && (
                            <p className="text-[9px] text-neutral-400 font-semibold leading-normal">
                              {asset?.credibilityGapProved || "Strategic proof mapping."}
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-[11px] text-neutral-400 italic text-center py-4">No high-priority assets mapped to this section.</p>
                  )}
                </div>
              </div>

              {/* Supporting Evidence Section */}
              <div 
                onMouseEnter={() => setActiveHoverSection('supporting')}
                onMouseLeave={() => setActiveHoverSection(null)}
                className={cn(
                  "p-5 rounded-2xl border transition-all space-y-4 cursor-pointer text-left",
                  viewMode === 'builder' 
                    ? (activeHoverSection === 'supporting' ? "bg-indigo-50/20 border-indigo-500 shadow-sm" : "bg-white border-dashed border-neutral-300")
                    : "bg-white border-neutral-200/80 shadow-sm"
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    {viewMode === 'builder' && (
                      <span className="text-[8px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider block w-max">SUPPORTING EVIDENCE</span>
                    )}
                    <h4 className="text-xs font-black text-[#0b1c30]">
                      {displayStrategy.portfolioStructure[1]?.sectionName || 'Supporting Evidence'}
                    </h4>
                    {viewMode === 'builder' && (
                      <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed">
                        {displayStrategy.portfolioStructure[1]?.purpose}
                      </p>
                    )}
                  </div>
                  
                  {activeHoverSection === 'supporting' && viewMode === 'builder' && (
                    <span className="text-[8px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-100">
                      Context Depth
                    </span>
                  )}
                </div>

                {/* Assets Inside */}
                <div className="space-y-3">
                  {displayStrategy.portfolioStructure[1]?.proofAssetIds.length > 0 ? (
                    displayStrategy.portfolioStructure[1].proofAssetIds.map(assetId => {
                      const status = getAssetStatus(assetId);
                      const badge = getAssetStatusLabel(status);
                      const asset = proofAssets.find(a => a.id === assetId);

                      return (
                        <div key={assetId} className="bg-neutral-50 rounded-xl p-3 border border-neutral-100 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-[#0b1c30] truncate">
                              {asset?.title || assetId.replace(/_/g, ' ')}
                            </span>
                            <span className={cn("text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border", badge.styles)}>
                              {badge.label}
                            </span>
                          </div>
                          {viewMode === 'builder' && (
                            <p className="text-[9px] text-neutral-400 font-semibold leading-normal">
                              {asset?.credibilityGapProved || "Strategic supporting claims."}
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-[11px] text-neutral-400 italic text-center py-4">No supporting assets mapped to this section.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 4. Prioritized Platform Recommendations Section */}
      <section className="space-y-5 bg-white border border-neutral-200/80 p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
          <Award size={16} className="text-[#0058be]" />
          <div>
            <h3 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider">
              Publication Recommendations
            </h3>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Where to publish case studies for your niche</p>
          </div>
        </div>

        {/* Primary Recommendations */}
        <div className="space-y-4">
          <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block px-1">
            ⭐⭐ Recommended Primary Channels
          </span>
          <div className="grid gap-5 sm:grid-cols-2">
            {platformRecommendations.filter(p => p.isPrimary).map((platform, i) => (
              <div key={i} className="bg-neutral-50/50 rounded-2xl border border-neutral-200/60 p-4 flex flex-col justify-between space-y-4 text-left">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-[#0b1c30]">{platform.name}</h4>
                    <span className="text-[8px] font-bold text-[#0058be] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/50">Primary</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed">{platform.whyRecommended}</p>
                </div>

                <div className="space-y-2 pt-3 border-t border-neutral-200/60">
                  {/* Completeness bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-black text-neutral-400">
                      <span>PROFILE SETUP COMPLETENESS</span>
                      <span className="text-[#0b1c30]">{platform.completeness}%</span>
                    </div>
                    <div className="w-full bg-neutral-200/60 h-1 rounded-full overflow-hidden">
                      <div className="bg-[#0058be] h-full rounded-full transition-all duration-500" style={{ width: `${platform.completeness}%` }} />
                    </div>
                  </div>

                  <button
                    onClick={() => window.open(platform.url, '_blank')}
                    className="w-full text-center bg-white hover:bg-neutral-50 text-neutral-600 border border-neutral-200/80 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Open Platform
                    <ExternalLink size={11} />
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
              <div key={i} className="bg-neutral-50/50 rounded-2xl border border-neutral-200/60 p-4 flex flex-col justify-between space-y-4 text-left">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-[#0b1c30]">{platform.name}</h4>
                    <span className="text-[8px] font-bold text-neutral-500 bg-neutral-200 px-2 py-0.5 rounded-md">Alternative</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed">{platform.whyRecommended}</p>
                </div>

                <div className="space-y-2 pt-3 border-t border-neutral-200/60">
                  {/* Completeness bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-black text-neutral-400">
                      <span>PROFILE SETUP COMPLETENESS</span>
                      <span className="text-[#0b1c30]">{platform.completeness}%</span>
                    </div>
                    <div className="w-full bg-neutral-200/60 h-1 rounded-full overflow-hidden">
                      <div className="bg-[#0058be] h-full rounded-full transition-all duration-500" style={{ width: `${platform.completeness}%` }} />
                    </div>
                  </div>

                  <button
                    onClick={() => window.open(platform.url, '_blank')}
                    className="w-full text-center bg-white hover:bg-neutral-50 text-neutral-600 border border-neutral-200/80 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Open Platform
                    <ExternalLink size={11} />
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
        <div className="flex flex-col items-end">
          <ModuleButton
            variant={pendingStrategy ? 'primary' : 'success'}
            onClick={handleApprove}
          >
            {pendingStrategy ? 'Approve Structural Strategy' : 'Strategy Approved — Continue'}
            <ArrowRight size={16} />
          </ModuleButton>
          <span className="text-[9px] font-bold text-neutral-400 mt-1.5 mr-1 block">
            Approve strategy to compile copy-paste templates in Step 4
          </span>
        </div>
      </StepActionArea>
    </div>
  );
}
