import React from 'react';
import { motion } from 'motion/react';
import { HeroSection } from '../components/sections/HeroSection';
import { EcosystemArchitectureSection } from '../components/sections/EcosystemArchitectureSection';
import { SystemsEcosystemSection } from '../components/sections/SystemsEcosystemSection';
import { FeaturedBlogsSection } from '../components/sections/FeaturedBlogsSection';
import { InnovationLabsSection } from '../components/sections/InnovationLabsSection';
import { CollaborationSection } from '../components/sections/CollaborationSection';
import { VisionFutureSection } from '../components/sections/VisionFutureSection';
import { SocialProofExperienceSection } from '../components/sections/SocialProofExperienceSection';
import { ContactCTASection } from '../components/sections/ContactCTASection';
import { useSEO } from '../hooks/useSEO';
import { getCanonicalUrl } from '../lib/domain';

export const HomePage = () => {
  useSEO({
    title: "Antigravity | Ecosystem of Intelligent Systems & Cybernetic R&D",
    description: "Explore flagship digital systems, cyber-physical blueprints, deep-tech research, and autonomous workflows engineered by Antigravity.",
    keywords: "Antigravity, Systems Ecosystem, Cybernetics, Robotics Blueprints, Autonomous Agents, Edge AI",
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
      className="relative w-full bg-[#0A0A0B]"
    >
      {/* 1. HERO SECTION */}
      <HeroSection />
      
      {/* 1.5. ECOSYSTEM ARCHITECTURE */}
      <EcosystemArchitectureSection />
      
      {/* Seamless blend: Hero → Ecosystem */}
      <div className="relative">
        {/* 2. ECOSYSTEM / SYSTEMS REGISTER */}
        <SystemsEcosystemSection />

        {/* Section blend divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        {/* 3. FEATURED TECHNICAL INSIGHTS (BENTO / SLIDER) */}
        <FeaturedBlogsSection />

        {/* Section blend divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        {/* 4. INNOVATION LABS (CARD BLUEPRINT DECK STACKS) */}
        <InnovationLabsSection />

        {/* Section blend divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        {/* 5. MODULAR COLLABORATION DECK */}
        <CollaborationSection />

        {/* Section blend divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        {/* 6. VISION & FUTURE SCAPE */}
        <VisionFutureSection />

        {/* Section blend divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        {/* 7. MILESTONES & SOCIAL PROOF CHRONOLOGY */}
        <SocialProofExperienceSection />

        {/* Section blend divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        {/* 8. FUTURISTIC CONTACT / CTA */}
        <ContactCTASection />
      </div>
    </motion.div>
  );
};
export default HomePage;

