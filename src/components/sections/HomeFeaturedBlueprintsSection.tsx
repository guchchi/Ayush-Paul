import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Section } from '../ui/Section';
import { ArrowUpRight, CheckCircle2, Download, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VARIANTS } from '../../lib/motion-presets';

export const HomeFeaturedBlueprintsSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setErrorMsg('');
    setIsSubmitted(true);
  };

  return (
    <Section id="systems" className="border-t border-white/5 bg-[#0A0A0A] relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-[-150px] w-96 h-96 bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-[-150px] w-96 h-96 bg-brand-primary/3 rounded-full blur-[120px] pointer-events-none -z-10" />

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
            Blueprints &amp; Templates
          </motion.div>

          <motion.h2
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="ds-section-h2"
          >
            Featured <span className="italic font-extrabold text-brand-primary">Blueprints.</span>
          </motion.h2>

          <motion.p
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="ds-section-body max-w-2xl text-white/50"
          >
            Production-tested frameworks designed to speed up your build time, automate operations, and boost search visibility.
          </motion.p>
        </div>

        {/* ----------------- LEAD CAPTURE: FREE DIGITAL SYSTEMS STARTER PACK ----------------- */}
        <motion.div
          variants={VARIANTS.fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
          className="mb-16 bg-[#101010] border border-white/[0.08] p-8 md:p-10 rounded-[2rem] relative overflow-hidden"
        >
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-brand-primary/5 rounded-full blur-[80px] pointer-events-none -z-10" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Value Proposition */}
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                <Download size={12} />
                Instant Access Package
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Build Your First Digital System
              </h3>
              <p className="text-white/50 text-sm leading-relaxed max-w-xl">
                Get started today with a free starter kit containing the exact files and guides I use to design fast websites and launch automated workflows.
              </p>
              
              {/* Bullet checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-semibold text-white/70">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-brand-primary shrink-0" />
                  <span>Next.js &amp; Tailwind App Boilerplate</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-brand-primary shrink-0" />
                  <span>Custom Cursor AI Rules Configuration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-brand-primary shrink-0" />
                  <span>Make.com Core Automation Blueprint</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-brand-primary shrink-0" />
                  <span>Technical SEO Sitemap Setup Guide (PDF)</span>
                </div>
              </div>
            </div>

            {/* Email Form input block */}
            <div className="lg:col-span-5 w-full bg-white/[0.02] border border-white/[0.06] p-6 rounded-2xl">
              {!isSubmitted ? (
                <form onSubmit={handleDownload} className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-2">
                    Enter email to get the starter pack
                  </h4>
                  <div className="flex flex-col gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full h-11 px-4 rounded-xl bg-[#050505] border border-white/10 text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand-primary font-mono transition-colors"
                      required
                    />
                    {errorMsg && (
                      <div className="text-[10px] text-red-400 font-bold flex items-center gap-1 mt-0.5">
                        <AlertCircle size={10} />
                        {errorMsg}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-brand-primary text-black font-extrabold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Download Free Templates
                  </button>
                </form>
              ) : (
                <div className="py-6 text-center space-y-3 font-mono">
                  <CheckCircle2 size={36} className="text-brand-primary mx-auto animate-bounce" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Pack Ready!</h4>
                  <p className="text-[11px] text-white/50 max-w-xs mx-auto leading-relaxed">
                    Check your inbox. A direct download link containing the Next.js templates and Cursor rule files has been sent to <span className="text-brand-primary">{email}</span>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Asymmetrical Bento-style grid showcasing 4 frameworks */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Card 1: AI Website Launch Blueprint (Spotlight - md:col-span-7) */}
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="md:col-span-7 relative isolate flex flex-col justify-between h-full"
          >
            <div className="ds-card ds-card-hover p-8 sm:p-10 flex flex-col justify-between h-full group bg-gradient-to-br from-[#0e0e0e] to-[#050505]">
              <div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                    Premium Blueprint • Spotlight
                  </span>
                  <Link
                    to="/systems"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-black group-hover:border-brand-primary group-hover:shadow-[0_0_15px_rgba(0,194,255,0.25)] transition-all duration-300 ease-out"
                  >
                    <ArrowUpRight size={18} />
                  </Link>
                </div>

                <h3 className="text-white font-extrabold text-3xl mb-4 tracking-tight group-hover:text-brand-primary transition-colors duration-300">
                  AI Website Launch Blueprint
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6 transition-colors duration-300 group-hover:text-white/60">
                  Learn how to research, design, build, and deploy a high-performance website using modern AI tools without sacrificing technical SEO or site performance.
                </p>

                <div className="flex flex-wrap gap-2.5 mb-8">
                  <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-extrabold uppercase tracking-wider">
                    Next.js
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-extrabold uppercase tracking-wider">
                    Cursor AI
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-extrabold uppercase tracking-wider">
                    Figma Presets
                  </span>
                </div>
              </div>

              <div className="text-left font-mono border-t border-white/5 pt-4 mt-auto">
                <span className="text-[9px] text-white/35 font-bold uppercase block mb-1">RESOURCES INCLUDED</span>
                <p className="text-[11px] text-white/60">Next.js Boilerplate, Custom Cursor Rules Config, and Figma Presets.</p>
              </div>
            </div>
          </motion.div>

          {/* Card 2: SEO Foundation System (md:col-span-5) */}
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-5 relative isolate flex flex-col justify-between h-full"
          >
            <div className="ds-card ds-card-hover p-8 sm:p-10 flex flex-col justify-between h-full group">
              <div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                    SaaS Checklist
                  </span>
                  <Link
                    to="/systems"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-black group-hover:border-brand-primary group-hover:shadow-[0_0_15px_rgba(0,194,255,0.25)] transition-all duration-300 ease-out"
                  >
                    <ArrowUpRight size={18} />
                  </Link>
                </div>

                <h3 className="text-white font-extrabold text-2xl mb-4 tracking-tight group-hover:text-brand-primary transition-colors duration-300">
                  SEO Foundation System
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6 transition-colors duration-300 group-hover:text-white/60">
                  The exact technical blueprint used to audit site structure, optimize content flows, and set up tracking configurations for search visibility.
                </p>

                <div className="flex flex-wrap gap-2.5 mb-8">
                  <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-extrabold uppercase tracking-wider">
                    Technical Audit
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-extrabold uppercase tracking-wider">
                    JSON-LD
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-extrabold uppercase tracking-wider">
                    Analytics
                  </span>
                </div>
              </div>

              <div className="text-left font-mono border-t border-white/5 pt-4 mt-auto">
                <span className="text-[9px] text-white/35 font-bold uppercase block mb-1">RESOURCES INCLUDED</span>
                <p className="text-[11px] text-white/60">Sitemap schema generators, JSON-LD schemas, and GTM containers.</p>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Automation Playbook (md:col-span-6) */}
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="md:col-span-6 relative isolate flex flex-col justify-between h-full"
          >
            <div className="ds-card ds-card-hover p-8 sm:p-10 flex flex-col justify-between h-full group">
              <div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                    Operational Playbook
                  </span>
                  <Link
                    to="/systems"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-black group-hover:border-brand-primary group-hover:shadow-[0_0_15px_rgba(0,194,255,0.25)] transition-all duration-300 ease-out"
                  >
                    <ArrowUpRight size={18} />
                  </Link>
                </div>

                <h3 className="text-white font-extrabold text-2xl mb-4 tracking-tight group-hover:text-brand-primary transition-colors duration-300">
                  Automation Playbook
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6 transition-colors duration-300 group-hover:text-white/60">
                  Reusable operational workflows designed to link data tables, fire webhooks, synchronize databases, and automate operational client onboarding.
                </p>

                <div className="flex flex-wrap gap-2.5 mb-8">
                  <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-extrabold uppercase tracking-wider">
                    Make / N8N
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-extrabold uppercase tracking-wider">
                    Webhooks
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-extrabold uppercase tracking-wider">
                    Sync Rules
                  </span>
                </div>
              </div>

              <div className="text-left font-mono border-t border-white/5 pt-4 mt-auto">
                <span className="text-[9px] text-white/35 font-bold uppercase block mb-1">RESOURCES INCLUDED</span>
                <p className="text-[11px] text-white/60">Make.com JSON templates, Webhook scripts, and Stripe sync code.</p>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Product Validation Framework (md:col-span-6) */}
          <motion.div
            variants={VARIANTS.fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-6 relative isolate flex flex-col justify-between h-full"
          >
            <div className="ds-card ds-card-hover p-8 sm:p-10 flex flex-col justify-between h-full group">
              <div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                    Validation Framework
                  </span>
                  <Link
                    to="/systems"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-black group-hover:border-brand-primary group-hover:shadow-[0_0_15px_rgba(0,194,255,0.25)] transition-all duration-300 ease-out"
                  >
                    <ArrowUpRight size={18} />
                  </Link>
                </div>

                <h3 className="text-white font-extrabold text-2xl mb-4 tracking-tight group-hover:text-brand-primary transition-colors duration-300">
                  Product Validation Framework
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6 transition-colors duration-300 group-hover:text-white/60">
                  A structured workflow to rapidly validate digital products, set up targeted landing pages, drive initial traffic, and measure conversion metrics.
                </p>

                <div className="flex flex-wrap gap-2.5 mb-8">
                  <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-extrabold uppercase tracking-wider">
                    Hypothesis
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-extrabold uppercase tracking-wider">
                    Traffic Setup
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-extrabold uppercase tracking-wider">
                    Analytics
                  </span>
                </div>
              </div>

              <div className="text-left font-mono border-t border-white/5 pt-4 mt-auto">
                <span className="text-[9px] text-white/35 font-bold uppercase block mb-1">RESOURCES INCLUDED</span>
                <p className="text-[11px] text-white/60">Landing page templates, conversion spreadsheets, and feedback loop automations.</p>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </Section>
  );
};

export default HomeFeaturedBlueprintsSection;
