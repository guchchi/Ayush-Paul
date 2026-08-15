/**
 * ProfileStrategySection.tsx — Stage 1 Orchestrator
 * 
 * Manages the 5-section wizard flow for Social Profile Identity Studio.
 * Step-by-step navigation: Authority Audit → Identity Foundation → Platform Studio → Consistency Check → Deploy & Proof.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../../../lib/utils';
import { EASING, DURATION } from '../../../../lib/motion-presets';
import { useModule3Store } from '../../../../lib/module3/store';
import { calculateAuthorityScore } from '../../../../lib/module3/authority-score-engine';
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
  { id: 1, label: 'Authority Audit', shortLabel: 'Audit', icon: Shield, desc: 'Dekh tu kahan hai' },
  { id: 2, label: 'Identity Foundation', shortLabel: 'Identity', icon: Target, desc: 'Base set kar' },
  { id: 3, label: 'Platform Studio', shortLabel: 'Studio', icon: Monitor, desc: 'Platforms optimize kar' },
  { id: 4, label: 'Consistency Check', shortLabel: 'Check', icon: Eye, desc: 'Cross-check kar' },
  { id: 5, label: 'Deploy & Proof', shortLabel: 'Deploy', icon: Rocket, desc: 'Deploy kar, result dekh' },
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
  const { authoritySuite, updateProfileField, resetProfileField, mod1ServiceId, mod1CareerTrackId, mod2UniqueMechanism } = useModule3Store();

  // Wizard state
  const [activeSection, setActiveSection] = useState(1);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());

  // Identity state
  const [userName, setUserName] = useState('Alex Rivers');
  const [userHandle, setUserHandle] = useState('alexrivers');
  const [positioningHeadline, setPositioningHeadline] = useState('');
  const [proofLine, setProofLine] = useState('');
  const [activeTone, setActiveTone] = useState<'executive' | 'conversion' | 'direct'>('executive');

  // Initial score capture (frozen at Section 1 entry for Before/After comparison)
  const [initialScore, setInitialScore] = useState<number | null>(null);

  const recommendation = useMemo(
    () => getRoleRecommendation(mod1ServiceId, mod1CareerTrackId),
    [mod1ServiceId, mod1CareerTrackId]
  );

  const profileSystem = authoritySuite?.profileSystem || [];

  // Auto-set headline from profileSystem on first render
  useMemo(() => {
    if (positioningHeadline === '' && profileSystem.length > 0) {
      const firstHeadline = profileSystem[0]?.fields.find(f => f.key.includes('headline') || f.key.includes('hero'));
      if (firstHeadline) setPositioningHeadline(firstHeadline.value);
    }
  }, [profileSystem]);

  // Capture initial score on first render
  useMemo(() => {
    if (initialScore === null && profileSystem.length > 0) {
      const score = calculateAuthorityScore({
        profileSystem,
        headline: positioningHeadline,
        proofLine,
        uniqueMechanism: mod2UniqueMechanism || '',
        userName,
        userHandle,
        activeTone,
      });
      setInitialScore(score.total);
    }
  }, [profileSystem]);

  const advanceSection = useCallback((currentId: number) => {
    setCompletedSections(prev => new Set([...prev, currentId]));
    if (currentId < 5) {
      setActiveSection(currentId + 1);
    }
  }, []);

  const handleComplete = useCallback(() => {
    setCompletedSections(prev => new Set([...prev, 5]));
    onContinue();
  }, [onContinue]);

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
      {/* Step Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
        className="p-4 rounded-3xl border border-neutral-200 bg-white shadow-xs"
      >
        <div className="flex items-center justify-between gap-1">
          {SECTIONS.map((section, idx) => {
            const isActive = activeSection === section.id;
            const isCompleted = completedSections.has(section.id);
            const isPast = section.id < activeSection;
            const Icon = section.icon;

            return (
              <React.Fragment key={section.id}>
                <button
                  onClick={() => {
                    if (isCompleted || isPast || section.id <= activeSection) {
                      setActiveSection(section.id);
                    }
                  }}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer flex-1 min-w-0',
                    isActive
                      ? 'bg-[#0058be] text-white shadow-md'
                      : isCompleted || isPast
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-neutral-50 text-neutral-400 border border-neutral-200'
                  )}
                >
                  {isCompleted ? (
                    <Check size={14} className="shrink-0 stroke-[3]" />
                  ) : (
                    <Icon size={14} className="shrink-0" />
                  )}
                  <span className="text-[10px] font-bold truncate hidden sm:block">{section.shortLabel}</span>
                </button>
                {idx < SECTIONS.length - 1 && (
                  <div className={cn(
                    'w-4 h-0.5 rounded-full shrink-0',
                    section.id < activeSection ? 'bg-emerald-300' : 'bg-neutral-200'
                  )} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </motion.div>

      {/* Section Title */}
      <div className="space-y-1 px-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0058be]">
          {SECTIONS[activeSection - 1].label}
        </span>
        <p className="text-xs text-neutral-400 font-medium">
          {SECTIONS[activeSection - 1].desc}
        </p>
      </div>

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
              onUserNameChange={setUserName}
              onUserHandleChange={setUserHandle}
              onHeadlineChange={setPositioningHeadline}
              onProofLineChange={setProofLine}
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
              onContinue={() => advanceSection(3)}
            />
          )}

          {activeSection === 4 && (
            <ConsistencyCheckSection
              profileSystem={profileSystem}
              activeTone={activeTone}
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
              initialScore={initialScore ?? 0}
              onComplete={handleComplete}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

ProfileStrategySection.displayName = 'ProfileStrategySection';
