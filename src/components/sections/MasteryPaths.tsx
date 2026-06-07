import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Video, Users, Sparkles, ArrowRight, ArrowDown } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';

interface MasteryPathsProps {
  onExploreCoursesClick: () => void;
  onMentorshipClick: () => void;
}

const PROGRESSION_STEPS = [
  {
    label: 'Start with a Course',
    items: ['Learn at your own pace', 'Video guides + template assets', 'Lifetime access', 'Progress tracking']
  },
  {
    label: 'Go Deeper in Workshops',
    items: ['Live cohort-based builds', 'Real-time Q&A and audits', 'Hands-on projects', 'Community learning']
  },
  {
    label: 'Accelerate with 1-on-1',
    items: ['Private sessions with Ayush', 'Custom learning path', 'Homework and projects', 'Live doubt solving']
  }
];

export const MasteryPaths = ({ onExploreCoursesClick, onMentorshipClick }: MasteryPathsProps) => {
  return (
    <section 
      className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20 scroll-mt-24"
      id="choose-learning-paths"
    >
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end mb-16 text-left">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-6"
          >
            <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full animate-pulse" />
            <span className="tracking-[0.22em]">Learning Path</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]"
          >
            Your Learning<br />
            <span className="text-[#d1f34d]">Progression Path</span>
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#424754] text-base leading-relaxed font-medium"
        >
          Start with a self-paced course. Go deeper through live workshops. Accelerate with private 1-on-1 sessions. Each level builds on the last.
        </motion.p>
      </div>

      {/* 3-Column Progression Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* Card 1: Courses */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#0b1c30] text-white border border-[#0b1c30] rounded-[32px] p-8 md:p-10 shadow-xl overflow-hidden flex flex-col group hover:scale-[1.005] transition-all duration-300"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#d1f34d]/15 rounded-full filter blur-[60px] pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#d1f34d]">
                <BookOpen size={20} />
              </div>
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#d1f34d] block mb-0.5">Step 1</span>
                <h3 className="text-xl font-extrabold tracking-tight text-white leading-none">Self-Paced Courses</h3>
              </div>
            </div>

            <p className="text-xs text-white/85 leading-relaxed font-medium">
              Learn at your own pace with video guides, template assets, and downloadable codebases. Build practical architectures step by step.
            </p>

            <div className="space-y-3 pt-2">
              {['Lifetime Access', 'Downloadable Assets', 'Progress Tracking', 'Learn Anytime'].map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-xs text-white/90 font-bold">
                  <Sparkles size={12} className="text-[#d1f34d]" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 mt-6 relative z-10">
            <MagneticButton>
              <button
                onClick={onExploreCoursesClick}
                className="px-6 py-3.5 bg-[#d1f34d] hover:bg-[#c0e045] text-black rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 group transition-transform shadow-md cursor-pointer w-full border-none"
              >
                Explore Courses
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </MagneticButton>
          </div>
        </motion.div>

        {/* Progression Arrow Connector (desktop) */}
        <div className="hidden lg:flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-[#d1f34d]/10 border border-[#d1f34d]/30 flex items-center justify-center text-[#d1f34d]">
              <ArrowRight size={16} />
            </div>
            <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#424754]/40">Go Deeper</span>
          </motion.div>
        </div>

        {/* Progression Arrow Connector (mobile) */}
        <div className="flex lg:hidden items-center justify-center -my-2">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-8 h-8 rounded-full bg-[#d1f34d]/10 border border-[#d1f34d]/30 flex items-center justify-center text-[#d1f34d]">
              <ArrowDown size={16} />
            </div>
            <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#424754]/40">Go Deeper</span>
          </motion.div>
        </div>

        {/* Card 2: Workshops */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="p-8 md:p-10 bg-white border border-[#c2c6d6]/30 rounded-[32px] shadow-sm flex flex-col group hover:border-[#d1f34d] hover:scale-[1.01] transition-all duration-300"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#f3efff] border border-[#ebe5ff] text-[#6b35ff] flex items-center justify-center">
                <Video size={20} />
              </div>
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#6b35ff] block mb-0.5">Step 2</span>
                <h3 className="text-xl font-extrabold text-[#0b1c30] tracking-tight leading-none">Live Workshops</h3>
              </div>
            </div>

            <p className="text-xs text-[#424754] font-semibold leading-relaxed">
              Join scheduled cohorts, build alongside other makers, ask live questions, and watch real-time code reviews and system audits.
            </p>

            <div className="space-y-3 pt-2">
              {['Upcoming Cohorts', 'Hands-on Builds', 'Live Q&A', 'Community Support'].map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-xs text-[#0b1c30] font-bold">
                  <Sparkles size={12} className="text-[#6b35ff]/70" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 mt-auto relative z-10">
            <div className="text-[8px] font-extrabold uppercase tracking-widest text-[#424754]/40 mb-2">View upcoming dates below</div>
            <MagneticButton>
              <button
                onClick={onExploreCoursesClick}
                className="px-6 py-3.5 bg-white border border-[#c2c6d6]/30 text-[#0b1c30] hover:bg-gray-50 rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all w-full shadow-sm cursor-pointer"
              >
                Browse Workshops
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform text-[#d1f34d]" />
              </button>
            </MagneticButton>
          </div>
        </motion.div>

        {/* Progression Arrow Connector (desktop) */}
        <div className="hidden lg:flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-[#d1f34d]/10 border border-[#d1f34d]/30 flex items-center justify-center text-[#d1f34d]">
              <ArrowRight size={16} />
            </div>
            <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#424754]/40">Accelerate</span>
          </motion.div>
        </div>

        {/* Progression Arrow Connector (mobile) */}
        <div className="flex lg:hidden items-center justify-center -my-2">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-8 h-8 rounded-full bg-[#d1f34d]/10 border border-[#d1f34d]/30 flex items-center justify-center text-[#d1f34d]">
              <ArrowDown size={16} />
            </div>
            <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#424754]/40">Accelerate</span>
          </motion.div>
        </div>

        {/* Card 3: 1-on-1 Learning */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="p-8 md:p-10 bg-white border border-[#c2c6d6]/30 rounded-[32px] shadow-sm flex flex-col group hover:border-[#d1f34d] hover:scale-[1.01] transition-all duration-300"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#f0fbe8] border border-[#e1f7d2] text-[#558b2f] flex items-center justify-center">
                <Users size={20} />
              </div>
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#558b2f] block mb-0.5">Step 3</span>
                <h3 className="text-xl font-extrabold text-[#0b1c30] tracking-tight leading-none">1-on-1 Learning</h3>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-[#0b1c30] font-bold leading-relaxed">
                Learn directly with Ayush.
              </p>
              <p className="text-xs text-[#424754] font-semibold leading-relaxed">
                Choose any course and learn it through private sessions, custom guidance, assignments, and live doubt solving — at your pace.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {['Private Sessions', 'Custom Learning Path', 'Homework & Projects', 'Live Doubt Solving'].map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-xs text-[#0b1c30] font-bold">
                  <Sparkles size={12} className="text-[#558b2f]/70" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 mt-auto">
            <MagneticButton>
              <button
                onClick={onMentorshipClick}
                className="px-6 py-3.5 bg-white border border-[#c2c6d6]/30 text-[#0b1c30] hover:bg-gray-50 rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 group transition-all w-full shadow-sm cursor-pointer"
              >
                Book 1-on-1 Learning
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform text-[#d1f34d]" />
              </button>
            </MagneticButton>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
