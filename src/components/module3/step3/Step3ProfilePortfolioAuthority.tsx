import React, { useEffect, useState } from 'react';
import { ShieldCheck, Sparkles, AlertTriangle, ArrowRight, CheckCircle2, LayoutGrid, UserCheck, Rocket, FileText, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { useModule3Store } from '../../../lib/module3/store';
import { generateProfilePortfolioAuthorityBlueprint } from '../../../data/module3/authority-strategy-engine';
import { StepHeader } from '../../workspace/StepHeader';

export const Step3ProfilePortfolioAuthority: React.FC = () => {
  const mod3State = useModule3Store();
  const {
    authorityBlueprint,
    setAuthorityBlueprint,
    isUpstreamStale,
    reorderBlueprintPortfolioSection,
    toggleBlueprintPortfolioSection,
    acceptBlueprintRecommendation,
    updateMessageLayer,
    toggleNextMoveItem,
  } = mod3State;

  const [activeStage, setActiveStage] = useState<number>(1);
  const [staleDismissed, setStaleDismissed] = useState(false);
  const [editingLayerKey, setEditingLayerKey] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  // Initialize or generate blueprint if missing
  useEffect(() => {
    if (!authorityBlueprint) {
      const generated = generateProfilePortfolioAuthorityBlueprint(mod3State);
      setAuthorityBlueprint(generated);
    }
  }, [authorityBlueprint, mod3State, setAuthorityBlueprint]);

  const blueprint = authorityBlueprint || generateProfilePortfolioAuthorityBlueprint(mod3State);
  const { decisionSummary, profilePositioning, portfolioStructure, evidencePlacements, alignmentAudit, nextMoves, foundation } = blueprint;

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

  const handleSaveLayerEdit = (layerKey: string) => {
    updateMessageLayer(layerKey, editingText);
    setEditingLayerKey(null);
  };

  const completedNextMoves = nextMoves.filter((m) => m.isCompleted).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 px-4">
      {/* Standard Step Header */}
      <StepHeader
        step={{ current: 3, total: 4 }}
        title="Profile & Portfolio Authority Strategy"
        description="We've analyzed your positioning and proof assets. Follow these 3 simple stages to establish how your public profile and portfolio should be structured to build instant trust."
      />

      {/* Upstream Stale Context Alert Banner */}
      {isUpstreamStale && !staleDismissed && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">Upstream Positioning Updated</h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Your Step 1 Authority Position or Step 2 Proof Strategy was modified. Your custom overrides are preserved.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setStaleDismissed(true)}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              Keep Overrides
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

      {/* Simplified 3-Stage Progress Stepper */}
      <div className="p-2 rounded-2xl bg-[#f8f9ff] border border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-2">
        <button
          onClick={() => setActiveStage(1)}
          className={`p-3.5 rounded-xl text-left transition-all cursor-pointer border ${
            activeStage === 1
              ? 'bg-white border-[#0058be] shadow-sm text-[#0b1c30]'
              : 'bg-transparent border-transparent hover:bg-white/60 text-[#424754]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0058be]">Stage 1 of 3</span>
            {activeStage > 1 && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          </div>
          <div className="text-sm font-bold">1. Profile Architecture</div>
          <div className="text-xs text-slate-500 mt-0.5">What to communicate on LinkedIn / X</div>
        </button>

        <button
          onClick={() => setActiveStage(2)}
          className={`p-3.5 rounded-xl text-left transition-all cursor-pointer border ${
            activeStage === 2
              ? 'bg-white border-[#0058be] shadow-sm text-[#0b1c30]'
              : 'bg-transparent border-transparent hover:bg-white/60 text-[#424754]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0058be]">Stage 2 of 3</span>
            {activeStage > 2 && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          </div>
          <div className="text-sm font-bold">2. Portfolio Journey</div>
          <div className="text-xs text-slate-500 mt-0.5">Section sequence & proof placement</div>
        </button>

        <button
          onClick={() => setActiveStage(3)}
          className={`p-3.5 rounded-xl text-left transition-all cursor-pointer border ${
            activeStage === 3
              ? 'bg-white border-[#0058be] shadow-sm text-[#0b1c30]'
              : 'bg-transparent border-transparent hover:bg-white/60 text-[#424754]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0058be]">Stage 3 of 3</span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
              Final Output
            </span>
          </div>
          <div className="text-sm font-bold">3. Blueprint & Action Plan</div>
          <div className="text-xs text-slate-500 mt-0.5">Review master strategy & next moves</div>
        </button>
      </div>

      {/* STAGE 1: PROFILE ARCHITECTURE */}
      {activeStage === 1 && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-[#0058be] font-mono text-xs uppercase tracking-wider font-semibold">
              <UserCheck className="w-4 h-4" />
              Stage 1 — Profile Message Hierarchy
            </div>
            <h3 className="text-xl font-bold text-[#0b1c30]">How Your Public Profile Should Be Structured</h3>
            <p className="text-sm text-[#424754] leading-relaxed">
              When a prospect lands on your profile, they form an opinion in 5 seconds. Here is the exact strategic sequence your profile should follow:
            </p>

            {/* Profile Hierarchy Cards */}
            <div className="space-y-3 pt-2">
              {profilePositioning.map((layer) => (
                <div
                  key={layer.layerKey}
                  className={`p-4 rounded-xl border transition-all ${
                    layer.status === 'accepted'
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : layer.status === 'adjusted'
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-[#f8f9ff] border-slate-200/80 hover:border-[#0058be]/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#0b1c30]">{layer.layerTitle}</h4>
                        <span className="text-[10px] font-mono uppercase bg-white text-[#0058be] font-bold px-2 py-0.5 rounded border border-slate-200">
                          {layer.perceptionTarget}
                        </span>
                      </div>

                      {editingLayerKey === layer.layerKey ? (
                        <div className="mt-2 space-y-2">
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            rows={2}
                            className="w-full bg-white border border-[#0058be]/40 rounded-lg p-2.5 text-xs text-[#0b1c30] focus:outline-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveLayerEdit(layer.layerKey)}
                              className="text-xs font-semibold px-3 py-1 rounded bg-[#0058be] text-white cursor-pointer"
                            >
                              Save Tweak
                            </button>
                            <button
                              onClick={() => setEditingLayerKey(null)}
                              className="text-xs text-slate-500 px-2 py-1 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-[#424754] font-medium leading-relaxed">
                          {layer.userCustomization || layer.recommendedFocus}
                        </p>
                      )}

                      <div className="pt-1 text-[11px] font-mono text-slate-500">
                        <strong className="text-[#0058be]">Why:</strong> {layer.strategicRationale}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {layer.status !== 'accepted' && (
                        <button
                          onClick={() => acceptBlueprintRecommendation('profilePositioning', layer.layerKey)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setEditingLayerKey(layer.layerKey);
                          setEditingText(layer.userCustomization || layer.recommendedFocus);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setActiveStage(2)}
                className="flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl bg-[#0058be] hover:bg-[#004395] text-white shadow-sm font-mono cursor-pointer"
              >
                Approve Profile & Proceed to Portfolio Journey →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: PORTFOLIO JOURNEY & PROOF PLACEMENT */}
      {activeStage === 2 && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-[#0058be] font-mono text-xs uppercase tracking-wider font-semibold">
              <LayoutGrid className="w-4 h-4" />
              Stage 2 — Guided Portfolio Sequence & Evidence Placement
            </div>
            <h3 className="text-xl font-bold text-[#0b1c30]">Your Portfolio Layout & Evidence Flow</h3>
            <p className="text-sm text-[#424754] leading-relaxed">
              Here is the recommended section sequence for your portfolio website. Evidence and proof are placed early to satisfy buyer skepticism before presenting offers or prices.
            </p>

            {/* Reorderable Section Stack */}
            <div className="space-y-3 pt-2">
              {portfolioStructure.map((sec, idx) => (
                <div
                  key={sec.id}
                  className={`p-4 rounded-xl border transition-all ${
                    !sec.isEnabled
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : sec.status === 'accepted'
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-[#f8f9ff] border-slate-200/80 hover:border-[#0058be]/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#0058be]/10 text-[#0058be] font-mono text-xs font-bold border border-[#0058be]/20 shrink-0">
                        0{sec.position}
                      </span>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#0b1c30]">{sec.sectionTitle}</h4>
                          <span className="text-[10px] font-mono uppercase bg-white text-[#0058be] font-bold px-2 py-0.5 rounded border border-slate-200">
                            {sec.structuralRole}
                          </span>
                        </div>

                        <p className="text-xs text-[#424754] leading-relaxed">{sec.conversionRationale}</p>

                        <div className="pt-1 text-[11px] font-mono text-slate-500">
                          <strong className="text-[#0058be]">Visitor Mindset:</strong> "{sec.visitorMindset}"
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {sec.status !== 'accepted' && (
                        <button
                          onClick={() => acceptBlueprintRecommendation('portfolioStructure', sec.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve
                        </button>
                      )}

                      <button
                        onClick={() => toggleBlueprintPortfolioSection(sec.id)}
                        className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                          sec.isEnabled
                            ? 'bg-slate-100 text-[#0b1c30] border-slate-200 hover:bg-slate-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {sec.isEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      <div className="flex flex-col gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => reorderBlueprintPortfolioSection(idx, idx - 1)}
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-[#0b1c30] disabled:opacity-30 border border-slate-200 cursor-pointer"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          disabled={idx === portfolioStructure.length - 1}
                          onClick={() => reorderBlueprintPortfolioSection(idx, idx + 1)}
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-[#0b1c30] disabled:opacity-30 border border-slate-200 cursor-pointer"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contextual Evidence Placement Table */}
            <div className="pt-4 space-y-3">
              <h4 className="text-sm font-bold text-[#0b1c30] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0058be]" />
                Where Your Step 2 Proof Assets Should Appear:
              </h4>

              <div className="space-y-2">
                {evidencePlacements.map((e) => (
                  <div key={e.id} className="p-3 rounded-xl bg-[#f8f9ff] border border-slate-200/80 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[#0058be] font-bold">Claim:</span> "{e.claim}"
                      <div className="text-slate-500 text-[11px] font-sans">Proof: {e.proofTitle}</div>
                    </div>
                    <span className="text-emerald-700 font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-[11px]">
                      → Place in: {e.recommendedPlacement}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setActiveStage(3)}
                className="flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl bg-[#0058be] hover:bg-[#004395] text-white shadow-sm font-mono cursor-pointer"
              >
                Approve Portfolio Layout & View Final Blueprint →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: MASTER BLUEPRINT & NEXT MOVES */}
      {activeStage === 3 && (
        <div className="space-y-6">
          {/* Executive Decision Summary */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-[#0058be] font-mono text-xs uppercase tracking-wider font-semibold">
              <FileText className="w-4 h-4" />
              Stage 3 — Executive Strategy Blueprint
            </div>
            <h3 className="text-xl font-bold text-[#0b1c30]">Your Master Profile & Portfolio Blueprint</h3>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#f8f9ff] border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5">POSITIONING CLAIM</span>
                <span className="text-[#0b1c30] font-bold">{decisionSummary.positioningClaim}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8f9ff] border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5">PRIMARY PROOF ANCHOR</span>
                <span className="text-emerald-700 font-bold">{decisionSummary.strongestProofAnchor}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8f9ff] border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5">ALIGNMENT VERDICT</span>
                <span className="text-[#0058be] font-bold">{alignmentAudit.overallVerdict}</span>
              </div>
            </div>
          </div>

          {/* Next Moves Action Plan */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#0058be] font-mono text-xs uppercase tracking-wider font-semibold">
                <Rocket className="w-4 h-4" />
                Action Plan — Your Next Moves
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {completedNextMoves} / {nextMoves.length} Completed
              </span>
            </div>

            <div className="space-y-2">
              {nextMoves.map((m) => (
                <div
                  key={m.id}
                  onClick={() => toggleNextMoveItem(m.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    m.isCompleted
                      ? 'bg-emerald-50/60 border-emerald-200 opacity-80'
                      : 'bg-[#f8f9ff] border-slate-200 hover:border-[#0058be]/30'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={m.isCompleted}
                    onChange={() => {}}
                    className="mt-1 accent-[#0058be] cursor-pointer"
                  />
                  <div className="space-y-0.5">
                    <h4 className={`text-sm font-bold ${m.isCompleted ? 'line-through text-slate-400' : 'text-[#0b1c30]'}`}>
                      0{m.stepNumber}. {m.title}
                    </h4>
                    <p className="text-xs text-[#424754]">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Handoff Footer to Step 4 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div>
              <h4 className="text-base font-bold text-[#0b1c30]">Blueprint Locked & Saved</h4>
              <p className="text-xs text-[#424754] mt-0.5">
                Ready to generate your complete Authority Pack assets in Step 4.
              </p>
            </div>

            <button
              onClick={handleProceedToStep4}
              className="flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl bg-[#0058be] hover:bg-[#004395] text-white shadow-sm transition-all font-mono cursor-pointer"
            >
              Lock Blueprint & Proceed to Step 4: Authority Operating System
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
