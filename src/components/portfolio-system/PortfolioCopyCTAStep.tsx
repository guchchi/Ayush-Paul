import { useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { FileText, Check, Sparkles, ArrowRight, AlertTriangle, Edit3 } from 'lucide-react';
import { usePortfolioSystemStore } from '../../lib/portfolio-system';
import { generatePortfolioCopyArchitecture } from '../../lib/portfolio-system/composer';
import { composeStep5Content } from '../../lib/portfolio-system/personalized-content';
import type { PortfolioCopyArchitecture, CTAArchitecture } from '../../types/portfolio-system';
import { cn } from '../../lib/utils';
import { EASING, DURATION } from '../../lib/motion-presets';

export function PortfolioCopyCTAStep() {
  const upstream = usePortfolioSystemStore((s) => s.upstream);
  const portfolioDirection = usePortfolioSystemStore((s) => s.portfolioDirection);
  const platformRecommendation = usePortfolioSystemStore((s) => s.platformRecommendation);
  const sections = usePortfolioSystemStore((s) => s.sections);
  const projectPlacements = usePortfolioSystemStore((s) => s.projectPlacements);
  const projectPresentations = usePortfolioSystemStore((s) => s.projectPresentations);
  const portfolioCopy = usePortfolioSystemStore((s) => s.portfolioCopy);
  const setPortfolioCopy = usePortfolioSystemStore((s) => s.setPortfolioCopy);
  const staleSince = usePortfolioSystemStore((s) => s.staleSince);
  const markEdited = usePortfolioSystemStore((s) => s.markEdited);
  const confirmStep = usePortfolioSystemStore((s) => s.confirmStep);
  const nextStep = usePortfolioSystemStore((s) => s.nextStep);
  const isCompleted = usePortfolioSystemStore((s) => s.completedSteps).includes('portfolio_copy_cta');

  const prerequisitesReady = Boolean(
    portfolioDirection && platformRecommendation
    && sections.length > 0 && projectPlacements.length > 0 && projectPresentations.length > 0
  );

  const pc = useMemo(() => {
    if (!upstream || !portfolioDirection || !platformRecommendation) return null;
    return composeStep5Content(upstream, portfolioDirection, sections);
  }, [upstream, portfolioDirection, platformRecommendation, sections]);

  const handleGenerate = useCallback(() => {
    if (!upstream || !portfolioDirection || !platformRecommendation
      || sections.length === 0 || projectPlacements.length === 0 || projectPresentations.length === 0) return;
    const result = generatePortfolioCopyArchitecture(
      upstream, portfolioDirection, platformRecommendation,
      sections, projectPlacements, projectPresentations,
    );
    setPortfolioCopy(result);
  }, [upstream, portfolioDirection, platformRecommendation, sections, projectPlacements, projectPresentations, setPortfolioCopy]);

  const setHeadline = useCallback((headline: string) => {
    if (!portfolioCopy) return;
    setPortfolioCopy({ ...portfolioCopy, headline, isCustom: true });
    markEdited('headline');
  }, [portfolioCopy, setPortfolioCopy, markEdited]);

  const setIntro = useCallback((shortIntro: string) => {
    if (!portfolioCopy) return;
    setPortfolioCopy({ ...portfolioCopy, shortIntro, isCustom: true });
    markEdited('shortIntro');
  }, [portfolioCopy, setPortfolioCopy, markEdited]);

  const updateSectionBody = useCallback((key: string, body: string) => {
    if (!portfolioCopy) return;
    setPortfolioCopy({
      ...portfolioCopy,
      sectionCopy: { ...portfolioCopy.sectionCopy, [key]: { ...portfolioCopy.sectionCopy[key], body } },
      isCustom: true,
    });
    markEdited(`sectionCopy.${key}.body`);
  }, [portfolioCopy, setPortfolioCopy, markEdited]);

  const updateProjectField = useCallback((key: string, field: 'headline' | 'description' | 'cta', value: string) => {
    if (!portfolioCopy) return;
    setPortfolioCopy({
      ...portfolioCopy,
      projectCopy: {
        ...portfolioCopy.projectCopy,
        [key]: { ...portfolioCopy.projectCopy[key], [field]: value },
      },
      isCustom: true,
    });
    markEdited(`projectCopy.${key}.${field}`);
  }, [portfolioCopy, setPortfolioCopy, markEdited]);

  const updateCTAField = useCallback((field: keyof CTAArchitecture, value: string) => {
    if (!portfolioCopy) return;
    setPortfolioCopy({
      ...portfolioCopy,
      ctaArchitecture: { ...portfolioCopy.ctaArchitecture, [field]: value },
      isCustom: true,
    });
    markEdited(`cta.${field}`);
  }, [portfolioCopy, setPortfolioCopy, markEdited]);

  const handleContinue = () => {
    confirmStep();
    nextStep();
  };

  if (!upstream) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 5 of 6</span>
          <h2 className="text-2xl font-bold tracking-tight text-white/95">Portfolio Copy & CTA</h2>
          <p className="text-sm text-zinc-400 max-w-lg">
            Generate and refine the copy and calls-to-action for your portfolio.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <FileText size={40} className="text-zinc-600" />
          <p className="text-sm text-zinc-500">No portfolio context available.</p>
          <p className="text-[11px] text-zinc-600">Complete the earlier steps first.</p>
        </div>
      </div>
    );
  }

  if (!portfolioCopy) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 5 of 6</span>
          <h2 className="text-2xl font-bold tracking-tight text-white/95">Portfolio Copy & CTA</h2>
          <p className="text-sm text-zinc-400 max-w-lg">
            Generate and refine the copy and calls-to-action for your portfolio.
          </p>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <FileText size={14} className="text-brand-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs text-white/80 font-medium">Copy Architecture</p>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Generate headline, section copy, project descriptions, and CTAs based on your portfolio structure.
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <button
            onClick={handleGenerate}
            disabled={!prerequisitesReady}
            className={cn(
              'w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer',
              prerequisitesReady
                ? 'border-dashed border-brand-primary/30 bg-brand-primary/5 text-brand-primary hover:bg-brand-primary/10'
                : 'border-white/5 bg-white/[0.02] text-zinc-500 cursor-not-allowed',
            )}
          >
            <Sparkles size={16} />
            Generate Copy
          </button>
          {!prerequisitesReady && (
            <p className="text-[10px] text-zinc-500 text-center">
              Complete all previous steps to generate copy.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">Step 5 of 6</span>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-white/95">Portfolio Copy & CTA</h2>
          {portfolioCopy.isCustom && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-[9px] font-bold uppercase tracking-[0.1em] text-amber-400">
              <Edit3 size={9} />
              Customised
            </span>
          )}
        </div>
        <p className="text-sm text-zinc-400 max-w-lg">
          Refine the copy and calls-to-action for your portfolio.
        </p>
      </div>

      {staleSince && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-400/5 border border-amber-400/10">
          <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs text-amber-300/90 font-medium">Stale context</p>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Upstream context has changed. Regenerate copy to reflect the latest data.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1">
          <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">Portfolio Headline</span>
          <input
            type="text"
            value={portfolioCopy.headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full px-3 py-2 rounded-xl outline-none text-xs text-white/80 placeholder:text-zinc-500 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300"
          />
          {pc?.headlineHelper && (
            <p className="text-[9px] text-zinc-500 italic leading-tight">{pc.headlineHelper}</p>
          )}
        </div>

        <div className="space-y-1">
          <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">Short Introduction</span>
          <textarea
            value={portfolioCopy.shortIntro}
            onChange={(e) => setIntro(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-xl outline-none text-xs text-white/80 placeholder:text-zinc-500 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300 resize-none"
          />
          {pc?.shortIntroHelper && (
            <p className="text-[9px] text-zinc-500 italic leading-tight">{pc.shortIntroHelper}</p>
          )}
        </div>
      </div>

      <div className="border-t border-white/5 pt-6 mt-6">
        <div className="space-y-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500">Section Copy</p>
          {Object.keys(portfolioCopy.sectionCopy).length === 0 && (
            <p className="text-[11px] text-zinc-500 italic">No sections defined.</p>
          )}
          {Object.keys(portfolioCopy.sectionCopy).map((key) => {
            const section = portfolioCopy.sectionCopy[key];
            return (
              <div key={key} className="space-y-1">
                <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-400">{section.heading}</span>
                <textarea
                  value={section.body}
                  onChange={(e) => updateSectionBody(key, e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl outline-none text-xs text-white/80 placeholder:text-zinc-500 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300 resize-none"
                />
                {pc?.sectionCopyHelpers[key] && (
                  <p className="text-[9px] text-zinc-600 italic">{pc.sectionCopyHelpers[key]}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-white/5 pt-6 mt-6">
        <div className="space-y-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500">Project Copy</p>
          {Object.keys(portfolioCopy.projectCopy).length === 0 && (
            <p className="text-[11px] text-zinc-500 italic">No projects defined.</p>
          )}
          {Object.keys(portfolioCopy.projectCopy).map((key) => {
            const project = portfolioCopy.projectCopy[key];
            return (
              <div key={key} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-400">{project.headline || 'Untitled'}</span>
                  {pc?.projectCopyHelpers[key] && (
                    <span className="text-[8px] text-zinc-600 italic max-w-[50%] text-right">{pc.projectCopyHelpers[key]}</span>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[7px] font-bold uppercase tracking-[0.1em] text-zinc-500">Headline</span>
                    <input
                      type="text"
                      value={project.headline}
                      onChange={(e) => updateProjectField(key, 'headline', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl outline-none text-xs text-white/80 placeholder:text-zinc-500 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[7px] font-bold uppercase tracking-[0.1em] text-zinc-500">Description</span>
                    <textarea
                      value={project.description}
                      onChange={(e) => updateProjectField(key, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl outline-none text-xs text-white/80 placeholder:text-zinc-500 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300 resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[7px] font-bold uppercase tracking-[0.1em] text-zinc-500">CTA</span>
                    <input
                      type="text"
                      value={project.cta}
                      onChange={(e) => updateProjectField(key, 'cta', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl outline-none text-xs text-white/80 placeholder:text-zinc-500 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-white/5 pt-6 mt-6">
        <div className="space-y-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500">CTA Architecture</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[7px] font-bold uppercase tracking-[0.1em] text-zinc-500">Hero CTA</span>
              <input
                type="text"
                value={portfolioCopy.ctaArchitecture.heroCta}
                onChange={(e) => updateCTAField('heroCta', e.target.value)}
                className="w-full px-3 py-2 rounded-xl outline-none text-xs text-white/80 placeholder:text-zinc-500 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300"
              />
              {pc?.ctaArchitectureHelpers['heroCta'] && (
                <p className="text-[8px] text-zinc-600 italic leading-tight">{pc.ctaArchitectureHelpers['heroCta']}</p>
              )}
            </div>
            <div className="space-y-1">
              <span className="text-[7px] font-bold uppercase tracking-[0.1em] text-zinc-500">Inline CTA</span>
              <input
                type="text"
                value={portfolioCopy.ctaArchitecture.inlineCta}
                onChange={(e) => updateCTAField('inlineCta', e.target.value)}
                className="w-full px-3 py-2 rounded-xl outline-none text-xs text-white/80 placeholder:text-zinc-500 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300"
              />
              {pc?.ctaArchitectureHelpers['inlineCta'] && (
                <p className="text-[8px] text-zinc-600 italic leading-tight">{pc.ctaArchitectureHelpers['inlineCta']}</p>
              )}
            </div>
            <div className="space-y-1">
              <span className="text-[7px] font-bold uppercase tracking-[0.1em] text-zinc-500">Section CTA</span>
              <input
                type="text"
                value={portfolioCopy.ctaArchitecture.sectionCta}
                onChange={(e) => updateCTAField('sectionCta', e.target.value)}
                className="w-full px-3 py-2 rounded-xl outline-none text-xs text-white/80 placeholder:text-zinc-500 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300"
              />
              {pc?.ctaArchitectureHelpers['sectionCta'] && (
                <p className="text-[8px] text-zinc-600 italic leading-tight">{pc.ctaArchitectureHelpers['sectionCta']}</p>
              )}
            </div>
            <div className="space-y-1">
              <span className="text-[7px] font-bold uppercase tracking-[0.1em] text-zinc-500">Footer CTA</span>
              <input
                type="text"
                value={portfolioCopy.ctaArchitecture.footerCta}
                onChange={(e) => updateCTAField('footerCta', e.target.value)}
                className="w-full px-3 py-2 rounded-xl outline-none text-xs text-white/80 placeholder:text-zinc-500 bg-white/[0.03] border border-white/5 focus:border-white/20 transition-all duration-300"
              />
              {pc?.ctaArchitectureHelpers['footerCta'] && (
                <p className="text-[8px] text-zinc-600 italic leading-tight">{pc.ctaArchitectureHelpers['footerCta']}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isCompleted ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Check size={14} className="text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Portfolio copy confirmed</span>
        </div>
      ) : (
        <motion.button
          onClick={handleContinue}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 px-6 h-11 rounded-lg text-xs font-bold uppercase tracking-[0.08em] bg-white text-black hover:bg-white/90 shadow-[0_0_30px_-12px_rgba(255,255,255,0.15)] transition-all duration-200 cursor-pointer"
        >
          <ArrowRight size={14} />
          Confirm &amp; Continue
        </motion.button>
      )}
    </div>
  );
}
