import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { ArrowRight, ChevronRight, Layers, Zap, Trophy, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, collection, query, orderBy, limit, onSnapshot } from '../../firebase';
import { cn } from '../../lib/utils';
import { VARIANTS } from '../../lib/motion-presets';


// High-authority ecosystem validation metrics and accomplishments
const PROOF_ITEMS = [
  {
    category: 'Awards',
    title: 'National DST INSPIRE MANAK Award',
    what: 'Recognized and funded by the Department of Science & Technology, Government of India, for solar micro-grid telemetry designs.',
    soWhat: 'Received a direct financial innovation grant to prototype autonomous physical control nodes.',
    why: 'Validates that our ecosystem architectures meet national-level engineering standards and government innovation criteria.'
  },
  {
    category: 'Competitions',
    title: 'WRO National Robotics Contests',
    what: 'Designed and engineered autonomous closed-loop physical robots to compete at national-level World Robot Olympiad (WRO) events.',
    soWhat: 'Implemented precise PID controllers, spatial mapping sensors, and low-latency motor drivers to operate under strict competition time constraints.',
    why: 'Demonstrates our ability to build high-performance, real-time physical machines that operate reliably under pressure.'
  },
  {
    category: 'Robotics',
    title: 'Deployable Modular Chassis Nodes',
    what: 'Manufactured and shipped open-source modular robotics setups used for competitive autonomous navigation training.',
    soWhat: 'Eliminated expensive proprietary components, dropping setup costs by 65% while preserving competitive accuracy.',
    why: 'Proves the ecosystem provides highly viable, practical physical blueprints that lower barriers to entry for student engineers.'
  },
  {
    category: 'Student Impact',
    title: '500+ Engineers Accelerated',
    what: 'Onboarded over 500 student builders, educators, and hobbyists who actively study our shared systems and curriculum.',
    soWhat: 'Dozens of learners deployed their first Arduino/ESP32 hardware nodes using our exact open-source blueprints.',
    why: 'Moves the needle from vanity views to active creators, generating a self-sustaining cycle of new builders and systems.'
  },
  {
    category: 'Published Resources',
    title: 'High-Signal Technical Chronicles',
    what: 'Published comprehensive system build logs, PID motor control architectures, and web-telemetry documentation.',
    soWhat: 'Over 2,000 document reads and 250+ code clone operations executed directly from public repositories.',
    why: 'Establishes clear, verifiable authority by sharing complex engineering blueprints transparently in public.'
  },
  {
    category: 'Collaborations',
    title: 'Hardware & Tech Partnerships',
    what: 'Partnered with technology brands and hardware components manufacturers to secure developmental sponsorships.',
    soWhat: 'Acquired testing equipment, development boards, and telemetry chips for distribution to student cohorts.',
    why: 'Ensures the ecosystem remains bridged to industry-leading manufacturers, offering direct pipelines to real resources.'
  }
];

const updateIcons = {
  innovation: <Zap size={16} className="text-brand-primary" />,
  milestone: <Trophy size={16} className="text-yellow-400" />,
  system: <Activity size={16} className="text-emerald-400" />,
};

export const HomeMomentumSection = ({ updates = [] }: { updates?: any[] }) => {
  const activeUpdates = updates;

  return (
    <Section id="momentum" className="py-32 border-t border-white/5 bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header — mirrors MomentumBoard in CollaboratePage */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-8">
          <div className="max-w-3xl">
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" /> Building in Public
            </h2>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
              Ecosystem <span className="text-brand-primary italic">Proof & Progress.</span>
            </h3>
            <p className="text-white/40 font-medium text-lg leading-relaxed mb-6">
              Verifiable proof of concept. Every milestone represents functional systems built and tested in public.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 border-t border-white/5 pt-6 text-xs text-white/40">
              <div>
                <span className="font-bold text-white/70 block uppercase tracking-wider mb-1">Why It Exists</span>
                To maintain radical, build-in-public transparency for all ecosystem projects, milestones, and failures.
              </div>
              <div>
                <span className="font-bold text-white/70 block uppercase tracking-wider mb-1">Who It Serves</span>
                Collaborators, partners, and observers who want to track raw progress and real velocity.
              </div>
              <div>
                <span className="font-bold text-white/70 block uppercase tracking-wider mb-1">How to Participate</span>
                Explore our timeline, inspect recent shipped logs, or view our active engineering horizon.
              </div>
            </div>
          </div>
        </div>

        {/* Ecosystem Proof & Validation Grid */}
        <div className="mb-32">
          <h4 className="text-xs font-bold uppercase tracking-[0.4em] text-white/20 mb-12">
            Ecosystem Validation
          </h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROOF_ITEMS.map((proof, i) => (
              <motion.div
                key={i}
                variants={VARIANTS.fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-8 glass-card rounded-[32px] border border-white/5 hover:border-brand-primary/20 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Category badge */}
                  <span className="inline-block px-2.5 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[9px] font-bold uppercase tracking-wider mb-6">
                    {proof.category}
                  </span>
                  
                  {/* Title */}
                  <h4 className="text-xl font-bold tracking-tight text-white mb-6 group-hover:text-brand-primary transition-colors">
                    {proof.title}
                  </h4>

                  {/* Impact content */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div>
                      <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-brand-primary/80">WHAT?</span>
                      <p className="text-white/70 text-xs font-medium leading-relaxed mt-1">{proof.what}</p>
                    </div>
                    <div>
                      <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-brand-secondary">SO WHAT?</span>
                      <p className="text-white/50 text-xs font-medium leading-relaxed mt-1">{proof.soWhat}</p>
                    </div>
                    <div>
                      <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-green-400">WHY IT MATTERS?</span>
                      <p className="text-white/40 text-xs font-medium leading-relaxed mt-1">{proof.why}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Update Feed — mirrors MomentumBoard list style */}
        <div className="space-y-4">
          {activeUpdates.map((update, i) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group p-6 md:p-8 glass-card border-white/5 hover:border-brand-primary/20 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-[24px]"
            >
              <div className="flex items-start md:items-center gap-6 flex-1">
                <div className="hidden md:block w-24 text-[10px] font-bold uppercase tracking-widest text-white/20 shrink-0">
                  {update.date}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded border',
                      update.statusTag === 'Shipped' ? 'text-green-400 border-green-500/20 bg-green-500/5' :
                      update.statusTag === 'Building' ? 'text-brand-primary border-brand-primary/20 bg-brand-primary/5' :
                      update.statusTag === 'Fix' ? 'text-red-400 border-red-500/20 bg-red-500/5' :
                      'text-white/30 border-white/10 bg-white/5'
                    )}>
                      {update.statusTag || 'Update'}
                    </span>
                    <h4 className="text-xl font-bold tracking-tight text-white/90">{update.title}</h4>
                  </div>
                  <p className="text-sm text-white/40 font-medium line-clamp-1">{update.text}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <div className="md:hidden text-[10px] font-bold uppercase tracking-widest text-white/20">
                  {update.date}
                </div>
                {update.relatedProject && (
                  <div className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                    <Layers size={12} /> {update.relatedProject}
                  </div>
                )}
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all">
                  <ChevronRight size={16} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/momentum"
            className="inline-flex items-center gap-2 text-white/40 hover:text-brand-primary font-bold tracking-widest uppercase text-xs transition-colors"
          >
            View Full Momentum Log <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </Section>
  );
};

export default HomeMomentumSection;
