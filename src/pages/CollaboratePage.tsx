import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSEO } from '../hooks/useSEO';
import { useAnalytics } from '../hooks/useAnalytics';
import { getCanonicalUrl } from '../lib/domain';

// Import modular sections
import { CollaborateHero } from '../components/sections/CollaborateHero';
import { CollaborateOpportunities } from '../components/sections/CollaborateOpportunities';
import { CollaborateWho } from '../components/sections/CollaborateWho';
import { CollaborateProcess } from '../components/sections/CollaborateProcess';
import { CollaborateProjects } from '../components/sections/CollaborateProjects';
import { CollaborateFAQ } from '../components/sections/CollaborateFAQ';
import { CollaborateFinalCTA } from '../components/sections/CollaborateFinalCTA';
import { CollaborationForm } from '../components/sections/CollaborationForm';

export const CollaboratePage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { trackEvent } = useAnalytics();

  useSEO({
    title: "Studio — Work With Ayush Paul | Collaboration & Development",
    description: "Direct collaboration, implementation support, technical mentorship, and project development with Ayush Paul. Build MVPs, systems, and production-grade solutions together.",
    keywords: "Ayush Paul, studio, collaboration, MVP development, technical mentorship, implementation support, systems architecture",
    url: getCanonicalUrl("/collaborate"),
    image: "/og-image.png",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Studio — Work With Ayush Paul",
      "description": "Direct collaboration, implementation support, and project development.",
      "url": getCanonicalUrl("/collaborate")
    }
  });

  const handleStartConversation = () => {
    trackEvent('CTA Clicked', { location: 'Studio Page', label: 'Start A Project' });
    setIsFormOpen(true);
  };

  const handleExploreWork = () => {
    trackEvent('CTA Clicked', { location: 'Studio Page', label: 'Work With Me' });
    const el = document.getElementById('capabilities-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-bg-primary pt-32 relative overflow-hidden text-text-primary"
    >
      {/* Background Soft Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,88,190,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,88,190,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-100 -z-10" />

      {/* 1. HERO SECTION */}
      <CollaborateHero 
        onStartClick={handleStartConversation}
        onExploreClick={handleExploreWork}
      />

      {/* 2. WHAT WE CAN BUILD TOGETHER (Opportunities) */}
      <CollaborateOpportunities />

      {/* 3. WHO THIS IS FOR */}
      <CollaborateWho />

      {/* 4. METHODOLOGY / HOW WE WORK */}
      <CollaborateProcess />

      {/* 5. CAPABILITIES / PROJECT TYPES */}
      <div id="capabilities-section">
        <CollaborateProjects />
      </div>

      {/* 6. FAQ SECTION */}
      <CollaborateFAQ />

      {/* 7. FINAL CTA */}
      <CollaborateFinalCTA 
        onStartClick={handleStartConversation}
      />

      <CollaborationForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </motion.div>
  );
};

export default CollaboratePage;
