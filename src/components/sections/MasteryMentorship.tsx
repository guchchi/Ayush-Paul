import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Sparkles, CheckCircle2, ChevronRight, MessageSquare, Send } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { db, collection, addDoc, serverTimestamp } from '../../firebase';

export const MasteryMentorship = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [skillFocus, setSkillFocus] = useState('AI & Automation');
  const [currentLevel, setCurrentLevel] = useState('Beginner');
  const [goals, setGoals] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Please fill out all fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await addDoc(collection(db, 'mentorship_applications'), {
        name,
        email,
        skillFocus,
        currentLevel,
        goals,
        source: 'one_on_one_learning_form',
        requestedAt: serverTimestamp(),
        status: 'pending'
      });

      setSuccess(true);
      setName('');
      setEmail('');
      setCurrentLevel('Beginner');
      setGoals('');
    } catch (err) {
      console.error('Failed to submit booking request:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { title: 'Private Classes', desc: '1-on-1 focused live sessions structured entirely around your learning pace and goals.' },
    { title: 'Live Doubt Solving', desc: 'Address specific system bugs, config issues, and logic errors in real time during sessions.' },
    { title: 'Custom Curriculum', desc: 'Your course, your pace. Choose any available track and learn through a curriculum designed for you.' },
    { title: 'Homework Reviews', desc: 'Practical exercises reviewed in detail to strengthen code structures, automation frameworks, and system architectures.' },
    { title: 'Flexible Scheduling', desc: 'Book sessions at times that suit you, and reschedule easily if plans change.' }
  ];

  return (
    <section 
      className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20 scroll-mt-24"
      id="learn-directly-with-ayush"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* LEFT COLUMN: 1-on-1 Learning Details */}
        <div className="lg:col-span-7 text-left space-y-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-6"
            >
              <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full" />
              <span className="tracking-[0.22em]">1-on-1 Learning</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30] mb-4"
            >
              Learn Directly <span className="text-[#d1f34d]">With</span><br />
              Ayush
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[#424754] text-base leading-relaxed font-medium max-w-xl"
            >
              Choose any available course and learn it through private 1-on-1 sessions — with custom guidance, assignments, and live doubt solving tailored to your skill level and goals.
            </motion.p>
          </div>

          {/* Benefits List */}
          <div className="space-y-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-4 items-start"
              >
                <div className="w-6 h-6 rounded-lg bg-[#d1f34d]/10 border border-[#d1f34d]/20 text-[#d1f34d] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Sparkles size={11} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-[#0b1c30] tracking-tight">{benefit.title}</h4>
                  <p className="text-xs text-[#424754] leading-relaxed font-semibold">{benefit.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Booking request card */}
        <div className="lg:col-span-5 w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 bg-white border border-[#c2c6d6]/35 rounded-[32px] shadow-lg text-left relative overflow-hidden"
          >
            {/* Ambient background glow */}
            <div className="absolute -top-16 -left-16 w-36 h-36 bg-[#d1f34d]/10 rounded-full filter blur-[40px] pointer-events-none" />

            <div className="flex items-center gap-2 mb-6">
              <Users size={16} className="text-[#d1f34d]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/70">Private Learning</span>
            </div>

            <h3 className="text-lg font-extrabold text-[#0b1c30] tracking-tight mb-2">
              Book Private 1-on-1 Learning
            </h3>
            <p className="text-xs text-[#424754] font-semibold leading-relaxed mb-6">
              Choose any available course and learn it through private sessions, custom guidance, assignments, and live doubt solving.
            </p>

            {/* Pricing area */}
            <div className="p-4 bg-[#d1f34d]/10 border border-[#d1f34d]/20 rounded-2xl mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-widest text-[#d1f34d] mb-0.5">Starting from</p>
                  <p className="text-xl font-extrabold text-[#0b1c30] tracking-tight">₹2,499<span className="text-xs font-bold text-[#424754]/60 ml-1">/session</span></p>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-white border border-[#d1f34d]/20 text-[10px] font-extrabold text-[#d1f34d]">
                  Flexible Hours
                </div>
              </div>
            </div>

            {success ? (
              <div className="p-4 bg-[#d1f34d]/10 border border-[#d1f34d]/20 text-[#d1f34d] rounded-2xl space-y-2 text-xs font-bold animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Application Sent Successfully!</span>
                </div>
                <p className="font-semibold text-[#d1f34d]/80 text-[11px] leading-relaxed">
                  Thanks for your interest in private 1-on-1 learning! I will review your application and email you within 24 hours to schedule our first session.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Email</label>
                  <input
                    type="email"
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Skill Interested In</label>
                  <select
                    value={skillFocus}
                    onChange={(e) => setSkillFocus(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-semibold"
                  >
                    <option value="AI & Automation">AI & Automation</option>
                    <option value="Robotics">Robotics</option>
                    <option value="Web Development">Web Development</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Typography">Typography</option>
                    <option value="Color Theory">Color Theory</option>
                    <option value="SEO">SEO</option>
                    <option value="Personal Branding">Personal Branding</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                    <option value="Digital Products">Digital Products</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Current Level</label>
                  <select
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-semibold"
                  >
                    <option value="Beginner">Beginner — New to this skill</option>
                    <option value="Intermediate">Intermediate — Some experience</option>
                    <option value="Advanced">Advanced — Ready to go deeper</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">What do you want to achieve?</label>
                  <textarea
                    placeholder="Tell me about your goals, the projects you want to build, or what you want to learn..."
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    disabled={loading}
                    rows={3}
                    className="w-full px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-2xl focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-semibold resize-none"
                  />
                </div>

                {error && <p className="text-[9px] font-bold text-red-600">{error}</p>}

                <div className="pt-2">
                  <MagneticButton>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-[#0b1c30] hover:bg-[#d1f34d] hover:text-black text-[#d1f34d] rounded-full font-bold text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md border-none"
                    >
                      {loading ? 'Submitting...' : 'Book Session'}
                      <Send size={11} />
                    </button>
                  </MagneticButton>
                </div>
              </form>
            )}
          </motion.div>
        </div>

      </div>
    </section>
  );
};
