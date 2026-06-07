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
    <section className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end mb-16 text-left">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#424754] shadow-sm mb-6"
          >
            <span className="w-1.5 h-1.5 bg-[#0b1c30] rounded-full animate-pulse" />
            <span className="tracking-[0.22em]">Why Blueprints</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]"
          >
            Built For<br />
            Execution
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#424754] text-base leading-relaxed font-medium"
        >
          Most builders don't need more theory. They need a validated starting point. These blueprints eliminate guesswork, reduce configuration errors, and let you ship with certainty.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{
                y: -6,
                scale: 1.015,
                borderColor: pillar.accentHover,
              }}
              className="group bg-white border border-[#c2c6d6]/30 rounded-[32px] p-8 flex flex-col gap-6
                         hover:shadow-ambient transition-all duration-300 shadow-sm"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shrink-0 border"
                style={{
                  backgroundColor: pillar.iconBg,
                  borderColor: pillar.iconBorder,
                }}
              >
                <Icon size={20} style={{ color: pillar.iconColor }} />
              </div>

              <div className="flex flex-col gap-3 text-left">
                <h3 className="text-xl font-extrabold text-[#0b1c30] tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#424754] leading-relaxed font-semibold">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-auto">
                <div
                  className="h-0.5 w-8 rounded-full bg-[#c2c6d6]/30 group-hover:w-full transition-all duration-500"
                  style={{ backgroundColor: pillar.accentHover }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Blog crosslink — internal linking */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12 text-center"
      >
        <p className="text-xs text-[#424754]/60 font-semibold">
          Want to understand how these are built?{' '}
          <Link to="/blog" className="text-[#0b1c30] font-bold underline underline-offset-2 hover:text-[#558b2f] transition-colors">
            Read implementation guides on the Blog →
          </Link>
        </p>
      </motion.div>

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
