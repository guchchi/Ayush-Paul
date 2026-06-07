import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useSEO } from '../hooks/useSEO';
import { getCanonicalUrl } from '../lib/domain';

// Import modular sections
import { CollaborateHero } from '../components/sections/CollaborateHero';
import { CollaborateOpportunities } from '../components/sections/CollaborateOpportunities';
import { CollaborateWho } from '../components/sections/CollaborateWho';
import { CollaborateProcess } from '../components/sections/CollaborateProcess';
import { CollaborateProjects } from '../components/sections/CollaborateProjects';
import { CollaborateFAQ } from '../components/sections/CollaborateFAQ';
import { CollaborateFinalCTA } from '../components/sections/CollaborateFinalCTA';

// Simple centralized analytics tracking console helper
const trackEvent = (eventName: string, payload?: Record<string, any>) => {
  console.log(`[Analytics Event] ${eventName}`, payload);
  // Ready to connect to Google Analytics/Mixpanel later
};

export const CollaboratePage = () => {
  useSEO({
    title: "Work Together | AyushPaul.in",
    description: "Partner with Ayush to build better systems, digital products, and workflows designed for execution and scale.",
    keywords: "Ayush Paul, Collaboration, Build, MVP, Systems, Strategy",
    url: getCanonicalUrl("/collaborate"),
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Collaborate with Ayush Paul",
      "description": "Work together to turn plans into execution.",
      "url": getCanonicalUrl("/collaborate")
    }
  });

  const handleStartConversation = () => {
    trackEvent('CTA Clicked', { location: 'Collaborate Page', label: 'Start A Conversation' });
    window.location.href = "mailto:hello@ayushpaul.in?subject=Collaboration%20Inquiry";
  };

  const handleExploreWork = () => {
    trackEvent('CTA Clicked', { location: 'Collaborate Page', label: 'Explore Previous Work' });
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

    </motion.div>
  );
};

export default CollaboratePage;
