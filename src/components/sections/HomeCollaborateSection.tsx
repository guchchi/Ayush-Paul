import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { ArrowRight, BookOpen, Code, Handshake, Users, Download, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VARIANTS } from '../../lib/motion-presets';

interface PathwayCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  linkText: string;
  to: string;
  delay?: number;
}

const PathwayCard: React.FC<PathwayCardProps> = ({
  icon: Icon,
  title,
  description,
  linkText,
  to,
  delay = 0,
}) => {
  return (
    <motion.div
      variants={VARIANTS.fadeUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      transition={{ delay }}
      className="h-full"
    >
      <div className="bg-[#101010] border border-white/5 p-8 rounded-3xl group hover:border-brand-primary/30 transition-all duration-300 h-full flex flex-col justify-between text-left">
        <div>
          {/* Icon */}
          <div className="w-12 h-12 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mb-8 text-brand-primary group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all duration-300">
            <Icon size={20} />
          </div>

          {/* Title */}
          <h3 className="text-xl font-extrabold text-white mb-4 tracking-tight group-hover:text-brand-primary transition-colors duration-300">
            {title}
          </h3>

          {/* Description */}
          <p className="text-white/50 text-sm leading-relaxed mb-8 font-medium group-hover:text-white/75 transition-colors duration-300">
            {description}
          </p>
        </div>

        {/* Action Link */}
        <Link to={to} className="flex items-center gap-2 text-xs font-extrabold tracking-widest text-brand-primary group-hover:text-white transition-colors duration-300 uppercase">
          <span>{linkText}</span>
          <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
        </Link>
      </div>
    </motion.div>
  );
};

export default PathwayCard;

export const HomeCollaborateSection = () => {
  return (
    <Section id="collaborate" className="py-16 md:py-24 lg:py-32 border-t border-white/5 bg-[#0A0A0A] relative overflow-hidden">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[600px] bg-brand-primary/3 rounded-full blur-[160px] pointer-events-none -z-10" />

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
            Build Together
          </motion.div>

          <motion.h2
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="ds-section-h2"
          >
            Work With <span className="italic font-extrabold text-brand-primary">Ayush Paul.</span>
          </motion.h2>

          <motion.p
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="ds-section-body max-w-2xl text-white/50"
          >
            No complex scoping templates or corporate gateway portals. Choose an authentic path below to build, research, or collaborate.
          </motion.p>
        </div>

        {/* 3-Column Solid Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-20">
          
          {/* Card 1: Build */}
          <PathwayCard
            icon={Code}
            title="Build With Me"
            description="Fork my open-source code repositories, download physical STEP/STL models, and assemble your own machines."
            linkText="Get Blueprints"
            to="/systems"
            delay={0.15}
          />

          {/* Card 2: Research */}
          <PathwayCard
            icon={BookOpen}
            title="Research With Me"
            description="Partner on experimental hardware rigs, custom sensor deployments, or science exhibition prototyping projects."
            linkText="Contact Workspace"
            to="/collaborate"
            delay={0.2}
          />

          {/* Card 3: Collaborate */}
          <PathwayCard
            icon={Handshake}
            title="Collaborate With Me"
            description="Sponsor new physical systems R&D, commission dedicated custom robotics configurations, or book tech consulting."
            linkText="Start Partnership"
            to="/collaborate"
            delay={0.25}
          />

        </div>

        {/* ----------------- SUBTLE SOCIAL PROOF STRIP ----------------- */}
        <motion.div
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="border-t border-white/5 pt-12 mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
        >
          <div className="flex flex-col items-center justify-center p-4">
            <Users size={20} className="text-brand-primary mb-2" />
            <span className="font-mono text-lg font-bold text-white">500+</span>
            <span className="font-mono text-[9px] text-white/30 uppercase mt-1 tracking-wider">Student Builders Accelerated</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 border-t sm:border-t-0 sm:border-x border-white/5">
            <Download size={20} className="text-brand-accent mb-2" />
            <span className="font-mono text-lg font-bold text-white">100+</span>
            <span className="font-mono text-[9px] text-white/30 uppercase mt-1 tracking-wider">Blueprint Package Downloads</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
            <Trophy size={20} className="text-brand-primary mb-2" />
            <span className="font-mono text-lg font-bold text-white">National Level</span>
            <span className="font-mono text-[9px] text-white/30 uppercase mt-1 tracking-wider">DST Science Placements</span>
          </div>
        </motion.div>

      </div>
    </Section>
  );
};
