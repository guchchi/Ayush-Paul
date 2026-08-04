import { useEffect, useMemo, useState } from 'react';
import { useModule3Store } from '../../../lib/module3';
import { StepHeader } from '../../workspace/StepHeader';
import { StepActionArea } from '../../workspace/StepActionArea';
import { ModuleButton } from '../../workspace/ModuleButton';
import { ChevronDown, ChevronUp, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateFullAuthoritySuite, GeneratedAuthoritySuite } from '../../../data/module3/authority-suite-engine';
import { StickyWorkspaceHeader } from './components/StickyWorkspaceHeader';
import { ExecutiveHeroDashboard } from './components/ExecutiveHeroDashboard';
import { BuildModeWorkspace } from './components/BuildModeWorkspace';
import { MissionControlFooter } from './components/MissionControlFooter';
import { BrandIdentitySection } from './sections/BrandIdentitySection';
import { ProfileSystemSection } from './sections/ProfileSystemSection';
import { PortfolioArchitectureSection } from './sections/PortfolioArchitectureSection';
import { AuthorityContentEngineSection } from './sections/AuthorityContentEngineSection';
import { DynamicAuthorityScoreSection } from './sections/DynamicAuthorityScoreSection';
import { BeforeYouContinueChecklist } from './components/BeforeYouContinueChecklist';
import { EASING, DURATION } from '../../../lib/motion-presets';

