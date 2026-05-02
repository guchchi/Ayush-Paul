import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HeroSection } from '../components/sections/HeroSection';
import { TrustRecognitionSection } from '../components/sections/TrustRecognitionSection';
import { WhatWeBuildSection } from '../components/sections/WhatWeBuildSection';
import { ContentEngineSection } from '../components/sections/ContentEngineSection';
import { FeaturedProjectsSection } from '../components/sections/FeaturedProjectsSection';
import { VisionSection } from '../components/sections/VisionSection';
import { CTASection } from '../components/sections/CTASection';
import { ContactSection } from '../components/sections/ContactSection';
import { useSEO } from '../hooks/useSEO';

export const HomePage = ({ onViewPortfolio }: { onViewPortfolio: () => void }) => {
  useSEO({
    title: "Ayush Paul | Building Technology & Knowledge Systems",
    keywords: "Ayush Paul, AI Education, Creator Tools, Knowledge Systems"
  });

  // Autonomous Hash Navigation on mount
  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.substring(1);
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full"
    >
      <HeroSection onViewPortfolio={onViewPortfolio} />
      
      <TrustRecognitionSection />

      <WhatWeBuildSection />

      <ContentEngineSection />
      
      <FeaturedProjectsSection filter={projectFilter} />
      
      <VisionSection />
      
      <CTASection id="home-cta" />

      <ContactSection />
    </motion.div>
  );
};
