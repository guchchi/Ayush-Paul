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
    <section className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20">
      
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end mb-14 text-left">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-secondary border border-[#c2c6d6]/20 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-6"
          >
            <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full" />
            <span className="tracking-[0.22em]">FAQ</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]"
          >
            Questions Worth<br />
            Asking
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#424754] text-base leading-relaxed font-medium"
        >
          Everything you need to know about courses, live workshops, private training requests, and resource access.
        </motion.p>
      </div>

      {/* Accordion list */}
      <div className="space-y-4">
        {FAQ_DATA.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.35, delay: 0.05 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "bg-white border rounded-[24px] overflow-hidden transition-all duration-300 shadow-sm text-left",
                isOpen ? "border-[#0b1c30] ring-1 ring-[#0b1c30]/10" : "border-[#c2c6d6]/35 hover:border-[#c2c6d6]/55"
              )}
            >
              {/* Question row */}
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full px-8 py-6 flex items-center justify-between text-left gap-6 group cursor-pointer border-none bg-transparent"
              >
                <span
                  className={cn(
                    "text-base font-extrabold tracking-tight leading-snug transition-colors duration-200 flex-1",
                    isOpen ? "text-[#0b1c30]" : "text-[#0b1c30]"
                  )}
                >
                  {item.q}
                </span>

                {/* +/− toggle icon */}
                <span
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 border",
                    isOpen
                      ? "bg-[#d1f34d] border-[#c0e045] text-[#0b1c30]"
                      : "bg-bg-secondary border-[#c2c6d6]/20 text-[#424754]/60 group-hover:border-[#d1f34d]/30 group-hover:text-[#d1f34d]"
                  )}
                >
                  {isOpen ? <Minus size={13} /> : <Plus size={13} />}
                </span>
              </button>

              {/* Answer — animated */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-8 pb-6 text-xs text-[#424754] font-semibold leading-relaxed">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

    </section>
  );
};
