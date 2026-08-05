import React, { useEffect, useState } from 'react';
import { ShieldCheck, Sparkles, AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
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

export const Step3ProfilePortfolioAuthority: React.FC = () => {
  const mod3State = useModule3Store();
  const { authorityBlueprint, setAuthorityBlueprint, isUpstreamStale, currentStep } = mod3State;

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
      {/* Workspace Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-indigo-400">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          Module 3 — Step 3 Strategic Workspace
        </div>
        <h2 className="text-2xl font-bold text-slate-100">Profile & Portfolio Authority Strategy</h2>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Transform your Step 1 positioning and Step 2 proof strategy into a clear, credible, and coherent profile + portfolio structure that moves prospects from curiosity to conviction.
        </p>
      </div>

      {/* Upstream Stale Context Alert Banner */}
      {isUpstreamStale && !staleDismissed && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-200">Upstream Positioning Updated</h4>
              <p className="text-xs text-amber-300/80 mt-0.5">
                Your Step 1 Authority Position or Step 2 Proof Strategy was modified. Your custom decision overrides are preserved.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setStaleDismissed(true)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-mono"
            >
              Keep Existing Overrides
            </button>
            <button
              onClick={handleRegenerateBlueprint}
              className="text-xs px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold font-mono flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Re-evaluate Strategy
            </button>
          </div>
        </div>
      )}

      {/* 7 Strategic Section Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
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
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap border ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-950/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Rendering */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 min-h-[420px]">
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
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/60 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <h4 className="text-base font-bold text-slate-100">Step 3 Strategy Complete</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Your Profile & Portfolio Authority Blueprint is saved and ready for execution in Step 4.
          </p>
        </div>

        <button
          onClick={handleProceedToStep4}
          className="flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-950/50 transition-all font-mono"
        >
          Proceed to Step 4: Authority Operating System
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
