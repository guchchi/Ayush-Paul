import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2, Circle, Lock, ArrowLeft, Menu, X,
  ArrowRight, Sparkles, FileText, PartyPopper,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';
import { Module1V2WelcomeScreen } from './Module1V2WelcomeScreen';
import { Step1TrackSelection } from './Step1TrackSelection';
import { Step2MarketSelection, type MarketOption } from './Step2MarketSelection';
import { Step3NicheSelection, type NicheOption } from './Step3NicheSelection';
import { Step4StatementStep } from './Step4StatementStep';
import { Step5SaveResult, type ResultSummary } from './Step5SaveResult';
import {
  getStatementVariant,
  getVariantCount,
  getAdapterEntry,
} from '../../lib/module1/opportunityMapAdapter';

/* ── Step constants ── */

const SECTION_ORDER = ['track', 'market', 'niche', 'statement', 'save'] as const;

type SectionId = typeof SECTION_ORDER[number];

const STEP_LABELS: Record<SectionId, string> = {
  track: 'Choose Your Track',
  market: 'Choose Your Market',
  niche: 'Choose Your Niche',
  statement: 'Generate Direction Statement',
  save: 'Save Your Result',
};

const STEP_DESCRIPTIONS: Record<SectionId, string> = {
  track:
    'Select the skill track that best aligns with your strengths, interests, and current ability.',
  market:
    'Define who you want to serve. Pick the industry or group that needs your skills.',
  niche:
    'Narrow your focus to a specific audience within your chosen market.',
  statement:
    'Write your one-sentence positioning statement. This guides your offer, outreach, and brand.',
  save:
    'Review your choices and lock in your direction so you can move to Module 2.',
};

/* ── Phase 1 data map ── */

interface Phase1Entry {
  marketId: string;
  marketLabel: string;
  marketDescription: string;
  nicheId: string;
  nicheLabel: string;
  nicheDescription: string;
}

const PHASE1_MAP: Record<string, Phase1Entry> = {
  video_editor: {
    marketId: 'youtube_creators',
    marketLabel: 'Creators',
    marketDescription:
      'YouTube creators, streamers, and digital content producers who need sharp video editing to grow their audience.',
    nicheId: 'youtubers_retention',
    nicheLabel: 'YouTubers',
    nicheDescription:
      'YouTubers publishing regularly who want to improve retention, storytelling, and video pacing.',
  },
  wordpress_developer: {
    marketId: 'local_businesses',
    marketLabel: 'Local Businesses',
    marketDescription:
      'Brick-and-mortar businesses and local service providers who need a professional, lead-generating web presence.',
    nicheId: 'restaurants',
    nicheLabel: 'Restaurants',
    nicheDescription:
      'Local dining establishments needing a bookable, mobile-friendly website to attract more customers.',
  },
  ui_ux_designer: {
    marketId: 'coaches',
    marketLabel: 'Coaches',
    marketDescription:
      'Online coaches and consultants who need high-converting landing pages to turn traffic into bookings.',
    nicheId: 'fitness_coaches',
    nicheLabel: 'Fitness Coaches',
    nicheDescription:
      'Personal trainers and fitness coaches with social media traffic who need a landing page that converts.',
  },
};

function getPhase1Entry(trackId: string): Phase1Entry | null {
  return PHASE1_MAP[trackId] ?? null;
}

/* ── Main component ── */

