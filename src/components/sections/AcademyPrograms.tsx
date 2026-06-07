import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, ShieldCheck, PlayCircle, Clock, BookOpen as BookIcon } from 'lucide-react';

interface Program {
  id: string;
  title: string;
  category: string;
  description: string;
  difficulty?: string;
  duration?: string;
  lessonsCount?: number;
  instructor?: string;
  thumbnail?: string;
}

interface AcademyProgramsProps {
  courses: Program[];
  userEnrollments: Record<string, boolean>;
  onEnroll: (courseId: string) => void;
  onNavigateToCourse: (courseId: string) => void;
  loading: boolean;
  activePath?: string;
}

const DEMO_PROGRAMS: Program[] = [
  {
    id: 'demo-ai-builders',
    title: 'AI For Builders',
    category: 'AI',
    description: 'Design and deploy custom AI workflows, LLM research scripts, prompt packages, and automation processes to scale your building velocity.',
    difficulty: 'Intermediate',
    duration: '4–6 hrs',
    lessonsCount: 12,
    instructor: 'Ayush Paul',
  },
  {
    id: 'demo-web-foundations',
    title: 'Website Development Foundations',
    category: 'Websites',
    description: 'Master React, TypeScript, and Next.js. Compile state-of-the-art landing pages, custom dashboards, dynamic databases, and Stripe checkouts.',
    difficulty: 'Beginner',
    duration: '6–8 hrs',
    lessonsCount: 18,
    instructor: 'Ayush Paul',
  },
  {
    id: 'demo-seo-systems',
    title: 'SEO Systems & Authority',
    category: 'SEO',
    description: 'Understand crawler requirements, page indexes, schemas, site load-speeds, and structures designed for long-term organic authority.',
    difficulty: 'Intermediate',
    duration: '3–5 hrs',
    lessonsCount: 9,
    instructor: 'Ayush Paul',
  },
  {
    id: 'demo-automation-essentials',
    title: 'Automation Essentials',
    category: 'Automation',
    description: 'Establish automated webhooks, database syncs, notification triggers, and API integrations using Make scenario playbooks.',
    difficulty: 'Intermediate',
    duration: '4–5 hrs',
    lessonsCount: 10,
    instructor: 'Ayush Paul',
  },
];

const getCategoryStyles = (cat: string) => {
  const c = (cat || '').toLowerCase();
  if (c.includes('ai')) return { border: '#ebe5ff', bg: '#f3efff', text: '#6b35ff' };
  if (c.includes('web') || c.includes('site')) return { border: '#dce9ff', bg: '#eff4ff', text: '#0058be' };
  if (c.includes('seo')) return { border: '#ffe9d6', bg: '#fff4eb', text: '#ff8000' };
  return { border: '#e1f7d2', bg: '#f0fbe8', text: '#558b2f' }; // Automation / default
};

