import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users2, Clock, CheckCircle2, Video, Sparkles, AlertCircle, BadgeCheck, MapPin } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { auth, onAuthStateChanged, db, collection, addDoc, serverTimestamp, getDocs, query, where, orderBy } from '../../firebase';

export interface Workshop {
  id: string;
  name?: string;
  title?: string;
  topic?: string;
  date: string;
  time?: string;
  duration?: string;
  totalSeats?: number;
  seatsLeft?: number;
  urgencyText?: string;
  price?: number;
  isFree?: boolean;
  status?: string;
  category?: string;
  instructor?: string;
  meetingLink?: string;
  meetingPassword?: string;
  workshopStartTime?: string;
  workshopStatus?: string;
  description?: string;
  maxParticipants?: number;
  tags?: string[];
  thumbnail?: string;
}

const DEFAULT_WORKSHOPS: Workshop[] = [
  {
    id: 'workshop-ai-agents',
    name: 'AI Automation Bootcamp',
    title: 'AI Automation Bootcamp',
    topic: 'Building & Deploying Autonomous Research Agents',
    description: 'Join Ayush for a live 2-hour workshop where you\'ll build a functional AI agent from scratch using LangChain, OpenAI, and FastAPI. Covers tool calling, memory, and deployment.',
    date: 'Coming Soon — Q3 2026',
    time: 'To be announced',
    duration: '2 hours',
    totalSeats: 50,
    seatsLeft: 50,
    status: 'UPCOMING',
    category: 'AI & Automation',
    instructor: 'Ayush Paul',
    meetingLink: '',
    price: 0,
    isFree: true,
    tags: ['AI Agents', 'LangChain', 'Python', 'Live Workshop'],
  },
  {
    id: 'workshop-cursor-mastery',
    name: 'Cursor AI Mastery',
    title: 'Cursor AI Mastery',
    topic: 'Ship a Feature in 60 Minutes with AI-Assisted Development',
    description: 'Watch Ayush ship a complete feature using Cursor AI in under 60 minutes. Learn prompt patterns, Composer workflows, and how to integrate AI into your daily development loop.',
    date: 'Coming Soon — Q3 2026',
    time: 'To be announced',
    duration: '1 hour',
    totalSeats: 100,
    seatsLeft: 100,
    status: 'UPCOMING',
    category: 'Development',
    instructor: 'Ayush Paul',
    meetingLink: '',
    price: 0,
    isFree: true,
    tags: ['Cursor AI', 'AI-Assisted Development', 'Live Coding'],
  },
  {
    id: 'workshop-saas-launch',
    name: 'SaaS Launch Blueprint',
    title: 'SaaS Launch Blueprint',
    topic: 'From Idea to First Customer — Full SaaS Launch Process',
    description: 'A 3-hour intensive workshop covering the entire SaaS launch process: idea validation, tech stack selection, MVP build, Stripe integration, and go-to-market strategy.',
    date: 'Coming Soon — Q4 2026',
    time: 'To be announced',
    duration: '3 hours',
    totalSeats: 25,
    seatsLeft: 25,
    status: 'UPCOMING',
    category: 'Business & SaaS',
    instructor: 'Ayush Paul',
    meetingLink: '',
    price: 49,
    isFree: false,
    tags: ['SaaS', 'Launch', 'Startup', 'Business'],
  },
  {
    id: 'workshop-seo-audit',
    name: 'Live Technical SEO Audit',
    title: 'Live Technical SEO Audit',
    topic: 'Real Site Walkthrough — Crawl, Fix, Optimize',
    description: 'Ayush performs a live technical SEO audit on a real volunteer\'s website. You\'ll learn exactly how to identify crawl issues, fix structured data, optimize Core Web Vitals, and more.',
    date: 'Coming Soon — Q4 2026',
    time: 'To be announced',
    duration: '2 hours',
    totalSeats: 50,
    seatsLeft: 50,
    status: 'UPCOMING',
    category: 'SEO & Growth',
    instructor: 'Ayush Paul',
    meetingLink: '',
    price: 0,
    isFree: true,
    tags: ['SEO', 'Technical Audit', 'Live Demo'],
  },
];

