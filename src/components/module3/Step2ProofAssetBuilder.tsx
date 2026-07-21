import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ArrowLeft, ArrowRight, Check, AlertTriangle, Layout, Target, CheckCircle2, ShieldAlert, Award, FileText, Info, Edit2, Search,
  Video, Film, Scissors, Tv, Play, Code, Cpu, Zap, Globe, Layers, GitBranch, BookOpen, MessageSquare, Folder, LineChart, TrendingUp, PenTool,
  RotateCcw, ShieldCheck, Filter, Bookmark, Laptop, HelpCircle, CheckCircle, Shield, Lock, Eye, AlertCircle
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

const getBlueprintMetadata = (format: string) => {
  const fmt = format.toLowerCase();
  if (fmt.includes('video') || fmt.includes('reel') || fmt.includes('showreel') || fmt.includes('clips')) {
    return {
      goal: "Prove narrative pacing & viewer retention capability.",
      difficulty: "Medium",
      time: "2 Hours",
      roi: 5,
      impact: "95",
      trustImpact: "High",
      whyMatters: "Buyers review pacing hooks first; a walkthrough holds attention better than a raw resume link.",
      mistakes: "Using long graphic intros or neglecting audio normalization levels.",
      outcome: "Client stays engaged through the critical first 30 seconds of your pitch.",
      criteria: [
        "Video length stays between 2-3 minutes max",
        "Pattern interrupt hook in the first 5 seconds",
        "Shows timeline workflow cuts directly in video editor",
        "Audio is fully normalized with zero volume spikes",
        "Hosted on a public platform (YouTube/Vimeo/Drive)"
      ]
    };
  }
  if (fmt.includes('before') || fmt.includes('comparison')) {
    return {
      goal: "Demonstrate direct problem-solving & objective outcome changes.",
      difficulty: "Medium",
      time: "3 Hours",
      roi: 4,
      impact: "88",
      trustImpact: "Very High",
      whyMatters: "Clients need to see the difference between raw assets and your optimized deliverables.",
      mistakes: "Not labeling baseline vs. optimized version or using mock metrics without logical proof.",
      outcome: "Buyer instantly recognizes the visual and metric speedups of your work.",
      criteria: [
        "Clear baseline vs. optimized split-screen comparison",
        "Explains decision process in text overlays or narration",
        "Details target metric improvements explicitly in title",
        "Matches ideal client market format standard"
      ]
    };
  }
  if (fmt.includes('website') || fmt.includes('code') || fmt.includes('automation')) {
    return {
      goal: "Prove backend sync architecture and production reliability.",
      difficulty: "Hard",
      time: "4 Hours",
      roi: 4,
      impact: "84",
      trustImpact: "High",
      whyMatters: "Proves that your structures will not trigger service crashes under real commercial load.",
      mistakes: "Lack of repository documentation or leaving secrets/API keys exposed.",
      outcome: "Engineering teams approve your integration and fast-track hiring.",
      criteria: [
        "Publicly accessible codebase or logic flow link",
        "Structured README detailing component architecture",
        "Features automated error handling path",
        "Secrets and private keys fully parameterized"
      ]
    };
  }
  return {
    goal: "Verify target buyer copy response & click-through rates.",
    difficulty: "Easy",
    time: "1.5 Hours",
    roi: 3,
    impact: "70",
    trustImpact: "Medium",
    whyMatters: "Copywriters must prove they can match brand voice and design persuasive call-to-actions.",
    mistakes: "Writing generic template lines without local context or market positioning.",
    outcome: "Client reads your cold copy draft and books a discovery call.",
    criteria: [
      "Direct headline hook targeting local market skepticism",
      "Persuasive call-to-action layout optimized for clicks",
      "Short, readable paragraphs with bold highlights",
      "Matches target voice archetype exactly"
    ]
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

  // Custom blueprint title overrides
  const [customTitles, setCustomTitles] = useState<Record<string, string>>({});
  const [customMetrics, setCustomMetrics] = useState<Record<string, string>>({});

  // Active definition-of-done criteria checklist (Local simulation state)
  const [completedCriteria, setCompletedCriteria] = useState<Record<string, string[]>>({});

  // RPG category filters
  const [activeFilter, setActiveFilter] = useState<'all' | 'craft' | 'reliability' | 'impact'>('all');

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

  const toggleCriteria = (assetId: string, criterion: string) => {
    setCompletedCriteria(prev => {
      const currentList = prev[assetId] || [];
      const updated = currentList.includes(criterion)
        ? currentList.filter(c => c !== criterion)
        : [...currentList, criterion];
      return { ...prev, [assetId]: updated };
    });
  };

  const isProjectCompleted = (asset: any) => {
    const meta = getBlueprintMetadata(asset.assetType);
    const completed = completedCriteria[asset.id] || [];
    return meta.criteria.length > 0 && meta.criteria.every(c => completed.includes(c));
  };

  const projectStates = useMemo(() => {
    const states: Record<string, { isUnlocked: boolean; isCompleted: boolean }> = {};
    if (assets.length > 0) {
      // Priority #1 is always unlocked
      const p1Completed = isProjectCompleted(assets[0]);
      states[assets[0].id] = { isUnlocked: true, isCompleted: p1Completed };

      // Priority #2 requires Priority #1 completed
      if (assets.length > 1) {
        const p2Unlocked = p1Completed;
        const p2Completed = isProjectCompleted(assets[1]);
        states[assets[1].id] = { isUnlocked: p2Unlocked, isCompleted: p2Completed };

        // Priority #3 requires Priority #2 completed
        if (assets.length > 2) {
          const p3Unlocked = p2Completed;
          const p3Completed = isProjectCompleted(assets[2]);
          states[assets[2].id] = { isUnlocked: p3Unlocked, isCompleted: p3Completed };
        }
      }
    }
    return states;
  }, [assets, completedCriteria]);

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

  // Gap analysis lists
  const currentProofList = useMemo(() => {
    return availableAssets.map(id => ({ id, label: getAssetLabel(id) }));
  }, [availableAssets]);

  const missingProofList = useMemo(() => {
    return templates
      .filter(t => !availableAssets.includes(t.id))
      .map(t => ({ id: t.id, label: getAssetLabel(t.id) }));
  }, [templates, availableAssets]);

  // Calibration progress
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

  // Real-time client readiness score
  const clientReadinessScore = useMemo(() => {
    let score = calibrationPercent * 0.35; // base from scan
    if (assets.length > 0 && projectStates[assets[0].id]?.isCompleted) score += 20;
    if (assets.length > 1 && projectStates[assets[1].id]?.isCompleted) score += 20;
    if (assets.length > 2 && projectStates[assets[2].id]?.isCompleted) score += 25;
    return Math.min(Math.round(score), 100);
  }, [calibrationPercent, assets, projectStates]);

  const buyerQuestionCoverage = useMemo(() => {
    const hasShowreel = availableAssets.some(id => ['showreel', 'youtube_videos', 'figma_portfolio', 'github_code'].includes(id));
    const hasCaseStudy = availableAssets.some(id => ['design_case_study', 'case_studies', 'client_work'].includes(id));
    const hasTestimonials = availableAssets.some(id => ['testimonials', 'client_testimonials'].includes(id));
    const hasResults = availableAssets.some(id => ['before_after_edits', 'metrics_results', 'conversion_metrics'].includes(id));

    return [
      { q: "Can you do the work?", satisfied: hasShowreel || (assets.length > 0 && projectStates[assets[0].id]?.isCompleted) },
      { q: "Have you done it before?", satisfied: hasCaseStudy || (assets.length > 1 && projectStates[assets[1].id]?.isCompleted) },
      { q: "Can I trust you?", satisfied: hasTestimonials },
      { q: "Will I get results?", satisfied: hasResults || (assets.length > 2 && projectStates[assets[2].id]?.isCompleted) }
    ];
  }, [availableAssets, assets, projectStates]);

  // Coverage statistics
  const coverageMetrics = useMemo(() => {
    const base = calculateCoverage(availableAssets);
    
    // Add completed projects weights
    if (assets.length > 0 && projectStates[assets[0].id]?.isCompleted) {
      base.skill = Math.min(base.skill + 20, 100);
      base.trust = Math.min(base.trust + 10, 100);
    }
    if (assets.length > 1 && projectStates[assets[1].id]?.isCompleted) {
      base.results = Math.min(base.results + 30, 100);
      base.trust = Math.min(base.trust + 15, 100);
    }
    if (assets.length > 2 && projectStates[assets[2].id]?.isCompleted) {
      base.socialProof = Math.min(base.socialProof + 35, 100);
      base.authority = Math.min(base.authority + 15, 100);
    }
    return base;
  }, [availableAssets, assets, projectStates]);

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

      {/* Strategic Foundation Card */}
      <div className="p-6 rounded-3xl border border-neutral-200/80 bg-white shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
          <Award className="w-5 h-5 text-[#0058be]" />
          <h4 className="text-xs font-black uppercase tracking-wider text-[#0b1c30]">
            Strategic Positioning Foundation
          </h4>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="bg-[#0058be]/10 text-[#0058be] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-[#0058be]/20 shrink-0">
            {authorityProfile.position} positioning
          </div>
          <p className="text-sm font-semibold text-[#0b1c30] leading-relaxed italic">
            "{authorityProfile.coreTrustPromise}"
          </p>
        </div>
      </div>

      {/* SECTION 2: SCAN & INVENTORY YOUR STARTING MATERIALS */}
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

        {/* HUD calibration progress bar */}
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

        {/* Category Filters */}
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

        {/* Checkbox cards grid */}
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

      {/* SECTION 3: PROOF EXECUTION INTELLIGENCE (STRATEGY ENGINE) */}
      <section className="space-y-8">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-[#0058be]" />
          <h3 className="text-sm font-extrabold text-[#0b1c30] uppercase tracking-wider">
            Proof Execution Intelligence
          </h3>
        </div>

        {/* ROW 1: TRUST SCORES & CLIENT READINESS HUD METERS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Client Readiness gauge (Arc style) */}
          <div className="md:col-span-4 bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between items-center text-center space-y-4">
            <div className="w-full">
              <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
                Primary indicator
              </span>
              <h4 className="text-xs font-black text-[#0b1c30] uppercase tracking-wide">
                Client Readiness Score
              </h4>
            </div>

            {/* Circular score gauge */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                <motion.circle 
                  cx="50" cy="50" r="40" stroke="#0058be" strokeWidth="8" fill="transparent" 
                  strokeDasharray="251.2"
                  animate={{ strokeDashoffset: 251.2 - (251.2 * clientReadinessScore) / 100 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-[#0b1c30]">{clientReadinessScore}%</span>
                <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Confidence</span>
              </div>
            </div>

            {/* Buyer confidence question checks */}
            <div className="w-full text-left space-y-2 pt-3 border-t border-neutral-100">
              <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block mb-1">
                Buyer Psychological Coverage:
              </span>
              {buyerQuestionCoverage.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-neutral-600">{item.q}</span>
                  <span className={cn(
                    "text-[9px] font-black uppercase tracking-wider",
                    item.satisfied ? "text-emerald-600" : "text-amber-600"
                  )}>
                    {item.satisfied ? '✓ Proved' : '✗ Gap'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Score Heatmap grid */}
          <div className="md:col-span-4 bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
                Trust Heatmap
              </span>
              <h4 className="text-xs font-black text-[#0b1c30] uppercase tracking-wide">
                Trust Dimension Coverage
              </h4>
            </div>

            <div className="space-y-3.5 flex-1 justify-center flex flex-col">
              {[
                { name: 'Skill', value: coverageMetrics.skill, desc: 'Technical execution proof' },
                { name: 'Trust', value: coverageMetrics.trust, desc: 'Reliability & standards' },
                { name: 'Results', value: coverageMetrics.results, desc: 'Measurable client ROI' },
                { name: 'Authority', value: coverageMetrics.authority, desc: 'Mechanism positioning' },
                { name: 'Social Proof', value: coverageMetrics.socialProof, desc: 'Testimonials coverage' },
              ].map(dim => (
                <div key={dim.name} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-[#0b1c30]">
                    <span>{dim.name}</span>
                    <span>{dim.value}%</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      className={cn(
                        "h-full rounded-full",
                        dim.value > 70 ? "bg-emerald-500" : dim.value > 40 ? "bg-blue-500" : "bg-amber-500"
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${dim.value}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Strategic Coach & Opportunity Cost */}
          <div className="md:col-span-4 bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div>
                <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
                  AI Strategic Advisor
                </span>
                <h4 className="text-xs font-black text-[#0b1c30] uppercase tracking-wide">
                  Opportunity Cost Analysis
                </h4>
              </div>

              {/* Opportunity Cost comparison card */}
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100/50 space-y-2">
                <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">
                  Efficiency Comparison:
                </span>
                <div className="flex justify-between text-[10px] font-bold border-b border-neutral-200 pb-1.5">
                  <div className="text-neutral-500">Website: <span className="text-[#0b1c30]">10h (+7% trust)</span></div>
                  <div className="text-neutral-500">Walkthrough: <span className="text-emerald-600">3h (+24% trust)</span></div>
                </div>
                <p className="text-[10px] text-neutral-500 leading-relaxed font-semibold">
                  💡 <span className="text-[#0058be]">Recommendation:</span> Build your Walkthrough Video first. It provides 3.4x higher trust return per hour spent.
                </p>
              </div>

              {/* Cost penalty description */}
              <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100/50 flex items-start gap-2 text-amber-800">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <div className="text-[10px] font-semibold leading-relaxed">
                  <span className="font-extrabold uppercase">Skipping Testimonials:</span>
                  <div className="grid grid-cols-3 gap-1 mt-1 text-[9px] font-black">
                    <span className="text-red-700">Trust -18%</span>
                    <span className="text-red-700">Replies -12%</span>
                    <span className="text-red-700">Close -9%</span>
                  </div>
                </div>
              </div>
            </div>

            {weakDimensions.length > 0 && (
              <span className="text-[9px] text-neutral-400 font-semibold block leading-relaxed pt-2 border-t border-neutral-100">
                ⚠️ You are weak in <span className="underline">{weakDimensions.join(', ')}</span>. The recommended progression path below balances these dimensions.
              </span>
            )}
          </div>
        </div>

        {/* ROW 2: SYMMETRICAL 3-COLUMN PROGRESSION MAP (UNLOCK SYSTEM) */}
        {assets.length > 0 && (
          <div className="space-y-4">
            <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
              Ecosystem progression map
            </span>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {assets.map((asset, idx) => {
                const state = projectStates[asset.id] || { isUnlocked: false, isCompleted: false };
                const meta = getBlueprintMetadata(asset.assetType);
                const warnings = getPersonalizedWarnings(asset.assetType, authorityProfile.position);

                return (
                  <div 
                    key={asset.id}
                    className={cn(
                      "bg-white border rounded-3xl p-5 flex flex-col justify-between space-y-5 transition-all relative overflow-hidden",
                      state.isUnlocked 
                        ? state.isCompleted
                          ? "border-emerald-200 bg-emerald-50/10 shadow-sm"
                          : "border-neutral-200 bg-white shadow-sm"
                        : "border-neutral-100 bg-neutral-50/30 opacity-70"
                    )}
                  >
                    {/* Locked/Completed Overlay screen */}
                    {!state.isUnlocked && (
                      <div className="absolute inset-0 bg-neutral-900/5 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-4 z-10 select-none">
                        <Lock className="w-8 h-8 text-neutral-400 mb-2" />
                        <span className="text-xs font-black text-neutral-500 uppercase tracking-wider">Project Locked</span>
                        <span className="text-[10px] text-neutral-400 max-w-[200px] leading-relaxed mt-1 font-semibold">
                          Complete Priority #{idx} quality criteria first.
                        </span>
                      </div>
                    )}

                    <div className="space-y-4 flex-grow">
                      {/* Priority title & score */}
                      <div className="flex justify-between items-start gap-2 border-b border-neutral-100 pb-3">
                        <div>
                          <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
                            Priority #{idx + 1}
                          </span>
                          <span className="text-xs font-black text-[#0b1c30] block mt-0.5">
                            {customTitles[asset.id] || asset.title}
                          </span>
                        </div>

                        {/* ROI Score */}
                        <div className="text-right shrink-0">
                          <span className="text-[9px] font-extrabold text-neutral-400 block uppercase tracking-widest">ROI</span>
                          <div className="flex items-center gap-0.5 text-amber-500 mt-0.5">
                            {Array.from({ length: meta.roi }).map((_, i) => (
                              <Sparkles key={i} size={8} fill="currentColor" />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Goal & Time stats */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-neutral-500">
                        <div>Time: <span className="text-[#0b1c30]">{meta.time}</span></div>
                        <div>Difficulty: <span className="text-[#0b1c30]">{meta.difficulty}</span></div>
                        <div className="col-span-2 mt-1">Goal: <span className="text-neutral-600 font-semibold">{meta.goal}</span></div>
                      </div>

                      {/* Definition of Done criteria list */}
                      <div className="space-y-2 pt-2">
                        <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
                          Definition of Done:
                        </span>
                        <div className="space-y-1.5">
                          {meta.criteria.map((c, cIdx) => {
                            const isChecked = completedCriteria[asset.id]?.includes(c) || false;
                            return (
                              <motion.button
                                key={cIdx}
                                whileTap={{ scale: 0.99 }}
                                disabled={!state.isUnlocked}
                                onClick={() => toggleCriteria(asset.id, c)}
                                className={cn(
                                  "w-full text-left flex items-start gap-2 p-2 rounded-xl border text-[11px] font-semibold transition-colors cursor-pointer",
                                  isChecked 
                                    ? "border-emerald-200 bg-emerald-500/5 text-emerald-800" 
                                    : "border-neutral-100 bg-neutral-50 hover:bg-neutral-100"
                                )}
                              >
                                <div className={cn(
                                  "w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5",
                                  isChecked ? "bg-emerald-500 border-emerald-500 text-white" : "border-neutral-300 bg-white"
                                )}>
                                  {isChecked && <Check size={8} strokeWidth={3} />}
                                </div>
                                <span>{c}</span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      {/* AI Strategic Coach card info */}
                      <div className="p-3 bg-neutral-50/80 border border-neutral-100/50 rounded-2xl space-y-1.5 text-[10px] text-neutral-500">
                        <div>
                          <span className="font-black uppercase tracking-wider text-[#0b1c30] block mb-0.5">Why it matters:</span>
                          <p className="leading-relaxed font-semibold">{meta.whyMatters}</p>
                        </div>
                        <div>
                          <span className="font-black uppercase tracking-wider text-red-600 block mb-0.5">Common mistake:</span>
                          <p className="leading-relaxed font-semibold">{meta.mistakes}</p>
                        </div>
                      </div>
                    </div>

                    {/* Guardrails (What NOT to Claim) */}
                    {warnings.length > 0 && (
                      <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-100/50 space-y-1 mt-auto">
                        <span className="text-[8px] font-black text-amber-800 uppercase tracking-widest flex items-center gap-1">
                          <ShieldAlert size={10} className="text-amber-700" />
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
              })}
            </div>
          </div>
        )}
      </section>

      {/* PART 5: PROOF STRATEGY SUMMARY & APPROVAL */}
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
                Roadmap Summary
              </span>
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-xs">
                  <Check className="text-blue-400 w-4 h-4 shrink-0" strokeWidth={3} />
                  <span>Build 3 Priority Projects to fill trust gaps</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <Check className="text-blue-400 w-4 h-4 shrink-0" strokeWidth={3} />
                  <span>Verify pacing, quality standard, and outcome metrics</span>
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
