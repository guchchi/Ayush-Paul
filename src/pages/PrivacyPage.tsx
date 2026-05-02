import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../components/ui/Section';
import { VARIANTS } from '../lib/motion-presets';
import { useSEO } from '../hooks/useSEO';

export const PrivacyPage = () => {
  useSEO({
    title: "Privacy Policy | Ayush Paul",
    description: "Privacy policy and data protection information for Ayush Paul's digital headquarters."
  });

  const date = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="w-full bg-[#0A0A0A] pt-32 pb-24">
      <Section className="max-w-4xl mx-auto px-6">
        <motion.div
          variants={VARIANTS.staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-12"
        >
          <motion.div variants={VARIANTS.fadeUp} className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-none">
              Privacy <span className="text-white/20 italic">Policy</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-primary">
              Last updated: {date}
            </p>
          </motion.div>

          <motion.div variants={VARIANTS.fadeUp} className="prose prose-invert prose-brand max-w-none space-y-10">
            <p className="text-xl text-white/60 leading-relaxed font-medium italic border-l-2 border-brand-primary/30 pl-8">
              This Privacy Policy describes how information is collected, used, and protected when you visit this website.
            </p>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight text-white">Information We Collect</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="glass-card p-8 rounded-3xl border-white/5 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Non-Personal Data</h3>
                  <ul className="space-y-2 text-white/60 font-medium">
                    <li>• Browser type</li>
                    <li>• Device information</li>
                    <li>• Pages visited</li>
                    <li>• Time spent on pages</li>
                    <li>• IP address (anonymized)</li>
                  </ul>
                </div>
                <div className="glass-card p-8 rounded-3xl border-white/5 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Personal Data (Forms)</h3>
                  <ul className="space-y-2 text-white/60 font-medium">
                    <li>• Name</li>
                    <li>• Email address</li>
                    <li>• Message content</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-white">Cookies</h2>
              <p className="text-white/50 leading-relaxed">
                This website uses cookies to improve user experience and analyze website performance. Cookies help us understand visitor behavior, improve content, and deliver relevant advertisements. You can disable cookies through your browser settings.
              </p>
            </div>

            <div className="space-y-4 p-8 glass-card border-brand-primary/20 bg-brand-primary/[0.02] rounded-3xl">
              <h2 className="text-2xl font-bold tracking-tight text-white">Google AdSense</h2>
              <p className="text-white/50 leading-relaxed">
                We use Google AdSense to display advertisements. Google may use cookies and web beacons to serve ads based on users’ previous visits to this or other websites. Google’s use of advertising cookies enables it and its partners to serve ads based on your visit to this site and/or other sites on the Internet.
              </p>
              <p className="text-sm font-bold text-brand-primary pt-4">
                Users may opt out of personalized advertising by visiting: <br />
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">google.com/settings/ads</a>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight text-white">Third-Party Services</h2>
                <p className="text-white/50 leading-relaxed">
                  We may use trusted third-party tools such as analytics providers, hosting services, and advertising partners. These services may collect information according to their own privacy policies.
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight text-white">Data Protection</h2>
                <p className="text-white/50 leading-relaxed">
                  We take reasonable steps to protect user information from unauthorized access or misuse using industry-standard encryption and security protocols.
                </p>
              </div>
            </div>

            <div className="pt-12 border-t border-white/5 space-y-6">
              <div className="flex flex-wrap gap-12">
                <div className="space-y-2">
                   <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30">Children’s Information</h4>
                   <p className="text-sm text-white/60">This website does not knowingly collect personal information from children under 13.</p>
                </div>
                <div className="space-y-2">
                   <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30">Consent</h4>
                   <p className="text-sm text-white/60">By using our website, you consent to this Privacy Policy.</p>
                </div>
              </div>
              
              <div className="p-8 glass-card border-white/5 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">Contact</h2>
                  <p className="text-white/40 text-sm">If you have any questions regarding this policy, contact us directly.</p>
                </div>
                <a 
                  href="mailto:hello.ayushishere@gmail.com" 
                  className="px-10 py-4 bg-white text-black rounded-full font-bold text-sm hover:scale-105 transition-transform"
                >
                  hello.ayushishere@gmail.com
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Section>
    </div>
  );
};
