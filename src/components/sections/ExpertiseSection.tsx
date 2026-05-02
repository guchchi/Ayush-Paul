import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code, Cpu, Palette, Sparkles, ArrowRight, Database, Wrench } from 'lucide-react';
import { Section } from '../ui/Section';
import { VARIANTS } from '../../lib/motion-presets';
import { cn } from '../../lib/utils';

const skillCategories = [
  {
    title: "Development",
    icon: <Code className="text-brand-primary" />,
    skills: ["React / Next.js", "Python", "Tailwind CSS", "TypeScript", "Node.js"],
    filter: "Web"
  },
  {
    title: "Robotics & Electronics",
    icon: <Cpu className="text-brand-secondary" />,
    skills: ["Arduino", "Raspberry Pi", "Circuit Design", "IoT", "Automation"],
    filter: "Robotics"
  },
  {
    title: "Design & Editing",
    icon: <Palette className="text-brand-accent" />,
    skills: ["Video Editing", "Branding", "UI/UX Design", "Motion Graphics", "Figma"],
    filter: "Design"
  },
  {
    title: "AI Tools",
    icon: <Sparkles className="text-brand-primary" />,
    skills: ["Prompt Engineering", "AI App Dev", "LLM Integration", "Automation", "Data Analysis"],
    filter: "AI"
  },
];

const skillsData = [
  { name: 'Prompt Engineering', category: 'AI & Automation', level: 90 },
  { name: 'LLM Integration', category: 'AI & Automation', level: 85 },
  { name: 'Agent Workflows', category: 'AI & Automation', level: 80 },
  { name: 'React / Next.js', category: 'Web Development', level: 95 },
  { name: 'TypeScript', category: 'Web Development', level: 90 },
  { name: 'Tailwind CSS', category: 'Web Development', level: 95 },
  { name: 'Node.js', category: 'Web Development', level: 85 },
  { name: 'Arduino', category: 'Robotics & Hardware', level: 85 },
  { name: 'Raspberry Pi', category: 'Robotics & Hardware', level: 80 },
  { name: 'Circuit Design', category: 'Robotics & Hardware', level: 75 },
  { name: 'Figma', category: 'Design & Editing', level: 85 },
  { name: 'Video Editing', category: 'Design & Editing', level: 80 },
  { name: 'UI/UX Design', category: 'Design & Editing', level: 90 },
  { name: 'Python', category: 'Programming Languages', level: 90 },
  { name: 'JavaScript', category: 'Programming Languages', level: 95 },
  { name: 'C++', category: 'Programming Languages', level: 70 },
  { name: 'Rust', category: 'Programming Languages', level: 60 },
  { name: 'Git & GitHub', category: 'Tools & Platforms', level: 95 },
  { name: 'Vercel', category: 'Tools & Platforms', level: 90 },
  { name: 'Firebase', category: 'Tools & Platforms', level: 85 },
  { name: 'Docker', category: 'Tools & Platforms', level: 75 },
];

const categories = [
  { id: 'All', icon: <Wrench size={12} /> },
  { id: 'AI & Automation', icon: <Sparkles size={12} /> },
  { id: 'Web Development', icon: <Code size={12} /> },
  { id: 'Robotics & Hardware', icon: <Cpu size={12} /> },
  { id: 'Design & Editing', icon: <Palette size={12} /> },
  { id: 'Programming Languages', icon: <Database size={12} /> },
  { id: 'Tools & Platforms', icon: <Wrench size={12} /> },
];

const TechnicalArsenal = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const filteredSkills = skillsData.filter(
    (skill) => activeCategory === 'All' || skill.category === activeCategory
  );

  return (
    <div className="mt-40">
      <div className="text-center mb-16">
        <motion.div
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-sm text-brand-primary"
        >
          Technical Arsenal
        </motion.div>
        
        <motion.h2 
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold mb-12 tracking-tight"
        >
          Tech <span className="text-brand-primary italic">Stack</span> Validator
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-2 mb-16 max-w-4xl mx-auto">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold transition-all duration-300 backdrop-blur-md border uppercase tracking-widest",
                activeCategory === cat.id 
                  ? "bg-brand-primary/20 border-brand-primary text-brand-primary shadow-[0_0_20px_rgba(0,194,255,0.3)]" 
                  : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
              )}
            >
              {cat.icon}
              {cat.id}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill) => (
            <motion.div
              key={skill.name}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="group relative p-4 sm:p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-primary/50 transition-all duration-500 flex flex-col items-center justify-center text-center min-h-[8rem] w-full"
            >
              <div className="relative z-10 w-full">
                <h3 className="font-bold text-[10px] sm:text-xs text-white/80 group-hover:text-white mb-1 break-words hyphens-auto uppercase tracking-tighter">{skill.name}</h3>
                <p className="text-[7px] sm:text-[8px] text-white/30 font-bold uppercase tracking-wider mb-2 break-words">{skill.category}</p>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-brand-primary" 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export const ExpertiseSection = ({ onFilterProjects }: { onFilterProjects: (category: string | null) => void }) => {
  return (
    <Section id="expertise" glowVariant="orbs">
      <div className="text-center mb-24">
        <motion.div 
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="inline-block px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-6"
        >
          Expertise
        </motion.div>
        <motion.h2 
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }} 
          className="mb-8 tracking-tighter"
        >
          Mastered <span className="text-brand-primary italic">Skills</span>
        </motion.h2>
        <motion.p 
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-white/40 max-w-2xl mx-auto text-xl font-medium text-center"
        >
          A diverse toolkit for the modern digital era. Focused on high-level architecture and hardware integration.
        </motion.p>
      </div>

      <motion.div 
        variants={VARIANTS.staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {skillCategories.map((category, i) => (
          <motion.div
            key={i}
            variants={VARIANTS.fadeUp}
            whileHover={VARIANTS.lift.whileHover}
            whileTap={{ scale: 0.98 }}
            onClick={() => onFilterProjects(category.filter)}
            className="glass-card p-12 rounded-[48px] border border-white/5 hover:border-brand-primary/30 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="text-brand-primary" size={24} />
            </div>
            
            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-brand-primary/10 transition-all duration-500">
              {category.icon}
            </div>
            <h3 className="mb-6 group-hover:text-brand-primary transition-colors text-2xl font-bold tracking-tight">{category.title}</h3>
            <ul className="space-y-4">
              {category.skills.map((skill, j) => (
                <li key={j} className="flex items-center text-white/40 text-sm font-bold group-hover:text-white/80 transition-colors uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/40 mr-4 group-hover:scale-150 group-hover:bg-brand-primary transition-all duration-300" />
                  {skill}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>

      <TechnicalArsenal />
    </Section>
  );
};
