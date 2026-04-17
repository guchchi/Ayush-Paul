import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, ArrowRight, CheckCircle2, Github, Linkedin, Twitter, Zap } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { OperationType } from '../../types';
import { handleFirestoreError } from '../../lib/firebase-utils';
import { Section } from '../ui/Section';
import { MagneticButton } from '../ui/MagneticButton';
import { VARIANTS, EASING, DURATION } from '../../lib/motion-presets';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    try {
      if (!db) throw new Error("Firestore is not initialized");
      
      await addDoc(collection(db, "contacts"), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        timestamp: serverTimestamp()
      });
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, "contacts");
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Section id="contact" glowVariant="hero">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <motion.div
          variants={VARIANTS.staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="space-y-16"
        >
          <div className="space-y-8">
            <motion.div variants={VARIANTS.fadeUp} className="inline-block px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest">
              Connect
            </motion.div>
            <motion.h2 variants={VARIANTS.fadeUp} className="leading-[1.1] tracking-tighter">Ready to <br /><span className="text-brand-primary italic">Collaborate?</span></motion.h2>
            <motion.p variants={VARIANTS.fadeUp} className="text-white/40 text-xl leading-relaxed max-w-md font-medium">
              Have an idea or a project in mind? Reach out and let's discuss how we can build a high-signal solution together.
            </motion.p>
          </div>

          <div className="space-y-8">
            {[
              { label: "Email Me", value: "ayushpaul.ap87@gmail.com", icon: <Mail size={24} />, href: "mailto:ayushpaul.ap87@gmail.com" },
              { label: "Response Promise", value: "Guaranteed within 24 hours", icon: <Zap size={24} />, href: "#" },
              { label: "Location & Status", value: "Remote Friendly • IST (UTC+5:30)", icon: <MapPin size={24} />, href: "#" }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                variants={VARIANTS.fadeUp}
                className="flex items-center gap-8 group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-brand-primary/10 group-hover:text-brand-primary group-hover:border-brand-primary/30 transition-all duration-500">
                  {item.icon}
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-2">{item.label}</div>
                  <div className="text-xl font-bold text-white group-hover:text-brand-primary transition-colors tracking-tight">{item.value}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={VARIANTS.fadeUp} className="pt-16 border-t border-white/5">
             <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-8">Ecosystem & Socials</div>
             <div className="flex gap-6">
                {[
                  { icon: <Github size={24} />, href: "https://github.com/guchchi" },
                  { icon: <Linkedin size={24} />, href: "https://www.linkedin.com/in/paulayush/" },
                  { icon: <Twitter size={24} />, href: "#" }
                ].map((social, i) => (
                  <a 
                    key={i}
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-brand-primary/10 hover:text-brand-primary hover:border-brand-primary/30 transition-all shadow-lg"
                  >
                    {social.icon}
                  </a>
                ))}
             </div>
          </motion.div>
        </motion.div>

        <motion.div
           variants={VARIANTS.scaleUp}
           initial="initial"
           whileInView="animate"
           viewport={{ once: true }}
           className="glass-card p-6 md:p-12 lg:p-20 rounded-[32px] md:rounded-[60px] border border-white/10 shadow-2xl relative w-full max-w-full min-w-0 break-words overflow-hidden"
        >
          
          <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-2">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ayush Paul"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-brand-primary focus:bg-white/[0.05] transition-all text-lg font-medium"
                  required
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-2">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ayush@product.ai"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-brand-primary focus:bg-white/[0.05] transition-all text-lg font-medium"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-2">Objective</label>
              <input 
                type="text" 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Startup Collaboration"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-brand-primary focus:bg-white/[0.05] transition-all text-lg font-medium"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-2">Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your vision..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-6 outline-none focus:border-brand-primary focus:bg-white/[0.05] transition-all h-40 resize-none text-lg font-medium"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-6 bg-white text-black rounded-[24px] font-bold text-xl hover:bg-brand-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl flex items-center justify-center gap-3 relative group"
            >
              <span className="relative z-10">{isSubmitting ? 'Transmitting...' : 'Initiate Contact'}</span>
              <ArrowRight size={24} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            <AnimatePresence>
              {status === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-3 text-green-500 font-bold bg-green-500/5 py-4 rounded-2xl border border-green-500/20"
                >
                  <CheckCircle2 size={24} /> Transmission successful!
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </Section>
  );
};

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      if (!db) throw new Error("Firestore not initialized");
      await addDoc(collection(db, "newsletter"), {
        email,
        subscribedAt: serverTimestamp()
      });
      setStatus('success');
      setEmail("");
    } catch (error) {
      console.error("Newsletter error:", error);
      setStatus('error');
    }
  };

  return (
    <Section glowVariant="side">
      <motion.div 
        variants={VARIANTS.fadeUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="max-w-5xl mx-auto p-8 md:p-16 lg:p-32 rounded-[40px] md:rounded-[80px] glass-card border border-white/10 relative text-center shadow-3xl w-full overflow-hidden"
      >
        {/* Phase 5: Absolute Element Containment */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent shadow-[0_0_15px_rgba(0,194,255,0.4)] z-20" />
        
        <div className="relative z-10 space-y-8 md:y-12 min-w-0">
          <div className="w-24 h-24 rounded-3xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary mx-auto mb-10 shadow-2xl">
            <Mail size={48} className="animate-bounce-slow" />
          </div>
          <h2 className="tracking-tighter leading-none">The <span className="text-brand-primary italic">Inner Circle</span></h2>
          <p className="text-xl md:text-2xl text-white/40 max-w-2xl mx-auto font-medium leading-relaxed">
            Get high-signal insights on AI architecture, product engineering, and robotics research.
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto relative group flex flex-col sm:flex-row gap-4">
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your primary email..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 md:px-10 py-5 md:py-7 outline-none focus:border-brand-primary transition-all text-lg md:text-xl font-medium focus:bg-white/[0.05]"
              required
            />
            <button 
              type="submit"
              disabled={status === 'loading'}
              className="sm:absolute sm:right-3 sm:top-3 sm:bottom-3 px-8 md:px-10 py-5 sm:py-0 bg-white text-black rounded-xl md:rounded-[18px] font-bold text-base md:text-lg hover:bg-brand-primary hover:text-white transition-all disabled:opacity-50 active:scale-95 shadow-xl shrink-0"
            >
              {status === 'loading' ? 'Processing...' : 'Secure Access'}
            </button>
          </form>
          
          <AnimatePresence>
            {status === 'success' && (
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-green-500 font-bold text-lg">Access granted. Welcome to the loop.</motion.p>
            )}
          </AnimatePresence>
          
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Zero Spam. Pure Signal.</p>
        </div>

      </motion.div>
    </Section>
  );
};

export const ContactSection = () => {
  return (
    <>
      <Contact />
      <Newsletter />
    </>
  );
};
