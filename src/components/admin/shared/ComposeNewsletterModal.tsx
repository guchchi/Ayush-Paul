import React from "react";
import { motion } from "motion/react";
import { X, Mail, Sparkles, Eye, Zap } from "lucide-react";

interface ComposeNewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscribersCount: number;
  newsletterData: { subject: string; content: string };
  setNewsletterData: React.Dispatch<
    React.SetStateAction<{ subject: string; content: string }>
  >;
  isSending: boolean;
  onSend: (campaignId?: string, isTest?: boolean) => void;
}

export const ComposeNewsletterModal: React.FC<ComposeNewsletterModalProps> = ({
  isOpen,
  onClose,
  subscribersCount,
  newsletterData,
  setNewsletterData,
  isSending,
  onSend,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[11000] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 text-left">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#111111] border border-white/10 rounded-[40px] p-12 max-w-4xl w-full space-y-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-brand-primary">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Broadcast Console</h3>
              <p className="text-white/40 text-sm">
                Deploying narrative updates to {subscribersCount} connected innovators
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/20 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/20 ml-1">
              Subject Line
            </label>
            <input
              type="text"
              value={newsletterData.subject}
              onChange={(e) =>
                setNewsletterData({ ...newsletterData, subject: e.target.value })
              }
              placeholder="e.g. Compounding Value: R&D Blueprints Released"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary text-white"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-widest text-white/20 ml-1">
                Newsletter Content (HTML/Markdown supported)
              </label>
              <button className="text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:underline flex items-center gap-1.5 transition-all">
                <Sparkles size={12} /> AI Improve Tone
              </button>
            </div>
            <textarea
              value={newsletterData.content}
              onChange={(e) =>
                setNewsletterData({ ...newsletterData, content: e.target.value })
              }
              placeholder="Write your email payload here..."
              className="w-full h-80 bg-black/40 border border-white/10 rounded-3xl p-8 outline-none focus:border-brand-primary text-white/80 font-mono text-sm resize-none"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-white/5 pt-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">
            Channel: Resend High-Deliverability API
          </p>
          <div className="flex items-center gap-4">
            <button
              disabled={
                isSending || !newsletterData.subject || !newsletterData.content
              }
              onClick={() => onSend(undefined, true)}
              className="px-8 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center gap-3 disabled:opacity-30"
            >
              {isSending ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Eye size={18} />
              )}
              Send Test
            </button>
            <button
              disabled={
                isSending || !newsletterData.subject || !newsletterData.content
              }
              onClick={() => {
                if (
                  confirm(
                    `Are you sure you want to broadcast this newsletter to ${subscribersCount} subscribers?`
                  )
                ) {
                  onSend();
                }
              }}
              className="px-12 py-5 bg-brand-primary text-black font-bold rounded-2xl hover:bg-white disabled:opacity-20 disabled:hover:bg-brand-primary transition-all flex items-center gap-3 shadow-lg shadow-brand-primary/10"
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Dispatching...
                </>
              ) : (
                <>
                  Broadcast Newsletter <Zap size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
