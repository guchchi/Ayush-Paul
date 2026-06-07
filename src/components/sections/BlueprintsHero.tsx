import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowDown, Bot, Globe, Search, Zap, CheckCircle2, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MagneticButton } from '../ui/MagneticButton';

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
    color: '#f3efff',
    iconBg: '#f3efff',
    iconColor: '#6b35ff',
    delay: 0,
  },
  {
    icon: Globe,
    category: 'Boilerplate Template',
    title: 'Next.js SaaS Starter',
    tags: ['Components', 'Auth', 'Stripe'],
    color: '#f5f5f5',
    iconBg: '#f5f5f5',
    iconColor: '#0b1c30',
    delay: 0.08,
  },
  {
    icon: Search,
    category: 'SEO Workflow',
    title: 'Technical SEO Checklist',
    tags: ['Audit', 'Schema', 'Core Web'],
    color: '#fff4eb',
    iconBg: '#fff4eb',
    iconColor: '#ff8000',
    delay: 0.16,
  },
  {
    icon: Zap,
    category: 'Automation Setup',
    title: 'Make.com Playbook',
    tags: ['Scenarios', 'Triggers', 'Modules'],
    color: '#f0fbe8',
    iconBg: '#f0fbe8',
    iconColor: '#558b2f',
    delay: 0.24,
  },
];

const FloatingCard = ({ card, index }: { card: typeof frameworkCards[0]; index: number }) => {
  const Icon = card.icon;
  const isFeatured = index === 1;

  const offsetX = [-12, 32, -24, 16][index];
  const rotation = [-1, 1.5, -0.5, 1][index];
  const cardScale = isFeatured ? 1.03 : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, x: index % 2 === 0 ? -24 : 24, rotate: 0 }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        x: offsetX, 
        rotate: rotation,
        scale: cardScale
      }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{
        y: -6,
        scale: isFeatured ? 1.06 : 1.03,
        zIndex: 50,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      transition={{ duration: 0.65, delay: 0.3 + card.delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ originX: 0.5, originY: 0.5 }}
      className={cn(
        "w-full max-w-[430px] rounded-[32px] p-6 lg:p-7 transition-all duration-300 group cursor-default border relative z-10 shadow-sm",
        isFeatured 
          ? "bg-white border-[#0b1c30]/15 ring-1 ring-[#0b1c30]/5 shadow-sm" 
          : "bg-white border-[#c2c6d6]/30"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm border border-[#c2c6d6]/10"
          style={{ backgroundColor: card.iconBg }}
        >
          <Icon size={22} style={{ color: card.iconColor }} />
        </div>

        <div className="flex-1 min-w-0 text-left">
          <p className="text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.2em] text-[#424754]/60 mb-1.5">
            {card.category}
          </p>
          <h3 className="text-base lg:text-[1.1rem] font-extrabold text-[#0b1c30] leading-snug mb-3">
            {card.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {card.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9.5px] lg:text-[10px] font-bold uppercase tracking-wider text-[#424754]/75 bg-bg-secondary border border-[#c2c6d6]/20 px-2.5 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className={cn(
          "w-2 h-2 rounded-full shrink-0 mt-2 animate-pulse",
          isFeatured ? "bg-[#d1f34d]" : "bg-[#d1f34d]"
        )} />
      </div>
    </motion.div>
  );
};

export const BlueprintsHero = ({ onExploreClick, onBrowseClick, loading = false }: BlueprintsHeroProps) => {
  return (
    <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,88,190,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(0,88,190,0.012)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          {/* LEFT: Typography + CTAs */}
          <div className="flex flex-col lg:col-span-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-8 mx-auto lg:mx-0"
            >
              <span className="w-1.5 h-1.5 bg-[#d1f34d] rounded-full" />
              <span className="tracking-[0.22em]">READY TO BUILD</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter leading-[1.05] text-[#0b1c30] mb-8 animate-fade-in"
            >
              Ready-To-Use Blueprints<br />
              <span className="text-[#0b1c30]">For Faster Execution</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-[#424754] font-medium max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed"
            >
              A Blueprint is a pre-configured starting point — a prompt pack, code template, checklist, automation script, or workflow — built to eliminate trial-and-error. Skip the setup. Start executing immediately.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6"
            >
              <MagneticButton>
                <button
                  onClick={onExploreClick}
                  className="px-8 py-4 bg-[#0b1c30] text-white rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 group hover:scale-105 transition-transform w-full sm:w-auto shadow-sm cursor-pointer"
                >
                  Explore Library
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </MagneticButton>

              <MagneticButton>
                <button
                  onClick={onBrowseClick}
                  className="px-8 py-4 bg-white border border-[#c2c6d6]/30 text-[#0b1c30] rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm cursor-pointer"
                >
                  Browse Categories
                  <ArrowDown size={14} className="text-[#0b1c30]" />
                </button>
              </MagneticButton>
            </motion.div>
          </div>

          {/* RIGHT: Floating Cards Visual */}
          <div className="lg:col-span-6 relative hidden lg:block">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
              <div className="w-80 h-80 bg-[#0b1c30]/4 rounded-full filter blur-[80px]" />
            </div>

            <div className="relative flex flex-col gap-6 pl-10 pr-12 pb-4">
              <div className="absolute left-4 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-[#c2c6d6]/30 to-transparent" />

              {frameworkCards.map((card, i) => (
                <FloatingCard key={card.title} card={card} index={i} />
              ))}

              <div className="flex items-center gap-3 mt-2 pl-2">
                <div className="flex items-center gap-2 bg-white border border-[#c2c6d6]/30 rounded-full px-4 py-2 shadow-sm animate-fade-in">
                  <CheckCircle2 size={12} className="text-[#558b2f]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]">
                    Curated Implementations
                  </span>
                </div>
                <div className="flex -space-x-1.5">
                  {['#d1f34d', '#eff4ff', '#fff4eb'].map((c, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
