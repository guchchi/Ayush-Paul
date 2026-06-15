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
import type { BlueprintStep } from '../types/opportunity-map';
import { MASTER_TRACKS } from '../data/opportunity-map/master-data';
import { Module1Layout, type StepItem } from '../components/module1/Module1Layout';
import { Module1IntroPage } from '../components/module1/Module1IntroPage';
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
  }, [trackId, marketId, nicheId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── Navigation helpers ─── */
  const canNavigateTo = useCallback((id: string) => {
    const idx = SECTION_ORDER.indexOf(id as SectionId);
    if (idx === 0) return true;
    const prevId = SECTION_ORDER[idx - 1];
    return completedSections.has(prevId) || completedSections.has(id);
  }, [completedSections]);

  const getSectionStatus = (id: SectionId): 'completed' | 'current' | 'locked' => {
    if (completedSections.has(id)) return 'completed';
    if (id === activeSection) return 'current';
    return canNavigateTo(id) ? 'current' : 'locked';
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
    const text = `Module 1 Output Summary\n───────────────────────\nCareer Track: ${trackData?.label}\nMarket: ${availableMarkets.find(m => m.id === marketId)?.label}\nNiche: ${availableNiches.find(n => n.id === nicheId)?.label}\nDirection Statement: ${statement}`;
    try {
      await navigator.clipboard.writeText(text);
      setSummaryCopied(true);
      setTimeout(() => setSummaryCopied(false), 2000);
      trackEvent('module1_summary_copied');
    } catch {}
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
        <h2 className="text-3xl font-bold text-[#0b1c30] mb-2">{STEP_LABELS[activeSection]}</h2>
        <p className="text-neutral-500 text-base leading-relaxed">{STEP_DESCRIPTIONS[activeSection]}</p>
      </div>

      {/* ──────────────────────────────────────
          STEP 1 — Track
      ────────────────────────────────────── */}
      {activeSection === 'track' && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-4" role="radiogroup" aria-label="Choose your career track">
            {MAIN_TRACK_OPTIONS.map(track => {
              const isSelected = mainTrack === track.id;
              return (
                <motion.button
                  key={track.id}
                  onClick={() => handleMainTrackSelect(track.id)}
                  whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
                  whileTap={{ scale: 0.97 }}
                  role="radio"
                  aria-checked={isSelected}
                  className={cn(
                    'relative p-6 rounded-2xl border text-left flex flex-col h-full justify-between transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#0058be] focus:ring-offset-2',
                    isSelected
                      ? 'bg-white border-[#0058be] shadow-[0_8px_32px_rgba(0,88,190,0.14)] ring-1 ring-[#0058be]'
                      : 'bg-white border-neutral-200 hover:border-neutral-300',
                  )}
                  id={`main-track-card-${track.id}`}
                >
                  {/* Selected indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute top-4 right-4"
                      aria-hidden="true"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#0058be] flex items-center justify-center shadow-md">
                        <Check size={12} className="text-[#d1f34d] stroke-[3]" />
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <div className="flex items-start justify-between mb-5">
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors duration-200',
                        isSelected ? 'bg-[#0058be]/8' : 'bg-[#f8f9ff] group-hover:bg-[#0058be]/5',
                      )}>
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
                    {track.clients && track.clients.length > 0 && (
                      <div className="pt-3 border-t border-neutral-100/50">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Good starting clients</p>
                        <div className="flex flex-wrap gap-1.5">
                          {track.clients.map((c, i) => (
                            <span key={i} className="text-[10px] font-semibold bg-neutral-50 px-2 py-0.5 rounded text-neutral-600">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {track.bestFor && (
                      <div className={cn(
                        'pt-3 border-t text-[10px] font-bold uppercase tracking-wider transition-colors',
                        isSelected
                          ? 'text-[#0058be] border-[#0058be]/10'
                          : 'text-neutral-400 border-neutral-100',
                      )}>
                        Best for: {track.bestFor}
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Subtrack selection if main track has subtracks */}
          {mainTrack && MAIN_TRACK_OPTIONS.find(t => t.id === mainTrack)?.subTracks && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 pt-8 border-t border-neutral-200 space-y-4"
            >
              <h4 className="text-sm font-bold uppercase tracking-widest text-[#0058be] mb-3">
                Choose Your Sub-Track
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                {MAIN_TRACK_OPTIONS.find(t => t.id === mainTrack)?.subTracks?.map(sub => {
                  const isSubSelected = trackId === sub.id;

                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleTrackSelect(sub.id)}
                      className={cn(
                        'p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 relative',
                        isSubSelected
                          ? 'bg-white border-[#0058be] shadow-[0_8px_32px_rgba(0,88,190,0.14)] ring-1 ring-[#0058be]'
                          : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md',
                      )}
                    >
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-3">
                          <span className={cn(
                            'text-sm font-bold',
                            isSubSelected ? 'text-[#0058be]' : 'text-[#0b1c30]',
                          )}>
                            {sub.label}
                          </span>
                          {isSubSelected && (
                            <span className="w-4.5 h-4.5 rounded-full bg-[#0058be] flex items-center justify-center">
                              <Check size={10} className="text-[#d1f34d] stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 leading-relaxed mb-3">
                          {sub.description}
                        </p>
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-auto pt-2 border-t border-neutral-100/50">
                        <strong>Best for:</strong> {sub.bestFor}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────
          STEP 2 — Market
      ────────────────────────────────────── */}
      {activeSection === 'market' && (
        <AnimatePresence mode="wait">
          <motion.div
            key="market-step"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
            role="radiogroup"
            aria-label="Choose your target market"
          >
            {availableMarkets.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white border border-neutral-200 text-center">
                <p className="text-neutral-400 text-sm">Select a track first to see available markets.</p>
              </div>
            ) : availableMarkets.map(market => {
              const isSelected = marketId === market.id;

              return (
                <div key={market.id} className="space-y-4">
                  <motion.button
                    onClick={() => handleMarketSelect(market.id)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    role="radio"
                    aria-checked={isSelected}
                    className={cn(
                      'w-full p-6 rounded-2xl border text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0058be] focus:ring-offset-2',
                      isSelected
                        ? 'bg-white border-[#0058be] shadow-[0_8px_32px_rgba(0,88,190,0.14)] ring-1 ring-[#0058be]'
                        : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md',
                    )}
                    id={`market-card-${market.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        'w-12 h-12 rounded-xl shrink-0 flex items-center justify-center transition-colors duration-200',
                        isSelected ? 'bg-[#0058be]' : 'bg-[#f8f9ff]',
                      )} aria-hidden="true">
                        <Target size={20} className={isSelected ? 'text-white' : 'text-[#0058be]'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={cn(
                            'font-bold text-xl transition-colors',
                            isSelected ? 'text-[#0058be]' : 'text-[#0b1c30]',
                          )}>
                            {market.label}
                          </h3>
                        </div>
                        <p className="text-sm text-neutral-500 leading-relaxed">
                          {market.description}
                        </p>

                        {/* Rich Information shown when selected */}
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-6 pt-5 border-t border-neutral-100 space-y-4 overflow-hidden"
                          >
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Why this market works</p>
                              <p className="text-xs text-neutral-600 leading-relaxed font-semibold">{market.whyItWorks}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Common problems you will solve</p>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {market.problems.map((p, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-xs text-neutral-600 bg-[#f8f9ff] p-2.5 rounded-xl border border-neutral-100">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#0058be]" />
                                    <span>{p}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
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
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
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
      {activeSection === 'save' && (
        <AnimatePresence mode="wait">
          <motion.div
            key="save-step"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Result card */}
            <div
              className="p-5 sm:p-8 rounded-3xl bg-[#0b1c30] text-white shadow-2xl relative overflow-hidden"
              role="region"
              aria-label="Your Module 1 output"
            >
              {/* Decorative blurs */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#0058be] rounded-full blur-[120px] opacity-20 -mr-24 -mt-24 pointer-events-none" aria-hidden="true" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#d1f34d] rounded-full blur-[90px] opacity-6 -ml-12 -mb-12 pointer-events-none" aria-hidden="true" />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#d1f34d] flex items-center justify-center" aria-hidden="true">
                      <Save size={18} className="text-[#0b1c30]" />
                    </div>
                    <div>
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

                {/* Selections row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-white/10 mb-6">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Track</p>
                    <p className="font-bold text-white text-sm leading-snug">{trackData?.label}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Market</p>
                    <p className="font-bold text-white text-sm leading-snug">
                      {availableMarkets.find(m => m.id === marketId)?.label}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Niche</p>
                    <p className="font-bold text-white text-sm leading-snug">
                      {availableNiches.find(n => n.id === nicheId)?.label}
                    </p>
                  </div>
                </div>

                {/* Statement */}
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Direction Statement</p>
                  <p className="text-xl font-bold text-[#d1f34d] leading-relaxed">{statement}</p>
                </div>
              </div>
            </div>

            {/* Explanation text */}
            <div className="p-4 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-500 leading-relaxed">
              You now have a clear starting direction. In Module 2, you will use this direction to build your first offer.
            </div>

            {/* Inline Action Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-6 pt-6 border-t border-neutral-200">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  onClick={() => setActiveSection('statement')}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-bold text-neutral-600 transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be]"
                >
                  <Edit3 size={13} /> Edit Direction
                </button>
                <button
                  onClick={handleCopySummary}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-bold text-neutral-600 transition-all focus:outline-none focus:ring-2 focus:ring-[#0058be]"
                >
                  {summaryCopied ? <Check size={13} /> : <Copy size={13} />}
                  {summaryCopied ? 'Summary Copied!' : 'Copy Summary'}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {!isSaved ? (
                  <button
                    disabled={Boolean(adapterError)}
                    onClick={handleSaveResult}
                    className="flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#0058be] hover:bg-[#0047a0] text-white font-bold text-xs transition-all shadow-md focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto"
                  >
                    <Save size={13} /> Save Result
                  </button>
                ) : (
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
                    className="flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#0b1c30] hover:bg-[#152a45] text-white font-bold text-xs transition-all shadow-md focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto"
                  >
                    Complete Module & Continue <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Adapter error display */}
            {adapterError && (
              <div
                className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200"
                role="alert"
              >
                <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-red-700 mb-0.5">Data Configuration Error</p>
                  <p className="text-xs text-red-600 leading-relaxed">{adapterError}</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* ──────────────────────────────────────
          CTA — Desktop: inline | Mobile: fixed bottom
      ────────────────────────────────────── */}
      {/* Desktop CTA */}
      <div className="mt-10 hidden lg:flex justify-end gap-3">
        <CTAButtons
          activeSection={activeSection}
          isContinueDisabled={isContinueDisabled}
          isSaved={isSaved}
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
        />
      </div>

      {/* Mobile bottom CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-neutral-200 px-4 py-3 safe-area-pb">
        <CTAButtons
          activeSection={activeSection}
          isContinueDisabled={isContinueDisabled}
          isSaved={isSaved}
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
          fullWidth
        />
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
  fullWidth?: boolean;
}

function CTAButtons({
  activeSection,
  isContinueDisabled,
  isSaved,
  onComplete,
  onSave,
  onContinue,
  fullWidth,
}: CTAButtonsProps) {
  const baseButton = cn(
    'flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2',
    fullWidth ? 'w-full' : 'min-w-[120px]',
  );

  if (activeSection === 'save') {
    return (
      <div className={cn('flex flex-col sm:flex-row gap-3', fullWidth && 'w-full')}>
        {!isSaved && (
          <button
            onClick={onSave}
            className={cn(
              baseButton,
              'bg-white border border-neutral-200 text-[#0b1c30] hover:bg-neutral-50 focus:ring-[#0058be]',
            )}
            id="save-result-btn"
          >
            <Save size={16} aria-hidden="true" /> Save Result
          </button>
        )}
        <button
          onClick={onContinue}
          className={cn(
            baseButton,
            'bg-[#0058be] text-white shadow-[0_4px_20px_rgba(0,88,190,0.3)] hover:bg-[#0047a0] hover:shadow-[0_8px_32px_rgba(0,88,190,0.35)] focus:ring-[#0058be]',
            isSaved && fullWidth && 'w-full',
          )}
          id="continue-module2-btn"
        >
          Continue to Module 2 <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    );
  }

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
