import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users2, Clock, CheckCircle2, Video, Sparkles, AlertCircle, BadgeCheck, Mail, ArrowRight } from 'lucide-react';
import { db, collection, addDoc, serverTimestamp, getDocs, query, where, orderBy, onAuthStateChanged, auth } from '../../firebase';

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
  const [registeredWorkshopIds, setRegisteredWorkshopIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setRegisteredWorkshopIds(new Set());
      return;
    }
    const fetchRegistrations = async () => {
      try {
        const q = query(
          collection(db, 'workshop_registrations'),
          where('userId', '==', currentUser.uid)
        );
        const snap = await getDocs(q);
        const ids = new Set<string>();
        snap.docs.forEach(doc => {
          const data = doc.data();
          if (data.workshopId) ids.add(data.workshopId);
        });
        setRegisteredWorkshopIds(ids);
      } catch (e) {
        console.warn('Failed to fetch registrations:', e);
      }
    };
    fetchRegistrations();
  }, [currentUser]);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setDbLoading(true);
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

  // General workshop updates waitlist submission
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
        email: email.toLowerCase().trim(),
        userId: null,
        registrationType: 'waitlist',
        source: 'general_workshop_waitlist',
        registeredAt: serverTimestamp(),
        status: 'waitlist'
      });
      setWaitlistSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Workshop-specific seat registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkshop) return;

    const isLoggedIn = !!currentUser;
    if (isLoggedIn) {
      // FLOW 2: Logged-in user — register type
      try {
        setLoading(true);
        setError('');
        const payload = {
          name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Registered User',
          email: currentUser.email,
          userId: currentUser.uid,
          workshopId: selectedWorkshop.id,
          workshopName: selectedWorkshop.name || selectedWorkshop.title,
          registrationType: 'register' as const,
          source: 'workshop_seat_modal',
          registeredAt: serverTimestamp(),
          status: 'confirmed',
        };
        const regRef = await addDoc(collection(db, 'workshop_registrations'), payload);
        setRegSuccess(true);
        setRegName('');
        setRegEmail('');
        setRegisteredWorkshopIds(prev => new Set(prev).add(selectedWorkshop.id));
        
        // Trigger confirmation email
        fetch('/api/workshop-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'send-confirmation',
            workshopId: selectedWorkshop.id,
            registrationId: regRef.id,
          }),
        }).catch((e) => console.warn('[Workshops] Confirmation email trigger failed:', e));
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
          name: regName.trim(),
          email: regEmail.toLowerCase().trim(),
          userId: null,
          workshopId: selectedWorkshop.id,
          workshopName: selectedWorkshop.name || selectedWorkshop.title,
          registrationType: 'waitlist' as const,
          source: 'workshop_seat_modal',
          registeredAt: serverTimestamp(),
          status: 'waitlist',
        };
        const guestRegRef = await addDoc(collection(db, 'workshop_registrations'), payload);
        setRegSuccess(true);
        setRegName('');
        setRegEmail('');
        
        // Trigger confirmation email
        fetch('/api/workshop-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'send-confirmation',
            workshopId: selectedWorkshop.id,
            registrationId: guestRegRef.id,
          }),
        }).catch((e) => console.warn('[Workshops] Confirmation email trigger failed:', e));
      } catch (err) {
        console.error(err);
        setError('Failed to join waitlist. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOpenRegistrationModal = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setRegSuccess(false);
    setError('');
  };

  return (
    <section 
      className="py-16 md:py-20 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20 scroll-mt-24"
      id="upcoming-workshops-section"
    >
      {/* Background radial soft light */}
      <div className="absolute top-[20%] right-[10%] w-80 h-80 bg-[#0058be]/5 rounded-full filter blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end mb-12 text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-4">
            <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full" />
            <span className="tracking-[0.2em]">Cohort Builds</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]">
            Live Workshops
          </h2>
        </div>

        <p className="text-[#424754] text-sm md:text-base leading-relaxed font-medium">
          Watch live technical audits, configure complex systems, and code production integrations with real-time support.
        </p>
      </div>

      {/* ── WORKSHOPS RENDER LOGIC ── */}
      {dbLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-16">
          <div className="h-64 bg-white border border-gray-100 rounded-[32px] animate-pulse" />
          <div className="h-64 bg-white border border-gray-100 rounded-[32px] animate-pulse" />
        </div>
      ) : workshops.length === 0 ? (
        /* Empty State */
        <div className="w-full py-16 px-8 bg-white border border-[#c2c6d6]/20 rounded-[32px] shadow-sm text-center mb-16">
          <div className="max-w-md mx-auto flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-[#c2c6d6]/20 flex items-center justify-center text-[#424754]/40 mb-4">
              <Video size={24} />
            </div>
            <h3 className="text-lg font-extrabold text-[#0b1c30] tracking-tight mb-2">No live workshops scheduled</h3>
            <p className="text-xs text-[#424754] font-semibold leading-relaxed">
              New sessions will appear here when they are announced. Register below to be notified.
            </p>
          </div>
        </div>
      ) : workshops.length === 1 ? (
        /* One Upcoming Workshop: Focused Featured-Event Layout */
        (() => {
          const workshop = workshops[0];
          const isReserved = currentUser && registeredWorkshopIds.has(workshop.id);
          return (
            <div className="bg-white border border-[#c2c6d6]/30 rounded-[32px] shadow-sm p-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-stretch mb-16 text-left transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:hover:-translate-y-[2px] motion-safe:hover:border-[#0b1c30]/40 motion-safe:hover:shadow-md">
              {/* Left Details Column */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest text-[#0b1c30] px-2.5 py-0.5 rounded-full bg-[#0b1c30]/5 border border-[#0b1c30]/10">
                      Featured Workshop
                    </span>
                    {workshop.category && (
                      <span className="px-2.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider bg-white border border-[#c2c6d6]/35 text-[#0b1c30]">
                        {workshop.category}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-extrabold text-[#0b1c30] tracking-tight leading-snug mb-2">
                    {workshop.name || workshop.title}
                  </h3>
                  <p className="text-sm text-[#424754] font-bold leading-relaxed mb-4">
                    {workshop.topic}
                  </p>
                  {workshop.description && (
                    <p className="text-xs text-[#424754]/85 leading-relaxed font-medium mb-6">
                      {workshop.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#424754]">
                    <Calendar size={14} className="text-[#0b1c30]/50" />
                    <span>Date: {workshop.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#424754]">
                    <Clock size={14} className="text-[#0b1c30]/50" />
                    <span>Time: {workshop.time || 'To be announced'} ({workshop.duration || '2 hours'})</span>
                  </div>
                </div>
              </div>

              {/* Right Action Column */}
              <div className="w-full md:w-[320px] bg-gray-50 border border-gray-100 p-6 rounded-2xl flex flex-col justify-between shrink-0">
                <div className="space-y-4">
                  <div className="text-center md:text-left">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#424754]/65 block mb-1">Price</span>
                    <span className="text-2xl font-extrabold text-[#0b1c30]">
                      {workshop.isFree ? <span className="text-[#558b2f]">FREE</span> : `₹${(workshop.price || 0).toLocaleString('en-IN')}`}
                    </span>
                  </div>

                  <div className="space-y-2 pt-2 text-[11px] font-semibold text-[#424754]/85 border-t border-gray-200/50">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-[#2e7d32]" />
                      <span>Led by {workshop.instructor || 'Ayush Paul'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-[#2e7d32]" />
                      <span>Live Q&A and coding session</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-[#2e7d32]" />
                      <span>Recording added to Vault</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => handleOpenRegistrationModal(workshop)}
                    disabled={isReserved}
                    className={`w-full py-3 rounded-full font-bold text-[10px] uppercase tracking-widest transition-colors cursor-pointer shadow-sm ${
                      isReserved
                        ? 'bg-[#e1f7d2] text-[#33691e] border border-[#c0e8a7] cursor-default'
                        : 'bg-[#0b1c30] hover:bg-black text-white border-none'
                    }`}
                  >
                    {isReserved ? 'Seat Reserved' : currentUser ? 'Reserve Seat' : 'Join Waitlist'}
                  </button>
                </div>
              </div>
            </div>
          );
        })()
      ) : (
        /* Multiple Workshops: Intentional Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-16">
          {workshops.map((workshop, idx) => {
            const isReserved = currentUser && registeredWorkshopIds.has(workshop.id);
            return (
              <div
                key={workshop.id}
                className="p-6 bg-white border border-[#c2c6d6]/30 rounded-[32px] shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:hover:-translate-y-[2px] motion-safe:hover:border-[#0b1c30]/40 motion-safe:hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-[8.5px] font-extrabold uppercase tracking-widest text-[#0b1c30] px-2.5 py-0.5 rounded-full bg-[#0b1c30]/5 border border-[#0b1c30]/10">
                      <Sparkles size={10} /> Live Workshop
                    </span>
                    {workshop.category && (
                      <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-white border border-[#c2c6d6]/35 text-[#0b1c30]">
                        {workshop.category}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-[#0b1c30] tracking-tight leading-snug mb-1">
                    {workshop.name || workshop.title}
                  </h3>
                  <p className="text-xs text-[#424754] font-bold leading-relaxed mb-4">
                    {workshop.topic}
                  </p>

                  <div className="grid grid-cols-2 gap-3 bg-gray-50 border border-gray-100 p-4 rounded-xl mb-6">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#424754]">
                      <Calendar size={12} className="text-[#0b1c30]/50" />
                      <span>{workshop.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#424754]">
                      <Clock size={12} className="text-[#0b1c30]/50" />
                      <span>{workshop.duration || '2 hours'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs font-extrabold text-[#0b1c30]">
                    {workshop.isFree ? <span className="text-[#558b2f]">FREE</span> : `₹${(workshop.price || 0).toLocaleString('en-IN')}`}
                  </span>
                  <button
                    onClick={() => handleOpenRegistrationModal(workshop)}
                    disabled={isReserved}
                    className={`px-5 py-2 rounded-full font-bold text-[8.5px] uppercase tracking-widest transition-colors cursor-pointer shadow-sm ${
                      isReserved
                        ? 'bg-[#e1f7d2] text-[#33691e] border border-[#c0e8a7] cursor-default'
                        : 'bg-[#0b1c30] hover:bg-black text-white border-none'
                    }`}
                  >
                    {isReserved ? 'Reserved' : currentUser ? 'Reserve Seat' : 'Join Waitlist'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── NEWSLETTER / WORKSHOP UPDATE CARD ── */}
      <div className="max-w-xl mx-auto p-8 bg-white border border-[#c2c6d6]/30 rounded-[32px] shadow-sm text-center">
        <div className="flex flex-col items-center max-w-sm mx-auto space-y-4">
          <div className="w-10 h-10 rounded-xl bg-[#0058be]/5 border border-[#0058be]/10 text-[#0058be] flex items-center justify-center">
            <Mail size={18} />
          </div>
          <h3 className="text-lg font-extrabold text-[#0b1c30] tracking-tight">
            Get Live Workshop Updates
          </h3>
          <p className="text-xs text-[#424754] font-semibold leading-relaxed">
            Receive instant notifications when new live cohort builds and technical audits are announced.
          </p>

          {waitlistSuccess ? (
            <div className="p-3 bg-[#e1f7d2] border border-[#c0e8a7] text-[#33691e] rounded-2xl flex items-center gap-2 text-xs font-bold w-full justify-center animate-fadeIn">
              <CheckCircle2 size={16} />
              <span>You have registered for workshop updates!</span>
            </div>
          ) : (
            <form onSubmit={handleWaitlistSubmit} className="space-y-3.5 w-full pt-2 text-left">
              <div className="space-y-1">
                <label htmlFor="newsletter-email" className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Email Address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={loading}
                  className="w-full px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-semibold"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0b1c30] hover:bg-black text-white rounded-full font-bold text-[10px] uppercase tracking-widest transition-colors disabled:opacity-50 cursor-pointer shadow-sm border-none"
              >
                {loading ? 'Submitting...' : 'Get workshop updates'}
              </button>
            </form>
          )}
          {error && <p className="text-[10px] font-bold text-red-600 mt-1">{error}</p>}
        </div>
      </div>

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
                aria-label="Close modal"
              >
                ✕
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Video size={18} className="text-[#0058be]" />
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
                    <span className="text-[#424754]">Price:</span>
                    <span>{selectedWorkshop.isFree ? 'FREE' : `₹${(selectedWorkshop.price || 0).toLocaleString('en-IN')}`}</span>
                  </div>
                </div>

                {regSuccess || (currentUser && selectedWorkshop && registeredWorkshopIds.has(selectedWorkshop.id)) ? (
                  <div className="p-4 bg-[#e1f7d2] border border-[#c0e8a7] text-[#33691e] rounded-2xl space-y-2 text-xs font-bold animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      <span>{currentUser ? 'Seat Reserved!' : 'Waitlist Joined!'}</span>
                    </div>
                    <p className="font-semibold text-[#33691e]/80 text-[11px] leading-relaxed">
                      {currentUser
                        ? 'Your seat has been reserved. The workshop will appear in your Vault when it goes live.'
                        : 'You have been added to the waitlist. We will notify you at the email address provided.'}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedWorkshop(null);
                        setRegSuccess(false);
                      }}
                      className="mt-2 w-full py-2 bg-[#33691e] hover:bg-[#2e5c1b] text-white rounded-full font-bold text-[9px] uppercase tracking-widest transition-colors cursor-pointer border-none"
                    >
                      Close
                    </button>
                  </div>
                ) : currentUser ? (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="p-4 bg-[#eff4ff] border border-[#dce9ff] rounded-2xl space-y-2">
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
                        className="flex-1 py-3 bg-[#0b1c30] hover:bg-black text-white rounded-full font-bold text-[10px] uppercase tracking-widest transition-colors disabled:opacity-50 cursor-pointer shadow-md border-none"
                      >
                        {loading ? 'Processing...' : 'Confirm Reservation'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label htmlFor="reg-name" className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Full Name</label>
                      <input
                        id="reg-name"
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
                      <label htmlFor="reg-email" className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Email Address</label>
                      <input
                        id="reg-email"
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
                        className="flex-1 py-3 bg-[#0b1c30] hover:bg-black text-white rounded-full font-bold text-[10px] uppercase tracking-widest transition-colors disabled:opacity-50 cursor-pointer shadow-md border-none"
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
