import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, PlayCircle, Clock, BookOpenCheck, Mail, Sparkles, CheckCircle2, Grid, Check } from 'lucide-react';
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
  categories: { id: string; name: string; count: number }[];
  onCategorySelect: (categoryId: string) => void;
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
  return 'from-[#f8f9ff] to-[#eff4ff]';
};

const getCategoryColor = (cat: string) => {
  return { bg: '#ffffff', border: 'rgba(11, 28, 48, 0.12)', text: '#0b1c30' };
};

export const MasteryTracks = ({
  courses,
  userEnrollments,
  onEnroll,
  onNavigateToCourse,
  loading,
  activeCategory,
  categories,
  onCategorySelect,
}: MasteryTracksProps) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [waitlistError, setWaitlistError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

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
        name: name.trim() || '',
        course: selectedCourse?.title || '',
        courseTitle: selectedCourse?.title || '',
        courseId: selectedCourse?.id,
        courseSlug: selectedCourse?.id || '',
        status: 'waitlist',
        createdAt: serverTimestamp(),
        source: selectedCourse?.status === "COMING_SOON" ? 'mastery-coming-soon' : 'courses_section',
      });
      setWaitlistStatus('success');
      setEmail('');
      setName('');
    } catch (err: any) {
      setWaitlistStatus('error');
      setWaitlistError(err.message || 'Something went wrong. Please try again.');
    }
  };

  // Filter courses by category
  const filteredList = courses.filter(c => {
    if (!activeCategory || activeCategory === 'all') return true;
    return c.category.toLowerCase() === activeCategory.toLowerCase();
  });

  // Limit course results initially if 'all' category is active and not expanded
  const displayList = (activeCategory === 'all' && !isExpanded) 
    ? filteredList.slice(0, 3) 
    : filteredList;

  const activeCategoryName = activeCategory === 'all' 
    ? 'All Categories' 
    : categoryNamesMap[activeCategory.toLowerCase()] || activeCategory;

  return (
    <section 
      className="py-16 md:py-20 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20 scroll-mt-24"
      id="featured-courses-section"
    >
      {/* ── SKILL DISCOVERY HEADER & FILTERS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end mb-8 text-left" id="explore-skills-section">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-4">
            <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full" />
            <span className="tracking-[0.2em]">Explore Skills</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]">
            Browse Mastery Courses
          </h2>
        </div>
        <p className="text-[#424754] text-sm md:text-base leading-relaxed font-medium">
          Select a category to filter courses and find your learning path. Clear filters at any time.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2.5 justify-start text-left mb-10">
        <button
          onClick={() => onCategorySelect('all')}
          className={cn(
            "min-h-[44px] px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1c30]",
            activeCategory === 'all'
              ? "bg-[#0b1c30] border-[#0b1c30] text-white"
              : "bg-white border-[#c2c6d6]/30 hover:border-[#0b1c30]/50 text-[#424754]"
          )}
          aria-pressed={activeCategory === 'all'}
        >
          {activeCategory === 'all' ? <Check size={12} className="text-[#d1f34d]" /> : <Grid size={12} />}
          <span>All Categories</span>
        </button>

        {categories.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.id)}
              className={cn(
                "min-h-[44px] px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1c30]",
                isSelected
                  ? "bg-[#0b1c30] border-[#0b1c30] text-white"
                  : "bg-white border-[#c2c6d6]/30 hover:border-[#0b1c30]/50 text-[#424754]"
              )}
              aria-pressed={isSelected}
            >
              {isSelected && <Check size={12} className="text-[#d1f34d]" />}
              <span>{cat.name}</span>
              <span 
                className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-extrabold leading-none ml-1",
                  isSelected
                    ? "bg-[#d1f34d] text-[#0b1c30]"
                    : "bg-bg-secondary text-[#424754]/60"
                )}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Result Context Info */}
      <div className="flex items-center justify-between border-b border-[#c2c6d6]/15 pb-4 mb-8 text-left">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#424754]/80">
          Showing {filteredList.length} {filteredList.length === 1 ? 'course' : 'courses'} in <span className="text-[#0b1c30] font-extrabold">{activeCategoryName}</span>
        </span>
        {activeCategory !== 'all' && (
          <button 
            onClick={() => onCategorySelect('all')}
            className="text-[10px] font-bold uppercase tracking-widest text-[#0058be] hover:underline cursor-pointer border-none bg-transparent"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* ── COURSE GRID ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#c2c6d6]/30 rounded-[32px] p-6 h-[380px] animate-pulse flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="h-4 bg-gray-100 rounded w-1/4" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-24 bg-gray-50 rounded-2xl" />
              </div>
              <div className="h-10 bg-gray-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : displayList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayList.map((course, idx) => {
            const isEnrolled = userEnrollments[course.id];
            const isComingSoon = course.status === "COMING_SOON" && !isEnrolled;
            const isPublished = course.isPublished || course.status === "PUBLISHED";
            const catStyles = getCategoryColor(course.category);
            const thumbGradient = getThumbnailGradient(course.category);

            return (
              <div
                key={course.id}
                className="group bg-white border border-[#c2c6d6]/30 rounded-[32px] overflow-hidden shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:hover:-translate-y-[2px] motion-safe:hover:border-[#0b1c30]/40 motion-safe:hover:shadow-md flex flex-col text-left"
              >
                {/* Visual Thumbnail */}
                <div className={cn("w-full h-36 bg-gradient-to-br flex flex-col items-center justify-center relative p-4 border-b border-[#c2c6d6]/10", thumbGradient)}>
                  {course.thumbnail ? (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1.5 text-center select-none">
                      <BookOpen size={24} className="text-[#0b1c30]/20" />
                      <span className="text-[7px] font-extrabold uppercase tracking-widest text-[#424754]/40">
                        {categoryNamesMap[course.category.toLowerCase()] || course.category}
                      </span>
                    </div>
                  )}

                  {/* Difficulty Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wider bg-white border border-[#c2c6d6]/20 shadow-sm text-[#0b1c30]">
                      {course.difficulty || 'All Levels'}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    {isEnrolled ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#e1f7d2] border border-[#c0e8a7] text-[#33691e] text-[8px] font-bold uppercase tracking-wider">
                        Enrolled
                      </span>
                    ) : isComingSoon ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#eff4ff] border border-[#dce9ff] text-[#0058be] text-[8px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Sparkles size={8} /> Coming Soon
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Category Label */}
                  <div className="mb-2">
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase tracking-wider border"
                      style={{ backgroundColor: catStyles.bg, borderColor: catStyles.border, color: catStyles.text }}
                    >
                      {categoryNamesMap[course.category.toLowerCase()] || course.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-extrabold text-[#0b1c30] tracking-tight mb-1.5 leading-snug">
                    {course.title}
                  </h3>

                  {/* Outcome / Description */}
                  <p className="text-[11.5px] text-[#424754] leading-relaxed font-medium mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Meta stats row */}
                  <div className="grid grid-cols-2 gap-4 border-t border-[#c2c6d6]/10 pt-3 mt-auto">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#424754]/75">
                      <Clock size={11} className="text-[#0b1c30]/40" />
                      <span>{course.duration || '2-4 Hours'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#424754]/75">
                      <BookOpenCheck size={11} className="text-[#0b1c30]/40" />
                      <span>{course.lessonsCount ? `${course.lessonsCount} lessons` : '10 lessons'}</span>
                    </div>
                  </div>

                  {/* Footer Action Profile */}
                  <div className="mt-4 pt-3 border-t border-[#c2c6d6]/10 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#0b1c30]">
                      {isComingSoon ? (
                        <span className="text-[#424754]/60">Waitlist Open</span>
                      ) : course.price && course.price > 0 ? (
                        `₹${course.price.toLocaleString('en-IN')}`
                      ) : (
                        <span className="text-[#558b2f]">FREE</span>
                      )}
                    </span>

                    {isEnrolled ? (
                      <button
                        onClick={() => onNavigateToCourse(course.id)}
                        className="inline-flex items-center gap-1 bg-[#0b1c30] text-white hover:bg-black font-bold text-[8.5px] uppercase tracking-widest px-4 py-2 rounded-full transition-colors cursor-pointer shadow-sm border-none"
                      >
                        <PlayCircle size={11} className="text-[#d1f34d]" /> Resume Course
                      </button>
                    ) : isComingSoon ? (
                      <button
                        onClick={() => handleWaitlistOpen(course)}
                        className="inline-flex items-center gap-1 bg-white border border-[#c2c6d6]/40 hover:border-[#0b1c30] text-[#0b1c30] font-bold text-[8.5px] uppercase tracking-widest px-4 py-2 rounded-full transition-colors cursor-pointer shadow-sm"
                      >
                        Join Waitlist
                      </button>
                    ) : isPublished ? (
                      <button
                        onClick={() => onEnroll(course.id)}
                        className="inline-flex items-center gap-1 bg-[#0b1c30] text-white hover:bg-black font-bold text-[8.5px] uppercase tracking-widest px-4 py-2 rounded-full transition-colors cursor-pointer shadow-sm border-none"
                      >
                        Start Course
                      </button>
                    ) : (
                      <button
                        onClick={() => handleWaitlistOpen(course)}
                        className="inline-flex items-center gap-1 bg-white border border-[#c2c6d6]/40 hover:border-[#0b1c30] text-[#0b1c30] font-bold text-[8.5px] uppercase tracking-widest px-4 py-2 rounded-full transition-colors cursor-pointer shadow-sm"
                      >
                        Join Waitlist
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty Filter State */
        <div className="w-full py-16 px-8 bg-white border border-[#c2c6d6]/20 rounded-[32px] shadow-sm text-center">
          <div className="max-w-md mx-auto flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-[#c2c6d6]/20 flex items-center justify-center text-[#424754]/40 mb-4">
              <BookOpen size={24} />
            </div>
            <h3 className="text-lg font-extrabold text-[#0b1c30] tracking-tight mb-2">No courses found</h3>
            <p className="text-xs text-[#424754] font-semibold leading-relaxed mb-6">
              Try another skill or clear your current filters to view all courses.
            </p>
            <button 
              onClick={() => onCategorySelect('all')}
              className="px-5 py-2.5 bg-[#0b1c30] hover:bg-black text-white rounded-full font-bold text-[9px] uppercase tracking-widest transition-colors cursor-pointer border-none shadow-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* REDUCE WALL: Show More Button */}
      {activeCategory === 'all' && filteredList.length > 3 && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-8 py-3 bg-white border border-[#c2c6d6]/40 hover:border-[#0b1c30] text-[#0b1c30] font-bold text-xs uppercase tracking-widest rounded-full transition-all shadow-sm cursor-pointer"
          >
            {isExpanded ? 'Show Fewer Courses' : `View All Courses (${filteredList.length})`}
          </button>
        </div>
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
                aria-label="Close modal"
              >
                ✕
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-[#0058be]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/70">Early Access Waitlist</span>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-[#0b1c30] tracking-tight mb-1">
                    {selectedCourse.title}
                  </h3>
                  <p className="text-xs text-[#424754] font-medium leading-relaxed">
                    Join the waitlist to receive priority access and notification when registration opens.
                  </p>
                </div>

                {waitlistStatus === 'success' ? (
                  <div className="p-4 bg-[#e1f7d2] border border-[#c0e8a7] text-[#33691e] rounded-2xl flex items-start gap-2.5 text-xs font-semibold animate-fadeIn">
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-extrabold mb-0.5">Waitlist Joined</p>
                      <p className="text-[#33691e]/85">We'll notify you as soon as this course is released.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label htmlFor="modal-name" className="text-[9px] font-bold uppercase tracking-widest text-[#424754]">Your Name</label>
                      <input
                        id="modal-name"
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="modal-email" className="text-[9px] font-bold uppercase tracking-widest text-[#424754]">Email Address <span className="text-red-400">*</span></label>
                      <input
                        id="modal-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-semibold"
                      />
                    </div>

                    {waitlistStatus === 'error' && (
                      <p className="text-[10px] font-bold text-red-600">{waitlistError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={waitlistStatus === 'loading'}
                      className="w-full py-3.5 bg-[#0b1c30] hover:bg-black text-white rounded-full font-bold text-[10px] uppercase tracking-widest transition-colors cursor-pointer shadow-sm border-none"
                    >
                      {waitlistStatus === 'loading' ? 'Joining...' : 'Submit Request'}
                    </button>
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
