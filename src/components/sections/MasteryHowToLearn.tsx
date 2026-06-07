import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Video, Users, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { db, collection, addDoc, serverTimestamp } from '../../firebase';

interface MasteryHowToLearnProps {
  onExploreCoursesClick: () => void;
  onMentorshipClick: () => void;
}

const LEARNING_CARDS = [
  {
    id: 'courses',
    icon: BookOpen,
    title: 'Self-Paced Courses',
    color: '#0b1c30',
    bg: '#d1f34d',
    border: '#c0e045',
    accent: '#d1f34d',
    features: [
      { text: '12 Courses', icon: BookOpen },
      { text: 'Lifetime Access', icon: Sparkles },
      { text: 'Projects Included', icon: Sparkles },
    ],
    cta: 'Explore Courses',
    action: 'onExploreCoursesClick' as const,
  },
  {
    id: 'workshops',
    icon: Video,
    title: 'Workshops',
    color: '#0b1c30',
    bg: '#f5f5f5',
    border: '#e5e5e5',
    accent: '#0b1c30',
    features: [],
    cta: null,
    action: null,
  },
  {
    id: '1on1',
    icon: Users,
    title: '1-on-1 Learning',
    color: '#0b1c30',
    bg: '#f5f5f5',
    border: '#e5e5e5',
    accent: '#0b1c30',
    features: [
      { text: 'Private Classes', icon: Sparkles },
      { text: 'Custom Curriculum', icon: Sparkles },
      { text: 'Homework Reviews', icon: Sparkles },
      { text: 'Live Problem Solving', icon: Sparkles },
    ],
    cta: 'Book Session',
    action: 'onMentorshipClick' as const,
  }
];

export const MasteryHowToLearn = ({ onExploreCoursesClick, onMentorshipClick }: MasteryHowToLearnProps) => {
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
        source: 'how_to_learn_workshop_waitlist',
        registeredAt: serverTimestamp(),
        status: 'waitlist'
      });
      setSuccess(true);
      setEmail('');
    } catch (err) {
      console.error(err);
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const actionMap: Record<string, () => void> = {
    onExploreCoursesClick,
    onMentorshipClick,
  };

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20 scroll-mt-24">
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
            <span className="tracking-[0.22em]">How To Learn</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]"
          >
            Choose How You <span className="text-[#d1f34d]">Want</span><br />
            To Learn
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#424754] text-base leading-relaxed font-medium"
        >
          Go at your own pace with courses. Build alongside others in workshops. Or learn directly with private sessions. Pick the style that fits you.
        </motion.p>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        {LEARNING_CARDS.map((card, idx) => {
          const Icon = card.icon;
          const isWorkshopCard = card.id === 'workshops';

          if (isWorkshopCard) {
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="p-8 bg-white border border-[#c2c6d6]/30 rounded-[32px] shadow-sm hover:shadow-ambient hover:border-[#d1f34d] transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center border"
                    style={{ backgroundColor: card.bg, borderColor: card.border, color: card.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#0b1c30] tracking-tight leading-none">{card.title}</h3>
                  </div>
                </div>

                <p className="text-xs text-[#424754] font-semibold leading-relaxed mb-6">
                  Join live cohort-based builds with real-time Q&A, hands-on projects, and community learning.
                </p>

                <div className="mt-auto space-y-4">
                  {success ? (
                    <div className="p-3 bg-[#e1f7d2] border border-[#c0e8a7] text-[#33691e] rounded-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
                      <CheckCircle2 size={16} />
                      <span>You're on the waitlist!</span>
                    </div>
                  ) : (
                    <form onSubmit={handleWaitlistSubmit} className="space-y-3">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#424754]/60">Upcoming Workshops</p>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                          className="flex-1 px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-medium"
                        />
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-5 py-2.5 bg-[#0b1c30] hover:bg-[#d1f34d] hover:text-black text-[#d1f34d] rounded-full font-bold text-[9px] uppercase tracking-widest transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                        >
                          {loading ? '...' : 'Notify Me'}
                        </button>
                      </div>
                      {error && <p className="text-[9px] font-bold text-red-600">{error}</p>}
                    </form>
                  )}
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="p-8 bg-white border border-[#c2c6d6]/30 rounded-[32px] shadow-sm hover:shadow-ambient hover:scale-[1.01] hover:-translate-y-1 hover:border-[#d1f34d] transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center border"
                  style={{ backgroundColor: card.bg, borderColor: card.border, color: card.color }}
                >
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-extrabold text-[#0b1c30] tracking-tight leading-none">{card.title}</h3>
              </div>

              <div className="space-y-3 mb-8">
                {card.features.map((feat) => {
                  const FeatIcon = feat.icon;
                  return (
                    <div key={feat.text} className="flex items-center gap-2.5 text-xs font-bold text-[#0b1c30]">
                      <div className="w-5 h-5 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: card.bg, color: card.color }}
                      >
                        <FeatIcon size={10} />
                      </div>
                      <span>{feat.text}</span>
                    </div>
                  );
                })}
              </div>

              {card.cta && (
                <div className="mt-auto">
                  <MagneticButton>
                    <button
                      onClick={actionMap[card.action!]}
                      className="w-full py-3.5 rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer bg-[#0b1c30] text-[#d1f34d] hover:bg-[#d1f34d] hover:text-black"
                    >
                      {card.cta}
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </MagneticButton>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};