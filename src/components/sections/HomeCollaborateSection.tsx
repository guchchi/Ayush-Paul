import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { MagneticButton } from '../ui/MagneticButton';
import { ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VARIANTS } from '../../lib/motion-presets';

// How people join the ecosystem — pathways, not just "types of collaboration"
const JOIN_PATHWAYS = [
  {
    type: 'Learn',
    for: 'Learners & Hobbyists',
    desc: 'Access the open knowledge hub, read step-by-step engineering journals, and study system schematics in public.',
    badge: 'Knowledge Engine Access',
    number: '01',
  },
  {
    type: 'Build',
    for: 'Builders & Engineers',
    desc: 'Clone open-source code repos, deploy modular setups, and implement ecosystem blueprints in your own projects.',
    badge: 'Technical Blueprints',
    number: '02',
  },
  {
    type: 'Contribute',
    for: 'Founders & Researchers',
    desc: 'Collaborate on active hardware-software systems, co-develop custom libraries, and participate in peer code reviews.',
    badge: 'Co-Development Pathway',
    number: '03',
  },
  {
    type: 'Partner',
    for: 'Sponsors & Institutions',
    desc: 'Fund robotics research, sponsor student hardware kits, or back national competition entries to accelerate high-potential talent.',
    badge: 'Ecosystem Alignment',
    number: '04',
  },
];

const TRUST_TAGS = ['Response within 24h', 'NDAs available', 'Student-founder transparency'];

export const HomeCollaborateSection = () => {
  return (
    <Section id="collaborate" className="py-32 border-t border-white/5 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-6">
              Participate
            </h2>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter">
              How would you like to <span className="text-brand-secondary">participate?</span>
            </h3>
          </div>
          <p className="text-white/40 font-medium max-w-sm text-lg">
            There are four ways to plug into this ecosystem — pick the one that matches where you are.
          </p>
        </div>

        {/* Join pathway rows — mirrors CollaborationTypes in CollaboratePage */}
        <div className="grid gap-6 mb-20">
          {JOIN_PATHWAYS.map((item, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 glass-card rounded-[40px] border-white/5 hover:bg-white/[0.04] hover:border-brand-primary/20 transition-all group"
            >
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10 text-center md:text-left">
                <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-xl font-bold border border-brand-primary/20 shrink-0">
                  {item.number}
                </div>
                <div>
                  <h4 className="text-2xl font-bold tracking-tight mb-2 group-hover:text-brand-primary transition-colors">
                    {item.type}
                  </h4>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <span className="text-white/40 font-medium">For:</span>
                    <span className="text-white/80 font-bold">{item.for}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 md:mt-0 flex flex-col items-center md:items-end gap-4">
                <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  {item.badge}
                </span>
                <p className="text-white/30 text-sm font-medium max-w-xs text-center md:text-right leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust tags */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {TRUST_TAGS.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary/5 border border-brand-primary/10 text-[10px] font-bold uppercase tracking-widest text-brand-primary/60"
            >
              <CheckCircle2 size={12} /> {tag}
            </div>
          ))}
        </div>

        {/* Clean strategic gateway text link */}
        <div className="flex justify-center">
          <Link
            to="/collaborate"
            className="group flex items-center gap-3 text-xl md:text-2xl font-bold text-white hover:text-brand-primary transition-all duration-350 tracking-tight"
          >
            Enter the Collaboration Gateway <ArrowRight className="group-hover:translate-x-2 transition-transform text-brand-primary" size={24} />
          </Link>
        </div>

      </div>
    </Section>
  );
};

export default HomeCollaborateSection;
