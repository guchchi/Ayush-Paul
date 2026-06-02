import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { VARIANTS } from '../../lib/motion-presets';
import { Pin, HelpCircle, Code, FastForward, Settings } from 'lucide-react';

export const HomeAboutSection = () => {
  const currentFocus = [
    { text: 'Custom AI Workflows', desc: 'Cursor rules configs and LLM prompt context injection files.' },
    { text: 'Next.js App Boilerplates', desc: 'High-performance React configurations built for speed.' },
    { text: 'Automation Playbooks', desc: 'Connecting webhooks, sync handlers, and background tasks.' },
    { text: 'SEO Foundation Guides', desc: 'Technical checklists tested in production on live domains.' }
  ];

  const principles = [
    {
      icon: HelpCircle,
      title: "Clarity Before Cleverness",
      desc: "No jargon or corporate talk. Write clean, understandable text and blueprints that work out of the box."
    },
    {
      icon: Settings,
      title: "Systems Over Tasks",
      desc: "Stop doing repetitive manual tasks. Build automated workflows and reusable codebase boilerplates."
    },
    {
      icon: Code,
      title: "Action Over Theory",
      desc: "Don't just write theoretical guides. Compile the exact Cursor rule configs, playbooks, and files."
    },
    {
      icon: FastForward,
      title: "Radical Transparency",
      desc: "Share the stats. Share what succeeded, what failed, and the lessons learned along the way."
    }
  ];

  return (
    <Section id="about" className="border-t border-white/5 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="ds-section-label"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            About Me
          </motion.div>

          <motion.h2
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="ds-section-h2"
          >
            Hi, I'm <span className="italic font-extrabold text-brand-primary">Ayush Paul.</span>
          </motion.h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-16">
          
          {/* Left Column: Personal Narrative */}
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-7 space-y-6 text-white/70 text-sm sm:text-base leading-relaxed text-left"
          >
            <p className="font-semibold text-white/90 text-lg">
              "I am a 19-year-old developer and builder based in India. I spend my time building products, testing automations, and writing code in public."
            </p>
            <p>
              I don't run an agency, and I don't sell generic PDF ebooks. I started this platform because I was tired of reading theoretical guides that didn't provide actual execution files. 
            </p>
            <p>
              Everything on this site is a blueprint, checklist, or template that I actively use in my own projects. I document what I learn, share what works, and post the logs of what fails so you can move from idea to execution quickly.
            </p>
          </motion.div>

          {/* Right Column: Current Focus Block */}
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-5 bg-[#101010] border border-white/[0.08] p-8 rounded-[2rem] relative overflow-hidden"
          >
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-brand-primary/5 rounded-full blur-[80px] pointer-events-none -z-10" />
            
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-brand-primary mb-6 flex items-center gap-2">
              <Pin size={12} className="text-brand-accent animate-pulse" />
              What I'm Building Today
            </h3>

            <ul className="space-y-4 text-left">
              {currentFocus.map((focus, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white uppercase font-mono tracking-wider block">{focus.text}</span>
                    <span className="text-xs text-white/50">{focus.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>

        {/* Operating Philosophy Principles */}
        <div className="space-y-6 border-t border-white/5 pt-16">
          <div className="flex items-center gap-2.5 text-white font-extrabold text-xl tracking-tight mb-8">
            <span className="w-6 h-0.5 bg-brand-primary rounded-full" />
            My Building Principles
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((principle, idx) => {
              const PrinIcon = principle.icon;
              return (
                <motion.div
                  key={idx}
                  variants={VARIANTS.fadeUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-[#101010] border border-white/[0.08] rounded-2xl p-6 flex flex-col justify-between min-h-[200px] group hover:border-brand-primary/30 transition-colors text-left"
                >
                  <div className="flex items-center justify-between text-white/30 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary/10 transition-colors">
                      <PrinIcon size={16} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider mb-2">{principle.title}</h4>
                    <p className="text-[11px] text-white/40 leading-relaxed font-medium">{principle.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </Section>
  );
};

export default HomeAboutSection;
