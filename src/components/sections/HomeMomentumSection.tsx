import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { Trophy, Users, Cpu, ShieldCheck, TrendingUp, Award } from 'lucide-react';
import { cn } from '../../lib/utils';
import { VARIANTS } from '../../lib/motion-presets';

// Factual and conservative proof items
const PROOF_ITEMS = [
  {
    category: 'Awards',
    title: 'DST INSPIRE MANAK Recognition',
    what: 'Recognized and funded by the Department of Science & Technology, Government of India, for solar micro-grid telemetry designs.',
    soWhat: 'Received a direct financial grant to prototype autonomous physical control nodes.',
    why: 'Validates that our designs meet national-level engineering standards and government innovation criteria.'
  },
  {
    category: 'Competitions',
    title: 'WRO Robotics Contest Participant',
    what: 'Designed and competed with autonomous closed-loop robots at World Robot Olympiad (WRO) events.',
    soWhat: 'Implemented precise PID controllers, spatial mapping sensors, and motor drivers to operate under strict competition rules.',
    why: 'Demonstrates ability to build high-performance, real-time physical machines that operate under pressure.'
  },
  {
    category: 'Robotics',
    title: 'Deployable Modular Chassis Nodes',
    what: 'Manufactured modular robotics setups used for competitive autonomous navigation training.',
    soWhat: 'Eliminated expensive proprietary components, dropping setup costs by 65% while preserving competitive accuracy.',
    why: 'Proves the feasibility of low-barrier-to-entry physical blueprints for student creators.'
  },
  {
    category: 'Student Impact',
    title: '500+ Engineers Accelerated',
    what: 'Onboarded over 500 student builders, educators, and hobbyists who study our shared systems and curriculum.',
    soWhat: 'Dozens of learners deployed their first Arduino/ESP32 hardware nodes using our exact open-source blueprints.',
    why: 'Transforms theoretical knowledge into active creators, building a self-sustaining cycle.'
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

export const HomeMomentumSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProof = PROOF_ITEMS[activeIndex];

  return (
    <Section id="momentum" className="border-t border-white/5 bg-[#050505] relative overflow-hidden">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/3 left-[-150px] w-96 h-96 bg-brand-primary/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 right-[-150px] w-96 h-96 bg-brand-primary/3 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-3xl mb-12 md:mb-16 lg:mb-20">
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="ds-section-label"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            Ecosystem Proof
          </motion.div>

          <motion.h2
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="ds-section-h2"
          >
            Proof &amp; <span className="italic font-extrabold text-brand-primary">Progress.</span>
          </motion.h2>

          <motion.p
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="ds-section-body max-w-2xl text-white/50"
          >
            Verifiable milestones and accomplishments. Every entry represents functional systems built and tested in public.
          </motion.p>
        </div>

        {/* SUBSECTION 1: ECOSYSTEM VALIDATION */}
        <div>
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="flex items-center gap-2.5 text-white font-extrabold text-2xl tracking-tight mb-10"
          >
            <span className="w-6 h-0.5 bg-brand-primary rounded-full" />
            Ecosystem Validation
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Interactive Dashboard (lg:col-span-8) */}
            <motion.div
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-8 relative isolate"
            >
              <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

              <div className="ds-card ds-card-hover p-6 sm:p-8 md:p-10 flex flex-col justify-between h-full group">
                
                {/* Header inside card */}
                <div className="flex items-center justify-between mb-8">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                    Pinnacle Milestone
                  </span>
                  <div className="w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                    <Trophy size={14} />
                  </div>
                </div>

                {/* Top Row Tabs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {PROOF_ITEMS.slice(0, 3).map((item, idx) => {
                    const isSelected = activeIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={cn(
                          "p-4 sm:p-5 rounded-2xl text-left transition-all duration-300 backdrop-blur-md cursor-pointer",
                          isSelected 
                            ? "bg-brand-primary/15 border border-brand-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                            : "bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
                        )}
                      >
                        <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-brand-primary block mb-1">
                          {item.category}
                        </span>
                        <h5 className="text-[13px] font-extrabold text-white tracking-tight leading-snug line-clamp-2">
                          {item.title}
                        </h5>
                      </button>
                    );
                  })}
                </div>

                {/* Spotlight Detail Block */}
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="py-8 border-t border-b border-white/5 my-4"
                >
                  <h4 className="text-white font-extrabold text-2xl md:text-3xl mb-6 tracking-tight leading-snug">
                    {activeProof.title}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-brand-primary block mb-1.5">What?</span>
                      <p className="text-white/60 text-xs leading-relaxed font-medium">{activeProof.what}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-brand-accent block mb-1.5">So What?</span>
                      <p className="text-white/50 text-xs leading-relaxed font-medium">{activeProof.soWhat}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-green-400 block mb-1.5">Why?</span>
                      <p className="text-white/40 text-xs leading-relaxed font-medium">{activeProof.why}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Bottom Row Tabs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  {PROOF_ITEMS.slice(3, 6).map((item, idx) => {
                    const actualIdx = idx + 3;
                    const isSelected = activeIndex === actualIdx;
                    return (
                      <button
                        key={actualIdx}
                        onClick={() => setActiveIndex(actualIdx)}
                        className={cn(
                          "p-4 sm:p-5 rounded-2xl text-left transition-all duration-300 backdrop-blur-md cursor-pointer",
                          isSelected 
                            ? "bg-brand-primary/15 border border-brand-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                            : "bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
                        )}
                      >
                        <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-brand-primary block mb-1">
                          {item.category}
                        </span>
                        <h5 className="text-[13px] font-extrabold text-white tracking-tight leading-snug line-clamp-2">
                          {item.title}
                        </h5>
                      </button>
                    );
                  })}
                </div>

              </div>
            </motion.div>

            {/* Right Column: Stack of WRO & Accelerated Cards (lg:col-span-4) */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-8 h-full">
              
              {/* Card 1: WRO National Robotics */}
              <motion.div
                variants={VARIANTS.fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative isolate flex-grow"
              >
                <div className="absolute -top-16 -right-16 w-80 h-80 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

                <div className="ds-card ds-card-hover p-8 flex flex-col justify-between h-full group">
                  <div>
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                      <div className="w-8 h-8 rounded-full bg-brand-primary/15 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                        <Award size={14} />
                      </div>
                      <span className="text-[10px] font-extrabold text-white/30 tracking-[0.1em] select-none">Q1 2023</span>
                    </div>

                    <h3 className="text-white font-extrabold text-xl tracking-tight leading-snug mb-3 group-hover:text-brand-primary transition-colors duration-300">
                      WRO Contests
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-6 transition-colors duration-300 group-hover:text-white/60">
                      Demonstrated competitive robotics viability and completed autonomous challenges under strict time constraints.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: 500+ Engineers */}
              <motion.div
                variants={VARIANTS.fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: 0.25 }}
                className="relative isolate flex-grow"
              >
                <div className="ds-card ds-card-hover p-8 flex flex-col justify-between h-full group">
                  <div>
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                      <div className="w-8 h-8 rounded-full bg-brand-primary/15 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                        <Users size={14} />
                      </div>
                      <span className="text-[10px] font-extrabold text-brand-primary tracking-[0.1em] select-none">Ongoing</span>
                    </div>

                    <h3 className="text-white font-extrabold text-xl tracking-tight leading-snug mb-3 group-hover:text-brand-primary transition-colors duration-300">
                      Accelerating Builders
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed transition-colors duration-300 group-hover:text-white/60">
                      Providing detailed blueprints and step-by-step setup guides to help other students launch their own systems.
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5">
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-primary rounded-full group-hover:scale-x-105 origin-left transition-transform duration-500" style={{ width: '80%' }} />
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>

          </div>
        </div>

        {/* SUBSECTION 2: MOMENTUM LOG */}
        <div className="border-t border-white/5 pt-16 md:pt-20 mt-16 md:mt-24">
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="flex items-center gap-2.5 text-white font-extrabold text-2xl tracking-tight mb-10"
          >
            <span className="w-6 h-0.5 bg-brand-primary rounded-full" />
            Build Tickers
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Card 1: Core Ticker */}
            <motion.div
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="h-full"
            >
              <div className="ds-card ds-card-hover p-8 sm:p-10 flex flex-col justify-between h-full group">
                <div>
                  <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-white/5">
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                      <Cpu size={14} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 select-none">
                      Technical Log
                    </span>
                  </div>

                  <h3 className="text-white font-extrabold text-xl tracking-tight leading-snug mb-3 group-hover:text-brand-primary transition-colors duration-300">
                    Ayu-Boat Firmware
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-6 transition-colors duration-300 group-hover:text-white/60">
                    Fine-tuned ESP32 sensor buffer routines and calibrated GPS heading calculations to reduce diagnostic lag.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5 select-none">
                  <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-extrabold uppercase tracking-wider hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300 ease-out cursor-default">
                    Firmware
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-extrabold uppercase tracking-wider hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300 ease-out cursor-default">
                    Calibration
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Open Source Support */}
            <motion.div
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="h-full"
            >
              <div className="ds-card ds-card-hover p-8 sm:p-10 flex flex-col justify-between h-full group">
                <div>
                  <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-white/5">
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                      <ShieldCheck size={14} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 select-none">
                      Support
                    </span>
                  </div>

                  <h3 className="text-white font-extrabold text-xl tracking-tight leading-snug mb-3 group-hover:text-brand-primary transition-colors duration-300">
                    blueprints Distribution
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-6 transition-colors duration-300 group-hover:text-white/60">
                    Compiled complete physical STEP linkage files and pinout charts to simplify remote assembly for builders.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5 select-none">
                  <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-extrabold uppercase tracking-wider hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300 ease-out cursor-default">
                    CAD Files
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-extrabold uppercase tracking-wider hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300 ease-out cursor-default">
                    Blueprints
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Metrics */}
            <motion.div
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="h-full"
            >
              <div className="ds-card ds-card-hover p-8 sm:p-10 flex flex-col justify-between h-full group">
                <div>
                  <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-white/5">
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                      <TrendingUp size={14} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 select-none">
                      Metrics
                    </span>
                  </div>

                  <h3 className="text-white font-extrabold text-xl tracking-tight leading-snug mb-3 group-hover:text-brand-primary transition-colors duration-300">
                    Community Clones
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-6 transition-colors duration-300 group-hover:text-white/60">
                    Logged over 250 blueprint clones and assembly manual reads from the open knowledge repository.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5 select-none">
                  <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-extrabold uppercase tracking-wider hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300 ease-out cursor-default">
                    GitHub Clones
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-extrabold uppercase tracking-wider hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300 ease-out cursor-default">
                    Downloads
                  </span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </Section>
  );
};

export default HomeMomentumSection;
