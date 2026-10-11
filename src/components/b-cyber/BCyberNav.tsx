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
    <div className="w-full border-b border-slate-200/80 bg-[#fafbfc]/90 backdrop-blur-md sticky top-[72px] sm:top-[80px] z-30 mb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-3">
        {/* Top Breadcrumb & Live Update Status */}
        <div className="flex items-center justify-between gap-2 mb-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 shrink-0 text-slate-400" />
            <Link to="/blueprints" className="hover:text-slate-900 transition-colors">Blueprints</Link>
            <ChevronRight className="w-3 h-3 shrink-0 text-slate-400" />
            <span className="font-semibold text-slate-900">B.Cyber Compass</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Updated Oct 2026</span>
          </div>
        </div>

        {/* Minimal Sub-Navigation Bar */}
        <nav className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-1 -mx-1 px-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0',
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                )}
              >
                <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-white' : 'text-slate-400')} />
                <span>{item.name}</span>
                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] px-2 py-0.5 rounded-full font-medium tracking-normal',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600 border border-slate-200/80'
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
