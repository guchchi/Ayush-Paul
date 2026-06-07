import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../components/ui/Section';
import { VARIANTS } from '../lib/motion-presets';
import { useSEO } from '../hooks/useSEO';
import { MagneticButton } from '../components/ui/MagneticButton';

export const TermsPage = () => {
  useSEO({
    title: "Terms of Service | Ayush Paul",
    description: "Terms of service and usage guidelines for Ayush Paul's digital headquarters."
  });

  const date = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const email = "hello.ayushishere@gmail.com";

  const terms = [
    {
      title: "Use of Website",
      desc: "You agree to use this website only for lawful purposes and in a way that does not harm, disrupt, or restrict others' access to our digital ecosystem."
    },
    {
      title: "Intellectual Property",
      desc: "All content, custom designs, proprietary text, graphics, and codebase on this website are owned by Ayush Paul unless otherwise stated. Unauthorized copying, redistribution, or commercial use is strictly prohibited."
    },
    {
      title: "External Links",
      desc: "This website may contain links to external third-party environments. We are not responsible for their operational content, availability, or unique privacy practices."
    },
    {
      title: "Disclaimer",
      desc: "The information provided on this website is for informational and educational purposes only. We make no guarantees regarding the total completeness or real-time accuracy of all data points."
    },
    {
      title: "Limitation of Liability",
      desc: "We are not liable for any direct, indirect, or incidental losses or damages arising from the use of this website or the inability to access our services."
    }
  ];

  return (
    <div className="w-full bg-bg-primary pt-32 pb-24 text-left">
      <Section className="max-w-4xl mx-auto px-6">
        <motion.div
          variants={VARIANTS.staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-16"
        >
          <motion.div variants={VARIANTS.fadeUp} className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-none text-[#0b1c30]">
              Terms of <span className="text-[#424754]/40 italic">Service</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#0058be]">
              Last updated: {date}
            </p>
          </motion.div>

          <motion.div variants={VARIANTS.fadeUp} className="space-y-10">
            <p className="text-xl text-[#424754] leading-relaxed font-semibold italic border-l-2 border-[#0058be]/30 pl-8">
              By accessing this website, you agree to comply with these Terms of Service. If you do not agree, please exit the environment immediately.
            </p>

            <div className="grid gap-8">
              {terms.map((term, i) => (
                <div key={i} className="p-10 bg-white border border-[#c2c6d6]/35 rounded-[32px] space-y-4 group hover:border-[#0058be]/20 hover:shadow-ambient transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-[#0058be] bg-[#eff4ff] border border-[#dce9ff] px-3 py-1 rounded-full uppercase tracking-widest">0{i + 1}</span>
                    <h2 className="text-2xl font-extrabold tracking-tight text-[#0b1c30]">{term.title}</h2>
                  </div>
                  <p className="text-[#424754] leading-relaxed font-semibold pl-12">
                    {term.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#0b1c30]">Changes to Terms</h2>
              <p className="text-[#424754] leading-relaxed font-semibold">
                We reserve the right to update these Terms at any time without prior notice. Continued use of the website following any changes constitutes your acceptance of the revised Terms.
              </p>
            </div>

            <div className="space-y-6 p-8 bg-white border border-[#c2c6d6]/30 rounded-[32px] shadow-sm">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#0b1c30]">Governing Law</h2>
              <p className="text-[#424754] leading-relaxed font-semibold">
                These Terms shall be governed and interpreted in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in India.
              </p>
            </div>

            <div className="pt-12 border-t border-[#c2c6d6]/20">
              <div className="p-10 bg-[#eff4ff]/40 border border-[#c2c6d6]/35 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-extrabold tracking-tight text-[#0b1c30]">Contact & Support</h2>
                  <p className="text-[#424754]/60 text-sm font-semibold">For questions regarding these Terms or legal inquiries.</p>
                </div>
                <MagneticButton>
                  <a 
                    href={`mailto:${email}`} 
                    className="px-12 py-5 bg-[#0b1c30] hover:bg-[#0058be] text-white rounded-full font-bold text-lg hover:scale-105 transition-all shadow-sm block text-center"
                  >
                    {email}
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
