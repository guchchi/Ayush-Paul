/**
 * WireframeSimulatorSection.tsx — Level 2 / Sub-Step 4: Interactive Live Wireframe Simulator
 *
 * Full-fidelity and architectural wireframe browser preview with
 * responsive viewport toggles (Desktop / Tablet / Mobile) and live conversion telemetry.
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Layers,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  MousePointerClick,
  CheckCircle2,
  ExternalLink,
  Code2,
  Layout,
} from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import { useModule3Store } from '../../../../../lib/module3/store';
import {
  calculatePortfolioTelemetry,
} from '../../../../../lib/module3/portfolio-architecture-engine';
import { ModuleButton } from '../../../../workspace/ModuleButton';

interface Props {
  onContinue: () => void;
}

export const WireframeSimulatorSection: React.FC<Props> = React.memo(({ onContinue }) => {
  const {
    authoritySuite,
    stage2WireframeSettings,
    setStage2WireframeSettings,
    stage1Identity,
  } = useModule3Store();

  const sections = useMemo(() => {
    return authoritySuite?.portfolioBlueprint ?? [];
  }, [authoritySuite?.portfolioBlueprint]);

  const activeSections = useMemo(() => {
    return sections.filter((s) => s.isEnabled !== false);
  }, [sections]);

  const telemetry = useMemo(() => {
    return calculatePortfolioTelemetry(sections);
  }, [sections]);

  const viewport = stage2WireframeSettings?.viewport || 'desktop';
  const fidelity = stage2WireframeSettings?.fidelity || 'wireframe';

  const setViewport = (v: 'desktop' | 'tablet' | 'mobile') => {
    setStage2WireframeSettings({ viewport: v });
  };

  const setFidelity = (f: 'wireframe' | 'high-fidelity') => {
    setStage2WireframeSettings({ fidelity: f });
  };

  const userName = stage1Identity?.userName || 'Ayush Paul';
  const userHandle = stage1Identity?.userHandle || 'ayushpaul';

  return (
    <div className="space-y-6 text-left">
      {/* Top Header & Telemetry Bar */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#0058be] text-xs font-mono font-bold uppercase tracking-wider">
              <Monitor size={15} />
              <span>Step 4 of 5 — Wireframe Simulator</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0b1c30]">
              Interactive Live Wireframe Simulation
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Test your portfolio layout across viewports and toggle between architectural wireframe schematics and high-fidelity simulated rendering.
            </p>
          </div>

          {/* Telemetry Stats Chips */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs flex items-center gap-1.5 font-bold text-neutral-700">
              <Clock size={13} className="text-[#0058be]" />
              <span>~{telemetry.estimatedReadTimeMinutes} Min Read</span>
            </div>
            <div className="px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex items-center gap-1.5 font-bold text-emerald-800">
              <ShieldCheck size={13} className="text-emerald-600" />
              <span>{telemetry.proofRatioPct}% Proof Density</span>
            </div>
            <div className="px-3 py-2 bg-indigo-50 rounded-xl border border-indigo-200 text-xs flex items-center gap-1.5 font-bold text-indigo-800">
              <MousePointerClick size={13} className="text-indigo-600" />
              <span>{telemetry.ctaTouchpoints} CTAs</span>
            </div>
          </div>
        </div>

        {/* Simulator Control Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100">
          {/* Viewport Switcher */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-2xl border border-neutral-200 text-xs font-bold">
            <button
              onClick={() => setViewport('desktop')}
              className={cn(
                'px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer',
                viewport === 'desktop'
                  ? 'bg-white text-[#0058be] shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              <Monitor size={14} />
              <span>Desktop (1440px)</span>
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={cn(
                'px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer',
                viewport === 'tablet'
                  ? 'bg-white text-[#0058be] shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              <Tablet size={14} />
              <span>Tablet (768px)</span>
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={cn(
                'px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer',
                viewport === 'mobile'
                  ? 'bg-white text-[#0058be] shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              <Smartphone size={14} />
              <span>Mobile (375px)</span>
            </button>
          </div>

          {/* Fidelity Switcher */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-2xl border border-neutral-200 text-xs font-bold">
            <button
              onClick={() => setFidelity('wireframe')}
              className={cn(
                'px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer',
                fidelity === 'wireframe'
                  ? 'bg-[#0b1c30] text-cyan-300 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              <Code2 size={13} />
              <span>Architectural Blueprint</span>
            </button>
            <button
              onClick={() => setFidelity('high-fidelity')}
              className={cn(
                'px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer',
                fidelity === 'high-fidelity'
                  ? 'bg-[#0058be] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              <Sparkles size={13} />
              <span>High-Fidelity Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Device Frame Container */}
      <div className="bg-neutral-100 p-4 sm:p-8 rounded-3xl border border-neutral-300/80 overflow-x-auto">
        <div
          className={cn(
            'transition-all duration-300 mx-auto rounded-3xl overflow-hidden shadow-2xl border',
            viewport === 'desktop' && 'max-w-full',
            viewport === 'tablet' && 'max-w-2xl',
            viewport === 'mobile' && 'max-w-sm',
            fidelity === 'wireframe'
              ? 'bg-[#0b1c30] border-slate-700 text-slate-100'
              : 'bg-white border-neutral-300 text-neutral-900'
          )}
        >
          {/* Simulated Browser Bar */}
          <div
            className={cn(
              'px-4 py-3 border-b flex items-center justify-between text-xs',
              fidelity === 'wireframe'
                ? 'bg-[#061426] border-slate-800 text-slate-400'
                : 'bg-neutral-100 border-neutral-200 text-neutral-600'
            )}
          >
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>

            <div
              className={cn(
                'px-4 py-1 rounded-xl font-mono text-[11px] truncate max-w-xs sm:max-w-md text-center border',
                fidelity === 'wireframe'
                  ? 'bg-[#0b1c30] border-slate-700 text-cyan-400'
                  : 'bg-white border-neutral-200 text-neutral-700'
              )}
            >
              https://{userHandle || 'portfolio'}.dev • {userName}
            </div>

            <div className="text-[10px] font-mono font-bold opacity-60">
              {viewport === 'desktop' ? '1440px' : viewport === 'tablet' ? '768px' : '375px'}
            </div>
          </div>

          {/* Website Content Stream */}
          <div className="p-4 sm:p-8 space-y-8 max-h-[750px] overflow-y-auto scrollbar-thin">
            {activeSections.map((sec, idx) => (
              <div
                key={sec.id}
                id={`sim_${sec.id}`}
                className={cn(
                  'p-6 sm:p-8 rounded-2xl transition-all text-left space-y-4 relative group',
                  fidelity === 'wireframe'
                    ? 'border-2 border-dashed border-slate-700 bg-slate-900/60 hover:border-cyan-500/80'
                    : 'border border-neutral-200/90 bg-neutral-50/50 hover:border-[#0058be]/40 shadow-xs'
                )}
              >
                {/* Structural Section Watermark Label */}
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={cn(
                      'font-mono text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md border',
                      fidelity === 'wireframe'
                        ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60'
                        : 'bg-blue-50 text-[#0058be] border-blue-200'
                    )}
                  >
                    SECTION #{idx + 1} • {sec.title}
                  </span>

                  {fidelity === 'wireframe' && (
                    <span className="text-[10px] font-mono text-slate-400">
                      [Wireframe Block: {sec.id}]
                    </span>
                  )}
                </div>

                {/* Headline & Subheadline */}
                <div className="space-y-1.5">
                  <h3
                    className={cn(
                      'font-black tracking-tight',
                      viewport === 'mobile' ? 'text-lg' : 'text-2xl sm:text-3xl',
                      fidelity === 'wireframe' ? 'text-white' : 'text-[#0b1c30]'
                    )}
                  >
                    {sec.headline || sec.title}
                  </h3>
                  <p
                    className={cn(
                      'font-medium leading-relaxed',
                      viewport === 'mobile' ? 'text-xs' : 'text-sm sm:text-base',
                      fidelity === 'wireframe' ? 'text-slate-300' : 'text-neutral-600'
                    )}
                  >
                    {sec.subheadline || sec.purpose}
                  </p>
                </div>

                {/* Body Copy */}
                <p
                  className={cn(
                    'text-xs sm:text-sm leading-relaxed whitespace-pre-line',
                    fidelity === 'wireframe' ? 'text-slate-400 font-mono' : 'text-neutral-700 font-sans'
                  )}
                >
                  {sec.bodyCopy || sec.conversionReasoning}
                </p>

                {/* Wireframe Placeholder Visual Box */}
                {fidelity === 'wireframe' ? (
                  <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950/50 space-y-1 text-xs font-mono text-cyan-400">
                    <div className="text-[10px] uppercase font-bold text-slate-500">
                      [Component Placeholder Specification]
                    </div>
                    <div>{sec.recommendedVisuals || 'Interactive Demonstration Grid'}</div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-2xs space-y-1 text-xs text-neutral-600">
                    <span className="text-[10px] font-extrabold uppercase text-[#0058be] block">
                      Visual Blueprint
                    </span>
                    <p className="font-medium text-neutral-800">
                      {sec.recommendedVisuals || 'Live Interactive Component'}
                    </p>
                  </div>
                )}

                {/* Action CTA Button & Trust Statement */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  {sec.ctaText && (
                    <button
                      className={cn(
                        'px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center gap-1.5',
                        fidelity === 'wireframe'
                          ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-mono'
                          : 'bg-[#0058be] text-white hover:bg-[#004bb0]'
                      )}
                    >
                      <span>{sec.ctaText}</span>
                      <ArrowRight size={13} />
                    </button>
                  )}

                  {sec.trustStatement && (
                    <span
                      className={cn(
                        'text-xs font-semibold flex items-center gap-1',
                        fidelity === 'wireframe' ? 'text-emerald-400' : 'text-emerald-700'
                      )}
                    >
                      <ShieldCheck size={14} />
                      <span>{sec.trustStatement}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
        <div className="text-xs text-neutral-500">
          Wireframe approved across Desktop, Tablet &amp; Mobile.
        </div>

        <ModuleButton onClick={onContinue}>
          Confirm Wireframe &amp; Conversion Audit →
        </ModuleButton>
      </div>
    </div>
  );
});
