import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, ShieldCheck, History, Bell, FileCheck, CalendarCheck, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Compass Overview', href: '/blueprints/b-cyber', icon: Compass },
  { name: 'Admission Intelligence', href: '/blueprints/b-cyber/admission', icon: ShieldCheck },
  { name: '2026 Precedent', href: '/blueprints/b-cyber/2026-process', icon: History },
  { name: 'Official Updates', href: '/blueprints/b-cyber/updates', icon: Bell, badge: 'FAQ 23' },
  { name: 'Evidence of Work', href: '/blueprints/b-cyber/evidence-of-work', icon: FileCheck },
  { name: 'Preparation Planner', href: '/blueprints/b-cyber/prepare', icon: CalendarCheck, badge: 'Interactive' },
];

export const BCyberNav: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-full border-b border-border-color bg-white/80 backdrop-blur-md sticky top-16 z-30 mb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-3">
        {/* Breadcrumb Hierarchy */}
        <div className="flex items-center gap-1.5 text-xs text-text-muted mb-3 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <Link to="/blueprints" className="hover:text-text-primary transition-colors">Blueprints</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="font-semibold text-brand-primary">B.Cyber Compass</span>
        </div>

        {/* Header Title & Tagline */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-border-color/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-brand-primary/10 text-brand-primary">
                <Compass className="w-4 h-4" />
              </span>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-text-primary">
                B.Cyber Compass
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-bg-secondary text-brand-primary border border-brand-primary/20">
                v2.3
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Independent admission intelligence & personalised preparation roadmap for the 4-year B.Cyber program.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-text-muted">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Updated Oct 2026</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 mt-3 overflow-x-auto custom-scrollbar pb-1 text-xs -mx-1 px-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all text-xs shrink-0',
                  isActive
                    ? 'bg-brand-primary text-white shadow-2xs font-semibold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary/70'
                )}
              >
                <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-white' : 'text-text-muted')} />
                <span>{item.name}</span>
                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.2 rounded font-semibold',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-brand-primary/10 text-brand-primary'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
