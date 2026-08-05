import { useEffect, useMemo, useState } from 'react';
import { useModule3Store } from '../../../lib/module3';
import { StepHeader } from '../../workspace/StepHeader';
import { StepActionArea } from '../../workspace/StepActionArea';
import { ModuleButton } from '../../workspace/ModuleButton';
import { ChevronDown, ChevronUp, Sparkles, Check, Copy, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateFullAuthoritySuite, GeneratedAuthoritySuite, PortfolioBlueprintSection, computeUpstreamFingerprint, mergeAuthoritySuites } from '../../../data/module3/authority-suite-engine';
import { StickyWorkspaceHeader } from './components/StickyWorkspaceHeader';
import { ExecutiveHeroDashboard } from './components/ExecutiveHeroDashboard';
import { BuildModeWorkspace } from './components/BuildModeWorkspace';
import { BrandIdentitySection } from './sections/BrandIdentitySection';
import { ProfileStructureCanvas } from './sections/ProfileStructureCanvas';
import { PortfolioOrderingCanvas } from './sections/PortfolioOrderingCanvas';
import { BeforeYouContinueChecklist } from './components/BeforeYouContinueChecklist';
import { EASING, DURATION } from '../../../lib/motion-presets';

export function Step3ProfilePortfolio() {
  const mod3State = useModule3Store();
  const approveStrategy = useModule3Store((s) => s.approveProfilePortfolioStrategy);
  const confirmStep = useModule3Store((s) => s.confirmStep);
  const nextStep = useModule3Store((s) => s.nextStep);
  const previousStep = useModule3Store((s) => s.previousStep);

  const storedSuite = useModule3Store((s) => s.authoritySuite);
  const setAuthoritySuite = useModule3Store((s) => s.setAuthoritySuite);
  const updateBrandAsset = useModule3Store((s) => s.updateBrandAsset);
  const resetBrandAsset = useModule3Store((s) => s.resetBrandAsset);
  const updateProfileField = useModule3Store((s) => s.updateProfileField);
  const resetProfileField = useModule3Store((s) => s.resetProfileField);
  const updatePortfolioSection = useModule3Store((s) => s.updatePortfolioSection);
  const toggleOpportunityTask = useModule3Store((s) => s.toggleOpportunityTask);

  const [isChecklistComplete, setIsChecklistComplete] = useState(false);
  const [openSection, setOpenSection] = useState<'brand' | 'profile' | 'portfolio' | 'content' | 'all'>('brand');
  const [copyToast, setCopyToast] = useState<string | null>(null);

  // Generate default suite from context if not already stored
  const defaultSuite = useMemo(() => {
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

  // Sync to store on initial load or smart merge when upstream fingerprint changes
  useEffect(() => {
    if (!storedSuite) {
      setAuthoritySuite(defaultSuite);
    } else {
      const currentFingerprint = computeUpstreamFingerprint({
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

      if (storedSuite.upstreamFingerprint !== currentFingerprint) {
        const merged = mergeAuthoritySuites(storedSuite, defaultSuite);
        setAuthoritySuite(merged);
      }
    }
  }, [
    storedSuite,
    defaultSuite,
    setAuthoritySuite,
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

  // Master active suite (prefers persisted Zustand suite)
  const suite: GeneratedAuthoritySuite = storedSuite || defaultSuite;

  // Handlers tied to store persistence
  const handleBrandAssetChange = (assetId: string, newValue: string) => {
    updateBrandAsset(assetId, newValue);
  };

  const handleBrandAssetReset = (assetId: string) => {
    resetBrandAsset(assetId);
  };

  const handleProfileFieldChange = (platform: string, fieldKey: string, newValue: string) => {
    updateProfileField(platform, fieldKey, newValue);
  };

  const handleProfileFieldReset = (platform: string, fieldKey: string) => {
    resetProfileField(platform, fieldKey);
  };

  const handleSectionChange = (sectionId: string, updatedFields: Partial<PortfolioBlueprintSection>) => {
    updatePortfolioSection(sectionId, updatedFields);
  };

  const handleToggleTask = (taskId: string) => {
    toggleOpportunityTask(taskId);
  };

  // Build Mode Action A: Copy LinkedIn Profile Package
  const handleCopyLinkedInPackage = () => {
    const linkedInPkg = suite.profileSystem.find((p) => p.platform === 'linkedin');
    if (!linkedInPkg) return;

    const formattedText = linkedInPkg.fields
      .map((f) => `### ${f.label}\n${f.value}`)
      .join('\n\n');

    navigator.clipboard.writeText(formattedText);
    setCopyToast('LinkedIn Profile Package Copied to Clipboard!');
    setTimeout(() => setCopyToast(null), 3000);
  };

  // Build Mode Action B: Export Central Asset Vault
  const handleExportVault = () => {
    const brandText = suite.brandAssets.map((a) => `### ${a.title}\n${a.value}`).join('\n\n');

    const profileText = suite.profileSystem
      .map((p) => `## ${p.title}\n` + p.fields.map((f) => `**${f.label}:** ${f.value}`).join('\n\n'))
      .join('\n\n---\n\n');

    const portfolioText = suite.portfolioBlueprint
      .map((s) => `### ${s.title}\n**Headline:** ${s.headline}\n**Subheadline:** ${s.subheadline}\n**Body Copy:** ${s.bodyCopy}\n**CTA:** ${s.ctaText}`)
      .join('\n\n---\n\n');

    const contentText = suite.contentCalendar
      .map((c) => `### Day ${c.dayNumber} [${c.platform} - ${c.format}]\n**Hook:** "${c.hook}"\n**Body:** ${c.body}\n**CTA:** ${c.cta}`)
      .join('\n\n');

    const markdownDoc = `# AUTHORITY PACK — EXECUTIVE SUITE
*Generated & Customized via Module 3 Authority Engine*

# 1. BRAND IDENTITY ENGINE
${brandText}

---

# 2. VISUAL MULTI-PLATFORM PROFILE SYSTEM
${profileText}

---

# 3. PORTFOLIO ARCHITECTURE BLUEPRINT (9 SECTIONS)
${portfolioText}

---

# 4. 30-DAY AUTHORITY CONTENT ENGINE
${contentText}
`;

    const blob = new Blob([markdownDoc], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Authority-Pack.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCopyToast('Authority-Pack.md Downloaded!');
    setTimeout(() => setCopyToast(null), 3000);
  };

  const handleApprove = () => {
    approveStrategy();
    confirmStep();
    nextStep();
  };

  // Dynamic single-source authority metrics calculation
  const equippedCount = mod3State.availableAssets?.length || 0;
  const completedBonus = suite.opportunityMatrix.filter((o) => o.isCompleted).reduce((sum, o) => sum + o.authorityImpactPts, 0);
  const baseScore = Math.min(85, 70 + equippedCount * 4);
  const authorityScore = Math.min(100, baseScore + completedBonus);
  const readinessPercent = Math.min(100, Math.round(55 + equippedCount * 8 + (completedBonus > 0 ? 15 : 0) + (isChecklistComplete ? 15 : 0)));
  const progressPercent = Math.min(100, Math.round(60 + equippedCount * 5 + (completedBonus > 0 ? 15 : 0) + (isChecklistComplete ? 10 : 0)));

  const nextUncompletedOpp = suite.opportunityMatrix.find((o) => !o.isCompleted) || suite.opportunityMatrix[0];
  const nextActionTitle = nextUncompletedOpp ? nextUncompletedOpp.title : 'Deploy Hero & About Sections to Website Canvas';
  const nextActionImpact = nextUncompletedOpp ? nextUncompletedOpp.description : 'Increases buyer conversion by +15%';
  const estimatedScoreIncrease = nextUncompletedOpp ? nextUncompletedOpp.authorityImpactPts : 15;

  const handleScrollToNextWork = () => {
    const el = document.getElementById('workspace-sections');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-500 pb-24 sm:pb-0 relative text-left">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {copyToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-500/30 text-xs font-bold flex items-center gap-2"
          >
            <Check size={16} className="text-emerald-400" />
            <span>{copyToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Floating Sticky Workspace Header (Appears on scroll) */}
      <StickyWorkspaceHeader
        authorityScore={authorityScore}
        progressPercent={progressPercent}
        readinessPercent={readinessPercent}
        nextActionTitle={nextActionTitle}
        onOpenBuildMode={handleScrollToNextWork}
      />

      <StepHeader
        title="Profile & Portfolio Authority Structure"
        description="Define and sequence the exact structural architecture for your online profiles and 9-section portfolio website based on your proof strategy."
        step={{ current: 3, total: 3 }}
      />

      {/* 2. Executive Hero Dashboard Header (Single Authoritative Orientation Hub) */}
      <ExecutiveHeroDashboard
        authorityScore={authorityScore}
        progressPercent={progressPercent}
        readinessPercent={readinessPercent}
        nextActionTitle={nextActionTitle}
        nextActionImpact={nextActionImpact}
        estimatedScoreIncrease={estimatedScoreIncrease}
        onContinueBuilding={handleScrollToNextWork}
      />

      {/* 3. Progressive Disclosure Accordions Container */}
      <div id="workspace-sections" className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#0058be]" />
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0b1c30]">
              Structural Architecture Sections
            </h3>
          </div>
          <button
            onClick={() => setOpenSection(openSection === 'all' ? 'brand' : 'all')}
            className="text-xs font-bold text-blue-700 hover:underline cursor-pointer"
          >
            {openSection === 'all' ? 'Collapse All' : 'Expand All Sections'}
          </button>
        </div>

        {/* Accordion 1: Brand Identity & Positioning Foundations */}
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
                <h4 className="text-base font-black text-[#0b1c30]">1. Brand Identity Foundations (10 Core Statements)</h4>
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

        {/* Accordion 2: Public Profile Structural Architecture */}
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
                <h4 className="text-base font-black text-[#0b1c30]">2. Public Profile Structural Architecture</h4>
                <p className="text-xs text-neutral-500 font-medium">Component hierarchy for LinkedIn, X/Twitter, and Instagram profiles</p>
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
                <ProfileStructureCanvas
                  packages={suite.profileSystem}
                  onFieldChange={handleProfileFieldChange}
                  onFieldReset={handleProfileFieldReset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion 3: Portfolio Website Structural Ordering Canvas */}
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
                <h4 className="text-base font-black text-[#0b1c30]">3. Portfolio Website Structural Ordering Canvas</h4>
                <p className="text-xs text-neutral-500 font-medium">Interactive re-ordering and active status controls for 9 website sections</p>
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
                <PortfolioOrderingCanvas
                  sections={suite.portfolioBlueprint}
                  onSectionChange={handleSectionChange}
                  onReorderSections={(newSections) => {
                    setAuthoritySuite({
                      ...suite,
                      portfolioBlueprint: newSections,
                    });
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 4. Execution & Launch Hub (Contextual 1-Click Execution Bridges) */}
      <div id="build-mode-workspace" className="pt-2 border-t border-neutral-200/80">
        <BuildModeWorkspace
          onCopyLinkedInPackage={handleCopyLinkedInPackage}
          onExportVault={handleExportVault}
        />
      </div>

      {/* 5. Streamlined Launch Checklist */}
      <BeforeYouContinueChecklist onAllChecked={setIsChecklistComplete} />

      {/* 6. Action Footer Bar */}
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

