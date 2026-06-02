import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VARIANTS } from '../../lib/motion-presets';
import { Button } from '../ui/button';

// High-converting active opportunities matrix
const FOCUS_ITEMS = [
  {
    label: 'Student Cohort',
    title: 'Robotics Co-Development Sprint',
    gains: [
      'Learn robotics deployment workflows',
      'Work directly with active spatial hardware'
    ],
    builds: [
      'Closed-loop control firmware modules',
      'Modular physical chassis subsystems'
    ],
    commitment: '4-week sprint • Intermediate',
    availability: '12/15 Seats Filled',
    link: '/collaborate',
    linkText: 'Join Sprint',
    badgeColor: 'text-brand-secondary border-brand-secondary/20 bg-brand-secondary/5'
  },
  {
    label: 'Open Contributor Roles',
    title: 'ESP32 Physical Telemetry Bridge',
    gains: [
      'Master embedded firmware pipelines',
      'Implement real-time WebSocket feeds'
    ],
    builds: [
      'Low-latency ESP32 control logic',
      'Physical-to-web telemetry bridge'
    ],
    commitment: '6-week sprint • Advanced',
    availability: '2/3 Roles Remaining',
    link: '/collaborate',
    linkText: 'Apply as Contributor',
    badgeColor: 'text-brand-primary border-brand-primary/20 bg-brand-primary/5'
  },
  {
    label: 'Active Research Nodes',
    title: 'AI-Native Arduino CAD Agents',
    gains: [
      'Audit hardware schematics with LLMs',
      'Write modular firmware validators'
    ],
    builds: [
      'Neural circuit checking models',
      'Automated code generation checkers'
    ],
    commitment: '8-week sprint • Advanced',
    availability: 'Research Node Active',
    link: '/collaborate',
    linkText: 'Collaborate on Research',
    badgeColor: 'text-white/40 border-white/10 bg-white/5'
  },
  {
    label: 'Prototype Funding',
    title: 'Ecosystem Prototyping Grants',
    gains: [
      'Deploy hardware telemetry clusters',
      'Receive full physical computing kits'
    ],
    builds: [
      'Custom physical sensor networks',
      'Active hardware prototyping nodes'
    ],
    commitment: 'Ongoing • Beginner Friendly',
    availability: 'Grant Round Active',
    link: '/collaborate',
    linkText: 'Apply for Grant',
    badgeColor: 'text-green-400 border-green-500/20 bg-green-500/5'
  }
];

export const HomeCurrentFocusSection = () => {
  return (
    <Section id="focus" className="py-16 md:py-24 lg:py-32 border-t border-white/5 bg-[#0A0A0A]/50">
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
            Active Workspace
          </motion.div>

          <motion.h2
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="ds-section-h2"
          >
            Active Opportunities <span className="italic font-extrabold bg-gradient-to-r from-[#00F5FF] via-[#00D5FF] to-[#3B82F6] bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(0,245,255,0.45)]">&amp; Sprints.</span>
          </motion.h2>

          <motion.p
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="ds-section-body max-w-2xl"
          >
            Where the ecosystem is investing its energy right now. Jump into active hardware-software sprints or co-develop live nodes. Explore our{' '}
            <Link to="/now" className="text-[#00E5FF] hover:underline font-bold inline-flex items-center gap-1">
              Live Snapshot <ArrowRight size={12} className="inline" />
            </Link>
            .
          </motion.p>
        </div>

        {/* High-Converting 4-item grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {FOCUS_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="h-full"
            >
              <div className="ds-card ds-card-hover p-8 sm:p-10 flex flex-col justify-between h-full group">
                <div className="space-y-8">
                  {/* Badge Indicator Line */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-white/30 group-hover:text-[#00E5FF] transition-colors duration-300 select-none">
                      {item.label}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full border text-[9px] font-mono font-bold uppercase tracking-wider ${item.badgeColor} shrink-0 select-none`}>
                      {item.availability}
                    </span>
                  </div>

                  {/* Opportunity Title */}
                  <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white group-hover:text-[#00E5FF] transition-colors duration-300">
                    {item.title}
                  </h3>

                  {/* Structured Opportunity Goals */}
                  <div className="grid sm:grid-cols-2 gap-6 border-t border-white/5 pt-6">
                    {/* Gain */}
                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2.5 select-none">What You Gain</div>
                      <ul className="space-y-2">
                        {item.gains.map((gain, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-white/90 font-semibold leading-relaxed group-hover:text-white transition-colors duration-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/60 shrink-0 mt-1.5" />
                            <span>{gain}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Build */}
                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2.5 select-none">What You'll Build</div>
                      <ul className="space-y-2">
                        {item.builds.map((build, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-white/40 font-medium leading-relaxed group-hover:text-white/50 transition-colors duration-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/30 shrink-0 mt-1.5" />
                            <span>{build}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Commitment Block */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs select-none">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/20 mb-1">Commitment</span>
                      <span className="text-white/60 font-semibold">{item.commitment}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Micro CTA */}
                <div className="mt-8 pt-6 border-t border-white/5">
                  <Button asChild variant="secondary" size="sm" className="w-full group/btn">
                    <Link to={item.link}>
                      {item.linkText}
                      <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform duration-300 ease-out" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </Section>
  );
};

export default HomeCurrentFocusSection;
