import React from 'react';
import { motion } from 'motion/react';
import { HeroSection } from '../components/sections/HeroSection';
import { SystemsEcosystemSection } from '../components/sections/SystemsEcosystemSection';
import { AuthoritySection } from '../components/sections/AuthoritySection';
import { ExperimentsRDSection } from '../components/sections/ExperimentsRDSection';
import { ResearchPublicationsSection } from '../components/sections/ResearchPublicationsSection';
import { UpdatesSection } from '../components/sections/UpdatesSection';
import { EcosystemEvolutionSection } from '../components/sections/EcosystemEvolutionSection';
import { FinalCTASection } from '../components/sections/FinalCTASection';
import { useSEO } from '../hooks/useSEO';
import { getCanonicalUrl } from '../lib/domain';

export const HomePage = () => {
  useSEO({
    title: "Antigravity | Ecosystem of Intelligent Systems & Cybernetic R&D",
    description: "Explore flagship digital systems, cyber-physical blueprints, deep-tech research, and autonomous workflows engineered by Antigravity.",
    keywords: "Antigravity, Ayush Paul, Systems Ecosystem, Cybernetics, Robotics Blueprints, Autonomous Agents, Edge AI",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Antigravity Systems",
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
      className="relative w-full"
    >
      {/* 1. HERO SECTION */}
      <HeroSection />
      
      {/* 2. FEATURED OPERATIONAL SYSTEMS */}
      <SystemsEcosystemSection />

      {/* 3. SYSTEMS INTELLIGENCE LAYER */}
      <AuthoritySection />
      
      {/* 4. ACTIVE EXPERIMENTS */}
      <ExperimentsRDSection />
      
      {/* 5. RESEARCH PUBLICATIONS */}
      <ResearchPublicationsSection />

      {/* 6. ENGINEERING LOGS */}
      <UpdatesSection />
      
      {/* 7. ECOSYSTEM MILESTONES */}
      <EcosystemEvolutionSection />

      {/* 8. FINAL CTA */}
      <FinalCTASection />
    </motion.div>
  );
};
