import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ArrowLeft, ArrowRight, CheckCircle2, Award, FileText, Check, Copy, ExternalLink,
  Video, Film, Scissors, Tv, Play, Code, Zap, Globe, Layers, GitBranch, BookOpen, MessageSquare, Folder, LineChart, TrendingUp, PenTool,
  RotateCcw, ShieldCheck, Filter, Bookmark, Layout, AlertCircle, RefreshCw, Upload, CheckCircle, ShieldAlert, Lock, ArrowUpRight
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
      whyMatters: "SaaS founders and agents review pacing hooks first; a walk-through video holds attention better than static image slides.",
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
      achievementLabel: "Split-Screen pacing Verified ✓",
      prereqLabel: "Requires: Before/After breakdown check",
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
    achievementLabel: "Objection copy Approved ✓",
    prereqLabel: "Requires: Custom objection hook verify",
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
      { name: "objection-Buster Layout Blueprint", url: "#" }
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
        { name: "Example 2: Commercial Ad Pacing Breakdown", url: "#" },
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

  const priorities = useMemo(() => {
    if (!authorityProfile || !mod1MarketId) return [];
    return resolveProofPriorities(ctxCombined as any);
  }, [authorityProfile, mod1MarketId, ctxCombined]);

  const assets = useMemo(() => {
    if (!authorityProfile || !mod1MarketId || priorities.length === 0) return [];
    return priorities.map(p => generateProofAsset(p, ctxCombined as any));
  }, [priorities, authorityProfile, mod1MarketId, ctxCombined]);

  // Project unlock and status logic
  const projectStates = useMemo(() => {
    const states: Record<string, { isUnlocked: boolean; isCompleted: boolean; prereqName?: string }> = {};
    if (assets.length > 0) {
      // Project 1 is always unlocked
      const p1Completed = availableAssets.includes(assets[0].id);
      states[assets[0].id] = { isUnlocked: true, isCompleted: p1Completed };

      // Project 2 requires Project 1 completed
      if (assets.length > 1) {
        const p2Unlocked = p1Completed;
        const p2Completed = availableAssets.includes(assets[1].id);
        states[assets[1].id] = { 
          isUnlocked: p2Unlocked, 
          isCompleted: p2Completed, 
          prereqName: getAssetLabel(assets[0].id) 
        };

        // Project 3 requires Project 2 completed
        if (assets.length > 2) {
          const p3Unlocked = p2Completed;
          const p3Completed = availableAssets.includes(assets[2].id);
          states[assets[2].id] = { 
            isUnlocked: p3Unlocked, 
            isCompleted: p3Completed, 
            prereqName: getAssetLabel(assets[1].id) 
          };
        }
      }
    }
    return states;
  }, [assets, availableAssets]);

  // Currently focused project ID in Right Panel workspace
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const activeProject = useMemo(() => {
    if (assets.length === 0) return null;
    return assets.find(a => a.id === selectedAssetId) || assets[0];
  }, [assets, selectedAssetId]);

  // Synchronize selection
  useEffect(() => {
    if (assets.length > 0 && !selectedAssetId) {
      setSelectedAssetId(assets[0].id);
    }
  }, [assets, selectedAssetId]);

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
    
    // Clear verification fields
    setVerificationUrl('');
    setVerificationProgress('idle');
    setAuditResult(null);
    setShowDopamineFeedback(false);
  };

  const handleClearInventory = () => {
    setAvailableAssets([]);
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

  const nextActionProject = useMemo(() => {
    return assets.find(a => !availableAssets.includes(a.id));
  }, [assets, availableAssets]);

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
      {assets.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Zap className="w-5 h-5 text-[#0058be]" />
            <h3 className="text-sm font-extrabold text-[#0b1c30] uppercase tracking-wider">
              Section 3 - Proof Execution Hub
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* LEFT COLUMN: STATUS HUD & PROJECTS LIST (col-span-4) */}
            <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
              
              {/* Client Readiness Circular HUD */}
              <div className="flex flex-col items-center text-center p-4 bg-neutral-50/50 rounded-2xl border border-neutral-100 space-y-3">
                <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
                  Client Readiness
                </span>
                
                <div className="relative w-28 h-28 flex items-center justify-center">
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
                    <span className="text-xl font-black text-[#0b1c30]">{currentReadiness}%</span>
                    <span className="text-[7px] font-black text-neutral-400 uppercase tracking-widest">Readiness</span>
                  </div>
                </div>

                <div className="text-[10px] text-neutral-500 font-bold">
                  Current Proof Assets: <span className="text-[#0b1c30]">{selectedCount} / {totalAvailable}</span>
                </div>
              </div>

              {/* Progress Progression list */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[9px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-1.5">
                  <span>Proof Projects</span>
                  <span>{completedProjectsCount} of {assets.length} Ready ({projectsCompletePercent}%)</span>
                </div>

                <div className="space-y-2">
                  {assets.map((item, idx) => {
                    const state = projectStates[item.id] || { isUnlocked: false, isCompleted: false };
                    const isSelected = activeProject?.id === item.id;
                    const meta = getBlueprintMetadata(item.assetType);
                    
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedAssetId(item.id)}
                        className={cn(
                          "w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between select-none relative overflow-hidden group",
                          state.isCompleted
                            ? isSelected
                              ? "border-emerald-500 bg-emerald-50/20 text-emerald-800"
                              : "border-neutral-200 bg-emerald-50/5 text-emerald-800/80 hover:bg-emerald-50/10"
                            : !state.isUnlocked
                              ? "opacity-60 bg-neutral-50/50 border-neutral-100"
                              : isSelected
                                ? "border-[#0058be] bg-[#0058be]/5 text-[#0058be]"
                                : "border-neutral-200 bg-white hover:border-neutral-300 text-neutral-600"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-neutral-400 group-hover:text-[#0058be]/75 transition-colors">
                            #{idx + 1}
                          </span>
                          <span className="text-xs font-bold leading-tight">
                            {getAssetLabel(item.id)}
                          </span>
                        </div>

                        <div className="shrink-0 flex items-center gap-1.5">
                          {state.isCompleted ? (
                            <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
                              ✓ Ready
                            </span>
                          ) : !state.isUnlocked ? (
                            <div className="flex items-center gap-1 text-[9px] text-neutral-400 font-extrabold uppercase">
                              <Lock size={10} />
                              Locked
                            </div>
                          ) : (
                            <span className="text-[9px] font-black uppercase text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                              🎯 Active
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Goal gradient or Next action card */}
              <div className="pt-2 border-t border-neutral-100 text-left">
                {goalGradientCallout ? (
                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-[10px] font-bold text-[#0058be] leading-normal flex items-start gap-1.5">
                    <Sparkles size={12} className="shrink-0 mt-0.5 text-blue-600" />
                    <span>{goalGradientCallout}</span>
                  </div>
                ) : nextActionProject ? (
                  <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-2">
                    <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">
                      Next Best Action:
                    </span>
                    <div className="text-xs font-black text-[#0b1c30] leading-tight">
                      Build {getAssetLabel(nextActionProject.id)}
                    </div>
                    <div className="flex gap-4 text-[9px] font-bold text-neutral-500">
                      <div>Gain: <span className="text-emerald-600">+{getBlueprintMetadata(nextActionProject.assetType).impact}%</span></div>
                      <div>Time: <span className="text-[#0b1c30]">{getBlueprintMetadata(nextActionProject.assetType).time}</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-[10px] font-bold text-emerald-800 leading-normal flex items-start gap-1.5">
                    <CheckCircle2 size={12} className="shrink-0 mt-0.5 text-emerald-600" />
                    <span>All recommended proof projects successfully verified!</span>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: WORKSPACE TERMINAL (col-span-8) */}
            {activeProject && (() => {
              const meta = getBlueprintMetadata(activeProject.assetType);
              const res = getHubResources(activeProject.id);
              const state = projectStates[activeProject.id] || { isUnlocked: false, isCompleted: false };

              return (
                <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden">
                        {/* Lock transparent cover for locked projects */}
                  {!state.isUnlocked && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-[1.5px] z-20 flex flex-col items-center justify-center p-8 text-center select-none">
                      <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 mb-3 border border-neutral-200">
                        <Lock size={20} />
                      </div>
                      <h4 className="text-sm font-black text-[#0b1c30] uppercase tracking-wide">Project Locked</h4>
                      <p className="text-xs text-neutral-500 max-w-sm leading-relaxed mt-1 font-semibold">
                        To unlock this resource workspace, please complete verification on the prerequisite asset:
                      </p>
                      <div className="mt-3 bg-neutral-50 border border-neutral-200 text-[#0b1c30] px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider">
                        {state.prereqName}
                      </div>
                    </div>
                  )}

                  {/* Header detail */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 border-b border-neutral-100 pb-4">
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-[#0b1c30]">
                          {getAssetLabel(activeProject.id)}
                        </h4>
                        <span className="text-[9px] font-black text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded uppercase tracking-wider">
                          Priority Rank
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 leading-normal font-semibold">
                        {meta.goal}
                      </p>
                    </div>

                    <div className="flex gap-3 text-[10px] font-black uppercase tracking-wider text-right shrink-0">
                      <div>
                        <span className="text-[8px] font-extrabold text-neutral-400 block tracking-widest">Time</span>
                        <span className="text-[#0b1c30]">{meta.time}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-extrabold text-neutral-400 block tracking-widest">Difficulty</span>
                        <span className="text-[#0b1c30]">{meta.difficulty}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-extrabold text-neutral-400 block tracking-widest">Trust Gain</span>
                        <span className="text-emerald-600">+{meta.impact}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Why AI Recommended This (Linear Style) */}
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/50 space-y-2.5 text-left">
                    <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">
                      Why AI Recommended This:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] leading-relaxed">
                      <div>
                        <span className="font-extrabold text-[#0b1c30] block">Buyer Objection:</span>
                        <span className="text-neutral-500 font-semibold">{meta.buyerProblem}</span>
                      </div>
                      <div>
                        <span className="font-extrabold text-[#0b1c30] block">Target Trust Gap:</span>
                        <span className="text-neutral-500 font-semibold">{meta.trustGap}</span>
                      </div>
                      <div>
                        <span className="font-extrabold text-emerald-600 block">Expected Benefit:</span>
                        <span className="text-neutral-500 font-semibold">{meta.outcome}</span>
                      </div>
                    </div>
                  </div>

                  {/* STEP-BY-STEP EXECUTION BLUEPRINT */}
                  <div className="space-y-8 text-left">
                    
                    {/* STEP 1: PLAN WITH AI */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 border-b border-neutral-100 pb-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#0058be] text-white text-xs font-black flex items-center justify-center">1</span>
                        <h5 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider">Step 1: Plan Script & Layout with AI</h5>
                      </div>
                      <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed">
                        Copy this optimized system prompt and paste it into <span className="text-[#0058be] underline">ChatGPT</span>, <span className="text-[#0058be] underline">Claude</span>, or <span className="text-[#0058be] underline">Gemini</span>. It will generate a custom outline tailored to your positioning:
                      </p>

                      <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3.5 relative overflow-hidden group">
                        <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                          <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                            <Code size={10} />
                            AI Co-Pilot Script Prompt
                          </span>
                          <button
                            onClick={() => handleCopyPrompt(res.prompt, activeProject.id)}
                            className="bg-[#0058be] hover:bg-blue-600 text-white px-3.5 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider cursor-pointer border-none flex items-center gap-1 transition-colors"
                          >
                            {copiedPromptId === activeProject.id ? (
                              <>
                                <Check size={10} strokeWidth={3} />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy size={10} />
                                Copy Prompt
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-[11.5px] leading-relaxed font-semibold italic text-neutral-300">
                          "{res.prompt}"
                        </p>
                      </div>
                    </div>

                    {/* STEP 2: BUILD THE ASSET */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-neutral-100 pb-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#0058be] text-white text-xs font-black flex items-center justify-center">2</span>
                        <h5 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider">Step 2: Build & Edit Your Deliverables</h5>
                      </div>
                      <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed">
                        Use the checklist below along with recommended templates, tutorials, and inspiration examples to build this asset:
                      </p>

                      {/* Dynamic checklist from Resolution Engine */}
                      {activeProject.executionSteps && activeProject.executionSteps.length > 0 && (
                        <div className="p-4 bg-neutral-50/50 border border-neutral-100 rounded-2xl space-y-2">
                          <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">
                            Execution Checklist:
                          </span>
                          <ul className="space-y-1.5 text-[11px] text-neutral-600 font-semibold">
                            {activeProject.executionSteps.map((step, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Templates & Guides Link Rows */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-2">
                          <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">
                            Templates & Tools:
                          </span>
                          <a
                            href={res.quickStartUrl}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/30 hover:bg-blue-50/60 border border-blue-100/50 text-[#0058be] text-[10px] font-black uppercase tracking-wider transition-colors"
                          >
                            <span className="flex items-center gap-1.5">
                              <Layers size={12} />
                              {res.quickStart}
                            </span>
                            <ArrowUpRight size={12} />
                          </a>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {res.tools.map((t, idx) => (
                              <span key={idx} className="bg-neutral-50 border border-neutral-200 text-[#0b1c30] text-[9px] font-black uppercase px-2 py-0.5 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">
                            Video Guides & Rules:
                          </span>
                          <a
                            href={res.tutorial}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between p-2.5 rounded-xl bg-red-50/30 hover:bg-red-50/60 border border-red-100/50 text-red-600 text-[10px] font-black uppercase tracking-wider transition-colors"
                          >
                            <span className="flex items-center gap-1.5">
                              <Play size={10} fill="currentColor" />
                              Watch YouTube Tutorial
                            </span>
                            <ExternalLink size={10} />
                          </a>
                          <p className="text-[10px] text-neutral-500 leading-relaxed font-semibold pt-1">
                            💡 <span className="font-extrabold text-[#0b1c30] uppercase text-[8px]">Standard:</span> {res.cheatSheet}
                          </p>
                        </div>
                      </div>

                      {/* Reference Gallery */}
                      <div className="space-y-2">
                        <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">
                          Inspiration Gallery (Visual Examples):
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {res.examples.map((ex, idx) => (
                            <a
                              key={idx}
                              href={ex.url}
                              className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-200 hover:border-neutral-300 bg-white text-[10px] font-bold text-neutral-600 hover:text-[#0b1c30] transition-colors"
                            >
                              <span className="truncate">{ex.name}</span>
                              <ArrowUpRight size={10} className="text-neutral-400 shrink-0 ml-1" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* STEP 3: HOST & VERIFY */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 border-b border-neutral-100 pb-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#0058be] text-white text-xs font-black flex items-center justify-center">3</span>
                        <h5 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider">Step 3: Host & Verify Work</h5>
                      </div>
                      <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed">
                        Host your completed project on a public platform (e.g. YouTube, Vimeo, Framer, GitHub) and paste the URL link below to scan it:
                      </p>

                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={verificationUrl}
                            onChange={(e) => setVerificationUrl(e.target.value)}
                            placeholder="Paste your public project link here"
                            className="flex-1 min-h-[42px] px-3.5 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-[#0058be] transition-colors"
                          />
                          <button
                            onClick={handleRunVerification}
                            disabled={verificationProgress === 'scanning' || !verificationUrl}
                            className="bg-[#0058be] hover:bg-blue-700 text-white min-h-[42px] px-5 rounded-xl text-xs font-bold cursor-pointer transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5"
                          >
                            {verificationProgress === 'scanning' ? (
                              <>
                                <RefreshCw size={12} className="animate-spin" />
                                Analyzing Link...
                              </>
                            ) : (
                              <>
                                <ShieldCheck size={12} />
                                Verify Link
                              </>
                            )}
                          </button>
                        </div>

                        {/* Verification outputs */}
                        {verificationProgress === 'done' && auditResult && (
                          <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/60 space-y-3 animate-fade-in">
                            {auditResult.isValid ? (
                              <div className="space-y-3">
                                <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
                                  <span className="text-emerald-700 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                                    <CheckCircle size={14} fill="currentColor" className="text-white" />
                                    Audit Passed Successfully
                                  </span>
                                  <div className="flex items-center gap-1.5 text-amber-500">
                                    <span className="text-[11px] font-black text-neutral-400">Score: {auditResult.score}</span>
                                    <div className="flex items-center gap-0.5">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Sparkles key={i} size={10} fill="currentColor" />
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="text-[10px] text-neutral-500 font-semibold leading-relaxed">
                                  <span className="font-extrabold uppercase text-neutral-400 block text-[8px] mb-1">Recommended Adjustments:</span>
                                  <ul className="space-y-1">
                                    {auditResult.improvements.map((imp: string, idx: number) => (
                                      <li key={idx} className="flex items-start gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#0058be] mt-1.5 shrink-0" />
                                        <span>{imp}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Dopamine Loop Verification Overlay */}
                                <AnimatePresence>
                                  {showDopamineFeedback && readinessDelta && (
                                    <motion.div 
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      className="p-4 rounded-xl bg-emerald-500 text-white space-y-2 shadow-md relative overflow-hidden"
                                    >
                                      <div className="flex justify-between items-center">
                                        <span className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                                          <ShieldCheck size={16} />
                                          {meta.achievementLabel}
                                        </span>
                                        <span className="text-xs font-black bg-white/20 px-2 py-0.5 rounded">
                                          Trust +{meta.impact}%
                                        </span>
                                      </div>
                                      <div className="text-[11px] font-bold">
                                        Client Readiness progressed: {readinessDelta.from}% → <span className="underline font-black">{readinessDelta.to}% Readiness</span>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                {!showDopamineFeedback && (
                                  <button
                                    onClick={handleAcceptAudit}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white min-h-[38px] rounded-xl text-[10px] font-extrabold uppercase tracking-wider cursor-pointer transition-colors mt-2"
                                  >
                                    Accept Audit & Lock in Readiness Increase
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-start gap-2 text-red-700">
                                <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                                <div className="text-[10px] font-bold">
                                  <span className="block uppercase tracking-wider">Verification Error:</span>
                                  <p className="font-semibold text-neutral-500 mt-1">{auditResult.improvements[0]}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>
      )}

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
