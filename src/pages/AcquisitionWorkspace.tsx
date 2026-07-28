import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2, ArrowRight, Play, Edit3, Save, Copy, Check,
  Sparkles, RefreshCw, Target, Clock, Star, FileText, Zap,
  ChevronRight, AlertTriangle,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useOpportunityMapStore } from '../lib/opportunity-map';
import { useOfferEngineeringStore } from '../lib/offer-engineering';
import type { BlueprintStep } from '../types/opportunity-map';
import { MASTER_TRACKS } from '../data/opportunity-map/master-data';
import { Module1Layout, type StepItem } from '../components/module1/Module1Layout';
import { Module1IntroPage } from '../components/module1/Module1IntroPage';
import { WorkspaceErrorState } from '../components/workspace/WorkspaceErrorState';
import {
  getAdapterPayload,
  getAdapterEntry,
  getStatementVariant,
  getVariantCount,
  type AdapterResult,
} from '../lib/module1/opportunityMapAdapter';
import {
  MAIN_TRACK_OPTIONS,
  ALL_MARKETS,
  ALL_NICHES,
  type MainTrackOption,
  type MarketOption,
  type NicheOption,
} from '../data/module1/module1-content';


/* ─────────────────────────────────────────
   Step config
───────────────────────────────────────── */

const SECTION_ORDER = ['track', 'market', 'niche', 'statement', 'save'] as const;
type SectionId = typeof SECTION_ORDER[number];

const STEP_LABELS: Record<SectionId, string> = {
  track: 'Choose Your Track',
  market: 'Choose Your Market',
  niche: 'Choose Your Niche',
  statement: 'Your Direction Statement',
  save: 'Save Your Result',
};

const STEP_DESCRIPTIONS: Record<SectionId, string> = {
  track: 'Select the primary skill you will use to build your business.',
  market: 'Who do you want to help? Pick the industry or group you will serve.',
  niche: 'Narrow your focus to a specific audience to reduce competition and increase positioning clarity.',
  statement: 'Your one-sentence positioning — the foundation of your entire offer, outreach, and brand.',
  save: 'Review your choices and save your direction before advancing to Module 2.',
};

/* ─────────────────────────────────────────
   Local storage
───────────────────────────────────────── */

const STORAGE_KEY = 'blueprint-module1-v3';

interface PersistedState {
  moduleStarted: boolean;
  trackId: string | null;
  marketId: string | null;
  nicheId: string | null;
  statement: string;
  variantIndex: number;
  completedSections: string[];
  activeSection: string;
  moduleCompleted: boolean;
  mainTrack: 'editor' | 'developer' | 'designer' | null;
}

function loadPersistedState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

function persistState(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore quota errors */ }
}

/* ─────────────────────────────────────────
   Analytics (lightweight — replace with
   real SDK when available)
───────────────────────────────────────── */

function trackEvent(name: string, props?: Record<string, unknown>) {
  if (import.meta.env.DEV) {
    console.log('[Module1]', name, props ?? '');
  }
  try {
    const g = ((window as unknown) as Record<string, unknown>)['gtag'];
    if (typeof g === 'function') {
      g('event', name, { module_id: 'module_1', ...props });
    }
  } catch { /* ignore */ }
}



/* ─────────────────────────────────────────
   Main Page Component
───────────────────────────────────────── */

