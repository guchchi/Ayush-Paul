import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VARIANTS } from '../../lib/motion-presets';

// Where the ecosystem is heading — not personal time management
const FOCUS_ITEMS = [
  {
    label: 'Building',
    title: 'Competitive Robotics Platform',
    desc: 'Developing the next-generation autonomous robot system for WRO — modular, replicable, and fully open-sourced for student teams to study and adapt.',
  },
  {
    label: 'Developing',
    title: 'Student Learning Kits',
    desc: 'Designing modular hardware + curriculum kits that let students build real embedded systems — lowering the barrier from "I want to build" to "I built it."',
  },
  {
    label: 'Researching',
    title: 'AI-Assisted Engineering Workflows',
    desc: 'Exploring how LLMs and semantic tooling can help student builders debug hardware faster, write firmware more confidently, and ship prototypes in days, not months.',
  },
  {
    label: 'Expanding',
    title: 'Collaboration & Sponsorship Network',
    desc: 'Opening the ecosystem to partners — companies who want student-builder exposure, educators who want to co-create curriculum, and founders who want to co-build.',
  },
];

export const HomeCurrentFocusSection = () => {
  return (
    <Section id="current-focus" className="py-32 border-t border-white/5 bg-[#0A0A0A]/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex justify-between items-end mb-20">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-6">
              Where We're Headed
            </h2>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Ecosystem <span className="text-brand-primary">Direction.</span>
            </h3>
          </div>
          <Link
            to="/now"
            className="hidden md:flex items-center gap-2 text-white/40 hover:text-brand-primary font-bold tracking-widest uppercase text-xs transition-colors"
          >
            Live Snapshot <ArrowRight size={16} />
          </Link>
        </div>

        {/* 4-item grid — same ExpertiseGrid pattern from CollaboratePage */}
        <div className="grid md:grid-cols-2 gap-8">
          {FOCUS_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 glass-card rounded-[32px] border-white/5 group hover:border-brand-primary/20 transition-all duration-500"
            >
              <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-primary mb-6">
                {item.label}
              </div>
              <h4 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight group-hover:text-brand-primary transition-colors duration-500">
                {item.title}
              </h4>
              <p className="text-white/40 font-medium leading-relaxed text-lg">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </Section>
  );
};

export default HomeCurrentFocusSection;
