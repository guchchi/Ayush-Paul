import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Sparkles, CheckCircle2, ChevronRight, MessageSquare, Send } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { db, collection, addDoc, serverTimestamp } from '../../firebase';

export const MasteryMentorship = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [skillFocus, setSkillFocus] = useState('AI & Automation');
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

      await addDoc(collection(db, 'mentorship_bookings'), {
        name,
        email,
        skillFocus,
        goals: 'Requested via booking form',
        source: 'mentorship_section_form',
        requestedAt: serverTimestamp(),
        status: 'pending'
      });

      setSuccess(true);
      setName('');
      setEmail('');
    } catch (err) {
      console.error('Failed to submit booking request:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { title: 'Personalized learning', desc: '1-on-1 focused live sessions structured entirely around your learning pace.' },
    { title: 'Flexible scheduling', desc: 'Book sessions at times that suit you, and reschedule easily if plans change.' },
    { title: 'Homework & projects', desc: 'Practical exercises to practice code structures and automation frameworks.' },
    { title: 'Faster progress', desc: 'Bypass long tutorial loops and accelerate capability acquisition immediately.' },
    { title: 'Live doubt solving', desc: 'Address specific system bugs, config issues, and logic errors in real time.' },
    { title: 'Direct support', desc: 'Reach out anytime between sessions for continuous slack/email guidance.' }
  ];

  return (
    <section 
      className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20 scroll-mt-24"
      id="learn-directly-with-ayush"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* LEFT COLUMN: Mentorship Details */}
        <div className="lg:col-span-7 text-left space-y-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#0058be] shadow-sm mb-6"
            >
              <span className="w-1.5 h-1.5 bg-[#0058be] rounded-full" />
              <span className="tracking-[0.22em]">1-on-1 Learning</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30] mb-4"
            >
              Private Learning<br />
              Sessions
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[#424754] text-base leading-relaxed font-medium max-w-xl"
            >
              Learn directly with Ayush. Choose any available course and learn it through private sessions, custom guidance, assignments, and live doubt solving.
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
                <div className="w-6 h-6 rounded-lg bg-[#f0fbe8] border border-[#e1f7d2] text-[#558b2f] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
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
            <div className="absolute -top-16 -left-16 w-36 h-36 bg-[#558b2f]/5 rounded-full filter blur-[40px] pointer-events-none" />

            <div className="flex items-center gap-2 mb-6">
              <Users size={16} className="text-[#558b2f]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/70">Direct Mentorship</span>
            </div>

            <h3 className="text-lg font-extrabold text-[#0b1c30] tracking-tight mb-2">
              Book Session
            </h3>
            <p className="text-xs text-[#424754] font-semibold leading-relaxed mb-6">
              Choose any available course and learn it through private sessions, custom guidance, assignments, and live doubt solving.
            </p>

            {success ? (
              <div className="p-4 bg-[#e1f7d2] border border-[#c0e8a7] text-[#33691e] rounded-2xl space-y-2 text-xs font-bold animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Request Sent Successfully!</span>
                </div>
                <p className="font-semibold text-[#33691e]/80 text-[11px] leading-relaxed">
                  Thanks for requesting a session! I will review your request and email you in 24 hours to schedule our first live call.
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
                    className="w-full px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#558b2f] text-[#0b1c30] font-semibold"
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
                    className="w-full px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#558b2f] text-[#0b1c30] font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Skill Interested In</label>
                  <select
                    value={skillFocus}
                    onChange={(e) => setSkillFocus(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#558b2f] text-[#0b1c30] font-semibold"
                  >
                    <option value="AI & Automation">AI & Automation</option>
                    <option value="Web Development">Web Development</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Typography">Typography</option>
                    <option value="Color Theory">Color Theory</option>
                    <option value="SEO">SEO</option>
                    <option value="Robotics">Robotics</option>
                    <option value="Personal Branding">Personal Branding</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                    <option value="Digital Products">Digital Products</option>
                  </select>
                </div>

                {error && <p className="text-[9px] font-bold text-red-600">{error}</p>}

                <div className="pt-2">
                  <MagneticButton>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-[#0b1c30] hover:bg-[#558b2f] text-white rounded-full font-bold text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md border-none"
                    >
                      {loading ? 'Submitting...' : 'Request Session'}
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
