import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { VARIANTS } from '../../lib/motion-presets';
import { Flame, CheckCircle, HelpCircle, Terminal, TrendingUp, Download, Eye } from 'lucide-react';

export const HomeBuildInPublicSection = () => {
  const currentWork = [
    { 
      text: 'Rebuilding AyushPaul.in', 
      status: 'SHIPPED', 
      statusColor: 'text-green-400 bg-green-400/5 border-green-400/20',
      meta: 'SHA-256: 8a4c1f9 • Latency: 92ms • Vercel Edge'
    },
    { 
      text: 'Testing custom Cursor Rules configs', 
      status: 'BUILDING', 
      statusColor: 'text-brand-primary bg-brand-primary/5 border-brand-primary/20',
      meta: 'File: .cursorrules • 12 active rules • GPT-4o'
    },
    { 
      text: 'Auditing SEO sitemap crawlers', 
      status: 'TESTING', 
      statusColor: 'text-yellow-400 bg-yellow-400/5 border-yellow-400/20',
      meta: 'Pages: 42 checked • Errors: 0 • Googlebot UA'
    },
    { 
      text: 'Publishing AI Launch Blueprint files', 
      status: 'BUILDING', 
      statusColor: 'text-brand-primary bg-brand-primary/5 border-brand-primary/20',
      meta: 'Blueprints: 3 active • downloadsCount: 250+ • Stripe sync'
    }
  ];

  const logs = [
    {
      type: 'SUCCESS',
      title: 'Next.js Routing Optimization',
      desc: 'Refactored dynamic route mappings. Server compile times dropped from 240ms to 95ms. Faster page load results verified.',
      icon: CheckCircle,
      iconColor: 'text-green-400 bg-green-400/10 border-green-400/20'
    },
    {
      type: 'FAILED',
      title: 'Local LLM Content Tagging',
      desc: 'Tested running local Llama-3 models on a mini PC for automated tagging. Latency was ~2.4s. Scrapped and shifted to OpenAI structured outputs (sub-120ms).',
      icon: Flame,
      iconColor: 'text-red-400 bg-red-400/10 border-red-400/20'
    },
    {
      type: 'LEARNED',
      title: 'Tailwind CSS v4 Migration',
      desc: 'CSS-first configuration is great, but watch out for legacy utilities. Cleaning up unused configs saved 30% of final CSS bundle size.',
      icon: HelpCircle,
      iconColor: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
    }
  ];

  const stats = [
    { 
      label: 'Blueprints Cloned', 
      val: '250+', 
      icon: Download,
      sparkline: (
        <svg className="w-14 h-5 text-brand-primary mt-2 opacity-60" viewBox="0 0 50 20">
          <path d="M0,18 Q12,12 25,10 T50,2" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    },
    { 
      label: 'Organic Visitors / mo', 
      val: '2,500+', 
      icon: Eye,
      sparkline: (
        <svg className="w-14 h-5 text-brand-primary mt-2 opacity-60" viewBox="0 0 50 20">
          <path d="M0,16 Q15,14 25,8 T50,4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    },
    { 
      label: 'Newsletter Readers', 
      val: '500+', 
      icon: TrendingUp,
      sparkline: (
        <svg className="w-14 h-5 text-brand-primary mt-2 opacity-60" viewBox="0 0 50 20">
          <path d="M0,18 L10,14 L20,16 L30,10 L40,12 L50,2" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    }
  ];

  const renderStatusIndicator = (status: string) => {
    switch (status) {
      case 'SHIPPED':
        return (
          <span className="relative flex h-2 w-2 mr-2 shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        );
      case 'BUILDING':
        return (
          <span className="relative flex h-2 w-2 mr-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
          </span>
        );
      case 'TESTING':
        return (
          <span className="relative flex h-2 w-2 mr-2 shrink-0">
            <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Section id="proof" className="border-t border-white/5 bg-[#050505] relative overflow-hidden">
      {/* Background radial overlays */}
      <div className="absolute top-1/3 left-[-150px] w-96 h-96 bg-brand-primary/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 right-[-150px] w-96 h-96 bg-brand-primary/3 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 md:mb-16 lg:mb-20">
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="ds-section-label"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            Ecosystem Proof
          </motion.div>

          <motion.h2
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="ds-section-h2"
          >
            Building in <span className="italic font-extrabold text-brand-primary">Public.</span>
          </motion.h2>

          <motion.p
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="ds-section-body max-w-2xl text-white/50"
          >
            No fake client logos or corporate awards. Here is the actual log of what I am testing, what is working, what failed, and real-time project metrics.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: What I'm working on + Stats (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8">
            {/* Work Ticker Card */}
            <motion.div
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="ds-card p-8 flex-grow"
            >
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-brand-primary mb-6 flex items-center gap-2">
                <Terminal size={14} />
                Current Work Ticker
              </h3>
              <ul className="space-y-4">
                {currentWork.map((work, idx) => (
                  <li key={idx} className="flex flex-col border-b border-white/[0.03] pb-3 last:border-b-0 last:pb-0 group">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{work.text}</span>
                      <div className="flex items-center">
                        {renderStatusIndicator(work.status)}
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${work.statusColor} font-mono uppercase tracking-wider`}>
                          {work.status}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-white/20 font-mono mt-1 group-hover:text-brand-primary/50 transition-colors">
                      {work.meta}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Metrics Strip */}
            <motion.div
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-3 gap-4"
            >
              {stats.map((stat, idx) => {
                const StatIcon = stat.icon;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-[#101010] border border-white/5 text-center flex flex-col items-center justify-center">
                    <StatIcon size={16} className="text-brand-primary mb-2" />
                    <span className="text-xl font-extrabold text-white block leading-none">{stat.val}</span>
                    <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-white/30 mt-1 leading-tight block">{stat.label}</span>
                    {stat.sparkline}
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Right Column: Lessons Learned Logs (lg:col-span-7) */}
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-7 ds-card p-8 sm:p-10"
          >
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-brand-primary mb-6 flex items-center gap-2">
              <CheckCircle size={14} />
              Lessons Learned (Build Log)
            </h3>
            
            <div className="space-y-6">
              {logs.map((log, idx) => {
                const LogIcon = log.icon;
                return (
                  <div key={idx} className="flex gap-4 items-start pb-6 border-b border-white/5 last:border-b-0 last:pb-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${log.iconColor}`}>
                      <LogIcon size={14} />
                    </div>
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold font-mono tracking-widest text-white/30 uppercase">{log.type}</span>
                        <h4 className="text-sm font-bold text-white tracking-tight">{log.title}</h4>
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed font-medium">{log.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

        </div>

      </div>
    </Section>
  );
};

export default HomeBuildInPublicSection;
