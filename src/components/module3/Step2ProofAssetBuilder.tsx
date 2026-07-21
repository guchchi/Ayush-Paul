import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ArrowLeft, ArrowRight, Check, AlertTriangle, Layout, Target, CheckCircle2, ShieldAlert, Award, FileText, Info, Edit2, Search,
  Video, Film, Scissors, Tv, Play, Code, Cpu, Zap, Globe, Layers, GitBranch, BookOpen, MessageSquare, Folder, LineChart, TrendingUp, PenTool,
  RotateCcw, ShieldCheck, Filter, Bookmark, Laptop, HelpCircle, CheckCircle, Shield
} from 'lucide-react';
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

const materialIcons: Record<string, any> = {
  showreel: Video,
  before_after_edits: Scissors,
  youtube_videos: Tv,
  instagram_reels: Play,
  motion_graphics: Sparkles,
  editing_breakdown: Film,
  retention_results: LineChart,
  client_work: Folder,
  client_testimonials: MessageSquare,
  testimonials: MessageSquare,
  github_code: Code,
  live_website: Globe,
  figma_portfolio: Layers,
  design_system: Layers,
  design_case_study: FileText,
  case_studies: FileText,
  metrics_results: TrendingUp,
  conversion_metrics: TrendingUp,
  live_automation: Zap,
  workflow_diagram: GitBranch,
  automation_code: Code,
  process_walkthrough: BookOpen,
  landing_pages: Layout,
  email_sequence: FileText,
  sales_page: Layout,
  ad_copies: PenTool,
  swipe_file: Bookmark,
  content_samples: FileText,
};

const archetypeColors = {
  builder: {
    theme: '#0058be',
    bg: 'bg-blue-50/50',
    border: 'border-blue-100',
    text: 'text-blue-700',
    iconBg: 'bg-blue-100/60',
    icon: Sparkles
  },
  auditor: {
    theme: '#7c3aed',
    bg: 'bg-violet-50/50',
    border: 'border-violet-100',
    text: 'text-violet-700',
    iconBg: 'bg-violet-100/60',
    icon: Search
  },
  deconstructor: {
    theme: '#059669',
    bg: 'bg-emerald-50/50',
    border: 'border-emerald-100',
    text: 'text-emerald-700',
    iconBg: 'bg-emerald-100/60',
    icon: FileText
  },
  practitioner: {
    theme: '#d97706',
    bg: 'bg-amber-50/50',
    border: 'border-amber-100',
    text: 'text-amber-700',
    iconBg: 'bg-amber-100/60',
    icon: CheckCircle2
  }
};

const getCategoryStyle = (category: string) => {
  const cat = category.toUpperCase();
  if (cat === 'CRAFT') {
    return 'bg-blue-50 text-blue-600 border-blue-100/50';
  }
  if (cat === 'RELIABILITY') {
    return 'bg-emerald-50 text-emerald-600 border-emerald-100/50';
  }
  if (cat === 'IMPACT') {
    return 'bg-violet-50 text-violet-600 border-violet-100/50';
  }
  return 'bg-neutral-50 text-neutral-600 border-neutral-100/50';
};

const getMetricOptions = (track: string) => {
  if (track === 'editor') {
    return [
      '+45% Avg Watch Time',
      '+15% Hook Retention',
      '3.2x CTR on Thumbnails',
      '+50% Viewer Conversion'
    ];
  }
  if (track === 'developer') {
    return [
      '99 Lighthouse Score',
      '-40% Loading Latency',
      '100% Security Audited',
      '2.5x Server Speedup'
    ];
  }
  if (track === 'designer') {
    return [
      '+24% Signup Conversion',
      '-35% User Drop-off Rate',
      '95% Accessibility Rating',
      '1.8x Task Completion'
    ];
  }
  if (track === 'automation') {
    return [
      '15+ Hours Saved Weekly',
      '0% Sync Failures',
      '99.9% Sync Accuracy',
      '-50% Operational Costs'
    ];
  }
  return [
    '+18% Email Open Rate',
    '+35% Landing Page CTR',
    '2.2x Sales Conversion',
    '-20% Ad CPA Reduction'
  ];
};