const mapFirestoreWorkshop = (doc: any): Workshop => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.title || data.name || 'Untitled Workshop',
    title: data.title || data.name || 'Untitled Workshop',
    topic: data.topic || data.description?.slice(0, 80) || 'Workshop topic to be announced',
    description: data.description || '',
    date: data.date || 'Coming Soon',
    time: data.time || 'To be announced',
    duration: data.duration || '2 hours',
    totalSeats: data.maxParticipants || data.totalSeats || 50,
    seatsLeft: data.seatsLeft ?? data.maxParticipants ?? 50,
    status: data.workshopStatus || data.status || 'UPCOMING',
    workshopStatus: data.workshopStatus || data.status || 'UPCOMING',
    category: data.category || 'General',
    instructor: data.instructor || 'Ayush Paul',
    meetingLink: data.meetingLink || data.zoomLink || '',
    meetingPassword: data.meetingPassword || '',
    price: data.price ?? 0,
    isFree: data.isFree ?? true,
    tags: data.tags || [],
    thumbnail: data.thumbnail || '',
  };
};

export const MasteryWorkshops = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>(DEFAULT_WORKSHOPS);
  const [dbLoading, setDbLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      console.log('[Workshops] Auth state changed:', { isLoggedIn: !!user, uid: user?.uid, email: user?.email });
    });
    return unsub;
  }, []);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const q = query(
          collection(db, 'workshops'),
          where('isPublished', '==', true),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const firestoreWorkshops = snap.docs.map(mapFirestoreWorkshop);
          setWorkshops(firestoreWorkshops);
        }
      } catch (e) {
        console.warn('Failed to load workshops from Firestore, using defaults:', e);
      } finally {
        setDbLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  // General waitlist submission (guests only — always waitlist type)
  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log('[Workshops] General waitlist submit:', { email, userId: null, registrationType: 'waitlist' });
      await addDoc(collection(db, 'workshop_registrations'), {
        email,
        userId: null,
        registrationType: 'waitlist',
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

  // Workshop-specific registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkshop) return;

    const isLoggedIn = !!currentUser;
    console.log('[Workshops] Registration payload:', {
      workshopId: selectedWorkshop.id,
      workshopName: selectedWorkshop.name,
      isLoggedIn,
      authUid: currentUser?.uid,
      authEmail: currentUser?.email,
      formName: regName,
      formEmail: regEmail,
    });

    if (isLoggedIn) {
      // FLOW 2: Logged-in user — registered type with userId
      if (!currentUser?.email) {
        setError('No email found on your account. Please update your profile.');
        return;
      }
      try {
        setLoading(true);
        setError('');
        const payload = {
          name: currentUser.displayName || regName || 'Workshop Participant',
          email: currentUser.email,
          userId: currentUser.uid,
          workshopId: selectedWorkshop.id,
          workshopName: selectedWorkshop.name,
          registrationType: 'registered' as const,
          source: 'workshop_seat_modal',
          registeredAt: serverTimestamp(),
          status: 'registered',
        };
        console.log('[Workshops] Registered user booking:', payload);
        await addDoc(collection(db, 'workshop_registrations'), payload);
        setRegSuccess(true);
        setRegName('');
        setRegEmail('');
      } catch (err) {
        console.error(err);
        setError('Failed to register. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // FLOW 1: Guest user — waitlist type, no userId
      if (!regName || !regEmail || !regEmail.includes('@')) {
        setError('Please provide valid registration details.');
        return;
      }
      try {
        setLoading(true);
        setError('');
        const payload = {
          name: regName,
          email: regEmail,
          userId: null,
          workshopId: selectedWorkshop.id,
          workshopName: selectedWorkshop.name,
          registrationType: 'waitlist' as const,
          source: 'workshop_seat_modal',
          registeredAt: serverTimestamp(),
          status: 'waitlist',
        };
        console.log('[Workshops] Guest waitlist booking:', payload);
        await addDoc(collection(db, 'workshop_registrations'), payload);
        setRegSuccess(true);
        setRegName('');
        setRegEmail('');
      } catch (err) {
        console.error(err);
        setError('Failed to join waitlist. Please try again.');
      } finally {
        setLoading(false);
      }
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
        {workshops.map((workshop, idx) => (
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
                {workshop.status === 'UPCOMING' ? (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#f57f17] px-2.5 py-0.5 rounded-full bg-[#fff8e1] border border-[#ffe082]">
                    <Sparkles size={11} /> Upcoming
                  </span>
                ) : workshop.status === 'LIVE' ? (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-green-700 px-2.5 py-0.5 rounded-full bg-green-50 border border-green-200">
                    <BadgeCheck size={11} className="animate-pulse" /> Live Now
                  </span>
                ) : (
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#424754]/50 px-2.5 py-0.5 rounded-full bg-gray-50 border border-gray-200">
                    Completed
                  </span>
                )}
                
                {workshop.urgencyText && (
                  <span className="flex items-center gap-1 text-[9px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-full px-2.5 py-0.5">
                    <AlertCircle size={10} />
                    {workshop.urgencyText}
                  </span>
                )}

                <span className="text-[8px] font-bold text-[#424754]/40 uppercase tracking-wider">
                  {workshop.duration}
                </span>
              </div>

              {/* Title & Topic */}
              <h3 className="text-xl font-extrabold text-[#0b1c30] tracking-tight leading-snug mb-2">
                {workshop.name || workshop.title}
              </h3>
              <p className="text-xs text-[#424754] font-semibold leading-relaxed mb-3">
                {workshop.topic}
              </p>

              {/* Description */}
              {workshop.description && (
                <p className="text-[10px] text-[#424754]/70 leading-relaxed font-medium mb-6 line-clamp-2">
                  {workshop.description}
                </p>
              )}

              {/* Category Tag */}
              {workshop.category && (
                <div className="mb-4">
                  <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-[#eff4ff] border border-[#dce9ff] text-[#0058be]">
                    {workshop.category}
                  </span>
                </div>
              )}

              {/* Details Row */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50/50 border border-gray-100/50 p-4.5 rounded-2xl mb-8">
                <div className="flex items-center gap-2 text-xs font-bold text-[#424754]">
                  <Calendar size={13} className="text-[#d1f34d]" />
                  <span>{workshop.date}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#424754]">
                  <Clock size={13} className="text-[#d1f34d]" />
                  <span>{workshop.time || 'To be announced'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#424754] col-span-2 border-t border-[#c2c6d6]/10 pt-2.5 mt-1">
                  <Users2 size={13} className="text-[#d1f34d]" />
                  <span>{workshop.totalSeats || 50} seats total{workshop.seatsLeft != null ? ` • ${workshop.seatsLeft} left` : ''}</span>
                </div>
              </div>

              {/* Instructor */}
              {workshop.instructor && (
                <div className="flex items-center gap-1.5 mb-4 text-[10px] font-bold text-[#424754]/60">
                  <BadgeCheck size={11} className="text-[#0058be]" />
                  <span>Led by {workshop.instructor}</span>
                </div>
              )}
            </div>

            {/* Bottom Register Action */}
            <div className="flex items-center justify-between pt-4 border-t border-[#c2c6d6]/10">
              <span className="text-sm font-extrabold text-[#0b1c30]">
                {workshop.isFree ? (
                  <span className="text-[#558b2f]">FREE</span>
                ) : (
                  `₹${(workshop.price || 0).toLocaleString('en-IN')}`
                )}
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
                  {currentUser ? 'Reserve Seat' : 'Join Waitlist'}
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
                    <span>{selectedWorkshop.time || 'To be announced'}</span>
                  </div>
                  <div className="text-xs font-bold text-[#0b1c30] flex justify-between">
                    <span className="text-[#424754]">Link:</span>
                    <span>{selectedWorkshop.meetingLink ? 'Available after registration' : 'To be announced'}</span>
                  </div>
                  <div className="text-xs font-bold text-[#0b1c30] flex justify-between">
                  <span className="text-[#424754]">Price:</span>
                  <span>{selectedWorkshop.isFree ? 'FREE' : `₹${(selectedWorkshop.price || 0).toLocaleString('en-IN')}`}</span>
                  </div>
                </div>

                {regSuccess ? (
                  <div className="p-4 bg-[#e1f7d2] border border-[#c0e8a7] text-[#33691e] rounded-2xl space-y-2 text-xs font-bold animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      <span>{currentUser ? 'Seat Reserved!' : 'Waitlist Joined!'}</span>
                    </div>
                    <p className="font-semibold text-[#33691e]/80 text-[11px] leading-relaxed">
                      {currentUser
                        ? 'Your seat has been reserved. The workshop will appear in your Vault when it goes live.'
                        : 'You have been added to the waitlist. We will notify you at the provided email address when the workshop goes live.'}
                    </p>
                    <button
                      onClick={() => setSelectedWorkshop(null)}
                      className="mt-2 w-full py-2 bg-[#33691e] hover:bg-[#2e5c1b] text-white rounded-full font-bold text-[9px] uppercase tracking-widest transition-colors cursor-pointer border-none"
                    >
                      Close
                    </button>
                  </div>
                ) : currentUser ? (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#0b1c30]">
                        <BadgeCheck size={14} className="text-[#0058be]" />
                        <span>Registering as {currentUser.displayName || currentUser.email}</span>
                      </div>
                      <p className="text-[10px] text-[#424754] font-medium">
                        Your seat will be linked to your account and appear in your Vault.
                      </p>
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
                        {loading ? 'Processing...' : 'Confirm Reservation'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                      <p className="text-[10px] text-[#424754] font-medium">
                        Enter your details to join the waitlist. You will receive workshop access via email.
                      </p>
                    </div>

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
                        {loading ? 'Processing...' : 'Join Waitlist'}
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
