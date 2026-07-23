import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ArrowLeft, ArrowRight, CheckCircle2, Award, FileText, Check, Copy, ExternalLink,
  Video, Film, Scissors, Tv, Play, Code, Zap, Globe, Layers, GitBranch, BookOpen, MessageSquare, Folder, LineChart, TrendingUp, PenTool,
  RotateCcw, ShieldCheck, Filter, Bookmark, Layout, AlertCircle, RefreshCw, Upload, CheckCircle, ShieldAlert, Lock, ArrowUpRight,
  X, ChevronLeft, ChevronRight, Clock
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Pointer } from '../magicui/pointer';
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

const getBlueprintMetadata = (format: string) => {
  const fmt = format.toLowerCase();
  if (fmt.includes('video') || fmt.includes('reel') || fmt.includes('showreel') || fmt.includes('clips')) {
    return {
      goal: "Prove narrative pacing & viewer retention capability.",
      difficulty: "Medium",
      time: "2 Hours",
      roi: 5,
      impact: "25",
      buyerProblem: "Client is skeptical that you can hold viewer attention for longer than 10 seconds.",
      trustGap: "Requires direct attention validation proof rather than a static text portfolio.",
      whyMatters: "SaaS founders and agents review pacing hooks first; a walkthrough video holds attention better than static image slides.",
      mistakes: "Using long graphic intros or neglecting audio normalization levels.",
      outcome: "Client stays engaged through the critical first 30 seconds of your pitch.",
      achievementLabel: "Showreel Pacing Verified ✓",
      prereqLabel: "Requires: Walkthrough Video Scan",
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
      impact: "20",
      buyerProblem: "Client has worked with amateur editors and fears wasted revisions.",
      trustGap: "Requires comparison logs showing before vs after execution standards.",
      whyMatters: "Clients need to see the difference between raw assets and your optimized deliverables.",
      mistakes: "Not labeling baseline vs. optimized version or using mock metrics without logical proof.",
      outcome: "Buyer instantly recognizes the visual and metric speedups of your work.",
      achievementLabel: "Split-Screen Pacing Verified ✓",
      prereqLabel: "Requires: Before/After Breakdown Check",
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
      impact: "15",
      buyerProblem: "Client is worried your workflows will crash when scaling operations.",
      trustGap: "Requires verified execution scripts and live error handling pathways.",
      whyMatters: "Proves that your structures will not trigger service crashes under real commercial load.",
      mistakes: "Lack of repository documentation or leaving secrets/API keys exposed.",
      outcome: "Engineering teams approve your integration and fast-track hiring.",
      achievementLabel: "Production Workspace Online ✓",
      prereqLabel: "Requires: Live Sandbox Deploy",
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
    impact: "10",
    buyerProblem: "Client is afraid your copy will sound generic and fail to get replies.",
    trustGap: "Requires proof of local market empathy and custom objection handling.",
    whyMatters: "Copywriters must prove they can match brand voice and design persuasive call-to-actions.",
    mistakes: "Writing generic template lines without local context or market positioning.",
    outcome: "Client reads your cold copy draft and books a discovery call.",
    achievementLabel: "Objection Copy Approved ✓",
    prereqLabel: "Requires: Custom Objection Hook Verify",
    criteria: [
      "Direct headline hook targeting local market skepticism",
      "Persuasive call-to-action layout optimized for clicks",
      "Short, readable paragraphs with bold highlights",
      "Matches target voice archetype exactly"
    ]
  };
};

const getHubResources = (assetId: string) => {
  const defaults = {
    tutorial: "https://www.youtube.com/results?search_query=how+to+build+portfolio+for+freelance",
    prompt: `Act as a positioning strategist. Draft a highly compelling copy hook targeting my target market. Highlight how I solve common industry issues. Keep it brief.`,
    quickStart: "Template Outline Doc",
    quickStartUrl: "#",
    tools: ["Notion", "Google Docs"],
    templates: ["Proof Asset Outline Layout"],
    cheatSheet: "Ensure key client objections are addressed in the first paragraph.",
    examples: [
      { name: "Sample Case Study Structure", url: "#" },
      { name: "Objection-Buster Layout Blueprint", url: "#" }
    ]
  };

  if (assetId.includes('video') || assetId.includes('reel') || assetId.includes('showreel') || assetId.includes('clips')) {
    return {
      tutorial: "https://www.youtube.com/results?search_query=how+to+create+a+video+editing+showreel",
      prompt: `Act as a video scripting coach. Write a high-retention 3-part script outline for my showreel. The first 5 seconds must address target agent objections regarding editing pacing. Deliverable formats: hook, breakdown, visual proof overlay script.`,
      quickStart: "Showreel Hook Sequence Blueprint",
      quickStartUrl: "#",
      tools: ["Premiere Pro", "DaVinci Resolve", "CapCut"],
      templates: ["Sequence pacing cheat sheet", "Audio level normalizer preset"],
      cheatSheet: "Pacing hooks: cut every 1.5 seconds during the intro. Add zoom maps to maintain attention.",
      examples: [
        { name: "Example 1: Real Estate Walkthrough (3.2x Pacing)", url: "#" },
        { name: "Example 2: Commercial Pacing Breakdown", url: "#" },
        { name: "Example 3: Reel Retention Optimization Edit", url: "#" }
      ]
    };
  }
  if (assetId.includes('before') || assetId.includes('comparison')) {
    return {
      tutorial: "https://www.youtube.com/results?search_query=before+after+editing+breakdown+tutorial",
      prompt: `Act as a commercial design consultant. Draft a narration script comparing a baseline client project vs. my high-end pacing optimizations. Show how bad cuts result in drop-offs, while custom overlays boost retention.`,
      quickStart: "Split-Screen visual template",
      quickStartUrl: "#",
      tools: ["Premiere Pro", "Canva Split Screen"],
      templates: ["Pacing Comparison Layout Split-Screen", "Retention Graph Mockup Asset"],
      cheatSheet: "Do not say 'bad edit'. Highlight: 'Optimized pacing logic recovering simulated drop-off graph'.",
      examples: [
        { name: "Example 1: Pacing Audit: Raw Footage vs Edited Sync", url: "#" },
        { name: "Example 2: Color Grade & Sound Design Before/After", url: "#" },
        { name: "Example 3: Social Reel Hook split screen comparison", url: "#" }
      ]
    };
  }
  if (assetId.includes('website') || assetId.includes('live') || assetId.includes('portfolio') || assetId.includes('code')) {
    return {
      tutorial: "https://www.youtube.com/results?search_query=build+framer+portfolio+from+scratch",
      prompt: `Act as a landing page copywriter. Write a clean landing page layout for my UI/UX design portfolio. Target SaaS startup founders. Write a bold hero hook, objection-buster FAQ section, and a structural layout outline.`,
      quickStart: "Framer Starter Theme",
      quickStartUrl: "#",
      tools: ["Framer", "Webflow", "GitHub Pages"],
      templates: ["Responsive CSS Grid Boilerplate", "Portfolio README Markdown layout"],
      cheatSheet: "Hero title: State the specific conversion outcome you guarantee in one line.",
      examples: [
        { name: "Example 1: Minimalist Framer Portfolio Case Study", url: "#" },
        { name: "Example 2: Dev Repo README structure walkthrough", url: "#" },
        { name: "Example 3: UX Portfolio interactive prototype", url: "#" }
      ]
    };
  }
  if (assetId.includes('testimonial') || assetId.includes('client')) {
    return {
      tutorial: "https://www.youtube.com/results?search_query=how+to+ask+clients+for+testimonials",
      prompt: `Draft a friendly, non-annoying testimonial request script to send to clients via email or WhatsApp. Frame it around confirming the metrics achieved during execution.`,
      quickStart: "WhatsApp Outreach Boilerplate",
      quickStartUrl: "#",
      tools: ["Gmail", "Senja Testimonials"],
      templates: ["Testimonial Request Template", "Follow-up email template"],
      cheatSheet: "Provide three bullet points to prompt them: the situation before, the mechanism, and the metric outcome.",
      examples: [
        { name: "Example 1: Video testimonial prompt guide", url: "#" },
        { name: "Example 2: Client Metric Validation Script", url: "#" }
      ]
    };
  }

  return defaults;
};

const runVerificationAudit = (assetId: string, url: string) => {
  const cleanUrl = url.trim().toLowerCase();
  if (!cleanUrl.includes('.') || cleanUrl.length < 5) {
    return {
      isValid: false,
      completeness: 0,
      score: "0/10",
      improvements: ["Provide a valid public URL (e.g. GitHub link, website link, Drive file, or YouTube link)."],
    };
  }

  if (assetId.includes('video') || assetId.includes('showreel')) {
    return {
      isValid: true,
      completeness: 92,
      score: "8.9/10",
      improvements: [
        "Include bold pacing subtitle overlays at the 3-second mark to capture attention.",
        "Add a 5-second outro displaying a public email or calendar scheduling link."
      ]
    };
  }
  if (assetId.includes('before') || assetId.includes('comparison')) {
    return {
      isValid: true,
      completeness: 95,
      score: "9.2/10",
      improvements: [
        "Include text overlays explicitly stating the estimated time saved or watch time added.",
        "Label baseline split-screen blocks clearly."
      ]
    };
  }
  return {
    isValid: true,
    completeness: 88,
    score: "8.2/10",
    improvements: [
      "Detail your Unique Mechanism directly in the top description.",
      "Add screenshots showing design system variables or core modules."
    ]
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
  
  const generateProofAssetStrategy = useModule3Store((s) => s.generateProofAssetStrategy);
  const approveProofAssetStrategy = useModule3Store((s) => s.approveProofAssetStrategy);
  const confirmStep = useModule3Store((s) => s.confirmStep);
  const nextStep = useModule3Store((s) => s.nextStep);
  const previousStep = useModule3Store((s) => s.previousStep);
  
  const completedSteps = useModule3Store((s) => s.completedSteps);
  const isCompleted = completedSteps.includes('proof_asset_builder');

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'craft' | 'reliability' | 'impact'>('all');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  // Verification Input & Progress animation states
  const [verificationUrl, setVerificationUrl] = useState('');
  const [verificationProgress, setVerificationProgress] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [auditResult, setAuditResult] = useState<any>(null);

  // Dopamine feedback metrics
  const [showDopamineFeedback, setShowDopamineFeedback] = useState(false);
  const [readinessDelta, setReadinessDelta] = useState<{ from: number; to: number } | null>(null);

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

  const [skippedAssetIds, setSkippedAssetIds] = useState<string[]>([]);
  const [isSkipping, setIsSkipping] = useState(false);

  // activeQueue: Missing assets that are NOT skipped.
  // Sort them by trust gain / impact descending (highest impact first!).
  const activeQueue = useMemo(() => {
    const unfiltered = templates.filter(t => !availableAssets.includes(t.id) && !skippedAssetIds.includes(t.id));
    return [...unfiltered].sort((a, b) => {
      const aMeta = getBlueprintMetadata(a.id);
      const bMeta = getBlueprintMetadata(b.id);
      return parseInt(bMeta.impact) - parseInt(aMeta.impact);
    });
  }, [templates, availableAssets, skippedAssetIds]);

  // skippedQueue: Missing assets that have been skipped.
  const skippedQueue = useMemo(() => {
    return templates.filter(t => !availableAssets.includes(t.id) && skippedAssetIds.includes(t.id));
  }, [templates, availableAssets, skippedAssetIds]);

  // Backward-compatible computed missing assets list
  const missingAssets = useMemo(() => {
    return [...activeQueue, ...skippedQueue];
  }, [activeQueue, skippedQueue]);

  const assets = useMemo(() => {
    return templates;
  }, [templates]);

  // Project unlock and status logic for missing assets
  const projectStates = useMemo(() => {
    const states: Record<string, { isUnlocked: boolean; isCompleted: boolean; prereqName?: string }> = {};
    if (activeQueue.length > 0) {
      // First active missing asset is always unlocked
      states[activeQueue[0].id] = { isUnlocked: true, isCompleted: false };

      // Subsequent active missing assets are locked in sequence
      for (let i = 1; i < activeQueue.length; i++) {
        states[activeQueue[i].id] = { 
          isUnlocked: false, 
          isCompleted: false, 
          prereqName: getAssetLabel(activeQueue[i - 1].id) 
        };
      }
    }
    // Skipped items are marked unlocked so they can be selected directly on click
    skippedQueue.forEach(item => {
      states[item.id] = { isUnlocked: true, isCompleted: false };
    });
    return states;
  }, [activeQueue, skippedQueue]);

  // Currently focused project ID in Section 3
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const activeProject = useMemo(() => {
    if (activeQueue.length === 0) {
      if (skippedQueue.length > 0) {
        return skippedQueue.find(a => a.id === selectedAssetId) || null;
      }
      return null;
    }
    return activeQueue.find(a => a.id === selectedAssetId) || activeQueue[0];
  }, [activeQueue, skippedQueue, selectedAssetId]);

  // Synchronize selection when active queue updates
  useEffect(() => {
    if (activeQueue.length > 0) {
      if (!activeQueue.some(a => a.id === selectedAssetId)) {
        setSelectedAssetId(activeQueue[0].id);
      }
    } else if (skippedQueue.length > 0) {
      if (!skippedQueue.some(a => a.id === selectedAssetId)) {
        setSelectedAssetId(null);
      }
    }
  }, [activeQueue, skippedQueue, selectedAssetId]);

  const [activeWorkspaceAssetId, setActiveWorkspaceAssetId] = useState<string | null>(null);
  const [workspaceTab, setWorkspaceTab] = useState<'prompt' | 'verify'>('prompt');
  const [modalPage, setModalPage] = useState<1 | 2>(1);
  const [selectedPath, setSelectedPath] = useState<null | 'ai' | 'tutorial' | 'tools' | 'templates'>(null);

  const handleOpenWorkspace = (assetId: string) => {
    setSelectedAssetId(assetId);
    setActiveWorkspaceAssetId(assetId);
    setWorkspaceTab('prompt');
    setModalPage(1);
    setSelectedPath(null);
    setVerificationUrl('');
    setVerificationProgress('idle');
    setAuditResult(null);
    setShowDopamineFeedback(false);
    setIsSkipping(false);
  };

  const handleSkipProject = (assetId: string) => {
    setSkippedAssetIds(prev => [...prev, assetId]);
    setIsSkipping(false);
    setVerificationUrl('');
    setVerificationProgress('idle');
    setAuditResult(null);
    setActiveWorkspaceAssetId(null);
  };

  const handleRevisitProject = (assetId: string) => {
    setSkippedAssetIds(prev => prev.filter(id => id !== assetId));
    setSelectedAssetId(assetId);
    setActiveWorkspaceAssetId(assetId);
    setWorkspaceTab('prompt');
    setModalPage(1);
    setSelectedPath(null);
    setIsSkipping(false);
    setVerificationUrl('');
    setVerificationProgress('idle');
    setAuditResult(null);
  };

  const handleAssetCheckboxChange = (assetId: string, checked: boolean) => {
    const nextAvailable = checked
      ? [...availableAssets, assetId]
      : availableAssets.filter((id) => id !== assetId);
    
    setAvailableAssets(nextAvailable);

    // Save inventory string format
    const inventoryString = nextAvailable.map(getAssetLabel).join(', ');
    useModule3Store.setState({ existingProofInventory: inventoryString });

    // Regenerate strategy automatically
    generateProofAssetStrategy();
    
    // Clear verification fields
    setVerificationUrl('');
    setVerificationProgress('idle');
    setAuditResult(null);
    setShowDopamineFeedback(false);
  };

  const handleClearInventory = () => {
    setAvailableAssets([]);
    setSkippedAssetIds([]);
    setIsSkipping(false);
    useModule3Store.setState({ existingProofInventory: '' });
    generateProofAssetStrategy();
  };

  const handleCopyPrompt = (promptText: string, id: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  // Calibration progress HUD metrics
  const totalAvailable = templates.length;
  const selectedCount = availableAssets.length;
  const calibrationPercent = totalAvailable > 0 
    ? Math.round((selectedCount / totalAvailable) * 100) 
    : 0;

  const calibrationStatus = useMemo(() => {
    if (selectedCount === 0) return { label: 'Raw Potential', color: 'text-amber-600', bg: 'bg-amber-500' };
    if (selectedCount <= 2) return { label: 'Hybrid Authority', color: 'text-blue-600', bg: 'bg-blue-600' };
    return { label: 'Omni Authority', color: 'text-emerald-600', bg: 'bg-emerald-500' };
  }, [selectedCount]);

  // Dynamic Client Readiness calculation
  const getReadinessScore = (equippedList: string[]) => {
    const scanPercent = totalAvailable > 0 ? Math.round((equippedList.length / totalAvailable) * 100) : 0;
    let score = scanPercent * 0.35; // base from inventory scan
    
    if (assets.length > 0 && equippedList.includes(assets[0].id)) score += 20;
    if (assets.length > 1 && equippedList.includes(assets[1].id)) score += 20;
    if (assets.length > 2 && equippedList.includes(assets[2].id)) score += 25;
    
    return Math.min(Math.round(score), 100);
  };

  const currentReadiness = getReadinessScore(availableAssets);

  // Zeigarnik effect values
  const completedProjectsCount = useMemo(() => {
    return assets.filter(a => availableAssets.includes(a.id)).length;
  }, [assets, availableAssets]);

  const projectsCompletePercent = assets.length > 0 
    ? Math.round((completedProjectsCount / assets.length) * 100) 
    : 0;

  // Goal gradient effect callout
  const goalGradientCallout = useMemo(() => {
    if (completedProjectsCount === 2 && assets.length === 3) {
      const simulatedNextReadiness = getReadinessScore([...availableAssets, assets[2].id]);
      return `Complete one more proof project to achieve ${simulatedNextReadiness}% Client Readiness!`;
    }
    return null;
  }, [completedProjectsCount, assets, availableAssets]);

  const handleRunVerification = () => {
    if (!activeProject) return;
    setVerificationProgress('scanning');
    setAuditResult(null);
    setShowDopamineFeedback(false);

    setTimeout(() => {
      const result = runVerificationAudit(activeProject.id, verificationUrl);
      setAuditResult(result);
      setVerificationProgress('done');
    }, 1500);
  };

  const handleAcceptAudit = () => {
    if (!activeProject || !auditResult || !auditResult.isValid) return;
    
    const prevReadiness = currentReadiness;
    handleAssetCheckboxChange(activeProject.id, true);
    
    // Trigger dopamine transition animation
    const nextReadiness = getReadinessScore([...availableAssets, activeProject.id]);
    setReadinessDelta({ from: prevReadiness, to: nextReadiness });
    setShowDopamineFeedback(true);
    setActiveWorkspaceAssetId(null);
  };

  const handleNext = () => {
    setIsGenerating(true);
    generateProofAssetStrategy();
    approveProofAssetStrategy();
    confirmStep();
    setIsGenerating(false);
    nextStep();
  };

  if (!authorityProfile) return null;

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

      {/* SECTION 3: PROOF EXECUTION HUB */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
          <Zap className="w-5 h-5 text-[#0058be]" />
          <h3 className="text-sm font-extrabold text-[#0b1c30] uppercase tracking-wider">
            Section 3 - Proof Completion Hub
          </h3>
        </div>

        {missingAssets.length === 0 ? (
          /* CELEBRATION SCREEN: Client Readiness at 100% */
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full p-8 rounded-3xl border border-emerald-255 bg-emerald-500/[0.03] text-center space-y-6 shadow-sm"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200/50">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-black text-[#0b1c30] tracking-wide">
                Professional Proof Profile Ready ✓
              </h4>
              <p className="text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed font-semibold">
                Your proof assets fully cover all target buyer trust requirements. Your Client Readiness score is at <span className="text-emerald-600 font-black">100%</span>.
              </p>
            </div>

            <div className="flex items-center justify-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Sparkles key={i} size={16} fill="currentColor" />
              ))}
            </div>

            <div className="p-4 bg-white border border-neutral-200 rounded-2xl max-w-md mx-auto space-y-2 text-left">
              <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">
                Verification Summary:
              </span>
              <div className="text-xs text-neutral-600 font-semibold leading-relaxed space-y-1">
                <div>✓ Client Readiness calibrated to maximum</div>
                <div>✓ High-retention visual pacing verified</div>
                <div>✓ 0 trust gaps remain for SaaS startup positioning</div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="bg-[#0058be] hover:bg-blue-700 text-white min-h-[44px] px-8 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md inline-flex items-center gap-1.5"
            >
              Proceed to Portfolio Workspace
              <ArrowRight size={14} />
            </button>
          </motion.div>
        ) : (
          /* REGULAR PROGRESSION SCREEN: Horizontal Gaps Grid & Workspace Launcher */
          <div className="space-y-8">
            
            {/* Horizontal Grid of Gaps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {missingAssets.map((item, idx) => {
                const meta = getBlueprintMetadata(item.id);
                const state = projectStates[item.id] || { isUnlocked: false, isCompleted: false };
                const isSkipped = skippedAssetIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "bg-white border p-5 rounded-2xl flex flex-col justify-between hover:shadow-md hover:border-neutral-300 transition-all duration-300 relative overflow-hidden",
                      isSkipped ? "border-dashed border-amber-300 bg-amber-50/10" : "border-neutral-200"
                    )}
                  >
                    <div className="space-y-4">
                      {/* Top Header Row in Card */}
                      <div className="flex justify-between items-start">
                        <span className={cn(
                          "text-[9px] font-black uppercase px-2 py-0.5 rounded",
                          !state.isUnlocked 
                            ? "bg-neutral-100 text-neutral-400" 
                            : isSkipped 
                              ? "bg-amber-100 text-amber-600" 
                              : "bg-blue-100 text-blue-600"
                        )}>
                          {!state.isUnlocked 
                            ? "Locked" 
                            : isSkipped 
                              ? "Skipped" 
                              : `Rec #${idx + 1}`}
                        </span>

                        <span className="text-[10px] font-black text-emerald-600">
                          +{meta.impact}% Trust
                        </span>
                      </div>

                      {/* Middle Details */}
                      <div className="space-y-1.5 text-left">
                        <h4 className="text-sm font-black text-[#0b1c30] flex items-center gap-1">
                          {!state.isUnlocked && <Lock size={12} className="text-neutral-400 shrink-0" />}
                          {getAssetLabel(item.id)}
                        </h4>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                          Est. Time: {meta.time} | Diff: {meta.difficulty}
                        </p>
                        <p className="text-xs text-neutral-500 font-semibold leading-relaxed line-clamp-2">
                          {isSkipped 
                            ? `Skipping leaves objection: "${meta.buyerProblem}"` 
                            : meta.goal}
                        </p>
                      </div>
                    </div>

                    {/* Bottom CTA Button inside Card */}
                    <div className="pt-4 mt-4 border-t border-neutral-100">
                      {!state.isUnlocked ? (
                        <button
                          disabled
                          className="w-full bg-neutral-50 border border-neutral-100 text-neutral-400 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider cursor-not-allowed flex items-center justify-center gap-1"
                        >
                          <Lock size={10} />
                          Locked: Complete Prereqs
                        </button>
                      ) : isSkipped ? (
                        <button
                          onClick={() => handleRevisitProject(item.id)}
                          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider cursor-pointer transition-colors flex items-center justify-center gap-1"
                        >
                          Revisit & Build
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenWorkspace(item.id)}
                          className="w-full bg-[#0058be] hover:bg-blue-700 text-white py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          Build Asset 🚀
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Dashboard: Circular HUD gauge & Next Best Action info */}
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                {/* Circular Gauge */}
                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                    <motion.circle 
                      cx="50" cy="50" r="40" stroke="#0058be" strokeWidth="8" fill="transparent" 
                      strokeDasharray="251.2"
                      animate={{ strokeDashoffset: 251.2 - (251.2 * currentReadiness) / 100 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-sm font-black text-[#0b1c30]">{currentReadiness}%</span>
                    <span className="text-[6px] font-black text-neutral-400 uppercase tracking-widest">Readiness</span>
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <h4 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider">Client Readiness score</h4>
                  <p className="text-[11px] text-neutral-500 font-semibold">
                    Equipped Proof Assets: <strong className="text-[#0b1c30]">{selectedCount} of {totalAvailable}</strong>
                  </p>
                </div>
              </div>

              {/* Goal gradient Callout or Next recommended action */}
              <div className="flex-1 max-w-lg text-left p-4 bg-neutral-50/80 border border-neutral-100 rounded-2xl">
                {goalGradientCallout ? (
                  <div className="text-[11px] font-bold text-[#0058be] leading-relaxed flex items-start gap-1.5">
                    <Sparkles size={14} className="shrink-0 mt-0.5 text-blue-600" />
                    <span>{goalGradientCallout}</span>
                  </div>
                ) : activeQueue.length > 0 ? (
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">
                      Next Best Action (Highest ROI Gap):
                    </span>
                    <div className="text-xs font-black text-[#0b1c30]">
                      Build {getAssetLabel(activeQueue[0].id)} for a <span className="text-emerald-600">+{getBlueprintMetadata(activeQueue[0].id).impact}%</span> trust gain.
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] font-bold text-emerald-800 leading-normal flex items-start gap-1.5">
                    <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-emerald-600" />
                    <span>All prioritized gaps verified! Revisit any skipped assets or continue.</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </section>

      {/* Immersive Fullscreen Workspace Wizard Modal */}
      <AnimatePresence>
        {activeWorkspaceAssetId && (() => {
          const workspaceProject = templates.find(t => t.id === activeWorkspaceAssetId);
          if (!workspaceProject) return null;

          const meta = getBlueprintMetadata(workspaceProject.id);
          const res = getHubResources(workspaceProject.id);
          const isSkipped = skippedAssetIds.includes(workspaceProject.id);

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#0b1c30]/65 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
            >
              <motion.div
                initial={{ scale: 0.95, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 30 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] shadow-[0_32px_128px_rgba(11,28,48,0.25)] border border-neutral-200/60 overflow-hidden flex flex-col"
              >
                {modalPage === 1 ? (
                  /* PAGE 1: Strategic Brief (Most Important Knowledge) */
                  <div className="flex-1 flex flex-col justify-between p-8 md:p-10 text-left overflow-y-auto">
                    {/* Top Row: Heading and Close */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-[#0058be] uppercase tracking-widest block">
                          Step 1 of 2: Alignment Brief
                        </span>
                        <h2 className="text-2xl md:text-3xl font-black text-[#0b1c30] tracking-tight">
                          Build: {getAssetLabel(workspaceProject.id)}
                        </h2>
                      </div>
                      <button
                        onClick={() => setActiveWorkspaceAssetId(null)}
                        className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors border-none bg-transparent cursor-pointer"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Metadata Pill Row */}
                    <div className="flex flex-wrap gap-3 mb-8">
                      <span className="bg-blue-50 text-[#0058be] text-[10px] font-black uppercase px-3 py-1 rounded-full border border-blue-100/50 flex items-center gap-1">
                        <Clock size={12} />
                        Est. Time: {meta.time}
                      </span>
                      <span className="bg-neutral-50 text-neutral-600 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-neutral-200 flex items-center gap-1">
                        <AlertCircle size={12} />
                        Difficulty: {meta.difficulty}
                      </span>
                      <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-emerald-100/50 flex items-center gap-1">
                        <TrendingUp size={12} />
                        +{meta.impact}% Client Readiness
                      </span>
                    </div>

                    {/* Core Knowledge Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      {/* Objectives Card */}
                      <div className="bg-blue-50/20 border border-blue-100/60 p-6 rounded-2xl space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0058be] flex items-center justify-center">
                            <BookOpen size={18} />
                          </div>
                          <h3 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider">
                            Core Objective
                          </h3>
                          <p className="text-xs font-semibold text-neutral-600 leading-relaxed">
                            {meta.goal}
                          </p>
                        </div>
                      </div>

                      {/* Objections Card */}
                      <div className="bg-amber-50/20 border border-amber-100 p-6 rounded-2xl space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                            <AlertCircle size={18} />
                          </div>
                          <h3 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider">
                            Buyer Objection
                          </h3>
                          <p className="text-xs font-bold text-neutral-800 leading-relaxed italic">
                            "{meta.buyerProblem}"
                          </p>
                        </div>
                      </div>

                      {/* Strategy Card */}
                      <div className="bg-emerald-50/20 border border-emerald-100/60 p-6 rounded-2xl space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <Sparkles size={18} />
                          </div>
                          <h3 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider">
                            AI Strategy
                          </h3>
                          <p className="text-xs font-semibold text-neutral-600 leading-relaxed">
                            {meta.trustGap}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA Action Bar */}
                    <div className="border-t border-neutral-100 pt-6 flex justify-end">
                      <button
                        onClick={() => setModalPage(2)}
                        className="bg-[#0058be] hover:bg-blue-700 text-white min-h-[46px] px-8 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                      >
                        Choose Execution Path
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* PAGE 2: Path Selection & Detailed Actions */
                  selectedPath === null ? (
                    <div className="flex-1 flex flex-col justify-between p-8 md:p-10 text-left overflow-y-auto">
                      {/* Top Row: Heading and Close */}
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-[#0058be] uppercase tracking-widest block">
                            Step 2 of 2: Path Selection
                          </span>
                          <h2 className="text-2xl md:text-3xl font-black text-[#0b1c30] tracking-tight">
                            Choose Path: {getAssetLabel(workspaceProject.id)}
                          </h2>
                          <p className="text-xs text-neutral-500 font-semibold mt-1">
                            Select your preferred way to build and verify this proof asset.
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveWorkspaceAssetId(null)}
                          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors border-none bg-transparent cursor-pointer"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      {/* 4 Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto py-4">
                        {/* AI Card */}
                        <div className="relative overflow-hidden rounded-2xl">
                          <button
                            onClick={() => setSelectedPath('ai')}
                            className="group w-full h-full p-6 rounded-2xl border border-blue-100 bg-blue-50/20 hover:bg-blue-50/50 hover:border-blue-300 hover:shadow-md transition-all text-left flex items-start gap-4 cursor-pointer"
                          >
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0058be] flex items-center justify-center shrink-0">
                              <Sparkles size={22} />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-sm font-black text-[#0b1c30] group-hover:text-[#0058be] transition-colors">Continue with AI</h4>
                              <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                                Generate tailored asset copy and blueprints using customized AI prompts.
                              </p>
                            </div>
                          </button>
                          <Pointer>
                            <div className="flex items-center gap-1 bg-[#0058be] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg border border-blue-400">
                              <Sparkles size={10} /> AI
                            </div>
                          </Pointer>
                        </div>

                        {/* Tutorial Card */}
                        <div className="relative overflow-hidden rounded-2xl">
                          <button
                            onClick={() => setSelectedPath('tutorial')}
                            className="group w-full h-full p-6 rounded-2xl border border-red-100 bg-red-50/20 hover:bg-red-50/50 hover:border-red-300 hover:shadow-md transition-all text-left flex items-start gap-4 cursor-pointer"
                          >
                            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-500 flex items-center justify-center shrink-0">
                              <Play size={22} fill="currentColor" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-sm font-black text-[#0b1c30] group-hover:text-red-650 transition-colors">Watch Tutorials</h4>
                              <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                                Step-by-step video guides and walkthroughs for this asset niche.
                              </p>
                            </div>
                          </button>
                          <Pointer>
                            <div className="flex items-center gap-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg border border-red-400">
                              <Play size={10} fill="currentColor" /> Play
                            </div>
                          </Pointer>
                        </div>

                        {/* Tools Card */}
                        <div className="relative overflow-hidden rounded-2xl">
                          <button
                            onClick={() => setSelectedPath('tools')}
                            className="group w-full h-full p-6 rounded-2xl border border-emerald-100 bg-emerald-50/20 hover:bg-emerald-50/50 hover:border-emerald-300 hover:shadow-md transition-all text-left flex items-start gap-4 cursor-pointer"
                          >
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                              <Code size={22} />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-sm font-black text-[#0b1c30] group-hover:text-emerald-650 transition-colors">Online Tools</h4>
                              <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                                Access recommended software, web editors, and hosting platforms.
                              </p>
                            </div>
                          </button>
                          <Pointer>
                            <div className="flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg border border-emerald-400">
                              <Code size={10} /> Build
                            </div>
                          </Pointer>
                        </div>

                        {/* Templates Card */}
                        <div className="relative overflow-hidden rounded-2xl">
                          <button
                            onClick={() => setSelectedPath('templates')}
                            className="group w-full h-full p-6 rounded-2xl border border-amber-100 bg-amber-50/20 hover:bg-amber-50/50 hover:border-amber-300 hover:shadow-md transition-all text-left flex items-start gap-4 cursor-pointer"
                          >
                            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                              <FileText size={22} />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-sm font-black text-[#0b1c30] group-hover:text-amber-750 transition-colors">Templates & Docs</h4>
                              <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                                Quick-start templates, outlines, cheat sheets, and examples.
                              </p>
                            </div>
                          </button>
                          <Pointer>
                            <div className="flex items-center gap-1 bg-amber-700 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg border border-amber-500">
                              <FileText size={10} /> Outline
                            </div>
                          </Pointer>
                        </div>
                      </div>

                      {/* Bottom Action Bar */}
                      <div className="border-t border-neutral-100 pt-6 flex justify-between">
                        <button
                          onClick={() => setModalPage(1)}
                          className="px-6 py-2.5 rounded-xl border border-neutral-200 text-[#0b1c30] hover:bg-neutral-50 text-xs font-black uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-1"
                        >
                          <ArrowLeft size={14} />
                          Back to Brief
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col justify-between p-8 md:p-10 text-left overflow-y-auto">
                      {/* Top Row: Heading and Close */}
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                          <button
                            onClick={() => setSelectedPath(null)}
                            className="text-xs font-black text-[#0058be] hover:underline flex items-center gap-1 bg-transparent border-none cursor-pointer mb-1 p-0"
                          >
                            <ArrowLeft size={12} />
                            Back to Options
                          </button>
                          <h2 className="text-2xl md:text-3xl font-black text-[#0b1c30] tracking-tight">
                            {selectedPath === 'ai' && 'AI Copilot Launcher'}
                            {selectedPath === 'tutorial' && 'Video Tutorials'}
                            {selectedPath === 'tools' && 'Online Tools'}
                            {selectedPath === 'templates' && 'Templates & Documentation'}
                          </h2>
                          <p className="text-xs text-neutral-500 font-semibold mt-1">
                            {selectedPath === 'ai' && 'Launch an AI agent with your personalized strategy context.'}
                            {selectedPath === 'tutorial' && 'Curated guides for building this exact asset type.'}
                            {selectedPath === 'tools' && 'The best software for this specific asset.'}
                            {selectedPath === 'templates' && 'Direct blueprints and structural outlines for fast execution.'}
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveWorkspaceAssetId(null)}
                          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors border-none bg-transparent cursor-pointer"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      {/* Detail Contents */}
                      <div className="flex-1 my-auto py-4">
                        {selectedPath === 'ai' && (
                          <div className="space-y-6">
                            <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm text-center space-y-4">
                              <h3 className="text-sm font-black text-[#0b1c30] uppercase tracking-widest">Select AI Copilot</h3>
                              <p className="text-xs text-neutral-500 max-w-md mx-auto">Your personalized prompt will automatically be copied to your clipboard. Just paste it and start generating.</p>
                              
                              {copiedPromptId === workspaceProject.id && (
                                <div className="bg-emerald-50 text-emerald-600 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-2 animate-in slide-in-from-top-2">
                                  <CheckCircle2 size={14} /> Prompt copied to clipboard!
                                </div>
                              )}

                              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(res.prompt);
                                    setCopiedPromptId(workspaceProject.id);
                                    setTimeout(() => setCopiedPromptId(null), 2000);
                                    window.open('https://chat.openai.com', '_blank');
                                  }} 
                                  className="w-14 h-14 bg-neutral-50 hover:bg-white hover:scale-105 border border-neutral-200 hover:border-[#0058be] hover:shadow-lg rounded-2xl flex items-center justify-center transition-all cursor-pointer"
                                >
                                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" alt="ChatGPT" className="w-7 h-7" />
                                </button>
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(res.prompt);
                                    setCopiedPromptId(workspaceProject.id);
                                    setTimeout(() => setCopiedPromptId(null), 2000);
                                    window.open('https://claude.ai', '_blank');
                                  }} 
                                  className="w-14 h-14 bg-neutral-50 hover:bg-white hover:scale-105 border border-neutral-200 hover:border-[#0058be] hover:shadow-lg rounded-2xl flex items-center justify-center transition-all cursor-pointer font-serif font-black text-xl text-[#0b1c30]"
                                >
                                  C
                                </button>
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(res.prompt);
                                    setCopiedPromptId(workspaceProject.id);
                                    setTimeout(() => setCopiedPromptId(null), 2000);
                                    window.open('https://gemini.google.com', '_blank');
                                  }} 
                                  className="w-14 h-14 bg-neutral-50 hover:bg-white hover:scale-105 border border-neutral-200 hover:border-[#0058be] hover:shadow-lg rounded-2xl flex items-center justify-center transition-all cursor-pointer"
                                >
                                  <Sparkles size={24} className="text-blue-500" />
                                </button>
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(res.prompt);
                                    setCopiedPromptId(workspaceProject.id);
                                    setTimeout(() => setCopiedPromptId(null), 2000);
                                    window.open('https://perplexity.ai', '_blank');
                                  }} 
                                  className="w-14 h-14 bg-neutral-50 hover:bg-white hover:scale-105 border border-neutral-200 hover:border-[#0058be] hover:shadow-lg rounded-2xl flex items-center justify-center transition-all cursor-pointer font-black text-xl text-teal-650"
                                >
                                  P
                                </button>
                              </div>
                              
                              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-left mt-6">
                                <div className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-2">Prompt Preview:</div>
                                <p className="text-xs font-semibold text-neutral-600 italic select-all leading-relaxed">"{res.prompt}"</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedPath === 'tutorial' && (
                          <div className="bg-neutral-50 p-8 rounded-2xl border border-neutral-200 flex flex-col items-center justify-center min-h-[250px] text-center">
                            <div className="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-4">
                              <Play size={28} className="ml-1" />
                            </div>
                            <h3 className="text-lg font-black text-[#0b1c30] mb-2">Curated YouTube Search</h3>
                            <p className="text-xs text-neutral-500 mb-6 font-semibold max-w-sm">We've pre-filled the perfect search query to find high-quality tutorials for your specific niche.</p>
                            <button 
                              onClick={() => window.open(res.tutorial, '_blank')} 
                              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black tracking-wider uppercase flex items-center gap-2 transition-colors cursor-pointer border-none shadow-sm animate-pulse"
                            >
                              Open YouTube <ExternalLink size={14}/>
                            </button>
                          </div>
                        )}

                        {selectedPath === 'tools' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {res.tools.map((t, i) => (
                              <div key={i} className="p-5 bg-white border border-neutral-200 rounded-2xl flex items-center gap-3 hover:border-neutral-300 transition-colors shadow-sm cursor-pointer">
                                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                  <Code size={18} />
                                </div>
                                <span className="text-sm font-black text-[#0b1c30]">{t}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {selectedPath === 'templates' && (
                          <div className="space-y-4">
                            <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 text-left">
                              <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest flex items-center gap-2 mb-2">
                                <Sparkles size={14} /> Pro-Tip Cheat Sheet
                              </h4>
                              <p className="text-sm font-medium text-amber-900/80">{res.cheatSheet}</p>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-neutral-200 text-left">
                              <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-4">Quick Start Outlines</h4>
                              <ul className="space-y-3">
                                {res.templates.map((t, i) => (
                                  <li key={i} className="flex items-center justify-between p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-100 cursor-pointer transition-colors">
                                    <div className="flex items-center gap-3">
                                      <FileText size={16} className="text-[#0058be]" />
                                      <span className="text-sm font-bold text-[#0b1c30]">{t}</span>
                                    </div>
                                    <ArrowRight size={14} className="text-neutral-400" />
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Bottom Action Bar */}
                      <div className="border-t border-neutral-100 pt-6 flex justify-between">
                        <button
                          onClick={() => setSelectedPath(null)}
                          className="px-6 py-2.5 rounded-xl border border-neutral-200 text-[#0b1c30] hover:bg-neutral-50 text-xs font-black uppercase tracking-wider cursor-pointer transition-colors"
                        >
                          Change Path
                        </button>

                        <button
                          onClick={() => {
                            handleAssetCheckboxChange(workspaceProject.id, true);
                            setActiveWorkspaceAssetId(null);
                          }}
                          className="bg-[#0058be] hover:bg-blue-700 text-white min-h-[46px] px-8 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                        >
                          <CheckCircle2 size={14} />
                          Mark as Complete
                        </button>
                      </div>
                    </div>
                  )
                )}
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {isCompleted && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-[#0b1c30] text-white flex items-start gap-4 shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30 mt-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" aria-hidden="true" />
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
          disabled={isGenerating}
        >
          Continue to Portfolio
          <ArrowRight size={16} aria-hidden="true" />
        </ModuleButton>
      </StepActionArea>

    </motion.div>
  );
}
