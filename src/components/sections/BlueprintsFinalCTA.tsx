import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, ArrowUpRight } from 'lucide-react';

const options = [
  {
    icon: BookOpen,
    title: 'Learn With Me',
    description:
      'Understand the frameworks, decision processes, and architectural thinking behind modern blueprints through the Academy.',
    cta: 'Explore Mastery Courses',
    href: '/mastery',
    style: 'secondary',
    iconBg: '#f0fbe8',
    iconColor: '#558b2f',
    trackLabel: 'Explore Academy',
  },
  {
    icon: Users,
    title: 'Studio Collaboration',
    description:
      'Bring in Ayush for custom implementation, API configuration, product builds, and systems designed for long-term execution.',
    cta: 'Collaborate at Studio',
    href: '/collaborate',
    style: 'primary',
    iconBg: 'rgba(255,255,255,0.05)',
    iconColor: '#d1f34d',
    trackLabel: 'Start Building',
  },
];

interface BlueprintsFinalCTAProps {
  trackEvent?: (eventName: string, payload?: Record<string, any>) => void;
}

export const BlueprintsFinalCTA = ({ trackEvent }: BlueprintsFinalCTAProps) => {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20">
      
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end mb-12 text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-4">
            <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full animate-pulse" />
            <span className="tracking-[0.22em]">Next Step</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter leading-[1.1] text-[#0b1c30]">
            Need more than a blueprint?
          </h2>
        </div>

        <p className="text-[#424754] text-sm leading-relaxed font-medium">
          Whether you're looking for deeper learning, implementation support, or a strategic partner, choose the path that helps you move forward with confidence.
        </p>
      </div>

      {/* Two Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {options.map((opt, i) => {
          const Icon = opt.icon;
          const isPrimary = opt.style === 'primary';

          return (
            <motion.div
              key={opt.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 + i * 0.05 }}
              className={`group relative rounded-2xl border p-8 flex flex-col gap-5 overflow-hidden transition-all duration-200 shadow-sm
                ${isPrimary
                  ? 'bg-[#0b1c30] border-[#0b1c30] text-white'
                  : 'bg-white border-[#c2c6d6]/30'
                }`}
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border text-left"
                style={{ 
                  backgroundColor: isPrimary ? 'rgba(255,255,255,0.05)' : opt.iconBg,
                  borderColor: isPrimary ? 'rgba(255,255,255,0.1)' : '#e1f7d2'
                }}
              >
                <Icon size={18} style={{ color: isPrimary ? '#d1f34d' : opt.iconColor }} aria-hidden="true" />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2 text-left">
                <h3 className={`text-base font-extrabold tracking-tight ${isPrimary ? 'text-white' : 'text-[#0b1c30]'}`}>
                  {opt.title}
                </h3>
                <p className={`text-xs leading-relaxed font-semibold ${isPrimary ? 'text-white/70' : 'text-[#424754]'}`}>
                  {opt.description}
                </p>
              </div>

              {/* Action Link - restyled to be secondary, non-glowing text-links */}
              <div className="mt-auto pt-4">
                <Link
                  to={opt.href}
                  onClick={() => trackEvent?.('CTA Clicked', { location: 'Blueprints Final CTA', label: opt.trackLabel, targetUrl: opt.href })}
                  className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0b1c30]
                    ${isPrimary
                      ? 'text-[#d1f34d] hover:text-white'
                      : 'text-[#0b1c30] hover:text-[#0058be]'
                    }`}
                >
                  {opt.cta}
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200
                      ${isPrimary
                        ? 'bg-[#d1f34d] border-[#d1f34d] text-black group-hover:bg-white group-hover:border-white'
                        : 'bg-bg-secondary border-[#c2c6d6]/20 text-[#0b1c30] group-hover:bg-[#0b1c30] group-hover:text-white'
                      }`}
                  >
                    <ArrowUpRight size={11} />
                  </span>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-center text-[9px] font-bold uppercase tracking-[0.25em] text-[#424754]/30 select-none">
        Learn it. Use it. Build it. Scale it.
      </p>
    </section>
  );
};
