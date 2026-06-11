import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { WorkspaceShell } from '../components/acquisition/WorkspaceShell';
import { SkillInventory, type Skill } from '../components/acquisition/SkillInventory';
import {
  CheckCircle, Zap, ArrowLeft, ArrowRight, Users, Crosshair, BarChart3, FileText, Check, Target, Briefcase, TrendingUp, Activity,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { EASING } from '../lib/motion-presets';

/* ── Step Order ── */

const SECTION_ORDER = [
  'career-track',
  'skill-inventory',
  'market-selection',
  'niche-mapping',
  'positioning-engine',
  'opportunity-simulator',
  'opportunity-report',
] as const;

type SectionId = typeof SECTION_ORDER[number];
type Track = 'editor' | 'developer' | 'designer';

const STORAGE_KEY = 'blueprint-acquisition/phase-1';

const STEP_LABELS: Record<SectionId, string> = {
  'career-track': 'Career Track',
  'skill-inventory': 'Skill Inventory',
  'market-selection': 'Market Selection',
  'niche-mapping': 'Niche Mapping',
  'positioning-engine': 'Positioning Engine',
  'opportunity-simulator': 'Opportunity Simulator',
  'opportunity-report': 'Opportunity Report',
};

const STEP_OBJECTIVES: Record<SectionId, string> = {
  'career-track': 'Select your career track',
  'skill-inventory': 'Choose your primary skill',
  'market-selection': 'Select your target market',
  'niche-mapping': 'Define your niche',
  'positioning-engine': 'Write your positioning statement',
  'opportunity-simulator': 'Generate your opportunity score',
  'opportunity-report': 'Review your completed report',
};

/* ── Track Constants ── */

const TRACK_LABELS: Record<Track, string> = {
  editor: 'Video Editor',
  developer: 'Developer',
  designer: 'Designer',
};

const TRACK_DESCRIPTIONS: Record<Track, string> = {
  editor: 'Edit and produce video content for creators, brands, and businesses',
  developer: 'Build websites, apps, and automation systems for companies and founders',
  designer: 'Create visual identities, brand systems, and interface designs',
};

const TRACK_ICONS: Record<Track, string> = {
  editor: '🎬',
  developer: '💻',
  designer: '🎨',
};

/* ── Skills ── */

const TRACK_SKILLS: Record<Track, Skill[]> = {
  editor: [
    { id: 'video-editing', title: 'Video Editing', description: 'Full-service video post-production for any platform.', demand: 'high' },
    { id: 'short-form', title: 'Short Form Editing', description: 'Vertical video editing for Reels, TikTok, and Shorts.', demand: 'high' },
    { id: 'long-form', title: 'Long Form Editing', description: 'Documentary-style editing for YouTube and podcasts.', demand: 'medium' },
    { id: 'motion-graphics', title: 'Motion Graphics', description: 'Animated titles, lower thirds, and visual effects.', demand: 'medium' },
    { id: 'thumbnail', title: 'Thumbnail Design', description: 'Click-optimized custom thumbnail artwork.', demand: 'medium' },
  ],
  developer: [
    { id: 'frontend', title: 'Frontend Development', description: 'Build responsive UIs with React, Next.js, and Tailwind.', demand: 'high' },
    { id: 'backend', title: 'Backend Development', description: 'Server-side logic, APIs, and database architecture.', demand: 'medium' },
    { id: 'full-stack', title: 'Full Stack Development', description: 'End-to-end web application development.', demand: 'high' },
    { id: 'wordpress', title: 'WordPress', description: 'Custom WordPress themes, plugins, and optimization.', demand: 'medium' },
    { id: 'automation', title: 'Automation', description: 'Workflow automation, scripts, and tool integrations.', demand: 'medium' },
    { id: 'ai-integration', title: 'AI Integration', description: 'Integrating LLMs and AI tools into web applications.', demand: 'high' },
  ],
  designer: [
    { id: 'ui-design', title: 'UI Design', description: 'User interface design for web and mobile applications.', demand: 'high' },
    { id: 'brand-design', title: 'Brand Design', description: 'Complete visual identity systems and brand guidelines.', demand: 'high' },
    { id: 'logo-design', title: 'Logo Design', description: 'Custom logo creation and brand mark development.', demand: 'medium' },
    { id: 'landing-pages', title: 'Landing Pages', description: 'Conversion-focused landing page design.', demand: 'high' },
    { id: 'social-design', title: 'Social Media Design', description: 'Platform-optimized graphics for social channels.', demand: 'medium' },
  ],
};

/* ── Markets ── */

interface Market {
  id: string;
  name: string;
  description: string;
}

const TRACK_MARKETS: Record<Track, Market[]> = {
  editor: [
    { id: 'creators', name: 'Creators', description: 'Independent content creators on YouTube, Instagram, TikTok' },
    { id: 'course-creators', name: 'Course Creators', description: 'Educational businesses selling video courses' },
    { id: 'agencies', name: 'Agencies', description: 'Creative and marketing agencies outsourcing editing' },
    { id: 'personal-brands', name: 'Personal Brands', description: 'Coaches, consultants, and thought leaders' },
  ],
  developer: [
    { id: 'startups', name: 'Startups', description: 'Early-stage companies needing web and app development' },
    { id: 'saas', name: 'SaaS Companies', description: 'Software businesses needing ongoing development support' },
    { id: 'agencies', name: 'Agencies', description: 'Digital agencies needing development partners' },
    { id: 'local-business', name: 'Local Businesses', description: 'Small and medium businesses needing web presence' },
  ],
  designer: [
    { id: 'startups', name: 'Startups', description: 'Early-stage companies needing brand and UI design' },
    { id: 'creators', name: 'Creators', description: 'Content creators needing visual branding and assets' },
    { id: 'agencies', name: 'Agencies', description: 'Creative agencies outsourcing design work' },
    { id: 'brands', name: 'Brands', description: 'Established companies needing design refreshes' },
  ],
};

/* ── Niches ── */

interface Niche {
  id: string;
  name: string;
  description: string;
}

type MarketId = string;

const TRACK_NICHES: Record<Track, Record<MarketId, Niche[]>> = {
  editor: {
    creators: [
      { id: 'educational', name: 'Educational', description: 'Course creators, tutorial channels, and edutainment' },
      { id: 'finance', name: 'Finance', description: 'Personal finance, investing, and money management' },
      { id: 'gaming', name: 'Gaming', description: 'Gaming content, streams, and Let\'s Plays' },
      { id: 'podcast', name: 'Podcast', description: 'Video podcast and interview-based content' },
    ],
    'course-creators': [
      { id: 'educational', name: 'Educational', description: 'Online course platforms and individual instructors' },
    ],
    agencies: [
      { id: 'educational', name: 'Educational', description: 'Agencies producing educational content' },
      { id: 'finance', name: 'Finance', description: 'Finance-focused production agencies' },
      { id: 'gaming', name: 'Gaming', description: 'Gaming content production agencies' },
      { id: 'podcast', name: 'Podcast', description: 'Podcast production agencies' },
    ],
    'personal-brands': [
      { id: 'educational', name: 'Educational', description: 'Coaches and educators building personal brands' },
      { id: 'finance', name: 'Finance', description: 'Finance experts building authority' },
      { id: 'podcast', name: 'Podcast', description: 'Personal brand podcasting' },
    ],
  },
  developer: {
    startups: [
      { id: 'ai-startups', name: 'AI Startups', description: 'Startups building AI-powered products and tools' },
      { id: 'saas', name: 'SaaS', description: 'Software-as-a-service platforms and apps' },
      { id: 'ecommerce', name: 'E-commerce', description: 'Online store and marketplace platforms' },
    ],
    saas: [
      { id: 'saas', name: 'SaaS', description: 'Established SaaS platforms needing feature development' },
      { id: 'ai-startups', name: 'AI Startups', description: 'AI product companies needing dev support' },
    ],
    agencies: [
      { id: 'saas', name: 'SaaS', description: 'Agencies building SaaS products for clients' },
      { id: 'ecommerce', name: 'E-commerce', description: 'E-commerce development agencies' },
      { id: 'local-business', name: 'Local Business Websites', description: 'Local business web development' },
    ],
    'local-business': [
      { id: 'local-business', name: 'Local Business Websites', description: 'Small business websites and online presence' },
      { id: 'ecommerce', name: 'E-commerce', description: 'Local businesses selling online' },
    ],
  },
  designer: {
    startups: [
      { id: 'saas', name: 'SaaS', description: 'UI/UX for software-as-a-service products' },
      { id: 'tech-startups', name: 'Tech Startups', description: 'Brand and UI for early-stage tech companies' },
    ],
    creators: [
      { id: 'dtc-brands', name: 'DTC Brands', description: 'Direct-to-consumer brand design' },
      { id: 'creator-brands', name: 'Creator Brands', description: 'Personal brand identity for creators' },
    ],
    agencies: [
      { id: 'saas', name: 'SaaS', description: 'Design for SaaS agency clients' },
      { id: 'dtc-brands', name: 'DTC Brands', description: 'DTC brand design for agency clients' },
      { id: 'tech-startups', name: 'Tech Startups', description: 'Startup design for agency clients' },
    ],
    brands: [
      { id: 'dtc-brands', name: 'DTC Brands', description: 'Brand identity for direct-to-consumer companies' },
      { id: 'tech-startups', name: 'Tech Startups', description: 'Brand refresh for established tech companies' },
    ],
  },
};

/* ── Simulator Engine ── */

interface SimResult {
  demand: string;
  competition: string;
  speedToClient: string;
  recommendedOffer: string;
  clientSources: string[];
  score: number;
}

const BASE_SIM: Record<Track, Record<string, SimResult>> = {
  editor: {
    creators: { demand: 'High', competition: 'Medium', speedToClient: 'Fast', recommendedOffer: 'Content Editing Retainer', clientSources: ['YouTube', 'Instagram DM', 'X'], score: 88 },
    'course-creators': { demand: 'High', competition: 'Low', speedToClient: 'Fast', recommendedOffer: 'Course Video Production', clientSources: ['Email Outreach', 'LinkedIn', 'YouTube'], score: 92 },
    agencies: { demand: 'Medium', competition: 'Medium', speedToClient: 'Medium', recommendedOffer: 'White-Label Editing', clientSources: ['LinkedIn', 'Agency Directories', 'Referrals'], score: 72 },
    'personal-brands': { demand: 'High', competition: 'Low', speedToClient: 'Fast', recommendedOffer: 'Personal Brand Video Package', clientSources: ['Instagram DM', 'LinkedIn', 'X'], score: 90 },
  },
  developer: {
    startups: { demand: 'High', competition: 'High', speedToClient: 'Medium', recommendedOffer: 'MVP Development', clientSources: ['LinkedIn', 'IndieHackers', 'X', 'YC'], score: 75 },
    saas: { demand: 'High', competition: 'Medium', speedToClient: 'Medium', recommendedOffer: 'SaaS Feature Development', clientSources: ['LinkedIn', 'GitHub', 'X'], score: 82 },
    agencies: { demand: 'Medium', competition: 'Medium', speedToClient: 'Fast', recommendedOffer: 'Dev Partner Retainer', clientSources: ['LinkedIn', 'Agency Directories', 'Referrals'], score: 70 },
    'local-business': { demand: 'Medium', competition: 'Low', speedToClient: 'Fast', recommendedOffer: 'Website Build & Maintain', clientSources: ['Google My Business', 'Referrals', 'Local Networking'], score: 78 },
  },
  designer: {
    startups: { demand: 'High', competition: 'High', speedToClient: 'Medium', recommendedOffer: 'Startup Design System', clientSources: ['LinkedIn', 'Dribbble', 'YC'], score: 74 },
    creators: { demand: 'High', competition: 'Medium', speedToClient: 'Fast', recommendedOffer: 'Creator Brand Package', clientSources: ['Instagram DM', 'Dribbble', 'X'], score: 85 },
    agencies: { demand: 'Medium', competition: 'Medium', speedToClient: 'Fast', recommendedOffer: 'Design Partner Retainer', clientSources: ['LinkedIn', 'Behance', 'Referrals'], score: 71 },
    brands: { demand: 'Medium', competition: 'Medium', speedToClient: 'Medium', recommendedOffer: 'Brand Refresh & Guidelines', clientSources: ['LinkedIn', 'Referrals', 'Email Outreach'], score: 68 },
  },
};

const NICHE_MODIFIERS: Record<string, { scoreDelta: number; speedDelta: string }> = {
  'educational': { scoreDelta: 5, speedDelta: 'Fast' },
  'finance': { scoreDelta: 3, speedDelta: 'Medium' },
  'gaming': { scoreDelta: 0, speedDelta: 'Medium' },
  'podcast': { scoreDelta: 4, speedDelta: 'Fast' },
  'ai-startups': { scoreDelta: 8, speedDelta: 'Medium' },
  'saas': { scoreDelta: 3, speedDelta: 'Medium' },
  'ecommerce': { scoreDelta: 2, speedDelta: 'Medium' },
  'local-business': { scoreDelta: 0, speedDelta: 'Fast' },
  'dtc-brands': { scoreDelta: 4, speedDelta: 'Medium' },
  'tech-startups': { scoreDelta: 5, speedDelta: 'Medium' },
  'creator-brands': { scoreDelta: 3, speedDelta: 'Fast' },
};

function computeSimResult(track: Track | null, market: string | null, niche: string | null): SimResult | null {
  if (!track || !market) return null;
  const base = BASE_SIM[track]?.[market];
  if (!base) return null;
  const mod = niche ? NICHE_MODIFIERS[niche] : null;
  const score = Math.min(100, Math.max(10, base.score + (mod?.scoreDelta ?? 0)));
  const speed = mod?.speedDelta ?? base.speedToClient;
  return { ...base, score, speedToClient: speed };
}

/* ── Assets ── */

const ASSET_CATEGORIES = [
  {
    id: 'templates', label: 'Templates', icon: 'templates',
    items: [
      { id: 't1', title: 'Opportunity Profile Canvas', description: 'Document your opportunity profile.' },
      { id: 't2', title: 'Positioning Statement Worksheet', description: 'Guide for writing your positioning.' },
    ],
  },
  {
    id: 'prompts', label: 'Prompts', icon: 'prompts',
    items: [
      { id: 'p1', title: 'Opportunity Mapping Prompt', description: 'AI prompt for defining your service and market.' },
      { id: 'p2', title: 'Niche Selector Prompt', description: 'Evaluate and score niche options.' },
    ],
  },
  {
    id: 'examples', label: 'Examples', icon: 'examples',
    items: [
      { id: 'e1', title: 'Offer Examples by Track', description: 'Real positioning examples.' },
    ],
  },
  {
    id: 'checklists', label: 'Checklists', icon: 'checklists',
    items: [
      { id: 'c1', title: 'Phase 1 Checklist', description: 'Track your completion progress.' },
    ],
  },
  {
    id: 'videos', label: 'Videos', icon: 'videos',
    items: [
      { id: 'v1', title: 'Why Most Freelancers Never Get Clients', description: 'Overview of why positioning matters.' },
    ],
  },
];

/* ── Helpers ── */

interface SavedState {
  track: Track | null;
  selectedSkill: string | null;
  selectedMarket: string | null;
  selectedNiche: string | null;
  completedSections: string[];
}

function loadState(): SavedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedState;
  } catch { return null; }
}

