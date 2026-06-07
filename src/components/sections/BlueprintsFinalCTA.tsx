import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, ArrowUpRight } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';

const options = [
  {
    icon: BookOpen,
    title: 'Learn With Me',
    description:
      'Understand the frameworks, decision processes, and architectural thinking behind modern blueprints through the Academy.',
    cta: 'Explore Academy',
    href: '/academy',
    style: 'secondary',
    iconBg: '#f0fbe8',
    iconColor: '#558b2f',
    trackLabel: 'Explore Academy',
  },
  {
    icon: Users,
    title: 'Studio',
    description:
      'Bring in Ayush for custom implementation, API configuration, product builds, and systems designed for long-term execution.',
    cta: 'Start Building',
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
    <section className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20">
      
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end mb-14 text-left">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-6"
          >
            <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full animate-pulse" />
            <span className="tracking-[0.22em]">Next Step</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]"
          >
            Need More Than<br />
            A Blueprint?
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#424754] text-base leading-relaxed font-medium"
        >
          Whether you're looking for deeper learning, implementation support, or a strategic partner, choose the path that helps you move forward with confidence.
        </motion.p>
      </div>

      {/* Two Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {options.map((opt, i) => {
          const Icon = opt.icon;
          const isPrimary = opt.style === 'primary';

          return (
            <motion.div
              key={opt.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative rounded-[32px] border p-10 flex flex-col gap-6 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-ambient hover:scale-[1.01]
                ${isPrimary
                  ? 'bg-[#0b1c30] border-[#0b1c30] text-white'
                  : 'bg-white border-[#c2c6d6]/30 hover:border-[#d1f34d]/20'
                }`}
            >
              {isPrimary && (
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#d1f34d]/5 rounded-full blur-3xl pointer-events-none" />
              )}

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border text-left"
                style={{ 
                  backgroundColor: isPrimary ? 'rgba(255,255,255,0.05)' : opt.iconBg,
                  borderColor: isPrimary ? 'rgba(255,255,255,0.1)' : '#e1f7d2'
                }}
              >
                <Icon size={20} style={{ color: isPrimary ? '#d1f34d' : opt.iconColor }} />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-3 flex-1 text-left">
                <h3 className={`text-xl font-extrabold tracking-tight ${isPrimary ? 'text-white' : 'text-[#0b1c30]'}`}>
                  {opt.title}
                </h3>
                <p className={`text-xs leading-relaxed font-semibold ${isPrimary ? 'text-white/65' : 'text-[#424754]'}`}>
                  {opt.description}
                </p>
              </div>

              {/* Action Link */}
              <MagneticButton>
                <Link
                  to={opt.href}
                  onClick={() => trackEvent?.('CTA Clicked', { location: 'Blueprints Final CTA', label: opt.trackLabel, targetUrl: opt.href })}
                  className={`inline-flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-widest
                              transition-all duration-300 w-fit
                              ${isPrimary
                                ? 'text-[#d1f34d] hover:text-white'
                                : 'text-[#0b1c30] hover:text-[#558b2f]'
                              }`}
                >
                  {opt.cta}
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300
                      ${isPrimary
                        ? 'bg-[#d1f34d] border-[#d1f34d] text-black group-hover:bg-white group-hover:border-white group-hover:text-black'
                        : 'bg-bg-secondary border-[#c2c6d6]/20 text-[#558b2f] group-hover:bg-[#558b2f] group-hover:border-[#558b2f] group-hover:text-white'
                      }`}
                  >
                    <ArrowUpRight size={13} />
                  </span>
                </Link>
              </MagneticButton>
            </motion.div>
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center text-[10px] font-bold uppercase tracking-[0.28em] text-[#424754]/30 select-none"
      >
        Learn it. Use it. Build it. Scale it.
      </motion.p>
    </section>
  );
};
