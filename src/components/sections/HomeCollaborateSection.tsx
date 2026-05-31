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
    type: 'Sponsor an Initiative',
    for: 'Companies & Organizations',
    desc: 'Fund competition entries, lab equipment, or student innovation programs. Gain visibility, brand association, and direct impact in the student builder community.',
    badge: 'High Impact',
    number: '01',
  },
  {
    type: 'Co-build a Product',
    for: 'Founders & Engineers',
    desc: 'Partner on robotics hardware, software platforms, or educational tools. I bring prototype speed, full-stack capability, and student distribution.',
    badge: 'Partnership / Equity',
    number: '02',
  },
  {
    type: 'Mentor or Teach',
    for: 'Educators & Experts',
    desc: 'Contribute knowledge to the Chronicles, run workshops, or guide the next phase of ecosystem growth. Mentorship multiplies impact at scale.',
    badge: 'Open Engagement',
    number: '03',
  },
  {
    type: 'Join as a Builder',
    for: 'Student Founders',
    desc: 'Access open-source builds, learning frameworks, and community resources. Contribute back. The ecosystem grows when builders build together.',
    badge: 'Free to Join',
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
              Join the Ecosystem
            </h2>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter">
              How You <span className="text-brand-secondary">Get Involved.</span>
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

        {/* CTA — mirrors CollaboratePage Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <MagneticButton>
            <Link
              to="/collaborate"
              className="px-12 py-6 bg-white text-black rounded-[24px] font-bold text-xl flex items-center gap-3 group shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:scale-105 transition-transform"
            >
              👉 Start Collaboration <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </MagneticButton>

          <Link
            to="/collaborate"
            onClick={() => window.location.href = 'mailto:hello.ayushpaul.in?subject=Discovery%20Call%20Request'}
            className="px-12 py-6 glass-card border-white/10 text-white rounded-[24px] font-bold text-xl hover:bg-white/5 transition-all flex items-center gap-2 group"
          >
            Book Discovery Call <Zap size={20} className="text-brand-primary group-hover:animate-pulse" />
          </Link>
        </div>

      </div>
    </Section>
  );
};

export default HomeCollaborateSection;
