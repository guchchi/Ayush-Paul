/**
 * Step3ProfilePortfolioAuthority.tsx
 *
 * Module 3 — Step 3: Profile & Portfolio Authority
 *
 * 7-section sequential wizard. Each section produces store-persisted output.
 * Section completion is derived from `step3CompletedSections` in the store —
 * no local useState for progress, no progress loss on refresh.
 *
 * Section flow:
 *   1  AuthoritySnapshotSection     — read-only confirmation of upstream context
 *   2  ProfileStrategySection       — review/edit AI profile copy per platform
 *   3  BrandIdentitySection         — confirm brand tone & visual direction
 *   4  PortfolioOrderingCanvas      — reorder portfolio website sections
 *   5  EvidencePlacementSection     — map profile claims to proof assets
 *   6  ContentStrategySection       — approve deterministic content roadmap
 *   7  StrategySummarySection       — review assembled blueprint, complete step
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronRight, Lock, AlertTriangle, Sparkles } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { EASING, DURATION } from '../../../lib/motion-presets';
import { useModule3Store } from '../../../lib/module3/store';
import { generateFullAuthoritySuite } from '../../../data/module3/authority-suite-engine';

// ── Section components ────────────────────────────────────────────────────────
import { AuthoritySnapshotSection } from './sections/AuthoritySnapshotSection';
import { ProfileStrategySection } from './sections/ProfileStrategySection';
import { BrandIdentitySection } from './sections/BrandIdentitySection';
import { PortfolioOrderingCanvas } from './sections/PortfolioOrderingCanvas';
import { EvidencePlacementSection } from './sections/EvidencePlacementSection';
import { ContentStrategySection } from './sections/ContentStrategySection';
import { StrategySummarySection } from './sections/StrategySummarySection';

// ── Motion tokens ─────────────────────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 16, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -8, filter: 'blur(4px)' },
  transition: { duration: DURATION.NORMAL, ease: EASING.PREMIUM },
};

// ── Section metadata ──────────────────────────────────────────────────────────
const SECTIONS = [
  { n: 1, label: 'Authority Snapshot',    shortLabel: 'Snapshot' },
  { n: 2, label: 'Profile Identity',      shortLabel: 'Profile' },
  { n: 3, label: 'Brand Identity',        shortLabel: 'Brand' },
  { n: 4, label: 'Portfolio Structure',   shortLabel: 'Structure' },
  { n: 5, label: 'Evidence Placement',    shortLabel: 'Evidence' },
  { n: 6, label: 'Content Roadmap',       shortLabel: 'Content' },
  { n: 7, label: 'Strategy Blueprint',    shortLabel: 'Blueprint' },
] as const;

// ── Step progress stepper ─────────────────────────────────────────────────────
function SectionStepper({
  current,
  completed,
  onJump,
}: {
  current: number;
  completed: number[];
  onJump: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-0.5 overflow-x-auto pb-1 px-1 scrollbar-none">
      {SECTIONS.map(({ n, shortLabel }, idx) => {
        const isDone = completed.includes(n);
        const isCurrent = current === n;
        const canAccess = n === 1 || completed.includes(n - 1) || isDone;

        return (
          <div key={n} className="flex items-center gap-0.5 shrink-0">
            {idx > 0 && (
              <div
                className={cn(
                  'h-0.5 w-6 rounded-full transition-colors',
                  completed.includes(n - 1) ? 'bg-indigo-500' : 'bg-neutral-200'
                )}
              />
            )}
            <button
              onClick={() => canAccess && onJump(n)}
              disabled={!canAccess}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer disabled:cursor-default',
                isCurrent
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : isDone
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                  : canAccess
                  ? 'bg-white text-neutral-600 border-neutral-200 hover:border-indigo-300 hover:text-indigo-600'
                  : 'bg-neutral-50 text-neutral-400 border-neutral-200 opacity-60'
              )}
              title={canAccess ? undefined : 'Complete previous sections first'}
            >
              {isDone && !isCurrent ? (
                <CheckCircle2 className="w-3 h-3 text-indigo-500 shrink-0" />
              ) : !canAccess ? (
                <Lock className="w-3 h-3 shrink-0" />
              ) : (
                <span className="w-3.5 h-3.5 text-[10px] font-black flex items-center justify-center shrink-0">
                  {n}
                </span>
              )}
              <span className="hidden sm:block">{shortLabel}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ completed }: { completed: number[] }) {
  const pct = Math.round((completed.length / 7) * 100);
  return (
    <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: EASING.PREMIUM }}
      />
    </div>
  );
}

// ── Portfolio section wrapper for Section 4 ───────────────────────────────────
function Section4Wrapper({ onContinue }: { onContinue: () => void }) {
  const authoritySuite = useModule3Store((s) => s.authoritySuite);
  const updatePortfolioSection = useModule3Store((s) => s.updatePortfolioSection);
  const setStep3AssetOrder = useModule3Store((s) => s.setStep3AssetOrder);
  const [sections, setSections] = useState(authoritySuite?.portfolioBlueprint ?? []);

  useEffect(() => {
    if (authoritySuite?.portfolioBlueprint) {
      setSections(authoritySuite.portfolioBlueprint);
    }
  }, [authoritySuite]);

  const handleSectionChange = useCallback(
    (sectionId: string, updatedFields: Record<string, unknown>) => {
      updatePortfolioSection(sectionId, updatedFields as any);
      setSections((prev) =>
        prev.map((s) => (s.id === sectionId ? { ...s, ...updatedFields } : s))
      );
    },
    [updatePortfolioSection]
  );

  const handleReorder = useCallback((reordered: typeof sections) => {
    setSections(reordered);
  }, []);

  const handleConfirm = () => {
    setStep3AssetOrder(sections.map((s) => s.id));
    onContinue();
  };

  if (!authoritySuite?.portfolioBlueprint?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
        <Sparkles className="w-8 h-8 mb-3 opacity-40" />
        <p className="text-sm">Portfolio blueprint is generating…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900">Section 4 — Portfolio Structure</h2>
        <p className="mt-1 text-sm text-neutral-500 max-w-2xl">
          Arrange and enable/disable sections in your portfolio website. The order here
          becomes your portfolio architecture specification.
        </p>
      </div>

      <PortfolioOrderingCanvas
        sections={sections}
        onSectionChange={handleSectionChange}
        onReorderSections={handleReorder}
      />

      <div className="flex justify-end pt-2">
        <button
          onClick={handleConfirm}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
        >
          Confirm Portfolio Structure
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Main orchestration shell ──────────────────────────────────────────────────
export function Step3ProfilePortfolioAuthority() {
  const authoritySuite = useModule3Store((s) => s.authoritySuite);
  const setAuthoritySuite = useModule3Store((s) => s.setAuthoritySuite);
  const authorityPosition = useModule3Store((s) => s.authorityPosition);
  const coreTrustPromise = useModule3Store((s) => s.coreTrustPromise);
  const proofAssets = useModule3Store((s) => s.proofAssets);
  const mod1ServiceId = useModule3Store((s) => s.mod1ServiceId);
  const mod1MarketId = useModule3Store((s) => s.mod1MarketId);
  const mod1NicheId = useModule3Store((s) => s.mod1NicheId);
  const mod2UniqueMechanism = useModule3Store((s) => s.mod2UniqueMechanism);
  const mod2OfferType = useModule3Store((s) => s.mod2OfferType);
  const availableAssets = useModule3Store((s) => s.availableAssets);
  const skippedAssets = useModule3Store((s) => s.skippedAssets);
  const isUpstreamStale = useModule3Store((s) => s.isUpstreamStale);

  const step3CompletedSections = useModule3Store((s) => s.step3CompletedSections);
  const completeStep3Section = useModule3Store((s) => s.completeStep3Section);
  const confirmStep = useModule3Store((s) => s.confirmStep);
  const nextStep = useModule3Store((s) => s.nextStep);

  // ── Auto-resume: start at first incomplete section ──
  const computeInitialSection = (): number => {
    for (let n = 1; n <= 7; n++) {
      if (!step3CompletedSections.includes(n)) return n;
    }
    return 7; // all done — show summary
  };

  const [currentSection, setCurrentSection] = useState<number>(computeInitialSection);
  const [suiteGenerating, setSuiteGenerating] = useState(false);

  // ── Auto-generate authority suite if missing ──────────────────────────────
  useEffect(() => {
    if (!authoritySuite && !suiteGenerating) {
      setSuiteGenerating(true);
      try {
        const proofContext = {
          availableAssets,
          skippedAssets,
          proofAssets,
          existingProofInventory: '',
        };
        const suite = generateFullAuthoritySuite({
          position: authorityPosition,
          trustPromise: coreTrustPromise,
          serviceId: mod1ServiceId,
          marketId: mod1MarketId,
          offerType: mod2OfferType,
          targetClient: mod1MarketId,
          uniqueMechanism: mod2UniqueMechanism,
          proofContext,
        });
        setAuthoritySuite(suite);
      } catch (err) {
        console.error('[Step3] Failed to generate authority suite:', err);
      } finally {
        setSuiteGenerating(false);
      }
    }
  }, []);

  // ── Section navigation ────────────────────────────────────────────────────
  const canGoToSection = (n: number): boolean =>
    n === 1 || step3CompletedSections.includes(n - 1) || step3CompletedSections.includes(n);

  const goToSection = (n: number) => {
    if (canGoToSection(n)) setCurrentSection(n);
  };

  const advanceSection = useCallback(
    (n: number) => {
      completeStep3Section(n);
      if (n < 7) {
        setCurrentSection(n + 1);
      }
    },
    [completeStep3Section]
  );

  // ── Section 7 completion ─────────────────────────────────────────────────
  const handleComplete = useCallback(() => {
    completeStep3Section(7);
    confirmStep();
    nextStep();
  }, [completeStep3Section, confirmStep, nextStep]);

  // ── Stale warning ────────────────────────────────────────────────────────
  const showStaleWarning = isUpstreamStale && currentSection > 1;

  return (
    <div className="space-y-6 pb-16 text-left max-w-6xl mx-auto">
      {/* Executive Hero Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-7 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-900/80 px-3 py-1 rounded-full border border-indigo-500/30">
                Module 3 • Authority System Studio
              </span>
              <span className="text-xs text-slate-300 font-bold bg-white/10 px-2.5 py-0.5 rounded-full">
                Step 3 of 6
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Profile &amp; Portfolio Authority Suite
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-medium">
              Transform your authority position and proof inventory into high-converting visual profile assets, website wireframes, and content roadmaps.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div className="space-y-0.5 text-right">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Blueprint Status</span>
              <span className="text-lg font-black text-emerald-400">
                {Math.round((step3CompletedSections.length / 7) * 100)}% Complete
              </span>
              <span className="text-[10px] text-slate-400 block font-medium">
                {step3CompletedSections.length} of 7 Sections Verified
              </span>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-emerald-400/40 bg-emerald-950/60 flex items-center justify-center font-black text-emerald-300 text-sm">
              0{step3CompletedSections.length}/7
            </div>
          </div>
        </div>
      </div>

      {/* High-Tech Stepper Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl text-white space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-2">
            <Sparkles size={14} className="text-amber-400" />
            7-Section Authority Blueprint Wizard
          </span>
          <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
            Section #{currentSection}: {SECTIONS[currentSection - 1]?.label}
          </span>
        </div>

        <ProgressBar completed={step3CompletedSections} />

        <SectionStepper
          current={currentSection}
          completed={step3CompletedSections}
          onJump={goToSection}
        />
      </div>

      {/* Stale upstream warning */}
      {showStaleWarning && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-950/80 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-amber-200 shadow-md"
        >
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs sm:text-sm leading-relaxed">
            <span className="font-bold text-amber-300">Upstream Context Updated:</span>{' '}
            Your Module 1 positioning or Module 2 offer details were modified. Consider re-verifying from Section 1 to ensure 100% alignment.
          </p>
        </motion.div>
      )}

      {/* Section body */}
      <div className="min-h-[450px]">
        <AnimatePresence mode="wait">
          <motion.div key={currentSection} {...fadeUp}>
            {currentSection === 1 && (
              <AuthoritySnapshotSection
                onContinue={() => advanceSection(1)}
              />
            )}
            {currentSection === 2 && (
              <ProfileStrategySection
                onContinue={() => advanceSection(2)}
              />
            )}
            {currentSection === 3 && (
              <BrandIdentitySection
                onContinue={() => advanceSection(3)}
              />
            )}
            {currentSection === 4 && (
              <Section4Wrapper
                onContinue={() => advanceSection(4)}
              />
            )}
            {currentSection === 5 && (
              <EvidencePlacementSection
                onContinue={() => advanceSection(5)}
              />
            )}
            {currentSection === 6 && (
              <ContentStrategySection
                onContinue={() => advanceSection(6)}
              />
            )}
            {currentSection === 7 && (
              <StrategySummarySection
                onComplete={handleComplete}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Step3ProfilePortfolioAuthority;
