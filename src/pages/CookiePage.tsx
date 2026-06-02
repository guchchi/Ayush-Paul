import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../components/ui/Section';
import { VARIANTS } from '../lib/motion-presets';
import { useSEO } from '../hooks/useSEO';
import { ShieldCheck, Info, MousePointer2, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';

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
      icon: <Info size={20} className="text-brand-primary" />
    },
    {
      title: "User Preferences",
      desc: "Remembering your custom settings for a personalized experience.",
      icon: <Settings size={20} className="text-brand-accent" />
    },
    {
      title: "Targeted Advertising",
      desc: "Delivering high-signal, relevant content through trusted partners.",
      icon: <MousePointer2 size={20} className="text-brand-secondary" />
    }
  ];

  return (
    <div className="w-full bg-[#0A0A0A] pt-32 pb-24">
      <Section className="max-w-4xl mx-auto px-6">
        <motion.div
          variants={VARIANTS.staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-16"
        >
          <motion.div variants={VARIANTS.fadeUp} className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-none">
              Cookie <span className="text-white/20 italic">Policy</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-primary">
              Last updated: {date}
            </p>
          </motion.div>

          <motion.div variants={VARIANTS.fadeUp} className="space-y-12">
            <p className="text-xl text-white/60 leading-relaxed font-medium italic border-l-2 border-brand-primary/30 pl-8">
              This website uses cookies to enhance user experience, optimize platform performance, and support advertising services.
            </p>

            <div className="p-10 glass-card border-white/5 bg-white/[0.01] rounded-[40px] space-y-6">
               <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                 <ShieldCheck className="text-brand-primary" /> What Are Cookies?
               </h2>
               <p className="text-white/50 leading-relaxed font-medium">
                 Cookies are small text files stored on your device when you visit a website. They act as a digital memory, allowing the platform to recognize your preferences and provide a more efficient browsing experience.
               </p>
            </div>

            <div className="space-y-8">
              <h2 className="text-2xl font-bold tracking-tight text-white">How We Use Cookies</h2>
              <div className="grid md:grid-cols-3 gap-6">
                 {usage.map((item, i) => (
                   <div key={i} className="p-8 glass-card border-white/5 rounded-3xl space-y-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
            </div>

            <div className="p-10 glass-card border-brand-primary/20 bg-brand-primary/[0.02] rounded-[40px] space-y-6">
              <h2 className="text-2xl font-bold tracking-tight text-white">Advertising Cookies</h2>
              <p className="text-white/50 leading-relaxed">
                Third-party vendors, including Google, use cookies to serve ads based on your previous visits to this website or other websites across the Internet. This enables us to display content that is most relevant to your professional interests.
              </p>
              <div className="pt-4">
                <Button asChild variant="primary" size="sm">
                  <a 
                    href="https://www.google.com/settings/ads" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Opt Out of Personalized Ads
                  </a>
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight text-white">Managing Cookies</h2>
                <p className="text-white/50 leading-relaxed">
                  You can disable cookies through your individual browser settings. Please note that disabling cookies may cause some features of the platform to function improperly or lose their personalized settings.
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight text-white">Consent</h2>
                <p className="text-white/50 leading-relaxed">
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