const getBlueprintMetadata = (format: string, track: string) => {
  const fmt = format.toLowerCase();
  if (fmt.includes('video') || fmt.includes('reel') || fmt.includes('showreel') || fmt.includes('clips')) {
    return {
      goal: "Prove pacing & visual retention capability.",
      deliverable: "90-second structured video edit showcase.",
      difficulty: "Medium",
      time: "2 Hours",
      evidence: "Pacing hooks, sound design quality, timing cuts",
      trustImpact: "High"
    };
  }
  if (fmt.includes('before') || fmt.includes('comparison')) {
    return {
      goal: "Demonstrate direct improvement metrics & strategic problem-solving.",
      deliverable: "Before/After timeline comparison showcase.",
      difficulty: "Medium",
      time: "3 Hours",
      evidence: "Pacing optimization, conversion enhancement",
      trustImpact: "Very High"
    };
  }
  if (fmt.includes('website') || fmt.includes('code') || fmt.includes('automation')) {
    return {
      goal: "Prove production-ready code structures or sync configurations.",
      deliverable: "Public repository or live webhook diagram.",
      difficulty: "Hard",
      time: "4 Hours",
      evidence: "Error-handling syncs, load testing speed, uptime",
      trustImpact: "High"
    };
  }
  if (fmt.includes('case_study') || fmt.includes('portfolio') || fmt.includes('design')) {
    return {
      goal: "Establish structural design system standards & components.",
      deliverable: "Figma project system & UX prototype blueprint.",
      difficulty: "Easy",
      time: "2 Hours",
      evidence: "UI component reuse, user flow paths, polish",
      trustImpact: "High"
    };
  }
  return {
    goal: "Verify target buyer copy response and headline hook CTR.",
    deliverable: "Direct-response copywriting layout.",
    difficulty: "Easy",
    time: "1.5 Hours",
    evidence: "Headline hook strength, CTA click flow, target voice",
    trustImpact: "Medium"
  };
};

const getPersonalizedWarnings = (format: string, position: string) => {
  const base = [
    'Do not imply this was paid commercial client work',
    'Do not manufacture fake revenue or sales numbers',
  ];

  const fmt = format.toLowerCase();
  if (fmt.includes('video') || fmt.includes('reel') || fmt.includes('showreel') || fmt.includes('clips')) {
    return [
      ...base,
      "Do not claim this demo video was published on the client's official live channel",
      "Do not use third-party media assets without marking them as demo placements"
    ];
  }
  if (fmt.includes('before') || fmt.includes('comparison')) {
    return [
      ...base,
      "Do not claim the 'Before' version was built by an agency partner unless confirmed",
      "State the narrative or timing improvements with objective time indicators"
    ];
  }
  if (position === 'auditor') {
    return [
      ...base,
      "Do not claim access to private analytics or back-end databases of live brands",
      "Specify that all optimization points are derived from public heuristic audits"
    ];
  }
  return [
    ...base,
    "Do not claim this was built for a live commercial brand"
  ];
};

const calculateCoverage = (equippedIds: string[]) => {
  let skill = 15;
  let trust = 10;
  let results = 5;
  let authority = 10;
  let socialProof = 5;

  equippedIds.forEach(id => {
    if (['showreel', 'youtube_videos', 'figma_portfolio', 'github_code', 'content_samples'].includes(id)) {
      skill += 30;
      trust += 10;
    }
    if (['before_after_edits', 'live_website', 'live_automation', 'landing_pages'].includes(id)) {
      skill += 15;
      results += 35;
      trust += 15;
    }
    if (['testimonials', 'client_work'].includes(id)) {
      socialProof += 55;
      trust += 20;
    }
    if (['design_case_study', 'case_studies', 'metrics_results', 'conversion_metrics'].includes(id)) {
      results += 20;
      authority += 35;
      trust += 10;
    }
    if (['workflow_diagram', 'design_system', 'technical_blog', 'swipe_file'].includes(id)) {
      authority += 25;
      skill += 10;
    }
  });

  return {
    skill: Math.min(skill, 100),
    trust: Math.min(trust, 100),
    results: Math.min(results, 100),
    authority: Math.min(authority, 100),
    socialProof: Math.min(socialProof, 100),
  };
};

