import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../components/ui/Section';
import { VARIANTS } from '../lib/motion-presets';
import { useSEO } from '../hooks/useSEO';
import { ShieldCheck, Info, MousePointer2, Settings } from 'lucide-react';
import { MagneticButton } from '../components/ui/MagneticButton';

export const CookiePage = () => {
  useSEO({
    title: "Cookie Policy | Ayush Paul",
    description: "Detailed information about how cookies are used to enhance your experience on Ayush Paul's platform."
  });

  const date = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const usage = [
    {
      title: "Analyze Traffic",
      desc: "Understanding visitor behavior to optimize system performance.",
      icon: <Info size={20} className="text-[#0058be]" />
    },
    {
      title: "User Preferences",
      desc: "Remembering your custom settings for a personalized experience.",
      icon: <Settings size={20} className="text-[#0058be]" />
    },
    {
      title: "Targeted Advertising",
      desc: "Delivering high-signal, relevant content through trusted partners.",
      icon: <MousePointer2 size={20} className="text-[#0058be]" />
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
              Cookie <span className="text-[#424754]/40 italic">Policy</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#0058be]">
              Last updated: {date}
            </p>
          </motion.div>

          <motion.div variants={VARIANTS.fadeUp} className="space-y-12">
            <p className="text-xl text-[#424754] leading-relaxed font-semibold italic border-l-2 border-[#0058be]/30 pl-8">
              This website uses cookies to enhance user experience, optimize platform performance, and support advertising services.
            </p>

            <div className="p-10 bg-white border border-[#c2c6d6]/35 rounded-[32px] space-y-6 shadow-sm">
               <h2 className="text-2xl font-extrabold tracking-tight text-[#0b1c30] flex items-center gap-3">
                 <ShieldCheck className="text-[#0058be]" /> What Are Cookies?
               </h2>
               <p className="text-[#424754] leading-relaxed font-semibold">
                 Cookies are small text files stored on your device when you visit a website. They act as a digital memory, allowing the platform to recognize your preferences and provide a more efficient browsing experience.
               </p>
            </div>

            <div className="space-y-8">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#0b1c30]">How We Use Cookies</h2>
              <div className="grid md:grid-cols-3 gap-6">
                 {usage.map((item, i) => (
                   <div key={i} className="p-8 bg-white border border-[#c2c6d6]/35 rounded-[32px] shadow-sm space-y-6">
                      <div className="w-12 h-12 rounded-2xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-[#0b1c30] mb-2">{item.title}</h3>
                        <p className="text-xs text-[#424754]/75 leading-relaxed font-semibold">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
            </div>

            <div className="p-10 bg-[#eff4ff]/40 border border-[#c2c6d6]/35 rounded-[32px] space-y-6 shadow-sm">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#0b1c30]">Advertising Cookies</h2>
              <p className="text-[#424754] leading-relaxed font-semibold">
                Third-party vendors, including Google, use cookies to serve ads based on your previous visits to this website or other websites across the Internet. This enables us to display content that is most relevant to your professional interests.
              </p>
              <div className="pt-4">
                <MagneticButton>
                  <a 
                    href="https://www.google.com/settings/ads" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-[#0b1c30] hover:bg-[#0058be] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-sm transition-colors block text-center"
                  >
                    Opt Out of Personalized Ads
                  </a>
                </MagneticButton>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-extrabold tracking-tight text-[#0b1c30]">Managing Cookies</h2>
                <p className="text-[#424754] leading-relaxed font-semibold">
                  You can disable cookies through your individual browser settings. Please note that disabling cookies may cause some features of the platform to function improperly or lose their personalized settings.
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-extrabold tracking-tight text-[#0b1c30]">Consent</h2>
                <p className="text-[#424754] leading-relaxed font-semibold">
                  By continuing to use this website, you explicitly consent to our use of cookies as described in this policy.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Section>
    </div>
  );
};

export default CookiePage;