function saveState(state: SavedState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { }
}

function getSectionStatus(id: SectionId, completedSections: Set<string>, activeSection: string): 'completed' | 'current' | 'locked' {
  if (completedSections.has(id)) return 'completed';
  if (id === activeSection) return 'current';
  const idx = SECTION_ORDER.indexOf(id);
  let lastCompletedIdx = -1;
  for (let i = 0; i < SECTION_ORDER.length; i++) {
    if (completedSections.has(SECTION_ORDER[i])) lastCompletedIdx = i;
  }
  return idx <= lastCompletedIdx + 1 ? 'current' : 'locked';
}

/* ── Page Component ── */

export function AcquisitionWorkspace() {
  const saved = useMemo(() => loadState(), []);

  const [selectedTrack, setSelectedTrack] = useState<Track | null>(saved?.track ?? null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(saved?.selectedSkill ?? null);
  const [selectedMarket, setSelectedMarket] = useState<string | null>(saved?.selectedMarket ?? null);
  const [selectedNiche, setSelectedNiche] = useState<string | null>(saved?.selectedNiche ?? null);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set(saved?.completedSections ?? []));
  const [activeSection, setActiveSection] = useState<SectionId>(
    (saved?.completedSections?.length ?? 0) > 0
      ? SECTION_ORDER[Math.min(saved!.completedSections.length, SECTION_ORDER.length - 1)]
      : 'career-track',
  );

  useEffect(() => {
    saveState({ track: selectedTrack, selectedSkill, selectedMarket, selectedNiche, completedSections: Array.from(completedSections) });
  }, [selectedTrack, selectedSkill, selectedMarket, selectedNiche, completedSections]);

  const sidebarItems = useMemo(() =>
    SECTION_ORDER.map((id) => ({ id, label: STEP_LABELS[id], icon: id, status: getSectionStatus(id, completedSections, activeSection) })),
    [completedSections, activeSection],
  );

  const progress = useMemo(() => (completedSections.size / SECTION_ORDER.length) * 100, [completedSections]);
  const currentIdx = SECTION_ORDER.indexOf(activeSection);

  const canNavigateTo = useCallback((id: string) => {
    const sectionId = id as SectionId;
    if (completedSections.has(sectionId)) return true;
    let lastIdx = -1;
    for (let i = 0; i < SECTION_ORDER.length; i++) {
      if (completedSections.has(SECTION_ORDER[i])) lastIdx = i;
    }
    return SECTION_ORDER.indexOf(sectionId) <= lastIdx + 1;
  }, [completedSections]);

  const handleSectionChange = useCallback((id: string) => { if (canNavigateTo(id)) setActiveSection(id as SectionId); }, [canNavigateTo]);
  const handlePrev = useCallback(() => { if (currentIdx > 0) { const p = SECTION_ORDER[currentIdx - 1]; if (canNavigateTo(p)) setActiveSection(p); } }, [currentIdx, canNavigateTo]);
  const handleNext = useCallback(() => { if (currentIdx < SECTION_ORDER.length - 1) { const n = SECTION_ORDER[currentIdx + 1]; if (canNavigateTo(n)) setActiveSection(n); } }, [currentIdx, canNavigateTo]);

  const completeSection = useCallback((id: SectionId) => {
    setCompletedSections((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    const idx = SECTION_ORDER.indexOf(id);
    if (idx < SECTION_ORDER.length - 1) setActiveSection(SECTION_ORDER[idx + 1]);
  }, []);

  const autoComplete = useCallback((id: SectionId) => {
    setCompletedSections((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    const idx = SECTION_ORDER.indexOf(id);
    if (idx < SECTION_ORDER.length - 1) setTimeout(() => setActiveSection(SECTION_ORDER[idx + 1]), 200);
  }, []);

  const handleTrackSelect = useCallback((track: Track) => { setSelectedTrack(track); autoComplete('career-track'); }, [autoComplete]);
  const handleSkillSelect = useCallback((id: string) => { setSelectedSkill(id); autoComplete('skill-inventory'); }, [autoComplete]);
  const handleMarketSelect = useCallback((id: string) => { setSelectedMarket(id); autoComplete('market-selection'); }, [autoComplete]);
  const handleNicheSelect = useCallback((id: string) => { setSelectedNiche(id); autoComplete('niche-mapping'); }, [autoComplete]);

  const canGoPrev = currentIdx > 0;
  const canGoNext = currentIdx < SECTION_ORDER.length - 1 && canNavigateTo(SECTION_ORDER[currentIdx + 1]);

  return (
    <WorkspaceShell
      phaseName="Opportunity Mapping"
      phaseNumber={1}
      totalPhases={7}
      progress={progress}
      currentObjective={STEP_OBJECTIVES[activeSection]}
      sidebarItems={sidebarItems}
      activeSection={activeSection}
      onSectionChange={handleSectionChange}
      assetCategories={ASSET_CATEGORIES}
    >
      <div className="space-y-6">
        <StepHeader
          label={STEP_LABELS[activeSection]}
          index={currentIdx}
          total={SECTION_ORDER.length}
          isCompleted={completedSections.has(activeSection)}
          selectedTrack={selectedTrack}
        />
        <SectionContent
          id={activeSection}
          selectedTrack={selectedTrack}
          onSelectTrack={handleTrackSelect}
          selectedSkill={selectedSkill}
          onSelectSkill={handleSkillSelect}
          selectedMarket={selectedMarket}
          onSelectMarket={handleMarketSelect}
          selectedNiche={selectedNiche}
          onSelectNiche={handleNicheSelect}
          onComplete={() => completeSection(activeSection)}
          isCompleted={completedSections.has(activeSection)}
        />
        <StepNav currentIdx={currentIdx} total={SECTION_ORDER.length} canGoPrev={canGoPrev} canGoNext={canGoNext} onPrev={handlePrev} onNext={handleNext} />
      </div>
    </WorkspaceShell>
  );
}

export default AcquisitionWorkspace;

/* ── Step Header ── */

function StepHeader({ label, index, total, isCompleted, selectedTrack }: {
  label: string; index: number; total: number; isCompleted: boolean; selectedTrack: Track | null;
}) {
  return (
    <div className="flex items-start gap-4 pb-6 border-b border-white/[0.06] mb-6">
      <div className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold border',
        isCompleted ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' : 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary',
      )}>{String(index + 1).padStart(2, '0')}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mb-1">
          {selectedTrack && <span className="text-brand-primary">{TRACK_ICONS[selectedTrack]}</span>}
          <span>Step {index + 1} of {total}</span>
          {selectedTrack && <><span className="text-white/15">&middot;</span><span className="text-white/40">{TRACK_LABELS[selectedTrack]}</span></>}
        </div>
        <h1 className="text-lg font-bold text-white tracking-tight">{label}</h1>
      </div>
      {isCompleted && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-400/10 border border-emerald-400/20 shrink-0">
          <CheckCircle size={10} className="text-emerald-400" />
          <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-[0.1em]">Done</span>
        </div>
      )}
    </div>
  );
}

/* ── Step Nav ── */

function StepNav({ currentIdx, total, canGoPrev, canGoNext, onPrev, onNext }: {
  currentIdx: number; total: number; canGoPrev: boolean; canGoNext: boolean; onPrev: () => void; onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 pt-6 mt-8 border-t border-white/[0.06]">
      <button onClick={onPrev} disabled={!canGoPrev}
        className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer',
          canGoPrev ? 'bg-white/[0.04] border border-white/[0.08] text-white/60 hover:bg-white/[0.06] hover:text-white/80' : 'bg-white/[0.02] border border-white/[0.04] text-white/20 cursor-not-allowed')}>
        <ArrowLeft size={14} /> Previous
      </button>
      <div className="flex items-center gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={cn('w-1.5 h-1.5 rounded-full transition-all duration-300', i === currentIdx ? 'bg-brand-primary w-3' : i < currentIdx ? 'bg-white/30' : 'bg-white/[0.08]')} />
        ))}
      </div>
      <button onClick={onNext} disabled={!canGoNext}
        className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer',
          canGoNext ? 'bg-white/[0.04] border border-white/[0.08] text-white/60 hover:bg-white/[0.06] hover:text-white/80' : 'bg-white/[0.02] border border-white/[0.04] text-white/20 cursor-not-allowed')}>
        Next <ArrowRight size={14} />
      </button>
    </div>
  );
}

