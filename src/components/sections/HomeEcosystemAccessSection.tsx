import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { ArrowRight, BookOpen, FileCode, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VARIANTS } from '../../lib/motion-presets';
import { Button } from '../ui/button';

interface PathwayCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  subTitle: string;
  description: string;
  bullets: string[];
  buttonText: string;
  to: string;
  isHighlighted?: boolean;
  delay?: number;
}

const PathwayCard: React.FC<PathwayCardProps> = ({
  icon: Icon,
  title,
  subTitle,
  description,
  bullets,
  buttonText,
  to,
  isHighlighted = false,
  delay = 0,
}) => {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [coords, setCoords] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variants={VARIANTS.fadeUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      transition={{ delay }}
      className="h-full"
    >
      <div
        className={`ds-card ds-card-hover flex flex-col h-full group relative overflow-hidden p-8 sm:p-10 ${
          isHighlighted ? 'border-brand-primary/30 shadow-[0_0_20px_rgba(0,194,255,0.15)]' : ''
        }`}
      >
        {/* Dynamic Glow Effect */}
        <div
          className="pointer-events-none absolute w-[200px] h-[200px] bg-[radial-gradient(circle,_rgba(59,_130,_246,_0.08)_0%,_rgba(0,0,0,0)_70%)] rounded-full transition-opacity duration-300 -translate-x-1/2 -translate-y-1/2 z-0"
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Corner radial background glow */}
        <div
          className={`absolute top-0 right-0 rounded-bl-full blur-3xl -z-10 transition-colors duration-500 ${
            isHighlighted ? 'w-40 h-40 bg-brand-primary/5 group-hover:bg-brand-primary/10' : 'w-32 h-32 bg-brand-primary/3 group-hover:bg-brand-primary/5'
          }`}
        />

        {isHighlighted && (
          <div className="absolute top-6 right-6 px-3.5 py-1 rounded bg-brand-primary/15 border border-brand-primary/35 z-10 select-none">
            <span className="font-mono text-[9px] font-bold text-brand-primary uppercase tracking-wider">
              RECOMMENDED
            </span>
          </div>
        )}

        <div className="mb-8 relative z-10">
          {/* Icon Container */}
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 border transition-all duration-300 ease-out ${
              isHighlighted
                ? 'bg-brand-primary/15 border-brand-primary/30 text-brand-primary group-hover:bg-brand-primary/25'
                : 'bg-white/5 border-white/10 text-brand-primary group-hover:bg-brand-primary/10 group-hover:border-brand-primary/30'
            }`}
          >
            <Icon size={20} />
          </div>

          <h3 className="text-3xl font-extrabold mb-2 text-white group-hover:text-brand-primary transition-colors duration-300 tracking-tight">{title}</h3>
          <div className="font-mono text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] mb-6">
            {subTitle}
          </div>

          <div className={`h-px w-full mb-6 ${isHighlighted ? 'bg-brand-primary/20' : 'bg-white/10'}`} />

          <p className="text-white/50 text-sm leading-relaxed mb-6 min-h-[60px] font-medium group-hover:text-white/60 transition-colors duration-300">
            {description}
          </p>
        </div>

        {/* Bullet List */}
        <ul className="space-y-4 mb-10 flex-grow relative z-10">
          {bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-white/70 font-medium group-hover:text-white/80 transition-colors duration-300">
              <div
                className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  isHighlighted ? 'bg-brand-primary shadow-[0_0_8px_rgba(0,194,255,0.6)]' : 'bg-brand-primary'
                }`}
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        {/* Action Button */}
        <div className="mt-auto relative z-10">
          <Button
            asChild
            variant={isHighlighted ? 'primary' : 'secondary'}
            className="w-full group/btn cursor-pointer"
          >
            <Link to={to}>
              {buttonText}
              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export const HomeEcosystemAccessSection = () => {
  return (
    <Section id="access" className="border-t border-white/5 bg-[#0A0A0A] relative overflow-hidden">
      
      {/* Atmospheric Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle,_rgba(0,194,255,0.03)_0%,_rgba(0,0,0,0)_70%)] rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(circle,_rgba(0,194,255,0.03)_0%,_rgba(0,0,0,0)_70%)] rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[20%] w-[30vw] h-[30vw] bg-[radial-gradient(circle,_rgba(0,194,255,0.02)_0%,_rgba(0,0,0,0)_70%)] rounded-full blur-[80px]" />
      </div>

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
            Choose Your Pathway
          </motion.div>

          <motion.h2
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="ds-section-h2"
          >
            Select Your <span className="italic font-extrabold text-brand-primary">Path.</span>
          </motion.h2>

          <motion.p
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="ds-section-body max-w-2xl text-white/50"
          >
            Select your entry path below to learn from my documented builds, download ready-to-run templates, or partner with me to launch a system.
          </motion.p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative items-stretch">
          
          {/* Connecting Flow Line (Desktop Only) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary/10 to-transparent -z-10 translate-y-[-50%]" />

          {/* Card 1: Learn */}
          <PathwayCard
            icon={BookOpen}
            title="Learn"
            subTitle="Guides & Resources"
            description="Read blog articles, case studies, detailed notes, experiments, and guides on AI, web development, and SEO."
            bullets={[
              "Free technical guides",
              "Real-world case studies",
              "Lessons from live experiments",
              "Step-by-step design walk-throughs"
            ]}
            buttonText="Start Learning"
            to="/blog"
            delay={0.15}
          />

          {/* Card 2: Build */}
          <PathwayCard
            icon={FileCode}
            title="Build"
            subTitle="Blueprints & Templates"
            description="Get immediate access to ready-to-use boilerplate templates, prompt packs, playbooks, and checklists."
            bullets={[
              "AI Website Launch Blueprints",
              "SaaS Starter Boilerplates",
              "SEO Foundation Checklists",
              "Make.com Automation Playbooks"
            ]}
            buttonText="Explore Blueprints"
            to="/systems"
            isHighlighted={true}
            delay={0.2}
          />

          {/* Card 3: Collaborate */}
          <PathwayCard
            icon={Users}
            title="Collaborate"
            subTitle="Launch & Implementation"
            description="Partner directly with me to launch your product, automate operational workflows, or build high-performance web systems."
            bullets={[
              "Product launch execution support",
              "Custom automation implementations",
              "Tailored web system design",
              "Direct 1-on-1 collaboration slots"
            ]}
            buttonText="Work With Me"
            to="/collaborate"
            delay={0.25}
          />

        </div>

      </div>
    </Section>
  );
};

export default HomeEcosystemAccessSection;
