import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Video, Users, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { db, collection, addDoc, serverTimestamp } from '../../firebase';

interface MasteryPathsProps {
  onExploreCoursesClick: () => void;
  onMentorshipClick: () => void;
}

export const MasteryPaths = ({ onExploreCoursesClick, onMentorshipClick }: MasteryPathsProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await addDoc(collection(db, 'workshop_registrations'), {
        email,
        source: 'modality_waitlist_card',
        registeredAt: serverTimestamp(),
        status: 'waitlist'
      });

      setSuccess(true);
      setEmail('');
    } catch (err) {
      console.error('Failed to submit waitlist:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            <span className="w-1.5 h-1.5 bg-[#0058be] rounded-full animate-pulse" />
            <span className="tracking-[0.22em]">Modalities</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]"
          >
            Choose How You<br />
            Want To Learn
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#424754] text-base leading-relaxed font-medium"
        >
          Acquire capabilities through self-paced tracks, participate in scheduled live audit cohorts, or requests 1-on-1 private training.
        </motion.p>
      </div>

      {/* 3-Column Modality Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        
        {/* Modality 1: Self-Paced Courses (Primary Dark Focus) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#0b1c30] text-white border border-[#0b1c30] rounded-[32px] p-8 md:p-10 shadow-xl overflow-hidden flex flex-col justify-between group hover:scale-[1.005] transition-all duration-300 min-h-[440px]"
        >
          {/* Subtle glowing orb */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#0058be]/15 rounded-full filter blur-[60px] pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#d1f34d]">
                <BookOpen size={20} />
              </div>
              <h3 className="text-xl font-extrabold tracking-tight text-white leading-none">
                Self-Paced Courses
              </h3>
            </div>

            <p className="text-xs text-white/70 leading-relaxed font-medium">
              Acquire production-grade systems on your own schedule. Build practical architectures step-by-step with video guides and template assets.
            </p>

            <div className="space-y-3 pt-2">
              {[
                'Lifetime access & updates',
                'Code downloads included',
                'Progress tracking dashboard'
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-xs text-white/90 font-bold">
                  <Sparkles size={12} className="text-[#d1f34d]" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 relative z-10">
            <MagneticButton>
              <button
                onClick={onExploreCoursesClick}
                className="px-6 py-3.5 bg-[#d1f34d] hover:bg-[#c0e045] text-black rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 group transition-transform shadow-md cursor-pointer w-full"
              >
                Explore Courses
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </MagneticButton>
          </div>
        </motion.div>

        {/* Modality 2: Live Workshops (Secondary Outline Card) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="p-8 md:p-10 bg-white border border-[#c2c6d6]/30 rounded-[32px] shadow-sm flex flex-col justify-between group hover:border-[#0058be]/20 hover:scale-[1.01] transition-all duration-300 min-h-[440px]"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#f3efff] border border-[#ebe5ff] text-[#6b35ff] flex items-center justify-center">
                <Video size={20} />
              </div>
              <h3 className="text-xl font-extrabold text-[#0b1c30] tracking-tight leading-none">
                Live Workshops
              </h3>
            </div>

            <p className="text-xs text-[#424754] font-semibold leading-relaxed">
              Participate in scheduled cohorts, ask live questions, watch real-time product reviews, and build alongside other makers.
            </p>

            <div className="space-y-3 pt-2">
              {[
                'Interactive upcoming sessions',
                'Live audit & feedback loops',
                'Collaborative builder cohorts'
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-xs text-[#0b1c30] font-bold">
                  <Sparkles size={12} className="text-[#6b35ff]/70" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Waitlist Form Inside Card */}
          <div className="pt-8 mt-auto">
            {success ? (
              <div className="p-3 bg-[#e1f7d2] border border-[#c0e8a7] text-[#33691e] rounded-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>You're on the waitlist!</span>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-2">
                <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#424754]/55 block mb-1">
                  GET NOTIFIED OF COHORTS
                </span>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="flex-1 px-4 py-2 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#6b35ff] focus:ring-1 focus:ring-[#6b35ff]/20 disabled:opacity-50 text-[#0b1c30] font-medium"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-[#0b1c30] hover:bg-[#6b35ff] text-white rounded-full font-bold text-[9px] uppercase tracking-wider transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? '...' : 'Notify Me'}
                  </button>
                </div>
                {error && <p className="text-[9px] font-bold text-red-600 mt-1">{error}</p>}
              </form>
            )}
          </div>
        </motion.div>

        {/* Modality 3: 1-on-1 Learning (Secondary Outline Card) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="p-8 md:p-10 bg-white border border-[#c2c6d6]/30 rounded-[32px] shadow-sm flex flex-col justify-between group hover:border-[#0058be]/20 hover:scale-[1.01] transition-all duration-300 min-h-[440px]"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#f0fbe8] border border-[#e1f7d2] text-[#558b2f] flex items-center justify-center">
                <Users size={20} />
              </div>
              <h3 className="text-xl font-extrabold text-[#0b1c30] tracking-tight leading-none">
                1-on-1 Sessions
              </h3>
            </div>

            <p className="text-xs text-[#424754] font-semibold leading-relaxed">
              Accelerate your progress with private, highly-focused live sessions. Work directly on your system architectures and configuration logic.
            </p>

            <div className="space-y-3 pt-2">
              {[
                'Private custom classes',
                'Personalized learning roadmap',
                'Flexible session scheduling'
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-xs text-[#0b1c30] font-bold">
                  <Sparkles size={12} className="text-[#558b2f]/70" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8">
            <MagneticButton>
              <button
                onClick={onMentorshipClick}
                className="px-6 py-3.5 bg-white border border-[#c2c6d6]/30 text-[#0b1c30] hover:bg-gray-50 rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 group transition-all w-full shadow-sm cursor-pointer"
              >
                Book A Session
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </MagneticButton>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
