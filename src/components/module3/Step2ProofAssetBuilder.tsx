import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ArrowLeft, ArrowRight, CheckCircle2, Award, FileText, Check, Copy, ExternalLink,
  Video, Film, Scissors, Tv, Play, Code, Zap, Globe, Layers, GitBranch, BookOpen, MessageSquare, Folder, LineChart, TrendingUp, PenTool,
  RotateCcw, ShieldCheck, Filter, Bookmark, Layout, AlertCircle, RefreshCw, Upload, CheckCircle, ShieldAlert
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

const getBlueprintMetadata = (format: string) => {
  const fmt = format.toLowerCase();
  if (fmt.includes('video') || fmt.includes('reel') || fmt.includes('showreel') || fmt.includes('clips')) {
    return {
      goal: "Prove narrative pacing & viewer retention capability.",
      difficulty: "Medium",
      time: "2 Hours",
      roi: 5,
      impact: "25",
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
      impact: "20",
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
      impact: "15",
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
    impact: "10",
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

// Resource Hub Content Map
const getHubResources = (assetId: string, track: string) => {
  const defaults = {
    tutorial: "https://www.youtube.com/results?search_query=how+to+build+portfolio+for+freelance",
    prompt: `Act as a positioning strategist. Draft a highly compelling copy hook targeting my target market. Highlight how I solve common industry issues. Keep it brief.`,
    tools: ["Notion", "Google Docs"],
    templates: ["Proof Asset Outline Layout"],
    examples: ["Sample Case Study Structure"],
    cheatSheet: "Ensure key client objections are addressed in the first paragraph."
  };

  if (assetId.includes('video') || assetId.includes('reel') || assetId.includes('showreel') || assetId.includes('clips')) {
    return {
      tutorial: "https://www.youtube.com/results?search_query=how+to+create+a+video+editing+showreel",
      prompt: `Act as a video scripting coach. Write a high-retention 3-part script outline for my showreel. The first 5 seconds must address target agent objections regarding editing pacing. Deliverable formats: hook, breakdown, visual proof overlay script.`,
      tools: ["Premiere Pro", "DaVinci Resolve", "CapCut"],
      templates: ["Showreel Visual Hook Blueprint", "Sequence pacing cheat sheet"],
      examples: ["Successful Real Estate Showreel Link"],
      cheatSheet: "Pacing hooks: cut every 1.5 seconds during the intro. Add zoom maps to maintain attention."
    };
  }
  if (assetId.includes('before') || assetId.includes('comparison')) {
    return {
      tutorial: "https://www.youtube.com/results?search_query=before+after+editing+breakdown+tutorial",
      prompt: `Act as a commercial design consultant. Draft a narration script comparing a baseline client project vs. my high-end pacing optimizations. Show how bad cuts result in drop-offs, while custom overlays boost retention.`,
      tools: ["Premiere Pro", "Canva Split Screen"],
      templates: ["Side-by-side comparison overlays"],
      examples: ["Split Screen Retention Graph Template"],
      cheatSheet: "Do not say 'bad edit'. Highlight: 'Optimized pacing logic recovering simulated drop-off graph'."
    };
  }
  if (assetId.includes('website') || assetId.includes('live') || assetId.includes('portfolio')) {
    return {
      tutorial: "https://www.youtube.com/results?search_query=build+framer+portfolio+from+scratch",
      prompt: `Act as a landing page copywriter. Write a clean landing page layout for my UI/UX design portfolio. Target SaaS startup founders. Write a bold hero hook, objection-buster FAQ section, and a structural layout outline.`,
      tools: ["Framer", "Webflow", "GitHub Pages"],
      templates: ["Framer Startup Portfolio Theme", "Responsive CSS grid boilerplate"],
      examples: ["Clean Minimalist Design System Portfolio"],
      cheatSheet: "Hero title: State the specific conversion outcome you guarantee in one line."
    };
  }
  if (assetId.includes('testimonial') || assetId.includes('client')) {
    return {
      tutorial: "https://www.youtube.com/results?search_query=how+to+ask+clients+for+testimonials",
      prompt: `Draft a friendly, non-annoying testimonial request script to send to clients via email or WhatsApp. Frame it around confirming the metrics achieved during execution.`,
      tools: ["Gmail", "Senja Testimonials"],
      templates: ["WhatsApp testimonial prompt", "Follow-up email template"],
      examples: ["Video testimonial checklist"],
      cheatSheet: "Provide three bullet points to prompt them: the situation before, the mechanism, and the metric outcome."
    };
  }

  return defaults;
};

// Verification simulated engine outputs
const runVerificationAudit = (assetId: string, url: string) => {
  const cleanUrl = url.trim().toLowerCase();
  
  if (!cleanUrl.includes('.') || cleanUrl.length < 5) {
    return {
      isValid: false,
      completeness: 0,
      score: "0/10",
      objections: [],
      improvements: ["Provide a valid public asset URL (e.g. GitHub link, website link, Drive file, or YouTube link)."],
    };
  }

  // Generate customized mock responses based on type
  const baseImprovements = [
    "Ensure contrast parameters meet guidelines in all sections.",
    "Place a clear call-to-action button above the viewport fold."
  ];

  if (assetId.includes('video') || assetId.includes('showreel')) {
    return {
      isValid: true,
      completeness: 92,
      score: "8.9/10",
      objections: ["✓ Pacing capability proven", "✓ Hook retention metrics mapped"],
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
      objections: ["✓ Problem-solving capability proven", "✓ Pacing logic explained"],
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
    objections: ["✓ Clean repository layout", "✓ Setup README documented"],
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

  // Copy Feedback animation tracker
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  // Verification Input state
  const [verificationUrl, setVerificationUrl] = useState('');
  const [verificationProgress, setVerificationProgress] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [auditResult, setAuditResult] = useState<any>(null);

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

  // Priority queue of missing assets
  const priorityQueue = useMemo(() => {
    return assets.filter(a => !availableAssets.includes(a.id));
  }, [assets, availableAssets]);

  const [selectedQueueAssetId, setSelectedQueueAssetId] = useState<string | null>(null);

  const activeQueueAsset = useMemo(() => {
    if (priorityQueue.length === 0) return null;
    return priorityQueue.find(a => a.id === selectedQueueAssetId) || priorityQueue[0];
  }, [priorityQueue, selectedQueueAssetId]);

  // Sync selection when queue changes
  useEffect(() => {
    if (priorityQueue.length > 0 && !priorityQueue.some(a => a.id === selectedQueueAssetId)) {
      setSelectedQueueAssetId(priorityQueue[0].id);
    }
  }, [priorityQueue, selectedQueueAssetId]);

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
    
    // Reset verify form if active asset is updated
    setVerificationUrl('');
    setVerificationProgress('idle');
    setAuditResult(null);
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

  const handleRunVerification = () => {
    if (!activeQueueAsset) return;
    setVerificationProgress('scanning');
    setAuditResult(null);

    setTimeout(() => {
      const result = runVerificationAudit(activeQueueAsset.id, verificationUrl);
      setAuditResult(result);
      setVerificationProgress('done');
    }, 1500);
  };

  const handleAcceptAudit = () => {
    if (!activeQueueAsset || !auditResult || !auditResult.isValid) return;
    handleAssetCheckboxChange(activeQueueAsset.id, true);
  };

  const handleNext = () => {
    setIsGenerating(true);
    generateProofAssetStrategy();
    approveProofAssetStrategy();
    confirmStep();
    setIsGenerating(false);
    nextStep();
  };

  // Calibration progress
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
      {priorityQueue.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Zap className="w-5 h-5 text-[#0058be]" />
            <h3 className="text-sm font-extrabold text-[#0b1c30] uppercase tracking-wider">
              Section 3 - Proof Execution Hub
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* FEATURE 1: AI PRIORITY ENGINE (col-span 5) */}
            <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-[#0058be] uppercase tracking-widest block">
                  Feature 1
                </span>
                <h4 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider flex items-center gap-1">
                  AI Priority Engine ⭐⭐⭐⭐⭐
                </h4>
                <p className="text-[10px] text-neutral-500 font-semibold leading-relaxed">
                  Next actions list to strategically maximize closing rates:
                </p>
              </div>

              {/* Next Best Action Card (Top Priority) */}
              {(() => {
                const nextMeta = getBlueprintMetadata(priorityQueue[0].assetType);
                return (
                  <div className="p-4 rounded-2xl bg-[#0058be]/5 border border-[#0058be]/20 space-y-3 relative overflow-hidden">
                    <div className="absolute top-2 right-2 bg-[#0058be] text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Next Action
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
                        Rank #1 Priority
                      </span>
                      <span className="text-sm font-black text-[#0058be] block">
                        {getAssetLabel(priorityQueue[0].id)}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600 font-semibold leading-relaxed">
                      <span className="font-extrabold text-[#0b1c30]">Reason:</span> {nextMeta.whyMatters}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-neutral-500 pt-2 border-t border-[#0058be]/10">
                      <div>Time: <span className="text-[#0b1c30]">{nextMeta.time}</span></div>
                      <div>Trust Gain: <span className="text-emerald-600">+{nextMeta.impact}%</span></div>
                    </div>
                  </div>
                );
              })()}

              {/* Remaining Priority Queue list */}
              {priorityQueue.length > 1 && (
                <div className="space-y-2">
                  <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">
                    Up Next:
                  </span>
                  <div className="space-y-1.5">
                    {priorityQueue.slice(1, 3).map((item, idx) => {
                      const itemMeta = getBlueprintMetadata(item.assetType);
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedQueueAssetId(item.id)}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-xl border text-[11px] font-semibold cursor-pointer transition-colors",
                            activeQueueAsset?.id === item.id
                              ? "bg-neutral-100 border-neutral-300"
                              : "bg-neutral-50 border-neutral-100/50 hover:bg-neutral-100 hover:border-neutral-200"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-neutral-400 font-black">#{idx + 2}</span>
                            <span className="text-[#0b1c30]">{getAssetLabel(item.id)}</span>
                          </div>
                          <span className="text-emerald-600 text-[10px] font-bold">+{itemMeta.impact}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* FEATURE 2: AI RESOURCE HUB (col-span 7) */}
            {activeQueueAsset && (
              <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-5">
                <div className="space-y-1 border-b border-neutral-100 pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-black text-[#0058be] uppercase tracking-widest block">
                        Feature 2
                      </span>
                      <h4 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider flex items-center gap-1">
                        AI Resource Hub ⭐⭐⭐⭐⭐
                      </h4>
                    </div>
                    <span className="text-[10px] font-black text-neutral-400 bg-neutral-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {getAssetLabel(activeQueueAsset.id)}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-500 font-semibold leading-relaxed">
                    Everything you need to compile this asset without searching the web:
                  </p>
                </div>

                {/* Hub Resources Content Grid */}
                {(() => {
                  const res = getHubResources(activeQueueAsset.id, serviceTrack);
                  return (
                    <div className="space-y-4 flex-1 justify-center flex flex-col">
                      
                      {/* YouTube Tutorial & Tools link row */}
                      <div className="grid grid-cols-2 gap-4">
                        <a
                          href={res.tutorial}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 p-3 rounded-2xl bg-red-50 border border-red-100 text-red-700 hover:bg-red-100/50 transition-colors text-xs font-bold text-left group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0">
                            <Play size={14} fill="currentColor" />
                          </div>
                          <div>
                            <span className="block text-[10px] font-extrabold uppercase tracking-widest text-red-500">Video Guide</span>
                            <span className="group-hover:underline flex items-center gap-0.5 text-[#0b1c30]">
                              Watch Tutorial <ExternalLink size={10} />
                            </span>
                          </div>
                        </a>

                        <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100/50 flex flex-col justify-center text-left">
                          <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block mb-1">
                            Recommended tools
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {res.tools.map((t, idx) => (
                              <span key={idx} className="bg-white border border-neutral-200 text-[#0b1c30] text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* AI Copier Prompt box */}
                      <div className="p-4 rounded-2xl bg-neutral-900 text-neutral-200 border border-neutral-800 space-y-2 relative">
                        <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                          <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                            <Code size={10} />
                            AI Co-Pilot Script Prompt
                          </span>
                          <button
                            onClick={() => handleCopyPrompt(res.prompt, activeQueueAsset.id)}
                            className="text-[9px] text-[#0058be] hover:text-blue-400 font-extrabold flex items-center gap-1 cursor-pointer bg-transparent border-none"
                          >
                            {copiedPromptId === activeQueueAsset.id ? (
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
                        <p className="text-[11px] leading-relaxed font-semibold italic text-neutral-400">
                          "{res.prompt}"
                        </p>
                      </div>

                      {/* Templates & Examples lists */}
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1.5 text-left">
                          <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">
                            Assets & Templates
                          </span>
                          <ul className="space-y-1">
                            {res.templates.map((t, idx) => (
                              <li key={idx} className="text-[10px] text-neutral-600 font-bold flex items-center gap-1.5">
                                <FileText size={10} className="text-[#0058be]" />
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-1.5 text-left">
                          <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">
                            Cheat Sheet Standards
                          </span>
                          <p className="text-[10px] text-neutral-500 leading-relaxed font-semibold">
                            {res.cheatSheet}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* FEATURE 3: COMPLETION & VERIFICATION (FULL WIDTH) */}
          {activeQueueAsset && (
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-6 text-left">
              <div className="space-y-1 border-b border-neutral-100 pb-3">
                <span className="text-[9px] font-black text-[#0058be] uppercase tracking-widest block">
                  Feature 3
                </span>
                <h4 className="text-xs font-black text-[#0b1c30] uppercase tracking-wider flex items-center gap-1">
                  Completion & Verification Engine ⭐⭐⭐★☆
                </h4>
                <p className="text-[10px] text-neutral-500 font-semibold leading-relaxed">
                  Provide your completed URL link to simulate an AI quality verification audit:
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Link Verification form (col-span 7) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-1">
                      Paste Public URL (GitHub, Framer, Drive, YouTube link)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={verificationUrl}
                        onChange={(e) => setVerificationUrl(e.target.value)}
                        placeholder="https://myportfolio.com or https://github.com/username/project"
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
                            Verify Asset
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Smart Contextual Missing helper panels */}
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100/50 flex items-start gap-2.5">
                    <AlertCircle size={14} className="text-amber-700 mt-0.5 shrink-0" />
                    <div className="text-[10px] text-amber-800 leading-relaxed font-semibold">
                      <span className="font-extrabold uppercase tracking-wide block mb-1">
                        Smart AI Assistance:
                      </span>
                      {activeQueueAsset.id.includes('showreel') && (
                        <span>Missing Showreel? Copy the AI Prompt script from Feature 2, record your 3-minute pacing review walkthrough, and upload to Google Drive/YouTube.</span>
                      )}
                      {activeQueueAsset.id.includes('comparison') && (
                        <span>Missing Comparison? Grab a baseline client edit, split screen it with a corrected overlay cut, and post it to Drive to resolve pacing objections.</span>
                      )}
                      {!activeQueueAsset.id.includes('showreel') && !activeQueueAsset.id.includes('comparison') && (
                        <span>Objections detected: Buyer cannot verify your repository cleanliness. Paste your Framer / Carrd / GitHub link to clear the check.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Audit Results (col-span 5) */}
                <div className="lg:col-span-5">
                  <div className="p-5 rounded-2xl border border-neutral-100 bg-neutral-50/60 min-h-[160px] flex flex-col justify-between">
                    <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block border-b border-neutral-200 pb-1.5 mb-2">
                      Verification Output Audit:
                    </span>

                    {verificationProgress === 'scanning' && (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                        <RefreshCw size={24} className="animate-spin text-[#0058be] mb-2" />
                        <span className="text-xs text-neutral-400 font-bold">Scanning link content...</span>
                      </div>
                    )}

                    {verificationProgress === 'idle' && !auditResult && (
                      <div className="flex-grow flex flex-col items-center justify-center text-center p-4 text-neutral-400">
                        <Upload size={20} className="mb-2" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">No URL verified yet</span>
                      </div>
                    )}

                    {verificationProgress === 'done' && auditResult && (
                      <div className="space-y-4">
                        {auditResult.isValid ? (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                                <CheckCircle size={14} fill="currentColor" className="text-white" />
                                Audit Passed
                              </span>
                              <span className="text-[11px] font-black text-neutral-500">
                                Quality Score: <span className="text-emerald-600">{auditResult.score}</span>
                              </span>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">
                                Satisfied Objections:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {auditResult.objections.map((o: string, idx: number) => (
                                  <span key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                                    {o}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">
                                Recommended Tweaks:
                              </span>
                              <ul className="space-y-1">
                                {auditResult.improvements.map((imp: string, idx: number) => (
                                  <li key={idx} className="text-[10px] text-neutral-500 font-semibold leading-relaxed flex items-start gap-1">
                                    <span className="w-1 h-1 rounded-full bg-[#0058be] mt-1.5 shrink-0" />
                                    <span>{imp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <button
                              onClick={handleAcceptAudit}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white min-h-[36px] rounded-xl text-[10px] font-extrabold uppercase tracking-wider cursor-pointer transition-colors mt-2"
                            >
                              Accept Audit & Mark as Completed
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2 text-left">
                            <span className="text-red-700 text-xs font-bold flex items-center gap-1">
                              <ShieldAlert size={14} />
                              Verification Failed
                            </span>
                            <p className="text-[11px] text-neutral-500 leading-relaxed font-semibold">
                              {auditResult.improvements[0]}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
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
