/**
 * Section 3: Platform Studio
 * 
 * "Ab har platform ko ek-ek karke optimize kar"
 * Tab-based platform editor with Live OS Mockup (Left) + Copy Editor (Right).
 * Migrated & cleaned from the original ProfileStrategySection monolith.
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Pencil,
  RotateCcw,
  Rocket,
  CheckSquare,
  ArrowLeftRight,
} from 'lucide-react';
import { ModuleButton } from '@/src/components/workspace/ModuleButton';
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


import { COPY_FORMULAS, applyCopyFormula } from '@/src/lib/module3/copyFormulas';
import { CopyExportModal } from '@/src/components/module3/step3/export/CopyExportModal';

// ── Helper ──────────────────────────────────────────────────────────────────

// ──────────────────────────────────────────────────────────────────────────────────────────────────


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

  const [showToneSelector, setShowToneSelector] = useState(false);
  const [viewingOptionalPlatform, setViewingOptionalPlatform] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPlatformDropdownOpen, setIsPlatformDropdownOpen] = useState(false);
  const [previewPosition, setPreviewPosition] = useState<'right' | 'left'>('right');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsPlatformDropdownOpen(false);
      }
    };
    if (isPlatformDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPlatformDropdownOpen]);

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

  const allPlatformsOrdered = [...primaryPlatforms, ...secondaryPlatforms];
  const currentGlobalIndex = allPlatformsOrdered.findIndex(p => p.key === activeTab);

  const handlePrevPlatform = () => {
    if (currentGlobalIndex > 0) {
      handleSelectPlatform(allPlatformsOrdered[currentGlobalIndex - 1].key);
    }
  };
  const handleNextPlatform = () => {
    if (currentGlobalIndex < allPlatformsOrdered.length - 1) {
      handleSelectPlatform(allPlatformsOrdered[currentGlobalIndex + 1].key);
    }
  };

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

  const currentHeadline = activePlatformData.fields.find(f => f.key.includes('headline') || f.key.includes('hero'))?.value || '';
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

  // ── Render: Phone Mockup ────────────────────────────────────────────────────
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

      {/* ── Unified Platform Command Bar ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.PREMIUM }}
        className="relative"
      >
        {/* Main Toolbar Container */}
        <div className="bg-white border border-neutral-200/80 shadow-xs rounded-2xl p-1.5 flex flex-col sm:flex-row sm:items-center gap-1.5 relative z-10 overflow-visible">
          
          <div className="flex items-center flex-1 min-w-0">
            {/* Prev Button */}
            <button
              onClick={handlePrevPlatform}
              disabled={currentGlobalIndex <= 0}
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all',
                currentGlobalIndex <= 0
                  ? 'text-neutral-300 cursor-not-allowed'
                  : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 cursor-pointer'
              )}
              aria-label="Previous platform"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Platform Dropdown Selector (Borderless) */}
            <div className="relative flex-1 min-w-0" ref={dropdownRef}>
              <button
                onClick={() => setIsPlatformDropdownOpen(!isPlatformDropdownOpen)}
                className="w-full flex items-center justify-between gap-3 px-2 py-1.5 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Platform Icon */}
                  {currentPlatformMeta && (
                    <div className={cn('w-6 h-6 rounded-md flex items-center justify-center text-white shrink-0 shadow-sm', currentPlatformMeta.brandColor)}>
                      <currentPlatformMeta.icon className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}

                  {/* Platform Name + Status */}
                  <div className="flex-1 min-w-0 text-left flex flex-col justify-center">
                    <div className="flex items-center gap-1.5 leading-tight">
                      <span className="text-sm font-extrabold text-neutral-900 truncate tracking-tight">{platformLabel}</span>
                      {!isViewingOptional && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#0058be] bg-blue-50/80 px-1.5 py-[1px] rounded-sm shrink-0">Core</span>
                      )}
                      {reviewedPlatforms.has(activeTab) && (
                        <Check size={12} strokeWidth={3} className="text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-400 font-medium leading-tight mt-0.5">
                      {isViewingOptional ? 'Optional Channel' : `${currentPlatformIndex + 1} of ${primaryPlatforms.length} required`}
                    </span>
                  </div>
                </div>

                {/* Chevron */}
                <ChevronDown size={14} className={cn('text-neutral-400 transition-transform shrink-0', isPlatformDropdownOpen && 'rotate-180')} />
              </button>

              {/* Dropdown Panel */}
              <AnimatePresence>
                {isPlatformDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200/80 rounded-2xl shadow-xl z-50 max-h-[360px] overflow-y-auto overflow-x-hidden py-1"
                  >
                    {/* Core Platforms Section */}
                    <div className="px-3 pt-3 pb-1.5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Core Platforms</span>
                    </div>
                    {primaryPlatforms.map(p => {
                      const isReviewed = reviewedPlatforms.has(p.key);
                      const isCurrent = activeTab === p.key;
                      const Icon = p.icon;
                      return (
                        <button
                          key={p.key}
                          onClick={() => { handleSelectPlatform(p.key); setIsPlatformDropdownOpen(false); }}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2 text-left transition-colors cursor-pointer',
                            isCurrent ? 'bg-blue-50/50' : 'hover:bg-neutral-50'
                          )}
                        >
                          <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm', p.brandColor)}>
                            <Icon className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className={cn('text-sm flex-1', isCurrent ? 'text-[#0058be] font-extrabold' : 'text-neutral-700 font-medium')}>
                            {p.name}
                          </span>
                          {isReviewed && <Check size={14} strokeWidth={3} className="text-emerald-500 shrink-0" />}
                          {isCurrent && !isReviewed && (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#0058be] shrink-0" />
                          )}
                        </button>
                      );
                    })}

                    {/* Optional Platforms Section */}
                    {secondaryPlatforms.length > 0 && (
                      <>
                        <div className="h-px bg-neutral-100 mx-3 my-2" />
                        <div className="px-3 pt-2 pb-1.5">
                          <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Other Channels</span>
                        </div>
                        {secondaryPlatforms.map(p => {
                          const isReviewed = reviewedPlatforms.has(p.key);
                          const isCurrent = activeTab === p.key;
                          const Icon = p.icon;
                          return (
                            <button
                              key={p.key}
                              onClick={() => { handleSelectPlatform(p.key); setIsPlatformDropdownOpen(false); }}
                              className={cn(
                                'w-full flex items-center gap-3 px-3 py-2 text-left transition-colors cursor-pointer',
                                isCurrent ? 'bg-blue-50/50' : 'hover:bg-neutral-50'
                              )}
                            >
                              <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm', p.brandColor)}>
                                <Icon className="w-3.5 h-3.5 text-white" />
                              </div>
                              <span className={cn('text-sm flex-1', isCurrent ? 'text-[#0058be] font-extrabold' : 'text-neutral-500 font-medium')}>
                                {p.name}
                              </span>
                              {isReviewed && <Check size={14} strokeWidth={3} className="text-emerald-500 shrink-0" />}
                            </button>
                          );
                        })}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextPlatform}
              disabled={currentGlobalIndex >= allPlatformsOrdered.length - 1}
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all',
                currentGlobalIndex >= allPlatformsOrdered.length - 1
                  ? 'text-neutral-300 cursor-not-allowed'
                  : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 cursor-pointer'
              )}
              aria-label="Next platform"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="hidden sm:block w-px h-6 bg-neutral-200/80 shrink-0 mx-1" />

          {/* Tools Area (Right side) */}
          <div className="flex items-center gap-1">
            {/* Tone Selector (compact inline) */}
            <div className="relative flex-1 sm:flex-none">
              <button
                onClick={() => setShowToneSelector(!showToneSelector)}
                className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-3 py-2 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer text-xs"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-400 font-medium">Tone:</span>
                  <span className="font-bold text-[#0058be]">{TONES.find(t => t.key === activeTone)?.label || 'Professional'}</span>
                </div>
                <ChevronDown size={12} className={cn('text-neutral-400 transition-transform shrink-0', showToneSelector && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {showToneSelector && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 bg-white border border-neutral-200/80 rounded-2xl shadow-xl z-50 w-56 p-1.5"
                  >
                    {TONES.map(tone => (
                      <button
                        key={tone.key}
                        onClick={() => { onToneChange(tone.key); setShowToneSelector(false); }}
                        className={cn(
                          'w-full flex flex-col px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer',
                          activeTone === tone.key
                            ? 'bg-blue-50 text-[#0058be]'
                            : 'text-neutral-700 hover:bg-neutral-50'
                        )}
                      >
                        <span className="text-sm font-extrabold">{tone.label}</span>
                        <span className={cn('text-[10px] font-medium mt-0.5', activeTone === tone.key ? 'text-blue-500' : 'text-neutral-400')}>
                          {tone.desc}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Deep link */}
            {deepLink && deepLink !== '#' && (
              <>
                <div className="w-px h-6 bg-neutral-200/80 shrink-0 mx-1" />
                <a
                  href={deepLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-[#0058be] transition-colors shrink-0"
                  title={`Open ${platformLabel} profile`}
                >
                  <ExternalLink size={14} />
                </a>
              </>
            )}
          </div>
        </div>

        {/* Integrated Progress Bar (Slim track below the command bar) */}
        <div className="px-2 -mt-1 relative z-0">
          <div className="h-1 w-full bg-neutral-100 rounded-b-lg overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#0058be] to-emerald-500 rounded-r-full"
              initial={{ width: 0 }}
              animate={{ width: `${(reviewedPlatforms.size / Math.max(primaryPlatforms.length, 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: EASING.PREMIUM }}
            />
          </div>
        </div>
      </motion.div>

      {/* ── Editor Content ──────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: DURATION.FAST, ease: EASING.PREMIUM }}
          className="space-y-4"
        >


          {/* ── Split: Editor (Left Scroll) + Mockup (Right Sticky) ──── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Editor (Can be on Left or Right) & Verification Checklist */}
            <div className={cn("lg:col-span-7 flex flex-col h-[600px] bg-white border border-neutral-200/80 rounded-2xl shadow-sm overflow-hidden relative", previewPosition === 'left' ? 'lg:order-last' : 'lg:order-first')}>
              {/* Properties Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100 bg-neutral-50/50 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0058be]" />
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-800">
                    Platform Content
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-neutral-500">
                    {activePlatformData.fields.length} Editable Areas
                  </span>
                  <button
                    onClick={() => setPreviewPosition(p => p === 'right' ? 'left' : 'right')}
                    className="p-1 rounded-md hover:bg-neutral-200 text-neutral-400 hover:text-neutral-600 transition-colors"
                    title="Swap Layout Position"
                  >
                    <ArrowLeftRight size={14} />
                  </button>
                </div>
              </div>

              {/* Scrollable Fields Area */}
              <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col divide-y divide-neutral-100">
                  {activePlatformData.fields.map(field => {
                    const isEditing = editingField === field.key;
                    const charLimitKey = `${activeTab}_${field.key}`;
                    const charLimit = CHAR_LIMITS[charLimitKey];

                    return (
                      <div
                        key={field.key}
                        className={cn(
                          'p-5 transition-all group relative',
                          isEditing ? 'bg-blue-50/30' : 'hover:bg-neutral-50/30'
                        )}
                      >
                        <div className="flex items-start justify-between gap-6">
                          {/* Label & Character limit */}
                          <div className="w-1/3 shrink-0 pt-0.5">
                            <h4 className="text-xs font-extrabold text-neutral-800">{field.label}</h4>
                            {charLimit && (() => {
                              const len = field.value.length;
                              const ratio = len / charLimit;
                              const statusClass = 
                                len > charLimit ? 'text-red-600' :
                                ratio > 0.85 ? 'text-amber-600' :
                                'text-neutral-400';
                              
                              return (
                                <span className={cn('text-[10px] font-semibold mt-1.5 block', statusClass)}>
                                  {len} <span className="text-neutral-300 font-normal">/ {charLimit}</span>
                                </span>
                              );
                            })()}
                          </div>

                          {/* Content / Editor */}
                          <div className="flex-1 min-w-0">
                            {isEditing ? (
                              <div className="space-y-3">
                                <textarea
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="w-full text-xs text-neutral-800 bg-white border border-blue-200/80 rounded-xl p-3 min-h-[100px] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 resize-y leading-relaxed shadow-sm transition-all"
                                />
                                
                                {/* Inline formula toolbar */}
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {COPY_FORMULAS.map(formula => (
                                    <button
                                      key={formula.id}
                                      onClick={() => handleApplyFormula(field.key, formula.id)}
                                      className="px-2.5 py-1.5 bg-white hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 text-[10px] font-bold rounded-lg border border-neutral-200 transition-all cursor-pointer shadow-xs flex items-center"
                                      title={formula.description}
                                    >
                                      <Rocket size={10} className="inline mr-1.5 text-[#0058be]" />
                                      {formula.label}
                                    </button>
                                  ))}
                                </div>

                                <div className="flex items-center gap-2 justify-end pt-2">
                                  <button
                                    onClick={() => setEditingField(null)}
                                    className="px-3 py-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleEditSave(field.key)}
                                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-[#0058be] hover:bg-[#0048a0] text-white rounded-xl transition-all cursor-pointer shadow-sm"
                                  >
                                    <CheckCircle2 size={12} />
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="group/content relative">
                                <div className="text-xs text-neutral-600 leading-relaxed whitespace-pre-wrap pr-10">
                                  {field.value}
                                </div>
                                <div className="absolute top-0 right-0 opacity-0 group-hover/content:opacity-100 transition-opacity flex items-center gap-1">
                                  <button
                                    onClick={() => handleCopy(field.key, field.value)}
                                    className="p-1.5 bg-white shadow-xs hover:shadow-sm text-neutral-500 hover:text-neutral-900 rounded-lg transition-all cursor-pointer border border-neutral-200/60"
                                    title="Copy"
                                  >
                                    {copiedField === field.key ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                  </button>
                                  <button
                                    onClick={() => handleEditStart(field.key, field.value)}
                                    className="p-1.5 bg-white shadow-xs hover:shadow-sm text-neutral-500 hover:text-[#0058be] rounded-lg transition-all cursor-pointer border border-neutral-200/60"
                                    title="Edit"
                                  >
                                    <Pencil size={12} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>


              </div>

              {/* Mark as Reviewed + Nav (Footer) */}
              <div className="px-5 py-3.5 border-t border-neutral-100 bg-neutral-50/80 shrink-0 flex items-center justify-between">
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
                      ← Previous
                    </button>
                  )}
                </div>
                {!reviewedPlatforms.has(activeTab) ? (
                  <button
                    onClick={handleMarkReviewed}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <CheckCircle2 size={14} />
                    Mark {platformLabel} as Reviewed
                  </button>
                ) : !isViewingOptional && currentPlatformIndex < primaryPlatforms.length - 1 ? (
                  <button
                    onClick={() => { setCurrentPlatformIndex(currentPlatformIndex + 1); setEditingField(null); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#0058be] hover:bg-[#0048a0] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    Next Platform →
                  </button>
                ) : isViewingOptional ? (
                  <button
                    onClick={() => { setViewingOptionalPlatform(null); setEditingField(null); }}
                    className="px-4 py-2 text-xs font-bold text-[#0058be] hover:underline cursor-pointer"
                  >
                    ← Back to Primary
                  </button>
                ) : null}
              </div>
            </div>

            {/* Mockup (Can be on Right or Left) */}
            <div className={cn("lg:col-span-5 order-first", previewPosition === 'left' ? 'lg:order-first' : 'lg:order-last')}>
              <div className="lg:sticky lg:top-4">
                {renderMockup()}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Bottom: Continue CTA (Gated) ────────────────────────────── */}
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
                    ← Back
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
                Run Consistency Check &rarr;
              </ModuleButton>
            </div>
          </motion.div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <button onClick={onBack} className="text-xs font-bold text-neutral-500 hover:text-neutral-900 cursor-pointer">
                  ← Back
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
                Run Consistency Check &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

PlatformStudioSection.displayName = 'PlatformStudioSection';

