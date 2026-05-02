import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HeroSection } from '../components/sections/HeroSection';
import { ClientsSection } from '../components/sections/ClientsSection';
import { AuthoritySection } from '../components/sections/AuthoritySection';
import { FeaturedProjectsSection } from '../components/sections/FeaturedProjectsSection';
import { ExpertiseSection } from '../components/sections/ExpertiseSection';
import { ExperienceSection } from '../components/sections/ExperienceSection';
import { VisionSection } from '../components/sections/VisionSection';
import { UpdatesSection } from '../components/sections/UpdatesSection';
import { LatestBlogsSection } from '../components/sections/LatestBlogsSection';
import { CTASection } from '../components/sections/CTASection';
import { ContactSection } from '../components/sections/ContactSection';
import { useSEO } from '../hooks/useSEO';

export const HomePage = ({ onViewPortfolio }: { onViewPortfolio: () => void }) => {
  useSEO({
    title: "Ayush Paul | AI Developer & Digital Builder",
    keywords: "Ayush Paul, AI Developer India, Robotics Developer, Hire Ayush Paul"
  });

  // Autonomous Hash Navigation on mount
  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.substring(1);
      // Small delay to allow layout to settle and images/components to hydrate
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

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
      className="relative w-full"
    >
      <HeroSection onViewPortfolio={onViewPortfolio} />
      
      <ClientsSection />
      
      <AuthoritySection />
      
      <FeaturedProjectsSection filter={projectFilter} />
      
      <ExpertiseSection onFilterProjects={handleFilterProjects} />
      
      <ExperienceSection />

      <UpdatesSection />

      <LatestBlogsSection />

      <VisionSection />
      
      <CTASection id="home-cta" />
      
      <ContactSection />
    </motion.div>
  );
};

