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
    q: 'What makes Mastery different from traditional online course platforms?',
    a: 'Traditional platforms prioritize passive video consumption and course completion badges. Mastery focuses entirely on capability acquisition. We provide self-paced courses, live interactive workshops, and 1-on-1 sessions backed by downloadable, ready-to-deploy boilerplates so you can build real systems immediately.',
  },
  {
    q: 'Do I need advanced coding knowledge to start learning?',
    a: 'No. Our courses and workshops are structured to start from fundamental concepts (like color systems or basic API routes) and progress to advanced configurations (like autonomous agent scrapers and Next.js database syncing). Course cards show difficulty levels to help you choose.',
  },
  {
    q: 'Are the blueprints and codebases included in the course price?',
    a: 'Yes. Enrolling in any featured course unlocks all associated blueprints, sitemaps, prompt packages, and checklist repositories. You learn the logic behind the system and get the pre-built codebase ready to launch.',
  },
  {
    q: 'How do Live Workshops differ from Self-Paced Courses?',
    a: 'Self-Paced Courses are deep-dive guides you follow at your own speed. Live Workshops are interactive scheduled cohorts where we code a specific integration together in real time, audit setups, and answer questions live.',
  },
  {
    q: 'How do 1-on-1 private training sessions work?',
    a: 'Private training sessions are highly focused, 1-on-1 classes. When you submit a request, we outline a personalized roadmap targeting your exact goals (e.g. launching a SaaS or setting up CRM automation) and schedule live screen-share classes to build it together.',
  },
  {
    q: 'How do I join the waitlist for upcoming workshops?',
    a: 'You can submit your email directly in the "Choose How You Want To Learn" card or the waitlist form under the "Upcoming Workshops" section. We will email you the moment new cohort dates and topics are scheduled.',
  },
  {
    q: 'Are the Free Resources really free to use?',
    a: 'Yes. The Free Resources section contains entry-point blueprints, setup guides, and workshop recordings to help you start building without any upfront cost. Once you enter your email, the download links are sent straight to your inbox.',
  },
  {
    q: 'Is there a monthly subscription fee for Mastery?',
    a: 'No. Mastery operates entirely on a single-payment model. You pay once for the specific course, workshop, or private training session you need. There are no recurring fees or subscription traps.',
  },
  {
    q: 'What is the Digital Vault and how do I access my purchases?',
    a: 'The Vault (/vault) is your authenticated dashboard. All sitemaps, courses, workshop recordings, and private training audit logs you own reside there. Simply log in to access your downloaded materials at any time.',
  },
  {
    q: 'Can I request a custom course or workshop topic?',
    a: 'Yes! If there is a high-leverage skill or automation scenario you want covered, builders can submit requests. Popular topics are prioritized for upcoming live workshops.',
  },
  {
    q: 'What is your refund policy?',
    a: 'We offer a 14-day, no-questions-asked refund policy on all self-paced course tracks, provided you have not downloaded more than 3 associated codebases or blueprints from your Vault.',
  },
  {
    q: 'How are payments processed securely?',
    a: 'All transactions are handled securely via Stripe. We accept all major credit/debit cards, Apple Pay, and Google Pay to ensure secure checkouts.',
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
            <span className="w-1.5 h-1.5 bg-[#424754] rounded-full" />
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
                isOpen ? "border-[#0058be] ring-1 ring-[#0058be]/10" : "border-[#c2c6d6]/35 hover:border-[#c2c6d6]/55"
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
                    isOpen ? "text-[#0058be]" : "text-[#0b1c30]"
                  )}
                >
                  {item.q}
                </span>

                {/* +/− toggle icon */}
                <span
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 border",
                    isOpen
                      ? "bg-[#eff4ff] border-[#dce9ff] text-[#0058be]"
                      : "bg-bg-secondary border-[#c2c6d6]/20 text-[#424754]/60 group-hover:border-[#0058be]/20 group-hover:text-[#0058be]"
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