export const AcademyPrograms = ({
  courses,
  userEnrollments,
  onEnroll,
  onNavigateToCourse,
  loading,
  activePath,
}: AcademyProgramsProps) => {
  const activeProgramsList = courses.length > 0 ? courses : DEMO_PROGRAMS;

  // Filter based on selected pathway if activePath is set
  const filteredPrograms = activeProgramsList.filter((p) => {
    if (!activePath || activePath === 'all') return true;
    const cat = p.category.toLowerCase();
    const active = activePath.toLowerCase();
    if (active === 'ai') return cat.includes('ai');
    if (active === 'websites') return cat.includes('web') || cat.includes('site');
    if (active === 'seo') return cat.includes('seo');
    if (active === 'automation') return cat.includes('auto');
    return true;
  });

  return (
    <section
      className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20"
      id="academy-programs-section"
    >
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end mb-14 text-left">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-6"
          >
            <span className="w-1.5 h-1.5 bg-[#0058be] rounded-full animate-pulse" />
            <span className="tracking-[0.22em]">Programs</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] mb-6 text-[#0b1c30]"
          >
            Start With<br />
            These Programs
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#424754] text-base font-medium max-w-lg leading-relaxed"
          >
            Guided learning ecosystems structured around exercises and workflows designed to turn theory into execution.
          </motion.p>
        </div>

        {/* Right meta */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex lg:justify-end items-center gap-3 flex-wrap"
        >
          {['Cohort-Supported', 'Project-First', 'Ecosystem-Aligned'].map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-bold uppercase tracking-widest text-[#424754]/60 bg-white border border-[#c2c6d6]/30 px-3 py-1.5 rounded-full shadow-sm"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#c2c6d6]/30 rounded-[32px] p-8 h-80 animate-pulse flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="h-5 bg-gray-100 rounded w-1/4" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-5/6" />
              </div>
              <div className="h-10 bg-gray-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filteredPrograms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program, i) => {
            const styles = getCategoryStyles(program.category);
            const isEnrolled = userEnrollments[program.id];
            
            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group bg-white border border-[#c2c6d6]/30 rounded-[32px] overflow-hidden shadow-sm hover:shadow-ambient hover:scale-[1.01] transition-all duration-300 flex flex-col hover:border-[#0058be]/20"
                style={{ borderTop: `4px solid ${styles.text}` }}
              >
                {/* Visual Thumbnail Area */}
                <div className="w-full h-36 bg-gradient-to-br from-[#f8f9ff] to-gray-50/50 border-b border-[#c2c6d6]/20 flex items-center justify-center relative p-6">
                  {program.thumbnail ? (
                    <img 
                      src={program.thumbnail} 
                      alt={program.title} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-95 transition-opacity duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-300">
                      <BookOpen size={32} className="text-gray-200 group-hover:scale-105 transition-transform duration-300" />
                      <span className="text-[8px] font-bold uppercase tracking-widest text-[#424754]/40">CURRICULUM MODULE</span>
                    </div>
                  )}

                  {/* Difficulty Tag */}
                  <div className="absolute top-4 left-4">
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wider shadow-sm border"
                      style={{ 
                        backgroundColor: program.difficulty === 'Beginner' ? '#d0f8e3' : '#fff3cd',
                        color: program.difficulty === 'Beginner' ? '#0b663f' : '#a15e00',
                        borderColor: program.difficulty === 'Beginner' ? '#a5f3c5' : '#ffe89c'
                      }}
                    >
                      {program.difficulty || 'All Levels'}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-col flex-1 p-7 text-left">
                  {/* Category label */}
                  <span
                    className="inline-flex w-fit items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.18em] mb-4 shadow-sm border"
                    style={{ backgroundColor: styles.bg, color: styles.text, borderColor: styles.border }}
                  >
                    {program.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg font-extrabold text-[#0b1c30] tracking-tight leading-snug mb-3 group-hover:text-[#0058be] transition-colors duration-300">
                    {program.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#424754] leading-relaxed font-semibold flex-1 mb-6 line-clamp-3">
                    {program.description}
                  </p>

                  {/* Stats metadata */}
                  <div className="flex items-center gap-4 mb-6 pb-5 border-b border-[#c2c6d6]/20 text-[#424754]/60">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="opacity-70" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{program.duration || '4–6 hrs'}</span>
                    </div>
                    <span className="w-px h-3 bg-[#c2c6d6]/30" />
                    <div className="flex items-center gap-1.5">
                      <BookIcon size={12} className="opacity-70" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{program.lessonsCount || 10} Chapters</span>
                    </div>
                  </div>

                  {/* Footer instructor & Action button */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-[#424754]/75 text-[10px] font-bold uppercase tracking-wider">
                      <ShieldCheck size={13} className="text-[#0058be]/70" />
                      <span>{program.instructor || 'Ayush Paul'}</span>
                    </div>

                    {isEnrolled ? (
                      <button
                        onClick={() => onNavigateToCourse(program.id)}
                        className="inline-flex items-center gap-1.5 bg-[#0b1c30] text-white hover:bg-black font-bold text-[9px] uppercase tracking-widest px-5 py-2.5 rounded-full shadow-sm transition-all duration-300 hover:scale-[1.03] cursor-pointer"
                      >
                        <PlayCircle size={12} className="text-[#d1f34d]" /> Resume
                      </button>
                    ) : (
                      <button
                        onClick={() => onEnroll(program.id)}
                        className="bg-[#0058be] text-white hover:bg-[#004bb0] font-bold text-[9px] uppercase tracking-widest px-5 py-2.5 rounded-full shadow-sm transition-all duration-300 hover:scale-[1.03] cursor-pointer"
                      >
                        Enroll Program
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="w-full flex items-center justify-center py-20 bg-white border border-[#c2c6d6]/30 rounded-[32px] shadow-sm">
          <div className="text-center max-w-sm flex flex-col items-center">
            <BookOpen size={36} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-[#0b1c30] mb-2">No programs available</h3>
            <p className="text-xs text-[#424754]/60 leading-relaxed">
              There are currently no active programs matching this path selection.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
