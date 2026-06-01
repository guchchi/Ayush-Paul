import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VARIANTS } from '../../lib/motion-presets';

const PATHWAYS = [
  {
    title: 'Student',
    role: 'Student ➔ Learn ➔ Build',
    col1Title: 'Learn',
    col1Bullets: ['Open blueprints', 'Build systems', 'Engineering guides'],
    col2Title: 'Contribute',
    col2Bullets: ['Test builds', 'Share feedback'],
    flowTag: 'Deployed builds feed the co-development R&D cycle',
    link: '/blog',
    linkText: 'Enter Learning Engine',
    badgeColor: 'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20',
    hoverBorder: 'hover:border-brand-secondary/35 hover:shadow-[0_15px_40px_rgba(0,194,255,0.05)]'
  },
  {
    title: 'Collaborator',
    role: 'Collaborator ➔ Mentor ➔ Co-build',
    col1Title: 'Co-Build',
    col1Bullets: ['Active R&D projects', 'System reviews', 'Technical mentorship'],
    col2Title: 'Contribute',
    col2Bullets: ['Improve modules', 'Validate systems'],
    flowTag: 'Validated systems enable institutional scale',
    link: '/collaborate',
    linkText: 'Access Collaboration Hub',
    badgeColor: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
    hoverBorder: 'hover:border-brand-primary/35 hover:shadow-[0_15px_40px_rgba(0,102,255,0.05)]'
  },
  {
    title: 'Sponsor',
    role: 'Sponsor ➔ Enable ➔ Scale Impact',
    col1Title: 'Enable',
    col1Bullets: ['Support builders', 'Fund prototypes', 'Expand programs'],
    col2Title: 'Impact',
    col2Bullets: ['Visibility', 'Talent access', 'Innovation pipeline'],
    flowTag: 'Funded resources cycle back to accelerate learners',
    link: '/collaborate',
    linkText: 'Initiate Partnership',
    badgeColor: 'bg-green-500/10 text-green-400 border-green-500/20',
    hoverBorder: 'hover:border-green-500/35 hover:shadow-[0_15px_40px_rgba(34,197,94,0.05)]'
  }
];

export const HomeEcosystemAccessSection = () => {
  return (
    <Section id="ecosystem-access" className="py-32 border-t border-white/5 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-6">
              Ecosystem Entryways
            </h2>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter">
              A Living Structure.<br />
              Choose Your <span className="text-brand-primary">Gateway.</span>
            </h3>
          </div>
          <p className="text-white/40 font-medium max-w-md text-lg leading-relaxed">
            <span className="text-white/90 font-bold block mb-2">Learn. Build. Share. Scale.</span>
            Every project, contribution, and partnership strengthens the same engineering ecosystem. Choose where you want to begin.
          </p>
        </div>

        {/* Visual Operational Pipeline Connector */}
        <div className="hidden lg:flex items-center justify-between px-16 mb-16 text-[10px] font-mono tracking-[0.3em] text-white/25 select-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" />
            <span className="text-white/60">LEARN ENGINE</span>
          </div>
          <div className="flex-grow h-px bg-gradient-to-r from-brand-secondary/30 to-brand-primary/30 mx-6 relative">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0A0A0B] px-3 text-[8px] text-white/30 font-bold uppercase">
              STUDENT OUTCOMES FEED R&D ➔
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-white/60">CO-BUILD SPRINT</span>
          </div>
          <div className="flex-grow h-px bg-gradient-to-r from-brand-primary/30 to-green-500/30 mx-6 relative">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0A0A0B] px-3 text-[8px] text-white/30 font-bold uppercase">
              SPONSORS STAGE IMPACT ➔
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-white/60">SCALE IMPACT NODE</span>
          </div>
        </div>

        {/* 3-Column Living Structure Pathway Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {PATHWAYS.map((path, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-8 md:p-10 rounded-[40px] border border-white/5 flex flex-col justify-between transition-all duration-500 group ${path.hoverBorder}`}
            >
              {/* Top Section */}
              <div className="space-y-8">
                {/* Header Block */}
                <div>
                  <span className={`inline-block px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider mb-4 ${path.badgeColor}`}>
                    {path.role}
                  </span>
                  <h4 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white group-hover:text-brand-primary transition-colors duration-300">
                    {path.title}
                  </h4>
                </div>

                <div className="space-y-6 border-t border-white/5 pt-6">
                  {/* Column 1 */}
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">{path.col1Title}</div>
                    <ul className="space-y-2.5">
                      {path.col1Bullets.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-white/75 font-medium leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/60 shrink-0 mt-1.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Column 2 */}
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">{path.col2Title}</div>
                    <ul className="space-y-2.5">
                      {path.col2Bullets.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-white/50 font-medium leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/40 shrink-0 mt-1.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Operational Flow Cycle Indicator */}
                  <div className="pt-4 border-t border-white/5 flex items-center gap-2 select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse shrink-0" />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/30 group-hover:text-brand-primary transition-colors duration-300">
                      {path.flowTag}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Link */}
              <div className="mt-10 pt-6 border-t border-white/5">
                <Link
                  to={path.link}
                  className="w-full py-4 px-6 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm tracking-tight flex items-center justify-center gap-2 hover:bg-white hover:text-black hover:border-white transition-all duration-300 group/btn"
                >
                  {path.linkText}
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </Section>
  );
};

export default HomeEcosystemAccessSection;
