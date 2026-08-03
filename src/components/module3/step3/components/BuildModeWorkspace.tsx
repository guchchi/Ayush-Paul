import React from 'react';
import { Globe, Briefcase, Linkedin, Calendar, Send, Archive, ExternalLink, Zap, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onCopyLinkedInPackage?: () => void;
  onExportVault?: () => void;
}

export const BuildModeWorkspace = React.memo(function BuildModeWorkspace({
  onCopyLinkedInPackage,
  onExportVault,
}: Props) {
  const navigate = useNavigate();

  const buildCards = [
    {
      id: 'website',
      title: 'Build Website Hero Canvas',
      category: 'STUDIO CANVAS',
      desc: 'Deploy the 9-section portfolio blueprint to your live landing page canvas.',
      estTime: '30 min',
      impact: 'Transformational',
      ptsBonus: '+15 PTS',
      icon: <Globe size={20} className="text-[#0058be]" />,
      actionText: 'Open Landing Canvas →',
      onClick: () => navigate('/workspace/portfolio-system'),
      badgeColor: 'bg-blue-50 text-[#0058be]',
    },
    {
      id: 'portfolio',
      title: 'Build Portfolio System (Module 4)',
      category: 'MODULE 4 BRIDGE',
      desc: 'Translate authority proof assets into structured case studies.',
      estTime: '20 min',
      impact: 'Very High',
      ptsBonus: '+12 PTS',
      icon: <Briefcase size={20} className="text-indigo-600" />,
      actionText: 'Open Portfolio System →',
      onClick: () => navigate('/workspace/portfolio-system'),
      badgeColor: 'bg-indigo-50 text-indigo-700',
    },
    {
      id: 'linkedin',
      title: 'Build LinkedIn Profile Package',
      category: 'SOCIAL CHANNEL',
      desc: 'Copy headline, banner concept, bio, and featured CTA to your live profile.',
      estTime: '10 min',
      impact: 'High',
      ptsBonus: '+10 PTS',
      icon: <Linkedin size={20} className="text-[#0077b5]" />,
      actionText: 'Copy Profile Package',
      onClick: onCopyLinkedInPackage || (() => {}),
      badgeColor: 'bg-[#0077b5]/10 text-[#0077b5]',
    },
    {
      id: 'content',
      title: 'Build Content Engine (Module 6)',
      category: 'MODULE 6 BRIDGE',
      desc: 'Schedule and post Day 1-3 authority teardowns from your 30-day matrix.',
      estTime: '15 min',
      impact: 'High',
      ptsBonus: '+8 PTS',
      icon: <Calendar size={20} className="text-amber-600" />,
      actionText: 'Open Outreach Engine →',
      onClick: () => navigate('/workspace/outreach-engine'),
      badgeColor: 'bg-amber-50 text-amber-800',
    },
    {
      id: 'outreach',
      title: 'Build Client Pipeline (Module 5)',
      category: 'MODULE 5 BRIDGE',
      desc: 'Deploy 8 permission-based outreach scripts into your CRM sales pipeline.',
      estTime: '25 min',
      impact: 'Transformational',
      ptsBonus: '+14 PTS',
      icon: <Send size={20} className="text-emerald-600" />,
      actionText: 'Open Client Pipeline →',
      onClick: () => navigate('/workspace/client-pipeline'),
      badgeColor: 'bg-emerald-50 text-emerald-800',
    },
    {
      id: 'vault',
      title: 'Export Central Asset Vault',
      category: 'DATA EXPORT',
      desc: 'Download complete authority suite as Markdown, JSON, or printable PDF.',
      estTime: 'Instant',
      impact: 'Complete',
      ptsBonus: '100% VAULT',
      icon: <Archive size={20} className="text-purple-600" />,
      actionText: 'Export Vault Markdown',
      onClick: onExportVault || (() => {}),
      badgeColor: 'bg-purple-50 text-purple-800',
    },
  ];

  return (
    <section className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-amber-500" />
          <h3 className="text-lg font-black text-[#0b1c30]">Build Mode Workspace — Primary Action Cards</h3>
        </div>
        <span className="text-xs font-bold text-neutral-500">1-Click Execution Bridges</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buildCards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-4 group text-left"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${card.badgeColor}`}>
                  {card.category}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  {card.ptsBonus}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 shrink-0 group-hover:scale-105 transition-transform">
                  {card.icon}
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#0b1c30] leading-snug">{card.title}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-semibold mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {card.estTime}
                    </span>
                    <span>•</span>
                    <span>Impact: {card.impact}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-neutral-600 font-medium leading-relaxed">{card.desc}</p>
            </div>

            <button
              onClick={card.onClick}
              className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-[#0058be] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-2xs group-hover:shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span>{card.actionText}</span>
              <ExternalLink size={12} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
});
