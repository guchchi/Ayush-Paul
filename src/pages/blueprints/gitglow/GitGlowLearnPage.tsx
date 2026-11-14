import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Sparkles,
  ExternalLink,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { GITHUB_BADGES } from '../../../data/gitglow/github-badges';
import { BADGE_CURRICULUM } from '../../../data/gitglow/badge-curriculum';
import { BadgeCurriculumView } from './BadgeCurriculumView';
import { cn } from '../../../lib/utils';

export const GitGlowLearnPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const badgeId = searchParams.get('badge') || 'quickdraw';

  const activeBadge = GITHUB_BADGES.find((b) => b.id === badgeId) || GITHUB_BADGES[0];
  const pedagogy = BADGE_CURRICULUM[activeBadge.id];

  const handleSelectBadge = (newBadgeId: string) => {
    setSearchParams({ badge: newBadgeId });
  };

  const handleGoToEngine = () => {
    navigate(`/blueprints/gitglow/engine?badge=${activeBadge.id}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#101114] selection:bg-[#D7FF36] selection:text-[#101114]">
      {/* Sticky Reader Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E3DA] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={`/blueprints/gitglow/engine?badge=${activeBadge.id}`}
            className="w-8 h-8 rounded-full bg-[#FAF9F5] border border-[#E5E3DA] flex items-center justify-center text-[#65666A] hover:text-[#101114] hover:bg-white transition-all shadow-2xs"
            title="Return to 1-Click Sandbox Engine"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] p-1 flex items-center justify-center shrink-0">
              <img
                src={activeBadge.image}
                alt={activeBadge.name}
                className="w-full h-full object-contain filter drop-shadow-2xs"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#101114]">
                  {activeBadge.name}: Deep Learning & Concepts
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-[#F7F8EF] text-[#65A30D] border border-[#DCE89E] text-[10px] font-bold">
                  Chapter Guide
                </span>
              </div>
              <p className="text-[11px] text-[#65666A] hidden sm:block">
                Dedicated learning companion for real GitHub achievement qualification
              </p>
            </div>
          </div>
        </div>

        {/* Badge Quick Selector + Direct Sandbox Launch */}
        <div className="flex items-center gap-2.5">
          <select
            value={activeBadge.id}
            onChange={(e) => handleSelectBadge(e.target.value)}
            className="h-8 px-2.5 rounded-xl bg-[#FAF9F5] border border-[#E5E3DA] text-xs font-bold text-[#101114] focus:outline-hidden cursor-pointer"
          >
            {GITHUB_BADGES.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} Guide
              </option>
            ))}
          </select>

          <button
            onClick={handleGoToEngine}
            className="h-8 px-4 rounded-xl bg-[#101114] hover:bg-[#1C1E24] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Zap size={12} className="text-[#D7FF36]" />
            <span>Launch Sandbox</span>
          </button>
        </div>
      </header>

      {/* Main Reading Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Top Quick Breadcrumb & Notice */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E3DA] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#65666A]">
            <BookOpen size={14} className="text-[#84CC16]" />
            <span>
              Learning Window for <strong>{activeBadge.name}</strong> · Take your time reading concepts before executing in the sandbox.
            </span>
          </div>

          <button
            onClick={handleGoToEngine}
            className="text-xs font-bold text-[#4D7C0F] hover:text-[#65A30D] inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Switch to 1-Click Sandbox</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Curriculum Body */}
        {pedagogy ? (
          <BadgeCurriculumView
            pedagogy={pedagogy}
            onGoToExecution={handleGoToEngine}
          />
        ) : (
          <div className="p-16 rounded-3xl bg-white border border-[#E5E3DA] text-center space-y-4">
            <BookOpen size={36} className="mx-auto text-slate-400" />
            <h3 className="text-base font-extrabold text-[#101114]">Curriculum Loading</h3>
            <p className="text-xs text-[#65666A] max-w-sm mx-auto">
              Curriculum module for {activeBadge.name} is being drafted. You can still test the 1-click execution sandbox directly!
            </p>
            <button
              onClick={handleGoToEngine}
              className="h-10 px-6 rounded-full bg-[#101114] text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Go to 1-Click Engine</span>
              <ArrowRight size={13} />
            </button>
          </div>
        )}

        {/* Bottom Action Footer */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E3DA] shadow-xs text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F7F8EF] border border-[#DCE89E] mx-auto flex items-center justify-center text-[#65A30D]">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#101114]">
              Understood the {activeBadge.name} Concept?
            </h3>
            <p className="text-xs text-[#65666A] max-w-md mx-auto mt-1">
              Switch back to the GitGlow Engine to trigger real GitHub API events or run the interactive simulation.
            </p>
          </div>

          <button
            onClick={handleGoToEngine}
            className="h-11 px-7 rounded-full bg-[#101114] hover:bg-[#1C1E24] text-white text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <span>Open 1-Click Execution Sandbox</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </main>
    </div>
  );
};

