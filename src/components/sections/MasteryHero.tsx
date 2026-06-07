import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  BookOpen, 
  Video, 
  Users, 
  Compass, 
  Lock,
  ArrowUpRight,
  Network
} from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';

interface MasteryHeroProps {
  onExploreClick: () => void;
  onCoursesClick: () => void;
}

const ecosystemGroups = [
  {
    label: 'Learn',
    icon: BookOpen,
    color: '#0b1c30',
    bg: '#f5f5f5',
    border: '#e8e8e8',
    items: [
      { id: 'courses', label: 'Courses', icon: BookOpen },
      { id: 'workshops', label: 'Workshops', icon: Video },
      { id: '1-on-1', label: '1-on-1 Learning', icon: Users },
    ]
  },
  {
    label: 'Build',
    icon: Compass,
    color: '#0b1c30',
    bg: '#f5f5f5',
    border: '#e8e8e8',
    items: [
      { id: 'blueprints', label: 'Blueprints', icon: Compass },
      { id: 'systems', label: 'Systems', icon: Network },
    ]
  },
  {
    label: 'Store',
    icon: Lock,
    color: '#0b1c30',
    bg: '#f5f5f5',
    border: '#e8e8e8',
    items: [
      { id: 'vault', label: 'Vault', icon: Lock },
    ]
  }
];

export const MasteryHero = ({ onExploreClick, onCoursesClick }: MasteryHeroProps) => {
  return (
    <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 px-6 overflow-hidden bg-bg-primary text-text-primary">
      {/* Background Soft Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,88,190,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(0,88,190,0.012)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ── LEFT: Typography + CTAs ── */}
          <div className="flex flex-col lg:col-span-6 text-center lg:text-left">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-8 mx-auto lg:mx-0"
            >
              <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full animate-pulse" />
              <span className="tracking-[0.22em]">Ecosystem</span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl lg:text-[5rem] font-extrabold tracking-tighter leading-[1.05] text-[#0b1c30] mb-6"
            >
              Learn Skills. Build Systems.<br />
              <span className="text-[#0b1c30]"><span className="text-[#d1f34d]">Ship</span> Faster.</span>
            </motion.h1>

            {/* Audience line */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm md:text-base text-[#424754] font-semibold mb-6 tracking-wide"
            >
              For builders who want to turn knowledge into real projects, products, and opportunities.
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base md:text-lg text-[#424754] font-medium max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed whitespace-pre-line"
            >
              {"Mastery is a skill acquisition ecosystem for builders.\n\nLearn practical skills across AI, robotics, design, development, and digital products through self-paced courses, live workshops, and private 1-on-1 sessions.\n\nEverything you build stays inside your Vault forever."}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 mb-12"
            >
              <MagneticButton>
                <button
                  onClick={onExploreClick}
                  className="px-8 py-4 bg-[#0b1c30] text-white rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 group hover:scale-105 transition-transform w-full sm:w-auto shadow-sm cursor-pointer border-none"
                >
                  Explore Skills
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#d1f34d]" />
                </button>
              </MagneticButton>

              <MagneticButton>
                <button
                  onClick={onCoursesClick}
                  className="px-8 py-4 bg-white border border-[#c2c6d6]/30 text-[#0b1c30] rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm cursor-pointer"
                >
                  View Courses
                  <ArrowUpRight size={14} className="text-[#d1f34d]" />
                </button>
              </MagneticButton>
            </motion.div>

            {/* Stats / Trust Banner */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center lg:justify-start gap-8 pt-8 border-t border-[#c2c6d6]/20"
            >
              <div className="flex flex-col text-left">
                <span className="text-2xl font-extrabold text-[#0b1c30] tracking-tight leading-none mb-1">
                  12+
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/60">
                  Skills Across Domains
                </span>
              </div>

              <div className="flex flex-col text-left">
                <span className="text-2xl font-extrabold text-[#0b1c30] tracking-tight leading-none mb-1">
                  3
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/60">
                  Learning Modalities
                </span>
              </div>

              <div className="flex flex-col text-left">
                <span className="text-2xl font-extrabold text-[#0b1c30] tracking-tight leading-none mb-1">
                  1
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/60">
                  Connected Ecosystem
                </span>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: Ecosystem Map Tree ── */}
          <div className="lg:col-span-6 relative w-full">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-start gap-6 lg:gap-4 relative z-10">

              {/* Root Trunk */}
              <div className="flex lg:w-[140px] shrink-0 items-center justify-center lg:pt-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="px-6 py-5 bg-[#0b1c30] text-white border-2 border-[#d1f34d]/20 rounded-2xl shadow-2xl flex flex-col items-center gap-2 text-center relative z-10 group hover:border-[#d1f34d]/60 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d1f34d]/20 to-[#d1f34d]/5 border border-[#d1f34d]/30 flex items-center justify-center text-[#d1f34d] shadow-lg shadow-[#d1f34d]/10">
                    <Network size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold tracking-tight text-white">Mastery</h3>
                  </div>
                </motion.div>
              </div>

              {/* Grouped Nodes */}
              <div className="flex-1 flex flex-col gap-4">
                {ecosystemGroups.map((group, gIdx) => {
                  const GroupIcon = group.icon;
                  return (
                    <motion.div
                      key={group.label}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: gIdx * 0.1 }}
                      className="bg-white border border-[#c2c6d6]/25 rounded-2xl shadow-sm overflow-hidden"
                    >
                      {/* Group Header */}
                      <div
                        className="flex items-center gap-2 px-4 py-2.5 border-b"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${group.color} 8%, white)`,
                          borderColor: `color-mix(in srgb, ${group.color} 15%, #c2c6d6)`
                        }}
                      >
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: group.bg, color: group.color }}
                        >
                          <GroupIcon size={12} />
                        </div>
                        <span
                          className="text-[10px] font-extrabold uppercase tracking-wider"
                          style={{ color: group.color }}
                        >
                          {group.label}
                        </span>
                      </div>

                      {/* Group Items */}
                      <div className="p-3 space-y-2">
                        {group.items.map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <div
                              key={item.id}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white border border-[#c2c6d6]/15 hover:border-[#d1f34d]/30 hover:bg-[#fafbff] transition-all duration-200 cursor-default"
                            >
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: group.bg, color: group.color }}
                              >
                                <ItemIcon size={13} />
                              </div>
                              <span className="text-xs font-bold text-[#0b1c30]">{item.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};