export function Step2ProofAssetBuilder() {
  const authorityProfile = useModule3Store((s) => s.authorityProfile);
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

  const buyerText = useMemo(() => {
    return mod1MarketId ? mod1MarketId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Target Clients';
  }, [mod1MarketId]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeProjectIdx, setActiveProjectIdx] = useState<number>(0);
  const [activePriority, setActivePriority] = useState<'immediate' | 'short_term' | 'long_term' | null>(
    (pendingStrategy?.selectedExecutionPriority || currentStrategy?.selectedExecutionPriority) as any || null
  );

  // Gamified filters for RPG inventory style selection
  const [activeFilter, setActiveFilter] = useState<'all' | 'craft' | 'reliability' | 'impact'>('all');

  // Custom title and metric overrides
  const [customTitles, setCustomTitles] = useState<Record<string, string>>({});
  const [customMetrics, setCustomMetrics] = useState<Record<string, string>>({});

  const serviceClass = useMemo(() => {
    if (!mod1ServiceId) return { label: 'Professional', family: 'other' };
    return classifyService(mod1ServiceId);
  }, [mod1ServiceId]);

  const serviceTrack = serviceClass.family;

  const templates = useMemo(() => {
    return AVAILABLE_TEMPLATES[serviceTrack] || AVAILABLE_TEMPLATES.other;
  }, [serviceTrack]);

  const filteredTemplates = useMemo(() => {
    if (activeFilter === 'all') return templates;
    return templates.filter(t => t.category.toLowerCase() === activeFilter);
  }, [templates, activeFilter]);

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

  const priorities = useMemo(() => {
    if (!authorityProfile || !mod1MarketId) return [];
    return resolveProofPriorities(ctxCombined as any);
  }, [authorityProfile, mod1MarketId, ctxCombined]);

  const assets = useMemo(() => {
    if (!authorityProfile || !mod1MarketId || priorities.length === 0) return [];
    return priorities.map(p => generateProofAsset(p, ctxCombined as any));
  }, [priorities, authorityProfile, mod1MarketId, ctxCombined]);

  // Load custom values if in store
  useEffect(() => {
    if (assets.length > 0) {
      const titles: Record<string, string> = {};
      const metrics: Record<string, string> = {};
      assets.forEach(a => {
        titles[a.id] = a.title;
        metrics[a.id] = a.realWorldExample || getMetricOptions(serviceTrack)[0];
      });
      setCustomTitles(prev => ({ ...titles, ...prev }));
      setCustomMetrics(prev => ({ ...metrics, ...prev }));
    }
  }, [assets, serviceTrack]);

  // Auto-generate strategy
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

    // Regenerate strategy automatically
    generateProofAssetStrategy();
  };

  const handleClearInventory = () => {
    setAvailableAssets([]);
    useModule3Store.setState({ existingProofInventory: '' });
    generateProofAssetStrategy();
  };

  const handlePrioritySelect = (priority: 'immediate' | 'short_term' | 'long_term') => {
    setActivePriority(priority);
    selectExecutionPriority(priority);
  };

  const handleUpdateAssetTitle = (assetId: string, title: string) => {
    setCustomTitles(prev => ({ ...prev, [assetId]: title }));
    
    const updatedAssets = assets.map(a => {
      const customTitle = a.id === assetId ? title : (customTitles[a.id] || a.title);
      const customMetric = customMetrics[a.id] || a.realWorldExample || '';
      return { ...a, title: customTitle, realWorldExample: customMetric };
    });
    useModule3Store.setState({ proofAssets: updatedAssets });
  };

  const handleUpdateAssetMetric = (assetId: string, metric: string) => {
    setCustomMetrics(prev => ({ ...prev, [assetId]: metric }));
    
    const updatedAssets = assets.map(a => {
      const customTitle = customTitles[a.id] || a.title;
      const customMetric = a.id === assetId ? metric : (customMetrics[a.id] || a.realWorldExample || '');
      return { ...a, title: customTitle, realWorldExample: customMetric };
    });
    useModule3Store.setState({ proofAssets: updatedAssets });
  };

  const handleApprove = () => {
    if (activeStrategy && activePriority) {
      const finalAssets = assets.map(a => ({
        ...a,
        title: customTitles[a.id] || a.title,
        realWorldExample: customMetrics[a.id] || a.realWorldExample || ''
      }));

      approveProofAssetStrategy();
      
      const state = useModule3Store.getState();
      state.setProofPriorities(priorities);
      state.setProofAssets(finalAssets);

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

  // Dynamic styling of variables inside promise text
  const highlightPromiseText = (text: string) => {
    if (!text) return '';
    const serviceLabel = serviceClass.label;
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

  // Inventory HUD calibration variables
  const totalAvailable = templates.length;
  const selectedCount = availableAssets.length;
  const calibrationPercent = totalAvailable > 0 
    ? Math.round((selectedCount / totalAvailable) * 100) 
    : 0;

  const calibrationStatus = useMemo(() => {
    if (selectedCount === 0) return { label: 'Raw Potential', desc: 'Maximum trust gaps mapped. Ready to start building.', color: 'text-amber-600', border: 'border-amber-200', bg: 'bg-amber-500' };
    if (selectedCount <= 2) return { label: 'Hybrid Authority', desc: 'Moderate gaps identified. Gaps balanced by existing items.', color: 'text-blue-600', border: 'border-blue-200', bg: 'bg-blue-600' };
    return { label: 'Omni Authority', desc: 'Minimal gaps. High level of matched proof assets.', color: 'text-emerald-600', border: 'border-emerald-200', bg: 'bg-emerald-500' };
  }, [selectedCount]);

  // Gap analysis lists
  const currentProofList = useMemo(() => {
    return availableAssets.map(id => ({ id, label: getAssetLabel(id) }));
  }, [availableAssets]);

  const missingProofList = useMemo(() => {
    return templates
      .filter(t => !availableAssets.includes(t.id))
      .map(t => ({ id: t.id, label: getAssetLabel(t.id) }));
  }, [templates, availableAssets]);

  // Coverage statistics
  const coverageMetrics = useMemo(() => {
    return calculateCoverage(availableAssets);
  }, [availableAssets]);

  const weakDimensions = useMemo(() => {
    const list = [
      { name: 'Skill', value: coverageMetrics.skill },
      { name: 'Trust', value: coverageMetrics.trust },
      { name: 'Results', value: coverageMetrics.results },
      { name: 'Authority', value: coverageMetrics.authority },
      { name: 'Social Proof', value: coverageMetrics.socialProof },
    ];
    return list.filter(item => item.value < 50).map(item => item.name);
  }, [coverageMetrics]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
      className="space-y-8 pb-24 max-w-5xl mx-auto text-left"
    >
      <StepHeader 
        step={{ current: 2, total: 4 }}
        title="Proof Strategy Blueprint" 
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
            onClick={() => generateProofAssetStrategy()}
            className="text-[11px] font-bold text-[#0b1c30] uppercase tracking-wider px-4 py-2 min-h-[44px] bg-amber-200/50 hover:bg-amber-200 rounded-md transition-colors border-none cursor-pointer"
          >
            Update Roadmap
          </button>
        </div>
      )}

      {/* Premium Strategic Foundation Card */}
      <div className="p-6 rounded-3xl border border-neutral-200/80 bg-white shadow-sm space-y-5 relative overflow-hidden">
        <div 
          className="absolute -right-20 -top-20 w-44 h-44 rounded-full filter blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: (archetypeColors[authorityProfile.position] || archetypeColors.builder).theme }}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#0058be]" />
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0b1c30]">
              Strategic Positioning Foundation
            </h4>
          </div>
          <button
            onClick={() => useModule3Store.getState().jumpToStep('authority_position')}
            className="text-xs text-[#0058be] hover:text-[#0058be]/80 font-extrabold flex items-center gap-1.5 min-h-[36px] px-3.5 rounded-xl border border-[#0058be]/20 bg-white shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
          >
            <Edit2 size={13} className="text-[#0058be]" />
            Adjust Archetype
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          {(() => {
            const colors = archetypeColors[authorityProfile.position] || archetypeColors.builder;
            const IconComponent = colors.icon;
            return (
              <div className={cn(
                "md:col-span-1 p-5 rounded-2xl border flex flex-col items-center text-center relative overflow-hidden group hover:shadow-md transition-all duration-300",
                colors.bg,
                colors.border
              )}>
                <div 
                  className="absolute top-0 inset-x-0 h-1" 
                  style={{ backgroundColor: colors.theme }}
                />
                
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-3", colors.iconBg, colors.text)}>
                  <IconComponent className="w-5 h-5" />
                </div>

                <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
                  Archetype
                </span>
                <span className={cn("text-xs font-black mt-1 uppercase tracking-wider", colors.text)}>
                  {authorityProfile.position}
                </span>
                <p className="text-[10px] text-neutral-500 mt-2 leading-relaxed font-medium">
                  {authorityProfile.position === 'builder' ? 'Proves skill through finished builds.' : 
                   authorityProfile.position === 'auditor' ? 'Proves skill through diagnostic audits.' :
                   authorityProfile.position === 'deconstructor' ? 'Proves skill through breakdowns.' :
                   'Proves skill through daily work logs.'}
                </p>
              </div>
            );
          })()}

          <div className="md:col-span-3 space-y-2">
            <span className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest block">
              Your Active Trust Promise (Locked):
            </span>
            <blockquote className="text-sm font-semibold text-[#0b1c30] leading-relaxed italic pl-4 border-l-2 border-[#0058be]/40">
              "{highlightPromiseText(authorityProfile.coreTrustPromise)}"
            </blockquote>
          </div>
        </div>
      </div>

      {/* SECTION 2: SCAN & INVENTORY YOUR STARTING MATERIALS (REPLAYING OLD CHIPS GRID!) */}
      <section className="p-6 rounded-3xl border border-neutral-200 bg-white shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-neutral-100 pb-5">
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-[#0b1c30] flex items-center gap-1.5 uppercase tracking-wide">
              <CheckCircle2 size={16} className="text-[#0058be]" />
              Scan & Inventory Your Starting Materials
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-xl">
              Equip the proof assets you already have in your inventory. The system will automatically calibrate your remaining trust gaps.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearInventory}
              disabled={selectedCount === 0}
              className="text-[11px] text-neutral-400 hover:text-neutral-600 disabled:opacity-30 disabled:pointer-events-none font-bold flex items-center gap-1 cursor-pointer border-none bg-transparent min-h-[32px] px-2 rounded hover:bg-neutral-50 transition-colors"
            >
              <RotateCcw size={12} />
              Reset Bag
            </button>
          </div>
        </div>

        {/* Gamified Inventory HUD dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center p-5 rounded-2xl bg-neutral-50/50 border border-neutral-100">
          <div>
            <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
              Inventory Status
            </span>
            <span className={cn("text-xs font-black mt-1 block uppercase tracking-wider", calibrationStatus.color)}>
              {calibrationStatus.label}
            </span>
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-bold text-[#0b1c30]/75">
              <span>Calibration Progress ({selectedCount} of {totalAvailable} Equipped)</span>
              <span>{calibrationPercent}%</span>
            </div>
            <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden relative shadow-inner">
              <motion.div
                className={cn("h-full rounded-full", calibrationStatus.bg)}
                initial={{ width: 0 }}
                animate={{ width: `${calibrationPercent}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Items', icon: Filter },
            { id: 'craft', label: 'Craft Assets', icon: PenTool },
            { id: 'reliability', label: 'Reliability Proofs', icon: ShieldCheck },
            { id: 'impact', label: 'Impact Metrics', icon: LineChart }
          ].map(pill => {
            const isActive = activeFilter === pill.id;
            const Icon = pill.icon;
            return (
              <motion.button
                key={pill.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(pill.id as any)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-extrabold uppercase tracking-wider cursor-pointer transition-all shrink-0",
                  isActive
                    ? "bg-[#0058be] text-white border-[#0058be] shadow-sm shadow-[#0058be]/10"
                    : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300"
                )}
              >
                <Icon size={12} />
                {pill.label}
              </motion.button>
            );
          })}
        </div>

        {/* Gamified Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredTemplates.map((tmpl) => {
              const isChecked = availableAssets.includes(tmpl.id);
              const AssetIcon = materialIcons[tmpl.id] || FileText;
              const catStyle = getCategoryStyle(tmpl.category);
              
              return (
                <motion.div
                  key={tmpl.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  whileHover={{ 
                    y: -4, 
                    scale: 1.01,
                    boxShadow: isChecked
                      ? '0 10px 25px -5px rgba(0, 88, 190, 0.12), 0 8px 10px -6px rgba(0, 88, 190, 0.12)'
                      : '0 8px 15px -4px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAssetCheckboxChange(tmpl.id, !isChecked)}
                  className={cn(
                    "flex flex-col justify-between p-4 rounded-2xl border cursor-pointer select-none transition-all relative overflow-hidden group min-h-[110px]",
                    isChecked
                      ? "border-[#0058be] bg-[#0058be]/5 ring-1 ring-[#0058be]/30"
                      : "border-neutral-200 bg-white hover:border-neutral-300"
                  )}
                >
                  <div className="flex items-start justify-between gap-3 w-full">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
                        isChecked 
                          ? "bg-[#0058be]/15 text-[#0058be]" 
                          : "bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200/60"
                      )}>
                        <AssetIcon className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-[#0b1c30] leading-snug block">
                          {getAssetLabel(tmpl.id)}
                        </span>
                      </div>
                    </div>

                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 shrink-0",
                      isChecked 
                        ? "border-[#0058be] bg-[#0058be] text-white" 
                        : "border-neutral-300 bg-white"
                    )}>
                      {isChecked && (
                        <motion.svg
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 25 }}
                          className="w-3 h-3 stroke-[3]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-dashed border-neutral-100/60 flex items-center justify-between">
                    <span className={cn("text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 border rounded-full", catStyle)}>
                      {tmpl.category}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-medium group-hover:text-[#0058be]/75 transition-colors">
                      {isChecked ? 'Equipped' : 'Equip item'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* SECTION 3: BUILD YOUR PROOF BLUEPRINT (STRATEGIC WIDGETS DECK) */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-[#0058be]" />
          <h3 className="text-sm font-extrabold text-[#0b1c30] uppercase tracking-wider">
            Build Your Proof Blueprint
          </h3>
        </div>

        {/* Part 1: Proof Gap Analysis side-by-side display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-3xl bg-[#f8f9ff]/50 border border-neutral-200 space-y-3">
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-full uppercase tracking-wider w-max block">
              ✔ Current Proof ({currentProofList.length})
            </span>
            {currentProofList.length === 0 ? (
              <span className="text-xs text-neutral-400 italic block pl-1">No proof equipped in inventory scan.</span>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentProofList.map(item => (
                  <div key={item.id} className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5 p-2 bg-white rounded-lg border border-emerald-100">
                    <Check size={11} strokeWidth={3} className="text-emerald-500" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 rounded-3xl bg-[#f8f9ff]/50 border border-neutral-200 space-y-3">
            <span className="text-[10px] font-black text-amber-700 bg-amber-100/60 px-2.5 py-1 rounded-full uppercase tracking-wider w-max block">
              ✖ Required Gaps ({missingProofList.length})
            </span>
            {missingProofList.length === 0 ? (
              <span className="text-xs text-neutral-400 italic block pl-1">All trust requirements matched!</span>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {missingProofList.map(item => (
                  <div key={item.id} className="text-[11px] font-semibold text-amber-800 flex items-center gap-1.5 p-2 bg-white rounded-lg border border-amber-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Part 2 & 3: Recommended Projects & Blueprint Details (Side-by-side dashboard) */}
        {assets.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Recommended projects Priority stack */}
            <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div>
                  <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
                    Priority Recommended Roadmap
                  </span>
                  <h4 className="text-xs font-black text-[#0b1c30] uppercase tracking-wide">
                    Top 3 Recommended Projects
                  </h4>
                </div>

                <div className="space-y-2">
                  {assets.map((asset, idx) => {
                    const isActive = activeProjectIdx === idx;
                    return (
                      <button
                        key={asset.id}
                        onClick={() => setActiveProjectIdx(idx)}
                        className={cn(
                          "w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3",
                          isActive 
                            ? "border-[#0058be] bg-[#0058be]/5 ring-1 ring-[#0058be]/20" 
                            : "border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black",
                          isActive ? "bg-[#0058be] text-white" : "bg-neutral-200 text-neutral-500"
                        )}>
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] font-extrabold text-[#0058be] uppercase tracking-wider block">
                            Priority #{idx + 1}
                          </span>
                          <span className="text-xs font-bold text-[#0b1c30] block truncate">
                            {customTitles[asset.id] || asset.title}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Active blueprint details spec panel (No Execution Course Checklist) */}
            {(() => {
              const activeAsset = assets[activeProjectIdx];
              const meta = getBlueprintMetadata(activeAsset.assetType, serviceTrack);
              const warnings = getPersonalizedWarnings(activeAsset.assetType, authorityProfile.position);

              return (
                <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-neutral-100 pb-3">
                      <div>
                        <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
                          Project Blueprint Specs
                        </span>
                        <h4 className="text-xs font-black text-[#0b1c30] uppercase tracking-wide">
                          {customTitles[activeAsset.id] || activeAsset.title}
                        </h4>
                      </div>

                      <span className="text-[9px] font-black text-[#0058be] bg-[#0058be]/10 px-2.5 py-1 rounded-full uppercase tracking-wider block shrink-0">
                        {activeAsset.assetType.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Customize titles & metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
                          Case Study Title:
                        </label>
                        <input
                          type="text"
                          value={customTitles[activeAsset.id] || ''}
                          onChange={(e) => handleUpdateAssetTitle(activeAsset.id, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl outline-none text-xs text-[#0b1c30] bg-neutral-50 border border-neutral-200 focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/10 focus:bg-white transition-all font-semibold"
                          placeholder="Customize project title..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
                          Target Metric:
                        </label>
                        <select
                          value={customMetrics[activeAsset.id] || ''}
                          onChange={(e) => handleUpdateAssetMetric(activeAsset.id, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl outline-none text-xs text-[#0b1c30] bg-neutral-50 border border-neutral-200 focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/10 focus:bg-white transition-all font-semibold cursor-pointer"
                        >
                          {getMetricOptions(serviceTrack).map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Blueprint Details */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">Goal</span>
                        <span className="text-xs font-semibold text-neutral-700">{meta.goal}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">Audience Focus</span>
                        <span className="text-xs font-semibold text-neutral-700">{buyerText}</span>
                      </div>
                      <div className="space-y-0.5 col-span-2">
                        <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">Target Deliverable</span>
                        <span className="text-xs font-semibold text-neutral-700">{meta.deliverable}</span>
                      </div>
                      <div className="space-y-0.5 col-span-2">
                        <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">Evidence Demonstrated</span>
                        <span className="text-xs font-semibold text-neutral-700">{meta.evidence}</span>
                      </div>
                    </div>

                    {/* Badges metadata row */}
                    <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-neutral-100">
                      <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-100/50 text-center">
                        <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">Estimated Time</span>
                        <span className="text-xs font-black text-[#0b1c30] mt-0.5 block">{meta.time}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-100/50 text-center">
                        <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">Difficulty</span>
                        <span className="text-xs font-black text-[#0b1c30] mt-0.5 block">{meta.difficulty}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-100/50 text-center">
                        <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">Trust Impact</span>
                        <span className="text-xs font-black text-emerald-600 mt-0.5 block">{meta.trustImpact}</span>
                      </div>
                    </div>
                  </div>

                  {/* Guardrails Warnings alert */}
                  {warnings.length > 0 && (
                    <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-100/50 space-y-1 mt-auto">
                      <span className="text-[9px] font-black text-amber-800 uppercase tracking-widest flex items-center gap-1">
                        <ShieldAlert size={12} className="text-amber-700" />
                        What NOT to Claim
                      </span>
                      <ul className="space-y-1">
                        {warnings.map((item, idx) => (
                          <li key={idx} className="text-[10px] text-amber-800/90 leading-relaxed font-semibold flex items-start gap-1">
                            <span className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Part 4: Coverage & Trust Analysis progress dashboard */}
        <div className="p-6 bg-white border border-neutral-200 rounded-3xl shadow-sm space-y-4">
          <div>
            <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
              Statistics
            </span>
            <h3 className="text-sm font-black text-[#0b1c30] uppercase tracking-wide">
              Proof Coverage Analysis
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { label: 'Technical Skill', val: coverageMetrics.skill, desc: 'Proves capability to execute.' },
              { label: 'Client Trust', val: coverageMetrics.trust, desc: 'Proves reliable professional process.' },
              { label: 'Business Results', val: coverageMetrics.results, desc: 'Proves conversion/measurable outcomes.' },
              { label: 'Market Authority', val: coverageMetrics.authority, desc: 'Proves strategic positioning.' },
              { label: 'Social Proof', val: coverageMetrics.socialProof, desc: 'Proves customer feedback.' },
            ].map(dim => (
              <div key={dim.label} className="p-4 rounded-2xl bg-neutral-50/50 border border-neutral-100 space-y-2">
                <span className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider block">
                  {dim.label}
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-[#0b1c30]">{dim.val}%</span>
                </div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-300", 
                      dim.val > 70 ? "bg-emerald-500" : dim.val > 40 ? "bg-blue-500" : "bg-amber-500"
                    )} 
                    style={{ width: `${dim.val}%` }} 
                  />
                </div>
                <span className="text-[9px] text-neutral-400 block font-semibold">{dim.desc}</span>
              </div>
            ))}
          </div>

          {weakDimensions.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100/50 flex items-start gap-2.5">
              <Info size={14} className="text-amber-700 shrink-0 mt-0.5" />
              <span className="text-xs text-amber-800 font-semibold leading-relaxed">
                Strategic Insight: You are weak in <span className="underline">{weakDimensions.join(', ')}</span>. The recommended Priority #2 project will help balance your authority profile.
              </span>
            </div>
          )}
        </div>

        {/* Part 5: Proof Strategy Summary & Approvals */}
        {activeStrategy && (
          <section className="bg-[#0b1c30] rounded-3xl p-6 shadow-md border border-[#0b1c30] space-y-6">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <ShieldCheck size={18} className="text-blue-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Proof Strategy Summary
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <div className="md:col-span-2 space-y-3 text-white">
                <span className="text-[9px] font-black text-white/50 uppercase tracking-widest block">
                  Roadmap Goals
                </span>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-xs">
                    <Check className="text-blue-400 w-4 h-4 shrink-0" strokeWidth={3} />
                    <span>Build 3 Recommended Case Study Projects</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <Check className="text-blue-400 w-4 h-4 shrink-0" strokeWidth={3} />
                    <span>Establish verified positioning credentials</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-white/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span>Remaining gaps: Client Testimonials</span>
                  </div>
                </div>
              </div>

              {/* Urgency selection deck */}
              <div className="md:col-span-2 space-y-2">
                <span className="text-[9px] font-black text-white/50 uppercase tracking-widest block mb-1">
                  Choose Strategy Urgency
                </span>
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'immediate', title: 'Sprint (14 Days)' },
                    { id: 'short_term', title: 'Steady Rollout (30-90 Days)' },
                    { id: 'long_term', title: 'Organic' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handlePrioritySelect(opt.id as any)}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer",
                        activePriority === opt.id 
                          ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/10" 
                          : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
                      )}
                    >
                      {opt.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </section>

      {isCompleted && !pendingStrategy && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-[#0b1c30] text-white flex items-start gap-4 shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30 mt-1">
            <Check className="w-5 h-5 text-emerald-400" aria-hidden="true" />
          </div>
          <div>
            <h4 className="text-sm font-bold mb-1">Proof Asset Strategy Approved</h4>
            <p className="text-sm text-white/70 leading-relaxed max-w-3xl">
              Your strategy is approved. The detailed execution checklists, templates, and coding scripts are now loaded into Module 4 (Portfolio Execution Workspace).
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
