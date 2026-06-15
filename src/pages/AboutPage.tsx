import React from 'react';
import { useSEO } from '../hooks/useSEO';
import { getCanonicalUrl } from '../lib/domain';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Cpu, 
  Code,
  Sparkles,
  TrendingUp,
  Settings
} from 'lucide-react';
import { Section } from '../components/ui/Section';
import { MagneticButton } from '../components/ui/MagneticButton';
import { VARIANTS } from '../lib/motion-presets';

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[60vh] flex flex-col justify-center items-center overflow-hidden pt-44 pb-20 isolate">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(0,88,190,0.04),transparent_70%)] -z-10" />
      
      <div className="w-full max-w-5xl mx-auto px-6 text-center">
        <motion.div
          variants={VARIANTS.staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center"
        >
          <motion.div variants={VARIANTS.fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#0058be] shadow-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-[#0058be] animate-pulse" />
            <span className="tracking-[0.2em]">About Me / Vision</span>
          </motion.div>

          <motion.h1 variants={VARIANTS.fadeUp} className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter leading-[1.05] text-[#0b1c30] mb-8 max-w-4xl">
            Building Digital <br className="hidden md:block" />
            <span className="text-[#0058be]">
              Systems for Builders.
            </span>
          </motion.h1>

          <motion.p variants={VARIANTS.fadeUp} className="text-lg md:text-xl text-[#424754] font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            I design and document high-performance web templates, automated workflows, and AI prompts that speed up your build time.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

const FounderSection = () => {
  return (
    <Section id="founder" className="py-20 border-t border-[#c2c6d6]/20 bg-bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-white p-8 md:p-16 rounded-[32px] border border-[#c2c6d6]/30 shadow-sm flex flex-col md:flex-row gap-10 md:gap-16 items-center"
        >
          <div 
            className="w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-[32px] overflow-hidden bg-gray-50 border border-[#c2c6d6]/30 relative shadow-inner"
          >
            <div className="w-full h-full relative flex items-center justify-center text-gray-300">
              <img 
                src="/founder.png?v=2" 
                alt="Ayush Paul" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>';
                }}
              />
            </div>
          </div>
          
          <div className="flex-1 space-y-6 text-left">
            <h3 className="text-3xl font-extrabold tracking-tighter text-[#0b1c30]">Hi, I'm Ayush Paul.</h3>
            <p className="text-base text-[#424754] leading-relaxed font-semibold">
              I am a developer and builder based in India. I spend my time writing code, configuring automations, and experimenting with AI-powered development flows. 
            </p>
            <p className="text-base text-[#424754]/80 leading-relaxed font-medium">
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
    { icon: <Code />, title: "Full-Stack Development", desc: "Building high-performance React and Next.js applications styled with modern CSS." },
    { icon: <Cpu />, title: "AI-Powered Workflows", desc: "Designing custom prompt libraries and Cursor rules configurations to speed up code generation." },
    { icon: <Settings />, title: "Automated Workflows", desc: "Setting up background webhook listeners and database synchronizations with Make.com and APIs." },
    { icon: <TrendingUp />, title: "Technical SEO", desc: "Optimizing website structures, JSON-LD data schemas, and analytics tracking for search visibility." }
  ];

  return (
    <Section id="capabilities" className="py-24 border-t border-[#c2c6d6]/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-left mb-16 max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#424754] bg-[#eff4ff] px-4 py-1.5 rounded-full shadow-sm w-fit block mb-4">
            CAPABILITIES
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-[#0b1c30]">Core Focus Areas</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((c, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white border border-[#c2c6d6]/30 rounded-[32px] hover:border-[#0058be]/20 hover:scale-[1.01] transition-all text-left shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-center text-[#0058be] mb-6">
                {c.icon}
              </div>
              <h3 className="text-lg font-extrabold mb-3 tracking-tight text-[#0b1c30]">{c.title}</h3>
              <p className="text-[#424754] text-xs font-semibold leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
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
    <Section className="py-24 border-t border-[#c2c6d6]/20 bg-bg-secondary/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-left mb-12">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#424754] bg-white border border-[#c2c6d6]/35 px-4 py-1.5 rounded-full shadow-sm w-fit block mb-4">
          TECHNOLOGY
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-[#0b1c30]">The Tech Stack</h2>
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
            className="px-6 py-3 rounded-full bg-white border border-[#c2c6d6]/30 text-[#424754] font-semibold text-xs tracking-wide hover:text-[#0b1c30] hover:border-[#0058be]/20 hover:scale-105 transition-all cursor-default shadow-sm"
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
    <Section className="py-24 border-t border-[#c2c6d6]/20">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0058be] bg-[#eff4ff] px-4 py-1.5 rounded-full shadow-sm w-fit block mx-auto mb-12">
          PRINCIPLES
        </span>
        <div className="space-y-6">
          {values.map((v, i) => (
            <motion.div
              key={i}
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-3xl md:text-5xl font-extrabold tracking-tighter text-[#0b1c30]/80 hover:text-[#0b1c30] transition-colors cursor-default"
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
    <Section className="py-32 text-center relative overflow-hidden border-t border-[#c2c6d6]/20 bg-bg-secondary/20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_center,rgba(0,88,190,0.04),transparent_70%)] -z-10" />
      <motion.div
        variants={VARIANTS.fadeUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="max-w-3xl mx-auto px-6 text-center"
      >
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-[#0b1c30] mb-8 leading-tight">
          Want to work together?
        </h2>
        <p className="text-base md:text-lg text-[#424754] max-w-xl mx-auto mb-12 font-medium">
          I partner with creators, startups, and founders to launch products, configure automations, and build web systems. Let's start the dialogue.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <MagneticButton>
            <a href="/collaborate" className="px-8 py-4 bg-[#0b1c30] text-white rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform block w-full sm:w-auto">
              Work With Me
            </a>
          </MagneticButton>
          <MagneticButton>
            <a href="/blueprints" className="px-8 py-4 bg-white border border-[#c2c6d6]/30 text-[#0b1c30] rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors block w-full sm:w-auto shadow-sm">
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
    title: "About Ayush Paul | Developer, Architect & Systems Builder",
    description: "Building venture-scale digital products, AI automation systems, and implementation blueprints. Learn about the stack, principles, and engineering workflow.",
    keywords: "Ayush Paul, about Ayush Paul, systems builder, AI developer, full stack engineer, digital products, tech stack",
    url: getCanonicalUrl("/about"),
    image: "/og-image.png",
  });

  return (
    <div className="w-full bg-bg-primary text-text-primary overflow-x-hidden pt-[env(safe-area-inset-top,0px)]">
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
