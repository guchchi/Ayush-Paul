import React, { useState } from 'react';
import { MessageSquare, CheckCircle, Send, ArrowRight } from 'lucide-react';

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

export const MasteryMentorship = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState(TOPICS[0]);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const buildWhatsAppMessage = () => {
    const lines = [
      `*New 1-on-1 Session Request*`,
      ``,
      `Name     : ${name}`,
      `Contact  : ${phone}`,
      `Topic    : ${topic}`,
      ``,
      `*Description*`,
      description,
    ];
    return lines.join('\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !topic || !description) return;

    setSubmitting(true);
    
    // Simulate short submission visual transition, then redirect
    setTimeout(() => {
      const message = buildWhatsAppMessage();
      const encoded = encodeURIComponent(message);
      const url = `https://wa.me/${ADMIN_WHATSAPP}?text=${encoded}`;
      
      setSubmitting(false);
      setSuccess(true);
      window.open(url, '_blank');
    }, 800);
  };

  const sessionFeatures = [
    { text: 'Direct live consultation via WhatsApp' },
    { text: 'Custom skill and career roadmap guidance' },
    { text: 'Practical architecture feedback and review' },
  ];

  return (
    <section
      className="py-16 md:py-20 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20 scroll-mt-24"
      id="learn-directly-with-ayush"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* LEFT COLUMN: Context & Expectations */}
        <div className="lg:col-span-7 text-left space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d1f34d] text-[10px] font-bold uppercase tracking-[0.2em] text-[#0b1c30] shadow-sm mb-4 w-fit select-none">
              <span className="w-1.5 h-1.5 bg-[#0b1c30] rounded-full" />
              <span>1-on-1 Mentorship</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30] mb-4">
              Learn Directly With Ayush
            </h2>

            <p className="text-[#424754] text-sm md:text-base leading-relaxed font-medium max-w-xl">
              Get personalized roadmaps, project advice, and live consultation on engineering or design challenges. Share your context below, and we will open a direct WhatsApp conversation to discuss your goals.
            </p>
          </div>

          {/* Expectations list */}
          <div className="p-6 bg-white border border-[#c2c6d6]/30 rounded-[24px] shadow-sm max-w-xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:hover:-translate-y-[2px] motion-safe:hover:shadow-md">
            <h3 className="text-sm font-extrabold text-[#0b1c30] tracking-tight mb-4">
              What to Expect
            </h3>
            <div className="space-y-3">
              {sessionFeatures.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-center text-[#0058be] shrink-0">
                    <CheckCircle size={12} />
                  </div>
                  <span className="text-xs font-semibold text-[#424754]">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Coherent Application Form */}
        <div className="lg:col-span-5 w-full">
          <div className="p-8 bg-white border border-[#c2c6d6]/30 rounded-[32px] shadow-sm text-left relative overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:hover:-translate-y-[2px] motion-safe:hover:shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={16} className="text-[#0058be]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/75">Session Request Form</span>
            </div>

            <h3 className="text-base font-extrabold text-[#0b1c30] tracking-tight mb-2">
              Request a 1-on-1 Session
            </h3>
            <p className="text-xs text-[#424754] font-medium leading-relaxed mb-6">
              Provide your details below to prepare your request. We will pre-fill a WhatsApp message to start our session.
            </p>

            {success ? (
              <div className="p-5 bg-[#e1f7d2] border border-[#c0e8a7] text-[#33691e] rounded-2xl space-y-2 text-xs font-bold animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>Request Opened in WhatsApp!</span>
                </div>
                <p className="font-semibold text-[#33691e]/85 leading-relaxed">
                  If the window did not open, you can submit the form again to try launching WhatsApp.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-3 px-4 py-2 bg-[#33691e] hover:bg-[#2e5c1b] text-white rounded-full font-bold text-[9px] uppercase tracking-widest transition-colors cursor-pointer border-none shadow-sm"
                >
                  Request Another Session
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="mentor-name" className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Full Name <span className="text-red-400">*</span></label>
                  <input
                    id="mentor-name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-xs bg-white border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0058be] text-[#0b1c30] font-semibold transition-all duration-300 focus:shadow-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="mentor-phone" className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">WhatsApp Number <span className="text-red-400">*</span></label>
                  <input
                    id="mentor-phone"
                    type="tel"
                    placeholder="e.g. +91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-xs bg-white border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0058be] text-[#0b1c30] font-semibold transition-all duration-300 focus:shadow-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="mentor-topic" className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Topic of Discussion <span className="text-red-400">*</span></label>
                  <select
                    id="mentor-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-xs bg-white border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#0058be] text-[#0b1c30] font-semibold transition-all duration-300 focus:shadow-sm"
                  >
                    {TOPICS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="mentor-desc" className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Problem Description <span className="text-red-400">*</span></label>
                  <textarea
                    id="mentor-desc"
                    placeholder="Describe the specific engineering, design, or career blocker you want to solve."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-4 py-3 text-xs bg-white border border-[#c2c6d6]/40 rounded-2xl focus:outline-none focus:border-[#0058be] text-[#0b1c30] font-semibold resize-none transition-all duration-300 focus:shadow-sm"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-[#0b1c30] hover:bg-[#1a3050] text-white rounded-full font-bold text-[10px] uppercase tracking-widest transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center gap-2 cursor-pointer shadow-sm border-none disabled:opacity-50"
                  >
                    <Send size={12} className="text-[#d1f34d]" />
                    {submitting ? 'Preparing Session...' : 'Request a Session'}
                    <ArrowRight size={12} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
