import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../components/ui/Section';
import { VARIANTS } from '../lib/motion-presets';
import { useSEO } from '../hooks/useSEO';
import { MagneticButton } from '../components/ui/MagneticButton';

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
    <div className="w-full bg-bg-primary pt-32 pb-24 text-left">
      <Section className="max-w-4xl mx-auto px-6">
        <motion.div
          variants={VARIANTS.staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-12"
        >
          <motion.div variants={VARIANTS.fadeUp} className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-none text-[#0b1c30]">
              Privacy <span className="text-[#424754]/40 italic">Policy</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#0058be]">
              Last updated: {date}
            </p>
          </motion.div>

          <motion.div variants={VARIANTS.fadeUp} className="prose prose-slate max-w-none space-y-10">
            <p className="text-xl text-[#424754] leading-relaxed font-semibold italic border-l-2 border-[#0058be]/30 pl-8">
              This Privacy Policy describes how information is collected, used, and protected when you visit this website.
            </p>

            <div className="space-y-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#0b1c30]">Information We Collect</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[32px] border border-[#c2c6d6]/35 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#424754]/60">Non-Personal Data</h3>
                  <ul className="space-y-2 text-[#424754] font-semibold">
                    <li>• Browser type</li>
                    <li>• Device information</li>
                    <li>• Pages visited</li>
                    <li>• Time spent on pages</li>
                    <li>• IP address (anonymized)</li>
                  </ul>
                </div>
                <div className="bg-white p-8 rounded-[32px] border border-[#c2c6d6]/35 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#424754]/60">Personal Data (Forms)</h3>
                  <ul className="space-y-2 text-[#424754] font-semibold">
                    <li>• Name</li>
                    <li>• Email address</li>
                    <li>• Message content</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#0b1c30]">Cookies</h2>
              <p className="text-[#424754] leading-relaxed font-semibold">
                This website uses cookies to improve user experience and analyze website performance. Cookies help us understand visitor behavior, improve content, and deliver relevant advertisements. You can disable cookies through your browser settings.
              </p>
            </div>

            <div className="space-y-4 p-8 bg-[#eff4ff]/40 border border-[#c2c6d6]/35 rounded-[32px] shadow-sm">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#0b1c30]">Google AdSense</h2>
              <p className="text-[#424754] leading-relaxed font-semibold">
                We use Google AdSense to display advertisements. Google may use cookies and web beacons to serve ads based on users’ previous visits to this or other websites. Google’s use of advertising cookies enables it and its partners to serve ads based on your visit to this site and/or other sites on the Internet.
              </p>
              <p className="text-sm font-bold text-[#0058be] pt-4 leading-relaxed">
                Users may opt out of personalized advertising by visiting: <br />
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#004bb0] transition-colors">google.com/settings/ads</a>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-extrabold tracking-tight text-[#0b1c30]">Third-Party Services</h2>
                <p className="text-[#424754] leading-relaxed font-semibold">
                  We may use trusted third-party tools such as analytics providers, hosting services, and advertising partners. These services may collect information according to their own privacy policies.
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-extrabold tracking-tight text-[#0b1c30]">Data Protection</h2>
                <p className="text-[#424754] leading-relaxed font-semibold">
                  We take reasonable steps to protect user information from unauthorized access or misuse using industry-standard encryption and security protocols.
                </p>
              </div>
            </div>

            <div className="space-y-6 p-8 bg-white border border-[#c2c6d6]/35 rounded-[32px] shadow-sm">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#0b1c30]">Your Data Rights</h2>
              <p className="text-[#424754] leading-relaxed font-semibold">
                Depending on your location, you may have the right to:
              </p>
              <ul className="grid md:grid-cols-2 gap-4 text-xs text-[#424754] font-semibold leading-relaxed">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0058be]" /> Access the personal data we hold about you</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0058be]" /> Request correction of inaccurate information</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0058be]" /> Request deletion of your data</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0058be]" /> Restrict or object to data processing</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0058be]" /> Request data portability</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0058be]" /> Withdraw consent at any time</li>
              </ul>
              <p className="text-xs text-[#424754]/60 pt-4 font-semibold">
                To exercise these rights, please contact us at: <span className="text-[#0058be] font-bold">hello.ayushishere@gmail.com</span>
              </p>
            </div>

            <div className="pt-12 border-t border-[#c2c6d6]/20 space-y-6">
              <div className="flex flex-wrap gap-12">
                <div className="space-y-2">
                   <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/60">Children’s Information</h4>
                   <p className="text-sm text-[#424754] font-semibold">This website does not knowingly collect personal information from children under 13.</p>
                </div>
                <div className="space-y-2">
                   <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/60">Consent</h4>
                   <p className="text-sm text-[#424754] font-semibold">By using our website, you consent to this Privacy Policy.</p>
                </div>
              </div>
              
              <div className="p-8 bg-[#eff4ff]/40 border border-[#c2c6d6]/35 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-[#0b1c30]">Contact</h2>
                  <p className="text-[#424754]/60 text-sm font-semibold">If you have any questions regarding this policy, contact us directly.</p>
                </div>
                <MagneticButton>
                  <a 
                    href="mailto:hello.ayushishere@gmail.com" 
                    className="px-10 py-4 bg-[#0b1c30] hover:bg-[#0058be] text-white rounded-full font-bold text-xs uppercase tracking-wider block text-center"
                  >
                    hello.ayushishere@gmail.com
                  </a>
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Section>
    </div>
  );
};
