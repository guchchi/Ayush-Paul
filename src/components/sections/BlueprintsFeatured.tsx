import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Bot, Globe, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const featuredSystems = [
  {
    id: 'ai-execution-framework',
    slug: 'ai-execution-framework',
    category: 'Workflows',
    categoryColor: '#6b35ff',
    categoryBg: '#f3efff',
    categoryBorder: '#ebe5ff',
    icon: Bot,
    iconBg: '#f3efff',
    iconColor: '#6b35ff',
    title: 'AI Execution Framework',
    description:
      'A practical system for using AI to research, plan, create, and execute projects more effectively.',
    accentBg: 'linear-gradient(135deg, #f3efff 0%, #ebe5ff 100%)',
    accentBorder: '#ebe5ff',
    topBorderColor: '#6b35ff',
    visual: 'ai',
  },
  {
    id: 'website-launch-blueprint',
    slug: 'website-launch-blueprint',
    category: 'Blueprints',
    categoryColor: '#0b1c30',
    categoryBg: '#f0f0f0',
    categoryBorder: '#e0e0e0',
    icon: Globe,
    iconBg: '#f5f5f5',
    iconColor: '#0b1c30',
    title: 'Website Launch Blueprint',
    description:
      'A structured framework for planning, building, publishing, and improving modern websites.',
    accentBg: 'linear-gradient(135deg, #f5f5f5 0%, #ebebeb 100%)',
    accentBorder: '#e0e0e0',
    topBorderColor: '#0b1c30',
    visual: 'website',
  },
  {
    id: 'authority-growth-system',
    slug: 'authority-growth-system',
    category: 'Checklists',
    categoryColor: '#ff8000',
    categoryBg: '#fff4eb',
    categoryBorder: '#ffe9d6',
    icon: Search,
    iconBg: '#fff4eb',
    iconColor: '#ff8000',
    title: 'Authority Growth System',
    description:
      'A repeatable process for creating valuable content, improving discoverability, and building long-term authority.',
    accentBg: 'linear-gradient(135deg, #fff4eb 0%, #ffe9d6 100%)',
    accentBorder: '#ffe9d6',
    topBorderColor: '#ff8000',
    visual: 'seo',
  },
];

const AIVisual = () => (
  <div className="w-full h-full flex items-center justify-center p-8 select-none">
    <div className="relative w-full max-w-[240px]">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Research', n: '01', color: '#f5f5f5', text: '#0b1c30' },
          { label: 'Plan', n: '02', color: '#f3efff', text: '#6b35ff' },
          { label: 'Execute', n: '04', color: '#f0fbe8', text: '#558b2f' },
          { label: 'Create', n: '03', color: '#fff4eb', text: '#ff8000' },
        ].map((node) => (
          <div
            key={node.n}
            className="flex flex-col items-center justify-center rounded-xl py-3 px-2 gap-0.5 border border-[#c2c6d6]/20 bg-white shadow-sm"
          >
            <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: node.text }}>
              {node.n}
            </span>
            <span className="text-[10px] font-bold tracking-tight text-[#0b1c30]">
              {node.label}
            </span>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-9 h-9 rounded-full bg-white border border-[#c2c6d6]/35 flex items-center justify-center shadow-sm">
          <Bot size={14} className="text-[#0b1c30]" />
        </div>
      </div>
    </div>
  </div>
);

