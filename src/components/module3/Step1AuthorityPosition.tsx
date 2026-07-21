import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowLeft, ArrowRight, Check, AlertTriangle, Layout, ChevronDown, ChevronUp, FileText, Info, Award, HelpCircle, Edit2, CheckCircle, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';
import { useModule3Store } from '../../lib/module3';
import { resolveRecommendedPosition, generateAuthorityProfile, generateCoreTrustPromise, PositionContext, AUTHORITY_POSITIONS } from '../../data/module3/authority-positions';
import { classifyService } from '../../data/module3/service-taxonomy';
import { StepHeader } from '../workspace/StepHeader';
import { StepActionArea } from '../workspace/StepActionArea';
import { ModuleButton } from '../workspace/ModuleButton';

function usePositionContext() {
  const careerTrackId = useModule3Store((s) => s.mod1CareerTrackId);
  const serviceId = useModule3Store((s) => s.mod1ServiceId);
  const marketId = useModule3Store((s) => s.mod1MarketId);
  const nicheId = useModule3Store((s) => s.mod1NicheId);
  const positioning = useModule3Store((s) => s.mod1Positioning);
  const offerType = useModule3Store((s) => s.mod2OfferType);
  const deliverables = useModule3Store((s) => s.mod2Deliverables);
  const uniqueMechanism = useModule3Store((s) => s.mod2UniqueMechanism);
  const valueAmplifier = useModule3Store((s) => s.mod2ValueAmplifier);

  return useMemo(() => ({
    careerTrackId,
    serviceId,
    marketId,
    nicheId,
    positioning,
    offerType,
    deliverables,
    uniqueMechanism,
    valueAmplifier,
  }), [careerTrackId, serviceId, marketId, nicheId, positioning, offerType, deliverables, uniqueMechanism, valueAmplifier]);
}

function generatePersonalizedGuidelines(
  position: 'builder' | 'auditor' | 'deconstructor' | 'practitioner',
  ctx: { serviceId: string | null; marketId: string | null }
) {
  const serviceClass = classifyService(ctx.serviceId);
  const serviceLabel = serviceClass.label;
  const marketLabel = ctx.marketId ? ctx.marketId.replace(/_/g, ' ') : 'target market';

  const data = {
    builder: {
      startDoing: [
        `Publish visual, walk-through case studies showing the complete source-files or Figma layers of your ${serviceLabel} builds.`,
        `Design concrete prototype models demonstrating how your builds directly solve business pain points for ${marketLabel}.`
      ],
      continueDoing: [
        `Showcasing tangible final deliverables instead of talking about abstract ${serviceLabel} methodologies.`,
        `Using high-fidelity visuals or live demos to let ${marketLabel} experience your output directly.`
      ],
      avoidDoing: [
        `Making broad claims about your ${serviceLabel} expertise without attaching a screenshot, demo link, or codebase.`,
        `Wasting client meetings on slide decks; show live working prototypes instead.`
      ]
    },
    auditor: {
      startDoing: [
        `Offer free or rapid audit checklist diagnostics analyzing the current ${serviceLabel} bottlenecks of ${marketLabel}.`,
        `Build spreadsheets or tracking scorecards showing exact load times, retention drops, or conversion gaps.`
      ],
      continueDoing: [
        `Presenting clear, quantitative benchmark scores (e.g. Lighthouse, retention charts) to prove your findings.`,
        `Framing your ${serviceLabel} work as a measurable ROI boost rather than a manual editing or coding service.`
      ],
      avoidDoing: [
        `Pitching ${serviceLabel} improvements to ${marketLabel} without first running a diagnostic scan to show what is broken.`,
        `Using vague, subjective adjectives like 'better' or 'cleaner' instead of hard metrics.`
      ]
    },
    deconstructor: {
      startDoing: [
        `Publish step-by-step breakdown playbooks showing how industry-leading companies solve their ${serviceLabel} challenges.`,
        `Create annotated blueprints showing why a specific ${serviceLabel} layout or cut works so well.`
      ],
      continueDoing: [
        `Positioning yourself as a strategic consultant who understands the 'why' behind ${serviceLabel} success.`,
        `Teaching ${marketLabel} the principles of effective design or code patterns to build authority.`
      ],
      avoidDoing: [
        `Starting work for ${marketLabel} without a pre-written, detailed execution blueprint or playbook.`,
        `Selling yourself as just a hand-to-hire executor; position as the consulting architect.`
      ]
    },
    practitioner: {
      startDoing: [
        `Document your daily, in-the-trenches ${serviceLabel} workflow logs or screen recording snippets.`,
        `Create retrospective case-logs detailing how you fixed active, real-world problems for your clients.`
      ],
      continueDoing: [
        `Emphasizing your hands-on execution speed and reliability under tight timelines.`,
        `Showing active work sessions or live collaborative boards (like Slack, Figma, GitHub) to demonstrate transparency.`
      ],
      avoidDoing: [
        `Hiding your workflow from ${marketLabel}; let them see the raw, honest process behind your ${serviceLabel} delivery.`,
        `Pretending to have a large agency setup when clients are buying your direct personal dedication.`
      ]
    }
  };

  return data[position] || data.builder;
}

