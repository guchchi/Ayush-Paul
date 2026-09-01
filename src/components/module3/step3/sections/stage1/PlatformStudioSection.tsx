/**
 * Section 3: Platform Studio
 * 
 * "Ab har platform ko ek-ek karke optimize kar"
 * Tab-based platform editor with Live OS Mockup (Left) + Copy Editor (Right).
 * Migrated & cleaned from the original ProfileStrategySection monolith.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { EASING, DURATION } from '@/src/lib/motion-presets';
import type { ProfileSystemAsset } from '@/src/data/module3/authority-suite-engine';
import { useModule3Store } from '@/src/lib/module3/store';
import {
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  ChevronDown,
  Pencil,
  RotateCcw,
  Rocket,
  CheckSquare,
} from 'lucide-react';
import { ModuleButton } from '@/src/components/workspace/ModuleButton';
import { ConsistencyAuditBadge } from '@/src/components/module3/step3/components/ConsistencyAuditBadge';
import { harmonizeProfilePositioning } from '@/src/lib/module3/authority-score-engine';
import { PLATFORM_REGISTRY, ALL_PLATFORMS_LIST } from '@/src/lib/module3/platformRegistry';
import { getMockupForPlatform, getInitials } from '@/src/components/module3/step3/mockups/PlatformMockups';

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface Props {
  profileSystem: ProfileSystemAsset[];
  userName: string;
  userHandle: string;
  activeTone: 'executive' | 'conversion' | 'direct';
  roleLabel: string;
  recommendedPlatforms: string[];
  onToneChange: (tone: 'executive' | 'conversion' | 'direct') => void;
  onUpdateField: (platform: string, fieldKey: string, value: string) => void;
  onResetField: (platform: string, fieldKey: string) => void;
  onBack?: () => void;
  onContinue: () => void;
}

// Derive ALL_PLATFORMS array shape from the unified registry for backward compat
const ALL_PLATFORMS = ALL_PLATFORMS_LIST.map(p => ({
  key: p.key,
  name: p.name,
  icon: p.icon,
  brandColor: p.brandColor,
  iconColor: p.iconColor,
}));

const CHAR_LIMITS: Record<string, number> = {
  linkedin_headline: 220,
  twitter_bio: 160,
  instagram_bio: 150,
  youtube_description: 5000,
};

const TONES = [
  { key: 'executive' as const, label: 'Professional', desc: 'Polished & Corporate' },
  { key: 'conversion' as const, label: 'Conversational', desc: 'Engaging & Direct' },
  { key: 'direct' as const, label: 'Casual', desc: 'Relaxed & Authentic' },
];

import { getChecklistForPlatform } from '@/src/lib/module3/platformChecklists';
import { COPY_FORMULAS, applyCopyFormula } from '@/src/lib/module3/copyFormulas';
import { CopyExportModal } from '@/src/components/module3/step3/export/CopyExportModal';

// ── Helper ──────────────────────────────────────────────────────────────────

const generateToneVariation = (text: string, tone: 'executive' | 'conversion' | 'direct') => {
  if (!text) return text;
  if (tone === 'executive') return text.startsWith('Verifiable') ? text : `Strategic Authority • ${text}`;
  if (tone === 'conversion') return `Proven ${text} — Eliminating Client Execution Risk.`;
  return `${text} | Guaranteed Delivery & Measurable ROI.`;
};


// ──────────────────────────────────────────────────────────────────────────────────────────────────

export const PlatformStudioSection: React.FC<Props> = React.memo(({
  profileSystem,
  userName,
  userHandle,
  activeTone,
  roleLabel,
  recommendedPlatforms,
  onToneChange,
  onUpdateField,
  onResetField,
  onBack,
  onContinue,
}) => {
  const primaryPlatforms = ALL_PLATFORMS.filter(p => recommendedPlatforms.includes(p.key));
  const secondaryPlatforms = ALL_PLATFORMS.filter(p => !recommendedPlatforms.includes(p.key));

  // Sequential flow: track current platform index within primary list
  const [currentPlatformIndex, setCurrentPlatformIndex] = useState(0);
  const [reviewedPlatforms, setReviewedPlatforms] = useState<Set<string>>(new Set());
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [showToneSelector, setShowToneSelector] = useState(false);
  const [viewingOptionalPlatform, setViewingOptionalPlatform] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const displayName = userName?.trim() || 'Your Name';
  const displayHandle = userHandle?.trim() || 'yourhandle';
  const initials = getInitials(userName?.trim() || 'YN');

  const mod1MarketId = useModule3Store(s => s.mod1MarketId);
  const mod1ServiceId = useModule3Store(s => s.mod1ServiceId);
  const mod2UniqueMechanism = useModule3Store(s => s.mod2UniqueMechanism);
  const mod1Positioning = useModule3Store(s => s.mod1Positioning);

  // Determine current active platform key
  const activeTab = viewingOptionalPlatform || (primaryPlatforms[currentPlatformIndex]?.key || 'linkedin');
  const isViewingOptional = !!viewingOptionalPlatform;

  const allPrimaryReviewed = primaryPlatforms.length > 0 && primaryPlatforms.every(p => reviewedPlatforms.has(p.key));

  // Helper for applying formulas
  const handleApplyFormula = (fieldKey: string, formulaId: string) => {
    const result = applyCopyFormula(formulaId, fieldKey, {
      market: (mod1MarketId || '').replace(/_/g, ' ') || 'clients',
      service: (mod1ServiceId || '').replace(/_/g, ' ') || 'systems',
      mechanism: mod2UniqueMechanism?.trim() || 'our proven methodology',
      positioning: mod1Positioning?.trim() || 'Specialist',
    });
    setEditValue(result);
  };

  const handleHarmonizeAll = () => {
    const harmonized = harmonizeProfilePositioning(profileSystem, `${roleLabel} | High-Impact Systems Architecture`);
    harmonized.forEach((asset) => {
      asset.fields.forEach((field) => {
        onUpdateField(asset.platform, field.key, field.value);
      });
    });
  };

  const toggleChecklist = (stepId: string) => {
    setCheckedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const handleExportAll = () => {
    const lines: string[] = [];
    lines.push(`# Social Profile Identity Export\n\n`);
    profileSystem.forEach(p => {
      const platformName = ALL_PLATFORMS.find(ap => ap.key === p.platform)?.name || p.platform;
      lines.push(`## === ${platformName.toUpperCase()} ===\n`);
      p.fields.forEach(f => {
        lines.push(`**${f.label}:**\n${f.value}\n`);
      });
      lines.push('\n');
    });
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedField('export_all');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const activePlatformData = useMemo(() => {
    return profileSystem.find(p => p.platform === activeTab) || {
      platform: activeTab,
      fields: [
        { key: 'headline', label: 'Authority Tagline', value: 'Strategic Authority Specialist', originalValue: '', isCustomized: false },
        { key: 'bio', label: 'Bio / About', value: 'Building high-impact solutions.', originalValue: '', isCustomized: false },
      ],
    };
  }, [profileSystem, activeTab]);

  const currentHeadline = generateToneVariation(
    activePlatformData.fields.find(f => f.key.includes('headline') || f.key.includes('hero'))?.value || '',
    activeTone
  );
  const currentBio = activePlatformData.fields.find(f => f.key.includes('bio') || f.key.includes('about') || f.key.includes('value'))?.value || '';
  const deepLink = PLATFORM_REGISTRY[activeTab]?.deepLink || '#';

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleEditStart = (fieldKey: string, value: string) => {
    setEditingField(fieldKey);
    setEditValue(value);
  };

  const handleEditSave = (fieldKey: string) => {
    onUpdateField(activeTab, fieldKey, editValue);
    setEditingField(null);
  };

  const platformLabel = ALL_PLATFORMS.find(p => p.key === activeTab)?.name || activeTab;
  const currentPlatformMeta = ALL_PLATFORMS.find(p => p.key === activeTab);

  const handleMarkReviewed = () => {
    setReviewedPlatforms(prev => new Set([...prev, activeTab]));
    setEditingField(null);
    if (!isViewingOptional && currentPlatformIndex < primaryPlatforms.length - 1) {
      setCurrentPlatformIndex(currentPlatformIndex + 1);
    }
  };

  const handleGoToPlatform = (index: number) => {
    setViewingOptionalPlatform(null);
    setCurrentPlatformIndex(index);
    setEditingField(null);
  };

  const handleSelectPlatform = (key: string) => {
    const primaryIdx = primaryPlatforms.findIndex(p => p.key === key);
    if (primaryIdx !== -1) {
      setViewingOptionalPlatform(null);
      setCurrentPlatformIndex(primaryIdx);
    } else {
      setViewingOptionalPlatform(key);
    }
    setEditingField(null);
  };

  // Ã¢â€â‚¬Ã¢â€â‚¬ Render: Phone Mockup Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  const renderMockup = () => (
    <div className="relative mx-auto w-[280px] bg-black rounded-[44px] p-2 shadow-2xl border-4 border-neutral-800">
      {/* Hardware buttons */}
      <div className="absolute top-20 -left-1.5 w-1 h-7 bg-neutral-800 rounded-l-md" />
      <div className="absolute top-32 -left-1.5 w-1 h-10 bg-neutral-800 rounded-l-md" />
      <div className="absolute top-44 -left-1.5 w-1 h-10 bg-neutral-800 rounded-l-md" />
      <div className="absolute top-32 -right-1.5 w-1 h-14 bg-neutral-800 rounded-r-md" />

      <div className="w-full h-full bg-neutral-100 rounded-[36px] overflow-hidden relative shadow-inner min-h-[480px] flex flex-col">
        {/* Dynamic Island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[90px] h-6 bg-black rounded-full z-20 flex items-center justify-between px-2">
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-800/80" />
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-900/50" />
        </div>

        {/* Status Bar */}
        <div className="flex justify-between items-center px-5 py-1.5 text-[10px] font-bold z-10 absolute top-0 w-full mix-blend-difference text-white/90">
          <span className="pl-1.5">9:41</span>
          <div className="flex gap-1 items-center pr-0.5">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21L23.6 7C22.2 5.5 17.6 2 12 2C6.4 2 1.8 5.5 0.4 7L12 21Z"/></svg>
            <div className="w-4 h-2 border border-current rounded-sm p-[1px] flex items-center">
              <div className="bg-current h-full w-[80%] rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* Screen Content */}
        <div className="h-full w-full pt-8 flex-1 overflow-y-auto hide-scrollbar bg-neutral-950 flex flex-col">
          {getMockupForPlatform(activeTab, {
            userName: displayName,
            userHandle: displayHandle,
            initials: initials,
            headline: currentHeadline,
            bio: currentBio,
            fieldValues: Object.fromEntries(activePlatformData.fields.map(f => [f.key, f.value]))
          })}
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/50 mix-blend-difference rounded-full z-20 mb-0.5" />
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-5 text-left font-sans">

      {/* â”€â”€ Top: Unified Platform Channels Bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              Platform Channels
              <span className="text-[10px] font-bold text-[#0058be] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                {reviewedPlatforms.size} of {primaryPlatforms.length} required reviewed
              </span>
            </h3>
          </div>
          {roleLabel && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              {roleLabel}
            </span>
          )}
        </div>

        {/* Combined Platforms: Tabs with pill design */}
        <div className="w-full relative">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Primary / Recommended Platforms */}
            {primaryPlatforms.map((p) => {
              const isReviewed = reviewedPlatforms.has(p.key);
              const isCurrent = activeTab === p.key;
              const Icon = p.icon;
              return (
                <button
                  key={p.key}
                  onClick={() => handleSelectPlatform(p.key)}
                  className={cn(
                    'relative flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-xl whitespace-nowrap transition-all duration-200 shrink-0 border cursor-pointer group',
                    isCurrent
                      ? 'bg-white text-[#0058be] border-neutral-200 shadow-sm ring-1 ring-neutral-200/50'
                      : isReviewed
                      ? 'bg-neutral-50 text-neutral-600 border-transparent hover:bg-neutral-100 hover:text-neutral-900'
                      : 'bg-transparent text-neutral-500 border-transparent hover:bg-neutral-50 hover:text-neutral-800'
                  )}
                >
                  {isReviewed ? (
                    <Check size={14} strokeWidth={3} className={cn("shrink-0", isCurrent ? "text-[#0058be]" : "text-emerald-500 group-hover:text-emerald-600")} />
                  ) : (
                    <span className={cn('shrink-0 flex items-center justify-center', isCurrent ? 'text-[#0058be]' : 'text-neutral-400 group-hover:text-neutral-500')}>
                      <Icon className="w-4 h-4" />
                    </span>
                  )}
                  <span>{p.name}</span>
                  
                  {/* Subtle indicator for core platforms instead of giant badge */}
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full ml-0.5", 
                    isCurrent ? "bg-blue-400" : isReviewed ? "bg-emerald-400" : "bg-neutral-300"
                  )} title="Core Platform" />
                </button>
              );
            })}

            {/* Divider between Recommended and Other platforms */}
            {secondaryPlatforms.length > 0 && (
              <div className="h-5 w-[1px] bg-neutral-200 mx-1 shrink-0 hidden sm:block" />
            )}

            {/* Secondary / Other Platforms */}
            {secondaryPlatforms.map(p => {
              const isReviewed = reviewedPlatforms.has(p.key);
              const isCurrent = activeTab === p.key;
              const Icon = p.icon;
              return (
                <button
                  key={p.key}
                  onClick={() => handleSelectPlatform(p.key)}
                  className={cn(
                    'relative flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-xl whitespace-nowrap transition-all duration-200 shrink-0 border cursor-pointer group',
                    isCurrent
                      ? 'bg-white text-neutral-900 border-neutral-200 shadow-sm ring-1 ring-neutral-200/50'
                      : isReviewed
                      ? 'bg-neutral-50 text-neutral-600 border-transparent hover:bg-neutral-100 hover:text-neutral-900'
                      : 'bg-transparent text-neutral-500 border-transparent hover:bg-neutral-50 hover:text-neutral-800'
                  )}
                >
                  {isReviewed ? (
                    <Check size={14} strokeWidth={3} className={cn("shrink-0", isCurrent ? "text-neutral-900" : "text-emerald-500 group-hover:text-emerald-600")} />
                  ) : (
                    <span className={cn('shrink-0 flex items-center justify-center', isCurrent ? 'text-neutral-900' : 'text-neutral-400 group-hover:text-neutral-500')}>
                      <Icon className="w-4 h-4" />
                    </span>
                  )}
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>
          
          {/* Progress bar mapped to the bottom of the tabs container */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#0058be] to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(reviewedPlatforms.size / Math.max(primaryPlatforms.length, 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: EASING.PREMIUM }}
            />
          </div>
        </div>
      </motion.div>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Tone Selector (Collapsible) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM, delay: 0.03 }}
      >
        <button
          onClick={() => setShowToneSelector(!showToneSelector)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-neutral-200 bg-white shadow-xs cursor-pointer hover:bg-neutral-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">Copy Variant:</span>
            <span className="text-xs font-bold text-[#0058be]">
              {TONES.find(t => t.key === activeTone)?.label || 'Professional'}
            </span>
          </div>
          <ChevronDown size={14} className={cn('text-neutral-400 transition-transform', showToneSelector && 'rotate-180')} />
        </button>

        <AnimatePresence>
          {showToneSelector && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-3 gap-2 pt-3 px-1">
                {TONES.map(tone => (
                  <button
                    key={tone.key}
                    onClick={() => { onToneChange(tone.key); setShowToneSelector(false); }}
                    className={cn(
                      'p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-0.5',
                      activeTone === tone.key
                        ? 'bg-[#0058be] text-white border-[#0058be] shadow-md'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    )}
                  >
                    <span className="text-xs font-bold block">{tone.label}</span>
                    <span className={cn('text-[9px] block', activeTone === tone.key ? 'text-blue-100' : 'text-neutral-400')}>
                      {tone.desc}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* â”€â”€ Current Platform Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
          className="space-y-4"
        >
          {/* Platform title bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentPlatformMeta && (
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs', currentPlatformMeta.brandColor)}>
                  <currentPlatformMeta.icon className="w-5 h-5 text-white" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#0b1c30]">{platformLabel}</h3>
                  {!isViewingOptional && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#0058be] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-neutral-400">
                  {isViewingOptional ? 'Optional Channel' : `Platform ${currentPlatformIndex + 1} of ${primaryPlatforms.length}`}
                  {reviewedPlatforms.has(activeTab) && <span className="text-emerald-600 font-bold ml-1.5">✓ Reviewed</span>}
                </p>
              </div>
            </div>
            {deepLink && deepLink !== '#' && (
              <a
                href={deepLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold text-[#0058be] hover:underline flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-xl border border-neutral-200 shadow-xs"
              >
                <ExternalLink size={10} />
                Open Edit ↗
              </a>
            )}
          </div>

          {/* Cross-Platform Consistency Diagnostic */}
          <ConsistencyAuditBadge
            profileSystem={profileSystem}
            onAlignAll={handleHarmonizeAll}
          />

          {/* ── Split: Editor (Left Scroll) + Mockup (Right Sticky) ──── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left: Copy Editor & Verification Checklist */}
            <div className="lg:col-span-7 space-y-3.5 max-h-[580px] overflow-y-auto pr-2 pb-4">
              {/* Field cards header */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
                  Editable Fields — {activePlatformData.fields.length} items
                </span>
                <span className="text-[10px] font-bold text-neutral-500">
                  Click edit or use one-click formulas below
                </span>
              </div>

              {activePlatformData.fields.map(field => {
                const isEditing = editingField === field.key;
                const charLimitKey = `${activeTab}_${field.key}`;
                const charLimit = CHAR_LIMITS[charLimitKey];

                return (
                  <div
                    key={field.key}
                    className={cn(
                      'p-4 rounded-2xl border bg-white shadow-xs space-y-2.5 transition-all',
                      isEditing ? 'border-[#0058be]/40 ring-1 ring-[#0058be]/10' : 'border-neutral-200 hover:border-neutral-300'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#0b1c30]">{field.label}</h4>
                      <div className="flex items-center gap-1.5">
                        {charLimit && (() => {
                          const len = field.value.length;
                          const ratio = len / charLimit;
                          const statusClass = 
                            len > charLimit ? 'text-red-700 bg-red-50 border-red-200' :
                            ratio > 0.85 ? 'text-amber-700 bg-amber-50 border-amber-200' :
                            'text-emerald-700 bg-emerald-50 border-emerald-200';
                          
                          return (
                            <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', statusClass)}>
                              {len}/{charLimit}
                            </span>
                          );
                        })()}
                        <button
                          onClick={() => handleCopy(field.key, field.value)}
                          className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-lg transition-all cursor-pointer border border-neutral-200"
                          title="Copy"
                        >
                          {copiedField === field.key ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        </button>
                        {!isEditing && (
                          <button
                            onClick={() => handleEditStart(field.key, field.value)}
                            className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-lg transition-all cursor-pointer border border-neutral-200"
                            title="Edit"
                          >
                            <Pencil size={12} />
                          </button>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        {/* Inline formula toolbar */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mr-1">Formula:</span>
                          {COPY_FORMULAS.map(formula => (
                            <button
                              key={formula.id}
                              onClick={() => handleApplyFormula(field.key, formula.id)}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold rounded-lg border border-blue-200 transition-all cursor-pointer"
                              title={formula.description}
                            >
                              <Rocket size={9} className="inline mr-1" />
                              {formula.label}
                            </button>
                          ))}
                        </div>
                        <textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full text-xs text-[#0b1c30] bg-neutral-50 border border-neutral-300 rounded-xl p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:bg-white resize-y font-sans leading-relaxed"
                        />
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => setEditingField(null)}
                            className="px-3 py-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleEditSave(field.key)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-[#0058be] hover:bg-[#0048a0] text-white rounded-xl transition-all cursor-pointer shadow-xs"
                          >
                            <CheckCircle2 size={12} />
                            Save & Sync
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-neutral-700 bg-neutral-50 p-3 rounded-xl border border-neutral-200/80 leading-relaxed whitespace-pre-wrap">
                        {field.value}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Micro-Audit Checklist */}
              {(() => {
                const checklist = getChecklistForPlatform(activeTab);
                const completedCount = checklist.filter(item => checkedSteps[item.id]).length;
                return (
                  <div className="p-4 rounded-2xl border border-neutral-200 bg-white shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-extrabold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                        <CheckSquare size={13} className="text-emerald-500" />
                        {platformLabel} Launch Checklist
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                        {completedCount}/{checklist.length} Done
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {checklist.map((item) => {
                        const isChecked = !!checkedSteps[item.id];
                        return (
                          <label key={item.id} className="flex items-start gap-2.5 cursor-pointer group hover:bg-neutral-50 p-1.5 rounded-lg transition-colors">
                            <div className={cn(
                              "w-4 h-4 mt-0.5 rounded flex items-center justify-center border transition-colors shrink-0",
                              isChecked ? "bg-emerald-500 border-emerald-500" : "bg-white border-neutral-300 group-hover:border-emerald-400"
                            )}>
                              {isChecked && <Check size={10} className="text-white" />}
                            </div>
                            <input type="checkbox" className="hidden" checked={isChecked} onChange={() => toggleChecklist(item.id)} />
                            <div className="flex-1 flex items-center justify-between gap-2">
                              <span className={cn("text-xs font-medium transition-colors", isChecked ? "text-neutral-400 line-through" : "text-neutral-700")}>
                                {item.label}
                              </span>
                              <span className="text-[9px] uppercase font-bold text-neutral-400 shrink-0">
                                {item.category}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Mark as Reviewed + Nav */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  {(currentPlatformIndex > 0 || isViewingOptional) && (
                    <button
                      onClick={() => {
                        if (isViewingOptional) {
                          setViewingOptionalPlatform(null);
                        } else {
                          setCurrentPlatformIndex(Math.max(0, currentPlatformIndex - 1));
                        }
                        setEditingField(null);
                      }}
                      className="px-3 py-2 text-xs font-bold text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors"
                    >
                      â† Previous
                    </button>
                  )}
                </div>
                {!reviewedPlatforms.has(activeTab) ? (
                  <button
                    onClick={handleMarkReviewed}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    <CheckCircle2 size={14} />
                    Mark {platformLabel} as Reviewed
                  </button>
                ) : !isViewingOptional && currentPlatformIndex < primaryPlatforms.length - 1 ? (
                  <button
                    onClick={() => { setCurrentPlatformIndex(currentPlatformIndex + 1); setEditingField(null); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#0058be] hover:bg-[#0048a0] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    Next Platform â†’
                  </button>
                ) : isViewingOptional ? (
                  <button
                    onClick={() => { setViewingOptionalPlatform(null); setEditingField(null); }}
                    className="px-4 py-2 text-xs font-bold text-[#0058be] hover:underline cursor-pointer"
                  >
                    â† Back to Primary
                  </button>
                ) : null}
              </div>
            </div>

            {/* Right: Sticky Phone Mockup */}
            <div className="lg:col-span-5 order-first lg:order-last">
              <div className="lg:sticky lg:top-4">
                {renderMockup()}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* â”€â”€ Bottom: Continue CTA (Gated) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="pt-4 border-t border-neutral-200/60">
        {allPrimaryReviewed ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Success banner */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle2 size={16} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900">All {primaryPlatforms.length} Primary Platforms Reviewed</p>
                <p className="text-[11px] text-emerald-700">Your profile copy is ready for the consistency check.</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {onBack && (
                  <button onClick={onBack} className="text-xs font-bold text-neutral-500 hover:text-neutral-900 cursor-pointer">
                    â† Back
                  </button>
                )}
                <button
                  onClick={handleExportAll}
                  className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-md cursor-pointer"
                >
                  {copiedField === 'export_all' ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  {copiedField === 'export_all' ? 'Bundle Copied!' : 'Export All Bios'}
                </button>
              </div>
              <ModuleButton variant="primary" onClick={onContinue}>
                Run Consistency Check â†’
              </ModuleButton>
            </div>
          </motion.div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <button onClick={onBack} className="text-xs font-bold text-neutral-500 hover:text-neutral-900 cursor-pointer">
                  Ã¢â€ Â Back
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-neutral-400 font-medium">
                Review all {primaryPlatforms.length} platforms to continue
              </span>
              <button
                disabled
                className="px-5 py-2.5 bg-neutral-200 text-neutral-400 text-xs font-bold rounded-xl cursor-not-allowed"
              >
                Run Consistency Check â†’
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

PlatformStudioSection.displayName = 'PlatformStudioSection';

