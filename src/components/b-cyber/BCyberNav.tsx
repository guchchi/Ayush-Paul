import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, ShieldCheck, MapPin, ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface NavPillar {
  name: string;
  href: string;
  icon: React.ElementType;
  description: string;
}

export const PILLARS: NavPillar[] = [
  { 
    name: 'Understand B.Cyber', 
    href: '/blueprints/b-cyber', 
    icon: Compass, 
    description: 'Degree, 2+2 model & curriculum' 
  },
  { 
    name: 'Admission', 
    href: '/blueprints/b-cyber/admission', 
    icon: ShieldCheck, 
    description: 'Eligibility, 2026 vs 2027 shift' 
  },
  { 
    name: 'Preparation Roadmap', 
    href: '/blueprints/b-cyber/roadmap', 
    icon: MapPin, 
    description: 'Free stages & personal planning' 
  },
];

export const BCyberNav: React.FC = () => {
  const location = useLocation();

  const currentPillar = PILLARS.find(p => location.pathname === p.href) 
    || (location.pathname.startsWith('/blueprints/b-cyber/roadmap') ? PILLARS[2] : null);

  return (
    <header 
      aria-label="B.Cyber Compass Navigation" 
      className="w-full border-b border-slate-200/80 bg-[#fafbfc]/95 backdrop-blur-md sticky top-0 sm:top-16 z-30 mb-8 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2.5 pb-2.5">
        {/* Top Meta Strip: Breadcrumbs & Verification Stamp */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-2.5 text-xs">
          {/* Desktop & Mobile Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-slate-500 overflow-x-auto whitespace-nowrap py-0.5">
            <Link to="/" className="hover:text-slate-900 transition-colors hidden sm:inline">Home</Link>
            <ChevronRight className="w-3 h-3 shrink-0 text-slate-400 hidden sm:inline" />
            <Link to="/blueprints" className="hover:text-slate-900 transition-colors">Blueprints</Link>
            <ChevronRight className="w-3 h-3 shrink-0 text-slate-400" />
            <Link to="/blueprints/b-cyber" className="font-semibold text-slate-900 hover:text-brand-primary transition-colors">
              B.Cyber Compass
            </Link>
            {currentPillar && currentPillar.href !== '/blueprints/b-cyber' && (
              <>
                <ChevronRight className="w-3 h-3 shrink-0 text-slate-400" />
                <span className="text-slate-700 font-medium">{currentPillar.name}</span>
              </>
            )}
          </nav>

          {/* Verification & Trust Badge */}
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600 shrink-0">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/80 text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Independent Guide · Verified 12 Oct 2026</span>
            </span>
            <a
              href="https://iitk.ac.in/wsais/b-cyber.php"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-900 hidden md:inline-flex items-center gap-1 transition-colors"
              title="Official IIT Kanpur WSAIS B.Cyber portal"
            >
              <span>Official Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Row 2: Pillar Navigation + Cycle Status Context Widget */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pt-1">
          {/* The 3 Core Pillar Tabs in a sleek cohesive segmented container */}
          <nav 
            aria-label="Pillar Navigation" 
            className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 overflow-x-auto custom-scrollbar touch-pan-x"
          >
            {PILLARS.map((pillar, idx) => {
              const isActive = location.pathname === pillar.href 
                || (pillar.href === '/blueprints/b-cyber/roadmap' && location.pathname === '/blueprints/b-cyber/prepare');
              const Icon = pillar.icon;

              return (
                <Link
                  key={pillar.href}
                  to={pillar.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 min-h-[40px] rounded-xl text-xs transition-all shrink-0 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none',
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-white/90 font-medium'
                  )}
                >
                  <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-[#d1f34d]' : 'text-slate-400')} />
                  <div className="flex flex-col text-left">
                    <span className="leading-tight flex items-center gap-1.5">
                      <span className={cn('text-[10px] font-mono', isActive ? 'text-white/60' : 'text-slate-400')}>
                        0{idx + 1}
                      </span>
                      <span>{pillar.name}</span>
                    </span>
                    <span className={cn(
                      'text-[10px] hidden xl:block leading-none mt-0.5',
                      isActive ? 'text-white/70' : 'text-slate-400'
                    )}>
                      {pillar.description}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Right Balanced Status Context: 2027 Shift Quick Pill */}
          <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-amber-50/90 border border-amber-200/70 text-xs text-amber-900 shrink-0">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-amber-950">2027 Shift:</span>
              <span className="text-amber-800/90">JEE Main Discontinued · Separate Test Announced</span>
            </div>
            <Link
              to="/blueprints/b-cyber/admission#selection-process"
              className="inline-flex items-center font-medium text-amber-950 underline underline-offset-2 hover:text-amber-700 ml-1 transition-colors"
            >
              Verify →
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