const WebsiteVisual = () => (
  <div className="w-full h-full flex items-center justify-center px-6 py-6 select-none">
    <div className="w-full max-w-[260px] flex flex-col gap-2.5">
      {[
        { n: '01', label: 'Plan', sub: 'Goals', fill: '#f5f5f5', border: '#e0e0e0', text: '#0b1c30' },
        { n: '02', label: 'Build', sub: 'Pages', fill: '#f3efff', border: '#ebe5ff', text: '#6b35ff' },
        { n: '03', label: 'Publish', sub: 'Deploy', fill: '#f0fbe8', border: '#e1f7d2', text: '#558b2f' },
        { n: '04', label: 'Improve', sub: 'Measure', fill: '#fff4eb', border: '#ffe9d6', text: '#ff8000' },
      ].map((step, i) => (
        <div key={step.n} className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[9px] font-bold border"
            style={{ backgroundColor: step.fill, color: step.text, borderColor: step.border }}
          >
            {step.n}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#0b1c30]">{step.label}</span>
              <span className="text-[8px] text-[#424754]/55 font-medium">{step.sub}</span>
            </div>
            <div className="mt-1 h-0.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  backgroundColor: step.text,
                  width: `${100 - i * 18}%`,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SEOVisual = () => (
  <div className="w-full h-full flex items-center justify-center px-6 py-6 select-none">
    <div className="w-full max-w-[240px] flex flex-col gap-2">
      {[
        { label: 'Content', pct: 90, color: '#ff8000' },
        { label: 'Links', pct: 65, color: '#6b35ff' },
        { label: 'Technical', pct: 78, color: '#0b1c30' },
        { label: 'Authority', pct: 55, color: '#558b2f', bold: true },
      ].map((row) => (
        <div key={row.label} className="flex items-center gap-2">
          <div className="w-20 shrink-0 text-left">
            <span
              className={`text-[9px] tracking-tight ${row.bold ? 'font-extrabold text-[#0b1c30]' : 'font-semibold text-[#424754]'}`}
            >
              {row.label}
            </span>
          </div>
          <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${row.pct}%`, backgroundColor: row.color }}
            />
          </div>
          <span className="text-[8px] font-bold text-[#424754]/60 w-5 text-right">{row.pct}%</span>
        </div>
      ))}
    </div>
  </div>
);

const visualMap: Record<string, React.ReactNode> = {
  ai: <AIVisual />,
  website: <WebsiteVisual />,
  seo: <SEOVisual />,
};

const FeaturedCard = ({
  system,
  index,
}: {
  system: (typeof featuredSystems)[0];
  index: number;
}) => {
  const Icon = system.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.05 + index * 0.05 }}
      className="h-full"
    >
      <Link
        to={`/blueprints/${system.slug}`}
        className="group flex flex-col bg-white border border-[#c2c6d6]/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#0b1c30]/20 transition-all duration-200 h-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1c30]"
        style={{ borderTop: `4px solid ${system.topBorderColor}` }}
      >
        <div
          className="w-full h-44 relative overflow-hidden border-b border-[#c2c6d6]/20 bg-gray-50/50"
          style={{ background: system.accentBg }}
        >
          {visualMap[system.visual]}
          <div
            className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center shadow-sm bg-white border"
            style={{ borderColor: system.accentBorder }}
          >
            <Icon size={14} style={{ color: system.iconColor }} />
          </div>
        </div>

        <div className="flex flex-col flex-1 p-6 text-left">
          <span
            className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-[0.18em] mb-4 shadow-sm border bg-white"
            style={{ color: system.categoryColor, borderColor: system.categoryBorder }}
          >
            {system.category}
          </span>

          <h3 className="text-base font-extrabold text-[#0b1c30] tracking-tight leading-snug mb-2 group-hover:text-[#0058be] transition-colors duration-200">
            {system.title}
          </h3>

          <p className="text-[#424754] text-xs leading-relaxed font-medium mb-6 flex-1">
            {system.description}
          </p>

          <div
            className="inline-flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-widest text-[#424754] mt-auto"
          >
            <span className="group-hover:text-[#0b1c30] transition-colors duration-200">
              Open blueprint
            </span>
            <span className="w-7 h-7 rounded-full bg-bg-secondary border border-[#c2c6d6]/20 flex items-center justify-center group-hover:bg-[#0b1c30] group-hover:border-[#0b1c30] transition-all duration-200 shrink-0">
              <ArrowUpRight size={13} className="text-[#0b1c30] group-hover:text-white transition-colors duration-200" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const BlueprintsFeatured = () => {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end mb-12 text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-4">
            <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full" />
            <span className="tracking-[0.22em]">RECOMMENDED STARTING POINTS</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter leading-[1.1] mb-4 text-[#0b1c30]">
            Featured blueprints
          </h2>

          <p className="text-[#424754] text-sm leading-relaxed font-medium max-w-lg">
            Not sure where to begin? These handpicked blueprints provide the fastest path from concept to implementation and are designed to solve common challenges.
          </p>
        </div>

        <div className="flex lg:justify-end items-center gap-3 flex-wrap">
          {['Handpicked', 'Production-ready', 'Implementation-first'].map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-bold uppercase tracking-widest text-[#424754]/60 bg-white border border-[#c2c6d6]/30 px-3 py-1.5 rounded-full shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredSystems.map((system, i) => (
          <FeaturedCard key={system.id} system={system} index={i} />
        ))}
      </div>

      <div id="blueprints-featured-anchor" className="sr-only" />
    </section>
  );
};
