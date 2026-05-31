import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { MagneticButton } from '../ui/MagneticButton';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VARIANTS, EASING } from '../../lib/motion-presets';

// The ecosystem pillars — what makes this bigger than one person
const ECOSYSTEM_PILLARS = [
  {
    number: '01',
    label: 'BUILDS',
    title: 'Flagship Initiatives.',
    desc: 'Robotics platforms, embedded systems, and software products built with real-world constraints — and open for the community to study, remix, and build upon.',
  },
  {
    number: '02',
    label: 'KNOWLEDGE',
    title: 'Open Knowledge.',
    desc: 'Everything documented — tutorials, build journals, engineering guides — so other students can shortcut years of trial and error.',
  },
  {
    number: '03',
    label: 'COMMUNITY',
    title: 'Collaboration Network.',
    desc: 'Founders, sponsors, educators, and builders joining together to fund, mentor, and scale student innovation across India and beyond.',
  },
  {
    number: '04',
    label: 'PLATFORM',
    title: 'Tools & Products.',
    desc: 'Software, learning kits, and frameworks designed to lower the barrier to building — so the next generation doesn\'t have to start from zero.',
  },
];

export const HomeAboutSection = () => {
  return (
    <>
      {/* ── SECTION A: THE ECOSYSTEM VISION ── */}
      <Section id="home-about" className="py-40 border-t border-white/5 bg-[#0A0A0A]/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Big vision statement */}
          <div className="max-w-5xl mb-32">
            <motion.div
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-12"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              The Ecosystem
            </motion.div>

            <motion.h2
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="text-[clamp(2.5rem,8vw,6rem)] font-extrabold tracking-tighter leading-[0.9] mb-12"
            >
              Not a portfolio.<br />
              <span className="text-brand-primary italic">A platform.</span>
            </motion.h2>

            <motion.p
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl text-white/40 font-medium leading-relaxed max-w-3xl"
            >
              This ecosystem exists to prove that student builders can create real products, open knowledge, 
              and lasting community — without waiting to graduate, get funded, or move to a startup hub.
            </motion.p>
          </div>

          {/* 4 pillars — mirrors PhilosophySection in CollaboratePage */}
          <div className="grid md:grid-cols-2 gap-x-20 gap-y-24">
            {ECOSYSTEM_PILLARS.map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: EASING.PREMIUM as any }}
                className="space-y-6 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary text-xs font-bold">
                    {pillar.number}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-primary">
                    {pillar.label}
                  </div>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tighter group-hover:text-brand-primary transition-colors duration-500">
                  {pillar.title}
                </h3>
                <p className="text-xl text-white/40 font-medium leading-relaxed max-w-md">
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </Section>

      {/* ── SECTION B: THE FOUNDER ── */}
      <Section id="home-founder" className="py-32 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <div className="mb-20">
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-6">
              The Founder
            </h2>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Who's Building <span className="text-brand-primary">This.</span>
            </h3>
          </div>

          {/* Founder card — mirrors FounderSection in AboutPage */}
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            className="glass-card p-8 md:p-20 rounded-[40px] md:rounded-[64px] border-white/5 flex flex-col md:flex-row gap-10 md:gap-16 items-center"
          >
            <div className="w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-[32px] md:rounded-[48px] overflow-hidden bg-white/5 border border-white/10 relative">
              <img
                src="/founder.png?v=2"
                alt="Ayush Paul — Founder"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/40 to-transparent" />
            </div>

            <div className="flex-1 space-y-8 text-center md:text-left">
              <div>
                <h3 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tighter">Ayush Paul</h3>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <p className="text-brand-primary text-xs font-bold uppercase tracking-[0.3em]">
                    Student Founder • Builder • Educator
                  </p>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/10 hidden sm:block" />
                  <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-[0.4em] bg-brand-secondary/10 px-3 py-1 rounded-full border border-brand-secondary/20">
                    Building in Public
                  </span>
                </div>
              </div>

              <p className="text-xl text-white/50 leading-relaxed font-medium max-w-2xl">
                I started this ecosystem to do what most students are told to wait for: ship real products, 
                open-source the knowledge, and build community around it. Robotics, embedded systems, software, 
                and education — all under one roof, all in public.
              </p>

              <div className="flex flex-wrap gap-4">
                <MagneticButton>
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-bold text-base hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.1)] group"
                  >
                    Full Story <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </MagneticButton>
                <Link
                  to="/collaborate"
                  className="inline-flex items-center gap-3 px-10 py-5 glass-card border-white/10 rounded-full font-bold text-base hover:bg-white/5 transition-all text-white group"
                >
                  Work Together <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </Section>
    </>
  );
};

export default HomeAboutSection;
