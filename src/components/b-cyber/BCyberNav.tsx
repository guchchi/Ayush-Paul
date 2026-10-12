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

        {/* The 3 Core Pillar Tabs */}
        <nav 
          aria-label="Pillar Navigation" 
          className="flex items-center gap-2 overflow-x-auto custom-scrollbar py-1 -mx-1 px-1 touch-pan-x"
        >
          {PILLARS.map((pillar) => {
            const isActive = location.pathname === pillar.href 
              || (pillar.href === '/blueprints/b-cyber/roadmap' && location.pathname === '/blueprints/b-cyber/prepare');
            const Icon = pillar.icon;

            return (
              <Link
                key={pillar.href}
                to={pillar.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none',
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-700 bg-white/70 border border-slate-200/70 hover:text-slate-950 hover:bg-slate-100 hover:border-slate-300'
                )}
              >
                <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-[#d1f34d]' : 'text-slate-400')} />
                <div className="flex flex-col text-left">
                  <span className="leading-tight">{pillar.name}</span>
                  <span className={cn(
                    'text-[10px] hidden md:block leading-none mt-0.5',
                    isActive ? 'text-white/70' : 'text-slate-500'
                  )}>
                    {pillar.description}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