export function AcquisitionWorkspace() {
  const navigate = useNavigate();
  const saved = useMemo(() => loadPersistedState(), []);

  /* ── Core state ── */
  const [moduleStarted, setModuleStarted] = useState(saved?.moduleStarted ?? false);
  const [mainTrack, setMainTrack] = useState<'editor' | 'developer' | 'designer' | null>(saved?.mainTrack ?? null);
  const [trackId, setTrackId] = useState<string | null>(saved?.trackId ?? null);
  const [marketId, setMarketId] = useState<string | null>(saved?.marketId ?? null);
  const [nicheId, setNicheId] = useState<string | null>(saved?.nicheId ?? null);
  const [statement, setStatement] = useState(saved?.statement ?? '');
  const [variantIndex, setVariantIndex] = useState(saved?.variantIndex ?? 0);
  const [completedSections, setCompletedSections] = useState<Set<string>>(
    new Set(saved?.completedSections ?? []),
  );
  const [activeSection, setActiveSection] = useState<SectionId>(
    (saved?.activeSection as SectionId) ?? 'track',
  );

  /* ── UI state ── */
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(saved?.moduleCompleted ?? false);
  const [adapterError, setAdapterError] = useState<string | null>(null);
  const [summaryCopied, setSummaryCopied] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'failure'>('idle');

  const m2Completed = useOfferEngineeringStore((s) => s.offerBlueprint !== null);

  /* ── Debounce ref for statement ── */
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Persist to localStorage on state change ── */
  useEffect(() => {
    persistState({
      moduleStarted,
      trackId,
      marketId,
      nicheId,
      statement,
      variantIndex,
      completedSections: Array.from(completedSections),
      activeSection,
      moduleCompleted: completedSections.has('save'),
      mainTrack,
    });
  }, [moduleStarted, trackId, marketId, nicheId, statement, variantIndex, completedSections, activeSection, mainTrack]);

  /* ── Sync to useOpportunityMapStore whenever path + statement are set ── */
  useEffect(() => {
    if (!trackId || !marketId || !nicheId) {
      setAdapterError(null);
      const stepsToSet: BlueprintStep[] = [];
      if (trackId) {
        stepsToSet.push('career_track');
      }
      if (trackId && marketId) {
        stepsToSet.push('service', 'market');
      }
      // Clear downstream store fields to prevent stale data leaking to Module 2
      useOpportunityMapStore.setState({
        careerTrackId: trackId,
        serviceId: null,
        marketId: marketId,
        marketLabel: null,
        nicheId: nicheId,
        nicheLabel: null,
        offerId: null,
        positioning: '',
        opportunityScore: null,
        completedSteps: stepsToSet,
      });
      return;
    }

    const result: AdapterResult = getAdapterPayload(trackId, marketId, nicheId, statement);

    if (result.isValid) {
      setAdapterError(null);
      
      const stepsToSet: BlueprintStep[] = ['career_track', 'service', 'market', 'niche'];
      if (statement.trim()) {
        stepsToSet.push('offer', 'positioning');
      }
      if (statement.trim() && completedSections.has('save')) {
        stepsToSet.push('opportunity_score');
      }

      useOpportunityMapStore.setState({
        careerTrackId: result.careerTrackId,
        serviceId: result.serviceId,
        marketId: result.marketId,
        marketLabel: result.marketLabel,
        nicheId: result.nicheId,
        nicheLabel: result.nicheLabel,
        offerId: result.offerId,
        positioning: result.positioning,
        opportunityScore: result.opportunityScore,
        completedSteps: stepsToSet,
      });
    } else {
      const errResult = result as { isValid: false; error: string };
      setAdapterError(errResult.error);
    }
  }, [trackId, marketId, nicheId, statement, completedSections]);

  /* ── Debounced store sync for manual statement edits ── */
  const handleStatementChange = (val: string) => {
    setStatement(val);
    setIsSaved(false);
    setCompletedSections(prev => {
      const next = new Set(prev);
      next.delete('save');
      return next;
    });
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // Store sync fires via the useEffect above automatically
    }, 900);
  };

  /* ─── Computed data ─── */
  const trackData = useMemo(
    () => MASTER_TRACKS.find(t => t.id === trackId),
    [trackId],
  );

  const availableMarkets = useMemo<MarketOption[]>(() => {
    if (!trackId) return [];
    return ALL_MARKETS[trackId] ?? [];
  }, [trackId]);

  const availableNiches = useMemo<NicheOption[]>(() => {
    if (!trackId || !marketId) return [];
    return ALL_NICHES[`${trackId}_${marketId}`] ?? [];
  }, [trackId, marketId]);

  /* ─── Auto-generate statement when niche selected ─── */
  useEffect(() => {
    if (trackId && marketId && nicheId && !statement) {
      const variant = getStatementVariant(trackId, marketId, nicheId, 0);
      if (variant) setStatement(variant);
    }
  }, [trackId, marketId, nicheId]);

  /* ─── Navigation helpers ─── */
  const canNavigateTo = useCallback((id: string) => {
    const idx = SECTION_ORDER.indexOf(id as SectionId);
    if (idx === 0) return true;
    const prevId = SECTION_ORDER[idx - 1];
    return completedSections.has(prevId) || completedSections.has(id);
  }, [completedSections]);

  const getSectionStatus = (id: SectionId): 'completed' | 'current' | 'upcoming' | 'locked' => {
    if (id === activeSection) return 'current';
    if (completedSections.has(id)) return 'completed';
    return canNavigateTo(id) ? 'upcoming' : 'locked';
  };

  const completeSection = useCallback((id: SectionId) => {
    setCompletedSections(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    const idx = SECTION_ORDER.indexOf(id);
    if (idx < SECTION_ORDER.length - 1) {
      setTimeout(() => setActiveSection(SECTION_ORDER[idx + 1]), 200);
    }
    trackEvent('module1_step_completed', { stepId: id, stepNumber: idx + 1 });
  }, []);

  /* ─── Selection handlers with reset cascade ─── */
  const handleMainTrackSelect = (id: 'editor' | 'developer' | 'designer') => {
    setMainTrack(id);
    setTrackId(null);
    setMarketId(null);
    setNicheId(null);
    setStatement('');
    setVariantIndex(0);
    setIsSaved(false);
    setCompletedSections(prev => {
      const next = new Set(prev);
      ['track', 'market', 'niche', 'statement', 'save'].forEach(s => next.delete(s));
      return next;
    });
    trackEvent('module1_main_track_selected', { selectedMainTrack: id });
  };

  const handleTrackSelect = (id: string) => {
    if (id === trackId) {
      completeSection('track');
      return;
    }
    setTrackId(id);
    setMarketId(null);
    setNicheId(null);
    setStatement('');
    setVariantIndex(0);
    setIsSaved(false);
    setCompletedSections(prev => {
      const next = new Set(prev);
      ['market', 'niche', 'statement', 'save'].forEach(s => next.delete(s));
      return next;
    });
    trackEvent('module1_track_selected', { selectedTrack: id });
  };

  const handleMarketSelect = (id: string) => {
    if (id === marketId) {
      completeSection('market');
      return;
    }
    setMarketId(id);
    setNicheId(null);
    setStatement('');
    setVariantIndex(0);
    setIsSaved(false);
    setCompletedSections(prev => {
      const next = new Set(prev);
      ['niche', 'statement', 'save'].forEach(s => next.delete(s));
      return next;
    });
    trackEvent('module1_market_selected', { selectedMarket: id, selectedTrack: trackId });
  };

  const handleNicheSelect = (id: string) => {
    if (id === nicheId) {
      completeSection('niche');
      return;
    }
    setNicheId(id);
    setStatement('');
    setVariantIndex(0);
    setIsSaved(false);
    setCompletedSections(prev => {
      const next = new Set(prev);
      ['statement', 'save'].forEach(s => next.delete(s));
      return next;
    });
    // Auto-generate statement using the new nicheId immediately
    if (trackId && marketId) {
      const variant = getStatementVariant(trackId, marketId, id, 0);
      if (variant) setStatement(variant);
    }
    trackEvent('module1_niche_selected', {
      selectedNiche: id,
      selectedMarket: marketId,
      selectedTrack: trackId,
    });
  };

  /* ─── Statement actions ─── */
  const handleRegenerate = () => {
    if (!trackId || !marketId || !nicheId) return;
    const total = getVariantCount(trackId, marketId, nicheId);
    if (!total) return;
    const next = (variantIndex + 1) % total;
    setVariantIndex(next);
    const variant = getStatementVariant(trackId, marketId, nicheId, next);
    if (variant) setStatement(variant);
    setIsSaved(false);
    setCompletedSections(prev => {
      const next = new Set(prev);
      next.delete('save');
      return next;
    });
    trackEvent('module1_statement_regenerated', { variantIndex: next });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(statement);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackEvent('module1_statement_copied');
    } catch { /* clipboard unavailable */ }
  };

  const handleSaveResult = () => {
    setIsSaved(true);
    if (!completedSections.has('save')) {
      completeSection('save');
    }
    trackEvent('module1_result_saved', {
      selectedTrack: trackId,
      selectedMarket: marketId,
      selectedNiche: nicheId,
    });
  };

  const handleCopySummary = async () => {
    const mainTrackLabel = MAIN_TRACK_OPTIONS.find(t => t.id === mainTrack)?.label ?? '';
    const specializationLabel = MAIN_TRACK_OPTIONS.find(t => t.id === mainTrack)?.subTracks?.find(s => s.id === trackId)?.label ?? '';
    const marketLabel = availableMarkets.find(m => m.id === marketId)?.label ?? '';
    const nicheLabel = availableNiches.find(n => n.id === nicheId)?.label ?? '';

    const text = `Module 1 Output Summary\n───────────────────────\nTrack: ${mainTrackLabel}\nSpecialization: ${specializationLabel}\nMarket: ${marketLabel}\nNiche: ${nicheLabel}\n\nDirection Statement:\n"${statement}"`;
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('success');
      setSummaryCopied(true);
      setTimeout(() => {
        setCopyStatus('idle');
        setSummaryCopied(false);
      }, 2000);
      trackEvent('module1_summary_copied');
    } catch {
      setCopyStatus('failure');
      setTimeout(() => {
        setCopyStatus('idle');
      }, 3000);
    }
  };

  const handleStartModule = () => {
    setModuleStarted(true);
    trackEvent('module1_started');
  };

  /* ─── Layout helpers ─── */
  const steps: StepItem[] = SECTION_ORDER.map(id => ({
    id,
    label: STEP_LABELS[id],
    status: getSectionStatus(id),
  }));

  const completedStepsCount = [
    Boolean(trackId),
    Boolean(marketId),
    Boolean(nicheId),
    Boolean(statement && statement.trim()),
    Boolean(completedSections.has('save')),
  ].filter(Boolean).length;

  const progress = (completedStepsCount / 5) * 100;
  const currentStepIdx = SECTION_ORDER.indexOf(activeSection);

  const isContinueDisabled =
    (activeSection === 'track' && !trackId) ||
    (activeSection === 'market' && !marketId) ||
    (activeSection === 'niche' && !nicheId) ||
    (activeSection === 'statement' && !statement.trim());

  /* ─── Current step entry + stats for statement breakdown ─── */
  const adapterEntry = (trackId && marketId && nicheId)
    ? getAdapterEntry(trackId, marketId, nicheId)
    : null;

  const variantTotal = (trackId && marketId && nicheId)
    ? getVariantCount(trackId, marketId, nicheId)
    : 0;

  /* ════════════════════════════════════════
     Render: Welcome screen
  ════════════════════════════════════════ */
  if (!moduleStarted) {
    return (
      <Module1IntroPage
        trackId={trackId}
        marketId={marketId}
        nicheId={nicheId}
        statement={statement}
        isSaved={completedSections.has('save')}
        onStart={handleStartModule}
        onBackToBlueprint={() => navigate('/blueprints/get-your-first-3-clients')}
        onSaveForLater={() => navigate('/blueprints/get-your-first-3-clients')}
      />
    );
  }

  /* ════════════════════════════════════════
     Render: 5-Step main flow
  ════════════════════════════════════════ */
  return (
    <Module1Layout
      title="Module 01: Direction"
      progress={progress}
      steps={steps}
      activeStep={activeSection}
      onStepChange={(id) => {
        if (canNavigateTo(id)) setActiveSection(id as SectionId);
      }}
      onBack={() => setModuleStarted(false)}
    >
      {/* ── Step header ── */}
      <div className="mb-8">
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0058be]/8 text-[#0058be] text-[10px] font-bold uppercase tracking-widest mb-3"
          aria-label={`Step ${currentStepIdx + 1} of ${SECTION_ORDER.length}`}
        >
          Step {currentStepIdx + 1} of {SECTION_ORDER.length}
        </div>
        <h1 className="text-3xl font-bold text-[#0b1c30] mb-2">{STEP_LABELS[activeSection]}</h1>
        <p className="text-neutral-500 text-base leading-relaxed">{STEP_DESCRIPTIONS[activeSection]}</p>
      </div>

      {/* ──────────────────────────────────────
          STEP 1 — Track
      ────────────────────────────────────── */}
      {activeSection === 'track' && (
        <div className="space-y-6">
          <fieldset className="grid sm:grid-cols-3 gap-4">
            <legend className="sr-only">Choose a primary track</legend>
            {MAIN_TRACK_OPTIONS.map(track => {
              const isSelected = mainTrack === track.id;
              const clientSummary = track.clients?.length > 0
                ? `Clients: ${track.clients.slice(0, 4).join(', ')}`
                : null;

              return (
                <label
                  key={track.id}
                  htmlFor={`radio-main-${track.id}`}
                  className={cn(
                    'relative p-6 rounded-2xl border text-left flex flex-col h-full justify-between transition-all duration-200 cursor-pointer outline-none group',
                    isSelected
                      ? 'bg-[#eff4ff]/20 border-[#0058be] ring-1 ring-[#0058be]'
                      : 'bg-white border-neutral-200 hover:border-neutral-300',
                    'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#0058be] has-[:focus-visible]:ring-offset-2'
                  )}
                >
                  <input
                    type="radio"
                    name="mainTrack"
                    id={`radio-main-${track.id}`}
                    value={track.id}
                    checked={isSelected}
                    onChange={() => handleMainTrackSelect(track.id)}
                    className="sr-only"
                  />

                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <div className="w-5 h-5 rounded-full bg-[#0058be] flex items-center justify-center shadow-sm">
                        <Check size={12} className="text-[#d1f34d] stroke-[3]" aria-hidden="true" />
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-start justify-between mb-5">
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors duration-200',
                        isSelected ? 'bg-[#0058be]/8' : 'bg-[#f8f9ff] group-hover:bg-[#0058be]/5',
                      )} aria-hidden="true">
                        {track.icon}
                      </div>
                    </div>

                    <h3 className={cn(
                      'font-bold text-lg mb-1.5 transition-colors',
                      isSelected ? 'text-[#0058be]' : 'text-[#0b1c30]',
                    )}>
                      {track.label}
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed mb-4">{track.description}</p>
                  </div>

                  <div className="mt-auto space-y-4">
                    {clientSummary && (
                      <div className="pt-3 border-t border-neutral-100/50">
                        <p className="text-[10px] font-semibold text-neutral-500">
                          {clientSummary}
                        </p>
                      </div>
                    )}

                    {track.bestFor && (
                      <div className="pt-3 border-t border-neutral-100">
                        <p className="text-[10px] text-neutral-500 leading-relaxed font-medium">
                          <strong className={cn(isSelected ? 'text-[#0058be]' : 'text-[#0b1c30]')}>Best for:</strong> {track.bestFor}
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              );
            })}
          </fieldset>

          {/* Subtrack selection progressive disclosure */}
          {!mainTrack ? (
            <div className="mt-8 p-8 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50 text-center">
              <p className="text-sm font-bold text-[#0b1c30] mb-1">Choose a track first</p>
              <p className="text-xs text-neutral-500">Select Editor, Developer, or Designer to see the matching specializations.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 pt-8 border-t border-neutral-200 space-y-4"
            >
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#0058be] mb-3">
                Choose your {mainTrack === 'editor' ? 'Editor' : mainTrack === 'developer' ? 'Developer' : 'Designer'} specialization
              </h2>
              <fieldset className="grid sm:grid-cols-2 gap-4">
                <legend className="sr-only">Choose a specialization</legend>
                {MAIN_TRACK_OPTIONS.find(t => t.id === mainTrack)?.subTracks?.map(sub => {
                  const isSubSelected = trackId === sub.id;

                  return (
                    <label
                      key={sub.id}
                      htmlFor={`radio-sub-${sub.id}`}
                      className={cn(
                        'p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 relative cursor-pointer outline-none',
                        isSubSelected
                          ? 'bg-[#eff4ff]/20 border-[#0058be] ring-1 ring-[#0058be]'
                          : 'bg-white border-neutral-200 hover:border-neutral-350',
                        'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#0058be] has-[:focus-visible]:ring-offset-2'
                      )}
                    >
                      <input
                        type="radio"
                        name="subTrack"
                        id={`radio-sub-${sub.id}`}
                        value={sub.id}
                        checked={isSubSelected}
                        onChange={() => handleTrackSelect(sub.id)}
                        className="sr-only"
                      />

                      <div className="w-full">
                        <div className="flex items-center justify-between mb-3">
                          <span className={cn(
                            'text-sm font-bold',
                            isSubSelected ? 'text-[#0058be]' : 'text-[#0b1c30]',
                          )}>
                            {sub.label}
                          </span>
                          {isSubSelected && (
                            <span className="w-4.5 h-4.5 rounded-full bg-[#0058be] flex items-center justify-center" aria-hidden="true">
                              <Check size={10} className="text-[#d1f34d] stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 leading-relaxed mb-3">
                          {sub.description}
                        </p>
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-auto pt-2 border-t border-neutral-100/50">
                        <strong>Best for:</strong> {sub.bestFor}
                      </div>
                    </label>
                  );
                })}
              </fieldset>
            </motion.div>
          )}

          {/* Contextual Action Area for Step 1 */}
          <div className="mt-10 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-left">
              {mainTrack && trackId ? (
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Selected Direction:{' '}
                  <span className="text-[#0058be]">
                    {MAIN_TRACK_OPTIONS.find(t => t.id === mainTrack)?.label} ·{' '}
                    {MAIN_TRACK_OPTIONS.find(t => t.id === mainTrack)?.subTracks?.find(s => s.id === trackId)?.label} selected
                  </span>
                </p>
              ) : (
                <p className="text-xs text-neutral-400 font-medium">
                  Choose a specialization to continue.
                </p>
              )}
            </div>
            <button
              disabled={!mainTrack || !trackId}
              onClick={() => completeSection('track')}
              className={cn(
                'flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0058be]',
                mainTrack && trackId
                  ? 'bg-[#0b1c30] text-white hover:bg-[#152a45] shadow-lg cursor-pointer active:scale-[0.98]'
                  : 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
              )}
            >
              Continue to Market <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────
          STEP 2 — Market
      ────────────────────────────────────── */}
      {activeSection === 'market' && (
        <div className="space-y-6">
          <fieldset>
            <legend className="sr-only">Choose a target market</legend>
            <div className="flex flex-col gap-3">
              {availableMarkets.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white border border-neutral-200 text-center">
                  <p className="text-neutral-400 text-sm">Select a track first to see available markets.</p>
                </div>
              ) : (
                availableMarkets.map(market => {
                  const isSelected = marketId === market.id;
                  const hasWhyItWorks = Boolean(market.whyItWorks && market.whyItWorks.trim());
                  const hasProblems = Boolean(market.problems && market.problems.length > 0);

                  return (
                    <label
                      key={market.id}
                      htmlFor={`radio-market-${market.id}`}
                      className="relative cursor-pointer block outline-none"
                    >
                      <input
                        type="radio"
                        name="marketSelection"
                        id={`radio-market-${market.id}`}
                        value={market.id}
                        checked={isSelected}
                        onChange={() => handleMarketSelect(market.id)}
                        className="peer sr-only"
                      />
                      <div className={cn(
                        'p-5 rounded-2xl border text-left flex flex-col transition-all duration-200',
                        'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/30 active:bg-neutral-100/50',
                        isSelected ? 'bg-[#eff4ff]/10 border-[#0058be] ring-1 ring-[#0058be] active:bg-[#eff4ff]/30' : '',
                        'peer-focus-visible:ring-2 peer-focus-visible:ring-[#0058be] peer-focus-visible:ring-offset-2'
                      )}>
                        <div className="flex items-start gap-4 w-full">
                          {/* Selection indicator */}
                          <div className="shrink-0 mt-0.5" aria-hidden="true">
                            {isSelected ? (
                              <div className="w-5 h-5 rounded-full bg-[#0058be] flex items-center justify-center shadow-sm">
                                <Check size={12} className="text-[#d1f34d] stroke-[3]" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-neutral-300 bg-white" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className={cn(
                              'font-bold text-base leading-tight mb-1 transition-colors',
                              isSelected ? 'text-[#0058be]' : 'text-[#0b1c30]'
                            )}>
                              {market.label}
                            </h3>
                            <p className="text-xs text-[#525252] leading-relaxed">
                              {market.description}
                            </p>
                          </div>
                        </div>

                        {/* Rich Information shown inline when selected */}
                        <AnimatePresence initial={false}>
                          {isSelected && (hasWhyItWorks || hasProblems) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: 'easeInOut' }}
                              className="overflow-hidden w-full"
                            >
                              <div className="mt-4 pt-4 border-t border-neutral-200/60 w-full space-y-4">
                                {hasWhyItWorks && (
                                  <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                                      Why this market works
                                    </span>
                                    <p className="text-xs text-neutral-600 leading-relaxed">
                                      {market.whyItWorks}
                                    </p>
                                  </div>
                                )}

                                {hasProblems && (
                                  <div className="space-y-2">
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                                      Common problems you will solve
                                    </span>
                                    <ul className="grid sm:grid-cols-2 gap-3 list-none p-0 m-0">
                                      {market.problems.map((p, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-xs text-neutral-600">
                                          <span className="text-[#0058be] font-bold text-sm leading-none shrink-0" aria-hidden="true">•</span>
                                          <span className="leading-relaxed">{p}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </fieldset>

          {/* Contextual Action Area for Step 2 */}
          <div className="mt-8 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-left">
              {marketId ? (
                <p className="text-xs font-bold text-[#0b1c30]">
                  {availableMarkets.find(m => m.id === marketId)?.label} selected
                </p>
              ) : (
                <p className="text-xs text-neutral-400 font-medium">
                  Choose a market to continue.
                </p>
              )}
            </div>
            <button
              disabled={!marketId}
              onClick={() => completeSection('market')}
              className={cn(
                'flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0058be]',
                marketId
                  ? 'bg-[#0b1c30] text-white hover:bg-[#152a45] shadow-lg cursor-pointer active:scale-[0.98]'
                  : 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
              )}
            >
              Continue to Niche <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────
          STEP 3 — Niche
      ────────────────────────────────────── */}
      {activeSection === 'niche' && (
        <AnimatePresence mode="wait">
          <motion.div
            key="niche-step"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
            role="radiogroup"
            aria-label="Choose your niche"
          >
            {availableNiches.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white border border-neutral-200 text-center">
                <p className="text-neutral-400 text-sm">Select a market first to see available niches.</p>
              </div>
            ) : availableNiches.map(niche => {
              const isSelected = nicheId === niche.id;

              return (
                <motion.button
                  key={niche.id}
                  onClick={() => handleNicheSelect(niche.id)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  role="radio"
                  aria-checked={isSelected}
                  className={cn(
                    'w-full p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col gap-4 focus:outline-none focus:ring-2 focus:ring-[#0058be] focus:ring-offset-2',
                    isSelected
                      ? 'bg-white border-[#0058be] shadow-[0_8px_32px_rgba(0,88,190,0.14)] ring-1 ring-[#0058be]'
                      : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md',
                  )}
                  id={`niche-card-${niche.id}`}
                >
                  <div className="flex items-start gap-4 w-full">
                    <div className={cn(
                      'w-12 h-12 rounded-xl shrink-0 flex items-center justify-center transition-colors duration-200',
                      isSelected ? 'bg-[#0058be]' : 'bg-[#f8f9ff]',
                    )} aria-hidden="true">
                      <Star size={20} className={isSelected ? 'text-white' : 'text-[#0058be]'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={cn(
                          'font-bold text-lg transition-colors',
                          isSelected ? 'text-[#0058be]' : 'text-[#0b1c30]',
                        )}>
                          {niche.label}
                        </h3>
                      </div>
                      <p className="text-sm text-neutral-500 leading-relaxed">
                        {niche.description}
                      </p>

                      {/* Rich Information shown when selected */}
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-6 pt-5 border-t border-neutral-100 space-y-4 overflow-hidden"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Opportunity potential</span>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
                              {niche.opportunity} Rating
                            </span>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Target Audience Pain Points</p>
                            <div className="grid sm:grid-cols-2 gap-2">
                              {niche.painPoints.map((p, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs text-neutral-600 bg-[#f8f9ff] p-2.5 rounded-xl border border-neutral-100">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#0058be]" />
                                  <span>{p}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          {niche.desiredResults && niche.desiredResults.length > 0 && (
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Desired Results</p>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {niche.desiredResults.map((r, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-xs text-neutral-600 bg-[#f8f9ff] p-2.5 rounded-xl border border-neutral-100">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    <span>{r}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                    <div className="shrink-0" aria-hidden="true">
                      {isSelected ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-[#0058be] flex items-center justify-center shadow-md"
                        >
                          <Check size={14} className="text-[#d1f34d] stroke-[3]" />
                        </motion.div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-neutral-200" />
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      )}

      {/* ──────────────────────────────────────
          STEP 4 — Direction Statement
      ────────────────────────────────────── */}
      {activeSection === 'statement' && (
        <AnimatePresence mode="wait">
          <motion.div
            key="statement-step"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Main statement card */}
            <div className="p-5 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xl space-y-6">
              
              {/* Simple formula breakdown card */}
              <div className="p-4 rounded-2xl bg-[#eff4ff] border border-[#eff4ff]/60 text-xs sm:text-sm text-neutral-600 leading-relaxed flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white shrink-0 flex items-center justify-center shadow-sm">
                  <FileText size={16} className="text-[#0058be]" />
                </div>
                <p>
                  <span className="font-bold text-[#0058be] uppercase tracking-wider text-[9px] block mb-0.5">Direction formula</span>
                  I help <span className="font-extrabold text-[#0b1c30]">[Who]</span> get <span className="font-extrabold text-[#0b1c30]">[Result]</span> using <span className="font-extrabold text-[#0b1c30]">[Method]</span>.
                </p>
              </div>

              {/* Header row */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  Direction Statement
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleRegenerate}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-500 hover:bg-[#f8f9ff] hover:text-[#0058be] transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be]"
                    title={`Variation ${(variantIndex % variantTotal) + 1} of ${variantTotal}`}
                    aria-label={`Regenerate statement (variant ${(variantIndex % variantTotal) + 1} of ${variantTotal})`}
                  >
                    <RefreshCw size={13} aria-hidden="true" />
                    <span className="hidden sm:inline">Regenerate</span>
                    {variantTotal > 0 && (
                      <span className="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded-full">
                        {(variantIndex % variantTotal) + 1}/{variantTotal}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={handleCopy}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be]',
                      copied
                        ? 'bg-[#d1f34d] text-[#0b1c30]'
                        : 'text-neutral-500 hover:bg-[#f8f9ff] hover:text-[#0058be]',
                    )}
                    aria-label={copied ? 'Copied to clipboard' : 'Copy statement to clipboard'}
                  >
                    {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
                    <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(e => !e)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be]',
                      isEditing
                        ? 'bg-[#0058be] text-white'
                        : 'text-neutral-500 hover:bg-[#f8f9ff] hover:text-[#0058be]',
                    )}
                    aria-pressed={isEditing}
                    aria-label={isEditing ? 'Done editing' : 'Edit statement manually'}
                  >
                    <Edit3 size={13} aria-hidden="true" />
                    <span className="hidden sm:inline">{isEditing ? 'Done' : 'Edit'}</span>
                  </button>
                </div>
              </div>

              {/* Statement text */}
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    key="editing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <textarea
                      value={statement}
                      onChange={e => handleStatementChange(e.target.value)}
                      className="w-full text-2xl sm:text-3xl font-bold text-[#0b1c30] bg-[#f8f9ff] border border-[#0058be]/20 rounded-xl resize-none focus:ring-2 focus:ring-[#0058be]/30 focus:border-[#0058be]/40 p-3 leading-tight outline-none transition-all"
                      rows={4}
                      autoFocus
                      aria-label="Edit your direction statement"
                      onKeyDown={e => {
                        if (e.key === 'Escape') setIsEditing(false);
                      }}
                    />
                    <p className="text-xs text-neutral-400 mt-1.5">Press Esc to finish editing.</p>
                  </motion.div>
                ) : (
                  <motion.p
                    key="reading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-2xl sm:text-3xl font-bold text-[#0b1c30] leading-tight"
                    aria-live="polite"
                  >
                    {statement}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Confidence note */}
              <div className="pt-4 border-t border-neutral-100">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#d1f34d] shrink-0 mt-0.5 flex items-center justify-center" aria-hidden="true">
                    <Zap size={9} className="text-[#0b1c30]" />
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    This is your working direction, not your final brand tagline. Clear enough to test is better than perfect but unused.
                  </p>
                </div>
              </div>

              {/* Inline Save Statement Button */}
              <div className="flex justify-end pt-4 border-t border-neutral-100">
                <button
                  onClick={() => completeSection('statement')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0b1c30] hover:bg-[#152a45] text-white font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be]"
                >
                  Save Statement <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Statement breakdown */}
            {adapterEntry && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" aria-label="Direction statement breakdown">
                {[
                  { label: 'WHO', value: adapterEntry.who },
                  { label: 'RESULT', value: adapterEntry.result },
                  { label: 'METHOD', value: adapterEntry.method },
                ].map(item => (
                  <div key={item.label} className="p-4 rounded-xl bg-white border border-neutral-200">
                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-[#0b1c30] leading-snug">{item.value}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* ──────────────────────────────────────
          STEP 5 — Save Result
      ────────────────────────────────────── */}
      {activeSection === 'save' && (() => {
        const mainTrackLabel = MAIN_TRACK_OPTIONS.find(t => t.id === mainTrack)?.label;
        const specializationLabel = MAIN_TRACK_OPTIONS.find(t => t.id === mainTrack)?.subTracks?.find(s => s.id === trackId)?.label;
        const marketLabel = availableMarkets.find(m => m.id === marketId)?.label;
        const nicheLabel = availableNiches.find(n => n.id === nicheId)?.label;

        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="save-step"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Result card */}
              <div
                className="p-6 sm:p-8 rounded-3xl bg-[#0b1c30] text-white shadow-2xl relative overflow-hidden"
                role="region"
                aria-label="Your Module 1 output"
              >
                {/* Decorative blurs */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-[#0058be] rounded-full blur-[120px] opacity-20 -mr-24 -mt-24 pointer-events-none" aria-hidden="true" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#d1f34d] rounded-full blur-[90px] opacity-6 -ml-12 -mb-12 pointer-events-none" aria-hidden="true" />

                <div className="relative z-10 space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#d1f34d] flex items-center justify-center" aria-hidden="true">
                        <Save size={18} className="text-[#0b1c30]" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Module 1 Output</p>
                        <h3 className="text-xl font-bold text-white">Your Direction</h3>
                      </div>
                    </div>
                    {isSaved && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d1f34d] text-[#0b1c30] text-xs font-bold"
                        aria-live="polite"
                      >
                        <Check size={12} aria-hidden="true" /> Saved
                      </motion.div>
                    )}
                  </div>

                  {/* Selections row - responsive adaptive grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 pb-6 border-b border-white/10 text-left">
                    {mainTrackLabel && (
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Track</p>
                        <p className="font-bold text-white text-sm leading-snug">{mainTrackLabel}</p>
                      </div>
                    )}
                    {specializationLabel && (
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Specialization</p>
                        <p className="font-bold text-white text-sm leading-snug">{specializationLabel}</p>
                      </div>
                    )}
                    {marketLabel && (
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Market</p>
                        <p className="font-bold text-white text-sm leading-snug">{marketLabel}</p>
                      </div>
                    )}
                    {nicheLabel && (
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Niche</p>
                        <p className="font-bold text-white text-sm leading-snug">{nicheLabel}</p>
                      </div>
                    )}
                  </div>

                  {/* Statement */}
                  <div className="text-left">
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Direction Statement</p>
                    <p className="text-xl sm:text-2xl font-bold text-[#d1f34d] leading-relaxed max-w-2xl select-text break-words">
                      {statement}
                    </p>
                  </div>
                </div>
              </div>

              {/* Module Transition Context */}
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 leading-relaxed text-left flex items-start gap-2.5">
                <Sparkles size={14} className="text-[#0058be] shrink-0 mt-0.5" aria-hidden="true" />
                <p>
                  <strong>What was achieved:</strong> You have defined your primary track, target market, specific niche, and generated your customized direction statement.
                  <br />
                  <strong>What is next:</strong> In Module 2, you will utilize this direction statement to engineer your first high-converting client offer.
                </p>
              </div>

              {/* Authoritative Action Region */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-6 pt-6 border-t border-neutral-200">
                {/* Left / Supporting utilities and status */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Secondary buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveSection('statement')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-bold text-neutral-600 transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be] active:scale-[0.98]"
                    >
                      <Edit3 size={13} aria-hidden="true" />
                      <span>Edit statement</span>
                    </button>
                    <button
                      onClick={handleCopySummary}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-bold text-neutral-600 transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be] active:scale-[0.98]"
                    >
                      {copyStatus === 'success' ? (
                        <Check size={13} className="text-[#0058be] stroke-[3]" aria-hidden="true" />
                      ) : (
                        <Copy size={13} aria-hidden="true" />
                      )}
                      <span>
                        {copyStatus === 'success' && 'Copied'}
                        {copyStatus === 'failure' && "Couldn't copy. Try again."}
                        {copyStatus === 'idle' && 'Copy Summary'}
                      </span>
                    </button>
                  </div>

                  {/* Programmatic status text */}
                  <div className="text-left" aria-live="polite">
                    {!isSaved ? (
                      <span className="text-xs text-neutral-500 font-medium flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                        Your direction is ready to save.
                      </span>
                    ) : (
                      <span className="text-xs text-[#0058be] font-bold flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="stroke-[3]" aria-hidden="true" />
                        Saved
                      </span>
                    )}
                  </div>
                </div>

                {/* Right / Primary CTA */}
                <div className="flex items-center w-full md:w-auto">
                  {!isSaved ? (
                    <button
                      disabled={Boolean(adapterError)}
                      onClick={handleSaveResult}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#0058be] hover:bg-[#0047a0] text-white font-bold text-base transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0058be] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                    >
                      <Save size={16} aria-hidden="true" />
                      <span>Save Result</span>
                    </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                      <button
                        disabled={Boolean(adapterError)}
                        onClick={() => {
                          trackEvent('module1_completed', {
                            selectedTrack: trackId,
                            selectedMarket: marketId,
                            selectedNiche: nicheId,
                          });
                          navigate('/workspace/offer-engineering');
                        }}
                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#0b1c30] hover:bg-[#152a45] text-white font-bold text-base transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0b1c30] active:scale-[0.98]"
                      >
                        <span>Continue to Module 2</span>
                        <ArrowRight size={16} aria-hidden="true" />
                      </button>
                      {m2Completed && (
                        <button
                          onClick={() => {
                            trackEvent('module1_completed', {
                              selectedTrack: trackId,
                              selectedMarket: marketId,
                              selectedNiche: nicheId,
                            });
                            navigate('/workspace/authority-system');
                          }}
                          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#0058be] hover:bg-[#0047a0] text-white font-bold text-base transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0058be] active:scale-[0.98]"
                        >
                          <span>Continue to Authority System</span>
                          <ArrowRight size={16} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Adapter error display */}
              {adapterError && (
                <div className="mt-6">
                  <WorkspaceErrorState 
                    compact 
                    title="Data Configuration Error" 
                    message={adapterError} 
                    onRetry={() => {
                      // Optional: Reset selections on retry
                      setTrackId(null);
                      setMarketId(null);
                      setNicheId(null);
                    }}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        );
      })()}

      {/* ──────────────────────────────────────
          CTA — Desktop: inline | Mobile: fixed bottom
      ────────────────────────────────────── */}
      {/* Desktop CTA */}
      <div className="mt-10 hidden lg:flex justify-end gap-3">
        {activeSection !== 'track' && activeSection !== 'market' && activeSection !== 'save' && (
          <CTAButtons
            activeSection={activeSection}
            isContinueDisabled={isContinueDisabled}
            isSaved={isSaved}
            module2Complete={m2Completed}
            trackId={trackId}
            marketId={marketId}
            nicheId={nicheId}
            onComplete={completeSection}
            onSave={handleSaveResult}
            onContinue={() => {
              if (!isSaved) handleSaveResult();
              trackEvent('module1_completed', {
                selectedTrack: trackId,
                selectedMarket: marketId,
                selectedNiche: nicheId,
              });
              navigate('/workspace/offer-engineering');
            }}
            onContinueToModule3={() => {
              trackEvent('module1_completed', {
                selectedTrack: trackId,
                selectedMarket: marketId,
                selectedNiche: nicheId,
              });
              navigate('/workspace/authority-system');
            }}
          />
        )}
      </div>

      {/* Mobile bottom CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-neutral-200 px-4 py-3 safe-area-pb">
        {activeSection !== 'track' && activeSection !== 'market' && activeSection !== 'save' && (
          <CTAButtons
            activeSection={activeSection}
            isContinueDisabled={isContinueDisabled}
            isSaved={isSaved}
            module2Complete={m2Completed}
            trackId={trackId}
            marketId={marketId}
            nicheId={nicheId}
            onComplete={completeSection}
            onSave={handleSaveResult}
            onContinue={() => {
              if (!isSaved) handleSaveResult();
              trackEvent('module1_completed', {
                selectedTrack: trackId,
                selectedMarket: marketId,
                selectedNiche: nicheId,
              });
              navigate('/workspace/offer-engineering');
            }}
            onContinueToModule3={() => {
              trackEvent('module1_completed', {
                selectedTrack: trackId,
                selectedMarket: marketId,
                selectedNiche: nicheId,
              });
              navigate('/workspace/authority-system');
            }}
            fullWidth
          />
        )}
      </div>

      {/* Bottom spacer so mobile CTA doesn't cover content */}
      <div className="h-24 lg:hidden" aria-hidden="true" />
    </Module1Layout>
  );
}

/* ─────────────────────────────────────────
   CTA Buttons component (reused for
   desktop inline + mobile sticky)
───────────────────────────────────────── */

interface CTAButtonsProps {
  activeSection: SectionId;
  isContinueDisabled: boolean;
  isSaved: boolean;
  trackId: string | null;
  marketId: string | null;
  nicheId: string | null;
  onComplete: (id: SectionId) => void;
  onSave: () => void;
  onContinue: () => void;
  onContinueToModule3?: () => void;
  module2Complete?: boolean;
  fullWidth?: boolean;
}

function CTAButtons({
  activeSection,
  isContinueDisabled,
  isSaved,
  onComplete,
  onSave,
  onContinue,
  onContinueToModule3,
  module2Complete,
  fullWidth,
}: CTAButtonsProps) {
  const baseButton = cn(
    'flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2',
    fullWidth ? 'w-full' : 'min-w-[120px]',
  );

  return (
    <div className={cn('flex gap-3', fullWidth && 'w-full')}>
      <button
        disabled={isContinueDisabled}
        onClick={() => onComplete(activeSection)}
        aria-disabled={isContinueDisabled}
        className={cn(
          baseButton,
          'bg-[#0b1c30] text-white hover:bg-[#152a45] shadow-lg disabled:opacity-40 disabled:cursor-not-allowed focus:ring-[#0058be]',
          fullWidth && 'w-full',
        )}
        id={`continue-${activeSection}-btn`}
      >
        Continue <ArrowRight size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

export default AcquisitionWorkspace;
