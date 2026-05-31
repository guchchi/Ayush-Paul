import React from 'react';
import { motion } from 'motion/react';
import { HeroSection } from '../components/sections/HeroSection';
import { HomeAboutSection } from '../components/sections/HomeAboutSection';
import { HomeActiveSystemsSection } from '../components/sections/HomeActiveSystemsSection';
import { HomeKnowledgeHubSection } from '../components/sections/HomeKnowledgeHubSection';
import { HomeMomentumSection } from '../components/sections/HomeMomentumSection';
import { HomeEcosystemAccessSection } from '../components/sections/HomeEcosystemAccessSection';
import { HomeCurrentFocusSection } from '../components/sections/HomeCurrentFocusSection';
import { HomeCollaborateSection } from '../components/sections/HomeCollaborateSection';
import { HomeFinalCTASection } from '../components/sections/HomeFinalCTASection';
import { useSEO } from '../hooks/useSEO';
import { getCanonicalUrl } from '../lib/domain';

export const HomePage = () => {
  useSEO({
    title: "Ayush Paul | Student Founder, Builder & Systems Creator",
    description: "The digital headquarters of Ayush Paul — a student founder building robotics, web platforms, and engineering education. Explore real projects, honest progress, and open knowledge.",
    keywords: "Ayush Paul, Student Founder, Robotics, Arduino, WRO Robots, Web Development, INSPIRE Award, Builder, Engineering Education",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Ayush Paul",
      "url": getCanonicalUrl(),
      "potentialAction": {
        "@type": "SearchAction",
        "target": getCanonicalUrl("/blog?q={search_term_string}"),
        "query-input": "required name=search_term_string"
      }
    }
  });

  // Smooth anchor navigation on mount
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full bg-[#0A0A0B]"
    >
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. FOUNDER SNAPSHOT */}
      <HomeAboutSection />

      {/* 3. ACTIVE SYSTEMS & INNOVATION */}
      <HomeActiveSystemsSection />

      {/* 4. KNOWLEDGE HUB */}
      <HomeKnowledgeHubSection />

      {/* 5. MOMENTUM & PROGRESS */}
      <HomeMomentumSection />

      {/* 6. ECOSYSTEM ACCESS */}
      <HomeEcosystemAccessSection />

      {/* 7. CURRENT FOCUS */}
      <HomeCurrentFocusSection />

      {/* 8. COLLABORATE */}
      <HomeCollaborateSection />

      {/* 9. FINAL CTA */}
      <HomeFinalCTASection />
    </motion.div>
  );
};

export default HomePage;


