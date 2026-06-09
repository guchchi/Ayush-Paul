import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Sparkles, CheckCircle2, ChevronRight, MessageSquare, Send, Clock, Calendar, Globe } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { db, collection, addDoc, serverTimestamp } from '../../firebase';

const TOPICS = [
  'AI & Automation',
  'Robotics',
  'Web Development',
  'UI/UX Design',
  'Typography',
  'Color Theory',
  'SEO',
  'Personal Branding',
  'Entrepreneurship',
  'Digital Products',
  'System Architecture',
  'Career Strategy',
  'Other',
];

const TIME_SLOTS = [
  '9:00 AM — 10:00 AM',
  '10:00 AM — 11:00 AM',
  '11:00 AM — 12:00 PM',
  '12:00 PM — 1:00 PM',
  '2:00 PM — 3:00 PM',
  '3:00 PM — 4:00 PM',
  '4:00 PM — 5:00 PM',
  '5:00 PM — 6:00 PM',
  '6:00 PM — 7:00 PM',
  '7:00 PM — 8:00 PM',
  '8:00 PM — 9:00 PM',
];

export const MasteryMentorship = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [topic, setTopic] = useState('AI & Automation');
  const [description, setDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState(TIME_SLOTS[0]);
  const [timezone, setTimezone] = useState('IST (UTC+5:30)');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact || !preferredDate) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const docRef = await addDoc(collection(db, 'mentorship_applications'), {
        name,
        contact,
        topic,
        description,
        preferredDate,
        preferredTime,
        timezone,
        source: 'one_on_one_session_request',
        requestedAt: serverTimestamp(),
        status: 'PENDING',
        statusHistory: [],
      });

      // Fire-and-forget admin notification
      try {
        await fetch('/api/mentorship-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            contact,
            topic,
            description,
            preferredDate,
            preferredTime,
            timezone,
            requestId: docRef.id,
          }),
        });
      } catch (_) {}

      setSuccess(true);
      setName('');
      setContact('');
      setTopic('AI & Automation');
      setDescription('');
      setPreferredDate('');
      setPreferredTime(TIME_SLOTS[0]);
      setTimezone('IST (UTC+5:30)');
    } catch (err) {
      console.error('Failed to submit session request:', err);
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
    { title: 'Flexible Scheduling', desc: 'Request sessions at times that suit you — I manually confirm each slot to avoid conflicts.' }
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
              Request a 1-on-1 Session
            </h3>
            <p className="text-xs text-[#424754] font-semibold leading-relaxed mb-6">
              Tell me what you want to work on. I review every request personally and confirm your slot manually — no bots, no auto-booking.
            </p>

            {/* Pricing area */}
            <div className="p-4 bg-[#d1f34d]/10 border border-[#d1f34d]/20 rounded-2xl mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-widest text-[#d1f34d] mb-0.5">Starting from</p>
                  <p className="text-xl font-extrabold text-[#0b1c30] tracking-tight">₹2,499<span className="text-xs font-bold text-[#424754]/60 ml-1">/session</span></p>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-white border border-[#d1f34d]/20 text-[10px] font-extrabold text-[#d1f34d]">
                  Manual Confirmation
                </div>
              </div>
              <p className="text-[9px] text-[#424754] font-semibold mt-2 leading-relaxed">
                Payment is collected only after I confirm availability — no upfront charges.
              </p>
            </div>

            {success ? (
              <div className="p-5 bg-[#d1f34d]/10 border border-[#d1f34d]/20 text-[#d1f34d] rounded-2xl space-y-3 text-xs font-bold animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Request Submitted Successfully!</span>
                </div>
                <p className="font-semibold text-[#d1f34d]/80 text-[11px] leading-relaxed">
                  Thanks for your interest in private 1-on-1 sessions. I will review your request and confirm your slot manually via email/WhatsApp within 24 hours.
                </p>
                <p className="font-semibold text-[#d1f34d]/60 text-[10px] leading-relaxed pt-1 border-t border-[#d1f34d]/10">
                  No automatic booking — every request is personally reviewed to ensure the best fit for your goals.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Full Name <span className="text-red-400">*</span></label>
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
                  <label className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Email or WhatsApp <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    placeholder="you@domain.com or +91 9XXXXXXXXX"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Topic of Session <span className="text-red-400">*</span></label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-semibold"
                  >
                    {TOPICS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Short Problem Description</label>
                  <textarea
                    placeholder="What specific problem or goal would you like help with during the session?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                    rows={2}
                    className="w-full px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-2xl focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-semibold resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Preferred Date <span className="text-red-400">*</span></label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      required
                      disabled={loading}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Preferred Time <span className="text-red-400">*</span></label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-semibold"
                    >
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Time Zone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-semibold"
                  >
                    <option value="IST (UTC+5:30)">IST (UTC+5:30)</option>
                    <option value="EST (UTC-5:00)">EST (UTC-5:00)</option>
                    <option value="PST (UTC-8:00)">PST (UTC-8:00)</option>
                    <option value="GMT (UTC+0:00)">GMT (UTC+0:00)</option>
                    <option value="CET (UTC+1:00)">CET (UTC+1:00)</option>
                    <option value="GST (UTC+4:00)">GST (UTC+4:00)</option>
                    <option value="SGT (UTC+8:00)">SGT (UTC+8:00)</option>
                    <option value="AEDT (UTC+11:00)">AEDT (UTC+11:00)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {error && <p className="text-[9px] font-bold text-red-600">{error}</p>}

                <div className="pt-2">
                  <MagneticButton>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-[#0b1c30] hover:bg-[#d1f34d] hover:text-black text-[#d1f34d] rounded-full font-bold text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md border-none"
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
