import { useState, useMemo, useEffect, useRef } from 'react';
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

function getPersonalizedWarnings(format: string, position: string) {
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
}

function getTrustRequirements(track: string, buyerLabel: string) {
  if (track === 'editor') {
    return [
      {
        id: 'hook',
        title: 'Visual Hook Proof',
        description: `Buyers want proof you can capture attention in the first 5 seconds to stop the scroll.`,
        requiredFor: 'Hook Rate optimization',
        supportedBy: ['showreel', 'youtube_videos', 'instagram_reels', 'motion_graphics']
      },
      {
        id: 'pacing',
        title: 'Retention Pacing',
        description: `Buyers need to see if you can hold viewer attention through narrative pacing past the 1-minute mark.`,
        requiredFor: 'Average Watch Time',
        supportedBy: ['youtube_videos', 'editing_breakdown', 'retention_results', 'before_after_edits']
      },
      {
        id: 'tech',
        title: 'Technical Competence',
        description: `Buyers need reassurance on sound design, normalized audio, color correction, and resolution standards.`,
        requiredFor: 'Quality Delivery',
        supportedBy: ['client_work', 'before_after_edits', 'motion_graphics']
      }
    ];
  }
  if (track === 'developer') {
    return [
      {
        id: 'speed',
        title: 'Performance & Speed',
        description: `Buyers need proof that your sites load instantly on slow mobile connections.`,
        requiredFor: 'SEO and conversion rates',
        supportedBy: ['live_website', 'metrics_results', 'conversion_metrics']
      },
      {
        id: 'reliability',
        title: 'Production Reliability',
        description: `Buyers want reassurance that your codebase doesn't crash or trigger server errors under load.`,
        requiredFor: 'Uptime guarantee',
        supportedBy: ['github_code', 'live_website', 'client_work']
      },
      {
        id: 'clean_code',
        title: 'Code Maintainability',
        description: `Buyers want structured folders and clean syntax so future teams can easily edit the product.`,
        requiredFor: 'Technical debt reduction',
        supportedBy: ['github_code', 'technical_blog']
      }
    ];
  }
  if (track === 'designer') {
    return [
      {
        id: 'ux',
        title: 'Usability & UX Flow',
        description: `Buyers need proof that target users can navigate your interface layouts without getting stuck.`,
        requiredFor: 'Conversion Rate optimization',
        supportedBy: ['design_case_study', 'interactive_prototype', 'user_flow']
      },
      {
        id: 'polish',
        title: 'Visual Polish & System',
        description: `Buyers need to see a modern, premium brand look built on structured design system tokens.`,
        requiredFor: 'Brand alignment',
        supportedBy: ['figma_portfolio', 'design_system', 'behance_dribbble']
      },
      {
        id: 'process',
        title: 'Process Verification',
        description: `Buyers want reassurance that you don't just guess; you design using user research and iteration.`,
        requiredFor: 'Strategy validation',
        supportedBy: ['design_case_study', 'design_process', 'design_critique']
      }
    ];
  }
  if (track === 'automation') {
    return [
      {
        id: 'sync',
        title: 'Sync Integrity',
        description: `Buyers need proof that records move between APIs accurately with no duplicates or lost fields.`,
        requiredFor: 'Data security',
        supportedBy: ['live_automation', 'automation_code', 'client_work']
      },
      {
        id: 'errors',
        title: 'Error Handling',
        description: `Buyers want reassurance that your scenarios alert team members immediately when third-party APIs fail.`,
        requiredFor: 'Workflow uptime',
        supportedBy: ['workflow_diagram', 'process_walkthrough']
      },
      {
        id: 'ops',
        title: 'Ops Efficiency',
        description: `Buyers want to see how many hours or manual tasks your automations actually save weekly.`,
        requiredFor: 'ROI verification',
        supportedBy: ['metrics_results', 'live_automation']
      }
    ];
  }
  return [
    {
      id: 'copy_hook',
      title: 'Audience Hook Rate',
      description: `Buyers want proof that your headlines and opening sentences drive clicks and engagement.`,
      requiredFor: 'Click-Through Rate',
      supportedBy: ['landing_pages', 'email_sequence', 'ad_copies', 'swipe_file']
    },
    {
      id: 'persuasion',
      title: 'Persuasive Copy Arc',
      description: `Buyers need to see if your copy reads naturally and guides readers logically to the call-to-action.`,
      requiredFor: 'Direct-Response ROI',
      supportedBy: ['sales_page', 'landing_pages', 'content_samples']
    },
    {
      id: 'voice_fit',
      title: 'Voice & Context Fit',
      description: `Buyers need proof that your copy fits search intent or matches their brand voice perfectly.`,
      requiredFor: 'Brand consistency',
      supportedBy: ['email_sequence', 'swipe_file', 'content_samples']
    }
  ];
}

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

  const [isGenerating, setIsGenerating] = useState(false);
  const [checkedDeliverables, setCheckedDeliverables] = useState<Record<string, string[]>>({});
  const [activePriority, setActivePriority] = useState<'immediate' | 'short_term' | 'long_term' | null>(
    (pendingStrategy?.selectedExecutionPriority || currentStrategy?.selectedExecutionPriority) as any || null
  );

  // Gamified filters for RPG inventory style selection
  const [activeFilter, setActiveFilter] = useState<'all' | 'craft' | 'reliability' | 'impact'>('all');

  // Custom blueprint title and metric selections
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

  // Dynamically resolve the proof priorities and corresponding assets
  const priorities = useMemo(() => {
    if (!authorityProfile || !mod1MarketId) return [];
    return resolveProofPriorities(ctxCombined as any);
  }, [authorityProfile, mod1MarketId, ctxCombined]);

  const assets = useMemo(() => {
    if (!authorityProfile || !mod1MarketId || priorities.length === 0) return [];
    return priorities.map(p => generateProofAsset(p, ctxCombined as any));
  }, [priorities, authorityProfile, mod1MarketId, ctxCombined]);

  const buyerText = useMemo(() => {
    return mod1MarketId ? mod1MarketId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Target Clients';
  }, [mod1MarketId]);

  const trustRequirements = useMemo(() => {
    return getTrustRequirements(serviceTrack, buyerText);
  }, [serviceTrack, buyerText]);

  // Load initial custom values if already in store
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
    
    // Update store proofAssets array dynamically so Module 4 can read it
    const updatedAssets = assets.map(a => {
      const customTitle = a.id === assetId ? title : (customTitles[a.id] || a.title);
      const customMetric = customMetrics[a.id] || a.realWorldExample || '';
      return { ...a, title: customTitle, realWorldExample: customMetric };
    });
    useModule3Store.setState({ proofAssets: updatedAssets });
  };

  const handleUpdateAssetMetric = (assetId: string, metric: string) => {
    setCustomMetrics(prev => ({ ...prev, [assetId]: metric }));
    
    // Update store proofAssets array dynamically so Module 4 can read it
    const updatedAssets = assets.map(a => {
      const customTitle = customTitles[a.id] || a.title;
      const customMetric = a.id === assetId ? metric : (customMetrics[a.id] || a.realWorldExample || '');
      return { ...a, title: customTitle, realWorldExample: customMetric };
    });
    useModule3Store.setState({ proofAssets: updatedAssets });
  };

  const handleApprove = () => {
    if (activeStrategy && activePriority) {
      // Sync final customized values to store array
      const finalAssets = assets.map(a => ({
        ...a,
        title: customTitles[a.id] || a.title,
        realWorldExample: customMetrics[a.id] || a.realWorldExample || ''
      }));

      // Approve strategy
      approveProofAssetStrategy();
      
      // Ensure all priorities and proof assets are synced to store for Module 4
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
      className="space-y-8 pb-24 max-w-5xl mx-auto text-left"
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
      <div className="p-6 rounded-3xl border border-neutral-200/80 bg-white shadow-sm space-y-5 relative overflow-hidden">
        {/* Subtle background glow depending on active archetype */}
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
          {/* Enhanced Capsule Archetype Badge */}
          {(() => {
            const colors = archetypeColors[authorityProfile.position] || archetypeColors.builder;
            const IconComponent = colors.icon;
            return (
              <div className={cn(
                "md:col-span-1 p-5 rounded-2xl border flex flex-col items-center text-center relative overflow-hidden group hover:shadow-md transition-all duration-300",
                colors.bg,
                colors.border
              )}>
                {/* Top color line indicator */}
                <div 
                  className="absolute top-0 inset-x-0 h-1" 
                  style={{ backgroundColor: colors.theme }}
                />
                
                {/* Icon Container */}
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
        
        <p className="text-[10px] text-neutral-400 leading-normal flex items-center gap-1.5 pt-2 border-t border-neutral-100/60">
          <Info size={11} className="text-[#0058be]" />
          This promise was verified in Step 1. The playbooks below are dynamically customized to prove this pledge to your buyers.
        </p>
      </div>

      {/* SECTION 1: TRUST AUDIT & GAP DIAGNOSTICS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left: Client Trust Requirements & Inventory Check */}
        <div className="lg:col-span-6 bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
                Buyer Perspective
              </span>
              <h3 className="text-sm font-black text-[#0b1c30] uppercase tracking-wide">
                {buyerText} Trust Requirements
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed mt-1">
                To win a client contract in your niche, your proof strategy must satisfy these 3 requirements:
              </p>
            </div>

            <div className="space-y-3.5">
              {trustRequirements.map((req, i) => (
                <div key={req.id} className="p-4 rounded-2xl bg-neutral-50/50 border border-neutral-100 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-[#0b1c30]">
                      {i + 1}. {req.title}
                    </span>
                    <span className="text-[9px] font-black text-[#0058be] uppercase tracking-wider">
                      {req.requiredFor}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-relaxed font-medium">
                    {req.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Starting materials inventory check */}
          <div className="border-t border-neutral-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
                Proof Inventory Bag
              </span>
              <button
                onClick={handleClearInventory}
                disabled={selectedCount === 0}
                className="text-[10px] text-neutral-400 hover:text-neutral-600 disabled:opacity-20 font-bold flex items-center gap-1 cursor-pointer border-none bg-transparent"
              >
                <RotateCcw size={11} /> Reset Inventory
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {templates.map(tmpl => {
                const isChecked = availableAssets.includes(tmpl.id);
                return (
                  <label
                    key={tmpl.id}
                    className={cn(
                      "flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer select-none transition-all hover:bg-neutral-50/70",
                      isChecked ? "border-[#0058be] bg-[#0058be]/5" : "border-neutral-200 bg-white"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => handleAssetCheckboxChange(tmpl.id, e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-[#0058be] border-neutral-300 focus:ring-[#0058be] mt-0.5 shrink-0"
                    />
                    <span className="text-[11px] font-bold text-[#0b1c30]">
                      {getAssetLabel(tmpl.id)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Live Gap Diagnostics dashboard */}
        <div className="lg:col-span-6 bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div>
              <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
                Diagnostic Analysis
              </span>
              <h3 className="text-sm font-black text-[#0b1c30] uppercase tracking-wide">
                Strategic Gap Diagnostics
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed mt-1">
                The diagnostic engine evaluates your equipped starting materials to identify trust gaps:
              </p>
            </div>

            {/* Live diagnostic meter */}
            <div className="p-4 rounded-2xl bg-neutral-50/50 border border-neutral-100 flex items-center justify-between gap-4">
              <div>
                <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">Calibration Level</span>
                <span className={cn("text-xs font-black uppercase tracking-wider block mt-0.5", calibrationStatus.color)}>
                  {calibrationStatus.label}
                </span>
              </div>
              <div className="flex-1 max-w-[200px] space-y-1">
                <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", calibrationStatus.bg)} style={{ width: `${calibrationPercent}%` }} />
                </div>
                <span className="text-[9px] text-neutral-400 font-bold block text-right">{selectedCount}/{totalAvailable} Equipped</span>
              </div>
            </div>

            {/* Gap List comparison diagnostics */}
            <div className="space-y-3 pt-2">
              {trustRequirements.map(req => {
                const isSatisfied = req.supportedBy.some(id => availableAssets.includes(id));
                return (
                  <div
                    key={req.id}
                    className={cn(
                      "p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4 justify-between",
                      isSatisfied 
                        ? "bg-emerald-50/40 border-emerald-100" 
                        : "bg-amber-50/40 border-amber-100"
                    )}
                  >
                    <div className="space-y-1 flex-1">
                      <h4 className={cn("text-xs font-bold", isSatisfied ? "text-emerald-800" : "text-amber-800")}>
                        {req.title}
                      </h4>
                      <p className="text-[11px] text-neutral-500 leading-relaxed">
                        {isSatisfied 
                          ? `Equipped assets satisfy this buyer trust signal.` 
                          : `No assets in your bag satisfy this requirement. You need to build a project.`
                        }
                      </p>
                    </div>

                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border shrink-0",
                      isSatisfied 
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200" 
                        : "bg-amber-100 text-amber-800 border-amber-200"
                    )}>
                      {isSatisfied ? 'Equipped' : 'Trust Gap'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[10px] text-neutral-400 leading-normal flex items-center gap-1.5 pt-2 border-t border-neutral-100">
            <Info size={11} className="text-[#0058be]" />
            Diagnostic results update live as you check items. Gaps are resolved by building the recommended projects below.
          </p>
        </div>
      </section>

      {/* SECTION 2: 3-COLUMN SYMMETRICAL PROOF ACTION PLAN BOARD */}
      {assets.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#0058be]" />
            <h3 className="text-sm font-extrabold text-[#0b1c30] uppercase tracking-wider">
              3 Required Proof Projects
            </h3>
          </div>

          {/* Symmetrical 3-column Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {assets.map((asset, index) => {
              const activeMetric = customMetrics[asset.id] || getMetricOptions(serviceTrack)[0];
              const completedCount = checkedDeliverables[asset.id]?.length || 0;
              const progress = asset.completionChecklist.length > 0
                ? Math.round((completedCount / asset.completionChecklist.length) * 100)
                : 0;
              const isFinished = completedCount === asset.completionChecklist.length && asset.completionChecklist.length > 0;
              const warnings = getPersonalizedWarnings(asset.assetType, authorityProfile.position);

              return (
                <div 
                  key={asset.id} 
                  className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden"
                >
                  <div className="space-y-4 flex-1">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-2 border-b border-neutral-100 pb-3">
                      <div>
                        <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
                          Project #{index + 1}
                        </span>
                        <span className="text-[9px] font-black text-[#0058be] bg-[#0058be]/10 px-2 py-0.5 rounded-full uppercase tracking-wider block mt-1 w-max">
                          {asset.assetType.replace(/_/g, ' ')}
                        </span>
                      </div>
                      
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border",
                        isFinished 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                          : "bg-blue-50 text-[#0058be] border-blue-200"
                      )}>
                        {isFinished ? 'Ready' : `${completedCount}/${asset.completionChecklist.length} Done`}
                      </span>
                    </div>

                    {/* Custom title edit field */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
                        Case Study Title:
                      </label>
                      <input
                        type="text"
                        value={customTitles[asset.id] || ''}
                        onChange={(e) => handleUpdateAssetTitle(asset.id, e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl outline-none text-xs text-[#0b1c30] bg-neutral-50 border border-neutral-200 focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/10 focus:bg-white transition-all font-semibold"
                        placeholder="Customize project title..."
                      />
                    </div>

                    {/* Custom target metric dropdown */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
                        Target Metric:
                      </label>
                      <select
                        value={customMetrics[asset.id] || ''}
                        onChange={(e) => handleUpdateAssetMetric(asset.id, e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl outline-none text-xs text-[#0b1c30] bg-neutral-50 border border-neutral-200 focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be]/10 focus:bg-white transition-all font-semibold cursor-pointer"
                      >
                        {getMetricOptions(serviceTrack).map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    {/* Objective Box */}
                    <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-100/50 space-y-1">
                      <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">Objective Gap Proved</span>
                      <p className="text-[11px] text-neutral-600 leading-relaxed font-semibold">
                        {asset.credibilityGapProved}
                      </p>
                    </div>

                    {/* Interactive Checklist Grid */}
                    <div className="space-y-2.5 pt-2">
                      <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">Completion Checklist</span>
                      <div className="space-y-2">
                        {asset.completionChecklist.map((item, idx) => {
                          const isChecked = checkedDeliverables[asset.id]?.includes(item) || false;
                          return (
                            <motion.label
                              key={idx}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => toggleDeliverable(asset.id, item)}
                              className={cn(
                                "flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer select-none transition-all",
                                isChecked ? "border-[#0058be] bg-[#0058be]/5" : "border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50"
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                readOnly
                                className="w-3.5 h-3.5 rounded text-[#0058be] border-neutral-300 focus:ring-[#0058be] mt-0.5 shrink-0"
                              />
                              <span className="text-[11px] text-neutral-600 leading-normal font-semibold">
                                {item}
                              </span>
                            </motion.label>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Ethics Guardrails Warnings */}
                  {warnings.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100/50 space-y-1.5 mt-auto">
                      <span className="text-[9px] font-black text-amber-800 uppercase tracking-widest flex items-center gap-1.5">
                        <ShieldAlert size={12} className="text-amber-700" />
                        What NOT to Claim
                      </span>
                      <ul className="space-y-1">
                        {warnings.map((item, idx) => (
                          <li key={idx} className="text-[10px] text-amber-800/90 leading-relaxed font-semibold flex items-start gap-1.5 pl-0.5">
                            <span className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
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
