import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowDown, Bot, Globe, Search, Zap, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BlueprintsHeroProps {
  onExploreClick: () => void;
  onBrowseClick: () => void;
  loading?: boolean;
}

const frameworkCards = [
  {
    icon: Bot,
    category: 'AI Prompts',
    title: 'Cursor AI Rule Pack',
    tags: ['Prompts', 'Config', 'Rules'],
    iconBg: '#f3efff',
    iconColor: '#6b35ff',
    delay: 0,
  },
  {
    icon: Globe,
    category: 'Boilerplate Template',
    title: 'Next.js SaaS Starter',
    tags: ['Components', 'Auth', 'Stripe'],
    iconBg: '#f5f5f5',
    iconColor: '#0b1c30',
    delay: 0.05,
  },
  {
    icon: Search,
    category: 'SEO Workflow',
    title: 'Technical SEO Checklist',
    tags: ['Audit', 'Schema', 'Core Web'],
    iconBg: '#fff4eb',
    iconColor: '#ff8000',
    delay: 0.1,
  },
  {
    icon: Zap,
    category: 'Automation Setup',
    title: 'Make.com Playbook',
    tags: ['Scenarios', 'Triggers', 'Modules'],
    iconBg: '#f0fbe8',
    iconColor: '#558b2f',
    delay: 0.15,
  },
];

const PreviewCard = ({ card, index }: { card: typeof frameworkCards[0]; index: number }) => {
  const Icon = card.icon;
  const isFeatured = index === 1;

  // Connected cascading stack positioning on desktop
  const desktopStyles = [
    { top: '0px', left: '0px', rotate: '-0.5deg' },
    { top: '80px', left: '20px', rotate: '1deg' },
    { top: '160px', left: '10px', rotate: '-1deg' },
    { top: '240px', left: '30px', rotate: '0.5deg' },
  ][index];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{
        y: -4,
        scale: 1.01,
        zIndex: 50,
        transition: { duration: 0.15, ease: "easeOut" }
      }}
      transition={{ duration: 0.45, delay: 0.1 + card.delay }}
      style={{
        ...desktopStyles,
      }}
      className={cn(
        "w-full max-w-[420px] rounded-2xl p-5 transition-all duration-200 group border bg-white shadow-sm",
        isFeatured 
          ? "border-[#0b1c30]/20 ring-1 ring-[#0b1c30]/5 lg:absolute z-20" 
          : "border-[#c2c6d6]/30 lg:absolute z-10"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border border-[#c2c6d6]/10"
          style={{ backgroundColor: card.iconBg }}
        >
          <Icon size={18} style={{ color: card.iconColor }} />
        </div>

        <div className="flex-1 min-w-0 text-left">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#424754]/60 mb-1">
            {card.category}
          </p>
          <h3 className="text-sm font-extrabold text-[#0b1c30] leading-snug mb-2.5">
            {card.title}
          </h3>
          <div className="flex items-center gap-1.5 flex-wrap">
            {card.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-bold uppercase tracking-wider text-[#424754]/75 bg-[#eff4ff] border border-[#c2c6d6]/15 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="w-1.5 h-1.5 rounded-full bg-[#d1f34d] shrink-0 mt-2" />
      </div>
    </motion.div>
  );
};

export const BlueprintsHero = ({ onExploreClick, onBrowseClick, loading = false }: BlueprintsHeroProps) => {
  return (
    <section className="relative pt-8 pb-12 md:pt-12 md:pb-16 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,88,190,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(0,88,190,0.012)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* LEFT: Typography + CTAs */}
          <div className="flex flex-col lg:col-span-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-6 mx-auto lg:mx-0">
              <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full" />
              <span className="tracking-[0.22em]">READY TO BUILD</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[4rem] xl:text-[4.5rem] font-bold tracking-tighter leading-[1.08] text-[#0b1c30] mb-6">
              Ready-to-use blueprints for faster execution
            </h1>

            <p className="text-sm md:text-base text-[#424754] font-medium max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
              A blueprint is a pre-configured starting point — a prompt pack, code template, checklist, automation script, or workflow — built to eliminate trial-and-error. Skip the setup. Start executing immediately.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onExploreClick}
                className="px-7 h-12 bg-[#0b1c30] text-white rounded-full font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 group hover:bg-[#152e4b] active:scale-[0.98] transition-all w-full sm:w-auto shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1c30] focus-visible:ring-offset-2"
              >
                Browse blueprints
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onBrowseClick}
                className="px-7 h-12 bg-white border border-[#c2c6d6]/40 text-[#0b1c30] rounded-full font-bold text-[11px] uppercase tracking-wider hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1c30] focus-visible:ring-offset-2"
              >
                How it works
                <ArrowDown size={13} className="text-[#0b1c30]" />
              </button>
            </div>
          </div>

          {/* RIGHT: Cascading Previews System */}
          <div className="lg:col-span-6 relative hidden lg:block h-[380px] w-full max-w-[460px] mx-auto">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
              <div className="w-80 h-80 bg-[#0b1c30]/3 rounded-full filter blur-[80px]" />
            </div>

            <div className="relative w-full h-full">
              {frameworkCards.map((card, i) => (
                <PreviewCard key={card.title} card={card} index={i} />
              ))}
            </div>

            <div className="absolute bottom-[-16px] left-0 flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-[#c2c6d6]/35 rounded-full px-3.5 py-1.5 shadow-sm">
                <CheckCircle2 size={11} className="text-[#558b2f]" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#424754]">
                  Curated Implementations
                </span>
              </div>
              <div className="flex -space-x-1.5">
                {['#d1f34d', '#eff4ff', '#fff4eb'].map((c, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
