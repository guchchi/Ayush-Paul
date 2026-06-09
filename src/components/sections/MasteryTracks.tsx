import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ShieldCheck, PlayCircle, Clock, BookOpenCheck, DollarSign, Lock, Sparkles, Mail, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { db, collection, addDoc, serverTimestamp } from '../../firebase';
import { cn } from '../../lib/utils';

export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  difficulty?: string;
  duration?: string;
  lessonsCount?: number;
  price?: number;
  thumbnail?: string;
  isPublished?: boolean;
  status?: string;
}

interface MasteryTracksProps {
  courses: Course[];
  userEnrollments: Record<string, boolean>;
  onEnroll: (courseId: string) => void;
  onNavigateToCourse: (courseId: string) => void;
  loading: boolean;
  activeCategory: string;
}



const categoryNamesMap: Record<string, string> = {
  ai: 'AI & Automation',
  websites: 'Web Development',
  design: 'UI/UX Design',
  typography: 'Typography',
  color: 'Color Theory',
  seo: 'SEO',
  robotics: 'Robotics',
  branding: 'Personal Branding',
  products: 'Digital Products',
  entrepreneurship: 'Entrepreneurship'
};

const getThumbnailGradient = (cat: string) => {
  const c = cat.toLowerCase();
  if (c === 'ai') return 'from-[#6b35ff]/20 to-[#8c52ff]/5';
  if (c === 'color') return 'from-[#ff007a]/20 to-[#ff528c]/5';
  if (c === 'typography') return 'from-[#0058be]/20 to-[#3a8dff]/5';
  if (c === 'seo') return 'from-[#ff8000]/20 to-[#ffa64d]/5';
  if (c === 'robotics') return 'from-[#558b2f]/20 to-[#8bc34a]/5';
  return 'from-gray-100 to-gray-50/50';
};

const getCategoryColor = (cat: string) => {
  const c = cat.toLowerCase();
  if (c === 'ai') return { bg: '#f3efff', border: '#ebe5ff', text: '#6b35ff' };
  if (c === 'color') return { bg: '#fff0f5', border: '#ffd2e1', text: '#c2185b' };
  if (c === 'typography') return { bg: '#eff4ff', border: '#dce9ff', text: '#0058be' };
  if (c === 'seo') return { bg: '#fff4eb', border: '#ffe9d6', text: '#ff8000' };
  if (c === 'robotics') return { bg: '#f0fbe8', border: '#e1f7d2', text: '#558b2f' };
  return { bg: '#f9fafb', border: '#f3f4f6', text: '#4b5563' };
};

