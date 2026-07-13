import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';

const pillars = [
  {
    icon: Zap,
    title: 'Start Faster',
    description:
      'Deploy prompts, templates, sitemaps, and automation playbooks in minutes — not days. No blank-file paralysis.',
    iconBg: '#f0fbe8',
    iconBorder: '#e1f7d2',
    iconColor: '#558b2f',
    accentHover: '#558b2f',
  },
  {
    icon: ShieldCheck,
    title: 'Avoid Common Mistakes',
    description:
      'Every blueprint is structured around known failure points — syntax errors, webhook misconfigurations, architectural anti-patterns. Build on proven foundations.',
    iconBg: '#eff4ff',
    iconBorder: '#dce9ff',
    iconColor: '#0b1c30',
    accentHover: '#0b1c30',
  },
  {
    icon: CheckCircle2,
    title: 'Implement With Confidence',
    description:
      'Clear documentation, step-by-step checklists, and structured outcomes keep your production deploys safe and reproducible.',
    iconBg: '#f3efff',
    iconBorder: '#ebe5ff',
    iconColor: '#6b35ff',
    accentHover: '#6b35ff',
  },
];

export const BlueprintsWhy = () => {
  return (
    <section 
      id="blueprints-why-anchor" 
      className="py-16 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20 scroll-mt-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end mb-12 text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-4">
            <span className="w-1.5 h-1.5 bg-[#0b1c30] rounded-full" />
            <span className="tracking-[0.22em]">Why Blueprints</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter leading-[1.1] text-[#0b1c30]">
            Built for execution
          </h2>
        </div>

        <p className="text-[#424754] text-sm leading-relaxed font-medium">
          Most builders don't need more theory. They need a validated starting point. These blueprints eliminate guesswork, reduce configuration errors, and let you ship with certainty.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 + i * 0.05 }}
              whileHover={{
                y: -4,
                scale: 1.005,
                borderColor: pillar.accentHover,
              }}
              className="group bg-white border border-[#c2c6d6]/30 rounded-2xl p-7 flex flex-col gap-5
                         hover:shadow-md transition-all duration-200 shadow-sm"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 border"
                style={{
                  backgroundColor: pillar.iconBg,
                  borderColor: pillar.iconBorder,
                }}
              >
                <Icon size={18} style={{ color: pillar.iconColor }} aria-hidden="true" />
              </div>

              <div className="flex flex-col gap-2.5 text-left">
                <h3 className="text-base font-extrabold text-[#0b1c30] tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#424754] leading-relaxed font-medium">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-auto pt-2">
                <div
                  className="h-0.5 w-8 rounded-full bg-[#c2c6d6]/30 group-hover:w-full transition-all duration-300"
                  style={{ backgroundColor: pillar.accentHover }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Blog crosslink — internal linking */}
      <div className="mt-10 text-center">
        <p className="text-xs text-[#424754]/60 font-semibold">
          Want to understand how these are built?{' '}
          <Link to="/blog" className="text-[#0b1c30] font-bold underline underline-offset-2 hover:text-[#0058be] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b1c30] rounded-sm">
            Read implementation guides on the Blog →
          </Link>
        </p>
      </div>

      {/* Hidden entity definitions for SEO and GEO crawlability — not visible to users */}
      <div className="sr-only" aria-hidden="false">
        <dl>
          <dt>AI Prompt Templates (Prompts)</dt>
          <dd>Pre-written system instructions, .cursorrules configurations, and LLM context files for AI coding tools like Cursor AI, ChatGPT, and Claude. Used by developers to standardize AI-assisted development workflows.</dd>

          <dt>Code Boilerplate Templates (Templates)</dt>
          <dd>Pre-built Next.js, React, and Tailwind CSS starter projects including authentication, database integration, and payment infrastructure. Designed for developers who want a production-ready starting point.</dd>

          <dt>Process Workflows (Workflows)</dt>
          <dd>Structured, step-by-step implementation sequences for technical SEO audits, content production pipelines, and operational processes. Each workflow defines inputs, steps, and expected outputs.</dd>

          <dt>No-Code Automation Setups (Automations)</dt>
          <dd>Pre-built Make.com scenarios, webhook configurations, and API trigger sequences for creating zero-maintenance automated operations. Built for operators and founders who want automation without custom code.</dd>

          <dt>Operational Checklists (Checklists)</dt>
          <dd>Structured verification lists for technical SEO audits, deployment readiness reviews, and code review cycles. Designed to be used repeatedly as part of a consistent quality process.</dd>

          <dt>System Blueprints (Blueprints)</dt>
          <dd>Multi-part implementation frameworks that combine prompt packs, templates, workflows, and checklists into a complete, deployable system. Blueprints cover end-to-end processes rather than individual steps.</dd>
        </dl>
      </div>
    </section>
  );
};
