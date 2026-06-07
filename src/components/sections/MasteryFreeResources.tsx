import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Download, Play, Compass, ArrowRight, CheckCircle2, FileText, ArrowUpRight } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { db, collection, addDoc, serverTimestamp } from '../../firebase';

interface ResourceItem {
  id: string;
  type: string;
  title: string;
  desc: string;
  ctaText: string;
  icon: any;
  iconColor: string;
  bgColor: string;
  borderColor: string;
}

const FREE_RESOURCES: ResourceItem[] = [
  {
    id: 'free-blueprint-portfolio',
    type: 'Free Blueprint',
    title: 'Developer Portfolio Sitemap',
    desc: 'Download the complete structural sitemap, copy hierarchy checklist, and UI wireframes used to rank on organic search engines.',
    ctaText: 'Download Sitemap',
    icon: Compass,
    iconColor: '#0058be',
    bgColor: '#eff4ff',
    borderColor: '#dce9ff'
  },
  {
    id: 'free-mini-course-ai',
    type: 'Free Mini Course',
    title: 'AI Automation Foundations',
    desc: 'Get immediate access to a 3-part video series outlining webhook routes, prompt architecture, and basic developer automation.',
    ctaText: 'Unlock Course',
    icon: Play,
    iconColor: '#6b35ff',
    bgColor: '#f3efff',
    borderColor: '#ebe5ff'
  },
  {
    id: 'free-guide-cursor',
    type: 'Free Guide',
    title: 'Cursor Setup & Rule Packs',
    desc: 'Configure the Cursor IDE with optimized rule files, context packages, and custom system instructions to increase coding speed.',
    ctaText: 'Read Guide',
    icon: FileText,
    iconColor: '#558b2f',
    bgColor: '#f0fbe8',
    borderColor: '#e1f7d2'
  },
  {
    id: 'free-recording-agent',
    type: 'Free Workshop Recording',
    title: 'Autonomous Scraper Cohort',
    desc: 'Watch the full 90-minute video replay of our live cohort workshop building a contextual research automation agent.',
    ctaText: 'Stream Replay',
    icon: Gift,
    iconColor: '#ff8000',
    bgColor: '#fff4eb',
    borderColor: '#ffe9d6'
  }
];

export const MasteryFreeResources = () => {
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !selectedResource) {
      setError('Please provide a valid email address.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await addDoc(collection(db, 'workshop_registrations'), {
        email,
        resourceId: selectedResource.id,
        resourceTitle: selectedResource.title,
        source: 'free_resource_unlock',
        registeredAt: serverTimestamp(),
        status: 'unlocked'
      });

      setSuccess(true);
      setEmail('');
      
      // Simulate file download trigger or redirection link for specific items
      if (selectedResource.id === 'free-blueprint-portfolio') {
        setTimeout(() => {
          window.open('https://ayushpaul.in/sitemap-blueprint-demo.pdf', '_blank');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to unlock resource. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#c2c6d6]/20 scroll-mt-24"
      id="free-resources-section"
    >
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end mb-16 text-left">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c2c6d6]/35 text-[10px] font-bold uppercase tracking-widest text-[#558b2f] shadow-sm mb-6"
          >
            <span className="w-1.5 h-1.5 bg-[#558b2f] rounded-full animate-pulse" />
            <span className="tracking-[0.22em]">Free Entry</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]"
          >
            Free Resources
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#424754] text-base leading-relaxed font-medium"
        >
          Not ready to commit to a paid course or live workshop? Start building immediately with our high-leverage free assets and training guides.
        </motion.p>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {FREE_RESOURCES.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group bg-white border border-[#c2c6d6]/30 rounded-[28px] p-6 shadow-sm hover:shadow-ambient hover:scale-[1.01] hover:border-[#0058be]/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header tag */}
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[8.5px] font-extrabold uppercase tracking-widest text-[#424754]/60 bg-bg-secondary border border-[#c2c6d6]/20 px-2.5 py-0.5 rounded-full">
                    {item.type}
                  </span>
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center border shadow-sm shrink-0"
                    style={{ backgroundColor: item.bgColor, borderColor: item.borderColor, color: item.iconColor }}
                  >
                    <Icon size={14} />
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-[#0b1c30] tracking-tight leading-snug mb-2 group-hover:text-[#0058be] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#424754] leading-relaxed font-semibold mb-6">
                  {item.desc}
                </p>
              </div>

              {/* Action Link */}
              <button
                onClick={() => {
                  setSelectedResource(item);
                  setSuccess(false);
                  setError('');
                }}
                className="w-full mt-auto pt-4 border-t border-[#c2c6d6]/10 text-[9px] font-extrabold uppercase tracking-widest text-[#0058be] hover:text-[#004bb0] text-left transition-colors flex items-center justify-between cursor-pointer border-none bg-transparent"
              >
                <span>{item.ctaText}</span>
                <ArrowRight size={10} className="transform group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Unlock intake modal */}
      <AnimatePresence>
        {selectedResource && (
          <div className="fixed inset-0 bg-[#0b1c30]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="bg-white border border-[#c2c6d6]/35 rounded-[32px] p-8 max-w-sm w-full relative shadow-xl text-left"
            >
              <button
                onClick={() => setSelectedResource(null)}
                className="absolute top-6 right-6 text-[#424754]/60 hover:text-black cursor-pointer border-none bg-transparent font-extrabold text-sm"
              >
                ✕
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Gift size={16} className="text-[#558b2f]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#424754]/70">Free Asset Unlock</span>
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-[#0b1c30] tracking-tight mb-1">{selectedResource.title}</h3>
                  <p className="text-xs text-[#424754] font-semibold leading-relaxed">
                    We will send the download file and link directly to your inbox.
                  </p>
                </div>

                {success ? (
                  <div className="p-4 bg-[#e1f7d2] border border-[#c0e8a7] text-[#33691e] rounded-2xl space-y-2 text-xs font-bold animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      <span>Access Unlocked!</span>
                    </div>
                    <p className="font-semibold text-[#33691e]/80 text-[10px] leading-relaxed">
                      We have sent the asset link to your email. Check your spam or promotions tab if it does not appear in 2 minutes.
                    </p>
                    <button
                      onClick={() => setSelectedResource(null)}
                      className="mt-2 w-full py-2 bg-[#33691e] hover:bg-[#2e5c1b] text-white rounded-full font-bold text-[9px] uppercase tracking-widest transition-colors cursor-pointer border-none"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleUnlockSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-[#424754] block">Email Address</label>
                      <input
                        type="email"
                        placeholder="you@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        className="w-full px-4 py-2.5 text-xs bg-bg-secondary border border-[#c2c6d6]/40 rounded-full focus:outline-none focus:border-[#558b2f] text-[#0b1c30] font-semibold"
                      />
                    </div>

                    {error && <p className="text-[9px] font-bold text-red-600">{error}</p>}

                    <div className="pt-2 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedResource(null)}
                        className="flex-1 py-3 border border-[#c2c6d6]/30 text-[#424754] hover:bg-gray-50 rounded-full font-bold text-[9px] uppercase tracking-widest transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 bg-[#0b1c30] hover:bg-[#558b2f] text-white rounded-full font-bold text-[9px] uppercase tracking-widest transition-colors disabled:opacity-50 cursor-pointer shadow-md"
                      >
                        {loading ? 'Processing...' : 'Get Free Access'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
