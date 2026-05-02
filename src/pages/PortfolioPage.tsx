import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AuthoritySection } from '../components/sections/AuthoritySection';
import { ExpertiseSection } from '../components/sections/ExpertiseSection';
import { ExperienceSection } from '../components/sections/ExperienceSection';
import { ClientsSection } from '../components/sections/ClientsSection';
import { useSEO } from '../hooks/useSEO';

export const PortfolioPage = () => {
  useSEO({
    title: "Portfolio | Ayush Paul",
    keywords: "Ayush Paul Portfolio, AI Development, Robotics Projects, Web Development"
  });

  const [projectFilter, setProjectFilter] = useState<string | null>(null);

  const handleFilterProjects = (category: string | null) => {
    setProjectFilter(category);
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full pt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="badge mb-6"
        >
          Deep Dive
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
        >
          My Work & <span className="text-brand-primary">Journey</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white/50 max-w-2xl mx-auto"
        >
          A comprehensive look at my technical expertise, learning journey, and the architecture behind the systems I build.
        </motion.p>
      </div>

      <AuthoritySection />
      
      <ExpertiseSection onFilterProjects={handleFilterProjects} />
      
      <ExperienceSection />

      <ClientsSection />
    </motion.div>
  );
};
