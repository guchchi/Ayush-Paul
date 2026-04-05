import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code, Cpu, Palette, Sparkles, Database, Wrench } from 'lucide-react';
import { cn } from '../lib/utils';

// Structured data array
const skillsData = [
  // AI & Automation
  { name: 'Prompt Engineering', category: 'AI & Automation', level: 90 },
  { name: 'LLM Integration', category: 'AI & Automation', level: 85 },
  { name: 'Agent Workflows', category: 'AI & Automation', level: 80 },
  // Web Development
  { name: 'React / Next.js', category: 'Web Development', level: 95 },
  { name: 'TypeScript', category: 'Web Development', level: 90 },
  { name: 'Tailwind CSS', category: 'Web Development', level: 95 },
  { name: 'Node.js', category: 'Web Development', level: 85 },
  // Robotics & Hardware
  { name: 'Arduino', category: 'Robotics & Hardware', level: 85 },
  { name: 'Raspberry Pi', category: 'Robotics & Hardware', level: 80 },
  { name: 'Circuit Design', category: 'Robotics & Hardware', level: 75 },
  // Design & Editing
  { name: 'Figma', category: 'Design & Editing', level: 85 },
  { name: 'Video Editing', category: 'Design & Editing', level: 80 },
  { name: 'UI/UX Design', category: 'Design & Editing', level: 90 },
  // Programming Languages
  { name: 'Python', category: 'Programming Languages', level: 90 },
  { name: 'JavaScript', category: 'Programming Languages', level: 95 },
  { name: 'C++', category: 'Programming Languages', level: 70 },
  { name: 'Rust', category: 'Programming Languages', level: 60 },
  // Tools & Platforms
  { name: 'Git & GitHub', category: 'Tools & Platforms', level: 95 },
  { name: 'Vercel', category: 'Tools & Platforms', level: 90 },
  { name: 'Firebase', category: 'Tools & Platforms', level: 85 },
  { name: 'Docker', category: 'Tools & Platforms', level: 75 },
];

const categories = [
  { id: 'All', icon: <Wrench size={16} /> },
  { id: 'AI & Automation', icon: <Sparkles size={16} /> },
  { id: 'Web Development', icon: <Code size={16} /> },
  { id: 'Robotics & Hardware', icon: <Cpu size={16} /> },
  { id: 'Design & Editing', icon: <Palette size={16} /> },
  { id: 'Programming Languages', icon: <Database size={16} /> },
  { id: 'Tools & Platforms', icon: <Wrench size={16} /> },
];

export const PremiumSkills = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredSkills = skillsData.filter(
    (skill) => activeCategory === 'All' || skill.category === activeCategory
  );

  return (
    <section id="skills" className="py-32 relative overflow-hidden bg-[#0A0A0A]">
      {/* Decorative background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-brand-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-sm text-brand-primary shadow-xl shadow-black/20"
          >
            Technical Arsenal
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-display font-extrabold mb-8 tracking-tight"
          >
            Capabilities & <span className="text-brand-primary neon-glow-blue italic">Expertise</span>
          </motion.h2>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-16 max-w-4xl mx-auto">
            {categories.map((cat, i) => {
              const isActive = activeCategory === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold transition-all duration-300 backdrop-blur-md border",
                    isActive 
                      ? "bg-brand-primary/20 border-brand-primary text-brand-primary shadow-[0_0_20px_rgba(0,194,255,0.3)]" 
                      : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white hover:border-white/20"
                  )}
                >
                  {cat.icon}
                  {cat.id}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Skills Grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
                className="group relative p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-primary/50 transition-all duration-500 overflow-hidden flex flex-col items-center justify-center text-center h-40 cursor-default shrink-0 shadow-lg"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/0 to-brand-secondary/0 group-hover:from-brand-primary/10 group-hover:to-brand-secondary/10 transition-colors duration-500" />
                
                {/* Float Animation Wrapper */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ 
                    duration: 3 + Math.random() * 2, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: Math.random() * 2
                  }}
                  className="relative z-10 w-full"
                >
                  <h3 className="font-bold text-white/80 group-hover:text-white mb-2 transition-colors">{skill.name}</h3>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider mb-4">{skill.category}</p>
                  
                  {/* Skill level bar indicator */}
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <motion.div 
                      className="h-full bg-brand-primary shadow-[0_0_10px_rgba(0,194,255,0.8)]" 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
