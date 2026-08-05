import { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Shield, Sparkles, AlertTriangle, ArrowRight, CheckCircle2,
  ChevronDown, ChevronUp, ArrowUp, ArrowDown, Eye, EyeOff,
  Pencil, X, Check, Rocket, FileText, Copy, Target, Award,
  Users, Zap, MapPin, Layers, Compass, HelpCircle, AlertCircle
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
   ZONE 01 — EXECUTIVE AUTHORITY CONTEXT
   Synthesized view of: Core authority position, Strongest proof assets,
   Proof strength, Authority alignment health, Strategic direction.
   ════════════════════════════════════════════════════════════════════ */
function Zone01ExecutiveAuthorityContext({
  positioningClaim,
  proofCount,
  alignmentHealth,
  strongestProof,
  trustPromise,
  authorityPosition,
  isStale,
  onRegenerate,
  onDismissStale,
}: {
  positioningClaim: string;
  proofCount: number;
  alignmentHealth: string;
  strongestProof: string;
  trustPromise: string;
  authorityPosition: string;
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
    <motion.div {...fadeUp} className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-[#f8f9ff] to-[#eff4ff] p-6 sm:p-8 shadow-xs space-y-6">
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#0058be]/[0.04] blur-3xl pointer-events-none" />

      {/* Upstream Stale Context Alert */}
      {isStale && (
        <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Step 1 or Step 2 data was modified. Custom overrides are preserved.</span>
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

      {/* Header Pipeline Badge */}
      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono font-semibold text-slate-500">
        <span className="bg-white/90 border border-slate-200 px-2 py-0.5 rounded-md text-[#0058be] font-bold">
          01 Authority Context
        </span>
        <span>:</span>
        <span className="bg-white/80 border border-slate-200 px-2 py-0.5 rounded-md text-slate-700">
          Position: {authorityPosition}
        </span>
        <span>+</span>
        <span className="bg-white/80 border border-slate-200 px-2 py-0.5 rounded-md text-emerald-700 font-bold">
          Proof Assets: {proofCount}
        </span>
        <span>→</span>
        <span className="bg-[#0058be] text-white px-2 py-0.5 rounded-md font-bold">
          Profile & Portfolio Blueprint
        </span>
      </div>

      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 flex-1">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#0058be]">
            <Shield className="w-3.5 h-3.5" />
            Synthesized Core Authority Position
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight leading-snug">
            {positioningClaim}
          </h2>
          <p className="text-xs text-[#424754] font-medium leading-relaxed pt-1">
            <strong className="text-[#0058be]">Trust Promise:</strong> "{trustPromise}"
          </p>
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
        <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#424754]">
          <div>
            <span className="text-[#0058be] font-bold">Primary Proof Anchor:</span> {strongestProof}
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Strategic Goal: Convert capability → verifiable trust
          </span>
        </div>
      )}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   ZONE 02 — PROFILE MESSAGE ARCHITECTURE
   Six-layer public profile strategy: Who -> What -> Help -> Known -> Credible -> Next
   ════════════════════════════════════════════════════════════════════ */
function Zone02ProfileMessageArchitecture({
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
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#0058be]">
          <Layers className="w-3.5 h-3.5" />
          Zone 02 — Profile Message Architecture
        </div>
        <h2 className="text-xl font-bold text-[#0b1c30] tracking-tight mt-0.5">Six-Layer Public Profile Strategy</h2>
        <p className="text-sm text-[#424754] mt-1 leading-relaxed max-w-2xl">
          The system provides a contextual recommendation for each profile layer. You are not asked to write from scratch — edit only if you wish to customize.
        </p>
      </div>

      <motion.div {...stagger} className="relative pl-8 space-y-0">
        <div className="absolute left-[15px] top-3 bottom-3 w-px bg-gradient-to-b from-[#0058be]/30 via-[#0058be]/15 to-transparent" />

        {layers.map((layer, idx) => {
          const isEditing = editingKey === layer.layerKey;
          const isExpanded = expandedRationale === layer.layerKey;
          const displayText = layer.userCustomization || layer.recommendedFocus;
          const isCustomized = !!layer.userCustomization;

          return (
            <motion.div key={layer.layerKey} variants={fadeUp} className="relative group">
              <div className={cn(
                'absolute -left-8 top-4 w-[30px] h-[30px] rounded-full border-2 flex items-center justify-center z-10 transition-colors',
                isCustomized ? 'bg-[#0058be] border-[#0058be] text-white' : 'bg-white border-[#0058be]/30 text-[#0058be]'
              )}>
                {LAYER_ICONS[layer.layerKey] || <span className="text-xs font-bold">{idx + 1}</span>}
              </div>

              <div className={cn(
                'ml-2 p-4 rounded-xl border transition-all mb-3',
                'bg-white border-slate-200/60 hover:border-[#0058be]/20 hover:shadow-xs',
                isCustomized && 'border-[#0058be]/20 bg-[#0058be]/[0.02]'
              )}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold text-[#0058be] uppercase tracking-wider">
                        Layer {String(idx + 1).padStart(2, '0')}
                      </span>
                      <h4 className="text-sm font-bold text-[#0b1c30]">{layer.layerTitle.replace(/^\d+\.\s*/, '')}</h4>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {layer.perceptionTarget}
                      </span>
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
                            <Check className="w-3 h-3" /> Save Tweak
                          </button>
                          <button onClick={onCancelEdit} className="text-xs text-slate-500 px-2 py-1.5 cursor-pointer flex items-center gap-1">
                            <X className="w-3 h-3" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[13px] text-[#0b1c30]/85 font-medium leading-relaxed">{displayText}</p>
                    )}
                  </div>

                  {!isEditing && (
                    <button
                      onClick={() => onEditLayer(layer.layerKey, displayText)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#0058be] cursor-pointer shrink-0"
                      title="Customize this layer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setExpandedRationale(isExpanded ? null : layer.layerKey)}
                  className="mt-2 text-[11px] text-[#0058be]/70 hover:text-[#0058be] font-medium cursor-pointer flex items-center gap-1 transition-colors"
                >
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  Why it matters
                </button>
                {isExpanded && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-1.5 text-[11px] text-slate-500 leading-relaxed pl-4 border-l-2 border-[#0058be]/10">
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
   ZONE 03 — PORTFOLIO JOURNEY + PROOF PLACEMENT
   Recommended journey: Positioning -> Capability/Offer -> Relevant Work -> Evidence -> Trust -> Next Step
   Combines Section Priorities + Evidence Placement visually!
   ════════════════════════════════════════════════════════════════════ */
function Zone03PortfolioJourneyAndProofPlacement({
  sections,
  evidencePlacements,
  sectionPriorities,
  onReorder,
  onToggle,
}: {
  sections: PortfolioStructureSectionItem[];
  evidencePlacements: EvidencePlacementMapping[];
  sectionPriorities: { sectionName: string; priority: 'HIGH' | 'MEDIUM' | 'LOW'; whyPriority: string; actionRequired: string }[];
  onReorder: (from: number, to: number) => void;
  onToggle: (id: string) => void;
}) {
  const placementMap = useMemo(() => {
    const map: Record<string, EvidencePlacementMapping[]> = {};
    for (const ep of evidencePlacements) {
      const placement = ep.recommendedPlacement.toLowerCase();
      for (const sec of sections) {
        const title = sec.sectionTitle.toLowerCase();
        if (placement.includes('positioning') && (title.includes('positioning') || title.includes('hero'))) {
          (map[sec.id] ??= []).push(ep);
        } else if (placement.includes('evidence') && (title.includes('evidence') || title.includes('proof'))) {
          (map[sec.id] ??= []).push(ep);
        } else if (placement.includes('work') && (title.includes('work') || title.includes('teardown') || title.includes('case'))) {
          (map[sec.id] ??= []).push(ep);
        } else if (placement.includes('capability') && (title.includes('capability') || title.includes('offer'))) {
          (map[sec.id] ??= []).push(ep);
        } else if (placement.includes('trust') && (title.includes('trust') || title.includes('social'))) {
          (map[sec.id] ??= []).push(ep);
        } else if (placement.includes('booking') && (title.includes('booking') || title.includes('next step'))) {
          (map[sec.id] ??= []).push(ep);
        }
      }
    }
    return map;
  }, [sections, evidencePlacements]);

  const priorityMap = useMemo(() => {
    const map: Record<string, 'HIGH' | 'MEDIUM' | 'LOW'> = {};
    for (const p of sectionPriorities) {
      const name = p.sectionName.toLowerCase();
      for (const sec of sections) {
        const title = sec.sectionTitle.toLowerCase();
        if (name.includes('positioning') && title.includes('positioning')) map[sec.id] = p.priority;
        else if (name.includes('evidence') && title.includes('evidence')) map[sec.id] = p.priority;
        else if (name.includes('work') && (title.includes('work') || title.includes('teardown'))) map[sec.id] = p.priority;
        else if (name.includes('offer') && (title.includes('capability') || title.includes('offer'))) map[sec.id] = p.priority;
        else if (!map[sec.id]) map[sec.id] = 'MEDIUM';
      }
    }
    return map;
  }, [sections, sectionPriorities]);

  return (
    <motion.section {...fadeUp} className="space-y-5">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#0058be]">
          <Compass className="w-3.5 h-3.5" />
          Zone 03 — Portfolio Journey & Evidence Placement
        </div>
        <h2 className="text-xl font-bold text-[#0b1c30] tracking-tight mt-0.5">Strategic Portfolio Sequence & Evidence Flow</h2>
        <p className="text-sm text-[#424754] mt-1 leading-relaxed max-w-2xl">
          Strategic Baseline: <span className="font-semibold text-[#0058be]">Positioning → Capability/Offer → Relevant Work → Evidence → Trust → Next Step</span>. System adapts sequence dynamically based on proof strength.
        </p>
      </div>

      <motion.div {...stagger} className="space-y-3">
        {sections.map((sec, idx) => {
          const linkedEvidence = placementMap[sec.id] || [];
          const priority = priorityMap[sec.id] || 'HIGH';
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
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-mono text-sm font-bold border',
                  isDisabled ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-[#0058be]/8 text-[#0058be] border-[#0058be]/15'
                )}>
                  0{sec.position}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className={cn('text-sm font-bold', isDisabled ? 'text-slate-400' : 'text-[#0b1c30]')}>
                      {sec.sectionTitle.replace(/^\d+\.\s*/, '')}
                    </h4>
                    <span className={cn(
                      'text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border',
                      priority === 'HIGH' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    )}>
                      {priority} PRIORITY
                    </span>
                  </div>

                  <p className={cn('text-xs leading-relaxed', isDisabled ? 'text-slate-400' : 'text-[#424754]')}>
                    <span className="font-semibold text-[#0058be]">Visitor Mindset:</span> "{sec.visitorMindset}"
                  </p>

                  {/* Inline Evidence & Proof Strength Mapping */}
                  {linkedEvidence.length > 0 && !isDisabled && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#0058be] block">
                        Recommended Proof & Strength:
                      </span>
                      {linkedEvidence.map((ev) => (
                        <div key={ev.id} className="p-2 rounded-lg bg-[#f8f9ff] border border-slate-200/60 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-[#0b1c30]">
                            <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="font-bold">{ev.proofTitle}</span>
                            <span className="text-[9px] uppercase font-bold text-[#0058be] bg-white px-1.5 py-0.5 rounded border border-slate-200">
                              {ev.proofStrength}
                            </span>
                          </div>
                          {ev.actionIfWeak && (
                            <span className="text-[10px] font-sans text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              If weak: {ev.actionIfWeak}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onToggle(sec.id)}
                    className={cn(
                      'p-1.5 rounded-lg border cursor-pointer transition-colors',
                      sec.isEnabled ? 'bg-white border-slate-200 text-slate-500 hover:text-[#0b1c30] hover:bg-slate-50' : 'bg-rose-50 border-rose-200 text-rose-500'
                    )}
                    title={sec.isEnabled ? 'Hide stage' : 'Show stage'}
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
   ZONE 04 — VISITOR JOURNEY + AUTHORITY ALIGNMENT
   Explains progressive visitor understanding: Curiosity -> Clarity -> Evaluation -> Validation -> Conviction -> Action
   Explicitly audits alignment across: Positioning -> Profile -> Portfolio -> Proof
   ════════════════════════════════════════════════════════════════════ */
function Zone04VisitorJourneyAndAuthorityAlignment({
  presentationFlow,
  alignmentAudit,
}: {
  presentationFlow: { personaContext: string; journey: { stepNumber: number; stageName: string; visitorPsychology: string; contentToPresent: string; conversionRole: string }[] };
  alignmentAudit: { alignmentScore: number; overallVerdict: string; diagnostics: { id: string; severity: string; title: string; positioningClaim: string; actualEvidenceOrWork: string; recommendation: string; impactedSection: string }[] };
}) {
  return (
    <motion.section {...fadeUp} className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#0058be]">
          <Target className="w-3.5 h-3.5" />
          Zone 04 — Visitor Journey & Authority Alignment Audit
        </div>
        <h2 className="text-xl font-bold text-[#0b1c30] tracking-tight mt-0.5">Progressive Understanding & Alignment Audit</h2>
        <p className="text-sm text-[#424754] mt-1 leading-relaxed max-w-2xl">
          Context: <span className="font-semibold text-[#0058be]">{presentationFlow.personaContext}</span>. Auditing whether Positioning → Profile → Portfolio → Proof reinforce the same core perception.
        </p>
      </div>

      {/* 6-Stage Progressive Visitor Understanding Sequence */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/60 space-y-3">
        <h4 className="text-xs font-mono font-bold uppercase text-[#0058be]">
          Visitor Understanding Progression (Curiosity → Action)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {presentationFlow.journey.map((step) => (
            <div key={step.stepNumber} className="p-3 rounded-lg bg-[#f8f9ff] border border-slate-200/60 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#0058be] font-bold">
                <span>0{step.stepNumber}. {step.stageName.split(':')[1]?.trim() || step.stageName}</span>
              </div>
              <p className="text-[11px] font-semibold text-[#0b1c30]">{step.visitorPsychology}</p>
              <p className="text-[10px] text-slate-500">{step.conversionRole}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Positioning -> Profile -> Portfolio -> Proof Alignment Audit */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-[#0b1c30] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#0058be]" />
              System Alignment Audit: Positioning → Profile → Portfolio → Proof
            </h4>
            <p className="text-xs text-slate-500">{alignmentAudit.overallVerdict}</p>
          </div>
          <span className={cn(
            'text-xs font-mono font-bold px-3 py-1 rounded-full border shrink-0',
            alignmentAudit.alignmentScore >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
          )}>
            Score: {alignmentAudit.alignmentScore}/100
          </span>
        </div>

        <div className="space-y-2">
          {alignmentAudit.diagnostics.map((diag) => (
            <div key={diag.id} className={cn(
              'p-3.5 rounded-xl border text-xs space-y-1',
              diag.severity === 'success' ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' :
              diag.severity === 'warning' ? 'bg-amber-50/50 border-amber-200 text-amber-900' :
              'bg-rose-50/50 border-rose-200 text-rose-900'
            )}>
              <div className="flex items-center justify-between font-bold">
                <span>{diag.title}</span>
                <span className="text-[10px] font-mono uppercase bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                  Impacts: {diag.impactedSection}
                </span>
              </div>
              <p className="text-[11px] opacity-80">{diag.actualEvidenceOrWork}</p>
              <div className="pt-1 text-[11px] font-semibold text-[#0058be]">
                → Fix Recommendation: {diag.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   ZONE 05 — MASTER BLUEPRINT + NEXT MOVES
   Consolidates final deliverable, answers 8 Core Questions, concise action plan
   Lock Blueprint -> Continue to Step 4: Authority Operating System
   ════════════════════════════════════════════════════════════════════ */
function Zone05MasterBlueprintAndNextMoves({
  decisionSummary,
  alignmentAudit,
  nextMoves,
  onToggleMove,
  onProceedToStep4,
}: {
  decisionSummary: { positioningClaim: string; primaryCategory: string; strongestProofAnchor: string; primaryProfileFocus: string; topPortfolioPriorities: string[]; keyEvidencePlacement: string; alignmentHealth: string };
  alignmentAudit: { alignmentScore: number; overallVerdict: string; diagnostics: any[] };
  nextMoves: NextMoveActionItem[];
  onToggleMove: (id: string) => void;
  onProceedToStep4: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const completedCount = nextMoves.filter((m) => m.isCompleted).length;

  const coreQuestionsAnswers = [
    { q: '1. How should I be perceived?', a: decisionSummary.positioningClaim },
    { q: '2. What should my profile communicate?', a: decisionSummary.primaryProfileFocus },
    { q: '3. What should my portfolio lead with?', a: decisionSummary.topPortfolioPriorities[0] || 'Positioning & Hero Claim' },
    { q: '4. What proof should I emphasize?', a: decisionSummary.strongestProofAnchor },
    { q: '5. Where should that proof appear?', a: decisionSummary.keyEvidencePlacement },
    { q: '6. How should a visitor experience the story?', a: 'Curiosity → Clarity → Evaluation → Validation → Conviction → Action' },
    { q: '7. What is currently misaligned?', a: alignmentAudit.diagnostics.find((d: any) => d.severity === 'warning')?.title.replace(/[⚠✓]/g, '').trim() || 'No critical disconnects detected' },
    { q: '8. What should I do next?', a: nextMoves[0]?.title || 'Lock Blueprint & Generate Authority Pack' },
  ];

  const handleCopyMarkdown = () => {
    const md = [
      `# Profile + Portfolio Authority Blueprint`,
      ``,
      `## 8 Core Strategic Answers`,
      ...coreQuestionsAnswers.map((item) => `- **${item.q}**: ${item.a}`),
      ``,
      `## Alignment Health`,
      `Score: ${alignmentAudit.alignmentScore}/100 — ${alignmentAudit.overallVerdict}`,
      ``,
      `## Action Plan (Next Moves)`,
      ...nextMoves.map((m, i) => `${i + 1}. [${m.isCompleted ? 'X' : ' '}] ${m.title} — ${m.description}`),
    ].join('\n');

    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.section {...fadeUp} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#0058be]">
            <FileText className="w-3.5 h-3.5" />
            Zone 05 — Master Authority Blueprint & Next Moves
          </div>
          <h2 className="text-xl font-bold text-[#0b1c30] tracking-tight mt-0.5">Final Deliverable & Action Plan</h2>
          <p className="text-sm text-[#424754] mt-1">Consolidates your strategy into 8 core answers with a concise action plan.</p>
        </div>

        <button
          onClick={handleCopyMarkdown}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#0058be] hover:border-[#0058be]/30 cursor-pointer transition-colors shrink-0"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied Blueprint!' : 'Copy Markdown'}
        </button>
      </div>

      {/* The 8 Core Questions Grid */}
      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
        <div className="p-4 bg-[#f8f9ff] border-b border-slate-200/60 font-mono text-xs font-bold text-[#0058be]">
          8 Core Strategic Questions Answered by Step 3:
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200/60">
          {coreQuestionsAnswers.map((item, idx) => (
            <div key={idx} className="bg-white p-4 space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#0058be] uppercase block">{item.q}</span>
              <p className="text-xs font-semibold text-[#0b1c30] leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Next Moves Execution Plan */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#0b1c30] flex items-center gap-2">
            <Rocket className="w-4 h-4 text-[#0058be]" />
            Personalized Action Plan (Next Moves)
          </h4>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {completedCount}/{nextMoves.length} Completed
          </span>
        </div>

        <div className="space-y-2">
          {nextMoves.map((m) => (
            <div
              key={m.id}
              onClick={() => onToggleMove(m.id)}
              className={cn(
                'p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 group',
                m.isCompleted ? 'bg-emerald-50/40 border-emerald-200/60' : 'bg-white border-slate-200/60 hover:border-[#0058be]/20 hover:shadow-xs'
              )}
            >
              <div className={cn(
                'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                m.isCompleted ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 group-hover:border-[#0058be]'
              )}>
                {m.isCompleted && <Check className="w-3 h-3 text-white" />}
              </div>
              <div className="min-w-0 flex-1">
                <h5 className={cn('text-xs font-bold', m.isCompleted ? 'line-through text-slate-400' : 'text-[#0b1c30]')}>
                  0{m.stepNumber}. {m.title}
                </h5>
                <p className={cn('text-[11px] mt-0.5', m.isCompleted ? 'text-slate-400' : 'text-[#424754]')}>
                  {m.description}
                </p>
              </div>
              <span className="text-[9px] font-mono uppercase bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold shrink-0">
                {m.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Lock Blueprint & Step 4 Handoff */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0058be] to-[#004395] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm text-white">
        <div>
          <h4 className="text-base font-bold">Lock Blueprint & Continue</h4>
          <p className="text-xs text-white/80 mt-0.5">
            Your Profile & Portfolio Strategy is set. Proceed to Step 4 to generate your complete Authority Operating System.
          </p>
        </div>

        <button
          onClick={onProceedToStep4}
          className="flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl bg-white text-[#0058be] hover:bg-blue-50 shadow-sm cursor-pointer transition-colors shrink-0 font-mono"
        >
          Lock Blueprint → Continue to Step 4
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN COMPONENT SHELL — THE 5 CORE WORKSPACE ZONES
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

  useEffect(() => {
    if (!authorityBlueprint) {
      const generated = generateProfilePortfolioAuthorityBlueprint(mod3State);
      setAuthorityBlueprint(generated);
    }
  }, [authorityBlueprint, mod3State, setAuthorityBlueprint]);

  const blueprint = authorityBlueprint || generateProfilePortfolioAuthorityBlueprint(mod3State);
  const { decisionSummary, profilePositioning, portfolioStructure, evidencePlacements, sectionPriorities, presentationFlow, alignmentAudit, nextMoves, foundation } = blueprint;

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
        title="Profile & Portfolio Authority Strategy"
        description="Transform scattered capability into a coherent authority system that tells one consistent story from positioning to proof to presentation."
      />

      {/* Core Strategic Bridge Notice */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0058be]/[0.06] via-white to-[#0058be]/[0.03] border border-[#0058be]/15 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#0058be] shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-xs text-[#424754]">
          <span className="font-bold text-[#0b1c30] block font-mono text-[11px] uppercase tracking-wider">
            The Step 3 Strategic Bridge: Scattered Capability → Coherent Authority
          </span>
          <p className="leading-relaxed">
            Step 3 takes your Step 1 positioning and Step 2 proof assets to determine: <em>"How should my profile and portfolio guide a visitor from curiosity to trust so they clearly see the value I represent?"</em>
          </p>
        </div>
      </div>

      {/* Zone 01 — Executive Authority Context */}
      <Zone01ExecutiveAuthorityContext
        positioningClaim={decisionSummary.positioningClaim}
        proofCount={foundation.equippedProofCount + (mod3State.proofAssets?.length || 0)}
        alignmentHealth={decisionSummary.alignmentHealth}
        strongestProof={foundation.strongestProofSignal}
        trustPromise={foundation.trustPromise}
        authorityPosition={foundation.authorityPosition}
        isStale={isUpstreamStale && !staleDismissed}
        onRegenerate={handleRegenerate}
        onDismissStale={() => setStaleDismissed(true)}
      />

      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* Zone 02 — Profile Message Architecture */}
      <Zone02ProfileMessageArchitecture
        layers={profilePositioning}
        onEditLayer={handleEditLayer}
        editingKey={editingLayerKey}
        editingText={editingText}
        setEditingText={setEditingText}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={() => setEditingLayerKey(null)}
      />

      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* Zone 03 — Portfolio Journey + Proof Placement */}
      <Zone03PortfolioJourneyAndProofPlacement
        sections={portfolioStructure}
        evidencePlacements={evidencePlacements}
        sectionPriorities={sectionPriorities}
        onReorder={reorderBlueprintPortfolioSection}
        onToggle={toggleBlueprintPortfolioSection}
      />

      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* Zone 04 — Visitor Journey + Authority Alignment */}
      <Zone04VisitorJourneyAndAuthorityAlignment
        presentationFlow={presentationFlow}
        alignmentAudit={alignmentAudit}
      />

      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* Zone 05 — Master Blueprint + Next Moves */}
      <Zone05MasterBlueprintAndNextMoves
        decisionSummary={decisionSummary}
        alignmentAudit={alignmentAudit}
        nextMoves={nextMoves}
        onToggleMove={toggleNextMoveItem}
        onProceedToStep4={handleProceedToStep4}
      />
    </div>
  );
};