/* ── Section Router ── */

interface SectionContentProps {
  id: SectionId;
  selectedTrack: Track | null;
  onSelectTrack: (t: Track) => void;
  selectedSkill: string | null;
  onSelectSkill: (id: string) => void;
  selectedMarket: string | null;
  onSelectMarket: (id: string) => void;
  selectedNiche: string | null;
  onSelectNiche: (id: string) => void;
  onComplete: () => void;
  isCompleted: boolean;
}

function SectionContent(props: SectionContentProps) {
  switch (props.id) {
    case 'career-track': return <CareerTrackContent {...props} />;
    case 'skill-inventory': return <SkillInventoryContent {...props} />;
    case 'market-selection': return <MarketSelectionContent {...props} />;
    case 'niche-mapping': return <NicheMappingContent {...props} />;
    case 'positioning-engine': return <PositioningEngineContent {...props} />;
    case 'opportunity-simulator': return <OpportunitySimulatorContent {...props} />;
    case 'opportunity-report': return <OpportunityReportContent {...props} />;
    default: return null;
  }
}

/* ── Complete Button ── */

function CompleteButton({ onComplete, isCompleted, label }: { onComplete: () => void; isCompleted: boolean; label?: string }) {
  if (isCompleted) return null;
  return (
    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={onComplete}
      className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-brand-primary text-white text-[11px] font-bold hover:bg-brand-primary/90 transition-colors cursor-pointer mt-8 shadow-[0_4px_20px_-8px_rgba(0,88,190,0.3)]">
      <CheckCircle size={14} /> {label || 'Complete Step'} <ArrowRight size={14} />
    </motion.button>
  );
}