export function Step1AuthorityPosition() {
  const ctx = usePositionContext();
  
  const pendingProfile = useModule3Store(s => s.pendingProfile);
  const authorityProfile = useModule3Store(s => s.authorityProfile);
  const setPendingProfile = useModule3Store(s => s.setPendingProfile);
  const setAuthorityProfile = useModule3Store(s => s.setAuthorityProfile);
  const isUpstreamStale = useModule3Store(s => s.isUpstreamStale);
  const promiseVariationIndex = useModule3Store(s => s.promiseVariationIndex);
  
  const confirmStep = useModule3Store(s => s.confirmStep);
  const nextStep = useModule3Store(s => s.nextStep);
  const previousStep = useModule3Store(s => s.previousStep);
  const completedSteps = useModule3Store((s) => s.completedSteps);
  const isCompleted = completedSteps.includes('authority_position');
  
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clearSaveStateRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isEditingPromise, setIsEditingPromise] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(true);

  const hasMissingContext = !ctx.serviceId || !ctx.marketId;

  // Determine service track family
  const serviceTrack = useMemo(() => {
    if (hasMissingContext) return 'other';
    return classifyService(ctx.serviceId).family;
  }, [ctx.serviceId, hasMissingContext]);

  // Quiz-specific state
  const [showQuiz, setShowQuiz] = useState(!authorityProfile && !hasMissingContext);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [quizMatchedPosition, setQuizMatchedPosition] = useState<string | null>(null);

  // Dynamic quiz content personalized by career track
  const quizQuestions = useMemo(() => {
    const track = serviceTrack as 'developer' | 'designer' | 'editor' | 'automation' | 'other';
    const questions = [
      {
        title: "What is your primary focus when starting a project?",
        options: {
          developer: [
            { val: 'builder', text: "Writing custom code, building features, or shipping new architectures from scratch" },
            { val: 'auditor', text: "Debugging, analyzing codebases, optimization, and auditing performance logs" },
            { val: 'deconstructor', text: "Studying open-source codebases, explaining complexity, and writing code blueprints" },
            { val: 'practitioner', text: "Coding in the trenches daily, handling hotfixes, and working closely with dev teams" }
          ],
          designer: [
            { val: 'builder', text: "Designing custom UI components, building wireframes, or creating visual design systems from scratch" },
            { val: 'auditor', text: "Conducting design reviews, identifying UX flaws, and auditing usability metrics" },
            { val: 'deconstructor', text: "Deconstructing UI trends, writing design guidelines, and explaining visual hierarchies" },
            { val: 'practitioner', text: "Designing interactive screens, wireframing in Figma, and working directly on design layouts" }
          ],
          editor: [
            { val: 'builder', text: "Editing fresh raw footage, assembling pacings, or creating video cuts from scratch" },
            { val: 'auditor', text: "Analyzing retention drops, finding pacing errors, and auditing editing files" },
            { val: 'deconstructor', text: "Analyzing viral hooks, writing editing breakdowns, and deconstructing popular styles" },
            { val: 'practitioner', text: "Cutting and pacing clips daily, aligning audio tracks, and editing in the timeline" }
          ],
          automation: [
            { val: 'builder', text: "Creating custom workflows, integrating APIs, or building active automation pipelines from scratch" },
            { val: 'auditor', text: "Analyzing workflow logs, identifying system failures, and auditing error logs" },
            { val: 'deconstructor', text: "Deconstructing automation blueprints, documenting APIs, and explaining connection steps" },
            { val: 'practitioner', text: "Mapping active webhook triggers daily, fixing broken runs, and managing system connections" }
          ],
          other: [
            { val: 'builder', text: "Writing custom landing pages, drafting email sequences, or creating marketing copy from scratch" },
            { val: 'auditor', text: "Analyzing copy conversions, identifying drop-off zones, and auditing search rankings" },
            { val: 'deconstructor', text: "Analyzing high-converting sales copies, explaining psychological triggers, and writing swipe guides" },
            { val: 'practitioner', text: "Drafting copy drafts daily, testing subject lines, and collaborating directly with marketing teams" }
          ]
        }
      },
      {
        title: "How do you prefer to demonstrate your value to clients?",
        options: {
          developer: [
            { val: 'builder', text: "Show them a polished, working product or interactive live website" },
            { val: 'auditor', text: "Present them with a detailed performance audit or Lighthouse report" },
            { val: 'deconstructor', text: "Share a technical code review or a system architecture breakdown" },
            { val: 'practitioner', text: "Walk them through my git commits, active pull requests, or terminal workflow" }
          ],
          designer: [
            { val: 'builder', text: "Show them a clean Figma canvas or clickable interactive prototypes" },
            { val: 'auditor', text: "Present them with a detailed UX audit report or conversion breakdown" },
            { val: 'deconstructor', text: "Share a design system breakdown or a visual layout anatomy guide" },
            { val: 'practitioner', text: "Walk them through my Figma components, design sprints, or design workspaces" }
          ],
          editor: [
            { val: 'builder', text: "Show them a high-impact, finished showreel or edited compilation" },
            { val: 'auditor', text: "Present them with a detailed pacing report or retention audit logs" },
            { val: 'deconstructor', text: "Share an editing breakdown video or pacing analysis guide" },
            { val: 'practitioner', text: "Walk them through my editing timeline layers, pacing guides, or Premiere workspace" }
          ],
          automation: [
            { val: 'builder', text: "Show them a live, running Make or n8n workflow diagram" },
            { val: 'auditor', text: "Present them with an error rate audit or system bottleneck report" },
            { val: 'deconstructor', text: "Share an API integration playbook or system connection breakdown" },
            { val: 'practitioner', text: "Walk them through my active webhooks, API mapping, or Make scenario workspace" }
          ],
          other: [
            { val: 'builder', text: "Show them a high-converting sales page or draft copy folder" },
            { val: 'auditor', text: "Present them with a CTR / conversion audit report or SEO scorecard" },
            { val: 'deconstructor', text: "Share a copy analysis case study or writing swipe file playbook" },
            { val: 'practitioner', text: "Walk them through my copy iterations, subject line variants, or writing workspace" }
          ]
        }
      },
      {
        title: "What kind of feedback makes you feel most accomplished?",
        options: {
          developer: [
            { val: 'builder', text: "'This codebase compiles perfectly, the features work flawlessly, and it is highly scalable!'" },
            { val: 'auditor', text: "'You resolved our memory leak and optimized page load speeds by 40%!'" },
            { val: 'deconstructor', text: "'This technical breakdown made our complex API integrations super simple to grasp!'" },
            { val: 'practitioner', text: "'You resolved the bugs alongside our team under tight deadlines without fuss!'" }
          ],
          designer: [
            { val: 'builder', text: "'This UI is gorgeous, follows auto-layout rules, and looks incredibly premium!'" },
            { val: 'auditor', text: "'You found 12 critical usability flaws and helped us increase signups by 25%!'" },
            { val: 'deconstructor', text: "'This design system playbook makes it extremely clear how to structure our product layout!'" },
            { val: 'practitioner', text: "'You iterated with our product team daily and designed exactly the screens we needed!'" }
          ],
          editor: [
            { val: 'builder', text: "'This video cut is extremely engaging, the pacing is perfect, and hooks are amazing!'" },
            { val: 'auditor', text: "'You fixed our retention drop and kept viewers hooked for 40% longer!'" },
            { val: 'deconstructor', text: "'This breakdown of viral pacing styles made it super clear how we should edit next!'" },
            { val: 'practitioner', text: "'You delivered clean edits and revised clips daily with our creative team!'" }
          ],
          automation: [
            { val: 'builder', text: "'This integration works seamlessly, trigger delays are gone, and it saves us hours!'" },
            { val: 'auditor', text: "'You identified 4 critical loop holes in our flows and saved us 30% in task costs!'" },
            { val: 'deconstructor', text: "'This database schema playbook made it super easy to understand our data structure!'" },
            { val: 'practitioner', text: "'You fixed our webhook bugs and maintained our active workflows under pressure!'" }
          ],
          other: [
            { val: 'builder', text: "'This copy is incredibly engaging, readable, and captures our brand voice perfectly!'" },
            { val: 'auditor', text: "'You boosted our email open rates by 30% and increased sales page conversions by 15%!'" },
            { val: 'deconstructor', text: "'This writing playbook explained how to trigger user interest in an extremely clear way!'" },
            { val: 'practitioner', text: "'You wrote and optimized copy variants with our performance team under tight deadlines!'" }
          ]
        }
      }
    ];

    return questions.map(q => ({
      title: q.title,
      options: q.options[track] || q.options.other
    }));
  }, [serviceTrack]);

  // Dynamically resolve what the AI recommends independently
  const aiRecommendedPosition = useMemo(() => {
    if (hasMissingContext) return 'builder';
    return resolveRecommendedPosition(ctx as PositionContext);
  }, [ctx, hasMissingContext]);

  // Determine active archetype
  const activePosition = pendingProfile?.position || aiRecommendedPosition;

  useEffect(() => {
    if (!pendingProfile && !hasMissingContext) {
      const profile = generateAuthorityProfile(aiRecommendedPosition, ctx as PositionContext);
      setPendingProfile(profile);
    }
  }, [pendingProfile, hasMissingContext, ctx, aiRecommendedPosition, setPendingProfile]);

  // Clean up timeouts
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (clearSaveStateRef.current) clearTimeout(clearSaveStateRef.current);
    };
  }, []);

  const handleSelectPosition = (pos: 'builder' | 'auditor' | 'deconstructor' | 'practitioner') => {
    if (hasMissingContext) return;
    const newProfile = generateAuthorityProfile(pos, ctx as PositionContext);
    setPendingProfile(newProfile);
    triggerAutosave(newProfile.coreTrustPromise);
  };

  const handleApprove = () => {
    if (pendingProfile) {
      setAuthorityProfile(pendingProfile);
      useModule3Store.setState({ 
        authorityPosition: pendingProfile.position, 
        coreTrustPromise: pendingProfile.coreTrustPromise,
        authorityPositionRationale: pendingProfile.whyThisFitsYou,
      });
      confirmStep();
      nextStep();
    }
  };

  const handleNext = () => {
    if (isCompleted) {
      nextStep();
    } else {
      handleApprove();
    }
  };

  const triggerAutosave = (promiseVal: string) => {
    setSaveState('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    if (clearSaveStateRef.current) clearTimeout(clearSaveStateRef.current);
    
    saveTimeoutRef.current = setTimeout(() => {
      setSaveState('saved');
      clearSaveStateRef.current = setTimeout(() => {
        setSaveState('idle');
      }, 2000);
    }, 1000);
  };

  const handlePromiseChange = (val: string) => {
    if (!pendingProfile) return;
    setPendingProfile({ ...pendingProfile, coreTrustPromise: val });
    triggerAutosave(val);
  };

  const handleCyclePromise = () => {
    if (!pendingProfile || hasMissingContext) return;
    const nextVar = (promiseVariationIndex + 1) % 3;
    useModule3Store.setState({ promiseVariationIndex: nextVar });
    
    const newPromise = generateCoreTrustPromise(pendingProfile.position, ctx as PositionContext, nextVar);
    setPendingProfile({ ...pendingProfile, coreTrustPromise: newPromise });
    triggerAutosave(newPromise);
  };

  const handleRefreshRecommendation = () => {
    if (hasMissingContext) return;
    const profile = generateAuthorityProfile(aiRecommendedPosition, ctx as PositionContext);
    setPendingProfile(profile);
    triggerAutosave(profile.coreTrustPromise);
  };

  // Quiz execution
  const handleQuizAnswer = (val: string) => {
    const updatedAnswers = [...quizAnswers, val];
    setQuizAnswers(updatedAnswers);

    if (currentQuizIdx < 2) {
      setCurrentQuizIdx(prev => prev + 1);
    } else {
      // Calculate winner
      const counts: Record<string, number> = { builder: 0, auditor: 0, deconstructor: 0, practitioner: 0 };
      updatedAnswers.forEach(ans => {
        counts[ans] = (counts[ans] || 0) + 1;
      });
      
      let maxVal = -1;
      let matched = aiRecommendedPosition;
      Object.keys(counts).forEach(key => {
        if (counts[key] > maxVal) {
          maxVal = counts[key];
          matched = key as any;
        } else if (counts[key] === maxVal && key === aiRecommendedPosition) {
          matched = key as any; // tie breaker
        }
      });

      setQuizMatchedPosition(matched);
      handleSelectPosition(matched as any);
      setShowQuiz(false);
    }
  };

  const handleRestartQuiz = () => {
    setQuizAnswers([]);
    setCurrentQuizIdx(0);
    setQuizMatchedPosition(null);
    setShowQuiz(true);
  };

  // Dynamic styling of variables inside promise text
  const highlightPromiseText = (text: string) => {
    if (!text) return '';
    const serviceLabel = classifyService(ctx.serviceId).label;
    const marketLabel = ctx.marketId ? ctx.marketId.replace(/_/g, ' ') : '';
    
    const keywords = [
      serviceLabel,
      marketLabel,
      "trust", "expert", "expertise", "proves", "prove",
      "results", "earn", "earns", "performance", "consistent",
      "quality", "diagnostic", "diagnostics", "blueprint",
      "deliver", "workflow", "workforce", "audit", "build", "playbook"
    ].filter(Boolean);

    let regexStr = keywords
      .map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
      .join('|');
    
    if (!regexStr) return text;
    
    const regex = new RegExp(`\\b(${regexStr})\\b`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => {
      const isMatch = keywords.some(w => w.toLowerCase() === part.toLowerCase());
      if (isMatch) {
        return (
          <span key={i} className="text-[#0058be] font-extrabold border-b border-[#0058be]/20 bg-[#0058be]/5 px-1 py-0.5 rounded">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Word count check
  const wordCount = useMemo(() => {
    if (!pendingProfile?.coreTrustPromise) return 0;
    return pendingProfile.coreTrustPromise.trim().split(/\s+/).filter(Boolean).length;
  }, [pendingProfile?.coreTrustPromise]);

  const personalizedGuidelines = useMemo(() => {
    if (hasMissingContext || !pendingProfile) return { startDoing: [], continueDoing: [], avoidDoing: [] };
    return generatePersonalizedGuidelines(activePosition, ctx);
  }, [activePosition, ctx, pendingProfile, hasMissingContext]);

  return (
    <div className="space-y-8">
      <StepHeader
        step={{ current: 1, total: 5 }}
        title="Find Your Authority Type"
        description="Every freelancer has a natural superpower for winning client trust. Take our quick, track-specific personality quiz or select your archetype below."
      />

      {isUpstreamStale && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
          <AlertTriangle size={16} className="text-amber-700 shrink-0 mt-2" aria-hidden="true" />
          <div className="flex-1">
            <p className="text-xs font-bold text-amber-800">Your profile details changed</p>
            <p className="text-xs text-amber-700 mt-0.5">Your offers or positioning have been modified in Modules 1 or 2. Update your recommendation:</p>
          </div>
          <button 
            onClick={handleRefreshRecommendation}
            className="text-[11px] font-bold text-[#0b1c30] uppercase tracking-wider px-4 py-2 min-h-[44px] bg-amber-200/50 hover:bg-amber-200 rounded-md transition-colors cursor-pointer outline-none border-none"
          >
            Update Strategy
          </button>
        </div>
      )}

      {hasMissingContext ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-neutral-200 bg-neutral-50/50 border-dashed">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
            <Layout className="w-5 h-5 text-neutral-400" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-bold text-[#0b1c30]">Missing Service Details</h3>
          <p className="text-sm text-neutral-500 max-w-sm mt-1 mb-6">Please complete Module 1 so we know your skill track and target audience before matching your authority style.</p>
          <ModuleButton variant="secondary" onClick={previousStep}>
            <ArrowLeft size={16} aria-hidden="true" /> Go Back to Module 1
          </ModuleButton>
        </div>
      ) : showQuiz ? (
        /* QUIZ SCREEN */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="p-8 rounded-3xl border border-[#0058be]/20 bg-gradient-to-br from-[#0058be]/5 to-transparent space-y-6 max-w-2xl mx-auto shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0058be] bg-[#0058be]/10 px-3 py-1 rounded-full">
              Question {currentQuizIdx + 1} of 3
            </span>
            <button
              onClick={() => setShowQuiz(false)}
              className="text-xs font-bold text-neutral-400 hover:text-neutral-600 cursor-pointer border-none bg-transparent"
            >
              Skip Quiz
            </button>
          </div>

          <h3 className="text-base font-black text-[#0b1c30] leading-snug">
            {quizQuestions[currentQuizIdx].title}
          </h3>

          <div className="space-y-3">
            {quizQuestions[currentQuizIdx].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleQuizAnswer(opt.val)}
                className="w-full text-left p-4 rounded-xl border border-neutral-200 bg-white hover:border-[#0058be] hover:bg-[#0058be]/5 transition-all duration-200 cursor-pointer text-xs font-medium text-neutral-700 hover:text-[#0058be]"
              >
                {opt.text}
              </button>
            ))}
          </div>

          <div className="flex gap-1 h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="bg-[#0058be] h-full transition-all duration-300"
              style={{ width: `${((currentQuizIdx + 1) / 3) * 100}%` }}
            />
          </div>
        </motion.div>
      ) : pendingProfile ? (
        /* ARCHETYPE SELECTION & PLEDGE DASHBOARD */
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400">
              Authority Archetypes
            </h3>
            <button
              onClick={handleRestartQuiz}
              className="text-xs text-[#0058be] hover:underline font-bold flex items-center gap-1 min-h-[32px] px-2 rounded hover:bg-[#0058be]/5 cursor-pointer border-none bg-transparent"
            >
              <RotateCcw size={12} /> Retake Personality Quiz
            </button>
          </div>

          {/* Archetype Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {AUTHORITY_POSITIONS.map((pos) => {
              const isActive = pendingProfile.position === pos.id;
              const isRecommended = quizMatchedPosition === pos.id || (!quizMatchedPosition && aiRecommendedPosition === pos.id);

              return (
                <button
                  key={pos.id}
                  onClick={() => handleSelectPosition(pos.id as any)}
                  className={cn(
                    "relative text-left p-6 rounded-2xl border transition-all duration-300 group cursor-pointer focus:outline-none",
                    isActive
                      ? "border-[#0058be] bg-[#0058be]/5 ring-2 ring-[#0058be]/40 shadow-md shadow-[#0058be]/5"
                      : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm",
                    isRecommended && !isActive && "ring-2 ring-dashed ring-neutral-300"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className={cn("font-extrabold text-sm mb-1 transition-colors", isActive ? "text-[#0058be]" : "text-[#0b1c30]")}>
                        {pos.label}
                      </h4>
                      <p className="text-xs text-neutral-500 leading-relaxed max-w-[280px]">
                        {pos.shortExplanation}
                      </p>
                    </div>
                    {isActive ? (
                      <div className="w-5 h-5 rounded-full bg-[#0058be] text-white flex items-center justify-center shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    ) : isRecommended ? (
                      <span className="text-[9px] font-bold text-[#0058be] bg-[#0058be]/10 px-2.5 py-1 rounded shrink-0 uppercase tracking-wider">
                        Quiz Match
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 pt-3 border-t border-dashed border-neutral-100 flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400 font-medium">Trust Asset:</span>
                    <span className="text-[10px] text-[#0b1c30]/70 font-semibold text-right max-w-[200px] truncate">
                      {pos.id === 'builder' ? 'Tangible Builds' : pos.id === 'auditor' ? 'Audit scorecards' : pos.id === 'deconstructor' ? 'Tactical playbooks' : 'Daily work logs'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Premium quote styling for Trust Promise card */}
          <div className="p-8 rounded-3xl border border-neutral-200 bg-white shadow-sm space-y-6 relative overflow-hidden">
            {/* Background design accents */}
            <span className="absolute -top-6 -left-4 text-[120px] text-neutral-100 font-serif leading-none select-none pointer-events-none">
              “
            </span>

            <div className="flex items-center justify-between border-b border-neutral-100 pb-4 relative z-10">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Award size={14} className="text-[#0058be]" />
                Your Trust Pledge
              </span>
              <button
                onClick={() => setIsEditingPromise(!isEditingPromise)}
                className="text-xs text-[#0058be] hover:underline font-bold flex items-center gap-1 cursor-pointer border-none bg-transparent min-h-[32px]"
              >
                <Edit2 size={12} />
                {isEditingPromise ? "View Pledge" : "Edit Pledge"}
              </button>
            </div>

            <div className="relative z-10 min-h-[80px] flex items-center">
              {isEditingPromise ? (
                <div className="w-full space-y-3">
                  <textarea
                    value={pendingProfile.coreTrustPromise}
                    onChange={(e) => handlePromiseChange(e.target.value)}
                    className="w-full p-4 rounded-xl outline-none text-sm text-[#0b1c30] bg-neutral-50 border border-neutral-200 focus:border-[#0058be] focus:ring-2 focus:ring-[#0058be]/10 focus:bg-white transition-all resize-none min-h-[85px] leading-relaxed font-medium"
                    placeholder="Write your 2-sentence pledge of trust here..."
                  />
                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "text-[10px] font-bold flex items-center gap-1",
                      wordCount >= 35 && wordCount <= 55 ? "text-emerald-600" : "text-amber-500"
                    )}>
                      {wordCount >= 35 && wordCount <= 55 ? (
                        <>
                          <CheckCircle size={10} /> Optimal length ({wordCount} words)
                        </>
                      ) : (
                        <>
                          <Info size={10} /> Word count: {wordCount} (Aim for 35-55 words)
                        </>
                      )}
                    </p>
                    <button
                      onClick={handleCyclePromise}
                      className="text-[11px] text-[#0058be] hover:underline font-bold border-none bg-transparent cursor-pointer"
                    >
                      🔄 Cycle wording variation
                    </button>
                  </div>
                </div>
              ) : (
                /* High-fidelity Quote presentation text block */
                <blockquote className="text-base sm:text-lg font-bold text-[#0b1c30] leading-relaxed italic pl-4 border-l-4 border-[#0058be]">
                  {highlightPromiseText(pendingProfile.coreTrustPromise)}
                </blockquote>
              )}
            </div>

            {/* Ideal client perspective */}
            <div className="p-4 rounded-2xl bg-neutral-50/50 border border-neutral-200/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-[#0058be] uppercase tracking-wider block mb-0.5">
                  Client Perspective (What they believe)
                </span>
                <p className="text-neutral-500 italic">
                  "{pendingProfile.clientPerspective}"
                </p>
              </div>
            </div>
          </div>

          {/* Dynamic Personalized guidelines (Dos & Don'ts) */}
          <div className="border border-neutral-200 rounded-3xl bg-white p-6 shadow-sm space-y-6">
            <button
              onClick={() => setShowGuidelines(!showGuidelines)}
              className="flex items-center gap-2 text-xs font-black text-[#0b1c30] hover:text-neutral-800 transition-colors w-full justify-between min-h-[40px] px-2 rounded cursor-pointer border-none bg-transparent uppercase tracking-wider"
            >
              <span>🔍 View Personalised Action Guidelines</span>
              <ChevronDown className={cn("w-4 h-4 transition-transform", showGuidelines && "rotate-180")} />
            </button>

            <AnimatePresence>
              {showGuidelines && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-4 space-y-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-neutral-100 pt-5">
                    {/* Start Doing (Green) */}
                    <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-100/50 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0">
                          <Check size={11} strokeWidth={3} />
                        </div>
                        <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                          Start Doing
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {personalizedGuidelines.startDoing.map((item, i) => (
                          <li key={i} className="text-xs text-emerald-800/90 leading-relaxed font-medium flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Keep Doing (Blue) */}
                    <div className="p-5 rounded-2xl bg-blue-50/40 border border-blue-100/50 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-700 flex items-center justify-center shrink-0">
                          <ArrowRight size={11} strokeWidth={3} />
                        </div>
                        <span className="text-xs font-extrabold text-blue-800 uppercase tracking-wider">
                          Keep Doing
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {personalizedGuidelines.continueDoing.map((item, i) => (
                          <li key={i} className="text-xs text-blue-800/90 leading-relaxed font-medium flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Avoid Doing (Amber) */}
                    <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-100/50 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                          <AlertTriangle size={11} strokeWidth={3} />
                        </div>
                        <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">
                          Avoid Doing
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {personalizedGuidelines.avoidDoing.map((item, i) => (
                          <li key={i} className="text-xs text-amber-800/90 leading-relaxed font-medium flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl border border-neutral-100 bg-white animate-pulse flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-10 h-10 rounded-full bg-neutral-100 mb-4 animate-spin"></div>
          <div className="h-4 w-48 bg-neutral-100 rounded mb-2"></div>
          <div className="h-3 w-64 bg-neutral-50 rounded"></div>
        </div>
      )}

      {isCompleted && !isUpstreamStale && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-[#0b1c30] text-white flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Check className="w-5 h-5 text-emerald-400" aria-hidden="true" />
          </div>
          <div>
            <h4 className="text-sm font-bold mb-1">Strategic Foundation Approved</h4>
            <p className="text-sm text-white/70 leading-relaxed">
              Your Authority Profile is locked in. Other modules will use this profile to custom-build your portfolio and outreach copy.
            </p>
          </div>
        </motion.div>
      )}

      <StepActionArea>
        <div className="flex items-center gap-3">
          <ModuleButton variant="secondary" onClick={previousStep}>
            <ArrowLeft size={16} aria-hidden="true" />
            Back
          </ModuleButton>
          
          <AnimatePresence mode="wait">
            {saveState === 'saving' && (
              <motion.div
                key="saving"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-neutral-400 font-medium"
              >
                Saving draft...
              </motion.div>
            )}
            {saveState === 'saved' && (
              <motion.div
                key="saved"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-emerald-600 font-medium flex items-center gap-1"
              >
                <Check size={14} aria-hidden="true" /> Saved
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ModuleButton
          variant="primary"
          onClick={handleNext}
          disabled={hasMissingContext || (!pendingProfile && !showQuiz)}
        >
          {isCompleted ? 'Continue' : 'Confirm Strategy'}
          <ArrowRight size={16} aria-hidden="true" />
        </ModuleButton>
      </StepActionArea>
    </div>
  );
}