export const MasteryTracks = ({
  courses,
  userEnrollments,
  onEnroll,
  onNavigateToCourse,
  loading,
  activeCategory,
}: MasteryTracksProps) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [waitlistError, setWaitlistError] = useState('');

  const handleWaitlistOpen = (course: Course) => {
    setSelectedCourse(course);
    setEmail('');
    setName('');
    setWaitlistStatus('idle');
    setWaitlistError('');
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setWaitlistStatus('error');
      setWaitlistError('Please enter a valid email.');
      return;
    }
    setWaitlistStatus('loading');
    setWaitlistError('');
    try {
      await addDoc(collection(db, "course_waitlist"), {
        email: email.toLowerCase().trim(),
        name: name.trim(),
        courseId: selectedCourse?.id,
        courseTitle: selectedCourse?.title,
        createdAt: serverTimestamp(),
        source: 'course_waitlist',
      });
      setWaitlistStatus('success');
      setEmail('');
      setName('');
    } catch (err: any) {
      setWaitlistStatus('error');
      setWaitlistError(err.message || 'Something went wrong. Please try again.');
    }
  };

  // Filter courses by selected category pill
  const filteredList = courses.filter(c => {
    if (!activeCategory || activeCategory === 'all') return true;
    return c.category.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <section 
      className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20 scroll-mt-24"
      id="featured-courses-section"
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
            <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full" />
            <span className="tracking-[0.22em]">Courses</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]"
          >
            Featured Courses
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#424754] text-base leading-relaxed font-medium"
        >
          Acquire production-grade systems on your own schedule. Build practical architectures step-by-step with video guides and template assets. Every course includes companion blueprints.
        </motion.p>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#c2c6d6]/30 rounded-[32px] p-8 h-[440px] animate-pulse flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="h-4 bg-gray-100 rounded w-1/4" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-28 bg-gray-50 rounded-2xl" />
              </div>
              <div className="h-10 bg-gray-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filteredList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredList.map((course, idx) => {
            const isEnrolled = userEnrollments[course.id];
            const catStyles = getCategoryColor(course.category);
            const thumbGradient = getThumbnailGradient(course.category);

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group bg-white border border-[#c2c6d6]/30 rounded-[32px] overflow-hidden shadow-sm hover:shadow-ambient hover:scale-[1.01] hover:-translate-y-1 transition-all duration-300 flex flex-col text-left hover:border-[#d1f34d]"
              >
                {/* Visual Thumbnail */}
                <div className={cn("w-full h-40 bg-gradient-to-br flex flex-col items-center justify-center relative p-6 border-b border-[#c2c6d6]/20", thumbGradient)}>
                  {course.thumbnail ? (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1.5 text-center select-none">
                      <BookOpen size={28} className="text-[#0b1c30]/25 group-hover:scale-105 transition-transform" />
                      <span className="text-[7.5px] font-extrabold uppercase tracking-widest text-[#424754]/45">
                        Mastery Track
                      </span>
                    </div>
                  )}

                  {/* Difficulty Tag */}
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase tracking-wider bg-white border border-[#c2c6d6]/25 shadow-sm text-[#0b1c30]">
                      {course.difficulty || 'All Levels'}
                    </span>
                  </div>

                  {/* Waitlist Open Badge */}
                  {course.status === 'COMING_SOON' && (
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-0.5 rounded-full bg-[#e8f5e9] border border-[#a5d6a7] text-[#2e7d32] text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-[#2e7d32] rounded-full" /> Waitlist Open
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-7 flex flex-col flex-1">
                  {/* Category Label */}
                  <div className="flex items-center gap-2 mb-3">
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border"
                      style={{ backgroundColor: catStyles.bg, borderColor: catStyles.border, color: catStyles.text }}
                    >
                      {categoryNamesMap[course.category.toLowerCase()] || course.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-extrabold text-[#0b1c30] tracking-tight mb-2 leading-snug">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#424754] leading-relaxed font-semibold line-clamp-3">
                    {course.description}
                  </p>

                  {course.status === 'COMING_SOON' && (
                    <div className="my-3 flex items-center gap-1.5 text-[10px] font-semibold text-[#2e7d32]">
                      <span className="w-1 h-1 rounded-full bg-[#2e7d32]" />
                      <span>Priority early access — be first to enroll when this drops</span>
                    </div>
                  )}

                  {/* Meta stats row */}
                  <div className="grid grid-cols-2 gap-4 border-t border-[#c2c6d6]/10 pt-4 mt-auto">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#424754]/80">
                      <Clock size={12} className="text-[#d1f34d]/70" />
                      <span>{course.duration || '2-4 Hours'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#424754]/80">
                      <BookOpenCheck size={12} className="text-[#d1f34d]/70" />
                      <span>{course.lessonsCount ? `${course.lessonsCount} lessons` : '10 lessons'}</span>
                    </div>
                  </div>

                  {/* Footer Action Profile */}
                  <div className="mt-6 pt-4 border-t border-[#c2c6d6]/15 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] font-extrabold text-[#0b1c30]">
                      {course.status === 'COMING_SOON' ? (
                        <span className="text-[#2e7d32] flex items-center gap-1">
                          <Clock size={10} /> Early Access
                        </span>
                      ) : course.price && course.price > 0 ? (
                        <span>₹{course.price.toLocaleString('en-IN')}</span>
                      ) : (
                        <span className="text-[#558b2f]">FREE</span>
                      )}
                    </div>

                    {course.status === 'COMING_SOON' ? (
                      <button
                        onClick={() => handleWaitlistOpen(course)}
                        className="inline-flex items-center gap-1 bg-[#2e7d32] text-white hover:bg-[#1b5e20] font-bold text-[9px] uppercase tracking-widest px-4.5 py-2.5 rounded-full shadow-sm transition-all duration-300 hover:scale-[1.03] cursor-pointer"
                      >
                        <Mail size={11} /> Join Waitlist
                      </button>
                    ) : isEnrolled ? (
                      <button
                        onClick={() => onNavigateToCourse(course.id)}
                        className="inline-flex items-center gap-1 bg-[#0b1c30] text-white hover:bg-black font-bold text-[9px] uppercase tracking-widest px-4.5 py-2.5 rounded-full shadow-sm transition-all duration-300 hover:scale-[1.03] cursor-pointer"
                      >
                        <PlayCircle size={11} className="text-[#d1f34d]" /> Resume
                      </button>
                    ) : (
                      <button
                        onClick={() => onEnroll(course.id)}
                        className="bg-[#0b1c30] text-[#d1f34d] hover:bg-[#d1f34d] hover:text-black font-bold text-[9px] uppercase tracking-widest px-4.5 py-2.5 rounded-full shadow-sm transition-all duration-300 hover:scale-[1.03] cursor-pointer"
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Premium Coming-Soon State */
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full py-20 px-8 bg-white border border-[#c2c6d6]/30 rounded-[32px] shadow-sm"
        >
          <div className="max-w-lg mx-auto text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-[#d1f34d]/10 border border-[#d1f34d]/20 flex items-center justify-center text-[#d1f34d] mb-6">
              <BookOpen size={28} />
            </div>
            <h3 className="text-2xl font-extrabold text-[#0b1c30] tracking-tight mb-2">Waitlist Open — Courses Loading</h3>
            <p className="text-sm text-[#424754] font-medium leading-relaxed mb-8 max-w-sm">
              Self-paced courses are being built and tested. They will cover AI workflows, robotics fundamentals, design systems, SEO architecture, and more. Join the waitlist to be the first to know when tracks launch.
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#2e7d32]">
              Early access available now
            </p>
          </div>
        </motion.div>
      )}

      {/* Waitlist Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 bg-[#0b1c30]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="bg-white border border-[#c2c6d6]/35 rounded-[32px] p-8 max-w-md w-full relative shadow-xl text-left"
            >
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-6 right-6 text-[#424754]/60 hover:text-black cursor-pointer border-none bg-transparent font-extrabold text-sm"
              >
                ✕
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-[#d1f34d]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/70">Join Waitlist</span>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-[#0b1c30] tracking-tight mb-1">{selectedCourse.title}</h3>
                  <p className="text-xs text-[#424754] font-semibold leading-relaxed">
                    {selectedCourse.description}
                  </p>
                </div>

                {waitlistStatus === 'success' ? (
                  <div className="p-5 bg-[#e8f5e9] border border-[#a5d6a7] text-[#2e7d32] rounded-2xl space-y-2 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} />
                      <span className="font-extrabold text-sm">You're on the list!</span>
                    </div>
                    <p className="font-semibold text-[#2e7d32]/80 text-[11px] leading-relaxed">
                      We will notify you at <strong>{email}</strong> when this course launches. Early access and exclusive pricing will be available to waitlist members first.
                    </p>
                    <button
                      onClick={() => setSelectedCourse(null)}
                      className="mt-3 w-full py-2.5 bg-[#2e7d32] hover:bg-[#1b5e20] text-white rounded-full font-bold text-[9px] uppercase tracking-widest transition-colors cursor-pointer border-none"
                    >
                      Got it
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                    <div className="p-4 bg-[#f1f8e9] border border-[#dcedc8] rounded-2xl">
                      <p className="text-[10px] text-[#424754] font-medium">
                        Enter your details to join the priority waitlist. You will be among the first to know when this course launches.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Full Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={waitlistStatus === 'loading'}
                        className="w-full px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Email Address</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={waitlistStatus === 'loading'}
                        className="w-full px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-semibold"
                      />
                    </div>

                    {waitlistStatus === 'error' && (
                      <div className="flex items-center gap-2 text-[10px] text-red-600 font-bold uppercase tracking-widest">
                        <AlertCircle size={12} />
                        {waitlistError}
                      </div>
                    )}

                    <div className="pt-2 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedCourse(null)}
                        className="flex-1 py-3 border border-[#c2c6d6]/30 text-[#424754] hover:bg-gray-50 rounded-full font-bold text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={waitlistStatus === 'loading'}
                        className="flex-1 py-3 bg-[#2e7d32] hover:bg-[#1b5e20] text-white rounded-full font-bold text-[10px] uppercase tracking-widest transition-colors disabled:opacity-50 cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                      >
                        {waitlistStatus === 'loading' ? (
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <><Mail size={12} /> Join Waitlist</>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
