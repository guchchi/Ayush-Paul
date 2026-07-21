import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowLeft, ArrowRight, Check, AlertTriangle, Layout, Target, CheckCircle2, ShieldAlert, Award, FileText, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';
import { useModule3Store } from '../../lib/module3';
import { classifyService } from '../../data/module3/service-taxonomy';
import { AVAILABLE_TEMPLATES } from '../../data/module3/credibility-rules';
import { resolveProofPriorities } from '../../data/module3/proof-priorities';
import { generateProofAsset } from '../../data/module3/proof-assets';
import { StepHeader } from '../workspace/StepHeader';
import { StepActionArea } from '../workspace/StepActionArea';
import { ModuleButton } from '../workspace/ModuleButton';

const getAssetLabel = (id: string): string => {
  const labels: Record<string, string> = {
    github_code: "Public GitHub Codebase",
    live_website: "Live Production Site",
    figma_portfolio: "Figma Design Space",
    design_case_study: "UX Case Study",
    showreel: "Video Showreel",
    before_after_edits: "Before/After Video Comparison",
    live_automation: "Live Make/n8n Automation",
    workflow_diagram: "Workflow System Diagram",
    testimonials: "Client Testimonials",
    client_work: "Client Project Deliverables",
    case_studies: "Business Case Studies",
    portfolio_projects: "Personal Projects Portfolio",
    metrics_results: "Analytics Metrics & Results",
    technical_blog: "Technical Article / Blog",
    behance_dribbble: "Behance / Dribbble Space",
    design_system: "UI Design System",
    interactive_prototype: "Interactive Prototype",
    user_flow: "User Flow Blueprint",
    design_process: "Design Process Log",
    design_critique: "Design Critique Audit",
    automation_code: "Automation Code/Scripts",
    process_walkthrough: "Process Walkthrough",
    landing_pages: "Landing Page Copy",
    email_sequence: "Email Copy Sequence",
    sales_page: "Sales Page Copy",
    ad_copies: "Ad Creatives Copy",
    conversion_metrics: "Conversion Analytics",
    swipe_file: "Copywriting Swipe File",
    content_samples: "Writing Samples",
  };
  return labels[id] || id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

export function Step2ProofAssetBuilder() {
  const authorityProfile = useModule3Store((s) => s.authorityProfile);
  const mod1CareerTrackId = useModule3Store((s) => s.mod1CareerTrackId);
  const mod1ServiceId = useModule3Store((s) => s.mod1ServiceId);
  const mod1MarketId = useModule3Store((s) => s.mod1MarketId);
  const mod1NicheId = useModule3Store((s) => s.mod1NicheId);
  const mod1Positioning = useModule3Store((s) => s.mod1Positioning);
  
  const mod2OfferType = useModule3Store((s) => s.mod2OfferType);
  const mod2Deliverables = useModule3Store((s) => s.mod2Deliverables);
  const mod2UniqueMechanism = useModule3Store((s) => s.mod2UniqueMechanism);
  const mod2ValueAmplifier = useModule3Store((s) => s.mod2ValueAmplifier);

  const availableAssets = useModule3Store((s) => s.availableAssets);
  const setAvailableAssets = useModule3Store((s) => s.setAvailableAssets);
  
  const pendingStrategy = useModule3Store((s) => s.pendingProofAssetStrategy);
  const currentStrategy = useModule3Store((s) => s.proofAssetStrategy);
  
  const generateProofAssetStrategy = useModule3Store((s) => s.generateProofAssetStrategy);
  const selectExecutionPriority = useModule3Store((s) => s.selectExecutionPriority);
  const approveProofAssetStrategy = useModule3Store((s) => s.approveProofAssetStrategy);
  
  const confirmStep = useModule3Store((s) => s.confirmStep);
  const nextStep = useModule3Store((s) => s.nextStep);
  const previousStep = useModule3Store((s) => s.previousStep);
  
  const completedSteps = useModule3Store((s) => s.completedSteps);
  const isCompleted = completedSteps.includes('proof_asset_builder');
  const isStale = useModule3Store((s) => s.isUpstreamStale);

  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [checkedDeliverables, setCheckedDeliverables] = useState<Record<string, string[]>>({});
  const [activePriority, setActivePriority] = useState<'immediate' | 'short_term' | 'long_term' | null>(
    (pendingStrategy?.selectedExecutionPriority || currentStrategy?.selectedExecutionPriority) as any || null
  );

  const serviceTrack = useMemo(() => {
    if (!mod1ServiceId) return 'other';
    return classifyService(mod1ServiceId).family;
  }, [mod1ServiceId]);

  const templates = useMemo(() => {
    return AVAILABLE_TEMPLATES[serviceTrack] || AVAILABLE_TEMPLATES.other;
  }, [serviceTrack]);

  const ctxCombined = useMemo(() => {
    return {
      serviceId: mod1ServiceId,
      marketId: mod1MarketId,
      nicheId: mod1NicheId,
      positioning: mod1Positioning,
      offerType: mod2OfferType,
      deliverables: mod2Deliverables,
      uniqueMechanism: mod2UniqueMechanism,
      valueAmplifier: mod2ValueAmplifier,
      authorityPosition: authorityProfile?.position || null,
      coreTrustPromise: authorityProfile?.coreTrustPromise || '',
      availableAssets: availableAssets,
    };
  }, [mod1ServiceId, mod1MarketId, mod1NicheId, mod1Positioning, mod2OfferType, mod2Deliverables, mod2UniqueMechanism, mod2ValueAmplifier, authorityProfile, availableAssets]);

  // Dynamically resolve the proof priorities and corresponding assets
  const priorities = useMemo(() => {
    if (!authorityProfile || !mod1MarketId) return [];
    return resolveProofPriorities(ctxCombined as any);
  }, [authorityProfile, mod1MarketId, ctxCombined]);

  const assets = useMemo(() => {
    if (!authorityProfile || !mod1MarketId || priorities.length === 0) return [];
    return priorities.map(p => generateProofAsset(p, ctxCombined as any));
  }, [priorities, authorityProfile, mod1MarketId, ctxCombined]);

  // Set default selected asset
  useEffect(() => {
    if (assets.length > 0 && !selectedAssetId) {
      setSelectedAssetId(assets[0].id);
    }
  }, [assets, selectedAssetId]);

  // Auto-generate strategy on mount if missing
  useEffect(() => {
    if (!pendingStrategy && !currentStrategy && !isGenerating && authorityProfile && mod1MarketId) {
      setIsGenerating(true);
      generateProofAssetStrategy();
      setIsGenerating(false);
    }
  }, [pendingStrategy, currentStrategy, isGenerating, authorityProfile, mod1MarketId, generateProofAssetStrategy]);

  const activeStrategy = pendingStrategy || currentStrategy;

  const handleAssetCheckboxChange = (assetId: string, checked: boolean) => {
    const nextAvailable = checked
      ? [...availableAssets, assetId]
      : availableAssets.filter((id) => id !== assetId);
    
    setAvailableAssets(nextAvailable);

    // Save inventory string format if required by other parts
    const inventoryString = nextAvailable.map(getAssetLabel).join(', ');
    useModule3Store.setState({ existingProofInventory: inventoryString });

    // Regenerate strategy automatically in real-time
    generateProofAssetStrategy();
  };

  const handlePrioritySelect = (priority: 'immediate' | 'short_term' | 'long_term') => {
    setActivePriority(priority);
    selectExecutionPriority(priority);
  };

  const handleApprove = () => {
    if (activeStrategy && activePriority) {
      // Approve strategy
      approveProofAssetStrategy();
      
      // Ensure all priorities and proof assets are synced to store for Module 4
      const state = useModule3Store.getState();
      state.setProofPriorities(priorities);
      state.setProofAssets(assets);

      confirmStep();
      nextStep();
    }
  };

  const handleNext = () => {
    if (isCompleted && !pendingStrategy) {
      nextStep();
    } else {
      handleApprove();
    }
  };

  const toggleDeliverable = (assetId: string, item: string) => {
    setCheckedDeliverables(prev => {
      const currentList = prev[assetId] || [];
      const updated = currentList.includes(item)
        ? currentList.filter(i => i !== item)
        : [...currentList, item];
      return { ...prev, [assetId]: updated };
    });
  };

  // Dynamic styling of variables inside promise text
  const highlightPromiseText = (text: string) => {
    if (!text) return '';
    const serviceLabel = classifyService(mod1ServiceId).label;
    const marketLabel = mod1MarketId ? mod1MarketId.replace(/_/g, ' ') : '';
    
    const keywords = [
      serviceLabel,
      marketLabel,
      "trust", "expert", "expertise", "proves", "prove",
      "results", "earn", "earns", "performance", "consistent",
      "quality", "diagnostic", "diagnostics", "blueprint",
      "deliver", "workflow", "workforce", "audit", "build", "playbook"
    ].filter(Boolean);

    let regexStr = keywords
      .map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
      .join('|');
    
    if (!regexStr) return text;
    
    const regex = new RegExp(`\\b(${regexStr})\\b`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => {
      const isMatch = keywords.some(w => w.toLowerCase() === part.toLowerCase());
      if (isMatch) {
        return (
          <span key={i} className="text-[#0058be] font-extrabold border-b border-[#0058be]/20 bg-[#0058be]/5 px-1 py-0.5 rounded">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  if (!authorityProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-neutral-200 bg-neutral-50/50 border-dashed">
        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
          <Layout className="w-5 h-5 text-neutral-400" aria-hidden="true" />
        </div>
        <h3 className="text-sm font-bold text-[#0b1c30]">Missing Authority Profile</h3>
        <p className="text-sm text-neutral-500 max-w-sm mt-1 mb-6">An approved Authority Profile is required before building a Proof Strategy.</p>
        <ModuleButton variant="secondary" onClick={previousStep}>
          <ArrowLeft size={16} aria-hidden="true" /> Go Back to Step 1
        </ModuleButton>
      </div>
    );
  }
  
  if (!mod2OfferType || !mod1MarketId) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-neutral-200 bg-neutral-50/50 border-dashed">
        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />
        </div>
        <h3 className="text-sm font-bold text-[#0b1c30]">Missing Offer details</h3>
        <p className="text-sm text-neutral-500 max-w-sm mt-1 mb-6">Offer and Niche context from Module 2 are required to map credibility gaps. Please complete previous modules first.</p>
      </div>
    );
  }

  const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
      className="space-y-8 pb-24 max-w-5xl mx-auto"
    >
      <StepHeader 
        step={{ current: 2, total: 4 }}
        title="Proof Asset Strategy" 
        description="Select what starting proof materials you already have. We'll automatically identify your trust gaps and custom-build your proof recipe blueprint."
      />
      
      {isStale && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
          <AlertTriangle size={16} className="text-amber-700 shrink-0 mt-2" aria-hidden="true" />
          <div className="flex-1">
            <p className="text-xs font-bold text-amber-800">Your Authority Profile changed</p>
            <p className="text-xs text-amber-700 mt-0.5">Your positioning has been updated since this strategy was built. Update your proof roadmap:</p>
          </div>
          <button 
            onClick={() => {
              generateProofAssetStrategy();
            }}
            className="text-[11px] font-bold text-[#0b1c30] uppercase tracking-wider px-4 py-2 min-h-[44px] bg-amber-200/50 hover:bg-amber-200 rounded-md transition-colors border-none cursor-pointer"
          >
            Update Roadmap
          </button>
        </div>
      )}

      {/* Premium Strategic Foundation Card */}
      <div className="p-6 rounded-3xl border border-[#0058be]/20 bg-gradient-to-br from-[#0058be]/5 to-transparent shadow-sm space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#0058be]" />
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0b1c30]">
              Strategic Positioning Foundation
            </h4>
          </div>
          <button
            onClick={() => useModule3Store.getState().jumpToStep('authority_position')}
            className="text-xs text-[#0058be] hover:underline font-bold flex items-center gap-1 min-h-[32px] cursor-pointer border-none bg-transparent"
          >
            ✏️ Adjust Archetype
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <div className="md:col-span-1 p-3 rounded-xl bg-white border border-neutral-200 shadow-sm flex flex-col justify-center">
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
              Selected Archetype:
            </span>
            <span className="text-xs font-extrabold text-[#0058be] mt-0.5 uppercase tracking-wide">
              {authorityProfile.position}
            </span>
            <p className="text-[10px] text-neutral-400 mt-1 leading-normal">
              {authorityProfile.position === 'builder' ? 'Proves skill through finished builds.' : 
               authorityProfile.position === 'auditor' ? 'Proves skill through diagnostic audits.' :
               authorityProfile.position === 'deconstructor' ? 'Proves skill through breakdowns.' :
               'Proves skill through daily work logs.'}
            </p>
          </div>

          <div className="md:col-span-3 space-y-1">
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
              Your Active Trust Promise (Locked):
            </span>
            <blockquote className="text-xs font-semibold text-[#0b1c30] leading-relaxed italic pl-3 border-l-2 border-[#0058be]/40">
              "{highlightPromiseText(authorityProfile.coreTrustPromise)}"
            </blockquote>
          </div>
        </div>
        
        <p className="text-[10px] text-neutral-400 leading-normal flex items-center gap-1.5 pt-1">
          <Info size={11} className="text-[#0058be]" />
          This promise was verified in Step 1. The playbooks below are dynamically customized to prove this pledge to your buyers.
        </p>
      </div>

      {/* Starting materials Checkbox block */}
      <section className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-extrabold text-[#0b1c30] flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-[#0058be]" />
            What Starting Materials Do You Have?
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Check the items you already have. We will adapt your proof projects to build on top of these.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {templates.map((tmpl) => {
            const isChecked = availableAssets.includes(tmpl.id);
            return (
              <label
                key={tmpl.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all hover:bg-neutral-50",
                  isChecked
                    ? "border-[#0058be] bg-[#0058be]/5"
                    : "border-neutral-200 bg-white"
                )}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => handleAssetCheckboxChange(tmpl.id, e.target.checked)}
                  className="w-4 h-4 rounded text-[#0058be] border-neutral-300 focus:ring-[#0058be] mt-0.5 shrink-0"
                />
                <div>
                  <span className="text-xs font-bold text-[#0b1c30] block">
                    {getAssetLabel(tmpl.id)}
                  </span>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                    {tmpl.category}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      {/* Interactive double panel roadmap section */}
      {assets.length > 0 && selectedAsset && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left panel: Gap cards */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-extrabold text-[#0b1c30] uppercase tracking-wider">
              3 Required Proof Projects
            </h3>
            <div className="space-y-3">
              {assets.map((asset, index) => {
                const isSelected = selectedAssetId === asset.id;
                const completedCount = checkedDeliverables[asset.id]?.length || 0;
                const progress = asset.completionChecklist.length > 0
                  ? Math.round((completedCount / asset.completionChecklist.length) * 100)
                  : 0;

                return (
                  <button
                    key={asset.id}
                    onClick={() => setSelectedAssetId(asset.id)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col gap-2 focus:outline-none focus:ring-2 focus:ring-[#0058be]/40",
                      isSelected
                        ? "border-[#0058be] bg-[#0058be]/5 shadow-sm"
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 w-full">
                      <div>
                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">
                          Project #{index + 1}
                        </span>
                        <h4 className="text-xs font-extrabold text-[#0b1c30] mt-0.5">
                          {asset.title}
                        </h4>
                      </div>
                      <span className={cn(
                        "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                        asset.expectedImpact === 'High' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                      )}>
                        {asset.assetType.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                      {asset.credibilityGapProved}
                    </p>

                    {/* Satisfying progress indicator */}
                    <div className="mt-2 pt-2 border-t border-dashed border-neutral-100 flex items-center justify-between gap-4 w-full">
                      <div className="flex-1 bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#0058be] h-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-neutral-400 font-bold shrink-0">
                        {progress}% Built
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right panel: Project Recipe Playbook */}
          <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="border-b border-neutral-100 pb-5">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-[9px] font-bold text-[#0058be] bg-[#0058be]/10 px-2 py-1 rounded uppercase tracking-wider">
                  {selectedAsset.assetType.replace(/_/g, ' ')}
                </span>
                <span className="text-[9px] font-bold text-neutral-500 bg-neutral-100 px-2 py-1 rounded uppercase tracking-wider">
                  Difficulty: {selectedAsset.difficulty || 'Medium'}
                </span>
                <span className="text-[9px] font-bold text-neutral-500 bg-neutral-100 px-2 py-1 rounded uppercase tracking-wider">
                  Effort: {selectedAsset.estimatedEffort || '1-3 days'}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[#0b1c30]">
                {selectedAsset.title}
              </h3>
              <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                {selectedAsset.scenario}
              </p>
            </div>

            {/* Target objective */}
            <div className="bg-[#f8f9ff] border border-[#0058be]/20 rounded-xl p-4 space-y-1">
              <span className="text-[10px] font-bold text-[#0058be] uppercase tracking-wider block">Trust Goal:</span>
              <p className="text-xs text-[#0b1c30] leading-relaxed">
                {selectedAsset.credibilityGapProved}
              </p>
            </div>

            {/* Timeline execution steps */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#0b1c30] uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={14} className="text-[#0058be]" />
                Action Roadmap
              </h4>
              <div className="relative border-l-2 border-neutral-100 ml-3 pl-5 space-y-4 py-1">
                {selectedAsset.executionSteps.map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0058be] bg-white flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0058be]" />
                    </div>
                    <span className="text-xs text-neutral-600 font-medium block leading-relaxed">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Checklist deliverables */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#0b1c30] uppercase tracking-wider">
                Completion Checklist
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedAsset.completionChecklist.map((item, idx) => {
                  const isChecked = checkedDeliverables[selectedAsset.id]?.includes(item) || false;
                  return (
                    <label
                      key={idx}
                      className={cn(
                        "flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer select-none transition-all hover:bg-neutral-50",
                        isChecked ? "border-[#0058be] bg-[#0058be]/5" : "border-neutral-100 bg-white"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleDeliverable(selectedAsset.id, item)}
                        className="w-3.5 h-3.5 rounded text-[#0058be] border-neutral-300 focus:ring-[#0058be] mt-0.5"
                      />
                      <span className="text-[11px] text-neutral-600 leading-normal font-medium">
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* What not to claim warning card */}
            {selectedAsset.whatNotToClaim && selectedAsset.whatNotToClaim.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100/50 space-y-2">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} className="text-amber-700" />
                  What NOT to Claim
                </span>
                <ul className="space-y-1">
                  {selectedAsset.whatNotToClaim.map((item, idx) => (
                    <li key={idx} className="text-xs text-amber-700 list-disc list-inside leading-relaxed pl-1 font-medium">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Execution Priority Selection Card Deck */}
      {activeStrategy && (
        <section className="bg-[#0b1c30] rounded-2xl p-6 shadow-md border border-[#0b1c30]">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Award size={18} className="text-blue-400" />
            Choose Strategy Urgency
          </h3>
          <p className="text-sm text-white/70 mb-6 max-w-2xl leading-relaxed">
            Select when you plan to build these proof assets. This sets the timelines for your portfolio in Module 4.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: 'immediate', title: 'Immediate Sprint', desc: 'Build these assets within 14 days to start client pitching immediately.' },
              { id: 'short_term', title: 'Steady Rollout', desc: 'Build these over the next 30-90 days as you refine your offers.' },
              { id: 'long_term', title: 'Organic Growth', desc: 'Collect this evidence organically over time as client work allows.' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handlePrioritySelect(opt.id as any)}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 outline-none bg-white/5 border-none",
                  activePriority === opt.id 
                    ? "bg-blue-600/30 ring-2 ring-blue-500" 
                    : "hover:bg-white/10"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn("text-xs font-bold uppercase tracking-wider", activePriority === opt.id ? "text-blue-100" : "text-white/80")}>
                    {opt.title}
                  </span>
                  {activePriority === opt.id && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                </div>
                <p className="text-xs text-white/60 leading-relaxed">{opt.desc}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {isCompleted && !isStale && !pendingStrategy && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-[#0b1c30] text-white flex items-start gap-4 shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30 mt-1">
            <Check className="w-5 h-5 text-emerald-400" aria-hidden="true" />
          </div>
          <div>
            <h4 className="text-sm font-bold mb-1">Proof Asset Strategy Locked</h4>
            <p className="text-sm text-white/70 leading-relaxed max-w-3xl">
              Your strategy is synchronized. Module 4 will read these proof projects to customize your portfolio layouts.
            </p>
          </div>
        </motion.div>
      )}

      <StepActionArea>
        <div className="flex items-center gap-3">
          <ModuleButton variant="secondary" onClick={previousStep}>
            <ArrowLeft size={16} aria-hidden="true" />
            Back
          </ModuleButton>
        </div>

        <ModuleButton
          variant="primary"
          onClick={handleNext}
          disabled={isGenerating || (activeStrategy && !activePriority)}
        >
          {isCompleted && !pendingStrategy ? 'Continue to Portfolio' : 'Lock in Strategy'}
          <ArrowRight size={16} aria-hidden="true" />
        </ModuleButton>
      </StepActionArea>

    </motion.div>
  );
}