/* ── 1. Career Track ── */

function CareerTrackContent({ selectedTrack, onSelectTrack, onComplete, isCompleted }: SectionContentProps) {
  return (
    <div>
      <p className="text-sm text-white/60 leading-relaxed mb-6">
        Choose your career track. This determines which skills, markets, and opportunities
        are relevant to you. You can change this later.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {(['editor', 'developer', 'designer'] as Track[]).map((t) => {
          const isSelected = selectedTrack === t;
          return (
            <motion.button key={t} whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}
              onClick={() => { onSelectTrack(t); if (!isCompleted) setTimeout(() => onComplete(), 200); }}
              className={cn('p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer',
                isSelected ? 'border-brand-primary/40 bg-brand-primary/[0.06] shadow-[0_0_30px_-8px_rgba(0,88,190,0.15)]' : 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.12]')}>
              <p className="text-xl mb-2">{TRACK_ICONS[t]}</p>
              <p className={cn('text-sm font-semibold mb-1', isSelected ? 'text-white' : 'text-white/80')}>{TRACK_LABELS[t]}</p>
              <p className="text-[11px] text-white/40 leading-relaxed">{TRACK_DESCRIPTIONS[t]}</p>
              {isSelected && <div className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-brand-primary"><Check size={10} /> Selected</div>}
            </motion.button>
          );
        })}
      </div>
      <CompleteButton onComplete={onComplete} isCompleted={isCompleted} label="Confirm Track" />
    </div>
  );
}

/* ── 2. Skill Inventory ── */

function SkillInventoryContent({ selectedTrack, selectedSkill, onSelectSkill }: SectionContentProps) {
  if (!selectedTrack) return <GuardMsg>Select your career track first.</GuardMsg>;
  return (
    <div>
      <p className="text-sm text-white/60 leading-relaxed mb-6">
        Choose the primary skill you'll offer. Pick the one with the highest demand
        and clearest client outcome.
      </p>
      <SkillInventory skills={TRACK_SKILLS[selectedTrack]} selected={selectedSkill} onSelect={onSelectSkill} />
    </div>
  );
}

/* ── 3. Market Selection ── */

function MarketSelectionContent({ selectedTrack, selectedMarket, onSelectMarket, onComplete, isCompleted }: SectionContentProps) {
  if (!selectedTrack) return <GuardMsg>Select your career track first.</GuardMsg>;
  const markets = TRACK_MARKETS[selectedTrack];
  const selected = markets.find((m) => m.id === selectedMarket);
  return (
    <div>
      <p className="text-sm text-white/60 leading-relaxed mb-6">Choose your target market. Your track: <strong className="text-white/90">{TRACK_LABELS[selectedTrack]}</strong></p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {markets.map((m) => {
          const isSel = selectedMarket === m.id;
          return (
            <motion.button key={m.id} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}
              onClick={() => { onSelectMarket(m.id); if (!isCompleted) setTimeout(() => onComplete(), 200); }}
              className={cn('p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer',
                isSel ? 'border-brand-primary/40 bg-brand-primary/[0.06] shadow-[0_0_30px_-8px_rgba(0,88,190,0.15)]' : 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.12]')}>
              <p className={cn('text-sm font-semibold mb-1', isSel ? 'text-white' : 'text-white/80')}>{m.name}</p>
              <p className="text-[11px] text-white/40 leading-relaxed">{m.description}</p>
              {isSel && <div className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-brand-primary"><Check size={10} /> Selected</div>}
            </motion.button>
          );
        })}
      </div>
      {selected && <SelectionBanner>Market: <span className="font-semibold text-brand-primary">{selected.name}</span></SelectionBanner>}
      {!selectedMarket && <CompleteButton onComplete={onComplete} isCompleted={isCompleted} />}
    </div>
  );
}

/* ── 4. Niche Mapping ── */

function NicheMappingContent({ selectedTrack, selectedMarket, selectedNiche, onSelectNiche, onComplete, isCompleted }: SectionContentProps) {
  if (!selectedTrack) return <GuardMsg>Select your career track first.</GuardMsg>;
  if (!selectedMarket) return <GuardMsg>Select your market in Market Selection first.</GuardMsg>;
  const marketObj = TRACK_MARKETS[selectedTrack].find((m) => m.id === selectedMarket);
  const niches = TRACK_NICHES[selectedTrack]?.[selectedMarket] ?? [];
  const selected = niches.find((n) => n.id === selectedNiche);
  return (
    <div>
      <p className="text-sm text-white/60 leading-relaxed mb-6">
        Within <strong className="text-white/90">{marketObj?.name ?? selectedMarket}</strong>, pick a specific niche.
        The narrower your focus, the easier it is to attract clients.
      </p>
      {niches.length === 0 ? (
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-6">
          <Crosshair size={16} className="text-brand-primary mb-3" />
          <p className="text-xs font-semibold text-white/80 mb-1">No Niches Defined</p>
          <p className="text-[11px] text-white/40">This market has no predefined niches yet. Try a different market.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {niches.map((n) => {
            const isSel = selectedNiche === n.id;
            return (
              <motion.button key={n.id} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}
                onClick={() => { onSelectNiche(n.id); if (!isCompleted) setTimeout(() => onComplete(), 200); }}
                className={cn('p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer',
                  isSel ? 'border-brand-primary/40 bg-brand-primary/[0.06] shadow-[0_0_30px_-8px_rgba(0,88,190,0.15)]' : 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.12]')}>
                <p className={cn('text-sm font-semibold mb-1', isSel ? 'text-white' : 'text-white/80')}>{n.name}</p>
                <p className="text-[11px] text-white/40 leading-relaxed">{n.description}</p>
                {isSel && <div className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-brand-primary"><Check size={10} /> Selected</div>}
              </motion.button>
            );
          })}
        </div>
      )}
      {selected && <SelectionBanner>Niche: <span className="font-semibold text-brand-primary">{selected.name}</span></SelectionBanner>}
      {!selectedNiche && <CompleteButton onComplete={onComplete} isCompleted={isCompleted} />}
    </div>
  );
}

/* ── 5. Positioning Engine ── */

function PositioningEngineContent({ selectedTrack, selectedMarket, selectedNiche, onComplete, isCompleted }: SectionContentProps) {
  const skillName = selectedTrack ? TRACK_SKILLS[selectedTrack].find((s) => s.id === '') : null;
  return (
    <div>
      <p className="text-sm text-white/60 leading-relaxed mb-6">
        Combine everything into a single positioning statement. This is your headline everywhere.
      </p>
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-brand-primary" />
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">Positioning Formula</p>
        </div>
        <p className="text-sm text-white/90 font-semibold leading-relaxed">
          I help {selectedMarket ? TRACK_MARKETS[selectedTrack!]?.find((m) => m.id === selectedMarket)?.name ?? '[market]' : '[market]'}
          {' '}achieve {selectedNiche ? '[outcome]' : '[outcome]'}
          {' '}by {selectedTrack ? TRACK_LABELS[selectedTrack]?.toLowerCase() ?? '[service]' : '[service]'}.
        </p>
        <p className="text-[10px] text-white/30 mt-3">Replace [outcome] with the specific result your clients get.</p>
      </div>
      <CompleteButton onComplete={onComplete} isCompleted={isCompleted} />
    </div>
  );
}

/* ── 6. Opportunity Simulator ── */

function OpportunitySimulatorContent({ selectedTrack, selectedMarket, selectedNiche, onComplete, isCompleted }: SectionContentProps) {
  const result = computeSimResult(selectedTrack, selectedMarket, selectedNiche);
  const [generated, setGenerated] = useState(false);

  if (!selectedTrack || !selectedMarket) {
    return <GuardMsg>Complete Career Track and Market Selection first.</GuardMsg>;
  }

  if (!result) {
    return <GuardMsg>Unable to calculate score for this combination.</GuardMsg>;
  }

  if (!generated && !isCompleted) {
    return (
      <div>
        <p className="text-sm text-white/60 leading-relaxed mb-6">
          Generate your opportunity score based on your selections.
        </p>
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-6 text-center">
          <BarChart3 size={24} className="text-brand-primary mx-auto mb-3" />
          <p className="text-sm text-white/70 mb-4">Ready to analyze your opportunity</p>
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            onClick={() => setGenerated(true)}
            className="px-6 py-3 rounded-xl bg-brand-primary text-white text-[11px] font-bold hover:bg-brand-primary/90 transition-colors cursor-pointer shadow-[0_4px_20px_-8px_rgba(0,88,190,0.3)]">
            Generate Score
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-white/60 leading-relaxed mb-6">
        Your opportunity analysis is ready.
      </p>

      {/* Score Circle */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative w-28 h-28">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            <circle cx="60" cy="60" r="52" fill="none" stroke="#0058be" strokeWidth="6" strokeDasharray={`${(result.score / 100) * 327} 327`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">{result.score}</span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <MetricCard icon={<TrendingUp size={14} />} label="Demand" value={result.demand} />
        <MetricCard icon={<Target size={14} />} label="Competition" value={result.competition} />
        <MetricCard icon={<Activity size={14} />} label="Speed" value={result.speedToClient} />
      </div>

      {/* Recommendation */}
      <div className="p-5 rounded-2xl bg-brand-primary/5 border border-brand-primary/20 mb-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-primary/60 mb-2">Recommended Offer</p>
        <p className="text-sm font-semibold text-white">{result.recommendedOffer}</p>
      </div>

      {/* Client Sources */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-6">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2">Top Client Sources</p>
        <div className="flex flex-wrap gap-2">
          {result.clientSources.map((src) => (
            <span key={src} className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] font-medium text-white/60">{src}</span>
          ))}
        </div>
      </div>

      <CompleteButton onComplete={onComplete} isCompleted={isCompleted} label="Generate Report" />
    </div>
  );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  const color = value === 'High' || value === 'Fast' ? 'text-emerald-400' : value === 'Medium' ? 'text-amber-400' : 'text-red-400';
  return (
    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
      <div className="flex justify-center mb-2 text-brand-primary">{icon}</div>
      <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-white/30 mb-1">{label}</p>
      <p className={cn('text-sm font-bold', color)}>{value}</p>
    </div>
  );
}

/* ── 7. Opportunity Report ── */

function OpportunityReportContent({ selectedTrack, selectedSkill, selectedMarket, selectedNiche, onComplete, isCompleted }: SectionContentProps) {
  const result = computeSimResult(selectedTrack, selectedMarket, selectedNiche);
  const skillName = selectedTrack && selectedSkill ? TRACK_SKILLS[selectedTrack].find((s) => s.id === selectedSkill)?.title : null;
  const marketName = selectedTrack && selectedMarket ? TRACK_MARKETS[selectedTrack].find((m) => m.id === selectedMarket)?.name : null;
  const nicheName = selectedNiche ? null : null; // will find below
  let nicheNameStr: string | null = null;
  if (selectedTrack && selectedMarket && selectedNiche) {
    const niches = TRACK_NICHES[selectedTrack]?.[selectedMarket] ?? [];
    nicheNameStr = niches.find((n) => n.id === selectedNiche)?.name ?? null;
  }

  if (!isCompleted) {
    return (
      <div>
        <p className="text-sm text-white/60 leading-relaxed mb-6">
          Generate your report to review everything you've defined.
        </p>
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-6 text-center">
          <FileText size={24} className="text-brand-primary mx-auto mb-3" />
          <p className="text-xs text-white/40">Complete the Simulator to generate your report.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-6 space-y-4">
        {/* Track */}
        <ReportRow label="Career Track" value={selectedTrack ? TRACK_LABELS[selectedTrack] : '—'} icon={selectedTrack ? TRACK_ICONS[selectedTrack] : ''} />
        <div className="border-t border-white/[0.06]" />
        {/* Skill */}
        <ReportRow label="Primary Skill" value={skillName ?? '—'} />
        <div className="border-t border-white/[0.06]" />
        {/* Market */}
        <ReportRow label="Target Market" value={marketName ?? '—'} />
        <div className="border-t border-white/[0.06]" />
        {/* Niche */}
        <ReportRow label="Niche" value={nicheNameStr ?? '—'} />
        <div className="border-t border-white/[0.06]" />
        {/* Score */}
        <ReportRow label="Opportunity Score" value={result ? `${result.score}/100` : '—'} highlight />
        <div className="border-t border-white/[0.06]" />
        {/* Offer */}
        <ReportRow label="Recommended Offer" value={result?.recommendedOffer ?? '—'} />
      </div>

      {/* Client Sources */}
      {result && (
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Client Acquisition Channels</p>
          <div className="flex flex-wrap gap-2">
            {result.clientSources.map((src) => (
              <span key={src} className="px-3 py-1.5 rounded-md bg-brand-primary/10 border border-brand-primary/20 text-[10px] font-semibold text-brand-primary">{src}</span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <CompleteButton onComplete={onComplete} isCompleted={isCompleted} label="Complete Phase 1" />
        <button className="px-5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] font-bold text-white/50 hover:bg-white/[0.06] transition-colors cursor-pointer">
          Export Report
        </button>
      </div>

      {isCompleted && (
        <div className="p-5 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 mt-6">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={16} className="text-emerald-400" />
            <p className="text-sm font-bold text-emerald-400">Phase 1 Complete</p>
          </div>
          <p className="text-xs text-white/50">All 7 steps completed. Ready for Phase 2: Offer Engineering System.</p>
        </div>
      )}
    </div>
  );
}

function ReportRow({ label, value, icon, highlight }: { label: string; value: string; icon?: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-medium text-white/40 uppercase tracking-[0.08em]">{icon ? `${icon} ${label}` : label}</span>
      <span className={cn('text-xs font-semibold text-right', highlight ? 'text-brand-primary' : 'text-white/80')}>{value}</span>
    </div>
  );
}

/* ── Shared Components ── */

function GuardMsg({ children }: { children: React.ReactNode }) {
  return <div className="p-4 rounded-xl bg-amber-400/5 border border-amber-400/20"><p className="text-xs text-amber-400/70">{children}</p></div>;
}

function SelectionBanner({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="p-3 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center gap-2">
      <Check size={12} className="text-brand-primary shrink-0" />
      <p className="text-xs text-brand-primary/80">{children}</p>
    </motion.div>
  );
}
