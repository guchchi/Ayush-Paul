import React, { useEffect, useState } from 'react';
import { ShieldCheck, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { useModule3Store } from '../../../lib/module3/store';
import { generateProfilePortfolioAuthorityBlueprint } from '../../../data/module3/authority-strategy-engine';
import { AuthorityFoundationSection } from './sections/1_AuthorityFoundationSection';
import { ProfilePositioningSection } from './sections/2_ProfilePositioningSection';
import { PortfolioStructureSection } from './sections/3_PortfolioStructureSection';
import { SectionPrioritiesSection } from './sections/4_SectionPrioritiesSection';
import { EvidencePlacementSection } from './sections/5_EvidencePlacementSection';
import { PresentationStrategySection } from './sections/6_PresentationStrategySection';
import { AuthorityReinforcementSection } from './sections/7_AuthorityReinforcementSection';
import { NextMovesActionPlanSection } from './sections/8_NextMovesActionPlanSection';
import { MasterBlueprintViewer } from './components/MasterBlueprintViewer';
import { StepHeader } from '../../workspace/StepHeader';

export const Step3ProfilePortfolioAuthority: React.FC = () => {
  const mod3State = useModule3Store();
  const { authorityBlueprint, setAuthorityBlueprint, isUpstreamStale } = mod3State;

  const [activeTab, setActiveTab] = useState<number>(1);
  const [staleDismissed, setStaleDismissed] = useState(false);

  // Initialize or generate blueprint if missing
  useEffect(() => {
    if (!authorityBlueprint) {
      const generated = generateProfilePortfolioAuthorityBlueprint(mod3State);
      setAuthorityBlueprint(generated);
    }
  }, [authorityBlueprint, mod3State, setAuthorityBlueprint]);

  const blueprint = authorityBlueprint || generateProfilePortfolioAuthorityBlueprint(mod3State);

  const handleProceedToStep4 = () => {
    useModule3Store.setState((s) => ({
      currentStep: 'authority_pack',
      completedSteps: Array.from(new Set([...s.completedSteps, 'profile_portfolio'])),
      lastUpdated: Date.now(),
    }));
  };

  const handleRegenerateBlueprint = () => {
    const fresh = generateProfilePortfolioAuthorityBlueprint(mod3State);
    setAuthorityBlueprint(fresh);
    setStaleDismissed(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 px-4">
      {/* Workspace Step Header matching Step 1 & 2 standard */}
      <StepHeader
        step={{ current: 3, total: 4 }}
        title="Profile & Portfolio Authority Strategy"
        description="Transform your Step 1 positioning and Step 2 proof strategy into a clear, credible, and coherent profile + portfolio structure that moves prospects from curiosity to conviction."
      />

      {/* Upstream Stale Context Alert Banner */}
      {isUpstreamStale && !staleDismissed && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">Upstream Positioning Updated</h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Your Step 1 Authority Position or Step 2 Proof Strategy was modified. Your custom decision overrides are preserved.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setStaleDismissed(true)}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              Keep Existing Overrides
            </button>
            <button
              onClick={handleRegenerateBlueprint}
              className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white cursor-pointer shadow-xs flex items-center gap-1.5 font-mono"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Re-evaluate Strategy
            </button>
          </div>
        </div>
      )}

      {/* 7 Strategic Section Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200/80">
        {[
          { id: 1, label: '1. Foundation' },
          { id: 2, label: '2. Profile Strategy' },
          { id: 3, label: '3. Portfolio Structure' },
          { id: 4, label: '4. Priorities' },
          { id: 5, label: '5. Evidence Placement' },
          { id: 6, label: '6. Narrative Flow' },
          { id: 7, label: '7. Alignment Audit' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap border cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#0058be] text-white border-[#0058be] shadow-sm'
                : 'bg-white text-[#424754] border-slate-200/80 hover:bg-[#eff4ff]/60 hover:text-[#0058be]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Rendering Container */}
      <div className="p-6 rounded-2xl bg-[#f8f9ff] border border-slate-200/80 min-h-[420px] shadow-xs">
        {activeTab === 1 && <AuthorityFoundationSection blueprint={blueprint} />}
        {activeTab === 2 && <ProfilePositioningSection blueprint={blueprint} />}
        {activeTab === 3 && <PortfolioStructureSection blueprint={blueprint} />}
        {activeTab === 4 && <SectionPrioritiesSection blueprint={blueprint} />}
        {activeTab === 5 && <EvidencePlacementSection blueprint={blueprint} />}
        {activeTab === 6 && <PresentationStrategySection blueprint={blueprint} />}
        {activeTab === 7 && <AuthorityReinforcementSection blueprint={blueprint} />}
      </div>

      {/* Master Authority Blueprint Output Viewer */}
      <MasterBlueprintViewer blueprint={blueprint} />

      {/* Tactical Next Moves Action Plan (Outside the 7 Strategic Sections) */}
      <NextMovesActionPlanSection blueprint={blueprint} />

      {/* Handoff Footer: Step 4 Authority Operating System */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <h4 className="text-base font-bold text-[#0b1c30]">Step 3 Strategy Complete</h4>
          <p className="text-xs text-[#424754] mt-0.5">
            Your Profile & Portfolio Authority Blueprint is saved and ready for execution in Step 4.
          </p>
        </div>

        <button
          onClick={handleProceedToStep4}
          className="flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl bg-[#0058be] hover:bg-[#004395] text-white shadow-sm transition-all font-mono cursor-pointer"
        >
          Proceed to Step 4: Authority Operating System
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
