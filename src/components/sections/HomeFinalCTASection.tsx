import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { ArrowRight, Terminal, BookOpen, Users, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VARIANTS } from '../../lib/motion-presets';

interface CTACardProps {
  tagline: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  buttonText: string;
  to: string;
  onClick?: (e: React.MouseEvent) => void;
  delay?: number;
}

const CTACard: React.FC<CTACardProps> = ({
  tagline,
  icon: Icon,
  title,
  description,
  buttonText,
  to,
  onClick,
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

  const isExternal = to.startsWith('http') || to.startsWith('mailto');

  const cardContent = (
    <div className="flex flex-col h-full relative z-10 select-none text-left">
      {/* Header tagline and Icon */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
        <span className="font-mono text-[9px] font-bold text-brand-primary uppercase tracking-widest select-none">
          {tagline}
        </span>
        <div className="text-white/40 group-hover:text-brand-primary transition-colors duration-300">
          <Icon size={18} />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-3xl font-extrabold text-white mb-2 tracking-tight group-hover:text-brand-primary transition-colors duration-300">
        {title}
      </h3>

      {/* Description */}
      <p className="text-white/40 text-sm leading-relaxed mb-8 flex-grow font-medium group-hover:text-white/60 transition-colors duration-300">
        {description}
      </p>

      {/* Action Link */}
      <div className="flex items-center gap-2 text-xs font-extrabold tracking-widest text-brand-primary uppercase mt-auto">
        <span>{buttonText}</span>
        <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300 ease-out" />
      </div>
    </div>
  );

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
      <div className="ds-card ds-card-hover p-8 relative overflow-hidden group cursor-pointer h-full flex flex-col">
        {/* Dynamic Spotlight Glow */}
        <div
          className="pointer-events-none absolute w-[200px] h-[200px] bg-[radial-gradient(circle,_rgba(0,194,255,0.12)_0%,_rgba(0,0,0,0)_70%)] rounded-full transition-opacity duration-300 -translate-x-1/2 -translate-y-1/2 z-0"
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {isExternal ? (
          <a href={to} onClick={onClick} target="_blank" rel="noopener noreferrer" className="h-full block">
            {cardContent}
          </a>
        ) : (
          <Link to={to} onClick={onClick} className="h-full block">
            {cardContent}
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export const HomeFinalCTASection = () => {
  return (
    <Section id="contact" className="py-16 md:py-24 lg:py-32 border-t border-white/5 bg-[#050505] relative overflow-hidden">
      
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
            Your Entryway
          </motion.div>

          <motion.h2
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="ds-section-h2"
          >
            Choose your path. <span className="italic font-extrabold text-brand-primary">Where do you want to start?</span>
          </motion.h2>

          <motion.p
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="ds-section-body max-w-2xl text-white/50"
          >
            Ready to dive in? Select your entryway below to start learning from free guides, download active blueprints, or collaborate side-by-side with me.
          </motion.p>
        </div>

        {/* 3-Column Grid of detailed CTACards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-8">
          
          {/* Card 1: Learn */}
          <CTACard
            tagline="LEARNING_HUB"
            icon={BookOpen}
            title="Learn"
            description="Study real-world case studies, read technical blog logs, and explore tested workflows."
            buttonText="Start Learning"
            to="/blog"
            delay={0.15}
          />

          {/* Card 2: Build */}
          <CTACard
            tagline="BLUEPRINTS_AND_TEMPLATES"
            icon={Terminal}
            title="Build"
            description="Explore ready-to-run SaaS boilerplates, AI prompt packs, and technical SEO checklists."
            buttonText="Get Blueprints"
            to="/blueprints"
            delay={0.2}
          />

          {/* Card 3: Collaborate */}
          <CTACard
            tagline="WORK_TOGETHER"
            icon={Users}
            title="Collaborate"
            description="Partner with me to launch your product, automate processes, or build custom web systems."
            buttonText="Work With Me"
            to="/collaborate"
            delay={0.25}
          />

        </div>

        {/* Full-width bottom banner for follow the build */}
        <motion.div
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-6xl mx-auto rounded-[32px] overflow-hidden relative group border border-white/10 hover:border-brand-primary/40 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8),0_0_30px_rgba(0,194,255,0.1)] transition-all duration-300 ease-out shadow-2xl"
        >
          <a href="https://github.com/guchchi" target="_blank" rel="noopener noreferrer" className="block p-8 sm:p-12 bg-[#101010] relative z-10 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <span className="font-mono text-[9px] font-bold text-brand-primary uppercase tracking-[0.25em] block mb-1">
                  BUILD IN PUBLIC ON GITHUB
                </span>
                <h4 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  Follow the live source updates.
                </h4>
                <p className="text-white/40 text-sm mt-2 max-w-xl font-medium">
                  Watch code commits, browse template repositories, and see what I am building in real-time.
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 group-hover:bg-brand-primary group-hover:text-black group-hover:border-brand-primary transition-all duration-300 shrink-0">
                <Github size={24} />
              </div>
            </div>
          </a>
        </motion.div>

      </div>
    </Section>
  );
};

export default HomeFinalCTASection;