export function Step3ProfilePortfolio() {
  const mod3State = useModule3Store();
  const approveStrategy = useModule3Store((s) => s.approveProfilePortfolioStrategy);
  const confirmStep = useModule3Store((s) => s.confirmStep);
  const nextStep = useModule3Store((s) => s.nextStep);
  const previousStep = useModule3Store((s) => s.previousStep);

  const [isChecklistComplete, setIsChecklistComplete] = useState(false);
  const [openSection, setOpenSection] = useState<'brand' | 'profile' | 'portfolio' | 'content' | 'score' | 'all'>('brand');

  // Master suite data
  const initialSuite = useMemo(() => {
    return generateFullAuthoritySuite({
      marketId: mod3State.mod1NicheId,
      serviceId: mod3State.mod1ServiceId,
      position: mod3State.authorityPosition,
      trustPromise: mod3State.coreTrustPromise,
      uniqueMechanism: mod3State.mod2UniqueMechanism,
      offerType: mod3State.mod2OfferType,
      proofContext: {
        availableAssets: mod3State.availableAssets || [],
        skippedAssets: mod3State.skippedAssets || [],
        existingProofInventory: mod3State.existingProofInventory || '',
        proofAssets: mod3State.proofAssets || [],
      },
    });
  }, [
    mod3State.mod1NicheId,
    mod3State.mod1ServiceId,
    mod3State.authorityPosition,
    mod3State.coreTrustPromise,
    mod3State.mod2UniqueMechanism,
    mod3State.mod2OfferType,
    mod3State.availableAssets,
    mod3State.skippedAssets,
    mod3State.existingProofInventory,
    mod3State.proofAssets,
  ]);

  const [suite, setSuite] = useState<GeneratedAuthoritySuite>(initialSuite);

  useEffect(() => {
    setSuite(initialSuite);
  }, [initialSuite]);

  // Handler for editing brand assets
  const handleBrandAssetChange = (assetId: string, newValue: string) => {
    setSuite((prev) => ({
      ...prev,
      brandAssets: prev.brandAssets.map((a) => (a.id === assetId ? { ...a, value: newValue, isCustomized: true } : a)),
    }));
  };

  const handleBrandAssetReset = (assetId: string) => {
    setSuite((prev) => ({
      ...prev,
      brandAssets: prev.brandAssets.map((a) => (a.id === assetId ? { ...a, value: a.originalValue, isCustomized: false } : a)),
    }));
  };

  // Handler for editing profile system fields
  const handleProfileFieldChange = (platform: string, fieldKey: string, newValue: string) => {
    setSuite((prev) => ({
      ...prev,
      profileSystem: prev.profileSystem.map((p) => {
        if (p.platform !== platform) return p;
        return {
          ...p,
          fields: p.fields.map((f) => (f.key === fieldKey ? { ...f, value: newValue } : f)),
        };
      }),
    }));
  };

  const handleProfileFieldReset = (platform: string, fieldKey: string) => {
    setSuite((prev) => ({
      ...prev,
      profileSystem: prev.profileSystem.map((p) => {
        if (p.platform !== platform) return p;
        return {
          ...p,
          fields: p.fields.map((f) => (f.key === fieldKey ? { ...f, value: f.originalValue } : f)),
        };
      }),
    }));
  };

  // Handler for toggling opportunity tasks
  const handleToggleOpportunity = (taskId: string) => {
    setSuite((prev) => ({
      ...prev,
      opportunityMatrix: prev.opportunityMatrix.map((o) => (o.id === taskId ? { ...o, isCompleted: !o.isCompleted } : o)),
    }));
  };

  const handleApprove = () => {
    approveStrategy();
    confirmStep();
    nextStep();
  };

  const handleScrollToBuildMode = () => {
    const el = document.getElementById('build-mode-workspace');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-500 pb-24 sm:pb-0 relative text-left">
      {/* 1. Floating Sticky Workspace Header (Appears on scroll) */}
      <StickyWorkspaceHeader
        authorityScore={88}
        progressPercent={68}
        readinessPercent={82}
        nextActionTitle="Deploy Website Hero Section"
        onOpenBuildMode={handleScrollToBuildMode}
      />

      <StepHeader
        title="Brand & Portfolio Generator"
        description="Package your positioning and proof assets into a market-ready public brand, visual profile packages, 9-section portfolio architecture, and 30-day content calendar."
        step={{ current: 3, total: 3 }}
      />

      {/* 2. Executive Hero Dashboard Header */}
      <ExecutiveHeroDashboard
        authorityScore={88}
        progressPercent={68}
        readinessPercent={82}
        nextActionTitle="Deploy Website Hero Section"
        nextActionImpact="Increases buyer conversion by +15%"
        estimatedScoreIncrease={8}
        onContinueBuilding={handleScrollToBuildMode}
      />

      {/* 3. Primary Build Mode Workspace Hub */}
      <div id="build-mode-workspace">
        <BuildModeWorkspace />
      </div>

      {/* 4. Progressive Disclosure Accordions Container */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#0058be]" />
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0b1c30]">
              Workspace Strategy Sections
            </h3>
          </div>
          <button
            onClick={() => setOpenSection(openSection === 'all' ? 'brand' : 'all')}
            className="text-xs font-bold text-blue-700 hover:underline cursor-pointer"
          >
            {openSection === 'all' ? 'Collapse All' : 'Expand All Sections'}
          </button>
        </div>

        {/* Accordion 1: Brand Identity Engine */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-2xs overflow-hidden">
          <button
            onClick={() => setOpenSection(openSection === 'brand' ? 'none' as any : 'brand')}
            className="w-full p-5 flex items-center justify-between text-left cursor-pointer hover:bg-neutral-50/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#0058be] text-xs font-black flex items-center justify-center border border-blue-100">
                01
              </span>
              <div>
                <h4 className="text-base font-black text-[#0b1c30]">1. Brand Identity Engine (14 Assets)</h4>
                <p className="text-xs text-neutral-500 font-medium">Positioning, Category, Value Prop, Elevator Pitch & Core Messaging</p>
              </div>
            </div>
            {openSection === 'brand' || openSection === 'all' ? <ChevronUp size={18} className="text-neutral-400" /> : <ChevronDown size={18} className="text-neutral-400" />}
          </button>

          <AnimatePresence>
            {(openSection === 'brand' || openSection === 'all') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
                className="p-6 border-t border-neutral-100 bg-neutral-50/40 space-y-6"
              >
                <BrandIdentitySection
                  assets={suite.brandAssets}
                  onAssetChange={handleBrandAssetChange}
                  onAssetReset={handleBrandAssetReset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion 2: Visual Profile System */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-2xs overflow-hidden">
          <button
            onClick={() => setOpenSection(openSection === 'profile' ? 'none' as any : 'profile')}
            className="w-full p-5 flex items-center justify-between text-left cursor-pointer hover:bg-neutral-50/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-black flex items-center justify-center border border-indigo-100">
                02
              </span>
              <div>
                <h4 className="text-base font-black text-[#0b1c30]">2. Visual Multi-Platform Profile System</h4>
                <p className="text-xs text-neutral-500 font-medium">LinkedIn, X/Twitter, Instagram, and Website Hero device previews</p>
              </div>
            </div>
            {openSection === 'profile' || openSection === 'all' ? <ChevronUp size={18} className="text-neutral-400" /> : <ChevronDown size={18} className="text-neutral-400" />}
          </button>

          <AnimatePresence>
            {(openSection === 'profile' || openSection === 'all') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
                className="p-6 border-t border-neutral-100 bg-neutral-50/40 space-y-6"
              >
                <ProfileSystemSection
                  packages={suite.profileSystem}
                  onFieldChange={handleProfileFieldChange}
                  onFieldReset={handleProfileFieldReset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion 3: Portfolio Architecture */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-2xs overflow-hidden">
          <button
            onClick={() => setOpenSection(openSection === 'portfolio' ? 'none' as any : 'portfolio')}
            className="w-full p-5 flex items-center justify-between text-left cursor-pointer hover:bg-neutral-50/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-800 text-xs font-black flex items-center justify-center border border-cyan-100">
                03
              </span>
              <div>
                <h4 className="text-base font-black text-[#0b1c30]">3. Portfolio Architecture Generator (9 Website Sections)</h4>
                <p className="text-xs text-neutral-500 font-medium">Hero to Final CTA wireframe blueprint & copy spec</p>
              </div>
            </div>
            {openSection === 'portfolio' || openSection === 'all' ? <ChevronUp size={18} className="text-neutral-400" /> : <ChevronDown size={18} className="text-neutral-400" />}
          </button>

          <AnimatePresence>
            {(openSection === 'portfolio' || openSection === 'all') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
                className="p-6 border-t border-neutral-100 bg-neutral-50/40 space-y-6"
              >
                <PortfolioArchitectureSection sections={suite.portfolioBlueprint} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion 4: 30-Day Content Engine */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-2xs overflow-hidden">
          <button
            onClick={() => setOpenSection(openSection === 'content' ? 'none' as any : 'content')}
            className="w-full p-5 flex items-center justify-between text-left cursor-pointer hover:bg-neutral-50/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 text-xs font-black flex items-center justify-center border border-amber-100">
                04
              </span>
              <div>
                <h4 className="text-base font-black text-[#0b1c30]">4. 30-Day Authority Content Engine</h4>
                <p className="text-xs text-neutral-500 font-medium">30 pre-structured post blueprints across 4 weeks</p>
              </div>
            </div>
            {openSection === 'content' || openSection === 'all' ? <ChevronUp size={18} className="text-neutral-400" /> : <ChevronDown size={18} className="text-neutral-400" />}
          </button>

          <AnimatePresence>
            {(openSection === 'content' || openSection === 'all') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
                className="p-6 border-t border-neutral-100 bg-neutral-50/40 space-y-6"
              >
                <AuthorityContentEngineSection posts={suite.contentCalendar} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion 5: Dynamic Authority Score */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-2xs overflow-hidden">
          <button
            onClick={() => setOpenSection(openSection === 'score' ? 'none' as any : 'score')}
            className="w-full p-5 flex items-center justify-between text-left cursor-pointer hover:bg-neutral-50/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-black flex items-center justify-center border border-emerald-100">
                05
              </span>
              <div>
                <h4 className="text-base font-black text-[#0b1c30]">5. Real-Time Dynamic Authority Score Engine</h4>
                <p className="text-xs text-neutral-500 font-medium">Live score recalculation & interactive task roadmap</p>
              </div>
            </div>
            {openSection === 'score' || openSection === 'all' ? <ChevronUp size={18} className="text-neutral-400" /> : <ChevronDown size={18} className="text-neutral-400" />}
          </button>

          <AnimatePresence>
            {(openSection === 'score' || openSection === 'all') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
                className="p-6 border-t border-neutral-100 bg-neutral-50/40 space-y-6"
              >
                <DynamicAuthorityScoreSection
                  baseScore={76}
                  opportunities={suite.opportunityMatrix}
                  onToggleTask={handleToggleOpportunity}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <BeforeYouContinueChecklist onAllChecked={setIsChecklistComplete} />

      {/* 5. End-of-Page Mission Control Continuation Engine */}
      <MissionControlFooter
        progressPercent={68}
        readinessPercent={82}
        onBuildNow={handleScrollToBuildMode}
      />

      {/* Action Footer Bar */}
      <div className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-4 -mx-4 sm:mx-0 sm:p-0 sm:bg-transparent sm:border-0 sm:relative z-20">
        <StepActionArea className="flex-col sm:flex-row gap-4 sm:gap-0 pt-0 sm:pt-4 border-0 sm:border-t sm:border-neutral-200">
          <div className="flex items-center justify-between w-full sm:w-auto space-x-3">
            <ModuleButton variant="secondary" onClick={previousStep} className="flex-1 sm:flex-none justify-center">
              Back
            </ModuleButton>
          </div>
          <ModuleButton
            onClick={handleApprove}
            disabled={!isChecklistComplete}
            className="w-full sm:w-auto justify-center mt-3 sm:mt-0 px-6 py-3"
          >
            Generate My Authority Operating System →
          </ModuleButton>
        </StepActionArea>
      </div>
    </div>
  );
}
