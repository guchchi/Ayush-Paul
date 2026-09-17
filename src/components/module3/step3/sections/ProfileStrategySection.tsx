/**
 * ProfileStrategySection.tsx — Stage 1 Orchestrator
 * 
 * Manages the 5-section wizard flow for Social Profile Identity Studio.
 * Step-by-step navigation: Authority Audit → Identity Foundation → Platform Studio → Consistency Check → Deploy & Proof.
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../../../lib/utils';
import { EASING, DURATION } from '../../../../lib/motion-presets';
import { useModule3Store } from '../../../../lib/module3/store';
import {
  calculateAuthorityScore,
  calculateAuditBaselineScore,
} from '../../../../lib/module3/authority-score-engine';
import { ModuleButton } from '../../../workspace/ModuleButton';

// ── Sub-Section Components ────────────────────────────────────────────────────
import { AuthorityAuditSection } from './stage1/AuthorityAuditSection';
import { IdentityFoundationSection } from './stage1/IdentityFoundationSection';
import { PlatformStudioSection } from './stage1/PlatformStudioSection';
import { ConsistencyCheckSection } from './stage1/ConsistencyCheckSection';
import { DeployProofSection } from './stage1/DeployProofSection';

import {
  Shield,
  Target,
  Monitor,
  Eye,
  Rocket,
  Check,
} from 'lucide-react';

interface Props {
  onContinue: () => void;
}

// ── Section Metadata ──────────────────────────────────────────────────────────

const SECTIONS = [
  { id: 1, label: 'Authority Audit', shortLabel: 'Audit', icon: Shield, desc: 'Benchmark your current profile baseline & diagnostic gap' },
  { id: 2, label: 'Identity Foundation', shortLabel: 'Identity', icon: Target, desc: 'Single source of truth for name, handle & positioning' },
  { id: 3, label: 'Platform Studio', shortLabel: 'Studio', icon: Monitor, desc: 'Multi-platform live studio with conversion-tested copy' },
  { id: 4, label: 'Consistency Check', shortLabel: 'Check', icon: Eye, desc: 'Verify message continuity & eliminate tone drift across channels' },
  { id: 5, label: 'Deploy & Proof', shortLabel: 'Deploy', icon: Rocket, desc: 'Review before/after score gain & export master identity package' },
] as const;

// ── Role Recommendation Logic ─────────────────────────────────────────────────

interface RoleRecommendation {
  roleLabel: string;
  recommendedPlatforms: string[];
}

const getRoleRecommendation = (serviceId: string | null, careerTrackId: string | null): RoleRecommendation => {
  const s = (serviceId || '').toLowerCase();
  const c = (careerTrackId || '').toLowerCase();

  if (s.includes('edit') || s.includes('video') || s.includes('motion') || c.includes('editor')) {
    return { roleLabel: 'Video Editor & Motion Specialist', recommendedPlatforms: ['youtube', 'instagram', 'twitter'] };
  }
  if (s.includes('design') || s.includes('ui') || s.includes('figma') || c.includes('designer')) {
    return { roleLabel: 'UI/UX & Product Designer', recommendedPlatforms: ['behance', 'linkedin', 'twitter'] };
  }
  if (s.includes('code') || s.includes('dev') || s.includes('tech') || s.includes('app') || c.includes('developer')) {
    return { roleLabel: 'Software Developer & Technical Architect', recommendedPlatforms: ['github', 'linkedin', 'twitter'] };
  }
  return { roleLabel: 'Authority Specialist', recommendedPlatforms: ['linkedin', 'twitter', 'personal_site'] };
};

// ── Motion tokens ─────────────────────────────────────────────────────────────

const sectionFade = {
  initial: { opacity: 0, y: 16, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -12, filter: 'blur(4px)' },
  transition: { duration: DURATION.NORMAL, ease: EASING.PREMIUM },
};

// ── Main Orchestrator ─────────────────────────────────────────────────────────

export const ProfileStrategySection: React.FC<Props> = React.memo(({ onContinue }) => {
  const {
    authoritySuite,
    updateProfileField,
    resetProfileField,
    mod1ServiceId,
    mod1CareerTrackId,
    mod1Positioning,
    mod1MarketId,
    mod2UniqueMechanism,
    mod2ProposalSummary,
    stage1ActiveSection,
    stage1CompletedSections,
    stage1Identity,
    stage1Audit,
    setStage1ActiveSection,
    setStage1CompletedSections,
    setStage1Identity,
  } = useModule3Store();

  // Wizard state persisted via store
  const activeSection = stage1ActiveSection || 1;
  const completedSections = useMemo(
    () => new Set(stage1CompletedSections || []),
    [stage1CompletedSections]
  );

  // Identity state persisted via store
  const userName = stage1Identity?.userName ?? '';
  const userHandle = stage1Identity?.userHandle ?? '';
  const positioningHeadline = stage1Identity?.positioningHeadline ?? '';
  const proofLine = stage1Identity?.proofLine ?? '';
  const activeTone = stage1Identity?.activeTone ?? 'executive';

  const setUserName = useCallback((val: string) => setStage1Identity({ userName: val }), [setStage1Identity]);
  const setUserHandle = useCallback((val: string) => setStage1Identity({ userHandle: val }), [setStage1Identity]);
  const setPositioningHeadline = useCallback((val: string) => setStage1Identity({ positioningHeadline: val }), [setStage1Identity]);
  const setProofLine = useCallback((val: string) => setStage1Identity({ proofLine: val }), [setStage1Identity]);
  const setActiveTone = useCallback((val: 'executive' | 'conversion' | 'direct') => setStage1Identity({ activeTone: val }), [setStage1Identity]);


  const recommendation = useMemo(
    () => getRoleRecommendation(mod1ServiceId, mod1CareerTrackId),
    [mod1ServiceId, mod1CareerTrackId]
  );

  const profileSystem = authoritySuite?.profileSystem || [];

  // Auto-set highly personalized headline and proof line from user's exact Module 1 & 2 inputs
  useEffect(() => {
    if (!stage1Identity?.positioningHeadline || !stage1Identity?.proofLine) {
      const updates: any = {};

      if (!stage1Identity?.positioningHeadline) {
        // Build an organic headline combining their exact mechanism and positioning
        // Fallback to their proposal summary headline if available, otherwise construct from raw parts
        const mechanism = mod2UniqueMechanism?.trim() || 'Systematic Approach';
        const positioning = mod1Positioning?.trim() || (mod1ServiceId || '').replace(/_/g, ' ') || 'Specialist';
        
        updates.positioningHeadline = mod2ProposalSummary?.headline?.trim() 
          ? mod2ProposalSummary.headline 
          : `${positioning} | ${mechanism}`;
      }

      if (!stage1Identity?.proofLine) {
        // Build a raw proof line from their own words
        const market = (mod1MarketId || '').replace(/_/g, ' ') || 'clients';
        const mechanism = mod2UniqueMechanism?.trim() || 'my proven system';
        
        updates.proofLine = mod2ProposalSummary?.solution?.trim()
          ? mod2ProposalSummary.solution
          : `I help ${market} achieve measurable results through ${mechanism}`;
      }

      setStage1Identity(updates);
    }
  }, [
    mod1Positioning,
    mod1ServiceId,
    mod1MarketId,
    mod2UniqueMechanism,
    mod2ProposalSummary,
    stage1Identity?.positioningHeadline,
    stage1Identity?.proofLine,
    setStage1Identity
  ]);

  // Baseline score: pull from Section 1 Authority Audit diagnosticScore (if user took quiz/pasted bio)
  // or calculate the real baseline from user's selected platforms and context
  const baselineScore = useMemo(() => {
    if (stage1Audit?.diagnosticScore && stage1Audit.diagnosticScore > 0) {
      return stage1Audit.diagnosticScore;
    }
    return calculateAuditBaselineScore({
      selectedPlatforms: stage1Audit?.selectedPlatforms?.length ? stage1Audit.selectedPlatforms : ['linkedin', 'twitter'],
      quizAnswers: stage1Audit?.quizAnswers ?? { headlineType: 'skills', hasPinnedProof: false, hasSingleCta: false },
      serviceId: mod1ServiceId,
      careerTrackId: mod1CareerTrackId,
    }).total;
  }, [stage1Audit, mod1ServiceId, mod1CareerTrackId]);

  const advanceSection = useCallback((currentId: number) => {
    const updated = Array.from(new Set([...(stage1CompletedSections || []), currentId]));
    setStage1CompletedSections(updated);
    if (currentId < 5) {
      setStage1ActiveSection(currentId + 1);
    }
  }, [stage1CompletedSections, setStage1CompletedSections, setStage1ActiveSection]);

  const retreatSection = useCallback((currentId: number) => {
    if (currentId > 1) {
      setStage1ActiveSection(currentId - 1);
    }
  }, [setStage1ActiveSection]);

  const handleComplete = useCallback(() => {
    const updated = Array.from(new Set([...(stage1CompletedSections || []), 5]));
    setStage1CompletedSections(updated);
    onContinue();
  }, [stage1CompletedSections, setStage1CompletedSections, onContinue]);

  // Loading state
  if (!authoritySuite || !authoritySuite.profileSystem) {
    return (
      <div className="w-full p-12 flex flex-col items-center justify-center border border-neutral-200 rounded-3xl bg-white shadow-xs">
        <div className="w-8 h-8 border-2 border-[#0058be] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-neutral-600 font-bold">Generating your role-personalized profile copy...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-left font-sans">
      {/* Step Progress Bar (Module 1 Aligned Luxury Stepper) */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
        className="p-3.5 sm:p-4 rounded-3xl border border-neutral-200 bg-white shadow-xs"
      >
        <div className="flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar">
          {SECTIONS.map((section, idx) => {
            const isActive = activeSection === section.id;
            const isCompleted = completedSections.has(section.id);
            const isPast = section.id < activeSection;
            const Icon = section.icon;

            return (
              <React.Fragment key={section.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (isCompleted || isPast || section.id <= activeSection + 1) {
                      setStage1ActiveSection(section.id);
                    }
                  }}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer flex-1 min-w-[120px] sm:min-w-0',
                    isActive
                      ? 'bg-[#0058be] text-white shadow-md'
                      : isCompleted || isPast
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100/70'
                      : 'bg-neutral-50 text-neutral-400 border border-neutral-200 hover:text-neutral-600'
                  )}
                >
                  <span className={cn(
                    'w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0',
                    isActive ? 'bg-white/20 text-white' : isCompleted ? 'bg-emerald-200 text-emerald-900' : 'bg-neutral-200 text-neutral-600'
                  )}>
                    {isCompleted ? <Check size={12} strokeWidth={3} /> : `0${section.id}`}
                  </span>
                  <span className="text-[11px] font-bold truncate">{section.shortLabel}</span>
                </button>
                {idx < SECTIONS.length - 1 && (
                  <div className={cn(
                    'w-3 sm:w-4 h-0.5 rounded-full shrink-0',
                    section.id < activeSection ? 'bg-emerald-300' : 'bg-neutral-200'
                  )} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </motion.div>

      {/* Active Section Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeSection} {...sectionFade}>
          {activeSection === 1 && (
            <AuthorityAuditSection
              profileSystem={profileSystem}
              headline={positioningHeadline}
              proofLine={proofLine}
              uniqueMechanism={mod2UniqueMechanism || ''}
              userName={userName}
              userHandle={userHandle}
              activeTone={activeTone}
              recommendedPlatforms={recommendation.recommendedPlatforms}
              roleLabel={recommendation.roleLabel}
              serviceId={mod1ServiceId}
              careerTrackId={mod1CareerTrackId}
              onContinue={() => advanceSection(1)}
            />
          )}

          {activeSection === 2 && (
            <IdentityFoundationSection
              userName={userName}
              userHandle={userHandle}
              positioningHeadline={positioningHeadline}
              proofLine={proofLine}
              roleLabel={recommendation.roleLabel}
              activePlatforms={stage1Audit?.selectedPlatforms?.length ? stage1Audit.selectedPlatforms : recommendation.recommendedPlatforms}
              diagnosticGaps={stage1Audit?.diagnosticGaps}
              quizAnswers={stage1Audit?.quizAnswers}
              onUserNameChange={setUserName}
              onUserHandleChange={setUserHandle}
              onHeadlineChange={setPositioningHeadline}
              onProofLineChange={setProofLine}
              onBack={() => retreatSection(2)}
              onContinue={() => advanceSection(2)}
            />
          )}

          {activeSection === 3 && (
            <PlatformStudioSection
              profileSystem={profileSystem}
              userName={userName}
              userHandle={userHandle}
              activeTone={activeTone}
              roleLabel={recommendation.roleLabel}
              recommendedPlatforms={recommendation.recommendedPlatforms}
              onToneChange={setActiveTone}
              onUpdateField={(platform, fieldKey, value) => updateProfileField(platform as any, fieldKey, value)}
              onResetField={(platform, fieldKey) => resetProfileField(platform as any, fieldKey)}
              onBack={() => retreatSection(3)}
              onContinue={() => advanceSection(3)}
            />
          )}

          {activeSection === 4 && (
            <ConsistencyCheckSection
              profileSystem={profileSystem}
              activeTone={activeTone}
              onBack={() => retreatSection(4)}
              onContinue={() => advanceSection(4)}
            />
          )}

          {activeSection === 5 && (
            <DeployProofSection
              profileSystem={profileSystem}
              headline={positioningHeadline}
              proofLine={proofLine}
              uniqueMechanism={mod2UniqueMechanism || ''}
              userName={userName}
              userHandle={userHandle}
              activeTone={activeTone}
              initialScore={baselineScore}
              onBack={() => retreatSection(5)}
              onComplete={handleComplete}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

ProfileStrategySection.displayName = 'ProfileStrategySection';