export function Module1V2() {
  /* ── State ── */
  const [moduleStarted, setModuleStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState<SectionId>('track');
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);
  const [directionStatement, setDirectionStatement] = useState('');
  const [completedSteps, setCompletedSteps] = useState<Set<SectionId>>(new Set());

  const [variantIndex, setVariantIndex] = useState(0);
  const [statementSaved, setStatementSaved] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewport, setViewport] = useState<'mobile' | 'desktop'>('desktop');

  useEffect(() => {
    const check = () => {
      setViewport(window.innerWidth < 1024 ? 'mobile' : 'desktop');
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const showSidebar = viewport === 'desktop';
  const stepContentRef = useRef<HTMLDivElement>(null);

  /* ── Smooth scroll to step heading on step change ── */
  useEffect(() => {
    const el = stepContentRef.current;
    if (!el) return;
    const heading = el.querySelector('h2');
    const target = heading || el;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({
      behavior: prefersReducedMotion ? 'instant' : 'smooth',
      block: 'start',
    });
    if (heading) heading.focus({ preventScroll: true });
  }, [currentStep]);

  /* ── Derived state ── */

  const progressPercent = (completedSteps.size / SECTION_ORDER.length) * 100;
  const currentStepIdx = SECTION_ORDER.indexOf(currentStep);

  const phase1Entry = selectedTrack ? getPhase1Entry(selectedTrack) : null;

  const availableMarkets: MarketOption[] = useMemo(() => {
    if (!phase1Entry) return [];
    return [
      {
        id: phase1Entry.marketId,
        label: phase1Entry.marketLabel,
        description: phase1Entry.marketDescription,
      },
    ];
  }, [phase1Entry]);

  const availableNiches: NicheOption[] = useMemo(() => {
    if (!phase1Entry) return [];
    return [
      {
        id: phase1Entry.nicheId,
        label: phase1Entry.nicheLabel,
        description: phase1Entry.nicheDescription,
      },
    ];
  }, [phase1Entry]);

  const trackLabel = useMemo(() => {
    const labels: Record<string, string> = {
      video_editor: 'Video Editor',
      wordpress_developer: 'WordPress Developer',
      ui_ux_designer: 'UI/UX Designer',
    };
    return selectedTrack ? labels[selectedTrack] ?? selectedTrack : '';
  }, [selectedTrack]);

  const adapterEntry = (selectedTrack && selectedMarket && selectedNiche)
    ? getAdapterEntry(selectedTrack, selectedMarket, selectedNiche)
    : null;

  const variantTotal = (selectedTrack && selectedMarket && selectedNiche)
    ? getVariantCount(selectedTrack, selectedMarket, selectedNiche)
    : 0;

  const resultSummary: ResultSummary | null = (selectedTrack && selectedMarket && selectedNiche)
    ? {
        track: { id: selectedTrack, label: trackLabel },
        market: {
          id: selectedMarket,
          label: phase1Entry?.marketLabel ?? selectedMarket,
        },
        niche: {
          id: selectedNiche,
          label: phase1Entry?.nicheLabel ?? selectedNiche,
        },
        statement: directionStatement,
      }
    : null;

  /* ── Statement generation ── */

  const generateStatement = useCallback(
    (track: string, market: string, niche: string, index: number) => {
      const variant = getStatementVariant(track, market, niche, index);
      if (variant) {
        setDirectionStatement(variant);
        setStatementSaved(false);
      }
    },
    [],
  );

  /* ── Cascade reset ── */

  const clearDownstreamSteps = useCallback(
    (fromIndex: number) => {
      const toClear = SECTION_ORDER.slice(fromIndex);
      setCompletedSteps(prev => {
        const next = new Set(prev);
        toClear.forEach(s => next.delete(s));
        return next;
      });
      if (fromIndex <= 1) {
        setSelectedMarket(null);
        setSelectedNiche(null);
        setDirectionStatement('');
        setVariantIndex(0);
        setStatementSaved(false);
      } else if (fromIndex <= 2) {
        setSelectedNiche(null);
        setDirectionStatement('');
        setVariantIndex(0);
        setStatementSaved(false);
      } else if (fromIndex <= 3) {
        setDirectionStatement('');
        setVariantIndex(0);
        setStatementSaved(false);
      }
    },
    [],
  );

  /* ── Navigation rules ── */

  const getStepStatus = useCallback(
    (id: SectionId): 'completed' | 'active' | 'locked' => {
      if (completedSteps.has(id)) return 'completed';
      if (id === currentStep) return 'active';
      const idx = SECTION_ORDER.indexOf(id);
      if (idx === 0) return 'active';
      const prevId = SECTION_ORDER[idx - 1];
      return completedSteps.has(prevId) ? 'active' : 'locked';
    },
    [completedSteps, currentStep],
  );

  const canNavigateTo = useCallback(
    (id: SectionId) => {
      const idx = SECTION_ORDER.indexOf(id);
      if (idx === 0) return true;
      if (completedSteps.has(id)) return true;
      const prevId = SECTION_ORDER[idx - 1];
      return completedSteps.has(prevId);
    },
    [completedSteps],
  );

  /* ── Handlers ── */

  const handleStart = () => {
    setModuleStarted(true);
  };

  const handleTrackSelect = (id: string) => {
    if (id === selectedTrack) return;
    setSelectedTrack(id);
    clearDownstreamSteps(1);
  };

  const handleMarketSelect = (id: string) => {
    if (id === selectedMarket) return;
    setSelectedMarket(id);
    clearDownstreamSteps(2);
  };

  const handleNicheSelect = (id: string) => {
    if (id === selectedNiche) return;
    setSelectedNiche(id);
    clearDownstreamSteps(3);
  };

  const handleRegenerate = () => {
    if (!selectedTrack || !selectedMarket || !selectedNiche) return;
    const next = (variantIndex + 1) % Math.max(variantTotal, 1);
    setVariantIndex(next);
    generateStatement(selectedTrack, selectedMarket, selectedNiche, next);
  };

  const handleCopyStatement = async () => {
    if (!directionStatement) return;
    try {
      await navigator.clipboard.writeText(directionStatement);
    } catch { /* clipboard unavailable */ }
  };

  const handleSaveStatement = () => {
    setStatementSaved(true);
  };

  const handleContinue = () => {
    // Validate current step
    if (currentStep === 'track' && !selectedTrack) return;
    if (currentStep === 'market' && !selectedMarket) return;
    if (currentStep === 'niche' && !selectedNiche) return;
    if (currentStep === 'statement' && !statementSaved) return;
    if (currentStep === 'save') return; // save step handled by Complete Module

    const newCompleted = new Set(completedSteps);
    newCompleted.add(currentStep);
    setCompletedSteps(newCompleted);

    const idx = SECTION_ORDER.indexOf(currentStep);
    if (idx < SECTION_ORDER.length - 1) {
      setCurrentStep(SECTION_ORDER[idx + 1]);

      // Auto-generate statement when entering step 4
      const nextStep = SECTION_ORDER[idx + 1];
      if (
        nextStep === 'statement' &&
        selectedTrack &&
        selectedMarket &&
        selectedNiche
      ) {
        generateStatement(selectedTrack, selectedMarket, selectedNiche, variantIndex);
      }
    }
  };

  const handleStepClick = (id: SectionId) => {
    if (canNavigateTo(id)) {
      setCurrentStep(id);
      if (viewport === 'mobile') setSidebarOpen(false);
    }
  };

  const handleCompleteModule = () => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add('save');
    setCompletedSteps(newCompleted);
    setShowCompletion(true);
  };

  /* ── Continue button disabled state ── */

  const isContinueDisabled =
    (currentStep === 'track' && !selectedTrack) ||
    (currentStep === 'market' && !selectedMarket) ||
    (currentStep === 'niche' && !selectedNiche) ||
    (currentStep === 'statement' && !statementSaved) ||
    (currentStep === 'save');

  const continueLabel =
    currentStep === 'save' ? 'Complete Module' : 'Continue';

  /* ── Completion screen ── */

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
          className="max-w-lg w-full text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#d1f34d] flex items-center justify-center mx-auto mb-6">
            <PartyPopper size={28} className="text-[#0b1c30]" />
          </div>
          <h1 className="text-3xl font-bold text-[#0b1c30] mb-3">
            Module 1 Complete
          </h1>
          <p className="text-neutral-500 text-base leading-relaxed mb-8">
            You&apos;ve chosen your direction. Your track, market, niche, and
            positioning statement are ready for the next phase.
          </p>
          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm mb-8 text-left">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Your Direction
            </p>
            <p className="text-lg font-bold text-[#0b1c30] leading-snug mb-3">
              {resultSummary?.statement}
            </p>
            <div className="flex gap-4 text-sm text-neutral-500">
              <span className="font-semibold text-[#0058be]">{resultSummary?.track.label}</span>
              <span>&rarr;</span>
              <span className="font-semibold text-[#0058be]">{resultSummary?.market.label}</span>
              <span>&rarr;</span>
              <span className="font-semibold text-[#0058be]">{resultSummary?.niche.label}</span>
            </div>
          </div>
          <button
            onClick={() => {
              setModuleStarted(false);
              setShowCompletion(false);
              setCurrentStep('track');
              setCompletedSteps(new Set());
              setSelectedTrack(null);
              setSelectedMarket(null);
              setSelectedNiche(null);
              setDirectionStatement('');
              setVariantIndex(0);
              setStatementSaved(false);
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#0b1c30] text-white font-bold text-base hover:bg-[#152a45] shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be] focus:ring-offset-2"
          >
            Start Over <ArrowRight size={16} aria-hidden="true" />
          </button>
        </motion.div>
      </div>
    );
  }

  /* ── Welcome screen ── */
  if (!moduleStarted) {
    return <Module1V2WelcomeScreen onStart={handleStart} />;
  }

  /* ── Sidebar content ── */
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-neutral-200 shadow-[2px_0_12px_rgba(0,0,0,0.02)]">
      <div className="p-6 pb-8 border-b border-neutral-100">
        <button
          onClick={() => { setModuleStarted(false); setShowCompletion(false); }}
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400 hover:text-neutral-700 transition-colors mb-6 focus:outline-none focus:ring-2 focus:ring-[#0058be] rounded"
          aria-label="Back to module overview"
        >
          <ArrowLeft size={14} aria-hidden="true" /> Back to Overview
        </button>
        <h2 className="text-xl font-bold text-[#0b1c30] mb-4 flex items-center gap-2">
          <Sparkles size={16} className="text-[#0058be]" aria-hidden="true" />
          Module 1: Direction
        </h2>
        <div className="w-full h-1.5 rounded-full bg-neutral-100 overflow-hidden">
          <div
            className="h-full bg-[#0058be] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(progressPercent, 2)}%` }}
          />
        </div>
        <p className="text-xs font-bold text-neutral-400 mt-2 text-right">
          {Math.round(progressPercent)}% Complete
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <div className="space-y-1">
          {SECTION_ORDER.map((id, index) => {
            const status = getStepStatus(id);
            const isCompleted = status === 'completed';
            const isActive = status === 'active';
            const isLocked = status === 'locked';

            return (
              <button
                key={id}
                disabled={isLocked}
                onClick={() => handleStepClick(id)}
                aria-current={isActive ? 'step' : undefined}
                aria-disabled={isLocked}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be]',
                  isActive
                    ? 'bg-[#eff4ff] text-[#0058be]'
                    : 'hover:bg-neutral-50',
                  isLocked && 'opacity-50 cursor-not-allowed',
                )}
              >
                <div className="shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 size={18} className="text-[#0058be]" />
                  ) : isActive ? (
                    <Circle size={18} className="text-[#0058be] fill-[#0058be]" />
                  ) : (
                    <Lock size={16} className="text-neutral-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-px">
                    Step 0{index + 1}
                  </p>
                  <p
                    className={cn(
                      'text-sm font-semibold truncate',
                      isActive ? 'text-[#0b1c30]' : 'text-neutral-600',
                    )}
                  >
                    {STEP_LABELS[id]}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-neutral-100">
        <div className="p-3 rounded-xl bg-[#eff4ff]">
          <div className="flex items-center gap-2 mb-1.5">
            <FileText size={12} className="text-[#0058be]" aria-hidden="true" />
            <span className="text-[10px] font-bold text-[#0058be] uppercase tracking-wider">
              Output
            </span>
          </div>
          <p className="text-xs text-neutral-600 leading-snug">
            {directionStatement ? (
              <span className="italic">&ldquo;{directionStatement}&rdquo;</span>
            ) : (
              <span>
                &ldquo;I help{' '}
                <span className="text-[#0058be] font-medium">[audience]</span> get{' '}
                <span className="text-[#0058be] font-medium">[result]</span> using{' '}
                <span className="text-[#0058be] font-medium">[method]</span>.&rdquo;
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );

  /* ── Step content ── */
  const renderStepContent = () => {
    switch (currentStep) {
      case 'track':
        return (
          <Step1TrackSelection
            selected={selectedTrack}
            onSelect={handleTrackSelect}
          />
        );

      case 'market':
        return (
          <Step2MarketSelection
            markets={availableMarkets}
            selected={selectedMarket}
            onSelect={handleMarketSelect}
          />
        );

      case 'niche':
        return (
          <Step3NicheSelection
            niches={availableNiches}
            selected={selectedNiche}
            onSelect={handleNicheSelect}
          />
        );

      case 'statement':
        return (
          <Step4StatementStep
            statement={directionStatement}
            breakdown={
              adapterEntry
                ? {
                    who: adapterEntry.who,
                    result: adapterEntry.result,
                    method: adapterEntry.method,
                  }
                : null
            }
            variantIndex={variantIndex}
            variantTotal={variantTotal}
            saved={statementSaved}
            onStatementChange={setDirectionStatement}
            onRegenerate={handleRegenerate}
            onCopy={handleCopyStatement}
            onSave={handleSaveStatement}
          />
        );

      case 'save':
        return (
          <Step5SaveResult
            result={resultSummary!}
            onEditDirection={() => {
              setCurrentStep('statement');
            }}
            onComplete={handleCompleteModule}
          />
        );

      default:
        return null;
    }
  };

  /* ════════════════════════════════════════
     Wizard Layout
  ════════════════════════════════════════ */
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f8f9ff] text-[#0b1c30] selection:bg-[#d1f34d]/50">

      {/* ── Mobile header with progress ── */}
      {!showSidebar && (
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-neutral-500 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#0058be] rounded"
            aria-label="Open step navigation"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Step {currentStepIdx + 1} of {SECTION_ORDER.length}
            </span>
            <div className="w-20 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
              <div
                className="h-full bg-[#0058be] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.max(progressPercent, 2)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Desktop sidebar ── */}
      {showSidebar && (
        <div className="shrink-0 w-[280px] xl:w-[320px] fixed inset-y-0 left-0 z-30">
          <SidebarContent />
        </div>
      )}

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {sidebarOpen && !showSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#0b1c30]/40 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: EASING.PREMIUM }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-2xl"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg text-neutral-400 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#0058be]"
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content area ── */}
      <main
        className={cn(
          'flex-1 min-w-0 transition-all',
          showSidebar && 'ml-[280px] xl:ml-[320px]',
        )}
      >
        <div ref={stepContentRef} className="max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-5 sm:px-8 py-10 lg:py-16">
          {/* Step header badge */}
          <div className="mb-8">
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest mb-3"
              aria-label={`Step ${currentStepIdx + 1} of ${SECTION_ORDER.length}`}
            >
              Step {currentStepIdx + 1} of {SECTION_ORDER.length}
            </div>

            {/* Animated step content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Desktop CTA ── */}
          <div className="mt-10 hidden lg:flex justify-end">
            {currentStep === 'save' ? (
              <div className="flex gap-3">
                <button
                  onClick={handleCompleteModule}
                  disabled={completedSteps.has('save')}
                  className={cn(
                    'inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-base transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be] focus:ring-offset-2',
                    completedSteps.has('save')
                      ? 'bg-[#d1f34d] text-[#0b1c30] cursor-default'
                      : 'bg-[#0058be] text-white shadow-[0_4px_20px_rgba(0,88,190,0.3)] hover:bg-[#0047a0] hover:shadow-[0_8px_32px_rgba(0,88,190,0.35)]',
                  )}
                  id="v2-complete-btn"
                >
                  Complete Module <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <button
                disabled={isContinueDisabled}
                onClick={handleContinue}
                aria-disabled={isContinueDisabled}
                className={cn(
                  'inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-base transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be] focus:ring-offset-2',
                  'bg-[#0b1c30] text-white hover:bg-[#152a45] shadow-lg',
                  'disabled:opacity-40 disabled:cursor-not-allowed',
                )}
                id="v2-continue-btn"
              >
                {continueLabel} <ArrowRight size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom spacer for mobile CTA */}
        <div className="h-24 lg:hidden" aria-hidden="true" />
      </main>

      {/* ── Mobile CTA ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-neutral-200 px-4 py-3">
        {currentStep === 'save' ? (
          <button
            onClick={handleCompleteModule}
            disabled={completedSteps.has('save')}
            className={cn(
              'w-full flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-base transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be]',
              completedSteps.has('save')
                ? 'bg-[#d1f34d] text-[#0b1c30] cursor-default'
                : 'bg-[#0058be] text-white shadow-[0_4px_20px_rgba(0,88,190,0.3)] hover:bg-[#0047a0]',
            )}
            id="v2-complete-btn-mobile"
          >
            Complete Module <ArrowRight size={16} aria-hidden="true" />
          </button>
        ) : (
          <button
            disabled={isContinueDisabled}
            onClick={handleContinue}
            aria-disabled={isContinueDisabled}
            className={cn(
              'w-full flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-base transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be]',
              'bg-[#0b1c30] text-white hover:bg-[#152a45] shadow-lg',
              'disabled:opacity-40 disabled:cursor-not-allowed',
            )}
            id="v2-continue-btn-mobile"
          >
            Continue <ArrowRight size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
