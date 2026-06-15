import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Sparkles, CheckCircle2, Phone, Calendar, Clock, ArrowRight } from 'lucide-react';

const ADMIN_WHATSAPP = '7678688826';

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
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
  '5:00 PM - 6:00 PM',
  '6:00 PM - 7:00 PM',
  '7:00 PM - 8:00 PM',
  '8:00 PM - 9:00 PM',
];

export const MasteryMentorship = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState(TOPICS[0]);
  const [description, setDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState(TIME_SLOTS[0]);

  const buildWhatsAppMessage = () => {
    const lines = [
      `*New 1-on-1 Session Request*`,
      ``,
      `Name     : ${name}`,
      `Contact  : ${phone || 'Not provided'}`,
      `Topic    : ${topic}`,
      ``,
      `Date     : ${preferredDate}`,
      `Time     : ${preferredTime} (IST)`,
      ``,
      `*Description*`,
      description,
    ];
    return lines.join('\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !topic || !description || !preferredDate || !preferredTime) return;

    const message = buildWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${ADMIN_WHATSAPP}?text=${encoded}`;
    window.open(url, '_blank');
  };

  const sessionFeatures = [
    { icon: <MessageSquare size={16} />, text: 'WhatsApp-based live consultation' },
    { icon: <Sparkles size={16} />, text: 'Custom roadmap guidance' },
    { icon: <CheckCircle2 size={16} />, text: 'Fast response within 24 hours' },
  ];

  return (
    <section
      className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20 scroll-mt-24"
      id="learn-directly-with-ayush"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* LEFT COLUMN: Session info + description */}
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
              Personalized 1-on-1 guidance for growth, projects, or career — delivered directly on WhatsApp. Share your context, and we will craft a custom roadmap together.
            </motion.p>
          </div>

          {/* Session Features Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 bg-white border border-[#c2c6d6]/30 rounded-[24px] shadow-sm"
          >
            <h3 className="text-base font-extrabold text-[#0b1c30] tracking-tight mb-4">
              1:1 Mentorship Session
            </h3>
            <div className="space-y-3">
              {sessionFeatures.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#d1f34d]/10 border border-[#d1f34d]/20 flex items-center justify-center text-[#d1f34d] shrink-0">
                    {f.icon}
                  </div>
                  <span className="text-xs font-semibold text-[#424754]">{f.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: WhatsApp Request Form */}
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
              <MessageSquare size={16} className="text-[#d1f34d]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/70">WhatsApp Session</span>
            </div>

            <h3 className="text-lg font-extrabold text-[#0b1c30] tracking-tight mb-2">
              Request a 1-on-1 Session
            </h3>
            <p className="text-xs text-[#424754] font-semibold leading-relaxed mb-6">
              Fill out the form below and we will open WhatsApp with a pre-filled message. Send it and we will take it from there.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Full Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-semibold transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">WhatsApp Number <span className="text-[#424754]/40">(optional)</span></label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#424754]/30" />
                  <input
                    type="tel"
                    placeholder="+91 9XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-semibold transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Topic <span className="text-red-400">*</span></label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-semibold transition-colors"
                >
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Problem Description <span className="text-red-400">*</span></label>
                <textarea
                  placeholder="What specific problem or goal would you like help with?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-2xl focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-semibold resize-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Preferred Date <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#424754]/30 pointer-events-none" />
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-9 pr-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-semibold transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Preferred Time <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Clock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#424754]/30 pointer-events-none z-10" />
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      required
                      className="w-full pl-9 pr-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0b1c30] text-[#0b1c30] font-semibold transition-colors"
                    >
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#075e54] hover:bg-[#064a43] text-white rounded-full font-bold text-[11px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-md hover:shadow-lg hover:shadow-[#075e54]/20 hover:-translate-y-0.5 border-none"
                >
                  <MessageSquare size={15} />
                  Request Session on WhatsApp
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Trust microcopy */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-[#424754]/60">
                  <CheckCircle2 size={11} className="text-[#2e7d32]" />
                  <span>We respond within 24 hours</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-semibold text-[#424754]/60">
                  <CheckCircle2 size={11} className="text-[#2e7d32]" />
                  <span>Limited weekly slots available</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-semibold text-[#424754]/60">
                  <CheckCircle2 size={11} className="text-[#2e7d32]" />
                  <span>Session confirmed after discussion</span>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
