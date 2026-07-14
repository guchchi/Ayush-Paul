import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FAQItem {
  q: string;
  a: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    q: 'What is Mastery?',
    a: 'Mastery is a skill acquisition ecosystem for builders. It combines self-paced courses, live workshops, and private 1-on-1 learning — all connected through your Digital Vault. Every course includes downloadable blueprints and templates you can deploy immediately.',
  },
  {
    q: 'Who is Mastery for?',
    a: 'Mastery is designed for students, creators, developers, founders, and builders who want to turn knowledge into real projects, products, and opportunities. Whether you are starting your first project or shipping your tenth product, there is a path for you.',
  },
  {
    q: 'How is this different from Udemy or Coursera?',
    a: 'Traditional platforms focus on passive video consumption and completion badges. Mastery focuses on capability acquisition. Every course includes companion blueprints (prompt packs, templates, workflows) that you can deploy immediately. Workshops are live and interactive. 1-on-1 sessions are private and tailored to your goals.',
  },
  {
    q: 'Do I need coding experience to start?',
    a: 'No. Courses are structured to start from fundamental concepts and progress to advanced configurations. Each course card shows a difficulty level so you can choose the right starting point.',
  },
  {
    q: 'How do courses, workshops, and 1-on-1 learning work together?',
    a: 'Each format serves a different need. Self-paced courses let you learn on your own schedule. Workshops give you live, cohort-based builds with real-time support. Private 1-on-1 sessions are fully tailored to your goals. You can use any combination depending on what works best for you.',
  },
  {
    q: 'How do I access my purchases?',
    a: 'Everything you purchase — courses, workshop recordings, blueprints, and templates — lives in your Digital Vault at /vault. Simply log in with your account to access your materials anytime, across any device.',
  },
  {
    q: 'What are Blueprints?',
    a: 'Blueprints are downloadable assets that accompany courses — prompt packs, code templates, automation workflows, design systems, and checklists. They are pre-built systems you can deploy immediately without setup.',
  },
  {
    q: 'What is the pricing model?',
    a: 'Mastery operates on a single-payment model. You pay once for each course, workshop, or private session. There are no subscriptions or recurring fees. 1-on-1 learning starts at ₹2,499 per session. All prices are in INR.',
  },
];

export const MasteryFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-16 md:py-20 px-6 text-left relative z-10 border-t border-[#c2c6d6]/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Intro/Title */}
          <div className="lg:col-span-5 text-left lg:sticky lg:top-36">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0b1c30] bg-[#d1f34d] px-4 py-1.5 rounded-full shadow-sm w-fit inline-block mb-4 select-none">
              FAQ
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30] mb-4">
              Questions worth asking
            </h2>

            <p className="text-[#424754] text-xs md:text-sm leading-relaxed font-medium max-w-sm">
              Everything you need to know about courses, live workshops, private training requests, and resource access.
            </p>
          </div>

          {/* RIGHT: Accordions */}
          <div className="lg:col-span-7 space-y-3.5 w-full">
            {FAQ_DATA.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className={cn(
                    "bg-white border rounded-2xl overflow-hidden transition-all duration-200 shadow-sm text-left",
                    isOpen ? "border-[#0b1c30]" : "border-[#c2c6d6]/35 hover:border-[#c2c6d6]/50"
                  )}
                >
                  {/* Question row - button header */}
                  <button
                    id={`faq-btn-${i}`}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    className="w-full px-6 py-5 flex items-center justify-between text-left gap-6 group cursor-pointer border-none bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1c30] rounded-2xl"
                  >
                    <span className="text-sm font-extrabold tracking-tight leading-snug text-[#0b1c30] flex-1">
                      {item.q}
                    </span>

                    {/* Toggle Icon */}
                    <span
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 border",
                        isOpen
                          ? "bg-[#f0fbe8] border-[#d1f34d] text-[#0b1c30]"
                          : "bg-bg-secondary border-[#c2c6d6]/20 text-[#424754]/60 group-hover:border-[#0b1c30]/20 group-hover:text-[#0b1c30]"
                      )}
                    >
                      {isOpen ? <Minus size={12} /> : <Plus size={12} />}
                    </span>
                  </button>

                  {/* Answer — animated */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${i}`}
                        role="region"
                        aria-labelledby={`faq-btn-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-6 pb-5 text-xs text-[#424754] font-medium leading-relaxed border-t border-[#c2c6d6]/10 pt-3">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
