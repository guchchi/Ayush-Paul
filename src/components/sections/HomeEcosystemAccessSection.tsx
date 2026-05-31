import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VARIANTS } from '../../lib/motion-presets';

// These are ecosystem divisions, not nav links — each one is a platform/product
const DIVISIONS = [
  {
    number: '01',
    division: 'Systems',
    tagline: 'The Build Lab',
    desc: 'Hardware projects, robotics platforms, and physical prototypes — documented end-to-end with schematics, firmware, and build journals.',
    path: '/systems',
    badge: 'Open Source',
  },
  {
    number: '02',
    division: 'Experiments',
    tagline: 'R&D Floor',
    desc: 'Science exhibition prototypes, Arduino micro-builds, and rapid hardware experiments. Where ideas get tested before they become products.',
    path: '/experiments',
    badge: 'Active Lab',
  },
  {
    number: '03',
    division: 'Labs',
    tagline: 'Software Studio',
    desc: 'Web applications, developer tools, and AI-powered utilities — production-deployed software available to the community.',
    path: '/labs',
    badge: 'Live Products',
  },
  {
    number: '04',
    division: 'Chronicles',
    tagline: 'Knowledge Platform',
    desc: 'Engineering tutorials, student growth frameworks, and system-building guides. The open curriculum for builders who learn by doing.',
    path: '/blog',
    badge: 'Free Access',
  },
  {
    number: '05',
    division: 'Vault',
    tagline: 'Credential Registry',
    desc: 'Verified awards, national recognitions, and certified achievements — a transparent proof-of-work record for the ecosystem.',
    path: '/vault',
    badge: 'Verified',
  },
  {
    number: '06',
    division: 'Now',
    tagline: 'Live Workbench',
    desc: 'A real-time snapshot of what\'s being built, learned, and researched right now. No evergreen content — only live context.',
    path: '/now',
    badge: 'Updated Weekly',
  },
  {
    number: '07',
    division: 'Momentum',
    tagline: 'Progress Log',
    desc: 'Shipped milestones, roadmap targets, and honest build updates — the full development timeline of the ecosystem, in public.',
    path: '/momentum',
    badge: 'Building in Public',
  },
  {
    number: '08',
    division: 'Collaborate',
    tagline: 'Partnership Hub',
    desc: 'The gateway for founders, sponsors, educators, and builders who want to join forces, fund initiatives, or build together.',
    path: '/collaborate',
    badge: '1 Slot Open',
  },
];

export const HomeEcosystemAccessSection = () => {
  return (
    <Section id="ecosystem-access" className="py-32 border-t border-white/5 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-6">
              Ecosystem Structure
            </h2>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Eight <span className="text-brand-secondary">Divisions.</span>
              <br />One Platform.
            </h3>
          </div>
          <p className="text-white/40 font-medium max-w-sm text-lg">
            Every division is a standalone layer of the ecosystem — connected, but independently valuable.
          </p>
        </div>

        {/* Division rows — same pattern as CollaborationTypes in CollaboratePage */}
        <div className="grid gap-4">
          {DIVISIONS.map((div, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="group"
            >
              <Link
                to={div.path}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-8 md:p-10 glass-card rounded-[32px] border-white/5 hover:bg-white/[0.04] hover:border-brand-primary/20 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
                  {/* Number + Division name */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-sm font-bold border border-brand-primary/20">
                      {div.number}
                    </div>
                    <div className="md:w-32">
                      <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-primary mb-0.5">
                        {div.tagline}
                      </div>
                      <h4 className="text-xl font-bold tracking-tight group-hover:text-brand-primary transition-colors">
                        {div.division}
                      </h4>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden md:block w-px h-10 bg-white/5" />

                  {/* Description */}
                  <p className="text-white/40 font-medium text-sm max-w-md leading-relaxed">
                    {div.desc}
                  </p>
                </div>

                <div className="mt-6 md:mt-0 flex items-center gap-4 shrink-0">
                  <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/30">
                    {div.badge}
                  </span>
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:bg-brand-primary/10 group-hover:text-brand-primary group-hover:border-brand-primary/20 transition-all">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </Section>
  );
};

export default HomeEcosystemAccessSection;
