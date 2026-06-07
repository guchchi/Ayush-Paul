import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { Lock } from 'lucide-react';
import FlowingMenu from '../ui/FlowingMenu';

const GATEWAY_ITEMS = [
  {
    link: "/about",
    text: "About the Founder",
    image: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?q=80&w=600&auto=format&fit=crop"
  },
  {
    link: "/blueprints",
    text: "Blueprints Library",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop"
  },
  {
    link: "/blog",
    text: "Technical Writing",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop"
  },
  {
    link: "/momentum",
    text: "Dynamic Timeline",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop"
  },
  {
    link: "/collaborate",
    text: "Sponsor & Collaborate",
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=600&auto=format&fit=crop"
  },
  {
    link: "/vault",
    text: "Decrypted Sandbox",
    image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=600&auto=format&fit=crop"
  }
];

export const EcosystemExploreSection = () => {
  return (
    <Section 
      id="explore-ecosystem" 
      glowVariant="bottom" 
      className="py-24 border-t border-white/[0.05] bg-[#070709] relative overflow-hidden"
      containerClassName="!max-w-none !px-0" // Enable edge-to-edge Flowing Menu
    >
      {/* Visual cybernetic mesh background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.006)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.006)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50 z-0" />
      
      {/* Header Container (Constrained width) */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 mb-16">
        
        {/* Section Header */}
        <div className="section-header text-center max-w-3xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="badge shadow-[0_0_20px_rgba(0,194,255,0.08)] bg-white/[0.01] border border-white/[0.06] text-[10px] font-bold uppercase tracking-widest text-[#00C2FF] flex items-center gap-1.5 px-4 py-2 rounded-full mb-6"
          >
            <Lock size={14} className="text-[#00C2FF]" /> UNIFIED PORTAL GATEWAY
          </motion.div>
          <h2 className="text-4xl sm:text-5xl lg:text-6.5xl font-black tracking-tight text-white leading-[1.08] uppercase">
            Explore the <span className="text-[#00C2FF] font-normal italic font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: '0 0 35px rgba(0, 194, 255, 0.2)' }}>Ecosystem.</span>
          </h2>
          <p className="text-white/40 text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto mt-6">
            The homepage serves as an active control center, not a final stop. Hover links to reveal schematics, and click to bridge pathways to core ecosystem nodes.
          </p>
        </div>
      </div>

      {/* Full-width Flowing Menu */}
      <div className="relative z-10 w-full border-t border-b border-white/[0.06]">
        <FlowingMenu 
          items={GATEWAY_ITEMS} 
          speed={18}
          textColor="rgba(255, 255, 255, 0.75)"
          marqueeBgColor="#00C2FF"
          marqueeTextColor="#0A0A0B"
        />
      </div>

    </Section>
  );
};

export default EcosystemExploreSection;
