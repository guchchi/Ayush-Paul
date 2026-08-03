import { useEffect, useMemo, useState } from 'react';
import { useModule3Store } from '../../../lib/module3';
import { StepHeader } from '../../workspace/StepHeader';
import { StepActionArea } from '../../workspace/StepActionArea';
import { ModuleButton } from '../../workspace/ModuleButton';
import { Loader2 } from 'lucide-react';
import { generateFullAuthoritySuite, GeneratedAuthoritySuite } from '../../../data/module3/authority-suite-engine';
import { BrandIdentitySection } from './sections/BrandIdentitySection';
import { ProfileSystemSection } from './sections/ProfileSystemSection';
import { PortfolioArchitectureSection } from './sections/PortfolioArchitectureSection';
import { AuthorityContentEngineSection } from './sections/AuthorityContentEngineSection';
import { DynamicAuthorityScoreSection } from './sections/DynamicAuthorityScoreSection';
import { BeforeYouContinueChecklist } from './components/BeforeYouContinueChecklist';

export function Step3ProfilePortfolio() {
  const mod3State = useModule3Store();
  const approveStrategy = useModule3Store((s) => s.approveProfilePortfolioStrategy);
  const confirmStep = useModule3Store((s) => s.confirmStep);
  const nextStep = useModule3Store((s) => s.nextStep);
  const previousStep = useModule3Store((s) => s.previousStep);

  const [isChecklistComplete, setIsChecklistComplete] = useState(false);

  // Generate full master suite using store context
  const initialSuite = useMemo(() => {
    return generateFullAuthoritySuite({
      marketId: mod3State.mod1NicheId,
      serviceId: mod3State.mod1ServiceId,
      position: mod3State.authorityPosition,
      trustPromise: mod3State.coreTrustPromise,
      uniqueMechanism: mod3State.mod2UniqueMechanism,
      offerType: mod3State.mod2OfferType,
    });
  }, [
    mod3State.mod1NicheId,
    mod3State.mod1ServiceId,
    mod3State.authorityPosition,
    mod3State.coreTrustPromise,
    mod3State.mod2UniqueMechanism,
    mod3State.mod2OfferType,
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

  // Handler for toggling opportunity tasks (Score Booster)
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

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-500 pb-24 sm:pb-0 relative text-left">
      <StepHeader
        title="Authority Command Center & Workspace"
        description="Your living strategy workspace. Edit, refine, and copy real-world brand assets, multi-platform profile packages, 9-section portfolio blueprints, and your 30-day authority content matrix."
        step={{ current: 3, total: 3 }}
      />

      <div className="space-y-12">
        {/* Section 1: Brand Identity Engine (14 Copy-Ready Brand Assets) */}
        <BrandIdentitySection
          assets={suite.brandAssets}
          onAssetChange={handleBrandAssetChange}
          onAssetReset={handleBrandAssetReset}
        />

        {/* Section 2: Complete Multi-Platform Profile System */}
        <ProfileSystemSection
          packages={suite.profileSystem}
          onFieldChange={handleProfileFieldChange}
          onFieldReset={handleProfileFieldReset}
        />

        {/* Section 3: Portfolio Architecture Generator (9 Website Sections) */}
        <PortfolioArchitectureSection sections={suite.portfolioBlueprint} />

        {/* Section 4: 30-Day Authority Content Engine */}
        <AuthorityContentEngineSection posts={suite.contentCalendar} />

        {/* Section 5: Real-Time Dynamic Authority Score Engine */}
        <DynamicAuthorityScoreSection
          baseScore={76}
          opportunities={suite.opportunityMatrix}
          onToggleTask={handleToggleOpportunity}
        />

        <BeforeYouContinueChecklist onAllChecked={setIsChecklistComplete} />
      </div>

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
