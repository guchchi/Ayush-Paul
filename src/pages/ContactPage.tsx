import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Linkedin, 
  Github, 
  Youtube, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Clock,
  MessageSquare,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Section } from '../components/ui/Section';
import { MagneticButton } from '../components/ui/MagneticButton';
import { VARIANTS, EASING } from '../lib/motion-presets';
import { db, collection, addDoc, serverTimestamp } from '../firebase';
import { cn } from '../lib/utils';

// --- Components ---

const Hero = () => (
  <Section className="pt-32 pb-20 overflow-hidden" glowVariant="hero">
    <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
      <motion.div 
        variants={VARIANTS.fadeUp}
        initial="initial"
        animate="animate"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-[0.3em]"
      >
        <Sparkles size={14} className="animate-pulse" />
        Open to Select Opportunities
      </motion.div>
      
      <motion.h1 
        variants={VARIANTS.fadeUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.1 }}
        className="text-[clamp(3rem,10vw,6rem)] font-extrabold tracking-tighter leading-[0.95] mb-8"
      >
        Let’s Build Something <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-white to-white/40 italic">Meaningful.</span>
      </motion.h1>

      <motion.p 
        variants={VARIANTS.fadeUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.2 }}
        className="text-2xl text-white/40 font-medium leading-relaxed max-w-2xl mx-auto"
      >
        I partner with ambitious builders, founders, and teams solving meaningful problems with technical precision.
      </motion.p>

      <motion.div 
        variants={VARIANTS.fadeUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
      >
        <MagneticButton>
          <button 
            onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-10 py-5 bg-white text-black rounded-[20px] font-bold text-lg flex items-center gap-3 group shadow-2xl hover:scale-105 transition-transform"
          >
            Send Message <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </MagneticButton>
        
        <button 
          onClick={() => window.location.href = "mailto:hello.ayushishere@gmail.com?subject=Discovery%20Call%20Request"}
          className="px-10 py-5 glass-card border-white/10 text-white rounded-[20px] font-bold text-lg hover:bg-white/5 transition-all flex items-center gap-2 group"
        >
          Book Discovery Call <Zap size={20} className="text-brand-primary group-hover:animate-pulse" />
        </button>
      </motion.div>
    </div>
  </Section>
);

const SmartContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    inquiryType: "Startup Collaboration",
    budgetScope: "Strategic Partnership",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "contact_messages"), {
        ...formData,
        timestamp: serverTimestamp()
      });
      setStatus("success");
      setFormData({ 
        name: "", 
        email: "", 
        organization: "", 
        inquiryType: "Startup Collaboration", 
        budgetScope: "Strategic Partnership", 
        message: "" 
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-form" className="max-w-4xl mx-auto px-6 py-20">
      <motion.div
        variants={VARIANTS.scaleUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="glass-card p-8 md:p-16 rounded-[48px] border-white/10 shadow-3xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent opacity-50" />
        
        <form className="space-y-10" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-2">Full Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ayush Paul"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-brand-primary focus:bg-white/[0.05] transition-all text-lg font-medium"
                required
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-2">Email Address</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ayush@gmail.com"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-brand-primary focus:bg-white/[0.05] transition-all text-lg font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-2">Organization / Individual</label>
            <input 
              type="text" 
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              placeholder="e.g. Startup Name or Personal"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-brand-primary focus:bg-white/[0.05] transition-all text-lg font-medium"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-2">Inquiry Type</label>
              <select 
                value={formData.inquiryType}
                onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-brand-primary focus:bg-white/[0.05] transition-all text-lg font-medium appearance-none"
              >
                <option className="bg-[#0A0A0A]">Startup Collaboration</option>
                <option className="bg-[#0A0A0A]">Internship / Opportunity</option>
                <option className="bg-[#0A0A0A]">Project Discussion</option>
                <option className="bg-[#0A0A0A]">Speaking / Community</option>
                <option className="bg-[#0A0A0A]">General Message</option>
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-2">Budget / Scope</label>
              <select 
                value={formData.budgetScope}
                onChange={(e) => setFormData({ ...formData, budgetScope: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-brand-primary focus:bg-white/[0.05] transition-all text-lg font-medium appearance-none"
              >
                <option className="bg-[#0A0A0A]">Strategic Partnership</option>
                <option className="bg-[#0A0A0A]">$5k - $20k</option>
                <option className="bg-[#0A0A0A]">$20k - $50k</option>
                <option className="bg-[#0A0A0A]">$50k+</option>
                <option className="bg-[#0A0A0A]">Founding Member / Equity</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-2">Message</label>
            <textarea 
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Describe your vision, goals, and how we can innovate together..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-6 outline-none focus:border-brand-primary focus:bg-white/[0.05] transition-all h-48 resize-none text-lg font-medium"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-7 bg-white text-black rounded-[24px] font-bold text-xl hover:bg-brand-primary hover:text-white transition-all disabled:opacity-50 shadow-2xl flex items-center justify-center gap-3 relative group overflow-hidden"
          >
            <span className="relative z-10">{isSubmitting ? 'Transmitting...' : 'Send Message'}</span>
            <ArrowRight size={24} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-brand-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>

          <AnimatePresence>
            {status === 'success' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 text-green-400 font-bold bg-green-400/5 py-4 rounded-2xl border border-green-400/20"
              >
                <CheckCircle2 size={24} /> Transmission received. I'll be in touch.
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
};

const DirectConnect = () => {
  const links = [
    { label: "Email", icon: <Mail />, value: "hello.ayushishere@gmail.com", href: "mailto:hello.ayushishere@gmail.com" },
    { label: "LinkedIn", icon: <Linkedin />, value: "paulayush", href: "https://www.linkedin.com/in/paulayush/" },
    { label: "GitHub", icon: <Github />, value: "guchchi", href: "https://github.com/guchchi" },
    { label: "YouTube", icon: <Youtube />, value: "ALX-17", href: "https://www.youtube.com/@ALX-17" },
    { label: "Resume", icon: <FileText />, value: "Download PDF", href: "/resume.pdf" }
  ];

  return (
    <Section className="py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {links.map((link, i) => (
            <motion.a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              variants={VARIANTS.fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 glass-card rounded-[32px] border-white/5 group hover:border-brand-primary/30 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-brand-primary group-hover:bg-brand-primary/10 transition-all">
                  {link.icon}
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">{link.label}</div>
                  <div className="text-lg font-bold text-white/80 group-hover:text-white transition-colors">{link.value}</div>
                </div>
              </div>
              <ChevronRight size={20} className="text-white/10 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
            </motion.a>
          ))}
        </div>
      </div>
    </Section>
  );
};

const TrustSignals = () => {
  const signals = [
    { label: "Response Time", value: "< 24 Hours", icon: <Clock /> },
    { label: "NDA Friendly", value: "Strategic Trust", icon: <ShieldCheck /> },
    { label: "Remote Ready", value: "Global Setup", icon: <Globe /> },
    { label: "Timezone Friendly", value: "Flexible IST/UTC", icon: <MessageSquare /> }
  ];

  return (
    <div className="py-20 bg-white/[0.01] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
        {signals.map((s, i) => (
          <div key={i} className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand-primary border border-white/5">
              {s.icon}
            </div>
            <div className="text-xl font-bold tracking-tight">{s.value}</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FounderStatement = () => (
  <Section className="py-40 text-center">
    <div className="max-w-3xl mx-auto px-6 space-y-8">
      <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-primary">Philosophy</div>
      <h3 className="text-[clamp(2rem,6vw,4rem)] font-extrabold tracking-tighter leading-[0.95]">
        “I collaborate with <span className="text-brand-primary italic">ambitious</span> builders, founders, and teams solving meaningful problems.”
      </h3>
    </div>
  </Section>
);

// --- Main Page ---

export const ContactPage = () => {
  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen">
      <Hero />
      <TrustSignals />
      <SmartContactForm />
      <DirectConnect />
      <FounderStatement />
    </div>
  );
};

export default ContactPage;
