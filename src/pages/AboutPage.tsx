import React from 'react';
import { useSEO } from '../hooks/useSEO';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Cpu, 
  Layers, 
  Code,
  Sparkles,
  TrendingUp,
  Settings,
  Users
} from 'lucide-react';
import { Section } from '../components/ui/Section';
import { MagneticButton } from '../components/ui/MagneticButton';
import { VARIANTS } from '../lib/motion-presets';

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[70vh] flex flex-col justify-center items-center overflow-hidden pt-44 pb-20 isolate">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(0,194,255,0.04),transparent_70%)] -z-10" />
      
      <div className="w-full max-w-5xl mx-auto px-6 text-center">
        <motion.div
          variants={VARIANTS.staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center"
        >
          <motion.div variants={VARIANTS.fadeUp} className="badge mb-8 shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <span className="tracking-[0.2em]">About Me / Vision</span>
          </motion.div>

          <motion.h1 variants={VARIANTS.fadeUp} className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter leading-[1.05] mb-8 max-w-4xl">
            Building Digital <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/30">
              Systems for Builders.
            </span>
          </motion.h1>

          <motion.p variants={VARIANTS.fadeUp} className="text-lg md:text-2xl text-white/50 font-medium max-w-2xl mx-auto mb-16 leading-relaxed">
            I design and document high-performance web templates, automated workflows, and AI prompts that speed up your build time.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

const FounderSection = () => {
  return (
    <Section id="founder" className="py-20 border-t border-white/5 bg-[#0A0A0A]/50">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="glass-card p-8 md:p-16 rounded-[40px] border-white/5 flex flex-col md:flex-row gap-10 md:gap-16 items-center"
        >
          <div 
            className="w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-[32px] overflow-hidden bg-white/5 border border-white/10 relative"
          >
            <div className="w-full h-full relative flex items-center justify-center text-white/10 bg-white/5">
              <img 
                src="/founder.png?v=2" 
                alt="Ayush Paul" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-white/20 bg-white/5"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>';
                }}
              />
            </div>
          </div>
          
          <div className="flex-1 space-y-6 text-left">
            <h3 className="text-3xl font-extrabold tracking-tighter">Hi, I'm Ayush Paul.</h3>
            <p className="text-base text-white/70 leading-relaxed font-medium">
              I am a 19-year-old developer and builder based in India. I spend my time writing code, configuring automations, and experimenting with AI-powered development flows. 
            </p>
            <p className="text-base text-white/50 leading-relaxed">
              I build in public. I believe in documenting what I build, sharing lessons from my projects, and packaging my workflows into checklists and templates so others can launch products faster.
            </p>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

const CoreCapabilities = () => {
  const capabilities = [
    { icon: <Code />, title: "Full-Stack Development", desc: "Building high-performance React and Next.js applications styled with Tailwind CSS." },
    { icon: <Cpu />, title: "AI-Powered Workflows", desc: "Designing custom prompt libraries and Cursor rules configurations to speed up code generation." },
    { icon: <Settings />, title: "Automated Workflows", desc: "Setting up background webhook listeners and database synchronizations with Make.com and APIs." },
    { icon: <TrendingUp />, title: "Technical SEO", desc: "Optimizing website structures, JSON-LD data schemas, and analytics tracking for search visibility." }
  ];

  return (
    <Section id="capabilities" className="py-24 border-t border-white/5">
      <div className="section-header max-w-2xl text-left mx-0 items-start mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Core Focus Areas</h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {capabilities.map((c, i) => (
          <motion.div
            key={i}
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 glass-card rounded-[24px] border-white/5 hover:bg-white/[0.02] transition-colors text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-primary mb-6">
              {c.icon}
            </div>
            <h3 className="text-lg font-bold mb-3 tracking-tight">{c.title}</h3>
            <p className="text-white/40 text-sm font-medium leading-relaxed">{c.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

const TechStackWall = () => {
  const stack = [
    "Next.js", "React", "TypeScript", "Node.js", "Python", 
    "Tailwind CSS", "Firebase", "Stripe API", "Make.com", 
    "Git / GitHub", "Vercel", "Supabase"
  ];

  return (
    <Section className="py-24 border-t border-white/5 bg-[#0A0A0A]/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-left mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">The Tech Stack</h2>
      </div>
      <div className="flex flex-wrap justify-start gap-4 max-w-5xl mx-auto px-6">
        {stack.map((tech, i) => (
          <motion.div
            key={i}
            variants={VARIANTS.scaleUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="px-6 py-3 rounded-full glass-card border-white/10 text-white/60 font-bold text-xs tracking-wide hover:text-white hover:border-white/30 transition-all cursor-default"
          >
            {tech}
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

const ValuesSection = () => {
  const values = [
    "Build Systems, Not Just Tasks.",
    "Clarity Before Cleverness.",
    "Tested In Production First.",
    "Share What Succeeds and Fails.",
    "Document Everything."
  ];

  return (
    <Section className="py-24 border-t border-white/5">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-brand-primary mb-12">Operating Principles</h2>
        <div className="space-y-4 md:space-y-6">
          {values.map((v, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-3xl md:text-5xl font-bold tracking-tighter text-white/80 hover:text-white transition-colors cursor-default"
            >
              {v}
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const CTASection = () => {
  return (
    <Section className="py-32 text-center relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_center,rgba(0,194,255,0.06),transparent_70%)] -z-10" />
      <motion.div
        variants={VARIANTS.fadeUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="max-w-3xl mx-auto px-6 text-center"
      >
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-8 leading-tight">
          Want to work together?
        </h2>
        <p className="text-lg text-white/50 max-w-xl mx-auto mb-12">
          I partner with creators, startups, and founders to launch products, configure automations, and build web systems. Let's start the dialogue.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <MagneticButton>
            <a href="/#contact" className="px-10 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform block w-full sm:w-auto">
              Work With Me
            </a>
          </MagneticButton>
          <MagneticButton>
            <a href="/systems" className="px-10 py-4 glass-card border-white/20 rounded-full font-bold text-lg hover:bg-white/10 transition-colors block w-full sm:w-auto">
              Get Blueprints
            </a>
          </MagneticButton>
        </div>
      </motion.div>
    </Section>
  );
};

export const AboutPage = () => {
  useSEO({
    title: "About Ayush Paul | Developer & Systems Builder",
    description: "Learn more about Ayush Paul's story, principles, tech stack, and digital systems architecture workflows.",
    keywords: "Ayush Paul, Ayush Paul Bio, Ayush Paul Experience, Web Developer India, AI Automation"
  });

  return (
    <div className="w-full bg-[#0A0A0A] overflow-x-hidden pt-[env(safe-area-inset-top,0px)]">
      <HeroSection />
      <FounderSection />
      <CoreCapabilities />
      <TechStackWall />
      <ValuesSection />
      <CTASection />
    </div>
  );
};

export default AboutPage;
