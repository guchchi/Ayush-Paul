import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { cn } from '../lib/utils';

export const ProfileSelectionPage = ({ onSelect }: { onSelect: (profile: string) => void }) => {
  useSEO({ title: "Choose Profile | Ayush Paul", noindex: true });
  const profiles = [
    { name: "Recruiter", color: "bg-cyan-500", image: "https://picsum.photos/seed/recruiter/200/200" },
    { name: "Developer", color: "bg-gray-500", image: "https://picsum.photos/seed/developer/200/200" },
    { name: "Stalker", color: "bg-red-500", image: "https://picsum.photos/seed/stalker/200/200" },
    { name: "Adventurer", color: "bg-purple-500", image: "https://picsum.photos/seed/adventurer/200/200" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] relative overflow-hidden px-6 py-20">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-brand-primary/10 to-transparent pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <span className="sr-only">Ayush Paul</span>
        <div className="h-px w-12 bg-brand-primary/30 mx-auto" />
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-3xl md:text-6xl font-display font-medium text-white mb-12 md:mb-16 tracking-tight text-center"
      >
        Who's Watching?
      </motion.h1>

      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-12 relative z-10 max-w-5xl">
        {profiles.map((profile, i) => (
          <motion.button
            key={profile.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.2 }}
            whileHover={{ y: -10 }}
            onClick={() => onSelect(profile.name)}
            className="group flex flex-col items-center"
          >
            <div className={cn(
              "w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 rounded-xl overflow-hidden mb-3 md:mb-6 border-[3px] border-transparent group-hover:border-white group-hover:scale-105 transition-all duration-500 shadow-2xl shadow-black/50",
              profile.color
            )}>
              <img 
                src={profile.image} 
                alt={`${profile.name} profile`} 
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-sm md:text-xl font-medium text-white/50 group-hover:text-white transition-all duration-300">
              {profile.name}
            </span>
          </motion.button>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={() => onSelect("back")}
        className="mt-12 md:mt-24 px-8 md:px-10 py-3 border border-white/10 text-white/30 hover:text-white hover:border-white hover:bg-white/5 transition-all uppercase tracking-[0.2em] text-[10px] font-bold rounded-lg flex items-center gap-2"
      >
        <ArrowLeft size={14} />
        Back to Home
      </motion.button>
    </div>
  );
};
