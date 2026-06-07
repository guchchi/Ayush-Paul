import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users2, Clock, CheckCircle2, Video, Sparkles, AlertCircle } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { db, collection, addDoc, serverTimestamp } from '../../firebase';

export interface Workshop {
  id: string;
  name: string;
  topic: string;
  date: string;
  time?: string;
  totalSeats: number;
  seatsLeft: number;
  urgencyText?: string;
  price?: number;
}

const DEFAULT_WORKSHOPS: Workshop[] = [
  {
    id: 'workshop-ai-agents',
    name: 'AI Automation Bootcamp',
    topic: 'Building & Deploying Autonomous Research Agents',
    date: 'June 28, 2026',
    time: '2:00 PM EST',
    totalSeats: 20,
    seatsLeft: 5,
    urgencyText: 'Only 5 seats left!',
    price: 149
  },
  {
    id: 'workshop-web-eng',
    name: 'Next-Gen Web Engineering',
    topic: 'Next.js Server Actions, Edge Layouts & Caching Systems',
    date: 'July 12, 2026',
    time: '1:00 PM EST',
    totalSeats: 15,
    seatsLeft: 12,
    urgencyText: 'Registration closes in 4 days',
    price: 199
  }
];

export const MasteryWorkshops = () => {
  const [email, setEmail] = useState('');
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [error, setError] = useState('');

  // General waitlist submission
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
        source: 'general_workshop_waitlist',
        registeredAt: serverTimestamp(),
        status: 'waitlist'
      });
      setWaitlistSuccess(true);
      setEmail('');
    } catch (err) {
      console.error(err);
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Workshop-specific seat registration submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regEmail.includes('@') || !selectedWorkshop) {
      setError('Please provide valid registration details.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await addDoc(collection(db, 'workshop_registrations'), {
        name: regName,
        email: regEmail,
        workshopId: selectedWorkshop.id,
        workshopName: selectedWorkshop.name,
        source: 'workshop_seat_modal',
        registeredAt: serverTimestamp(),
        status: 'seat_requested'
      });
      setRegSuccess(true);
      setRegName('');
      setRegEmail('');
    } catch (err) {
      console.error(err);
      setError('Failed to book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20 scroll-mt-24"
      id="upcoming-workshops-section"
    >
      {/* Background radial soft light */}
      <div className="absolute top-[20%] right-[10%] w-80 h-80 bg-[#0058be]/5 rounded-full filter blur-[80px] pointer-events-none" />

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
            <span className="tracking-[0.22em]">Cohort Builds</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]"
          >
            Upcoming Live<br />
            Workshops
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#424754] text-base leading-relaxed font-medium"
        >
          Watch live audits, debug complex configurations together, and code production-grade integrations with real-time support.
        </motion.p>
      </div>

      {/* Workshops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-16">
        {DEFAULT_WORKSHOPS.map((workshop, idx) => (
          <motion.div
            key={workshop.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 bg-white border border-[#c2c6d6]/30 rounded-[32px] shadow-sm hover:shadow-ambient hover:scale-[1.01] hover:-translate-y-1 hover:border-[#d1f34d] transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Top Meta info */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#d1f34d] px-2.5 py-0.5 rounded-full bg-[#d1f34d]/10 border border-[#d1f34d]/20">
                  Live Session
                </span>
                
                {workshop.urgencyText && (
                  <span className="flex items-center gap-1 text-[9px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-full px-2.5 py-0.5">
                    <AlertCircle size={10} />
                    {workshop.urgencyText}
                  </span>
                )}
              </div>

              {/* Title & Topic */}
              <h3 className="text-xl font-extrabold text-[#0b1c30] tracking-tight leading-snug mb-2">
                {workshop.name}
              </h3>
              <p className="text-xs text-[#424754] font-semibold leading-relaxed mb-6">
                {workshop.topic}
              </p>

              {/* Details Row */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50/50 border border-gray-100/50 p-4.5 rounded-2xl mb-8">
                <div className="flex items-center gap-2 text-xs font-bold text-[#424754]">
                  <Calendar size={13} className="text-[#d1f34d]" />
                  <span>{workshop.date}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#424754]">
                  <Clock size={13} className="text-[#d1f34d]" />
                  <span>{workshop.time}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#424754] col-span-2 border-t border-[#c2c6d6]/10 pt-2.5 mt-1">
                  <Users2 size={13} className="text-[#d1f34d]" />
                  <span>{workshop.totalSeats} seats total • <span className="text-[#558b2f]">{workshop.seatsLeft} left</span></span>
                </div>
              </div>
            </div>

            {/* Bottom Register Action */}
            <div className="flex items-center justify-between pt-4 border-t border-[#c2c6d6]/10">
              <span className="text-sm font-extrabold text-[#0b1c30]">
                ₹{workshop.price.toLocaleString('en-IN')}
              </span>
              <MagneticButton>
                <button
                  onClick={() => {
                    setSelectedWorkshop(workshop);
                    setRegSuccess(false);
                    setError('');
                  }}
                  className="px-6 py-2.5 bg-[#0b1c30] hover:bg-[#d1f34d] hover:text-black text-[#d1f34d] rounded-full font-bold text-[9px] uppercase tracking-widest transition-colors cursor-pointer shadow-sm"
                >
                  Reserve Seat
                </button>
              </MagneticButton>
            </div>
          </motion.div>
        ))}
      </div>

      {/* General waitlist email form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl mx-auto p-8 bg-white border border-[#c2c6d6]/30 rounded-[32px] shadow-sm text-center"
      >
        <div className="flex flex-col items-center max-w-md mx-auto space-y-4">
          <div className="w-10 h-10 rounded-xl bg-[#d1f34d]/10 border border-[#d1f34d]/20 text-[#d1f34d] flex items-center justify-center">
            <Video size={18} />
          </div>
          <h3 className="text-lg font-extrabold text-[#0b1c30] tracking-tight">
            Upcoming Soon
          </h3>
          <p className="text-xs text-[#424754] font-semibold leading-relaxed">
            Can't make the scheduled cohort dates? Join the waitlist to receive instant notifications when new topics, sitemaps, and workshops are scheduled.
          </p>

          {waitlistSuccess ? (
            <div className="p-3 bg-[#e1f7d2] border border-[#c0e8a7] text-[#33691e] rounded-2xl flex items-center gap-2 text-xs font-bold w-full justify-center animate-fadeIn">
              <CheckCircle2 size={16} />
              <span>You have successfully registered for the waitlist!</span>
            </div>
          ) : (
            <form onSubmit={handleWaitlistSubmit} className="flex gap-2 w-full pt-2">
              <input
                type="email"
                placeholder="Enter your email for future notifications"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="flex-1 px-4.5 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-medium"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-[#0b1c30] hover:bg-[#d1f34d] hover:text-black text-[#d1f34d] rounded-full font-bold text-[9px] uppercase tracking-widest transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {loading ? '...' : 'Notify Me'}
              </button>
            </form>
          )}
          {error && <p className="text-[9px] font-bold text-red-600 mt-1">{error}</p>}
        </div>
      </motion.div>

      {/* Seats Reservation Modal */}
      <AnimatePresence>
        {selectedWorkshop && (
          <div className="fixed inset-0 bg-[#0b1c30]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="bg-white border border-[#c2c6d6]/35 rounded-[32px] p-8 max-w-md w-full relative shadow-xl text-left"
            >
              <button
                onClick={() => setSelectedWorkshop(null)}
                className="absolute top-6 right-6 text-[#424754]/60 hover:text-black cursor-pointer border-none bg-transparent font-extrabold text-sm"
              >
                ✕
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Video size={18} className="text-[#d1f34d]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/70">Seat Reservation</span>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-[#0b1c30] tracking-tight mb-1">{selectedWorkshop.name}</h3>
                  <p className="text-xs text-[#424754] font-semibold leading-relaxed">{selectedWorkshop.topic}</p>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-[#0b1c30] flex justify-between">
                    <span className="text-[#424754]">Date:</span>
                    <span>{selectedWorkshop.date}</span>
                  </div>
                  <div className="text-xs font-bold text-[#0b1c30] flex justify-between">
                    <span className="text-[#424754]">Time:</span>
                    <span>{selectedWorkshop.time}</span>
                  </div>
                  <div className="text-xs font-bold text-[#0b1c30] flex justify-between">
                  <span className="text-[#424754]">Price:</span>
                  <span>₹{selectedWorkshop.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {regSuccess ? (
                  <div className="p-4 bg-[#e1f7d2] border border-[#c0e8a7] text-[#33691e] rounded-2xl space-y-2 text-xs font-bold animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      <span>Seat Reservation Requested!</span>
                    </div>
                    <p className="font-semibold text-[#33691e]/80 text-[11px] leading-relaxed">
                      We have received your registration details. A confirmation email with Stripe payment link has been sent to secure your seat.
                    </p>
                    <button
                      onClick={() => setSelectedWorkshop(null)}
                      className="mt-2 w-full py-2 bg-[#33691e] hover:bg-[#2e5c1b] text-white rounded-full font-bold text-[9px] uppercase tracking-widest transition-colors cursor-pointer border-none"
                    >
                      Close Window
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Full Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                        disabled={loading}
                        className="w-full px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Email Address</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                        disabled={loading}
                        className="w-full px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-semibold"
                      />
                    </div>

                    {error && <p className="text-[9px] font-bold text-red-600">{error}</p>}

                    <div className="pt-2 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedWorkshop(null)}
                        className="flex-1 py-3 border border-[#c2c6d6]/30 text-[#424754] hover:bg-gray-50 rounded-full font-bold text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 bg-[#0b1c30] hover:bg-[#d1f34d] hover:text-black text-[#d1f34d] rounded-full font-bold text-[10px] uppercase tracking-widest transition-colors disabled:opacity-50 cursor-pointer shadow-md"
                      >
                        {loading ? 'Processing...' : 'Reserve Seat'}
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
