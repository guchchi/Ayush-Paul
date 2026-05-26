import React from 'react';
import { motion } from 'motion/react';
import { Rocket, Briefcase, Coffee } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';

export const NowPage = () => {
  useSEO({
    title: "What Ayush Paul Is Building Now",
    description: "Ayush Paul's focus, current projects, and learning journey in AI and robotics.",
  });

  return (
    <div className="page-content bg-[#0A0A0A] pt-32 pb-20">
      <Container>
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-8"
          >
            Now
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-12 tracking-tighter"
          >
            What I'm doing <span className="text-brand-primary">now.</span>
          </motion.h1>
          
          <div className="space-y-16">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Rocket className="text-brand-primary" size={24} /> Current Focus
              </h2>
              <p className="text-white/60 text-xl leading-relaxed">
                I'm currently focused on building autonomous robotics systems integrated with large language models. My goal is to bridge the gap between digital intelligence and physical action.
              </p>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Briefcase className="text-brand-primary" size={24} /> Professional Work
              </h2>
              <ul className="space-y-4 text-white/60 text-lg">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-primary mt-2.5 shrink-0" />
                  Architecting custom AI solutions and systems for enterprise partners.
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-primary mt-2.5 shrink-0" />
                  Developing a robotics curriculum for student innovators.
                </li>
              </ul>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Coffee className="text-brand-primary" size={24} /> Personal Life
              </h2>
              <p className="text-white/60 text-xl leading-relaxed">
                When I'm not coding, I'm usually reading about space exploration, practicing photography, or experimenting with new coffee brewing techniques.
              </p>
            </motion.section>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-12 border-t border-white/10 text-white/20 text-sm italic"
            >
              Last updated: April 2024 from New Delhi, India.
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  );
};
