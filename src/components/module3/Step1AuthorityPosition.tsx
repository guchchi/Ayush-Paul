import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowLeft, ArrowRight, Check, AlertTriangle, Layout, ChevronDown, ChevronUp, Award, HelpCircle, Edit2, CheckCircle, RotateCcw, Info } from 'lucide-react';
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
  const track = serviceClass.family;

  const data = {
    builder: {
      editor: {
        startDoing: [
          `Publish visual walkthroughs or timeline guides showing your pacing techniques, raw-to-cut transitions, and video assets.`,
          `Create short teaser sequences demonstrating how you handle engagement hook transitions for ${marketLabel}.`
        ],
        continueDoing: [
          `Showing finished edited videos or high-impact showreels instead of discussing editing theories.`,
          `Using high-fidelity visual cuts to let ${marketLabel} experience your pacing quality directly.`
        ],
        avoidDoing: [
          `Vague claims of 'better editing' without providing a video demo link or a visual before/after cut.`,
          `Wasting client meetings discussing narrative structure; show them completed, polished video cuts instead.`
        ]
      },
      developer: {
        startDoing: [
          `Publish walk-through guides showing the clean folder structure, code files, and features of your active builds.`,
          `Design concrete working prototypes demonstrating how your builds solve business pain points for ${marketLabel}.`
        ],
        continueDoing: [
          `Showcasing working web products or interactive live links instead of discussing abstract code frameworks.`,
          `Using live, interactive sandboxes to let ${marketLabel} experience your coding quality directly.`
        ],
        avoidDoing: [
          `Making broad claims about your expertise without attaching a repository link or a running sandbox.`,
          `Wasting client meetings discussing coding theory; show them active working software instead.`
        ]
      },
      designer: {
        startDoing: [
          `Publish Figma layout walk-throughs showing your auto-layout grids, design system components, and styles.`,
          `Design prototype layouts demonstrating how your interface styles solve business pain points for ${marketLabel}.`
        ],
        continueDoing: [
          `Showcasing clickable interactive prototypes or design files instead of talking about abstract visual methodologies.`,
          `Using high-fidelity Figma canvases to let ${marketLabel} experience your layout quality directly.`
        ],
        avoidDoing: [
          `Claiming to be a design expert without sharing a Figma link, Behance showcase, or design files.`,
          `Wasting client meetings on static slide decks; show interactive, clickable layouts instead.`
        ]
      },
      automation: {
        startDoing: [
          `Publish workflow blueprints showing your Make/n8n scenario maps, API configurations, and database integrations.`,
          `Design workflow prototypes demonstrating how your integrations solve business pain points for ${marketLabel}.`
        ],
        continueDoing: [
          `Showcasing active, running automation runs instead of explaining workflow logic in text.`,
          `Using live workflow runs to let ${marketLabel} experience your automation quality directly.`
        ],
        avoidDoing: [
          `Pitching automation solutions without sharing a visual blueprint layout or a walk-through video.`,
          `Wasting client meetings on text-heavy proposals; show visual Make/n8n diagrams instead.`
        ]
      },
      other: {
        startDoing: [
          `Publish breakdown guides showing your copywriting wireframes, draft iterations, and swipe file collections.`,
          `Write draft copies demonstrating how your copy angles solve conversion bottlenecks for ${marketLabel}.`
        ],
        continueDoing: [
          `Showcasing final, live copy structures (emails, landing pages) instead of discussing abstract marketing theories.`,
          `Using clean Google Docs drafts to let ${marketLabel} review your writing quality directly.`
        ],
        avoidDoing: [
          `Pitching writing services without sharing a PDF copy sample, live link, or draft copy folder.`,
          `Wasting client meetings on general marketing strategy; show targeted, written sales drafts instead.`
        ]
      }
    },
    auditor: {
      editor: {
        startDoing: [
          `Offer free retention diagnostics or video audits looking at pacing drops, audio glitches, and graphic hook errors.`,
          `Build spreadsheet breakdowns tracking viewer drop-off percentages or average watch times for ${marketLabel}.`
        ],
        continueDoing: [
          `Presenting metrics-driven results (like average watch time improvements) to prove your video editing value.`,
          `Framing your work as a retention optimization rather than just a manual cutting or editing service.`
        ],
        avoidDoing: [
          `Suggesting video edits without first running a retention drop-off audit to prove where viewers leave.`,
          `Using vague, subjective adjectives like 'better pacing' instead of showing specific video timeline timestamp flaws.`
        ]
      },
      developer: {
        startDoing: [
          `Offer free page-speed or security audits identifying memory leaks, slow queries, or package vulnerabilities.`,
          `Build performance scorecards tracking Lighthouse results, mobile load times, or server response times for ${marketLabel}.`
        ],
        continueDoing: [
          `Presenting hard benchmarks (like Lighthouse scores or API latency reductions) to prove optimization results.`,
          `Framing your work as a speed and security optimization rather than just manual coding or bug-fixing.`
        ],
        avoidDoing: [
          `Pitching refactoring or code cleanup without first showing a diagnostic report of what is broken.`,
          `Using vague, subjective adjectives like 'cleaner code' instead of showing specific performance metrics.`
        ]
      },
      designer: {
        startDoing: [
          `Offer free UX audits or usability reviews highlighting conversion bottlenecks, layout glitches, and accessibility issues.`,
          `Build usability scorecards tracking conversion drop-offs, navigation loops, or mobile responsiveness gaps for ${marketLabel}.`
        ],
        continueDoing: [
          `Presenting usability metrics (like signup rate increases or task completion times) to validate your UI designs.`,
          `Framing your work as a conversion rate optimization rather than just drawing layouts or choosing colors.`
        ],
        avoidDoing: [
          `Proposing redesigns without showing a visual UX report or heuristic teardown of their current app.`,
          `Using vague, subjective adjectives like 'nicer UI' instead of showing specific design pattern issues.`
        ]
      },
      automation: {
        startDoing: [
          `Offer free workflow health checks identifying slow tasks, runtime errors, or redundant manual steps.`,
          `Build bottleneck scorecards tracking task usage, webhook response delays, or API call failures for ${marketLabel}.`
        ],
        continueDoing: [
          `Presenting hard system metrics (like operations saved or error rate reductions) to prove efficiency.`,
          `Framing your work as an operations cost reduction rather than just connecting third-party apps.`
        ],
        avoidDoing: [
          `Pitching system migrations without a diagnostic audit showing where their current flow breaks or wastes money.`,
          `Using vague, subjective adjectives like 'better flows' instead of showing specific task-leak errors.`
        ]
      },
      other: {
        startDoing: [
          `Offer free copy audits showing readability issues, vague headlines, or SEO optimization gaps.`,
          `Build conversion scorecards tracking CTRs, opt-in rates, or search ranking drops for ${marketLabel}.`
        ],
        continueDoing: [
          `Presenting conversion metrics (like CTR or opt-in improvements) to validate your copywriting upgrades.`,
          `Framing your work as a customer conversion rate optimizer rather than just writing blog posts or emails.`
        ],
        avoidDoing: [
          `Pitching copywriting or marketing services without first showing a tear-down of their current copy flaws.`,
          `Using vague, subjective adjectives like 'better copy' instead of showing specific copy conversion gaps.`
        ]
      }
    },
    deconstructor: {
      editor: {
        startDoing: [
          `Create visual breakdown analyses showing why trending videos or viral pacing hooks in ${marketLabel}'s niche work so well.`,
          `Create annotated scripts detailing the narrative structure, hook timing, and visual pattern interrupts of viral creators.`
        ],
        continueDoing: [
          `Positioning yourself as a content strategist who understands how to hold viewer attention and drive conversions.`,
          `Teaching ${marketLabel} the principles of audience retention loops and visual pacing.`
        ],
        avoidDoing: [
          `Starting editing work without a pre-written pacing blueprint, script structure, or retention storyboard.`,
          `Selling yourself as just a hand-to-hire video editor; position as the creative editor architect.`
        ]
      },
      developer: {
        startDoing: [
          `Publish step-by-step code playbooks explaining how successful tech products handle complex system integrations.`,
          `Create system blueprints explaining the API contracts, data flows, and database schemas of high-performance apps.`
        ],
        continueDoing: [
          `Positioning yourself as a technical architect who designs clean, repeatable system structures.`,
          `Teaching ${marketLabel} the principles of scalable system design and data efficiency.`
        ],
        avoidDoing: [
          `Starting development without a pre-written technical spec sheet, API contract, or system flow diagram.`,
          `Selling yourself as just a hand-to-hire coder; position as the software consulting architect.`
        ]
      },
      designer: {
        startDoing: [
          `Publish visual design teardowns deconstructing the UI patterns and visual systems of leading products in ${marketLabel}'s niche.`,
          `Create design system guidelines explaining the grid systems, font scales, and spacing rules of conversion-focused UI.`
        ],
        continueDoing: [
          `Positioning yourself as a UX architect who designs intuitive user journeys and scalable UI kits.`,
          `Teaching ${marketLabel} the principles of design systems, accessibility, and cognitive load.`
        ],
        avoidDoing: [
          `Creating high-fidelity UI without first aligning on wireframes, user flows, and spacing guidelines.`,
          `Selling yourself as just a screen decorator; position as the product design consultant.`
        ]
      },
      automation: {
        startDoing: [
          `Publish system blueprints deconstructing how leading companies automate their operations pipelines.`,
          `Create integration playbooks explaining API triggers, data transformations, and error handling of complex workflows.`
        ],
        continueDoing: [
          `Positioning yourself as an operations architect who designs clean, reliable database pipelines.`,
          `Teaching ${marketLabel} the principles of data centralization, webhooks, and process automation.`
        ],
        avoidDoing: [
          `Setting up scenarios or databases without first drawing a visual system schema or flow diagram.`,
          `Selling yourself as just an API connector; position as the operations consulting architect.`
        ]
      },
      other: {
        startDoing: [
          `Publish copywriting teardowns analyzing the emotional hooks and sales angles of top-converting campaigns in ${marketLabel}'s niche.`,
          `Create writing guidelines detailing the voice, tone, and formatting rules of high-conversion copy.`
        ],
        continueDoing: [
          `Positioning yourself as a messaging strategist who maps target audience psychological triggers.`,
          `Teaching ${marketLabel} the principles of direct-response copy structure and buyer psychology.`
        ],
        avoidDoing: [
          `Writing copy drafts without first aligning on a copy roadmap, outline, or core hook strategy.`,
          `Selling yourself as just a content writer; position as the customer conversion copy consultant.`
        ]
      }
    },
    practitioner: {
      editor: {
        startDoing: [
          `Document your daily, behind-the-scenes editing workflow, timeline pacing setups, or raw timeline logs.`,
          `Create retrospective timeline logs detailing how you solved pacing glitches or audio edits for ${marketLabel}.`
        ],
        continueDoing: [
          `Emphasizing your hands-on execution speed, reliable revision rounds, and direct collaboration on content.`,
          `Showing active work sessions or live project boards to keep video creation transparent.`
        ],
        avoidDoing: [
          `Hiding your editing timeline or raw pacing layers; invite creators to collaborate closely.`,
          `Pretending to have a large agency setup when creators are buying your direct personal dedication.`
        ]
      },
      developer: {
        startDoing: [
          `Share daily dev logs, terminal workflow screen-grabs, or active repository commits.`,
          `Create retrospective code logs detailing how you fixed active, real-world bugs or deploy glitches for ${marketLabel}.`
        ],
        continueDoing: [
          `Emphasizing your hands-on coding speed, quick bug-fixing cycles, and direct developer support.`,
          `Showing active code sessions or open pull requests to keep development transparent.`
        ],
        avoidDoing: [
          `Hiding your progress; keep active pull requests open and invite teams to review code early.`,
          `Pretending to have a large development agency when clients are buying your direct personal developer dedication.`
        ]
      },
      designer: {
        startDoing: [
          `Share daily design logs, Figma multiplayer sessions, or visual component drafts.`,
          `Create design sprint logs detailing how you iterated and updated layouts for ${marketLabel}.`
        ],
        continueDoing: [
          `Emphasizing your layout speed, collaborative style sessions, and quick design revisions.`,
          `Working transparently in Figma multiplayer canvas to keep design reviews collaborative.`
        ],
        avoidDoing: [
          `Working in isolation; invite client teams directly to your active Figma canvas to collaborate.`,
          `Pretending to have a large design agency when clients are buying your direct personal designer dedication.`
        ]
      },
      automation: {
        startDoing: [
          `Share active Make/n8n workspace screenshots or logs detailing custom trigger fixes.`,
          `Create workflow setup logs detailing how you automated data transfers or fixed connection bugs for ${marketLabel}.`
        ],
        continueDoing: [
          `Emphasizing your rapid scenario testing, system uptime monitoring, and active error response.`,
          `Showing active workflow configurations transparently to keep automation setups clear.`
        ],
        avoidDoing: [
          `Hiding your backend configurations; explain active integrations clearly to client teams.`,
          `Pretending to have a large IT agency when clients are buying your direct personal automation dedication.`
        ]
      },
      other: {
        startDoing: [
          `Share daily copywriting drafts, headline brainstorm logs, or copy swipe updates.`,
          `Create copy sprint logs detailing how you tested headlines or revised newsletter copy for ${marketLabel}.`
        ],
        continueDoing: [
          `Emphasizing your writing speed, quick copy edits, and close alignment with brand voices.`,
          `Showing raw copywriting iterations transparently to keep messaging reviews collaborative.`
        ],
        avoidDoing: [
          `Working in a silo; share raw copy drafts early to iterate with the performance team.`,
          `Pretending to have a large copywriting agency when clients are buying your direct personal writing dedication.`
        ]
      }
    }
  };

  const posData = data[position] || data.builder;
  return posData[track] || posData.other;
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

  // Simplified, Universal, Easy-to-Understand Quiz Questions (relatable for all tracks)
  const quizQuestions = [
    {
      title: "What type of work makes you lose track of time?",
      options: [
        { val: 'builder', text: "Creating something new (e.g. writing code, designing layouts, cutting video clips)." },
        { val: 'auditor', text: "Analyzing and optimizing (e.g. finding bugs, checking speed metrics, identifying pacing drops)." },
        { val: 'deconstructor', text: "Studying and explaining (e.g. drafting playbooks, templates, or strategic how-to guides)." },
        { val: 'practitioner', text: "Executing day-to-day tasks (e.g. fixing quick glitches, making rapid revisions directly)." }
      ]
    },
    {
      title: "What do you prefer to show a client to prove your worth?",
      options: [
        { val: 'builder', text: "A finished, polished product, design, or video." },
        { val: 'auditor', text: "An audit report pointing out exact performance flaws or gaps." },
        { val: 'deconstructor', text: "A step-by-step strategy blueprint or structural guide." },
        { val: 'practitioner', text: "A walkthrough of my daily workspace, logs, and work speed." }
      ]
    },
    {
      title: "What is your favorite kind of compliment from a client?",
      options: [
        { val: 'builder', text: "'This looks and works beautifully!'" },
        { val: 'auditor', text: "'You fixed our problems and improved our results!'" },
        { val: 'deconstructor', text: "'This makes so much sense, thank you for explaining it!'" },
        { val: 'practitioner', text: "'You are super reliable and got the job done fast!'" }
      ]
    }
  ];

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
        step={{ current: 1, total: 4 }}
        title="Find Your Authority Type"
        description="Every freelancer has a natural superpower for winning client trust. Take our quick, simplified personality quiz or select your archetype below."
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
              <RotateCcw size={12} /> Take Personality Quiz
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
