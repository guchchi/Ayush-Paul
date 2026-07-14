import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Layers, Sparkles, Check, ArrowRight, AlertTriangle, MoveUp, MoveDown, Star, Target, FileText } from 'lucide-react';
import { usePortfolioSystemStore } from '../../lib/portfolio-system';
import { generateProjectPlacements } from '../../lib/portfolio-system/composer';
import { composeStep3Content } from '../../lib/portfolio-system/personalized-content';
import type { ProjectPlacement, ProjectRole } from '../../types/portfolio-system';
import { cn } from '../../lib/utils';

const ROLES: ProjectRole[] = ['featured', 'secondary', 'supporting'];

const ROLE_LABELS: Record<ProjectRole, string> = {
  featured: 'Featured Showcase',
  secondary: 'Secondary Context',
  supporting: 'Supporting Evidence',
};

const CTA_PROXIMITY_LABELS: Record<string, string> = {
  hero: 'Hero Section',
  inline: 'Inline Content',
  section_end: 'Section End',
  footer: 'Footer',
};

const CTA_PROXIMITY_OPTIONS = ['hero', 'inline', 'section_end', 'footer'] as const;

export function ProjectArrangementStep() {
  const upstream = usePortfolioSystemStore((s) => s.upstream);
  const sections = usePortfolioSystemStore((s) => s.sections);
  const projectPlacements = usePortfolioSystemStore((s) => s.projectPlacements);
  const setProjectPlacements = usePortfolioSystemStore((s) => s.setProjectPlacements);
  const staleSince = usePortfolioSystemStore((s) => s.staleSince);
  const markEdited = usePortfolioSystemStore((s) => s.markEdited);
  const confirmStep = usePortfolioSystemStore((s) => s.confirmStep);
  const nextStep = usePortfolioSystemStore((s) => s.nextStep);
  const completedSteps = usePortfolioSystemStore((s) => s.completedSteps);

  const pc = useMemo(() => {
    if (!upstream || projectPlacements.length === 0) return null;
    return composeStep3Content(upstream, projectPlacements);
  }, [upstream, projectPlacements]);

  const isCompleted = completedSteps.includes('project_arrangement');
  const includedSections = sections.filter((s) => s.included);

  if (!upstream) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/[0.03] border border-white/5 mb-4">
          <Layers size={20} className="text-zinc-500" />
        </div>
        <p className="text-sm text-zinc-500 text-center max-w-xs">
          Complete Module 3 first to pipe your selections here.
        </p>
      </div>
    );
  }

  if (includedSections.length === 0 || projectPlacements.length === 0) {
    const handleGenerate = () => {
      const result = generateProjectPlacements(upstream, sections);
      setProjectPlacements(result);
    };

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 3 of 6</span>
          <h2 className="text-2xl font-bold tracking-tight text-white/95">Project Arrangement</h2>
          <p className="text-sm text-zinc-400 max-w-lg">
            Arrange your proof assets across portfolio sections.
          </p>
        </div>
        <motion.button
          onClick={handleGenerate}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-dashed border-brand-primary/30 bg-brand-primary/10 text-sm font-semibold text-brand-primary transition-all duration-200 cursor-pointer"
        >
          <Sparkles size={16} />
          Generate Placements
        </motion.button>
      </div>
    );
  }

  const handleRoleChange = (assetId: string, role: ProjectRole) => {
    setProjectPlacements(
      projectPlacements.map((p) =>
        p.assetId === assetId ? { ...p, role, isCustom: true } : p,
      ),
    );
    markEdited(`projectPlacements.${assetId}.role`);
  };

  const handleSectionChange = (assetId: string, sectionId: string) => {
    setProjectPlacements(
      projectPlacements.map((p) =>
        p.assetId === assetId ? { ...p, sectionId, isCustom: true } : p,
      ),
    );
    markEdited(`projectPlacements.${assetId}.sectionId`);
  };

  const handleCtaProximityChange = (assetId: string, ctaProximity: ProjectPlacement['ctaProximity']) => {
    setProjectPlacements(
      projectPlacements.map((p) =>
        p.assetId === assetId ? { ...p, ctaProximity, isCustom: true } : p,
      ),
    );
    markEdited(`projectPlacements.${assetId}.ctaProximity`);
  };

  const sectionCount = new Set(projectPlacements.map((p) => p.sectionId)).size;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 3 of 6</span>
        <h2 className="text-2xl font-bold tracking-tight text-white/95">Project Arrangement</h2>
        <p className="text-sm text-zinc-400 max-w-lg">
          Arrange your proof assets across portfolio sections.
        </p>
      </div>

      {staleSince && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle size={14} className="text-amber-400 shrink-0" />
          <span className="text-xs font-medium text-amber-400">
            Upstream context has changed. Regenerate?
          </span>
        </div>
      )}

      <p className="text-xs text-zinc-400">
        {projectPlacements.length} assets placed across {sectionCount} sections
      </p>

      <div className="space-y-4">
        {projectPlacements.map((placement) => {
          const priority = upstream.mod3ProofPriorities.find((p) => p.id === placement.priorityId);

          return (
            <motion.div
              key={placement.assetId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-xl bg-white/[0.02] border border-white/5 p-5 space-y-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white/90 truncate">{placement.assetId}</span>
                    {placement.isCustom && (
                      <span className="px-2 py-0.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-[9px] font-bold uppercase tracking-[0.1em] text-brand-primary shrink-0">
                        Customised
                      </span>
                    )}
                  </div>
                  {priority && (
                    <p className="text-xs text-zinc-500 truncate">{priority.gapTitle}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Role</span>
                <div className="flex rounded-lg overflow-hidden border border-white/5 bg-white/[0.02]">
                  {ROLES.map((role) => {
                    const selected = placement.role === role;
                    return (
                    <button
                      key={role}
                      onClick={() => handleRoleChange(placement.assetId, role)}
                      className={cn(
                        'flex-1 px-3 py-2 text-[11px] font-semibold transition-all duration-200 cursor-pointer',
                        selected
                          ? 'bg-brand-primary/15 text-brand-primary'
                          : 'text-zinc-400 hover:text-zinc-300 hover:bg-white/[0.03]',
                      )}
                      title={pc?.roleExplanations[role] ?? ''}
                    >
                      {ROLE_LABELS[role]}
                    </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Section</span>
                  <select
                    value={placement.sectionId}
                    onChange={(e) => handleSectionChange(placement.assetId, e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-xs text-white/90 bg-white/[0.03] border border-white/5 outline-none appearance-none cursor-pointer focus:border-white/20 transition-all duration-300"
                  >
                    {includedSections.map((sec) => (
                      <option key={sec.id} value={sec.id} className="bg-zinc-900 text-white/90">
                        {sec.heading}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">CTA Proximity</span>
                  <select
                    value={placement.ctaProximity}
                    onChange={(e) => handleCtaProximityChange(placement.assetId, e.target.value as ProjectPlacement['ctaProximity'])}
                    className="w-full px-3 py-2.5 rounded-lg text-xs text-white/90 bg-white/[0.03] border border-white/5 outline-none appearance-none cursor-pointer focus:border-white/20 transition-all duration-300"
                  >
                    {CTA_PROXIMITY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-zinc-900 text-white/90">
                        {CTA_PROXIMITY_LABELS[opt]}
                      </option>
                    ))}
                  </select>
                  {pc?.ctaProximityHelpers[placement.ctaProximity] && (
                    <p className="text-[9px] text-zinc-600 italic leading-tight">{pc.ctaProximityHelpers[placement.ctaProximity]}</p>
                  )}
                </div>
              </div>

              <p className="text-xs text-zinc-500 leading-relaxed">{placement.placementReason}</p>

              {placement.buyerQuestionAnswered && (
                <p className="text-xs italic text-zinc-400 leading-relaxed">
                  &ldquo;{placement.buyerQuestionAnswered}&rdquo;
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400 shrink-0" />
          <span className="text-xs font-medium text-emerald-400">Project arrangement confirmed</span>
        </div>
      ) : (
        <motion.button
          onClick={() => {
            confirmStep();
            nextStep();
          }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 px-6 h-11 rounded-lg text-xs font-bold uppercase tracking-[0.08em] bg-white text-black hover:bg-white/90 shadow-[0_0_30px_-12px_rgba(255,255,255,0.15)] transition-all duration-200 cursor-pointer"
        >
          <Check size={14} />
          Confirm &amp; Continue
        </motion.button>
      )}
    </div>
  );
}
