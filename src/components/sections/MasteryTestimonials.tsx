import React from 'react';
import { motion } from 'motion/react';
import { Quote, Star, Award, CheckCircle2 } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  outcome: string;
  quote: string;
  tags: string[];
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sarah Jenkins',
    role: 'Founder, SaaSFlow',
    outcome: 'Launched Active SaaS in 3 Weeks',
    quote: 'I went from consuming random tutorials to launching my active SaaS product in just three weeks. The structured typography guides and prompt automation patterns unblocked my development velocity completely.',
    tags: ['UI/UX Design', 'AI Workflows']
  },
  {
    name: 'David Chen',
    role: 'Freelance Web Developer',
    outcome: '10x Faster Design Sign-offs',
    quote: "Ayush's systematic approach to typography scales and color theory completely changed how I build. My layouts look twice as premium now, and my clients sign off on design mockups in record time.",
    tags: ['Color Theory', 'Typography Systems']
  },
  {
    name: 'Marcus Miller',
    role: 'Growth Architect',
    outcome: 'Automated Lead Webhooks',
    quote: 'The automation live cohorts are extremely practical. I managed to configure and launch my entire sitemap crawler indexing audit and Stripe checkout pipelines in a single weekend. Highly recommended.',
    tags: ['SEO Foundations', 'Make Webhooks']
  }
];

export const MasteryTestimonials = () => {
  return (
    <section 
      className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20 scroll-mt-24"
      id="student-results-section"
    >
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end mb-16 text-left">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#0058be] shadow-sm mb-6"
          >
            <span className="w-1.5 h-1.5 bg-[#0058be] rounded-full animate-pulse" />
            <span className="tracking-[0.22em]">Trust Signals</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]"
          >
            Student Results
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#424754] text-base leading-relaxed font-medium"
        >
          See how builders, creators, and technical founders are scaling their launch speed and design quality with Mastery.
        </motion.p>
      </div>

      {/* Testimonials List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        {TESTIMONIALS.map((t, idx) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 bg-white border border-[#c2c6d6]/30 rounded-[32px] shadow-sm hover:shadow-ambient hover:scale-[1.01] hover:border-[#0058be]/20 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-6">
              {/* Star Rating & Quote Icon */}
              <div className="flex justify-between items-center">
                <div className="flex gap-0.5 text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                </div>
                <Quote size={18} className="text-[#0058be]/20" />
              </div>

              {/* Quote text */}
              <p className="text-xs text-[#424754] leading-relaxed font-semibold italic">
                "{t.quote}"
              </p>
            </div>

            {/* User Profile & Outcome Badge */}
            <div className="pt-6 mt-6 border-t border-[#c2c6d6]/15 space-y-4">
              {/* Outcome Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f0fbe8] border border-[#e1f7d2] text-[#558b2f] rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                <CheckCircle2 size={10} />
                <span>{t.outcome}</span>
              </div>

              {/* Author Row */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-[#0b1c30] tracking-tight">{t.name}</h4>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#424754]/60">{t.role}</span>
                </div>

                {/* Sub-tags */}
                <div className="flex flex-wrap gap-1 max-w-[120px] justify-end">
                  {t.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2 py-0.5 rounded-full text-[7.5px] font-bold text-[#424754]/75 bg-bg-secondary border border-gray-100 uppercase tracking-widest"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
