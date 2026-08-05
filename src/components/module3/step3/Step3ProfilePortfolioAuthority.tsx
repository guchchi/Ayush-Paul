import { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Shield, Sparkles, AlertTriangle, ArrowRight, CheckCircle2,
  ChevronDown, ChevronUp, ArrowUp, ArrowDown, Eye, EyeOff,
  Pencil, X, Check, Rocket, FileText, Copy, Download,
  Target, Award, TrendingUp, Users, Zap, MapPin
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { EASING, DURATION } from '../../../lib/motion-presets';
import { useModule3Store } from '../../../lib/module3/store';
import { generateProfilePortfolioAuthorityBlueprint } from '../../../data/module3/authority-strategy-engine';
import { StepHeader } from '../../workspace/StepHeader';
import type { MessageHierarchyLayer, PortfolioStructureSectionItem, EvidencePlacementMapping, NextMoveActionItem } from '../../../types/module3-step3-authority';

/* ─── Motion Tokens ─── */
const fadeUp = {
  initial: { opacity: 0, y: 16, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: DURATION.NORMAL, ease: EASING.PREMIUM },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

/* ─── Layer Icons ─── */
const LAYER_ICONS: Record<string, React.ReactNode> = {
  who_you_are: <Target className="w-4 h-4" />,
  what_you_do: <Zap className="w-4 h-4" />,
  who_you_help: <Users className="w-4 h-4" />,
  known_for: <Award className="w-4 h-4" />,
  why_credible: <Shield className="w-4 h-4" />,
  next_step: <ArrowRight className="w-4 h-4" />,
};

/* ════════════════════════════════════════════════════════════════════
   ZONE 1 — EXECUTIVE HERO BANNER
   ════════════════════════════════════════════════════════════════════ */
function ExecutiveHeroBanner({
  positioningClaim,
  proofCount,
  alignmentHealth,
  strongestProof,
  isStale,
  onRegenerate,
  onDismissStale,
}: {
  positioningClaim: string;
  proofCount: number;
  alignmentHealth: string;
  strongestProof: string;
  isStale: boolean;
  onRegenerate: () => void;
  onDismissStale: () => void;
}) {
  const healthColor = alignmentHealth.includes('Strong')
    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
    : alignmentHealth.includes('Moderate')
    ? 'text-amber-700 bg-amber-50 border-amber-200'
    : 'text-blue-700 bg-blue-50 border-blue-200';

  return (
    <motion.div {...fadeUp} className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-[#f8f9ff] to-[#eff4ff] p-6 sm:p-8 shadow-xs">
      {/* Subtle decorative gradient orb */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#0058be]/[0.04] blur-3xl pointer-events-none" />

      {/* Stale upstream warning — integrated subtly */}
      {isStale && (
        <div className="mb-5 p-3 rounded-xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Your Step 1 or Step 2 data was updated. Your overrides are preserved.</span>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={onDismissStale} className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-amber-800 font-medium hover:bg-amber-50 cursor-pointer">
              Keep Mine
            </button>
            <button onClick={onRegenerate} className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700 cursor-pointer flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Re-evaluate
            </button>
          </div>
        </div>
      )}

      <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-3">
          {/* Visual Input Pipeline Flow */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono font-semibold text-slate-500">
            <span className="bg-white/80 border border-slate-200 px-2 py-0.5 rounded-md text-[#0058be] font-bold">
              Step 1: Position
            </span>
            <span>+</span>
            <span className="bg-white/80 border border-slate-200 px-2 py-0.5 rounded-md text-emerald-700 font-bold">
              Step 2: Proof ({proofCount})
            </span>
            <span>+</span>
            <span className="bg-white/80 border border-slate-200 px-2 py-0.5 rounded-md text-slate-700">
              Mod 1 & 2 Context
            </span>
            <span className="text-[#0058be]">→</span>
            <span className="bg-[#0058be] text-white px-2 py-0.5 rounded-md font-bold">
              Step 3 Blueprint
            </span>
          </div>

          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#0058be]">
              <Shield className="w-3.5 h-3.5" />
              Synthesized Authority Position
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight leading-snug max-w-lg">
              {positioningClaim}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-center px-4 py-2.5 rounded-xl bg-white/80 border border-slate-200/60">
            <div className="text-2xl font-bold text-[#0b1c30] font-mono">{proofCount}</div>
            <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Proof Assets</div>
          </div>
          <div className={cn('text-center px-4 py-2.5 rounded-xl border', healthColor)}>
            <div className="text-sm font-bold font-mono">{alignmentHealth.split(' ')[0]}</div>
            <div className="text-[10px] font-medium uppercase tracking-wide opacity-80">Alignment</div>
          </div>
        </div>
      </div>

      {strongestProof && (
        <div className="mt-4 text-xs text-[#424754] font-medium">
          <span className="text-[#0058be] font-semibold">Strongest signal:</span> {strongestProof}
        </div>
      )}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   ZONE 2 — PROFILE MESSAGE ARCHITECTURE
   ════════════════════════════════════════════════════════════════════ */
function ProfileArchitectureSection({
  layers,
  onEditLayer,
  editingKey,
  editingText,
  setEditingText,
  onSaveEdit,
  onCancelEdit,
}: {
  layers: MessageHierarchyLayer[];
  onEditLayer: (key: string, currentText: string) => void;
  editingKey: string | null;
  editingText: string;
  setEditingText: (t: string) => void;
  onSaveEdit: (key: string) => void;
  onCancelEdit: () => void;
}) {
  const [expandedRationale, setExpandedRationale] = useState<string | null>(null);

  return (
    <motion.section {...fadeUp} className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-[#0b1c30] tracking-tight">Profile Message Architecture</h2>
        <p className="text-sm text-[#424754] mt-1 leading-relaxed max-w-2xl">
          When a prospect lands on your LinkedIn, X, or portfolio — they form a judgment in 5 seconds. Here's the exact message sequence your profile should communicate, in order:
        </p>
      </div>

      <motion.div {...stagger} className="relative pl-8 space-y-0">
        {/* Vertical timeline line */}
        <div className="absolute left-[15px] top-3 bottom-3 w-px bg-gradient-to-b from-[#0058be]/30 via-[#0058be]/15 to-transparent" />

        {layers.map((layer, idx) => {
          const isEditing = editingKey === layer.layerKey;
          const isExpanded = expandedRationale === layer.layerKey;
          const displayText = layer.userCustomization || layer.recommendedFocus;
          const isCustomized = !!layer.userCustomization;

          return (
            <motion.div
              key={layer.layerKey}
              variants={fadeUp}
              className="relative group"
            >
              {/* Timeline dot */}
              <div className={cn(
                'absolute -left-8 top-4 w-[30px] h-[30px] rounded-full border-2 flex items-center justify-center z-10 transition-colors',
                isCustomized
                  ? 'bg-[#0058be] border-[#0058be] text-white'
                  : 'bg-white border-[#0058be]/30 text-[#0058be]'
              )}>
                {LAYER_ICONS[layer.layerKey] || <span className="text-xs font-bold">{idx + 1}</span>}
              </div>

              <div className={cn(
                'ml-2 p-4 rounded-xl border transition-all',
                'bg-white border-slate-200/60 hover:border-[#0058be]/20 hover:shadow-xs',
                isCustomized && 'border-[#0058be]/20 bg-[#0058be]/[0.02]'
              )}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold text-[#0058be] uppercase tracking-wider">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <h4 className="text-sm font-bold text-[#0b1c30]">{layer.layerTitle.replace(/^\d+\.\s*/, '')}</h4>
                      {isCustomized && (
                        <span className="text-[9px] font-mono font-bold text-[#0058be] bg-[#0058be]/8 px-1.5 py-0.5 rounded">CUSTOMIZED</span>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="mt-2 space-y-2">
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          rows={2}
                          className="w-full bg-white border border-[#0058be]/30 rounded-lg p-2.5 text-xs text-[#0b1c30] focus:outline-none focus:border-[#0058be] resize-none"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button onClick={() => onSaveEdit(layer.layerKey)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#0058be] text-white cursor-pointer flex items-center gap-1">
                            <Check className="w-3 h-3" /> Save
                          </button>
                          <button onClick={onCancelEdit} className="text-xs text-slate-500 px-2 py-1.5 cursor-pointer flex items-center gap-1">
                            <X className="w-3 h-3" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[13px] text-[#0b1c30]/80 leading-relaxed">{displayText}</p>
                    )}
                  </div>

                  {!isEditing && (
                    <button
                      onClick={() => onEditLayer(layer.layerKey, displayText)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#0058be] cursor-pointer shrink-0"
                      title="Edit this layer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Collapsible rationale */}
                <button
                  onClick={() => setExpandedRationale(isExpanded ? null : layer.layerKey)}
                  className="mt-2 text-[11px] text-[#0058be]/70 hover:text-[#0058be] font-medium cursor-pointer flex items-center gap-1 transition-colors"
                >
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  Why this matters
                </button>
                {isExpanded && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-1.5 text-[11px] text-slate-500 leading-relaxed pl-4 border-l-2 border-[#0058be]/10"
                  >
                    {layer.strategicRationale}
                  </motion.p>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   ZONE 3 — PORTFOLIO JOURNEY CANVAS
   ════════════════════════════════════════════════════════════════════ */
function PortfolioJourneyCanvas({
  sections,
  evidencePlacements,
  onReorder,
  onToggle,
}: {
  sections: PortfolioStructureSectionItem[];
  evidencePlacements: EvidencePlacementMapping[];
  onReorder: (from: number, to: number) => void;
  onToggle: (id: string) => void;
}) {
  // Build a map of evidence placements to section titles for inline display
  const placementMap = useMemo(() => {
    const map: Record<string, EvidencePlacementMapping[]> = {};
    for (const ep of evidencePlacements) {
      const placement = ep.recommendedPlacement.toLowerCase();
      for (const sec of sections) {
        const title = sec.sectionTitle.toLowerCase();
        if (placement.includes('hero') && title.includes('hero')) {
          (map[sec.id] ??= []).push(ep);
        } else if (placement.includes('proof') && title.includes('proof')) {
          (map[sec.id] ??= []).push(ep);
        } else if (placement.includes('case') && title.includes('case')) {
          (map[sec.id] ??= []).push(ep);
        } else if (placement.includes('offer') && (title.includes('capability') || title.includes('offer'))) {
          (map[sec.id] ??= []).push(ep);
        } else if (placement.includes('trust') && title.includes('social')) {
          (map[sec.id] ??= []).push(ep);
        } else if (placement.includes('booking') && (title.includes('booking') || title.includes('next step'))) {
          (map[sec.id] ??= []).push(ep);
        }
      }
    }
    return map;
  }, [sections, evidencePlacements]);

  return (
    <motion.section {...fadeUp} className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-[#0b1c30] tracking-tight">Portfolio Section Sequence</h2>
        <p className="text-sm text-[#424754] mt-1 leading-relaxed max-w-2xl">
          This is the recommended order for your portfolio website. Proof is placed early to satisfy buyer skepticism before showing prices. Reorder sections if needed.
        </p>
      </div>

      <motion.div {...stagger} className="space-y-3">
        {sections.map((sec, idx) => {
          const linkedEvidence = placementMap[sec.id] || [];
          const isDisabled = !sec.isEnabled;

          return (
            <motion.div
              key={sec.id}
              variants={fadeUp}
              className={cn(
                'rounded-xl border transition-all',
                isDisabled
                  ? 'bg-slate-50/60 border-slate-200/60 opacity-50'
                  : 'bg-white border-slate-200/60 hover:border-[#0058be]/20 hover:shadow-xs'
              )}
            >
              <div className="p-4 flex items-start gap-4">
                {/* Position number */}
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-mono text-sm font-bold border',
                  isDisabled
                    ? 'bg-slate-100 text-slate-400 border-slate-200'
                    : 'bg-[#0058be]/8 text-[#0058be] border-[#0058be]/15'
                )}>
                  {String(sec.position).padStart(2, '0')}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className={cn('text-sm font-bold', isDisabled ? 'text-slate-400' : 'text-[#0b1c30]')}>
                      {sec.sectionTitle.replace(/^\d+\.\s*/, '')}
                    </h4>
                    <span className={cn(
                      'text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded',
                      isDisabled ? 'bg-slate-100 text-slate-400' : 'bg-[#eff4ff] text-[#0058be]'
                    )}>
                      {sec.structuralRole.split(' ')[0]}
                    </span>
                  </div>
                  <p className={cn('text-xs leading-relaxed', isDisabled ? 'text-slate-400' : 'text-[#424754]')}>
                    <span className="font-medium text-[#0058be]/60">Visitor thinks:</span> "{sec.visitorMindset}"
                  </p>

                  {/* Inline evidence placement callouts */}
                  {linkedEvidence.length > 0 && !isDisabled && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {linkedEvidence.map((ev) => (
                        <span
                          key={ev.id}
                          className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full"
                        >
                          <MapPin className="w-2.5 h-2.5" />
                          {ev.proofTitle}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onToggle(sec.id)}
                    className={cn(
                      'p-1.5 rounded-lg border cursor-pointer transition-colors',
                      sec.isEnabled
                        ? 'bg-white border-slate-200 text-slate-500 hover:text-[#0b1c30] hover:bg-slate-50'
                        : 'bg-rose-50 border-rose-200 text-rose-500'
                    )}
                    title={sec.isEnabled ? 'Hide section' : 'Show section'}
                  >
                    {sec.isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <div className="flex flex-col gap-0.5">
                    <button
                      disabled={idx === 0}
                      onClick={() => onReorder(idx, idx - 1)}
                      className="p-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-500 disabled:opacity-20 border border-slate-200/60 cursor-pointer"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      disabled={idx === sections.length - 1}
                      onClick={() => onReorder(idx, idx + 1)}
                      className="p-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-500 disabled:opacity-20 border border-slate-200/60 cursor-pointer"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   ZONE 4 — MASTER BLUEPRINT SUMMARY
   ════════════════════════════════════════════════════════════════════ */
function BlueprintSummaryPanel({
  positioningClaim,
  primaryCategory,
  strongestProof,
  profileFocus,
  topPriorities,
  evidencePlacement,
  alignmentScore,
  alignmentVerdict,
  diagnostics,
}: {
  positioningClaim: string;
  primaryCategory: string;
  strongestProof: string;
  profileFocus: string;
  topPriorities: string[];
  evidencePlacement: string;
  alignmentScore: number;
  alignmentVerdict: string;
  diagnostics: { severity: string; title: string; recommendation: string }[];
}) {
  const [copied, setCopied] = useState(false);

  const handleExportMarkdown = () => {
    const md = [
      `# Profile & Portfolio Authority Blueprint`,
      ``,
      `## Positioning Claim`,
      positioningClaim,
      ``,
      `## Primary Category`,
      primaryCategory,
      ``,
      `## Strongest Proof Anchor`,
      strongestProof,
      ``,
      `## Primary Profile Focus`,
      profileFocus,
      ``,
      `## Top Portfolio Priorities`,
      ...topPriorities.map((p, i) => `${i + 1}. ${p}`),
      ``,
      `## Key Evidence Placement`,
      evidencePlacement,
      ``,
      `## Alignment Score: ${alignmentScore}/100`,
      alignmentVerdict,
      ``,
      `## Diagnostics`,
      ...diagnostics.map((d) => `- **${d.title}**: ${d.recommendation}`),
    ].join('\n');

    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.section {...fadeUp} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0b1c30] tracking-tight">Your Authority Blueprint</h2>
          <p className="text-sm text-[#424754] mt-1">The strategic summary of your profile and portfolio decisions.</p>
        </div>
        <button
          onClick={handleExportMarkdown}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#0058be] hover:border-[#0058be]/30 cursor-pointer transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy as Markdown'}
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-[#f8f9ff] overflow-hidden shadow-xs">
        {/* Blueprint Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200/60">
          <BlueprintCell label="Positioning Claim" value={positioningClaim} accent />
          <BlueprintCell label="Primary Category" value={primaryCategory} />
          <BlueprintCell label="Strongest Proof Anchor" value={strongestProof} />
          <BlueprintCell label="Key Evidence Placement" value={evidencePlacement} />
          <BlueprintCell label="Profile Focus" value={profileFocus} />
          <BlueprintCell
            label="Alignment Health"
            value={`${alignmentScore}/100 — ${alignmentVerdict.split('—')[0].trim()}`}
            badge={alignmentScore >= 80 ? 'strong' : alignmentScore >= 60 ? 'moderate' : 'developing'}
          />
        </div>

        {/* Diagnostics strip */}
        {diagnostics.length > 0 && (
          <div className="px-5 py-4 border-t border-slate-200/60 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Diagnostics</span>
            {diagnostics.map((d, i) => (
              <div key={i} className={cn(
                'text-xs p-2.5 rounded-lg border flex items-start gap-2',
                d.severity === 'success' ? 'bg-emerald-50/60 border-emerald-200/60 text-emerald-800' :
                d.severity === 'warning' ? 'bg-amber-50/60 border-amber-200/60 text-amber-800' :
                'bg-rose-50/60 border-rose-200/60 text-rose-800'
              )}>
                {d.severity === 'success' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                <div>
                  <span className="font-semibold">{d.title.replace(/[✓⚠]/g, '').trim()}</span>
                  <span className="text-[11px] block mt-0.5 opacity-80">{d.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}

function BlueprintCell({ label, value, accent, badge }: { label: string; value: string; accent?: boolean; badge?: 'strong' | 'moderate' | 'developing' }) {
  return (
    <div className="bg-white p-4 space-y-1">
      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">{label}</span>
      <div className="flex items-start gap-2">
        <span className={cn('text-[13px] font-semibold leading-snug', accent ? 'text-[#0058be]' : 'text-[#0b1c30]')}>
          {value}
        </span>
        {badge && (
          <span className={cn(
            'text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded shrink-0 mt-0.5',
            badge === 'strong' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
            badge === 'moderate' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
            'bg-blue-50 text-blue-700 border border-blue-200'
          )}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   ZONE 5 — NEXT MOVES & STEP 4 HANDOFF
   ════════════════════════════════════════════════════════════════════ */
function NextMovesFooter({
  moves,
  onToggle,
  onProceed,
}: {
  moves: NextMoveActionItem[];
  onToggle: (id: string) => void;
  onProceed: () => void;
}) {
  const completed = moves.filter((m) => m.isCompleted).length;

  return (
    <motion.section {...fadeUp} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0b1c30] tracking-tight">Your Next Moves</h2>
          <p className="text-sm text-[#424754] mt-1">Tactical actions to bring your blueprint to life.</p>
        </div>
        <span className={cn(
          'text-xs font-mono font-bold px-3 py-1.5 rounded-full border',
          completed === moves.length
            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
            : 'text-[#0058be] bg-[#0058be]/8 border-[#0058be]/15'
        )}>
          {completed}/{moves.length} done
        </span>
      </div>

      <div className="space-y-2">
        {moves.map((m) => (
          <div
            key={m.id}
            onClick={() => onToggle(m.id)}
            className={cn(
              'p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 group',
              m.isCompleted
                ? 'bg-emerald-50/40 border-emerald-200/60'
                : 'bg-white border-slate-200/60 hover:border-[#0058be]/20 hover:shadow-xs'
            )}
          >
            <div className={cn(
              'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors',
              m.isCompleted
                ? 'bg-emerald-600 border-emerald-600'
                : 'border-slate-300 group-hover:border-[#0058be]'
            )}>
              {m.isCompleted && <Check className="w-3 h-3 text-white" />}
            </div>
            <div className="min-w-0">
              <h4 className={cn('text-sm font-semibold', m.isCompleted ? 'line-through text-slate-400' : 'text-[#0b1c30]')}>
                {m.title}
              </h4>
              <p className={cn('text-xs mt-0.5', m.isCompleted ? 'text-slate-400' : 'text-[#424754]')}>
                {m.description}
              </p>
            </div>
            <span className={cn(
              'text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded shrink-0 mt-0.5',
              m.category === 'Proof' ? 'bg-purple-50 text-purple-700' :
              m.category === 'Profile' ? 'bg-blue-50 text-blue-700' :
              m.category === 'Portfolio' ? 'bg-emerald-50 text-emerald-700' :
              'bg-amber-50 text-amber-700'
            )}>
              {m.category}
            </span>
          </div>
        ))}
      </div>

      {/* Step 4 Handoff */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0058be] to-[#004395] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="text-white">
          <h4 className="text-base font-bold">Blueprint Complete</h4>
          <p className="text-sm text-white/70 mt-0.5">
            Ready to generate your Authority Operating System in Step 4.
          </p>
        </div>
        <button
          onClick={onProceed}
          className="flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl bg-white text-[#0058be] hover:bg-blue-50 shadow-sm cursor-pointer transition-colors shrink-0"
        >
          Continue to Step 4
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN COMPONENT — STEP 3 WORKSPACE
   ════════════════════════════════════════════════════════════════════ */
export const Step3ProfilePortfolioAuthority: React.FC = () => {
  const mod3State = useModule3Store();
  const {
    authorityBlueprint,
    setAuthorityBlueprint,
    isUpstreamStale,
    reorderBlueprintPortfolioSection,
    toggleBlueprintPortfolioSection,
    updateMessageLayer,
    toggleNextMoveItem,
  } = mod3State;

  const [staleDismissed, setStaleDismissed] = useState(false);
  const [editingLayerKey, setEditingLayerKey] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // Generate blueprint on first render
  useEffect(() => {
    if (!authorityBlueprint) {
      const generated = generateProfilePortfolioAuthorityBlueprint(mod3State);
      setAuthorityBlueprint(generated);
    }
  }, [authorityBlueprint, mod3State, setAuthorityBlueprint]);

  const blueprint = authorityBlueprint || generateProfilePortfolioAuthorityBlueprint(mod3State);
  const { decisionSummary, profilePositioning, portfolioStructure, evidencePlacements, alignmentAudit, nextMoves, foundation } = blueprint;

  const handleProceedToStep4 = () => {
    useModule3Store.setState((s) => ({
      currentStep: 'authority_pack',
      completedSteps: Array.from(new Set([...s.completedSteps, 'profile_portfolio'])),
      lastUpdated: Date.now(),
    }));
  };

  const handleRegenerate = () => {
    const fresh = generateProfilePortfolioAuthorityBlueprint(mod3State);
    setAuthorityBlueprint(fresh);
    setStaleDismissed(true);
  };

  const handleEditLayer = (key: string, text: string) => {
    setEditingLayerKey(key);
    setEditingText(text);
  };

  const handleSaveEdit = (key: string) => {
    updateMessageLayer(key, editingText);
    setEditingLayerKey(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20 space-y-10">
      {/* Step Header */}
      <StepHeader
        step={{ current: 3, total: 4 }}
        title="Profile & Portfolio Authority"
        description="Your positioning and proof are set. Now let's structure exactly how your profile and portfolio should communicate your authority to anyone who discovers you."
      />

      {/* Zone 1: Executive Hero Banner */}
      <ExecutiveHeroBanner
        positioningClaim={decisionSummary.positioningClaim}
        proofCount={foundation.equippedProofCount + (mod3State.proofAssets?.length || 0)}
        alignmentHealth={decisionSummary.alignmentHealth}
        strongestProof={foundation.strongestProofSignal}
        isStale={isUpstreamStale && !staleDismissed}
        onRegenerate={handleRegenerate}
        onDismissStale={() => setStaleDismissed(true)}
      />

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* Zone 2: Profile Message Architecture */}
      <ProfileArchitectureSection
        layers={profilePositioning}
        onEditLayer={handleEditLayer}
        editingKey={editingLayerKey}
        editingText={editingText}
        setEditingText={setEditingText}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={() => setEditingLayerKey(null)}
      />

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* Zone 3: Portfolio Journey Canvas */}
      <PortfolioJourneyCanvas
        sections={portfolioStructure}
        evidencePlacements={evidencePlacements}
        onReorder={reorderBlueprintPortfolioSection}
        onToggle={toggleBlueprintPortfolioSection}
      />

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* Zone 4: Master Blueprint Summary */}
      <BlueprintSummaryPanel
        positioningClaim={decisionSummary.positioningClaim}
        primaryCategory={decisionSummary.primaryCategory}
        strongestProof={decisionSummary.strongestProofAnchor}
        profileFocus={decisionSummary.primaryProfileFocus}
        topPriorities={decisionSummary.topPortfolioPriorities}
        evidencePlacement={decisionSummary.keyEvidencePlacement}
        alignmentScore={alignmentAudit.alignmentScore}
        alignmentVerdict={alignmentAudit.overallVerdict}
        diagnostics={alignmentAudit.diagnostics}
      />

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* Zone 5: Next Moves & Step 4 Handoff */}
      <NextMovesFooter
        moves={nextMoves}
        onToggle={toggleNextMoveItem}
        onProceed={handleProceedToStep4}
      />
    </div>
  );
};
